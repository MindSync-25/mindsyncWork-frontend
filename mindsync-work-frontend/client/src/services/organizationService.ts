import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';

export interface CreateOrganizationRequest {
  name: string;                // Changed from companyName to match backend
  companySize?: string;
  industry?: string;
  website?: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;               // Changed from companyName to match backend
  companySize?: string;
  industry?: string;
  website?: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;                // Backend uses 'name' instead of 'companyName'
  companySize?: string;
  industry?: string;
  website?: string;
  description?: string;
  companyType?: string;        // Backend includes this
  companyLogo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationResponse {
  success: boolean;
  data: Organization;
  message?: string;
}

export interface OrganizationListResponse {
  success: boolean;
  data: Organization[];
  message?: string;
}

export class OrganizationService {
  // Create new organization
  static async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    console.log('Creating organization with data:', data);
    console.log('Using endpoint:', API_CONFIG.ENDPOINTS.ORGANIZATIONS.CREATE);
    
    const response = await apiClient.post<Organization>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.CREATE,
      data
    );
    console.log('Organization creation response:', response);
    // Return the response directly since backend returns organization object directly
    return response.data;
  }

  // Get organization by ID
  static async getOrganization(id: string): Promise<OrganizationResponse> {
    const response = await apiClient.get<OrganizationResponse>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.GET(id)
    );
    return response.data;
  }

  // Update organization
  static async updateOrganization(id: string, data: UpdateOrganizationRequest): Promise<Organization> {
    console.log('Updating organization:', id, 'with data:', data);
    console.log('Using endpoint:', API_CONFIG.ENDPOINTS.ORGANIZATIONS.UPDATE(id));
    
    const response = await apiClient.put<Organization>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.UPDATE(id),
      data
    );
    console.log('Organization update response:', response);
    return response.data;
  }

  // List organizations (for current user)
  static async listOrganizations(): Promise<OrganizationListResponse> {
    const response = await apiClient.get<OrganizationListResponse>(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.LIST
    );
    return response.data;
  }

  // Upload organization logo
  static async uploadLogo(organizationId: string, file: File): Promise<OrganizationResponse> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await apiClient.uploadFile<OrganizationResponse>(
      `${API_CONFIG.ENDPOINTS.ORGANIZATIONS.UPDATE(organizationId)}/logo`,
      file
    );
    return response.data;
  }

  // Get organization members
  static async getMembers(organizationId: string) {
    const response = await apiClient.get(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.MEMBERS(organizationId)
    );
    return response.data;
  }

  // Invite member to organization
  static async inviteMember(organizationId: string, email: string, role?: string) {
    const response = await apiClient.post(
      API_CONFIG.ENDPOINTS.ORGANIZATIONS.INVITE(organizationId),
      { email, role }
    );
    return response.data;
  }
}

export default OrganizationService;
