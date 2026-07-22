import { describe, expect, it } from 'vitest';
import {
  findExistingCommentId,
  renderPrComment,
  type CommentContext,
} from '../../scripts/github/pr-comment.js';

const context: CommentContext = {
  repository: 'SantiagoGuerra/quality-engineering-ai-lab',
  pullRequest: 7,
  runId: '123',
  sha: 'abcdef123456',
  actor: 'qa-demo',
  seed: '20260721',
  results: {
    'Static quality': 'success',
    'Runtime quality': 'success',
  },
  tools: [
    {
      name: 'Playwright',
      category: 'E2E',
      purpose: 'Screenshots, videos y trazas',
      command: 'pnpm test:e2e',
      gate: 'required',
      owner: 'QA Automation',
      evidence: 'reports/generated/playwright',
      license: 'Apache-2.0',
      cost: 'Open source',
    },
  ],
};

describe('GitHub PR quality comment', () => {
  it('renders a human-readable passing summary and the tool inventory', () => {
    const markdown = renderPrComment(context);
    expect(markdown).toContain('QA AUTOMATION: PASSED');
    expect(markdown).toContain('Playwright');
    expect(markdown).toContain('Screenshots, videos y trazas');
    expect(markdown).toContain('actions/runs/123');
  });

  it('marks the summary as failed when one deterministic gate fails', () => {
    const markdown = renderPrComment({
      ...context,
      results: { ...context.results, 'Runtime quality': 'failure' },
    });
    expect(markdown).toContain('QA AUTOMATION: FAILED');
    expect(markdown).toContain('❌ failure');
  });

  it('finds the bot marker so reruns update instead of duplicate', () => {
    expect(
      findExistingCommentId([
        { id: 1, body: 'human note' },
        { id: 2, body: '<!-- talent-lab-quality-comment:v1 -->\nreport' },
      ]),
    ).toBe(2);
  });
});
