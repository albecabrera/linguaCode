import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {learners, summary, addFeedback} from '../docs/ki-wp8/demo/model.mjs';

assert.equal(learners.length, 3);
assert.deepEqual(learners.map(({code}) => code), ['DEMO-001', 'DEMO-002', 'DEMO-003']);
assert.equal(summary(learners).completed, 7);
assert.equal(summary(learners).possible, 18);
assert.equal(summary(learners).open, 11);
assert.equal(summary(learners).feedback, 1);
const original = learners[0];
const updated = addFeedback(original, '  Gute Begründung!  ');
assert.equal(updated.feedback, 'Gute Begründung!');
assert.equal(original.feedback, '');
assert.throws(() => addFeedback(original, '   '), /Rückmeldung/);
assert.throws(() => addFeedback(original, 'x'.repeat(501)), /Rückmeldung/);
assert.deepEqual(learners.map(({feedback}) => feedback), ['', 'Bitte überprüfe deine Testdaten.', '']);
const root = new URL('../docs/ki-wp8/demo/', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const app = readFileSync(new URL('app.mjs', root), 'utf8');
const model = readFileSync(new URL('model.mjs', root), 'utf8');
assert.match(html, /Lehrer-Cockpit – KI WP8/);
assert.match(html, /Nur Demodaten/);
assert.match(html, /Nicht für echte Schülerdaten/);
assert.match(html, /type="module" src="\.\/app\.mjs"/);
assert.match(app, /addEventListener\('click'/);
assert.match(app, /addEventListener\('submit'/);
for (const source of [html, app, model]) {
  assert.doesNotMatch(source, /(?:localStorage|sessionStorage|indexedDB|fetch\(|XMLHttpRequest|WebSocket|https?:\/\/|WP8-014|password|Lösung_02_TrainingEinesEBaums)/i);
}
console.log('PASS: fictional teacher demo data, aggregate counts, transient feedback and no storage/network.');
