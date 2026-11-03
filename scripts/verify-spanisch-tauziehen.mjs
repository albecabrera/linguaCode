import assert from 'node:assert/strict';
import { createGame, start, timeout, answer, advance, questions, vocabulary } from '../pages/spanisch-tauziehen/core.mjs';

assert.equal(questions.length, vocabulary.length);
assert.ok(questions.length >= 90);
assert.equal(questions.filter(q => q.direction === 'es-de').length, Math.ceil(questions.length / 2));
assert.equal(questions.filter(q => q.direction === 'de-es').length, Math.floor(questions.length / 2));
for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  assert.equal(q.direction, i % 2 === 0 ? 'es-de' : 'de-es');
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4);
  assert.ok(q.correct >= 0 && q.correct < 4);
  assert.equal(q.options[q.correct], q.direction === 'es-de' ? q.german : q.spanish);
  const validTranslations = vocabulary.filter(pair => q.direction === 'es-de' ? pair.spanish === q.spanish : pair.german === q.german).map(pair => q.direction === 'es-de' ? pair.german : pair.spanish);
  for (const option of q.options) if (option !== q.options[q.correct]) assert.ok(!validTranslations.includes(option), `distractor collides for ${q.prompt}`);
}
assert.deepEqual(new Set(vocabulary.map(pair => pair.spanish)), new Set(questions.map(q => q.spanish)));
assert.deepEqual(new Set(vocabulary.map(pair => pair.german)), new Set(questions.map(q => q.german)));

const seededRandom = values => {
  let index = 0;
  return () => values[index++ % values.length];
};
const first = createGame(seededRandom([0.11, 0.73, 0.42, 0.89]));
const second = createGame(seededRandom([0.89, 0.42, 0.73, 0.11]));
assert.notDeepEqual(first.questions.map(q => q.spanish), second.questions.map(q => q.spanish), 'new games reshuffle the vocabulary');
assert.ok(new Set(first.questions.map(q => q.correct)).size > 1, 'correct positions vary within a game');
assert.ok(first.questions.some((q, i) => q.correct !== i % 4), 'correct positions are not a fixed catalog pattern');
assert.notDeepEqual(first.questions.map(q => q.correct), second.questions.map(q => q.correct), 'injected randomness changes option positions');
for (const gameOrder of [first.questions, second.questions]) {
  assert.ok(gameOrder.some(q => q.direction === 'es-de'));
  assert.ok(gameOrder.some(q => q.direction === 'de-es'));
  for (const q of gameOrder) assert.equal(q.options.length, 4);
}
for (const game of [first, second, createGame(() => 0)]) {
  assert.equal(game.teamQuestions[0].length, vocabulary.length);
  assert.equal(game.teamQuestions[1].length, vocabulary.length);
  assert.deepEqual(new Set(game.teamQuestions[0].map(q => q.spanish)), new Set(vocabulary.map(pair => pair.spanish)));
  assert.deepEqual(new Set(game.teamQuestions[1].map(q => q.spanish)), new Set(vocabulary.map(pair => pair.spanish)));
  for (let i = 0; i < vocabulary.length; i++) {
    assert.notEqual(game.teamQuestions[0][i].prompt, game.teamQuestions[1][i].prompt, `same-index prompts differ at ${i}`);
    assert.equal(game.teamQuestions[0][i].direction, game.teamQuestions[1][i].direction, `same-index directions match at ${i}`);
  }
}
for (let seed = 1; seed <= 64; seed++) {
  let state = seed;
  const random = () => ((state = (state * 48271) % 2147483647) / 2147483647);
  const game = createGame(random);
  for (let i = 0; i < vocabulary.length; i++) {
    assert.notEqual(game.teamQuestions[0][i].prompt, game.teamQuestions[1][i].prompt, `seed ${seed} prompt collision at ${i}`);
    assert.equal(game.teamQuestions[0][i].direction, game.teamQuestions[1][i].direction);
  }
}
const timedSetup = createGame(() => 0, 1);
assert.equal(start(timedSetup, 1000), true);
assert.equal(timedSetup.deadline, 61000);
assert.equal(timeout(timedSetup, 60999), false);
assert.equal(timeout(timedSetup, 61000), true);
assert.equal(timedSetup.winner, null);
assert.equal(answer(timedSetup, 0, 0, timedSetup.teamQuestions[0][0].correct, 61000), false);
assert.equal(advance(timedSetup, 0, 61000), false);
const aliases = [
  ['el escribidor', 'el escribano', 'el evangelista'],
  ['el oficio', 'la profesión'],
  ['la restitución de tierras', 'la devolución de tierras']
];
for (const q of [...first.questions, ...second.questions]) {
  const group = aliases.find(aliasGroup => aliasGroup.includes(q.spanish));
  if (group) for (const option of q.options) {
    if (option === q.options[q.correct]) continue;
    const collidingPair = vocabulary.find(pair => (q.direction === 'es-de' ? pair.german : pair.spanish) === option);
    assert.ok(!collidingPair || !group.includes(collidingPair.spanish), `alias distractor for ${q.spanish}`);
  }
}
const seededStream = seed => {
  let state = seed;
  return () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
};
const collisionSeed = 166; // RED seed: old candidate slicing produced two "die Rückgabe von Land" buttons.
for (const q of createGame(seededStream(collisionSeed)).questions) assert.equal(new Set(q.options).size, 4, `collision seed ${collisionSeed} has duplicate options`);
for (let seed = 1; seed <= 32; seed++) {
  const completeGame = createGame(seededStream(seed));
  for (const q of completeGame.questions) assert.equal(new Set(q.options).size, 4, `seed ${seed} has duplicate options`);
}

