export interface WorkspaceItem {
  id: string;
  name: string;
  type: 'folder' | 'subfolder' | 'board' | 'dashboard' | 'doc';
  parentId?: string; // null for root level items
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  icon?: string;
  description?: string;
  templateId?: string; // for boards created from templates
  templateData?: any; // template data for boards
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
}

export interface WorkspaceHierarchy {
  workspace: Workspace;
  items: WorkspaceItem[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: 'workspace' | 'folder' | 'subfolder';
  path: string;
}

export type ItemType = 'folder' | 'subfolder' | 'board' | 'dashboard' | 'doc';

export interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string;
  workspaceId: string;
  allowedTypes: ItemType[];
  onItemCreated: (item: WorkspaceItem) => void;
}
