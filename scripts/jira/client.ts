import { marker, type AdfNode } from './comment.js';

interface JiraComment { id: string; body: AdfNode }
interface JiraCommentPage { values: JiraComment[] }
type Fetcher = typeof fetch;

export interface JiraConfig { baseUrl: string; userEmail: string; apiToken: string; issueKey: string; enabled: boolean }

export class JiraClient {
  private lastRequestAt = 0;
  constructor(private readonly config: JiraConfig, private readonly fetcher: Fetcher = fetch, private readonly minIntervalMs = 250) {}

  private async request(path: string, init: RequestInit): Promise<Response> {
    if (!this.config.enabled) throw new Error('Jira mutations are disabled. Set JIRA_ENABLED=true explicitly.');
    const waitMs = this.minIntervalMs - (Date.now() - this.lastRequestAt);
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    this.lastRequestAt = Date.now();
    const response = await this.fetcher(`${this.config.baseUrl.replace(/\/$/, '')}${path}`, { ...init, headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Basic ${Buffer.from(`${this.config.userEmail}:${this.config.apiToken}`).toString('base64')}`, ...init.headers } });
    if (!response.ok) { const requestId = response.headers.get('x-arequestid') ?? 'unknown'; throw new Error(`Jira API ${response.status} (request ${requestId}); response body intentionally redacted`); }
    return response;
  }

  async findAutomationComment(): Promise<JiraComment | null> {
    const response = await this.request(`/rest/api/3/issue/${encodeURIComponent(this.config.issueKey)}/comment?maxResults=100`, { method: 'GET' });
    const page = await response.json() as JiraCommentPage;
    return page.values.find((comment) => JSON.stringify(comment.body).includes(marker)) ?? null;
  }

  async upsert(body: AdfNode): Promise<{ action: 'created' | 'updated'; id: string }> {
    const existing = await this.findAutomationComment();
    if (existing) { const response = await this.request(`/rest/api/3/issue/${encodeURIComponent(this.config.issueKey)}/comment/${encodeURIComponent(existing.id)}`, { method: 'PUT', body: JSON.stringify({ body }) }); const result = await response.json() as { id: string }; return { action: 'updated', id: result.id }; }
    const response = await this.request(`/rest/api/3/issue/${encodeURIComponent(this.config.issueKey)}/comment`, { method: 'POST', body: JSON.stringify({ body }) });
    const result = await response.json() as { id: string }; return { action: 'created', id: result.id };
  }
}
