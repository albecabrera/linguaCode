import {createProgressStore} from '../mission/progress.mjs';
import {createThemeController} from '../mission/theme.mjs';
import {createPresentationController} from '../presentation.mjs';
import {COURSE_CATALOG, createSequenceGuidance, readCatalogProgress} from '../catalog.mjs';
import {LESSONS} from '../mission/lesson-data.mjs';
import {CHECKPOINTS, createCheckpointController} from '../checkpoints.mjs';

function storage() { try { return globalThis.localStorage; } catch { return null; } }

export function portfolioRows(progress) {
  return progress.map((card) => ({
    missionId: card.id,
    missionNumber: card.mission,
    status: card.status,
    phase: Number.isInteger(card.phase) ? card.phase : null,
    completion: card.status === 'completed' ? 'abgeschlossen' : card.status === 'in-progress' ? 'begonnen' : card.status === 'unavailable' ? 'nicht verfügbar' : 'nicht begonnen',
  }));
}

export function portfolioData(progress, checkpoints) {
  return {
    schema: PORTFOLIO_SCHEMA,
    localOnly: true,
    missions: portfolioRows(progress),
    checkpoints: checkpoints.map(({id, number, afterMission, status}) => ({id, number, afterMission, status})),
  };
}

const PORTFOLIO_SCHEMA = 'linguacode-ki-portfolio-v1';
const VALID_STATUSES = new Set(['not-started', 'in-progress', 'completed', 'unavailable']);
const COMPLETIONS = Object.freeze({'not-started': 'nicht begonnen', 'in-progress': 'begonnen', completed: 'abgeschlossen', unavailable: 'nicht verfügbar'});

function checkpointStatusForImport(checkpoint, missions) {
  const relevant = checkpoint.missionIds.map((id) => missions.find((mission) => mission.missionId === id));
  return relevant.every((mission) => mission?.status === 'completed') ? 'completed' : relevant.some((mission) => mission?.status === 'in-progress') ? 'in-progress' : 'open';
}

export function validatePortfolioImport(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.schema !== PORTFOLIO_SCHEMA || value.localOnly !== true) return {valid: false, reason: 'unsupported-schema'};
  if (!Array.isArray(value.missions) || value.missions.length !== COURSE_CATALOG.length || !Array.isArray(value.checkpoints) || value.checkpoints.length !== CHECKPOINTS.length) return {valid: false, reason: 'invalid-shape'};
  const ids = new Set(COURSE_CATALOG.map(({id}) => id));
  const seen = new Set();
  for (const mission of value.missions) {
    const lesson = LESSONS[mission?.missionId];
    const phaseValid = mission?.phase === null || (Number.isInteger(mission?.phase) && lesson?.phases?.some((_, index) => index === mission.phase));
    const activeStatusHasPhase = ['in-progress', 'completed'].includes(mission?.status) && !Number.isInteger(mission?.phase);
    if (!mission || typeof mission !== 'object' || !ids.has(mission.missionId) || seen.has(mission.missionId) || mission.missionNumber !== COURSE_CATALOG.find(({id}) => id === mission.missionId)?.mission || !VALID_STATUSES.has(mission.status) || !phaseValid || activeStatusHasPhase || mission.completion !== COMPLETIONS[mission.status]) return {valid: false, reason: 'invalid-mission'};
    seen.add(mission.missionId);
  }
  if (seen.size !== ids.size) return {valid: false, reason: 'invalid-mission'};
  for (const [index, checkpoint] of CHECKPOINTS.entries()) {
    const imported = value.checkpoints[index];
    if (!imported || imported.id !== checkpoint.id || imported.number !== checkpoint.number || imported.afterMission !== checkpoint.afterMission || imported.status !== checkpointStatusForImport(checkpoint, value.missions)) return {valid: false, reason: 'invalid-checkpoint'};
  }
  return {valid: true, missions: value.missions, checkpoints: value.checkpoints};
}

function mergedState(current, imported) {
  const next = {...(current ?? {})};
  if (Number.isInteger(imported.phase)) next.phase = Math.max(Number.isInteger(next.phase) ? next.phase : 0, imported.phase);
  if (imported.status === 'completed') next.completed = true;
  else next.completed = next.completed === true;
  return next;
}

