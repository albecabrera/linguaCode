import assert from 'node:assert/strict';
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {createServer} from 'node:net';

const root = process.cwd();
const scratch = mkdtempSync(join(root, '.verify-tastatur-auth-'));
const port = await new Promise((resolve, reject) => {
  const socket = createServer();
  socket.once('error', reject);
  socket.listen(0, '127.0.0.1', () => {
    const value = socket.address().port;
    socket.close(() => resolve(value));
  });
});
let server;
try {
  mkdirSync(join(scratch, 'public'));
  mkdirSync(join(scratch, 'database'));
  for (const name of ['index.php', 'router.php', 'java-runner.php', 'tastatur-teacher.php']) {
    copyFileSync(join(root, 'public', name), join(scratch, 'public', name));
  }
  copyFileSync(join(root, 'database/schema.sql'), join(scratch, 'database/schema.sql'));
  mkdirSync(join(scratch, 'data'));
  const dbPath = join(scratch, 'data/linguacode.sqlite');
  const seeded = spawnSync('php', ['-r', `
    $db = new PDO('sqlite:' . $argv[1]);
    $db->exec(file_get_contents($argv[2]));
    $db->prepare('INSERT INTO keyboard_exercises(title,level,texts_json) VALUES(?,?,?)')
      ->execute(['Privat', 4, '["Nur Lehrer"]']);
  `, dbPath, join(scratch, 'database/schema.sql')], {encoding: 'utf8'});
  assert.equal(seeded.status, 0, seeded.stderr);
  const before = readFileSync(dbPath);
  server = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', 'public', 'public/router.php'], {
    cwd: scratch, env: {...process.env, LINGUACODE_TEACHER_PASSWORD_HASH: ''}, stdio: ['ignore', 'ignore', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('PHP server did not start')), 3000);
    server.once('error', (error) => { clearTimeout(timeout); reject(error); });
    server.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`PHP server exited: ${code}`)); });
    server.stderr.on('data', (chunk) => {
      if (chunk.toString().includes('Development Server')) { clearTimeout(timeout); resolve(); }
    });
  });
  const response = await fetch(`http://127.0.0.1:${port}/teacher/tastatur/1/data`, {redirect: 'manual'});
  const body = await response.text();
  assert.equal(response.status, 503, 'Teacher-only data must not be served without configured credentials even under php -S');
  assert.doesNotMatch(body, /(?:texts|Privat|Nur Lehrer)/);
  assert.deepEqual(readFileSync(dbPath), before, 'Rejected request must not modify stored data');
  console.log('PASS: anonymous local HTTP GET rejects teacher exercise data without database side effects.');
} finally {
  server?.kill();
  rmSync(scratch, {recursive: true, force: true});
}
