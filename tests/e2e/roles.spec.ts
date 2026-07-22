import { expect, test } from './fixtures.js';

test('@p0 @smoke @security candidate sees a read-only permission state', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ storageState: 'artifacts/auth/candidate.json' }); const page = await context.newPage();
  await page.goto(baseURL!); await expect(page.getByText('Candidate self-service is intentionally read-only')).toBeVisible(); await expect(page.getByRole('button', { name: 'Create candidate' })).toHaveCount(0); await context.close();
});

test('@p1 @regression reviewer can read but cannot create candidates', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ storageState: 'artifacts/auth/reviewer.json' }); const page = await context.newPage();
  await page.goto(baseURL!); await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Create candidate' })).toHaveCount(0); await context.close();
});
