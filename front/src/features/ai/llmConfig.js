const STORAGE_KEY = 'resume-editor-llm-config';

export function loadLlmConfig() {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return value && typeof value === 'object' ? value : { baseUrl: '', apiKey: '', model: '' };
  } catch {
    return { baseUrl: '', apiKey: '', model: '' };
  }
}

export function saveLlmConfig(config) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearLlmConfig() {
  sessionStorage.removeItem(STORAGE_KEY);
}
