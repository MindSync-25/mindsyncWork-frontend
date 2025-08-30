import React from "react";
import { createPortal } from 'react-dom';
import { Bell, Plus, Search, ChevronDown, ChevronRight, Activity, Star, StarOff, X, Building2, FolderPlus, Link as LinkIcon, ChevronLeft, MoreHorizontal } from "lucide-react";

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
      <div className="sticky top-4 space-y-3">
        {/* Sidebar header with collapse control (outside cards) */}
        <div className="flex items-center justify-between px-1">
          <button onClick={onCollapse} aria-label="Collapse sidebar" className="rounded-md p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Sidebar</span>
          <div className="w-5" />
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
// BOARD CONTENT VARIANTS
// ============================================================================
const BoardKanban: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void; onUpdateCore?:(col:string, taskId:string, patch:Partial<KanbanTask>)=>void }> = ({ data, onAddTask, onUpdateCore }) => {
  const [editing,setEditing]=React.useState<{col:string; id:string}|null>(null);
  const [draft,setDraft]=React.useState<{title:string; tags:string; points:string}>({ title:'', tags:'', points:'1' });
  const startEdit=(col:string,t:KanbanTask)=> { setEditing({col,id:t.id}); setDraft({ title:t.title, tags:t.tags.join(', '), points: String(t.points??'') }); };
  const commit=()=>{ if(!editing||!onUpdateCore) { setEditing(null); return; } const {col,id}=editing; const tags=draft.tags.split(',').map(s=>s.trim()).filter(Boolean); const pts = draft.points.trim()===''? undefined: Number(draft.points); onUpdateCore(col,id,{ title:draft.title, tags, points: pts } as any); setEditing(null); };
  const cancel=()=> setEditing(null);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-4 min-w-max">
        {data.order.map(c => (
          <GlassCard key={c} className="p-3 w-60 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-100 truncate max-w-[120px]" title={c}>{c}</span><Pill tone={c==='Done'? 'green': c==='Review'? 'amber':'neutral'}>{data.columns[c].length}</Pill></div>
              <SoftButton onClick={()=> onAddTask(c)} className="text-xs px-2 py-1">Add</SoftButton>
            </div>
            <div className="space-y-3">
              {data.columns[c].map(t => {
                const isEditing = editing && editing.id===t.id && editing.col===c;
                return (
                  <FrostItem key={t.id} className={`p-2.5 ${isEditing? 'ring-1 ring-cyan-400/40':''}`} onDoubleClick={()=> startEdit(c,t)}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input autoFocus value={draft.title} onChange={e=> setDraft(d=>({...d,title:e.target.value}))} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commit(); } if(e.key==='Escape'){ e.preventDefault(); cancel(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[12px] text-slate-100 outline-none focus:border-cyan-400/40" />
                        <input value={draft.tags} onChange={e=> setDraft(d=>({...d,tags:e.target.value}))} placeholder="tags comma" className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-200 outline-none focus:border-cyan-400/40" />
                        <input value={draft.points} type="number" onChange={e=> setDraft(d=>({...d,points:e.target.value}))} className="w-20 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-200 outline-none focus:border-cyan-400/40" />
                        <div className="flex gap-2 pt-1">
                          <SoftButton onClick={commit} className="text-[10px] px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200">Save</SoftButton>
                          <SoftButton onClick={cancel} className="text-[10px] px-2 py-1">Cancel</SoftButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div><div className="text-[13px] font-medium text-slate-100 leading-snug" title={t.title}>{t.title}</div><div className="mt-1 flex flex-wrap gap-1">{t.tags.map(tag => <Pill key={tag} tone={tag==='bug'?'red': tag==='devops'?'purple':'blue'}>{tag}</Pill>)}</div></div>
                          <Assignees ids={t.assignees} />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><div className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5"/>PR</div><div className="flex items-center gap-1"><Activity className="h-3.5 w-3.5"/>{t.points} pts</div></div>
                        <div className="mt-1 text-[9px] text-slate-500">(Double‑click to edit)</div>
                      </>
                    )}
                  </FrostItem>
                );
              })}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

// Table view: one table per column
const BoardTableView: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void }> = ({ data, onAddTask }) => {
  return (
    <div className="space-y-6">
      {data.order.map(col => {
        const tasks = data.columns[col];
        return (
          <GlassCard key={col} className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-100" title={col}>{col}</span><Pill tone={col==='Done'? 'green': col==='Review'? 'amber':'neutral'}>{tasks.length}</Pill></div>
              <SoftButton onClick={()=> onAddTask(col)} className="text-xs">+ Task</SoftButton>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-xs">
                <thead><tr className="sticky top-0 backdrop-blur bg-white/5">{['Title','Tags','Assignees','Points'].map(h => <th key={h} className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">{h}</th>)}</tr></thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.id} className="hover:bg-white/5">
                      <td className="px-4 py-2 text-slate-100 truncate max-w-[320px]" title={t.title}>{t.title}</td>
                      <td className="px-4 py-2 text-slate-300"><div className="flex flex-wrap gap-1">{t.tags.map(tag => <Pill key={tag} tone={tag==='bug'?'red': tag==='devops'?'purple':'blue'}>{tag}</Pill>)}</div></td>
                      <td className="px-4 py-2"><Assignees ids={t.assignees} /></td>
                      <td className="px-4 py-2 text-slate-300">{t.points}</td>
                    </tr>
                  ))}
                  {tasks.length===0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-[11px]">No tasks</td></tr>}
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
// BOARD SCREEN (secondary nav: board selector + view type pills)
// ============================================================================
const BoardScreen: React.FC<{ board: Board; boards: Board[]; onSelectBoard:(id:string)=>void; onAddBoard:()=>void; pinnedIds:string[]; onTogglePin:(id:string)=>void; onRenameBoard:(id:string,newName:string)=>void; onDeleteBoard:(id:string)=>void; }> = ({ board, boards, onSelectBoard, onAddBoard, pinnedIds, onTogglePin, onRenameBoard, onDeleteBoard }) => {
  const [openViews,setOpenViews]=React.useState(false);
  const [viewType,setViewType]=React.useState<'kanban'|'table'|'calendar'|'gantt'|'timeline'>('kanban');
  const [kanbanBoards,setKanbanBoards]=React.useState<Record<string, KanbanBoardData>>({});
  const [addingGroup,setAddingGroup]=React.useState(false);
  const [groupName,setGroupName]=React.useState("");
  // Development custom field columns per board id -> per phase
  const [devCustomFields,setDevCustomFields]=React.useState<Record<string, Record<string,string[]>>>({});
  const [showAllBoards,setShowAllBoards]=React.useState(false);
  const [boardSearch,setBoardSearch]=React.useState("");
  // const [boardMenuOpen,setBoardMenuOpen]=React.useState(false); // replaced with menuBoardId
  const [menuBoardId,setMenuBoardId]=React.useState<string|null>(null);
  const [editingBoardId,setEditingBoardId]=React.useState<string|null>(null);
  const [boardNameDraft,setBoardNameDraft]=React.useState("");
  const [menuPos,setMenuPos]=React.useState<{x:number;y:number}|null>(null);
  React.useEffect(()=>{ setViewType('kanban'); setMenuBoardId(null); setEditingBoardId(null); },[board.id]);
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
  const pinnedList = boards.filter(b=> pinnedSet.has(b.id));
  const activePinnedMissing = !pinnedSet.has(board.id);
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
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Pinned boards pills */}
        <div className="relative flex items-center gap-2 overflow-x-auto max-w-full py-1 pl-1 pr-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 shrink-0">Boards:</span>
          <div className="flex items-center gap-1">
            {(pinnedList.length? pinnedList: [board]).map(b => {
              const editing = editingBoardId===b.id; const isActive = b.id===board.id; return (
              <div key={b.id} className="relative group">
                {editing ? (
                  <input id="board-rename-input" value={boardNameDraft} onChange={e=>setBoardNameDraft(e.target.value)} onBlur={commitRename} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitRename(); } if(e.key==='Escape'){ e.preventDefault(); setEditingBoardId(null); } }} className="rounded-lg px-3 py-1.5 text-[12px] font-medium bg-white/10 border border-cyan-400/40 text-cyan-100 outline-none w-32" />
                ) : (
                  <button onClick={()=> onSelectBoard(b.id)} className={`relative rounded-lg px-3 py-1.5 text-[12px] font-medium transition group ${isActive? 'bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]':'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-slate-200'}`} title={b.name}>
                    {b.name}
                    {isActive && <span className="absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"/>}
                  </button>
                )}
                {!editing && (
                  <button
                    data-board-menu-trigger
                    onClick={(e)=> {
                      e.stopPropagation();
                      // Toggle logic with safe rect capture
                      if(menuBoardId === b.id) { setMenuBoardId(null); setMenuPos(null); return; }
                      const btn = e.currentTarget as HTMLElement | null;
                      if(!btn) return; // safety
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
            {activePinnedMissing && pinnedList.length>0 && (
              <div className="relative group">
                {editingBoardId===board.id ? (
                  <input id="board-rename-input" value={boardNameDraft} onChange={e=>setBoardNameDraft(e.target.value)} onBlur={commitRename} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); commitRename(); } if(e.key==='Escape'){ e.preventDefault(); setEditingBoardId(null); } }} className="rounded-lg px-3 py-1.5 text-[12px] font-medium bg-white/10 border border-cyan-400/40 text-cyan-100 outline-none w-32" />
                ) : (
                  <button onClick={()=> onSelectBoard(board.id)} className={`relative rounded-lg px-3 py-1.5 text-[12px] font-medium transition group bg-cyan-500/25 text-cyan-100 ring-1 ring-cyan-400/40 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]`} title={board.name}>
                    {board.name}
                    <span className="absolute inset-x-1 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent"/>
                  </button>
                )}
                {editingBoardId!==board.id && (
                  <button data-board-menu-trigger onClick={(e)=> {
                    e.stopPropagation();
                    if(menuBoardId === board.id) { setMenuBoardId(null); setMenuPos(null); return; }
                    const btn = e.currentTarget as HTMLElement | null;
                    if(!btn) return;
                    const r = btn.getBoundingClientRect();
                    setMenuPos({ x: Math.min(r.left, window.innerWidth-240), y: r.bottom });
                    setMenuBoardId(board.id);
                  }} className="absolute -right-2 -top-2 rounded-full bg-[#0d141b] border border-white/10 p-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 opacity-0 scale-90 pointer-events-none transition group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto" title="Board actions"><MoreHorizontal className="h-3.5 w-3.5"/></button>
                )}
              </div>
            )}
            <button onClick={()=> setShowAllBoards(true)} className="rounded-lg px-2 py-1.5 text-[12px] font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10">All Boards</button>
          </div>
          {/* removed inline cramped menu */}
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
          {/* Removed + Table Column from nav – now per-table header */}
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
      {viewType==='kanban' && data && (board.name==='Development'? <DevKanban data={data} onAddTask={addTask}/> : <BoardKanban data={data} onAddTask={addTask} onUpdateCore={(col,id,patch)=> updateTaskCore(col,id,patch as any)} />)}
      {viewType==='table' && data && (board.name==='Development'? <DevTableView data={data} onAddTask={addTask} customFieldsMap={devCustomFields[board.id]||{}} onAddField={(phase, name)=> setDevCustomFields(prev=> { const cur = prev[board.id] || {}; const list = cur[phase] || []; if(list.includes(name)) return prev; return { ...prev, [board.id]: { ...cur, [phase]: [...list, name] } }; })} onUpdateField={updateTaskField} onUpdateCore={updateTaskCore}/> : <BoardTableView data={data} onAddTask={addTask} />)}
      {viewType!=='kanban' && viewType!=='table' && <GlassCard className="p-10 text-center text-sm text-slate-300"><div className="text-base font-semibold text-slate-100 mb-1">{viewLabel} View</div><div className="text-slate-400">Placeholder – coming soon.</div></GlassCard>}
    </div>
  );
};

// ============================================================================
// TOP BAR
// ============================================================================
const TopBar: React.FC<{ workspaces: Workspace[]; activeWsId: string; setActiveWsId:(id:string)=>void; onTogglePin:(id:string)=>void; projectName?: string; boardName?: string; }> = ({ workspaces, activeWsId, setActiveWsId, onTogglePin, projectName, boardName }) => (
  <div className="sticky top-0 z-50">
    <div className="mx-auto -mb-4 max-w-7xl px-4">
      <div className="relative rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-2xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800" />
            <span className="hidden sm:block text-[13px] font-semibold tracking-wide text-slate-100">MindSync Work</span>
            <span className="mx-2 text-slate-600">•</span>
            <WorkspaceSwitcher workspaces={workspaces} activeId={activeWsId} onSelect={setActiveWsId} onCreate={()=> setShowCreateWs && setShowCreateWs(true)} onTogglePin={onTogglePin} />
            {projectName && (<><ChevronRight className="h-4 w-4 text-slate-600"/><span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">{projectName}</span></>)}
            {boardName && (<><ChevronRight className="h-4 w-4 text-slate-600"/><span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">{boardName}</span></>)}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-400"><Search className="h-4 w-4"/><input placeholder="Search" className="w-40 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"/></div>
            <SoftButton className="p-2"><Bell className="h-4 w-4 text-slate-300"/></SoftButton>
            <SoftButton className="text-xs"><Plus className="mr-1 inline h-3.5 w-3.5"/> New</SoftButton>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function GlassDashboardPage() {
  const [workspaces,setWorkspaces]=React.useState<Workspace[]>(SEED_WORKSPACES);
  const [activeWsId,setActiveWsId]=React.useState(workspaces[0].id);
  const [showCreate,_setShowCreate]=React.useState(false); setShowCreateWs=_setShowCreate;
  const [sidebarOpen,setSidebarOpen]=React.useState(true);
  const activeWs = workspaces.find(w=>w.id===activeWsId);
  const [active,setActive]=React.useState<{projectId?:string; boardId?:string}>({ projectId: activeWs?.projects[0]?.id, boardId: activeWs?.projects[0]?.boards[0]?.id });
  const [pinnedBoards,setPinnedBoards]=React.useState<Record<string,string[]>>({});
  // Initialize pinned boards on first load so existing boards show immediately (up to 3)
  React.useEffect(()=>{
    if(!activeWs) return;
    setPinnedBoards(prev => {
      let changed = false;
      const next = { ...prev };
      activeWs.projects.forEach(p => {
        if(!next[p.id] || next[p.id].length===0) {
          next[p.id] = p.boards.slice(0,3).map(b=>b.id);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  },[activeWsId]);
  React.useEffect(()=>{ const ws=workspaces.find(w=>w.id===activeWsId); setActive({ projectId: ws?.projects[0]?.id, boardId: ws?.projects[0]?.boards[0]?.id }); },[activeWsId, workspaces]);
  const project = activeWs?.projects.find(p=>p.id===active.projectId);
  const board = project?.boards.find(b=>b.id===active.boardId);
  const hasProjects = !!activeWs && activeWs.projects.length>0;

  function handleCreateWorkspace(name:string, template:string){ const ws=seedWorkspaceByTemplate(name, template); setWorkspaces(prev=>[ws,...prev]); setActiveWsId(ws.id); }
  function togglePinWorkspace(id:string){ setWorkspaces(prev=> prev.map(w=> w.id===id? {...w, pinned: !w.pinned}: w)); }
  function addProject(){ setWorkspaces(prev=> prev.map(w=> { if(w.id!==activeWsId) return w; const newPid=`p_${Math.random().toString(36).slice(2,8)}`; const newBid=`b_${Math.random().toString(36).slice(2,8)}`; const newProject:Project={ id:newPid, name:`Project ${w.projects.length+1}`, boards:[{ id:newBid, name: `Board 1`, views:[viewHome, viewKanban, viewTable, viewRoadmap] }] }; setTimeout(()=> setActive({ projectId:newPid, boardId:newBid }),0); return { ...w, projects: [...w.projects, newProject] }; })); }
  function renameProject(pid:string, newName:string){ setWorkspaces(prev=> prev.map(w=> w.id===activeWsId? { ...w, projects: w.projects.map(p=> p.id===pid? {...p, name:newName}: p) }: w)); }
  function addBoard(projectId:string){
    setWorkspaces(prev => prev.map(w => {
      if (w.id !== activeWsId) return w;
      return {
        ...w,
        projects: w.projects.map(p => {
          if (p.id !== projectId) return p;
          const existingBoardIds = p.boards.map(b=>b.id); // capture before adding
          const newBid = `b_${Math.random().toString(36).slice(2,8)}`;
          const newBoard: Board = { id: newBid, name: `Board ${p.boards.length+1}`, views:[viewHome, viewKanban, viewTable, viewRoadmap] };
          // defer state side-effects post render
          setTimeout(() => {
            setActive(a => a.projectId === projectId ? { ...a, boardId: newBid } : a);
            setPinnedBoards(pb => {
              const cur = pb[projectId] || [];
              if (cur.length === 0) {
                // First time establishing pins: include all existing boards (pre-add) plus the new one (up to 3)
                // This ensures if there were 2 boards (e.g., Development, QA) adding a third shows all 3 pinned.
                let combined = [...existingBoardIds, newBid];
                // If active board wasn't first in original list, keep original ordering from project definition.
                // Remove duplicates just in case.
                combined = combined.filter((id,idx,arr)=> arr.indexOf(id)===idx).slice(0,3);
                return { ...pb, [projectId]: combined };
              }
              if (cur.length < 3 && !cur.includes(newBid)) {
                return { ...pb, [projectId]: [...cur, newBid] };
              }
              return pb;
            });
          }, 0);
          return { ...p, boards: [...p.boards, newBoard] };
        })
      };
    }));
  }
  function togglePinBoard(boardId:string){ if(!active.projectId) return; const pid=active.projectId; setPinnedBoards(prev=> { const cur=prev[pid]||[]; const exists=cur.includes(boardId); if(exists) return { ...prev, [pid]: cur.filter(id=>id!==boardId) }; if(cur.length>=3) return prev; return { ...prev, [pid]: [...cur, boardId] }; }); }
  function deleteProject(projectId:string){ if(!window.confirm('Delete this project?')) return; setWorkspaces(prev=> prev.map(w=> w.id===activeWsId? { ...w, projects: w.projects.filter(p=> p.id!==projectId) }: w)); if(active.projectId===projectId){ const ws=workspaces.find(w=>w.id===activeWsId); const next=ws?.projects.find(p=>p.id!==projectId); setActive({ projectId: next?.id, boardId: next?.boards[0]?.id }); } }
  function renameBoard(projectId:string, boardId:string, newName:string){ setWorkspaces(prev=> prev.map(w=> w.id===activeWsId? { ...w, projects: w.projects.map(p=> p.id===projectId? { ...p, boards: p.boards.map(b=> b.id===boardId? {...b, name:newName}: b) }: p) }: w)); }
  function deleteBoard(projectId:string, boardId:string){ setWorkspaces(prev=> prev.map(w=> w.id===activeWsId? { ...w, projects: w.projects.map(p=> { if(p.id!==projectId) return p; const remaining = p.boards.filter(b=> b.id!==boardId); return { ...p, boards: remaining }; }) }: w)); setPinnedBoards(prev=> ({ ...prev, [projectId]: (prev[projectId]||[]).filter(id=> id!==boardId) })); setActive(a=> { if(a.boardId===boardId){ const proj = workspaces.find(w=>w.id===activeWsId)?.projects.find(p=>p.id===projectId); const next = proj?.boards.find(b=> b.id!==boardId); return { projectId, boardId: next?.id }; } return a; }); }

  return (
    <div className="min-h-screen w-full relative text-slate-100 bg-[#0b1017] bg-[radial-gradient(900px_600px_at_0%_0%,rgba(12,148,196,0.22),transparent),radial-gradient(800px_520px_at_100%_10%,rgba(139,92,246,0.20),transparent),radial-gradient(700px_500px_at_50%_100%,rgba(236,72,153,0.18),transparent),linear-gradient(180deg,#0b1017,#0b1017)]">
      <div className="pointer-events-none fixed inset-0" style={{ backgroundImage: noiseBg, opacity:0.25 }} />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] mix-blend-soft-light" />
      <TopBar workspaces={workspaces} activeWsId={activeWsId} setActiveWsId={setActiveWsId} onTogglePin={togglePinWorkspace} projectName={project?.name} boardName={board?.name} />
      <main className="relative mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-6">
          {sidebarOpen && (
            <Sidebar workspace={activeWs} active={active} onSelectProject={(pid)=>{ const proj=activeWs?.projects.find(p=>p.id===pid); setActive({ projectId: pid, boardId: proj?.boards[0]?.id }); }} onAddProject={addProject} onRenameProject={renameProject} onAddBoard={addBoard} onDeleteProject={deleteProject} onCollapse={()=> setSidebarOpen(false)} />
          )}
          {!sidebarOpen && (
            <div className="hidden md:flex w-8 shrink-0 flex-col items-center pt-4 border-r border-white/10">
              <button onClick={()=>setSidebarOpen(true)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10" aria-label="Expand sidebar"><ChevronRight className="h-4 w-4"/></button>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {!hasProjects ? (
              <GlassCard className="grid h-[420px] place-items-center p-10 text-center">
                <div><h2 className="text-lg font-semibold text-slate-100">This workspace is brand new ✨</h2><p className="mt-1 text-slate-400">Create your first project or use a Quick Start to seed sample data.</p><div className="mt-4 flex items-center justify-center gap-2"><SoftButton onClick={addProject} className="font-medium text-cyan-200 hover:text-cyan-100">New Project</SoftButton><SoftButton onClick={()=> setShowCreateWs && setShowCreateWs(true)} className="font-medium">Quick Start</SoftButton></div></div>
              </GlassCard>
            ) : board ? (
              <BoardScreen board={board} boards={project!.boards} onSelectBoard={(id)=> setActive(a=> ({ ...a, boardId: id }))} onAddBoard={()=> addBoard(project!.id)} pinnedIds={pinnedBoards[project!.id]||[]} onTogglePin={togglePinBoard} onRenameBoard={(bid,newName)=> renameBoard(project!.id,bid,newName)} onDeleteBoard={(bid)=> deleteBoard(project!.id,bid)} />
            ) : (
              <GlassCard className="p-6">Select a board to get started.</GlassCard>
            )}
          </div>
        </div>
      </main>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0b1017] border-r border-white/10 p-4 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Projects</span><button onClick={()=>setSidebarOpen(false)} className="rounded-md px-2 py-1 text-[11px] text-slate-300 hover:bg-white/10">Close</button></div>
            <div className="space-y-1">
              {activeWs?.projects.map(p=> (
                <button key={p.id} onClick={()=>{ const first=p.boards[0]; setActive({ projectId:p.id, boardId:first?.id }); setSidebarOpen(false); }} className={`w-full rounded-lg px-2 py-1.5 text-left text-[13px] ${p.id===active.projectId?'bg-white/12 text-slate-100':'text-slate-300 hover:bg-white/6'}`}>{p.name}</button>
              ))}
            </div>
            <div className="mt-3"><SoftButton onClick={()=>{ addProject(); }} className="w-full justify-center text-xs">+ New Project</SoftButton></div>
          </div>
        </div>
      )}
      <footer className="relative mx-auto max-w-7xl px-4 pb-10 text-center text-xs text-slate-500">Multi-workspace demo • Board secondary nav • Collapsible sidebar</footer>
      <CreateWorkspaceModal open={showCreate} onClose={()=> _setShowCreate(false)} onCreate={handleCreateWorkspace} />
    </div>
  );
}

// Development task extensions (non-breaking optional fields)
// Replaced interface with type alias for compatibility with certain JS parsers
// interface DevKanbanTask extends KanbanTask { ... }
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

// Priority / risk weight helpers
const priorityWeight = (p?:string)=> p==='High'?0: p==='Medium'?1: p==='Low'?2: 3;
const riskWeight = priorityWeight; // same ordering

// Dev-specific Kanban component
const DevKanban: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void }> = ({ data, onAddTask }) => (
  <div className="overflow-x-auto pb-2">
    <div className="flex items-start gap-4 min-w-max">
      {data.order.map(c => (
        <GlassCard key={c} className="p-3 w-64 shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-sm font-semibold text-slate-100 truncate max-w-[140px]" title={c}>{c}</span><Pill tone={c==='Done'? 'green': c==='In Review'? 'amber': c==='Ready for QA'? 'purple':'neutral'}>{data.columns[c].length}</Pill></div>
            <SoftButton onClick={()=> onAddTask(c)} className="text-xs px-2 py-1">Add</SoftButton>
          </div>
          <div className="space-y-3">
            {data.columns[c].map(t => {
              const dt = t as DevKanbanTask;
              return (
                <FrostItem key={t.id} className="p-2.5">
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
                </FrostItem>
              );
            })}
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

// Remove previous DevTableView duplicate if exists (kept only dynamic version)
const DevTableView: React.FC<{ data: KanbanBoardData; onAddTask:(col:string)=>void; customFieldsMap:Record<string,string[]>; onAddField:(phase:string,name:string)=>void; onUpdateField:(col:string, taskId:string, field:string, value:string)=>void; onUpdateCore?:(col:string, taskId:string, patch:Partial<DevKanbanTask>)=>void }> = ({ data, onAddTask, customFieldsMap, onAddField, onUpdateField, onUpdateCore }) => {
  const columnConfigs: Record<string,{ columns:string[]; sort:(a:DevKanbanTask,b:DevKanbanTask)=>number; wipCap?: number | ((tasks:DevKanbanTask[])=>number) }> = {
    'Backlog': { columns:['Title','Type','Priority','Points','Labels','Reporter','Created','Epic'], sort:(a,b)=>{ const pw = priorityWeight(a.priority)-priorityWeight(b.priority); if(pw!==0) return pw; return (a.createdAt||0)-(b.createdAt||0); } },
    'To Do': { columns:['Title','Priority','Points','Assignee','Sprint','Due','Epic'], sort:(a,b)=>{ const pw = priorityWeight(a.priority)-priorityWeight(b.priority); if(pw!==0) return pw; return ((a.due?Date.parse(a.due):Infinity) - (b.due?Date.parse(b.due):Infinity)); } },
    'In Progress': { columns:['Title','Assignee','Points','Sprint','Branch/PR','CI','Labels','StartedAt'], sort:(a,b)=> (a.startedAt||Infinity)-(b.startedAt||Infinity), wipCap:(tasks)=> Math.ceil(tasks.reduce((s,t)=> s + (t.assignees.length||1),0) * 1.5) },
    'In Review': { columns:['Title','Assignee','Reviewer','PR','CI','Approvals','Changes?'], sort:(a,b)=> (a.createdInReviewAt||Infinity)-(b.createdInReviewAt||Infinity), wipCap:(tasks)=> tasks.length*1 },
    'Ready for QA': { columns:['Title','Build/Env','TestSuite','QA Ticket','QA Assignee','Risk'], sort:(a,b)=> { const rw=riskWeight(a.risk)-riskWeight(b.risk); if(rw!==0) return rw; return (a.createdAt||0)-(b.createdAt||0); } },
    'Done': { columns:['Title','DeployedAt','Release','CycleTime','Reviewer','ClosedBy'], sort:(a,b)=> (b.deployedAt||0)-(a.deployedAt||0) }
  };
  const defaultConfig = { columns:['Title','Assignee','Points','Labels'], sort:(a:DevKanbanTask,b:DevKanbanTask)=> (a.createdAt||0)-(b.createdAt||0) };
  const [addingFieldFor,setAddingFieldFor]=React.useState<string|null>(null);
  const [fieldValue,setFieldValue]=React.useState("");
  const [editing,setEditing]=React.useState<{taskId:string; col:string}|null>(null);
  const [optionSets,setOptionSets] = React.useState<{priority:string[]; type:string[]; risk:string[]; ciStatus:string[]}>({ priority:['Low','Medium','High'], type:['Feature','Bug','Chore','Task'], risk:['Low','Medium','High'], ciStatus:['Passing','Failing','Pending'] });
  const priorityOptions = optionSets.priority; const typeOptions = optionSets.type; const riskOptions = optionSets.risk; const ciOptions = optionSets.ciStatus;
  const addCustomOption = (field:keyof typeof optionSets, value:string)=> setOptionSets(prev=> prev[field].includes(value)? prev : { ...prev, [field]: [...prev[field], value] });
  const commitSelectValue = (val:string, opts:string[], allowCustom=true)=> !opts.includes(val) && val!=='' && allowCustom? val : (val||'');
  const startEdit = (taskId:string,col:string)=> setEditing({taskId,col});
  const stopEdit = ()=> setEditing(null);
  const saveCore = (phase:string, taskId:string, patch:Partial<DevKanbanTask>)=> { onUpdateCore && onUpdateCore(phase, taskId, patch); };
  const handleSelectChange = (phase:string, taskId:string, field:keyof DevKanbanTask, e:React.ChangeEvent<HTMLSelectElement>)=> {
    let v = e.target.value;
    if(v==='__custom') { const custom = window.prompt('Enter custom value'); if(custom && custom.trim()){ v=custom.trim(); if(field==='priority') addCustomOption('priority', v); else if(field==='type') addCustomOption('type', v); else if(field==='risk') addCustomOption('risk', v); else if(field==='ciStatus') addCustomOption('ciStatus', v);} else return; }
    saveCore(phase, taskId, { [field]: v } as any); stopEdit();
  };
  const stopOnBlur = (e:React.FocusEvent<any>)=> { if(e.relatedTarget && (e.currentTarget.contains(e.relatedTarget as Node))) return; stopEdit(); };
  const renderEditable = (phase:string, t:DevKanbanTask, col:string) => {
    const isEditing = editing && editing.taskId===t.id && editing.col===col;
    if(!isEditing){
      const commonTd = (children:React.ReactNode, extra="") => <td onDoubleClick={()=> startEdit(t.id,col)} className={`px-4 py-2 text-slate-300 cursor-text ${extra}`}>{children}</td>;
      switch(col){
        case 'Title': return commonTd(<span className="text-slate-100" title={t.title}>{t.title}</span>, 'max-w-[260px] truncate');
        case 'Priority': return commonTd(t.priority? <Pill tone={t.priority==='High'?'red': t.priority==='Medium'?'amber':'neutral'}>{t.priority}</Pill>:'—');
        case 'Type': return commonTd(t.type||'—');
        case 'Risk': return commonTd(t.risk? <Pill tone={t.risk==='High'?'red': t.risk==='Medium'?'amber':'neutral'}>{t.risk}</Pill>:'—');
        case 'Points': return commonTd(t.points??'—');
        case 'Labels': return commonTd(<div className="flex flex-wrap gap-1">{(t.labels||t.tags||[]).slice(0,4).map(l=> <Pill key={l} tone={l==='bug'||t.type==='Bug'?'red':'blue'}>{l}</Pill>)}</div>);
        case 'Reporter': return commonTd(t.reporter||'—');
        case 'Epic': return commonTd(t.epicId||'—');
        case 'Assignee': return commonTd(<Assignees ids={t.assignees}/>);
        case 'Sprint': return commonTd(t.sprint||'—');
        case 'Due': return commonTd(t.due||'—');
        case 'Branch/PR': return commonTd(t.prLink||t.branch||'—');
        case 'CI': return commonTd(t.ciStatus||'—');
        case 'StartedAt': return commonTd(t.startedAt? new Date(t.startedAt).toLocaleDateString():'—');
        case 'Reviewer': return commonTd(t.reviewer||'—');
        case 'PR': return commonTd(t.prLink? 'PR':'—');
        case 'Approvals': return commonTd(t.approvals??'—');
        case 'Changes?': return <td className="px-4 py-2 text-slate-300 cursor-pointer" onClick={()=> saveCore(phase, t.id, { changesRequested: !t.changesRequested })}>{t.changesRequested? 'Yes':'—'}</td>;
        case 'Build/Env': return commonTd(t.buildEnv||'—');
        case 'TestSuite': return commonTd(t.testSuite||'—');
        case 'QA Ticket': return commonTd(t.qaTicketId||'—');
        case 'QA Assignee': return commonTd(t.qaAssignee||'—');
        case 'DeployedAt': return commonTd(t.deployedAt? new Date(t.deployedAt).toLocaleDateString():'—');
        case 'Release': return commonTd(t.release||'—');
        case 'CycleTime': return commonTd(t.cycleTime? Math.round(t.cycleTime/86400000)+'d':'—');
        case 'ClosedBy': return commonTd(t.closedBy||'—');
        case 'Created': return commonTd(t.createdAt? new Date(t.createdAt).toLocaleDateString():'—');
        default: return commonTd('—');
      }
    }
    // Editing mode
    switch(col){
      case 'Title': return <td className="px-4 py-1"><input autoFocus defaultValue={t.title} onBlur={e=>{ saveCore(phase, t.id, { title:e.target.value }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ title:(e.target as HTMLInputElement).value }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-cyan-400/40"/></td>;
      case 'Priority': return <td className="px-4 py-1"><select autoFocus defaultValue={commitSelectValue(t.priority||'',priorityOptions)} onChange={e=> handleSelectChange(phase,t.id,'priority',e)} onBlur={stopOnBlur} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"><option value="">—</option>{priorityOptions.map(o=> <option key={o}>{o}</option>)}<option value="__custom">Custom…</option></select></td>;
      case 'Type': return <td className="px-4 py-1"><select autoFocus defaultValue={commitSelectValue(t.type||'',typeOptions)} onChange={e=> handleSelectChange(phase,t.id,'type',e)} onBlur={stopOnBlur} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"><option value="">—</option>{typeOptions.map(o=> <option key={o}>{o}</option>)}<option value="__custom">Custom…</option></select></td>;
      case 'Risk': return <td className="px-4 py-1"><select autoFocus defaultValue={commitSelectValue(t.risk||'',riskOptions)} onChange={e=> handleSelectChange(phase,t.id,'risk',e)} onBlur={stopOnBlur} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"><option value="">—</option>{riskOptions.map(o=> <option key={o}>{o}</option>)}<option value="__custom">Custom…</option></select></td>;
      case 'CI': return <td className="px-4 py-1"><select autoFocus defaultValue={commitSelectValue(t.ciStatus||'',ciOptions)} onChange={e=> handleSelectChange(phase,t.id,'ciStatus',e)} onBlur={stopOnBlur} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"><option value="">—</option>{ciOptions.map(o=> <option key={o}>{o}</option>)}<option value="__custom">Custom…</option></select></td>;
      case 'Points': return <td className="px-4 py-1"><input type="number" autoFocus defaultValue={t.points??''} onBlur={e=>{ const v=e.target.value; saveCore(phase,t.id,{ points: v===''? undefined: Number(v) }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ const v=(e.target as HTMLInputElement).value; saveCore(phase,t.id,{ points: v===''? undefined: Number(v) }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-20 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Approvals': return <td className="px-4 py-1"><input type="number" autoFocus defaultValue={t.approvals??''} onBlur={e=>{ const v=e.target.value; saveCore(phase,t.id,{ approvals: v===''? undefined: Number(v) }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ const v=(e.target as HTMLInputElement).value; saveCore(phase,t.id,{ approvals: v===''? undefined: Number(v) }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-20 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Reporter': return <td className="px-4 py-1"><input autoFocus defaultValue={t.reporter||''} onBlur={e=>{ saveCore(phase,t.id,{ reporter:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ reporter:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Epic': return <td className="px-4 py-1"><input autoFocus defaultValue={t.epicId||''} onBlur={e=>{ saveCore(phase,t.id,{ epicId:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ epicId:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Sprint': return <td className="px-4 py-1"><input autoFocus defaultValue={t.sprint||''} onBlur={e=>{ saveCore(phase,t.id,{ sprint:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ sprint:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-32 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Due': return <td className="px-4 py-1"><input type="date" autoFocus defaultValue={t.due||''} onBlur={e=>{ saveCore(phase,t.id,{ due:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ due:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Branch/PR': return <td className="px-4 py-1"><input autoFocus defaultValue={t.prLink||t.branch||''} onBlur={e=>{ const v=e.target.value.trim(); const patch:Partial<DevKanbanTask>={}; if(v.startsWith('http')) patch.prLink=v; else patch.branch=v; saveCore(phase,t.id,patch); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ const v=(e.target as HTMLInputElement).value.trim(); const patch:Partial<DevKanbanTask>={}; if(v.startsWith('http')) patch.prLink=v; else patch.branch=v; saveCore(phase,t.id,patch); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Build/Env': return <td className="px-4 py-1"><input autoFocus defaultValue={t.buildEnv||''} onBlur={e=>{ saveCore(phase,t.id,{ buildEnv:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ buildEnv:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-40 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'TestSuite': return <td className="px-4 py-1"><input autoFocus defaultValue={t.testSuite||''} onBlur={e=>{ saveCore(phase,t.id,{ testSuite:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ testSuite:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-40 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'QA Ticket': return <td className="px-4 py-1"><input autoFocus defaultValue={t.qaTicketId||''} onBlur={e=>{ saveCore(phase,t.id,{ qaTicketId:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ qaTicketId:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-36 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'QA Assignee': return <td className="px-4 py-1"><input autoFocus defaultValue={t.qaAssignee||''} onBlur={e=>{ saveCore(phase,t.id,{ qaAssignee:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ qaAssignee:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-32 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'DeployedAt': return <td className="px-4 py-1"><input type="date" autoFocus defaultValue={t.deployedAt? new Date(t.deployedAt).toISOString().slice(0,10):''} onBlur={e=>{ saveCore(phase,t.id,{ deployedAt: e.target.value? Date.parse(e.target.value): undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ const v=(e.target as HTMLInputElement).value; saveCore(phase,t.id,{ deployedAt: v? Date.parse(v): undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Reviewer': return <td className="px-4 py-1"><input autoFocus defaultValue={t.reviewer||''} onBlur={e=>{ saveCore(phase,t.id,{ reviewer:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ reviewer:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-32 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'ClosedBy': return <td className="px-4 py-1"><input autoFocus defaultValue={t.closedBy||''} onBlur={e=>{ saveCore(phase,t.id,{ closedBy:e.target.value||undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ saveCore(phase,t.id,{ closedBy:(e.target as HTMLInputElement).value||undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-32 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-100 outline-none"/></td>;
      case 'Labels': return <td className="px-4 py-1"><input autoFocus defaultValue={(t.labels||t.tags||[]).join(', ')} onBlur={e=>{ const list=e.target.value.split(',').map(s=>s.trim()).filter(Boolean); saveCore(phase,t.id,{ labels:list.length? list: undefined }); stopEdit(); }} onKeyDown={e=>{ if(e.key==='Enter'){ const list=(e.target as HTMLInputElement).value.split(',').map(s=>s.trim()).filter(Boolean); saveCore(phase,t.id,{ labels:list.length? list: undefined }); stopEdit(); } if(e.key==='Escape'){ stopEdit(); } }} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] outline-none text-slate-100"/></td>;
      default: return <td className="px-4 py-1"/>;
    }
  };
  return (
    <div className="space-y-6">
      {data.order.map(phase => {
        const raw = data.columns[phase] as DevKanbanTask[];
        const baseCfg = columnConfigs[phase] || defaultConfig;
        const customFields = customFieldsMap[phase] || [];
        const columns = [...baseCfg.columns, ...customFields];
        const tasks = [...raw].sort(baseCfg.sort);
        const wipCap = typeof (columnConfigs[phase]?.wipCap) === 'function'? (columnConfigs[phase]!.wipCap as any)(tasks): columnConfigs[phase]?.wipCap;
        return (
          <GlassCard key={phase} className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100" title={phase}>{phase}</span>
                <Pill tone={tasks.length===0? 'neutral': phase==='Done'? 'green': phase==='In Review'? 'amber': phase==='Ready for QA'? 'purple':'neutral'}>{tasks.length}</Pill>
                {wipCap && phase!=='Backlog' && phase!=='Done' && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${tasks.length> wipCap? 'border-rose-400/40 text-rose-300 bg-rose-500/10':'border-white/10 text-slate-400 bg-white/5'}`}>WIP {tasks.length}/{wipCap}</span>}
              </div>
              <div className="flex items-center gap-2">
                {addingFieldFor===phase ? (
                  <div className="flex items-center gap-2">
                    <input value={fieldValue} onChange={e=>setFieldValue(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); if(fieldValue.trim()){ onAddField(phase, fieldValue.trim()); setFieldValue(''); setAddingFieldFor(null);} } if(e.key==='Escape'){ e.preventDefault(); setAddingFieldFor(null); setFieldValue(''); } }} placeholder="Column name" className="mb-3 w-full rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-slate-100 outline-none focus:border-cyan-400/40" />
                    <SoftButton onClick={()=>{ if(fieldValue.trim()){ onAddField(phase, fieldValue.trim()); setFieldValue(''); setAddingFieldFor(null);} }} className="text-[10px] px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200">Add</SoftButton>
                    <SoftButton onClick={()=>{ setAddingFieldFor(null); setFieldValue(''); }} className="text-[10px] px-2 py-1">Cancel</SoftButton>
                  </div>
                ) : (
                  <SoftButton onClick={()=> setAddingFieldFor(phase)} className="text-xs">+ Col</SoftButton>
                )}
                <SoftButton onClick={()=> onAddTask(phase)} className="text-xs">+ Task</SoftButton>
              </div>
            </div>
            <div className="max-h-[440px] overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-xs">
                <thead><tr className="sticky top-0 backdrop-blur bg-white/5">{columns.map(h => <th key={h} className="border-b border-white/10 px-4 py-2 text-left font-medium uppercase tracking-wider text-[10px] text-slate-300">{h}</th>)}</tr></thead>
                <tbody>
                  {tasks.map(t => {
                    const dt = t as DevKanbanTask;
                    return (
                      <tr key={t.id} className="hover:bg-white/5">
                        {columns.map(col => {
                          if(customFields.includes(col)) {
                            const val = (dt.custom||{})[col] || '';
                            return <td key={col} className="px-4 py-2 text-slate-300 min-w-[120px]">
                              <input value={val} onChange={e=> onUpdateField(phase, t.id, col, e.target.value)} className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] text-slate-200 outline-none focus:border-cyan-400/40" placeholder={col} />
                            </td>;
                          }
                          return <React.Fragment key={col}>{renderEditable(phase, dt, col)}</React.Fragment>;
                        })}
                      </tr>
                    );
                  })}
                  {tasks.length===0 && <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500 text-[11px]">No items</td></tr>}
                </tbody>
              </table>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
