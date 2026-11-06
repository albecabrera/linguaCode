import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();
const testRoot = mkdtempSync(join(cwd, '.tmp-eduplay-browser-cleanup-test-'));
const fakeBrowser = join(testRoot, 'fake-browser');
const readyFile = join(testRoot, 'ready');
const sentinel = mkdtempSync(join(cwd, '.tmp-eduplay-browser-keep-'));
const sentinelFile = join(sentinel, 'sentinel');
writeFileSync(fakeBrowser, `#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
const profile = process.argv.find(value => value.startsWith('--user-data-dir='))?.slice('--user-data-dir='.length);
writeFileSync(process.env.EDUPLAY_FAKE_READY, profile || '');
setInterval(() => {}, 1000);
`);
chmodSync(fakeBrowser, 0o755);
// This sentinel is created by this test and is the similarly named path that cleanup must preserve.
writeFileSync(sentinelFile, 'pre-existing sentinel bytes');

const child = spawn(process.execPath, ['scripts/verify-eduplay-browser.mjs'], {
  cwd,
  env: { ...process.env, CHROME_PATH: fakeBrowser, EDUPLAY_FAKE_READY: readyFile },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
child.stdout.on('data', chunk => { output += chunk.toString(); });
child.stderr.on('data', chunk => { output += chunk.toString(); });

function waitFor(predicate, timeout = 10000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (predicate()) return resolve();
      if (Date.now() - started >= timeout) return reject(new Error(`Timed out waiting for cleanup fixture. Output: ${output}`));
      setTimeout(tick, 25);
    };
    tick();
  });
}

try {
  await waitFor(() => existsSync(readyFile) && readFileSync(readyFile, 'utf8').trim().length > 0);
  const profile = readFileSync(readyFile, 'utf8').trim();
  assert.ok(profile.startsWith(join(cwd, '.tmp-eduplay-browser-')), 'fake browser received project-local profile');
  assert.notEqual(profile, sentinel, 'profile is distinct from the pre-existing sentinel');
  assert.equal(readFileSync(sentinelFile, 'utf8'), 'pre-existing sentinel bytes');
  child.kill('SIGTERM');
  const [code, signal] = await new Promise(resolve => child.once('exit', (exitCode, exitSignal) => resolve([exitCode, exitSignal])));
  assert.equal(code, 143, `SIGTERM cleanup exit code; output: ${output}`);
  assert.equal(signal, null);
  assert.equal(readFileSync(sentinelFile, 'utf8'), 'pre-existing sentinel bytes', 'sentinel bytes remain unchanged');
  assert.equal(existsSync(profile), false, 'owned browser profile is removed after SIGTERM');
  console.log('EduPlay browser cleanup checks passed: SIGTERM removes owned profile and preserves sentinel.');
} finally {
  if (!child.killed) child.kill('SIGTERM');
  rmSync(testRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  rmSync(sentinel, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
