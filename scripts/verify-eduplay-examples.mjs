import assert from 'node:assert/strict';
import { activities } from '../pages/eduplay/examples.mjs';
import { validateActivity, exportActivity, importActivity } from '../pages/eduplay/model.mjs';
assert.equal(activities.length, 4);
for (const activity of activities) {
  assert.deepEqual(validateActivity(activity), [], activity.title);
  assert.deepEqual(importActivity(exportActivity(activity)), activity);
}
assert.equal(new Set(activities.map(activity => activity.id)).size, 4);
assert.ok(activities.find(a => a.type === 'quiz').content.questions.length >= 10);
assert.ok(activities.find(a => a.type === 'memory').content.pairs.length >= 8);
assert.ok(activities.find(a => a.type === 'crossword').content.words.length >= 8);
assert.ok(activities.find(a => a.type === 'classification').content.items.length >= 12);
console.log('EduPlay example checks passed');
