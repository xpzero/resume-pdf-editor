import { createDefaultResume } from './defaultResume';
import { loadResume, normalizeResume } from './resume';

const STORAGE_KEY = 'resume-editor-workspace';
export const MAX_RESUME_HISTORY = 20;
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

const timestamp = () => new Date().toISOString();
const cloneResume = data => JSON.parse(JSON.stringify(data));

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.filter(item => item && typeof item === 'object' && item.data && typeof item.data === 'object')
    .slice(0, MAX_RESUME_HISTORY)
    .map(item => ({
      id: typeof item.id === 'string' && item.id ? item.id : id(),
      label: typeof item.label === 'string' && item.label ? item.label : '历史快照',
      createdAt: typeof item.createdAt === 'string' ? item.createdAt : timestamp(),
      data: normalizeResume(item.data)
    }));
}

function normalizeWorkspace(stored) {
  if (!stored || typeof stored !== 'object' || !Array.isArray(stored.resumes)) return null;
  const resumes = stored.resumes.filter(item => item && typeof item === 'object' && item.data && typeof item.data === 'object')
    .map((item, index) => ({
      id: typeof item.id === 'string' && item.id ? item.id : id(),
      name: typeof item.name === 'string' && item.name.trim() ? item.name : `简历 ${index + 1}`,
      data: normalizeResume(item.data),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : timestamp(),
      history: normalizeHistory(item.history)
    }));
  if (!resumes.length) return null;
  const activeId = resumes.some(item => item.id === stored.activeId) ? stored.activeId : resumes[0].id;
  return { activeId, resumes };
}

export function loadWorkspace() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const workspace = normalizeWorkspace(stored);
    if (workspace) return workspace;
  } catch {}
  const resume = loadResume();
  const first = { id: id(), name: `${resume.role || '我的'}简历`, data: resume, updatedAt: timestamp(), history: [] };
  return { activeId: first.id, resumes: [first] };
}

export function saveWorkspace(workspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

export function createResume(name = '新建简历') {
  return { id: id(), name, data: createDefaultResume(), updatedAt: timestamp(), history: [] };
}

export function createHistorySnapshot(data, label) {
  return { id: id(), label, createdAt: timestamp(), data: cloneResume(normalizeResume(data)) };
}
