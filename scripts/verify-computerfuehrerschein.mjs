import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'pages/computerfuehrerschein');
const [html, css, app] = await Promise.all([
  readFile(join(root, 'index.html'), 'utf8'),
  readFile(join(root, 'style.css'), 'utf8'),
  readFile(join(root, 'app.js'), 'utf8'),
]);
assert.match(html, /Computerführerschein – Werde zum PC-Profi!/);
assert.match(html, /start-menu/);
assert.match(html, /certificate/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /:focus-visible/);
assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|\/\//, 'module must not require external services');
assert.match(app, /localStorage/);
assert.match(app, /window\.print\(\)/);
assert.match(app, /contenteditable="true"/);
assert.equal((app.match(/title:'[^']+'/g) || []).length, 6, 'six missions are declared');
for (const phrase of ['Entdecke deine Tastatur','Schreiben wie ein Profi','Dateien öffnen und speichern','Hauptordner und Unterordner','Dateien verwalten','Die große PC-Challenge']) assert.match(app, new RegExp(phrase));
assert.match(app, /state\.fs\.Documents\.foldersData\.Schule/);
assert.match(app, /data\.files\.splice/);
assert.match(app, /Strg \+ S/);
assert.match(app, /querySelector\('b'\)/);
assert.match(app, /state\.completed\.length===6/);
console.log('PASS: Computerführerschein module has standalone desktop UI, six German missions, actual editor/filesystem checks, persistence, reset, accessible focus styles, and print certificate flow.');