const game = createGame(() => 0, 3);
start(game, 1000);
assert.equal(game.phase, 'playing');
assert.equal(answer(game, 0, 0, game.teamQuestions[0][0].correct, 1001), true);
assert.equal(game.position, -1);
assert.equal(game.teams[0].score, 1);
const snapshot = JSON.stringify(game);
assert.equal(answer(game, 0, 0, game.teamQuestions[0][0].correct, 1001), false);
assert.equal(JSON.stringify(game), snapshot);
assert.equal(answer(game, 1, 0, (game.teamQuestions[1][0].correct + 1) % 4, 1001), true);
assert.equal(game.position, -1);
assert.equal(game.teams[1].score, 0);
assert.equal(game.teams[1].feedback.correct, false);
assert.equal(advance(game, 0, 1001), true);
assert.equal(game.teams[0].index, 1);
assert.equal(answer(game, 0, 0, 0, 1001), false, 'stale touch must not answer a new question');
assert.equal(advance(game, 0, 1001), false);
for (let i = 1; i < 5; i++) {
  answer(game, 0, i, game.teamQuestions[0][i].correct, 1001);
  advance(game, 0, 1001);
}
assert.equal(game.phase, 'finished');
assert.equal(game.winner, 0);
const finished = JSON.stringify(game);
assert.equal(answer(game, 1, 0, 0, 1001), false);
assert.equal(advance(game, 1), false);
assert.equal(JSON.stringify(game), finished);

const exhaustion = createGame(() => 0);
for (const team of [0, 1]) {
  for (let i = 0; i < exhaustion.questions.length; i++) {
    answer(exhaustion, team, i, (exhaustion.teamQuestions[team][i].correct + 1) % 4);
    advance(exhaustion, team);
  }
}
assert.equal(exhaustion.phase, 'finished');
assert.equal(exhaustion.winner, null);
assert.equal(exhaustion.position, 0);

const invalid = createGame(() => 0);
for (const args of [[-1, 0, 0], [0, 99, 0], [0, 0, 9], [0, 0, NaN]]) assert.equal(answer(invalid, ...args), false);
assert.equal(invalid.teams[0].score, 0);
console.log(`PASS: ${vocabulary.length} source pairs, both directions, alternating randomized rounds, unique distractors, scoring, wrong answers, stale touches, win, exhaustion, reset and invalid input`);
