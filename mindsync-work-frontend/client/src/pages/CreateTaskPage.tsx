import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface Task {
  title: string;
  description: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'Working on it' | 'Stuck' | 'Done';
  dueDate: string;
  tags: string[];
  attachments: File[];
  estimatedHours: number;
  column: string;
}

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [task, setTask] = useState<Task>({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    status: 'Not Started',
    dueDate: '',
    tags: [],
    attachments: [],
    estimatedHours: 0,
    column: 'backlog'
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get team members (in real app, this would come from API)
  const teamMembers = [
    { id: 'john-d', name: 'John Doe', avatar: 'JD', email: 'john@company.com' },
    { id: 'alice-s', name: 'Alice Smith', avatar: 'AS', email: 'alice@company.com' },
    { id: 'mike-k', name: 'Mike Johnson', avatar: 'MK', email: 'mike@company.com' },
    { id: 'sarah-l', name: 'Sarah Lee', avatar: 'SL', email: 'sarah@company.com' },
    { id: 'tom-r', name: 'Tom Rodriguez', avatar: 'TR', email: 'tom@company.com' }
  ];

  // Get available columns (from workspace customization)
  const availableColumns = [
    { id: 'backlog', name: 'Backlog', color: 'bg-gray-500' },
    { id: 'todo', name: 'To Do', color: 'bg-blue-500' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-orange-500' },
    { id: 'review', name: 'Review', color: 'bg-purple-500' },
    { id: 'done', name: 'Done', color: 'bg-green-500' }
  ];

  const priorities = [
    { value: 'Low', color: 'bg-gray-500', textColor: 'text-gray-700' },
    { value: 'Medium', color: 'bg-blue-500', textColor: 'text-blue-700' },
    { value: 'High', color: 'bg-orange-500', textColor: 'text-orange-700' },
    { value: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' }
  ];

  const statuses = [
    { value: 'Not Started', color: 'bg-gray-500' },
    { value: 'Working on it', color: 'bg-blue-500' },
    { value: 'Stuck', color: 'bg-red-500' },
    { value: 'Done', color: 'bg-green-500' }
  ];

  const handleInputChange = (field: keyof Task, value: any) => {
    setTask(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      setTask(prev => ({ 
        ...prev, 
        tags: [...prev.tags, newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTask(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setTask(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!task.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, this would save to database
    console.log('Creating task:', task);
    
    setIsSubmitting(false);
    
    // Navigate back to dashboard
    navigate('/dashboard', {
      state: {
        ...location.state,
        newTask: task,
        showTaskCreated: true
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard', { state: location.state });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <motion.div 
          className="bg-gray-800/50 border-b border-gray-700 px-6 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleCancel}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </motion.button>
              <div className="w-px h-6 bg-gray-600"></div>
              <h1 className="text-xl font-semibold text-white">Create New Task</h1>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={!task.title.trim() || isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  task.title.trim() && !isSubmitting
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={task.title.trim() && !isSubmitting ? { scale: 1.02 } : {}}
                whileTap={task.title.trim() && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Task'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Form - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </motion.div>

                {/* Task Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={task.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the task in detail..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </motion.div>

                {/* Priority and Status */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorities.map((priority) => (
                        <motion.button
                          key={priority.value}
                          onClick={() => handleInputChange('priority', priority.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                            task.priority === priority.value
                              ? `${priority.color} border-white text-white`
                              : `bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500`
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {priority.value}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map((status) => (
                        <motion.button
                          key={status.value}
                          onClick={() => handleInputChange('status', status.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium ${
                            task.status === status.value
                              ? `${status.color} border-white text-white`
                              : `bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500`
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {status.value === 'Not Started' ? 'Not Started' : status.value}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-purple-400 hover:text-purple-200 ml-1"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag..."
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <motion.button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>

                {/* Attachments */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="space-y-3">
                    {task.attachments.length > 0 && (
                      <div className="space-y-2">
                        {task.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-600">
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="text-white text-sm">{file.name}</span>
                              <span className="text-gray-400 text-xs">({Math.round(file.size / 1024)} KB)</span>
                            </div>
                            <button
                              onClick={() => handleRemoveAttachment(index)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - Right Side */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Assignee */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Assignment</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Assignee
                      </label>
                      <select
                        value={task.assignee}
                        onChange={(e) => handleInputChange('assignee', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select assignee...</option>
                        {teamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {task.assignee && (
                      <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {teamMembers.find(m => m.id === task.assignee)?.avatar}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">
                            {teamMembers.find(m => m.id === task.assignee)?.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {teamMembers.find(m => m.id === task.assignee)?.email}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        value={task.estimatedHours}
                        onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Column */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Organization</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Column
                    </label>
                    <div className="space-y-2">
                      {availableColumns.map((column) => (
                        <motion.button
                          key={column.id}
                          onClick={() => handleInputChange('column', column.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
                            task.column === column.id
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                          <span className="text-white font-medium">{column.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
