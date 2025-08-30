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
  const [secondaryView, setSecondaryView] = useState<string>(''); // Only track secondary view

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
    // Don't allow selecting table (it's always default)
    if (viewId !== 'table') {
      setSecondaryView(viewId);
    }
  };

  const handleBack = () => {
    navigate('/template-selection');
  };

  const handleContinue = () => {
    // Only continue if secondary view is selected
    if (!secondaryView) return;
    
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
        primaryView: 'table',
        secondaryView: secondaryView
      }
    });
  };

  const selectedSecondaryData = viewLayouts.find(view => view.id === secondaryView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-3">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Panel - View Selection */}
        <div className="flex flex-col justify-center">
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Add a view layout
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-4">
                Transform the way you see and manage your work with unique views.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-blue-300 text-sm">
                  📋 <strong>Table view</strong> is included by default. Choose one additional view to enhance your workflow.
                </p>
              </div>
            </motion.div>

            {/* View Selection Buttons */}
            <motion.div 
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {viewLayouts.map((view, index) => (
                <motion.button
                  key={view.id}
                  onClick={() => handleViewSelect(view.id)}
                  disabled={view.isDefault}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                    view.isDefault
                      ? 'border-gray-500 bg-gray-600/30 text-gray-400 cursor-not-allowed'
                      : secondaryView === view.id
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 bg-gray-800/50 text-white hover:border-purple-400 hover:bg-purple-500/10'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={!view.isDefault ? { scale: 1.02 } : {}}
                  whileTap={!view.isDefault ? { scale: 0.98 } : {}}
                >
                  <div className="flex-shrink-0">
                    {view.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm md:text-base flex items-center gap-2">
                      {view.name}
                      {view.isDefault && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                  </div>
                  {view.isDefault && (
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {!view.isDefault && secondaryView === view.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                ← Back
              </button>
              
              <button
                onClick={handleContinue}
                disabled={!secondaryView}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  secondaryView
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 shadow-lg'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Columns
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - Chart Demonstration */}
        <div className="flex items-center justify-center">
          <motion.div 
            className="w-full max-w-md bg-gray-800 rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
            
            {/* Chart Preview based on hovered/selected view */}
            <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
              {/* Default Table View */}
              {(!secondaryView || secondaryView === 'table') && (
                <motion.div
                  key="table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                    {viewLayouts[0].icon}
                    Table View
                  </div>
                  {/* Realistic Table Layout */}
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-purple-600 text-white p-2 rounded font-semibold">Task Name</div>
                      <div className="bg-purple-600 text-white p-2 rounded font-semibold">Assignee</div>
                      <div className="bg-purple-600 text-white p-2 rounded font-semibold">Status</div>
                      <div className="bg-purple-600 text-white p-2 rounded font-semibold">Due Date</div>
                    </div>
                    {/* Table Rows */}
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">Design Homepage</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">Sarah Chen</div>
                      <div className="bg-blue-500/20 text-blue-300 p-2 rounded text-center">In Progress</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded text-center">Dec 15</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">API Integration</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">Mike Johnson</div>
                      <div className="bg-green-500/20 text-green-300 p-2 rounded text-center">Completed</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded text-center">Dec 10</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">User Testing</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded">Alex Kim</div>
                      <div className="bg-red-500/20 text-red-300 p-2 rounded text-center">Blocked</div>
                      <div className="bg-gray-700 text-gray-200 p-2 rounded text-center">Dec 20</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-purple-400">
                    Organize tasks in rows and columns with sorting, filtering, and bulk actions
                  </div>
                </motion.div>
              )}

              {/* Kanban Board View */}
              {secondaryView === 'kanban' && (
                <motion.div
                  key="kanban"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
                    {selectedSecondaryData?.icon}
                    Kanban Board
                  </div>
                  {/* Realistic Kanban Layout */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* To Do Column */}
                    <div className="space-y-2">
                      <div className="bg-gray-600 text-gray-200 p-2 rounded text-center text-xs font-semibold">
                        📋 To Do (3)
                      </div>
                      <div className="bg-gray-700 border-l-4 border-blue-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">Design System</div>
                        <div className="text-gray-400 text-xs mt-1">Sarah Chen</div>
                      </div>
                      <div className="bg-gray-700 border-l-4 border-blue-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">User Research</div>
                        <div className="text-gray-400 text-xs mt-1">Alex Kim</div>
                      </div>
                      <div className="bg-gray-700 border-l-4 border-blue-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">Database Schema</div>
                        <div className="text-gray-400 text-xs mt-1">Mike Johnson</div>
                      </div>
                    </div>
                    
                    {/* In Progress Column */}
                    <div className="space-y-2">
                      <div className="bg-orange-600 text-white p-2 rounded text-center text-xs font-semibold">
                        🔄 In Progress (2)
                      </div>
                      <div className="bg-gray-700 border-l-4 border-orange-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">Homepage UI</div>
                        <div className="text-gray-400 text-xs mt-1">Sarah Chen</div>
                      </div>
                      <div className="bg-gray-700 border-l-4 border-orange-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">API Development</div>
                        <div className="text-gray-400 text-xs mt-1">Mike Johnson</div>
                      </div>
                    </div>

                    {/* Done Column */}
                    <div className="space-y-2">
                      <div className="bg-green-600 text-white p-2 rounded text-center text-xs font-semibold">
                        ✅ Done (4)
                      </div>
                      <div className="bg-gray-700 border-l-4 border-green-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">Project Setup</div>
                        <div className="text-gray-400 text-xs mt-1">Team Lead</div>
                      </div>
                      <div className="bg-gray-700 border-l-4 border-green-500 p-2 rounded text-xs">
                        <div className="text-gray-200 font-medium">Requirements</div>
                        <div className="text-gray-400 text-xs mt-1">Product Manager</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-400">
                    Drag and drop cards between columns to track workflow progress
                  </div>
                </motion.div>
              )}

              {/* Calendar View */}
              {secondaryView === 'calendar' && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="text-sm font-medium text-pink-300 mb-3 flex items-center gap-2">
                    {selectedSecondaryData?.icon}
                    Calendar View
                  </div>
                  {/* Realistic Calendar Layout */}
                  <div className="space-y-2">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-300 font-semibold">December 2024</div>
                      <div className="flex gap-1">
                        <button className="w-4 h-4 bg-gray-600 rounded text-xs text-gray-300">‹</button>
                        <button className="w-4 h-4 bg-gray-600 rounded text-xs text-gray-300">›</button>
                      </div>
                    </div>
                    
                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-1">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="bg-purple-600 text-white p-1 rounded text-center text-xs font-semibold">{day}</div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({length: 21}, (_, i) => i + 1).map((day) => (
                        <div key={day} className="bg-gray-700 text-gray-300 p-1 rounded text-center text-xs h-8 relative">
                          <div className="text-xs">{day}</div>
                          {/* Sample Events */}
                          {day === 5 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-b"></div>}
                          {day === 8 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b"></div>}
                          {day === 12 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-b"></div>}
                          {day === 15 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-b"></div>}
                          {day === 18 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-b"></div>}
                        </div>
                      ))}
                    </div>
                    
                    {/* Event Legend */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-1 bg-blue-500 rounded"></div>
                        <span className="text-gray-300">Design Review - Dec 5</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-1 bg-green-500 rounded"></div>
                        <span className="text-gray-300">Sprint Demo - Dec 8</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-pink-400">
                    Schedule tasks and deadlines with date-based organization
                  </div>
                </motion.div>
              )}

              {/* Gantt Chart View */}
              {secondaryView === 'gantt' && (
                <motion.div
                  key="gantt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="text-sm font-medium text-green-300 mb-3 flex items-center gap-2">
                    {selectedSecondaryData?.icon}
                    Gantt Chart
                  </div>
                  {/* Realistic Gantt Layout */}
                  <div className="space-y-2">
                    {/* Timeline Header */}
                    <div className="grid grid-cols-6 gap-1 text-xs">
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Tasks</div>
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Dec 1-5</div>
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Dec 6-10</div>
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Dec 11-15</div>
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Dec 16-20</div>
                      <div className="bg-green-600 text-white p-1 rounded text-center font-semibold">Dec 21-25</div>
                    </div>
                    
                    {/* Project Rows */}
                    <div className="grid grid-cols-6 gap-1 text-xs items-center">
                      <div className="bg-gray-700 text-gray-200 p-1 rounded text-xs">Planning Phase</div>
                      <div className="bg-blue-500 h-4 rounded"></div>
                      <div className="bg-blue-500 h-4 rounded"></div>
                      <div className=""></div>
                      <div className=""></div>
                      <div className=""></div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-1 text-xs items-center">
                      <div className="bg-gray-700 text-gray-200 p-1 rounded text-xs">Design Sprint</div>
                      <div className=""></div>
                      <div className="bg-orange-500 h-4 rounded"></div>
                      <div className="bg-orange-500 h-4 rounded"></div>
                      <div className=""></div>
                      <div className=""></div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-1 text-xs items-center">
                      <div className="bg-gray-700 text-gray-200 p-1 rounded text-xs">Development</div>
                      <div className=""></div>
                      <div className=""></div>
                      <div className="bg-purple-500 h-4 rounded"></div>
                      <div className="bg-purple-500 h-4 rounded"></div>
                      <div className="bg-purple-500 h-4 rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-1 text-xs items-center">
                      <div className="bg-gray-700 text-gray-200 p-1 rounded text-xs">Testing & QA</div>
                      <div className=""></div>
                      <div className=""></div>
                      <div className=""></div>
                      <div className=""></div>
                      <div className="bg-green-500 h-4 rounded"></div>
                    </div>
                    
                    {/* Dependencies */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-300">Critical Path: Planning → Design → Development</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-400">
                    Track project timeline, dependencies, and critical path
                  </div>
                </motion.div>
              )}

              {/* Timeline View */}
              {secondaryView === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="text-sm font-medium text-amber-300 mb-3 flex items-center gap-2">
                    {selectedSecondaryData?.icon}
                    Timeline View
                  </div>
                  {/* Beautiful Timeline Layout */}
                  <div className="relative">
                    {/* Central Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-green-500 rounded-full"></div>
                    
                    {/* Timeline Events */}
                    <div className="space-y-4">
                      {/* Event 1 - Project Start */}
                      <div className="relative flex items-center">
                        <div className="absolute left-6 w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center z-10">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="ml-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-3 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-blue-300 font-semibold text-xs">🚀 Project Kickoff</div>
                            <div className="text-blue-400 text-xs bg-blue-500/20 px-2 py-0.5 rounded">Start</div>
                          </div>
                          <div className="text-gray-300 text-xs">December 1, 2024 • 9:00 AM</div>
                          <div className="text-blue-200 text-xs mt-1">Team assembled, goals defined, timeline set</div>
                        </div>
                      </div>
                      
                      {/* Event 2 - Design Complete */}
                      <div className="relative flex items-center">
                        <div className="absolute left-6 w-5 h-5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center z-10">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="ml-16 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 p-3 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-purple-300 font-semibold text-xs">🎨 Design Phase</div>
                            <div className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded">Milestone</div>
                          </div>
                          <div className="text-gray-300 text-xs">December 8, 2024 • 2:30 PM</div>
                          <div className="text-purple-200 text-xs mt-1">UI/UX designs approved, mockups finalized</div>
                        </div>
                      </div>
                      
                      {/* Event 3 - Development Progress */}
                      <div className="relative flex items-center">
                        <div className="absolute left-6 w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center z-10">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="ml-16 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 p-3 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-orange-300 font-semibold text-xs">⚡ Development Sprint</div>
                            <div className="text-orange-400 text-xs bg-orange-500/20 px-2 py-0.5 rounded">Active</div>
                          </div>
                          <div className="text-gray-300 text-xs">December 15, 2024 • 4:15 PM</div>
                          <div className="text-orange-200 text-xs mt-1">Core features 70% complete, API integration done</div>
                          {/* Progress Bar */}
                          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                            <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 rounded-full w-3/4"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Event 4 - Launch Ready */}
                      <div className="relative flex items-center">
                        <div className="absolute left-6 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center z-10">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-16 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 p-3 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-green-300 font-semibold text-xs">🎯 Launch Ready</div>
                            <div className="text-green-400 text-xs bg-green-500/20 px-2 py-0.5 rounded">Goal</div>
                          </div>
                          <div className="text-gray-300 text-xs">December 22, 2024 • 12:00 PM</div>
                          <div className="text-green-200 text-xs mt-1">Testing complete, deployment ready, go-live!</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Duration Indicator */}
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <div className="text-gray-400">
                        <span className="text-amber-400">●</span> 21 days timeline
                      </div>
                      <div className="text-gray-400">
                        <span className="text-green-400">●</span> 4 major milestones
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-amber-400">
                    Visual project timeline with interactive milestones and progress tracking
                  </div>
                </motion.div>
              )}
            </div>

            {/* Selection Summary */}
            {secondaryView && (
              <motion.div 
                className="mt-4 p-3 bg-gray-700/30 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="text-xs text-gray-400 mb-2">Selected views for your workspace:</div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">✓ Table (Default)</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">✓ {selectedSecondaryData?.name}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ViewLayoutPage;
