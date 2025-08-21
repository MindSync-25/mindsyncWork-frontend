export interface TemplateColumn {
  id: string;
  name: string;
  type: 'text' | 'status' | 'date' | 'person' | 'priority' | 'number' | 'timeline' | 'email' | 'phone' | 'dropdown';
  options?: string[];
  defaultValue?: any;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  popularity?: 'most-popular' | 'trending' | 'new';
  columns: TemplateColumn[];
  sampleRows?: any[];
  features: string[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: Template[];
}

// Template data with comprehensive coverage
export const templateCategories: TemplateCategory[] = [
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Organize and track projects from start to finish',
    icon: '📋',
    templates: [
      {
        id: 'software-development',
        name: 'Software Development',
        description: 'Manage sprints, features, bugs, and development cycles',
        category: 'project-management',
        icon: '💻',
        color: 'from-blue-500 to-indigo-500',
        popularity: 'most-popular',
        features: ['Sprint Planning', 'Bug Tracking', 'Feature Management', 'Code Reviews'],
        columns: [
          { id: 'task', name: 'Task', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Backlog', 'In Progress', 'Code Review', 'Testing', 'Done'] },
          { id: 'assignee', name: 'Assignee', type: 'person' },
          { id: 'priority', name: 'Priority', type: 'priority', options: ['Low', 'Medium', 'High', 'Critical'] },
          { id: 'sprint', name: 'Sprint', type: 'dropdown', options: ['Sprint 1', 'Sprint 2', 'Sprint 3'] },
          { id: 'story-points', name: 'Story Points', type: 'number' },
          { id: 'due-date', name: 'Due Date', type: 'date' }
        ],
        sampleRows: [
          { task: 'User Authentication System', status: 'In Progress', priority: 'High', sprint: 'Sprint 1', 'story-points': 8, assignee: 'John Smith' },
          { task: 'Payment Gateway Integration', status: 'Backlog', priority: 'Medium', sprint: 'Sprint 2', 'story-points': 13, assignee: 'Sarah Wilson' },
          { task: 'Fix Login Bug', status: 'Code Review', priority: 'Critical', sprint: 'Sprint 1', 'story-points': 3, assignee: 'Mike Johnson' },
          { task: 'Database Optimization', status: 'Testing', priority: 'Medium', sprint: 'Sprint 1', 'story-points': 5, assignee: 'Emily Davis' },
          { task: 'API Documentation', status: 'Done', priority: 'Low', sprint: 'Sprint 1', 'story-points': 2, assignee: 'Alex Brown' },
          { task: 'Mobile App UI Update', status: 'Backlog', priority: 'High', sprint: 'Sprint 2', 'story-points': 8, assignee: 'Lisa Garcia' }
        ]
      },
      {
        id: 'marketing-campaign',
        name: 'Marketing Campaign',
        description: 'Plan and execute marketing campaigns with content tracking',
        category: 'project-management',
        icon: '📢',
        color: 'from-pink-500 to-rose-500',
        popularity: 'trending',
        features: ['Campaign Planning', 'Content Calendar', 'Budget Tracking', 'Performance Analytics'],
        columns: [
          { id: 'campaign', name: 'Campaign', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Planning', 'In Progress', 'Review', 'Published', 'Completed'] },
          { id: 'owner', name: 'Campaign Owner', type: 'person' },
          { id: 'budget', name: 'Budget', type: 'number' },
          { id: 'launch-date', name: 'Launch Date', type: 'date' },
          { id: 'channel', name: 'Channel', type: 'dropdown', options: ['Social Media', 'Email', 'Google Ads', 'Print', 'TV'] },
          { id: 'priority', name: 'Priority', type: 'priority' }
        ],
        sampleRows: [
          { campaign: 'Q4 Product Launch', status: 'In Progress', budget: 50000, channel: 'Social Media', priority: 'High', owner: 'Marketing Team' },
          { campaign: 'Holiday Sale Campaign', status: 'Planning', budget: 25000, channel: 'Email', priority: 'Medium', owner: 'Sales Team' },
          { campaign: 'Brand Awareness Drive', status: 'Review', budget: 15000, channel: 'Google Ads', priority: 'Medium', owner: 'Digital Team' },
          { campaign: 'Customer Retention Program', status: 'Published', budget: 30000, channel: 'Email', priority: 'High', owner: 'CRM Team' },
          { campaign: 'Influencer Collaboration', status: 'Completed', budget: 20000, channel: 'Social Media', priority: 'Low', owner: 'Social Team' }
        ]
      },
      {
        id: 'event-planning',
        name: 'Event Planning',
        description: 'Organize events, conferences, and meetings with detailed tracking',
        category: 'project-management',
        icon: '🎉',
        color: 'from-purple-500 to-violet-500',
        features: ['Vendor Management', 'Budget Tracking', 'Guest Lists', 'Timeline Management'],
        columns: [
          { id: 'task', name: 'Task', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Not Started', 'In Progress', 'Pending Approval', 'Completed'] },
          { id: 'responsible', name: 'Responsible', type: 'person' },
          { id: 'deadline', name: 'Deadline', type: 'date' },
          { id: 'budget', name: 'Budget', type: 'number' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Venue', 'Catering', 'Marketing', 'Logistics', 'Entertainment'] },
          { id: 'priority', name: 'Priority', type: 'priority' }
        ]
      }
    ]
  },
  {
    id: 'crm-sales',
    name: 'CRM & Sales',
    description: 'Manage customer relationships and sales processes',
    icon: '💼',
    templates: [
      {
        id: 'sales-pipeline',
        name: 'Sales Pipeline',
        description: 'Track leads, deals, and sales performance from prospect to close',
        category: 'crm-sales',
        icon: '💰',
        color: 'from-green-500 to-emerald-500',
        popularity: 'most-popular',
        features: ['Lead Tracking', 'Deal Management', 'Sales Forecasting', 'Performance Analytics'],
        columns: [
          { id: 'lead', name: 'Lead/Company', type: 'text' },
          { id: 'status', name: 'Deal Stage', type: 'status', options: ['New Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] },
          { id: 'owner', name: 'Sales Rep', type: 'person' },
          { id: 'value', name: 'Deal Value', type: 'number' },
          { id: 'probability', name: 'Probability %', type: 'number' },
          { id: 'close-date', name: 'Expected Close', type: 'date' },
          { id: 'source', name: 'Lead Source', type: 'dropdown', options: ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Social Media'] },
          { id: 'priority', name: 'Priority', type: 'priority' }
        ],
        sampleRows: [
          { lead: 'Tech Corp Inc.', status: 'Proposal', value: 150000, probability: 75, source: 'Website', priority: 'High', owner: 'John Sales' },
          { lead: 'StartupXYZ', status: 'Qualified', value: 25000, probability: 40, source: 'Referral', priority: 'Medium', owner: 'Sarah Sales' },
          { lead: 'Enterprise Solutions Ltd', status: 'Negotiation', value: 300000, probability: 85, source: 'Trade Show', priority: 'Critical', owner: 'Mike Sales' },
          { lead: 'Local Business Inc', status: 'New Lead', value: 50000, probability: 20, source: 'Cold Call', priority: 'Medium', owner: 'Emily Sales' },
          { lead: 'Global Corp', status: 'Closed Won', value: 200000, probability: 100, source: 'LinkedIn', priority: 'High', owner: 'Alex Sales' }
        ]
      },
      {
        id: 'customer-support',
        name: 'Customer Support',
        description: 'Manage customer tickets, issues, and support requests',
        category: 'crm-sales',
        icon: '🎧',
        color: 'from-blue-500 to-cyan-500',
        features: ['Ticket Management', 'SLA Tracking', 'Customer History', 'Resolution Analytics'],
        columns: [
          { id: 'ticket', name: 'Ticket #', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['New', 'Open', 'Pending', 'Resolved', 'Closed'] },
          { id: 'customer', name: 'Customer', type: 'text' },
          { id: 'assignee', name: 'Assigned To', type: 'person' },
          { id: 'priority', name: 'Priority', type: 'priority' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Bug Report', 'Feature Request', 'Account Issue', 'Billing', 'General'] },
          { id: 'created', name: 'Created Date', type: 'date' },
          { id: 'resolution', name: 'Resolution Time', type: 'number' }
        ]
      },
      {
        id: 'lead-management',
        name: 'Lead Management',
        description: 'Capture, qualify, and nurture leads through your sales funnel',
        category: 'crm-sales',
        icon: '🎯',
        color: 'from-orange-500 to-red-500',
        popularity: 'trending',
        features: ['Lead Scoring', 'Qualification Process', 'Nurturing Campaigns', 'Conversion Tracking'],
        columns: [
          { id: 'lead', name: 'Lead Name', type: 'text' },
          { id: 'company', name: 'Company', type: 'text' },
          { id: 'status', name: 'Lead Status', type: 'status', options: ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'] },
          { id: 'score', name: 'Lead Score', type: 'number' },
          { id: 'source', name: 'Source', type: 'dropdown', options: ['Website', 'LinkedIn', 'Email Campaign', 'Trade Show', 'Referral'] },
          { id: 'owner', name: 'Sales Rep', type: 'person' },
          { id: 'email', name: 'Email', type: 'email' },
          { id: 'phone', name: 'Phone', type: 'phone' },
          { id: 'last-contact', name: 'Last Contact', type: 'date' }
        ]
      }
    ]
  },
  {
    id: 'portfolio-management',
    name: 'Portfolio Management',
    description: 'Track and manage multiple projects, investments, or creative works',
    icon: '📊',
    templates: [
      {
        id: 'project-portfolio',
        name: 'Project Portfolio',
        description: 'Oversee multiple projects with resource allocation and timeline tracking',
        category: 'portfolio-management',
        icon: '📁',
        color: 'from-indigo-500 to-purple-500',
        popularity: 'most-popular',
        features: ['Resource Planning', 'Timeline Overview', 'Budget Allocation', 'Risk Management'],
        columns: [
          { id: 'project', name: 'Project Name', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'] },
          { id: 'manager', name: 'Project Manager', type: 'person' },
          { id: 'budget', name: 'Budget', type: 'number' },
          { id: 'timeline', name: 'Timeline', type: 'timeline' },
          { id: 'progress', name: 'Progress %', type: 'number' },
          { id: 'priority', name: 'Priority', type: 'priority' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Development', 'Marketing', 'Operations', 'Research'] }
        ]
      },
      {
        id: 'investment-portfolio',
        name: 'Investment Portfolio',
        description: 'Track investments, performance, and portfolio allocation',
        category: 'portfolio-management',
        icon: '💹',
        color: 'from-green-500 to-teal-500',
        features: ['Performance Tracking', 'Risk Analysis', 'Allocation Management', 'ROI Calculation'],
        columns: [
          { id: 'investment', name: 'Investment', type: 'text' },
          { id: 'type', name: 'Type', type: 'dropdown', options: ['Stocks', 'Bonds', 'Real Estate', 'Crypto', 'Mutual Funds'] },
          { id: 'amount', name: 'Amount Invested', type: 'number' },
          { id: 'current-value', name: 'Current Value', type: 'number' },
          { id: 'roi', name: 'ROI %', type: 'number' },
          { id: 'purchase-date', name: 'Purchase Date', type: 'date' },
          { id: 'risk-level', name: 'Risk Level', type: 'dropdown', options: ['Low', 'Medium', 'High'] },
          { id: 'status', name: 'Status', type: 'status', options: ['Held', 'Sold', 'Under Review'] }
        ]
      },
      {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Manage creative projects, artwork, and design work',
        category: 'portfolio-management',
        icon: '🎨',
        color: 'from-pink-500 to-purple-500',
        features: ['Project Showcase', 'Client Management', 'Timeline Tracking', 'Revenue Tracking'],
        columns: [
          { id: 'project', name: 'Project', type: 'text' },
          { id: 'client', name: 'Client', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Concept', 'In Progress', 'Review', 'Revisions', 'Completed'] },
          { id: 'type', name: 'Type', type: 'dropdown', options: ['Logo Design', 'Website', 'Print Design', 'Illustration', 'Photography'] },
          { id: 'deadline', name: 'Deadline', type: 'date' },
          { id: 'budget', name: 'Budget', type: 'number' },
          { id: 'progress', name: 'Progress %', type: 'number' }
        ]
      }
    ]
  },
  {
    id: 'hr-people',
    name: 'HR & People Operations',
    description: 'Manage hiring, onboarding, and employee lifecycle',
    icon: '👥',
    templates: [
      {
        id: 'recruitment-pipeline',
        name: 'Recruitment Pipeline',
        description: 'Track candidates through your hiring process',
        category: 'hr-people',
        icon: '🔍',
        color: 'from-blue-500 to-indigo-500',
        popularity: 'most-popular',
        features: ['Candidate Tracking', 'Interview Scheduling', 'Hiring Analytics', 'Offer Management'],
        columns: [
          { id: 'candidate', name: 'Candidate', type: 'text' },
          { id: 'position', name: 'Position', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Applied', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired', 'Rejected'] },
          { id: 'recruiter', name: 'Recruiter', type: 'person' },
          { id: 'source', name: 'Source', type: 'dropdown', options: ['LinkedIn', 'Job Board', 'Referral', 'Company Website', 'Recruiter'] },
          { id: 'applied-date', name: 'Applied Date', type: 'date' },
          { id: 'next-step', name: 'Next Step', type: 'text' },
          { id: 'rating', name: 'Rating', type: 'number' }
        ]
      },
      {
        id: 'employee-onboarding',
        name: 'Employee Onboarding',
        description: 'Ensure smooth onboarding for new hires',
        category: 'hr-people',
        icon: '🎯',
        color: 'from-green-500 to-emerald-500',
        features: ['Onboarding Checklist', 'Document Tracking', 'Training Progress', 'Feedback Collection'],
        columns: [
          { id: 'employee', name: 'Employee', type: 'text' },
          { id: 'position', name: 'Position', type: 'text' },
          { id: 'status', name: 'Onboarding Status', type: 'status', options: ['Pre-boarding', 'Day 1', 'Week 1', 'Month 1', 'Completed'] },
          { id: 'buddy', name: 'Onboarding Buddy', type: 'person' },
          { id: 'start-date', name: 'Start Date', type: 'date' },
          { id: 'progress', name: 'Progress %', type: 'number' },
          { id: 'manager', name: 'Manager', type: 'person' },
          { id: 'department', name: 'Department', type: 'dropdown', options: ['Engineering', 'Sales', 'Marketing', 'HR', 'Operations'] }
        ]
      },
      {
        id: 'performance-reviews',
        name: 'Performance Reviews',
        description: 'Manage employee performance evaluations and goal tracking',
        category: 'hr-people',
        icon: '⭐',
        color: 'from-yellow-500 to-orange-500',
        features: ['Goal Setting', 'Performance Tracking', 'Review Scheduling', '360 Feedback'],
        columns: [
          { id: 'employee', name: 'Employee', type: 'text' },
          { id: 'manager', name: 'Manager', type: 'person' },
          { id: 'review-period', name: 'Review Period', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Scheduled', 'Self-Review', 'Manager Review', 'Discussion', 'Completed'] },
          { id: 'overall-rating', name: 'Overall Rating', type: 'dropdown', options: ['Exceeds', 'Meets', 'Below', 'Needs Improvement'] },
          { id: 'due-date', name: 'Due Date', type: 'date' },
          { id: 'goals-met', name: 'Goals Met %', type: 'number' }
        ]
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations & Manufacturing',
    description: 'Streamline operations, inventory, and production processes',
    icon: '⚙️',
    templates: [
      {
        id: 'inventory-management',
        name: 'Inventory Management',
        description: 'Track stock levels, orders, and warehouse operations',
        category: 'operations',
        icon: '📦',
        color: 'from-gray-500 to-slate-500',
        features: ['Stock Tracking', 'Reorder Alerts', 'Supplier Management', 'Cost Analysis'],
        columns: [
          { id: 'item', name: 'Item', type: 'text' },
          { id: 'sku', name: 'SKU', type: 'text' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Tools'] },
          { id: 'stock-level', name: 'Stock Level', type: 'number' },
          { id: 'reorder-point', name: 'Reorder Point', type: 'number' },
          { id: 'supplier', name: 'Supplier', type: 'text' },
          { id: 'cost', name: 'Cost', type: 'number' },
          { id: 'status', name: 'Status', type: 'status', options: ['In Stock', 'Low Stock', 'Out of Stock', 'Ordered'] }
        ]
      },
      {
        id: 'production-planning',
        name: 'Production Planning',
        description: 'Plan and track manufacturing and production schedules',
        category: 'operations',
        icon: '🏭',
        color: 'from-blue-500 to-indigo-500',
        features: ['Production Scheduling', 'Resource Planning', 'Quality Control', 'Efficiency Tracking'],
        columns: [
          { id: 'product', name: 'Product', type: 'text' },
          { id: 'batch', name: 'Batch #', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['Planned', 'In Production', 'Quality Check', 'Completed', 'Shipped'] },
          { id: 'quantity', name: 'Quantity', type: 'number' },
          { id: 'start-date', name: 'Start Date', type: 'date' },
          { id: 'completion-date', name: 'Completion Date', type: 'date' },
          { id: 'supervisor', name: 'Supervisor', type: 'person' },
          { id: 'priority', name: 'Priority', type: 'priority' }
        ]
      }
    ]
  },
  {
    id: 'finance-accounting',
    name: 'Finance & Accounting',
    description: 'Manage budgets, expenses, and financial tracking',
    icon: '💳',
    templates: [
      {
        id: 'budget-tracking',
        name: 'Budget Tracking',
        description: 'Monitor budgets, expenses, and financial performance',
        category: 'finance-accounting',
        icon: '📊',
        color: 'from-green-500 to-emerald-500',
        features: ['Expense Tracking', 'Budget Allocation', 'Variance Analysis', 'Financial Reporting'],
        columns: [
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Marketing', 'Operations', 'HR', 'Technology', 'Travel'] },
          { id: 'budgeted', name: 'Budgeted Amount', type: 'number' },
          { id: 'actual', name: 'Actual Spend', type: 'number' },
          { id: 'variance', name: 'Variance', type: 'number' },
          { id: 'owner', name: 'Budget Owner', type: 'person' },
          { id: 'period', name: 'Period', type: 'dropdown', options: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'] },
          { id: 'status', name: 'Status', type: 'status', options: ['On Track', 'Over Budget', 'Under Budget', 'Needs Review'] }
        ]
      },
      {
        id: 'invoice-management',
        name: 'Invoice Management',
        description: 'Track invoices, payments, and accounts receivable',
        category: 'finance-accounting',
        icon: '📄',
        color: 'from-blue-500 to-cyan-500',
        features: ['Invoice Tracking', 'Payment Status', 'Aging Reports', 'Collection Management'],
        columns: [
          { id: 'invoice', name: 'Invoice #', type: 'text' },
          { id: 'client', name: 'Client', type: 'text' },
          { id: 'amount', name: 'Amount', type: 'number' },
          { id: 'status', name: 'Status', type: 'status', options: ['Draft', 'Sent', 'Viewed', 'Paid', 'Overdue', 'Cancelled'] },
          { id: 'issue-date', name: 'Issue Date', type: 'date' },
          { id: 'due-date', name: 'Due Date', type: 'date' },
          { id: 'payment-date', name: 'Payment Date', type: 'date' },
          { id: 'payment-method', name: 'Payment Method', type: 'dropdown', options: ['Bank Transfer', 'Credit Card', 'Check', 'PayPal'] }
        ]
      }
    ]
  },
  {
    id: 'personal-productivity',
    name: 'Personal & Productivity',
    description: 'Personal task management, goals, and productivity tracking',
    icon: '✅',
    templates: [
      {
        id: 'personal-tasks',
        name: 'Personal Task Management',
        description: 'Organize your personal tasks, goals, and daily activities',
        category: 'personal-productivity',
        icon: '📝',
        color: 'from-purple-500 to-pink-500',
        popularity: 'trending',
        features: ['Task Organization', 'Goal Setting', 'Time Tracking', 'Habit Tracking'],
        columns: [
          { id: 'task', name: 'Task', type: 'text' },
          { id: 'status', name: 'Status', type: 'status', options: ['To Do', 'In Progress', 'Waiting', 'Done'] },
          { id: 'priority', name: 'Priority', type: 'priority' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Work', 'Personal', 'Health', 'Learning', 'Home'] },
          { id: 'due-date', name: 'Due Date', type: 'date' },
          { id: 'estimated-time', name: 'Est. Time (hrs)', type: 'number' },
          { id: 'notes', name: 'Notes', type: 'text' }
        ]
      },
      {
        id: 'goal-tracking',
        name: 'Goal Tracking',
        description: 'Set and track personal and professional goals',
        category: 'personal-productivity',
        icon: '🎯',
        color: 'from-orange-500 to-red-500',
        features: ['Goal Setting', 'Progress Tracking', 'Milestone Management', 'Achievement Analytics'],
        columns: [
          { id: 'goal', name: 'Goal', type: 'text' },
          { id: 'category', name: 'Category', type: 'dropdown', options: ['Career', 'Health', 'Finance', 'Learning', 'Personal'] },
          { id: 'status', name: 'Status', type: 'status', options: ['Not Started', 'In Progress', 'On Track', 'At Risk', 'Completed'] },
          { id: 'progress', name: 'Progress %', type: 'number' },
          { id: 'target-date', name: 'Target Date', type: 'date' },
          { id: 'priority', name: 'Priority', type: 'priority' },
          { id: 'notes', name: 'Notes', type: 'text' }
        ]
      }
    ]
  }
];

// Helper functions to get templates
export const getAllTemplates = (): Template[] => {
  return templateCategories.flatMap(category => category.templates);
};

export const getTemplatesByCategory = (categoryId: string): Template[] => {
  const category = templateCategories.find(cat => cat.id === categoryId);
  return category?.templates || [];
};

export const getTemplateById = (templateId: string): Template | undefined => {
  return getAllTemplates().find(template => template.id === templateId);
};

export const getPopularTemplates = (): Template[] => {
  return getAllTemplates().filter(template => template.popularity);
};

export const getMostPopularTemplates = (): Template[] => {
  return getAllTemplates().filter(template => template.popularity === 'most-popular');
};
