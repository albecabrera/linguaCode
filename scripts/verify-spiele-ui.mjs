import assert from 'node:assert/strict';
import { createEmptyGame, exportGame } from '../pages/spiele/model.mjs';
import { mountSpiele } from '../pages/spiele/app.mjs';

class ClassList { constructor() { this.values = new Set(); } add(...items) { items.forEach(item => this.values.add(item)); } remove(...items) { items.forEach(item => this.values.delete(item)); } contains(item) { return this.values.has(item); } }
class Element {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.listeners = {}; this.attributes = {}; this.classList = new ClassList(); this.dataset = {}; this.value = ''; this.files = []; this.disabled = false; this.hidden = false; this.type = ''; this.style = { setProperty: (name, value) => { this.style[name] = value; } }; this._text = ''; }
  set className(value) { this.classList = new ClassList(); value.split(/\s+/).filter(Boolean).forEach(item => this.classList.add(item)); }
  get textContent() { return this.children.length ? this.children.map(child => child instanceof Element ? child.textContent : child).join('') : this._text; }
  set textContent(value) { this.children = []; this._text = String(value); }
  append(...children) { children.forEach(child => { if (child instanceof Element) child.parent = this; this.children.push(child); }); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  replaceWith(node) { if (!this.parent) { this.replacement = node; return; } const index = this.parent.children.indexOf(this); if (index >= 0) { node.parent = this.parent; this.parent.children[index] = node; } }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  click() { this.dispatch('click'); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) { const found = []; const visit = node => { if (!(node instanceof Element)) return; if ((selector === 'button' && node.tagName === 'BUTTON') || (selector === 'input' && node.tagName === 'INPUT') || selector.startsWith('.') && node.classList.contains(selector.slice(1)) || (selector === '[role="alert"]' && node.attributes.role === 'alert')) found.push(node); node.children.forEach(visit); }; visit(this); return found; }
}
let fullscreenRequests = 0;
const document = {
  createElement: tag => new Element(tag),
  querySelector: selector => selector === '#app' ? app : null,
  fullscreenElement: null,
  documentElement: { requestFullscreen: async () => { fullscreenRequests += 1; } }
};
const app = new Element('main');
const storage = { value: null, getItem() { return this.value; }, setItem(_, value) { this.value = value; } };
globalThis.document = document;
globalThis.localStorage = storage;
globalThis.confirm = () => true;
globalThis.URL = { createObjectURL: () => 'blob:test', revokeObjectURL: () => {} };
globalThis.Blob = class Blob {};

assert.equal(typeof mountSpiele, 'function');
const controller = mountSpiele(app, storage);
assert.ok(app.querySelector('.type-grid'));
assert.equal(app.querySelector('.type-grid').querySelectorAll('button').length, 5);
assert.match(app.textContent, /Informatik.*Spanisch.*Sport.*Mathematik/s);
assert.equal(typeof controller.home, 'function');
const unavailableApp = new Element('main');
mountSpiele(unavailableApp, null);
assert.match(unavailableApp.textContent, /Lokaler Speicher ist nicht verfügbar/);

const invalid = createEmptyGame('matching');
invalid.title = 'Ungültig'; invalid.description = 'Test'; invalid.content.groups = [null];
assert.equal(controller.importText(JSON.stringify(invalid)), null);
assert.equal(controller.importText(JSON.stringify(invalid)), null);
assert.equal(storage.value, null);
assert.match(app.querySelector('[role="alert"]').textContent, /Import abgebrochen/);
controller.home();
const fileInput = app.querySelectorAll('input').find(node => node.type === 'file');
let fileRead = false;
fileInput.files = [{ size: 1024 * 1024 + 1, text: async () => { fileRead = true; return '{}'; } }];
fileInput.value = 'selected';
fileInput.dispatch('change');
await Promise.resolve();
assert.equal(fileRead, false, 'oversized import is rejected before text loading');
assert.equal(fileInput.value, '', 'file input resets for retry');
assert.doesNotThrow(() => controller.importText(exportGame(Object.assign(createEmptyGame('tug'), { title: 'Import', description: 'Test', content: { questions: [{ id: 'q', prompt: 'Frage', answer: 'Antwort', points: 1 }] } }))));

