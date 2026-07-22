import fs from 'node:fs';
import path from 'node:path';
import { argument, root, run } from './common.js';

const pr = argument('--pr', '');
if (!/^\d+$/.test(pr)) throw new Error('Pass a numeric PR: pnpm qa:worktree:create -- --pr 123');
const destination = path.join(root, '.worktrees', `pr-${pr}`);
if (fs.existsSync(destination)) throw new Error(`Worktree already exists: ${destination}`);
run('git', ['fetch', 'origin', `pull/${pr}/head:refs/qa/pr-${pr}`]);
run('git', ['worktree', 'add', destination, `refs/qa/pr-${pr}`]);
const offset = Number(pr) % 1_000;
const example = fs.readFileSync(path.join(root, '.env.example'), 'utf8')
  .replace('API_PORT=3001', `API_PORT=${13_000 + offset}`)
  .replace('WEB_PORT=4173', `WEB_PORT=${14_000 + offset}`)
  .replace('POSTGRES_PORT=54329', `POSTGRES_PORT=${15_000 + offset}`)
  .replace('MAILPIT_SMTP_PORT=10259', `MAILPIT_SMTP_PORT=${16_000 + offset}`)
  .replace('MAILPIT_UI_PORT=18025', `MAILPIT_UI_PORT=${17_000 + offset}`)
  .replace('TOXIPROXY_PORT=18474', `TOXIPROXY_PORT=${18_000 + offset}`)
  .replace('COMPOSE_PROJECT_NAME=talent-lab', `COMPOSE_PROJECT_NAME=talent-lab-pr-${pr}`);
fs.writeFileSync(path.join(destination, '.env'), example, { mode: 0o600 });
console.log(`Created ${destination} with isolated Compose project and ports.`);
