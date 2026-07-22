import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { config } from 'dotenv';

export const root = path.resolve(import.meta.dirname, '../..');
config({ path: path.join(root, '.env'), quiet: true });

export function run(command: string, args: string[], options: { capture?: boolean; allowFailure?: boolean; env?: NodeJS.ProcessEnv } = {}): string {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: options.capture ? 'pipe' : 'inherit', env: { ...process.env, ...options.env } });
  if (result.error) throw result.error;
  if (result.status !== 0 && !options.allowFailure) throw new Error(`${command} ${args.join(' ')} exited with ${result.status}${result.stderr ? `: ${result.stderr.trim()}` : ''}`);
  return `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
}

export function ensureEnv(): boolean {
  const target = path.join(root, '.env');
  if (fs.existsSync(target)) return false;
  fs.copyFileSync(path.join(root, '.env.example'), target);
  return true;
}

export async function waitForUrl(url: string, timeoutMs = 120_000): Promise<void> {
  const started = Date.now();
  let lastError = '';
  while (Date.now() - started < timeoutMs) {
    try { const response = await fetch(url); if (response.ok) return; lastError = `HTTP ${response.status}`; }
    catch (error) { lastError = error instanceof Error ? error.message : String(error); }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

export async function portOpen(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => { const socket = net.createConnection({ port, host }); socket.setTimeout(500); socket.once('connect', () => { socket.destroy(); resolve(true); }); const fail = () => { socket.destroy(); resolve(false); }; socket.once('error', fail); socket.once('timeout', fail); });
}

export function argument(name: string, fallback: string): string {
  const exact = process.argv.find((item) => item.startsWith(`${name}=`));
  if (exact) return exact.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1]! : fallback;
}
