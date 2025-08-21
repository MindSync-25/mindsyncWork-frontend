import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BoardSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleContinue = () => {
    if (boardName.trim()) {
      navigate('/template-selection', { 
        state: { boardName: boardName.trim() }
      });
    }
  };

  const suggestedNames = [
    'Project Management',
    'Marketing Campaigns', 
    'Development Sprint',
    'Content Calendar',
    'Team Tasks',
    'Product Roadmap',
    'Bug Tracking',
    'Design Projects'
  ];

  const handleSuggestionClick = (name: string) => {
    setBoardName(name);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What's the name of your{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                board?
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Give your board a name that represents what you'll be working on. This will help you and your team stay organized.
            </p>
          </motion.div>

          {/* Board Name Input */}
          <motion.div 
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="max-w-xl mx-auto">
              <label htmlFor="boardName" className="block text-sm font-medium text-gray-300 mb-3">
                Board Name
              </label>
              <div className="relative">
                <input
                  id="boardName"
                  type="text"
                  value={boardName}
                  onChange={(e) => {
                    setBoardName(e.target.value);
                    setIsTyping(e.target.value.length > 0);
                  }}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(boardName.length > 0)}
                  placeholder="Enter your board name..."
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-lg"
                  autoFocus
                />
                {boardName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Suggestions */}
          {!isTyping && !boardName && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Or choose from popular options:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {suggestedNames.map((name, index) => (
                  <motion.button
                    key={name}
                    onClick={() => handleSuggestionClick(name)}
                    className="p-3 bg-gray-800/40 hover:bg-gray-700/50 border border-gray-700/40 hover:border-purple-500/40 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Preview */}
          {boardName && (
            <motion.div 
              className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Preview:</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-white">{boardName}</h4>
                </div>
                <p className="text-gray-400 text-sm">This will be the name of your board in the dashboard</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/get-started')}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={handleContinue}
              disabled={!boardName.trim()}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                boardName.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={boardName.trim() ? { scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={boardName.trim() ? { scale: 0.95 } : {}}
            >
              Continue to Templates
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BoardSetupPage;
