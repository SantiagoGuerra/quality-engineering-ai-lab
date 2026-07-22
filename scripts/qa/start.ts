import { ensureEnv, run, waitForUrl } from './common.js';

ensureEnv();
run('docker', ['compose', 'up', '-d', '--build', '--wait']);
await Promise.all([waitForUrl(`http://localhost:${process.env.API_PORT ?? '3001'}/health`), waitForUrl(`http://localhost:${process.env.WEB_PORT ?? '4173'}`)]);
run('pnpm', ['qa:seed', '--', '--seed', process.env.QA_SEED ?? 'default']);
console.log(`Talent Lab ready: web=http://localhost:${process.env.WEB_PORT ?? '4173'} api=http://localhost:${process.env.API_PORT ?? '3001'} mail=http://localhost:${process.env.MAILPIT_UI_PORT ?? '18025'}`);
