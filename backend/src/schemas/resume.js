import { z } from 'zod';

const text = z.string().max(10_000);
const shortText = z.string().max(1_000);

export const resumeSchema = z.object({
  templateId: shortText.optional(),
  name: shortText,
  birth: shortText,
  phone: shortText,
  role: shortText,
  email: shortText,
  blog: shortText,
  school: shortText,
  education: shortText,
  major: shortText,
  educationDate: shortText,
  skills: z.array(text).max(100),
  jobs: z.array(z.tuple([shortText, shortText, shortText])).max(100),
  projects: z.array(z.object({
    date: shortText,
    title: shortText,
    role: shortText,
    intro: text,
    points: z.array(text).max(100)
  }).passthrough()).max(100),
  customSections: z.array(z.object({
    title: shortText,
    items: z.array(text).max(100)
  }).passthrough()).max(100),
  evaluation: text
}).passthrough();

export const optimizeRequestSchema = z.object({
  llmConfig: z.object({
    baseUrl: z.string().url().max(2_000),
    apiKey: z.string().min(1).max(10_000),
    model: z.string().min(1).max(500)
  }),
  resume: resumeSchema,
  scope: z.enum(['all', 'skills', 'jobs', 'projects', 'evaluation']),
  targetIndex: z.number().int().nonnegative().nullable().optional(),
  targetField: z.enum(['intro', 'point']).nullable().optional(),
  targetPointIndex: z.number().int().nonnegative().nullable().optional(),
  targetRole: z.string().max(1_000).optional().default(''),
  jobDescription: z.string().max(20_000).optional().default(''),
  supplement: z.string().max(10_000).optional().default('')
});
