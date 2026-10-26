import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

const root = new URL('../', import.meta.url);
const server = spawn(process.execPath, ['scripts/ki-wp8-teacher-preview.mjs', '--port', '0'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.setEncoding('utf8');
server.stdout.on('data', (chunk) => { output += chunk; });
const deadline = Date.now() + 5000;
while (!output.includes('READY')) {
  if (Date.now() > deadline) throw new Error(`Preview server did not start: ${output}`);
  await new Promise((resolve) => setTimeout(resolve, 10));
}
const port = Number(output.match(/READY 127\.0\.0\.1:(\d+)/)?.[1]);
assert.ok(port > 0);
const get = (path) => fetch(`http://127.0.0.1:${port}${path}`);
try {
  const html = await get('/docs/ki-wp8/demo/index.html');
  assert.equal(html.status, 200);
  assert.match(await html.text(), /Lehrer-Cockpit – KI WP8/);
  const app = await get('/docs/ki-wp8/demo/app.mjs');
  assert.equal(app.status, 200);
  assert.match(await app.text(), /assignment-form/);
  const core = await get('/pages/ki8/module2-core.mjs');
  assert.equal(core.status, 200);
  assert.match(await core.text(), /export const lessons/);
  for (const path of [
    '/teaching-materials/ki-wp8/source/AB1.pdf',
    '/teaching-materials/ki-wp8/source/teacher-only/Lösung.pdf',
    '/docs/ki-wp8/demo/../../../teaching-materials/ki-wp8/source/AB1.pdf',
    '/%2e%2e/%2e%2e/teaching-materials/ki-wp8/source/AB1.pdf',
    '/pages/ki8/../teaching-materials/ki-wp8/source/AB1.pdf',
    '/docs/ki-wp8/demo/',
  ]) {
    assert.equal((await get(path)).status, 404, path);
  }
  console.log('PASS: loopback preview serves only demo assets and module2 core; PDFs, traversal and unlisted paths return 404.');
} finally {
  server.kill('SIGTERM');
  await once(server, 'close');
}
