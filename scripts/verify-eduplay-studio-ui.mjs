import assert from 'node:assert/strict';
import {mountStudio} from '../pages/eduplay/studio.mjs';

class Element {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.attributes = {}; this.listeners = {}; this.value = ''; this.checked = false; this.files = []; this.type = ''; this.textContent = ''; }
  get textContent() { return (this._text || '') + this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
  set textContent(value) { this.children = []; this._text = String(value); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  click() { this.dispatch('click'); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      if (!(node instanceof Element)) return;
      if (selector === 'button' && node.tagName === 'BUTTON' || selector === 'input' && node.tagName === 'INPUT' || selector === 'select' && node.tagName === 'SELECT' || selector === 'textarea' && node.tagName === 'TEXTAREA' || selector === 'fieldset' && node.tagName === 'FIELDSET' || selector === '[role="alert"]' && node.attributes.role === 'alert' || selector === '[role="status"]' && node.attributes.role === 'status') matches.push(node);
      node.children.forEach(visit);
    };
    visit(this);
    return matches;
  }
}

globalThis.document = {createElement: tag => new Element(tag)};
globalThis.URL = {createObjectURL: () => 'blob:test', revokeObjectURL: () => {}};
globalThis.Blob = class Blob { constructor(parts, options) { this.parts = parts; this.options = options; } };
let confirmed = true;
globalThis.confirm = () => confirmed;

const quiz = {id:'quiz-1', schemaVersion:1, type:'quiz', title:'Quiz', description:'Test', subject:'Informatik', grade:'6', language:'de', createdAt:'2026-01-01T00:00:00Z', updatedAt:'2026-01-01T00:00:00Z', settings:{}, content:{questions:[{id:'q1', question:'2 + 2?', type:'single-choice', options:[{id:'a', text:'4'},{id:'b', text:'5'}], correctOptionIds:['a'], explanation:''}]}};
const stored = [quiz];
const store = {list: () => stored.slice(), save: activity => { const index = stored.findIndex(value => value.id === activity.id); if (index < 0) stored.push(structuredClone(activity)); else stored[index] = structuredClone(activity); }, remove: id => { const index = stored.findIndex(value => value.id === id); if (index >= 0) stored.splice(index, 1); }};
const previewed = [];
const container = new Element('main');
mountStudio(container, store, activity => previewed.push(activity));
assert.match(container.textContent, /lokaler Entwurf/);
assert.equal(container.querySelectorAll('button').find(button => button.textContent === 'Bearbeiten').textContent, 'Bearbeiten');
const duplicate = container.querySelectorAll('button').find(button => button.textContent === 'Duplizieren');
duplicate.click();
assert.equal(stored.length, 2);
assert.match(stored[1].title, /Kopie/);

const deleteButton = container.querySelectorAll('button').find(button => button.textContent === 'Löschen');
confirmed = false;
deleteButton.click();
assert.equal(stored.length, 2, 'cancelled deletion keeps the draft');
confirmed = true;
deleteButton.click();
assert.equal(stored.length, 1, 'confirmed deletion removes the draft');

container.querySelectorAll('button').find(button => button.textContent === 'Bearbeiten').click();
const addQuestion = container.querySelectorAll('button').find(button => button.textContent === 'Hinzufügen');
addQuestion.click();
assert.equal(container.querySelectorAll('fieldset').length, 2, 'quiz editor adds a question');
assert.ok(container.querySelectorAll('button').some(button => button.attributes['aria-label'] === 'Frage 1 nach oben verschieben'));
assert.ok(container.querySelectorAll('button').some(button => button.attributes['aria-label'] === 'Antwort 1 entfernen'));
const validate = container.querySelectorAll('button').find(button => button.textContent === 'Validieren');
validate.click();
assert.match(container.querySelector('[role="alert"]').textContent, /ungültig/i);

const preview = container.querySelectorAll('button').find(button => button.textContent === 'Vorschau');
preview.click();
assert.equal(previewed.length, 0, 'invalid activities cannot be previewed');

