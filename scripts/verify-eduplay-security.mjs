import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { generateCrossword, CROSSWORD_WORK_BUDGET } from '../pages/eduplay/crossword.mjs';
import { MAX_CROSSWORD_GRID_SIDE } from '../pages/eduplay/model.mjs';

const words = Array.from({length:60}, (_, index) => ({id:`security-${index}`,word:'A'.repeat(24),clue:'x'}));
const started = performance.now();
const result = generateCrossword(words);
const elapsed = Math.round(performance.now() - started);
assert.ok(result.workUnits <= CROSSWORD_WORK_BUDGET);
assert.equal(result.workBudgetExceeded, true);
assert.equal(result.placed.length + result.unplaced.length, words.length);
assert.ok(result.unplaced.length > 0);
assert.ok(result.width <= MAX_CROSSWORD_GRID_SIDE);
assert.ok(result.height <= MAX_CROSSWORD_GRID_SIDE);
console.log(`EduPlay security crossword checks passed (${elapsed} ms, ${result.workUnits} work units)`);
