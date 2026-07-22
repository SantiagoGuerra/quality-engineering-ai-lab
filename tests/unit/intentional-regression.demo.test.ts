import { averageScore } from '@talent-lab/contracts';
import { describe, expect, it } from 'vitest';

describe('intentional unit regression demo', () => {
  it('shows how a wrong business expectation blocks the static gate', () => {
    expect(averageScore([2, 4])).toBe(4);
  });
});
