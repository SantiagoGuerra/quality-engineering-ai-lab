import { expect, test as base } from '@playwright/test';

export const test = base.extend<{ qeEvidence: void }>({
  qeEvidence: [async ({ page }, use, testInfo) => {
    const consoleErrors: string[] = []; const networkErrors: Array<{ url: string; status?: number; failure?: string }> = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('response', (response) => { if (response.status() >= 400) networkErrors.push({ url: response.url(), status: response.status() }); });
    page.on('requestfailed', (request) => networkErrors.push({ url: request.url(), failure: request.failure()?.errorText ?? 'unknown' }));
    await use();
    await testInfo.attach('console-errors.json', { body: Buffer.from(JSON.stringify(consoleErrors, null, 2)), contentType: 'application/json' });
    await testInfo.attach('network-errors.json', { body: Buffer.from(JSON.stringify(networkErrors, null, 2)), contentType: 'application/json' });
  }, { auto: true }],
});

export { expect };
