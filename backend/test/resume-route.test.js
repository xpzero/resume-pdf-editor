import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeOptimizedResume } from '../src/routes/resume.js';

const original = {
  name: 'Ada',
  skills: ['JavaScript', 'CSS'],
  jobs: [['2020', 'Example', 'Developer']],
  projects: [{ title: 'Editor', intro: 'Original intro', points: ['Original point', 'Second point'] }],
  evaluation: 'Original evaluation'
};

const optimized = {
  ...original,
  name: 'Changed by model',
  skills: ['TypeScript', 'CSS'],
  jobs: [['2021', 'Changed', 'Lead']],
  projects: [{ title: 'Changed title', intro: 'Optimized intro', points: ['Optimized point', 'Changed second point'] }],
  evaluation: 'Optimized evaluation'
};

test('merges only the requested skill without changing other resume fields', () => {
  const result = mergeOptimizedResume(original, optimized, 'skills', 0);

  assert.deepEqual(result.skills, ['TypeScript', 'CSS']);
  assert.equal(result.name, 'Ada');
  assert.equal(result.evaluation, 'Original evaluation');
});

test('merges a project intro without accepting unrelated project changes', () => {
  const result = mergeOptimizedResume(original, optimized, 'projects', 0, 'intro');

  assert.deepEqual(result.projects, [{ title: 'Editor', intro: 'Optimized intro', points: ['Original point', 'Second point'] }]);
});

test('merges one project point without changing the rest of the project', () => {
  const result = mergeOptimizedResume(original, optimized, 'projects', 0, 'point', 0);

  assert.deepEqual(result.projects, [{ title: 'Editor', intro: 'Original intro', points: ['Optimized point', 'Second point'] }]);
});
