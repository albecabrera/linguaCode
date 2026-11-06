import assert from 'node:assert/strict';
import { scoreClassification } from '../pages/eduplay/classification.mjs';
import { validateActivity } from '../pages/eduplay/model.mjs';
const items = [{id:'a',categoryId:'x'},{id:'b',categoryId:'y'}];
assert.deepEqual(scoreClassification(items,{a:'x',b:'y'}),{correct:2,total:2});
assert.deepEqual(scoreClassification(items,{a:'y'}),{correct:0,total:2});

const activity = count => ({
  schemaVersion: 1, type: 'classification', id: 'classification-test', title: 'Test', description: 'Test', subject: 'Test', grade: '5', language: 'de',
  createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', settings: {},
  content: { categories: Array.from({ length: count }, (_, index) => ({ id: `c${index}`, name: `Kategorie ${index}` })), items: [{ id: 'item', text: 'Begriff', categoryId: 'c0' }] },
});
assert.deepEqual(validateActivity(activity(2)), []);
assert.deepEqual(validateActivity(activity(6)), []);
assert.match(validateActivity(activity(1)).join(' '), /Kategorien sind ungültig/);
assert.match(validateActivity(activity(7)).join(' '), /Kategorien sind ungültig/);
const invalidMapping = activity(2);
invalidMapping.content.items[0].categoryId = 'missing';
assert.match(validateActivity(invalidMapping).join(' '), /Begriffe sind ungültig/);
console.log('EduPlay classification checks passed');
