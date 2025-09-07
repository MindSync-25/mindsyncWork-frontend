import React from "react";
import { createPortal } from 'react-dom';
import { Bell, Plus, Search, ChevronDown, ChevronRight, Activity, Star, StarOff, X, Building2, FolderPlus, ChevronLeft, MoreHorizontal, Home, Layers, BarChart3, RefreshCw, MessageSquare, MessageCircle, Users, Send, CheckSquare } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================
export type ViewKind = "home" | "kanban" | "table" | "roadmap"; // kept for future
export interface View { id: string; name: string; kind: ViewKind }
export interface Board { id: string; name: string; views: View[] }
export interface Project { id: string; name: string; boards: Board[] }
export interface Workspace { id: string; name: string; color: string; icon?: string; projects: Project[]; pinned?: boolean }

interface KanbanTask { id: string; title: string; tags: string[]; assignees: string[]; points: number }
interface KanbanBoardData { order: string[]; columns: Record<string, KanbanTask[]> }
function createInitialKanbanData(): KanbanBoardData { const base = JSON.parse(JSON.stringify(kanbanSeed)) as Record<string, KanbanTask[]>; return { order: Object.keys(base), columns: base }; }

// Chat Types
interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
  isEdited?: boolean;
  replyTo?: string;
}

interface ChatGroup {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: string[]; // user IDs
  createdBy: string;
  createdAt: number;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  avatar?: string;
}

// ============================================================================
// GLOBAL
// ============================================================================
let setShowCreateWs: ((v: boolean) => void) | undefined;
const noiseBg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.04'/></svg>")`;

// ============================================================================
// UI PRIMITIVES
// ============================================================================
const GlassCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.55),0_1px_0_0_rgba(255,255,255,0.06)_inset] ${className}`} {...props}>{children}</div>
);
const SoftButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", children, ...props }) => (
  <button className={`inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-200 backdrop-blur-xl shadow-[0_2px_6px_rgba(0,0,0,0.5)] hover:bg-white/12 active:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 ${className}`} {...props}>{children}</button>
);
const Pill: React.FC<{ children: React.ReactNode; tone?: "neutral"|"blue"|"purple"|"green"|"amber"|"red"; className?: string; }> = ({ children, tone="neutral", className="" }) => {
  const toneMap: Record<string,string> = {
    neutral:"bg-white/10 text-slate-200 border-white/15",
    blue:"bg-cyan-500/15 text-cyan-300 border-cyan-400/25",
    purple:"bg-violet-500/15 text-violet-300 border-violet-400/25",
    green:"bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
    amber:"bg-amber-500/15 text-amber-300 border-amber-400/25",
    red:"bg-rose-500/15 text-rose-300 border-rose-400/25",
  }; return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${toneMap[tone]} ${className}`}>{children}</span>;
};
const FrostItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className="", children, ...props }) => (
  <div className={`rounded-lg border border-white/10 bg-white/8 backdrop-blur-xl px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-slate-200 ${className}`} {...props}>{children}</div>
);

// ============================================================================
// DEMO DATA
// ============================================================================
const team = [
  { id: "u1", name: "Sam", color: "bg-rose-400" },
  { id: "u2", name: "Ava", color: "bg-amber-500" },
  { id: "u3", name: "Leo", color: "bg-emerald-500" },
  { id: "u4", name: "Mia", color: "bg-indigo-500" },
  { id: "u5", name: "Zed", color: "bg-cyan-500" },
];

// Chat demo data
const chatUsers: ChatUser[] = [
  { id: "u1", name: "Sam", isOnline: true },
  { id: "u2", name: "Ava", isOnline: false, lastSeen: Date.now() - 300000 }, // 5 min ago
  { id: "u3", name: "Leo", isOnline: true },
  { id: "u4", name: "Mia", isOnline: false, lastSeen: Date.now() - 1800000 }, // 30 min ago
  { id: "u5", name: "Zed", isOnline: true },
];

const sampleChatGroups: ChatGroup[] = [
  {
    id: "direct_u1_u3",
    name: "Sam",
    type: "direct",
    members: ["u1", "u3"],
    createdBy: "u1",
    createdAt: Date.now() - 86400000, // 1 day ago
    lastMessage: {
      id: "msg_1",
      senderId: "u1",
      content: "Hey Leo, how's the auth implementation going?",
      timestamp: Date.now() - 1800000, // 30 min ago
      type: "text"
    },
    unreadCount: 2
  },
  {
    id: "group_dev_team",
    name: "Development Team",
    type: "group",
    members: ["u1", "u3", "u5"],
    createdBy: "u1",
    createdAt: Date.now() - 604800000, // 1 week ago
    lastMessage: {
      id: "msg_2",
      senderId: "u5",
      content: "I've pushed the latest changes to the repo",
      timestamp: Date.now() - 3600000, // 1 hour ago
      type: "text"
    },
    unreadCount: 0
  },
  {
    id: "direct_u1_u2",
    name: "Ava",
    type: "direct",
    members: ["u1", "u2"],
    createdBy: "u1",
    createdAt: Date.now() - 172800000, // 2 days ago
    lastMessage: {
      id: "msg_3",
      senderId: "u2",
      content: "Thanks for the design feedback!",
      timestamp: Date.now() - 7200000, // 2 hours ago
      type: "text"
    },
    unreadCount: 0
  },
  {
    id: "group_project_alpha",
    name: "Project Alpha",
    type: "group",
    members: ["u1", "u2", "u4"],
    createdBy: "u2",
    createdAt: Date.now() - 259200000, // 3 days ago
    lastMessage: {
      id: "msg_4",
      senderId: "u4",
      content: "Meeting rescheduled to 3 PM",
      timestamp: Date.now() - 10800000, // 3 hours ago
      type: "text"
    },
    unreadCount: 1
  }
];

