import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { TASKS } from '../pages/brueche/game-logic.mjs';

const html = await readFile(new URL('../pages/brueche/index.html', import.meta.url), 'utf8');
const inline = html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline, 'production inline module script exists');
assert.match(html, /@keyframes\s+quest-travel/, 'travel uses a real keyframe sequence');
assert.match(html, /@keyframes\s+quest-attack/, 'attack uses a real keyframe sequence');
assert.match(html, /@keyframes\s+loot-flight/, 'loot uses a real keyframe sequence');
assert.match(html, /@keyframes\s+guardian-fall/, 'defeat uses a real keyframe sequence');
assert.match(html, /prefersReducedMotion|matchMedia/, 'reduced-motion state is observed by presentation code');
assert.match(html, /fractionPattern[\s\S]*fraction-numerator[\s\S]*fraction-denominator/, 'visible fractions use structured vertical markup');
assert.doesNotMatch(html, /button\.textContent=option/, 'answer semantics are kept separate from visible fraction markup');

class ClassList {
  constructor(values = []) { this.values = new Set(values); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
  toggle(value, force) { const next = force === undefined ? !this.values.has(value) : force; next ? this.add(value) : this.remove(value); return next; }
  contains(value) { return this.values.has(value); }
}
class Element {
  constructor(tag = 'div', id = '', classes = []) { this.tagName = tag.toUpperCase(); this.id = id; this.classList = new ClassList(classes); this.children = []; this.parentElement = null; this.listeners = {}; this.attributes = {}; this.style = {}; this.dataset = {}; this._text = ''; this.disabled = false; this.focused = false; }
  set className(value) { this.classList = new ClassList(String(value).split(/\s+/).filter(Boolean)); }
  get className() { return [...this.classList.values].join(' '); }
  get textContent() { return this.children.length ? this.children.map(child => child.textContent).join('') : this._text; }
  set textContent(value) { this.children = []; this._text = String(value); }
  append(...nodes) { nodes.forEach(node => { node.parentElement = this; this.children.push(node); }); }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type) { for (const listener of this.listeners[type] || []) listener({ target: this }); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  focus() { this.focused = true; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) { return this.children.flatMap(child => [child, ...child.querySelectorAll(selector)]).filter(node => matches(node, selector)); }
}
const matches = (node, selector) => selector.startsWith('.') ? node.classList.contains(selector.slice(1)) : selector.startsWith('#') ? node.id === selector.slice(1) : node.tagName.toLowerCase() === selector.toLowerCase();

function makeDocument() {
  const elements = new Map();
  const add = (id, tag = 'div', classes = []) => { const element = new Element(tag, id, classes); elements.set(id, element); return element; };
  const documentElement = new Element('html');
  const body = new Element('body');
  const home = add('home', 'section');
  const game = add('game', 'section', ['game', 'hidden']);
  const summary = add('summary', 'section', ['summary', 'hidden']);
  const world = new Element('div', '', ['world']);
  const avatar = new Element('span', '', ['avatar']);
  const enemy = new Element('i', '', ['enemy']);
  const steps = [1, 2, 3, 4].map(level => { const step = new Element('li', '', ['step']); step.dataset = { level: String(level) }; const badge = new Element('span', '', ['badge']); step.append(badge); return step; });
  const answers = add('answers', 'div');
  const events = add('events', 'ul');
  const ids = ['sound-toggle', 'theme-toggle', 'start', 'home-progress', 'home-inventory', 'home-health', 'topic', 'prompt', 'feedback', 'next', 'inventory', 'health', 'question-number', 'level-label', 'again', 'summary-lead', 'summary-inventory', 'strengths', 'review'];
  ids.forEach(id => add(id, id === 'start' || id === 'next' || id === 'again' || id.endsWith('toggle') ? 'button' : 'span'));
  add('game-title', 'strong');
  home.append(world, ...steps); game.append(answers, elements.get('prompt'), elements.get('next'), elements.get('feedback'), events, elements.get('topic'), elements.get('question-number'), elements.get('level-label'), elements.get('inventory'), elements.get('health')); summary.append(elements.get('summary-inventory'), elements.get('strengths'), elements.get('review'));
  body.append(home, game, summary); documentElement.append(body);
  return { documentElement, body, elements, document: { documentElement, createElement: tag => new Element(tag), getElementById: id => elements.get(id) || null, querySelector: selector => selector === '.world' ? world : selector === '.avatar' ? avatar : selector === '.enemy' ? enemy : null, querySelectorAll: selector => selector === '.step' ? steps : selector === '.answer' ? answers.querySelectorAll('.answer') : [] }, world, avatar, enemy, steps };
}

class Storage {
  constructor(seed = {}, fail = false) { this.data = new Map(Object.entries(seed)); this.fail = fail; }
  getItem(key) { if (this.fail) throw new Error('storage unavailable'); return this.data.get(key) ?? null; }
  setItem(key, value) { if (this.fail) throw new Error('storage unavailable'); this.data.set(key, String(value)); }
  removeItem(key) { if (this.fail) throw new Error('storage unavailable'); this.data.delete(key); }
}

async function boot(storage = new Storage(), audio = true, reducedMotion = false) {
  const fixture = makeDocument();
  const imports = await import('../pages/brueche/game-logic.mjs');
  const source = inline.replace(/import \{[^}]+\} from '\.\/game-logic\.mjs';/, 'const {TASKS: SOURCE_TASKS,answerCard,advance,createState,hydrate,resetState} = imports;');
  const frames = new Map();
  let frameId = 0;
  const flushFrames = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()); };
  const context = vm.createContext({ imports, document: fixture.document, sessionStorage: storage, console, requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; }, cancelAnimationFrame: id => frames.delete(id), matchMedia: () => ({ matches: reducedMotion }), AudioContext: audio ? class { createOscillator() { return { frequency: {}, connect() { return this; }, start() {}, stop() {} }; } createGain() { return { gain: {}, connect() { return this; } }; } get destination() { return {}; } get currentTime() { return 0; } } : class { constructor() { throw new Error('audio unavailable'); } } });
  new vm.Script(source, { filename: 'pages/brueche/index.html:inline-module' }).runInContext(context);
  return { ...fixture, storage, flushFrames, click: (element, index = 0) => element.dispatch('click', index) };
}
const visible = element => !element.classList.contains('hidden');
const answerButton = (app, value) => app.document.querySelectorAll('.answer').find(button => button.getAttribute('aria-label') === value || button.textContent === value);
const answer = (app, value) => { const button = answerButton(app, value); assert.ok(button, `answer button ${value} exists`); button.dispatch('click'); app.flushFrames(); };
const next = app => app.elements.get('next').dispatch('click');
const complete = async (mode = 'correct', storage = new Storage()) => { const app = await boot(storage); app.elements.get('start').dispatch('click'); for (let i = 0; i < TASKS.length; i++) { answer(app, mode === 'correct' ? TASKS[i].answer : TASKS[i].options.find(option => option !== TASKS[i].answer)); next(app); } return app; };