function game(type) {
  const value = createEmptyGame(type); value.title = type; value.description = 'Test';
  if (type === 'tug' || type === 'wheel') value.content.questions = [{ id: 'q1', prompt: 'Frage 1', answer: 'Antwort 1', points: 100 }, { id: 'q2', prompt: 'Frage 2', answer: 'Antwort 2', points: 200 }];
  if (type === 'jeopardy') value.content.categories = [{ id: 'c1', name: 'A', questions: [{ id: 'j1', prompt: 'Jeopardy?', answer: 'Ja', points: 100 }] }, { id: 'c2', name: 'B', questions: [{ id: 'j2', prompt: 'Noch?', answer: 'Ja', points: 200 }] }];
  if (type === 'memory') value.content.pairs = [{ id: 'p1', first: 'eins', second: 'one' }, { id: 'p2', first: 'zwei', second: 'two' }];
  if (type === 'matching') value.content.groups = [{ id: 'g1', name: 'Zahlen', items: [{ id: 'i1', text: 'eins' }] }, { id: 'g2', name: 'Wörter', items: [{ id: 'i2', text: 'one' }] }];
  return value;
}

controller.play(game('tug'));
const genericArena = app.querySelector('.reference-arena-svg');
assert.ok(genericArena, 'generic tug uses the shared SVG arena template');
assert.ok(genericArena.children.length > 0, 'generic SVG is built with DOM nodes');
assert.ok(genericArena.children.some(node => node.attributes?.d === 'M372 248Q600 256 828 248'), 'generic rope geometry is present');
assert.ok(genericArena.children.some(node => node.attributes?.cx === '600' && node.attributes?.cy === '254'), 'generic marker geometry is present');
const svgNodes = [];
const walkSvg = node => { if (!(node instanceof Element)) return; svgNodes.push(node); node.children.forEach(walkSvg); };
walkSvg(genericArena);
assert.ok(svgNodes.some(node => node.attributes?.transform === 'translate(280 105)'), 'generic blue geometry is present');
assert.ok(svgNodes.some(node => node.attributes?.transform === 'translate(920 105)'), 'generic orange geometry is present');
assert.equal(app.querySelectorAll('.tug-question-panel').length, 1, 'tug has one shared question panel');
assert.equal(app.querySelectorAll('.tug-answer').length, 0, 'team-specific question cards are not rendered');
assert.match(app.textContent, /Team A ist am Zug/);
assert.equal(fullscreenRequests, 1, 'starting generic tug requests fullscreen once');
const sharedInput = app.querySelectorAll('input').find(node => node.id === 'tug-shared-input');
assert.ok(sharedInput, 'legacy question uses shared text field');
sharedInput.value = ' Antwort   1 '; sharedInput.dispatch('input');
app.querySelector('.tug-question-panel').querySelectorAll('button').find(node => /Antwort prüfen/.test(node.textContent)).click();
assert.match(app.textContent, /Team A: 1/);
assert.match(app.textContent, /Team B ist am Zug/, 'turn alternates after answer');
const redSharedInput = app.querySelectorAll('input').find(node => node.id === 'tug-shared-input');
redSharedInput.value = 'falsch'; redSharedInput.dispatch('input');
app.querySelector('.tug-question-panel').querySelectorAll('button').find(node => /Antwort prüfen/.test(node.textContent)).click();
assert.match(app.textContent, /Team A ist am Zug/);
const blueSecondInput = app.querySelectorAll('input').find(node => node.id === 'tug-shared-input');
blueSecondInput.value = 'Antwort 2'; blueSecondInput.dispatch('input');
app.querySelector('.tug-question-panel').querySelectorAll('button').find(node => /Antwort prüfen/.test(node.textContent)).click();
assert.match(app.textContent, /Team B ist am Zug/);

const choiceGame = game('tug');
choiceGame.content.questions[0].choices = ['Falsche Antwort'];
controller.play(choiceGame);
const configuredChoices = app.querySelector('.tug-shared-answer').querySelectorAll('button');
assert.equal(configuredChoices.length, 2, 'configured choices render with the correct answer');
configuredChoices[0].click();
assert.match(app.textContent, /Falsch/);

document.documentElement.requestFullscreen = async () => { throw new Error('denied'); };
controller.play(game('tug'));
await new Promise(resolve => setImmediate(resolve));
assert.match(app.textContent, /Vollbild ist hier nicht verfügbar/, 'fullscreen denial has an accessible non-blocking fallback');
let rejectFullscreen;
document.documentElement.requestFullscreen = () => new Promise((_, reject) => { rejectFullscreen = reject; });
controller.play(game('tug'));
const detachedFeedback = app.querySelector('.status');
controller.home();
rejectFullscreen(new Error('denied'));
await new Promise(resolve => setImmediate(resolve));
assert.equal(detachedFeedback.textContent, '', 'stale fullscreen rejection does not mutate detached generic feedback');
document.documentElement.requestFullscreen = undefined;
const requestsBeforeWheel = fullscreenRequests;
controller.play(game('wheel'));
assert.equal(fullscreenRequests, requestsBeforeWheel, 'other games do not request fullscreen');
const wheelButton = app.querySelectorAll('button').find(node => node.textContent === 'Glücksrad drehen');
wheelButton.click(); assert.equal(app.querySelector('.answer').hidden, true);
wheelButton.click(); wheelButton.click();
assert.equal(wheelButton.disabled, true); assert.match(app.textContent, /Alle Fragen wurden gezogen/);

