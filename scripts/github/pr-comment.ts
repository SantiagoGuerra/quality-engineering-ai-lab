import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type GateResult = 'success' | 'failure' | 'cancelled' | 'skipped' | 'unknown';

export type QualityTool = {
  name: string;
  category: string;
  purpose: string;
  command: string;
  gate: string;
  owner: string;
  evidence: string;
  license: string;
  cost: string;
};

export type CommentContext = {
  repository: string;
  pullRequest: number;
  runId: string;
  sha: string;
  actor: string;
  seed: string;
  results: Record<string, GateResult>;
  tools: QualityTool[];
};

const marker = '<!-- talent-lab-quality-comment:v1 -->';

const cleanCell = (value: string) => value.replaceAll('|', '\\|').replaceAll('\n', ' ');
const shortSha = (sha: string) => sha.slice(0, 7) || 'local';
const icon = (result: GateResult) =>
  ({ success: '✅', failure: '❌', cancelled: '⏹️', skipped: '⏭️', unknown: '❔' })[result];

export async function loadQualityTools(
  file = resolve('config/quality-tools.json'),
): Promise<QualityTool[]> {
  const parsed = JSON.parse(await readFile(file, 'utf8')) as { tools: QualityTool[] };
  return parsed.tools;
}

export function findExistingCommentId(
  comments: Array<{ id: number; body?: string | null }>,
): number | undefined {
  return comments.find((comment) => comment.body?.includes(marker))?.id;
}

export function renderPrComment(context: CommentContext): string {
  const entries = Object.entries(context.results);
  const failed = entries.some(([, result]) => result === 'failure' || result === 'cancelled');
  const complete =
    entries.length > 0 &&
    entries.every(([, result]) => result === 'success' || result === 'skipped');
  const status = failed
    ? '❌ QA AUTOMATION: FAILED'
    : complete
      ? '✅ QA AUTOMATION: PASSED'
      : '🟡 QA AUTOMATION: REVIEW NEEDED';
  const runUrl = `https://github.com/${context.repository}/actions/runs/${context.runId}`;
  const gateRows = entries
    .map(([name, result]) => `| ${cleanCell(name)} | ${icon(result)} ${result} |`)
    .join('\n');
  const toolRows = context.tools
    .map(
      (tool) =>
        `| ${cleanCell(tool.name)} | ${cleanCell(tool.category)} | ${cleanCell(tool.purpose)} | \`${cleanCell(tool.command)}\` | ${cleanCell(tool.gate)} | ${cleanCell(tool.owner)} | ${cleanCell(tool.evidence)} | ${cleanCell(tool.license)} / ${cleanCell(tool.cost)} |`,
    )
    .join('\n');

  return `${marker}
## ${status}

Este comentario es actualizado por el mismo workflow; no crea ruido nuevo en cada ejecución.

| Gate | Resultado |
| --- | --- |
${gateRows}

- **Commit:** \`${shortSha(context.sha)}\`
- **Actor:** \`${context.actor}\`
- **Seed reproducible:** \`${context.seed}\`
- **Evidencia:** [artifacts, logs y ejecución completa](${runUrl})

> Los gates determinísticos bloquean el merge. Las señales programadas o experimentales informan, pero necesitan criterio humano antes de convertirse en un bloqueo.

<details>
<summary><strong>Inventario completo: ${context.tools.length} herramientas e integraciones</strong></summary>

| Herramienta | Área | Qué cubre | Cómo se ejecuta | Uso | Responsable | Evidencia | Licencia / costo |
| --- | --- | --- | --- | --- | --- | --- | --- |
${toolRows}

</details>

La automatización reduce incertidumbre; la decisión de negocio, la exploración y la aceptación del riesgo siguen siendo humanas.`;
}

function normalizeResult(value: string | undefined): GateResult {
  return ['success', 'failure', 'cancelled', 'skipped'].includes(value ?? '')
    ? (value as GateResult)
    : 'unknown';
}

async function githubRequest(path: string, init: RequestInit, token: string): Promise<Response> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'talent-lab-quality-comment',
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response;
}

async function publishComment(context: CommentContext, body: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required in publish mode');
  const [owner, repository] = context.repository.split('/');
  if (!owner || !repository) throw new Error(`Invalid GITHUB_REPOSITORY: ${context.repository}`);
  const commentsResponse = await githubRequest(
    `/repos/${owner}/${repository}/issues/${context.pullRequest}/comments?per_page=100`,
    { method: 'GET' },
    token,
  );
  const comments = (await commentsResponse.json()) as Array<{ id: number; body?: string | null }>;
  const existingId = findExistingCommentId(comments);
  const path = existingId
    ? `/repos/${owner}/${repository}/issues/comments/${existingId}`
    : `/repos/${owner}/${repository}/issues/${context.pullRequest}/comments`;
  await githubRequest(
    path,
    { method: existingId ? 'PATCH' : 'POST', body: JSON.stringify({ body }) },
    token,
  );
}

async function main(): Promise<void> {
  const mode = process.argv[2] ?? 'dry-run';
  const context: CommentContext = {
    repository: process.env.GITHUB_REPOSITORY ?? 'SantiagoGuerra/quality-engineering-ai-lab',
    pullRequest: Number(process.env.PR_NUMBER ?? 0),
    runId: process.env.GITHUB_RUN_ID ?? 'local',
    sha: process.env.GITHUB_SHA ?? 'local',
    actor: process.env.GITHUB_ACTOR ?? 'local-developer',
    seed: process.env.QA_SEED ?? '20260721',
    results: {
      'Static quality': normalizeResult(process.env.STATIC_RESULT ?? 'success'),
      'Runtime quality': normalizeResult(process.env.RUNTIME_RESULT ?? 'success'),
      'Security quality': normalizeResult(process.env.SECURITY_RESULT ?? 'success'),
      'Dependency review': normalizeResult(process.env.DEPENDENCY_RESULT ?? 'success'),
    },
    tools: await loadQualityTools(),
  };
  const body = renderPrComment(context);
  const output = resolve(process.env.PR_COMMENT_OUTPUT ?? 'reports/generated/github/pr-comment.md');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${body}\n`, 'utf8');
  if (mode === 'publish') {
    if (!context.pullRequest) throw new Error('PR_NUMBER is required in publish mode');
    await publishComment(context, body);
  } else if (mode !== 'dry-run') {
    throw new Error(`Unknown mode: ${mode}. Use dry-run or publish.`);
  }
  console.log(`${mode === 'publish' ? 'Published' : 'Rendered'} PR quality comment at ${output}`);
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
