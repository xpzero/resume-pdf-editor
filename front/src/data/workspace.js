import { createDefaultResume } from './defaultResume';
import { loadResume, normalizeResume } from './resume';

const STORAGE_KEY = 'resume-editor-workspace';
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

export function loadWorkspace() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.activeId && Array.isArray(stored.resumes) && stored.resumes.length) return { activeId: stored.activeId, resumes: stored.resumes.map(item => ({ ...item, data: normalizeResume(item.data) })) };
  } catch {}
  const resume = loadResume();
  const first = { id: id(), name: `${resume.role || '我的'}简历`, data: resume, updatedAt: new Date().toISOString() };
  return { activeId: first.id, resumes: [first] };
}

export function saveWorkspace(workspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

export function createResume(name = '新建简历') {
  return { id: id(), name, data: createDefaultResume(), updatedAt: new Date().toISOString() };
}
