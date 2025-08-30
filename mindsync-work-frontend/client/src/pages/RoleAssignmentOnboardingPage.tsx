import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RoleAssignmentOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Full access to all features and settings. Can manage users, workspaces, and company settings.',
      icon: '👑',
      color: 'from-red-500 to-orange-500',
      permissions: [
        'Manage all workspaces',
        'Invite and remove users',
        'Configure company settings',
        'Access billing and subscriptions',
        'Manage integrations',
        'View all analytics and reports'
      ]
    },
    {
      id: 'manager',
      title: 'Project Manager',
      description: 'Can create and manage projects, assign tasks, and oversee team progress.',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
      permissions: [
        'Create and manage projects',
        'Assign tasks to team members',
        'View team analytics',
        'Manage project deadlines',
        'Access project reports',
        'Configure project settings'
      ]
    },
    {
      id: 'team_lead',
      title: 'Team Lead',
      description: 'Lead a specific team with permissions to manage team members and their tasks.',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
      permissions: [
        'Manage team members',
        'Assign and review tasks',
        'View team performance',
        'Create team workspaces',
        'Manage team calendar',
        'Access team analytics'
      ]
    },
    {
      id: 'member',
      title: 'Team Member',
      description: 'Standard access to assigned projects and tasks. Can collaborate and contribute to team goals.',
      icon: '👨‍💼',
      color: 'from-purple-500 to-pink-500',
      permissions: [
        'Access assigned projects',
        'Create and update tasks',
        'Collaborate with team',
        'View project timelines',
        'Update task status',
        'Participate in discussions'
      ]
    },
    {
      id: 'viewer',
      title: 'Viewer',
      description: 'Read-only access to projects and reports. Great for stakeholders and clients.',
      icon: '👀',
      color: 'from-gray-500 to-gray-600',
      permissions: [
        'View assigned projects',
        'Access project reports',
        'View team calendar',
        'Read project updates',
        'Access shared documents',
        'View project analytics'
      ]
    },
    {
      id: 'custom',
      title: 'Custom Role',
      description: 'Create a custom role with specific permissions tailored to your needs.',
      icon: '⚙️',
      color: 'from-indigo-500 to-purple-500',
      permissions: []
    }
  ];

  const allPermissions = [
    'Manage workspaces',
    'Invite users',
    'Remove users',
    'Create projects',
    'Delete projects',
    'Assign tasks',
    'View analytics',
    'Manage billing',
    'Configure integrations',
    'Access reports',
    'Manage company settings',
    'View team performance'
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setCustomPermissions([]);
  };

  const handlePermissionToggle = (permission: string) => {
    setCustomPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    
    try {
      // TODO: Call API to save role assignment
      console.log('Role assignment:', { 
        role: selectedRole, 
        customPermissions: selectedRole === 'custom' ? customPermissions : undefined 
      });
      
      // Store in localStorage temporarily
      const existingData = JSON.parse(localStorage.getItem('userOnboardingData') || '{}');
      localStorage.setItem('userOnboardingData', JSON.stringify({
        ...existingData,
        role: {
          selectedRole,
          customPermissions: selectedRole === 'custom' ? customPermissions : undefined
        }
      }));
      
      // Navigate to team invitations
      navigate('/onboarding/team-invitations');
    } catch (error) {
      console.error('Error saving role assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step 3 of 6</span>
            <span className="text-sm text-purple-400">Role Assignment</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '33.33%' }}
              animate={{ width: '50%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Choose your role
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the role that best describes your position and responsibilities in your organization.
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative p-6 bg-gray-800/50 border rounded-xl cursor-pointer transition-all duration-300 ${
                selectedRole === role.id
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => handleRoleSelect(role.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Role Icon */}
              <div className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-2xl">{role.icon}</span>
              </div>

              {/* Role Info */}
              <h3 className="text-lg font-semibold text-white mb-2">{role.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{role.description}</p>

              {/* Permissions */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-300 uppercase tracking-wider">Permissions:</p>
                <ul className="space-y-1">
                  {role.permissions.slice(0, 3).map((permission, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-500 rounded-full" />
                      {permission}
                    </li>
                  ))}
                  {role.permissions.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{role.permissions.length - 3} more permissions
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Permissions */}
        {selectedRole === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Select Custom Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPermissions.map((permission) => (
                <motion.label
                  key={permission}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={customPermissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="w-4 h-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-gray-300">{permission}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <motion.button
            type="button"
            onClick={() => navigate('/onboarding/company-setup')}
            className="flex-1 px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedRole || isLoading || (selectedRole === 'custom' && customPermissions.length === 0)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: (!selectedRole || isLoading || (selectedRole === 'custom' && customPermissions.length === 0)) ? 1 : 1.02 }}
            whileTap={{ scale: (!selectedRole || isLoading || (selectedRole === 'custom' && customPermissions.length === 0)) ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Continue'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentOnboardingPage;
