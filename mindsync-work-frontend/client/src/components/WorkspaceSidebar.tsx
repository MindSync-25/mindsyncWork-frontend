import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WorkspaceService, getItemIcon } from '../services/workspaceService';
import type { Workspace, WorkspaceItem } from '../types/workspace';

interface WorkspaceSidebarProps {
  workspace: Workspace;
  currentPath: WorkspaceItem[];
}

interface TreeItem extends WorkspaceItem {
  children?: TreeItem[];
  isExpanded?: boolean;
}

const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ workspace, currentPath }) => {
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTreeData();
  }, [workspace.id]);

  useEffect(() => {
    // Auto-expand items in current path
    const pathIds = new Set(currentPath.map(item => item.id));
    setExpandedItems(prev => new Set([...prev, ...pathIds]));
  }, [currentPath]);

  const loadTreeData = async () => {
    try {
      const hierarchy = await WorkspaceService.getWorkspaceHierarchy(workspace.id);
      if (hierarchy) {
        const tree = buildTree(hierarchy.items);
        setTreeData(tree);
      }
    } catch (error) {
      console.error('Error loading tree data:', error);
    }
  };

  const buildTree = (items: WorkspaceItem[]): TreeItem[] => {
    const itemMap = new Map<string, TreeItem>();
    const rootItems: TreeItem[] = [];

    // Create map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Build tree structure
    items.forEach(item => {
      const treeItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(treeItem);
      } else {
        rootItems.push(treeItem);
      }
    });

    return rootItems;
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: TreeItem) => {
    if (item.type === 'folder' || item.type === 'subfolder') {
      navigate(`/workspace/${workspace.id}/${item.id}`);
    } else if (item.type === 'board') {
      navigate('/dashboard', { 
        state: { 
          workspaceId: workspace.id,
          itemId: item.id,
          templateData: item.templateData,
          boardName: item.name
        } 
      });
    } else if (item.type === 'dashboard') {
      navigate('/analytics', { 
        state: { 
          workspaceId: workspace.id,
          itemId: item.id,
          dashboardName: item.name
        } 
      });
    } else if (item.type === 'doc') {
      navigate('/document', { 
        state: { 
          workspaceId: workspace.id,
          itemId: item.id,
          docName: item.name
        } 
      });
    }
  };

  const TreeNode: React.FC<{ item: TreeItem; level: number }> = ({ item, level }) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const canExpand = item.type === 'folder' || item.type === 'subfolder';
    const isInCurrentPath = currentPath.some(pathItem => pathItem.id === item.id);

    return (
      <div>
        <motion.div
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
          className={`group flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-lg mx-2 ${
            isInCurrentPath ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-gray-900'
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={() => handleItemClick(item)}
        >
          {/* Expand/Collapse Button */}
          {canExpand && hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <svg
                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Icon */}
          <span className="text-lg">{item.icon || getItemIcon(item.type)}</span>

          {/* Name */}
          <span className="flex-1 truncate font-medium">{item.name}</span>

          {/* Type Badge */}
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
            isInCurrentPath 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
          }`}>
            {item.type}
          </span>
        </motion.div>

        {/* Children */}
        {canExpand && hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.children!.map(child => (
              <TreeNode key={child.id} item={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Workspace Header */}
      <div className={`bg-gradient-to-br ${workspace.color} p-4 text-white`}>
        <button
          onClick={() => navigate(`/workspace/${workspace.id}`)}
          className="flex items-center gap-3 w-full text-left hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors"
        >
          <span className="text-2xl">{workspace.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{workspace.name}</h2>
            {workspace.description && (
              <p className="text-sm text-white text-opacity-80 truncate">{workspace.description}</p>
            )}
          </div>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Actions</h3>
          <div className="space-y-1">
            <button
              onClick={() => navigate(`/workspace/${workspace.id}`)}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <span>🏠</span>
              <span>Workspace Home</span>
            </button>
            <button
              onClick={() => navigate('/templates', { state: { workspaceId: workspace.id } })}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <span>📋</span>
              <span>Create Board</span>
            </button>
            <button
              onClick={() => navigate('/analytics', { state: { workspaceId: workspace.id } })}
              className="flex items-center gap-2 w-full text-left text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-3 py-2"
            >
              <span>📊</span>
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Tree Navigation */}
        <div className="px-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contents</h3>
            <button
              onClick={() => setExpandedItems(new Set())}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Collapse All
            </button>
          </div>
          
          {treeData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-2xl mb-2">📁</div>
              <p className="text-sm">No items yet</p>
              <button
                onClick={() => navigate('/templates', { state: { workspaceId: workspace.id } })}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                Create your first item
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {treeData.map(item => (
                <TreeNode key={item.id} item={item} level={0} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => navigate('/workspaces')}
          className="flex items-center gap-2 w-full text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg px-3 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>All Workspaces</span>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
