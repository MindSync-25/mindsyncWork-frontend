import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const FocusAreaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFocus, setSelectedFocus] = useState<string>('');
  const [managementCategory, setManagementCategory] = useState<string>('');

  // Extract parameters from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) setManagementCategory(categoryParam);
  }, [location]);

  // Define focus areas for each management category
  const focusAreasByCategory: { [key: string]: { id: string; label: string }[] } = {
    'product-management': [
      { id: 'sprint-management', label: 'Sprint management' },
      { id: 'kanban', label: 'Kanban' },
      { id: 'tracking-product-metrics', label: 'Tracking product metrics' },
      { id: 'backlog-management', label: 'Backlog management' },
      { id: 'task-management', label: 'Task management' },
      { id: 'cross-team-collaboration', label: 'Cross-team collaboration' },
      { id: 'reports-dashboards', label: 'Reports & dashboards' },
      { id: 'prioritize-personal-work', label: 'Prioritize personal work' },
      { id: 'project-management', label: 'Project management' },
      { id: 'team-management', label: 'Team management' },
      { id: 'roadmap-planning', label: 'Roadmap planning' },
      { id: 'feature-prioritization', label: 'Feature prioritization' },
      { id: 'release-management', label: 'Release management' },
      { id: 'stories-epics-management', label: 'Stories and epics management' },
      { id: 'market-research', label: 'Market research' },
      { id: 'customer-communication', label: 'Customer communication' },
      { id: 'other', label: 'Other' }
    ],
    'it': [
      { id: 'helpdesk-support', label: 'Helpdesk & Support' },
      { id: 'infrastructure-management', label: 'Infrastructure Management' },
      { id: 'security-compliance', label: 'Security & Compliance' },
      { id: 'system-monitoring', label: 'System Monitoring' },
      { id: 'asset-management', label: 'Asset Management' },
      { id: 'incident-management', label: 'Incident Management' },
      { id: 'change-management', label: 'Change Management' },
      { id: 'network-administration', label: 'Network Administration' },
      { id: 'data-backup-recovery', label: 'Data Backup & Recovery' },
      { id: 'software-deployment', label: 'Software Deployment' },
      { id: 'other', label: 'Other' }
    ],
    'software-development': [
      { id: 'agile-scrum', label: 'Agile/Scrum Development' },
      { id: 'code-review', label: 'Code Review Process' },
      { id: 'ci-cd-pipeline', label: 'CI/CD Pipeline' },
      { id: 'bug-tracking', label: 'Bug Tracking' },
      { id: 'feature-development', label: 'Feature Development' },
      { id: 'testing-qa', label: 'Testing & QA' },
      { id: 'documentation', label: 'Documentation' },
      { id: 'technical-debt', label: 'Technical Debt Management' },
      { id: 'performance-optimization', label: 'Performance Optimization' },
      { id: 'api-development', label: 'API Development' },
      { id: 'other', label: 'Other' }
    ],
    'marketing': [
      { id: 'campaign-management', label: 'Campaign Management' },
      { id: 'content-marketing', label: 'Content Marketing' },
      { id: 'social-media', label: 'Social Media Marketing' },
      { id: 'email-marketing', label: 'Email Marketing' },
      { id: 'seo-sem', label: 'SEO & SEM' },
      { id: 'lead-generation', label: 'Lead Generation' },
      { id: 'analytics-reporting', label: 'Analytics & Reporting' },
      { id: 'brand-management', label: 'Brand Management' },
      { id: 'event-marketing', label: 'Event Marketing' },
      { id: 'market-research', label: 'Market Research' },
      { id: 'other', label: 'Other' }
    ],
    'finance': [
      { id: 'budgeting-planning', label: 'Budgeting & Planning' },
      { id: 'expense-management', label: 'Expense Management' },
      { id: 'invoice-processing', label: 'Invoice Processing' },
      { id: 'financial-reporting', label: 'Financial Reporting' },
      { id: 'accounts-payable', label: 'Accounts Payable' },
      { id: 'accounts-receivable', label: 'Accounts Receivable' },
      { id: 'cash-flow-management', label: 'Cash Flow Management' },
      { id: 'tax-preparation', label: 'Tax Preparation' },
      { id: 'audit-compliance', label: 'Audit & Compliance' },
      { id: 'cost-analysis', label: 'Cost Analysis' },
      { id: 'other', label: 'Other' }
    ],
    // Default options for other categories
    'default': [
      { id: 'project-management', label: 'Project management' },
      { id: 'task-management', label: 'Task management' },
      { id: 'team-collaboration', label: 'Team collaboration' },
      { id: 'resource-planning', label: 'Resource planning' },
      { id: 'reporting-analytics', label: 'Reporting & analytics' },
      { id: 'workflow-automation', label: 'Workflow automation' },
      { id: 'communication', label: 'Communication' },
      { id: 'documentation', label: 'Documentation' },
      { id: 'other', label: 'Other' }
    ]
  };

  const getFocusAreas = () => {
    return focusAreasByCategory[managementCategory] || focusAreasByCategory['default'];
  };

  const getCategoryDisplayName = () => {
    const categoryNames: { [key: string]: string } = {
      'product-management': 'Product Management',
      'it': 'IT',
      'software-development': 'Software Development',
      'marketing': 'Marketing',
      'finance': 'Finance',
      'education': 'Education',
      'operations': 'Operations',
      'design-creative': 'Design and Creative',
      'hr-recruiting': 'HR and Recruiting',
      'sales-crm': 'Sales and CRM',
      'nonprofits': 'Nonprofits',
      'construction': 'Construction',
      'legal': 'Legal',
      'pmo': 'PMO',
      'other': 'Other'
    };
    return categoryNames[managementCategory] || 'Management';
  };

  const handleFocusSelect = (focusId: string) => {
    setSelectedFocus(focusId);
  };

  const handleBack = () => {
    const urlParams = new URLSearchParams(location.search);
    const goal = urlParams.get('goal');
    const role = urlParams.get('role');
    const teamSize = urlParams.get('teamSize');
    const companySize = urlParams.get('companySize');
    
    let backUrl = `/management-category?goal=${goal}&role=${role}`;
    if (teamSize) backUrl += `&teamSize=${teamSize}`;
    if (companySize) backUrl += `&companySize=${companySize}`;
    
    navigate(backUrl);
  };

  const handleContinue = () => {
    if (selectedFocus) {
      // Navigate to survey page with all parameters
      const urlParams = new URLSearchParams(location.search);
      const goal = urlParams.get('goal');
      const role = urlParams.get('role');
      const teamSize = urlParams.get('teamSize');
      const companySize = urlParams.get('companySize');
      
      let surveyUrl = `/survey?category=${managementCategory}&focus=${selectedFocus}&goal=${goal}&role=${role}`;
      if (teamSize) surveyUrl += `&teamSize=${teamSize}`;
      if (companySize) surveyUrl += `&companySize=${companySize}`;
      
      navigate(surveyUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.div 
          className="w-full max-w-5xl"
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

          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Select what you'd like to focus on first
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Help us tailor the best experience for you in <span className="text-purple-400">{getCategoryDisplayName()}</span>
            </p>
          </motion.div>

          {/* Focus Areas - Clean Button Grid */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {getFocusAreas().map((focus, index) => (
              <motion.button
                key={focus.id}
                onClick={() => handleFocusSelect(focus.id)}
                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                  selectedFocus === focus.id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 bg-gray-800/50 text-white hover:border-purple-400 hover:bg-purple-500/10'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={selectedFocus === focus.id}
                aria-label={focus.label}
              >
                {focus.label}
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
              disabled={!selectedFocus}
              className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedFocus
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={selectedFocus ? { scale: 1.05, boxShadow: "0 20px 50px rgba(168, 85, 247, 0.4)" } : {}}
              whileTap={selectedFocus ? { scale: 0.95 } : {}}
              aria-disabled={!selectedFocus}
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

export default FocusAreaPage;
