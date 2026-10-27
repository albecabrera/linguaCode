import {createProgressStore} from './progress.mjs';

export const PROGRESS_KEY = 'ki-01';

export const PUBLIC_COURSE_URL = 'https://albecabrera.github.io/linguaCode/ki8/';

export function derivePublicCourseUrl() {
  return PUBLIC_COURSE_URL;
}

export function getCourseProgress(store) {
  let result;
  try {
    result = store?.load?.();
  } catch {
    return {available: false, reason: 'storage-error'};
  }
  if (!result || result.status !== 'success') return {available: false, reason: result?.reason ?? 'storage-error'};
  const state = result.state;
  return {
    available: true,
    completed: Boolean(state?.completed || state?.quizSubmitted),
    phase: typeof state?.phase === 'string' || Number.isFinite(state?.phase) ? state.phase : null,
  };
}

export function renderQrSvg(url, qrFactory = globalThis.qrcode, alt = 'QR-Code für die öffentliche Kursseite') {
  if (typeof qrFactory !== 'function') return '';
  try {
    const code = qrFactory(0, 'M');
    code.addData(url, 'Byte');
    code.make();
    return code.createSvgTag({cellSize: 4, margin: 4, alt});
  } catch {
    return '';
  }
}

function readLocalStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function progressLabel(progress) {
  if (!progress.available) return 'Lokaler Fortschritt ist in diesem Browser nicht verfügbar.';
  if (progress.completed) return 'Mission 01 abgeschlossen – Fortschritt bleibt lokal auf diesem Gerät.';
  if (progress.phase !== null) return `Mission 01 begonnen (Phase ${progress.phase}) – Fortschritt bleibt lokal auf diesem Gerät.`;
  return 'Mission 01 noch nicht begonnen – Fortschritt bleibt lokal auf diesem Gerät.';
}

export function initCourseIntegration({documentLike = document, locationLike = globalThis.location, qrFactory = globalThis.qrcode} = {}) {
  const url = derivePublicCourseUrl(locationLike);
  const urlInput = documentLike.querySelector('#course-url');
  const coursePageLink = documentLike.querySelector('#course-page-link');
  const qr = documentLike.querySelector('#course-qr');
  const missionQrs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mission) => {
    const number = String(mission).padStart(2, '0');
    return {
      number,
      node: documentLike.querySelector(`#mission-${number}-qr`),
      url: new URL(`stunde-${mission}/`, url).href,
    };
  });
  const progressOutput = documentLike.querySelector('#course-progress');
  if (urlInput) {
    urlInput.value = url;
    urlInput.setAttribute('aria-label', 'Öffentliche URL des Kurses');
  }
  if (coursePageLink) {
    coursePageLink.setAttribute('href', url);
    coursePageLink.textContent = url;
    coursePageLink.setAttribute('aria-label', 'GitHub-Pages-Link zur Missionen-Übersicht');
  }
  if (qr) {
    qr.setAttribute('href', url);
    qr.setAttribute('aria-label', 'Kursübersicht öffnen (QR-Code)');
    const svg = renderQrSvg(url, qrFactory);
    qr.innerHTML = svg || '<p>QR-Code konnte in diesem Browser nicht dargestellt werden. Nutze den Kurslink.</p>';
  }
  for (const {number, node, url: missionUrl} of missionQrs) {
    if (!node) continue;
    node.setAttribute('href', missionUrl);
    node.setAttribute('aria-label', `Mission ${number} direkt öffnen (QR-Code)`);
    const svg = renderQrSvg(missionUrl, qrFactory, `QR-Code für Mission ${number}`);
    node.innerHTML = svg || `<p>QR-Code für Mission ${number} konnte in diesem Browser nicht dargestellt werden. Nutze den Missionslink.</p>`;
  }

  let store;
  try { store = createProgressStore(readLocalStorage(), PROGRESS_KEY); } catch { store = null; }
  const progress = getCourseProgress(store);
  if (progressOutput) progressOutput.textContent = progressLabel(progress);

  const copyButton = documentLike.querySelector('#copy-course-url');
  const copyStatus = documentLike.querySelector('#copy-course-status');
  copyButton?.addEventListener('click', async () => {
    try {
      if (!globalThis.navigator?.clipboard?.writeText) throw new Error('clipboard-unavailable');
      await globalThis.navigator.clipboard.writeText(url);
      if (copyStatus) copyStatus.textContent = 'Kurslink kopiert.';
    } catch {
      if (urlInput) {
        urlInput.focus();
        urlInput.select();
      }
      if (copyStatus) copyStatus.textContent = 'Automatisches Kopieren ist nicht verfügbar. Der Link ist markiert und kann kopiert werden.';
    }
  });
  return {url, progress};
}
