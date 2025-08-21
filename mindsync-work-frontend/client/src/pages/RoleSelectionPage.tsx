import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [goalType, setGoalType] = useState<string>('work');

  // Get the goal type from URL params or state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const goal = params.get('goal') || 'work';
    setGoalType(goal);
  }, [location]);

  // Dynamic roles based on goal type
  const getRolesForGoal = (goal: string) => {
    switch (goal) {
      case 'work':
        return [
          { id: 'business_owner', label: 'Business Owner', icon: '👑' },
          { id: 'team_leader', label: 'Team Leader', icon: '👨‍💼' },
          { id: 'team_member', label: 'Team Member', icon: '👤' },
          { id: 'freelancer', label: 'Freelancer', icon: '' },
          { id: 'director', label: 'Director', icon: '🎯' },
          { id: 'c_level', label: 'C-Level Executive', icon: '⭐' },
          { id: 'vp', label: 'Vice President', icon: '🏆' }
        ];
      case 'personal':
        return [
          { id: 'entrepreneur', label: 'Aspiring Entrepreneur', icon: '�' },
          { id: 'creative', label: 'Creative Professional', icon: '🎨' },
          { id: 'student', label: 'Lifelong Learner', icon: '📚' },
          { id: 'organizer', label: 'Life Organizer', icon: '📋' },
          { id: 'hobbyist', label: 'Hobby Enthusiast', icon: '🎪' },
          { id: 'parent', label: 'Busy Parent', icon: '👨‍👩‍👧‍👦' }
        ];
      case 'school':
        return [
          { id: 'student', label: 'Student', icon: '🎓' },
          { id: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
          { id: 'administrator', label: 'Administrator', icon: '🏫' },
          { id: 'researcher', label: 'Researcher', icon: '🔬' },
          { id: 'coordinator', label: 'Program Coordinator', icon: '📊' },
          { id: 'tutor', label: 'Tutor/Mentor', icon: '📖' }
        ];
      case 'nonprofits':
        return [
          { id: 'founder', label: 'Founder/Director', icon: '🌟' },
          { id: 'volunteer', label: 'Volunteer', icon: '🤝' },
          { id: 'coordinator', label: 'Program Coordinator', icon: '📋' },
          { id: 'fundraiser', label: 'Fundraiser', icon: '💰' },
          { id: 'advocate', label: 'Community Advocate', icon: '📢' },
          { id: 'board_member', label: 'Board Member', icon: '⚖️' }
        ];
      default:
        return [];
    }
  };

  const roles = getRolesForGoal(goalType);

  const getTitle = (goal: string) => {
    switch (goal) {
      case 'work': return 'What best describes your current role?';
      case 'personal': return 'What best describes your focus?';
      case 'school': return 'What\'s your role in education?';
      case 'nonprofits': return 'What\'s your role in the organization?';
      default: return 'What best describes your role?';
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      console.log('Selected role:', selectedRole, 'for goal:', goalType);
      navigate(`/team-size?goal=${goalType}&role=${selectedRole}`);
    }
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-800 flex items-center justify-center p-8">
      <motion.div 
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8 mx-auto"
            whileHover={{ x: -5 }}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
            </svg>
            Back
          </motion.button>

          <div className="inline-flex items-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide">
              <span className="text-white">Mindsync</span> <span className="text-cyan-400">Work</span>
            </h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {getTitle(goalType).split(' ').map((word, index) => 
              word === 'role?' || word === 'focus?' || word === 'education?' || word === 'organization?' ? (
                <span key={index} className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Help us personalize your workspace for the best experience
          </p>
        </motion.div>

        {/* Modern Role Selection - Clean Grid Style */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`group relative flex flex-col items-center p-6 transition-all duration-300 ${
                selectedRole === role.id ? '' : 'hover:scale-105'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: selectedRole === role.id ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-pressed={selectedRole === role.id}
              aria-label={role.label}
            >
              {/* Circular highlight background */}
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                selectedRole === role.id
                  ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border-2 border-cyan-500 shadow-lg shadow-cyan-500/30'
                  : 'bg-transparent border-2 border-transparent group-hover:border-cyan-400/50 group-hover:bg-cyan-500/5'
              }`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Icon */}
                <div className={`text-5xl mb-4 transition-all duration-300 ${
                  selectedRole === role.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {role.icon}
                </div>
                
                {/* Label */}
                <div className={`text-lg font-semibold text-center transition-colors min-w-[120px] ${
                  selectedRole === role.id ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
                }`}>
                  {role.label}
                </div>
              </div>

              {/* Selection indicator - small dot */}
              {selectedRole === role.id && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
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

        {/* Continue Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center mx-auto ${
              selectedRole
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={selectedRole ? { scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
            whileTap={selectedRole ? { scale: 0.95 } : {}}
            aria-disabled={!selectedRole}
          >
            Continue to Dashboard
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

          {/* Progress indicator */}
          <motion.div 
            className="flex items-center justify-center mt-8 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span className="text-gray-400 text-sm ml-4">Step 2 of 3</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;
