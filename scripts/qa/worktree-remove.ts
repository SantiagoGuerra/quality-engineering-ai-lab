import fs from 'node:fs';
import path from 'node:path';
import { argument, root, run } from './common.js';

const pr = argument('--pr', '');
if (!/^\d+$/.test(pr)) throw new Error('Pass a numeric PR: pnpm qa:worktree:remove -- --pr 123');
const destination = path.join(root, '.worktrees', `pr-${pr}`);
if (!fs.existsSync(destination)) throw new Error(`Worktree not found: ${destination}`);
run('docker', ['compose', '--project-directory', destination, 'down', '--remove-orphans'], { allowFailure: true });
run('git', ['worktree', 'remove', destination]);
run('git', ['branch', '-D', `qa/pr-${pr}`], { allowFailure: true });
console.log(`Removed worktree for PR ${pr}; Docker volumes were retained for recoverability.`);
