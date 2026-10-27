import { createProgressStore, PROGRESS_NAMESPACE } from '../mission/progress.mjs';
import { COURSE_CATALOG } from '../catalog.mjs';
import { CHECKPOINTS } from '../checkpoints.mjs';

export const MISSION_KEYS = Object.freeze(Array.from({ length: 19 }, (_, index) => `ki-${String(index + 1).padStart(2, '0')}`));
export const TEACHER_EVALUATION_KEY = 'linguacode:ki-wp8:teacher-evaluation:v1';
const EVALUATION_VERSION = 1;
export const RUBRIC_CRITERIA = Object.freeze(['Fortschritt sichtbar', 'Checkpoint-Bereitschaft', 'Nächster Schritt geklärt']);

const columns = Object.freeze([
  ['mission', 'Mission'],
  ['status', 'Status'],
  ['phase', 'Phase'],
  ['completed', 'Completed'],
]);

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function readTeacherProgress(storage = browserStorage()) {
  return MISSION_KEYS.map((mission) => {
    const loaded = createProgressStore(storage, mission).load();
    if (loaded.status !== 'success') return { mission, status: loaded.reason, phase: '', completed: '' };
    if (loaded.state === null) return { mission, status: 'not-started', phase: '', completed: false };
    return {
      mission,
      status: 'available',
      phase: Number.isInteger(loaded.state.phase) ? loaded.state.phase : '',
      completed: loaded.state.completed === true,
    };
  });
}

function checkpointSummary(progress, checkpoint) {
  const relevant = checkpoint.missionIds.map((mission) => progress.find(({ mission: id }) => id === mission));
  const completed = relevant.filter((entry) => entry?.completed === true).length;
  const inProgress = relevant.filter((entry) => entry?.status === 'available' && entry?.completed !== true).length;
  return {
    id: checkpoint.id,
    number: checkpoint.number,
    completed,
    total: relevant.length,
    status: completed === relevant.length ? 'completed' : inProgress > 0 ? 'in-progress' : 'open',
  };
}

export function buildTeacherSummary(progress) {
  const modules = [];
  for (const [index, card] of COURSE_CATALOG.entries()) {
    let module = modules.find(({ name }) => name === card.module);
    if (!module) {
      module = { name: card.module, completed: 0, inProgress: 0, total: 0 };
      modules.push(module);
    }
    const entry = progress[index];
    module.total += 1;
    if (entry?.completed === true) module.completed += 1;
    else if (entry?.status === 'available') module.inProgress += 1;
  }
  return {
    modules: modules.map((module) => ({ ...module, evidence: `${module.completed}/${module.total} abgeschlossen` })),
    checkpoints: CHECKPOINTS.map((checkpoint) => checkpointSummary(progress, checkpoint)),
  };
}

function evaluationStorageKey() {
  return `${TEACHER_EVALUATION_KEY}`;
}

function normalizeEvaluation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const module of COURSE_CATALOG.map(({ module: name }) => name).filter((name, index, names) => names.indexOf(name) === index)) {
    const entry = value[module];
    if (!entry || typeof entry !== 'object') continue;
    result[module] = {
      criteria: RUBRIC_CRITERIA.map((_, index) => entry.criteria?.[index] === true),
      score: Number.isInteger(entry.score) ? Math.max(0, Math.min(4, entry.score)) : 0,
    };
  }
  return result;
}

export function readTeacherEvaluation(storage = browserStorage()) {
  try {
    const raw = storage?.getItem?.(evaluationStorageKey());
    if (!raw) return {};
    const envelope = JSON.parse(raw);
    return envelope?.version === EVALUATION_VERSION ? normalizeEvaluation(envelope.evaluation) : {};
  } catch {
    return {};
  }
}

export function saveTeacherEvaluation(storage, evaluation) {
  const normalized = normalizeEvaluation(evaluation);
  if (!storage?.setItem) return { status: 'unavailable', reason: 'storage-error' };
  try {
    storage.setItem(evaluationStorageKey(), JSON.stringify({ version: EVALUATION_VERSION, evaluation: normalized }));
    return { status: 'success' };
  } catch {
    return { status: 'unavailable', reason: 'storage-error' };
  }
}

export function buildEvaluationExport(summary, evaluation) {
  return {
    schema: 'linguacode-ki-teacher-evaluation-v1',
    localOnly: true,
    generatedAt: new Date().toISOString(),
    modules: summary.modules.map(({ name, completed, inProgress, total, evidence }) => ({ name, completed, inProgress, total, evidence, rubric: evaluation[name] ?? { criteria: RUBRIC_CRITERIA.map(() => false), score: 0 } })),
    checkpoints: summary.checkpoints.map(({ id, number, completed, total, status }) => ({ id, number, completed, total, status })),
  };
}

export function buildExportData(progress) {
  return {
    schema: 'linguacode-ki-teacher-progress-v1',
    localOnly: true,
    generatedAt: new Date().toISOString(),
    progress: progress.map((entry) => ({ ...entry })),
  };
}

