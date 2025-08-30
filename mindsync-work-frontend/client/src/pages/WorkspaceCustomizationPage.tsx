import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface WorkspaceColumn {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'essential' | 'tracking' | 'collaboration' | 'management';
  color: string;
}

const WorkspaceCustomizationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const boardName = location.state?.boardName || 'My Board';
  const template = location.state?.template || 'custom';
  const templateData = location.state?.templateData;
  const templateColumns = location.state?.columns || [];

  // If we have template columns, use them as default selection
  const getDefaultColumns = () => {
    if (templateColumns.length > 0) {
      return templateColumns.map((col: any) => col.id);
    }
    return ['task', 'assignee', 'status', 'priority', 'dueDate', 'timeline', 'progress', 'timeTracking'];
  };

  const [selectedColumns, setSelectedColumns] = useState<string[]>(getDefaultColumns());

  const workspaceColumns: WorkspaceColumn[] = [
    // Essential
    { id: 'task', name: 'Task', icon: '📋', description: 'Main task or item description', category: 'essential', color: 'bg-blue-500' },
    { id: 'assignee', name: 'Assignee', icon: '👤', description: 'Person responsible for the task', category: 'essential', color: 'bg-purple-500' },
    { id: 'status', name: 'Status', icon: '🎯', description: 'Current progress state', category: 'essential', color: 'bg-green-500' },
    { id: 'priority', name: 'Priority', icon: '🔥', description: 'Task importance level', category: 'essential', color: 'bg-red-500' },
    
    // Tracking
    { id: 'dueDate', name: 'Due Date', icon: '📅', description: 'Task deadline', category: 'tracking', color: 'bg-orange-500' },
    { id: 'timeline', name: 'Timeline', icon: '📊', description: 'Start and end dates', category: 'tracking', color: 'bg-indigo-500' },
    { id: 'progress', name: 'Progress', icon: '📈', description: 'Completion percentage', category: 'tracking', color: 'bg-cyan-500' },
    { id: 'timeTracking', name: 'Time Tracking', icon: '⏱️', description: 'Hours spent on task', category: 'tracking', color: 'bg-teal-500' },
    
    // Collaboration
    { id: 'comments', name: 'Comments', icon: '💬', description: 'Team discussions', category: 'collaboration', color: 'bg-pink-500' },
    { id: 'attachments', name: 'Files', icon: '📎', description: 'Attached documents', category: 'collaboration', color: 'bg-amber-500' },
    { id: 'mentions', name: 'Mentions', icon: '📢', description: 'Team notifications', category: 'collaboration', color: 'bg-violet-500' },
    { id: 'updates', name: 'Updates', icon: '🔔', description: 'Activity feed', category: 'collaboration', color: 'bg-rose-500' },
    
    // Management
    { id: 'budget', name: 'Budget', icon: '💰', description: 'Cost tracking', category: 'management', color: 'bg-emerald-500' },
    { id: 'location', name: 'Location', icon: '📍', description: 'Geographic info', category: 'management', color: 'bg-slate-500' },
    { id: 'tags', name: 'Tags', icon: '🏷️', description: 'Custom labels', category: 'management', color: 'bg-lime-500' },
    { id: 'dependencies', name: 'Dependencies', icon: '🔗', description: 'Task relationships', category: 'management', color: 'bg-stone-500' }
  ];

  const categories = [
    { id: 'essential', name: 'Essential', description: 'Core workspace columns' },
    { id: 'tracking', name: 'Tracking', description: 'Progress and time management' },
    { id: 'collaboration', name: 'Collaboration', description: 'Team communication' },
    { id: 'management', name: 'Management', description: 'Advanced organization' }
  ];

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleContinue = () => {
    // Build final columns data combining template columns with selection
    const finalColumns = templateColumns.length > 0 ? templateColumns : 
      selectedColumns.map(id => workspaceColumns.find(col => col.id === id)).filter(Boolean);
    
    navigate('/dashboard-widgets', { 
      state: { 
        boardName, 
        template,
        templateData,
        columns: finalColumns
      }
    });
  };

  const getSelectedColumnsByCategory = (categoryId: string) => {
    return workspaceColumns
      .filter(col => col.category === categoryId && selectedColumns.includes(col.id))
      .length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-6xl mx-auto p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Customize columns for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {boardName}
              </span>
            </h1>
            
            <p className="text-gray-400 text-base">
              Choose the columns that matter to your workflow
            </p>
          </motion.div>

          {/* Template-Specific Columns Section */}
          {templateColumns.length > 0 && (
            <motion.div 
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {templateData?.name || 'Template'} Columns
                </h2>
                <p className="text-gray-300 text-sm">
                  Pre-configured columns optimized for this template
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {templateColumns.map((column: any, _index: number) => (
                  <div 
                    key={column.id} 
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-center"
                  >
                    <div className="font-medium text-white text-sm mb-1">
                      {column.name}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {column.type}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  These columns will be automatically set up for your board
                </p>
              </div>
            </motion.div>
          )}

          {/* Live Preview - Top Section */}
          <motion.div 
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Workspace Preview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {selectedColumns.length} columns selected
                </span>
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 font-semibold">
                  {selectedColumns.length}
                </div>
              </div>
            </div>

            {/* Preview Table */}
            <div className="bg-gray-900/50 rounded-lg border border-gray-700/30 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-800/50 border-b border-gray-700/30">
                <div className="flex items-center p-3 gap-4">
                  {selectedColumns.slice(0, 6).map((columnId) => {
                    const column = workspaceColumns.find(col => col.id === columnId);
                    return (
                      <motion.div 
                        key={columnId}
                        className="flex-1 flex items-center gap-2 min-w-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm">{column?.icon}</span>
                        <span className="text-xs font-medium text-gray-300 truncate">
                          {column?.name}
                        </span>
                      </motion.div>
                    );
                  })}
                  {selectedColumns.length > 6 && (
                    <div className="text-xs text-gray-500">
                      +{selectedColumns.length - 6} more
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sample Rows */}
              {[
                { task: 'Design landing page', assignee: 'Alex', status: 'In Progress', priority: 'High' },
                { task: 'Set up database', assignee: 'Jordan', status: 'To Do', priority: 'Medium' }
              ].map((row, index) => (
                <motion.div 
                  key={index}
                  className="border-b border-gray-700/20 last:border-b-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="flex items-center p-3 gap-4 hover:bg-gray-800/30 transition-colors">
                    {selectedColumns.slice(0, 6).map((columnId) => (
                      <div key={columnId} className="flex-1 min-w-0">
                        <span className="text-xs text-gray-300 truncate block">
                          {row[columnId as keyof typeof row] || '—'}
                        </span>
                      </div>
                    ))}
                    {selectedColumns.length > 6 && (
                      <div className="text-xs text-gray-500">...</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Categories - Compact Design */}
          {categories.map((category, categoryIndex) => (
            <motion.div 
              key={category.id}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                {/* Category Label */}
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-white whitespace-nowrap">
                    {category.name}
                  </h2>
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Column Buttons */}
                <div className="flex flex-wrap gap-2">
                  {workspaceColumns
                    .filter(column => column.category === category.id)
                    .map((column, index) => (
                      <motion.button
                        key={column.id}
                        className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedColumns.includes(column.id)
                            ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                            : 'bg-gray-800/40 border border-gray-700/40 text-gray-300 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                        onClick={() => toggleColumn(column.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Selection Indicator */}
                        <div className={`w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                          selectedColumns.includes(column.id)
                            ? 'border-purple-400 bg-purple-400'
                            : 'border-gray-500 group-hover:border-purple-400'
                        }`}>
                          {selectedColumns.includes(column.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            >
                              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Icon and Text */}
                        <span className="text-sm">{column.icon}</span>
                        <span className="text-sm">{column.name}</span>
                      </motion.button>
                    ))}
                </div>

                {/* Selected Count */}
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {getSelectedColumnsByCategory(category.id)} selected
                </div>
              </div>
            </motion.div>
          ))}

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-6 justify-center items-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/project-setup')}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={handleContinue}
              disabled={selectedColumns.length === 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedColumns.length > 0
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedColumns.length > 0 ? { scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={selectedColumns.length > 0 ? { scale: 0.95 } : {}}
            >
              Create Workspace
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkspaceCustomizationPage;
