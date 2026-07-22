import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect } from '@playwright/test';

const roles = ['admin', 'recruiter', 'reviewer', 'candidate'] as const;
setup('authenticate local QA roles', async ({ page }) => {
  fs.mkdirSync(path.resolve('artifacts/auth'), { recursive: true });
  for (const role of roles) {
    await page.goto('/'); await page.evaluate(() => localStorage.clear()); await page.reload();
    await page.getByRole('textbox', { name: 'Email' }).fill(`${role}@talent.test`);
    await page.getByLabel('Password').fill('QaDemo!2026'); await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Interview operations' })).toBeVisible();
    await page.context().storageState({ path: `artifacts/auth/${role}.json` });
  }
});
