import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkspaceService, getItemIcon, getItemColor } from '../services/workspaceService';
import type { Workspace, WorkspaceItem, ItemType } from '../types/workspace';
import CreateItemModal from '../components/CreateItemModal';
import WorkspaceSidebar from '../components/WorkspaceSidebar';
import BreadcrumbNavigation from '../components/BreadcrumbNavigation';

const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();
  const { workspaceId, parentId } = useParams<{ workspaceId: string; parentId?: string }>();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<WorkspaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadWorkspaceData();
  }, [workspaceId, parentId]);

  const loadWorkspaceData = async () => {
    if (!workspaceId) return;
    
    setLoading(true);
    try {
      // Load workspace info
      const workspaceData = await WorkspaceService.getWorkspace(workspaceId);
      if (workspaceData) {
        // Transform API workspace to include UI properties
        const transformedWorkspace = {
          ...workspaceData,
          color: '#8B5CF6', // Default purple color
          icon: 'briefcase', // Default icon
          createdAt: new Date(workspaceData.createdAt),
          updatedAt: new Date(workspaceData.updatedAt)
        };
        setWorkspace(transformedWorkspace);
      }

      // Load items for current location
      const itemsData = await WorkspaceService.getItemsByParent(workspaceId, parentId);
      setItems(itemsData);

      // Load breadcrumb path
      const { path } = await WorkspaceService.getBreadcrumbPath(workspaceId, parentId);
      setBreadcrumbPath(path);
    } catch (error) {
      console.error('Error loading workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: WorkspaceItem) => {
    if (item.type === 'folder' || item.type === 'subfolder') {
      // Navigate to folder/subfolder
      navigate(`/workspace/${workspaceId}/${item.id}`);
    } else if (item.type === 'board') {
      // Navigate to board with template data
      navigate('/dashboard', { 
        state: { 
          workspaceId,
          itemId: item.id,
          templateData: item.templateData,
          boardName: item.name
        } 
      });
    } else if (item.type === 'dashboard') {
      // Navigate to analytics dashboard
      navigate('/analytics', { 
        state: { 
          workspaceId,
          itemId: item.id,
          dashboardName: item.name
        } 
      });
    } else if (item.type === 'doc') {
      // Navigate to document view
      navigate('/document', { 
        state: { 
          workspaceId,
          itemId: item.id,
          docName: item.name
        } 
      });
    }
  };

  const handleCreateItem = (type: ItemType) => {
    if (type === 'board') {
      // For boards, navigate to template selection
      navigate('/templates', { 
        state: { 
          workspaceId,
          parentId,
          returnTo: 'workspace'
        } 
      });
    } else {
      // For other types, open create modal
      setCreateModalOpen(true);
    }
  };

  const handleItemCreated = (newItem: WorkspaceItem) => {
    setItems(prev => [...prev, newItem]);
    setCreateModalOpen(false);
  };

  const getCurrentItemType = (): 'workspace' | 'folder' | 'subfolder' => {
    if (!parentId) return 'workspace';
    const currentItem = breadcrumbPath[breadcrumbPath.length - 1];
    return currentItem?.type === 'subfolder' ? 'subfolder' : 'folder';
  };

  const getAllowedItemTypes = (currentType: string): string[] => {
    switch (currentType) {
      case 'workspace':
        return ['project', 'portfolio', 'board', 'doc', 'dashboard', 'form', 'workflow', 'folder'];
      case 'folder':
        return ['project', 'portfolio', 'board', 'doc', 'dashboard', 'form', 'workflow', 'subfolder'];
      case 'subfolder':
        return ['project', 'portfolio', 'board', 'doc', 'dashboard', 'form', 'workflow'];
      default:
        return [];
    }
  };

  const allowedTypes = getAllowedItemTypes(getCurrentItemType());

  const ItemCard = ({ item }: { item: WorkspaceItem }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => handleItemClick(item)}
    >
      {/* Item Header */}
      <div className={`h-20 bg-gradient-to-br ${item.color || getItemColor(item.type)} relative`}>
        <div className="absolute inset-0 bg-white bg-opacity-10" />
        <div className="absolute top-4 left-4">
          <span className="text-2xl">{item.icon || getItemIcon(item.type)}</span>
        </div>
        
        {/* Item Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
            {item.type}
          </span>
        </div>
      </div>

      {/* Item Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {item.name}
        </h3>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Item Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Updated {item.updatedAt.toLocaleDateString()}</span>
          <div className="flex items-center gap-1">
            <span>Open</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">
        {getCurrentItemType() === 'workspace' ? '🏠' : getCurrentItemType() === 'folder' ? '📁' : '📂'}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getCurrentItemType() === 'workspace' ? 'Welcome to your workspace!' : 'This folder is empty'}
      </h3>
      <p className="text-gray-600 mb-6">
        {getCurrentItemType() === 'workspace' 
          ? 'Create folders to organize your work or start with a board, dashboard, or document.'
          : 'Create items to organize your work in this folder.'
        }
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {allowedTypes.map((type: string) => (
          <button
            key={type}
            onClick={() => handleCreateItem(type as any)}
            className={`px-4 py-2 bg-gradient-to-r ${getItemColor(type as any)} text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2`}
          >
            <span>{getItemIcon(type as any)}</span>
            <span className="capitalize">Create {type}</span>
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Workspace not found</h2>
          <p className="text-gray-600 mb-6">The workspace you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/workspaces')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <WorkspaceSidebar workspace={workspace} currentPath={breadcrumbPath} />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <BreadcrumbNavigation 
                  workspace={workspace} 
                  path={breadcrumbPath}
                  onNavigate={(path) => navigate(path)}
                />
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {breadcrumbPath.length > 0 ? breadcrumbPath[breadcrumbPath.length - 1].name : workspace.name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Create Button */}
                <div className="relative group">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-3"
                  }
                >
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        workspaceId={workspaceId!}
        parentId={parentId}
        allowedTypes={allowedTypes.filter((type: string) => type !== 'board') as any} // Boards go through template selection
        onItemCreated={handleItemCreated}
      />
    </div>
  );
};

export default WorkspacePage;
