import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createTeacherView, readTeacherProgress, toCsv, MISSION_KEYS } from '../pages/ki8/teacher/teacher.mjs';

assert.equal(MISSION_KEYS.length, 19);
assert.equal(MISSION_KEYS[0], 'ki-01');
assert.equal(MISSION_KEYS.at(-1), 'ki-19');
const teacherHtml = fs.readFileSync(new URL('../pages/ki8/teacher/index.html', import.meta.url), 'utf8');
assert.match(teacherHtml, /Privat und nur lokal/);
assert.match(teacherHtml, /JSON exportieren/);

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
}

const storage = new MemoryStorage();
storage.setItem('linguacode:ki-wp8:mission-01:v1:ki-01', JSON.stringify({ version: 1, state: { phase: 2, completed: false } }));
storage.setItem('linguacode:ki-wp8:mission-01:v1:ki-02', JSON.stringify({ version: 1, state: { phase: 4, completed: true } }));
storage.setItem('unrelated', JSON.stringify({ studentName: 'Do not expose' }));

const progress = readTeacherProgress(storage);
assert.equal(progress.length, 19);
assert.deepEqual(progress[0], { mission: 'ki-01', status: 'available', phase: 2, completed: false });
assert.deepEqual(progress[1], { mission: 'ki-02', status: 'available', phase: 4, completed: true });
assert.equal(progress[2].status, 'not-started');
assert.ok(!JSON.stringify(progress).includes('Do not expose'));

const csv = toCsv(progress);
assert.match(csv, /^Mission,Status,Phase,Completed/m);
assert.match(csv, /ki-01,available,2,false/);
assert.ok(!csv.includes('studentName'));

const events = [];
const documentLike = {
  querySelector(selector) {
    return {
      textContent: '',
      addEventListener(type, handler) { events.push({ selector, type, handler }); },
      click() { events.push({ selector, type: 'click' }); },
    };
  },
};
const downloads = [];
const windowLike = {
  print() { events.push({ type: 'print' }); },
  URL: {
    createObjectURL(blob) { downloads.push({ blob }); return `blob:${downloads.length}`; },
    revokeObjectURL() {},
  },
  document: {
    createElement() {
      return { click() { downloads.at(-1).clicked = true; } };
    },
  },
};
createTeacherView({ documentLike, storage, windowLike });
assert.deepEqual(events.map(({ selector, type }) => [selector, type]), [
  ['#export-json', 'click'],
  ['#export-csv', 'click'],
  ['#print-view', 'click'],
]);
assert.ok(events.every(({ handler }) => !handler || typeof handler === 'function'));
for (const event of events.filter((entry) => entry.handler)) event.handler();
assert.equal(downloads.length, 2);
assert.ok(downloads.every(({ clicked }) => clicked === true));
assert.deepEqual(events.at(-1), { type: 'print' });

console.log('PASS: local versioned progress read, privacy-safe JSON/CSV data, and explicit export/print controls.');
