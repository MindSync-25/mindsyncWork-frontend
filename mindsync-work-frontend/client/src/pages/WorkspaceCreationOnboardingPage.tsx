import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WorkspaceCreationOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workspaceName: '',
    description: '',
    workspaceType: '',
    isPublic: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const workspaceTypes = [
    {
      id: 'software_development',
      title: 'Software Development',
      description: 'Perfect for development teams, sprints, and technical projects',
      icon: '💻',
      color: 'from-blue-500 to-cyan-500',
      features: ['Sprint planning', 'Bug tracking', 'Code reviews', 'Release management']
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Manage campaigns, content creation, and marketing initiatives',
      icon: '📢',
      color: 'from-pink-500 to-rose-500',
      features: ['Campaign planning', 'Content calendar', 'Asset management', 'Performance tracking']
    },
    {
      id: 'design',
      title: 'Design',
      description: 'Creative workflows for design teams and projects',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      features: ['Design reviews', 'Asset library', 'Feedback collection', 'Version control']
    },
    {
      id: 'sales',
      title: 'Sales',
      description: 'Track leads, deals, and sales pipeline management',
      icon: '💼',
      color: 'from-green-500 to-emerald-500',
      features: ['Lead tracking', 'Deal pipeline', 'Client communication', 'Sales reporting']
    },
    {
      id: 'hr',
      title: 'Human Resources',
      description: 'Manage recruitment, onboarding, and HR processes',
      icon: '👥',
      color: 'from-orange-500 to-red-500',
      features: ['Recruitment tracking', 'Employee onboarding', 'Performance reviews', 'Document management']
    },
    {
      id: 'general',
      title: 'General/Custom',
      description: 'Flexible workspace for any type of project or team',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      features: ['Custom workflows', 'Flexible boards', 'Adaptable templates', 'Multi-purpose']
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, workspaceType: typeId }));
    if (errors.workspaceType) {
      setErrors(prev => ({ ...prev, workspaceType: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.workspaceName.trim()) {
      newErrors.workspaceName = 'Workspace name is required';
    }
    if (!formData.workspaceType) {
      newErrors.workspaceType = 'Please select a workspace type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call API to create workspace
      console.log('Workspace creation:', formData);
      
      // Store in localStorage temporarily
      const existingData = JSON.parse(localStorage.getItem('userOnboardingData') || '{}');
      localStorage.setItem('userOnboardingData', JSON.stringify({
        ...existingData,
        workspace: formData
      }));
      
      // Navigate to template selection (final step)
      navigate('/onboarding/template-selection');
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step 3 of 4</span>
            <span className="text-sm text-purple-400">Workspace Creation</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '50%' }}
              animate={{ width: '75%' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Create your workspace
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Set up your workspace with a name, description, and choose the type that best fits your team's workflow.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Workspace Details */}
          <motion.div 
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Workspace Details</h2>
            
            <div className="space-y-6">
              {/* Workspace Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  name="workspaceName"
                  value={formData.workspaceName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                    errors.workspaceName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g. Acme Inc Workspace, Product Team Hub"
                />
                {errors.workspaceName && (
                  <p className="mt-1 text-sm text-red-400">{errors.workspaceName}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
                  placeholder="Brief description of your workspace and its purpose..."
                />
              </div>

              {/* Public/Private Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="isPublic" className="text-gray-300">
                  Make this workspace public (team members can discover and join)
                </label>
              </div>
            </div>
          </motion.div>

          {/* Workspace Type Selection */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Choose Workspace Type</h2>
            {errors.workspaceType && (
              <p className="mb-4 text-sm text-red-400">{errors.workspaceType}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaceTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative p-6 bg-gray-800/50 border rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.workspaceType === type.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selection Indicator */}
                  {formData.workspaceType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}

                  {/* Type Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{type.icon}</span>
                  </div>

                  {/* Type Info */}
                  <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{type.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-300 uppercase tracking-wider">Includes:</p>
                    <ul className="space-y-1">
                      {type.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                      <li className="text-xs text-gray-500">
                        +{type.features.length - 2} more features
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/onboarding/team-invitations')}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating workspace...
                </div>
              ) : (
                'Create Workspace & Continue'
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceCreationOnboardingPage;
