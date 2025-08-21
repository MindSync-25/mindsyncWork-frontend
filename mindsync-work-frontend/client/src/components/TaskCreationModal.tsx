import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  name: string;
  owner: string;
  status: 'working-on-it' | 'done' | 'stuck' | 'not-started';
  dueDate: string;
  timelineStart: string;
  timelineEnd: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  labels: string[];
  group: string;
}

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
  groups: string[];
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  groups
}) => {
  const [taskData, setTaskData] = useState({
    name: '',
    owner: '',
    status: 'not-started' as const,
    dueDate: '',
    timelineStart: '',
    timelineEnd: '',
    priority: 'medium' as const,
    description: '',
    labels: [] as string[],
    group: groups[0] || 'To-Do'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', color: 'bg-gray-400' },
    { value: 'working-on-it', label: 'Working on it', color: 'bg-orange-500' },
    { value: 'stuck', label: 'Stuck', color: 'bg-red-500' },
    { value: 'done', label: 'Done', color: 'bg-green-500' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'bg-red-500', icon: '🔥' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-500', icon: '⚡' },
    { value: 'low', label: 'Low Priority', color: 'bg-blue-500', icon: '💧' }
  ];

  const teamMembers = [
    { id: 'john', name: 'John Doe', avatar: 'JD', color: 'bg-blue-500' },
    { id: 'alice', name: 'Alice Smith', avatar: 'AS', color: 'bg-purple-500' },
    { id: 'mike', name: 'Mike Johnson', avatar: 'MJ', color: 'bg-green-500' },
    { id: 'sarah', name: 'Sarah Wilson', avatar: 'SW', color: 'bg-pink-500' },
    { id: 'tom', name: 'Tom Brown', avatar: 'TB', color: 'bg-orange-500' }
  ];

  const handleSubmit = () => {
    if (taskData.name.trim()) {
      onCreateTask(taskData);
      setTaskData({
        name: '',
        owner: '',
        status: 'not-started',
        dueDate: '',
        timelineStart: '',
        timelineEnd: '',
        priority: 'medium',
        description: '',
        labels: [],
        group: groups[0] || 'To-Do'
      });
      setCurrentStep(1);
      onClose();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Task Name *
        </label>
        <input
          type="text"
          value={taskData.name}
          onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
          placeholder="Enter task name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Description
        </label>
        <textarea
          value={taskData.description}
          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          placeholder="Describe what needs to be done..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Group
        </label>
        <div className="grid grid-cols-2 gap-3">
          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setTaskData({ ...taskData, group })}
              className={`p-3 rounded-lg border-2 transition-all ${
                taskData.group === group
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  group === 'To-Do' ? 'bg-blue-500' : 
                  group === 'In Progress' ? 'bg-orange-500' : 
                  'bg-green-500'
                }`}></div>
                <span className="font-medium">{group}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Assign to Team Member
        </label>
        <div className="grid grid-cols-1 gap-3">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setTaskData({ ...taskData, owner: member.name })}
              className={`p-4 rounded-lg border-2 transition-all ${
                taskData.owner === member.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${member.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {member.avatar}
                </div>
                <span className="font-medium text-gray-800">{member.name}</span>
                {taskData.owner === member.name && (
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Priority Level
        </label>
        <div className="grid grid-cols-1 gap-3">
          {priorityOptions.map((priority) => (
            <button
              key={priority.value}
              onClick={() => setTaskData({ ...taskData, priority: priority.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                taskData.priority === priority.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{priority.icon}</span>
                <span className="font-medium text-gray-800">{priority.label}</span>
                {taskData.priority === priority.value && (
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Status
        </label>
        <div className="grid grid-cols-2 gap-3">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setTaskData({ ...taskData, status: status.value as any })}
              className={`p-4 rounded-lg border-2 transition-all ${
                taskData.status === status.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 ${status.color} rounded`}></div>
                <span className="font-medium text-gray-800">{status.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Due Date
          </label>
          <input
            type="date"
            value={taskData.dueDate}
            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Timeline Start
          </label>
          <input
            type="date"
            value={taskData.timelineStart}
            onChange={(e) => setTaskData({ ...taskData, timelineStart: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Timeline End
        </label>
        <input
          type="date"
          value={taskData.timelineEnd}
          onChange={(e) => setTaskData({ ...taskData, timelineEnd: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create New Task</h2>
                <p className="text-blue-100 mt-1">Step {currentStep} of {totalSteps}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-blue-100 mb-2">
                <span>Basic Info</span>
                <span>Assignment</span>
                <span>Schedule</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !taskData.name.trim()}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    (currentStep === 1 && !taskData.name.trim())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!taskData.name.trim()}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    !taskData.name.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg'
                  }`}
                >
                  Create Task
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskCreationModal;
