import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium, firefox, webkit } from '@playwright/test';
import { portOpen, root, run } from './common.js';

type Status = 'PASS' | 'WARN' | 'FAIL';
interface Check { check: string; status: Status; detail: string }
const checks: Check[] = [];
const add = (check: string, status: Status, detail: string) => checks.push({ check, status, detail });

const nodeMajor = Number(process.versions.node.split('.')[0]);
add('Node', nodeMajor >= 20 && nodeMajor < 25 ? 'PASS' : 'FAIL', process.version);
const pnpmVersion = run('pnpm', ['--version'], { capture: true, allowFailure: true });
add('pnpm', pnpmVersion.startsWith('10.') ? 'PASS' : 'FAIL', pnpmVersion || 'not found');
const dockerVersion = run('docker', ['version', '--format', '{{.Server.Version}}'], { capture: true, allowFailure: true });
add('Docker engine', dockerVersion && !dockerVersion.toLowerCase().includes('error') ? 'PASS' : 'FAIL', dockerVersion || 'not reachable');
const compose = run('docker', ['compose', 'version', '--short'], { capture: true, allowFailure: true });
add('Docker Compose', compose ? 'PASS' : 'FAIL', compose || 'not found');

const envPath = path.join(root, '.env');
add('Environment file', fs.existsSync(envPath) ? 'PASS' : 'WARN', fs.existsSync(envPath) ? '.env present' : 'Run pnpm qa:setup to create .env from the safe example');
for (const key of ['DATABASE_URL', 'JWT_SECRET', 'API_PORT', 'WEB_PORT']) add(`Variable ${key}`, process.env[key] ? 'PASS' : 'WARN', process.env[key] ? 'defined' : 'using documented default');

const ports = [Number(process.env.API_PORT ?? 3001), Number(process.env.WEB_PORT ?? 4173), Number(process.env.POSTGRES_PORT ?? 54329), Number(process.env.MAILPIT_UI_PORT ?? 18025)];
for (const port of ports) add(`Port ${port}`, await portOpen(port) ? 'PASS' : 'WARN', await portOpen(port) ? 'service listening' : 'available/service not started');

for (const [name, browser] of [['Chromium', chromium], ['Firefox', firefox], ['WebKit', webkit]] as const) {
  const browserPath = browser.executablePath(); add(`Playwright ${name}`, fs.existsSync(browserPath) ? 'PASS' : 'WARN', fs.existsSync(browserPath) ? browserPath : 'Run pnpm qa:setup');
}

for (const [name, url] of [['API connectivity', `http://localhost:${process.env.API_PORT ?? 3001}/health`], ['Web connectivity', `http://localhost:${process.env.WEB_PORT ?? 4173}`], ['Mailpit connectivity', `http://localhost:${process.env.MAILPIT_UI_PORT ?? 18025}/api/v1/info`]] as const) {
  try { const response = await fetch(url, { signal: AbortSignal.timeout(1_000) }); add(name, response.ok ? 'PASS' : 'WARN', `HTTP ${response.status}`); }
  catch { add(name, 'WARN', 'service not started'); }
}

if (await portOpen(Number(process.env.POSTGRES_PORT ?? 54329))) {
  const migration = run('docker', ['compose', 'exec', '-T', 'postgres', 'psql', '-U', 'talent', '-d', 'talent_lab', '-Atc', 'select count(*) from schema_migrations'], { capture: true, allowFailure: true });
  add('Migrations', /^\d+$/.test(migration) && Number(migration) > 0 ? 'PASS' : 'FAIL', migration || 'query failed');
  const users = run('docker', ['compose', 'exec', '-T', 'postgres', 'psql', '-U', 'talent', '-d', 'talent_lab', '-Atc', 'select count(*) from users'], { capture: true, allowFailure: true });
  add('Seeds', /^\d+$/.test(users) && Number(users) >= 4 ? 'PASS' : 'WARN', users ? `${users} users` : 'not applied');
} else {
  add('Migrations', 'WARN', 'PostgreSQL not started'); add('Seeds', 'WARN', 'PostgreSQL not started');
}

console.table(checks);
const failures = checks.filter((check) => check.status === 'FAIL');
if (failures.length) { console.error(`qa:doctor found ${failures.length} blocking problem(s).`); process.exitCode = 1; }
else console.log('qa:doctor completed without blocking problems. WARN means an optional/not-yet-started service.');
