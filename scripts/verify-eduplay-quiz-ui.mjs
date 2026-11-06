import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mountQuiz } from '../pages/eduplay/quiz.mjs';

class ClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  contains(value) { return this.values.has(value); }
}
class Element {
  constructor(tag) { this.tagName = tag.toUpperCase(); this.children = []; this.classList = new ClassList(); this.attributes = {}; this.listeners = {}; this.hidden = false; this.disabled = false; this.checked = false; this.value = ''; }
  set className(value) { this.classList = new ClassList(); value.split(/\\s+/).filter(Boolean).forEach(item => this.classList.add(item)); }
  append(...children) { this.children.push(...children); }
  prepend(...children) { this.children.unshift(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, event = {}) { for (const listener of this.listeners[type] || []) listener(event); }
  get textContent() { return this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
  set textContent(value) { this.children = [String(value)]; }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }
  querySelectorAll(selector) {
    const matches = [];
    const visit = node => {
      if (!(node instanceof Element)) return;
      if (selector === 'form' && node.tagName === 'FORM' || selector === 'button' && node.tagName === 'BUTTON' || selector === 'input' && node.tagName === 'INPUT' || selector === '[aria-live]' && node.attributes['aria-live'] || selector.startsWith('.') && node.classList.contains(selector.slice(1))) matches.push(node);
      node.children.forEach(visit);
    };
    visit(this);
    return matches;
  }
}
const document = { createElement: tag => new Element(tag), createTextNode: text => String(text) };
globalThis.document = document;
const intervals = new Set();
globalThis.setInterval = callback => { const token = { callback }; intervals.add(token); return token; };
globalThis.clearInterval = token => intervals.delete(token);

const activity = {
  settings: { shuffleQuestions: false, timerEnabled: true, timerSeconds: 1 },
  content: { questions: [{ question: '2 + 2?', type: 'single-choice', options: [{ id: 'a', text: '4' }, { id: 'b', text: '5' }], correctOptionIds: ['a'], explanation: 'Eine kurze Erklärung.' }] },
};
const container = new Element('main');
mountQuiz(container, activity);
const form = container.querySelector('form');
const input = form.querySelector('input');
input.checked = true;
form.dispatch('submit', { preventDefault() {} });
const feedback = form.querySelector('[aria-live]');
assert.equal(feedback.attributes.role, 'status');
assert.match(feedback.textContent, /Richtig/);
assert.ok(feedback.classList.contains('quiz-feedback--correct'));
assert.ok(form.querySelector('.quiz-option').querySelector('.quiz-status-mark'));
assert.ok(form.querySelector('.quiz-option').querySelector('.quiz-status-mark').textContent.includes('✓'));
assert.equal(intervals.size, 0, 'answering clears the timer');

const next = feedback.querySelector('button');
next.dispatch('click');
const restart = container.querySelector('button');
restart.dispatch('click');
assert.equal(container.querySelector('form').querySelector('input').disabled, false, 'restart creates a fresh question');
assert.equal(intervals.size, 1, 'restart starts exactly one fresh timer');

const wrongContainer = new Element('main');
mountQuiz(wrongContainer, { settings: { shuffleQuestions: false, timerEnabled: false }, content: { questions: [{ question: '2 + 2?', type: 'single-choice', options: [{ id: 'a', text: '4' }, { id: 'b', text: '5' }], correctOptionIds: ['a'] }] } });
const wrongForm = wrongContainer.querySelector('form');
wrongForm.querySelectorAll('input')[1].checked = true;
wrongForm.dispatch('submit', { preventDefault() {} });
const wrongFeedback = wrongForm.querySelector('[aria-live]');
assert.match(wrongFeedback.textContent, /Leider falsch/);
assert.ok(wrongFeedback.classList.contains('quiz-feedback--incorrect'));
assert.equal(wrongForm.querySelectorAll('.incorrect').length, 1);
assert.equal(wrongForm.querySelectorAll('.correct').length, 1);

const css = await readFile(new URL('../pages/eduplay/style.css', import.meta.url), 'utf8');
assert.match(css, /quiz-feedback-pop/);
assert.match(css, /prefers-reduced-motion:reduce/);
console.log('EduPlay quiz UI checks passed');
