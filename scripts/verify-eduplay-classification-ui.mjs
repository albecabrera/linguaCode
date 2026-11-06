import assert from 'node:assert/strict';
import { mountClassification } from '../pages/eduplay/classification.mjs';

class ClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  contains(value) { return this.values.has(value); }
}
class Element {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.classList = new ClassList(); this.attributes = {}; this.listeners = {}; this.disabled = false; this.draggable = false; this.type = ''; }
  focus() { document.activeElement = this; }
  set className(value) { this.classList = new ClassList(); value.split(/\s+/).filter(Boolean).forEach(item => this.classList.add(item)); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  get textContent() { return this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
  set textContent(value) { this.children = [String(value)]; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      if (!(node instanceof Element)) return;
      if (selector === 'button' && node.tagName === 'BUTTON' || selector === 'section' && node.tagName === 'SECTION' || selector === '[aria-live]' && node.attributes['aria-live'] || selector === '[aria-pressed="true"]' && node.attributes['aria-pressed'] === 'true' || selector.startsWith('.') && node.classList.contains(selector.slice(1))) matches.push(node);
      node.children.forEach(visit);
    };
    visit(this);
    return matches;
  }
}
globalThis.document = { activeElement: null, createElement: tag => new Element(tag) };

const activity = { content: {
  categories: [{ id: 'fruit', name: 'Obst' }, { id: 'vehicle', name: 'Fahrzeuge' }],
  items: [{ id: 'apple', text: 'Apfel', categoryId: 'fruit' }, { id: 'car', text: 'Auto', categoryId: 'vehicle' }],
} };
const container = new Element('main');
mountClassification(container, activity);
assert.equal(document.activeElement, null, 'initial render does not steal focus');
const items = container.querySelectorAll('button');
assert.equal(items.filter(button => button.textContent === 'Apfel').length, 1);
const apple = items.find(button => button.textContent === 'Apfel');
apple.focus();
apple.dispatch('click');
assert.equal(document.activeElement.textContent, 'Apfel', 'selection restores focus to the selected term');
const selectedApple = document.activeElement;
selectedApple.dispatch('click');
assert.notEqual(document.activeElement, selectedApple, 'deselection must not leave focus on a detached button');
assert.equal(document.activeElement.textContent, 'Apfel', 'deselection preserves focus');
document.activeElement.dispatch('click');
const selectedCategory = container.querySelectorAll('[aria-pressed="true"]');
assert.equal(selectedCategory.length, 1, 'keyboard/touch selection exposes the selected term');
const fruit = container.querySelectorAll('button').find(button => button.textContent === 'Obst');
fruit.focus();
fruit.dispatch('click');
assert.equal(document.activeElement.textContent, 'Auto', 'assignment moves focus to the next unassigned term');
const auto = container.querySelectorAll('button').find(button => button.textContent === 'Auto');
const vehicle = container.querySelectorAll('button').find(button => button.textContent === 'Fahrzeuge');
auto.focus();
auto.dispatch('click');
vehicle.focus();
vehicle.dispatch('click');
const check = container.querySelectorAll('button').find(button => button.textContent === 'Zuordnung prüfen');
assert.equal(document.activeElement.textContent, 'Zuordnung prüfen', 'last assignment moves focus to checking');
check.focus();
check.dispatch('click');
assert.equal(document.activeElement.textContent, 'Noch einmal spielen', 'checking preserves focus on the restart control');
const status = container.querySelector('[aria-live]');
assert.match(status.textContent, /Richtig: 2 \/ 2/);
assert.match(status.textContent, /100 %/);
assert.equal(container.querySelectorAll('.correct').length, 2);
assert.equal(container.querySelectorAll('.incorrect').length, 0);
assert.match(container.textContent, /✓/);
const restart = container.querySelectorAll('button').find(button => button.textContent === 'Noch einmal spielen');
restart.dispatch('click');
assert.equal(document.activeElement.textContent, 'Zuordnung prüfen', 'restart preserves focus on the check control');
assert.ok(container.querySelectorAll('button').some(button => button.textContent === 'Apfel'), 'restart clears assignments');

const dragContainer = new Element('main');
mountClassification(dragContainer, activity);
let draggedId;
const draggedApple = dragContainer.querySelectorAll('button').find(button => button.textContent === 'Apfel');
draggedApple.dispatch('dragstart', { dataTransfer: { setData(type, value) { if (type === 'text/plain') draggedId = value; }, getData() { return draggedId; } } });
const dragGroup = dragContainer.querySelectorAll('section')[0];
dragGroup.dispatch('drop', { preventDefault() {}, dataTransfer: { getData() { return draggedId; } } });
assert.match(dragContainer.querySelectorAll('section')[0].textContent, /Apfel/, 'desktop drag/drop assigns the term');

const wrongContainer = new Element('main');
mountClassification(wrongContainer, activity);
const wrongApple = wrongContainer.querySelectorAll('button').find(button => button.textContent === 'Apfel');
wrongApple.dispatch('dragstart', { dataTransfer: { setData() {} } });
const wrongVehicle = wrongContainer.querySelectorAll('button').find(button => button.textContent === 'Fahrzeuge');
wrongApple.dispatch('click');
wrongVehicle.dispatch('click');
const rightCar = wrongContainer.querySelectorAll('button').find(button => button.textContent === 'Auto');
rightCar.dispatch('click');
wrongContainer.querySelectorAll('button').find(button => button.textContent === 'Fahrzeuge').dispatch('click');
wrongContainer.querySelectorAll('button').find(button => button.textContent === 'Zuordnung prüfen').dispatch('click');
assert.match(wrongContainer.querySelector('[aria-live]').textContent, /Richtig: 1 \/ 2/);
assert.match(wrongContainer.textContent, /✗/);
assert.match(wrongContainer.textContent, /falsch/i);

const incomplete = new Element('main');
mountClassification(incomplete, activity);
incomplete.querySelectorAll('button').find(button => button.textContent === 'Apfel').dispatch('click');
incomplete.querySelectorAll('button').find(button => button.textContent === 'Obst').dispatch('click');
incomplete.querySelectorAll('button').find(button => button.textContent === 'Zuordnung prüfen').dispatch('click');
assert.match(incomplete.querySelector('[aria-live]').textContent, /alle Begriffe/i);

console.log('EduPlay classification UI checks passed');
