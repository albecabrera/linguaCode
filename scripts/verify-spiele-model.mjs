import assert from 'node:assert/strict';
import {
  createEmptyGame,
  validateGame,
  exportGame,
  importGame,
  createGameStore,
  playWheel,
  matchMemory,
  classifyItem,
  MAX_IMPORT_BYTES
} from '../pages/spiele/model.mjs';

function validGame(type, subject) {
  const game = createEmptyGame(type);
  game.title = `${type} ${subject}`;
  game.description = 'Unterrichtstest';
  game.subject = subject;
  if (type === 'tug' || type === 'wheel') game.content.questions = [{ id: `${type}-q`, prompt: 'Frage', answer: 'Antwort', points: 100 }];
  if (type === 'jeopardy') game.content.categories = [
    { id: 'cat-a', name: 'A', questions: [{ id: 'a-q', prompt: 'A?', answer: 'A', points: 100 }] },
    { id: 'cat-b', name: 'B', questions: [{ id: 'b-q', prompt: 'B?', answer: 'B', points: 200 }] }
  ];
  if (type === 'memory') game.content.pairs = [{ id: 'pair-a', first: 'A', second: 'a' }, { id: 'pair-b', first: 'B', second: 'b' }];
  if (type === 'matching') game.content.groups = [
    { id: 'group-a', name: 'A', items: [{ id: 'item-a', text: 'A' }] },
    { id: 'group-b', name: 'B', items: [{ id: 'item-b', text: 'B' }] }
  ];
  return game;
}

for (const type of ['tug', 'wheel', 'jeopardy', 'memory', 'matching']) {
  for (const subject of ['Informatik', 'Spanisch', 'Sport', 'Mathematik']) {
    const game = validGame(type, subject);
    assert.deepEqual(validateGame(game), [], `${type}/${subject} validiert`);
    assert.deepEqual(importGame(exportGame(game)), game, `${type}/${subject} roundtrip`);
  }
}

const choicesGame = validGame('tug', 'Spanisch');
choicesGame.content.questions[0].choices = ['Falsch eins', 'Falsch zwei'];
assert.deepEqual(validateGame(choicesGame), [], 'optional answer choices validate');
assert.deepEqual(importGame(exportGame(choicesGame)).content.questions[0].choices, choicesGame.content.questions[0].choices, 'answer choices roundtrip');
for (const choices of [ ['Antwort'], ['A', 'A'], ['A', '   antwort  '] ]) {
  const candidate = structuredClone(choicesGame); candidate.content.questions[0].choices = choices;
  assert.notDeepEqual(validateGame(candidate), [], 'duplicate or correct answer choice rejected');
}
const legacy = validGame('tug', 'Sport');
delete legacy.content.questions[0].choices;
assert.deepEqual(validateGame(legacy), [], 'legacy text-answer question remains valid');
const wheelWithArbitraryChoices = validGame('wheel', 'Sport');
wheelWithArbitraryChoices.content.questions[0].choices = ['', 'Antwort'];
assert.deepEqual(validateGame(wheelWithArbitraryChoices), [], 'wheel ignores tug-only choice metadata');
const jeopardyWithArbitraryChoices = validGame('jeopardy', 'Sport');
jeopardyWithArbitraryChoices.content.categories[0].questions[0].choices = ['A'];
assert.deepEqual(validateGame(jeopardyWithArbitraryChoices), [], 'jeopardy ignores tug-only choice metadata');

const malformed = validGame('matching', 'Informatik');
for (const groups of [null, [null, {}], [{ id: 'a', name: 'A', items: null }, { id: 'b', name: 'B', items: [] }], [{ id: 'a', name: 'A', items: [{ id: 'x', text: 'x' }] }, null]]) {
  const candidate = structuredClone(malformed);
  candidate.content.groups = groups;
  assert.doesNotThrow(() => validateGame(candidate));
  assert.throws(() => importGame(JSON.stringify(candidate)), /Zuordnungs/);
}

const memory = validGame('memory', 'Spanisch');
assert.equal(matchMemory(memory, { pairId: 'pair-a', cardId: 'a1' }, { pairId: 'pair-a', cardId: 'a2' }).matched, true);
assert.equal(matchMemory(memory, { pairId: 'pair-a', cardId: 'a1' }, { pairId: 'pair-b', cardId: 'b1' }).matched, false);
assert.equal(matchMemory(memory, { pairId: 'pair-a', cardId: 'a1' }, { pairId: 'pair-a', cardId: 'a1' }).matched, false, 'same physical card is not a pair');

const wheel = validGame('wheel', 'Sport');
const wheelFirst = playWheel(wheel, []);
assert.ok(wheelFirst.question);
assert.equal(playWheel(wheel, wheelFirst.used).question, null, 'wheel has an explicit end state');
const storage = { value: JSON.stringify([validGame('tug', 'Informatik')]), getItem() { return this.value; }, setItem(_, value) { this.value = value; } };
const store = createGameStore(storage);
const before = storage.value;
assert.throws(() => store.save({ ...validGame('tug', 'Informatik'), title: '' }), /Titel/);
assert.equal(storage.value, before, 'failed save leaves persisted data unchanged');
assert.throws(() => importGame('x'.repeat(MAX_IMPORT_BYTES + 1)), /höchstens 1 MB/);
const quotaStorage = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
assert.throws(() => createGameStore(quotaStorage).save(validGame('tug', 'Sport')), /quota/);

const matching = validGame('matching', 'Mathematik');
assert.equal(classifyItem(matching, 'item-a', 'group-a').correct, true);
assert.equal(classifyItem(matching, 'item-a', 'group-b').correct, false);
console.log('Spiele model checks passed');
