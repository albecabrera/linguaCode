import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {vocabulary} from '../pages/spanisch-tauziehen/core.mjs';

const base = new URL('../pages/spanisch-tauziehen/', import.meta.url);
const html = await readFile(new URL('index.html', base), 'utf8');
const css = await readFile(new URL('style.css', base), 'utf8');
assert.match(html, /id="intro"/);
assert.match(html, /id="teams"/);
assert.match(html, /id="team-0"/);
assert.match(html, /id="team-1"/);
assert.match(html, /id="shared-turn"/);
assert.match(html, /id="result"/);
assert.match(html, /id="fullscreen"/);
assert.match(html, /<svg[^>]+class="team-scene"/);
assert.match(html, /viewBox="0 0 1200 360"/);
assert.match(html, /M372 248Q600 256 828 248/);
assert.match(html, /cx="600" cy="254" r="17"/);
assert.match(html, /translate\(280 105\)/);
assert.match(html, /translate\(920 105\)/);
assert.match(html, /class="blue-player" transform="translate\(280 105\)"/);
assert.match(html, /class="orange-player" transform="translate\(920 105\)"/);
assert.match(html, /M372 248Q600 256 828 248/);
assert.match(html, /cx="600" cy="254" r="17"/);
assert.match(html, /fill="#3b96d1"/);
assert.match(html, /fill="#e17b4b"/);
assert.match(css, /background:radial-gradient/);
assert.match(html, /99 klar lesbare Vokabelpaare bleiben vollständig erhalten/);
assert.doesNotMatch(html, /scoring Gruppe/);
assert.match(html, /id="movement-explanation"/);
assert.match(css, /touch-action:manipulation/);
assert.match(css, /aspect-ratio:1200\/360/);
assert.match(css, /\.field\{[^}]*height:100%/i, 'field fills its aspect-ratio box');
assert.match(css, /\.field\{[^}]*background:[^}]*#fbfaf5/i, 'field uses a light arena background');
assert.match(css, /#rope\{[^}]*height:100%/i, 'rope scene scales with the field');
assert.match(css, /\.goal\{[^}]*color:#172e38[^}]*border-left:2px solid #172e38/i, 'goal markers are readable on the light field');
assert.match(css, /\.center-line\{[^}]*border-left:2px dashed #57696e/i, 'center line is readable on the light field');
assert.match(css, /\.blue-player,\.orange-player\{[^}]*transform-box:fill-box/);
assert.match(css, /\.rope-marker\{/);
assert.match(css, /\.rope-art\{/);
assert.match(css, /\.goal\.left\{left:42\.5%\}/);
assert.match(css, /\.goal\.right\{left:57\.5%\}/);
assert.match(css, /transform-box:fill-box/);
assert.match(css, /pull-left \.orange-player\{animation:stumble-left/);
assert.match(css, /pull-right \.blue-player\{animation:stumble-right/);
assert.match(css, /min-height:60px/);
assert.doesNotMatch(await readFile(new URL('../pages/spanisch-tauziehen/app.mjs', import.meta.url), 'utf8'), /scrollIntoView/);

class Element {
  constructor(tag = 'div', id = '') {
    this.tagName = tag.toUpperCase(); this.id = id; this.children = []; this.listeners = {};
    this.hidden = false; this.disabled = false; this.attributes = {}; this.style = {}; this._text = '';
    this.className = ''; this.dataset = {};
    this.classList = { add: (...names) => { names.forEach(name => { if (!this.className.split(/\s+/).includes(name)) this.className = `${this.className} ${name}`.trim(); }); }, remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => name && !names.includes(name)).join(' '); }, contains: name => this.className.split(/\s+/).includes(name) };
    this.focused = false;
  }
  append(...nodes) { nodes.forEach(node => this.children.push(node)); }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type) { if (!this.disabled) for (const listener of this.listeners[type] || []) listener({target: this}); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  scrollIntoView() {}
  set textContent(value) { this.children = []; this._text = String(value); }
  get textContent() { return this.children.length ? this.children.map(child => child.textContent).join('') : this._text; }
  querySelectorAll(selector) {
    const matches = node => selector === 'button' ? node.tagName === 'BUTTON' : selector === '.feedback' ? node.className === 'feedback' : false;
    return this.children.flatMap(child => [child, ...child.querySelectorAll(selector)]).filter(matches);
  }
}

const makeFixture = (deferredFullscreen = false) => {
  const elements = new Map();
  const add = (id, tag = 'div') => { const node = new Element(tag, id); elements.set(id, node); return node; };
  ['fullscreen', 'start', 'duration-1', 'duration-3', 'duration-5', 'intro', 'teams', 'team-0', 'team-1', 'shared-turn', 'result', 'restart', 'reset', 'score-0', 'score-1', 'rope', 'timer', 'match-status', 'screen-note', 'result-title', 'result-detail'].forEach(id => add(id, id === 'fullscreen' || id === 'start' || id === 'restart' || id === 'reset' || id.startsWith('duration-') ? 'button' : 'div'));
  [1, 3, 5].forEach(minutes => { const button = elements.get(`duration-${minutes}`); button.dataset.duration = String(minutes); button.setAttribute('aria-pressed', minutes === 3 ? 'true' : 'false'); });
  const documentElement = new Element('html');
  const document = {
    documentElement,
    fullscreenElement: null,
    listeners: {},
    getElementById: id => elements.get(id),
    createElement: tag => new Element(tag),
    addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  };
  elements.get('rope').className = 'rope-scene';
  elements.get('teams').hidden = true;
  elements.get('result').hidden = true;
  elements.get('reset').hidden = true;
  let rejectFullscreen;
  documentElement.requestFullscreen = deferredFullscreen
    ? () => new Promise((_, reject) => { rejectFullscreen = reject; })
    : async () => { throw new Error('fullscreen unavailable in verifier'); };
  return {elements, document, rejectFullscreen: () => rejectFullscreen?.(new Error('fullscreen unavailable in verifier'))};
};

let now = 1000;
let activeTimers = [];
globalThis.Date.now = () => now;
globalThis.setInterval = callback => { activeTimers.push(callback); return callback; };
globalThis.clearInterval = callback => { activeTimers = activeTimers.filter(timer => timer !== callback); };
const tick = () => activeTimers.slice().forEach(callback => callback());
let bootNumber = 0;
const boot = async (deferredFullscreen = false) => {
  const fixture = makeFixture(deferredFullscreen);
  globalThis.document = fixture.document;
  await import(`../pages/spanisch-tauziehen/app.mjs?ui-boot=${++bootNumber}`);
  return fixture;
};
const button = (panel, index) => panel.querySelectorAll('button')[index];
const feedback = panel => panel.querySelectorAll('.feedback')[0];
const answerText = panel => {
  const prompt = panel.children.find(child => child.tagName === 'H2' && !child.textContent.includes('ist am Zug'))?.textContent || panel.children.find(child => child.tagName === 'P')?.textContent || '';
  if (prompt.startsWith('Was bedeutet «')) {
    const spanish = prompt.slice('Was bedeutet «'.length, -2);
    return vocabulary.find(pair => pair.spanish === spanish)?.german;
  }
  const german = prompt.slice('Wie heißt „'.length, -2);
  const choices = panel.querySelectorAll('button').map(choice => choice.textContent);
  return vocabulary.find(pair => pair.german === german && choices.includes(pair.spanish))?.spanish;
};
const correctButton = panel => panel.querySelectorAll('button').find(answerButton => answerButton.textContent === answerText(panel));
const wrongButton = panel => panel.querySelectorAll('button').find(answerButton => answerButton !== correctButton(panel) && !answerButton.textContent.includes('Weiter'));
const startGame = fixture => { fixture.elements.get('duration-1').dispatch('click'); fixture.elements.get('start').dispatch('click'); assert.equal(fixture.elements.get('shared-turn').hidden, false); };
const scene = fixture => fixture.elements.get('rope');

const game = await boot();
assert.equal(game.elements.get('intro').hidden, false, 'intro is visible before start');
assert.equal(game.elements.get('teams').hidden, true, 'teams are hidden before start');
for (const minutes of [1, 3, 5]) assert.ok(game.elements.get(`duration-${minutes}`), `${minutes}-minute control exists`);
game.elements.get('duration-5').dispatch('click');
assert.equal(game.elements.get('duration-5').getAttribute('aria-pressed'), 'true');
startGame(game);
await new Promise(resolve => setImmediate(resolve));
assert.match(game.elements.get('screen-note').textContent, /Vollbild ist hier nicht verfügbar/, 'automatic fullscreen denial is non-blocking');
assert.match(game.elements.get('shared-turn').textContent, /Team A ist am Zug/);
assert.equal(game.elements.get('reset').hidden, false, 'reset is available during play');
assert.equal(game.elements.get('teams').hidden, true, 'legacy team cards remain hidden');
assert.equal(game.elements.get('shared-turn').hidden, false, 'one shared turn panel is visible');
assert.equal(game.elements.get('shared-turn').querySelectorAll('button').length, 4, 'shared panel has four answers');
assert.equal(scene(game).className, 'rope-scene', 'scene starts still');
assert.equal(game.elements.get('timer').textContent, 'Zeit: 1:00', 'selected one-minute duration starts on click');
assert.equal(game.elements.get('duration-1').getAttribute('aria-pressed'), 'true');

const shared = game.elements.get('shared-turn');
const firstWrong = wrongButton(shared); firstWrong.dispatch('click');
assert.match(feedback(shared).textContent, /Noch nicht richtig/);
assert.equal(game.elements.get('score-0').textContent, '0', 'wrong answer does not score');
assert.ok(shared.querySelectorAll('button').filter(answerButton => !answerButton.textContent.includes('Weiter')).every(answerButton => answerButton.disabled), 'answered choices are disabled');
const next = shared.querySelectorAll('button').find(answerButton => answerButton.textContent === 'Weiter →'); next.dispatch('click');
assert.match(shared.textContent, /Team B ist am Zug/);
assert.equal(scene(game).className, 'rope-scene', 'wrong answer does not animate');
correctButton(shared).dispatch('click');
assert.match(feedback(shared).textContent, /Richtig/);
assert.equal(game.elements.get('score-1').textContent, '1', 'orange team scores on its turn');
assert.equal(scene(game).className, 'rope-scene pull-right', 'correct answer pulls right');
shared.querySelectorAll('button').find(answerButton => answerButton.textContent === 'Weiter →').dispatch('click');
assert.match(shared.textContent, /Team A ist am Zug/);


now = 61000;
tick();
assert.equal(game.elements.get('result').hidden, false, 'deadline ends the game');
assert.match(game.elements.get('result-detail').textContent, /Zeit ist abgelaufen/);
const lateScore = game.elements.get('score-0').textContent;
button(game.elements.get('team-0'), 0)?.dispatch('click');
assert.equal(game.elements.get('score-0').textContent, lateScore, 'late touches cannot score');

const winner = await boot();
startGame(winner);
const winnerPanel = winner.elements.get('shared-turn');
for (let round = 0; round < 5; round += 1) {
  correctButton(winnerPanel).dispatch('click');
  if (winner.elements.get('result').hidden) assert.match(feedback(winnerPanel).textContent, /Richtig/);
  const winnerNext = winnerPanel.querySelectorAll('button').find(answerButton => answerButton.textContent.includes('Weiter'));
  if (winnerNext) winnerNext.dispatch('click');
  if (winner.elements.get('result').hidden) {
    wrongButton(winnerPanel).dispatch('click');
    const loserNext = winnerPanel.querySelectorAll('button').find(answerButton => answerButton.textContent.includes('Weiter'));
    if (loserNext) loserNext.dispatch('click');
  }
}
assert.equal(winner.elements.get('result').hidden, false, 'five correct pulls end the duel');
assert.match(winner.elements.get('result-title').textContent, /Team A gewinnt/);
assert.equal(winner.elements.get('score-0').textContent, '5');
assert.equal(scene(winner).className, 'rope-scene pull-left', 'repeated correct pulls animate the winning direction');
assert.equal(Number(scene(winner).dataset.pullSequence), 5, 'every correct pull restarts motion');
assert.ok(winner.elements.get('team-0').querySelectorAll('button').every(answerButton => answerButton.disabled), 'finished game disables green inputs');
assert.ok(winner.elements.get('team-1').querySelectorAll('button').every(answerButton => answerButton.disabled), 'finished game disables orange inputs');
const scoreAtEnd = winner.elements.get('score-0').textContent;
button(winner.elements.get('team-0'), 0)?.dispatch('click');
assert.equal(winner.elements.get('score-0').textContent, scoreAtEnd, 'finished input has no effect');

winner.elements.get('restart').dispatch('click');
assert.equal(winner.elements.get('result').hidden, true, 'restart hides result');
assert.equal(winner.elements.get('score-0').textContent, '0', 'restart resets green score');
assert.equal(winner.elements.get('score-1').textContent, '0', 'restart resets orange score');
assert.equal(winner.elements.get('timer').textContent, 'Zeit: 1:00', 'restart keeps the selected duration');
assert.equal(scene(winner).className, 'rope-scene', 'restart restores the still scene');
winner.elements.get('reset').dispatch('click');
assert.equal(winner.elements.get('intro').hidden, false, 'reset returns to intro');
assert.equal(winner.elements.get('teams').hidden, true, 'reset hides teams');
assert.equal(scene(winner).className, 'rope-scene', 'reset restores the arena scene');

const fullscreen = await boot();
fullscreen.elements.get('fullscreen').dispatch('click');
await new Promise(resolve => setImmediate(resolve));
assert.match(fullscreen.elements.get('screen-note').textContent, /Vollbild ist hier nicht verfügbar/);

activeTimers = [];
now = 1000;
const timerFixture = await boot();
timerFixture.elements.get('duration-3').dispatch('click');
timerFixture.elements.get('start').dispatch('click');
assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 3:00');
now = 2000; tick(); assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 2:59');
now = 120000; tick(); assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 1:01');
now = 121000; tick(); assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 1:00');
now = 180000; tick(); assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 0:01');
const detached = button(timerFixture.elements.get('shared-turn'), 0);
now = 181000;
detached.dispatch('click');
assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 0:00');
assert.equal(timerFixture.elements.get('result').hidden, false, 'late answer ends immediately without interval tick');
assert.ok(timerFixture.elements.get('team-0').querySelectorAll('button').every(answerButton => answerButton.disabled));
timerFixture.elements.get('reset').dispatch('click');
assert.equal(timerFixture.elements.get('timer').textContent, 'Zeit: 3:00', 'reset restores selected duration display');
timerFixture.elements.get('start').dispatch('click');
detached.dispatch('click');
assert.equal(timerFixture.elements.get('score-0').textContent, '0', 'detached button cannot affect a later game');

const delayed = await boot(true);
delayed.elements.get('start').dispatch('click');
delayed.elements.get('reset').dispatch('click');
delayed.rejectFullscreen();
await new Promise(resolve => setImmediate(resolve));
assert.equal(delayed.elements.get('screen-note').textContent, '', 'stale fullscreen rejection does not update the reset screen');

console.log('PASS: Spanisch-Tauziehen UI — Start, beide Teams, richtig/falsch, Weiter, Sieg-Ende, deaktivierte Eingaben, Neustart, Reset und Vollbild-Fallback. DOM touch-button checks passed; echtes Smartboard-Touch/Layout bleibt unverified.');
