import assert from 'node:assert/strict';
import {lessonPreviews, demoGroups, createAssignmentPreview} from '../docs/ki-wp8/demo/model.mjs';

assert.deepEqual(lessonPreviews.map(({id}) => id), ['stunde-1', 'stunde-2']);
assert.ok(lessonPreviews.every(({objective}) => objective.length > 20));
assert.deepEqual(demoGroups, ['Demo-Gruppe A', 'Demo-Gruppe B']);
const preview = createAssignmentPreview('stunde-1', 'Demo-Gruppe A');
assert.equal(preview.lessonTitle, 'Merkmale, Labels und Schwellenwerte');
assert.equal(preview.group, 'Demo-Gruppe A');
assert.equal(preview.sent, false);
assert.equal(preview.persisted, false);
assert.throws(() => createAssignmentPreview('unknown', 'Demo-Gruppe A'), /Unterrichtsstunde/);
assert.throws(() => createAssignmentPreview('stunde-1', 'Klasse 8a'), /Demo-Gruppe/);
console.log('PASS: module 2 lesson objectives and unsent fictional assignment preview are modelled without tracking.');
