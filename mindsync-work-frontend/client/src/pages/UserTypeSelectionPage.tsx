import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UserTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'organization_creator',
      title: 'I\'m setting up for my organization',
      description: 'Create and manage workspaces, invite team members, and set up company-wide settings.',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Create company workspace',
        'Invite and manage team members',
        'Set up workflows and templates',
        'Configure company settings',
        'Full administrative control'
      ],
      buttonText: 'Set up my organization',
      route: '/onboarding/user-details' // Comprehensive flow
    },
    {
      id: 'team_member',
      title: 'I\'m joining an existing organization',
      description: 'Join your team\'s workspace with an invitation code or link from your admin.',
      icon: '👨‍💼',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Join existing workspace',
        'Access assigned projects',
        'Collaborate with team',
        'Use company templates',
        'Simplified setup process'
      ],
      buttonText: 'Join my team',
      route: '/onboarding/team-member-join' // Simplified flow
    },
    {
      id: 'individual_user',
      title: 'I\'m using this for personal projects',
      description: 'Set up a personal workspace for your own projects and tasks.',
      icon: '👤',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Personal workspace',
        'Individual project management',
        'Custom workflows',
        'Personal templates',
        'Privacy focused'
      ],
      buttonText: 'Create personal workspace',
      route: '/onboarding/individual-setup' // Personal flow
    }
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    
    try {
      // Store user type selection
      localStorage.setItem('userType', selectedType);
      
      const selectedUserType = userTypes.find(type => type.id === selectedType);
      if (selectedUserType) {
        navigate(selectedUserType.route);
      }
    } catch (error) {
      console.error('Error selecting user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              MindSync Work
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Let's get you set up! First, tell us how you'll be using MindSync Work so we can tailor the experience for you.
          </p>
        </motion.div>

        {/* User Type Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative p-8 bg-gray-800/50 border rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedType === type.id
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20 transform scale-105'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
              }`}
              onClick={() => handleTypeSelect(type.id)}
              whileHover={{ scale: selectedType === type.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              {selectedType === type.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Type Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-3xl">{type.icon}</span>
              </div>

              {/* Type Info */}
              <h3 className="text-xl font-bold text-white mb-4">{type.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{type.description}</p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Selection Button */}
              <motion.div
                className={`w-full py-3 px-4 rounded-xl text-center font-medium transition-all duration-300 ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedType === type.id ? 'Selected' : 'Select this option'}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        {selectedType && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={handleContinue}
              disabled={isLoading}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Setting up...</span>
                </div>
              ) : (
                (() => {
                  const selected = userTypes.find(type => type.id === selectedType);
                  return selected?.buttonText || 'Continue';
                })()
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-400 text-sm mb-4">
            Don't worry - you can always change these settings later or switch between different workspace types.
          </p>
          <button 
            onClick={() => navigate('/get-started')}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Go back to registration
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;
