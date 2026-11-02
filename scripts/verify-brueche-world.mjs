import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TASKS, answerCard, advance, createState, hydrate, resetState } from '../pages/brueche/game-logic.mjs';

const page = await readFile(new URL('../pages/brueche/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(page, /home\.classList\.add\('hidden'\)/, 'start keeps the persistent world visible');
assert.match(page, /button\.disabled=state\.answered/, 'reload renderer disables answered controls');
assert.match(page, /Gezielt wiederholen[\s\S]*id="review"/, 'summary includes actionable review advice');
assert.match(page, /sound-toggle[\s\S]*theme-toggle/, 'public DOM controls include audio and theme toggles');
assert.match(page, /sound-toggle.*addEventListener.*audioOn=!audioOn/, 'audio toggle listener is public and mutable');
assert.match(page, /theme-toggle.*addEventListener.*classList\.toggle\('dark'\)/, 'theme toggle listener is public');
assert.match(page, /catch\{\}/, 'audio/storage failures fall back without blocking learning');
assert.match(page, /\$\('home'\)\.classList\.add\('quest-active'\)[\s\S]*\$\('game'\)\.classList\.remove\('hidden'\)/, 'start event keeps world visible while opening gameplay');
assert.match(page, /\$\('summary'\)\.classList\.remove\('hidden'\)[\s\S]*review/, 'summary DOM includes review output');
assert.match(page, /prefers-reduced-motion[\s\S]*animation:none/, 'reduced motion has a final-state path');

const fresh = () => createState();
let state = fresh();
let result = answerCard(state, TASKS[0].answer);
assert.equal(result.correct, true);
assert.equal(result.event.type, 'progress');
assert.equal(result.event.position, 1);
assert.equal(result.state.correct, 1);
assert.deepEqual(result.state.inventory, []);
state = result.state;
state = advance(state).state;
assert.equal(state.index, 1, 'success moves to the next card');

result = answerCard(state, 'wrong');
assert.equal(result.correct, false);
assert.equal(result.event.type, 'wrong');
assert.equal(result.state.correct, 1, 'wrong answers do not add progress');
assert.equal(result.state.inventory.length, 0, 'wrong answers do not loot');
assert.equal(result.state.position, 1, 'wrong answers do not move');
const duplicate = answerCard(result.state, 'wrong');
assert.equal(duplicate.event.type, 'ignored', 'repeated submissions are ignored');
assert.deepEqual(duplicate.state, result.state);

for (let i = 1; i < 3; i++) {
  state = advance(state).state;
  state = answerCard(state, TASKS[i].answer).state;
}
assert.deepEqual(state.inventory, ['Holzschild'], 'three correct cards unlock the shield');
assert.equal(state.events.filter(event => event.type === 'progress').length, 3);

state = advance(state).state;
for (let i = 3; i < 6; i++) {
  state = answerCard(state, TASKS[i].answer).state;
  if (i < 5) state = advance(state).state;
}
assert.ok(state.inventory.includes('Eisenstiefel'), 'six correct cards unlock boots');
state = advance(state).state;
state = answerCard(state, TASKS[6].answer).state;
assert.equal(state.combat.health, 2, 'a correct answer visibly damages the cave creature');
state = advance(state).state;
state = answerCard(state, TASKS[7].answer).state;
state = advance(state).state;
state = answerCard(state, TASKS[8].answer).state;
assert.equal(state.combat.defeated, 1, 'a correct answer defeats the cave creature');

const saved = JSON.stringify(state);
const restored = hydrate(JSON.parse(saved));
assert.deepEqual(restored, state, 'validated session state restores coherently');
assert.equal(hydrate({ index: '<script>', correct: 999 }).index, 0, 'invalid saved strings are rejected');
assert.doesNotThrow(() => hydrate({ index: 1, correct: 1 }), 'partial saved JSON never throws');
assert.equal(hydrate({...state, position:0}).correct, 0, 'contradictory counters are rejected');
assert.equal(hydrate({...state, events:[{type:'progress', card:99, position:1}]}).correct, 0, 'unchecked events are rejected');
assert.equal(hydrate({...state, combat:undefined}).correct, 0, 'missing combat is rejected safely');
assert.equal(resetState().correct, 0, 'restart clears progress and inventory');
assert.equal(resetState().inventory.length, 0);
assert.ok(Object.keys(state.mistakes).length === 0, 'all-correct run has no review topics');
const reviewState = answerCard(createState(), 'wrong').state;
assert.equal(reviewState.mistakes['Faires Teilen'], 1, 'wrong answers track the topic for review');

console.log('Brüche world verifier: gameplay, wrong answers, duplicate protection, loot, combat, reload and restart passed');
