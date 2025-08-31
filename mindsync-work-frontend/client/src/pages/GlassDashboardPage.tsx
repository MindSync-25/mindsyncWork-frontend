import React from "react";
import { createPortal } from 'react-dom';
import { Bell, Plus, Search, ChevronDown, ChevronRight, Activity, Star, StarOff, X, Building2, FolderPlus, ChevronLeft, MoreHorizontal, Home, Layers, BarChart3 } from "lucide-react";

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
const Avatar: React.FC<{ userId: string; className?: string }> = ({ userId, className }) => { const u = team.find(t=>t.id===userId)!; return <div className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow ${u.color} ${className}`} title={u.name}>{u.name[0]}</div>; };
const Assignees: React.FC<{ ids: readonly string[] }> = ({ ids }) => <div className="flex -space-x-2">{ids.map(id => <Avatar key={id} userId={id} />)}</div>;
const kanbanSeed = {
  Backlog: [ { id: "t1", title: "Implement user auth", tags:["backend"], assignees:["u3"], points:5 }, { id: "t2", title: "Design settings page", tags:["ui/ux"], assignees:["u2"], points:3 } ],
  Todo: [ { id: "t3", title: "Add invite flow", tags:["frontend"], assignees:["u1"], points:3 } ],
  "In Progress": [ { id: "t4", title: "CI pipeline for PRs", tags:["devops"], assignees:["u4"], points:5 }, { id: "t5", title: "Board drag & drop", tags:["frontend","ui"], assignees:["u1","u5"], points:8 } ],
  Review: [ { id: "t6", title: "Bug: avatar overflow", tags:["bug"], assignees:["u2"], points:2 } ],
  Done: [ { id: "t7", title: "Create project skeleton", tags:["infra"], assignees:["u3"], points:3 } ]
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
// SIDEBAR (Projects only, inline rename + per-project menu)
// ============================================================================
const Sidebar: React.FC<{ workspace: Workspace | undefined; active: { projectId?: string; boardId?: string }; onSelectProject:(id:string)=>void; onAddProject:()=>void; onRenameProject:(id:string,newName:string)=>void; onAddBoard:(projectId:string)=>void; onDeleteProject:(id:string)=>void; onCollapse:()=>void; }> = ({ workspace, active, onSelectProject, onAddProject, onRenameProject, onAddBoard, onDeleteProject, onCollapse }) => {
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
        <div className="flex items-center justify-between px-3 py-3 mb-2">
          <button onClick={onCollapse} aria-label="Collapse sidebar" className="rounded-md p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Projects</span>
          <div className="w-8" />
        </div>
        <GlassCard className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Projects</div>
            <button onClick={onAddProject} className="rounded-md px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10">+ New</button>
          </div>
          {projects.length===0 && <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-xs text-slate-500">No projects yet</div>}
          <div className="space-y-1">
            {projects.map(p=>{ const isActive=active.projectId===p.id; const open=menuFor===p.id; const isEditing=editingId===p.id; return (
              <div key={p.id} data-project-row className={`relative group flex items-center rounded-lg px-2 py-1.5 text-[13px] ${isActive?'bg-white/12 text-slate-100':'text-slate-300 hover:bg-white/6'}`}>
                {isEditing ? <input autoFocus value={editingValue} onChange={e=>setEditingValue(e.target.value)} onBlur={commitRename} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitRename(); } if(e.key==='Escape'){ e.preventDefault(); setEditingId(null); } }} className="mr-1 flex-1 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400/40"/> : <button className="flex-1 truncate text-left" onClick={()=>onSelectProject(p.id)} title={p.name}>{p.name}</button>}
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
          id: 't_' + Math.random().toString(36).slice(2,8), 
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
            <DevKanban data={data} onAddTaskViaModal={openNewTaskModal} onOpenEdit={openEditTaskModal} onMoveTask={moveTask} /> : 
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
    </div>
  );
};

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
const DevKanban: React.FC<{ data: KanbanBoardData; onAddTaskViaModal:(col:string)=>void; onOpenEdit:(col:string, task:KanbanTask)=>void; onMoveTask:(taskId:string, fromCol:string, toCol:string, newIndex?:number)=>void }> = ({ data, onAddTaskViaModal, onOpenEdit, onMoveTask }) => {
  const [draggedTask, setDraggedTask] = React.useState<{id:string; col:string} | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);

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

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCol: string) => {
    e.preventDefault();
    if (draggedTask) {
      onMoveTask(draggedTask.id, draggedTask.col, targetCol);
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
                return (
                  <FrostItem 
                    key={t.id} 
                    className={`p-2.5 cursor-pointer hover:ring-1 hover:ring-cyan-400/30 transition-all ${isDragging ? 'opacity-50 transform rotate-1 scale-105' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, t, c)}
                    onDragEnd={() => {setDraggedTask(null); setDragOverCol(null);}}
                    onClick={()=> onOpenEdit(c,t)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-slate-100 leading-snug truncate max-w-[140px]" title={t.title}>{t.title}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(dt.labels||t.tags||[]).slice(0,4).map(tag => <Pill key={tag} tone={tag==='bug'||dt.type==='Bug'?'red': tag==='devops'?'purple':'blue'}>{tag}</Pill>)}
                          {dt.priority && <Pill tone={dt.priority==='High'?'red': dt.priority==='Medium'?'amber':'neutral'}>{dt.priority[0]}</Pill>}
                        </div>
                      </div>
                      <Assignees ids={t.assignees} />
                    </div>
                    {dt.startedAt && <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1"><Activity className="h-3.5 w-3.5"/>Started {new Date(dt.startedAt).toLocaleDateString()}</div>}
                    <div className="mt-1 text-[9px] text-slate-500">(Drag to move • Click to edit)</div>
                  </FrostItem>
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

// Table view: one table per column
const BoardTableView: React.FC<{ 
  data: KanbanBoardData; 
  onAddTask:(col:string)=>void; 
  onMoveTask:(taskId:string, fromCol:string, toCol:string, newIndex?:number)=>void;
  onUpdateField:(col:string, taskId:string, field:string, value:string)=>void;
  onUpdateCore:(col:string, taskId:string, patch:Partial<DevKanbanTask>)=>void;
  customFieldsMap: Record<string,string[]>;
  onAddField:(phase:string, name:string)=>void;
}> = ({ data, onAddTask, onMoveTask, onUpdateField, onUpdateCore, customFieldsMap, onAddField }) => {
  const [draggedTask, setDraggedTask] = React.useState<{id:string; col:string} | null>(null);
  const [dragOverCol, setDragOverCol] = React.useState<string | null>(null);
  const [editingCell, setEditingCell] = React.useState<{task:string; field:string; col:string}|null>(null);
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
                  if (field === 'Type' || field === 'Status' || field === 'Priority') {
                    onUpdateCore(col, taskId, { [field.toLowerCase()]: customValue } as Partial<DevKanbanTask>);
                  } else {
                    onUpdateField(col, taskId, field, customValue);
                  }
                }
              } else {
                // Regular selection
                if (field === 'Type' || field === 'Status' || field === 'Priority') {
                  onUpdateCore(col, taskId, { [field.toLowerCase()]: newValue } as Partial<DevKanbanTask>);
                } else {
                  onUpdateField(col, taskId, field, newValue);
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
                    return (
                      <tr 
                        key={t.id} 
                        className={`hover:bg-white/5 cursor-move transition-all ${isDragging ? 'opacity-50 bg-cyan-500/10' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t, col)}
                        onDragEnd={() => {setDraggedTask(null); setDragOverCol(null);}}
                      >
                        <td className="px-4 py-2 text-slate-100 truncate max-w-[320px]" title={t.title}>
                          {renderEditableCell(t.title, t.id, 'Title', col)}
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
}> = ({ data, onAddTask, onAddField, onUpdateField, onUpdateCore, customFieldsMap }) => {
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
                  {renderEditable(task.title, task.id, 'title', column)}
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
  React.useEffect(()=>{ if(open){ setTitle(task?.title||''); setType(task?.type||'Task'); setPriority(task?.priority||'Medium'); setPoints(String(task?.points??1)); setLabels((task?.labels?.length? task.labels: task?.tags||[]).join(', ')); setAssignees(task?.assignees||[]); setSprint(task?.sprint||''); setDue(task?.due||''); } },[open,task]);
  if(!open) return null;
  const toggle=(id:string)=> setAssignees(a=> a.includes(id)? a.filter(x=>x!==id): [...a,id]);
  const save=()=>{ const pts=points.trim()===''? undefined:Number(points); const arr=labels.split(',').map(s=>s.trim()).filter(Boolean); onSave({ title:title.trim()||'Untitled', points:pts, assignees, tags: !isDev? arr: undefined, labels: isDev? arr: undefined, type:isDev? type: undefined, priority:isDev? priority: undefined, sprint:isDev? (sprint||undefined): undefined, due:isDev? (due||undefined): undefined }); };
  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <GlassCard className="relative z-10 w-[520px] max-w-[92vw] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">{mode==='new'? 'New Task':'Edit Task'} • {column}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-white/10"><X className="h-4 w-4"/></button>
        </div>
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
        <div className="mt-5 flex justify-end gap-2">
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
// DASHBOARD SCREEN
// ============================================================================
const DashboardScreen: React.FC<{ projectName: string; }> = ({ projectName }) => {
  const kpis = [
    { id: "kpi_sprint_progress", title: "Sprint Progress", value: "73%", trend: "+5%", color: "emerald" },
    { id: "kpi_velocity_avg3", title: "Velocity", value: "42", trend: "+8%", color: "cyan" },
    { id: "kpi_lead_time_p50", title: "Lead Time", value: "3.2d", trend: "-12%", color: "purple" },
    { id: "kpi_open_p0p1_bugs", title: "Critical Bugs", value: "2", trend: "-1", color: "red" },
    { id: "kpi_deploys_7d", title: "Deploys (7d)", value: "14", trend: "+3", color: "amber" },
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
          <h1 className="text-2xl font-bold text-slate-100">{projectName} Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Software development metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="blue" className="text-xs">Last 30 days</Pill>
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
        
        {/* Sprint Burndown - Compact */}
        <GlassCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Sprint Burndown</h3>
            <Pill tone="green" className="text-xs">On Track</Pill>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">73% Complete</div>
            <div className="text-xs text-slate-400">4 days remaining</div>
          </div>
          <MiniChart data={sprintData} type="line" color="emerald" height="h-12" />
        </GlassCard>

        {/* Velocity */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Velocity</h3>
            <div className="text-xs text-cyan-400">+8%</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">42 pts</div>
            <div className="text-xs text-slate-400">avg last 3</div>
          </div>
          <MiniChart data={velocityData} type="bar" color="cyan" height="h-10" />
        </GlassCard>

        {/* Test Coverage */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Test Coverage</h3>
            <div className="text-xs text-emerald-400">+2%</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">87%</div>
            <div className="text-xs text-slate-400">all suites</div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{width: '87%'}}></div>
          </div>
        </GlassCard>

        {/* PR Review Time */}
        <GlassCard className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">PR Review Time</h3>
            <div className="text-xs text-purple-400">Median</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">1.9h</div>
            <div className="text-xs text-slate-400">down from 2.4h</div>
          </div>
          <MiniChart data={prReviewTimes} type="line" color="purple" height="h-12" />
        </GlassCard>

        {/* Active PRs */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Active PRs</h3>
            <div className="text-xs text-amber-400">2 aging</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Ready to merge</span>
              <span className="text-emerald-400 font-medium">4</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">In review</span>
              <span className="text-cyan-400 font-medium">7</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Needs changes</span>
              <span className="text-amber-400 font-medium">2</span>
            </div>
          </div>
        </GlassCard>

        {/* Deploy Frequency */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">Deploy Freq</h3>
            <div className="text-xs text-emerald-400">+21%</div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-bold text-slate-100">2.3/day</div>
            <div className="text-xs text-slate-400">last 7 days</div>
          </div>
          <div className="flex items-center gap-1">
            {[3, 2, 4, 1, 3, 2, 1].map((deploys, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-6 rounded-sm mb-1 ${
                  deploys >= 3 ? 'bg-emerald-500/60' : 
                  deploys >= 2 ? 'bg-cyan-500/60' : 
                  'bg-slate-500/60'
                }`} style={{height: `${deploys * 8}px`}}></div>
                <div className="text-xs text-slate-500">{['M','T','W','T','F','S','S'][i]}</div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Bottom Row - More Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Blocked Items */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Blocked Items</h3>
            <Pill tone="red" className="text-xs">2 critical</Pill>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-400/20">
              <div>
                <div className="text-xs font-medium text-slate-200">Payment Integration</div>
                <div className="text-xs text-red-300">Blocked 3d • API issue</div>
              </div>
              <Pill tone="red" className="text-xs">P0</Pill>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-400/20">
              <div>
                <div className="text-xs font-medium text-slate-200">API Refactor</div>
                <div className="text-xs text-amber-300">Waiting approval</div>
              </div>
              <Pill tone="amber" className="text-xs">P1</Pill>
            </div>
            <div className="text-center">
              <button className="text-xs text-slate-400 hover:text-slate-200">View all blocked items →</button>
            </div>
          </div>
        </GlassCard>

        {/* Epic Progress */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Epic Progress</h3>
            <div className="text-xs text-slate-400">3 active</div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">User Authentication</span>
                <span className="text-xs text-emerald-400">85%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">Payment System</span>
                <span className="text-xs text-cyan-400">45%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-200">Mobile App</span>
                <span className="text-xs text-purple-400">12%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '12%'}}></div>
              </div>
            </div>
            <div className="text-center pt-2">
              <button className="text-xs text-slate-400 hover:text-slate-200">View roadmap →</button>
            </div>
          </div>
        </GlassCard>

        {/* Team Activity */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Team Activity</h3>
            <div className="text-xs text-slate-400">Today</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Bug fix deployed</div>
                <div className="text-xs text-slate-400">2h ago • Sam</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">PR merged to main</div>
                <div className="text-xs text-slate-400">4h ago • Ava</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Code review completed</div>
                <div className="text-xs text-slate-400">6h ago • Leo</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
              <div>
                <div className="text-xs text-slate-200">Sprint planning started</div>
                <div className="text-xs text-slate-400">1d ago • Team</div>
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
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'boards'>('boards');

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
    
    const remainingBoards = boards.filter(b => b.id !== id);
    if (activeBoardId === id && remainingBoards.length > 0) {
      setActiveBoardId(remainingBoards[0].id);
    }
    
    setPinnedBoardIds(prev => prev.filter(x => x !== id));
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
          // Navigate to project home - this could be a specific board or project dashboard
          console.log('Navigate to project home');
        }}
        onShowAllBoards={() => {
          // Show all boards for the current project
          setCurrentView('boards');
          console.log('Show all boards');
        }}
        onShowDashboard={() => {
          // Show dashboard for the current project
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
          <div className="mx-auto max-w-7xl px-4 py-6">
            {currentView === 'dashboard' ? (
              <DashboardScreen projectName={activeProject?.name || 'Project'} />
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
