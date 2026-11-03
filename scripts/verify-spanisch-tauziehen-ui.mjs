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
assert.match(html, /id="result"/);
assert.match(html, /id="fullscreen"/);
assert.match(html, /<svg[^>]+class="team-scene"/);
assert.match(html, /class="human-team green-team"/);
assert.match(html, /class="human-team orange-team"/);
assert.equal((html.match(/class="person /g) || []).length, 4, 'arena markup has two illustrated people per team');
assert.match(html, /<pattern id="fabric-green"/, 'green fabric has geometric pattern definition');
assert.match(html, /<pattern id="fabric-orange"/, 'orange fabric has geometric pattern definition');
assert.match(html, /<pattern id="cap-pattern"/, 'caps have embroidered pattern definition');
assert.match(html, /<line x1="180" y1="145" x2="1020" y2="145"\/>/, 'rope is centered on the hands');
assert.equal((html.match(/transform="translate\((115|300) 0\)"/g) || []).length, 2, 'green figures use bounded staggered origins');
assert.equal((html.match(/transform="translate\((1085|900) 0\) scale\(-1 1\)"/g) || []).length, 2, 'orange figures mirror green origins');
assert.equal((html.match(/class="hand" cx="150" cy="145"/g) || []).length, 4, 'all hands share the rope height');
const greenOrigins = [...html.matchAll(/class="person[^\"]*" transform="translate\((\d+) 0\)"/g)].map(match => Number(match[1]));
const orangeOrigins = [...html.matchAll(/class="person[^\"]*" transform="translate\((\d+) 0\) scale\(-1 1\)"/g)].map(match => Number(match[1]));
const maxSceneShift = 1200 * 0.075;
assert.ok(Math.min(...greenOrigins) + 22 - maxSceneShift > 0, 'green figures stay inside the SVG at the left goal');
assert.ok(Math.max(...orangeOrigins) - 22 + maxSceneShift < 1200, 'orange figures stay inside the SVG at the right goal');
assert.match(html, /nach 99 Aufgaben je Team entscheidet der Punktestand/);
assert.doesNotMatch(html, /scoring Gruppe/);
assert.match(html, /id="movement-explanation"/);
assert.match(css, /touch-action:manipulation/);
assert.match(css, /aspect-ratio:1200\/260/);
assert.match(css, /\.field\{[^}]*height:100%/i, 'field fills its aspect-ratio box');
assert.match(css, /\.field\{[^}]*background:[^}]*#fbfaf5/i, 'field uses a light arena background');
assert.match(css, /#rope\{[^}]*height:100%/i, 'rope scene scales with the field');
assert.match(css, /\.goal\{[^}]*color:#172e38[^}]*border-left:2px solid #172e38/i, 'goal markers are readable on the light field');
assert.match(css, /\.center-line\{[^}]*border-left:2px dashed #57696e/i, 'center line is readable on the light field');
assert.match(css, /\.human-team \.neck\{[^}]*fill:none[^}]*stroke:#f0b58b/i, 'neck uses a skin-colored outlined stroke');
assert.match(html, /class="ribbon"/, 'center marker has a ribbon');
assert.match(css, /\.rope-art \.ribbon\{/, 'ribbon shares rope artwork styling');
assert.match(css, /\.goal\.left\{left:42\.5%\}/);
assert.match(css, /\.goal\.right\{left:57\.5%\}/);
assert.match(css, /transform-box:fill-box/);
assert.match(css, /pull-left \.orange-team\{animation:stumble-left/);
assert.match(css, /pull-right \.green-team\{animation:stumble-right/);
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

const makeFixture = () => {
  const elements = new Map();
  const add = (id, tag = 'div') => { const node = new Element(tag, id); elements.set(id, node); return node; };
  ['fullscreen', 'start', 'intro', 'teams', 'team-0', 'team-1', 'result', 'restart', 'reset', 'score-0', 'score-1', 'rope', 'match-status', 'screen-note', 'result-title', 'result-detail'].forEach(id => add(id, id === 'fullscreen' || id === 'start' || id === 'restart' || id === 'reset' ? 'button' : 'div'));
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
  documentElement.requestFullscreen = async () => { throw new Error('fullscreen unavailable in verifier'); };
  return {elements, document};
};

let bootNumber = 0;
const boot = async () => {
  const fixture = makeFixture();
  globalThis.document = fixture.document;
  await import(`../pages/spanisch-tauziehen/app.mjs?ui-boot=${++bootNumber}`);
  return fixture;
};
const button = (panel, index) => panel.querySelectorAll('button')[index];
const feedback = panel => panel.querySelectorAll('.feedback')[0];
const answerText = panel => {
  const prompt = panel.children.find(child => child.tagName === 'H2')?.textContent || '';
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
const startGame = fixture => { fixture.elements.get('start').dispatch('click'); assert.equal(fixture.elements.get('teams').hidden, false); };
const scene = fixture => fixture.elements.get('rope');

const game = await boot();
assert.equal(game.elements.get('intro').hidden, false, 'intro is visible before start');
assert.equal(game.elements.get('teams').hidden, true, 'teams are hidden before start');
startGame(game);
assert.equal(game.elements.get('reset').hidden, false, 'reset is available during play');
assert.equal(game.elements.get('team-0').querySelectorAll('button').length, 4, 'green team gets four answers');
assert.equal(game.elements.get('team-1').querySelectorAll('button').length, 4, 'orange team gets four answers independently');
assert.equal(scene(game).className, 'rope-scene', 'scene starts still');
const firstGreenPrompt = game.elements.get('team-0').children.find(child => child.tagName === 'H2')?.textContent;
const firstOrangePrompt = game.elements.get('team-1').children.find(child => child.tagName === 'H2')?.textContent;
assert.equal(firstGreenPrompt, firstOrangePrompt, 'both teams visibly receive the same per-game prompt');

const green = game.elements.get('team-0');
const orange = game.elements.get('team-1');
wrongButton(green).dispatch('click');
assert.match(feedback(green).textContent, /Noch nicht richtig/);
assert.equal(game.elements.get('score-0').textContent, '0', 'wrong green answer does not score');
assert.equal(scene(game).className, 'rope-scene', 'wrong answer does not animate');
assert.ok(green.querySelectorAll('button').filter(answerButton => !answerButton.textContent.includes('Weiter')).every(answerButton => answerButton.disabled), 'answered green choices are disabled');
assert.ok(green.querySelectorAll('button').some(answerButton => answerButton.className === 'correct'), 'wrong feedback marks the solution');
wrongButton(green).dispatch('click');
assert.equal(game.elements.get('score-0').textContent, '0', 'wrong answer cannot be submitted twice');
green.querySelectorAll('button').find(answerButton => answerButton.textContent === 'Weiter →').dispatch('click');
assert.match(green.textContent, /Aufgabe 2 \/ 99/);
assert.equal(scene(game).className, 'rope-scene', 'Weiter does not animate');

correctButton(orange).dispatch('click');
assert.match(feedback(orange).textContent, /Richtig/);
assert.equal(game.elements.get('score-1').textContent, '1', 'orange team scores independently');
assert.equal(scene(game).className, 'rope-scene pull-right', 'correct orange answer pulls right');
const firstPull = scene(game).dataset.pullSequence;

assert.match(game.elements.get('match-status').textContent, /Equipo Naranja führt/);
orange.querySelectorAll('button').find(answerButton => answerButton.textContent === 'Weiter →').dispatch('click');
assert.match(orange.textContent, /Aufgabe 2 \/ 99/);
assert.equal(scene(game).className, 'rope-scene pull-right', 'Weiter preserves the final scene without starting another pull');


const winner = await boot();
startGame(winner);
const winnerPanel = winner.elements.get('team-0');
for (let round = 0; round < 5; round += 1) {
  correctButton(winnerPanel).dispatch('click');
  assert.match(feedback(winnerPanel).textContent, /Richtig/);
  const next = winnerPanel.querySelectorAll('button').find(answerButton => answerButton.textContent.includes('Weiter') || answerButton.textContent.includes('Team abschließen'));
  if (next) next.dispatch('click');
}
assert.equal(winner.elements.get('result').hidden, false, 'five correct pulls end the duel');
assert.match(winner.elements.get('result-title').textContent, /Equipo Verde gewinnt/);
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
assert.equal(scene(winner).className, 'rope-scene', 'restart restores the still scene');
winner.elements.get('reset').dispatch('click');
assert.equal(winner.elements.get('intro').hidden, false, 'reset returns to intro');
assert.equal(winner.elements.get('teams').hidden, true, 'reset hides teams');
assert.equal(scene(winner).className, 'rope-scene', 'reset restores the arena scene');

const fullscreen = await boot();
fullscreen.elements.get('fullscreen').dispatch('click');
await new Promise(resolve => setImmediate(resolve));
assert.match(fullscreen.elements.get('screen-note').textContent, /Vollbild ist hier nicht verfügbar/);

console.log('PASS: Spanisch-Tauziehen UI — Start, beide Teams, richtig/falsch, Weiter, Sieg-Ende, deaktivierte Eingaben, Neustart, Reset und Vollbild-Fallback. DOM touch-button checks passed; echtes Smartboard-Touch/Layout bleibt unverified.');
