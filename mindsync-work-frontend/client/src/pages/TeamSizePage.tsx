import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TeamSizePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>('');
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [role, setRole] = useState<string>('');

  // Extract goal and role from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const goalParam = urlParams.get('goal');
    const roleParam = urlParams.get('role');
    
    if (goalParam) setGoal(goalParam);
    if (roleParam) setRole(roleParam);

    // Skip this page for personal goal or freelancer role
    if (goalParam === 'personal' || roleParam === 'freelancer') {
      navigate(`/management-category?goal=${goalParam}&role=${roleParam}`);
      return;
    }
  }, [location, navigate]);

  const teamSizeOptions = [
    { id: 'only-me', label: 'Only me' },
    { id: '2-5', label: '2-5' },
    { id: '6-10', label: '6-10' },
    { id: '11-15', label: '11-15' },
    { id: '16-25', label: '16-25' },
    { id: '26-50', label: '26-50' },
    { id: '51-100', label: '51-100' },
    { id: '101-500', label: '101-500' }
  ];

  const companySizeOptions = [
    { id: '1-19', label: '1-19' },
    { id: '20-49', label: '20-49' },
    { id: '50-99', label: '50-99' },
    { id: '100-250', label: '100-250' },
    { id: '251-500', label: '251-500' },
    { id: '501-1500', label: '501-1500' },
    { id: '1500+', label: '1500+' }
  ];

  const handleTeamSizeSelect = (sizeId: string) => {
    setSelectedTeamSize(sizeId);
  };

  const handleCompanySizeSelect = (sizeId: string) => {
    setSelectedCompanySize(sizeId);
  };

  const handleBack = () => {
    navigate(`/role-selection?goal=${goal}`);
  };

  const handleContinue = () => {
    // For school: only need team size
    if (goal === 'school' && selectedTeamSize) {
      navigate(`/management-category?goal=${goal}&role=${role}&teamSize=${selectedTeamSize}`);
      return;
    }
    
    // For work and nonprofits: need both team size and company size
    if (selectedTeamSize && selectedCompanySize) {
      navigate(`/management-category?goal=${goal}&role=${role}&teamSize=${selectedTeamSize}&companySize=${selectedCompanySize}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div 
            className="text-center mb-16"
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

          {/* Team Size Section */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              How many people are on your team?
            </h2>
            
            {/* Team Size Options - Clean Grid Style */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {teamSizeOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleTeamSizeSelect(option.id)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                    selectedTeamSize === option.id
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 bg-gray-800/50 text-white hover:border-purple-400 hover:bg-purple-500/10'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={selectedTeamSize === option.id}
                  aria-label={option.label}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Company Size Section - Only for work and nonprofits */}
          {goal !== 'school' && (
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                How many people work at your company?
              </h2>
              
              {/* Company Size Options - Clean Grid Style */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {companySizeOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleCompanySizeSelect(option.id)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedCompanySize === option.id
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 bg-gray-800/50 text-white hover:border-purple-400 hover:bg-purple-500/10'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={selectedCompanySize === option.id}
                    aria-label={option.label}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
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
              disabled={goal === 'school' ? !selectedTeamSize : (!selectedTeamSize || !selectedCompanySize)}
              className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                (goal === 'school' ? selectedTeamSize : (selectedTeamSize && selectedCompanySize))
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={(goal === 'school' ? selectedTeamSize : (selectedTeamSize && selectedCompanySize)) ? { scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={(goal === 'school' ? selectedTeamSize : (selectedTeamSize && selectedCompanySize)) ? { scale: 0.95 } : {}}
              aria-disabled={goal === 'school' ? !selectedTeamSize : (!selectedTeamSize || !selectedCompanySize)}
            >
              Continue
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z"></path>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamSizePage;
