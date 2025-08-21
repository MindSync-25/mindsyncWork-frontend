import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const ManagementCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [role, setRole] = useState<string>('');

  // Extract parameters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const goalParam = urlParams.get('goal');
    const roleParam = urlParams.get('role');
    
    if (goalParam) setGoal(goalParam);
    if (roleParam) setRole(roleParam);
  }, [location]);

  const managementCategories = [
    { id: 'it', label: 'IT' },
    { id: 'product-management', label: 'Product management' },
    { id: 'education', label: 'Education' },
    { id: 'operations', label: 'Operations' },
    { id: 'software-development', label: 'Software development' },
    { id: 'finance', label: 'Finance' },
    { id: 'design-creative', label: 'Design and Creative' },
    { id: 'hr-recruiting', label: 'HR and Recruiting' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'sales-crm', label: 'Sales and CRM' },
    { id: 'nonprofits', label: 'Nonprofits' },
    { id: 'construction', label: 'Construction' },
    { id: 'legal', label: 'Legal' },
    { id: 'pmo', label: 'PMO' },
    { id: 'other', label: 'Other' }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    // Personal and freelancer roles skip team size page
    if (goal === 'personal' || role === 'freelancer') {
      navigate(`/role-selection?goal=${goal}`);
    } else {
      navigate(`/team-size?goal=${goal}&role=${role}`);
    }
  };

  const handleContinue = () => {
    if (selectedCategory) {
      // Categories that have specific focus areas
      const categoriesWithFocusAreas = ['product-management', 'it', 'software-development', 'marketing', 'finance'];
      
      if (categoriesWithFocusAreas.includes(selectedCategory)) {
        // Navigate to focus area page
        const urlParams = new URLSearchParams(location.search);
        const goal = urlParams.get('goal');
        const role = urlParams.get('role');
        const teamSize = urlParams.get('teamSize');
        const companySize = urlParams.get('companySize');
        
        let focusUrl = `/focus-area?category=${selectedCategory}&goal=${goal}&role=${role}`;
        if (teamSize) focusUrl += `&teamSize=${teamSize}`;
        if (companySize) focusUrl += `&companySize=${companySize}`;
        
        navigate(focusUrl);
      } else {
        // Other categories go to survey page
        const urlParams = new URLSearchParams(location.search);
        const goal = urlParams.get('goal');
        const role = urlParams.get('role');
        const teamSize = urlParams.get('teamSize');
        const companySize = urlParams.get('companySize');
        
        let surveyUrl = `/survey?category=${selectedCategory}&goal=${goal}&role=${role}`;
        if (teamSize) surveyUrl += `&teamSize=${teamSize}`;
        if (companySize) surveyUrl += `&companySize=${companySize}`;
        
        navigate(surveyUrl);
      }
    }
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
              Select what you'd like to manage first
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              You can always add more in the future
            </p>
          </motion.div>

          {/* Management Categories - Clean Button Grid */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {managementCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                  selectedCategory === category.id
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : 'border-gray-600 bg-gray-800/50 text-white hover:border-cyan-400 hover:bg-cyan-500/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={selectedCategory === category.id}
                aria-label={category.label}
              >
                {category.label}
              </motion.button>
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

            {/* Continue Button */}
            <motion.button
              onClick={handleContinue}
              disabled={!selectedCategory}
              className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedCategory ? { scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={selectedCategory ? { scale: 0.95 } : {}}
              aria-disabled={!selectedCategory}
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

export default ManagementCategoryPage;
