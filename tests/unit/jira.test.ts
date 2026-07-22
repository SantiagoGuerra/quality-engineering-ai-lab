import { describe, expect, it, vi } from 'vitest';
import { JiraClient } from '../../scripts/jira/client.js';
import { buildComment, marker, redact } from '../../scripts/jira/comment.js';

const evidence = { status: 'FAILED' as const, classification: 'Accesibilidad' as const, summary: 'password=secret and Bearer abc.def.ghi failed', commit: 'abc123', branch: 'feature/qe', seed: 'accessibility-review', artifacts: [{ label: 'Playwright report', url: 'https://ci.example.invalid/report' }], timestamp: '2026-07-21T12:00:00.000Z' };

describe('Jira adapter', () => {
  it('builds ADF and redacts secrets while retaining the idempotency marker', () => {
    const serialized = JSON.stringify(buildComment(evidence));
    expect(serialized).toContain(marker); expect(serialized).toContain('QA AUTOMATION: FAILED'); expect(serialized).not.toContain('secret'); expect(serialized).not.toContain('abc.def.ghi');
    expect(redact('token=123 password:abc')).toBe('token=[REDACTED] password=[REDACTED]');
  });

  it('updates an existing marker comment instead of creating spam', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(JSON.stringify({ values: [{ id: '42', body: buildComment(evidence) }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: '42' }), { status: 200 }));
    const client = new JiraClient({ baseUrl: 'https://jira.example.invalid', userEmail: 'qa@example.invalid', apiToken: 'fake', issueKey: 'QE-1', enabled: true }, fetcher, 0);
    await expect(client.upsert(buildComment(evidence))).resolves.toEqual({ action: 'updated', id: '42' });
    expect(fetcher).toHaveBeenCalledTimes(2); expect(fetcher.mock.calls[1]?.[1]?.method).toBe('PUT');
  });

  it('creates one comment when no marker exists and refuses mutation by default', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(JSON.stringify({ values: [] }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({ id: '99' }), { status: 201 }));
    const enabled = new JiraClient({ baseUrl: 'https://jira.example.invalid', userEmail: 'qa@example.invalid', apiToken: 'fake', issueKey: 'QE-1', enabled: true }, fetcher, 0);
    await expect(enabled.upsert(buildComment(evidence))).resolves.toEqual({ action: 'created', id: '99' });
    const disabled = new JiraClient({ baseUrl: '', userEmail: '', apiToken: '', issueKey: '', enabled: false }, fetcher, 0);
    await expect(disabled.upsert(buildComment(evidence))).rejects.toThrow('disabled');
  });
});
