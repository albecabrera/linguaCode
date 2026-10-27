import {createCatalogController, createDashboardModel} from './catalog.mjs';
import {createCheckpointController, renderCheckpoints} from './checkpoints.mjs';
import {initCourseIntegration} from './mission/course-integration.mjs';
import {createThemeController} from './mission/theme.mjs';
import {createPresentationController} from './presentation.mjs';

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

function registerOfflineShell() {
  const status = document.querySelector('#offline-status');
  if (!('serviceWorker' in navigator)) {
    if (status) status.textContent = 'Offline-Bereitschaft ist in diesem Browser nicht verfügbar.';
    return;
  }
  navigator.serviceWorker.register('./sw.js', {scope: './'}).then(() => {
    if (status) status.textContent = 'Offline-Bereitschaft aktiv. Dieser Kurs kann als App installiert werden.';
  }).catch(() => {
    if (status) status.textContent = 'Offline-Bereitschaft ist derzeit nicht verfügbar.';
  });
}

registerOfflineShell();
createThemeController();
createPresentationController({storage: browserStorage()}).bind();
initCourseIntegration();
const storage = browserStorage();
const catalog = createCatalogController({storage});
const checkpointController = createCheckpointController({storage, cards: catalog.progress});
renderCheckpoints({storage, cards: catalog.progress});
const dashboard = createDashboardModel(catalog.progress, checkpointController.checkpoints);
const dashboardSummary = document.querySelector('[data-dashboard-summary]');
if (dashboardSummary) dashboardSummary.innerHTML = `<p><strong>Missionen:</strong> ${dashboard.summary.missionsCompleted} von ${dashboard.summary.missionsTotal} abgeschlossen</p><p><strong>Checkpoints:</strong> ${dashboard.summary.checkpointsCompleted} von ${dashboard.summary.checkpointsTotal} abgeschlossen</p>`;
const dashboardModules = document.querySelector('[data-dashboard-modules]');
if (dashboardModules) dashboardModules.innerHTML = dashboard.modules.map(({name, completed, total}) => `<p><strong>${name}</strong><span>${completed} von ${total} Missionen</span></p>`).join('');
const dashboardNext = document.querySelector('[data-dashboard-next]');
if (dashboardNext && dashboard.nextMission) dashboardNext.innerHTML = `<a class="mission-cta" href="${dashboard.nextMission.href}">${dashboard.nextMission.status === 'in-progress' ? 'Kurs fortsetzen' : 'Mission starten'}: Mission ${dashboard.nextMission.mission} →</a><p class="sequence-guidance"><strong>Empfohlener nächster Schritt:</strong> Mission ${String(dashboard.nextMission.mission).padStart(2, '0')}. ${dashboard.sequence.relation} ${dashboard.sequence.transition}</p>`;
const continueLink = document.querySelector('#continue-course');
if (continueLink && catalog.continuation) {
  continueLink.href = catalog.continuation.href;
  continueLink.textContent = catalog.continuation.status === 'in-progress' ? 'Kurs fortsetzen →' : 'Kurs starten →';
  continueLink.setAttribute('aria-label', `${continueLink.textContent.replace(' →', '')}: ${catalog.continuation.mission}. Mission`);
}
