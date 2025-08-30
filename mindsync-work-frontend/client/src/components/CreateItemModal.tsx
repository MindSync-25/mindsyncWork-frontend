import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceService, getItemIcon, getItemColor } from '../services/workspaceService';
import type { WorkspaceItem, ItemType } from '../types/workspace';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  parentId?: string;
  allowedTypes: ItemType[];
  onItemCreated: (item: WorkspaceItem) => void;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  parentId,
  allowedTypes,
  onItemCreated
}) => {
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [icon, setIcon] = useState('');
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setSelectedType(null);
    setName('');
    setDescription('');
    setColor('');
    setIcon('');
    setCreating(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeSelect = (type: ItemType) => {
    setSelectedType(type);
    setColor(getItemColor(type));
    setIcon(getItemIcon(type));
    setName('');
    setDescription('');
  };

  const handleCreate = async () => {
    if (!selectedType || !name.trim()) return;

    setCreating(true);
    try {
      const newItem = await WorkspaceService.createWorkspaceItem({
        name: name.trim(),
        type: selectedType,
        workspaceId,
        parentId
      });

      onItemCreated(newItem);
      handleClose();
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setCreating(false);
    }
  };

  const predefinedColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600'
  ];

  const predefinedIcons = ['📁', '📂', '📋', '📊', '📝', '💼', '🎯', '⚡', '🔥', '💡', '🚀', '⭐'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create New Item</h2>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {!selectedType ? (
              /* Type Selection */
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What would you like to create?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {allowedTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getItemIcon(type)}</span>
                        <span className="font-semibold text-gray-900 capitalize group-hover:text-blue-600">
                          {type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {type === 'folder' && 'Organize items into groups'}
                        {type === 'subfolder' && 'Create sub-categories within folders'}
                        {type === 'board' && 'Kanban-style project management'}
                        {type === 'dashboard' && 'Analytics and overview displays'}
                        {type === 'doc' && 'Documentation and notes'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Item Details Form */
              <div className="space-y-6">
                {/* Back Button */}
                <button
                  onClick={() => setSelectedType(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to type selection
                </button>

                {/* Type Preview */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{selectedType}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedType === 'folder' && 'Organize items into groups'}
                      {selectedType === 'subfolder' && 'Create sub-categories within folders'}
                      {selectedType === 'dashboard' && 'Analytics and overview displays'}
                      {selectedType === 'doc' && 'Documentation and notes'}
                    </p>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Enter ${selectedType} name...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={`Describe this ${selectedType}...`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedColors.map((colorOption) => (
                      <button
                        key={colorOption}
                        onClick={() => setColor(colorOption)}
                        className={`w-8 h-8 bg-gradient-to-br ${colorOption} rounded-lg border-2 ${
                          color === colorOption ? 'border-gray-900' : 'border-gray-300'
                        } hover:scale-110 transition-transform`}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedIcons.map((iconOption) => (
                      <button
                        key={iconOption}
                        onClick={() => setIcon(iconOption)}
                        className={`w-10 h-10 text-xl border-2 ${
                          icon === iconOption ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        } rounded-lg hover:border-blue-300 transition-colors`}
                      >
                        {iconOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedType && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || creating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {creating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                Create {selectedType}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateItemModal;
