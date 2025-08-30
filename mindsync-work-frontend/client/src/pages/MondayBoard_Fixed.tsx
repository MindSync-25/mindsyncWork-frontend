import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  [key: string]: any; // Allow dynamic columns
}

interface Column {
  id: string;
  label: string;
  type: 'text' | 'person' | 'status' | 'date' | 'timeline' | 'priority' | 'number' | 'dropdown';
  width?: string;
}

const MondayBoard: React.FC = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [_isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{taskId: string, columnId: string} | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  
  // Default columns
  const [columns, setColumns] = useState<Column[]>([
    { id: 'task', label: 'Task', type: 'text' },
    { id: 'owner', label: 'Owner', type: 'person' },
    { id: 'status', label: 'Status', type: 'status' },
    { id: 'dueDate', label: 'Due Date', type: 'date' },
    { id: 'timeline', label: 'Timeline', type: 'timeline' },
    { id: 'priority', label: 'Priority', type: 'priority' }
  ]);

  // Available column types for adding
  // const availableColumnTypes = [
  //   { id: 'text', label: 'Text', icon: '📝' },
  //   { id: 'number', label: 'Numbers', icon: '🔢' },
  //   { id: 'person', label: 'Person', icon: '👤' },
  //   { id: 'status', label: 'Status', icon: '🎯' },
  //   { id: 'date', label: 'Date', icon: '📅' },
  //   { id: 'timeline', label: 'Timeline', icon: '📊' },
  //   { id: 'priority', label: 'Priority', icon: '⚡' },
  //   { id: 'dropdown', label: 'Dropdown', icon: '📋' }
  // ];

  // Sample tasks with groups
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Design homepage mockup',
      owner: 'John Doe',
      status: 'working-on-it',
      dueDate: '2024-01-15',
      timelineStart: '2024-01-10',
      timelineEnd: '2024-01-15',
      priority: 'high',
      description: 'Create modern homepage design',
      labels: ['design', 'frontend'],
      group: 'Design Tasks'
    },
    {
      id: '2',
      name: 'Implement user authentication',
      owner: 'Jane Smith',
      status: 'done',
      dueDate: '2024-01-12',
      timelineStart: '2024-01-08',
      timelineEnd: '2024-01-12',
      priority: 'medium',
      description: 'Add login and signup functionality',
      labels: ['backend', 'security'],
      group: 'Development Tasks'
    },
    {
      id: '3',
      name: 'Write API documentation',
      owner: 'Bob Johnson',
      status: 'stuck',
      dueDate: '2024-01-20',
      timelineStart: '2024-01-15',
      timelineEnd: '2024-01-20',
      priority: 'low',
      description: 'Document all API endpoints',
      labels: ['documentation'],
      group: 'Documentation'
    }
  ]);

  const addNewTask = (groupName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      owner: '',
      status: 'not-started',
      dueDate: '',
      timelineStart: '',
      timelineEnd: '',
      priority: 'medium',
      description: '',
      labels: [],
      group: groupName
    };
    setTasks([...tasks, newTask]);
    setEditingCell({ taskId: newTask.id, columnId: 'task' });
  };

  const getTasksByGroup = (groupName: string) => {
    return tasks.filter(task => task.group === groupName);
  };

  const handleCellEdit = (taskId: string, columnId: string, value: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        // Special handling for timeline column
        if (columnId === 'timelineStart' || columnId === 'timelineEnd') {
          return { ...task, [columnId]: value };
        }
        return { ...task, [columnId]: value };
      }
      return task;
    }));
    setEditingCell(null);
  };

  const handleAddNewTask = (group: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      owner: '',
      status: 'not-started',
      dueDate: '',
      timelineStart: '',
      timelineEnd: '',
      priority: 'medium',
      description: '',
      labels: [],
      group: group
    };
    setTasks([...tasks, newTask]);
    // Auto-focus on the new task name
    setTimeout(() => {
      setEditingCell({ taskId: newTask.id, columnId: 'task' });
    }, 100);
  };

  const renderCell = (task: Task, column: Column) => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.columnId === column.id;
    const value = column.id === 'task' ? task.name : task[column.id] || '';

    if (isEditing) {
      // Special handling for status dropdown
      if (column.type === 'status' && column.id === 'status') {
        return (
          <select
            defaultValue={task.status}
            autoFocus
            onBlur={(e) => handleCellEdit(task.id, column.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(task.id, column.id, (e.target as HTMLSelectElement).value);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-purple-500"
          >
            <option value="not-started">Not Started</option>
            <option value="working-on-it">Working on it</option>
            <option value="stuck">Stuck</option>
            <option value="done">Done</option>
          </select>
        );
      }

      // Special handling for timeline date picker
      if (column.type === 'timeline') {
        return (
          <div className="flex items-center gap-1">
            <input
              type="date"
              defaultValue={task.timelineStart}
              onBlur={(e) => {
                const startDate = e.target.value;
                const endDate = task.timelineEnd || startDate;
                handleCellEdit(task.id, 'timelineStart', startDate);
                handleCellEdit(task.id, 'timelineEnd', endDate);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const endDate = task.timelineEnd || (e.target as HTMLInputElement).value;
                  handleCellEdit(task.id, 'timelineStart', (e.target as HTMLInputElement).value);
                  handleCellEdit(task.id, 'timelineEnd', endDate);
                  setEditingCell(null);
                } else if (e.key === 'Escape') {
                  setEditingCell(null);
                }
              }}
              className="w-20 bg-white border border-gray-300 rounded px-1 py-1 text-xs outline-none focus:border-purple-500"
            />
            <span className="text-xs text-gray-500">to</span>
            <input
              type="date"
              defaultValue={task.timelineEnd}
              onBlur={(e) => {
                handleCellEdit(task.id, 'timelineEnd', e.target.value);
              }}
              className="w-20 bg-white border border-gray-300 rounded px-1 py-1 text-xs outline-none focus:border-purple-500"
            />
          </div>
        );
      }

      // Special handling for date picker
      if (column.type === 'date') {
        return (
          <input
            type="date"
            defaultValue={value}
            autoFocus
            onBlur={(e) => handleCellEdit(task.id, column.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(task.id, column.id, (e.target as HTMLInputElement).value);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-purple-500"
          />
        );
      }

      // Default text input for other types
      return (
        <input
          type="text"
          defaultValue={value}
          autoFocus
          onBlur={(e) => handleCellEdit(task.id, column.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellEdit(task.id, column.id, (e.target as HTMLInputElement).value);
            } else if (e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
          className="w-full bg-transparent border-none outline-none"
        />
      );
    }

    switch (column.type) {
      case 'person':
        if (column.id === 'owner') {
        return task.owner ? (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {task.owner.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-xs text-gray-700">{task.owner}</span>
          </div>
        ) : (
          <button className="w-5 h-5 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-purple-500 transition-colors">
            <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        );
        }
        return null;

      case 'status':
        return <StatusBadge status={task.status} />;

      case 'timeline':
        if (task.timelineStart && task.timelineEnd) {
          const startDate = new Date(task.timelineStart);
          const endDate = new Date(task.timelineEnd);
          const today = new Date();
          
          const isOverdue = endDate < today && task.status !== 'done';
          const isActive = startDate <= today && endDate >= today;
          
          return (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-600' : isActive ? 'text-purple-600' : 'text-gray-600'
            }`}>
              <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>→</span>
              <span>{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          );
        }
        return <span className="text-xs text-gray-400">No timeline</span>;

      case 'priority':
        if (column.id === 'priority') {
          return <span className="text-xs">{getPriorityIcon(task.priority)}</span>;
        }
        return null;

      case 'date':
        if (value) {
          const date = new Date(value);
          return <span className="text-xs text-gray-700">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>;
        }
        return <span className="text-xs text-gray-400">No date</span>;

      default:
        return <span className="text-xs text-gray-700">{value}</span>;
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <span className="text-red-500">🔴</span>;
      case 'medium':
        return <span className="text-yellow-500">🟡</span>;
      case 'low':
        return <span className="text-green-500">🟢</span>;
      default:
        return <span className="text-gray-400">⚪</span>;
    }
  };

  const StatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
    const statusConfig = {
      'working-on-it': { label: 'Working on it', color: 'bg-orange-100 text-orange-800' },
      'done': { label: 'Done', color: 'bg-green-100 text-green-800' },
      'stuck': { label: 'Stuck', color: 'bg-red-100 text-red-800' },
      'not-started': { label: 'Not Started', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(task => task.id));
    }
  };

  // Get unique groups
  const groups = Array.from(new Set(tasks.map(task => task.group)));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-violet-700 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" width="18" height="18" className="rotate-45">
                  <circle cx="5" cy="5" r="3"/>
                  <circle cx="15" cy="5" r="3"/>
                  <circle cx="5" cy="15" r="3"/>
                  <circle cx="15" cy="15" r="3"/>
                  <circle cx="10" cy="10" r="2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindSync work</h1>
                <p className="text-xs text-gray-500">Project Management</p>
              </div>
            </div>
            
            {/* See Plans Button */}
            <button 
              className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
              title="View pricing plans"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                <path d="M5.7205 3.22905C5.8506 3.08332 6.03668 3 6.23203 3H14.2113C14.4224 3 14.6217 3.09723 14.7516 3.26359L17.8547 7.23601C18.053 7.48988 18.0478 7.84757 17.8423 8.09563L10.528 16.9232C10.3977 17.0804 10.2042 17.1714 10 17.1714C9.79582 17.1714 9.60226 17.0804 9.47198 16.9232L2.1577 8.09563C1.94134 7.8345 1.94835 7.45444 2.17418 7.20147L5.7205 3.22905Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
              </svg>
              See Plans
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-80 pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                title="Search all items"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11h16" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* Help */}
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="Help & Support">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="relative" title="User profile">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <div className="w-1.5 h-1.5 bg-gradient-to-br from-purple-600 to-violet-700 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Secondary Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAddNewTask('To-Do')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                title="Create new task"
              >
                New task
              </button>
              <button 
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="More options"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{tasks.length}</span> items
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg border-b-2 border-purple-600">
              <span className="font-medium text-sm">Main table</span>
            </div>
            <button 
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              title="Add new view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add view
            </button>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedTasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 border-b border-purple-200 px-6 py-3 flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-purple-800">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  Assign
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Set Status
                </button>
                
                <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
                
                <button 
                  onClick={() => setSelectedTasks([])}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear selection
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 sticky top-0 z-10">
              <div style={{ gridTemplateColumns: '40px 1fr ' + columns.map(() => '140px').join(' ') + ' 40px' }} className="grid gap-2 items-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                    onChange={toggleAllTasks}
                    className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                </div>
                
                {columns.map((column) => (
                  <div key={column.id} className="flex items-center gap-2">
                    {editingColumn === column.id ? (
                      <input
                        type="text"
                        defaultValue={column.label}
                        autoFocus
                        onBlur={(e) => {
                          const newLabel = e.target.value.trim();
                          if (newLabel) {
                            setColumns(columns.map(col => 
                              col.id === column.id ? { ...col, label: newLabel } : col
                            ));
                          }
                          setEditingColumn(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newLabel = (e.target as HTMLInputElement).value.trim();
                            if (newLabel) {
                              setColumns(columns.map(col => 
                                col.id === column.id ? { ...col, label: newLabel } : col
                              ));
                            }
                            setEditingColumn(null);
                          } else if (e.key === 'Escape') {
                            setEditingColumn(null);
                          }
                        }}
                        className="text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-purple-500"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingColumn(column.id)}
                        className="text-xs font-medium text-gray-700 hover:text-gray-900 text-left"
                        title={`Edit ${column.label} column`}
                      >
                        {column.label}
                      </button>
                    )}
                  </div>
                ))}
                
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setIsAddColumnModalOpen(true)}
                    className="w-5 h-5 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-colors group"
                    title="Add new column"
                  >
                    <svg className="w-2 h-2 text-gray-400 group-hover:text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {groups.map((groupName) => (
                <div key={groupName}>
                  {/* Group Header */}
                  <div className="bg-gray-25 px-4 py-1.5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium text-gray-600">{groupName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{getTasksByGroup(groupName).length} items</span>
                        <button
                          onClick={() => addNewTask(groupName)}
                          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                        >
                          + Add item
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Group Tasks */}
                  {getTasksByGroup(groupName).map((task) => (
                    <div
                      key={task.id}
                      style={{ gridTemplateColumns: '40px 1fr ' + columns.map(() => '140px').join(' ') + ' 40px' }}
                      className={`grid gap-2 px-3 py-2 hover:bg-purple-50 transition-colors border-l-4 ${
                        selectedTasks.includes(task.id) ? 'bg-purple-50' : ''
                      } ${task.status === 'done' ? 'border-green-400' : task.status === 'stuck' ? 'border-red-400' : task.status === 'working-on-it' ? 'border-orange-400' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className="w-3 h-3 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </div>
                      
                      {columns.map((column) => (
                        <div
                          key={column.id}
                          onClick={() => setEditingCell({ taskId: task.id, columnId: column.id })}
                          className="flex items-center min-h-[24px] cursor-pointer hover:bg-gray-50 rounded px-1 transition-colors"
                          title={`Edit ${column.label}`}
                        >
                          {renderCell(task, column)}
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-center">
                        <button className="w-4 h-4 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Task Row for Group */}
                  <div
                    style={{ gridTemplateColumns: '40px 1fr ' + columns.map(() => '140px').join(' ') + ' 40px' }}
                    className="w-full grid gap-2 px-3 py-2 hover:bg-purple-50 transition-colors text-left border-l-4"
                  >
                    <div></div>
                    <button
                      onClick={() => addNewTask(groupName)}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-colors text-left"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">Add new task</span>
                    </button>
                    {columns.slice(1).map((column) => (
                      <div key={column.id}></div>
                    ))}
                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MondayBoard;
