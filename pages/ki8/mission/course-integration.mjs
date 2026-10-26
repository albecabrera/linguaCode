import {createProgressStore} from './progress.mjs';

export const PROGRESS_KEY = 'ki-01';

export function derivePublicCourseUrl(locationLike = globalThis.location) {
  const current = new URL(locationLike?.href ?? './', 'https://invalid.example/');
  const path = current.pathname.endsWith('/') ? current.pathname : current.pathname.replace(/[^/]*$/, '');
  return new URL(path || '/', current.origin).href;
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

export function renderQrSvg(url, qrFactory = globalThis.qrcode) {
  if (typeof qrFactory !== 'function') return '';
  try {
    const code = qrFactory(0, 'M');
    code.addData(url, 'Byte');
    code.make();
    return code.createSvgTag({cellSize: 4, margin: 4, alt: 'QR-Code für die öffentliche Kursseite'});
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
  const qr = documentLike.querySelector('#course-qr');
  const progressOutput = documentLike.querySelector('#course-progress');
  if (urlInput) {
    urlInput.value = url;
    urlInput.setAttribute('aria-label', 'Öffentliche URL des Kurses');
  }
  if (qr) {
    const svg = renderQrSvg(url, qrFactory);
    qr.innerHTML = svg || '<p>QR-Code konnte in diesem Browser nicht dargestellt werden. Nutze den kopierbaren Link.</p>';
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
