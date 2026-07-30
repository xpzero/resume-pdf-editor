export const optimizeSystemPrompt = `You optimize resume wording for a job application. Return only a valid JSON object representing the complete resume, with the same structure as the supplied resume.

Never fabricate, infer, or add facts, employers, dates, titles, degrees, metrics, skills, responsibilities, projects, credentials, or outcomes not explicitly present in the supplied resume or supplement. You may improve clarity, relevance, grammar, and ordering only. Preserve data outside the requested optimization scope exactly. Keep customSections and any unknown fields intact. If there is insufficient evidence for an improvement, retain the original content.`;

export function buildOptimizeUserPrompt({ resume, scope, targetIndex, targetField, targetPointIndex, targetRole, jobDescription, supplement }) {
  return JSON.stringify({
    task: 'Optimize the resume without fabricating information.',
    optimizationScope: scope,
    targetIndex,
    targetField,
    targetPointIndex,
    targetRole,
    jobDescription,
    supplement,
    resume
  });
}
