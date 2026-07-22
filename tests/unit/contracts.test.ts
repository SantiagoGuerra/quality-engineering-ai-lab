import { describe, expect, it } from 'vitest';
import { CandidateInputSchema, EmailSchema, LoginSchema, averageScore, can, normalizeEmail, pageOffset, stableSerialize } from '@talent-lab/contracts';
import { hashPassword, verifyPassword } from '@talent-lab/database';

describe('critical domain contracts', () => {
  it('normalizes a valid email without losing Unicode normalization', () => {
    expect(EmailSchema.parse('  RECRUITER@Talent.Test ')).toBe('recruiter@talent.test');
    expect(normalizeEmail('  ZOË@EXAMPLE.TEST ')).toBe('zoë@example.test');
  });

  it.each(['missing-at-sign', '@example.test', 'a@', `${'a'.repeat(250)}@x.test`])('rejects invalid email %s', (email) => {
    expect(EmailSchema.safeParse(email).success).toBe(false);
  });

  it('rejects oversized and incomplete candidate inputs', () => {
    expect(CandidateInputSchema.safeParse({ email: 'valid@example.test', firstName: '', lastName: 'Person' }).success).toBe(false);
    expect(CandidateInputSchema.safeParse({ email: 'valid@example.test', firstName: 'A'.repeat(81), lastName: 'Person' }).success).toBe(false);
  });

  it('requires a meaningful local password', () => {
    expect(LoginSchema.safeParse({ email: 'qa@example.test', password: 'short' }).success).toBe(false);
  });

  it('enforces least privilege for all roles', () => {
    expect(can('admin', 'audit:read')).toBe(true);
    expect(can('recruiter', 'candidate:write')).toBe(true);
    expect(can('reviewer', 'candidate:write')).toBe(false);
    expect(can('candidate', 'candidate:read')).toBe(false);
  });

  it('calculates stable averages including empty and fractional sets', () => {
    expect(averageScore([])).toBeNull();
    expect(averageScore([0])).toBe(0);
    expect(averageScore([4, 5, 3.25])).toBe(4.08);
  });

  it('calculates a non-negative pagination offset', () => {
    expect(pageOffset(1, 20)).toBe(0);
    expect(pageOffset(3, 20)).toBe(40);
    expect(pageOffset(-10, 20)).toBe(0);
  });

  it('serializes object keys deterministically while retaining array order', () => {
    expect(stableSerialize({ z: 1, a: { d: 4, c: 3 }, list: [2, 1] })).toBe('{"a":{"c":3,"d":4},"list":[2,1],"z":1}');
    expect(stableSerialize(null)).toBe('null');
    expect(stableSerialize('x')).toBe('"x"');
  });

  it('hashes and verifies local passwords without storing plaintext', () => {
    const encoded = hashPassword('QaDemo!2026', 'unit-test-salt');
    expect(encoded).not.toContain('QaDemo!2026');
    expect(verifyPassword('QaDemo!2026', encoded)).toBe(true);
    expect(verifyPassword('wrong-password', encoded)).toBe(false);
    expect(verifyPassword('anything', 'invalid')).toBe(false);
  });
});
