import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { FullConfig, FullResult, Reporter } from '@playwright/test/reporter';

function git(args: string[]): string {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || 'unknown';
  } catch {
    return 'unknown';
  }
}

export default class MetadataReporter implements Reporter {
  private startedAt = new Date().toISOString();
  onBegin(_config: FullConfig): void { this.startedAt = new Date().toISOString(); }
  onEnd(result: FullResult): void {
    const directory = path.resolve('reports/generated/playwright'); fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'run-metadata.json'), JSON.stringify({ status: result.status, startedAt: this.startedAt, finishedAt: new Date().toISOString(), durationMs: result.duration, commit: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), seed: process.env.QA_SEED ?? 'default', os: `${os.platform()} ${os.release()}`, node: process.version }, null, 2));
  }
}
