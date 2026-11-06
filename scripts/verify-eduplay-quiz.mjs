import assert from 'node:assert/strict';
import { scoreAnswer } from '../pages/eduplay/quiz.mjs';
assert.equal(scoreAnswer(['a'], ['a']), true);
assert.equal(scoreAnswer(['b'], ['a']), false);
assert.equal(scoreAnswer(['b','a'], ['a','b']), true);
assert.equal(scoreAnswer(['a'], ['a','b']), false);
assert.equal(scoreAnswer(['a','a'], ['a']), false);
assert.equal(scoreAnswer([], ['a']), false);
console.log('EduPlay quiz checks passed');
