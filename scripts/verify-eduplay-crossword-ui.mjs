import assert from 'node:assert/strict';
import {generateCrossword} from '../pages/eduplay/crossword.mjs';
import {mountCrossword} from '../pages/eduplay/crossword-ui.mjs';

class FakeClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
  toggle(value, force) { const next = force === undefined ? !this.values.has(value) : force; next ? this.add(value) : this.remove(value); return next; }
  contains(value) { return this.values.has(value); }
}
class FakeElement {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.listeners = {}; this.attributes = {}; this.classList = new FakeClassList(); this.style = {}; this.value = ''; this.textContent = ''; this.hidden = false; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatchEvent(event) { for (const listener of this.listeners[event.type] || []) listener(event); }
  focus() { document.activeElement = this; this.dispatchEvent({type: 'focus'}); }
  click() { this.dispatchEvent({type: 'click'}); }
  get className() { return [...this.classList.values].join(' '); }
  set className(value) { this.classList = new FakeClassList(); value.split(/\s+/).filter(Boolean).forEach(item => this.classList.add(item)); }
}
class FakeDocument {
  createElement(tag) { return new FakeElement(tag); }
}
globalThis.document = new FakeDocument();
globalThis.Event = class { constructor(type) { this.type = type; this.bubbles = false; } };

const words = [
  ['ALGORITHMUS','Algorithmus'], ['ANWEISUNG','Anweisung'], ['EINGABE','Eingabe'], ['AUSGABE','Ausgabe'],
  ['BEDINGUNG','Bedingung'], ['SCHLEIFE','Schleife'], ['VARIABLE','Variable'], ['PROGRAMM','Programm'],
].map(([word, clue], index) => ({id:`w${index}`, word, clue}));
const activity = {content: {words}};
const puzzle = generateCrossword(words);
const container = new FakeElement('main');
mountCrossword(container, activity);
const walk = (element) => [element, ...element.children.flatMap(walk)];
const all = () => walk(container);
const inputs = () => all().filter(element => element.tagName === 'INPUT');
const buttons = () => all().filter(element => element.tagName === 'BUTTON');
const button = text => buttons().find(element => element.textContent === text);
const inputFor = cell => inputs().find(input => input.attributes['aria-label'].startsWith(`Zeile ${cell.y + 1}, Spalte ${cell.x + 1}`));
const crossing = puzzle.cells.find(cell => cell.entries.length === 2);
const crossingInput = inputFor(crossing);
const directionButton = buttons().find(element => element.textContent === 'Richtung: waagerecht');

crossingInput.focus();
crossingInput.click();
assert.equal(directionButton.textContent, 'Richtung: waagerecht', 'first click selects without toggling');
crossingInput.click();
assert.equal(directionButton.textContent, 'Richtung: senkrecht', 'second click toggles a crossing direction');

const downWord = puzzle.placed.find(word => word.direction === 'down');
const downClue = all().find(element => element.tagName === 'LI' && element.textContent.includes(downWord.clue));
downClue.click();
assert.equal(document.activeElement, inputFor({x: downWord.x, y: downWord.y}), 'clue click selects its starting cell');
assert.equal(directionButton.textContent, 'Richtung: senkrecht', 'clue click selects its direction');

const first = inputFor(puzzle.cells[0]);
first.focus();
const keyboardA = button('A');
keyboardA.click();
assert.equal(first.value, 'A', 'virtual keyboard enters a letter into the selected cell');

const correctCell = puzzle.cells[0];
const wrongCell = puzzle.cells.find(cell => cell !== correctCell);
const correctInput = inputFor(correctCell);
const wrongInput = inputFor(wrongCell);
correctInput.value = correctCell.letter;
wrongInput.value = 'Z';
wrongInput.dispatchEvent(new Event('input'));
button('Überprüfen').click();
assert.ok(wrongInput.classList.contains('incorrect'), 'checking marks a wrong entry');
button('Fehler korrigieren').click();
assert.equal(correctInput.value, correctCell.letter, 'correction preserves correct entries');
assert.equal(wrongInput.value, '', 'correction clears only wrong entries');

first.focus();
first.value = 'X';
first.dispatchEvent(new Event('input'));
button('Neu starten').click();
assert.ok(inputs().every(input => input.value === ''), 'restart clears all entries');

const broken = new FakeElement('main');
mountCrossword(broken, {content: {words: [{id:'a', word:'AAA', clue:'a'}, {id:'b', word:'ZZZ', clue:'b'}]}});
assert.match(allText(broken), /Nicht platzierbar/);

function allText(element) { return [element.textContent, ...element.children.map(allText)].join(' '); }
console.log('EduPlay crossword UI interaction checks passed');
