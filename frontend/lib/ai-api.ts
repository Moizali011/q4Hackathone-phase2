// AI API client for the Phase-3 AI chatbot
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8001';

interface ChatRequest {
  user_id: string;
  message: string;
  conversation_id?: string;
}

interface ChatResponse {
  conversation_id: string;
  response: string;
  tool_calls?: Array<{
    name: string;
    arguments: Record<string, any>;
    result: any;
  }>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class AiApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AI_API_BASE_URL;
  }

  private getAuthHeaders(): { [key: string]: string } {
    let token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    // Clean up invalid token values
    if (token === 'undefined' || token === 'null' || token === 'NaN' || token === '') {
      token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }

    // Check if token is expired (if we can decode it)
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            // Token is expired
            console.log('AI API: Token expired, removing from localStorage');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
            }
            token = null;
          }
        }
      } catch (e) {
        // If we can't decode the token, remove it
        console.error('AI API: Error decoding token, removing from localStorage', e);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        token = null;
      }
    }

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = `${this.baseUrl}/api/${request.user_id}/chat`;
    const headers = this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: JSON.stringify({
          user_id: request.user_id,
          message: request.message,
          conversation_id: request.conversation_id
        }),
      });

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          console.log('AI API: Unauthorized error - removing token');
          localStorage.removeItem('access_token');
        }
        const errorText = await response.text().catch(() => 'Unauthorized');
        let errorMessage = 'Unauthorized';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || 'Unauthorized';
        } catch {
          errorMessage = errorText || 'Unauthorized';
        }
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        // Attempt to parse error response
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If response is not JSON, create a generic error
          errorData = { detail: `HTTP error! status: ${response.status}` };
        }

        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors and other fetch-related errors
      if (error instanceof TypeError || (error instanceof Error &&
          (error.message.includes('fetch') ||
           error.message.toLowerCase().includes('network') ||
           error.message.includes('Failed to fetch') ||
           error.message.includes('load') ||
           error.message.includes('ECONNREFUSED') ||
           error.message.includes('ENOTFOUND')))) {
        // This typically indicates a network error (server unreachable, DNS issue, etc.)
        console.error(`AI API: Network error attempting to reach: ${url}`, error);
        throw new Error('Network error - please check your connection and ensure the AI server is running');
      }
      // Re-throw other errors as-is
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('AI API: Health check failed:', error);
      return false;
    }
  }
}

export const aiApiClient = new AiApiClient();