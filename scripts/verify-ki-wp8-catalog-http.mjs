import assert from 'node:assert/strict';
import {copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';

const root = process.cwd();
const scratch = mkdtempSync(join(root, '.verify-ki8-route-'));
let server;
try {
  mkdirSync(join(scratch, 'public'));
  mkdirSync(join(scratch, 'database'));
  mkdirSync(join(scratch, 'pages'));
  for (const name of ['index.php', 'router.php', 'java-runner.php', 'tastatur-teacher.php']) {
    copyFileSync(join(root, 'public', name), join(scratch, 'public', name));
  }
  copyFileSync(join(root, 'database/schema.sql'), join(scratch, 'database/schema.sql'));
  for (const name of ['ki8', 'java-interaktiv', 'tastatur']) {
    cpSync(join(root, 'pages', name), join(scratch, 'pages', name), {recursive: true});
  }
  const port = await new Promise((resolve, reject) => {
    const socket = createServer();
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', () => {
      const value = socket.address().port;
      socket.close(() => resolve(value));
    });
  });
  server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', 'public', 'public/router.php'], {
    cwd: scratch, env: {...process.env, LINGUACODE_TEACHER_PASSWORD_HASH: ''}, stdio: ['ignore', 'ignore', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('PHP server did not start')), 3000);
    server.once('error', (error) => { clearTimeout(timeout); reject(error); });
    server.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`PHP exited ${code}`)); });
    server.stderr.on('data', (chunk) => {
      if (chunk.toString().includes('Development Server')) { clearTimeout(timeout); resolve(); }
    });
  });
  const get = (path) => fetch(`http://127.0.0.1:${port}${path}`, {redirect: 'manual'});
  const course = await get('/ki8/');
  assert.equal(course.status, 200);
  assert.match(course.headers.get('content-type'), /^text\/html/);
  assert.match(await course.text(), /KI entdecken, verstehen und gestalten/);
  const lesson = await get('/ki8/modul-1.html');
  assert.equal(lesson.status, 200);
  const lessonHtml = await lesson.text();
  assert.match(lessonHtml, /id="stunde-1"/);
  assert.match(lessonHtml, /id="stunde-2"/);
  const js = await get('/ki8/module1-ui.mjs');
  assert.equal(js.status, 200);
  assert.match(js.headers.get('content-type'), /^text\/javascript/);
  for (const sibling of ['/java-interaktiv/', '/tastatur/']) {
    const response = await get(sibling);
    assert.equal(response.status, 200, `${sibling} must still work`);
    assert.match(response.headers.get('content-type'), /^text\/html/);
  }
  const informatik = await get('/?subject=informatik');
  assert.equal(informatik.status, 200);
  assert.match(await informatik.text(), /UV Künstliche Intelligenz/);
  const spanisch = await get('/?subject=spanisch');
  assert.equal(spanisch.status, 200);
  assert.doesNotMatch(await spanisch.text(), /UV Künstliche Intelligenz/);
  const before = readFileSync(join(scratch, 'data/linguacode.sqlite'));
  const escape = await get('/ki8/%2e%2e/%2e%2e/database/schema.sql');
  assert.equal(escape.status, 404);
  assert.doesNotMatch(await escape.text(), /CREATE TABLE/);
  assert.deepEqual(readFileSync(join(scratch, 'data/linguacode.sqlite')), before);
  console.log('PASS: local KI route/catalog/filter/MIME, existing sibling routes and traversal rejection in isolated SQLite.');
} finally {
  server?.kill();
  rmSync(scratch, {recursive: true, force: true});
}
