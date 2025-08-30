import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { WorkspaceService } from '../services/workspaceService';
// import type { Workspace } from '../types/workspace';

const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  // const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    description: '',
    color: 'from-blue-500 to-purple-600',
    icon: '💼'
  });

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      // const data = await WorkspaceService.getWorkspaces();
      // setWorkspaces(data);
      // Temporary mock data
      setWorkspaces([]);
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspace.name.trim()) return;

    try {
      // const workspace = await WorkspaceService.createWorkspace({
      //   name: newWorkspace.name.trim(),
      //   description: newWorkspace.description.trim() || undefined,
      //   color: newWorkspace.color,
      //   icon: newWorkspace.icon
      // });

      // setWorkspaces(prev => [...prev, workspace]);
      console.log('Creating workspace:', newWorkspace);
      setCreateModalOpen(false);
      setNewWorkspace({
        name: '',
        description: '',
        color: 'from-blue-500 to-purple-600',
        icon: '💼'
      });
      
      // Navigate to new workspace
      // navigate(`/workspace/${workspace.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const predefinedColors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-red-500 to-pink-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-teal-500 to-green-600',
    'from-orange-500 to-red-600'
  ];

  const predefinedIcons = ['💼', '🏢', '🚀', '🎯', '💡', '⚡', '🔥', '⭐', '🌟', '🎨', '📊', '🔧'];

  const WorkspaceCard = ({ workspace }: { workspace: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/workspace/${workspace.id}`)}
    >
      {/* Workspace Header */}
      <div className={`h-24 bg-gradient-to-br ${workspace.color} relative`}>
        <div className="absolute inset-0 bg-white bg-opacity-10" />
        <div className="absolute top-4 left-4">
          <span className="text-3xl">{workspace.icon}</span>
        </div>
        {workspace.isDefault && (
          <div className="absolute top-3 right-3">
            <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-1 rounded-full">
              Default
            </span>
          </div>
        )}
      </div>

      {/* Workspace Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
          {workspace.name}
        </h3>
        
        {workspace.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {workspace.description}
          </p>
        )}

        {/* Workspace Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Updated {workspace.updatedAt.toLocaleDateString()}</span>
          <div className="flex items-center gap-1">
            <span>Open</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Workspaces
              </h1>
              <p className="text-gray-600">
                Organize your projects, teams, and work in dedicated spaces
              </p>
            </div>
            
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Workspace
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {workspaces.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces yet</h3>
            <p className="text-gray-600 mb-6">Create your first workspace to get started organizing your work.</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setCreateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${newWorkspace.color} p-6 text-white rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{newWorkspace.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">Create Workspace</h2>
                      <p className="text-white text-opacity-90">Set up a new workspace for your projects</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCreateModalOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workspace Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkspace.name}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter workspace name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this workspace..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewWorkspace(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg border-2 ${
                          newWorkspace.color === color ? 'border-gray-900' : 'border-gray-300'
                        } hover:scale-110 transition-transform`}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewWorkspace(prev => ({ ...prev, icon }))}
                        className={`w-10 h-10 text-xl border-2 ${
                          newWorkspace.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        } rounded-lg hover:border-blue-300 transition-colors`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspace.name.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspacesPage;
