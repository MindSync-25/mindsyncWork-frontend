# Role-Based Access Control (RBAC) System Documentation

## Overview

This system implements a comprehensive Role-Based Access Control (RBAC) architecture designed for real-world enterprise applications. It provides granular permission management across different user types and organizational hierarchies.

## Role Hierarchy

The system implements a 4-tier hierarchy where higher-level roles inherit permissions from lower levels:

### 1. Team Member (Level 1) - `'user'`
- **Purpose**: Individual contributors and team workers
- **Icon**: 👤
- **Color**: Green (`bg-green-500`)
- **Permissions**:
  - View assigned tasks and deliverables
  - Update task status and progress
  - Download completed deliverables
  - Request updates from team leads
  - Access to personal dashboard

### 2. Team Lead (Level 2) - `'admin'`
- **Purpose**: Manages specific teams and assigns tasks
- **Icon**: 👨‍💼
- **Color**: Blue (`bg-blue-500`)
- **Permissions**:
  - All Team Member permissions +
  - Assign tasks to team members
  - Manage assigned projects
  - Update deliverables and milestones
  - Create new tasks
  - View team performance analytics
  - Manage client communications

### 3. Manager (Level 3) - `'super_admin'`
- **Purpose**: Oversees multiple teams and department operations
- **Icon**: 👑
- **Color**: Purple (`bg-purple-500`)
- **Permissions**:
  - All Team Lead permissions +
  - Manage all projects across department
  - Create and assign users to teams
  - Assign Team Members to Team Leads
  - Assign Projects to Team Leads
  - Budget management and control
  - Generate enterprise reports
  - View department-wide analytics
  - User role promotion/demotion (Team Member ↔ Team Lead)

### 4. Client (Level 4) - `'client'`
- **Purpose**: External stakeholders and project owners
- **Icon**: 🤝
- **Color**: Gray (`bg-gray-500`)
- **Permissions**:
  - View ALL project deliverables and progress
  - Download completed deliverables
  - Access project timeline and milestones
  - Request updates and communicate with team
  - Schedule meetings with project managers
  - View project analytics and reports
  - Full system access (wildcard permissions)
  - Manage all users across all departments
  - System configuration and security management
  - Database access and maintenance
  - Organization-wide reporting and analytics

## Permission System

### Permission Structure
Each permission includes:
- `id`: Unique identifier
- `name`: Human-readable name
- `resource`: What the permission applies to
- `action`: Type of action (create, read, update, delete, manage)
- `conditions`: Optional context-specific conditions

### Key Resources
- **projects**: Project management and access
- **deliverables**: File and deliverable management
- **tasks**: Task creation and assignment
- **users**: User management and role assignment
- **analytics**: Data and reporting access
- **budgets**: Financial management
- **communications**: Client and team communications
- **system**: System configuration and maintenance

## Implementation Guide

### 1. Authentication Context
```typescript
// Set up user context with role information
const user = {
  id: 'user-123',
  name: 'John Smith',
  email: 'john@company.com',
  role: 'admin' as UserRole,
  department: 'Engineering',
  projects: ['project-1', 'project-2']
};
```

### 2. Permission Checking
```typescript
// Check if user has specific permission
const canEdit = hasPermission(user.role, 'update_deliverables');

// Check resource access with context
const canView = canAccessResource(
  user.role, 
  'projects', 
  'read',
  { owner: user.id }
);

// Check user management permissions
const canManage = canManageUser(managerRole, targetUserRole);
```

### 3. UI Component Integration
```typescript
// Role-based UI rendering
{currentAccess.canEdit && (
  <button>Edit Deliverable</button>
)}

{currentAccess.canManageUsers && (
  <UserManagementPanel />
)}
```

## Security Considerations

### 1. Frontend Validation
- All role checks are performed on the frontend for UI/UX
- **Important**: Backend must validate all permissions server-side
- Frontend role checking is for user experience only

### 2. API Integration
```typescript
// Always send user context with API requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'X-User-Role': user.role,
  'X-User-ID': user.id
};
```

### 3. Route Protection
```typescript
// Protect routes based on minimum role requirements
const protectedRoutes = {
  '/admin': 'admin',
  '/super-admin': 'super_admin',
  '/system': 'great_administrator'
};
```

## Best Practices

### 1. Principle of Least Privilege
- Grant minimum necessary permissions
- Regular permission audits
- Time-limited elevated access when needed

### 2. Role Assignment
- Clear role definitions and responsibilities
- Proper onboarding and training
- Regular role reviews and updates

### 3. Audit Trail
- Log all permission changes
- Track user actions and access patterns
- Regular security reviews

## Database Schema Considerations

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  managed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Role Assignments
```sql
CREATE TABLE user_project_assignments (
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  role VARCHAR(50),
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);
```

## API Endpoints

### User Management
- `GET /api/users` - List users (role-based filtering)
- `POST /api/users` - Create user (admin+ only)
- `PUT /api/users/:id/role` - Update user role (super_admin+ only)
- `DELETE /api/users/:id` - Deactivate user (super_admin+ only)

### Project Management
- `GET /api/projects` - List projects (role-based access)
- `POST /api/projects` - Create project (admin+ only)
- `PUT /api/projects/:id` - Update project (assigned admin+ only)

### Deliverables
- `GET /api/deliverables` - List deliverables (role-based filtering)
- `POST /api/deliverables` - Create deliverable (admin+ only)
- `PUT /api/deliverables/:id` - Update deliverable (assigned admin+ only)

## Testing Strategy

### 1. Unit Tests
- Test permission checking functions
- Validate role hierarchy logic
- Test condition-based permissions

### 2. Integration Tests
- Test API endpoints with different roles
- Validate frontend component access
- Test cross-role interactions

### 3. Security Tests
- Attempt unauthorized access
- Test privilege escalation scenarios
- Validate data isolation between roles

## Migration Guide

### From Simple Role System
1. Map existing roles to new hierarchy
2. Migrate user role assignments
3. Update permission checks throughout application
4. Test all role-based functionality

### Adding New Roles
1. Define role in `types/roles.ts`
2. Add to role hierarchy
3. Define permissions
4. Update UI components
5. Test integration

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check role hierarchy and specific permissions
2. **UI Not Updating**: Verify role-based rendering conditions
3. **API Errors**: Ensure backend validates permissions
4. **Role Assignment Issues**: Check user management permissions

### Debug Tools
```typescript
// Debug permission checking
console.log('User Role:', user.role);
console.log('Available Permissions:', ROLE_PERMISSIONS[user.role]);
console.log('Can Edit:', hasPermission(user.role, 'update_deliverables'));
```

This comprehensive RBAC system provides the foundation for a secure, scalable, and maintainable role management system suitable for enterprise applications.
