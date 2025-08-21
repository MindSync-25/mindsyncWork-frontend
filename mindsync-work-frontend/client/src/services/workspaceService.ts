import type { Workspace, WorkspaceItem, WorkspaceHierarchy, ItemType } from '../types/workspace';

// Mock data - in real app this would come from API
const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Personal Projects',
    description: 'My personal work and side projects',
    color: 'from-blue-500 to-purple-600',
    icon: '👤',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-19'),
    isDefault: true
  },
  {
    id: 'ws-2',
    name: 'Team Collaboration',
    description: 'Shared workspace for team projects',
    color: 'from-green-500 to-teal-600',
    icon: '👥',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-08-18')
  }
];

const mockWorkspaceItems: WorkspaceItem[] = [
  // Empty - items will be created when users add them
];

export class WorkspaceService {
  // Get all workspaces
  static async getWorkspaces(): Promise<Workspace[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve([...mockWorkspaces]), 100);
    });
  }

  // Get workspace by ID
  static async getWorkspace(id: string): Promise<Workspace | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const workspace = mockWorkspaces.find(w => w.id === id);
        resolve(workspace || null);
      }, 100);
    });
  }

  // Get workspace hierarchy (workspace + all items)
  static async getWorkspaceHierarchy(workspaceId: string): Promise<WorkspaceHierarchy | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const workspace = mockWorkspaces.find(w => w.id === workspaceId);
        if (!workspace) {
          resolve(null);
          return;
        }
        
        const items = mockWorkspaceItems.filter(item => item.workspaceId === workspaceId);
        resolve({ workspace, items });
      }, 100);
    });
  }

  // Get items by parent ID (null for root level)
  static async getItemsByParent(workspaceId: string, parentId?: string): Promise<WorkspaceItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = mockWorkspaceItems.filter(item => 
          item.workspaceId === workspaceId && item.parentId === parentId
        );
        resolve(items);
      }, 100);
    });
  }

  // Create new workspace
  static async createWorkspace(data: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newWorkspace: Workspace = {
          ...data,
          id: `ws-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockWorkspaces.push(newWorkspace);
        resolve(newWorkspace);
      }, 200);
    });
  }

  // Create new item (folder, subfolder, board, dashboard, doc)
  static async createItem(data: Omit<WorkspaceItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkspaceItem> {
    return new Promise(resolve => {
      setTimeout(() => {
        const newItem: WorkspaceItem = {
          ...data,
          id: `item-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockWorkspaceItems.push(newItem);
        resolve(newItem);
      }, 200);
    });
  }

  // Get breadcrumb path for navigation
  static async getBreadcrumbPath(workspaceId: string, itemId?: string): Promise<{ workspace: Workspace; path: WorkspaceItem[] }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const workspace = mockWorkspaces.find(w => w.id === workspaceId)!;
        const path: WorkspaceItem[] = [];
        
        if (itemId) {
          const buildPath = (currentId: string) => {
            const item = mockWorkspaceItems.find(i => i.id === currentId);
            if (item) {
              path.unshift(item);
              if (item.parentId) {
                buildPath(item.parentId);
              }
            }
          };
          buildPath(itemId);
        }
        
        resolve({ workspace, path });
      }, 100);
    });
  }

  // Get allowed item types based on current location
  static getAllowedItemTypes(currentItemType?: 'workspace' | 'folder' | 'subfolder'): ItemType[] {
    switch (currentItemType) {
      case 'workspace':
        return ['folder', 'board', 'dashboard', 'doc'];
      case 'folder':
        return ['subfolder', 'board', 'dashboard', 'doc'];
      case 'subfolder':
        return ['board', 'dashboard', 'doc'];
      default:
        return ['folder', 'board', 'dashboard', 'doc'];
    }
  }
}

// Helper functions
export const getItemIcon = (type: ItemType): string => {
  switch (type) {
    case 'folder': return '📁';
    case 'subfolder': return '📂';
    case 'board': return '📋';
    case 'dashboard': return '📊';
    case 'doc': return '📝';
    default: return '📄';
  }
};

export const getItemColor = (type: ItemType): string => {
  switch (type) {
    case 'folder': return 'from-blue-500 to-blue-600';
    case 'subfolder': return 'from-indigo-500 to-indigo-600';
    case 'board': return 'from-green-500 to-green-600';
    case 'dashboard': return 'from-purple-500 to-purple-600';
    case 'doc': return 'from-gray-500 to-gray-600';
    default: return 'from-gray-400 to-gray-500';
  }
};