export function buildPartialExportData(progress) {
  return {...buildExportData(progress), scope: 'filtered'};
}

export function filterTeacherProgress(progress, {module = '', checkpoint = ''} = {}) {
  const moduleIds = new Set(COURSE_CATALOG.filter((card) => !module || card.module === module).map(({id}) => id));
  const checkpointIds = checkpoint ? new Set(CHECKPOINTS.find(({id}) => id === checkpoint)?.missionIds ?? []) : null;
  return progress.filter(({mission}) => moduleIds.has(mission) && (!checkpointIds || checkpointIds.has(mission)));
}

export function resetMissionProgress(storage, mission) {
  if (!MISSION_KEYS.includes(mission)) return {status: 'rejected', reason: 'unknown-mission'};
  return createProgressStore(storage, mission).reset();
}

export function resetEvaluation(storage) {
  if (!storage?.removeItem) return {status: 'unavailable', reason: 'storage-error'};
  try { storage.removeItem(TEACHER_EVALUATION_KEY); return {status: 'success'}; } catch { return {status: 'unavailable', reason: 'storage-error'}; }
}

export function resetAllLearnerProgress(storage) {
  const results = MISSION_KEYS.map((mission) => resetMissionProgress(storage, mission));
  return results.every(({status}) => status === 'success') ? {status: 'success', count: results.length} : {status: 'unavailable', reason: 'storage-error'};
}

export function toCsv(progress) {
  return [
    columns.map(([, label]) => label).join(','),
    ...progress.map((entry) => columns.map(([key]) => escapeCsv(entry[key])).join(',')),
  ].join('\n');
}

function download(windowLike, content, filename, type) {
  if (!windowLike?.URL?.createObjectURL || !windowLike.document?.createElement) return;
  const blob = new Blob([content], { type });
  const url = windowLike.URL.createObjectURL(blob);
  const link = windowLike.document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  windowLike.URL.revokeObjectURL?.(url);
}

function renderTable(documentLike, progress) {
  const output = documentLike.querySelector('#progress-table');
  if (!output) return;
  output.innerHTML = `<table><caption>Lokaler Missionsfortschritt</caption><thead><tr>${columns.map(([, label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${progress.map((entry) => `<tr><th scope="row">${escapeHtml(entry.mission)}</th><td>${escapeHtml(entry.status)}</td><td>${escapeHtml(entry.phase)}</td><td>${escapeHtml(entry.completed)}</td></tr>`).join('')}</tbody></table>`;
}

function renderSummary(documentLike, summary) {
  const output = documentLike.querySelector('#summary-table');
  if (output) output.innerHTML = `<h2>Module und Checkpoints</h2><div class="summary-grid">${summary.modules.map(({ name, completed, inProgress, total, evidence }) => `<article><h3>${escapeHtml(name)}</h3><p>${completed} von ${total} abgeschlossen · ${inProgress} in Bearbeitung</p><p class="evidence">${escapeHtml(evidence)}</p></article>`).join('')}</div><table><caption>Checkpoint-Zusammenfassung</caption><thead><tr><th scope="col">Checkpoint</th><th scope="col">Fortschritt</th><th scope="col">Status</th></tr></thead><tbody>${summary.checkpoints.map(({ number, completed, total, status }) => `<tr><th scope="row">Checkpoint ${number}</th><td>${completed} von ${total}</td><td>${escapeHtml(status)}</td></tr>`).join('')}</tbody></table>`;
  const followUp = documentLike.querySelector('#follow-up');
  if (followUp) followUp.innerHTML = `<h2>Follow-up für den Ausdruck</h2><ul>${summary.modules.map(({ name, completed, total }) => `<li><strong>${escapeHtml(name)}:</strong> ${completed < total ? 'Fortschritt gemeinsam prüfen.' : 'Erreichten Fortschritt sichern.'}</li>`).join('')}</ul><p>Nur aggregierte lokale Fortschrittsmetadaten; keine Namen, Antworten oder Aufgabeninhalte.</p>`;
}

function renderEvaluation(documentLike, storage, summary) {
  const output = documentLike.querySelector('#evaluation-form');
  if (!output) return;
  const evaluation = readTeacherEvaluation(storage);
  output.innerHTML = summary.modules.map(({ name }) => {
    const entry = evaluation[name] ?? { criteria: RUBRIC_CRITERIA.map(() => false), score: 0 };
    return `<fieldset><legend>${escapeHtml(name)}</legend>${RUBRIC_CRITERIA.map((criterion, index) => `<label><input type="checkbox" data-module="${escapeHtml(name)}" data-criterion="${index}" ${entry.criteria[index] ? 'checked' : ''}> ${escapeHtml(criterion)}</label>`).join('')}<label>Score (0–4) <input type="number" min="0" max="4" step="1" value="${entry.score}" data-score-module="${escapeHtml(name)}"></label></fieldset>`;
  }).join('');
}

