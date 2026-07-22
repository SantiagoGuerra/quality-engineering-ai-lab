import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '../..'); const reportRoot = path.join(root, 'reports'); const generated = path.join(reportRoot, 'generated');
const allowed = new Set(['.html', '.json', '.xml', '.sarif', '.md', '.txt', '.zip']);
const files: string[] = [];
const walk = (directory: string) => { if (!fs.existsSync(directory)) return; for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const full = path.join(directory, entry.name); if (entry.isDirectory()) walk(full); else if (allowed.has(path.extname(entry.name))) files.push(full); } };
walk(generated);
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const git = (args: string[]) => { try { return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim(); } catch { return 'unknown'; } };
const groups = new Map<string, string[]>();
for (const file of files.sort()) { const group = path.relative(generated, file).split(path.sep)[0] ?? 'other'; groups.set(group, [...(groups.get(group) ?? []), file]); }
const sections = [...groups.entries()].map(([group, entries]) => `<section><h2>${escape(group)}</h2><ul>${entries.map((file) => { const relative = path.relative(reportRoot, file); const stats = fs.statSync(file); return `<li><a href="${escape(relative)}">${escape(path.relative(generated, file))}</a><small>${Math.ceil(stats.size / 1024)} KB · ${escape(stats.mtime.toISOString())}</small></li>`; }).join('')}</ul></section>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Talent Lab QA reports</title><style>body{font:16px system-ui;margin:auto;max-width:72rem;padding:2rem;color:#172033;background:#f6f8fc}header,section{background:white;border-radius:.75rem;padding:1rem 1.5rem;margin:1rem 0;box-shadow:0 2px 8px #0001}li{margin:.7rem 0}small{color:#586174;display:block}a{color:#0645ad}:focus-visible{outline:3px solid #f9ab00}</style></head><body><header><h1>Talent Lab QA report index</h1><p>Commit ${escape(git(['rev-parse', 'HEAD']))} · branch ${escape(git(['branch', '--show-current']))} · seed ${escape(process.env.QA_SEED ?? 'default')} · generated ${escape(new Date().toISOString())}</p></header>${sections || '<section><h2>No reports found</h2><p>Run a test suite, then regenerate this index.</p></section>'}</body></html>`;
fs.mkdirSync(reportRoot, { recursive: true }); const target = path.join(reportRoot, 'index.html'); fs.writeFileSync(target, html); process.stdout.write(`Report index: ${target}\nArtifacts linked: ${files.length}\n`);
if (process.env.QA_REPORT_OPEN === 'true') { try { execFileSync(process.platform === 'darwin' ? 'open' : 'xdg-open', [target]); } catch { console.warn('Could not open a browser; use the printed path.'); } }
