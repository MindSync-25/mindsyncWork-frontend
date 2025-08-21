import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardWidget {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'overview' | 'analytics' | 'tracking' | 'team';
  color: string;
  chartType: 'bar' | 'line' | 'pie' | 'donut' | 'area' | 'histogram' | 'gauge' | 'table' | 'kanban' | 'timeline';
  visualization: string; // Description of the chart visualization
}

const DashboardWidgetsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const boardName = location.state?.boardName || 'My Board';
  const template = location.state?.template || 'custom';
  const templateData = location.state?.templateData; // Added missing templateData
  const columns = location.state?.columns || [];
  const viewLayout = location.state?.viewLayout || 'table';

  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(['taskOverview', 'statusChart', 'teamWorkload', 'timeTracking']);

  const dashboardWidgets: DashboardWidget[] = [
    // Overview
    { 
      id: 'taskOverview', 
      name: 'Task Overview', 
      icon: '📊', 
      description: 'Summary cards with task counts and status', 
      category: 'overview', 
      color: 'bg-blue-500',
      chartType: 'table',
      visualization: 'Summary cards with numbers'
    },
    { 
      id: 'projectProgress', 
      name: 'Project Progress', 
      icon: '📈', 
      description: 'Linear progress bar with percentage completion', 
      category: 'overview', 
      color: 'bg-green-500',
      chartType: 'gauge',
      visualization: 'Progress gauge (0-100%)'
    },
    { 
      id: 'recentActivity', 
      name: 'Recent Activity', 
      icon: '🔔', 
      description: 'Timeline list of recent updates and changes', 
      category: 'overview', 
      color: 'bg-purple-500',
      chartType: 'timeline',
      visualization: 'Activity timeline list'
    },
    { 
      id: 'quickStats', 
      name: 'Quick Stats', 
      icon: '⚡', 
      description: 'Key metrics dashboard with multiple gauges', 
      category: 'overview', 
      color: 'bg-cyan-500',
      chartType: 'gauge',
      visualization: 'Multiple mini gauges'
    },
    
    // Analytics
    { 
      id: 'statusChart', 
      name: 'Status Breakdown', 
      icon: '🎯', 
      description: 'Pie chart showing task status distribution', 
      category: 'analytics', 
      color: 'bg-orange-500',
      chartType: 'pie',
      visualization: 'Pie chart with status colors'
    },
    { 
      id: 'timeTracking', 
      name: 'Time Analytics', 
      icon: '⏱️', 
      description: 'Line graph showing time spent trends over days', 
      category: 'analytics', 
      color: 'bg-indigo-500',
      chartType: 'line',
      visualization: 'Multi-line time trends'
    },
    { 
      id: 'priorityDistribution', 
      name: 'Priority Distribution', 
      icon: '🔥', 
      description: 'Horizontal bar chart by priority levels', 
      category: 'analytics', 
      color: 'bg-red-500',
      chartType: 'bar',
      visualization: 'Horizontal bar chart'
    },
    { 
      id: 'completionTrends', 
      name: 'Completion Trends', 
      icon: '📉', 
      description: 'Area chart showing task completion over time', 
      category: 'analytics', 
      color: 'bg-teal-500',
      chartType: 'area',
      visualization: 'Stacked area chart'
    },
    
    // Tracking
    { 
      id: 'upcomingDeadlines', 
      name: 'Upcoming Deadlines', 
      icon: '📅', 
      description: 'Calendar heatmap with deadline intensity', 
      category: 'tracking', 
      color: 'bg-amber-500',
      chartType: 'timeline',
      visualization: 'Calendar timeline view'
    },
    { 
      id: 'overdueItems', 
      name: 'Overdue Items', 
      icon: '⚠️', 
      description: 'Table list with overdue task details', 
      category: 'tracking', 
      color: 'bg-rose-500',
      chartType: 'table',
      visualization: 'Priority sorted table'
    },
    { 
      id: 'milestones', 
      name: 'Milestones', 
      icon: '🎖️', 
      description: 'Timeline showing project milestone progress', 
      category: 'tracking', 
      color: 'bg-yellow-500',
      chartType: 'timeline',
      visualization: 'Milestone timeline'
    },
    { 
      id: 'blockedTasks', 
      name: 'Blocked Tasks', 
      icon: '🚫', 
      description: 'Kanban-style board showing blocked items', 
      category: 'tracking', 
      color: 'bg-gray-500',
      chartType: 'kanban',
      visualization: 'Kanban board layout'
    },
    
    // Team
    { 
      id: 'teamWorkload', 
      name: 'Team Workload', 
      icon: '👥', 
      description: 'Stacked bar chart showing work per team member', 
      category: 'team', 
      color: 'bg-pink-500',
      chartType: 'bar',
      visualization: 'Stacked bar chart'
    },
    { 
      id: 'teamPerformance', 
      name: 'Team Performance', 
      icon: '🏆', 
      description: 'Histogram showing productivity distribution', 
      category: 'team', 
      color: 'bg-emerald-500',
      chartType: 'histogram',
      visualization: 'Performance histogram'
    },
    { 
      id: 'collaboration', 
      name: 'Collaboration Hub', 
      icon: '🤝', 
      description: 'Activity feed with team communication metrics', 
      category: 'team', 
      color: 'bg-violet-500',
      chartType: 'timeline',
      visualization: 'Activity feed timeline'
    },
    { 
      id: 'availability', 
      name: 'Team Availability', 
      icon: '🟢', 
      description: 'Donut chart showing team availability status', 
      category: 'team', 
      color: 'bg-lime-500',
      chartType: 'donut',
      visualization: 'Availability donut chart'
    }
  ];

  const categories = [
    { id: 'overview', name: 'Overview', description: 'Summary cards, gauges & timelines' },
    { id: 'analytics', name: 'Analytics', description: 'Charts, graphs & data visualization' },
    { id: 'tracking', name: 'Tracking', description: 'Progress timelines & monitoring' },
    { id: 'team', name: 'Team', description: 'Collaboration metrics & performance' }
  ];

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleContinue = () => {
    navigate('/dashboard', { 
      state: { 
        boardName, 
        template, 
        templateData, // Added missing templateData
        columns,
        widgets: selectedWidgets,
        viewLayout 
      }
    });
  };

  const getSelectedWidgetsByCategory = (categoryId: string) => {
    return dashboardWidgets
      .filter(widget => widget.category === categoryId && selectedWidgets.includes(widget.id))
      .length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-7xl mx-auto p-8">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
              </svg>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Setup your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                dashboard widgets
              </span>
            </h1>
            
            <p className="text-gray-400 text-base">
              Choose the insights and analytics that matter most to your workflow
            </p>
          </motion.div>

          {/* Live Preview - Top Section */}
          <motion.div 
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Dashboard Preview
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {selectedWidgets.length} widgets selected
                </span>
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs text-purple-400 font-semibold">
                  {selectedWidgets.length}
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedWidgets.slice(0, 6).map((widgetId) => {
                const widget = dashboardWidgets.find(w => w.id === widgetId);
                return (
                  <motion.div 
                    key={widgetId}
                    className="bg-gray-900/50 rounded-lg border border-gray-700/30 p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg">{widget?.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-300 block">
                          {widget?.name}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {widget?.chartType} chart
                        </span>
                      </div>
                    </div>
                    <div className="h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded border border-purple-500/20 flex items-center justify-center relative overflow-hidden">
                      {/* Chart Type Visual Indicator */}
                      {widget?.chartType === 'pie' && (
                        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full"></div>
                      )}
                      {widget?.chartType === 'donut' && (
                        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent border-b-transparent rounded-full"></div>
                      )}
                      {widget?.chartType === 'bar' && (
                        <div className="flex items-end gap-1">
                          <div className="w-2 h-6 bg-purple-400 rounded-sm"></div>
                          <div className="w-2 h-4 bg-purple-300 rounded-sm"></div>
                          <div className="w-2 h-8 bg-purple-500 rounded-sm"></div>
                          <div className="w-2 h-3 bg-purple-300 rounded-sm"></div>
                        </div>
                      )}
                      {widget?.chartType === 'line' && (
                        <svg className="w-12 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 48 32">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 24L12 16L20 20L28 12L36 16L44 8" />
                        </svg>
                      )}
                      {widget?.chartType === 'area' && (
                        <svg className="w-12 h-8 text-purple-400" fill="currentColor" viewBox="0 0 48 32">
                          <path d="M4 24L12 16L20 20L28 12L36 16L44 8V28H4Z" opacity="0.3" />
                          <path fill="none" stroke="currentColor" strokeWidth="2" d="M4 24L12 16L20 20L28 12L36 16L44 8" />
                        </svg>
                      )}
                      {widget?.chartType === 'gauge' && (
                        <div className="relative">
                          <div className="w-8 h-4 border-4 border-purple-400 border-b-transparent rounded-t-full"></div>
                          <div className="absolute top-2 left-3 w-0.5 h-2 bg-purple-500 transform rotate-45 origin-bottom"></div>
                        </div>
                      )}
                      {widget?.chartType === 'histogram' && (
                        <div className="flex items-end gap-0.5">
                          <div className="w-1.5 h-3 bg-purple-300 rounded-sm"></div>
                          <div className="w-1.5 h-5 bg-purple-400 rounded-sm"></div>
                          <div className="w-1.5 h-8 bg-purple-500 rounded-sm"></div>
                          <div className="w-1.5 h-6 bg-purple-400 rounded-sm"></div>
                          <div className="w-1.5 h-4 bg-purple-300 rounded-sm"></div>
                          <div className="w-1.5 h-2 bg-purple-300 rounded-sm"></div>
                        </div>
                      )}
                      {widget?.chartType === 'table' && (
                        <div className="grid grid-cols-3 gap-1">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-2 h-1 bg-purple-400 rounded-sm opacity-60"></div>
                          ))}
                        </div>
                      )}
                      {widget?.chartType === 'kanban' && (
                        <div className="flex gap-1">
                          <div className="flex flex-col gap-0.5">
                            <div className="w-2 h-1.5 bg-purple-400 rounded-sm"></div>
                            <div className="w-2 h-1 bg-purple-300 rounded-sm"></div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="w-2 h-1 bg-purple-300 rounded-sm"></div>
                            <div className="w-2 h-1.5 bg-purple-500 rounded-sm"></div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="w-2 h-1.5 bg-purple-400 rounded-sm"></div>
                          </div>
                        </div>
                      )}
                      {widget?.chartType === 'timeline' && (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            <div className="w-6 h-0.5 bg-purple-300 rounded"></div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            <div className="w-4 h-0.5 bg-purple-400 rounded"></div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                            <div className="w-5 h-0.5 bg-purple-300 rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-400 block">
                        {widget?.visualization}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              {selectedWidgets.length > 6 && (
                <div className="bg-gray-900/30 rounded-lg border border-gray-700/30 p-4 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    +{selectedWidgets.length - 6} more widgets
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Widget Categories - Compact Design */}
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

                {/* Widget Buttons */}
                <div className="flex flex-wrap gap-2">
                  {dashboardWidgets
                    .filter(widget => widget.category === category.id)
                    .map((widget, index) => (
                      <motion.button
                        key={widget.id}
                        className={`group inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedWidgets.includes(widget.id)
                            ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                            : 'bg-gray-800/40 border border-gray-700/40 text-gray-300 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                        onClick={() => toggleWidget(widget.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Selection Indicator */}
                        <div className={`w-3 h-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                          selectedWidgets.includes(widget.id)
                            ? 'border-purple-400 bg-purple-400'
                            : 'border-gray-500 group-hover:border-purple-400'
                        }`}>
                          {selectedWidgets.includes(widget.id) && (
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
                        <span className="text-sm">{widget.icon}</span>
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{widget.name}</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {widget.chartType}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                </div>

                {/* Selected Count */}
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {getSelectedWidgetsByCategory(category.id)} selected
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
              onClick={() => navigate('/workspace-customization', {
                state: { boardName, template, columns }
              })}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={handleContinue}
              disabled={selectedWidgets.length === 0}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedWidgets.length > 0
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedWidgets.length > 0 ? { scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={selectedWidgets.length > 0 ? { scale: 0.95 } : {}}
            >
              Complete Setup
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardWidgetsPage;