const started = await boot();
started.elements.get('start').dispatch('click');
assert.ok(visible(started.elements.get('home')), 'start keeps the visible world');
assert.ok(visible(started.elements.get('game')), 'start opens gameplay');
assert.equal(answerButton(started, '1/4').querySelectorAll('.fraction').length, 1, 'answer renders a fraction node');
assert.equal(answerButton(started, '1/4').getAttribute('aria-label'), '1/4', 'answer keeps its internal value as an accessible label');
answer(started, TASKS[0].answer);
assert.equal(started.avatar.style.left, '13.5%', 'correct answer moves avatar');
assert.equal(started.world.classList.contains('anim-travel'), true, 'correct answer retriggers travel presentation');
assert.equal(started.world.dataset.motion, 'full', 'normal motion path is marked on the world');
assert.match(started.elements.get('inventory').textContent, /Noch leer/);
assert.ok([...started.document.querySelectorAll('.answer')].every(button => button.disabled));
const afterFirst = started.storage.data.get('brueche-session');
const resumed = await boot(started.storage);
assert.ok([...resumed.document.querySelectorAll('.answer')].every(button => button.disabled), 'answered cards restore disabled controls');
assert.ok(visible(resumed.elements.get('next')), 'answered session restores visible Next');
next(resumed);
assert.equal(resumed.elements.get('question-number').textContent, '2');
assert.equal(resumed.elements.get('prompt').querySelector('.fraction').getAttribute('aria-label'), '3/5', 'prompt renders fractions vertically');
assert.equal(resumed.elements.get('inventory').textContent, 'Noch leer');
assert.ok(afterFirst, 'answer persists session');

