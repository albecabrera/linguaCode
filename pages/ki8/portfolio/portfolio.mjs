import {createThemeController} from '../mission/theme.mjs';
import {createPresentationController} from '../presentation.mjs';
import {COURSE_CATALOG, createSequenceGuidance, readCatalogProgress} from '../catalog.mjs';
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
    schema: 'linguacode-ki-portfolio-v1',
    localOnly: true,
    missions: portfolioRows(progress),
    checkpoints: checkpoints.map(({id, number, afterMission, status}) => ({id, number, afterMission, status})),
  };
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
  return {progress, checkpoints, data, sequence};
}

createThemeController({storage: storage()});
createPresentationController({storage: storage()}).bind();
if (typeof document !== 'undefined') createPortfolioView();
