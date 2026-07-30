import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from './resume';
import { createResume, loadWorkspace, saveWorkspace } from './workspace';

const workspaceStorageKey = 'resume-editor-workspace';

describe('workspace storage', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'resume-id') });
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
  });

  it('migrates a legacy resume into a single active workspace', () => {
    localStorage.getItem.mockImplementation(key => key === STORAGE_KEY ? JSON.stringify({ role: 'Engineer', skills: [] }) : null);

    const workspace = loadWorkspace();

    expect(workspace.activeId).toBe('resume-id');
    expect(workspace.resumes).toHaveLength(1);
    expect(workspace.resumes[0]).toMatchObject({ id: 'resume-id', name: 'Engineer简历' });
    expect(workspace.resumes[0].data.educations).toEqual([{ date: '', school: '', degree: '', major: '' }]);
  });

  it('normalizes each persisted resume and saves workspace JSON', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify({ activeId: 'one', resumes: [{ id: 'one', name: 'First', data: { skills: 'invalid' } }] }));

    expect(loadWorkspace().resumes[0].data.skills).toEqual([]);
    const workspace = { activeId: 'one', resumes: [] };
    saveWorkspace(workspace);
    expect(localStorage.setItem).toHaveBeenCalledWith(workspaceStorageKey, JSON.stringify(workspace));
  });

  it('creates a separately mutable default resume', () => {
    const resume = createResume('New resume');

    expect(resume).toMatchObject({ id: 'resume-id', name: 'New resume' });
    expect(resume.data).not.toBe(createResume().data);
  });
});
