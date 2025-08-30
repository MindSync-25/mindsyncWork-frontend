import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type { User } from '../types/api';

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  timezone?: string;
  workspaceType?: string;
  profilePicture?: string;
  // Organization-specific fields
  jobTitle?: string;
  department?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: User;
  message?: string;
}

export class UserService {
  // Get current user profile
  static async getProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>(
      API_CONFIG.ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: UpdateUserProfileRequest): Promise<UserProfileResponse> {
    const response = await apiClient.put<UserProfileResponse>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );
    return response.data;
  }

  // Upload profile avatar
  static async uploadAvatar(file: File): Promise<UserProfileResponse> {
    const response = await apiClient.uploadFile<UserProfileResponse>(
      API_CONFIG.ENDPOINTS.USERS.UPLOAD_AVATAR,
      file
    );
    return response.data;
  }

  // Change password
  static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD,
      data
    );
    return response.data;
  }
}

export default UserService;
