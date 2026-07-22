import type { Role } from './schemas.js';

export type Action =
  | 'candidate:read'
  | 'candidate:write'
  | 'project:write'
  | 'interview:write'
  | 'evaluation:write'
  | 'result:read'
  | 'audit:read';

const permissions: Record<Role, ReadonlySet<Action>> = {
  admin: new Set<Action>([
    'candidate:read',
    'candidate:write',
    'project:write',
    'interview:write',
    'evaluation:write',
    'result:read',
    'audit:read',
  ]),
  recruiter: new Set<Action>([
    'candidate:read',
    'candidate:write',
    'project:write',
    'interview:write',
    'result:read',
  ]),
  reviewer: new Set<Action>(['candidate:read', 'evaluation:write', 'result:read']),
  candidate: new Set<Action>([]),
};

export function can(role: Role, action: Action): boolean {
  return permissions[role].has(action);
}
