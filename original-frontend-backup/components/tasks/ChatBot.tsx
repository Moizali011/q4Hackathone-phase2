'use client';

import { useState, useRef, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatBotProps {
  tasks: Task[];
  onAddTask: (taskData: { title: string; description?: string }) => void;
  onUpdateTask: (taskId: string, currentStatus: boolean, callback?: () => void) => void;
  onDeleteTask: (taskId: string) => void;
}

const ChatBot = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot'; timestamp: Date }[]>([
    { text: "Hello! I'm your task bot. Please tell me what you'd like to do.", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, sender, timestamp: new Date() }]);
  };

  const processCommand = (command: string) => {
    const lowerCmd = command.toLowerCase().trim();

    // Check for add task commands
    if (lowerCmd.includes('add') || lowerCmd.includes('create') || lowerCmd.includes('new task') ||
        lowerCmd.includes('make task') || lowerCmd.includes('put task')) {

      // Extract the task title after the command words
      const titleMatch = command.match(/(?:add|create|new task|make task|put task)\s+(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : command.replace(/(?:add|create|new task|make task|put task)\s*/i, '').trim();

      if (title) {
        onAddTask({ title, description: '' });
        addMessage(`Task "${title}" added successfully!`, 'bot');
      } else {
        addMessage("Please tell me what task you want to add.", 'bot');
      }
      return;
    }

    // Check for delete task commands
    if (lowerCmd.includes('delete') || lowerCmd.includes('remove') || lowerCmd.includes('delete task') ||
        lowerCmd.includes('remove task') || lowerCmd.includes('kill task')) {

      // Extract the task title after the command words
      const titleMatch = command.match(/(?:delete|remove|delete task|remove task|kill task)\s+(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : command.replace(/(?:delete|remove|delete task|remove task|kill task)\s*/i, '').trim();

      if (title) {
        // Find task by exact title match first, then partial match
        const taskToDelete = tasks.find(task =>
          task.title.toLowerCase().trim() === title.toLowerCase().trim()
        ) || tasks.find(task =>
          task.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(task.title.toLowerCase())
        );

        if (taskToDelete) {
          onDeleteTask(taskToDelete.id);
          addMessage(`Task "${taskToDelete.title}" deleted successfully!`, 'bot');
        } else {
          addMessage(`No task "${title}" found.`, 'bot');
        }
      } else {
        addMessage("Please tell me which task you want to delete.", 'bot');
      }
      return;
    }

    // Check for complete task commands
    if (lowerCmd.includes('complete') || lowerCmd.includes('done') || lowerCmd.includes('mark as done') ||
        lowerCmd.includes('finish') || lowerCmd.includes('completed') || lowerCmd.includes('tick')) {

      // Extract the task title after the command words
      const titleMatch = command.match(/(?:complete|done|mark as done|finish|completed|tick)\s+(.+)/i);
      const title = titleMatch ? titleMatch[1].trim() : command.replace(/(?:complete|done|mark as done|finish|completed|tick)\s*/i, '').trim();

      if (title) {
        // Find task by exact title match first, then partial match
        const taskToComplete = tasks.find(task =>
          task.title.toLowerCase().trim() === title.toLowerCase().trim()
        ) || tasks.find(task =>
          task.title.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(task.title.toLowerCase())
        );

        if (taskToComplete && !taskToComplete.completed) {
          onUpdateTask(taskToComplete.id, taskToComplete.completed);
          addMessage(`Task "${taskToComplete.title}" marked as completed!`, 'bot');
        } else if (taskToComplete && taskToComplete.completed) {
          addMessage(`Task "${taskToComplete.title}" is already completed.`, 'bot');
        } else {
          addMessage(`No task "${title}" found.`, 'bot');
        }
      } else {
        addMessage("Please tell me which task you want to mark as completed.", 'bot');
      }
      return;
    }

    // Check for show tasks commands
    if (lowerCmd.includes('show') || lowerCmd.includes('list') || lowerCmd.includes('display') ||
        lowerCmd.includes('see tasks') || lowerCmd.includes('my tasks') || lowerCmd.includes('what')) {
      if (tasks.length === 0) {
        addMessage("You don't have any tasks.", 'bot');
      } else {
        const taskList = tasks.map(task => `- ${task.title} (${task.completed ? 'Completed' : 'Pending'})`).join('\n');
        addMessage(`Your tasks:\n${taskList}`, 'bot');
      }
      return;
    }

    // Check for greetings
    if (lowerCmd.includes('hello') || lowerCmd.includes('hi') || lowerCmd.includes('hey') || lowerCmd.includes('hai')) {
      addMessage("Hi there! How can I help you with your tasks today?", 'bot');
      return;
    }

    // Default response
    addMessage("I didn't understand your command. Please say: 'add task', 'delete task', 'complete task', or 'show tasks'", 'bot');
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    addMessage(inputValue, 'user');

    setIsTyping(true);
    setTimeout(() => {
      processCommand(inputValue);
      setIsTyping(false);
    }, 500);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-xl w-80 h-96 flex flex-col border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Task Bot</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setMessages([{ text: "Hello! I'm your task bot. Please tell me what you'd like to do.", sender: 'bot', timestamp: new Date() }])}
                  className="text-white hover:text-gray-200 focus:outline-none text-sm"
                  title="Clear chat history"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-tr-none'
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mb-3 text-left">
                <div className="inline-block p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add, delete, complete tasks..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBot;