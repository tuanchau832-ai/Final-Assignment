import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/run_e2e_api.py', import.meta.url));
const env = {
  ...process.env,
  HWW_E2E_USERNAME: 'e2e.reviewer',
  HWW_E2E_PASSWORD: randomBytes(24).toString('hex'),
  HWW_E2E_ADMIN_USERNAME: 'e2e.admin',
  HWW_E2E_ADMIN_PASSWORD: randomBytes(24).toString('hex'),
  HWW_E2E_OPERATOR_USERNAME: 'e2e.operator',
  HWW_E2E_OPERATOR_PASSWORD: randomBytes(24).toString('hex'),
};
const port = env.HWW_E2E_PORT || '8176';
const health = `http://127.0.0.1:${port}/api/v1/health`;
const playwright = createRequire(import.meta.url).resolve('@playwright/test/cli');

async function ready() {
  try {
    return (await fetch(health, { signal: AbortSignal.timeout(500) })).ok;
  } catch {
    return false;
  }
}

if (await ready()) throw new Error(`Port ${port} already serves an API. Choose a fresh HWW_E2E_PORT.`);
const server = spawn(env.HWW_PYTHON || 'python', [script], { env, stdio: 'inherit' });
let serverFailure;
server.on('error', error => { serverFailure = error; });
const closeServer = () => { if (server.exitCode === null) server.kill('SIGTERM'); };
process.once('SIGTERM', closeServer);
process.once('SIGINT', closeServer);
try {
  const deadline = Date.now() + 30_000;
  while (!(await ready())) {
    if (serverFailure) throw serverFailure;
    if (server.exitCode !== null) throw new Error(`Test API exited (${server.exitCode}).`);
    if (Date.now() > deadline) throw new Error('Test API did not become ready.');
    await delay(200);
  }
  const tests = spawn(process.execPath, [playwright, 'test', ...process.argv.slice(2)], { env, stdio: 'inherit' });
  process.exitCode = await new Promise((resolve, reject) => {
    tests.on('error', reject);
    tests.on('exit', code => resolve(code ?? 1));
  });
} finally {
  closeServer();
}
