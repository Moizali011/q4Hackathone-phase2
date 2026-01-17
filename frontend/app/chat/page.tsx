'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { aiApiClient } from '@/lib/ai-api';
import Header from '@/components/layout/Header';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token || token === 'undefined' || token === 'null' || token === '') {
      console.log('No valid token found, redirecting to auth');
      router.push('/auth');
    } else {
      // Verify token is valid by checking if it has proper format
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format, redirecting to auth');
        router.push('/auth');
      } else {
        // Try to decode the payload to check if it contains user_id
        try {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const tokenPayload = JSON.parse(jsonPayload);

          // Store user_id in localStorage if not already there
          if (tokenPayload.user_id) {
            localStorage.setItem('user_id', tokenPayload.user_id);
          }
        } catch (e) {
          console.error('Error parsing token payload:', e);
          router.push('/auth');
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/auth');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Get user ID from localStorage (temporary workaround)
    let user_id = localStorage.getItem('user_id');

    // If no user_id found, try to extract from token
    if (!user_id) {
      const token = localStorage.getItem('access_token');
      if (!token || token === 'undefined' || token === 'null' || token === '') {
        console.error('No valid token found when sending message');
        const errorMessage: Message = {
          id: `auth-error-${Date.now()}`,
          role: 'assistant',
          content: "Authentication error. Please log in again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Properly decode the JWT token to extract user ID
      const decodeToken = (token: string) => {
        try {
          // Check if token has valid JWT format (3 parts separated by dots)
          const parts = token.split('.');
          if (parts.length !== 3) {
            console.error('Invalid JWT format');
            return null;
          }

          const base64Url = parts[1]; // Payload is the second part
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

          // Check if base64 string is valid
          if (base64.length === 0) {
            console.error('Invalid JWT payload');
            return null;
          }

          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );

          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error('Error decoding token:', error);
          console.error('Problematic token (first 50 chars):', token.substring(0, 50));
          return null;
        }
      };

      let tokenPayload;
      try {
        tokenPayload = decodeToken(token);
      } catch (error) {
        console.error('Critical error decoding token:', error);
        const errorMessage: Message = {
          id: `auth-error-${Date.now()}`,
          role: 'assistant',
          content: "Authentication error. Please log in again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      if (!tokenPayload || (!tokenPayload.user_id && !tokenPayload.sub)) {
        console.error('Invalid token payload:', tokenPayload);
        const errorMessage: Message = {
          id: `auth-error-${Date.now()}`,
          role: 'assistant',
          content: "Authentication error. Please log in again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      // Use sub as user_id if user_id doesn't exist (common in JWT tokens)
      user_id = tokenPayload.user_id || tokenPayload.sub;
      // Store user_id in localStorage for future use
      localStorage.setItem('user_id', user_id);
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to AI:', { user_id, message: input, conversation_id: conversationId || undefined });

      const data = await aiApiClient.chat({
        user_id: user_id!,
        message: input,
        conversation_id: conversationId || undefined
      });

      console.log('Received response from AI:', data);

      // Update conversation ID
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      // Process any tool calls from the AI response
      if (data.tool_calls && data.tool_calls.length > 0) {
        console.log('Processing tool calls:', data.tool_calls);
        for (const toolCall of data.tool_calls) {
          if (toolCall.name === 'create_task' && toolCall.result) {
            // The AI agent has created a task, display a confirmation message
            const taskConfirmationMessage: Message = {
              id: `confirmation-${Date.now()}`,
              role: 'assistant',
              content: `I've created the task: "${toolCall.result.title}"${toolCall.result.description ? ` - ${toolCall.result.description}` : ''}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, taskConfirmationMessage]);
          }
        }
      }

      // Add assistant message (or use the response from tool call if available)
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('Error sending message:', error);

      // Provide more specific error message based on error type
      let errorMessageText = "Sorry, I encountered an issue processing your request. Could you try again?";

      if (error.message?.includes('Network error')) {
        errorMessageText = "Unable to connect to the AI service. Please check if the AI backend is running on port 8001.";
      } else if (error.message?.includes('401') || error.message?.toLowerCase().includes('unauthorized')) {
        errorMessageText = "Authentication error. Please log in again.";
        // Optionally redirect to auth page for 401 errors
        if (error.message?.includes('401')) {
          setTimeout(() => router.push('/auth'), 2000);
        }
      } else if (error.message) {
        errorMessageText = `Error: ${error.message}`;
      }

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errorMessageText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header title="AI Task Assistant" onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI Task Assistant
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your tasks with natural language
            </p>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl font-bold mb-4">
                  🤖
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-2">Welcome to AI Task Assistant!</h3>
                <p className="text-slate-400">
                  I can help you manage your tasks. Tell me what you'd like to do.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-slate-700 text-slate-100">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400 mr-2"></div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-6 border-t border-slate-700">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to manage your tasks..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading && input.trim()) {
                      handleSubmit(e as unknown as React.FormEvent);
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!isLoading && input.trim()) {
                    const formEvent = { preventDefault: () => {} } as React.FormEvent;
                    handleSubmit(formEvent);
                  }
                }}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Send
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              {conversationId ? `Conversation: ${conversationId.substring(0, 8)}...` : 'New conversation'}
            </div>
          </div>
        </div>

        {/* Quick Actions - Removed per user request to only allow explicitly created tasks */}
      </div>
    </div>
  );
}