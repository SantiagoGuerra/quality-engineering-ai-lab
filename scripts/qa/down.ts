import { run } from './common.js';

run('docker', ['compose', 'down', '--remove-orphans']);
console.log('QA services stopped. Data volume retained; use docker compose down -v for an explicit destructive reset.');
