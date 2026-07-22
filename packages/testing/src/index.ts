import type { CandidateInput } from '@talent-lab/contracts';
import { HttpResponse, http } from 'msw';

let sequence = 0;

export function candidateFactory(overrides: Partial<CandidateInput> = {}): CandidateInput {
  sequence += 1;
  return { email: `candidate-${sequence}@example.test`, firstName: 'Synthetic', lastName: `Candidate ${sequence}`, location: 'Remote', ...overrides };
}

export function resetFactorySequence(): void { sequence = 0; }

/**
 * Opt-in handlers for component stories/tests. They use synthetic records and
 * deliberately do not start a worker or server at import time.
 */
export const mockHandlers = [
  http.get('*/api/candidates', () => {
    const input = candidateFactory({ email: 'mock-candidate@example.test' });
    return HttpResponse.json({
      items: [{
        ...input,
        id: '00000000-0000-4000-8000-000000000101',
        version: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }],
      page: 1,
      pageSize: 10,
      total: 1,
    });
  }),
  http.get('*/api/projects', () => HttpResponse.json([
    { id: '00000000-0000-4000-8000-000000000201', name: 'Synthetic Platform', description: 'MSW fixture', createdAt: '2026-01-01T00:00:00.000Z' },
  ])),
];
