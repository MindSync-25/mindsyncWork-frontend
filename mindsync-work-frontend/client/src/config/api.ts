// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8081',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/api/v1/auth/register',
      LOGIN: '/api/v1/auth/login',
      REFRESH: '/api/v1/auth/refresh',
      ME: '/api/v1/auth/me',
      LOGOUT: '/api/v1/auth/logout',
      VERIFY_TOKEN: '/api/v1/auth/verify',
    },
    // User Management
    USERS: {
      PROFILE: '/api/v1/users/profile',
      UPDATE_PROFILE: '/api/v1/users/profile',
      UPLOAD_AVATAR: '/api/v1/users/avatar',
      CHANGE_PASSWORD: '/api/v1/users/password',
    },
    // Organization Management
    ORGANIZATIONS: {
      CREATE: '/api/v1/organizations',
      GET: (id: string) => `/api/v1/organizations/${id}`,
      UPDATE: (id: string) => `/api/v1/organizations/${id}`,
      LIST: '/api/v1/organizations',
      MEMBERS: (id: string) => `/api/v1/organizations/${id}/members`,
      INVITE: (id: string) => `/api/v1/organizations/${id}/invite`,
      ROLES: (id: string) => `/api/v1/organizations/${id}/roles`,
    },
    // Team Management
    TEAMS: {
      CREATE: '/api/v1/teams',
      LIST: '/api/v1/teams',
      GET: (id: string) => `/api/v1/teams/${id}`,
      UPDATE: (id: string) => `/api/v1/teams/${id}`,
      DELETE: (id: string) => `/api/v1/teams/${id}`,
      MEMBERS: (id: string) => `/api/v1/teams/${id}/members`,
      ADD_MEMBER: (id: string) => `/api/v1/teams/${id}/members`,
      REMOVE_MEMBER: (teamId: string, memberId: string) => `/api/v1/teams/${teamId}/members/${memberId}`,
    },
    // Invitations
    INVITATIONS: {
      SEND: '/api/v1/invitations/send',
      LIST: '/api/v1/invitations',
      ACCEPT: (id: string) => `/api/v1/invitations/${id}/accept`,
      DECLINE: (id: string) => `/api/v1/invitations/${id}/decline`,
      RESEND: (id: string) => `/api/v1/invitations/${id}/resend`,
    },
    // Workspaces
    WORKSPACES: {
      LIST: '/api/v1/workspaces',
      CREATE: '/api/v1/workspaces',
      GET: (id: string) => `/api/v1/workspaces/${id}`,
      UPDATE: (id: string) => `/api/v1/workspaces/${id}`,
      DELETE: (id: string) => `/api/v1/workspaces/${id}`,
      FOLDERS: (id: string) => `/api/v1/workspaces/${id}/folders`,
    },
    // Folders
    FOLDERS: {
      GET: (id: string) => `/api/v1/folders/${id}`,
      UPDATE: (id: string) => `/api/v1/folders/${id}`,
      DELETE: (id: string) => `/api/v1/folders/${id}`,
      HIERARCHY: (id: string) => `/api/v1/folders/${id}/hierarchy`,
    },
    // Boards
    BOARDS: {
      LIST: '/api/v1/boards',
      CREATE: '/api/v1/boards',
      GET: (id: string) => `/api/v1/boards/${id}`,
      UPDATE: (id: string) => `/api/v1/boards/${id}`,
      DELETE: (id: string) => `/api/v1/boards/${id}`,
      COLUMNS: (id: string) => `/api/v1/boards/${id}/columns`,
      ADD_COLUMN: (id: string) => `/api/v1/boards/${id}/columns`,
      UPDATE_COLUMN: (boardId: string, colId: string) => `/api/v1/boards/${boardId}/columns/${colId}`,
      DELETE_COLUMN: (boardId: string, colId: string) => `/api/v1/boards/${boardId}/columns/${colId}`,
      REORDER_COLUMNS: (id: string) => `/api/v1/boards/${id}/columns/reorder`,
      ITEMS: (id: string) => `/api/v1/boards/${id}/items`,
      CREATE_ITEM: (id: string) => `/api/v1/boards/${id}/items`,
      FROM_TEMPLATE: '/api/v1/boards/from-template',
    },
    // Items
    ITEMS: {
      GET: (id: string) => `/api/v1/items/${id}`,
      UPDATE: (id: string) => `/api/v1/items/${id}`,
      DELETE: (id: string) => `/api/v1/items/${id}`,
      REORDER: '/api/v1/items/reorder',
      UPDATE_VALUE: (itemId: string, colId: string) => `/api/v1/items/${itemId}/values/${colId}`,
      UPDATE_VALUES: (id: string) => `/api/v1/items/${id}/values`,
      BULK_UPDATE: '/api/v1/items/bulk-update',
    },
    // Templates
    TEMPLATES: {
      LIST: '/api/v1/templates',
      GET: (id: string) => `/api/v1/templates/${id}`,
    },
    // Search
    SEARCH: '/api/v1/search',
  },
};

export default API_CONFIG;
