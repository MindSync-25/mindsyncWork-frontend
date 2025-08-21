import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string>('');

  const goals = [
    { id: 'work', label: 'Work', description: 'Manage projects and collaborate with teams', icon: '💼' },
    { id: 'personal', label: 'Personal', description: 'Organize personal tasks and goals', icon: '🏠' },
    { id: 'school', label: 'School', description: 'Academic projects and assignments', icon: '🎓' },
    { id: 'nonprofits', label: 'Nonprofits', description: 'Non-profit organization management', icon: '❤️' }
  ];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      console.log('Selected goal:', selectedGoal);
      
      // Navigate to role selection for ALL goals with the goal type as parameter
      navigate(`/role-selection?goal=${selectedGoal}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      
      {/* Left Side - Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center mb-8">
              <h1 className="text-3xl font-bold tracking-wide">
                <span className="text-white">Mindsync</span> <span className="text-purple-400">Work</span>
              </h1>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Hey there, what brings you here today?
            </h2>
            
            {/* Goal Selection - Clean Grid Style */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {goals.map((goal, index) => (
                <motion.button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`group relative flex flex-col items-center p-8 transition-all duration-300 ${
                    selectedGoal === goal.id ? '' : 'hover:scale-105'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: selectedGoal === goal.id ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={selectedGoal === goal.id}
                  aria-label={goal.label}
                >
                  {/* Circular highlight background */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    selectedGoal === goal.id
                      ? 'bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent border-2 border-purple-500 shadow-lg shadow-purple-500/30'
                      : 'bg-transparent border-2 border-transparent group-hover:border-purple-400/50 group-hover:bg-purple-500/5'
                  }`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Icon */}
                    <div className={`text-6xl mb-4 transition-all duration-300 ${
                      selectedGoal === goal.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {goal.icon}
                    </div>
                    
                    {/* Label */}
                    <div className={`text-xl font-semibold text-center transition-colors min-w-[140px] mb-2 ${
                      selectedGoal === goal.id ? 'text-purple-300' : 'text-white group-hover:text-purple-200'
                    }`}>
                      {goal.label}
                    </div>

                    {/* Description */}
                    <div className={`text-sm text-center transition-colors max-w-[160px] ${
                      selectedGoal === goal.id ? 'text-purple-200/80' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {goal.description}
                    </div>
                  </div>

                  {/* Selection indicator - small dot */}
                  {selectedGoal === goal.id && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Continue Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={handleContinue}
              disabled={!selectedGoal}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center mx-auto ${
                selectedGoal
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedGoal ? { scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={selectedGoal ? { scale: 0.95 } : {}}
              aria-disabled={!selectedGoal}
            >
              Continue
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                width="20" 
                height="20" 
                className="ml-2"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <motion.div 
        className="hidden lg:flex flex-1 relative overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Background Gradient - Match your app theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"></div>
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div 
            className="text-center text-white max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Large Icon */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Welcome to Your Success Journey
            </motion.h3>
            
            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Let's personalize your experience to help you achieve your goals faster
            </motion.p>

            {/* Feature icons */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                { icon: '🎯', text: 'Goal Focused' },
                { icon: '⚡', text: 'Fast Setup' },
                { icon: '🔒', text: 'Secure' },
                { icon: '🚀', text: 'Ready to Go' }
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm text-white/80">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements for added visual interest */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-12 w-8 h-8 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-12 w-10 h-10 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Decorative gradient shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl"></div>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
