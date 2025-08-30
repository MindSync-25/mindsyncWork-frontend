import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api';
import type { ApiResponse, ApiError } from '../types/api';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await this.handleTokenExpiry();
        }
        return Promise.reject(this.formatError(error));
      }
    );

    // Load token from localStorage on initialization
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.setAuthToken(token);
    }
  }

  private saveTokenToStorage(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeTokenFromStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
    this.saveTokenToStorage(token);
  }

  public removeAuthToken(): void {
    this.authToken = null;
    this.removeTokenFromStorage();
  }

  private async handleTokenExpiry(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      try {
        const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
          refreshToken,
        });
        
        const { token } = response.data.data;
        this.setAuthToken(token);
      } catch (error) {
        // Refresh failed, redirect to login
        this.removeAuthToken();
        window.location.href = '/login';
      }
    } else {
      // No refresh token, redirect to login
      this.removeAuthToken();
      window.location.href = '/login';
    }
  }

  private formatError(error: AxiosError<ApiError>): ApiError {
    console.log('Raw axios error:', error);
    console.log('Error response:', error.response);
    console.log('Error response data:', error.response?.data);
    
    if (error.response?.data) {
      return error.response.data;
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error occurred',
        details: { status: error.response?.status },
      },
      timestamp: new Date().toISOString(),
    };
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }

  public async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  // Utility method for file uploads
  public async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/actuator/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get current auth status
  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // Get raw axios instance for custom requests
  public getRawClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
