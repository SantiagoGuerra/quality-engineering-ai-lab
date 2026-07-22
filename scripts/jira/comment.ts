import type { QaEvidence } from './types.js';

export const marker = '[talent-lab-qa-automation:v1]';

export interface AdfNode { type: string; text?: string; attrs?: Record<string, unknown>; marks?: Array<{ type: string; attrs: Record<string, unknown> }>; content?: AdfNode[] }

const paragraph = (text: string): AdfNode => ({ type: 'paragraph', content: [{ type: 'text', text }] });

export function redact(value: string): string {
  return value
    .replace(/(JIRA_API_TOKEN|authorization|token|password)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [REDACTED]');
}

export function buildComment(evidence: QaEvidence): AdfNode {
  const metadata: Array<[string, string]> = [
    ['Commit', evidence.commit],
    ['Rama', evidence.branch],
    ['Seed', evidence.seed],
    ['Timestamp', evidence.timestamp],
  ];
  const content: AdfNode[] = [
    paragraph(marker),
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: `QA AUTOMATION: ${evidence.status}` }] },
    paragraph(redact(evidence.summary)),
    paragraph(`Clasificación: ${evidence.classification}`),
    { type: 'bulletList', content: metadata.map(([label, value]) => ({ type: 'listItem', content: [paragraph(`${label}: ${redact(value)}`)] })) },
  ];
  if (evidence.artifacts.length) content.push({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Evidencias' }] }, { type: 'bulletList', content: evidence.artifacts.map((artifact) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: artifact.label, marks: [{ type: 'link', attrs: { href: artifact.url } }] }] }] })) });
  content.push(paragraph('Videos grandes permanecen en artifacts de CI; Jira recibe enlaces, no copias indiscriminadas.'));
  return { type: 'doc', attrs: { version: 1 }, content };
}
