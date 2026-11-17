import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const index = await readFile(new URL('../pages/index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../pages/spiele/app.mjs', import.meta.url), 'utf8');
const html = await readFile(new URL('../pages/spiele/index.html', import.meta.url), 'utf8');
assert.match(index, /<article class="independent-catalog-entry">[\s\S]*href="spiele\/"[\s\S]*<\/article>\s*<div class="subject-filter"/);
// EduPlay is an optional, separately developed module, not a Spiele dependency.
if (index.includes('<h2>EduPlay</h2>')) {
  assert.match(index, /href="eduplay\/"/);
  assert.match(index, /data-share="eduplay\/"/);
}
assert.match(index, /href="ki8\/"/);
assert.doesNotMatch(app, /innerHTML/);
for (const label of ['Tauziehen','Glücksrad','Jeopardy','Memory','Zuordnen']) assert.match(app, new RegExp(label));
assert.match(app, /localStorage/);
assert.match(app, /file\.size > 1024 \* 1024/);
assert.match(app, /Nicht gespeichert/);
assert.match(html, /type="module" src="app\.mjs"/);
console.log('Spiele route and safety checks passed');
