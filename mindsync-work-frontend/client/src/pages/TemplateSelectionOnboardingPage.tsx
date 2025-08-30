import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TemplateSelectionOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    {
      id: 'kanban_basic',
      title: 'Basic Kanban',
      description: 'Simple task management with To Do, In Progress, and Done columns',
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
      columns: ['To Do', 'In Progress', 'Done'],
      bestFor: 'Small teams, simple projects'
    },
    {
      id: 'scrum_sprint',
      title: 'Scrum Sprint Board',
      description: 'Agile development with sprint planning and tracking capabilities',
      icon: '🚀',
      color: 'from-green-500 to-emerald-500',
      columns: ['Product Backlog', 'Sprint Backlog', 'In Progress', 'Review', 'Done'],
      bestFor: 'Development teams, agile workflows'
    },
    {
      id: 'marketing_campaign',
      title: 'Marketing Campaign',
      description: 'Campaign planning from ideation to execution and analysis',
      icon: '📢',
      color: 'from-pink-500 to-rose-500',
      columns: ['Ideas', 'Planning', 'Creating', 'Review', 'Published', 'Analyzing'],
      bestFor: 'Marketing teams, campaign management'
    },
    {
      id: 'design_workflow',
      title: 'Design Workflow',
      description: 'Creative process management from concept to final delivery',
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      columns: ['Brief', 'Concept', 'Design', 'Review', 'Revisions', 'Approved'],
      bestFor: 'Design teams, creative projects'
    },
    {
      id: 'sales_pipeline',
      title: 'Sales Pipeline',
      description: 'Track leads and deals through your sales process',
      icon: '💼',
      color: 'from-orange-500 to-red-500',
      columns: ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      bestFor: 'Sales teams, lead management'
    },
    {
      id: 'hr_recruitment',
      title: 'HR Recruitment',
      description: 'Manage the hiring process from application to onboarding',
      icon: '👥',
      color: 'from-indigo-500 to-blue-500',
      columns: ['Applications', 'Screening', 'Interview', 'Offer', 'Onboarding'],
      bestFor: 'HR teams, recruitment process'
    },
    {
      id: 'project_management',
      title: 'Project Management',
      description: 'Comprehensive project tracking with multiple phases',
      icon: '📊',
      color: 'from-teal-500 to-green-500',
      columns: ['Planning', 'Development', 'Testing', 'Review', 'Deployment', 'Maintenance'],
      bestFor: 'Project managers, complex projects'
    },
    {
      id: 'custom_blank',
      title: 'Start from Scratch',
      description: 'Create your own workflow with custom columns and processes',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      columns: ['Customize as needed'],
      bestFor: 'Unique workflows, specific needs'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleFinishOnboarding = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    
    try {
      // Get all onboarding data from localStorage
      const onboardingData = JSON.parse(localStorage.getItem('userOnboardingData') || '{}');
      
      const completeData = {
        ...onboardingData,
        template: {
          selectedTemplate,
          templateData: templates.find(t => t.id === selectedTemplate)
        },
        completedAt: new Date().toISOString()
      };

      // TODO: Call API to finalize onboarding and create workspace
      console.log('Complete onboarding data:', completeData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear onboarding data
      localStorage.removeItem('userOnboardingData');
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Navigate to view layout (graph type selection) - first step of dashboard setup
      navigate('/view-layout');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-5xl mx-auto p-8">
        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Step 4 of 4</span>
            <span className="text-sm text-purple-400">Template Selection</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: '75%' }}
              animate={{ width: '100%' }}
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
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Choose your template
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select a template that best matches your workflow. You can always customize it later or switch to a different template.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative p-6 bg-gray-800/50 border rounded-xl cursor-pointer transition-all duration-300 ${
                selectedTemplate === template.id
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Selection Indicator */}
              {selectedTemplate === template.id && (
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

              {/* Template Icon */}
              <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-2xl">{template.icon}</span>
              </div>

              {/* Template Info */}
              <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{template.description}</p>

              {/* Columns Preview */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-medium text-gray-300 uppercase tracking-wider">Columns:</p>
                <div className="flex flex-wrap gap-1">
                  {template.columns.slice(0, 3).map((column, idx) => (
                    <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {column}
                    </span>
                  ))}
                  {template.columns.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{template.columns.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Best For */}
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  <span className="font-medium">Best for:</span> {template.bestFor}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Selected Template Preview */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 mb-8"
          >
            {(() => {
              const template = templates.find(t => t.id === selectedTemplate);
              if (!template) return null;
              
              return (
                <>
                  <h3 className="text-lg font-semibold text-white mb-4">Preview: {template.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {template.columns.map((column, idx) => (
                      <div key={idx} className="bg-gray-700/50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-300 font-medium">{column}</p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            type="button"
            onClick={() => navigate('/onboarding/workspace-creation')}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          
          <motion.button
            onClick={handleFinishOnboarding}
            disabled={!selectedTemplate || isLoading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: (!selectedTemplate || isLoading) ? 1 : 1.02 }}
            whileTap={{ scale: (!selectedTemplate || isLoading) ? 1 : 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up your workspace...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Complete Setup</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </motion.button>
        </div>

        {/* Additional Info */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-gray-400 text-sm">
            Don't worry - you can change your template, add columns, or completely customize your workspace anytime after setup.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateSelectionOnboardingPage;
