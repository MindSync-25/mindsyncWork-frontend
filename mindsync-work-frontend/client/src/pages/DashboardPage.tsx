import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import MondayBoard from './MondayBoard';
import LeftSidebar from '../components/LeftSidebar';
import MyWorkPage from './MyWorkPage';
import DashboardReportingPage from './DashboardReportingPage';

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(true); // Back to true for welcome screen
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'my-work' | 'dashboard-reporting' | 'more'>('home');
  const boardName = location.state?.boardName || 'My Board';
  const template = location.state?.template || 'custom';
  const templateData = location.state?.templateData;
  const columns = location.state?.columns || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigationChange = (view: 'home' | 'my-work' | 'dashboard-reporting' | 'more') => {
    setActiveView(view);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'my-work':
        return <MyWorkPage />;
      case 'dashboard-reporting':
        return <DashboardReportingPage boardName={boardName} />;
      case 'home':
      default:
        return <MondayBoard boardName={boardName} template={template} templateData={templateData} columns={columns} />;
    }
  };

  if (!showWelcome) {
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeView={activeView}
          onNavigationChange={handleNavigationChange}
          boardName={boardName}
        />
        {renderMainContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <motion.div 
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mindsync Work
            </span>
          </h1>
          
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Your board "{boardName}" is ready! You're all set to transform your team's productivity.
          </p>
        </motion.div>

        {/* Success Animation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        >
          <div className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 500, damping: 30 }}
            >
              <svg className="w-16 h-16 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Workspace Created Successfully!
          </h2>
          <p className="text-gray-400">
            Your journey to better productivity starts now
          </p>
        </motion.div>

        {/* Workspace Summary */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Project Info */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Board Name
              </h3>
              <p className="text-purple-300 font-medium">
                {boardName}
              </p>
            </div>

            {/* Template */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4l8.485-8.485a2 2 0 000-2.828l-2.828-2.829a2 2 0 00-2.829 0L7 9.172V17z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Template Type
              </h3>
              <p className="text-pink-300 font-medium capitalize">
                {template.replace(/([A-Z])/g, ' $1').trim() || 'Custom Setup'}
              </p>
            </div>

            {/* Columns */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Configured Columns
              </h3>
              <p className="text-cyan-300 font-medium">
                {columns.length} columns selected
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            What's Next?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-left">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-white mb-1">Invite Your Team</h4>
              <p className="text-gray-400 text-sm">Get your colleagues on board and start collaborating</p>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 text-left">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-semibold text-white mb-1">Create Tasks</h4>
              <p className="text-gray-400 text-sm">Start adding your first tasks and projects</p>
            </div>
          </div>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => setShowWelcome(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-12 rounded-2xl transition-all duration-300 shadow-lg text-lg flex items-center gap-3"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Go to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
