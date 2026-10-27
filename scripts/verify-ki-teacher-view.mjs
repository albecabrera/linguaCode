import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  createTeacherView,
  readTeacherProgress,
  toCsv,
  MISSION_KEYS,
  buildTeacherSummary,
  buildEvaluationExport,
  buildPartialExportData,
  filterTeacherProgress,
  resetMissionProgress,
  resetEvaluation,
  resetAllLearnerProgress,
  readTeacherEvaluation,
  saveTeacherEvaluation,
  TEACHER_EVALUATION_KEY,
  RUBRIC_CONFIG_KEY,
  RUBRIC_CRITERIA,
  readRubricConfig,
  saveRubricConfig,
  buildRubricConfigExport,
  importRubricConfig,
} from '../pages/ki8/teacher/teacher.mjs';

assert.equal(MISSION_KEYS.length, 19);
assert.equal(MISSION_KEYS[0], 'ki-01');
assert.equal(MISSION_KEYS.at(-1), 'ki-19');
const teacherHtml = fs.readFileSync(new URL('../pages/ki8/teacher/index.html', import.meta.url), 'utf8');
assert.match(teacherHtml, /Privat und nur lokal/);
assert.match(teacherHtml, /JSON exportieren/);
assert.match(teacherHtml, /evaluation-mode/);
assert.match(teacherHtml, /Bewertung exportieren/);
assert.match(teacherHtml, /Rubrik exportieren/);
assert.match(teacherHtml, /Rubrik importieren/);
assert.match(teacherHtml, /rubric-config-form/);
assert.match(teacherHtml, /Modulfilter/);
assert.match(teacherHtml, /Checkpointfilter/);
assert.match(teacherHtml, /Teilfortschritt exportieren/);
assert.match(teacherHtml, /Mission zurücksetzen/);
assert.equal(TEACHER_EVALUATION_KEY, 'linguacode:ki-wp8:teacher-evaluation:v1');
assert.equal(RUBRIC_CONFIG_KEY, 'linguacode:ki-wp8:teacher-rubric:v1');
assert.deepEqual(RUBRIC_CRITERIA, ['Fortschritt sichtbar', 'Checkpoint-Bereitschaft', 'Nächster Schritt geklärt']);

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
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

const summary = buildTeacherSummary(progress);
assert.equal(summary.modules.length, 6);
assert.equal(filterTeacherProgress(progress, {module: 'Grundlagen'}).length, 3);
assert.equal(filterTeacherProgress(progress, {checkpoint: 'checkpoint-1'}).length, 3);
assert.equal(buildPartialExportData(filterTeacherProgress(progress, {module: 'Grundlagen'})).progress.length, 3);
assert.equal(summary.checkpoints.length, 3);
assert.deepEqual(summary.modules[0], { name: 'Grundlagen', completed: 1, inProgress: 1, total: 3, evidence: '1/3 abgeschlossen' });
assert.deepEqual(summary.checkpoints[0], { id: 'checkpoint-1', number: 1, completed: 0, total: 3, status: 'in-progress' });

assert.deepEqual(readRubricConfig(storage).criteria, RUBRIC_CRITERIA);
assert.equal(saveRubricConfig(storage, ['Beobachtung', 'Prüfung', 'Nächster Schritt']).status, 'success');
assert.deepEqual(readRubricConfig(storage).criteria, ['Beobachtung', 'Prüfung', 'Nächster Schritt']);
const rubricExport = buildRubricConfigExport(readRubricConfig(storage));
assert.deepEqual(Object.keys(rubricExport).sort(), ['criteria', 'localOnly', 'schema', 'version']);
assert.equal(rubricExport.schema, 'linguacode-ki-teacher-rubric-v1');
assert.equal(importRubricConfig(storage, JSON.stringify(rubricExport)).status, 'success');
const beforeInvalidRubric = storage.getItem(RUBRIC_CONFIG_KEY);
assert.equal(importRubricConfig(storage, { schema: 'linguacode-ki-teacher-rubric-v1', version: 1, localOnly: true, criteria: ['ok'] }).status, 'rejected');
assert.equal(storage.getItem(RUBRIC_CONFIG_KEY), beforeInvalidRubric);
assert.doesNotMatch(JSON.stringify(rubricExport), /name|answer|task|content/i);

const savedEvaluation = saveTeacherEvaluation(storage, { 'Grundlagen': { criteria: [true, false], score: 3 } });
assert.equal(savedEvaluation.status, 'success');
assert.deepEqual(readTeacherEvaluation(storage), { 'Grundlagen': { criteria: [true, false, false], score: 3 } });
const evaluationExport = buildEvaluationExport(summary, readTeacherEvaluation(storage));
assert.equal(evaluationExport.schema, 'linguacode-ki-teacher-evaluation-v1');
assert.equal(evaluationExport.localOnly, true);
assert.ok(!JSON.stringify(evaluationExport).includes('studentName'));

storage.setItem(TEACHER_EVALUATION_KEY, JSON.stringify({version: 1, evaluation: {'Grundlagen': {criteria: [true, false, false], score: 3}}}));
assert.equal(resetMissionProgress(storage, 'ki-01').status, 'success');
assert.equal(storage.getItem('linguacode:ki-wp8:mission-01:v1:ki-01'), null);
assert.notEqual(storage.getItem(TEACHER_EVALUATION_KEY), null);
storage.setItem('linguacode:ki-wp8:mission-01:v1:ki-03', JSON.stringify({version: 1, state: {phase: 1, completed: false}}));
assert.equal(resetEvaluation(storage).status, 'success');
assert.equal(storage.getItem(TEACHER_EVALUATION_KEY), null);
assert.notEqual(storage.getItem('linguacode:ki-wp8:mission-01:v1:ki-03'), null);
storage.setItem('linguacode:ki-wp8:mission-01:v1:ki-02', JSON.stringify({version: 1, state: {phase: 4, completed: true}}));
assert.equal(resetAllLearnerProgress(storage).status, 'success');
assert.equal(storage.getItem('linguacode:ki-wp8:mission-01:v1:ki-02'), null);

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
  ['#save-rubric', 'click'],
  ['#export-rubric-json', 'click'],
  ['#import-rubric-json', 'change'],
  ['#reset-rubric', 'click'],
  ['#evaluation-form', 'change'],
  ['#module-filter', 'change'],
  ['#checkpoint-filter', 'change'],
  ['#export-json', 'click'],
  ['#export-csv', 'click'],
  ['#export-partial', 'click'],
  ['#export-partial-evaluation', 'click'],
  ['#export-evaluation', 'click'],
  ['#reset-mission-button', 'click'],
  ['#reset-evaluation', 'click'],
  ['#reset-all-progress', 'click'],
  ['#print-view', 'click'],
]);
assert.ok(events.every(({ handler }) => !handler || typeof handler === 'function'));
for (const event of events.filter((entry) => entry.handler)) event.handler();
assert.equal(downloads.length, 6);
assert.ok(downloads.every(({ clicked }) => clicked === true));
assert.deepEqual(events.at(-1), { type: 'print' });

console.log('PASS: local versioned progress read, privacy-safe JSON/CSV data, and explicit export/print controls.');
