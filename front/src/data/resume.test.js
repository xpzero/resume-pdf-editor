import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultResume } from './defaultResume';
import { loadResume, normalizeResume, STORAGE_KEY } from './resume';

describe('normalizeResume', () => {
  it('repairs missing collections and migrates legacy education fields', () => {
    const normalized = normalizeResume({
      templateId: 'unknown',
      educationDate: '2020-2024',
      school: 'Example University',
      education: 'Bachelor',
      major: 'Computer Science',
      customSections: [{ title: 'Awards', items: ['Winner', 1] }, null]
    });

    expect(normalized.templateId).toBe('classic');
    expect(normalized.skills).toEqual([]);
    expect(normalized.jobs).toEqual([]);
    expect(normalized.projects).toEqual([]);
    expect(normalized.educations).toEqual([{ date: '2020-2024', school: 'Example University', degree: 'Bachelor', major: 'Computer Science' }]);
    expect(normalized.customSections).toEqual([{ title: 'Awards', items: ['Winner'] }]);
  });

  it('creates a fresh default resume for invalid stored values', () => {
    const first = normalizeResume(null);
    first.name = 'Changed';

    expect(normalizeResume(null).name).toBe(defaultResume.name);
  });
});

describe('loadResume', () => {
  beforeEach(() => {
    globalThis.localStorage = { getItem: vi.fn() };
  });

  it('falls back to the default resume when persisted JSON is invalid', () => {
    localStorage.getItem.mockReturnValue('{not json');

    expect(loadResume()).toEqual(defaultResume);
    expect(localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
