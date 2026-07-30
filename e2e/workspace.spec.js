import { expect, test } from '@playwright/test';

test('loads the editor and persists a basic field without an LLM', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('简历工作台')).toBeVisible();
  const name = page.getByLabel('姓名');
  await name.fill('E2E Candidate');
  await expect(name).toHaveValue('E2E Candidate');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('resume-editor-data'))).toContain('E2E Candidate');
});
