import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import {request as httpRequest} from 'node:http';

const root = new URL('../', import.meta.url);
const sourcePath = new URL('../teaching-materials/ki-wp8/source/01_Klassifikation_Anwendung_ver1.pdf', import.meta.url);
const server = spawn(process.execPath, ['scripts/ki-wp8-lesson-preview.mjs', '--port', '0'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.setEncoding('utf8');
server.stdout.on('data', (chunk) => { output += chunk; });
const deadline = Date.now() + 5000;
while (!output.includes('READY')) {
  if (Date.now() > deadline) throw new Error(`Lesson preview server did not start: ${output}`);
  await new Promise((resolve) => setTimeout(resolve, 10));
}
assert.match(output, /READY 127\.0\.0\.1:\d+/);
const port = Number(output.match(/READY 127\.0\.0\.1:(\d+)/)?.[1]);
assert.ok(port > 0);
const get = (path, options) => fetch(`http://127.0.0.1:${port}${path}`, options);
const rawStatus = (path, method = 'GET') => new Promise((resolve, reject) => {
  const request = httpRequest({hostname: '127.0.0.1', port, path, method}, (response) => {
    response.resume();
    response.on('end', () => resolve(response.statusCode));
  });
  request.on('error', reject);
  request.end();
});
try {
  const html = await get('/docs/ki-wp8/lesson-example/index.html');
  assert.equal(html.status, 200);
  const htmlText = await html.text();
  assert.match(htmlText, /Arbeitsblatt als PDF/);
  assert.match(htmlText, /<iframe[^>]+src="\/teaching-materials\/ki-wp8\/source\/01_Klassifikation_Anwendung_ver1\.pdf"/);
  assert.match(htmlText, /Video-Platzhalter/);
  assert.match(htmlText, /keine automatischen Netzwerkaufrufe/i);
  assert.match(htmlText, /activity-form/);
  assert.match(htmlText, /vorgegebene Beispielaufteilung/i);
  assert.match(htmlText, /Fledermaus.*Säugetier.*Vogel/i);
  assert.match(htmlText, /Testgenauigkeit/);
  const app = await get('/docs/ki-wp8/lesson-example/app.mjs');
  assert.equal(app.status, 200);
  const appText = await app.text();
  assert.match(appText, /export function gradeActivity/);
  assert.match(appText, /addEventListener\(['"]submit/);
  const {gradeActivity, formatFeedback} = await import(new URL('../docs/ki-wp8/lesson-example/app.mjs', import.meta.url));
  const correct = {a: 'training', b: 'training', c: 'test', d: 'test'};
  const rulePredictions = {a: 'Vogel', b: 'Vogel', c: 'kein Vogel', d: 'Vogel'};
  const appliedRule = gradeActivity(correct, rulePredictions);
  assert.deepEqual(appliedRule, {score: 8, total: 8, modelTestCorrect: 1, modelTestTotal: 2, modelFalsePositives: ['Fledermaus-Beschreibung'], errors: []});
  assert.equal(formatFeedback(appliedRule), '8 von 8. Regelanwendung vollständig. Modell-Testgenauigkeit: 1 von 2 (50 %). Falsch-positiv des Modells: Fledermaus-Beschreibung (Flügelregel sagt „Vogel“, wahres Label „Säugetier“).');
  const wrongBat = gradeActivity(correct, {...rulePredictions, d: 'kein Vogel'});
  assert.equal(wrongBat.score, 7);
  assert.deepEqual(wrongBat.modelFalsePositives, ['Fledermaus-Beschreibung']);
  assert.equal(wrongBat.modelTestCorrect, 1);
  assert.deepEqual(wrongBat.errors, ['Fledermaus-Beschreibung: Regelanwendung falsch: erwartet „Vogel“, gewählt „kein Vogel“.']);
  assert.match(formatFeedback(wrongBat), /Regelanwendung prüfen\. Modell-Testgenauigkeit: 1 von 2 \(50 %\).*Regelanwendung falsch: erwartet „Vogel“, gewählt „kein Vogel“/);
  const unanswered = gradeActivity({}, {});
  assert.equal(unanswered.score, 0);
  assert.equal(unanswered.modelTestCorrect, 1);
  assert.equal(unanswered.modelTestTotal, 2);
  assert.equal(unanswered.errors.length, 8);
  assert.equal(gradeActivity({...correct, d: 'training'}, rulePredictions).errors.length, 1);
  const css = await get('/docs/ki-wp8/lesson-example/style.css');
  assert.equal(css.status, 200);

  const source = await readFile(sourcePath);
  const pdf = await get('/teaching-materials/ki-wp8/source/01_Klassifikation_Anwendung_ver1.pdf');
  assert.equal(pdf.status, 200);
  assert.equal(pdf.headers.get('content-type'), 'application/pdf');
  assert.deepEqual(Buffer.from(await pdf.arrayBuffer()), source);

  for (const path of [
    '/',
    '/docs/ki-wp8/lesson-example/',
    '/docs/ki-wp8/lesson-example/../app.mjs',
    '/%2e%2e/%2e%2e/teaching-materials/ki-wp8/source/01_Klassifikation_Anwendung_ver1.pdf',
    '/teaching-materials/ki-wp8/source/teacher-only/Lösung_02_TrainingEinesEBaumsZurKlassifikation_ver4.pdf',
    '/teaching-materials/ki-wp8/source/02_TrainingEinesEBaumsZurKlassifikation_ver4.pdf',
    '/teaching-materials/ki-wp8/source/01_Klassifikation_Anwendung_ver1.pdf/extra',
    '/docs/ki-wp8/lesson-example/%ZZ',
  ]) {
    const status = path.includes('%2e') ? await rawStatus(path) : (await get(path)).status;
    assert.equal(status, 404, path);
  }
  for (const method of ['HEAD', 'POST', 'PUT', 'OPTIONS']) {
    assert.equal(await rawStatus('/teaching-materials/ki-wp8/source/01_Klassifikation_Anwendung_ver1.pdf', method), 404, method);
  }
  console.log('PASS: lesson preview is loopback-only, serves the exact selected PDF bytes, and rejects sensitive paths and methods.');
} finally {
  server.kill('SIGTERM');
  await once(server, 'close');
}
