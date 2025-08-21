// Role-based Access Control (RBAC) System
export type UserRole = 'user' | 'admin' | 'super_admin' | 'client';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

export interface RoleDefinition {
  role: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  hierarchy: number; // 1 = lowest, 4 = highest
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  managedBy?: string; // ID of managing user
  projects?: string[]; // Project IDs they have access to
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Role Permissions Matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Level 1: Normal User (Team Member)
  user: [
    {
      id: 'view_assigned_projects',
      name: 'View Assigned Projects',
      resource: 'projects',
      action: 'read',
      conditions: { assigned: true }
    },
    {
      id: 'view_assigned_tasks',
      name: 'View Assigned Tasks',
      resource: 'tasks',
      action: 'read',
      conditions: { assigned: true }
    },
    {
      id: 'update_task_status',
      name: 'Update Task Status',
      resource: 'tasks',
      action: 'update',
      conditions: { assigned: true }
    },
    {
      id: 'view_deliverables',
      name: 'View Deliverables',
      resource: 'deliverables',
      action: 'read'
    },
    {
      id: 'download_files',
      name: 'Download Files',
      resource: 'files',
      action: 'read'
    }
  ],

  // Level 2: Team Lead (Admin)
  admin: [
    {
      id: 'manage_assigned_projects',
      name: 'Manage Assigned Projects',
      resource: 'projects',
      action: 'manage',
      conditions: { assigned: true }
    },
    {
      id: 'assign_tasks_to_team',
      name: 'Assign Tasks to Team Members',
      resource: 'tasks',
      action: 'manage',
      conditions: { scope: 'team' }
    },
    {
      id: 'update_deliverables',
      name: 'Update Deliverables',
      resource: 'deliverables',
      action: 'update'
    },
    {
      id: 'create_tasks',
      name: 'Create Tasks',
      resource: 'tasks',
      action: 'create'
    },
    {
      id: 'assign_tasks',
      name: 'Assign Tasks',
      resource: 'tasks',
      action: 'manage'
    },
    {
      id: 'view_team_performance',
      name: 'View Team Performance',
      resource: 'analytics',
      action: 'read',
      conditions: { scope: 'team' }
    },
    {
      id: 'manage_client_communications',
      name: 'Manage Client Communications',
      resource: 'communications',
      action: 'manage'
    }
  ],
  
  // Level 3: Manager (Super Admin)
  super_admin: [
    {
      id: 'manage_all_projects',
      name: 'Manage All Projects',
      resource: 'projects',
      action: 'manage'
    },
    {
      id: 'create_users',
      name: 'Create New Users',
      resource: 'users',
      action: 'create'
    },
    {
      id: 'assign_users_to_leads',
      name: 'Assign Users to Team Leads',
      resource: 'users',
      action: 'manage',
      conditions: { action: 'assign' }
    },
    {
      id: 'manage_team_leads',
      name: 'Manage Team Leads',
      resource: 'users',
      action: 'manage',
      conditions: { maxRole: 'admin' }
    },
    {
      id: 'view_department_analytics',
      name: 'View Department Analytics',
      resource: 'analytics',
      action: 'read',
      conditions: { scope: 'department' }
    },
    {
      id: 'manage_budgets',
      name: 'Manage Budgets',
      resource: 'budgets',
      action: 'manage'
    },
    {
      id: 'generate_reports',
      name: 'Generate Reports',
      resource: 'reports',
      action: 'create'
    },
    {
      id: 'approve_deliverables',
      name: 'Approve Deliverables',
      resource: 'deliverables',
      action: 'manage'
    },
    {
      id: 'assign_projects_to_leads',
      name: 'Assign Projects to Team Leads',
      resource: 'projects',
      action: 'manage',
      conditions: { action: 'assign' }
    }
  ],
  
  // Level 4: Client (External)
  client: [
    {
      id: 'view_own_projects',
      name: 'View Own Projects',
      resource: 'projects',
      action: 'read',
      conditions: { owner: 'self' }
    },
    {
      id: 'view_own_deliverables',
      name: 'View Own Deliverables',
      resource: 'deliverables',
      action: 'read',
      conditions: { owner: 'self' }
    },
    {
      id: 'download_deliverables',
      name: 'Download Deliverables',
      resource: 'deliverables',
      action: 'read',
      conditions: { status: 'completed' }
    },
    {
      id: 'request_updates',
      name: 'Request Updates',
      resource: 'communications',
      action: 'create'
    },
    {
      id: 'view_milestones',
      name: 'View Project Milestones',
      resource: 'projects',
      action: 'read',
      conditions: { scope: 'milestones' }
    }
  ]
};

// Role Definitions
export const ROLES: Record<UserRole, RoleDefinition> = {
  // Level 1: Normal User (Team Member)
  user: {
    role: 'user',
    name: 'Team Member',
    description: 'Regular team member with basic project access',
    permissions: ROLE_PERMISSIONS.user,
    hierarchy: 1,
    color: 'bg-gray-500',
    icon: '👤'
  },

  // Level 2: Team Lead (Admin)
  admin: {
    role: 'admin',
    name: 'Team Lead',
    description: 'Team lead with project management and team coordination',
    permissions: ROLE_PERMISSIONS.admin,
    hierarchy: 2,
    color: 'bg-green-500',
    icon: '�'
  },
  
  // Level 3: Manager (Super Admin)
  super_admin: {
    role: 'super_admin',
    name: 'Manager',
    description: 'Manager with strategic oversight and resource management',
    permissions: ROLE_PERMISSIONS.super_admin,
    hierarchy: 3,
    color: 'bg-purple-500',
    icon: '�️'
  },
  
  // Level 4: Client (External)
  client: {
    role: 'client',
    name: 'Client',
    description: 'External client with limited project view access',
    permissions: ROLE_PERMISSIONS.client,
    hierarchy: 4,
    color: 'bg-blue-500',
    icon: '🏢'
  }
};

// Utility Functions
export const hasPermission = (userRole: UserRole, requiredPermission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions.some(permission => permission.id === requiredPermission);
};

export const canAccessResource = (
  userRole: UserRole, 
  resource: string, 
  action: string,
  context?: Record<string, any>
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  
  return rolePermissions.some(permission => {
    // Check resource and action match
    if (permission.resource !== resource || permission.action !== action) return false;
    
    // Check conditions if they exist
    if (permission.conditions && context) {
      return Object.entries(permission.conditions).every(([key, value]) => {
        return context[key] === value;
      });
    }
    
    return true;
  });
};

export const getRoleHierarchy = (role: UserRole): number => {
  return ROLES[role].hierarchy;
};

export const canManageUser = (managerRole: UserRole, targetRole: UserRole): boolean => {
  const managerHierarchy = getRoleHierarchy(managerRole);
  const targetHierarchy = getRoleHierarchy(targetRole);
  
  return managerHierarchy > targetHierarchy;
};

export const getAvailableRoles = (currentUserRole: UserRole): UserRole[] => {
  const currentHierarchy = getRoleHierarchy(currentUserRole);
  
  return Object.keys(ROLES)
    .filter(role => getRoleHierarchy(role as UserRole) <= currentHierarchy)
    .map(role => role as UserRole);
};
