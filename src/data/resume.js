import { createDefaultResume } from './defaultResume';

export const STORAGE_KEY = 'resume-editor-data';
export const TEMPLATE_IDS = ['classic', 'modern'];

export function normalizeResume(value) {
  if (!value || typeof value !== 'object') return createDefaultResume();
  return {
    ...value,
    templateId: TEMPLATE_IDS.includes(value.templateId) ? value.templateId : 'classic',
    skills: Array.isArray(value.skills) ? value.skills : [],
    jobs: Array.isArray(value.jobs) ? value.jobs : [],
    projects: Array.isArray(value.projects) ? value.projects : []
  };
}

export function loadResume() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeResume(JSON.parse(stored)) : createDefaultResume();
  } catch {
    return createDefaultResume();
  }
}