controller.play(game('jeopardy'));
const jeopardyTile = app.querySelectorAll('button').find(node => node.textContent === '100 Punkte');
jeopardyTile.click(); assert.equal(app.querySelector('.answer').hidden, true);
app.querySelectorAll('button').find(node => node.textContent === 'Antwort einblenden').click();
app.querySelectorAll('button').find(node => node.textContent === 'Punkt vergeben').click();
assert.match(app.textContent, /Punktestand: 100/); assert.equal(jeopardyTile.disabled, true);

controller.play(game('memory'));
const memoryCards = app.querySelectorAll('.memory-card');
memoryCards[0].click(); memoryCards[0].click();
assert.match(app.textContent, /Noch eine Karte/);
const mate = memoryCards.find(card => card !== memoryCards[0] && card.dataset.pairId === memoryCards[0].dataset.pairId);
mate.click();
assert.equal(memoryCards[0].disabled, true); assert.equal(mate.disabled, true);

controller.play(game('matching'));
const matchingItems = app.querySelectorAll('.choice-grid').at(0).querySelectorAll('button');
const matchingGroups = app.querySelectorAll('.choice-grid').at(1).querySelectorAll('button');
matchingItems[0].click(); matchingGroups[0].click();
assert.equal(matchingItems[0].disabled, true); matchingGroups[0].click();
matchingItems[1].click(); matchingGroups[1].click();
assert.match(app.textContent, /Zuordnen geschafft/);

const draft = game('tug');
draft.content.questions = [{ id: 'draft', prompt: 'Draft?', answer: 'Richtig', choices: ['Eins', 'Zwei', 'Drei'], points: 100 }];
controller.edit(draft);
const allDraftFields = app.querySelectorAll('input').filter(node => node.type !== 'file');
assert.equal(allDraftFields.length, 8, 'tug editor exposes stable answer fields');
allDraftFields[4].value = 'Neu Eins'; allDraftFields[4].dispatch('input');
allDraftFields[5].value = ''; allDraftFields[5].dispatch('input');
allDraftFields[6].value = 'Neu Drei'; allDraftFields[6].dispatch('input');

app.querySelectorAll('button').find(node => node.textContent === 'Frage hinzufügen').click();
app.querySelectorAll('button').filter(node => node.textContent === 'Entfernen').at(-1).click();
const retainedFields = app.querySelectorAll('input').filter(node => node.type !== 'file');
assert.equal(retainedFields[4].value, 'Neu Eins', 'first distractor survives rerender');
assert.equal(retainedFields[5].value, '', 'cleared distractor remains cleared');
assert.equal(retainedFields[6].value, 'Neu Drei', 'third distractor does not shift after clearing');
assert.deepEqual(draft.content.questions[0].choices, ['Eins', 'Zwei', 'Drei'], 'draft is compacted only on save');
app.querySelectorAll('button').find(node => node.textContent === 'Validieren').click();
controller.edit(draft);
let reopenedFields = app.querySelectorAll('input').filter(node => node.type !== 'file');
assert.equal(reopenedFields[4].value, 'Neu Eins', 'validated draft survives editor reopen');
assert.equal(reopenedFields[5].value, 'Neu Drei', 'validated draft keeps compacted order');
reopenedFields[3].value = ''; reopenedFields[3].dispatch('input');
app.querySelectorAll('button').find(node => node.textContent === 'Lokal speichern').click();
assert.equal(storage.value, null, 'failed save does not discard editor draft');
reopenedFields[3].value = 'Richtig'; reopenedFields[3].dispatch('input');
app.querySelectorAll('button').find(node => node.textContent === 'Lokal speichern').click();
const saved = JSON.parse(storage.value)[0];
assert.deepEqual(saved.content.questions[0].choices, ['Neu Eins', 'Neu Drei'], 'saved choices compact empty slots');
controller.edit(saved);
const savedAgain = app.querySelectorAll('input').filter(node => node.type !== 'file');
assert.equal(savedAgain[4].value, 'Neu Eins', 'saved choice reopens');
assert.equal(savedAgain[5].value, 'Neu Drei', 'saved compacted choice reopens');

controller.edit(game('jeopardy'));
app.querySelectorAll('button').find(node => node.textContent === 'Kategorie hinzufügen').click();
const firstQuestionAdd = app.querySelectorAll('button').find(node => node.textContent === 'Frage hinzufügen');
firstQuestionAdd.click();
assert.match(app.textContent, /Frage 1/);
console.log('Spiele UI DOM checks passed');
