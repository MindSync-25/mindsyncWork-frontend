import apiClient from './apiClient';
import { API_CONFIG } from '../config/api';
import type {
  Workspace,
  CreateWorkspaceRequest,
  Folder,
  CreateFolderRequest,
  Board,
  CreateBoardRequest,
  Column,
  CreateColumnRequest,
  BoardItem,
  CreateItemRequest,
  Template,
  SearchRequest,
  SearchResult,
  BulkUpdateRequest,
  ReorderRequest,
} from '../types/api';

// Legacy types for backward compatibility with existing frontend
export interface WorkspaceItem {
  id: string;
  name: string;
  type: 'folder' | 'subfolder' | 'board' | 'dashboard' | 'doc';
  workspaceId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceHierarchy {
  workspace: Workspace;
  items: WorkspaceItem[];
}

export class WorkspaceService {
  // ========== WORKSPACE MANAGEMENT ==========
  
  static async getWorkspaces(): Promise<Workspace[]> {
    const response = await apiClient.get<Workspace[]>(API_CONFIG.ENDPOINTS.WORKSPACES.LIST);
    return response.data;
  }

  static async getWorkspace(id: string): Promise<Workspace | null> {
    try {
      const response = await apiClient.get<Workspace>(API_CONFIG.ENDPOINTS.WORKSPACES.GET(id));
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
    const response = await apiClient.post<Workspace>(API_CONFIG.ENDPOINTS.WORKSPACES.CREATE, data);
    return response.data;
  }

  static async updateWorkspace(id: string, data: Partial<CreateWorkspaceRequest>): Promise<Workspace> {
    const response = await apiClient.put<Workspace>(API_CONFIG.ENDPOINTS.WORKSPACES.UPDATE(id), data);
    return response.data;
  }

  static async deleteWorkspace(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.WORKSPACES.DELETE(id));
  }

  // ========== FOLDER MANAGEMENT ==========
  
  static async getFoldersInWorkspace(workspaceId: string): Promise<Folder[]> {
    const response = await apiClient.get<Folder[]>(API_CONFIG.ENDPOINTS.WORKSPACES.FOLDERS(workspaceId));
    return response.data;
  }

  static async createFolder(workspaceId: string, data: CreateFolderRequest): Promise<Folder> {
    const response = await apiClient.post<Folder>(
      API_CONFIG.ENDPOINTS.WORKSPACES.FOLDERS(workspaceId),
      data
    );
    return response.data;
  }

