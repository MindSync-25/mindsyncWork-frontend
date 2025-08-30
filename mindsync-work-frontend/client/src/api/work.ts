// Thin data layer for workspaces -> projects -> boards
// TODO: replace ORG_ID resolution with real org context
export const ORG_ID = "current";

// Use Vite style var if present, else fallback to legacy React style
const API_BASE: string = (
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof process !== 'undefined' ? (process as any).env?.REACT_APP_API_URL : '') ||
  ''
).replace(/\/$/, '');

function buildUrl(path: string) {
  if (!API_BASE) return path; // relative (dev proxy)
  return API_BASE + path;
}

export interface View { id: string; name: string; kind: "home"|"kanban"|"table"|"roadmap" }
export interface Board { id: string; name: string; views: View[] }
export interface Project { id: string; name: string; boards: Board[] }
export interface Workspace { id: string; name: string; color?: string; pinned?: boolean }

async function handle(resp: Response) {
  const ct = resp.headers.get('content-type') || '';
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`[${resp.status}] ${text.slice(0,300)}` || `Request failed: ${resp.status}`);
  }
  if (ct.includes('application/json')) {
    try { return JSON.parse(text); } catch (e) { throw new Error('Invalid JSON response'); }
  }
  throw new Error(`Expected JSON but received ${ct || 'unknown'}: ${text.slice(0,200)}`);
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const r = await fetch(buildUrl(`/orgs/${ORG_ID}/workspaces`));
  return handle(r);
}
export async function createWorkspace(body: { name: string; templateKey: string }) {
  const r = await fetch(buildUrl(`/orgs/${ORG_ID}/workspaces`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handle(r);
}
export async function listProjects(workspaceId: string): Promise<Project[]> {
  const r = await fetch(buildUrl(`/workspaces/${workspaceId}/projects`));
  return handle(r);
}
export async function createProject(workspaceId: string, body: { name: string; boardTemplateKeys: string[] }) {
  const r = await fetch(buildUrl(`/workspaces/${workspaceId}/projects`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handle(r);
}
export async function createBoard(projectId: string, body: { templateKey: string; name?: string }) {
  const r = await fetch(buildUrl(`/projects/${projectId}/boards`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return handle(r);
}
