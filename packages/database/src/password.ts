import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')): string {
  const digest = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `scrypt:v1:${salt}:${digest}`;
}

export function verifyPassword(password: string, encoded: string): boolean {
  const [algorithm, version, salt, expectedHex] = encoded.split(':');
  if (algorithm !== 'scrypt' || version !== 'v1' || !salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