const wrong = await boot(new Storage());
wrong.elements.get('start').dispatch('click');
const positionBefore = wrong.avatar.style.left;
answer(wrong, TASKS[0].options.find(option => option !== TASKS[0].answer));
assert.equal(wrong.avatar.style.left, positionBefore, 'wrong answer does not move');
assert.equal(wrong.elements.get('inventory').textContent, 'Noch leer', 'wrong answer does not loot');
assert.equal(wrong.world.classList.contains('anim-travel'), false, 'wrong answer does not trigger travel presentation');
next(wrong);

const reduced = await boot(new Storage(), true, true);
reduced.elements.get('start').dispatch('click');
answer(reduced, TASKS[0].answer);
assert.equal(reduced.world.dataset.motion, 'reduced', 'reduced-motion path skips animated presentation');
assert.equal(reduced.world.classList.contains('anim-travel'), false, 'reduced-motion does not enqueue animations');
assert.equal(reduced.avatar.style.left, '13.5%', 'reduced-motion still applies immediate final position');

const allCorrect = await complete('correct');
assert.equal(allCorrect.elements.get('summary-inventory').textContent, 'HolzschildEisenstiefelDiamantspitzhacke');
assert.match(allCorrect.elements.get('review').textContent, /Keine Wiederholung nötig/);
assert.equal(allCorrect.enemy.classList.contains('defeated'), true);
const defeatedEvents = allCorrect.eventsText ?? allCorrect.elements.get('events').textContent;
assert.equal(allCorrect.elements.get('health').textContent, 'Besiegt');
assert.equal(allCorrect.elements.get('home-health').textContent, 'besiegt');
assert.doesNotMatch(defeatedEvents, /Wächter besiegt.*Wächter besiegt/);

const mixed = await complete('wrong');
assert.match(mixed.elements.get('review').textContent, /Faires Teilen: Wiederhole/);
assert.match(mixed.elements.get('summary-inventory').textContent, /Keine Ausrüstung/);
mixed.elements.get('again').dispatch('click');
assert.ok(visible(mixed.elements.get('home')) && !visible(mixed.elements.get('game')));

const theme = await boot();
theme.elements.get('theme-toggle').dispatch('click');
assert.equal(theme.document.documentElement.classList.contains('dark'), true);
assert.equal(theme.elements.get('theme-toggle').getAttribute('aria-pressed'), 'true');
theme.elements.get('sound-toggle').dispatch('click');
assert.equal(theme.elements.get('sound-toggle').getAttribute('aria-pressed'), 'true');
const unavailable = await boot(new Storage(), false);
unavailable.elements.get('sound-toggle').dispatch('click');
unavailable.elements.get('start').dispatch('click');
answer(unavailable, TASKS[0].answer);
const failedStorage = await boot(new Storage({}, true));
failedStorage.elements.get('start').dispatch('click');
assert.doesNotThrow(() => answer(failedStorage, TASKS[0].answer));

const interrupted = await boot();
interrupted.elements.get('start').dispatch('click');
answerButton(interrupted, TASKS[0].answer).dispatch('click');
next(interrupted);
interrupted.flushFrames();
assert.equal(interrupted.world.classList.contains('anim-travel'), false, 'Next cancels queued animation');
interrupted.elements.get('again').dispatch('click');
interrupted.flushFrames();
assert.equal(interrupted.world.classList.contains('anim-travel'), false, 'restart clears presentation');
assert.match(html, /\.enemy\.defeated\s*\{[^}]*opacity/, 'defeat has persistent visual state independent of animation');
assert.match(html, /\.wrap:has\(#home\.quest-active\)[^{]*\{[^}]*display:grid/, 'active desktop layout places stage beside tasks');

console.log('Brüche UI verifier: production inline module, DOM events, movement, rewards, combat, summary, restart, session, theme, sound and failure fallbacks passed');
