import { candidateFactory, mockHandlers, resetFactorySequence } from '@talent-lab/testing';
import { beforeEach, describe, expect, it } from 'vitest';

describe('synthetic test support', () => {
  beforeEach(() => resetFactorySequence());

  it('creates deterministic synthetic candidates without real personal data', () => {
    expect(candidateFactory()).toMatchObject({
      email: 'candidate-1@example.test',
      firstName: 'Synthetic',
      lastName: 'Candidate 1',
    });
  });

  it('publishes opt-in MSW handlers without starting network interception', () => {
    expect(mockHandlers).toHaveLength(2);
  });
});
