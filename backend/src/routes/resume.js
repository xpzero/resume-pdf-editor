import { buildOptimizeUserPrompt, optimizeSystemPrompt } from '../prompts/optimize.js';
import { optimizeRequestSchema, resumeSchema } from '../schemas/resume.js';
import { LlmError, optimizeWithLlm } from '../services/llm.js';

const scopedFields = {
  skills: ['skills'],
  jobs: ['jobs'],
  projects: ['projects'],
  evaluation: ['evaluation']
};

export function mergeOptimizedResume(original, optimized, scope, targetIndex, targetField, targetPointIndex) {
  if (scope === 'all') return { ...original, ...optimized };

  const result = { ...original };
  if (Number.isInteger(targetIndex) && scope === 'skills') {
    result[scope] = [...original[scope]];
    result[scope][targetIndex] = optimized[scope][targetIndex];
    return result;
  }
  if (Number.isInteger(targetIndex) && scope === 'projects') {
    result.projects = [...original.projects];
    const originalProject = original.projects[targetIndex];
    const optimizedProject = optimized.projects[targetIndex];
    if (targetField === 'intro') result.projects[targetIndex] = { ...originalProject, intro: optimizedProject.intro };
    else if (targetField === 'point' && Number.isInteger(targetPointIndex)) {
      const points = [...originalProject.points];
      points[targetPointIndex] = optimizedProject.points[targetPointIndex];
      result.projects[targetIndex] = { ...originalProject, points };
    } else result.projects[targetIndex] = optimizedProject;
    return result;
  }
  for (const field of scopedFields[scope]) result[field] = optimized[field];
  return result;
}

export default async function resumeRoutes(app) {
  app.post('/optimize', async (request, reply) => {
    const parsedRequest = optimizeRequestSchema.safeParse(request.body);
    if (!parsedRequest.success) {
      return reply.code(400).send({ error: { code: 'INVALID_REQUEST', message: 'Request body is invalid.' } });
    }

    const input = parsedRequest.data;
    try {
      const generated = await optimizeWithLlm({
        llmConfig: input.llmConfig,
        systemPrompt: optimizeSystemPrompt,
        userPrompt: buildOptimizeUserPrompt(input)
      });
      const parsedResume = resumeSchema.safeParse(generated);
      if (!parsedResume.success) {
        return reply.code(502).send({ error: { code: 'INVALID_MODEL_OUTPUT', message: 'The language model returned an invalid resume.' } });
      }

      return {
        resume: mergeOptimizedResume(input.resume, parsedResume.data, input.scope, input.targetIndex, input.targetField, input.targetPointIndex),
        meta: { model: input.llmConfig.model }
      };
    } catch (error) {
      if (error instanceof LlmError) {
        return reply.code(error.statusCode).send({ error: { code: 'LLM_ERROR', message: error.message } });
      }
      request.log.error(error, 'Resume optimization failed');
      return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Unable to optimize the resume.' } });
    }
  });
}
