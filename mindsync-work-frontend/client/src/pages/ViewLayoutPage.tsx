import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface ViewLayout {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  color: string;
  isDefault?: boolean;
}

const ViewLayoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedView, setSelectedView] = useState<string>('table');

  const viewLayouts: ViewLayout[] = [
    {
      id: 'table',
      name: 'Table',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <rect width="24" height="24" rx="4" fill="#784BD1"></rect>
          <path d="M7.2 6.40002C6.31634 6.40002 5.6 7.11637 5.6 8.00002V16C5.6 16.8837 6.31634 17.6 7.2 17.6H16.8C17.6837 17.6 18.4 16.8837 18.4 16V8.00002C18.4 7.11637 17.6837 6.40002 16.8 6.40002H7.2ZM14.4 7.60002H12.4V9.60002H14.4V7.60002ZM15.6 7.60002V9.60002H17.2V8.00002C17.2 7.77911 17.0209 7.60002 16.8 7.60002H15.6ZM14.4 10.8H12.4L12.4 12.8H14.4L14.4 10.8ZM15.6 12.8L15.6 10.8H17.2V12.8H15.6ZM14.4 14H12.4V16.4H14.4V14ZM15.6 16.4V14H17.2V16C17.2 16.2209 17.0209 16.4 16.8 16.4H15.6ZM7.2 7.60002H11.2V9.60002H6.8V8.00002C6.8 7.77911 6.97908 7.60002 7.2 7.60002ZM6.8 10.8H11.2V12.8H6.8V10.8ZM6.8 14H11.2V16.4H7.2C6.97908 16.4 6.8 16.2209 6.8 16V14Z" fill="#fff" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      ),
      description: 'Plan, track and manage anything using a visual table',
      color: 'bg-purple-600',
      isDefault: true
    },
    {
      id: 'gantt',
      name: 'Gantt',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M 3.332031 0 L 16.667969 0 C 18.507812 0 20 1.492188 20 3.332031 L 20 16.667969 C 20 18.507812 18.507812 20 16.667969 20 L 3.332031 20 C 1.492188 20 0 18.507812 0 16.667969 L 0 3.332031 C 0 1.492188 1.492188 0 3.332031 0 Z M 3.332031 0" fill="#037f4c"></path>
          <path d="M 4.832031 6.667969 C 4.832031 6.390625 5.058594 6.167969 5.332031 6.167969 L 10.546875 6.167969 C 10.824219 6.167969 11.046875 6.390625 11.046875 6.667969 C 11.046875 6.941406 10.824219 7.167969 10.546875 7.167969 L 5.332031 7.167969 C 5.058594 7.167969 4.832031 6.941406 4.832031 6.667969 Z M 6.832031 10.144531 C 6.832031 9.867188 7.058594 9.644531 7.332031 9.644531 L 12.546875 9.644531 C 12.824219 9.644531 13.046875 9.867188 13.046875 10.144531 C 13.046875 10.417969 12.824219 10.644531 12.546875 10.644531 L 7.332031 10.644531 C 7.058594 10.644531 6.832031 10.417969 6.832031 10.144531 Z M 8.167969 13.621094 C 8.167969 13.34375 8.390625 13.121094 8.667969 13.121094 L 14.230469 13.121094 C 14.503906 13.121094 14.730469 13.34375 14.730469 13.621094 C 14.730469 13.894531 14.503906 14.121094 14.230469 14.121094 L 8.667969 14.121094 C 8.390625 14.121094 8.167969 13.894531 8.167969 13.621094 Z M 8.167969 13.621094" fill="#fff" fillRule="evenodd"></path>
        </svg>
      ),
      description: 'Timeline view for project planning and dependencies',
      color: 'bg-green-600'
    },
    {
      id: 'cards',
      name: 'Cards',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M 3.332031 0 L 16.667969 0 C 18.507812 0 20 1.492188 20 3.332031 L 20 16.667969 C 20 18.507812 18.507812 20 16.667969 20 L 3.332031 20 C 1.492188 20 0 18.507812 0 16.667969 L 0 3.332031 C 0 1.492188 1.492188 0 3.332031 0 Z M 3.332031 0" fill="#ff642e"></path>
          <path d="M 6.132812 15.367188 C 5.304688 15.367188 4.632812 14.695312 4.632812 13.867188 L 4.632812 6.132812 C 4.632812 5.304688 5.304688 4.632812 6.132812 4.632812 L 10.132812 4.632812 C 10.960938 4.632812 11.632812 5.304688 11.632812 6.132812 L 11.632812 13.867188 C 11.632812 14.695312 10.960938 15.367188 10.132812 15.367188 Z M 5.632812 13.867188 C 5.632812 14.144531 5.855469 14.367188 6.132812 14.367188 L 10.132812 14.367188 C 10.410156 14.367188 10.632812 14.144531 10.632812 13.867188 L 10.632812 6.132812 C 10.632812 5.855469 10.410156 5.632812 10.132812 5.632812 L 6.132812 5.632812 C 5.855469 5.632812 5.632812 5.855469 5.632812 6.132812 Z M 5.632812 13.867188" fill="#fff" fillRule="evenodd"></path>
          <path d="M13 14.5C12.722656 14.5 12.5 14.277344 12.5 14L12.5 6C12.5 5.722656 12.722656 5.5 13 5.5 13.277344 5.5 13.5 5.722656 13.5 6L13.5 14C13.5 14.277344 13.277344 14.5 13 14.5zM14.367188 13.554688C14.367188 13.832031 14.589844 14.054688 14.867188 14.054688 15.140625 14.054688 15.367188 13.832031 15.367188 13.554688L15.367188 6.445312C15.367188 6.167969 15.140625 5.945312 14.867188 5.945312 14.589844 5.945312 14.367188 6.167969 14.367188 6.445312zM14.367188 13.554688" fill="#fff"></path>
        </svg>
      ),
      description: 'Card-based layout for visual task management',
      color: 'bg-orange-600'
    },
    {
      id: 'kanban',
      name: 'Kanban',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M 3.332031 0 L 16.667969 0 C 18.507812 0 20 1.492188 20 3.332031 L 20 16.667969 C 20 18.507812 18.507812 20 16.667969 20 L 3.332031 20 C 1.492188 20 0 18.507812 0 16.667969 L 0 3.332031 C 0 1.492188 1.492188 0 3.332031 0 Z M 3.332031 0" fill="#2b76e5"></path>
          <path d="M 10.964844 15.332031 C 11.269531 15.332031 11.5625 15.210938 11.777344 14.996094 C 11.996094 14.777344 12.117188 14.484375 12.117188 14.179688 L 12.117188 10.003906 L 14.183594 10.003906 C 14.488281 10.003906 14.78125 9.882812 14.996094 9.667969 C 15.210938 9.453125 15.332031 9.15625 15.332031 8.851562 L 15.332031 5.175781 C 15.332031 4.894531 15.105469 4.667969 14.824219 4.667969 L 11.609375 4.667969 C 11.605469 4.667969 11.601562 4.667969 11.601562 4.667969 L 8.40625 4.667969 C 8.402344 4.667969 8.398438 4.667969 8.390625 4.667969 L 5.175781 4.667969 C 4.894531 4.667969 4.667969 4.894531 4.667969 5.175781 L 4.667969 11.21875 C 4.667969 11.523438 4.789062 11.816406 5.003906 12.03125 C 5.21875 12.25 5.511719 12.371094 5.816406 12.371094 L 7.882812 12.371094 L 7.882812 14.179688 C 7.882812 14.484375 8.003906 14.777344 8.222656 14.996094 C 8.4375 15.210938 8.730469 15.332031 9.035156 15.332031 Z" fill="#fff" fillRule="evenodd"></path>
        </svg>
      ),
      description: 'Agile board with columns for workflow stages',
      color: 'bg-blue-600'
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M 3.332031 0 L 16.667969 0 C 18.507812 0 20 1.492188 20 3.332031 L 20 16.667969 C 20 18.507812 18.507812 20 16.667969 20 L 3.332031 20 C 1.492188 20 0 18.507812 0 16.667969 L 0 3.332031 C 0 1.492188 1.492188 0 3.332031 0 Z M 3.332031 0" fill="#faa1f1"></path>
          <path d="M 7.40625 4.683594 C 7.683594 4.683594 7.90625 4.90625 7.90625 5.183594 L 7.90625 6.164062 L 11.109375 6.164062 C 11.386719 6.164062 11.609375 6.390625 11.609375 6.664062 C 11.609375 6.941406 11.386719 7.164062 11.109375 7.164062 L 7.90625 7.164062 L 7.90625 8.148438 C 7.90625 8.421875 7.683594 8.648438 7.40625 8.648438 C 7.128906 8.648438 6.90625 8.421875 6.90625 8.148438 L 6.90625 5.183594 C 6.90625 4.90625 7.128906 4.683594 7.40625 4.683594 Z" fill="#fff" fillRule="evenodd"></path>
        </svg>
      ),
      description: 'Calendar view for date-based task planning',
      color: 'bg-pink-500'
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path d="M 3.332031 0 L 16.667969 0 C 18.507812 0 20 1.492188 20 3.332031 L 20 16.667969 C 20 18.507812 18.507812 20 16.667969 20 L 3.332031 20 C 1.492188 20 0 18.507812 0 16.667969 L 0 3.332031 C 0 1.492188 1.492188 0 3.332031 0 Z M 3.332031 0" fill="#fdab3d"></path>
          <path d="M 5.953125 6.667969 C 5.953125 6.390625 6.175781 6.167969 6.453125 6.167969 L 12 6.167969 C 12.277344 6.167969 12.5 6.390625 12.5 6.667969 C 12.5 6.941406 12.277344 7.167969 12 7.167969 L 6.453125 7.167969 C 6.175781 7.167969 5.953125 6.941406 5.953125 6.667969 Z" fill="#fff" fillRule="evenodd"></path>
        </svg>
      ),
      description: 'Timeline view for chronological task visualization',
      color: 'bg-amber-500'
    }
  ];

  const handleViewSelect = (viewId: string) => {
    setSelectedView(viewId);
  };

  const handleBack = () => {
    navigate('/template-selection');
  };

  const handleContinue = () => {
    // Navigate to workspace customization (column selection)
    const boardName = location.state?.boardName || 'My Board';
    const template = location.state?.template || 'custom';
    const templateData = location.state?.templateData;
    const columns = location.state?.columns;
    
    navigate('/workspace-customization', { 
      state: { 
        boardName, 
        template, 
        templateData,
        columns,
        viewLayout: selectedView 
      }
    });
  };

  const selectedViewData = viewLayouts.find(view => view.id === selectedView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      
      {/* Left Panel - View Selection */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold tracking-wide">
                <span className="text-white">Mindsync</span> <span className="text-purple-400">Work</span>
              </h1>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Add a view layout
            </h2>
            <p className="text-gray-300 text-lg">
              Transform the way you see and manage your work with unique views. You can always add more later.
            </p>
          </motion.div>

          {/* View Selection Buttons */}
          <motion.div 
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {viewLayouts.map((view, index) => (
              <motion.button
                key={view.id}
                onClick={() => handleViewSelect(view.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedView === view.id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 bg-gray-800/50 text-white hover:border-purple-400 hover:bg-purple-500/10'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-shrink-0">
                  {view.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base">{view.name}</div>
                  {view.isDefault && (
                    <div className="text-xs text-purple-400 font-medium">Default Layout</div>
                  )}
                </div>
                {selectedView === view.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Info Note */}
          {selectedViewData && (
            <motion.div 
              className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-purple-300 text-sm">
                <span className="font-semibold">{selectedViewData.name} view</span> is your default layout. {selectedViewData.description}
              </p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              className="flex items-center px-6 py-3 border-2 border-gray-600 bg-gray-800/50 text-white rounded-xl hover:border-gray-500 hover:bg-gray-700/50 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.24 9.444a.77.77 0 0 0 0 1.116l4.363 4.21a.84.84 0 0 0 1.157 0 .77.77 0 0 0 0-1.116l-3.785-3.652 3.785-3.653a.77.77 0 0 0 0-1.116.84.84 0 0 0-1.157 0L7.24 9.443Z"></path>
              </svg>
              Back
            </motion.button>

            {/* Continue Button */}
            <motion.button
              onClick={handleContinue}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z"></path>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-2xl bg-gray-100 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Preview Header */}
          <div className="bg-white p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">My Workspace</h3>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {selectedViewData?.name}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2.25C10.4142 2.25 10.75 2.58579 10.75 3V9.25H17C17.4142 9.25 17.75 9.58579 17.75 10C17.75 10.4142 17.4142 10.75 17 10.75H10.75V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17V10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H9.25V3C9.25 2.58579 9.58579 2.25 10 2.25Z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-2 py-1 bg-purple-600 text-white rounded text-sm font-medium">
                {selectedViewData?.name}
              </div>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-3 bg-gray-50 h-80 overflow-hidden">
            {selectedView === 'table' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full">
                {/* Table Header */}
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <div className="flex items-center gap-1">
                      <input type="checkbox" className="w-2 h-2 rounded border-gray-300" />
                      <span>Task</span>
                    </div>
                    <div>Person</div>
                    <div>Status</div>
                    <div>Priority</div>
                    <div>Timeline</div>
                  </div>
                </div>
                
                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {[
                    { 
                      task: 'Design homepage', 
                      person: 'JD', 
                      status: { label: 'Working', color: 'bg-orange-500' }, 
                      priority: 'High',
                      timeline: { start: 10, width: 30, color: 'bg-orange-400' }
                    },
                    { 
                      task: 'Backend API', 
                      person: 'SC', 
                      status: { label: 'Done', color: 'bg-green-500' }, 
                      priority: 'High',
                      timeline: { start: 5, width: 25, color: 'bg-green-400' }
                    },
                    { 
                      task: 'User testing', 
                      person: 'MW', 
                      status: { label: 'Stuck', color: 'bg-red-500' }, 
                      priority: 'Med',
                      timeline: { start: 40, width: 35, color: 'bg-red-400' }
                    }
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-xs">
                      <div className="flex items-center gap-1">
                        <input type="checkbox" className="w-2 h-2 rounded border-gray-300" />
                        <span className="font-medium text-gray-900 truncate">{row.task}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {row.person}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-1.5 py-0.5 ${row.status.color} text-white text-xs rounded-full`}>
                          {row.status.label}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-600">{row.priority}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full h-3 bg-gray-100 rounded relative overflow-hidden">
                          <div 
                            className={`h-full ${row.timeline.color} rounded transition-all duration-300`}
                            style={{ 
                              marginLeft: `${row.timeline.start}%`, 
                              width: `${row.timeline.width}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedView === 'kanban' && (
              <div className="grid grid-cols-3 gap-2 h-full">
                {[
                  { 
                    title: 'To Do', 
                    color: 'bg-gray-50', 
                    headerColor: 'bg-gray-500',
                    tasks: [
                      { title: 'Design research', assignee: 'JD' },
                      { title: 'User flow', assignee: 'SC' }
                    ]
                  },
                  { 
                    title: 'In Progress', 
                    color: 'bg-blue-50', 
                    headerColor: 'bg-blue-500',
                    tasks: [
                      { title: 'Homepage wireframes', assignee: 'LP' },
                      { title: 'API integration', assignee: 'JD' }
                    ]
                  },
                  { 
                    title: 'Done', 
                    color: 'bg-green-50', 
                    headerColor: 'bg-green-500',
                    tasks: [
                      { title: 'User research', assignee: 'SC' },
                      { title: 'Database schema', assignee: 'MW' }
                    ]
                  }
                ].map((column) => (
                  <div key={column.title} className={`${column.color} rounded-lg border border-gray-200 overflow-hidden h-full`}>
                    {/* Column Header */}
                    <div className="p-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${column.headerColor} rounded-full`}></div>
                        <h4 className="font-semibold text-gray-800 text-xs">{column.title}</h4>
                        <span className="bg-white px-1.5 py-0.5 rounded-full text-xs font-medium text-gray-600 border">
                          {column.tasks.length}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tasks */}
                    <div className="p-2 space-y-2">
                      {column.tasks.map((task, j) => (
                        <div key={j} className="bg-white rounded p-2 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-900 text-xs">
                              {task.title}
                            </h5>
                            <div className="flex items-center justify-between">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {task.assignee}
                              </div>
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedView === 'cards' && (
              <div className="grid grid-cols-2 gap-3 h-full overflow-y-auto">
                {[
                  { 
                    title: 'Design homepage', 
                    status: 'Working on it', 
                    statusColor: 'bg-orange-500',
                    assignee: 'JD',
                    progress: 65
                  },
                  { 
                    title: 'Backend API', 
                    status: 'Done', 
                    statusColor: 'bg-green-500',
                    assignee: 'SC',
                    progress: 100
                  },
                  { 
                    title: 'User testing', 
                    status: 'Stuck', 
                    statusColor: 'bg-red-500',
                    assignee: 'MW',
                    progress: 30
                  },
                  { 
                    title: 'Mobile optimization', 
                    status: 'Not started', 
                    statusColor: 'bg-gray-400',
                    assignee: 'LP',
                    progress: 0
                  }
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-fit">
                    {/* Card Content */}
                    <div className="p-3 space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm">{card.title}</h4>
                      
                      {/* Status & Assignee */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 ${card.statusColor} text-white text-xs rounded-full`}>
                          {card.status}
                        </span>
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {card.assignee}
                        </div>
                      </div>
                      
                      {/* Progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-gray-900">{card.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${card.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(selectedView === 'gantt' || selectedView === 'timeline') && (
              <div className="space-y-2 h-full overflow-y-auto">
                {/* Timeline Header */}
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <div className="w-32 text-xs font-semibold text-gray-700">Task</div>
                  <div className="flex-1 grid grid-cols-7 gap-1 text-xs text-gray-600">
                    {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, i) => (
                      <div key={i} className="text-center text-xs">{day}</div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline Tasks */}
                {[
                  { task: 'Design homepage', start: 1, duration: 3, color: 'bg-purple-500', progress: 65 },
                  { task: 'Backend API', start: 2, duration: 4, color: 'bg-blue-500', progress: 100 },
                  { task: 'User testing', start: 4, duration: 2, color: 'bg-orange-500', progress: 30 },
                  { task: 'Mobile optimization', start: 6, duration: 2, color: 'bg-green-500', progress: 0 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <div className="w-32 text-xs text-gray-900 truncate">{item.task}</div>
                    <div className="flex-1 relative">
                      <div className="grid grid-cols-7 gap-1 h-5">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                          const isInRange = dayIndex >= item.start - 1 && dayIndex < item.start - 1 + item.duration;
                          return (
                            <div key={dayIndex} className="relative">
                              {isInRange && (
                                <div className={`${item.color} h-4 rounded-sm shadow-sm flex items-center justify-center relative overflow-hidden`}>
                                  {item.progress > 0 && (
                                    <div 
                                      className="absolute left-0 top-0 h-full bg-white bg-opacity-30"
                                      style={{ width: `${item.progress}%` }}
                                    ></div>
                                  )}
                                  <span className="text-white text-xs font-medium relative z-10">
                                    {dayIndex === item.start - 1 ? item.duration + 'd' : ''}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedView === 'calendar' && (
              <div className="space-y-2 h-full overflow-y-auto">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">August 2024</h4>
                  <button className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    Today
                  </button>
                </div>
                
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-center text-xs font-semibold text-gray-600 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0.5 bg-gray-100 rounded">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isToday = day === 17;
                    const hasEvents = [15, 16, 17, 20, 23].includes(day);
                    
                    return (
                      <div key={i} className={`bg-white p-1 h-8 ${isCurrentMonth ? 'hover:bg-gray-50' : 'bg-gray-50'} transition-colors cursor-pointer flex flex-col justify-start`}>
                        {isCurrentMonth && (
                          <>
                            <div className={`text-xs ${
                              isToday ? 'w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center leading-none' : 'text-gray-700'
                            }`}>
                              {day}
                            </div>
                            
                            {/* Event Dots */}
                            {hasEvents && (
                              <div className="flex gap-0.5 mt-0.5">
                                {day === 15 && <div className="w-1 h-1 bg-purple-400 rounded-full"></div>}
                                {day === 16 && (
                                  <>
                                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                  </>
                                )}
                                {day === 17 && <div className="w-1 h-1 bg-orange-400 rounded-full"></div>}
                                {day === 20 && <div className="w-1 h-1 bg-red-400 rounded-full"></div>}
                                {day === 23 && <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewLayoutPage;
