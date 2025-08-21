import React from 'react';
import { motion } from 'framer-motion';
import type { Workspace, WorkspaceItem } from '../types/workspace';
import { getItemIcon } from '../services/workspaceService';

interface BreadcrumbNavigationProps {
  workspace: Workspace;
  path: WorkspaceItem[];
  onNavigate: (path: string) => void;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  workspace,
  path,
  onNavigate
}) => {
  const handleWorkspaceClick = () => {
    onNavigate(`/workspace/${workspace.id}`);
  };

  const handleItemClick = (item: WorkspaceItem) => {
    if (item.type === 'folder' || item.type === 'subfolder') {
      onNavigate(`/workspace/${workspace.id}/${item.id}`);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm">
      {/* Workspace Root */}
      <motion.button
        onClick={handleWorkspaceClick}
        className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{workspace.icon}</span>
        <span className="font-medium text-gray-700 hover:text-gray-900">
          {workspace.name}
        </span>
      </motion.button>

      {/* Path Items */}
      {path.map((item, index) => (
        <React.Fragment key={item.id}>
          {/* Separator */}
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>

          {/* Path Item */}
          <motion.button
            onClick={() => handleItemClick(item)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              index === path.length - 1
                ? 'text-blue-600 font-medium bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={index === path.length - 1}
          >
            <span className="text-sm">{item.icon || getItemIcon(item.type)}</span>
            <span className="max-w-32 truncate">{item.name}</span>
            
            {/* Current Item Indicator */}
            {index === path.length - 1 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize ml-1">
                {item.type}
              </span>
            )}
          </motion.button>
        </React.Fragment>
      ))}

      {/* Path Length Indicator */}
      {path.length > 0 && (
        <div className="ml-2 text-xs text-gray-400">
          Level {path.length + 1}
        </div>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;
