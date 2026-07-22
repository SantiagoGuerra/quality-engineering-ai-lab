import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { config } from 'dotenv';
import { JiraClient } from './client.js';
import { buildComment } from './comment.js';
import type { FailureClassification, QaEvidence, QaStatus } from './types.js';

config({ path: '.env', quiet: true });
const git = (args: string[]) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || 'unknown';
  } catch {
    return 'unknown';
  }
};
const command = process.argv[2] ?? 'dry-run';
const status = (process.env.QA_STATUS ?? 'PASSED') as QaStatus;
const classification = (process.env.QA_CLASSIFICATION ?? (status === 'PASSED' ? 'Revisión humana' : 'Defecto reproducible')) as FailureClassification;
const evidence: QaEvidence = { status, classification, summary: process.env.QA_SUMMARY ?? 'Deterministic local quality gate completed.', commit: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']), seed: process.env.QA_SEED ?? 'default', timestamp: new Date().toISOString(), artifacts: [{ label: 'Local report index', url: process.env.QA_REPORT_URL ?? 'http://localhost:4174/' }] };
const body = buildComment(evidence);
const directory = path.resolve('reports/generated/jira'); fs.mkdirSync(directory, { recursive: true });

if (command === 'dry-run') {
  const output = { mode: 'dry-run', issueKey: process.env.JIRA_ISSUE_KEY ?? 'QE-000', body };
  fs.writeFileSync(path.join(directory, 'dry-run.json'), JSON.stringify(output, null, 2)); process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
} else {
  const client = new JiraClient({ baseUrl: process.env.JIRA_BASE_URL ?? '', userEmail: process.env.JIRA_USER_EMAIL ?? '', apiToken: process.env.JIRA_API_TOKEN ?? '', issueKey: process.env.JIRA_ISSUE_KEY ?? '', enabled: process.env.JIRA_ENABLED === 'true' });
  const result = await client.upsert(body); fs.writeFileSync(path.join(directory, 'result.json'), JSON.stringify(result, null, 2)); process.stdout.write(`${JSON.stringify(result)}\n`);
}
