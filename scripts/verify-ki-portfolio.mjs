import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSE_CATALOG, createSequenceGuidance} from '../pages/ki8/catalog.mjs';
import {portfolioData, portfolioMarkdown, portfolioRows} from '../pages/ki8/portfolio/portfolio.mjs';

const html = fs.readFileSync(new URL('../pages/ki8/portfolio/index.html', import.meta.url), 'utf8');
const script = fs.readFileSync(new URL('../pages/ki8/portfolio/portfolio.mjs', import.meta.url), 'utf8');
assert.match(html, /JSON exportieren/);
assert.match(html, /Markdown exportieren/);
assert.match(html, /data-export-json/);
assert.match(html, /data-export-markdown/);
assert.match(html, /Smartboard-Modus/);
assert.doesNotMatch(script, /fetch|XMLHttpRequest|sendBeacon/);
assert.doesNotMatch(`${html}\n${script}`, /objective|answer|task|question|prompt|learnerName|studentName/i);

const progress = COURSE_CATALOG.map((card, index) => ({...card, status: index === 0 ? 'completed' : index === 1 ? 'in-progress' : 'not-started'}));
const checkpoints = [{id: 'checkpoint-1', number: 1, afterMission: 6, status: 'open'}];
const rows = portfolioRows(progress);
assert.equal(rows.length, 19);
assert.deepEqual(Object.keys(rows[0]), ['missionId', 'missionNumber', 'status', 'phase', 'completion']);
const data = portfolioData(progress, checkpoints);
assert.deepEqual(Object.keys(data.checkpoints[0]), ['id', 'number', 'afterMission', 'status']);
assert.match(JSON.stringify(data), /missionId/);
assert.match(portfolioMarkdown(data), /\| ID \| Nummer \| Status/);
assert.doesNotMatch(JSON.stringify(data), /objectives|answers|content|learner|prompt/i);
const guidance = createSequenceGuidance(progress, checkpoints);
assert.equal(guidance.recommendedNext.id, 'ki-02');
assert.match(guidance.relation, /Mission 01/);
assert.match(guidance.transition, /Checkpoint 1/);

console.log('PASS: local progress-only JSON/Markdown portfolio, privacy boundary, and sequence guidance.');
