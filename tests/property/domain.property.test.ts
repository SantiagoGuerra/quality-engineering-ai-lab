import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { CandidateInputSchema, averageScore, can, normalizeEmail, pageOffset, roles, stableSerialize, type Action } from '@talent-lab/contracts';
import { MemoryTalentRepository } from '@talent-lab/database';

const runs = process.env.CI ? 1_000 : 250;

describe('generative domain invariants', () => {
  it('normalizing an email is idempotent and removes surrounding whitespace', () => {
    fc.assert(fc.property(fc.string({ maxLength: 100 }), (value) => { const once = normalizeEmail(value); expect(normalizeEmail(once)).toBe(once); expect(once).toBe(once.trim()); }), { numRuns: runs });
  });

  it('accepts generated conservative email addresses', () => {
    const atom = fc.stringMatching(/^[a-z][a-z0-9]{0,15}$/);
    fc.assert(fc.property(atom, atom, (local, domain) => { expect(CandidateInputSchema.safeParse({ email: `${local}@${domain}.test`, firstName: 'A', lastName: 'B' }).success).toBe(true); }), { numRuns: runs });
  });

  it('pagination offsets never go negative and advance by page size', () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), fc.integer({ min: 1, max: 100 }), (page, size) => { expect(pageOffset(page, size)).toBeGreaterThanOrEqual(0); expect(pageOffset(page + 1, size) - pageOffset(page, size)).toBe(size); }), { numRuns: runs });
  });

  it('stable serialization ignores insertion order', () => {
    fc.assert(fc.property(fc.dictionary(fc.string({ minLength: 1, maxLength: 12 }), fc.jsonValue()), (record) => { const reversed = Object.fromEntries(Object.entries(record).reverse()); expect(stableSerialize(record)).toBe(stableSerialize(reversed)); }), { numRuns: runs });
  });

  it('scores remain within the source range', () => {
    fc.assert(fc.property(fc.array(fc.double({ min: 0, max: 5, noNaN: true }), { minLength: 1, maxLength: 30 }), (scores) => { const result = averageScore(scores)!; expect(result).toBeGreaterThanOrEqual(Math.min(...scores) - 0.01); expect(result).toBeLessThanOrEqual(Math.max(...scores) + 0.01); }), { numRuns: runs });
  });

  it('average score is unchanged when every observation is replayed', () => {
    fc.assert(fc.property(fc.array(fc.double({ min: 0, max: 5, noNaN: true }), { minLength: 1, maxLength: 30 }), (scores) => { expect(averageScore(scores.flatMap((score) => [score, score]))).toBe(averageScore(scores)); }), { numRuns: runs });
  });

  it('permission answers are total and boolean for every role/action combination', () => {
    const actions: Action[] = ['candidate:read', 'candidate:write', 'project:write', 'interview:write', 'evaluation:write', 'result:read', 'audit:read'];
    fc.assert(fc.property(fc.constantFrom(...roles), fc.constantFrom(...actions), (role, action) => { expect(typeof can(role, action)).toBe('boolean'); }), { numRuns: runs });
  });

  it('replaying an idempotency key never overwrites its first response', async () => {
    const repository = new MemoryTalentRepository();
    await fc.assert(fc.asyncProperty(fc.uuid(), fc.jsonValue(), fc.jsonValue(), async (key, first, second) => { repository.idempotency.clear(); await repository.saveIdempotentResponse(key, first); await repository.saveIdempotentResponse(key, second); expect(await repository.getIdempotentResponse(key)).toEqual(first); }), { numRuns: Math.min(runs, 100) });
  });
});
