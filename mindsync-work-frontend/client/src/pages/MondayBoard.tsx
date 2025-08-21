import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  name: string;
  owner: string;
  status: string; // Allow any status value for template flexibility
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

interface MondayBoardProps {
  boardName?: string;
  template?: string;
  templateData?: any;
  columns?: any[];
}

const MondayBoard: React.FC<MondayBoardProps> = ({ 
  boardName = 'My Board', 
  template = 'custom',
  templateData,
  columns: templateColumns = []
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{taskId: string, columnId: string} | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  
  // Initialize columns based on template or use defaults
  const getInitialColumns = (): Column[] => {
    if (templateColumns.length > 0) {
      // Convert template columns to MondayBoard format
      return templateColumns.map((col: any) => ({
        id: col.id,
        label: col.name,
        type: col.type as any // Map template types to board types
      }));
    }
    
    // Default columns for custom template
    return [
      { id: 'task', label: 'Task', type: 'text' },
      { id: 'owner', label: 'Owner', type: 'person' },
      { id: 'status', label: 'Status', type: 'status' },
      { id: 'dueDate', label: 'Due Date', type: 'date' },
      { id: 'timeline', label: 'Timeline', type: 'timeline' },
      { id: 'priority', label: 'Priority', type: 'priority' }
    ];
  };

  const [columns, setColumns] = useState<Column[]>(getInitialColumns());

  // Available column types for adding
  const availableColumnTypes = [
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'number', label: 'Numbers', icon: '🔢' },
    { id: 'person', label: 'Person', icon: '👤' },
    { id: 'status', label: 'Status', icon: '🎯' },
    { id: 'date', label: 'Date', icon: '📅' },
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'priority', label: 'Priority', icon: '⚡' },
    { id: 'dropdown', label: 'Dropdown', icon: '📋' }
  ];

  // Get template-specific status options (moved before getInitialTasks since it's used there)
  const getTemplateStatusOptions = (): { value: string; label: string; color: string }[] => {
    console.log('🔍 getTemplateStatusOptions called with templateData:', templateData);
    console.log('🔍 templateData.name:', templateData?.name);
    
    if (!templateData?.name) {
      console.log('❌ No template name, returning default status options');
      return [
        { value: 'not-started', label: 'Not Started', color: '#c4c4c4' },
        { value: 'working-on-it', label: 'Working on it', color: '#fdab3d' },
        { value: 'stuck', label: 'Stuck', color: '#e2445c' },
        { value: 'done', label: 'Done', color: '#00c875' }
      ];
    }

    let statusOptions: { value: string; label: string; color: string }[] = [];
    switch (templateData.name) {
      case 'Software Development':
        statusOptions = [
          { value: 'backlog', label: 'Backlog', color: '#c4c4c4' },
          { value: 'in-development', label: 'In Development', color: '#fdab3d' },
          { value: 'code-review', label: 'Code Review', color: '#a25ddc' },
          { value: 'testing', label: 'Testing', color: '#037f4c' },
          { value: 'deployed', label: 'Deployed', color: '#00c875' }
        ];
        break;
      case 'Marketing Campaign':
        statusOptions = [
          { value: 'planning', label: 'Planning', color: '#c4c4c4' },
          { value: 'content-creation', label: 'Content Creation', color: '#fdab3d' },
          { value: 'review', label: 'Review', color: '#a25ddc' },
          { value: 'live', label: 'Live', color: '#00c875' },
          { value: 'completed', label: 'Completed', color: '#037f4c' }
        ];
        break;
      case 'Sales Pipeline':
        statusOptions = [
          { value: 'lead', label: 'Lead', color: '#c4c4c4' },
          { value: 'contacted', label: 'Contacted', color: '#fdab3d' },
          { value: 'qualified', label: 'Qualified', color: '#a25ddc' },
          { value: 'proposal', label: 'Proposal Sent', color: '#037f4c' },
          { value: 'closed-won', label: 'Closed Won', color: '#00c875' },
          { value: 'closed-lost', label: 'Closed Lost', color: '#e2445c' }
        ];
        break;
      case 'Event Planning':
        statusOptions = [
          { value: 'idea', label: 'Idea', color: '#c4c4c4' },
          { value: 'planning', label: 'Planning', color: '#fdab3d' },
          { value: 'booking', label: 'Booking', color: '#a25ddc' },
          { value: 'confirmed', label: 'Confirmed', color: '#037f4c' },
          { value: 'completed', label: 'Completed', color: '#00c875' }
        ];
        break;
      case 'Content Calendar':
        statusOptions = [
          { value: 'idea', label: 'Idea', color: '#c4c4c4' },
          { value: 'writing', label: 'Writing', color: '#fdab3d' },
          { value: 'editing', label: 'Editing', color: '#a25ddc' },
          { value: 'scheduled', label: 'Scheduled', color: '#037f4c' },
          { value: 'published', label: 'Published', color: '#00c875' }
        ];
        break;
      case 'Recruitment':
        statusOptions = [
          { value: 'sourcing', label: 'Sourcing', color: '#c4c4c4' },
          { value: 'screening', label: 'Screening', color: '#fdab3d' },
          { value: 'interviewing', label: 'Interviewing', color: '#a25ddc' },
          { value: 'reference-check', label: 'Reference Check', color: '#037f4c' },
          { value: 'hired', label: 'Hired', color: '#00c875' },
          { value: 'rejected', label: 'Rejected', color: '#e2445c' }
        ];
        break;
      default:
        statusOptions = [
          { value: 'not-started', label: 'Not Started', color: '#c4c4c4' },
          { value: 'working-on-it', label: 'Working on it', color: '#fdab3d' },
          { value: 'stuck', label: 'Stuck', color: '#e2445c' },
          { value: 'done', label: 'Done', color: '#00c875' }
        ];
        console.log('❌ Template name not matched, using default status options');
    }
    
    console.log(`✅ Template "${templateData.name}" returning status options:`, statusOptions);
    return statusOptions;
  };

  // Generate template-specific sample tasks
  const getInitialTasks = (): Task[] => {
    if (templateData?.sampleRows?.length > 0) {
      // Use template sample data and distribute across template-specific groups
      const templateGroups = getTemplateGroups();
      const templateStatusOptions = getTemplateStatusOptions();
      
      return templateData.sampleRows.map((row: any, index: number) => {
        // Map template-specific status or use appropriate template status
        let mappedStatus = row.status || templateStatusOptions[0]?.value || 'not-started';
        
        // If the status from template data doesn't match our template options, map it
        if (!templateStatusOptions.find(opt => opt.value === mappedStatus)) {
          // Try to intelligently map generic statuses to template-specific ones
          if (mappedStatus === 'not-started' || mappedStatus === 'new') {
            mappedStatus = templateStatusOptions[0]?.value || 'not-started';
          } else if (mappedStatus === 'working-on-it' || mappedStatus === 'in-progress') {
            mappedStatus = templateStatusOptions[1]?.value || 'working-on-it';
          } else if (mappedStatus === 'done' || mappedStatus === 'completed') {
            mappedStatus = templateStatusOptions[templateStatusOptions.length - 1]?.value || 'done';
          } else {
            // Use first status as default
            mappedStatus = templateStatusOptions[0]?.value || 'not-started';
          }
        }

        return {
          id: (index + 1).toString(),
          name: row.task || row.lead || row.project || row.campaign || row.goal || row.item || `${templateData.name} Item ${index + 1}`,
          owner: row.assignee || row.owner || row.responsible || row['sales-rep'] || row.manager || 'Unassigned',
          status: mappedStatus,
          dueDate: row['due-date'] || row.deadline || row['close-date'] || row['target-date'] || '2025-08-20',
          timelineStart: row['start-date'] || '2025-08-16',
          timelineEnd: row['completion-date'] || row['due-date'] || '2025-08-20',
          priority: row.priority || 'medium',
          description: row.description || `Sample ${templateData.name.toLowerCase()} item`,
          labels: [],
          group: templateGroups[index % templateGroups.length], // Distribute across groups
          // Add template-specific fields
          ...row
        };
      });
    }
    
    // Default sample tasks for custom template
    const defaultStatusOptions = getTemplateStatusOptions();
    return [
      {
        id: '1',
        name: 'demo_task',
        owner: 'John Doe',
        status: defaultStatusOptions[1]?.value || 'working-on-it',
        dueDate: '2025-08-16',
        timelineStart: '2025-08-16',
        timelineEnd: '2025-08-17',
        priority: 'medium',
        description: 'Initial demo task',
        labels: [],
        group: 'To-Do'
      },
      {
        id: '2',
        name: 'Task 2',
        owner: '',
        status: defaultStatusOptions[defaultStatusOptions.length - 1]?.value || 'done',
        dueDate: '2025-08-17',
        timelineStart: '2025-08-18',
        timelineEnd: '2025-08-19',
        priority: 'low',
        description: '',
        labels: [],
        group: 'In Progress'
      },
      {
        id: '3',
        name: 'Task 3',
        owner: '',
        status: defaultStatusOptions[2]?.value || 'stuck',
        dueDate: '2025-08-18',
        timelineStart: '2025-08-20',
        timelineEnd: '2025-08-21',
        priority: 'high',
        description: '',
        labels: [],
        group: 'Completed'
      }
    ];
  };

  // Get template-specific groups (moved before getInitialTasks since it's used there)
  const getTemplateGroups = (): string[] => {
    if (!templateData?.name) {
      return ['To-Do', 'In Progress', 'Completed'];
    }

    let groups: string[] = [];
    switch (templateData.name) {
      case 'Software Development':
        groups = ['Backlog', 'Sprint 1', 'Sprint 2', 'Code Review', 'Testing', 'Done'];
        break;
      case 'Marketing Campaign':
        groups = ['Campaign Ideas', 'In Planning', 'Content Creation', 'Review & Approval', 'Live Campaigns', 'Completed'];
        break;
      case 'Sales Pipeline':
        groups = ['New Leads', 'Qualified Leads', 'Proposal Stage', 'Negotiation', 'Closed Won', 'Closed Lost'];
        break;
      case 'Customer Support':
        groups = ['New Tickets', 'In Progress', 'Waiting for Customer', 'Escalated', 'Resolved', 'Closed'];
        break;
      case 'Recruitment':
        groups = ['New Applications', 'Screening', 'Phone Interview', 'Technical Interview', 'Final Interview', 'Offer', 'Hired', 'Rejected'];
        break;
      case 'Project Portfolio':
        groups = ['Planning', 'Active Projects', 'On Hold', 'Review Phase', 'Completed', 'Cancelled'];
        break;
      case 'Event Planning':
        groups = ['Initial Planning', 'Vendor Coordination', 'Marketing & Promotion', 'Final Preparations', 'Event Day', 'Post-Event'];
        break;
      case 'Inventory Management':
        groups = ['In Stock', 'Low Stock', 'Out of Stock', 'On Order', 'Received', 'Quality Check'];
        break;
      case 'Budget Tracking':
        groups = ['Draft Budget', 'Approved Budget', 'In Progress', 'Review Required', 'Over Budget', 'Completed'];
        break;
      case 'Personal Tasks':
        groups = ['Today', 'This Week', 'Next Week', 'Someday', 'Completed'];
        break;
      case 'Goal Tracking':
        groups = ['Not Started', 'In Progress', 'On Track', 'At Risk', 'Completed', 'Paused'];
        break;
      default:
        groups = ['To-Do', 'In Progress', 'Completed'];
    }
    
    return groups;
  };

  const [tasks, setTasks] = useState<Task[]>(getInitialTasks());

  // Make groups reactive to template changes
  const groups = useMemo(() => {
    return getTemplateGroups();
  }, [templateData?.name, templateData?.id]);

  // Get template-specific status options
  const statusOptions = useMemo(() => getTemplateStatusOptions(), [templateData?.name]);

  const getStatusText = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption?.label || 'Unknown';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💧';
      default: return '⚡';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getTasksByGroup = (groupName: string) => {
    return tasks.filter(task => task.group === groupName);
  };

  const handleAddNewTask = (groupName: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      owner: '',
      status: statusOptions[0]?.value || 'not-started',
      dueDate: '',
      timelineStart: '',
      timelineEnd: '',
      priority: 'medium',
      description: '',
      labels: [],
      group: groupName
    };
    setTasks([...tasks, newTask]);
    // Automatically start editing the task name
    setTimeout(() => {
      setEditingCell({taskId: newTask.id, columnId: 'task'});
    }, 100);
  };

  const handleAddColumn = (columnType: string, columnLabel: string) => {
    const newColumn: Column = {
      id: `custom_${Date.now()}`,
      label: columnLabel,
      type: columnType as Column['type']
    };
    setColumns([...columns, newColumn]);
    setIsAddColumnModalOpen(false);
  };

  const handleEditColumn = (columnId: string, newLabel: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, label: newLabel } : col
    ));
    setEditingColumn(null);
  };

  const handleCellEdit = (taskId: string, columnId: string, value: any) => {
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
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
            <span className="text-xs text-gray-700">{task.owner}</span>
          </div>
        ) : (
          <button className="w-5 h-5 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 transition-colors">
            <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        );
      }
      return <span className="text-xs text-gray-700">{value || '-'}</span>;      case 'status':
        if (column.id === 'status') {
          const statusOption = statusOptions.find(opt => opt.value === task.status);
          const statusColor = statusOption?.color || '#c4c4c4';
          return (
            <div 
              className="px-2 py-1 rounded-full text-xs font-medium border text-white"
              style={{ 
                backgroundColor: statusColor,
                borderColor: statusColor
              }}
            >
              {getStatusText(task.status)}
            </div>
          );
        }
        return <span className="text-xs text-gray-700">{value || '-'}</span>;
      
      case 'date':
        return <span className="text-xs text-gray-700">{formatDate(value)}</span>;
      
      case 'timeline':
        if (column.id === 'timeline') {
          return (
            <div className="text-gray-700 px-1 py-1 text-xs border border-gray-200 rounded bg-gray-50">
              {formatDate(task.timelineStart)} - {formatDate(task.timelineEnd)}
            </div>
          );
        }
        return <span className="text-xs text-gray-700">{value || '-'}</span>;
      
      case 'priority':
        if (column.id === 'priority') {
          return <span className="text-xs">{getPriorityIcon(task.priority)}</span>;
        }
        return <span className="text-xs text-gray-700">{value || '-'}</span>;
      
      default:
        return <span className="text-xs text-gray-700">{value || '-'}</span>;
    }
  };

  const getGroupColor = (groupName: string) => {
    switch (groupName) {
      case 'To-Do': return 'rgb(87, 155, 252)';
      case 'In Progress': return 'rgb(253, 171, 61)';
      case 'Completed': return 'rgb(0, 200, 117)';
      default: return 'rgb(87, 155, 252)';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col w-full">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left Section */}
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
              <div className="flex items-center">
                <span className="font-bold text-xl text-gray-900">MindSync</span>
                <span className="text-sm text-gray-600 ml-1">work</span>
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
              See plans
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>

            {/* Inbox with badge */}
            <div className="relative">
              <button 
                className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Inbox"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/>
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
              </button>
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">3</div>
            </div>

            {/* Invite Members */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Invite team members"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" x2="19" y1="8" y2="14"/>
                <line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            </button>

            {/* Apps */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Apps & integrations"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect width="7" height="7" x="3" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="14" rx="1"/>
                <rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
            </button>

            {/* Search */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Search everything"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Help */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help & support"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            {/* Product Switcher */}
            <button 
              className="p-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Switch products"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M9 9h6v6H9z"/>
                <path d="M9 3v6"/>
                <path d="M15 9v12"/>
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

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Project Demo</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              title="AI Assistant"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sidekick
            </button>
            
            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title="Invite team members"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Invite / 1
            </button>
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

      {/* Toolbar */}
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
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="border-none outline-none bg-transparent text-sm w-32"
              />
            </div>

            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title="Filter by person"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Person
            </button>

            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title="Filter items"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
            </button>

            <button 
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              title="Sort items"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Sort
            </button>
          </div>
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

      {/* Board Content - Separate Tables */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="space-y-3 py-3 pl-3">
          {groups.map((groupName) => {
            const groupTasks = getTasksByGroup(groupName);
            const groupColor = getGroupColor(groupName);
            
            return (
              <div key={groupName} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Group Header */}
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-3 h-3 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: groupColor }}
                    ></div>
                    <h3 className="font-semibold text-gray-800 text-xs" style={{ color: groupColor }}>
                      {groupName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {groupTasks.length} Task{groupTasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

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
                    
                    {/* Add Column Button */}
                    <div className="text-center">
                      <button
                        onClick={() => setIsAddColumnModalOpen(true)}
                        className="w-5 h-5 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                      >
                        <svg className="w-2 h-2 text-gray-400 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Group Tasks */}
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {groupTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`grid gap-2 px-3 py-2 hover:bg-blue-50 transition-colors border-l-4 ${
                          selectedTasks.includes(task.id) ? 'bg-blue-50' : ''
                        }`}
                        style={{ 
                          borderLeftColor: groupColor,
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
                            style={{ backgroundColor: groupColor }}
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
                    onClick={() => handleAddNewTask(groupName)}
                    className="w-full grid gap-2 px-3 py-2 hover:bg-blue-50 transition-colors text-left border-l-4"
                    style={{ 
                      borderLeftColor: groupColor,
                      gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)`
                    }}
                  >
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-3 h-3 border border-gray-300 rounded"></div>
                      <div 
                        className="w-1 h-4 rounded-full opacity-50" 
                        style={{ backgroundColor: groupColor }}
                      ></div>
                      <span className="font-medium text-xs">+ Add task</span>
                    </div>
                    {columns.slice(1).map((column) => (
                      <div key={column.id}></div>
                    ))}
                    <div></div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Column Modal */}
      {isAddColumnModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-96 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add Column</h3>
              <button
                onClick={() => setIsAddColumnModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {availableColumnTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    const columnName = prompt(`Enter name for ${type.label} column:`);
                    if (columnName) {
                      handleAddColumn(type.id, columnName);
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-left"
                >
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{type.label}</div>
                    <div className="text-sm text-gray-500">
                      {type.id === 'text' && 'Single line of text'}
                      {type.id === 'number' && 'Numeric values'}
                      {type.id === 'person' && 'Assign team members'}
                      {type.id === 'status' && 'Track progress status'}
                      {type.id === 'date' && 'Date picker'}
                      {type.id === 'timeline' && 'Start and end dates'}
                      {type.id === 'priority' && 'Set task priority'}
                      {type.id === 'dropdown' && 'Select from options'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MondayBoard;
