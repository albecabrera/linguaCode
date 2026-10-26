import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classify, modules, trainingSamples, testSamples} from '../pages/ki8/course.mjs';

assert.deepEqual(modules.map(({hours}) => hours), [2, 2, 4, 2, 3, 5]);
assert.equal(modules.length, 6);
assert.deepEqual(new Set(modules.map(({id}) => id)).size, 6);
assert.equal(trainingSamples.some(({id}) => testSamples.some((item) => item.id === id)), false);
assert.equal(classify(8, 8), 'unter oder gleich');
assert.equal(classify(8.1, 8), 'über');
assert.equal(classify(0, 8), 'unter oder gleich');
assert.throws(() => classify(NaN, 8), RangeError);
assert.throws(() => classify(1, -1), RangeError);
const html = readFileSync(new URL('../pages/ki8/index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../pages/ki8/app.mjs', import.meta.url), 'utf8');
assert.match(html, /KI entdecken, verstehen und gestalten – WP Informatik 8/);
assert.match(html, /type="module" src="\.\/app\.mjs"/);
assert.match(html, /Vereinfachte Labels/);
assert.match(html, /kein persönlicher Lernstand/);
assert.match(app, /addEventListener\('submit'/);
for (const source of [html, app]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|fetch\(|https?:\/\/|Lösung_02_TrainingEinesEBaums)/);
}
console.log('PASS: KI WP8 public prototype structure, six-module schedule, separate datasets, threshold boundary and no storage/network.');
