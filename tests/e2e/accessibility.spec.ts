import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from './fixtures.js';

type AxePage = ConstructorParameters<typeof AxeBuilder>[0]['page'];

test('@p0 @accessibility product has no detectable WCAG 2.2 A/AA violations', async ({ page }, testInfo) => {
  await page.goto('/'); const results = await new AxeBuilder({ page: page as unknown as AxePage }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  await testInfo.attach('axe-product.json', { body: Buffer.from(JSON.stringify(results.violations, null, 2)), contentType: 'application/json' });
  expect(results.violations).toEqual([]);
});

test('@accessibility fixture proves axe detects known violations', async ({ page }, testInfo) => {
  await page.goto('/fixtures/a11y-broken'); const results = await new AxeBuilder({ page: page as unknown as AxePage }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const directory = path.resolve('reports/generated/axe'); fs.mkdirSync(directory, { recursive: true }); fs.writeFileSync(path.join(directory, 'intentional-fixture.json'), JSON.stringify(results.violations, null, 2));
  await testInfo.attach('axe-intentional-fixture.json', { body: Buffer.from(JSON.stringify(results.violations, null, 2)), contentType: 'application/json' });
  expect(results.violations.map((violation) => violation.id)).toContain('button-name');
});
