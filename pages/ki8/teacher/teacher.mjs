import { createProgressStore, PROGRESS_NAMESPACE } from '../mission/progress.mjs';

export const MISSION_KEYS = Object.freeze(Array.from({ length: 19 }, (_, index) => `ki-${String(index + 1).padStart(2, '0')}`));

const columns = Object.freeze([
  ['mission', 'Mission'],
  ['status', 'Status'],
  ['phase', 'Phase'],
  ['completed', 'Completed'],
]);

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
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

export function buildExportData(progress) {
  return {
    schema: 'linguacode-ki-teacher-progress-v1',
    localOnly: true,
    generatedAt: new Date().toISOString(),
    progress: progress.map((entry) => ({ ...entry })),
  };
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
  output.innerHTML = `<table><caption>Lokaler Missionsfortschritt</caption><thead><tr>${columns.map(([, label]) => `<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${progress.map((entry) => `<tr><th scope="row">${entry.mission}</th><td>${entry.status}</td><td>${entry.phase}</td><td>${entry.completed}</td></tr>`).join('')}</tbody></table>`;
}

export function createTeacherView({ documentLike = globalThis.document, storage = browserStorage(), windowLike = globalThis } = {}) {
  const progress = readTeacherProgress(storage);
  renderTable(documentLike, progress);
  const jsonButton = documentLike?.querySelector('#export-json');
  const csvButton = documentLike?.querySelector('#export-csv');
  const printButton = documentLike?.querySelector('#print-view');
  jsonButton?.addEventListener('click', () => download(windowLike, JSON.stringify(buildExportData(progress), null, 2), 'ki-teacher-progress.json', 'application/json'));
  csvButton?.addEventListener('click', () => download(windowLike, toCsv(progress), 'ki-teacher-progress.csv', 'text/csv;charset=utf-8'));
  printButton?.addEventListener('click', () => windowLike.print?.());
  return { progress };
}

if (typeof document !== 'undefined') createTeacherView();

export { PROGRESS_NAMESPACE };
