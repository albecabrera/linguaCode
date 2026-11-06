import assert from 'node:assert/strict';
import { generateCrossword, normalizeWord, CROSSWORD_WORK_BUDGET } from '../pages/eduplay/crossword.mjs';
import { MAX_CROSSWORD_GRID_SIDE } from '../pages/eduplay/model.mjs';
assert.equal(normalizeWord('Straße, Öl!'), 'STRASSEOEL');
assert.equal(normalizeWord('STRAẞE ÄRGER'), 'STRASSE AERGER'.replaceAll(' ', ''));
const result = generateCrossword([{id:'1',word:'HAUS',clue:'a'},{id:'2',word:'MAUS',clue:'b'},{id:'3',word:'XYZ',clue:'c'}]);
assert.equal(result.placed.length,2);
assert.deepEqual(result.unplaced.map(w => w.id),['3']);
assert.ok(result.placed.some(w => w.direction === 'across'));
assert.ok(result.placed.some(w => w.direction === 'down'));
assert.ok(result.cells.some(c => c.entries.length === 2));
const starts = new Map(result.placed.map(word => [`${word.x},${word.y}`, word.number]));
assert.equal(starts.size, new Set(result.placed.map(word => `${word.x},${word.y}`)).size);
assert.deepEqual([...result.placed].map(word => word.number).sort((a, b) => a - b), [1, 2]);
const sample = generateCrossword([
  ['ALGORITHMUS','a'], ['ANWEISUNG','b'], ['EINGABE','c'], ['AUSGABE','d'],
  ['BEDINGUNG','e'], ['SCHLEIFE','f'], ['VARIABLE','g'], ['PROGRAMM','h'],
].map(([word, clue], index) => ({id:`sample-${index}`, word, clue})));
assert.equal(sample.unplaced.length, 0);
assert.equal(sample.placed.length, 8);
assert.ok(sample.width <= MAX_CROSSWORD_GRID_SIDE);
assert.ok(sample.height <= MAX_CROSSWORD_GRID_SIDE);
const oversizedGrid = generateCrossword([{id:'long',word:'A'.repeat(MAX_CROSSWORD_GRID_SIDE + 1),clue:'x'}]);
assert.equal(oversizedGrid.placed.length, 0);
assert.equal(oversizedGrid.unplaced.length, 1);
const adversarial = generateCrossword(Array.from({length:60}, (_, index) => ({id:`adversarial-${index}`,word:'A'.repeat(24),clue:'x'})));
assert.equal(adversarial.workBudget, CROSSWORD_WORK_BUDGET);
assert.ok(adversarial.workUnits <= CROSSWORD_WORK_BUDGET);
assert.equal(adversarial.workBudgetExceeded, true);
assert.equal(adversarial.placed.length + adversarial.unplaced.length, 60);
assert.ok(adversarial.width <= MAX_CROSSWORD_GRID_SIDE);
assert.ok(adversarial.height <= MAX_CROSSWORD_GRID_SIDE);
for (const word of sample.placed.slice(1)) {
  assert.ok(word.answer.split('').some((letter, index) => sample.cells.some(cell => cell.letter === letter && cell.entries.some(entry => entry.id === word.id) && cell.entries.some(entry => entry.id !== word.id))));
}
for (const cell of sample.cells) {
  const right = sample.cells.find(other => other.x === cell.x + 1 && other.y === cell.y);
  const below = sample.cells.find(other => other.x === cell.x && other.y === cell.y + 1);
  if (right) assert.ok(cell.entries.some(entry => entry.direction === 'across' && right.entries.some(other => other.id === entry.id)));
  if (below) assert.ok(cell.entries.some(entry => entry.direction === 'down' && below.entries.some(other => other.id === entry.id)));
}
console.log('EduPlay crossword checks passed');
