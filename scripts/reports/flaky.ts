import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

interface PlaywrightResult { status: string; retry?: number; duration?: number }
interface PlaywrightTest { projectName?: string; results?: PlaywrightResult[] }
interface PlaywrightSpec { title?: string; tests?: PlaywrightTest[] }
interface PlaywrightSuite { title?: string; specs?: PlaywrightSpec[]; suites?: PlaywrightSuite[] }
interface QuarantineEntry { 'test-id': string; owner: string; reason: string; 'introduced-at': string; 'expires-at': string; 'linked-issue': string }

const resultsPath = path.resolve('reports/generated/playwright/results.json');
const quarantinePath = path.resolve('tests/flaky/quarantine.json');
const outputPath = path.resolve('reports/generated/flaky/report.json');
const report = { generatedAt: new Date().toISOString(), retries: [] as Array<{ testId: string; project: string; firstAttempt: string; finalAttempt: string; retries: number; classification: string }>, quarantine: JSON.parse(fs.readFileSync(quarantinePath, 'utf8')).entries as QuarantineEntry[], expired: [] as QuarantineEntry[] };

const visit = (suite: PlaywrightSuite, parents: string[]) => {
  const next = suite.title ? [...parents, suite.title] : parents;
  for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
    const attempts = test.results ?? []; const retried = attempts.filter((attempt) => (attempt.retry ?? 0) > 0);
    if (retried.length) report.retries.push({ testId: [...next, spec.title ?? 'unknown'].join(' › '), project: test.projectName ?? 'unknown', firstAttempt: attempts[0]?.status ?? 'unknown', finalAttempt: attempts.at(-1)?.status ?? 'unknown', retries: retried.length, classification: attempts.at(-1)?.status === 'passed' ? 'FLAKY' : 'FAILED' });
  }
  for (const child of suite.suites ?? []) visit(child, next);
};

if (fs.existsSync(resultsPath)) {
  const input = JSON.parse(fs.readFileSync(resultsPath, 'utf8')) as { suites?: PlaywrightSuite[] };
  for (const suite of input.suites ?? []) visit(suite, []);
}
const today = new Date().toISOString().slice(0, 10); report.expired = report.quarantine.filter((entry) => entry['expires-at'] < today);
fs.mkdirSync(path.dirname(outputPath), { recursive: true }); fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
process.stdout.write(`${JSON.stringify({ retries: report.retries.length, quarantined: report.quarantine.length, expired: report.expired.length, outputPath })}\n`);
if (report.expired.length) { console.error('Expired quarantines are blocking; remove or renew through human review.'); process.exitCode = 1; }
