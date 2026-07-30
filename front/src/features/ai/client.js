export async function optimizeResume(payload) {
  const response = await fetch('/api/resume/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error?.message || 'AI 优化请求失败，请稍后重试。');
  return result;
}
