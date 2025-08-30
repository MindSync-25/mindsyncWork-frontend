// Response Types matching backend contracts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: 'PERSONAL' | 'ORGANIZATION';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  company: Company;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  company: Company;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  timeZone?: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  companyType: 'PERSONAL' | 'ORGANIZATION';
  createdAt: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

// Folder Types
export interface Folder {
  id: string;
  workspaceId: string;
  parentFolderId?: string;
  name: string;
  type: 'folder' | 'subfolder';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderRequest {
  name: string;
  parentFolderId?: string;
  type: 'folder' | 'subfolder';
}

// Board Types
export interface Board {
  id: string;
  companyId: string;
  folderId?: string;
  name: string;
  description?: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  type: ColumnType;
  config: ColumnConfig;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export type ColumnType = 'text' | 'number' | 'status' | 'people' | 'date' | 'priority' | 'files';

export interface ColumnConfig {
  // Text
  maxLength?: number;
  
  // Number
  decimalPlaces?: number;
  currency?: string;
  
  // Status/Priority
  options?: Array<{
    label: string;
    color: string;
  }>;
  
  // People
  allowMultiple?: boolean;
  restrictToCompany?: boolean;
  
  // Date
  includeTime?: boolean;
  format?: string;
  
  // Files
  maxFiles?: number;
  maxSizeMb?: number;
  allowedTypes?: string[];
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
  folderId?: string;
  templateId?: string;
}

export interface CreateColumnRequest {
  name: string;
  type: ColumnType;
  config: ColumnConfig;
  orderIndex?: number;
}

// Item Types
export interface BoardItem {
  id: string;
  boardId: string;
  name: string;
  orderIndex: number;
  values: Record<string, any>; // columnId -> value
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  values?: Record<string, any>;
  orderIndex?: number;
}

export interface UpdateItemValueRequest {
  value: any;
}

export interface BulkUpdateRequest {
  itemIds: string[];
  updates: Record<string, any>; // columnId -> value
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  columnDefinitions: CreateColumnRequest[];
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchRequest {
  query: string;
  type?: 'board' | 'item' | 'workspace' | 'folder';
  workspaceId?: string;
  limit?: number;
}

export interface SearchResult {
  id: string;
  type: 'board' | 'item' | 'workspace' | 'folder';
  title: string;
  description?: string;
  workspaceId?: string;
  boardId?: string;
  highlight?: string;
}

// WebSocket Types
export interface WebSocketEvent {
  type: 'item_created' | 'item_updated' | 'item_deleted' | 'column_added' | 'column_updated' | 'column_deleted';
  boardId: string;
  data: any;
  userId: string;
  timestamp: string;
}

// Utility Types
export interface ReorderRequest {
  itemIds: string[];
  newOrder: number[];
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  timeZone?: string;
  profilePicture?: string;
}
