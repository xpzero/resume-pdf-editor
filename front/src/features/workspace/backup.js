import { loadWorkspace, saveWorkspace } from '../../data/workspace';
import { normalizeResume } from '../../data/resume';

const FORMAT = 'resume-editor-workspace';
const VERSION = 1;

function normalizeWorkspace(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.resumes) || !value.resumes.length) {
    throw new Error('无效的工作区备份');
  }
  const resumes = value.resumes
    .filter(item => item && typeof item === 'object' && typeof item.id === 'string' && item.id)
    .map(item => ({
      id: item.id,
      name: typeof item.name === 'string' ? item.name : '未命名简历',
      data: normalizeResume(item.data),
      updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString(),
      history: Array.isArray(item.history) ? item.history.filter(snapshot => snapshot && typeof snapshot === 'object' && snapshot.data).map(snapshot => ({
        id: typeof snapshot.id === 'string' ? snapshot.id : crypto.randomUUID(),
        label: typeof snapshot.label === 'string' ? snapshot.label : '历史快照',
        createdAt: typeof snapshot.createdAt === 'string' ? snapshot.createdAt : new Date().toISOString(),
        data: normalizeResume(snapshot.data)
      })).slice(0, 20) : []
    }));
  if (!resumes.length) throw new Error('备份中没有可用简历');
  const activeId = resumes.some(item => item.id === value.activeId) ? value.activeId : resumes[0].id;
  return { activeId, resumes };
}

export function exportWorkspaceBackup() {
  return JSON.stringify({
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    workspace: normalizeWorkspace(loadWorkspace())
  }, null, 2);
}

export function importWorkspaceBackup(text, mode = 'replace') {
  const backup = JSON.parse(text);
  if (backup?.format !== FORMAT || backup.version !== VERSION) throw new Error('不是此应用导出的工作区备份');
  const workspace = normalizeWorkspace(backup.workspace);
  if (mode === 'merge') {
    const current = loadWorkspace();
    const existingIds = new Set(current.resumes.map(resume => resume.id));
    const resumes = workspace.resumes.map(resume => {
      if (!existingIds.has(resume.id)) return resume;
      return { ...resume, id: crypto.randomUUID(), name: `${resume.name}（导入）` };
    });
    const merged = { ...current, resumes: [...current.resumes, ...resumes] };
    saveWorkspace(merged);
    return merged;
  }
  saveWorkspace(workspace);
  return workspace;
}