export function createTeacherView({ documentLike = globalThis.document, storage = browserStorage(), windowLike = globalThis } = {}) {
  const progress = readTeacherProgress(storage);
  const summary = buildTeacherSummary(progress);
  renderTable(documentLike, progress);
  renderSummary(documentLike, summary);
  renderEvaluation(documentLike, storage, summary);
  const jsonButton = documentLike?.querySelector('#export-json');
  const csvButton = documentLike?.querySelector('#export-csv');
  const printButton = documentLike?.querySelector('#print-view');
  const evaluationButton = documentLike?.querySelector('#export-evaluation');
  const partialButton = documentLike?.querySelector('#export-partial');
  const partialEvaluationButton = documentLike?.querySelector('#export-partial-evaluation');
  const moduleFilter = documentLike?.querySelector('#module-filter');
  const checkpointFilter = documentLike?.querySelector('#checkpoint-filter');
  const evaluationForm = documentLike?.querySelector('#evaluation-form');
  const resetResult = documentLike?.querySelector('#reset-result');
  const resetMissionSelect = documentLike?.querySelector('#reset-mission');
  const resetMissionButton = documentLike?.querySelector('#reset-mission-button');
  const resetEvaluationButton = documentLike?.querySelector('#reset-evaluation');
  const resetAllButton = documentLike?.querySelector('#reset-all-progress');
  if (resetMissionSelect) resetMissionSelect.innerHTML = MISSION_KEYS.map((mission) => `<option value="${mission}">${mission}</option>`).join('');
  evaluationForm?.addEventListener('change', (event = {}) => {
    const current = readTeacherEvaluation(storage);
    const module = event.target?.dataset?.module ?? event.target?.dataset?.scoreModule;
    if (!module) return;
    const entry = current[module] ?? { criteria: RUBRIC_CRITERIA.map(() => false), score: 0 };
    if (event.target.dataset.module) entry.criteria[Number(event.target.dataset.criterion)] = event.target.checked === true;
    if (event.target.dataset.scoreModule) entry.score = Number(event.target.value);
    current[module] = entry;
    saveTeacherEvaluation(storage, current);
  });
  let filters = {module: '', checkpoint: ''};
  const filteredProgress = () => filterTeacherProgress(progress, filters);
  const applyFilters = () => {
    const visible = filteredProgress();
    renderTable(documentLike, visible);
    renderSummary(documentLike, buildTeacherSummary(visible));
  };
  moduleFilter?.addEventListener('change', () => { filters.module = moduleFilter.value; applyFilters(); });
  checkpointFilter?.addEventListener('change', () => { filters.checkpoint = checkpointFilter.value; applyFilters(); });
  jsonButton?.addEventListener('click', () => download(windowLike, JSON.stringify(buildExportData(progress), null, 2), 'ki-teacher-progress.json', 'application/json'));
  csvButton?.addEventListener('click', () => download(windowLike, toCsv(progress), 'ki-teacher-progress.csv', 'text/csv;charset=utf-8'));
  partialButton?.addEventListener('click', () => download(windowLike, JSON.stringify(buildPartialExportData(filteredProgress()), null, 2), 'ki-teacher-progress-teil.json', 'application/json'));
  partialEvaluationButton?.addEventListener('click', () => download(windowLike, JSON.stringify(buildEvaluationExport(buildTeacherSummary(filteredProgress()), readTeacherEvaluation(storage)), null, 2), 'ki-teacher-evaluation-teil.json', 'application/json'));
  evaluationButton?.addEventListener('click', () => download(windowLike, JSON.stringify(buildEvaluationExport(summary, readTeacherEvaluation(storage)), null, 2), 'ki-teacher-evaluation.json', 'application/json'));
  const confirmAction = (message, action, successMessage) => { if (!windowLike.confirm?.(message)) return; const result = action(); if (resetResult) resetResult.textContent = result.status === 'success' ? successMessage : 'Zurücksetzen nicht möglich.'; };
  resetMissionButton?.addEventListener('click', () => confirmAction('Mission wirklich zurücksetzen?', () => resetMissionProgress(storage, resetMissionSelect?.value), 'Mission zurückgesetzt.'));
  resetEvaluationButton?.addEventListener('click', () => confirmAction('Bewertungsrubrik wirklich zurücksetzen?', () => resetEvaluation(storage), 'Bewertung zurückgesetzt.'));
  resetAllButton?.addEventListener('click', () => confirmAction('Alle Lernfortschritte wirklich zurücksetzen?', () => resetAllLearnerProgress(storage), 'Alle Lernfortschritte zurückgesetzt.'));
  printButton?.addEventListener('click', () => windowLike.print?.());
  return { progress, summary, evaluation: readTeacherEvaluation(storage), filter: () => filterTeacherProgress(progress, filters) };
}

if (typeof document !== 'undefined') createTeacherView();

export { PROGRESS_NAMESPACE };
