import { ensureEnv, run } from './common.js';

const created = ensureEnv();
console.log(created ? 'Created .env from .env.example' : 'Using existing .env');
run('docker', ['compose', 'config', '--quiet']);
run('pnpm', ['exec', 'playwright', 'install', 'chromium', 'firefox', 'webkit']);
console.log('QA setup complete: environment validated and Playwright browsers installed.');