const sampleChatMessages: ChatMessage[] = [
  // Direct messages between users
  {
    id: "msg_d1_1",
    senderId: "u3",
    content: "Hey Sam! Auth is coming along well. Just working on the JWT refresh logic.",
    timestamp: Date.now() - 2400000, // 40 min ago
    type: "text",
    chatId: "direct_u1_u3"
  },
  {
    id: "msg_d1_2",
    senderId: "u1",
    content: "Hey Leo, how's the auth implementation going?",
    timestamp: Date.now() - 1800000, // 30 min ago
    type: "text",
    chatId: "direct_u1_u3"
  },
  {
    id: "msg_d1_3",
    senderId: "u3",
    content: "Almost done! Should be ready for review by EOD.",
    timestamp: Date.now() - 900000, // 15 min ago
    type: "text",
    chatId: "direct_u1_u3"
  },
  // Group messages
  {
    id: "msg_g1_1",
    senderId: "u1",
    content: "Morning team! How's everyone doing?",
    timestamp: Date.now() - 7200000, // 2 hours ago
    type: "text",
    chatId: "group_dev_team"
  },
  {
    id: "msg_g1_2",
    senderId: "u3",
    content: "Good morning! Working on the auth module.",
    timestamp: Date.now() - 6900000, // 1h 55m ago
    type: "text",
    chatId: "group_dev_team"
  },
  {
    id: "msg_g1_3",
    senderId: "u5",
    content: "I've pushed the latest changes to the repo",
    timestamp: Date.now() - 3600000, // 1 hour ago
    type: "text",
    chatId: "group_dev_team"
  }
];
const Avatar: React.FC<{ userId: string; className?: string }> = ({ userId, className }) => { const u = team.find(t=>t.id===userId)!; return <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow ${u.color} ${className}`} title={u.name}>{u.name[0]}</div>; };
const Assignees: React.FC<{ ids: readonly string[] }> = ({ ids }) => <div className="flex -space-x-2">{ids.map(id => <Avatar key={id} userId={id} />)}</div>;
const kanbanSeed = {
  Backlog: [ 
    { 
      id: "t1", 
      title: "Implement user auth", 
      tags:["backend"], 
      assignees:["u3"], 
      points:5,
      comments: [
        {
          id: "comment_1",
          author: "u1",
          content: "We should use JWT tokens for session management. Make sure to include refresh token logic.",
          createdAt: Date.now() - 3600000, // 1 hour ago
        },
        {
          id: "comment_2", 
          author: "u3",
          content: "Agreed! I'll also add rate limiting for login attempts. Should we use bcrypt for password hashing?",
          createdAt: Date.now() - 1800000, // 30 minutes ago
        },
        {
          id: "comment_3",
          author: "u1", 
          content: "Yes, bcrypt is perfect. Don't forget to validate email format on the frontend too.",
          createdAt: Date.now() - 900000, // 15 minutes ago
        }
      ],
      subtasks: [
        { id: "t1_sub1", title: "Setup JWT authentication", tags:["backend"], assignees:["u3"], points:2, parentTaskId: "t1", isSubtask: true, custom: { status: 'done' } },
        { id: "t1_sub2", title: "Create login API endpoint", tags:["backend"], assignees:["u3"], points:2, parentTaskId: "t1", isSubtask: true, custom: { status: 'todo' }, comments: [
          {
            id: "comment_sub_1",
            author: "u3",
            content: "Working on the validation logic. Should return proper error codes for different failure scenarios.",
            createdAt: Date.now() - 1200000, // 20 minutes ago
          }
        ] },
        { id: "t1_sub3", title: "Add password validation", tags:["backend"], assignees:["u3"], points:1, parentTaskId: "t1", isSubtask: true, custom: { status: 'todo' } }
      ]
    }, 
    { id: "t2", title: "Design settings page", tags:["ui/ux"], assignees:["u2"], points:3, subtasks: [] } 
  ],
  Todo: [ 
    { 
      id: "t3", 
      title: "Add invite flow", 
      tags:["frontend"], 
      assignees:["u1"], 
      points:3,
      subtasks: [
        { id: "t3_sub1", title: "Create invite UI components", tags:["frontend"], assignees:["u1"], points:2, parentTaskId: "t3", isSubtask: true, custom: { status: 'done' } },
        { id: "t3_sub2", title: "Add email validation", tags:["frontend"], assignees:["u1"], points:1, parentTaskId: "t3", isSubtask: true, custom: { status: 'done' } }
      ]
    } 
  ],
  "In Progress": [ 
    { 
      id: "t4", 
      title: "CI pipeline for PRs", 
      tags:["devops"], 
      assignees:["u4"], 
      points:5,
      subtasks: [
        { id: "t4_sub1", title: "Setup GitHub Actions", tags:["devops"], assignees:["u4"], points:2, parentTaskId: "t4", isSubtask: true, custom: { status: 'done' } },
        { id: "t4_sub2", title: "Configure test automation", tags:["devops"], assignees:["u4"], points:2, parentTaskId: "t4", isSubtask: true, custom: { status: 'done' } },
        { id: "t4_sub3", title: "Add deployment pipeline", tags:["devops"], assignees:["u4"], points:1, parentTaskId: "t4", isSubtask: true, custom: { status: 'todo' } }
      ]
    }, 
    { 
      id: "t5", 
      title: "Board drag & drop", 
      tags:["frontend","ui"], 
      assignees:["u1","u5"], 
      points:8,
      subtasks: [
        { id: "t5_sub1", title: "Implement drag events", tags:["frontend"], assignees:["u1"], points:3, parentTaskId: "t5", isSubtask: true, custom: { status: 'done' } },
        { id: "t5_sub2", title: "Add drop zones", tags:["frontend"], assignees:["u1"], points:2, parentTaskId: "t5", isSubtask: true, custom: { status: 'todo' } },
        { id: "t5_sub3", title: "Update UI feedback", tags:["ui"], assignees:["u5"], points:2, parentTaskId: "t5", isSubtask: true, custom: { status: 'todo' } },
        { id: "t5_sub4", title: "Add visual indicators", tags:["ui"], assignees:["u5"], points:1, parentTaskId: "t5", isSubtask: true, custom: { status: 'todo' } }
      ]
    } 
  ],
  Review: [ { id: "t6", title: "Bug: avatar overflow", tags:["bug"], assignees:["u2"], points:2, subtasks: [] } ],
  Done: [ { id: "t7", title: "Create project skeleton", tags:["infra"], assignees:["u3"], points:3, subtasks: [] } ]
} as const;

// Views kept for template generation
const viewHome: View = { id: "v_home", name: "Home", kind: "home" };
const viewKanban: View = { id: "v_kanban", name: "Kanban", kind: "kanban" };
const viewTable: View = { id: "v_table", name: "Table", kind: "table" };
const viewRoadmap: View = { id: "v_roadmap", name: "Roadmap", kind: "roadmap" };

const SEED_WORKSPACES: Workspace[] = [
  { id: "ws_software", name: "Software Development", color: "from-slate-700 to-slate-800", pinned:true, projects: [ { id: "p_platform", name: "Core Platform", boards: [ { id:"b_dev", name:"Development", views:[viewHome, viewKanban, viewTable, viewRoadmap] }, { id:"b_qa", name:"QA", views:[viewHome, viewTable, viewKanban] } ] } ] }
];

function seedWorkspaceByTemplate(name: string, templateKey: string): Workspace {
  const base: Workspace = { id: `ws_${Math.random().toString(36).slice(2,8)}`, name, color:"from-indigo-300 to-cyan-300", projects: [] };
  const pickId = (p:string) => `${p}_${Math.random().toString(36).slice(2,8)}`;
  const mkProject = (pname:string, boards:{ name:string; views: View[] }[]): Project => ({ id: pickId('p'), name:pname, boards: boards.map(b => ({ id: pickId('b'), ...b })) });
  const common = [viewHome, viewKanban, viewTable, viewRoadmap];
  if (templateKey === 'software_dev') base.projects = [ mkProject('Core Platform',[{name:'Development',views:common},{name:'QA',views:[viewHome,viewTable,viewKanban]}]) ];
  else base.projects = [ mkProject('Project A',[{name:'Board 1',views:common}]) ];
  return base;
}

// ============================================================================
// WORKSPACE SWITCHER + MODAL
// ============================================================================
const WorkspaceSwitcher: React.FC<{ workspaces: Workspace[]; activeId: string; onSelect:(id:string)=>void; onCreate:()=>void; onTogglePin:(id:string)=>void; }> = ({ workspaces, activeId, onSelect, onCreate, onTogglePin }) => {
  const [open,setOpen]=React.useState(false);
  const active = workspaces.find(w=>w.id===activeId)!;
  const pinned = workspaces.filter(w=>w.pinned);
  const others = workspaces.filter(w=>!w.pinned && w.id!==activeId);
  return (
    <div className="relative">
      <SoftButton onClick={()=>setOpen(o=>!o)} className="gap-2"><div className={`h-6 w-6 rounded-md bg-gradient-to-br ${active.color}`}/><span className="text-sm font-medium text-slate-200">{active.name}</span><ChevronDown className="h-4 w-4 text-slate-400"/></SoftButton>
      {open && (
        <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#121a24]/90 p-2 backdrop-blur-xl shadow-xl z-50">
          <div className="px-2 pb-2 text-[11px] uppercase tracking-wide text-slate-400">Pinned</div>
          {pinned.map(w => (
            <button key={w.id} onClick={()=>{onSelect(w.id); setOpen(false);}} className={`group flex w-full items-center justify-between rounded-xl px-2 py-2 text-left ${w.id===activeId?'bg-white/10':''} hover:bg-white/5`}> <div className="flex items-center gap-2"><div className={`h-5 w-5 rounded bg-gradient-to-br ${w.color}`}/><span className="text-sm text-slate-200">{w.name}</span></div><Star className="h-4 w-4 text-amber-400"/></button>
          ))}
          <div className="px-2 pt-2 pb-2 text-[11px] uppercase tracking-wide text-slate-400">All</div>
          {others.map(w => (
            <div key={w.id} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/5">
              <button onClick={()=>{onSelect(w.id); setOpen(false);}} className="flex items-center gap-2"><div className={`h-5 w-5 rounded bg-gradient-to-br ${w.color}`}/><span className="text-sm text-slate-200">{w.name}</span></button>
              <button onClick={()=>onTogglePin(w.id)} className="p-1 text-slate-400 hover:text-slate-200">{w.pinned? <Star className="h-4 w-4 text-amber-400"/> : <StarOff className="h-4 w-4"/>}</button>
            </div>
          ))}
          <div className="mt-2 border-t border-white/10 pt-2"><SoftButton onClick={()=>{setOpen(false); onCreate();}} className="w-full justify-center text-xs"><FolderPlus className="h-4 w-4"/> New workspace</SoftButton></div>
        </div>
      )}
    </div>
  );
};

const TEMPLATES = [ {key:'software_dev', name:'Software Development'}, {key:'generic', name:'Generic'} ];
const CreateWorkspaceModal: React.FC<{ open:boolean; onClose:()=>void; onCreate:(name:string, template:string)=>void; }> = ({ open, onClose, onCreate }) => {
  const [name,setName]=React.useState("");
  const [template,setTemplate]=React.useState('software_dev');
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose}/>
      <GlassCard className="relative z-10 w-[680px] max-w-[92vw] p-5">
        <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-slate-400"/><h2 className="text-base font-semibold text-slate-100">Create workspace</h2></div><button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-white/5"><X className="h-4 w-4"/></button></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-3"><label className="mb-1 block text-xs font-medium text-slate-400">Workspace name</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400/40" placeholder="e.g. Marketing"/></div>
          <div className="md:col-span-3"><label className="mb-2 block text-xs font-medium text-slate-400">Template</label><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{TEMPLATES.map(t => <button key={t.key} onClick={()=>setTemplate(t.key)} className={`rounded-xl border px-3 py-3 text-left transition ${template===t.key?'border-cyan-400/50 bg-white/10':'border-white/10 bg-white/5 hover:bg-white/8'}`}><div className="h-10 w-10 rounded-md bg-gradient-to-br from-slate-600 to-slate-800"/><div className="mt-2 text-sm font-medium text-slate-100">{t.name}</div><div className="text-xs text-slate-400">Starter boards</div></button>)}</div></div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2"><SoftButton className="text-slate-300" onClick={onClose}>Cancel</SoftButton><SoftButton onClick={()=>{ if(!name.trim()) return; onCreate(name.trim(), template); onClose(); }} className="bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30">Create</SoftButton></div>
      </GlassCard>
    </div>
  );
};

// ============================================================================
// CHAT SYSTEM
// ============================================================================

// Individual Chat Item Component
const ChatItem: React.FC<{
  chat: ChatGroup;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}> = ({ chat, isActive, onClick, currentUserId }) => {
  const getDisplayName = () => {
    if (chat.type === 'direct') {
      const otherUserId = chat.members.find(id => id !== currentUserId);
      const otherUser = chatUsers.find(u => u.id === otherUserId);
      return otherUser?.name || 'Unknown User';
    }
    return chat.name;
  };

  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return 'No messages yet';
    const sender = chatUsers.find(u => u.id === chat.lastMessage!.senderId);
    const senderName = sender?.name || 'Unknown';
    const preview = chat.lastMessage.content.substring(0, 30);
    return chat.type === 'group' ? `${senderName}: ${preview}` : preview;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getOnlineStatus = () => {
    if (chat.type === 'group') return null;
    const otherUserId = chat.members.find(id => id !== currentUserId);
    const otherUser = chatUsers.find(u => u.id === otherUserId);
    return otherUser?.isOnline;
  };

  const isOnline = getOnlineStatus();

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-all ${
        isActive ? 'bg-white/15' : 'hover:bg-white/8'
      }`}
    >
      <div className="relative">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
          chat.type === 'group' ? 'bg-violet-500' : 'bg-emerald-500'
        }`}>
          {chat.type === 'group' ? (
            <Users className="h-4 w-4" />
          ) : (
            getDisplayName().charAt(0).toUpperCase()
          )}
        </div>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200 truncate">
            {getDisplayName()}
          </span>
          {chat.lastMessage && (
            <span className="text-xs text-slate-500">
              {formatTime(chat.lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 truncate">
            {getLastMessagePreview()}
          </span>
          {chat.unreadCount! > 0 && (
            <span className="bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat List Component
const ChatList: React.FC<{
  chats: ChatGroup[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  currentUserId: string;
}> = ({ chats, activeChat, onSelectChat, currentUserId }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredChats = chats.filter(chat => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    if (chat.type === 'group') {
      return chat.name.toLowerCase().includes(query);
    } else {
      const otherUserId = chat.members.find(id => id !== currentUserId);
      const otherUser = chatUsers.find(u => u.id === otherUserId);
      return otherUser?.name.toLowerCase().includes(query);
    }
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
        />
      </div>

      {/* Chat Items */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {filteredChats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChat === chat.id}
            onClick={() => onSelectChat(chat.id)}
            currentUserId={currentUserId}
          />
        ))}
        {filteredChats.length === 0 && (
          <div className="text-center py-4 text-slate-500 text-xs">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Messages Component
const ChatMessages: React.FC<{
  chatId: string;
  currentUserId: string;
}> = ({ chatId, currentUserId }) => {
  const messages = sampleChatMessages.filter(msg => msg.chatId === chatId);
  const [newMessage, setNewMessage] = React.useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    // Here you would normally send the message to your backend
    console.log('Sending message:', newMessage, 'to chat:', chatId);
    setNewMessage("");
  };

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map(message => {
          const sender = chatUsers.find(u => u.id === message.senderId);
          const isOwnMessage = message.senderId === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                  <div className="text-xs text-slate-400 mb-1">
                    {sender?.name || 'Unknown'}
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-slate-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-cyan-100' : 'text-slate-500'
                  }`}>
                    {formatMessageTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// CHATS PAGE - Teams-style Layout
// ============================================================================
const ChatsPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = React.useState<string | null>('team-dev');
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newMessage, setNewMessage] = React.useState("");

  const filteredChats = sampleChatGroups.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = sampleChatGroups.find(chat => chat.id === selectedChat);
  const chatMessages = (sampleChatMessages || []).filter(msg => msg.chatId === selectedChat);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    // In a real app, this would send to the backend
    console.log('Sending message:', { chatId: selectedChat, message: newMessage });
    setNewMessage("");
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => {
            const isActive = selectedChat === chat.id;
            const lastMessage = sampleChatMessages
              .filter(msg => msg.chatId === chat.id)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3 border-b border-white/5 cursor-pointer transition-colors ${
                  isActive ? 'bg-cyan-500/20 border-l-2 border-l-cyan-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {chat.type === 'direct' ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-200">
                          {chat.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {chat.type === 'direct' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-200 truncate">{chat.name}</h3>
                      {lastMessage && (
                        <span className="text-xs text-slate-500">
                          {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {lastMessage.senderId === '1' ? 'You: ' : ''}{lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side - Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat && currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="relative">
                {currentChat.type === 'direct' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-200">
                      {currentChat.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                )}
                {currentChat.type === 'direct' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-200">{currentChat.name}</h2>
                <p className="text-sm text-slate-400">
                  {currentChat.type === 'group' ? `${currentChat.participants.length} members` : 'Direct message'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => {
                const sender = chatUsers.find(user => user.id === message.senderId);
                const isOwn = message.senderId === '1';

                return (
                  <div key={message.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    {!isOwn && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-slate-200">
                          {sender?.name.split(' ').map(n => n[0]).join('') || '?'}
                        </span>
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isOwn && (
                        <span className="text-xs text-slate-400 mb-1">{sender?.name}</span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-cyan-600 text-white' 
                            : 'bg-white/10 text-slate-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-slate-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">Select a chat</h3>
              <p className="text-sm text-slate-500">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MY TASKS PAGE
// ============================================================================
const MyTasksPage: React.FC<{ 
  workspace: Workspace | undefined; 
  currentUserId: string;
  onTaskClick?: (task: any) => void;
  kanbanBoards: Record<string, KanbanBoardData>;
}> = ({ workspace, currentUserId, onTaskClick, kanbanBoards }) => {
  const [viewMode, setViewMode] = React.useState<'kanban' | 'table'>('kanban');
  
  // Get all tasks assigned to current user from all kanban boards
  const myTasks = React.useMemo(() => {
    if (!workspace) return { kanban: {}, table: [], columnOrder: [] };
    
    const allMyTasks: KanbanTask[] = [];
    const kanbanColumns: Record<string, KanbanTask[]> = {};
    const allColumns = new Set<string>();
    
    workspace.projects.forEach(project => {
      project.boards.forEach(board => {
        const boardData = kanbanBoards[board.id];
        if (boardData) {
          // Collect all column names from all boards
          Object.keys(boardData.columns).forEach(columnName => {
            allColumns.add(columnName);
          });
          
          // Get tasks from all columns for this board
          Object.entries(boardData.columns).forEach(([columnName, tasks]) => {
            const userTasks = tasks.filter(task => 
              task.assignees.includes(currentUserId)
            );
            
            // Add project and board info to tasks
            const enhancedTasks = userTasks.map(task => ({
              ...task,
              projectName: project.name,
              boardName: board.name,
              projectId: project.id,
              boardId: board.id,
              columnName
            }));
            
            allMyTasks.push(...enhancedTasks);
            
            // Group by column for kanban view
            if (!kanbanColumns[columnName]) {
              kanbanColumns[columnName] = [];
            }
            kanbanColumns[columnName].push(...enhancedTasks);
          });
        }
      });
    });
    
    // Ensure all columns are represented, even if empty
    allColumns.forEach(columnName => {
      if (!kanbanColumns[columnName]) {
        kanbanColumns[columnName] = [];
      }
    });
    
    // If no boards exist, show default columns
    const columnOrder = Array.from(allColumns);
    if (columnOrder.length === 0) {
      const defaultColumns = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
      defaultColumns.forEach(col => {
        kanbanColumns[col] = [];
      });
      columnOrder.push(...defaultColumns);
    }
    
    return {
      kanban: kanbanColumns,
      table: allMyTasks,
      columnOrder
    };
  }, [workspace, currentUserId, kanbanBoards]);

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <CheckSquare className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-100 mb-2">No workspace selected</h3>
          <p className="text-slate-400">Select a workspace to view your tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section matching BoardScreen style */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex items-center gap-2 overflow-x-auto max-w-full py-1 pl-1 pr-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 shrink-0">My Tasks:</span>
          <div className="flex items-center gap-1">
            <div className="rounded-lg px-3 py-1.5 text-[12px] font-medium bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              {myTasks.table.length} tasks assigned
              <span className="absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"/>
            </div>
          </div>
        </div>
        
        {/* View selector dropdown matching BoardScreen */}
        <div className="relative">
          <button
            onClick={() => setViewMode('kanban')}
            className={`mr-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'kanban' 
                ? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40' 
                : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5 inline mr-1" />
            Kanban
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'table' 
                ? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40' 
                : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 inline mr-1" />
            Table
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {viewMode === 'kanban' ? (
          <GlassCard className="p-6 overflow-hidden">
            <div className="overflow-x-auto pb-2 w-full">
              <div className="flex items-start gap-4" style={{ minWidth: 'fit-content' }}>
                {myTasks.columnOrder.map((columnName) => (
                  <div
                    key={columnName}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 w-64 shrink-0"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-200">{columnName}</h3>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">
                        {myTasks.kanban[columnName]?.length || 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {(myTasks.kanban[columnName] || []).length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-slate-500 text-xs">No tasks in {columnName}</div>
                        </div>
                      ) : (
                        (myTasks.kanban[columnName] || []).map((task: any) => (
                          <div
                            key={`${task.boardId}-${task.id}`}
                            onClick={() => onTaskClick?.(task)}
                            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                          >
                            <div className="mb-2 font-medium text-slate-100">{task.title}</div>
                            <div className="mb-2 text-xs text-slate-400">
                              {task.projectName} • {task.boardName}
                            </div>
                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags.map((tag: string, i: number) => (
                                  <span 
                                    key={i} 
                                    className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Assignees ids={task.assignees} />
                              </div>
                              {task.points > 0 && (
                                <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded">
                                  {task.points}pt
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">All My Tasks</span>
                <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                  {myTasks.table.length}
                </span>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-xs">
                <thead>
                  <tr className="sticky top-0 backdrop-blur bg-white/5">
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Task</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Project</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Board</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Status</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Assignees</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Tags</th>
                    <th className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.table.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="text-slate-400">
                          <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No tasks assigned to you yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    myTasks.table.map((task: any) => (
                      <tr 
                        key={`${task.boardId}-${task.id}`}
                        className="hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => onTaskClick?.(task)}
                      >
                        <td className="px-4 py-2 text-slate-100 truncate max-w-[320px]" title={task.title}>
                          <div className="font-medium">{task.title}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-400">{task.projectName}</td>
                        <td className="px-4 py-2 text-slate-400">{task.boardName}</td>
                        <td className="px-4 py-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                            {task.columnName}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Assignees ids={task.assignees} />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag: string, i: number) => (
                              <span 
                                key={i} 
                                className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-400">{task.points}pt</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CHAT PAGE
// ============================================================================
const ChatPage: React.FC<{ 
  workspace: Workspace | undefined; 
  currentUserId: string;
}> = ({ workspace, currentUserId }) => {
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(null);
  const [messageInput, setMessageInput] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNewChatModal, setShowNewChatModal] = React.useState(false);

  // Mock data - will be replaced with real backend integration
  const [users] = React.useState<ChatUser[]>([
    { id: '1', name: 'John Doe', isOnline: true, avatar: 'JD' },
    { id: '2', name: 'Sarah Wilson', isOnline: true, avatar: 'SW' },
    { id: '3', name: 'Mike Johnson', isOnline: false, lastSeen: Date.now() - 3600000, avatar: 'MJ' },
    { id: '4', name: 'Lisa Chen', isOnline: true, avatar: 'LC' },
    { id: '5', name: 'David Brown', isOnline: false, lastSeen: Date.now() - 7200000, avatar: 'DB' },
  ]);

  const [chatGroups, setChatGroups] = React.useState<ChatGroup[]>([
    {
      id: 'direct-1-2',
      name: 'John Doe',
      type: 'direct',
      members: ['1', '2'],
      createdBy: '1',
      createdAt: Date.now() - 86400000,
      lastMessage: {
        id: 'msg-1',
        senderId: '2',
        content: 'Hey, how\'s the project going?',
        timestamp: Date.now() - 3600000,
        type: 'text'
      },
      unreadCount: 2
    },
    {
      id: 'group-dev-team',
      name: 'Development Team',
      type: 'group',
      members: ['1', '2', '3', '4'],
      createdBy: '1',
      createdAt: Date.now() - 172800000,
      lastMessage: {
        id: 'msg-2',
        senderId: '3',
        content: 'Let\'s discuss the new features in tomorrow\'s meeting',
        timestamp: Date.now() - 7200000,
        type: 'text'
      },
      unreadCount: 0
    },
    {
      id: 'direct-1-4',
      name: 'Lisa Chen',
      type: 'direct',
      members: ['1', '4'],
      createdBy: '1',
      createdAt: Date.now() - 259200000,
      lastMessage: {
        id: 'msg-3',
        senderId: '4',
        content: 'Thanks for the code review!',
        timestamp: Date.now() - 14400000,
        type: 'text'
      },
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = React.useState<Record<string, ChatMessage[]>>({
    'direct-1-2': [
      {
        id: 'msg-1-1',
        senderId: '2',
        content: 'Hey there! How\'s everything going?',
        timestamp: Date.now() - 7200000,
        type: 'text'
      },
      {
        id: 'msg-1-2',
        senderId: '1',
        content: 'Going well! Just finished the new dashboard feature.',
        timestamp: Date.now() - 7000000,
        type: 'text'
      },
      {
        id: 'msg-1-3',
        senderId: '2',
        content: 'Hey, how\'s the project going?',
        timestamp: Date.now() - 3600000,
        type: 'text'
      }
    ],
    'group-dev-team': [
      {
        id: 'msg-2-1',
        senderId: '1',
        content: 'Good morning team! Ready for today\'s sprint?',
        timestamp: Date.now() - 10800000,
        type: 'text'
      },
      {
        id: 'msg-2-2',
        senderId: '3',
        content: 'Yes! I\'ve completed the API endpoints we discussed.',
        timestamp: Date.now() - 9600000,
        type: 'text'
      },
      {
        id: 'msg-2-3',
        senderId: '4',
        content: 'UI components are also ready for testing.',
        timestamp: Date.now() - 8400000,
        type: 'text'
      },
      {
        id: 'msg-2-4',
        senderId: '3',
        content: 'Let\'s discuss the new features in tomorrow\'s meeting',
        timestamp: Date.now() - 7200000,
        type: 'text'
      }
    ],
    'direct-1-4': [
      {
        id: 'msg-3-1',
        senderId: '1',
        content: 'Hi Lisa, could you review the PR when you get a chance?',
        timestamp: Date.now() - 18000000,
        type: 'text'
      },
      {
        id: 'msg-3-2',
        senderId: '4',
        content: 'Sure! I\'ll take a look at it this afternoon.',
        timestamp: Date.now() - 16200000,
        type: 'text'
      },
      {
        id: 'msg-3-3',
        senderId: '4',
        content: 'Thanks for the code review!',
        timestamp: Date.now() - 14400000,
        type: 'text'
      }
    ]
  });

  const selectedChat = chatGroups.find(chat => chat.id === selectedChatId);
  const chatMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChatId) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: messageInput.trim(),
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    // Update last message in chat group
    setChatGroups(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
        : chat
    ));

    setMessageInput('');
  };

  const getUserInfo = (userId: string) => {
    return users.find(user => user.id === userId) || { 
      id: userId, 
      name: `User ${userId}`, 
      isOnline: false, 
      avatar: userId.slice(0, 2).toUpperCase() 
    };
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredChats = chatGroups.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-100 mb-2">No workspace selected</h3>
          <p className="text-slate-400">Select a workspace to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {selectedChat.type === 'direct' 
                        ? getUserInfo(selectedChat.members.find(id => id !== currentUserId) || '').avatar
                        : selectedChat.name.slice(0, 2).toUpperCase()
                      }
                    </div>
                    {selectedChat.type === 'direct' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {selectedChat.type === 'direct' 
                        ? getUserInfo(selectedChat.members.find(id => id !== currentUserId) || '').name
                        : selectedChat.name
                      }
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedChat.type === 'direct' 
                        ? getUserInfo(selectedChat.members.find(id => id !== currentUserId) || '').isOnline 
                          ? 'Online' 
                          : 'Offline'
                        : `${selectedChat.members.length} members`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10">
                    <Search className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => {
                const sender = getUserInfo(message.senderId);
                const isCurrentUser = message.senderId === currentUserId;
                const showAvatar = index === 0 || chatMessages[index - 1].senderId !== message.senderId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isCurrentUser && showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {sender.avatar}
                      </div>
                    )}
                    {!isCurrentUser && !showAvatar && <div className="w-8" />}
                    
                    <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : ''}`}>
                      {!isCurrentUser && showAvatar && (
                        <p className="text-xs text-slate-400 mb-1">{sender.name}</p>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/10 text-slate-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400/40 resize-none"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Select a conversation</h3>
              <p className="text-slate-400">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Chat List */}
      <div className="w-80 border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-100">Conversations</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400/40"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => {
            const isSelected = selectedChatId === chat.id;
            const otherUser = chat.type === 'direct' 
              ? getUserInfo(chat.members.find(id => id !== currentUserId) || '')
              : null;
            
            return (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 cursor-pointer transition-colors border-b border-white/5 ${
                  isSelected ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {chat.type === 'direct' ? otherUser?.avatar : chat.name.slice(0, 2).toUpperCase()}
                    </div>
                    {chat.type === 'direct' && otherUser?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-100 truncate">
                        {chat.type === 'direct' ? otherUser?.name : chat.name}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400 truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="ml-2 bg-cyan-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MINDSYNC AI PAGE
// ============================================================================
const MindSyncAIPage: React.FC<{ 
  workspace: Workspace | undefined; 
  currentUserId: string;
}> = ({ workspace, currentUserId }) => {
  const [messages, setMessages] = React.useState<Array<{
    id: string;
    content: string;
    type: 'user' | 'ai';
    timestamp: number;
  }>>([
    {
      id: 'welcome',
      content: "Hello! I'm MindSync AI, your intelligent assistant. I can help you with project management, task analysis, code reviews, documentation, and much more. How can I assist you today?",
      type: 'ai',
      timestamp: Date.now() - 60000
    }
  ]);
  
  const [inputMessage, setInputMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversationHistory, setConversationHistory] = React.useState<Array<{
    id: string;
    title: string;
    timestamp: number;
    messageCount: number;
  }>>([
    {
      id: 'conv-1',
      title: 'Project Planning Discussion',
      timestamp: Date.now() - 86400000,
      messageCount: 12
    },
    {
      id: 'conv-2',
      title: 'Code Review Questions',
      timestamp: Date.now() - 172800000,
      messageCount: 8
    },
    {
      id: 'conv-3',
      title: 'Task Optimization Tips',
      timestamp: Date.now() - 259200000,
      messageCount: 15
    }
  ]);
  
  const [activeConversation, setActiveConversation] = React.useState<string | null>(null);
  const [showSidebar, setShowSidebar] = React.useState(true);

  // Suggested prompts for quick start
  const suggestedPrompts = [
    "Analyze my current tasks and suggest optimizations",
    "Help me write better user stories for my project",
    "Review this code snippet for best practices",
    "Generate a project timeline based on my tasks",
    "Suggest team communication improvements",
    "Create documentation templates for my project"
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      type: 'user' as const,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call your AI service)
    setTimeout(() => {
      const aiResponse = {
        id: `ai-${Date.now()}`,
        content: generateAIResponse(userMessage.content),
        type: 'ai' as const,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  // Mock AI response generator (replace with actual AI service)
  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question! Based on your current project setup, I'd recommend focusing on breaking down larger tasks into smaller, manageable chunks. This approach typically improves team velocity by 30-40%.",
      
      "I can help you with that! Here's what I suggest:\n\n1. **Prioritize by impact**: Focus on high-impact, low-effort tasks first\n2. **Use time-boxing**: Allocate specific time slots for different types of work\n3. **Regular reviews**: Schedule weekly retrospectives to assess progress\n\nWould you like me to elaborate on any of these points?",
      
      "Excellent! Let me analyze your request. For project planning, I recommend using the SMART criteria:\n\n• **Specific**: Clearly defined objectives\n• **Measurable**: Quantifiable outcomes\n• **Achievable**: Realistic goals\n• **Relevant**: Aligned with business objectives\n• **Time-bound**: Clear deadlines\n\nThis framework has proven effective across various project types.",
      
      "Based on industry best practices and your project context, here are my recommendations:\n\n🎯 **Focus Areas:**\n- Streamline your current workflow\n- Improve team communication\n- Implement automated testing\n- Regular code reviews\n\nWould you like me to dive deeper into any of these areas?",
      
      "That's an insightful question! From what I can see in your workspace, you have several opportunities for optimization. Let me break this down into actionable steps that you can implement right away."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: 'welcome-new',
        content: "Hello! I'm ready to help you with a new conversation. What would you like to discuss?",
        type: 'ai',
        timestamp: Date.now()
      }
    ]);
    setActiveConversation(null);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!workspace) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h3 className="text-lg font-medium text-slate-100 mb-2">No workspace selected</h3>
          <p className="text-slate-400">Select a workspace to access MindSync AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">MindSync AI</h3>
                  <p className="text-xs text-slate-400">Always ready to help</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10"
              >
                <Layers className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              )}
              
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-1' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-slate-100 border border-white/10'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {currentUserId.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Suggested Prompts (show only if no messages except welcome) */}
          {messages.length <= 1 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Try asking me about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    className="text-left p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-slate-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask MindSync AI anything about your projects, tasks, or development..."
                rows={1}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400/40 resize-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            MindSync AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Conversation History */}
      {showSidebar && (
        <div className="w-80 border-l border-white/10 flex flex-col bg-white/5">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h2 className="text-lg font-semibold text-slate-100">MindSync AI</h2>
              </div>
              <button
                onClick={startNewConversation}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                title="New Conversation"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400">Your intelligent project assistant</p>
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Recent Conversations</h3>
              <div className="space-y-2">
                {conversationHistory.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeConversation === conv.id 
                        ? 'bg-cyan-500/10 border border-cyan-400/30' 
                        : 'hover:bg-white/5 border border-white/10'
                    }`}
                  >
                    <h4 className="font-medium text-slate-200 text-sm mb-1 truncate">{conv.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{conv.messageCount} messages</span>
                      <span className="text-xs text-slate-500">{formatTime(conv.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SIDEBAR (Projects only, inline rename + per-project menu)
// ============================================================================
const Sidebar: React.FC<{ workspace: Workspace | undefined; active: { projectId?: string; boardId?: string }; onSelectProject:(id:string)=>void; onAddProject:()=>void; onRenameProject:(id:string,newName:string)=>void; onAddBoard:(projectId:string)=>void; onDeleteProject:(id:string)=>void; onCollapse:()=>void; sidebarView: 'projects' | 'mytasks' | 'chat' | 'ai'; setSidebarView: (view: 'projects' | 'mytasks' | 'chat' | 'ai') => void; }> = ({ workspace, active, onSelectProject, onAddProject, onRenameProject, onAddBoard, onDeleteProject, onCollapse, sidebarView, setSidebarView }) => {
  if(!workspace) return <aside className="hidden w-64 shrink-0 md:block"/>;
  const projects = workspace.projects;
  const [menuFor,setMenuFor]=React.useState<string|null>(null);
  const [editingId,setEditingId]=React.useState<string|null>(null);
  const [editingValue,setEditingValue]=React.useState("");
  React.useEffect(()=>{ function onDoc(e:MouseEvent){ const t=e.target as HTMLElement; if(!t.closest('[data-project-row]')) setMenuFor(null);} document.addEventListener('mousedown',onDoc); return ()=>document.removeEventListener('mousedown',onDoc); },[]);
  const commitRename=()=>{ if(!editingId) return; const trimmed=editingValue.trim(); if(trimmed) onRenameProject(editingId, trimmed); setEditingId(null); };
  return (
    <aside className="hidden w-64 shrink-0 md:block border-r border-white/10 pr-2">
      <div className="sticky top-12 space-y-3">
        {/* Sidebar header with collapse control (outside cards) */}
        <div className="flex items-center justify-between px-3 py-6.5 mb-2">
          <button onClick={onCollapse} aria-label="Collapse sidebar" className="rounded-md p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">work options</span>
          <div className="w-8" />
        </div>

        {/* My Tasks Button */}
        <GlassCard className={`p-3 cursor-pointer transition-all ${
          sidebarView === 'mytasks' 
            ? 'ring-1 ring-cyan-400/40 bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' 
            : 'hover:bg-white/8'
        }`}>
          <button
            onClick={() => setSidebarView('mytasks')}
            className="w-full flex items-center gap-2 text-left"
          >
            <CheckSquare className={`h-4 w-4 ${
              sidebarView === 'mytasks' ? 'text-cyan-300' : 'text-slate-400'
            }`} />
            <span className={`font-medium text-sm ${
              sidebarView === 'mytasks' ? 'text-cyan-100' : 'text-slate-300'
            }`}>
              My Tasks
            </span>
          </button>
        </GlassCard>

        {/* Chat Button */}
        <GlassCard className={`p-3 cursor-pointer transition-all ${
          sidebarView === 'chat' 
            ? 'ring-1 ring-cyan-400/40 bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' 
            : 'hover:bg-white/8'
        }`}>
          <button
            onClick={() => setSidebarView('chat')}
            className="w-full flex items-center gap-2 text-left"
          >
            <MessageCircle className={`h-4 w-4 ${
              sidebarView === 'chat' ? 'text-cyan-300' : 'text-slate-400'
            }`} />
            <span className={`font-medium text-sm ${
              sidebarView === 'chat' ? 'text-cyan-100' : 'text-slate-300'
            }`}>
              Chat
            </span>
          </button>
        </GlassCard>

        {/* MindSync AI Button */}
        <GlassCard className={`p-3 cursor-pointer transition-all ${
          sidebarView === 'ai' 
            ? 'ring-1 ring-cyan-400/40 bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' 
            : 'hover:bg-white/8'
        }`}>
          <button
            onClick={() => setSidebarView('ai')}
            className="w-full flex items-center gap-2 text-left"
          >
            <div className={`h-4 w-4 rounded-full ${
              sidebarView === 'ai' ? 'bg-gradient-to-r from-cyan-400 to-purple-500' : 'bg-slate-400'
            } flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className={`font-medium text-sm ${
              sidebarView === 'ai' ? 'text-cyan-100' : 'text-slate-300'
            }`}>
              MindSync AI
            </span>
          </button>
        </GlassCard>

        <GlassCard className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Projects</div>
            <button onClick={onAddProject} className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10">+ New</button>
          </div>
          {projects.length===0 && <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-xs text-slate-500">No projects yet</div>}
          <div className="space-y-1">
            {projects.map(p=>{ const isActive=active.projectId===p.id; const open=menuFor===p.id; const isEditing=editingId===p.id; return (
              <div key={p.id} data-project-row className={`relative group flex items-center rounded-lg px-2 py-1.5 text-[13px] ${isActive?'bg-white/12 text-slate-100':'text-slate-300 hover:bg-white/6'}`}>
                {isEditing ? <input autoFocus value={editingValue} onChange={e=>setEditingValue(e.target.value)} onBlur={commitRename} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitRename(); } if(e.key==='Escape'){ e.preventDefault(); setEditingId(null); } }} className="mr-1 flex-1 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400/40"/> : <button className="flex-1 truncate text-left" onClick={()=>{onSelectProject(p.id); setSidebarView('projects');}} title={p.name}>{p.name}</button>}
                {!isEditing && <button onClick={(e)=>{ e.stopPropagation(); setMenuFor(m=>m===p.id?null:p.id); }} className="ml-2 rounded-md p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10"><Plus className="h-4 w-4"/></button>}
                {open && !isEditing && <div className="absolute right-0 top-8 z-40 w-40 rounded-xl border border-white/10 bg-[#141c24]/95 p-1 backdrop-blur-xl shadow-xl">
                  <button onClick={()=>{ setMenuFor(null); setEditingId(p.id); setEditingValue(p.name); }} className="w-full rounded-lg px-2 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10">Rename</button>
                  <button onClick={()=>{ setMenuFor(null); onAddBoard(p.id); }} className="w-full rounded-lg px-2 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10">Add Board</button>
                  <button onClick={()=>{ setMenuFor(null); onDeleteProject(p.id); }} className="w-full rounded-lg px-2 py-1.5 text-left text-[12px] text-rose-300 hover:bg-rose-500/20">Delete</button>
                </div>}
              </div> ); })}
          </div>
        </GlassCard>
      </div>
    </aside>
  );
};

// ============================================================================
// TOP BAR
// ============================================================================
const TopBar: React.FC<{ workspaces: Workspace[]; activeWsId: string; setActiveWsId:(id:string)=>void; onTogglePin:(id:string)=>void; projectName?: string; boardName?: string; onProjectHome?: () => void; onShowAllBoards?: () => void; onShowDashboard?: () => void; }> = ({ workspaces, activeWsId, setActiveWsId, onTogglePin, projectName, boardName, onProjectHome, onShowAllBoards, onShowDashboard }) => {
  
  return (
    <div className="sticky top-0 z-50">
      <div className="mx-auto -mb-4 max-w-7xl px-4">
        <div className="relative rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-2xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800" />
              <span className="hidden sm:block text-[13px] font-semibold tracking-wide text-slate-100">MindSync Work</span>
              <span className="mx-2 text-slate-600">•</span>
              <WorkspaceSwitcher workspaces={workspaces} activeId={activeWsId} onSelect={setActiveWsId} onCreate={()=> setShowCreateWs && setShowCreateWs(true)} onTogglePin={onTogglePin} />
              
              {projectName && (
                <>
                  <ChevronRight className="h-4 w-4 text-slate-600"/>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    <span>{projectName}</span>
                  </span>
                </>
              )}
              
              {boardName && (
                <>
                  <ChevronRight className="h-4 w-4 text-slate-600"/>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 flex items-center gap-1">
                    <span>{boardName}</span>
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-400">
                <Search className="h-4 w-4"/>
                <input placeholder="Search tasks..." className="w-40 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"/>
              </div>
              <SoftButton className="p-2" title="Notifications">
                <Bell className="h-4 w-4 text-slate-300"/>
              </SoftButton>
              <SoftButton className="text-xs">
                <Plus className="mr-1 inline h-3.5 w-3.5"/> New
              </SoftButton>
            </div>
          </div>
          
          {/* Navigation Options Row */}
          {projectName && (
            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={onShowDashboard}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors"
              >
                <BarChart3 className="h-3 w-3" />
                Dashboard
              </button>
              <button 
                onClick={onProjectHome}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Home className="h-3 w-3" />
                Project Home
              </button>
              <button 
                onClick={onShowAllBoards}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Layers className="h-3 w-3" />
                Boards
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BOARD SCREEN (secondary nav: board selector + view type pills)
// ============================================================================
const BoardScreen: React.FC<{ board: Board; boards: Board[]; onSelectBoard:(id:string)=>void; onAddBoard:()=>void; pinnedIds:string[]; onTogglePin:(id:string)=>void; onRenameBoard:(id:string,newName:string)=>void; onDeleteBoard:(id:string)=>void; }> = ({ board, boards, onSelectBoard, onAddBoard, pinnedIds, onTogglePin, onRenameBoard, onDeleteBoard }) => {
  const [openViews,setOpenViews]=React.useState(false);
  const [viewType,setViewType]=React.useState<'kanban'|'table'|'calendar'|'gantt'|'timeline'>('kanban');
  const [kanbanBoards,setKanbanBoards]=React.useState<Record<string, KanbanBoardData>>({});
  const [addingGroup,setAddingGroup]=React.useState(false);
  const [groupName,setGroupName]=React.useState("");
  const [devCustomFields,setDevCustomFields]=React.useState<Record<string, Record<string,string[]>>>({});
  const [showAllBoards,setShowAllBoards]=React.useState(false);
  const [boardSearch,setBoardSearch]=React.useState("");
  const [menuBoardId,setMenuBoardId]=React.useState<string|null>(null);
  const [editingBoardId,setEditingBoardId]=React.useState<string|null>(null);
  const [boardNameDraft,setBoardNameDraft]=React.useState("");
  const [menuPos,setMenuPos]=React.useState<{x:number;y:number}|null>(null);
  
  // Subtask modal state (shared between kanban and table views)
  const [subtaskModal, setSubtaskModal] = React.useState<{
    open: boolean;
    mode: 'edit';
    column: string;
    parentTask?: DevKanbanTask;
    subtask?: DevKanbanTask;
  }>({ open: false, mode: 'edit', column: '' });
  
  React.useEffect(()=>{ setMenuBoardId(null); setEditingBoardId(null); },[board.id]);
  React.useEffect(()=>{ setKanbanBoards(prev=> prev[board.id]? prev : { ...prev, [board.id]: createInitialKanbanData() }); },[board.id]);
  
  // If Development board, ensure dev column set present & transformed once
  React.useEffect(()=>{
    if(board.name!== 'Development') return;
    setKanbanBoards(prev => {
      const existing = prev[board.id];
      if(existing && existing.order.includes('Ready for QA')) return prev; // already transformed
      const base = existing || createInitialKanbanData();
      const devOrder = ['Backlog','To Do','In Progress','In Review','Ready for QA','Done'];
      const mapCols: Record<string,string> = { 'Todo':'To Do', 'Review':'In Review' };
      const newCols: Record<string, KanbanTask[]> = {};
      devOrder.forEach(k => { newCols[k] = []; });
      base.order.forEach(k => {
        const target = mapCols[k] || k;
        if(!newCols[target]) newCols[target]=[];
        newCols[target].push(...base.columns[k].map(t => ({ ...t, createdAt: Date.now(), priority:'Medium', type: (t.tags||[]).includes('bug')? 'Bug':'Task' }) as any));
      });
      return { ...prev, [board.id]: { order: devOrder, columns: newCols } };
    });
  },[board.id, board.name]);
  
  React.useEffect(()=>{ function onKey(e:KeyboardEvent){ if(e.key==='b' && (e.metaKey||e.ctrlKey)) { e.preventDefault(); setShowAllBoards(true); } } window.addEventListener('keydown',onKey); return ()=> window.removeEventListener('keydown',onKey); },[]);
  React.useEffect(()=>{ function onDoc(e:MouseEvent){ const t=e.target as HTMLElement; if(!t.closest('[data-board-menu]') && !t.closest('[data-board-menu-trigger]')) { setMenuBoardId(null); setMenuPos(null);} } document.addEventListener('mousedown',onDoc); return ()=>document.removeEventListener('mousedown',onDoc); },[]);
  
  const data = kanbanBoards[board.id];
  const addGroup = (name:string)=> { setKanbanBoards(prev => { const cur = prev[board.id]; if(!cur) return prev; let final=name; let i=2; while(cur.columns[final]) final = `${name}-${i++}`; return { ...prev, [board.id]: { order:[...cur.order, final], columns:{ ...cur.columns, [final]: [] } } }; }); };
  const commitGroup=()=>{ const n=groupName.trim(); if(!n){ setAddingGroup(false); setGroupName(""); return; } addGroup(n); setGroupName(""); setAddingGroup(false); };
  
  const updateTaskField = (col:string, taskId:string, field:string, value:string)=> {
    setKanbanBoards(prev => {
      const cur = prev[board.id]; if(!cur) return prev; if(!cur.columns[col]) return prev;
      return { ...prev, [board.id]: { ...cur, columns: { ...cur.columns, [col]: cur.columns[col].map(t => t.id===taskId? { ...(t as DevKanbanTask), custom: { ...(t as DevKanbanTask).custom, [field]: value } }: t) } } };
    });
  };
  
  const updateTaskCore = (col:string, taskId:string, patch:Partial<DevKanbanTask>) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id]; if(!cur) return prev; if(!cur.columns[col]) return prev;
      return { ...prev, [board.id]: { ...cur, columns: { ...cur.columns, [col]: cur.columns[col].map(t => t.id===taskId? { ...(t as DevKanbanTask), ...patch }: t) } } };
    });
  };

  // Subtask management functions
  const addSubtask = (col: string, parentTaskId: string, subtaskTitle: string) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id]; 
      if (!cur || !cur.columns[col]) return prev;
      
      const newSubtask: DevKanbanTask = {
        id: `st_${Math.random().toString(36).slice(2,8)}`,
        title: subtaskTitle || 'New Subtask',
        tags: [],
        labels: [],
        assignees: [],
        points: 1,
        priority: 'Medium',
        type: 'Task',
        createdAt: Date.now(),
        parentTaskId: parentTaskId,
        isSubtask: true,
        subtasks: []
      };

      return {
        ...prev,
        [board.id]: {
          ...cur,
          columns: {
            ...cur.columns,
            [col]: cur.columns[col].map(t => 
              t.id === parentTaskId 
                ? { ...(t as DevKanbanTask), subtasks: [...((t as DevKanbanTask).subtasks || []), newSubtask] }
                : t
            )
          }
        }
      };
    });
  };

  const updateSubtask = (col: string, parentTaskId: string, subtaskId: string, patch: Partial<DevKanbanTask>) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id];
      if (!cur || !cur.columns[col]) return prev;
      
      return {
        ...prev,
        [board.id]: {
          ...cur,
          columns: {
            ...cur.columns,
            [col]: cur.columns[col].map(t => 
              t.id === parentTaskId 
                ? { 
                    ...(t as DevKanbanTask), 
                    subtasks: ((t as DevKanbanTask).subtasks || []).map(st => 
                      st.id === subtaskId ? { ...st, ...patch } : st
                    )
                  }
                : t
            )
          }
        }
      };
    });
  };

  const deleteSubtask = (col: string, parentTaskId: string, subtaskId: string) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id];
      if (!cur || !cur.columns[col]) return prev;
      
      return {
        ...prev,
        [board.id]: {
          ...cur,
          columns: {
            ...cur.columns,
            [col]: cur.columns[col].map(t => 
              t.id === parentTaskId 
                ? { 
                    ...(t as DevKanbanTask), 
                    subtasks: ((t as DevKanbanTask).subtasks || []).filter(st => st.id !== subtaskId)
                  }
                : t
            )
          }
        }
      };
    });
  };

  // Calculate subtask progress for a task
  const getSubtaskProgress = (task: DevKanbanTask) => {
    const subtasks = task.subtasks || [];
    if (subtasks.length === 0) return null;
    
    // In a real app, you'd check the status of subtasks
    // For now, let's simulate some completed subtasks
    const completedCount = subtasks.filter(st => st.custom?.status === 'done').length;
    return {
      completed: completedCount,
      total: subtasks.length,
      percentage: Math.round((completedCount / subtasks.length) * 100)
    };
  };
  
  const viewLabel = viewType.charAt(0).toUpperCase()+viewType.slice(1);
  const pinnedSet = new Set(pinnedIds);
  const pinnedBoards = boards.filter(b=> pinnedSet.has(b.id));
  const unpinnedBoards = boards.filter(b=> !pinnedSet.has(b.id));
  
  // Show max 3 boards: pinned first, then unpinned to fill up to 3
  const displayBoards = [...pinnedBoards];
  const remainingSlots = 3 - pinnedBoards.length;
  if (remainingSlots > 0) {
    // Add unpinned boards to fill remaining slots, prioritizing active board
    const activeUnpinned = unpinnedBoards.find(b => b.id === board.id);
    const otherUnpinned = unpinnedBoards.filter(b => b.id !== board.id);
    
    if (activeUnpinned && !pinnedSet.has(board.id)) {
      displayBoards.push(activeUnpinned);
      displayBoards.push(...otherUnpinned.slice(0, remainingSlots - 1));
    } else {
      displayBoards.push(...otherUnpinned.slice(0, remainingSlots));
    }
  }
  
  const filteredBoards = boards.filter(b=> !boardSearch.trim() || b.name.toLowerCase().includes(boardSearch.toLowerCase()));
  const startRename=(id:string,name:string)=>{ setEditingBoardId(id); setBoardNameDraft(name); setMenuBoardId(null); setTimeout(()=>{ const el=document.getElementById('board-rename-input'); el && (el as HTMLInputElement).focus();},0); };
  const commitRename=()=>{ if(!editingBoardId) return; const nm=boardNameDraft.trim(); if(nm) onRenameBoard(editingBoardId,nm); setEditingBoardId(null); };
  const menuBoard = boards.find(b=> b.id===menuBoardId) || null;
  
  // Clear menu state if selected board no longer exists (e.g. deleted or list re-render)
  React.useEffect(()=> {
    if(menuBoardId && !boards.some(b=> b.id===menuBoardId)) { setMenuBoardId(null); setMenuPos(null); }
  },[menuBoardId, boards]);
  
  // Add task helper shared by Kanban & Table views
  const addTask = React.useCallback((col:string) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id];
      if(!cur || !cur.columns[col]) return prev;
      const customFields = devCustomFields[board.id]?.[col] || [];
      const custom: Record<string,string> = {};
      customFields.forEach((f:string)=> custom[f]="");
      const newTask: DevKanbanTask = { id: 't_'+Math.random().toString(36).slice(2,8), title: 'New Task', tags: [], labels: [], assignees: [], points: 1, priority:'Medium', type:'Task', createdAt: Date.now(), custom };
      if(col==='In Progress') newTask.startedAt = Date.now();
      return { ...prev, [board.id]: { ...cur, columns: { ...cur.columns, [col]: [...cur.columns[col], newTask] } } };
    });
  },[board.id, devCustomFields]);
  
  // Task modal state & handlers
  const [taskModal, setTaskModal] = React.useState<{open: boolean; mode: 'new'|'edit'; col: string; task?: KanbanTask}>({open: false, mode: 'new', col: ''});
  const openNewTaskModal = (col: string) => setTaskModal({open: true, mode: 'new', col});
  const openEditTaskModal = (col: string, task: KanbanTask) => setTaskModal({open: true, mode: 'edit', col, task});
  const closeTaskModal = () => setTaskModal(m => ({...m, open: false}));
  
  const saveTaskModal = (patch: any) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id];
      if (!cur) return prev;
      
      if (taskModal.mode === 'new') {
        const isDev = board.name === 'Development';
        const newTask: any = { 
          id: 't' + Math.random().toString(36).slice(2,8), 
          title: patch.title || 'Untitled', 
          tags: isDev ? [] : (patch.tags || []),
          labels: isDev ? (patch.labels || []) : [],
          assignees: patch.assignees || [], 
          points: patch.points ?? 1,
          createdAt: Date.now()
        };
        
        // Add dev-specific fields if it's a development board
        if (isDev) {
          newTask.type = patch.type || 'Task';
          newTask.priority = patch.priority || 'Medium';
          newTask.sprint = patch.sprint;
          newTask.due = patch.due;
        }
        
        return {
          ...prev,
          [board.id]: {
            ...cur,
            columns: {
              ...cur.columns,
              [taskModal.col]: [...cur.columns[taskModal.col], newTask]
            }
          }
        };
      } else if (taskModal.mode === 'edit' && taskModal.task) {
        return {
          ...prev,
          [board.id]: {
            ...cur,
            columns: {
              ...cur.columns,
              [taskModal.col]: cur.columns[taskModal.col].map(t => t.id === taskModal.task!.id ? {...t, ...patch} : t)
            }
          }
        };
      }
      return prev;
    });
  };

  // Subtask modal functions (shared between kanban and table views)
  const openSubtaskModal = (col: string, parentTask: DevKanbanTask, subtask: DevKanbanTask) => {
    setSubtaskModal({
      open: true,
      mode: 'edit',
      column: col,
      parentTask,
      subtask
    });
  };

  const closeSubtaskModal = () => {
    setSubtaskModal(prev => ({ ...prev, open: false }));
  };

  const saveSubtaskModal = (patch: Partial<DevKanbanTask>) => {
    if (subtaskModal.subtask && subtaskModal.parentTask) {
      updateSubtask(subtaskModal.column, subtaskModal.parentTask.id, subtaskModal.subtask.id, patch);
    }
  };

  // Drag and drop functionality
  const moveTask = (taskId: string, fromCol: string, toCol: string) => {
    setKanbanBoards(prev => {
      const cur = prev[board.id];
      if (!cur || !cur.columns[fromCol] || !cur.columns[toCol]) return prev;
      
      const taskIdx = cur.columns[fromCol].findIndex(t => t.id === taskId);
      if (taskIdx === -1) return prev;
      
      const task = cur.columns[fromCol][taskIdx];
      let updatedTask = { ...task };
      
      // Add timestamp when moving to "In Progress"
      if (toCol === 'In Progress' && !(updatedTask as any).startedAt) {
        (updatedTask as any).startedAt = Date.now();
      }
      
      const newSource = cur.columns[fromCol].filter(t => t.id !== taskId);
      const newTarget = [...cur.columns[toCol], updatedTask];
      
      return {
        ...prev,
        [board.id]: {
          ...cur,
          columns: {
            ...cur.columns,
            [fromCol]: newSource,
            [toCol]: newTarget
          }
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Board navigation and view selector */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex items-center gap-2 overflow-x-auto max-w-full py-1 pl-1 pr-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 shrink-0">Boards:</span>
          <div className="flex items-center gap-1">
            {displayBoards.map(b => {
              const editing = editingBoardId===b.id; const isActive = b.id===board.id; return (
              <div key={b.id} className="relative group">
                {editing ? (
                  <input id="board-rename-input" value={boardNameDraft} onChange={e=>setBoardNameDraft(e.target.value)} onBlur={commitRename} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitRename(); } if(e.key==='Escape'){ e.preventDefault(); setEditingBoardId(null); } }} className="rounded-lg px-3 py-1.5 text-[12px] font-medium bg-white/10 border border-cyan-400/40 text-cyan-100 outline-none w-32" />
                ) : (
                  <button onClick={()=> onSelectBoard(b.id)} className={`relative rounded-lg px-3 py-1.5 text-[12px] font-medium transition group ${isActive? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]':'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-slate-200'}`} title={b.name}>
                    {b.name}
                    {isActive && <span className="absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"/>}
                    {pinnedSet.has(b.id) && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" title="Pinned"/>}
                  </button>
                )}
                {!editing && (
                  <button
                    data-board-menu-trigger
                    onClick={(e)=> {
                      e.stopPropagation();
                      if(menuBoardId === b.id) { setMenuBoardId(null); setMenuPos(null); return; }
                      const btn = e.currentTarget as HTMLElement | null;
                      if(!btn) return;
                      const r = btn.getBoundingClientRect();
                      setMenuPos({ x: Math.min(r.left, window.innerWidth-240), y: r.bottom });
                      setMenuBoardId(b.id);
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-[#0d141b] border border-white/10 p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 opacity-0 scale-90 pointer-events-none transition group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                    title="Board actions"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5"/>
                  </button>
                )}
              </div> ); })}
            <button onClick={()=> setShowAllBoards(true)} className="rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10">All Boards</button>
          </div>
        </div>
        
        {/* View selector dropdown */}
        <div className="relative">
          <SoftButton onClick={()=>setOpenViews(o=>!o)} className="gap-2">
            <span className="text-xs font-medium text-slate-100">{viewLabel} View</span>
            <ChevronDown className="h-4 w-4 text-slate-400"/>
          </SoftButton>
          {openViews && (
            <div className="absolute z-40 mt-2 w-48 rounded-xl border border-white/10 bg-[#111a23]/95 p-2 backdrop-blur-xl shadow-xl">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Views</div>
              {(['kanban','table','calendar','gantt','timeline'] as const).map(v => (
                <button key={v} onClick={()=>{ setViewType(v); setOpenViews(false); }} className={`w-full rounded-lg px-2 py-1.5 text-left text-[12px] ${viewType===v? 'bg-white/12 text-slate-100':'text-slate-300 hover:bg-white/6 hover:text-slate-200'}`}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>
              ))}
            </div>
          )}
        </div>
        
        {/* Add Group control + Add Board */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SoftButton onClick={()=> setAddingGroup(a=>!a)} className="text-xs">+ Group</SoftButton>
            {addingGroup && (
              <div className="absolute z-40 mt-2 w-60 rounded-xl border border-white/10 bg-[#111a23]/95 p-3 backdrop-blur-xl shadow-xl">
                <input value={groupName} onChange={e=>setGroupName(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitGroup(); } if(e.key==='Escape'){ e.preventDefault(); setAddingGroup(false); setGroupName(""); } }} placeholder="Group name" className="mb-3 w-full rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400/40" />
                <div className="flex gap-2">
                  <SoftButton onClick={commitGroup} className="text-xs px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200">Add</SoftButton>
                  <SoftButton onClick={()=>{ setAddingGroup(false); setGroupName(""); }} className="text-xs px-3 py-1">Cancel</SoftButton>
                </div>
              </div>
            )}
          </div>
          <SoftButton onClick={onAddBoard} className="text-xs">+ Board</SoftButton>
        </div>
      </div>

      {/* All Boards Popover */}
      {showAllBoards && (
        <div className="relative z-50">
          <div className="fixed inset-0 z-40" onClick={()=> setShowAllBoards(false)} />
          <div className="absolute z-50 mt-2 w-[420px] rounded-2xl border border-white/10 bg-[#101820]/95 p-3 backdrop-blur-2xl shadow-2xl">
            <div className="mb-2 flex items-center gap-2">
              <input autoFocus value={boardSearch} onChange={e=>setBoardSearch(e.target.value)} placeholder="Search boards (Ctrl/Cmd+B)" className="flex-1 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40" />
              <SoftButton onClick={()=> setShowAllBoards(false)} className="text-[11px] px-2 py-1">Close</SoftButton>
            </div>
            <div className="max-h-72 overflow-auto pr-1 space-y-1">
              {filteredBoards.map(b => {
                const pinned = pinnedSet.has(b.id); const activeCls = b.id===board.id? 'bg-cyan-500/15 ring-1 ring-cyan-400/40':'hover:bg-white/5';
                return (
                  <div key={b.id} className={`group flex items-center justify-between rounded-xl px-2 py-2 text-[13px] ${activeCls} transition`}> 
                    <button onClick={()=>{ onSelectBoard(b.id); setShowAllBoards(false); }} className="flex-1 text-left truncate text-slate-200">{b.name}</button>
                    <div className="flex items-center gap-1">
                      <button onClick={()=> startRename(b.id,b.name)} className="rounded-md p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 text-[10px]">Ren</button>
                      <button onClick={()=> { if(window.confirm('Delete this board?')) { onDeleteBoard(b.id); } }} className="rounded-md p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-[10px]">Del</button>
                      <button onClick={()=> onTogglePin(b.id)} className="rounded-md p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10" title={pinned? 'Unpin':'Pin'}>{pinned? <Star className="h-4 w-4 text-amber-400"/>: <StarOff className="h-4 w-4"/>}</button>
                    </div>
                  </div>
                );
              })}
              {filteredBoards.length===0 && <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-xs text-slate-400">No boards match.</div>}
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-slate-500">{boards.length} boards</span>
              <SoftButton onClick={()=>{ onAddBoard(); setTimeout(()=>{ setShowAllBoards(false); },0); }} className="text-xs">+ New Board</SoftButton>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating board menu via portal (outside scroll clipping) */}
      {menuBoardId && menuPos && menuBoard && createPortal(
        <div
          data-board-menu
          style={{ position:'fixed', left: menuPos.x, top: menuPos.y + 8, zIndex: 1000 }}
          className="w-56 rounded-xl border border-white/10 bg-[#111a23]/95 p-1 backdrop-blur-xl shadow-2xl"
        >
          <div className="px-2 py-1 text-[11px] font-medium text-slate-400 truncate">{menuBoard.name}</div>
          <button onClick={()=>{ startRename(menuBoard.id, menuBoard.name); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10">Rename</button>
          <button onClick={()=>{ onTogglePin(menuBoard.id); setMenuBoardId(null); setMenuPos(null); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-slate-300 hover:bg-white/10">{pinnedSet.has(menuBoard.id)? 'Unpin':'Pin'}</button>
          <button onClick={()=>{ if(window.confirm('Delete this board?')) { onDeleteBoard(menuBoard.id); } setMenuBoardId(null); setMenuPos(null); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-rose-300 hover:bg-rose-500/20">Delete</button>
        </div>,
        document.body
      )}
      
      {/* View Content */}
      {viewType==='kanban' && data && (
        <GlassCard className="p-6 overflow-hidden">
          {board.name==='Development' ? 
            <DevKanban 
              data={data} 
              onAddTaskViaModal={openNewTaskModal} 
              onOpenEdit={openEditTaskModal} 
              onMoveTask={moveTask}
              onAddSubtask={addSubtask}
              onUpdateSubtask={updateSubtask}
              onDeleteSubtask={deleteSubtask}
              onOpenSubtaskModal={openSubtaskModal}
            /> : 
            <BoardKanban data={data} onAddTaskViaModal={openNewTaskModal} onOpenEdit={openEditTaskModal} onMoveTask={moveTask} />
          }
        </GlassCard>
      )}
      {viewType==='table' && data && <BoardTableView 
        data={data} 
        onAddTask={addTask} 
        onMoveTask={moveTask} 
        onUpdateField={updateTaskField} 
        onUpdateCore={updateTaskCore}
        customFieldsMap={devCustomFields[board.id]||{}}
        onAddField={(phase: string, name: string) => setDevCustomFields(prev => { 
          const cur = prev[board.id] || {}; 
          const list = cur[phase] || []; 
          if(list.includes(name)) return prev; 
          return { ...prev, [board.id]: { ...cur, [phase]: [...list, name] } }; 
        })}
        onAddSubtask={addSubtask}
        onUpdateSubtask={updateSubtask}
        onDeleteSubtask={deleteSubtask}
        onOpenSubtaskModal={openSubtaskModal}
      />}
      {viewType==='calendar' && data && <CalendarView data={data} onAddTask={addTask} onEditTask={(col: string, taskId: string) => {
        const task = data.columns[col]?.find(t => t.id === taskId);
        if (task) openEditTaskModal(col, task);
      }} />}
      {viewType==='gantt' && data && <GanttView data={data} onAddTask={addTask} onEditTask={(col: string, taskId: string) => {
        const task = data.columns[col]?.find(t => t.id === taskId);
        if (task) openEditTaskModal(col, task);
      }} />}
      {viewType==='timeline' && data && <TimelineView data={data} onAddTask={addTask} onEditTask={(col: string, taskId: string) => {
        const task = data.columns[col]?.find(t => t.id === taskId);
        if (task) openEditTaskModal(col, task);
      }} />}
      
      {/* Task Editor Modal */}
      <TaskEditorModal
        open={taskModal.open}
        mode={taskModal.mode}
        column={taskModal.col}
        task={taskModal.task}
        isDev={board.name==='Development'}
        onClose={closeTaskModal}
        onSave={(patch: any)=> { saveTaskModal(patch); closeTaskModal(); }}
      />
      
      {/* Subtask Editor Modal */}
      <SubtaskEditorModal
        open={subtaskModal.open}
        mode={subtaskModal.mode}
        column={subtaskModal.column}
        parentTask={subtaskModal.parentTask}
        subtask={subtaskModal.subtask}
        onClose={closeSubtaskModal}
        onSave={(patch: any) => { saveSubtaskModal(patch); closeSubtaskModal(); }}
        onDelete={() => {
          if (subtaskModal.subtask && subtaskModal.parentTask) {
            deleteSubtask(subtaskModal.column, subtaskModal.parentTask.id, subtaskModal.subtask.id);
            closeSubtaskModal();
          }
        }}
      />
    </div>
  );
};

// Comment interface for tasks and subtasks
interface TaskComment {
  id: string;
  author: string; // user id
  content: string;
  createdAt: number; // epoch ms
  updatedAt?: number; // epoch ms if edited
  isEdited?: boolean;
}

// Development task extensions (non-breaking optional fields)
type DevKanbanTask = KanbanTask & {
  type?: 'Story'|'Task'|'Bug'|'Spike';
  priority?: 'High'|'Medium'|'Low';
  severity?: 'High'|'Medium'|'Low'; // for bugs
  labels?: string[]; // replaces tags gradually
  reporter?: string; // user id
  createdAt?: number; // epoch ms
  epicId?: string;
  sprint?: string;
  due?: string; // ISO or short
  branch?: string;
  prLink?: string;
  ciStatus?: 'pass'|'fail'|'pending';
  startedAt?: number;
  reviewer?: string;
  approvals?: number;
  changesRequested?: boolean;
  createdInReviewAt?: number;
  buildEnv?: string;
  testSuite?: string;
  qaTicketId?: string;
  qaAssignee?: string;
  risk?: 'High'|'Medium'|'Low';
  deployedAt?: number;
  release?: string;
  cycleTime?: number; // ms
  closedBy?: string;
  custom?: Record<string,string>; // dynamic table fields
  parentTaskId?: string; // For subtasks - references parent task
  subtasks?: DevKanbanTask[]; // Array of subtasks
  isSubtask?: boolean; // Flag to identify if this is a subtask
  comments?: TaskComment[]; // Comments for the task/subtask
};

// Standard Kanban component for non-dev boards
const BoardKanban: React.FC<{ data: KanbanBoardData; onAddTaskViaModal:(col:string)=>void; onOpenEdit:(col:string, task:KanbanTask)=>void; onMoveTask:(taskId:string, fromCol:string, toCol:string, newIndex?:number)=>void }> = ({ data, onAddTaskViaModal, onOpenEdit, onMoveTask }) => {
  const [draggedTask, setDraggedTask] = React.useState<{id:string; col:string} | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, task: KanbanTask, col: string) => {
    setDraggedTask({id: task.id, col});
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(col);
  };

  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = (e: React.DragEvent, toCol: string) => {
    e.preventDefault();
    if (!draggedTask) return;
    if (draggedTask.col !== toCol) {
      onMoveTask(draggedTask.id, draggedTask.col, toCol);
    }
    setDraggedTask(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
  };

  return (
    <div className="overflow-x-auto pb-2 w-full">
      <div className="flex items-start gap-4" style={{ minWidth: 'fit-content' }}>
        {data.order.map(col => (
          <div
            key={col}
            className={`rounded-xl border p-4 transition w-64 shrink-0 ${
              dragOverCol === col ? 'border-cyan-400/60 bg-cyan-500/10 ring-1 ring-cyan-400/30' : 'border-white/10 bg-white/5'
            }`}
            onDragOver={(e) => handleDragOver(e, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">{col}</h3>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">{data.columns[col]?.length || 0}</span>
                <SoftButton onClick={() => onAddTaskViaModal(col)} className="p-1">
                  <Plus className="h-4 w-4" />
                </SoftButton>
              </div>
            </div>
            <div className="space-y-3">
              {(data.columns[col] || []).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, col)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onOpenEdit(col, task)}
                  className={`cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 ${
                    draggedTask?.id === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="mb-2 font-medium text-slate-100">{task.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {task.tags?.map((tag, i) => (
                      <span key={i} className="rounded bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Assignees ids={task.assignees || []} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dev-specific Kanban component
const DevKanban: React.FC<{ 
  data: KanbanBoardData; 
  onAddTaskViaModal:(col:string)=>void; 
  onOpenEdit:(col:string, task:KanbanTask)=>void; 
  onMoveTask:(taskId:string, fromCol:string, toCol:string, newIndex?:number)=>void;
  onAddSubtask?: (col: string, parentTaskId: string, subtaskTitle: string) => void;
  onUpdateSubtask?: (col: string, parentTaskId: string, subtaskId: string, patch: Partial<DevKanbanTask>) => void;
  onDeleteSubtask?: (col: string, parentTaskId: string, subtaskId: string) => void;
  onOpenSubtaskModal?: (col: string, parentTask: DevKanbanTask, subtask: DevKanbanTask) => void;
}> = ({ data, onAddTaskViaModal, onOpenEdit, onMoveTask, onAddSubtask, onUpdateSubtask, onDeleteSubtask, onOpenSubtaskModal }) => {
  const [draggedTask, setDraggedTask] = React.useState<{id:string; col:string; isSubtask?: boolean; parentId?: string} | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);
  const [isDraggingSubtask, setIsDraggingSubtask] = React.useState(false);

  const handleDragStart = (e: React.DragEvent, task: KanbanTask, col: string, isSubtask = false, parentId?: string) => {
    console.log('🎯 Drag start:', { taskId: task.id, isSubtask, parentId, col });
    
    setDraggedTask({id: task.id, col, isSubtask, parentId});
    setIsDraggingSubtask(isSubtask);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    
    if (isSubtask) {
      e.stopPropagation();
    }
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(col);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    if (draggedTask) {
      console.log('Drop triggered:', { draggedTask, targetCol });
      if (draggedTask.isSubtask && draggedTask.parentId) {
        // For subtasks, we need to update the subtask's status
        console.log('Dropping subtask');
        if (onUpdateSubtask) {
          const statusMap: { [key: string]: string } = {
            'Backlog': 'todo',
            'To Do': 'todo',
            'In Progress': 'in-progress', 
            'In Review': 'review',
            'Ready for QA': 'qa',
            'Done': 'done'
          };
          const newStatus = statusMap[targetCol] || 'todo';
          console.log('Updating subtask status:', { 
            col: draggedTask.col, 
            parentId: draggedTask.parentId, 
            subtaskId: draggedTask.id, 
            newStatus 
          });
          onUpdateSubtask(draggedTask.col, draggedTask.parentId, draggedTask.id, { 
            custom: { status: newStatus } 
          });
        } else {
          console.log('onUpdateSubtask not available');
        }
      } else {
        // For main tasks, use the existing move function
        console.log('Dropping main task');
        onMoveTask(draggedTask.id, draggedTask.col, targetCol);
      }
    }
    setDraggedTask(null);
    setDragOverCol(null);
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-4 min-w-max">
        {data.order.map(c => (
          <GlassCard 
            key={c} 
            className={`p-3 w-64 shrink-0 transition-all ${dragOverCol === c ? 'ring-2 ring-cyan-400/40 bg-cyan-500/5' : ''}`}
            onDragOver={(e) => handleDragOver(e, c)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, c)}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-100 truncate max-w-[140px]" title={c}>{c}</span><Pill tone={c==='Done'? 'green': c==='Review'? 'amber': c==='Ready for QA'? 'purple':'neutral'}>{data.columns[c].length}</Pill></div>
              <SoftButton onClick={()=> onAddTaskViaModal(c)} className="text-xs px-2 py-1">Add</SoftButton>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {data.columns[c].map(t => {
                const dt = t as DevKanbanTask;
                const isDragging = draggedTask?.id === t.id;
                const subtasks = dt.subtasks || [];
                const completedSubtasks = subtasks.filter(st => st.custom?.status === 'done').length;
                const hasSubtasks = subtasks.length > 0;
                
                return (
                  <div key={t.id} className="space-y-2">
                    {/* Main Task Card */}
                    <FrostItem 
                      className={`p-2.5 cursor-pointer hover:ring-1 hover:ring-cyan-400/30 transition-all ${isDragging && !draggedTask?.isSubtask ? 'opacity-50 transform rotate-1 scale-105' : ''} ${isDraggingSubtask ? 'pointer-events-none' : ''}`}
                      draggable={!isDraggingSubtask}
                      onDragStart={(e) => {
                        // Only allow main task drag if no subtask is being dragged
                        if (isDraggingSubtask) {
                          e.preventDefault();
                          return;
                        }
                        handleDragStart(e, t, c);
                      }}
                      onDragEnd={() => {
                        setDraggedTask(null); 
                        setDragOverCol(null);
                        setIsDraggingSubtask(false);
                      }}
                      onClick={()=> onOpenEdit(c,t)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium text-slate-100 leading-snug truncate max-w-[140px]" title={t.title}>{t.title}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(dt.labels||t.tags||[]).slice(0,4).map(tag => <Pill key={tag} tone={tag==='bug'||dt.type==='Bug'?'red': tag==='devops'?'purple':'blue'}>{tag}</Pill>)}
                            {dt.priority && <Pill tone={dt.priority==='High'?'red': dt.priority==='Medium'?'amber':'neutral'}>{dt.priority[0]}</Pill>}
                          </div>
                          {/* Subtask Progress */}
                          {hasSubtasks && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span>{completedSubtasks}/{subtasks.length} subtasks</span>
                                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                  <div 
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all" 
                                    style={{width: `${subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0}%`}}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <Assignees ids={t.assignees} />
                      </div>
                      {dt.startedAt && <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1"><Activity className="h-3.5 w-3.5"/>Started {new Date(dt.startedAt).toLocaleDateString()}</div>}
                      <div className="mt-1 text-[9px] text-slate-500">(Drag to move • Click to edit)</div>
                    </FrostItem>
                    
                    {/* Subtask Cards */}
                    {hasSubtasks && (
                      <div className="ml-4 space-y-1.5">
                        {subtasks.map(subtask => (
                          <div 
                            key={subtask.id}
                            className={`bg-white/5 border border-white/10 rounded-lg p-2 text-xs hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing ${
                              draggedTask?.id === subtask.id && draggedTask?.isSubtask ? 'opacity-50 transform rotate-1 scale-105 ring-2 ring-cyan-400/50' : ''
                            }`}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              console.log('=== SUBTASK DRAG START ===');
                              console.log('Subtask ID:', subtask.id);
                              console.log('Parent task ID:', t.id);
                              console.log('Column:', c);
                              handleDragStart(e, subtask, c, true, t.id);
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation();
                              console.log('🔚 Subtask drag end');
                              setDraggedTask(null); 
                              setDragOverCol(null);
                              setIsDraggingSubtask(false);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Check if clicked on checkbox area
                              const clickedElement = e.target as HTMLElement;
                              const isCheckboxClick = clickedElement.closest('.subtask-checkbox') !== null;
                              
                              if (isCheckboxClick && onUpdateSubtask) {
                                const newStatus = subtask.custom?.status === 'done' ? 'todo' : 'done';
                                onUpdateSubtask(c, t.id, subtask.id, { 
                                  custom: { ...subtask.custom, status: newStatus } 
                                });
                              } else {
                                // Open edit modal
                                onOpenSubtaskModal && onOpenSubtaskModal(c, t as DevKanbanTask, subtask);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-slate-600 hover:text-slate-400 transition-colors">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                                  <circle cx="2" cy="2" r="0.5"/>
                                  <circle cx="6" cy="2" r="0.5"/>
                                  <circle cx="2" cy="6" r="0.5"/>
                                  <circle cx="6" cy="6" r="0.5"/>
                                </svg>
                              </div>
                              <div className={`subtask-checkbox w-3 h-3 rounded border transition-colors ${
                                subtask.custom?.status === 'done' 
                                  ? 'bg-emerald-500 border-emerald-500' 
                                  : 'border-slate-400 hover:border-slate-300'
                              }`}>
                                {subtask.custom?.status === 'done' && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                              <span className={`flex-1 text-slate-200 truncate transition-all ${
                                subtask.custom?.status === 'done' ? 'line-through opacity-60' : ''
                              }`}>
                                {subtask.title}
                              </span>
                              {subtask.assignees && subtask.assignees.length > 0 && (
                                <div className="flex -space-x-1">
                                  {subtask.assignees.slice(0, 2).map(id => (
                                    <Avatar key={id} userId={id} className="w-4 h-4 text-[8px]" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {data.columns[c].length === 0 && (
                <div className="h-24 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500">
                  Drop tasks here
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// COMMENTS SECTION COMPONENT
// ============================================================================
const CommentsSection: React.FC<{
  comments: TaskComment[];
  onAddComment: (content: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}> = ({ comments, onAddComment, onEditComment, onDeleteComment }) => {
  const [newComment, setNewComment] = React.useState('');
  const [editingComment, setEditingComment] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const startEdit = (comment: TaskComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = () => {
    if (editingComment && editContent.trim()) {
      onEditComment(editingComment, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getUserName = (userId: string) => {
    const user = team.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <label className="mb-3 block text-[10px] uppercase tracking-wide text-slate-400">
        Comments ({comments.length})
      </label>
      
      {/* Comments List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-200">
                  {getUserName(comment.author)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatTimeAgo(comment.createdAt)}
                  {comment.isEdited && <span className="ml-1">(edited)</span>}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(comment)}
                  className="text-slate-400 hover:text-slate-200 text-xs px-1"
                  title="Edit comment"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-slate-400 hover:text-red-300 text-xs px-1"
                  title="Delete comment"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40 resize-none"
                  rows={2}
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-2 py-1 text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded border border-cyan-400/20"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-sm">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
      
      {/* Add New Comment */}
      <div className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40 resize-none"
          rows={3}
          placeholder="Add a comment..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleAddComment();
            }
          }}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Press Ctrl+Enter to post
          </span>
          <SoftButton
            onClick={handleAddComment}
            className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200"
            disabled={!newComment.trim()}
          >
            Add Comment
          </SoftButton>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUBTASK EDITOR MODAL
// ============================================================================
const SubtaskEditorModal: React.FC<{ 
  open: boolean; 
  mode: 'edit'; 
  column: string; 
  parentTask?: DevKanbanTask;
  subtask?: DevKanbanTask; 
  onClose: () => void; 
  onSave: (patch: any) => void;
  onDelete: () => void;
}> = ({ open, mode, column, parentTask, subtask, onClose, onSave, onDelete }) => {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('Subtask');
  const [priority, setPriority] = React.useState('Medium');
  const [points, setPoints] = React.useState('1');
  const [assignees, setAssignees] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState('todo');
  const [comments, setComments] = React.useState<TaskComment[]>([]);

  React.useEffect(() => { 
    if (open && subtask) { 
      setTitle(subtask.title || ''); 
      setType(subtask.type || 'Subtask'); 
      setPriority(subtask.priority || 'Medium'); 
      setPoints(String(subtask.points ?? 1)); 
      setAssignees(subtask.assignees || []); 
      setStatus(subtask.custom?.status || 'todo');
      setComments(subtask.comments || []);
    } 
  }, [open, subtask]);

  if (!open || !subtask || !parentTask) return null;

  const toggle = (id: string) => setAssignees(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  
  const handleAddComment = (content: string) => {
    const newComment: TaskComment = {
      id: `comment_${Date.now()}_${Math.random()}`,
      author: 'u1', // Current user - you can replace with actual user context
      content,
      createdAt: Date.now()
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, content, updatedAt: Date.now(), isEdited: true }
        : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };
  
  const save = () => { 
    const pts = points.trim() === '' ? undefined : Number(points); 
    onSave({ 
      title: title.trim() || 'Untitled Subtask', 
      points: pts, 
      assignees, 
      type,
      priority,
      custom: { status },
      comments
    }); 
  };

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative z-10 w-[520px] max-w-[92vw] max-h-[90vh] p-0 flex flex-col">
        <div className="p-5 pb-0 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-semibold text-slate-100">Edit Subtask • {column}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1">Parent Task</div>
            <div className="text-sm text-slate-200">{parentTask.title}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40"
              >
                {['Subtask', 'Task', 'Bug'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Priority</label>
              <select 
                value={priority} 
                onChange={e => setPriority(e.target.value)} 
                className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40"
              >
                {['High', 'Medium', 'Low'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Points</label>
              <input 
                type="number" 
                value={points} 
                min={0} 
                onChange={e => setPoints(e.target.value)} 
                className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value)} 
                className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40"
              >
                {['todo', 'in-progress', 'review', 'done'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-2 block text-[10px] uppercase tracking-wide text-slate-400">Assignees</label>
              <div className="flex flex-wrap gap-2">
                {team.map(u => { 
                  const active = assignees.includes(u.id); 
                  return (
                    <button 
                      key={u.id} 
                      type="button" 
                      onClick={() => toggle(u.id)} 
                      className={`px-2 py-1 rounded-md text-[11px] border ${active ? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-200' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
                    >
                      {u.name}
                    </button>
                  ); 
                })}
              </div>
            </div>
          </div>
          {/* Comments Section */}
          <CommentsSection
            comments={comments}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
        <div className="p-5 pt-0 shrink-0 flex justify-between">
          <button 
            onClick={onDelete}
            className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md border border-red-400/20 hover:border-red-400/40 transition-colors"
          >
            Delete Subtask
          </button>
          <div className="flex gap-2">
            <SoftButton onClick={onClose} className="text-xs">Cancel</SoftButton>
            <SoftButton onClick={() => { save(); }} className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200">Save</SoftButton>
          </div>
        </div>
      </GlassCard>
    </div>, 
    document.body
  );
};

// ============================================================================
// TABLE VIEW
// ============================================================================
const BoardTableView: React.FC<{ 
  data: KanbanBoardData; 
  onAddTask:(col:string)=>void; 
  onMoveTask:(taskId:string, fromCol:string, toCol:string, newIndex?:number)=>void;
  onUpdateField:(col:string, taskId:string, field:string, value:string)=>void;
  onUpdateCore:(col:string, taskId:string, patch:Partial<DevKanbanTask>)=>void;
  customFieldsMap: Record<string,string[]>;
  onAddField:(phase:string, name:string)=>void;
  onAddSubtask?: (col: string, parentTaskId: string, subtaskTitle: string) => void;
  onUpdateSubtask?: (col: string, parentTaskId: string, subtaskId: string, patch: Partial<DevKanbanTask>) => void;
  onDeleteSubtask?: (col: string, parentTaskId: string, subtaskId: string) => void;
  onOpenSubtaskModal?: (col: string, parentTask: DevKanbanTask, subtask: DevKanbanTask) => void;
}> = ({ data, onAddTask, onMoveTask, onUpdateField, onUpdateCore, customFieldsMap, onAddField, onAddSubtask, onUpdateSubtask, onDeleteSubtask, onOpenSubtaskModal }) => {
  const [draggedTask, setDraggedTask] = React.useState<{id:string; col:string} | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);
  const [editingCell, setEditingCell] = React.useState<{task:string; field:string; col:string}|null>(null);
  const [expandedTasks, setExpandedTasks] = React.useState<Set<string>>(new Set());
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState<Record<string, string>>({});
  const [customColumns, setCustomColumns] = React.useState<string[]>(['Status', 'Priority', 'Due Date']);
  const [customOptions, setCustomOptions] = React.useState<Record<string, Set<string>>>({
    'Priority': new Set(['Low', 'Medium', 'High', 'Critical']),
    'Status': new Set(['Todo', 'In Progress', 'Review', 'Done']),
    'Type': new Set(['Task', 'Bug', 'Feature', 'Epic', 'Story'])
  });

  // Get all custom fields across all columns  
  const allCustomFields = React.useMemo(() => {
    const fieldSet = new Set<string>();
    Object.values(customFieldsMap).forEach(fields => {
      fields.forEach(field => fieldSet.add(field));
    });
    return Array.from(fieldSet);
  }, [customFieldsMap]);

  const allColumns = ['Title', 'Type', 'Assignees', 'Points', ...customColumns, ...allCustomFields];

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const addSubtaskToTask = (col: string, parentTaskId: string) => {
    const title = newSubtaskTitle[parentTaskId]?.trim();
    if (title && onAddSubtask) {
      onAddSubtask(col, parentTaskId, title);
      setNewSubtaskTitle(prev => ({ ...prev, [parentTaskId]: '' }));
      setExpandedTasks(prev => new Set([...prev, parentTaskId])); // Auto-expand to show new subtask
    }
  };

  const toggleSubtaskStatus = (col: string, parentTaskId: string, subtaskId: string, currentStatus: string) => {
    if (onUpdateSubtask) {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      onUpdateSubtask(col, parentTaskId, subtaskId, {
        custom: { status: newStatus }
      });
    }
  };

  // Helper function to find if a taskId is a subtask and get its parent
  const findSubtaskParent = (taskId: string, col: string) => {
    const tasks = data.columns[col] || [];
    for (const task of tasks) {
      const devTask = task as DevKanbanTask;
      if (devTask.subtasks) {
        for (const subtask of devTask.subtasks) {
          if (subtask.id === taskId) {
            return task.id;
          }
        }
      }
    }
    return null;
  };

  const handleDragStart = (e: React.DragEvent, task: KanbanTask, col: string) => {
    setDraggedTask({id: task.id, col});
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(col);
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    if (draggedTask) {
      onMoveTask(draggedTask.id, draggedTask.col, targetCol);
    }
    setDraggedTask(null);
    setDragOverCol(null);
  };

  const addCustomColumn = () => {
    const name = prompt('Enter column name:');
    if (name && !customColumns.includes(name)) {
      setCustomColumns(prev => [...prev, name]);
      // Also add to all current columns in this board
      data.order.forEach(col => {
        onAddField(col, name);
      });
    }
  };

  const renderEditableCell = (value: any, taskId: string, field: string, col: string, options?: string[]) => {
    const isEditing = editingCell?.task === taskId && editingCell?.field === field && editingCell?.col === col;
    
    if (isEditing) {
      if (options || customOptions[field]) {
        const allOptions = options || Array.from(customOptions[field] || []);
        return (
          <select
            autoFocus
            value={value || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              
              if (newValue === 'ADD_CUSTOM') {
                const customValue = prompt(`Enter custom ${field}:`);
                if (customValue) {
                  // Add to custom options
                  setCustomOptions(prev => ({
                    ...prev,
                    [field]: new Set([...Array.from(prev[field] || []), customValue])
                  }));
                  
                  // Update the task
                  const parentTaskId = findSubtaskParent(taskId, col);
                  if (parentTaskId && onUpdateSubtask) {
                    // This is a subtask
                    if (field === 'Type' || field === 'Status' || field === 'Priority') {
                      onUpdateSubtask(col, parentTaskId, taskId, { [field.toLowerCase()]: customValue } as Partial<DevKanbanTask>);
                    } else {
                      onUpdateSubtask(col, parentTaskId, taskId, { custom: { [field]: customValue } } as Partial<DevKanbanTask>);
                    }
                  } else {
                    // This is a main task
                    if (field === 'Type' || field === 'Status' || field === 'Priority') {
                      onUpdateCore(col, taskId, { [field.toLowerCase()]: customValue } as Partial<DevKanbanTask>);
                    } else {
                      onUpdateField(col, taskId, field, customValue);
                    }
                  }
                }
              } else {
                // Regular selection
                const parentTaskId = findSubtaskParent(taskId, col);
                if (parentTaskId && onUpdateSubtask) {
                  // This is a subtask
                  if (field === 'Type' || field === 'Status' || field === 'Priority') {
                    onUpdateSubtask(col, parentTaskId, taskId, { [field.toLowerCase()]: newValue } as Partial<DevKanbanTask>);
                  } else {
                    onUpdateSubtask(col, parentTaskId, taskId, { custom: { [field]: newValue } } as Partial<DevKanbanTask>);
                  }
                } else {
                  // This is a main task
                  if (field === 'Type' || field === 'Status' || field === 'Priority') {
                    onUpdateCore(col, taskId, { [field.toLowerCase()]: newValue } as Partial<DevKanbanTask>);
                  } else {
                    onUpdateField(col, taskId, field, newValue);
                  }
                }
              }
              setEditingCell(null);
            }}
            onBlur={() => setEditingCell(null)}
            className="w-full bg-white/10 border border-cyan-400/40 rounded px-2 py-1 text-xs text-slate-100 outline-none"
          >
            <option value="">Select...</option>
            {allOptions.map(opt => (
              <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
            ))}
            <option value="ADD_CUSTOM" className="bg-cyan-900 text-cyan-200">+ Add Custom...</option>
          </select>
        );
      }
      
      return (
        <input
          autoFocus
          type={field === 'Points' ? 'number' : field === 'Due Date' ? 'date' : 'text'}
          value={field === 'Due Date' && value ? new Date(value).toISOString().split('T')[0] : (value || '')}
          onChange={(e) => {
            let newValue = e.target.value;
            
            const parentTaskId = findSubtaskParent(taskId, col);
            if (parentTaskId && onUpdateSubtask) {
              // This is a subtask
              if (field === 'Title') {
                onUpdateSubtask(col, parentTaskId, taskId, { title: newValue } as Partial<DevKanbanTask>);
              } else if (field === 'Points') {
                onUpdateSubtask(col, parentTaskId, taskId, { points: newValue ? Number(newValue) : 1 } as Partial<DevKanbanTask>);
              } else if (field === 'Due Date') {
                onUpdateSubtask(col, parentTaskId, taskId, { custom: { dueDate: newValue || undefined } } as Partial<DevKanbanTask>);
              } else {
                // Custom fields
                onUpdateSubtask(col, parentTaskId, taskId, { custom: { [field]: newValue } } as Partial<DevKanbanTask>);
              }
            } else {
              // This is a main task
              if (field === 'Title') {
                onUpdateCore(col, taskId, { title: newValue } as Partial<DevKanbanTask>);
              } else if (field === 'Points') {
                onUpdateCore(col, taskId, { points: newValue ? Number(newValue) : 1 } as Partial<DevKanbanTask>);
              } else if (field === 'Due Date') {
                onUpdateCore(col, taskId, { due: newValue || undefined } as Partial<DevKanbanTask>);
              } else {
                // Custom fields
                onUpdateField(col, taskId, field, newValue);
              }
            }
            setEditingCell(null);
          }}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') setEditingCell(null);
          }}
          className="w-full bg-white/10 border border-cyan-400/40 rounded px-2 py-1 text-xs text-slate-100 outline-none"
        />
      );
    }

    return (
      <div
        onClick={() => setEditingCell({ task: taskId, field, col })}
        className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded text-xs min-h-[24px] flex items-center"
      >
        {field === 'Due Date' && value ? new Date(value).toLocaleDateString() : (value || '—')}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {data.order.map(col => {
        const tasks = data.columns[col];
        const isDragOver = dragOverCol === col;
        return (
          <GlassCard 
            key={col} 
            className={`overflow-hidden transition-all ${isDragOver ? 'ring-2 ring-cyan-400/40 bg-cyan-500/5' : ''}`}
            onDragOver={(e) => handleDragOver(e, col)}
            onDrop={(e) => handleDrop(e, col)}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100" title={col}>{col}</span>
                <Pill tone={col==='Done'? 'green': col==='Review'? 'amber':'neutral'}>{tasks.length}</Pill>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={addCustomColumn}
                  className="text-cyan-400 hover:text-cyan-300 text-xs px-2 py-1 rounded border border-cyan-400/30 hover:border-cyan-400/50"
                >
                  +Col
                </button>
                <SoftButton onClick={()=> onAddTask(col)} className="text-xs">+ Task</SoftButton>
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-xs">
                <thead>
                  <tr className="sticky top-0 backdrop-blur bg-white/5">
                    {allColumns.map(h => (
                      <th key={h} className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => {
                    const isDragging = draggedTask?.id === t.id;
                    const devTask = t as DevKanbanTask;
                    const subtasks = devTask.subtasks || [];
                    const isExpanded = expandedTasks.has(t.id);
                    const hasSubtasks = subtasks.length > 0;
                    
                    return (
                      <React.Fragment key={t.id}>
                        {/* Main Task Row */}
                        <tr 
                          className={`hover:bg-white/5 cursor-move transition-all ${isDragging ? 'opacity-50 bg-cyan-500/10' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t, col)}
                          onDragEnd={() => {setDraggedTask(null); setDragOverCol(null);}}
                        >
                          <td className="px-4 py-2 text-slate-100 truncate max-w-[320px]" title={t.title}>
                            <div className="flex items-center gap-2">
                              {hasSubtasks ? (
                                <button
                                  onClick={() => toggleTaskExpansion(t.id)}
                                  className="text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                  {isExpanded ? '▼' : '▶'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleTaskExpansion(t.id)}
                                  className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center w-4 h-4"
                                  title="Add subtask"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              )}
                              {renderEditableCell(t.title, t.id, 'Title', col)}
                              {hasSubtasks && (
                                <span className="text-[10px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">
                                  {subtasks.filter(st => st.custom?.status === 'done').length}/{subtasks.length}
                                </span>
                              )}
                              <button
                                onClick={() => onOpenSubtaskModal && onOpenSubtaskModal(col, t as DevKanbanTask, t as DevKanbanTask)}
                                className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center w-4 h-4"
                                title="View comments"
                              >
                                <MessageSquare className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-slate-300">
                            {renderEditableCell((t as any).type || 'Task', t.id, 'Type', col, ['Task', 'Bug', 'Feature', 'Epic', 'Story'])}
                          </td>
                          <td className="px-4 py-2"><Assignees ids={t.assignees} /></td>
                          <td className="px-4 py-2 text-slate-300">
                            {renderEditableCell(t.points, t.id, 'Points', col)}
                          </td>
                          {[...customColumns, ...allCustomFields].map(customCol => (
                            <td key={customCol} className="px-4 py-2 text-slate-300">
                              {customCol === 'Status' && renderEditableCell((t as any).status || col, t.id, 'Status', col, ['Todo', 'In Progress', 'Review', 'Done'])}
                              {customCol === 'Priority' && renderEditableCell((t as any).priority || 'Medium', t.id, 'Priority', col, ['Low', 'Medium', 'High', 'Critical'])}
                              {customCol === 'Due Date' && renderEditableCell((t as any).dueDate, t.id, 'Due Date', col)}
                              {!['Status', 'Priority', 'Due Date'].includes(customCol) && renderEditableCell((t as any).custom?.[customCol], t.id, customCol, col)}
                            </td>
                          ))}
                        </tr>
                        
                        {/* Subtask Rows */}
                        {isExpanded && subtasks.map(subtask => (
                          <tr key={subtask.id} className="bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-2 text-slate-300">
                              <div className="flex items-center gap-2 ml-6">
                                <button
                                  onClick={() => toggleSubtaskStatus(col, t.id, subtask.id, subtask.custom?.status || 'todo')}
                                  className={`w-3 h-3 rounded border transition-colors ${
                                    subtask.custom?.status === 'done' 
                                      ? 'bg-emerald-500 border-emerald-500' 
                                      : 'border-slate-400 hover:border-slate-300'
                                  }`}
                                >
                                  {subtask.custom?.status === 'done' && (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </button>
                                <div className={`flex-1 ${subtask.custom?.status === 'done' ? 'opacity-60' : ''}`}>
                                  {renderEditableCell(subtask.title, subtask.id, 'Title', col)}
                                </div>
                                <button
                                  onClick={() => onOpenSubtaskModal && onOpenSubtaskModal(col, t as DevKanbanTask, subtask as DevKanbanTask)}
                                  className="text-slate-500 hover:text-cyan-400 transition-colors"
                                  title="View comments"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => onDeleteSubtask && onDeleteSubtask(col, t.id, subtask.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-slate-500">
                              {renderEditableCell(subtask.type || 'Subtask', subtask.id, 'Type', col, ['Subtask', 'Task', 'Bug'])}
                            </td>
                            <td className="px-4 py-2">
                              <Assignees ids={subtask.assignees || []} />
                            </td>
                            <td className="px-4 py-2 text-slate-300">
                              {renderEditableCell(subtask.points || 1, subtask.id, 'Points', col)}
                            </td>
                            {[...customColumns, ...allCustomFields].map(customCol => (
                              <td key={customCol} className="px-4 py-2 text-slate-500 text-xs">
                                {customCol === 'Status' && renderEditableCell(subtask.custom?.status || 'todo', subtask.id, 'Status', col, ['todo', 'in-progress', 'review', 'done'])}
                                {customCol === 'Priority' && renderEditableCell(subtask.priority || 'Medium', subtask.id, 'Priority', col, ['Low', 'Medium', 'High', 'Critical'])}
                                {customCol === 'Due Date' && renderEditableCell((subtask as any).dueDate, subtask.id, 'Due Date', col)}
                                {!['Status', 'Priority', 'Due Date'].includes(customCol) && renderEditableCell(subtask.custom?.[customCol], subtask.id, customCol, col)}
                              </td>
                            ))}
                          </tr>
                        ))}
                        
                        {/* Add Subtask Row */}
                        {isExpanded && (
                          <tr className="bg-slate-800/20">
                            <td colSpan={allColumns.length} className="px-4 py-2">
                              <div className="flex items-center gap-2 ml-6">
                                <input
                                  type="text"
                                  value={newSubtaskTitle[t.id] || ''}
                                  onChange={(e) => setNewSubtaskTitle(prev => ({ ...prev, [t.id]: e.target.value }))}
                                  placeholder="Add a subtask..."
                                  className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400/40"
                                  onKeyPress={(e) => e.key === 'Enter' && addSubtaskToTask(col, t.id)}
                                />
                                <button
                                  onClick={() => addSubtaskToTask(col, t.id)}
                                  disabled={!newSubtaskTitle[t.id]?.trim()}
                                  className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Add
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {tasks.length===0 && (
                    <tr>
                      <td colSpan={allColumns.length} className="px-4 py-8 text-center text-slate-500 text-[11px]">
                        {isDragOver ? 'Drop task here' : 'No tasks'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};

// ============================================================================
// DEVELOPMENT TABLE VIEW (with custom fields)
// ============================================================================
const DevTableView: React.FC<{ 
  data: KanbanBoardData; 
  onAddTask:(col:string)=>void; 
  onAddField:(phase:string,name:string)=>void; 
  onUpdateField:(col:string, taskId:string, field:string, value:string)=>void; 
  onUpdateCore:(col:string, taskId:string, patch:Partial<DevKanbanTask>)=>void; 
  customFieldsMap:Record<string,string[]>; 
  onOpenSubtaskModal?: (col: string, parentTask: DevKanbanTask, subtask: DevKanbanTask) => void;
}> = ({ data, onAddTask, onAddField, onUpdateField, onUpdateCore, customFieldsMap, onOpenSubtaskModal }) => {
  const [editingCell, setEditingCell] = React.useState<{task:string; field:string}|null>(null);
  
  const allTasks = React.useMemo(() => {
    const tasks: Array<{task: DevKanbanTask, column: string}> = [];
    Object.entries(data.columns).forEach(([col, columnTasks]) => {
      columnTasks.forEach(task => {
        tasks.push({ task: task as DevKanbanTask, column: col });
      });
    });
    return tasks;
  }, [data.columns]);

  const allFields = React.useMemo(() => {
    const fieldSet = new Set<string>();
    Object.values(customFieldsMap).forEach(fields => {
      fields.forEach(field => fieldSet.add(field));
    });
    return Array.from(fieldSet);
  }, [customFieldsMap]);

  const renderEditable = (value: any, taskId: string, field: string, col: string, options?: string[]) => {
    const isEditing = editingCell?.task === taskId && editingCell?.field === field;
    
    if (isEditing) {
      if (options) {
        return (
          <select
            autoFocus
            value={value || ''}
            onChange={(e) => {
              if (field === 'priority' || field === 'type') {
                onUpdateCore(col, taskId, { [field]: e.target.value });
              } else {
                onUpdateField(col, taskId, field, e.target.value);
              }
              setEditingCell(null);
            }}
            onBlur={() => setEditingCell(null)}
            className="w-full bg-white/10 border border-cyan-400/40 rounded px-2 py-1 text-xs text-slate-100 outline-none"
          >
            {options.map(opt => (
              <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
            ))}
          </select>
        );
      }
      
      return (
        <input
          autoFocus
          type={field === 'points' ? 'number' : field === 'due' ? 'date' : 'text'}
          value={field === 'due' && value ? new Date(value).toISOString().split('T')[0] : (value || '')}
          onChange={(e) => {
            let newValue = e.target.value;
            if (field === 'due') newValue = e.target.value;
            if (field === 'points') newValue = e.target.value;
            
            if (field === 'title' || field === 'points' || field === 'due' || field === 'sprint') {
              const patch: Partial<DevKanbanTask> = {};
              if (field === 'points') patch.points = newValue ? Number(newValue) : undefined;
              else if (field === 'due') patch.due = newValue || undefined;
              else (patch as any)[field] = newValue;
              onUpdateCore(col, taskId, patch);
            } else {
              onUpdateField(col, taskId, field, newValue);
            }
            setEditingCell(null);
          }}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditingCell(null);
            if (e.key === 'Escape') setEditingCell(null);
          }}
          className="w-full bg-white/10 border border-cyan-400/40 rounded px-2 py-1 text-xs text-slate-100 outline-none"
        />
      );
    }

    return (
      <div
        onClick={() => setEditingCell({ task: taskId, field })}
        className="cursor-pointer hover:bg-white/10 px-2 py-1 rounded text-xs min-h-[24px] flex items-center"
      >
        {field === 'due' && value ? new Date(value).toLocaleDateString() : (value || '—')}
      </div>
    );
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Development Tasks</h2>
        <div className="flex gap-2">
          {data.order.map(col => (
            <SoftButton
              key={col}
              onClick={() => onAddTask(col)}
              className="text-xs"
            >
              + {col}
            </SoftButton>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Priority</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Points</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Sprint</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Due</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">Assignees</th>
              {allFields.map(field => (
                <th key={field} className="px-3 py-2 text-left text-xs font-medium text-slate-300">
                  {field}
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-slate-300">
                <button
                  onClick={() => {
                    const name = prompt('Field name:');
                    if (name) {
                      const phase = prompt('For which status?', data.order[0]);
                      if (phase && data.order.includes(phase)) {
                        onAddField(phase, name);
                      }
                    }
                  }}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  +Col
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map(({ task, column }) => (
              <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {renderEditable(task.title, task.id, 'title', column)}
                    <button
                      onClick={() => onOpenSubtaskModal && onOpenSubtaskModal(column, task, task)}
                      className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center w-4 h-4"
                      title="View comments"
                    >
                      <MessageSquare className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-slate-300">
                    {column}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {renderEditable(task.type, task.id, 'type', column, ['Task', 'Bug', 'Feature', 'Epic'])}
                </td>
                <td className="px-3 py-2">
                  {renderEditable(task.priority, task.id, 'priority', column, ['Low', 'Medium', 'High', 'Critical'])}
                </td>
                <td className="px-3 py-2">
                  {renderEditable(task.points, task.id, 'points', column)}
                </td>
                <td className="px-3 py-2">
                  {renderEditable(task.sprint, task.id, 'sprint', column)}
                </td>
                <td className="px-3 py-2">
                  {renderEditable(task.due, task.id, 'due', column)}
                </td>
                <td className="px-3 py-2">
                  <Assignees ids={task.assignees} />
                </td>
                {allFields.map(field => (
                  <td key={field} className="px-3 py-2">
                    {renderEditable(task.custom?.[field], task.id, field, column, 
                      customFieldsMap[column]?.includes(field) ? 
                        ['Option 1', 'Option 2', 'Option 3', 'Custom'] : undefined
                    )}
                  </td>
                ))}
                <td className="px-3 py-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

// ============================================================================
// TASK EDITOR MODAL
// ============================================================================
const TaskEditorModal: React.FC<{ open:boolean; mode:'new'|'edit'; column:string; task?: any; isDev:boolean; onClose:()=>void; onSave:(patch:any)=>void; }> = ({ open, mode, column, task, isDev, onClose, onSave }) => {
  const [title,setTitle]=React.useState('');
  const [type,setType]=React.useState('Task');
  const [priority,setPriority]=React.useState('Medium');
  const [points,setPoints]=React.useState('1');
  const [labels,setLabels]=React.useState('');
  const [assignees,setAssignees]=React.useState<string[]>([]);
  const [sprint,setSprint]=React.useState('');
  const [due,setDue]=React.useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [subtasks, setSubtasks] = React.useState<DevKanbanTask[]>([]);
  const [comments, setComments] = React.useState<TaskComment[]>([]);
  
  React.useEffect(()=>{ 
    if(open){ 
      setTitle(task?.title||''); 
      setType(task?.type||'Task'); 
      setPriority(task?.priority||'Medium'); 
      setPoints(String(task?.points??1)); 
      setLabels((task?.labels?.length? task.labels: task?.tags||[]).join(', ')); 
      setAssignees(task?.assignees||[]); 
      setSprint(task?.sprint||''); 
      setDue(task?.due||''); 
      setSubtasks(task?.subtasks || []);
      setNewSubtaskTitle('');
      setComments(task?.comments || []);
    } 
  },[open,task]);
  if(!open) return null;
  const toggle=(id:string)=> setAssignees(a=> a.includes(id)? a.filter(x=>x!==id): [...a,id]);
  
  const handleAddComment = (content: string) => {
    const newComment: TaskComment = {
      id: `comment_${Date.now()}_${Math.random()}`,
      author: 'u1', // Current user - you can replace with actual user context
      content,
      createdAt: Date.now()
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setComments(comments.map(c => 
      c.id === commentId 
        ? { ...c, content, updatedAt: Date.now(), isEdited: true }
        : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
  };
  
  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: DevKanbanTask = {
        id: `subtask_${Date.now()}_${Math.random()}`,
        title: newSubtaskTitle.trim(),
        isSubtask: true,
        parentTaskId: task?.id,
        createdAt: Date.now(),
        assignees: [],
        tags: [],
        points: 1,
        custom: { status: 'todo' }
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };
  
  const toggleSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === subtaskId ? { 
        ...st, 
        custom: { 
          ...st.custom, 
          status: st.custom?.status === 'done' ? 'todo' : 'done' 
        } 
      } : st
    ));
  };
  
  const deleteSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter(st => st.id !== subtaskId));
  };
  
  const save=()=>{ 
    const pts=points.trim()===''? undefined:Number(points); 
    const arr=labels.split(',').map(s=>s.trim()).filter(Boolean); 
    onSave({ 
      title:title.trim()||'Untitled', 
      points:pts, 
      assignees, 
      tags: !isDev? arr: undefined, 
      labels: isDev? arr: undefined, 
      type:isDev? type: undefined, 
      priority:isDev? priority: undefined, 
      sprint:isDev? (sprint||undefined): undefined, 
      due:isDev? (due||undefined): undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      comments: comments.length > 0 ? comments : undefined
    }); 
  };
  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <GlassCard className="relative z-10 w-[520px] max-w-[92vw] max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-5 pb-0 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-semibold text-slate-100">{mode==='new'? 'New Task':'Edit Task'} • {column}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-white/10"><X className="h-4 w-4"/></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="col-span-2">
            <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/40"/>
          </div>
          {isDev && (
            <>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Type</label>
                <select value={type} onChange={e=>setType(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40">
                  {['Story','Task','Bug','Spike'].map(o=> <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Priority</label>
                <select value={priority} onChange={e=>setPriority(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40">
                  {['High','Medium','Low'].map(o=> <option key={o}>{o}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Points</label>
            <input type="number" value={points} min={0} onChange={e=>setPoints(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none"/>
          </div>
          {isDev && (
            <>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Sprint</label>
                <input value={sprint} onChange={e=>setSprint(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none"/>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Due</label>
                <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none"/>
              </div>
            </>
          )}
          <div className="col-span-2">
            <label className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">{isDev? 'Labels':'Tags'}</label>
            <input value={labels} onChange={e=>setLabels(e.target.value)} placeholder="frontend, ui" className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none"/>
          </div>
          <div className="col-span-2">
            <label className="mb-2 block text-[10px] uppercase tracking-wide text-slate-400">Assignees</label>
            <div className="flex flex-wrap gap-2">
              {team.map(u=>{ const active=assignees.includes(u.id); return <button key={u.id} type="button" onClick={()=>toggle(u.id)} className={`px-2 py-1 rounded-md text-[11px] border ${active? 'bg-cyan-500/25 border-cyan-400/40 text-cyan-200':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{u.name}</button>; })}
            </div>
          </div>
        </div>
        
        {/* Subtask Management Section - Only show for edit mode */}
        {mode === 'edit' && task && !task.isSubtask && (
          <div className="mt-4 border-t border-white/10 pt-4">
            <label className="mb-3 block text-[10px] uppercase tracking-wide text-slate-400">Subtasks</label>
            
            {/* Existing Subtasks */}
            {subtasks.length > 0 && (
              <div className="mb-3 space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 rounded-md bg-white/5 p-2">
                    <input
                      type="checkbox"
                      checked={subtask.custom?.status === 'done'}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="h-3 w-3 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/50"
                    />
                    <span className={`flex-1 text-xs ${subtask.custom?.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {subtask.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(subtask.id)}
                      className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add New Subtask */}
            <div className="flex gap-2">
              <input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400/40"
                onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
              />
              <SoftButton
                onClick={addSubtask}
                className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200"
                disabled={!newSubtaskTitle.trim()}
              >
                Add
              </SoftButton>
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
        />
        </div>
        
        <div className="p-5 pt-0 shrink-0 flex justify-end gap-2">
          <SoftButton onClick={onClose} className="text-xs">Cancel</SoftButton>
          <SoftButton onClick={()=>{ save(); onClose(); }} className="text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200">{mode==='new'? 'Create':'Save'}</SoftButton>
        </div>
      </GlassCard>
    </div>, document.body);
};

// ============================================================================
// CALENDAR VIEW
// ============================================================================
const CalendarView: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void; onEditTask:(col:string, taskId:string)=>void }> = ({ data, onAddTask, onEditTask }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<'month'|'week'>('month');
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  
  // Get all tasks with due dates
  const tasksWithDates = React.useMemo(() => {
    const tasks: Array<{task: DevKanbanTask, column: string}> = [];
    Object.entries(data.columns).forEach(([col, columnTasks]) => {
      columnTasks.forEach(task => {
        const devTask = task as DevKanbanTask;
        if (devTask.due || devTask.createdAt) {
          tasks.push({ task: devTask, column: col });
        }
      });
    });
    return tasks;
  }, [data]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasksWithDates.filter(({ task }) => {
      if (task.due) {
        const taskDate = new Date(task.due);
        return taskDate.toISOString().split('T')[0] === dateStr;
      }
      if (task.createdAt) {
        const taskDate = new Date(task.createdAt);
        return taskDate.toISOString().split('T')[0] === dateStr;
      }
      return false;
    });
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-100">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <Pill tone="neutral" className="text-xs">
              {tasksWithDates.length} scheduled tasks
            </Pill>
            <Pill tone="blue" className="text-xs">
              {tasksWithDates.filter(({task}) => task.due && new Date(task.due).getMonth() === currentDate.getMonth()).length} this month
            </Pill>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${viewMode === 'month' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:text-slate-200'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${viewMode === 'week' ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:text-slate-200'}`}
            >
              Week
            </button>
          </div>
          <div className="flex items-center gap-1">
            <SoftButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="px-2 py-1"
            >
              ←
            </SoftButton>
            <SoftButton 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs"
            >
              Today
            </SoftButton>
            <SoftButton 
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="px-2 py-1"
            >
              →
            </SoftButton>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-400/20">
          <div className="flex items-center gap-2 text-sm text-purple-200">
            <span className="font-medium">Selected:</span>
            <span>{selectedDate.toLocaleDateString()}</span>
            <span className="text-purple-300">•</span>
            <span className="text-xs">Click + button to add a task for this date</span>
            <button 
              onClick={() => setSelectedDate(null)}
              className="ml-auto text-purple-300 hover:text-purple-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-slate-400 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const dayTasks = getTasksForDate(date);

          return (
            <div 
              key={index}
              className={`min-h-[100px] p-2 border border-white/10 rounded-lg transition cursor-pointer hover:bg-white/10 ${
                isCurrentMonth ? 'bg-white/5' : 'bg-white/2 opacity-50'
              } ${isToday ? 'ring-2 ring-cyan-400/40' : ''} ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-purple-400/40' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className={`text-sm font-medium mb-2 flex items-center justify-between ${isToday ? 'text-cyan-300' : 'text-slate-300'}`}>
                <span>{date.getDate()}</span>
                {selectedDate?.toDateString() === date.toDateString() && (
                  <SoftButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add task to the first column (Backlog/Todo)
                      onAddTask(data.order[0]);
                    }}
                    className="text-[10px] px-1 py-0.5"
                    title="Add task for this date"
                  >
                    <Plus className="h-3 w-3" />
                  </SoftButton>
                )}
              </div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map(({ task, column }) => {
                  const devTask = task as DevKanbanTask;
                  return (
                    <div 
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(column, task.id);
                      }}
                      className="p-1 rounded text-[10px] text-slate-200 bg-white/10 hover:bg-white/20 cursor-pointer truncate transition-colors"
                      title={`${task.title} - ${column}`}
                    >
                      <div className="flex items-center gap-1">
                        <Pill tone={column === 'Done' ? 'green' : column === 'In Progress' ? 'amber' : column === 'In Review' ? 'purple' : 'neutral'} className="text-[8px] px-1">
                          {column.slice(0, 3)}
                        </Pill>
                        <span className="truncate flex-1">{task.title}</span>
                        {devTask.priority && (
                          <span className={`text-[8px] ${devTask.priority === 'High' ? 'text-red-400' : devTask.priority === 'Medium' ? 'text-amber-400' : 'text-slate-400'}`}>
                            {devTask.priority[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-slate-400">+{dayTasks.length - 3} more</div>
                )}
                {dayTasks.length === 0 && selectedDate?.toDateString() === date.toDateString() && (
                  <div className="text-[9px] text-slate-500 italic">Click + to add task</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// ============================================================================
// GANTT VIEW
// ============================================================================
const GanttView: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void; onEditTask:(col:string, taskId:string)=>void }> = ({ data, onAddTask, onEditTask }) => {
  const [timeRange, setTimeRange] = React.useState<'week'|'month'|'quarter'>('month');
  const [startDate, setStartDate] = React.useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 14); // Start 2 weeks ago
    return date;
  });

  // Get all tasks with dates
  const tasksWithDates = React.useMemo(() => {
    const tasks: Array<{task: DevKanbanTask, column: string}> = [];
    Object.entries(data.columns).forEach(([col, columnTasks]) => {
      columnTasks.forEach(task => {
        const devTask = task as DevKanbanTask;
        if (devTask.createdAt || devTask.due || devTask.startedAt) {
          tasks.push({ task: devTask, column: col });
        }
      });
    });
    return tasks.sort((a, b) => (a.task.createdAt || 0) - (b.task.createdAt || 0));
  }, [data]);

  const getStatusColor = (column: string) => {
    switch (column) {
      case 'Done': return 'border-emerald-400/40 bg-emerald-500/10';
      case 'In Progress': return 'border-amber-400/40 bg-amber-500/10';
      case 'In Review': return 'border-purple-400/40 bg-purple-500/10';
      case 'Ready for QA': return 'border-cyan-400/40 bg-cyan-500/10';
      default: return 'border-slate-400/40 bg-slate-500/10';
    }
  };

  const formatDate = (timestamp?: number, dateStr?: string) => {
    if (dateStr) return new Date(dateStr).toLocaleDateString();
    if (timestamp) return new Date(timestamp).toLocaleDateString();
    return 'No date';
  };

  const generateTimeline = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const timeline = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      timeline.push(date);
    }
    return timeline;
  };

  const getTaskPosition = (task: DevKanbanTask) => {
    const timeline = generateTimeline();
    const startTaskDate = new Date(task.createdAt || Date.now());
    const endTaskDate = task.due ? new Date(task.due) : new Date(startTaskDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const timelineStart = timeline[0];
    
    const totalDays = timeline.length;
    const startOffset = Math.max(0, Math.floor((startTaskDate.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000)));
    const endOffset = Math.min(totalDays, Math.floor((endTaskDate.getTime() - timelineStart.getTime()) / (24 * 60 * 60 * 1000)));
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${Math.max(1, ((endOffset - startOffset) / totalDays) * 100)}%`
    };
  };

  const timeline = generateTimeline();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Gantt Chart</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            {(['week', 'month', 'quarter'] as const).map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${timeRange === range ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-300 hover:text-slate-200'}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <SoftButton 
              onClick={() => {
                const newDate = new Date(startDate);
                newDate.setDate(startDate.getDate() - (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90));
                setStartDate(newDate);
              }}
              className="px-2 py-1"
            >
              ←
            </SoftButton>
            <SoftButton 
              onClick={() => setStartDate(new Date())}
              className="px-3 py-1 text-xs"
            >
              Today
            </SoftButton>
            <SoftButton 
              onClick={() => {
                const newDate = new Date(startDate);
                newDate.setDate(startDate.getDate() + (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90));
                setStartDate(newDate);
              }}
              className="px-2 py-1"
            >
              →
            </SoftButton>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Timeline header */}
        <div className="flex items-center mb-4">
          <div className="w-64 shrink-0"></div>
          <div className="flex-1 flex">
            {timeline.map((date, index) => (
              <div key={index} className="flex-1 text-center text-xs text-slate-400 border-l border-white/10 px-1">
                <div className="font-medium">{date.getDate()}</div>
                <div className="text-[10px]">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {tasksWithDates.map(({ task, column }) => {
            return (
              <div key={task.id} className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                </div>
                
                {/* Task card */}
                <div 
                  onClick={() => onEditTask(column, task.id)}
                  className={`flex-1 rounded-lg border p-4 cursor-pointer hover:bg-white/5 transition ${getStatusColor(column)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-100 mb-2">{task.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Created: {formatDate(task.createdAt)}</span>
                        {task.startedAt && <span>Started: {formatDate(task.startedAt)}</span>}
                        {task.due && <span>Due: {formatDate(undefined, task.due)}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {(task.tags || []).map(tag => (
                          <Pill key={tag} tone={tag === 'bug' ? 'red' : 'blue'} className="text-[10px]">
                            {tag}
                          </Pill>
                        ))}
                        {task.points && (
                          <span className="text-xs text-slate-400">{task.points} pts</span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Assignees ids={task.assignees} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

// ============================================================================
// TIMELINE VIEW
// ============================================================================
const TimelineView: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void; onEditTask:(col:string, taskId:string)=>void }> = ({ data, onAddTask, onEditTask }) => {
  // Group tasks by column and sort by date
  const groupedTasks = React.useMemo(() => {
    const groups: Record<string, Array<DevKanbanTask>> = {};
    
    Object.entries(data.columns).forEach(([col, tasks]) => {
      groups[col] = tasks
        .map(task => task as DevKanbanTask)
        .filter(task => task.createdAt || task.startedAt || task.due)
        .sort((a, b) => (a.createdAt || a.startedAt || 0) - (b.createdAt || b.startedAt || 0));
    });
    
    return groups;
  }, [data]);

  const getStatusColor = (column: string) => {
    switch (column) {
      case 'Done': return 'border-emerald-400/40 bg-emerald-500/10';
      case 'In Progress': return 'border-amber-400/40 bg-amber-500/10';
      case 'In Review': return 'border-purple-400/40 bg-purple-500/10';
      case 'Ready for QA': return 'border-cyan-400/40 bg-cyan-500/10';
      default: return 'border-slate-400/40 bg-slate-500/10';
    }
  };

  const formatDate = (timestamp?: number, dateStr?: string) => {
    if (dateStr) return new Date(dateStr).toLocaleDateString();
    if (timestamp) return new Date(timestamp).toLocaleDateString();
    return 'No date';
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Timeline View</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Tasks ordered by creation/start date</span>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([column, tasks]) => (
          <div key={column}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-slate-100">{column}</h3>
              <Pill tone={column === 'Done' ? 'green' : column === 'In Progress' ? 'amber' : 'neutral'}>
                {tasks.length}
              </Pill>
              <SoftButton onClick={() => onAddTask(column)} className="text-xs ml-auto">
                + Add Task
              </SoftButton>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/40 to-purple-400/40"></div>
              
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div className="relative z-10 w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    </div>
                    
                    {/* Task card */}
                    <div 
                      onClick={() => onEditTask(column, task.id)}
                      className={`flex-1 rounded-lg border p-4 cursor-pointer hover:bg-white/5 transition ${getStatusColor(column)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-100 mb-2">{task.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>Created: {formatDate(task.createdAt)}</span>
                            {task.startedAt && <span>Started: {formatDate(task.startedAt)}</span>}
                            {task.due && <span>Due: {formatDate(undefined, task.due)}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {(task.tags || []).map(tag => (
                              <Pill key={tag} tone={tag === 'bug' ? 'red' : 'blue'} className="text-[10px]">
                                {tag}
                              </Pill>
                            ))}
                            {task.points && (
                              <span className="text-xs text-slate-400">{task.points} pts</span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Assignees ids={task.assignees} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 rounded-lg border-2 border-dashed border-white/10 p-6 text-center">
                      <span className="text-slate-400">No tasks in {column}</span>
                      <SoftButton onClick={() => onAddTask(column)} className="ml-3 text-xs">
                        Add First Task
                      </SoftButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ============================================================================
// PROJECT HOME SCREEN
// ============================================================================
const ProjectHomeScreen: React.FC<{ projectName: string; boards: Board[]; onSelectBoard: (id: string) => void; }> = ({ projectName, boards, onSelectBoard }) => {
  const projectInfo = {
    description: "Modern web application with advanced user authentication, payment processing, and mobile-responsive design. Built with React, TypeScript, and modern development practices.",
    createdDate: "January 15, 2025",
    lastUpdate: "2 hours ago",
    owner: "Sam Chen",
    status: "Active Development",
    priority: "High",
    estimatedCompletion: "December 2025"
  };

  // Teams working on THIS specific project
  const projectTeams = [
    {
      id: "team-frontend",
      name: "Frontend Team",
      lead: "Ava Martinez",
      members: 4,
      focus: "React, TypeScript, UI/UX",
      status: "active",
      currentSprint: "Sprint 23",
      members_list: [
        { name: "Ava Martinez", role: "Team Lead", avatar: "bg-amber-500", status: "online" },
        { name: "Maya Patel", role: "Senior Developer", avatar: "bg-blue-500", status: "online" },
        { name: "Jake Wilson", role: "Frontend Developer", avatar: "bg-green-500", status: "away" },
        { name: "Luna Chen", role: "UI Developer", avatar: "bg-purple-500", status: "online" }
      ]
    },
    {
      id: "team-backend", 
      name: "Backend Team",
      lead: "Leo Kim",
      members: 3,
      focus: "Node.js, APIs, Database",
      status: "active",
      currentSprint: "Sprint 23",
      members_list: [
        { name: "Leo Kim", role: "Team Lead", avatar: "bg-emerald-500", status: "online" },
        { name: "Alex Rodriguez", role: "Senior Developer", avatar: "bg-cyan-500", status: "online" },
        { name: "Jordan Taylor", role: "Backend Developer", avatar: "bg-indigo-500", status: "offline" }
      ]
    },
    {
      id: "team-design",
      name: "Design Team", 
      lead: "Mia Rodriguez",
      members: 3,
      focus: "UX/UI, Prototyping",
      status: "active",
      currentSprint: "Sprint 23",
      members_list: [
        { name: "Mia Rodriguez", role: "Lead Designer", avatar: "bg-rose-500", status: "online" },
        { name: "Kai Thompson", role: "UX Designer", avatar: "bg-pink-500", status: "away" },
        { name: "Zoe Martinez", role: "UI Designer", avatar: "bg-violet-500", status: "online" }
      ]
    },
    {
      id: "team-qa",
      name: "QA Team",
      lead: "Riley Wang", 
      members: 2,
      focus: "Testing, Quality Assurance",
      status: "active",
      currentSprint: "Sprint 23",
      members_list: [
        { name: "Riley Wang", role: "QA Lead", avatar: "bg-teal-500", status: "online" },
        { name: "Sam Johnson", role: "QA Engineer", avatar: "bg-orange-500", status: "online" }
      ]
    }
  ];

  const totalTeamMembers = projectTeams.reduce((sum, team) => sum + team.members, 0);

  const projectStats = {
    totalTasks: 127,
    completedTasks: 89,
    activeSprints: 2,
    teamMembers: totalTeamMembers  // Total across all teams working on this project
  };

  const upcomingMilestones = [
    { id: 1, title: "Beta Release", date: "September 15, 2025", status: "on-track", progress: 78, description: "Core features complete for initial user testing" },
    { id: 2, title: "Mobile App Launch", date: "October 1, 2025", status: "at-risk", progress: 34, description: "Native mobile application for iOS and Android" },
    { id: 3, title: "API v2.0 Release", date: "October 20, 2025", status: "planning", progress: 12, description: "Enhanced API with improved performance and new endpoints" },
    { id: 4, title: "Production Launch", date: "December 1, 2025", status: "planning", progress: 5, description: "Full production deployment with monitoring" }
  ];

  const recentUpdates = [
    { id: 1, title: "Frontend Team completed user authentication module", date: "2 days ago", author: "Ava Martinez", type: "milestone" },
    { id: 2, title: "Backend Team finished payment integration testing", date: "3 days ago", author: "Leo Kim", type: "progress" },
    { id: 3, title: "Design Team approved mobile UI mockups", date: "5 days ago", author: "Mia Rodriguez", type: "review" },
    { id: 4, title: "All teams completed Sprint 23 retrospective", date: "1 week ago", author: "Project Teams", type: "planning" },
    { id: 5, title: "QA Team identified and fixed security vulnerability", date: "1 week ago", author: "Riley Wang", type: "security" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
      case 'progress': return <div className="w-2 h-2 rounded-full bg-cyan-500" />;
      case 'review': return <div className="w-2 h-2 rounded-full bg-purple-500" />;
      case 'planning': return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'security': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{projectName}</h1>
          <p className="text-slate-400 mt-2 text-lg max-w-3xl">{projectInfo.description}</p>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Owner:</span>
              <span className="text-sm text-slate-300 font-medium">{projectInfo.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Created:</span>
              <span className="text-sm text-slate-300">{projectInfo.createdDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Last updated:</span>
              <span className="text-sm text-slate-300">{projectInfo.lastUpdate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Pill tone="green" className="text-sm">Active</Pill>
          <Pill tone="amber" className="text-sm">High Priority</Pill>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-100 mb-2">{projectStats.totalTasks}</div>
            <div className="text-sm text-slate-400">Total Tasks</div>
            <div className="text-xs text-slate-500 mt-1">Across all boards</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">{Math.round((projectStats.completedTasks / projectStats.totalTasks) * 100)}%</div>
            <div className="text-sm text-slate-400">Completed</div>
            <div className="text-xs text-slate-500 mt-1">{projectStats.completedTasks} of {projectStats.totalTasks} tasks</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{projectStats.activeSprints}</div>
            <div className="text-sm text-slate-400">Active Sprints</div>
            <div className="text-xs text-slate-500 mt-1">Currently running</div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{projectStats.teamMembers}</div>
            <div className="text-sm text-slate-400">Team Members</div>
            <div className="text-xs text-slate-500 mt-1">Active contributors</div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Teams */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-100">Project Teams</h2>
            <div className="text-xs text-slate-400">{projectTeams.length} teams • {totalTeamMembers} members</div>
          </div>
          <div className="space-y-4">
            {projectTeams.map(team => (
              <div key={team.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-200">{team.name}</h3>
                      <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {team.status}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mb-1">Lead: {team.lead}</div>
                    <div className="text-xs text-slate-500">{team.focus}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-300">{team.members}</div>
                    <div className="text-xs text-slate-500">members</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">Current: {team.currentSprint}</div>
                  <div className="flex -space-x-1">
                    {team.members_list.slice(0, 3).map((member, idx) => (
                      <div key={idx} className={`w-6 h-6 rounded-full ${member.avatar} flex items-center justify-center text-white text-xs font-medium border border-white/20`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {team.members > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-medium border border-white/20">
                        +{team.members - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Project Boards */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Project Boards</h2>
          <div className="space-y-3">
            {boards.map(board => (
              <div
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-100">{board.name}</h3>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-emerald-400">{board.name === 'Development' ? '73%' : '89%'}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{width: board.name === 'Development' ? '73%' : '89%'}}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {board.name === 'Development' ? '47 tasks' : '23 tasks'} • Last activity {board.name === 'Development' ? '2h ago' : '1d ago'}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Project Milestones */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Project Milestones</h2>
          <div className="space-y-4">
            {upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-200">{milestone.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{milestone.description}</p>
                  </div>
                  <Pill tone={milestone.status === 'on-track' ? 'green' : milestone.status === 'at-risk' ? 'amber' : 'neutral'} className="text-xs ml-2">
                    {milestone.status.replace('-', ' ')}
                  </Pill>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{milestone.date}</span>
                  <span className="text-slate-400">{milestone.progress}% complete</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      milestone.status === 'on-track' ? 'bg-emerald-500' : 
                      milestone.status === 'at-risk' ? 'bg-amber-500' : 
                      'bg-slate-500'
                    }`}
                    style={{width: `${milestone.progress}%`}}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Recent Project Updates */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Recent Project Updates</h2>
        <div className="space-y-3">
          {recentUpdates.map(update => (
            <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div className="mt-2">
                {getUpdateIcon(update.type)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-200 font-medium">{update.title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {update.author} • {update.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// ============================================================================
// DASHBOARD SCREEN
// ============================================================================
const DashboardScreen: React.FC<{ projectName: string; }> = ({ projectName }) => {
  const kpis = [
    { id: "kpi_total_projects", title: "Active Projects", value: "12", trend: "+2", color: "blue" },
    { id: "kpi_overall_progress", title: "Overall Progress", value: "68%", trend: "+5%", color: "emerald" },
    { id: "kpi_avg_velocity", title: "Avg Velocity", value: "42", trend: "+8%", color: "cyan" },
    { id: "kpi_avg_lead_time", title: "Avg Lead Time", value: "3.2d", trend: "-12%", color: "purple" },
    { id: "kpi_critical_issues", title: "Critical Issues", value: "7", trend: "-3", color: "red" },
    { id: "kpi_weekly_deploys", title: "Weekly Deploys", value: "28", trend: "+5", color: "amber" },
  ];

  // Sample chart data for more realistic widgets
  const sprintData = [65, 73, 78, 73]; // Last 4 days progress
  const velocityData = [35, 42, 38, 45, 41, 39, 42, 44]; // Last 8 sprints
  const prReviewTimes = [2.3, 1.8, 2.1, 1.5, 1.9, 2.4, 1.7, 2.0]; // Hours over 8 weeks

  const MiniChart: React.FC<{ data: number[]; type: 'line' | 'bar'; color: string; height?: string }> = ({ data, type, color, height = "h-16" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    if (type === 'line') {
      const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / (max - min)) * 100;
        return `${x},${y}`;
      }).join(' ');

      return (
        <div className={`w-full ${height} relative`}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={`rgb(${color === 'emerald' ? '34 197 94' : color === 'cyan' ? '6 182 212' : '168 85 247'})`}
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
      );
    }

    return (
      <div className={`flex items-end justify-between ${height} gap-1`}>
        {data.map((value, index) => {
          const height = ((value - min) / (max - min)) * 100;
          return (
            <div
              key={index}
              className={`flex-1 rounded-sm ${
                color === 'emerald' ? 'bg-emerald-500/60' : 
                color === 'cyan' ? 'bg-cyan-500/60' : 
                color === 'purple' ? 'bg-purple-500/60' :
                'bg-slate-500/60'
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time metrics and performance insights across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="blue" className="text-xs">Last 30 days</Pill>
          <SoftButton className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Data
          </SoftButton>
          <SoftButton className="text-xs">
            <MoreHorizontal className="h-3 w-3 mr-1" />
            Configure
          </SoftButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map(kpi => (
          <GlassCard key={kpi.id} className="p-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">
              {kpi.title}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-slate-100">{kpi.value}</div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                kpi.trend.startsWith('+') 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : kpi.trend.startsWith('-') 
                    ? 'text-red-400 bg-red-500/10' 
                    : 'text-slate-400 bg-slate-500/10'
              }`}>
                {kpi.trend}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Project Portfolio Progress */}
        <GlassCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Portfolio Progress</h3>
            <Pill tone="green" className="text-xs">On Track</Pill>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">68% Complete</div>
            <div className="text-xs text-slate-400">Across 12 active projects</div>
          </div>
          <MiniChart data={sprintData} type="line" color="emerald" height="h-12" />
        </GlassCard>

        {/* Average Velocity */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Avg Velocity</h3>
            <div className="text-xs text-cyan-400">+8%</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">42 pts</div>
            <div className="text-xs text-slate-400">across all teams</div>
          </div>
          <MiniChart data={velocityData} type="bar" color="cyan" height="h-10" />
        </GlassCard>

        {/* Overall Quality Score */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Quality Score</h3>
            <div className="text-xs text-emerald-400">+5%</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">87%</div>
            <div className="text-xs text-slate-400">portfolio avg</div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{width: '87%'}}></div>
          </div>
        </GlassCard>

        {/* Average Lead Time */}
        <GlassCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Lead Time Trends</h3>
            <div className="text-xs text-purple-400">Portfolio Avg</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">3.2d</div>
            <div className="text-xs text-slate-400">down from 3.6d</div>
          </div>
          <MiniChart data={prReviewTimes} type="line" color="purple" height="h-12" />
        </GlassCard>

        {/* Team Utilization */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Team Utilization</h3>
            <div className="text-xs text-emerald-400">85%</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Frontend Teams</span>
              <span className="text-emerald-400 font-medium">88%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Backend Teams</span>
              <span className="text-cyan-400 font-medium">82%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">DevOps Teams</span>
              <span className="text-amber-400 font-medium">75%</span>
            </div>
          </div>
        </GlassCard>

        {/* Portfolio Health */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Portfolio Health</h3>
            <div className="text-xs text-emerald-400">Good</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">8.7/10</div>
            <div className="text-xs text-slate-400">overall score</div>
          </div>
          <div className="flex items-center gap-1">
            {[9, 8, 9, 7, 8, 9, 8].map((score, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-6 rounded-sm mb-1 ${
                  score >= 9 ? 'bg-emerald-500/60' : 
                  score >= 7 ? 'bg-cyan-500/60' : 
                  'bg-amber-500/60'
                }`} style={{height: `${score * 3}px`}}></div>
                <div className="text-xs text-slate-500">{['M','T','W','T','F','S','S'][i]}</div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Bottom Row - More Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Risk Assessment */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Portfolio Risks</h3>
            <Pill tone="amber" className="text-xs">3 at-risk</Pill>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-400/20">
              <div>
                <div className="text-xs font-medium text-slate-200">Mobile App Project</div>
                <div className="text-xs text-red-300">Behind schedule • Resource constraints</div>
              </div>
              <Pill tone="red" className="text-xs">High</Pill>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-400/20">
              <div>
                <div className="text-xs font-medium text-slate-200">API Migration</div>
                <div className="text-xs text-amber-300">Technical debt increasing</div>
              </div>
              <Pill tone="amber" className="text-xs">Med</Pill>
            </div>
            <div className="text-center">
              <button className="text-xs text-slate-400 hover:text-slate-200">View risk assessment →</button>
            </div>
          </div>
        </GlassCard>

        {/* Project Status Overview */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Project Status</h3>
            <div className="text-xs text-slate-400">12 projects</div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">On Track</span>
                <span className="text-xs text-emerald-400">8 projects</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">At Risk</span>
                <span className="text-xs text-amber-400">3 projects</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">Delayed</span>
                <span className="text-xs text-red-400">1 project</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full" style={{width: '8%'}}></div>
              </div>
            </div>
            <div className="text-center pt-2">
              <button className="text-xs text-slate-400 hover:text-slate-200">View all projects →</button>
            </div>
          </div>
        </GlassCard>

        {/* Cross-Team Activity */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Recent Activity</h3>
            <div className="text-xs text-slate-400">Last 24h</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Mobile project milestone reached</div>
                <div className="text-xs text-slate-400">2h ago • Team Alpha</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">API v2.0 sprint completed</div>
                <div className="text-xs text-slate-400">4h ago • Backend Team</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Security audit completed</div>
                <div className="text-xs text-slate-400">6h ago • Security Team</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Weekly retrospective</div>
                <div className="text-xs text-slate-400">1d ago • All Teams</div>
              </div>
            </div>
            <div className="text-center pt-2">
              <button className="text-xs text-slate-400 hover:text-slate-200">View activity feed →</button>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE
// ============================================================================
const GlassDashboardPage: React.FC = () => {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([
    { 
      id: 'ws1', 
      name: 'Software Development',
      color: 'bg-cyan-500',
      projects: [{ 
        id: 'p1', 
        name: 'App Development', 
        boards: [
          { 
            id: 'b1', 
            name: 'Development', 
            views: [
              { id: 'v1', name: 'Kanban', kind: 'kanban' },
              { id: 'v2', name: 'Table', kind: 'table' }
            ]
          }, 
          { 
            id: 'b2', 
            name: 'QA', 
            views: [
              { id: 'v3', name: 'Kanban', kind: 'kanban' },
              { id: 'v4', name: 'Table', kind: 'table' }
            ]
          }
        ] 
      }], 
      pinned: true 
    },
    { 
      id: 'ws2', 
      name: 'Marketing',
      color: 'bg-purple-500',
      projects: [{ 
        id: 'p2', 
        name: 'Product Launch', 
        boards: [
          { 
            id: 'b3', 
            name: 'Campaigns', 
            views: [
              { id: 'v5', name: 'Kanban', kind: 'kanban' },
              { id: 'v6', name: 'Table', kind: 'table' }
            ]
          },
          { 
            id: 'b4', 
            name: 'Content', 
            views: [
              { id: 'v7', name: 'Kanban', kind: 'kanban' },
              { id: 'v8', name: 'Table', kind: 'table' }
            ]
          },
          { 
            id: 'b5', 
            name: 'Analytics', 
            views: [
              { id: 'v9', name: 'Kanban', kind: 'kanban' },
              { id: 'v10', name: 'Table', kind: 'table' }
            ]
          }
        ] 
      }], 
      pinned: false 
    }
  ]);
  const [activeWsId, setActiveWsId] = React.useState('ws1');
  const [activeProjectId, setActiveProjectId] = React.useState('p1');
  const [activeBoardId, setActiveBoardId] = React.useState('b1');
  const [pinnedBoardIds, setPinnedBoardIds] = React.useState<string[]>(['b1', 'b2']); // Pin Development and QA boards
  const [showCreateWs, setShowCreateWs] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'boards' | 'project-home'>('boards');
  const [sidebarView, setSidebarView] = React.useState<'projects' | 'mytasks' | 'chat' | 'ai'>('projects');
  const [kanbanBoards, setKanbanBoards] = React.useState<Record<string, KanbanBoardData>>({});

  // Initialize kanban boards for all boards in all workspaces
  React.useEffect(() => {
    const initialBoards: Record<string, KanbanBoardData> = {};
    workspaces.forEach(workspace => {
      workspace.projects.forEach(project => {
        project.boards.forEach(board => {
          if (!initialBoards[board.id]) {
            initialBoards[board.id] = createInitialKanbanData();
          }
        });
      });
    });
    setKanbanBoards(initialBoards);
  }, [workspaces]);

  const activeWs = workspaces.find(w => w.id === activeWsId);
  const activeProject = activeWs?.projects.find(p => p.id === activeProjectId);
  const boards = activeProject?.boards || [];
  const activeBoard = boards.find(b => b.id === activeBoardId) || boards[0];

  const togglePinBoard = (id: string) => {
    setPinnedBoardIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const addBoard = () => {
    if (!activeProject) return;
    const timestamp = Date.now();
    const newBoard: Board = { 
      id: 'b' + timestamp, 
      name: 'New Board', 
      views: [
        { id: 'v' + timestamp + '1', name: 'Kanban', kind: 'kanban' },
        { id: 'v' + timestamp + '2', name: 'Table', kind: 'table' }
      ]
    };
    setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
      ...w,
      projects: w.projects.map(p => p.id === activeProjectId ? {
        ...p,
        boards: [...p.boards, newBoard]
      } : p)
    } : w));
    // Initialize kanban data for the new board
    setKanbanBoards(prev => ({
      ...prev,
      [newBoard.id]: createInitialKanbanData()
    }));
    setActiveBoardId(newBoard.id);
  };

  const addBoardToProject = (projectId: string) => {
    const timestamp = Date.now();
    const newBoard: Board = { 
      id: 'b' + timestamp, 
      name: 'New Board', 
      views: [
        { id: 'v' + timestamp + '1', name: 'Kanban', kind: 'kanban' },
        { id: 'v' + timestamp + '2', name: 'Table', kind: 'table' }
      ]
    };
    setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
      ...w,
      projects: w.projects.map(p => p.id === projectId ? {
        ...p,
        boards: [...p.boards, newBoard]
      } : p)
    } : w));
    // Initialize kanban data for the new board
    setKanbanBoards(prev => ({
      ...prev,
      [newBoard.id]: createInitialKanbanData()
    }));
    // Switch to the new board
    setActiveProjectId(projectId);
    setActiveBoardId(newBoard.id);
  };

  const renameBoard = (id: string, newName: string) => {
    setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
      ...w,
      projects: w.projects.map(p => p.id === activeProjectId ? {
        ...p,
        boards: p.boards.map(b => b.id === id ? { ...b, name: newName } : b)
      } : p)
    } : w));
  };

  const deleteBoard = (id: string) => {
    setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
      ...w,
      projects: w.projects.map(p => p.id === activeProjectId ? {
        ...p,
        boards: p.boards.filter(b => b.id !== id)
      } : p)
    } : w));
    
    // Remove kanban data for the deleted board
    setKanbanBoards(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    
    const remainingBoards = boards.filter(b => b.id !== id);
    if (activeBoardId === id && remainingBoards.length > 0) {
      setActiveBoardId(remainingBoards[0].id);
    }
    
    setPinnedBoardIds(prev => prev.filter(x => x !== id));
  };

  // Function to update kanban board data
  const updateKanbanBoard = (boardId: string, newData: KanbanBoardData) => {
    setKanbanBoards(prev => ({
      ...prev,
      [boardId]: newData
    }));
  };

  if (!activeBoard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-200 mb-4">No boards available</h1>
            <SoftButton onClick={addBoard} className="text-sm">Create First Board</SoftButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <TopBar
        workspaces={workspaces}
        activeWsId={activeWsId}
        setActiveWsId={setActiveWsId}
        onTogglePin={(id) => setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w))}
        projectName={activeProject?.name}
        boardName={currentView === 'boards' ? activeBoard.name : undefined}
        onProjectHome={() => {
          // Navigate to project home
          setSidebarView('projects');
          setCurrentView('project-home');
          console.log('Navigate to project home');
        }}
        onShowAllBoards={() => {
          // Show all boards for the current project
          setSidebarView('projects');
          setCurrentView('boards');
          console.log('Show all boards');
        }}
        onShowDashboard={() => {
          // Show dashboard for the current project
          setSidebarView('projects');
          setCurrentView('dashboard');
          console.log('Show dashboard');
        }}
      />

      <div className="flex">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <Sidebar
            workspace={activeWs}
            active={{ projectId: activeProjectId, boardId: activeBoardId }}
            onSelectProject={(id) => {
            setActiveProjectId(id);
            const project = activeWs?.projects.find(p => p.id === id);
            if (project?.boards[0]) {
              setActiveBoardId(project.boards[0].id);
            }
          }}
          onAddProject={() => {
            // TODO: Implement add project
            console.log('Add project clicked');
          }}
          onRenameProject={(id, newName) => {
            setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
              ...w,
              projects: w.projects.map(p => p.id === id ? { ...p, name: newName } : p)
            } : w));
          }}
          onDeleteProject={(id) => {
            if (window.confirm('Delete this project?')) {
              setWorkspaces(prev => prev.map(w => w.id === activeWsId ? {
                ...w,
                projects: w.projects.filter(p => p.id !== id)
              } : w));
            }
          }}
          onAddBoard={addBoardToProject}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
        />
        )}

        {/* Collapsed Sidebar Toggle */}
        {sidebarCollapsed && (
          <div className="pt-4 pl-2">
            <div className="px-3 py-3 mb-2">
              <button 
                onClick={() => setSidebarCollapsed(false)} 
                className="rounded-md p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors border border-white/10"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {sidebarView === 'mytasks' ? (
            <div className="h-full pt-16"> {/* Added pt-16 to account for top nav bar */}
              <MyTasksPage 
                workspace={activeWs} 
                currentUserId="1" // Replace with actual current user ID
                kanbanBoards={kanbanBoards}
                onTaskClick={(task) => {
                  // Navigate to the task's project and board
                  setActiveProjectId(task.projectId);
                  setActiveBoardId(task.boardId);
                  setSidebarView('projects');
                  setCurrentView('boards');
                }}
              />
            </div>
          ) : sidebarView === 'chat' ? (
            <div className="h-full pt-16"> {/* Added pt-16 to account for top nav bar */}
              <ChatPage 
                workspace={activeWs} 
                currentUserId="1" // Replace with actual current user ID
              />
            </div>
          ) : sidebarView === 'ai' ? (
            <div className="h-full pt-16"> {/* Added pt-16 to account for top nav bar */}
              <MindSyncAIPage 
                workspace={activeWs} 
                currentUserId="1" // Replace with actual current user ID
              />
            </div>
          ) : (
            <div className="mx-auto max-w-7xl px-4 py-6">
              {currentView === 'dashboard' ? (
                <DashboardScreen projectName={activeProject?.name || 'Project'} />
              ) : currentView === 'project-home' ? (
                <ProjectHomeScreen 
                  projectName={activeProject?.name || 'Project'} 
                  boards={boards}
                  onSelectBoard={(boardId) => {
                    setActiveBoardId(boardId);
                    setCurrentView('boards');
                  }}
                />
              ) : (
                <BoardScreen
                  board={activeBoard}
                  boards={boards}
                  onSelectBoard={setActiveBoardId}
                  onAddBoard={addBoard}
                  pinnedIds={pinnedBoardIds}
                  onTogglePin={togglePinBoard}
                  onRenameBoard={renameBoard}
                  onDeleteBoard={deleteBoard}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateWs && (
        <CreateWorkspaceModal
          open={showCreateWs}
          onClose={() => setShowCreateWs(false)}
          onCreate={(name, template) => {
            const newWs = seedWorkspaceByTemplate(name, template);
            setWorkspaces(prev => [...prev, newWs]);
            setActiveWsId(newWs.id);
            setShowCreateWs(false);
          }}
        />
      )}
    </div>
  );
};

export default GlassDashboardPage;
