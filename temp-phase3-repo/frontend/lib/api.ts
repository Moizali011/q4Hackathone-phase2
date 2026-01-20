// API client with JWT headers
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
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
            console.log('Token expired, removing from localStorage');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
            }
            token = null;
          }
        }
      } catch (e) {
        // If we can't decode the token, remove it
        console.error('Error decoding token, removing from localStorage', e);
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


  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getAuthHeaders();

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // If the response is 401, redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          console.log('Unauthorized error - removing token and redirecting to auth');
          localStorage.removeItem('access_token');
          localStorage.removeItem('tasks'); // Also clear tasks on unauthorized

          // Check if we're already on the auth page to prevent infinite redirects
          if (window.location.pathname !== '/auth' && window.location.pathname !== '/api/auth/login') {
            // Try to use Next.js router if available, otherwise use window.location
            if (typeof window !== 'undefined' && 'location' in window) {
              window.location.href = '/auth';
            }
          }
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
        // For DELETE operations, return success even if response is empty
        if (config.method === 'DELETE' && response.status === 204) {
          return { success: true } as T;
        }

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

      // Some endpoints might not return JSON (like DELETE)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // For successful DELETE requests, return a success object
        if (config.method === 'DELETE') {
          return { success: true } as T;
        }
        return {} as T;
      }
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
        console.error(`Network error attempting to reach: ${url}`, error);
        throw new Error('Network error - please check your connection and ensure the server is running');
      }
      // Re-throw other errors as-is
      throw error;
    }
  }


  // Auth methods
  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return this.request('/api/tasks');
  }

  async createTask(task: { title: string; description?: string }): Promise<Task> {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, task: { title?: string; description?: string; completed?: boolean }): Promise<Task> {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTask(id: string): Promise<Task> {
    return this.request(`/api/tasks/${id}`);
  }

  // OAuth methods
  async getGoogleAuthUrl(): Promise<{ auth_url: string }> {
    return this.request('/api/auth/oauth/google/login');
  }

  async getGithubAuthUrl(): Promise<{ auth_url: string }> {
    return this.request('/api/auth/oauth/github/login');
  }

  // Method to manually check server connectivity
  async checkServerStatus(): Promise<boolean> {
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
      console.error('Server connectivity check failed:', error);
      return false;
    }
  }

  // Diagnostic method to help troubleshoot connection issues
  async diagnoseConnection(): Promise<{baseUrl: string, healthCheck: boolean, error?: string}> {
    try {
      const healthCheck = await this.checkServerStatus();
      return {
        baseUrl: this.baseUrl,
        healthCheck,
        error: healthCheck ? undefined : 'Health check failed - server may be down or unreachable'
      };
    } catch (error) {
      return {
        baseUrl: this.baseUrl,
        healthCheck: false,
        error: error instanceof Error ? error.message : 'Unknown error during diagnosis'
      };
    }
  }
}

export const apiClient = new ApiClient();