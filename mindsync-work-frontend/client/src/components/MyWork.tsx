import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  group: string;
  board: string;
  groupColor: string;
  assignee?: {
    name: string;
    avatar: string;
    color: string;
  };
  status?: {
    label: string;
    color: string;
  };
  date?: string;
}

const MyWork: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'calendar'>('table');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design homepage layout',
      group: 'To-Do',
      board: 'Website Project',
      groupColor: '#8B5F53',
      assignee: { name: 'John Doe', avatar: 'JD', color: '#7C3AED' },
      status: { label: 'Working on it', color: '#F59E0B' },
      date: '2025-08-15'
    },
    {
      id: '2',
      title: 'API integration testing',
      group: 'In Progress',
      board: 'Backend Development',
      groupColor: '#037F4C',
      assignee: { name: 'Sarah Chen', avatar: 'SC', color: '#10B981' },
      status: { label: 'Done', color: '#059669' },
      date: '2025-08-18'
    },
    {
      id: '3',
      title: 'User feedback analysis',
      group: 'Research',
      board: 'UX Research',
      groupColor: '#007EB5',
      assignee: { name: 'Mike Wilson', avatar: 'MW', color: '#3B82F6' },
      status: { label: 'Stuck', color: '#DC2626' },
      date: '2025-08-20'
    }
  ];

  const dateGroups = [
    { 
      title: 'Past Dates', 
      color: '#8B5F53', 
      tasks: sampleTasks.filter(task => task.date && new Date(task.date) < new Date('2025-08-17')),
      expanded: true
    },
    { 
      title: 'Today', 
      color: '#037F4C', 
      tasks: sampleTasks.filter(task => task.date === '2025-08-17'),
      expanded: false
    },
    { 
      title: 'This week', 
      color: '#007EB5', 
      tasks: sampleTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        const today = new Date('2025-08-17');
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        return taskDate > today && taskDate <= endOfWeek;
      }),
      expanded: false
    },
    { 
      title: 'Next week', 
      color: '#66CCFF', 
      tasks: sampleTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        const nextWeekStart = new Date('2025-08-24');
        const nextWeekEnd = new Date('2025-08-31');
        return taskDate >= nextWeekStart && taskDate <= nextWeekEnd;
      }),
      expanded: false
    },
    { 
      title: 'Later', 
      color: '#CAB641', 
      tasks: sampleTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate > new Date('2025-08-31');
      }),
      expanded: false
    },
    { 
      title: 'Without a date', 
      color: '#757575', 
      tasks: sampleTasks.filter(task => !task.date),
      expanded: false
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" className="text-gray-500">
                <path d="M4.5559 4.55593C5.99976 3.11206 7.95806 2.3009 10 2.3009C12.0419 2.3009 14.0002 3.11206 15.4441 4.55593C16.888 5.99979 17.6991 7.9581 17.6991 10C17.6991 12.042 16.888 14.0003 15.4441 15.4441C14.0002 16.888 12.0419 17.6992 10 17.6992C7.95806 17.6992 5.99976 16.888 4.5559 15.4441C3.11203 14.0003 2.30087 12.042 2.30087 10C2.30087 7.9581 3.11203 5.99979 4.5559 4.55593ZM10 3.8009C8.35589 3.8009 6.77912 4.45402 5.61656 5.61659C4.45399 6.77915 3.80087 8.35592 3.80087 10C3.80087 11.6441 4.45399 13.2209 5.61656 14.3835C6.77912 15.546 8.35589 16.1992 10 16.1992C11.6441 16.1992 13.2209 15.546 14.3834 14.3835C15.546 13.2209 16.1991 11.6441 16.1991 10C16.1991 8.35592 15.546 6.77915 14.3834 5.61659C13.2209 4.45402 11.6441 3.8009 10 3.8009ZM10 9.25006C10.4142 9.25006 10.75 9.58585 10.75 10.0001V13.4746C10.75 13.8888 10.4142 14.2246 10 14.2246C9.58579 14.2246 9.25 13.8888 9.25 13.4746V10.0001C9.25 9.58585 9.58579 9.25006 10 9.25006ZM9.54135 6.21669C9.7058 6.10681 9.89914 6.04816 10.0969 6.04816C10.3621 6.04816 10.6165 6.15351 10.804 6.34105C10.9916 6.52859 11.0969 6.78294 11.0969 7.04816C11.0969 7.24593 11.0383 7.43927 10.9284 7.60373C10.8185 7.76818 10.6623 7.89635 10.4796 7.97204C10.2969 8.04772 10.0958 8.06753 9.90183 8.02894C9.70786 7.99036 9.52967 7.89512 9.38982 7.75526C9.24996 7.61541 9.15472 7.43722 9.11614 7.24325C9.07755 7.04927 9.09736 6.8482 9.17304 6.66547C9.24873 6.48275 9.3769 6.32657 9.54135 6.21669Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M4.5559 4.55593C5.99976 3.11206 7.95806 2.3009 10 2.3009C12.0419 2.3009 14.0002 3.11206 15.4441 4.55593C16.888 5.99979 17.6991 7.9581 17.6991 10C17.6991 12.042 16.888 14.0003 15.4441 15.4441C14.0002 16.888 12.0419 17.6992 10 17.6992C7.95806 17.6992 5.99976 16.888 4.5559 15.4441C3.11203 14.0003 2.30087 12.042 2.30087 10C2.30087 7.9581 3.11203 5.99979 4.5559 4.55593ZM10 3.8009C8.35589 3.8009 6.77912 4.45402 5.61656 5.61659C4.45399 6.77915 3.80087 8.35592 3.80087 10C3.80087 11.6441 4.45399 13.2209 5.61656 14.3835C6.77912 15.546 8.35589 16.1992 10 16.1992C11.6441 16.1992 13.2209 15.546 14.3834 14.3835C15.546 13.2209 16.1991 11.6441 16.1991 10C16.1991 8.35592 15.546 6.77915 14.3834 5.61659C13.2209 4.45402 11.6441 3.8009 10 3.8009ZM10 9.25006C10.4142 9.25006 10.75 9.58585 10.75 10.0001V13.4746C10.75 13.8888 10.4142 14.2246 10 14.2246C9.58579 14.2246 9.25 13.8888 9.25 13.4746V10.0001C9.25 9.58585 9.58579 9.25006 10 9.25006ZM9.54135 6.21669C9.7058 6.10681 9.89914 6.04816 10.0969 6.04816C10.3621 6.04816 10.6165 6.15351 10.804 6.34105C10.9916 6.52859 11.0969 6.78294 11.0969 7.04816C11.0969 7.24593 11.0383 7.43927 10.9284 7.60373C10.8185 7.76818 10.6623 7.89635 10.4796 7.97204C10.2969 8.04772 10.0958 8.06753 9.90183 8.02894C9.70786 7.99036 9.52967 7.89512 9.38982 7.75526C9.24996 7.61541 9.15472 7.43722 9.11614 7.24325C9.07755 7.04927 9.09736 6.8482 9.17304 6.66547C9.24873 6.48275 9.3769 6.32657 9.54135 6.21669Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              <span>Give feedback</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M8.94999 11C8.71836 12.1411 7.70948 13 6.5 13 5.29052 13 4.28164 12.1411 4.05001 11H2.75C2.33579 11 2 10.6642 2 10.25 2 9.83579 2.33579 9.5 2.75 9.5H4.20802C4.5938 8.61705 5.47484 8 6.5 8 7.52516 8 8.4062 8.61705 8.79198 9.5H17.25C17.6642 9.5 18 9.83579 18 10.25 18 10.6642 17.6642 11 17.25 11H8.94999zM6.5 11.5C7.05228 11.5 7.5 11.0523 7.5 10.5 7.5 9.94772 7.05228 9.5 6.5 9.5 5.94772 9.5 5.5 9.94772 5.5 10.5 5.5 11.0523 5.94772 11.5 6.5 11.5zM11.05 4C11.2816 2.85888 12.2905 2 13.5 2 14.7095 2 15.7184 2.85888 15.95 4L17.25 4C17.6642 4 18 4.33579 18 4.75 18 5.16421 17.6642 5.5 17.25 5.5L15.792 5.5C15.4062 6.38295 14.5252 7 13.5 7 12.4748 7 11.5938 6.38295 11.208 5.5L2.75 5.5C2.33579 5.5 2 5.16421 2 4.75 2 4.33579 2.33579 4 2.75 4L11.05 4zM13.5 3.5C12.9477 3.5 12.5 3.94772 12.5 4.5 12.5 5.05228 12.9477 5.5 13.5 5.5 14.0523 5.5 14.5 5.05228 14.5 4.5 14.5 3.94772 14.0523 3.5 13.5 3.5zM11.05 15C11.2816 13.8589 12.2905 13 13.5 13 14.7095 13 15.7184 13.8589 15.95 15L17.25 15C17.6642 15 18 15.3358 18 15.75 18 16.1642 17.6642 16.5 17.25 16.5L15.792 16.5C15.4062 17.383 14.5252 18 13.5 18 12.4748 18 11.5938 17.383 11.208 16.5L2.75 16.5C2.33579 16.5 2 16.1642 2 15.75 2 15.3358 2.33579 15 2.75 15L11.05 15zM13.5 14.5C12.9477 14.5 12.5 14.9477 12.5 15.5 12.5 16.0523 12.9477 16.5 13.5 16.5 14.0523 16.5 14.5 16.0523 14.5 15.5 14.5 14.9477 14.0523 14.5 13.5 14.5z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              <span>Customize</span>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('table')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'table'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'calendar'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200"></div>

      {/* Toolbar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            New item
          </button>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                width="16" 
                height="16" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <path d="M8.65191 2.37299C6.9706 2.37299 5.35814 3.04089 4.16927 4.22976C2.9804 5.41863 2.3125 7.03108 2.3125 8.7124C2.3125 10.3937 2.9804 12.0062 4.16927 13.195C5.35814 14.3839 6.9706 15.0518 8.65191 15.0518C10.0813 15.0518 11.4609 14.5691 12.5728 13.6939L16.4086 17.5303C16.7014 17.8232 17.1763 17.8232 17.4692 17.5303C17.7621 17.2375 17.7622 16.7626 17.4693 16.4697L13.6334 12.6333C14.5086 11.5214 14.9913 10.1418 14.9913 8.7124C14.9913 7.03108 14.3234 5.41863 13.1346 4.22976C11.9457 3.04089 10.3332 2.37299 8.65191 2.37299ZM12.091 12.1172C12.9878 11.2113 13.4913 9.98783 13.4913 8.7124C13.4913 7.42891 12.9815 6.19798 12.0739 5.29042C11.1663 4.38285 9.9354 3.87299 8.65191 3.87299C7.36842 3.87299 6.1375 4.38285 5.22993 5.29042C4.32237 6.19798 3.8125 7.42891 3.8125 8.7124C3.8125 9.99589 4.32237 11.2268 5.22993 12.1344C6.1375 13.0419 7.36842 13.5518 8.65191 13.5518C9.92736 13.5518 11.1509 13.0483 12.0568 12.1514C12.0623 12.1455 12.0679 12.1397 12.0737 12.134C12.0794 12.1283 12.0851 12.1227 12.091 12.1172Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            {/* Date View Dropdown */}
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <span>Date view</span>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M9.442 12.762a.77.77 0 0 0 1.116 0l4.21-4.363a.84.84 0 0 0 0-1.158.77.77 0 0 0-1.116 0L10 11.027 6.348 7.24a.77.77 0 0 0-1.117 0 .84.84 0 0 0 0 1.158l4.21 4.363Z" />
              </svg>
            </button>
            
            {/* More Actions */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="text-gray-600">
                <path d="M6.53033 4.46967C6.23744 4.17678 5.76256 4.17678 5.46967 4.46967C5.17678 4.76256 5.17678 5.23744 5.46967 5.53033L9.46967 9.53033C9.76256 9.82322 10.2374 9.82322 10.5303 9.53033L14.5303 5.53033C14.8232 5.23744 14.8232 4.76256 14.5303 4.46967C14.2374 4.17678 13.7626 4.17678 13.4697 4.46967L10 7.93934L6.53033 4.46967ZM6.53033 10.4697C6.23744 10.1768 5.76256 10.1768 5.46967 10.4697C5.17678 10.7626 5.17678 11.2374 5.46967 11.5303L9.46967 15.5303C9.76256 15.8232 10.2374 15.8232 10.5303 15.5303L14.5303 11.5303C14.8232 11.2374 14.8232 10.7626 14.5303 10.4697C14.2374 10.1768 13.7626 10.1768 13.4697 10.4697L10 13.9393L6.53033 10.4697Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white overflow-hidden">
        {activeTab === 'table' && (
          <div className="h-full flex flex-col">
            {/* Table Header */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex items-center px-6 py-3">
                <div className="w-80 text-sm font-medium text-gray-700">Task</div>
                <div className="w-44 text-sm font-medium text-gray-700">Group</div>
                <div className="w-48 text-sm font-medium text-gray-700">Board</div>
                <div className="w-32 text-sm font-medium text-gray-700">People</div>
                <div className="w-36 text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>Date</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="text-purple-600">
                    <path d="M10 2.47494C10.2086 2.47494 10.3973 2.5603 10.5331 2.69802L12.933 5.10095C13.2255 5.39384 13.2255 5.86871 12.933 6.16161C12.6404 6.4545 12.1662 6.4545 11.8736 6.16161L10.7491 5.03562V16.7753C10.7491 17.1896 10.4137 17.5253 10 17.5253C9.58633 17.5253 9.25097 17.1896 9.25097 16.7753V5.03558L8.12637 6.16161C7.83384 6.4545 7.35957 6.4545 7.06705 6.16161C6.77453 5.86871 6.77453 5.39384 7.06705 5.10095L9.47034 2.69461C9.48492 2.68001 9.50004 2.66608 9.51565 2.65283C9.64625 2.54187 9.81533 2.47494 10 2.47494Z" />
                  </svg>
                </div>
                <div className="w-36 text-sm font-medium text-gray-700">Status</div>
              </div>
            </div>

            {/* Table Content with Date Groups */}
            <div className="flex-1 overflow-y-auto">
              {dateGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border-b border-gray-100">
                  {/* Group Header */}
                  <div 
                    className="flex items-center px-6 py-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 cursor-pointer hover:bg-gray-100"
                    style={{ backgroundColor: `${group.color}08` }}
                  >
                    <div className="flex items-center gap-3">
                      <button className="flex items-center justify-center w-4 h-4">
                        <svg 
                          viewBox="0 0 20 20" 
                          fill="currentColor" 
                          width="16" 
                          height="16" 
                          style={{ color: group.color }}
                          className={`transform transition-transform ${group.expanded ? 'rotate-90' : ''}`}
                        >
                          <path d="M12.76 10.56a.77.77 0 0 0 0-1.116L8.397 5.233a.84.84 0 0 0-1.157 0 .77.77 0 0 0 0 1.116l3.785 3.653-3.785 3.652a.77.77 0 0 0 0 1.117.84.84 0 0 0 1.157 0l4.363-4.211Z" />
                        </svg>
                      </button>
                      <h3 
                        className="text-sm font-semibold"
                        style={{ color: group.color }}
                      >
                        {group.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                        {group.tasks.length} item{group.tasks.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Group Tasks */}
                  {group.expanded && group.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: taskIndex * 0.1 }}
                      className="grid grid-cols-12 gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Task Name */}
                      <div className="col-span-4 px-4 py-4 flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="text-gray-500">
                              <path d="M6 10.5C6 11.3284 5.32843 12 4.5 12 3.67157 12 3 11.3284 3 10.5 3 9.67157 3.67157 9 4.5 9 5.32843 9 6 9.67157 6 10.5zM11.8333 10.5C11.8333 11.3284 11.1618 12 10.3333 12 9.50492 12 8.83334 11.3284 8.83334 10.5 8.83334 9.67157 9.50492 9 10.3333 9 11.1618 9 11.8333 9.67157 11.8333 10.5zM17.6667 10.5C17.6667 11.3284 16.9951 12 16.1667 12 15.3383 12 14.6667 11.3284 14.6667 10.5 14.6667 9.67157 15.3383 9 16.1667 9 16.9951 9 17.6667 9.67157 17.6667 10.5z" />
                            </svg>
                          </button>
                          <div 
                            className="w-1 h-8 rounded-full"
                            style={{ backgroundColor: task.groupColor }}
                          ></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{task.title}</div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" className="text-gray-400">
                              <path d="M10.4339 1.94996C11.5976 1.94797 12.7458 2.21616 13.7882 2.7334C14.8309 3.25083 15.7393 4.00335 16.4416 4.93167C17.144 5.85999 17.6211 6.93874 17.8355 8.08291C18.0498 9.22707 17.9956 10.4054 17.6769 11.525C17.3583 12.6446 16.7839 13.6749 15.9992 14.5347C15.2145 15.3945 14.2408 16.0604 13.1549 16.4797C12.069 16.8991 10.9005 17.0605 9.7416 16.9513C8.72154 16.8552 7.7334 16.5518 6.83723 16.0612L4.29494 17.2723C3.23222 17.7785 2.12271 16.6692 2.62876 15.6064L3.83948 13.0636C3.26488 12.0144 2.94833 10.8411 2.91898 9.64114C2.88622 8.30169 3.21251 6.97789 3.86399 5.8071C4.51547 4.63631 5.4684 3.66119 6.62389 2.98294C7.77902 2.30491 9.09451 1.94825 10.4339 1.94996Z" />
                              <path d="M11.25 6.5C11.25 6.08579 10.9142 5.75 10.5 5.75C10.0858 5.75 9.75 6.08579 9.75 6.5V8.75H7.5C7.08579 8.75 6.75 9.08579 6.75 9.5C6.75 9.91421 7.08579 10.25 7.5 10.25H9.75V12.5C9.75 12.9142 10.0858 13.25 10.5 13.25C10.9142 13.25 11.25 12.9142 11.25 12.5V10.25H13.5C13.9142 10.25 14.25 9.91421 14.25 9.5C14.25 9.08579 13.9142 8.75 13.5 8.75H11.25V6.5Z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Group */}
                      <div className="col-span-2 px-4 py-4 flex items-center">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: task.groupColor }}
                          ></div>
                          <span className="text-sm text-gray-900">{task.group}</span>
                        </div>
                      </div>

                      {/* Board */}
                      <div className="col-span-2 px-4 py-4 flex items-center">
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                          {task.board}
                        </a>
                      </div>

                      {/* People */}
                      <div className="col-span-1 px-4 py-4 flex items-center">
                        {task.assignee && (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: task.assignee.color }}
                          >
                            {task.assignee.avatar}
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div className="col-span-1 px-4 py-4 flex items-center">
                        {task.date && (
                          <span className="text-sm text-gray-600">
                            {new Date(task.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 px-4 py-4 flex items-center">
                        {task.status && (
                          <span 
                            className="px-3 py-1 text-white text-sm rounded-full font-medium"
                            style={{ backgroundColor: task.status.color }}
                          >
                            {task.status.label}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Item Row */}
                  {group.expanded && (
                    <div className="grid grid-cols-12 gap-0 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="col-span-4 px-4 py-4 flex items-center gap-2">
                        <div 
                          className="w-1 h-4 rounded-full opacity-50"
                          style={{ backgroundColor: group.color }}
                        ></div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-gray-300 rounded"></div>
                          <span className="text-sm font-medium">+ Add task</span>
                        </div>
                      </div>
                      <div className="col-span-8"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="p-6 text-center text-gray-500">
            <p>Calendar view coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWork;
