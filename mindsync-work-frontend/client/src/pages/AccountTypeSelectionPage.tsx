import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AccountTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'PERSONAL' | 'ORGANIZATION' | ''>('');

  const accountTypes = [
    {
      id: 'ORGANIZATION',
      title: 'Organization Account',
      description: 'Perfect for teams and companies. Manage multiple users, projects, and collaborate effectively.',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Multi-user collaboration',
        'Team management',
        'Advanced permissions',
        'Company branding',
        'Enterprise features'
      ]
    },
    {
      id: 'PERSONAL',
      title: 'Personal Account',
      description: 'Ideal for individual users managing their own projects and tasks.',
      icon: '👤',
      color: 'from-blue-500 to-cyan-500', // Changed to blue theme
      features: [
        'Personal workspace',
        'Individual projects',
        'Simple task management',
        'Personal templates',
        'Focused productivity'
      ]
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      // Navigate to registration with account type
      navigate('/register', { state: { accountType: selectedType } });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-3 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2"
          >
            Choose Your Account Type
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base md:text-lg text-gray-400 max-w-xl mx-auto px-4"
          >
            Select the account type that best fits your needs. You can always upgrade later.
          </motion.p>
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 max-w-3xl mx-auto">
          {accountTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedType === type.id
                  ? 'scale-105 shadow-2xl'
                  : 'hover:scale-102 hover:shadow-xl'
              }`}
              onClick={() => setSelectedType(type.id as 'PERSONAL' | 'ORGANIZATION')}
            >
              <div
                className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 md:p-5 h-full border-2 transition-all duration-300 ${
                  selectedType === type.id
                    ? 'border-blue-400 bg-gray-800/80'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {/* Selection indicator */}
                {selectedType === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`text-3xl md:text-4xl mb-3 bg-gradient-to-r ${type.color} bg-clip-text text-transparent`}>
                  {type.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {type.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-3 leading-relaxed text-sm">
                  {type.description}
                </p>

                {/* Features */}
                <div className="space-y-1.5">
                  {type.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${type.color} mr-2 flex-shrink-0`} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 mb-4"
        >
          <button
            onClick={handleBack}
            className="px-4 md:px-6 py-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            ← Back to Home
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
              selectedType
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 shadow-lg'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue to Registration
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center px-4"
        >
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Sign in here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountTypeSelectionPage;
