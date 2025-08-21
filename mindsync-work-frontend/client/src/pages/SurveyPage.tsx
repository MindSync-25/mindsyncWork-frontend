import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const surveyOptions = [
    { id: 'consultant', label: 'Consultant' },
    { id: 'events-conferences', label: 'Events/conferences' },
    { id: 'software-review-site', label: 'Software Review Site' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'email', label: 'Email' },
    { id: 'ai-chatbots', label: 'AI Chatbots (e.g. ChatGPT, Claude, etc.)' },
    { id: 'audio-streaming', label: 'Audio streaming services' },
    { id: 'facebook-instagram', label: 'Facebook / Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'search-engines', label: 'Online search engines (e.g. Google, Bing, etc.)' },
    { id: 'friend', label: 'Friend' },
    { id: 'news-publications', label: 'News publications' },
    { id: 'podcast', label: 'Podcast' },
    { id: 'outdoor-ads', label: 'Outdoors ad (billboards / transport / airport)' },
    { id: 'tv-streaming', label: 'TV / Streaming' },
    { id: 'other', label: 'Other' }
  ];

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleBack = () => {
    // Parse URL to get parameters and construct back URL
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    const goal = urlParams.get('goal');
    const role = urlParams.get('role');
    const teamSize = urlParams.get('teamSize');
    const companySize = urlParams.get('companySize');

    // Categories that have focus areas
    const categoriesWithFocusAreas = ['product-management', 'it', 'software-development', 'marketing', 'finance'];
    
    if (category && categoriesWithFocusAreas.includes(category)) {
      // Go back to focus area page
      let focusUrl = `/focus-area?category=${category}&goal=${goal}&role=${role}`;
      if (teamSize) focusUrl += `&teamSize=${teamSize}`;
      if (companySize) focusUrl += `&companySize=${companySize}`;
      navigate(focusUrl);
    } else {
      // Go back to management category page
      let backUrl = `/management-category?goal=${goal}&role=${role}`;
      if (teamSize) backUrl += `&teamSize=${teamSize}`;
      if (companySize) backUrl += `&companySize=${companySize}`;
      navigate(backUrl);
    }
  };

  const handleContinue = () => {
    // Navigate to onboarding intro page after survey completion
    console.log('Survey responses:', selectedSources);
    navigate('/onboarding-intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-cyan-800 flex">
      
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
                <span className="text-white">Mindsync</span> <span className="text-cyan-400">Work</span>
              </h1>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              One last question, how did you hear about us?
            </h2>
          </motion.div>

          {/* Survey Options - Checkbox Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {surveyOptions.map((option, index) => (
              <motion.label
                key={option.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedSources.includes(option.id)
                    ? 'border-cyan-500 bg-cyan-500/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-cyan-400 hover:bg-cyan-500/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  checked={selectedSources.includes(option.id)}
                  onChange={() => handleSourceToggle(option.id)}
                  className="sr-only"
                  aria-label={option.label}
                />
                
                {/* Custom Checkbox */}
                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                  selectedSources.includes(option.id)
                    ? 'border-cyan-500 bg-cyan-500'
                    : 'border-gray-500'
                }`}>
                  {selectedSources.includes(option.id) && (
                    <motion.svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.53033 14.2478L8 13.7175L7.46967 14.2478C7.76256 14.5407 8.23744 14.5407 8.53033 14.2478ZM8 12.6569L4.53033 9.18718C4.23744 8.89429 3.76256 8.89429 3.46967 9.18718C3.17678 9.48008 3.17678 9.95495 3.46967 10.2478L7.46967 14.2478L8 13.7175L8.53033 14.2478L16.2478 6.53033C16.5407 6.23743 16.5407 5.76256 16.2478 5.46967C15.955 5.17677 15.4801 5.17677 15.1872 5.46967L8 12.6569Z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm font-medium transition-colors ${
                  selectedSources.includes(option.id) ? 'text-cyan-300' : 'text-white'
                }`}>
                  {option.label}
                </span>
              </motion.label>
            ))}
          </motion.div>

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

            {/* Continue Button - Optional, can proceed even without selection */}
            <motion.button
              onClick={handleContinue}
              className="flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
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

export default SurveyPage;
