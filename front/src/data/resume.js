import { createDefaultResume } from './defaultResume';
import { templates } from '../templates/templateRegistry';

export const STORAGE_KEY = 'resume-editor-data';
export const TEMPLATE_IDS = templates.map(template => template.id);

export function normalizeResume(value) {
  if (!value || typeof value !== 'object') return createDefaultResume();
  return {
    ...value,
    templateId: TEMPLATE_IDS.includes(value.templateId) ? value.templateId : 'classic',
    skills: Array.isArray(value.skills) ? value.skills : [],
    jobs: Array.isArray(value.jobs) ? value.jobs : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
    educations: Array.isArray(value.educations) && value.educations.length
      ? value.educations.filter(item => item && typeof item === 'object').map(item => ({ date: item.date || '', school: item.school || '', degree: item.degree || '', major: item.major || '' }))
      : [{ date: value.educationDate || '', school: value.school || '', degree: value.education || '', major: value.major || '' }],
    customSections: Array.isArray(value.customSections)
      ? value.customSections.filter(section => section && typeof section === 'object').map(section => ({
        title: typeof section.title === 'string' ? section.title : '',
        items: Array.isArray(section.items) ? section.items.filter(item => typeof item === 'string') : []
      }))
      : []
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
