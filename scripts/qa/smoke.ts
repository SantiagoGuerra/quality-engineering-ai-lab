import { run, waitForUrl } from './common.js';

await waitForUrl(`http://localhost:${process.env.WEB_PORT ?? '4173'}`);
await waitForUrl(`http://localhost:${process.env.API_PORT ?? '3001'}/health`);
run('pnpm', ['test:e2e:smoke']);
run('pnpm', ['test:api:hurl']);
