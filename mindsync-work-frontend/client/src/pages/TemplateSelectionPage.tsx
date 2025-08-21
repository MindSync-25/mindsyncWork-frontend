import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { templateCategories, getAllTemplates, getMostPopularTemplates } from '../data/templates';
import type { Template, TemplateCategory } from '../data/templates';

const TemplateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Get workspace context from navigation state
  const { workspaceId, parentId, returnTo } = location.state || {};

  const popularTemplates = getMostPopularTemplates();
  const allTemplates = getAllTemplates();

  const getDisplayTemplates = () => {
    let templates = selectedCategory === 'all' ? allTemplates : 
                   selectedCategory === 'popular' ? popularTemplates :
                   templateCategories.find(cat => cat.id === selectedCategory)?.templates || [];
    
    if (searchQuery) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return templates;
  };

  const handleTemplateSelect = (template: Template) => {
    if (workspaceId) {
      // Create board in workspace hierarchy
      navigate('/view-layout', { 
        state: { 
          template: template.id,
          templateData: template,
          boardName: `${template.name} Board`,
          columns: template.columns,
          workspaceId,
          parentId,
          returnTo: returnTo || 'workspace'
        } 
      });
    } else {
      // Legacy flow - direct to dashboard
      navigate('/view-layout', { 
        state: { 
          template: template.id,
          templateData: template,
          boardName: `${template.name} Board`,
          columns: template.columns
        } 
      });
    }
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => handleTemplateSelect(template)}
    >
      {/* Popularity Badge */}
      {template.popularity && (
        <div className="absolute top-3 right-3 z-10">
          {template.popularity === 'most-popular' && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 Popular
            </span>
          )}
          {template.popularity === 'trending' && (
            <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              📈 Trending
            </span>
          )}
          {template.popularity === 'new' && (
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              ✨ New
            </span>
          )}
        </div>
      )}

      {/* Template Header */}
      <div className={`h-16 bg-gradient-to-br ${template.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white bg-opacity-10" />
        <div className="absolute top-2 left-3">
          <span className="text-xl">{template.icon}</span>
        </div>
        
        {/* Preview Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPreviewTemplate(template);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Template Content */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {template.category.replace('-', ' ')}
          </span>
        </div>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {template.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-2">
          {template.features.slice(0, 1).map((feature, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {template.features.length > 1 && (
            <span className="text-xs text-gray-400">
              +{template.features.length - 1} more
            </span>
          )}
        </div>

        {/* Column Count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{template.columns.length} columns</span>
          <div className="flex items-center gap-1">
            <span>Use template</span>
            <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const CategoryTab = ({ category, isAll = false, isPopular = false }: { category?: TemplateCategory; isAll?: boolean; isPopular?: boolean }) => {
    const id = isAll ? 'all' : isPopular ? 'popular' : category?.id || '';
    const name = isAll ? 'All Templates' : isPopular ? 'Most Popular' : category?.name || '';
    const icon = isAll ? '📁' : isPopular ? '🔥' : category?.icon || '';
    const count = isAll ? allTemplates.length : isPopular ? popularTemplates.length : category?.templates.length || 0;

    return (
      <button
        onClick={() => setSelectedCategory(id)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          selectedCategory === id
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
        }`}
      >
        <span className="text-xl">{icon}</span>
        <div className="text-left">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{count} templates</div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Workspace Context */}
          {workspaceId && (
            <div className="mb-4">
              <button
                onClick={() => navigate(returnTo === 'workspace' ? `/workspace/${workspaceId}${parentId ? `/${parentId}` : ''}` : '/workspaces')}
                className="flex items-center gap-2 text-white text-opacity-80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to {returnTo === 'workspace' ? 'Workspace' : 'Workspaces'}</span>
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Choose Your Template
              </h1>
              <p className="text-gray-300">
                Start with a pre-built template or create something from scratch
              </p>
            </div>
            
            <button
              onClick={() => {
                if (workspaceId) {
                  navigate('/view-layout', { 
                    state: { 
                      template: 'custom',
                      workspaceId,
                      parentId,
                      returnTo: returnTo || 'workspace'
                    } 
                  });
                } else {
                  navigate('/view-layout', { state: { template: 'custom' } });
                }
              }}
              className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg border border-white border-opacity-30 transition-all duration-200"
            >
              Start from Scratch
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-opacity-30"
            />
            <svg className="w-5 h-5 absolute left-3 top-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-8">
          {/* Sidebar - Categories */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-3 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              
              <div className="space-y-2">
                <CategoryTab isAll />
                <CategoryTab isPopular />
                
                <div className="border-t border-gray-200 my-4" />
                
                {templateCategories.map((category) => (
                  <CategoryTab key={category.id} category={category} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Templates Grid */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-1">
                {selectedCategory === 'all' ? 'All Templates' :
                 selectedCategory === 'popular' ? 'Most Popular Templates' :
                 templateCategories.find(cat => cat.id === selectedCategory)?.name || 'Templates'}
              </h2>
              <p className="text-gray-300">
                {getDisplayTemplates().length} template{getDisplayTemplates().length !== 1 ? 's' : ''} found
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {getDisplayTemplates().map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </motion.div>
            </AnimatePresence>

            {getDisplayTemplates().length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
                <p className="text-gray-400">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-br ${previewTemplate.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{previewTemplate.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{previewTemplate.name}</h2>
                      <p className="text-white text-opacity-90">{previewTemplate.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                    <div className="space-y-2">
                      {previewTemplate.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Columns Preview */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Columns ({previewTemplate.columns.length})</h3>
                    <div className="space-y-2">
                      {previewTemplate.columns.map((column, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium text-gray-700">{column.name}</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            {column.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleTemplateSelect(previewTemplate)}
                  className={`px-6 py-2 bg-gradient-to-r ${previewTemplate.color} text-white rounded-lg hover:shadow-lg transition-all duration-200`}
                >
                  Use This Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateSelectionPage;
