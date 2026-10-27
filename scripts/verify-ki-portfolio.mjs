import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSE_CATALOG, createSequenceGuidance} from '../pages/ki8/catalog.mjs';
import {CHECKPOINTS} from '../pages/ki8/checkpoints.mjs';
import {importPortfolioProgress, portfolioData, portfolioMarkdown, portfolioRows, validatePortfolioImport} from '../pages/ki8/portfolio/portfolio.mjs';

const html = fs.readFileSync(new URL('../pages/ki8/portfolio/index.html', import.meta.url), 'utf8');
const script = fs.readFileSync(new URL('../pages/ki8/portfolio/portfolio.mjs', import.meta.url), 'utf8');
assert.match(html, /JSON exportieren/);
assert.match(html, /Markdown exportieren/);
assert.match(html, /data-export-json/);
assert.match(html, /data-export-markdown/);
assert.match(html, /Portfolio importieren/);
assert.match(html, /data-import-portfolio/);
assert.match(html, /Smartboard-Modus/);
assert.doesNotMatch(script, /fetch|XMLHttpRequest|sendBeacon/);
assert.doesNotMatch(`${html}\n${script}`, /objective|answer|task|question|prompt|learnerName|studentName/i);

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
}

const progress = COURSE_CATALOG.map((card, index) => ({...card, phase: index === 0 || index === 1 ? 1 : null, status: index === 0 ? 'completed' : index === 1 ? 'in-progress' : 'not-started'}));
const checkpoints = CHECKPOINTS.map(({id, number, afterMission}) => ({id, number, afterMission, status: 'open'}));
const rows = portfolioRows(progress);
assert.equal(rows.length, 19);
assert.deepEqual(Object.keys(rows[0]), ['missionId', 'missionNumber', 'status', 'phase', 'completion']);
const data = portfolioData(progress, checkpoints);
assert.equal(validatePortfolioImport(data).valid, true);
assert.equal(validatePortfolioImport({...data, schema: 'unsupported'}).valid, false);
const importStorage = new MemoryStorage();
importStorage.setItem('linguacode:ki-wp8:mission-01:v1:ki-01', JSON.stringify({version: 1, state: {phase: 4, completed: true}}));
const beforeRejected = importStorage.getItem('linguacode:ki-wp8:mission-01:v1:ki-01');
const rejected = importPortfolioProgress(importStorage, {...data, missions: data.missions.map((mission) => mission.missionId === 'ki-01' ? {...mission, status: 'invalid'} : mission)});
assert.equal(rejected.status, 'rejected');
assert.equal(importStorage.getItem('linguacode:ki-wp8:mission-01:v1:ki-01'), beforeRejected);
for (const invalidMission of [
  {...data.missions[0], missionNumber: 19},
  {...data.missions[0], phase: 99},
  {...data.missions[0], status: 'in-progress', phase: null, completion: 'begonnen'},
]) {
  const invalid = importPortfolioProgress(importStorage, {...data, missions: data.missions.map((mission) => mission.missionId === 'ki-01' ? invalidMission : mission)});
  assert.equal(invalid.status, 'rejected');
  assert.equal(importStorage.getItem('linguacode:ki-wp8:mission-01:v1:ki-01'), beforeRejected);
}
const accepted = importPortfolioProgress(importStorage, data);
assert.equal(accepted.status, 'success');
assert.deepEqual(JSON.parse(importStorage.getItem('linguacode:ki-wp8:mission-01:v1:ki-01')).state, {phase: 4, completed: true});
assert.deepEqual(Object.keys(data.checkpoints[0]), ['id', 'number', 'afterMission', 'status']);
assert.match(JSON.stringify(data), /missionId/);
assert.match(portfolioMarkdown(data), /\| ID \| Nummer \| Status/);
assert.doesNotMatch(JSON.stringify(data), /objectives|answers|content|learner|prompt/i);
assert.match(html, /Nur auf diesem Gerät/);
const guidance = createSequenceGuidance(progress, checkpoints);
assert.equal(guidance.recommendedNext.id, 'ki-02');
assert.match(guidance.relation, /Mission 01/);
assert.match(guidance.transition, /Checkpoint 1/);

console.log('PASS: local progress-only JSON/Markdown portfolio, privacy boundary, and sequence guidance.');