  static async getFolder(id: string): Promise<Folder | null> {
    try {
      const response = await apiClient.get<Folder>(API_CONFIG.ENDPOINTS.FOLDERS.GET(id));
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async updateFolder(id: string, data: Partial<CreateFolderRequest>): Promise<Folder> {
    const response = await apiClient.put<Folder>(API_CONFIG.ENDPOINTS.FOLDERS.UPDATE(id), data);
    return response.data;
  }

  static async deleteFolder(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.FOLDERS.DELETE(id));
  }

  static async getFolderHierarchy(id: string): Promise<{ folder: Folder; children: Folder[] }> {
    const response = await apiClient.get<{ folder: Folder; children: Folder[] }>(
      API_CONFIG.ENDPOINTS.FOLDERS.HIERARCHY(id)
    );
    return response.data;
  }

  // ========== BOARD MANAGEMENT ==========
  
  static async getBoards(params?: { workspaceId?: string; folderId?: string }): Promise<Board[]> {
    const response = await apiClient.get<Board[]>(API_CONFIG.ENDPOINTS.BOARDS.LIST, params);
    return response.data;
  }

  static async createBoard(data: CreateBoardRequest): Promise<Board> {
    const response = await apiClient.post<Board>(API_CONFIG.ENDPOINTS.BOARDS.CREATE, data);
    return response.data;
  }

  static async createBoardFromTemplate(templateId: string, name: string, folderId?: string): Promise<Board> {
    const response = await apiClient.post<Board>(API_CONFIG.ENDPOINTS.BOARDS.FROM_TEMPLATE, {
      templateId,
      name,
      folderId,
    });
    return response.data;
  }

  static async getBoard(id: string): Promise<Board | null> {
    try {
      const response = await apiClient.get<Board>(API_CONFIG.ENDPOINTS.BOARDS.GET(id));
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async updateBoard(id: string, data: Partial<CreateBoardRequest>): Promise<Board> {
    const response = await apiClient.put<Board>(API_CONFIG.ENDPOINTS.BOARDS.UPDATE(id), data);
    return response.data;
  }

  static async deleteBoard(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.BOARDS.DELETE(id));
  }

  // ========== COLUMN MANAGEMENT ==========
  
  static async getBoardColumns(boardId: string): Promise<Column[]> {
    const response = await apiClient.get<Column[]>(API_CONFIG.ENDPOINTS.BOARDS.COLUMNS(boardId));
    return response.data;
  }

  static async addColumn(boardId: string, data: CreateColumnRequest): Promise<Column> {
    const response = await apiClient.post<Column>(
      API_CONFIG.ENDPOINTS.BOARDS.ADD_COLUMN(boardId),
      data
    );
    return response.data;
  }

  static async updateColumn(boardId: string, columnId: string, data: Partial<CreateColumnRequest>): Promise<Column> {
    const response = await apiClient.put<Column>(
      API_CONFIG.ENDPOINTS.BOARDS.UPDATE_COLUMN(boardId, columnId),
      data
    );
    return response.data;
  }

  static async deleteColumn(boardId: string, columnId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.BOARDS.DELETE_COLUMN(boardId, columnId));
  }

  static async reorderColumns(boardId: string, columnIds: string[]): Promise<void> {
    await apiClient.put(API_CONFIG.ENDPOINTS.BOARDS.REORDER_COLUMNS(boardId), { columnIds });
  }

  // ========== ITEM MANAGEMENT ==========
  
  static async getBoardItems(boardId: string): Promise<BoardItem[]> {
    const response = await apiClient.get<BoardItem[]>(API_CONFIG.ENDPOINTS.BOARDS.ITEMS(boardId));
    return response.data;
  }

  static async createItem(boardId: string, data: CreateItemRequest): Promise<BoardItem> {
    const response = await apiClient.post<BoardItem>(
      API_CONFIG.ENDPOINTS.BOARDS.CREATE_ITEM(boardId),
      data
    );
    return response.data;
  }

  static async getItem(id: string): Promise<BoardItem | null> {
    try {
      const response = await apiClient.get<BoardItem>(API_CONFIG.ENDPOINTS.ITEMS.GET(id));
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async updateItem(id: string, data: Partial<CreateItemRequest>): Promise<BoardItem> {
    const response = await apiClient.put<BoardItem>(API_CONFIG.ENDPOINTS.ITEMS.UPDATE(id), data);
    return response.data;
  }

  static async deleteItem(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.ITEMS.DELETE(id));
  }

  static async updateItemValue(itemId: string, columnId: string, value: any): Promise<void> {
    await apiClient.put(API_CONFIG.ENDPOINTS.ITEMS.UPDATE_VALUE(itemId, columnId), { value });
  }

  static async updateItemValues(itemId: string, values: Record<string, any>): Promise<BoardItem> {
    const response = await apiClient.put<BoardItem>(
      API_CONFIG.ENDPOINTS.ITEMS.UPDATE_VALUES(itemId),
      { values }
    );
    return response.data;
  }

  static async bulkUpdateItems(data: BulkUpdateRequest): Promise<void> {
    await apiClient.put(API_CONFIG.ENDPOINTS.ITEMS.BULK_UPDATE, data);
  }

  static async reorderItems(data: ReorderRequest): Promise<void> {
    await apiClient.put(API_CONFIG.ENDPOINTS.ITEMS.REORDER, data);
  }

  // ========== TEMPLATE MANAGEMENT ==========
  
  static async getTemplates(): Promise<Template[]> {
    const response = await apiClient.get<Template[]>(API_CONFIG.ENDPOINTS.TEMPLATES.LIST);
    return response.data;
  }

  static async getTemplate(id: string): Promise<Template | null> {
    try {
      const response = await apiClient.get<Template>(API_CONFIG.ENDPOINTS.TEMPLATES.GET(id));
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // ========== SEARCH ==========
  
  static async search(query: SearchRequest): Promise<SearchResult[]> {
    const response = await apiClient.get<SearchResult[]>(API_CONFIG.ENDPOINTS.SEARCH, query);
    return response.data;
  }

  // ========== LEGACY COMPATIBILITY METHODS ==========
  // These methods maintain compatibility with existing frontend code
  
  static async getWorkspaceHierarchy(workspaceId: string): Promise<WorkspaceHierarchy | null> {
    try {
      const [workspace, folders, boards] = await Promise.all([
        this.getWorkspace(workspaceId),
        this.getFoldersInWorkspace(workspaceId),
        this.getBoards({ workspaceId }),
      ]);

      if (!workspace) return null;

      // Convert to legacy format
      const items: WorkspaceItem[] = [
        // Convert folders to legacy format
        ...folders.map(folder => ({
          id: folder.id,
          name: folder.name,
          type: folder.type as WorkspaceItem['type'],
          workspaceId: folder.workspaceId,
          parentId: folder.parentFolderId,
          createdAt: new Date(folder.createdAt),
          updatedAt: new Date(folder.updatedAt),
        })),
        // Convert boards to legacy format  
        ...boards.map(board => ({
          id: board.id,
          name: board.name,
          type: 'board' as WorkspaceItem['type'],
          workspaceId: workspaceId,
          parentId: board.folderId,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
        })),
      ];

      return { workspace, items };
    } catch (error) {
      console.error('Error getting workspace hierarchy:', error);
      return null;
    }
  }

  static async getItemsByParent(workspaceId: string, parentId?: string): Promise<WorkspaceItem[]> {
    const hierarchy = await this.getWorkspaceHierarchy(workspaceId);
    if (!hierarchy) return [];

    return hierarchy.items.filter(item => item.parentId === parentId);
  }

  // Legacy createWorkspaceItem method for backward compatibility
  static async createWorkspaceItem(data: {
    name: string;
    type: WorkspaceItem['type'];
    workspaceId: string;
    parentId?: string;
  }): Promise<WorkspaceItem> {
    if (data.type === 'folder' || data.type === 'subfolder') {
      const folder = await this.createFolder(data.workspaceId, {
        name: data.name,
        parentFolderId: data.parentId,
        type: data.type,
      });
      
      return {
        id: folder.id,
        name: folder.name,
        type: folder.type as WorkspaceItem['type'],
        workspaceId: folder.workspaceId,
        parentId: folder.parentFolderId,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      };
    } else {
      // Create board
      const board = await this.createBoard({
        name: data.name,
        folderId: data.parentId,
      });
      
      return {
        id: board.id,
        name: board.name,
        type: 'board',
        workspaceId: data.workspaceId,
        parentId: board.folderId,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
      };
    }
  }

  // Breadcrumb path helper
  static async getBreadcrumbPath(workspaceId: string, itemId?: string): Promise<{ workspace: Workspace; path: WorkspaceItem[] }> {
    const workspace = await this.getWorkspace(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    const path: WorkspaceItem[] = [];
    
    if (itemId) {
      const hierarchy = await this.getWorkspaceHierarchy(workspaceId);
      if (hierarchy) {
        const buildPath = (currentId: string) => {
          const item = hierarchy.items.find(i => i.id === currentId);
          if (item) {
            path.unshift(item);
            if (item.parentId) {
              buildPath(item.parentId);
            }
          }
        };
        buildPath(itemId);
      }
    }
    
    return { workspace, path };
  }
}

// Helper functions
export const getItemIcon = (type: WorkspaceItem['type']): string => {
  switch (type) {
    case 'folder': return '📁';
    case 'subfolder': return '📂';
    case 'board': return '📋';
    case 'dashboard': return '📊';
    case 'doc': return '📝';
    default: return '📄';
  }
};

export const getItemColor = (type: WorkspaceItem['type']): string => {
  switch (type) {
    case 'folder': return 'from-blue-500 to-blue-600';
    case 'subfolder': return 'from-indigo-500 to-indigo-600';
    case 'board': return 'from-green-500 to-green-600';
    case 'dashboard': return 'from-purple-500 to-purple-600';
    case 'doc': return 'from-gray-500 to-gray-600';
    default: return 'from-gray-400 to-gray-500';
  }
};
