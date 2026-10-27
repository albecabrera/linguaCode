import {createCatalogController} from './catalog.mjs';
import {renderCheckpoints} from './checkpoints.mjs';
import {initCourseIntegration} from './mission/course-integration.mjs';
import {createThemeController} from './mission/theme.mjs';

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

createThemeController();
initCourseIntegration();
const storage = browserStorage();
const catalog = createCatalogController({storage});
renderCheckpoints({storage});
const continueLink = document.querySelector('#continue-course');
if (continueLink && catalog.continuation) {
  continueLink.href = catalog.continuation.href;
  continueLink.textContent = catalog.continuation.status === 'in-progress' ? 'Kurs fortsetzen →' : 'Kurs starten →';
  continueLink.setAttribute('aria-label', `${continueLink.textContent.replace(' →', '')}: ${catalog.continuation.mission}. Mission`);
}
