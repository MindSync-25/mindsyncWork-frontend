import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  name: string;
  group: string;
  board: string;
  owner: string;
  status: 'working-on-it' | 'done' | 'stuck' | 'not-started';
  dueDate: string;
  timelineStart: string;
  timelineEnd: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  labels: string[];
  [key: string]: any; // Allow dynamic columns
}

interface Column {
  id: string;
  label: string;
  type: 'text' | 'person' | 'status' | 'date' | 'timeline' | 'priority' | 'number' | 'dropdown';
  width?: string;
}

interface TaskGroup {
  id: string;
  title: string;
  color: string;
  itemCount: number;
  collapsed: boolean;
  tasks: Task[];
}

const MyWorkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'calendar'>('table');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{taskId: string, columnId: string} | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  // Default columns - same as home page
  const [columns] = useState<Column[]>([
    { id: 'task', label: 'Task', type: 'text' },
    { id: 'owner', label: 'Owner', type: 'person' },
    { id: 'status', label: 'Status', type: 'status' },
    { id: 'dueDate', label: 'Due Date', type: 'date' },
    { id: 'timeline', label: 'Timeline', type: 'timeline' },
    { id: 'priority', label: 'Priority', type: 'priority' }
  ]);

  // Helper function to get date category
  const getDateCategory = (dueDate: string): string => {
    if (!dueDate) return 'nodate';
    
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 7) return 'thisweek';
    if (diffDays <= 14) return 'nextweek';
    return 'later';
  };

  // Sample tasks data - now with dynamic categorization
  const [allTasks, setAllTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'demo_task',
      group: 'To-Do',
      board: 'demo',
      owner: 'John Doe',
      status: 'working-on-it',
      dueDate: '2025-08-15',
      timelineStart: '2025-08-15',
      timelineEnd: '2025-08-17',
      priority: 'high',
      description: 'Initial demo task',
      labels: []
    },
    {
      id: '2',
      name: 'Review design mockups',
      group: 'Design',
      board: 'Marketing',
      owner: 'Sarah Chen',
      status: 'done',
      dueDate: '2025-08-17',
      timelineStart: '2025-08-17',
      timelineEnd: '2025-08-18',
      priority: 'medium',
      description: '',
      labels: []
    },
    {
      id: '3',
      name: 'Setup deployment pipeline',
      group: 'DevOps',
      board: 'Backend',
      owner: 'Mike Wilson',
      status: 'stuck',
      dueDate: '2025-08-19',
      timelineStart: '2025-08-19',
      timelineEnd: '2025-08-21',
      priority: 'high',
      description: '',
      labels: []
    },
    {
      id: '4',
      name: 'User testing session',
      group: 'Research',
      board: 'Product',
      owner: 'Lisa Park',
      status: 'not-started',
      dueDate: '2025-08-25',
      timelineStart: '2025-08-25',
      timelineEnd: '2025-08-26',
      priority: 'medium',
      description: '',
      labels: []
    },
    {
      id: '5',
      name: 'Database migration',
      group: 'Development',
      board: 'Backend',
      owner: 'Alex Thompson',
      status: 'working-on-it',
      dueDate: '',
      timelineStart: '',
      timelineEnd: '',
      priority: 'high',
      description: '',
      labels: []
    }
  ]);

  // Generate task groups dynamically based on dates
  const generateTaskGroups = (): TaskGroup[] => {
    const filteredTasks = allTasks.filter(task => 
      task.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.board.toLowerCase().includes(searchFilter.toLowerCase()) ||
      task.group.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const groupCategories = [
      { id: 'past', title: 'Past Dates', color: 'rgb(127, 83, 71)' },
      { id: 'today', title: 'Today', color: 'rgb(3, 127, 76)' },
      { id: 'thisweek', title: 'This week', color: 'rgb(0, 126, 181)' },
      { id: 'nextweek', title: 'Next week', color: 'rgb(102, 204, 255)' },
      { id: 'later', title: 'Later', color: 'rgb(202, 182, 65)' },
      { id: 'nodate', title: 'Without a date', color: 'rgb(117, 117, 117)' }
    ];

    return groupCategories.map(category => {
      const tasks = filteredTasks.filter(task => getDateCategory(task.dueDate) === category.id);
      return {
        ...category,
        itemCount: tasks.length,
        collapsed: tasks.length === 0,
        tasks
      };
    });
  };

  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(generateTaskGroups());

  // Update task groups when search filter or tasks change
  React.useEffect(() => {
    setTaskGroups(generateTaskGroups());
  }, [searchFilter, allTasks]);

  const toggleGroup = (groupId: string) => {
    setTaskGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, collapsed: !group.collapsed }
        : group
    ));
  };

  const addNewTask = (groupId: string) => {
    // Calculate appropriate due date based on section
    const today = new Date();
    let dueDate = '';
    
    switch (groupId) {
      case 'past':
        // Set to yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dueDate = yesterday.toISOString().split('T')[0];
        break;
      case 'today':
        // Set to today
        dueDate = today.toISOString().split('T')[0];
        break;
      case 'thisweek':
        // Set to tomorrow (within this week)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
        break;
      case 'nextweek':
        // Set to next week
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 8);
        dueDate = nextWeek.toISOString().split('T')[0];
        break;
      case 'later':
        // Set to 3 weeks from now
        const later = new Date(today);
        later.setDate(later.getDate() + 21);
        dueDate = later.toISOString().split('T')[0];
        break;
      case 'nodate':
      default:
        // No due date
        dueDate = '';
        break;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      group: '',
      board: '',
      owner: '',
      status: 'not-started',
      dueDate,
      timelineStart: '',
      timelineEnd: '',
      priority: 'medium',
      description: '',
      labels: []
    };

    // Start editing the new task name immediately
    setEditingCell({ taskId: newTask.id, columnId: 'task' });
    
    // Add task to allTasks and regenerate groups
    setAllTasks(prev => [...prev, newTask]);
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleCellEdit = (taskId: string, columnId: string, value: any) => {
    setAllTasks(prev => prev.map(task => {
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

  const handleEditColumn = (columnId: string, newLabel: string) => {
    // Update column label if needed (for future enhancement)
    console.log(`Column ${columnId} updated to: ${newLabel}`);
    setEditingColumn(null);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working-on-it': return 'Working on it';
      case 'done': return 'Done';
      case 'stuck': return 'Stuck';
      case 'not-started': return 'Not Started';
      default: return 'Not Started';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working-on-it': return 'bg-orange-500';
      case 'done': return 'bg-green-500';
      case 'stuck': return 'bg-red-500';
      case 'not-started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderCellContent = (task: Task, column: Column) => {
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

      // Special handling for priority dropdown
      if (column.type === 'priority' && column.id === 'priority') {
        return (
          <select
            defaultValue={task.priority}
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
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        );
      }

      // Special handling for timeline date picker
      if (column.type === 'timeline' && column.id === 'timeline') {
        return (
          <div className="flex items-center gap-2">
            <input
              type="date"
              defaultValue={task.timelineStart}
              autoFocus
              onBlur={(e) => {
                const endDate = task.timelineEnd || e.target.value;
                handleCellEdit(task.id, 'timelineStart', e.target.value);
                handleCellEdit(task.id, 'timelineEnd', endDate);
                setEditingCell(null);
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
              className="w-20 bg-white border border-gray-300 rounded px-1 py-1 text-xs outline-none focus:border-blue-500"
            />
            <span className="text-xs text-gray-500">to</span>
            <input
              type="date"
              defaultValue={task.timelineEnd}
              onBlur={(e) => {
                handleCellEdit(task.id, 'timelineEnd', e.target.value);
              }}
              className="w-20 bg-white border border-gray-300 rounded px-1 py-1 text-xs outline-none focus:border-blue-500"
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
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
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
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {task.owner.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-xs text-gray-700 truncate">{task.owner}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Unassigned</span>
            </div>
          );
        }
        break;

      case 'status':
        if (column.id === 'status') {
          return (
            <div className="flex items-center justify-center">
              <span className={`px-2 py-1 ${getStatusColor(task.status)} text-white text-xs rounded-full font-medium`}>
                {getStatusText(task.status)}
              </span>
            </div>
          );
        }
        break;

      case 'priority':
        if (column.id === 'priority') {
          return (
            <div className="flex items-center justify-center">
              <span className={`px-2 py-1 ${getPriorityColor(task.priority)} text-white text-xs rounded-full font-medium`}>
                {getPriorityText(task.priority)}
              </span>
            </div>
          );
        }
        break;

      case 'date':
        return (
          <div className="text-center">
            <span className="text-xs text-gray-600">{formatDate(value)}</span>
          </div>
        );

      case 'timeline':
        if (task.timelineStart && task.timelineEnd) {
          return (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">{formatDate(task.timelineStart)}</span>
              <span className="text-xs text-gray-400">→</span>
              <span className="text-xs text-gray-600">{formatDate(task.timelineEnd)}</span>
            </div>
          );
        }
        return <span className="text-xs text-gray-400">-</span>;

      default:
        return <span className="text-xs text-gray-700">{value}</span>;
    }

    return <span className="text-xs text-gray-700">{value}</span>;
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        {/* Top Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>•</span>
                <span>{allTasks.length} total tasks</span>
                <span>•</span>
                <span>{taskGroups.filter(g => g.itemCount > 0).length} active sections</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-gray-600">
                  <path d="M4.5559 4.55593C5.99976 3.11206 7.95806 2.3009 10 2.3009C12.0419 2.3009 14.0002 3.11206 15.4441 4.55593C16.888 5.99979 17.6991 7.9581 17.6991 10C17.6991 12.042 16.888 14.0003 15.4441 15.4441C14.0002 16.888 12.0419 17.6992 10 17.6992C7.95806 17.6992 5.99976 16.888 4.5559 15.4441C3.11203 14.0003 2.30087 12.042 2.30087 10C2.30087 7.9581 3.11203 5.99979 4.5559 4.55593ZM10 3.8009C8.35589 3.8009 6.77912 4.45402 5.61656 5.61659C4.45399 6.77915 3.80087 8.35592 3.80087 10C3.80087 11.6441 4.45399 13.2209 5.61656 14.3835C6.77912 15.546 8.35589 16.1992 10 16.1992C11.6441 16.1992 13.2209 15.546 14.3834 14.3835C15.546 13.2209 16.1991 11.6441 16.1991 10C16.1991 8.35592 15.546 6.77915 14.3834 5.61659C13.2209 4.45402 11.6441 3.8009 10 3.8009ZM10 9.25006C10.4142 9.25006 10.75 9.58585 10.75 10.0001V13.4746C10.75 13.8888 10.4142 14.2246 10 14.2246C9.58579 14.2246 9.25 13.8888 9.25 13.4746V10.0001C9.25 9.58585 9.58579 9.25006 10 9.25006ZM9.54135 6.21669C9.7058 6.10681 9.89914 6.04816 10.0969 6.04816C10.3621 6.04816 10.6165 6.15351 10.804 6.34105C10.9916 6.52859 11.0969 6.78294 11.0969 7.04816C11.0969 7.24593 11.0383 7.43927 10.9284 7.60373C10.8185 7.76818 10.6623 7.89635 10.4796 7.97204C10.2969 8.04772 10.0958 8.06753 9.90183 8.02894C9.70786 7.99036 9.52967 7.89512 9.38982 7.75526C9.24996 7.61541 9.15472 7.43722 9.11614 7.24325C9.07755 7.04927 9.09736 6.8482 9.17304 6.66547C9.24873 6.48275 9.3769 6.32657 9.54135 6.21669Z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-gray-600">
                  <path d="M13.6787 2.81141C12.6 2.27571 11.4118 1.99795 10.2076 2.00001C8.82154 1.99824 7.46024 2.36762 6.26487 3.06986C5.06913 3.77232 4.08301 4.78224 3.40884 5.99482C2.73467 7.20739 2.39702 8.57845 2.43092 9.9657C2.46129 11.2085 2.78887 12.4237 3.38348 13.5103L2.13059 16.1439C1.60692 17.2446 2.75507 18.3935 3.8548 17.8692L6.48564 16.6149C7.41302 17.123 8.43558 17.4373 9.49117 17.5368C10.6905 17.6499 11.8996 17.4827 13.0234 17.0484C14.1471 16.614 15.1547 15.9245 15.9667 15.034C16.7788 14.1435 17.3731 13.0764 17.7029 11.9168C18.0326 10.7572 18.0888 9.53685 17.867 8.35185C17.6451 7.16685 17.1514 6.0496 16.4245 5.08814C15.6977 4.12669 14.7578 3.34731 13.6787 2.81141ZM10.2092 3.55355C11.1735 3.55174 12.125 3.77408 12.9887 4.20304C13.8525 4.632 14.6049 5.25587 15.1867 6.02547C15.7684 6.79508 16.1637 7.68939 16.3413 8.63794C16.5188 9.58648 16.4739 10.5633 16.2099 11.4915C15.946 12.4197 15.4702 13.2739 14.8202 13.9867C14.1702 14.6995 13.3637 15.2515 12.4642 15.5992C11.5647 15.9468 10.5968 16.0807 9.63678 15.9901C8.67679 15.8996 7.75091 15.5872 6.93213 15.0775C6.70752 14.9377 6.42723 14.922 6.18843 15.0358L3.84556 16.1528L4.96133 13.8075C5.07505 13.5685 5.05929 13.2879 4.91952 13.0631C4.33329 12.1204 4.00983 11.0378 3.9827 9.92771C3.95557 8.81763 4.22576 7.72051 4.76524 6.7502C5.30471 5.77989 6.09381 4.97175 7.05064 4.40964C8.00747 3.84754 9.09717 3.55195 10.2067 3.55355L10.2092 3.55355Z" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path d="M8.94999 11C8.71836 12.1411 7.70948 13 6.5 13 5.29052 13 4.28164 12.1411 4.05001 11H2.75C2.33579 11 2 10.6642 2 10.25 2 9.83579 2.33579 9.5 2.75 9.5H4.20802C4.5938 8.61705 5.47484 8 6.5 8 7.52516 8 8.4062 8.61705 8.79198 9.5H17.25C17.6642 9.5 18 9.83579 18 10.25 18 10.6642 17.6642 11 17.25 11H8.94999zM6.5 11.5C7.05228 11.5 7.5 11.0523 7.5 10.5 7.5 9.94772 7.05228 9.5 6.5 9.5 5.94772 9.5 5.5 9.94772 5.5 10.5 5.5 11.0523 5.94772 11.5 6.5 11.5zM11.05 4C11.2816 2.85888 12.2905 2 13.5 2 14.7095 2 15.7184 2.85888 15.95 4L17.25 4C17.6642 4 18 4.33579 18 4.75 18 5.16421 17.6642 5.5 17.25 5.5L15.792 5.5C15.4062 6.38295 14.5252 7 13.5 7 12.4748 7 11.5938 6.38295 11.208 5.5L2.75 5.5C2.33579 5.5 2 5.16421 2 4.75 2 4.33579 2.33579 4 2.75 4L11.05 4zM13.5 3.5C12.9477 3.5 12.5 3.94772 12.5 4.5 12.5 5.05228 12.9477 5.5 13.5 5.5 14.0523 5.5 14.5 5.05228 14.5 4.5 14.5 3.94772 14.0523 3.5 13.5 3.5zM11.05 15C11.2816 13.8589 12.2905 13 13.5 13 14.7095 13 15.7184 13.8589 15.95 15L17.25 15C17.6642 15 18 15.3358 18 15.75 18 16.1642 17.6642 16.5 17.25 16.5L15.792 16.5C15.4062 17.383 14.5252 18 13.5 18 12.4748 18 11.5938 17.383 11.208 16.5L2.75 16.5C2.33579 16.5 2 16.1642 2 15.75 2 15.3358 2.33579 15 2.75 15L11.05 15zM13.5 14.5C12.9477 14.5 12.5 14.9477 12.5 15.5 12.5 16.0523 12.9477 16.5 13.5 16.5 14.0523 16.5 14.5 16.0523 14.5 15.5 14.5 14.9477 14.0523 14.5 13.5 14.5z" />
                </svg>
                Customize
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'table'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'calendar'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M10 2C10.4142 2 10.75 2.33579 10.75 2.75V9.25H17.25C17.6642 9.25 18 9.58579 18 10C18 10.4142 17.6642 10.75 17.25 10.75H10.75V17.25C10.75 17.6642 10.4142 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25V10.75H2.75C2.33579 10.75 2 10.4142 2 10C2 9.58579 2.33579 9.25 2.75 9.25H9.25V2.75C9.25 2.33579 9.58579 2 10 2Z" />
                  </svg>
                  New item
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Expand all sections">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M5.22 8.22a.75.75 0 0 0 0 1.06L9.94 14a.75.75 0 0 0 1.06 0l4.72-4.72a.75.75 0 1 0-1.06-1.06L10 12.88 5.34 8.22a.75.75 0 0 0-1.06 0Z" />
                  </svg>
                </button>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh data">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.65191 2.37299C6.9706 2.37299 5.35814 3.04089 4.16927 4.22976C2.9804 5.41863 2.3125 7.03108 2.3125 8.7124C2.3125 10.3937 2.9804 12.0062 4.16927 13.195C5.35814 14.3839 6.9706 15.0518 8.65191 15.0518C10.0813 15.0518 11.4609 14.5691 12.5728 13.6939L16.4086 17.5303C16.7014 17.8232 17.1763 17.8232 17.4692 17.5303C17.7621 17.2375 17.7622 16.7626 17.4693 16.4697L13.6334 12.6333C14.5086 11.5214 14.9913 10.1418 14.9913 8.7124C14.9913 7.03108 14.3234 5.41863 13.1346 4.22976C11.9457 3.04089 10.3332 2.37299 8.65191 2.37299ZM12.091 12.1172C12.9878 11.2113 13.4913 9.98783 13.4913 8.7124C13.4913 7.42891 12.9815 6.19798 12.0739 5.29042C11.1663 4.38285 9.9354 3.87299 8.65191 3.87299C7.36842 3.87299 6.1375 4.38285 5.22993 5.29042C4.32237 6.19798 3.8125 7.42891 3.8125 8.7124C3.8125 9.99589 4.32237 11.2268 5.22993 12.1344C6.1375 13.0419 7.36842 13.5518 8.65191 13.5518C9.92736 13.5518 11.1509 13.0483 12.0568 12.1514C12.0623 12.1455 12.0679 12.1397 12.0737 12.134C12.0794 12.1283 12.0851 12.1227 12.091 12.1172Z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tasks, boards, or groups..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                {/* Date View Dropdown */}
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>Date view</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M9.442 12.762a.77.77 0 0 0 1.116 0l4.21-4.363a.84.84 0 0 0 0-1.158.77.77 0 0 0-1.116 0L10 11.027 6.348 7.24a.77.77 0 0 0-1.117 0 .84.84 0 0 0 0 1.158l4.21 4.363Z" />
                  </svg>
                </button>

                {/* Show completed toggle */}
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>Show completed</span>
                  <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                    <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded-full absolute top-0 left-0 transition-transform"></div>
                  </div>
                </button>
              </div>

              {/* More Actions */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                  <path d="M6.53033 4.46967C6.23744 4.17678 5.76256 4.17678 5.46967 4.46967C5.17678 4.76256 5.17678 5.23744 5.46967 5.53033L9.46967 9.53033C9.76256 9.82322 10.2374 9.82322 10.5303 9.53033L14.5303 5.53033C14.8232 5.23744 14.8232 4.76256 14.5303 4.46967C14.2374 4.17678 13.7626 4.17678 13.4697 4.46967L10 7.93934L6.53033 4.46967ZM6.53033 10.4697C6.23744 10.1768 5.76256 10.1768 5.46967 10.4697C5.17678 10.7626 5.17678 11.2374 5.46967 11.5303L9.46967 15.5303C9.76256 15.8232 10.2374 15.8232 10.5303 15.5303L14.5303 11.5303C14.8232 11.2374 14.8232 10.7626 14.5303 10.4697C14.2374 10.1768 13.7626 10.1768 13.4697 10.4697L10 13.9393L6.53033 10.4697Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white">
          {taskGroups.map((group) => {
            const groupTasks = group.tasks;

            return (
              <div key={group.id} className="border-b border-gray-200">
                {/* Group Header */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      style={{ color: group.color }}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width="16"
                        height="16"
                        className={`transition-transform ${group.collapsed ? '' : 'rotate-90'}`}
                      >
                        <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z" />
                      </svg>
                    </button>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: group.color }}
                    ></div>
                    <h3 className="font-semibold text-gray-800 text-xs" style={{ color: group.color }}>
                      {group.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {groupTasks.length} Task{groupTasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {!group.collapsed && (
                  <>
                    {/* Table Header */}
                    <div className="bg-white border-b border-gray-200">
                      <div className="grid gap-2 px-3 py-1 text-xs font-semibold text-gray-700" style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={groupTasks.length > 0 && groupTasks.every(task => selectedTasks.includes(task.id))}
                            onChange={() => {
                              const allGroupSelected = groupTasks.every(task => selectedTasks.includes(task.id));
                              if (allGroupSelected) {
                                setSelectedTasks(prev => prev.filter(id => !groupTasks.map(t => t.id).includes(id)));
                              } else {
                                setSelectedTasks(prev => [...new Set([...prev, ...groupTasks.map(t => t.id)])]);
                              }
                            }}
                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          {editingColumn === 'task' ? (
                            <input
                              type="text"
                              defaultValue="Task"
                              autoFocus
                              onBlur={(e) => handleEditColumn('task', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditColumn('task', (e.target as HTMLInputElement).value);
                                } else if (e.key === 'Escape') {
                                  setEditingColumn(null);
                                }
                              }}
                              className="bg-transparent border-none outline-none font-semibold text-xs"
                            />
                          ) : (
                            <span 
                              onDoubleClick={() => setEditingColumn('task')}
                              className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs"
                            >
                              Task
                            </span>
                          )}
                        </div>
                        
                        {columns.slice(1).map((column) => (
                          <div key={column.id} className="text-center">
                            {editingColumn === column.id ? (
                              <input
                                type="text"
                                defaultValue={column.label}
                                autoFocus
                                onBlur={(e) => handleEditColumn(column.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditColumn(column.id, (e.target as HTMLInputElement).value);
                                  } else if (e.key === 'Escape') {
                                    setEditingColumn(null);
                                  }
                                }}
                                className="bg-transparent border-none outline-none font-semibold text-center w-full text-xs"
                              />
                            ) : (
                              <span 
                                onDoubleClick={() => setEditingColumn(column.id)}
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs"
                              >
                                {column.label}
                              </span>
                            )}
                          </div>
                        ))}

                        {/* Empty column for add button */}
                        <div></div>
                      </div>
                    </div>

                    {/* Task Rows */}
                    <AnimatePresence>
                      {groupTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`grid gap-2 px-3 py-2 hover:bg-blue-50 transition-colors border-l-4 border-b border-gray-100 ${
                            selectedTasks.includes(task.id) ? 'bg-blue-50' : ''
                          }`}
                          style={{ 
                            borderLeftColor: group.color,
                            gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)`
                          }}
                        >
                          {/* Task Name with Checkbox */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => handleTaskSelection(task.id)}
                              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div 
                              className="w-1 h-4 rounded-full" 
                              style={{ backgroundColor: group.color }}
                            ></div>
                            <div 
                              className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 px-1 rounded flex-1 text-xs"
                              onClick={() => setEditingCell({taskId: task.id, columnId: 'task'})}
                            >
                              {renderCellContent(task, { id: 'task', label: 'Task', type: 'text' })}
                            </div>
                          </div>

                          {/* Dynamic Columns */}
                          {columns.slice(1).map((column) => (
                            <div 
                              key={column.id}
                              className="flex items-center justify-center cursor-pointer hover:bg-gray-100 px-1 rounded"
                              onClick={() => setEditingCell({taskId: task.id, columnId: column.id})}
                            >
                              {renderCellContent(task, column)}
                            </div>
                          ))}

                          {/* Empty column for add button alignment */}
                          <div></div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Add Task Row */}
                    <button
                      onClick={() => addNewTask(group.id)}
                      className="w-full grid gap-2 px-3 py-2 hover:bg-blue-50 transition-colors text-left border-l-4 border-b border-gray-100"
                      style={{ 
                        borderLeftColor: group.color,
                        gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)`
                      }}
                    >
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="w-3 h-3 border border-gray-300 rounded"></div>
                        <div 
                          className="w-1 h-4 rounded-full opacity-50" 
                          style={{ backgroundColor: group.color }}
                        ></div>
                        <span className="font-medium text-xs">+ Add task</span>
                      </div>
                      {columns.slice(1).map((column) => (
                        <div key={column.id}></div>
                      ))}
                      <div></div>
                    </button>

                    {/* Empty State for groups with no tasks */}
                    {group.tasks.length === 0 && (
                      <div className="grid gap-2 px-3 py-8 border-l-4 border-b border-gray-100 text-center"
                        style={{ 
                          borderLeftColor: group.color,
                          gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)`
                        }}
                      >
                        <div className="col-span-full flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24" className="text-gray-400">
                              <path d="M10 2C10.4142 2 10.75 2.33579 10.75 2.75V9.25H17.25C17.6642 9.25 18 9.58579 18 10C18 10.4142 17.6642 10.75 17.25 10.75H10.75V17.25C10.75 17.6642 10.4142 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25V10.75H2.75C2.33579 10.75 2 10.4142 2 10C2 9.58579 2.33579 9.25 2.75 9.25H9.25V2.75C9.25 2.33579 9.58579 2 10 2Z" />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-500">
                            No tasks for {group.title.toLowerCase()}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addNewTask(group.id);
                            }}
                            className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
                          >
                            Add your first task
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyWorkPage;