const examples = {
  memory: {id:'memory-1', schemaVersion:1, type:'memory', title:'Memory', description:'Test', subject:'Spanisch', grade:'7', language:'de', createdAt:'2026-01-01T00:00:00Z', updatedAt:'2026-01-01T00:00:00Z', settings:{}, content:{pairs:[{id:'p1', first:{text:'uno', image:''}, second:{text:'eins', image:''}}]}},
  crossword: {id:'crossword-1', schemaVersion:1, type:'crossword', title:'Kreuzwort', description:'Test', subject:'Informatik', grade:'6', language:'de', createdAt:'2026-01-01T00:00:00Z', updatedAt:'2026-01-01T00:00:00Z', settings:{}, content:{words:[{id:'w1', word:'CODE', clue:'Hinweis'}]}},
  classification: {id:'classification-1', schemaVersion:1, type:'classification', title:'Sortieren', description:'Test', subject:'Informatik', grade:'6', language:'de', createdAt:'2026-01-01T00:00:00Z', updatedAt:'2026-01-01T00:00:00Z', settings:{}, content:{categories:[{id:'c1', name:'Kategorie A'},{id:'c2', name:'Kategorie B'}], items:[{id:'i1', text:'Begriff', categoryId:'c1'}]}}
};
for (const [type, activity] of Object.entries(examples)) {
  const target = new Element('main');
  mountStudio(target, {list: () => [activity], save: () => {}, remove: () => {}}, () => {});
  target.querySelectorAll('button').find(button => button.textContent === 'Bearbeiten').click();
  const content = target.textContent;
  if (type === 'memory') assert.match(content, /Erste Karte: Text.*Zweite Karte: Bildadresse/s);
  assert.match(content, type === 'crossword' ? /Hinweis/ : /./);
  assert.match(content, type === 'classification' ? /Kategorie.*Begriff/ : /./);
}

const imported = new Element('main');
const importedStored = [{...structuredClone(quiz), title:'Original draft'}];
let importedSave = false;
mountStudio(imported, {list: () => importedStored.slice(), save: activity => { importedSave = true; const index = importedStored.findIndex(value => value.id === activity.id); if (index < 0) importedStored.push(structuredClone(activity)); else importedStored[index] = structuredClone(activity); }, remove: () => {}}, () => {});
const file = imported.querySelectorAll('input').find(input => input.type === 'file');
file.files = [{size: JSON.stringify(quiz).length, text: async () => JSON.stringify(quiz)}];
file.dispatch('change');
await new Promise(resolve => setTimeout(resolve, 0));
assert.match(imported.textContent, /Aktivität bearbeiten/);
assert.equal(imported.querySelectorAll('input')[0].value, 'Quiz');
assert.match(imported.textContent, /neue lokale Kopie|bereits vorhanden/i);
imported.querySelectorAll('button').find(button => button.textContent === 'Lokal speichern').click();
assert.equal(importedSave, true, 'valid imported activities can be saved locally');
assert.equal(importedStored.length, 2, 'import collision creates a second draft');
assert.equal(importedStored[0].title, 'Original draft', 'existing draft remains unchanged');
assert.notEqual(importedStored[1].id, quiz.id, 'collision gets a fresh activity ID');

const invalidImport = new Element('main');
mountStudio(invalidImport, {list: () => [], save: () => {}, remove: () => {}}, () => {});
const invalidFile = invalidImport.querySelectorAll('input').find(input => input.type === 'file');
invalidFile.files = [{size: 12, text: async () => '{not-json'}];
invalidFile.dispatch('change');
await new Promise(resolve => setTimeout(resolve, 0));
assert.match(invalidImport.querySelector('[role="status"]').textContent, /Ungültiges JSON/);

const editedStored = [structuredClone(quiz)];
const edited = new Element('main');
mountStudio(edited, {list: () => editedStored.slice(), save: activity => { editedStored[0] = structuredClone(activity); }, remove: () => {}}, () => {});
edited.querySelectorAll('button').find(button => button.textContent === 'Bearbeiten').click();
const title = edited.querySelectorAll('input')[0];
title.value = 'Geändert';
title.dispatch('input');
edited.querySelectorAll('button').find(button => button.textContent === 'Lokal speichern').click();
assert.equal(editedStored.length, 1, 'normal editing does not create a second draft');
assert.equal(editedStored[0].id, quiz.id);
assert.equal(editedStored[0].title, 'Geändert');
console.log('EduPlay studio UI checks passed');
