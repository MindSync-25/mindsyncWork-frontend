import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface LocationState {
  boardName: string;
}

const ProjectSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardName } = (location.state as LocationState) || { boardName: 'My Board' };
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const projectTemplates = [
    {
      id: 'custom',
      name: 'Start from Scratch',
      description: 'Create a completely custom workspace tailored to your needs',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'marketing',
      name: 'Marketing Campaign',
      description: 'Track campaigns, content creation, and marketing metrics',
      icon: '📢',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'software',
      name: 'Software Development',
      description: 'Manage sprints, features, bugs, and development cycles',
      icon: '💻',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'sales',
      name: 'Sales Pipeline',
      description: 'Track leads, deals, and sales performance',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'hr',
      name: 'HR & Recruitment',
      description: 'Manage hiring, onboarding, and employee workflows',
      icon: '👥',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'operations',
      name: 'Operations Management',
      description: 'Streamline processes, inventory, and daily operations',
      icon: '⚙️',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const handleContinue = () => {
    if (selectedTemplate) {
      // Navigate to view layout selection
      navigate('/view-layout', { 
        state: { 
          boardName: boardName, 
          template: selectedTemplate 
        }
      });
    }
  };

  const handleSkip = () => {
    navigate('/view-layout', {
      state: { 
        boardName: boardName, 
        template: 'custom' 
      }
    });
  };

  const isValid = selectedTemplate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="mb-6">
            <p className="text-lg text-gray-400 mb-2">Board Name:</p>
            <h2 className="text-2xl font-bold text-white bg-gray-800/30 rounded-lg px-4 py-2 inline-block border border-gray-700/30">
              {boardName}
            </h2>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose a{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              template
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pick a template that matches your workflow, or start from scratch to build something completely custom
          </p>
        </motion.div>

        {/* Template Selection */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              Choose a template
            </h2>
            <p className="text-gray-400">
              Select a pre-built template or start from scratch
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {projectTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                className="group cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="text-center">
                  {/* Icon Circle */}
                  <div className={`relative w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? `bg-gradient-to-br ${template.color} shadow-xl scale-110`
                      : 'bg-gray-800/40 group-hover:bg-gray-700/60 group-hover:scale-105'
                  }`}>
                    <span className="text-4xl transition-transform duration-300">
                      {template.icon}
                    </span>
                    
                    {/* Selection Indicator */}
                    {selectedTemplate === template.id && (
                      <motion.div 
                        className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Template Name */}
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    selectedTemplate === template.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {template.name}
                  </h3>
                  
                  {/* Template Description */}
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    selectedTemplate === template.id ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {template.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/board-setup')}
            className="px-8 py-3 text-gray-400 hover:text-white transition-colors text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          
          <motion.button
            onClick={handleSkip}
            className="px-8 py-3 text-gray-400 hover:text-white transition-colors text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip for now
          </motion.button>
          
          <motion.button
            onClick={handleContinue}
            disabled={!isValid}
            className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
              isValid
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={isValid ? { scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" } : {}}
            whileTap={isValid ? { scale: 0.95 } : {}}
          >
            Create Workspace
          </motion.button>
        </motion.div>

        {/* Help Text */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm">
            Don't worry, you can always change the name and add more projects later
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectSetupPage;