export function importPortfolioProgress(storage, value) {
  const validation = validatePortfolioImport(value);
  if (!validation.valid) return {status: 'rejected', reason: validation.reason, imported: 0};
  if (!storage?.getItem || !storage?.setItem) return {status: 'unavailable', reason: 'storage-error', imported: 0};
  let imported = 0;
  for (const mission of validation.missions) {
    if (mission.status !== 'in-progress' && mission.status !== 'completed') continue;
    const store = createProgressStore(storage, mission.missionId);
    const loaded = store.load();
    if (loaded.status !== 'success') continue;
    if (loaded.state?.completed === true && mission.status !== 'completed') continue;
    const next = mergedState(loaded.state, mission);
    if (JSON.stringify(next) === JSON.stringify(loaded.state)) continue;
    if (store.save(next).status === 'success') imported += 1;
  }
  return {status: 'success', imported};
}

export function portfolioMarkdown(data) {
  const lines = ['# Lokales Lernportfolio', '', 'Nur Fortschrittsmetadaten; keine Bearbeitungsinhalte.', '', '## Missionen', '', '| ID | Nummer | Status | Phase | Abschluss |', '|---|---:|---|---|---|'];
  lines.push(...data.missions.map(({missionId, missionNumber, status, phase, completion}) => `| ${missionId} | ${missionNumber} | ${status} | ${phase ?? '—'} | ${completion} |`));
  lines.push('', '## Checkpoints', '', '| ID | Nummer | Nach Mission | Status |', '|---|---:|---:|---|');
  lines.push(...data.checkpoints.map(({id, number, afterMission, status}) => `| ${id} | ${number} | ${afterMission} | ${status} |`));
  return lines.join('\n');
}

function download(content, filename, type, windowLike = globalThis) {
  if (!windowLike?.URL?.createObjectURL || !windowLike.document?.createElement) return false;
  const url = windowLike.URL.createObjectURL(new Blob([content], {type}));
  const link = windowLike.document.createElement('a'); link.href = url; link.download = filename; link.click();
  windowLike.URL.revokeObjectURL?.(url); return true;
}

export function createPortfolioView({documentLike = globalThis.document, storageLike = storage(), windowLike = globalThis} = {}) {
  const progress = readCatalogProgress(storageLike, COURSE_CATALOG);
  const checkpoints = createCheckpointController({storage: storageLike, cards: progress}).checkpoints;
  const data = portfolioData(progress, checkpoints);
  const sequence = createSequenceGuidance(progress, checkpoints);
  const table = documentLike?.querySelector('[data-portfolio-table]');
  if (table) table.innerHTML = `<table><caption>Lokale Missionsmetadaten</caption><thead><tr><th scope="col">ID</th><th scope="col">Nummer</th><th scope="col">Status</th><th scope="col">Phase</th><th scope="col">Abschluss</th></tr></thead><tbody>${data.missions.map((row) => `<tr><th scope="row">${row.missionId}</th><td>${row.missionNumber}</td><td>${row.status}</td><td>${row.phase ?? '—'}</td><td>${row.completion}</td></tr>`).join('')}</tbody></table>`;
  const checkpointNode = documentLike?.querySelector('[data-checkpoint-status]');
  if (checkpointNode) checkpointNode.innerHTML = `<ul>${data.checkpoints.map(({number, status}) => `<li>Checkpoint ${number}: <strong>${status}</strong></li>`).join('')}</ul>`;
  const guidance = documentLike?.querySelector('[data-sequence-guidance]');
  if (guidance) guidance.innerHTML = sequence.recommendedNext ? `<p><strong>Empfehlung:</strong> Mission ${String(sequence.recommendedNext.mission).padStart(2, '0')}.</p><p>${sequence.relation} ${sequence.transition}</p>` : '<p>Keine Mission verfügbar.</p>';
  documentLike?.querySelector('[data-export-json]')?.addEventListener('click', () => download(JSON.stringify(data, null, 2), 'ki-lernportfolio.json', 'application/json', windowLike));
  documentLike?.querySelector('[data-export-markdown]')?.addEventListener('click', () => download(portfolioMarkdown(data), 'ki-lernportfolio.md', 'text/markdown;charset=utf-8', windowLike));
  const importInput = documentLike?.querySelector('[data-import-portfolio]');
  const importResult = documentLike?.querySelector('[data-import-result]');
  importInput?.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    if (!file) return;
    try {
      const result = importPortfolioProgress(storageLike, JSON.parse(await file.text()));
      if (importResult) importResult.textContent = result.status === 'success' ? `${result.imported} gültige Missionen zusammengeführt.` : 'Import abgelehnt; lokale Daten blieben unverändert.';
    } catch {
      if (importResult) importResult.textContent = 'Import abgelehnt; lokale Daten blieben unverändert.';
    }
  });
  return {progress, checkpoints, data, sequence};
}

createThemeController({storage: storage()});
createPresentationController({storage: storage()}).bind();
if (typeof document !== 'undefined') createPortfolioView();
