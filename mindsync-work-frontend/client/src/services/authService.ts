import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
  Company,
} from '../types/api';

export class AuthService {
  // Register new company and user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Set token on successful registration
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      
      // Store refresh token
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Set token on successful login
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      
      // Store refresh token
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  // Get current user info
  static async getCurrentUser(): Promise<{ user: User; company: Company }> {
    const response = await apiClient.get<{ user: User; company: Company }>(
      API_CONFIG.ENDPOINTS.AUTH.ME
    );
    
    return response.data;
  }

  // Logout user
  static async logout(): Promise<void> {
    // Clear tokens
    apiClient.removeAuthToken();
    
    // Clear all auth-related data from localStorage
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('company_data');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  // Refresh token
  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    // Update tokens
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
    }
    
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<{ success: boolean; data: User; message: string }>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data.data;
  }

  // Get user profile
  static async getUserProfile(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: User; message: string }>(
      API_CONFIG.ENDPOINTS.USERS.PROFILE
    );
    return response.data.data;
  }
}

export default AuthService;
