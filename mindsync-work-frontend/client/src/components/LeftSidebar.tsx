import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WorkspaceService } from '../services/workspaceService';
import type { Workspace, WorkspaceItem } from '../types/workspace';

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView?: 'home' | 'my-work' | 'dashboard-reporting' | 'more';
  onNavigationChange?: (view: 'home' | 'my-work' | 'dashboard-reporting' | 'more') => void;
}

// Workspace Item Component for hierarchical display
interface WorkspaceItemComponentProps {
  item: WorkspaceItem;
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  onItemClick: (itemId: string, itemType: string) => void;
  isCollapsed: boolean;
  allItems: WorkspaceItem[]; // Add this to find children
  onCreateInFolder?: (folderId: string, itemType: string) => void;
}

const WorkspaceItemComponent: React.FC<WorkspaceItemComponentProps> = ({
  item,
  level,
  expandedFolders,
  onToggleFolder,
  onItemClick,
  isCollapsed,
  allItems,
  onCreateInFolder
}) => {
  const isFolder = item.type === 'folder' || item.type === 'subfolder';
  const isExpanded = expandedFolders.has(item.id);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  
  // Find children of this item
  const children = allItems.filter(child => child.parentId === item.id);

  const getIcon = () => {
    switch (item.type) {
      case 'folder':
      case 'subfolder':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.81108 2.5C2.81085 2.5 2 3.36502 2 4.43208V15.5679C2 16.635 2.81085 17.5 3.81108 17.5H16.1889C17.1892 17.5 18 16.635 18 15.5679V7.97888C18 6.91182 17.1892 6.0468 16.1889 6.0468H12.2039L10.2143 3.31813C9.87492 2.80511 9.32306 2.5 8.7345 2.5H3.81108Z" />
          </svg>
        );
      case 'board':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z" fillRule="evenodd" clipRule="evenodd" />
          </svg>
        );
      case 'doc':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M6.81934 9.8501C6.40512 9.8501 6.06934 10.1859 6.06934 10.6001 6.06934 11.0143 6.40512 11.3501 6.81934 11.3501H12.8413C13.2555 11.3501 13.5913 11.0143 13.5913 10.6001 13.5913 10.1859 13.2555 9.8501 12.8413 9.8501H6.81934z" />
          </svg>
        );
      case 'dashboard':
        return (
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 3.5H16C16.2761 3.5 16.5 3.72386 16.5 4V16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2761 3.5 16V4C3.5 3.72386 3.72386 3.5 4 3.5ZM2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path d="M4 4H16C16.2761 4 16.5 4.22386 16.5 4.5V15.5C16.5 15.7761 16.2761 16 16 16H4C3.72386 16 3.5 15.7761 3.5 15.5V4.5C3.5 4.22386 3.72386 4 4 4Z" />
          </svg>
        );
    }
  };

  return (
    <>
      <motion.button
        onClick={() => {
          if (isFolder) {
            onToggleFolder(item.id);
          } else {
            onItemClick(item.id, item.type);
          }
        }}
        className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left text-gray-300 hover:text-white hover:bg-gray-700 group/item relative"
        style={{ paddingLeft: `${8 + level * 16}px` }}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Expand/Collapse Arrow for folders */}
        {isFolder && (
          <div className="w-3 h-3 flex items-center justify-center">
            {isExpanded ? (
              <span className="text-gray-400 text-xs">▼</span>
            ) : (
              <span className="text-gray-400 text-xs">▶</span>
            )}
          </div>
        )}
        
        {/* Item Icon */}
        <div className="text-gray-400 flex-shrink-0">
          {getIcon()}
        </div>
        
        {/* Item Name */}
        {!isCollapsed && (
          <span className="text-sm font-medium truncate flex-1">{item.name}</span>
        )}

        {/* Three Dots Menu - Only show on hover */}
        {!isCollapsed && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextMenuOpen(!contextMenuOpen);
              }}
              className="opacity-0 group-hover/item:opacity-100 p-1 rounded hover:bg-gray-600 transition-all duration-200"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 hover:text-white">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            {/* Context Menu */}
            <AnimatePresence>
              {contextMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full right-0 mt-1 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[60] max-h-64 overflow-y-auto"
                >
                  <div className="p-1">
                    {/* Actions Section */}
                    <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-600">
                      Actions
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        const newName = prompt('Enter new name:', item.name);
                        if (newName && newName.trim()) {
                          console.log('Rename item:', item.id, 'to:', newName);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span className="text-xs text-white">Rename</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        console.log('Change color for:', item.id);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h8v11H4V4zm6 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white">Change Color</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        console.log('Move item:', item.id);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white">Move To</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                          console.log('Delete item:', item.id);
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-red-600 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-red-400 flex-shrink-0">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-red-200">Delete</span>
                    </button>

                    {/* Create Section */}
                    <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider border-t border-gray-600 mt-1">
                      Create
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        onCreateInFolder?.(item.id, 'folder');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.81108 2.5C2.81085 2.5 2 3.36502 2 4.43208V15.5679C2 16.635 2.81085 17.5 3.81108 17.5H16.1889C17.1892 17.5 18 16.635 18 15.5679V7.97888C18 6.91182 17.1892 6.0468 16.1889 6.0468H12.2039L10.2143 3.31813C9.87492 2.80511 9.32306 2.5 8.7345 2.5H3.81108Z" />
                      </svg>
                      <span className="text-xs text-white">Folder</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        onCreateInFolder?.(item.id, 'board');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z" fillRule="evenodd" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white">Board</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        onCreateInFolder?.(item.id, 'dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4 3.5H16C16.2761 3.5 16.5 3.72386 16.5 4V16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2261 3.5 16V4C3.5 3.72386 3.72386 3.5 4 3.5ZM2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z" />
                      </svg>
                      <span className="text-xs text-white">Dashboard</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        onCreateInFolder?.(item.id, 'doc');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path d="M6.81934 9.8501C6.40512 9.8501 6.06934 10.1859 6.06934 10.6001 6.06934 11.0143 6.40512 11.3501 6.81934 11.3501H12.8413C13.2555 11.3501 13.5913 11.0143 13.5913 10.6001 13.5913 10.1859 13.2555 9.8501 12.8413 9.8501H6.81934z" />
                      </svg>
                      <span className="text-xs text-white">Doc</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(false);
                        onCreateInFolder?.(item.id, 'form');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4zm2 2a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 000 2h4a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-white">Form</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.button>

      {/* Render children if folder is expanded */}
      {isFolder && isExpanded && (
        <div className="ml-2">
          {/* Render actual children */}
          {children.map((child) => (
            <WorkspaceItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onItemClick={onItemClick}
              isCollapsed={isCollapsed}
              allItems={allItems}
              onCreateInFolder={onCreateInFolder}
            />
          ))}
          
          {/* "Create your item" option for folders */}
          {!isCollapsed && (
            <div className="relative" style={{ paddingLeft: `${8 + (level + 1) * 16}px` }}>
              <motion.button
                onClick={() => setCreateMenuOpen(!createMenuOpen)}
                className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-600"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  className="text-gray-500"
                >
                  <path d="M10 2.25C10.4142 2.25 10.75 2.58579 10.75 3V9.25H17C17.4142 9.25 17.75 9.58579 17.75 10C17.75 10.4142 17.4142 10.75 17 10.75H10.75V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17V10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H9.25V3C9.25 2.58579 9.58579 2.25 10 2.25Z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                <span className="text-xs italic">create your item</span>
              </motion.button>

              {/* Mini Create Menu - Positioned under the button */}
              <AnimatePresence>
                {createMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full left-0 mt-1 w-32 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50"
                  >
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setCreateMenuOpen(false);
                          onCreateInFolder?.(item.id, 'board');
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                          <path d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z" fillRule="evenodd" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-white">Board</span>
                      </button>
                      <button
                        onClick={() => {
                          setCreateMenuOpen(false);
                          onCreateInFolder?.(item.id, 'doc');
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                          <path d="M6.81934 9.8501C6.40512 9.8501 6.06934 10.1859 6.06934 10.6001 6.06934 11.0143 6.40512 11.3501 6.81934 11.3501H12.8413C13.2555 11.3501 13.5913 11.0143 13.5913 10.6001 13.5913 10.1859 13.2555 9.8501 12.8413 9.8501H6.81934z" />
                        </svg>
                        <span className="text-xs text-white">Doc</span>
                      </button>
                      <button
                        onClick={() => {
                          setCreateMenuOpen(false);
                          onCreateInFolder?.(item.id, 'subfolder');
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" className="text-gray-400 flex-shrink-0">
                          <path fillRule="evenodd" clipRule="evenodd" d="M3.81108 2.5C2.81085 2.5 2 3.36502 2 4.43208V15.5679C2 16.635 2.81085 17.5 3.81108 17.5H16.1889C17.1892 17.5 18 16.635 18 15.5679V7.97888C18 6.91182 17.1892 6.0468 16.1889 6.0468H12.2039L10.2143 3.31813C9.87492 2.80511 9.32306 2.5 8.7345 2.5H3.81108Z" />
                        </svg>
                        <span className="text-xs text-white">Subfolder</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse, 
  activeView = 'home',
  onNavigationChange
}) => {
  const navigate = useNavigate();
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      loadWorkspaceItems();
    }
  }, [selectedWorkspace]);

  const loadWorkspaces = async () => {
    try {
      const workspacesList = await WorkspaceService.getWorkspaces();
      // Transform API workspaces to include UI properties
      const transformedWorkspaces = workspacesList.map(ws => ({
        ...ws,
        color: '#8B5CF6', // Default purple color
        icon: 'briefcase', // Default icon
        createdAt: new Date(ws.createdAt),
        updatedAt: new Date(ws.updatedAt)
      }));
      setWorkspaces(transformedWorkspaces);
      if (transformedWorkspaces.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(transformedWorkspaces[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    }
  };

  const loadWorkspaceItems = async () => {
    if (!selectedWorkspace) return;
    
    try {
      // Load ALL items in the workspace, not just root level
      const hierarchy = await WorkspaceService.getWorkspaceHierarchy(selectedWorkspace.id);
      setWorkspaceItems(hierarchy?.items || []);
    } catch (error) {
      console.error('Error loading workspace items:', error);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateInFolder = async (folderId: string, itemType: string) => {
    const itemName = prompt(`Enter ${itemType} name:`);
    if (itemName && itemName.trim() && selectedWorkspace) {
      try {
        await WorkspaceService.createWorkspaceItem({
          name: itemName.trim(),
          type: itemType as any,
          workspaceId: selectedWorkspace.id,
          parentId: folderId
        });
        
        // Refresh workspace items
        await loadWorkspaceItems();
        
        // Auto-expand the folder to show the new item
        const newExpanded = new Set(expandedFolders);
        newExpanded.add(folderId);
        setExpandedFolders(newExpanded);
      } catch (error) {
        console.error('Error creating item in folder:', error);
        alert(`Failed to create ${itemType}. Please try again.`);
      }
    }
  };

  const handleCreateItem = async (type: 'workspace' | 'project' | 'portfolio' | 'board' | 'doc' | 'dashboard' | 'form' | 'workflow' | 'folder') => {
    setAddMenuOpen(false);
    
    if (type === 'workspace') {
      navigate('/workspaces');
      return;
    }

    if (type === 'folder') {
      // Handle folder creation with user input
      const folderName = prompt('Enter folder name:');
      if (folderName && folderName.trim() && selectedWorkspace) {
        try {
          await WorkspaceService.createWorkspaceItem({
            name: folderName.trim(),
            type: 'folder',
            workspaceId: selectedWorkspace.id,
            parentId: undefined // Top-level folder for now
          });
          
          // Refresh workspace items
          await loadWorkspaceItems();
        } catch (error) {
          console.error('Error creating folder:', error);
          alert('Failed to create folder. Please try again.');
        }
      }
      return;
    }

    if (selectedWorkspace) {
      // Navigate to templates with workspace context
      navigate('/templates', {
        state: {
          workspaceId: selectedWorkspace.id,
          returnTo: 'workspace',
          itemType: type
        }
      });
    } else {
      // Navigate to templates without workspace context
      navigate('/templates');
    }
  };

  // Get root level items (items without parentId)
  const getRootItems = () => {
    return workspaceItems.filter(item => !item.parentId);
  };

  const navigationItems = [
    {
      id: 'home',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M9.56992 2.1408C9.82591 1.95307 10.1741 1.95307 10.4301 2.1408L17.7028 7.47413C17.8896 7.61113 18 7.82894 18 8.06061V16.7879C18 17.1895 17.6744 17.5152 17.2727 17.5152H11.9394C11.5377 17.5152 11.2121 17.1895 11.2121 16.7879V13.1515H8.78788V16.7879C8.78788 17.1895 8.46227 17.5152 8.06061 17.5152H2.72727C2.32561 17.5152 2 17.1895 2 16.7879V8.06061C2 7.82894 2.11037 7.61113 2.29719 7.47413L9.56992 2.1408ZM3.45455 8.42914V16.0606H7.33333V12.4242C7.33333 12.0226 7.65894 11.697 8.06061 11.697H11.9394C12.3411 11.697 12.6667 12.0226 12.6667 12.4242V16.0606H16.5455V8.42914L10 3.62914L3.45455 8.42914Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      ),
      label: 'Home'
    },
    {
      id: 'my-work',
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path d="M5.99986 1.82129C6.41407 1.82129 6.74986 2.15708 6.74986 2.57129V4.10701H13.2499V2.57129C13.2499 2.15708 13.5856 1.82129 13.9999 1.82129C14.4141 1.82129 14.7499 2.15708 14.7499 2.57129V4.107H16.2856C16.7876 4.107 17.269 4.30643 17.624 4.66141C17.979 5.01639 18.1784 5.49784 18.1784 5.99986V16.2856C18.1784 16.7876 17.979 17.269 17.624 17.624C17.269 17.979 16.7876 18.1784 16.2856 18.1784H3.71415C3.21213 18.1784 2.73067 17.979 2.37569 17.624C2.02071 17.269 1.82129 16.7876 1.82129 16.2856V5.99986C1.82129 5.49784 2.02071 5.01639 2.37569 4.66141C2.73067 4.30643 3.21213 4.107 3.71415 4.107C3.763 4.107 3.81077 4.11168 3.85702 4.1206C3.90326 4.11168 3.95102 4.10701 3.99986 4.10701H5.24986V2.57129C5.24986 2.15708 5.58565 1.82129 5.99986 1.82129ZM5.24986 7.14272V5.60701H3.99986C3.95101 5.60701 3.90324 5.60234 3.85699 5.59342C3.81075 5.60233 3.76299 5.607 3.71415 5.607C3.60995 5.607 3.51003 5.64839 3.43635 5.72207C3.36268 5.79574 3.32129 5.89567 3.32129 5.99986V16.2856C3.32129 16.3898 3.36268 16.4897 3.43635 16.5634C3.51003 16.637 3.60995 16.6784 3.71415 16.6784H16.2856C16.3898 16.6784 16.4897 16.637 16.5634 16.5634C16.637 16.4897 16.6784 16.3898 16.6784 16.2856V5.99986C16.6784 5.89567 16.637 5.79574 16.5634 5.72207C16.4897 5.64839 16.3898 5.607 16.2856 5.607H14.7499V7.14272C14.7499 7.55693 14.4141 7.89272 13.9999 7.89272C13.5856 7.89272 13.2499 7.55693 13.2499 7.14272V5.60701H6.74986V7.14272C6.74986 7.55693 6.41407 7.89272 5.99986 7.89272C5.58565 7.89272 5.24986 7.55693 5.24986 7.14272ZM13.4214 9.92231C13.6942 9.61058 13.6626 9.13676 13.3509 8.864C13.0392 8.59124 12.5653 8.62283 12.2926 8.93455L8.75058 12.9825L7.02129 11.6856C6.68992 11.437 6.21982 11.5042 5.97129 11.8356C5.72276 12.1669 5.78992 12.637 6.12129 12.8856L8.407 14.5999C8.72086 14.8353 9.16309 14.789 9.42144 14.4937L13.4214 9.92231Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      ),
      label: 'My work'
    },
    {
      id: 'more',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 21">
          <path d="M7.276 10.42a1.133 1.133 0 1 1-2.267 0 1.133 1.133 0 0 1 2.267 0Zm3.857 0a1.133 1.133 0 1 1-2.267 0 1.133 1.133 0 0 1 2.267 0Zm2.723 1.134a1.133 1.133 0 1 0 0-2.267 1.133 1.133 0 0 0 0 2.267Z" />
          <path fillRule="evenodd" d="M19.107 10.42a9.107 9.107 0 1 1-18.214 0 9.107 9.107 0 0 1 18.214 0ZM10 17.92a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" clipRule="evenodd" />
        </svg>
      ),
      label: 'More'
    }
  ];

  return (
    <motion.nav
      className={`bg-gray-800 border-r border-gray-700 flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapse Toggle */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-start p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            width="16"
            height="16"
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path d="M7.24 9.444a.77.77 0 0 0 0 1.116l4.363 4.21a.84.84 0 0 0 1.157 0 .77.77 0 0 0 0-1.116l-3.785-3.652 3.785-3.653a.77.77 0 0 0 0-1.116.84.84 0 0 0-1.157 0L7.24 9.443Z" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {navigationItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => onNavigationChange?.(item.id as 'home' | 'my-work' | 'more')}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors group ${
                activeView === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`${
                activeView === item.id 
                  ? 'text-white' 
                  : 'text-gray-400 group-hover:text-white'
              }`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Favorites Section */}
        <div className="mt-6">
          <button
            onClick={() => setFavoritesExpanded(!favoritesExpanded)}
            className={`w-full flex items-center justify-between p-3 text-gray-400 hover:text-white transition-colors ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
          >
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">Favorites</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  className={`transition-transform duration-200 ${
                    favoritesExpanded ? 'rotate-90' : ''
                  }`}
                >
                  <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Workspaces Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between p-3">
            {!isCollapsed && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorkspacesExpanded(!workspacesExpanded)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="12"
                      height="12"
                      className={`transition-transform duration-200 ${
                        workspacesExpanded ? 'rotate-90' : ''
                      }`}
                    >
                      <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium text-gray-400">Workspaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white p-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-white p-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M8.65191 2.37299C6.9706 2.37299 5.35814 3.04089 4.16927 4.22976C2.9804 5.41863 2.3125 7.03108 2.3125 8.7124C2.3125 10.3937 2.9804 12.0062 4.16927 13.195C5.35814 14.3839 6.9706 15.0518 8.65191 15.0518C10.0813 15.0518 11.4609 14.5691 12.5728 13.6939L16.4086 17.5303C16.7014 17.8232 17.1763 17.8232 17.4692 17.5303C17.7621 17.2375 17.7622 16.7626 17.4693 16.4697L13.6334 12.6333C14.5086 11.5214 14.9913 10.1418 14.9913 8.7124C14.9913 7.03108 14.3234 5.41863 13.1346 4.22976C11.9457 3.04089 10.3332 2.37299 8.65191 2.37299ZM12.091 12.1172C12.9878 11.2113 13.4913 9.98783 13.4913 8.7124C13.4913 7.42891 12.9815 6.19798 12.0739 5.29042C11.1663 4.38285 9.9354 3.87299 8.65191 3.87299C7.36842 3.87299 6.1375 4.38285 5.22993 5.29042C4.32237 6.19798 3.8125 7.42891 3.8125 8.7124C3.8125 9.99589 4.32237 11.2268 5.22993 12.1344C6.1375 13.0419 7.36842 13.5518 8.65191 13.5518C9.92736 13.5518 11.1509 13.0483 12.0568 12.1514C12.0623 12.1455 12.0679 12.1397 12.0737 12.134C12.0794 12.1283 12.0851 12.1227 12.091 12.1172Z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Workspace Dropdown */}
          {!isCollapsed && (
            <div className="px-3 mb-4 space-y-2">
              {/* Workspace Selector and Add Button Row */}
              <div className="flex items-center gap-2">
                {/* Workspace Selector */}
                <div className="relative w-44">
                  <button
                    onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                    className="w-full h-8 bg-gray-700 rounded-lg px-2 border border-gray-600 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white font-bold text-xs">
                        {selectedWorkspace?.name?.charAt(0) || 'W'}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {selectedWorkspace?.name || 'No Workspace Selected'}
                        </div>
                      </div>
                      {/* Dropdown Arrow */}
                      <svg 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        width="14" 
                        height="14" 
                        className={`text-gray-400 transition-transform flex-shrink-0 ${workspaceDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M9.442 12.762a.77.77 0 0 0 1.116 0l4.21-4.363a.84.84 0 0 0 0-1.158.77.77 0 0 0-1.116 0L10 11.027 6.348 7.24a.77.77 0 0 0-1.117 0 .84.84 0 0 0 0 1.158l4.21 4.363Z" />
                      </svg>
                    </div>
                  </button>

                  {/* Workspace Dropdown Menu */}
                  <AnimatePresence>
                    {workspaceDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 max-h-32 overflow-y-auto"
                      >
                        {workspaces.map((workspace) => (
                          <button
                            key={workspace.id}
                            onClick={() => {
                              setSelectedWorkspace(workspace);
                              setWorkspaceDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedWorkspace?.id === workspace.id ? 'bg-purple-600/20 border-l-2 border-purple-500' : ''
                            }`}
                          >
                            <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white font-bold text-xs">
                              {workspace.name.charAt(0)}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <div className="text-xs font-medium text-white truncate">{workspace.name}</div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Create New Workspace */}
                        <button
                          onClick={() => {
                            setWorkspaceDropdownOpen(false);
                            navigate('/workspaces');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 transition-colors border-t border-gray-600 text-purple-400 hover:text-purple-300"
                        >
                          <div className="w-5 h-5 border border-purple-500 rounded flex items-center justify-center">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10">
                              <path d="M10 2.25C10.4142 2.25 10.75 2.58579 10.75 3V9.25H17C17.4142 9.25 17.75 9.58579 17.75 10C17.75 10.4142 17.4142 10.75 17 10.75H10.75V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17V10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H9.25V3C9.25 2.58579 9.58579 2.25 10 2.25Z" fillRule="evenodd" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-xs font-medium">Create new</div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add Button - Outside dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAddMenuOpen(!addMenuOpen)}
                    className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center text-white transition-colors"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path d="M10 2.25C10.4142 2.25 10.75 2.58579 10.75 3V9.25H17C17.4142 9.25 17.75 9.58579 17.75 10C17.75 10.4142 17.4142 10.75 17 10.75H10.75V17C10.75 17.4142 10.4142 17.75 10 17.75C9.58579 17.75 9.25 17.4142 9.25 17V10.75H3C2.58579 10.75 2.25 10.4142 2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H9.25V3C9.25 2.58579 9.58579 2.25 10 2.25Z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Add Menu Dropdown */}
                  <AnimatePresence>
                    {addMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full right-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-[9999] max-h-64 overflow-y-auto"
                        style={{
                          transform: 'translateX(calc(100% - 32px))'
                        }}
                      >
                        <div className="p-1">
                          <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Add new
                          </div>
                          
                          {/* Project & Portfolio */}
                          <button
                            onClick={() => handleCreateItem('project')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4 4H16C16.2761 4 16.5 4.22386 16.5 4.5V15.5C16.5 15.7761 16.2761 16 16 16H4C3.72386 16 3.5 15.7761 3.5 15.5V4.5C3.5 4.22386 3.72386 4 4 4ZM2 4.5C2 3.39543 2.89543 2.5 4 2.5H16C17.1046 2.5 18 3.39543 18 4.5V15.5C18 16.6046 17.1046 17.5 16 17.5H4C2.89543 17.5 2 16.6046 2 15.5V4.5Z" />
                            </svg>
                            <span className="text-xs text-white">Project</span>
                          </button>
                          
                          <button
                            onClick={() => handleCreateItem('portfolio')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" clipRule="evenodd" d="M3.81108 2.5C2.81085 2.5 2 3.36502 2 4.43208V15.5679C2 16.635 2.81085 17.5 3.81108 17.5H16.1889C17.1892 17.5 18 16.635 18 15.5679V7.97888C18 6.91182 17.1892 6.0468 16.1889 6.0468H12.2039L10.2143 3.31813C9.87492 2.80511 9.32306 2.5 8.7345 2.5H3.81108Z" />
                            </svg>
                            <span className="text-xs text-white">Portfolio</span>
                          </button>

                          <div className="border-t border-gray-600 my-1" />

                          {/* Core Items */}
                          <button
                            onClick={() => handleCreateItem('board')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path d="M7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5ZM2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5Z" fillRule="evenodd" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-white">Board</span>
                          </button>

                          <button
                            onClick={() => handleCreateItem('doc')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path d="M6.81934 9.8501C6.40512 9.8501 6.06934 10.1859 6.06934 10.6001 6.06934 11.0143 6.40512 11.3501 6.81934 11.3501H12.8413C13.2555 11.3501 13.5913 11.0143 13.5913 10.6001 13.5913 10.1859 13.2555 9.8501 12.8413 9.8501H6.81934z" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M16.5561 7.56686C16.5561 7.58719 16.5553 7.60733 16.5537 7.62725V16.3269C16.5537 16.7839 16.3722 17.2223 16.049 17.5454C15.7258 17.8686 15.2874 18.0502 14.8304 18.0502H5.12372C4.66667 18.0502 4.22833 17.8686 3.90514 17.5454C3.58196 17.2223 3.40039 16.7839 3.40039 16.3269V3.67353C3.40039 3.21647 3.58196 2.77814 3.90514 2.45495C4.22833 2.13176 4.66667 1.9502 5.12372 1.9502H11.0208C11.4775 1.95029 11.9157 2.1317 12.2387 2.45456L16.0492 6.265C16.372 6.58807 16.5536 7.02626 16.5537 7.483V7.50648C16.5553 7.5264 16.5561 7.54653 16.5561 7.56686Z" />
                            </svg>
                            <span className="text-xs text-white">Doc</span>
                          </button>

                          <button
                            onClick={() => handleCreateItem('dashboard')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" clipRule="evenodd" d="M4 3.5H16C16.2761 3.5 16.5 3.72386 16.5 4V16C16.5 16.2761 16.2761 16.5 16 16.5H4C3.72386 16.5 3.5 16.2261 3.5 16V4C3.5 3.72386 3.72386 3.5 4 3.5ZM2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4Z" />
                            </svg>
                            <span className="text-xs text-white">Dashboard</span>
                          </button>

                          <button
                            onClick={() => handleCreateItem('folder')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" clipRule="evenodd" d="M3.81108 2.5C2.81085 2.5 2 3.36502 2 4.43208V15.5679C2 16.635 2.81085 17.5 3.81108 17.5H16.1889C17.1892 17.5 18 16.635 18 15.5679V7.97888C18 6.91182 17.1892 6.0468 16.1889 6.0468H12.2039L10.2143 3.31813C9.87492 2.80511 9.32306 2.5 8.7345 2.5H3.81108Z" />
                            </svg>
                            <span className="text-xs text-white">Folder</span>
                          </button>

                          <div className="border-t border-gray-600 my-1" />

                          {/* Advanced Items */}
                          <button
                            onClick={() => handleCreateItem('form')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4zm2 2a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 000 2h4a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-white">Form</span>
                          </button>

                          <button
                            onClick={() => handleCreateItem('workflow')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left hover:bg-gray-700 transition-colors"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" className="text-gray-400 flex-shrink-0">
                              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a1 1 0 01-.707 1.707H9.8a1 1 0 01-.707-1.707l1.027-1.028A3 3 0 009 8.172z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-white">Workflow</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Workspace Hierarchy */}
          {workspacesExpanded && selectedWorkspace && (
            <div className="px-2 space-y-1">
              {/* Render workspace items hierarchically */}
              {getRootItems().map((item) => (
                <WorkspaceItemComponent
                  key={item.id}
                  item={item}
                  level={0}
                  expandedFolders={expandedFolders}
                  onToggleFolder={toggleFolder}
                  onItemClick={(itemId, itemType) => {
                    if (itemType === 'folder' || itemType === 'subfolder') {
                      navigate(`/workspace/${selectedWorkspace.id}/${itemId}`);
                    } else {
                      // Handle board/doc/dashboard clicks
                      navigate(`/workspace/${selectedWorkspace.id}/item/${itemId}`);
                    }
                  }}
                  isCollapsed={isCollapsed}
                  allItems={workspaceItems}
                  onCreateInFolder={handleCreateInFolder}
                />
              ))}
              
              {/* Empty state */}
              {workspaceItems.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <div className="text-gray-400 text-sm">
                    No items in this workspace yet
                  </div>
                  <button
                    onClick={() => setAddMenuOpen(true)}
                    className="text-purple-400 hover:text-purple-300 text-xs mt-1"
                  >
                    Create your first item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default LeftSidebar;
