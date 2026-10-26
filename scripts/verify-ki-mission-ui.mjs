import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gradeQuiz, matchGapFill, getLesson } from '../pages/ki8/mission/lesson-data.mjs';
import { createProgressStore, PROGRESS_NAMESPACE } from '../pages/ki8/mission/progress.mjs';
import { createMissionRenderer, resolveMissionRoute } from '../pages/ki8/mission/mission.mjs';

const html = fs.readFileSync(new URL('../pages/ki8/stunde-1/index.html', import.meta.url), 'utf8');
const mission02Html = fs.readFileSync(new URL('../pages/ki8/stunde-2/index.html', import.meta.url), 'utf8');
assert.match(html, /src="\.\.\/mission\/mission\.mjs"/);
assert.match(html, /data-lesson-id="ki-01"/);
assert.match(mission02Html, /src="\.\.\/mission\/mission\.mjs"/);
assert.match(mission02Html, /data-lesson-id="ki-02"/);
assert.deepEqual(resolveMissionRoute('/ki8/stunde-1/'), { path: '/ki8/stunde-1/', lessonId: 'ki-01', progressKey: 'ki-01' });
assert.deepEqual(resolveMissionRoute('/ki8/stunde-2/'), { path: '/ki8/stunde-2/', lessonId: 'ki-02', progressKey: 'ki-02' });
assert.equal(resolveMissionRoute('/ki8/stunde-2/?lesson=ki-01'), undefined);
assert.match(html, /id="mission-app"/);
assert.doesNotMatch(html, /<iframe/i);
const missionSource = fs.readFileSync(new URL('../pages/ki8/mission/mission.mjs', import.meta.url), 'utf8');
const missionCss = fs.readFileSync(new URL('../pages/ki8/mission/mission.css', import.meta.url), 'utf8');
assert.match(missionCss, /\.phase-nav li > span:first-child/);
assert.match(missionCss, /\.phase-nav li > span\[aria-disabled="true"\]/);
assert.doesNotMatch(missionCss, /\.phase-nav li span\{/);
assert.match(missionCss, /overflow-wrap:anywhere/);
assert.match(missionCss, /min-height:44px/);
assert.match(missionCss, /#phase-film/);
assert.match(missionCss, /#phase-worksheet/);
assert.match(missionCss, /#phase-lab/);
assert.match(missionCss, /#phase-quiz/);
assert.match(missionCss, /prefers-reduced-motion:reduce/);
assert.match(missionCss, /transition/);
assert.doesNotMatch(missionCss, /prefers-reduced-motion:reduce\).*transition[^}]*all/);
assert.match(missionSource, /Mission starten/);
assert.match(missionSource, /aria-hidden="true"/);
assert.match(missionSource, /<svg/);
assert.match(missionSource, /progress-summary/);
assert.match(missionSource, /context\.overviewHref/);
assert.doesNotMatch(missionSource, /href="\.\.\/\.\.\/modul-1\.html/);
assert.match(missionSource, /lesson\.context/);
assert.match(missionSource, /contextLabel/);
assert.match(missionSource, /gemeinsam genutzten Geräten|Privatmodus/);
assert.match(html, /href="\.\.\/mission\/mission\.css"/);

const lesson = getLesson('ki-01');
assert.deepEqual(lesson.phases.map(({ id, minutes }) => [id, minutes]), [['film', 18], ['worksheet', 10], ['lab', 11], ['quiz', 6]]);
assert.deepEqual(lesson.phases[3].questions.map((q) => q.correctIndex), [1, 0, 2, 1, 0]);
assert.equal(matchGapFill({ first: 'Trainingsdaten', second: 'Bilder' }), true);
assert.equal(matchGapFill({ first: 'keine Beispiele', second: 'Bilder' }), false);
assert.equal(gradeQuiz(lesson, [1, 0, 2, 1, 0]).band.key, 'excellent');
assert.equal(gradeQuiz(lesson, [1, 0, 2, 0, 2]).band.key, 'good');
assert.equal(gradeQuiz(lesson, [0, 2, 1, 0, 2]).band.key, 'retry');
assert.equal(lesson.media.worksheet.url, 'https://www.planet-schule.de/thema/dennis-ki-ab1-pdf-100.pdf');
assert.match(missionSource, /Nächste Phase freischalten/);
assert.match(missionSource, /Beispiele übernehmen/);
assert.match(missionSource, /grünen Banane/i);
assert.match(missionSource, /href="\.\.\/"/);
assert.match(missionSource, /completed: false/);
assert.match(missionSource, /state\.completed \? 100 :/);
assert.match(missionSource, /answer === null/);
assert.match(missionSource, /writesFrozen/);
assert.equal(lesson.title, 'Mission 01 – Was ist künstliche Intelligenz?');
assert.match(missionSource, /media\?\.provider/);
assert.match(missionSource, /media\?\.observation/);
assert.match(missionSource, /media\?\.checkboxLabel/);
assert.match(missionSource, /trainingExamples/);
assert.match(missionSource, /testPredictions/);
assert.match(missionSource, /Ich habe mehr geeignete Merkmale berücksichtigt\./);
assert.match(missionSource, /Ich habe nur die Farbe der Schaltflächen verändert\./);
assert.match(missionSource, /Ich habe die Testobjekte entfernt\./);
assert.match(missionSource, /Löschen der Browserdaten/);
assert.match(missionSource, /dieselben Daten sehen/);
assert.match(missionSource, /storage-status/);

class FakeElement {
  constructor(tag, attrs = {}, text = '') { this.tagName = tag; this.attrs = attrs; this.textContent = text; this.name = attrs.name; this.value = attrs.value ?? ''; this.checked = 'checked' in attrs; this.disabled = 'disabled' in attrs; this.hidden = 'hidden' in attrs; this.dataset = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-')).map(([key, value]) => [key.slice(5).replace(/-([a-z])/g, (_, char) => char.toUpperCase()), value ?? ''])); this.listeners = {}; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  dispatch(type) { const fn = this.listeners[type] || this[`on${type}`]; if (fn) fn({ target: this }); }
  focus() { this.focused = true; }
}
class FakeRoot {
  set innerHTML(value) { this.html = value; this.cache = [...this.html.matchAll(/<([a-z]+)([^>]*)>/gi)].map((match) => { const attrs = {}; for (const item of (match[2] || '').matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[item[1]] = item[2] ?? ''; return new FakeElement(match[1], attrs); }); }
  get innerHTML() { return this.html; }
  elements(selector) {
    return this.cache.filter((element) => {
      if (selector.startsWith('[data-')) { const match = selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/); const key = match[1].replace(/-([a-z])/g, (_, char) => char.toUpperCase()); return key in element.dataset && (match[2] === undefined || element.dataset[key] === match[2]); }
      if (selector === 'input[name="reflection"]') return element.tagName === 'input' && element.attrs.name === 'reflection';
      const quizChoice = selector.match(/^input\[name="(q-\d+)"\]\[value="(\d+)"\]$/);
      if (quizChoice) return element.tagName === 'input' && element.attrs.name === quizChoice[1] && element.attrs.value === quizChoice[2];
      if (selector === '.quiz-block input[type="radio"]') return element.tagName === 'input' && element.attrs.type === 'radio' && /quiz-block/.test(this.html);
      return false;
    });
  }
  querySelectorAll(selector) { return this.elements(selector); }
  querySelector(selector) { return this.elements(selector)[0] || new FakeElement('div'); }
}
const eventMemory = new Map();
const eventStorage = { getItem: (key) => eventMemory.get(key) ?? null, setItem: (key, value) => eventMemory.set(key, value), removeItem: (key) => eventMemory.delete(key) };
const eventRoot = new FakeRoot();
const renderer = createMissionRenderer({ root: eventRoot, storage: eventStorage }); assert.match(eventRoot.innerHTML, /Modul 1/); assert.match(eventRoot.innerHTML, /Stunde 1/); assert.match(eventRoot.innerHTML, /href="\.\.\/modul-1\.html#stunde-1"/); assert.match(eventRoot.innerHTML, /WP 8/); assert.match(eventRoot.innerHTML, /Planet Schule/); assert.match(eventRoot.innerHTML, /Achte besonders darauf, wie die Hunde-App lernt und warum sie sich manchmal irrt\./); assert.match(eventRoot.innerHTML, /Ich habe den Film angesehen/);
const film = eventRoot.querySelector('[data-film-done]'); film.checked = true; film.dispatch('change'); assert.equal(renderer.getState().answers.filmDone, true); eventRoot.querySelector('[data-advance]').dispatch('click');
assert.equal(renderer.getState().phase, 1);
const answer = eventRoot.querySelector('[data-answer="task-a"]'); answer.value = 'Mehr als ein Zeichen'; answer.dispatch('input'); assert.equal(renderer.getState().answers['task-a'], 'Mehr als ein Zeichen'); assert.equal(answer.focused, undefined, 'typing must not require replacing the input');
assert.match(eventRoot.innerHTML, /data-phase-id="worksheet"/);
assert.match(missionSource, /data-phase-done/);
assert.match(missionSource, /Nächste Phase freischalten/);
eventMemory.set(`${PROGRESS_NAMESPACE}:ki-01`, JSON.stringify({ version: 1, state: { phase: 2, answers: {}, fruit: renderer.getState().fruit, quizAnswers: [], quizSubmitted: false, completed: false } }));
const labRoot = new FakeRoot(); const labRenderer = createMissionRenderer({ root: labRoot, storage: eventStorage }); assert.match(labRoot.innerHTML, /rot Apfel/); assert.match(labRoot.innerHTML, /gelb Banane/); assert.match(labRoot.innerHTML, /Gelber Testapfel/); assert.match(labRoot.innerHTML, /Gelbe Testbanane/);
const apple = labRoot.querySelector('[data-fruit="apple"]'); apple.dispatch('click'); labRoot.querySelector('[data-apply-examples]').dispatch('click'); assert.equal(labRenderer.getState().fruit.examplesApplied, true); assert.match(labRoot.innerHTML, /Fehlklassifikation/); labRoot.querySelector('[data-shape-rule]').dispatch('click'); assert.match(labRoot.innerHTML, /wird als Apfel erkannt/);
const reflection = labRoot.querySelector('input[name="reflection"]'); reflection.dispatch('change'); assert.match(labRoot.innerHTML, /Abschlussquiz freischalten/);
eventMemory.set(`${PROGRESS_NAMESPACE}:ki-01`, JSON.stringify({ version: 1, state: { phase: 3, answers: {}, fruit: labRenderer.getState().fruit, quizAnswers: [], quizSubmitted: false, completed: false } }));
const quizRoot = new FakeRoot(); const quizRenderer = createMissionRenderer({ root: quizRoot, storage: eventStorage });
for (const [index, choice] of [1, 0, 2, 1, 0].entries()) { const radio = quizRoot.querySelector(`input[name="q-${index}"][value="${choice}"]`); radio.dispatch('change'); } quizRoot.querySelector('[data-submit-quiz]').dispatch('click'); assert.equal(quizRenderer.getState().completed, true); assert.match(quizRoot.innerHTML, /100%/);
const corruptMemory = new Map([[`${PROGRESS_NAMESPACE}:ki-01`, JSON.stringify({ version: 1, state: { phase: 3, answers: [], fruit: { selectedExample: 'unknown' }, quizAnswers: 'bad', quizSubmitted: true, completed: true } })]]);
const corruptRoot = new FakeRoot(); const corruptRenderer = createMissionRenderer({ root: corruptRoot, storage: { getItem: (key) => corruptMemory.get(key) ?? null, setItem: () => { throw new Error('must not overwrite'); }, removeItem: () => {} } }); assert.match(corruptRoot.innerHTML, /unbekanntes Format/); assert.equal(corruptRenderer.getState().phase, 0);
const oldMemory = new Map([[`${PROGRESS_NAMESPACE}:ki-01`, JSON.stringify({ version: 1, state: { phase: 1, answers: {}, fruit: renderer.getState().fruit, quizAnswers: [], quizSubmitted: false } })]]); const oldRenderer = createMissionRenderer({ root: new FakeRoot(), storage: { getItem: (key) => oldMemory.get(key) ?? null, setItem: () => {}, removeItem: () => {} } }); assert.equal(oldRenderer.getState().completed, false);
const sparseMemory = new Map([[`${PROGRESS_NAMESPACE}:ki-01`, JSON.stringify({ version: 1, state: { phase: 3, answers: {}, fruit: renderer.getState().fruit, quizAnswers: [null, null, 2], quizSubmitted: false, completed: false } })]]); const sparseRoot = new FakeRoot(); const sparseRenderer = createMissionRenderer({ root: sparseRoot, storage: { getItem: (key) => sparseMemory.get(key) ?? null, setItem: (key, value) => sparseMemory.set(key, value), removeItem: (key) => sparseMemory.delete(key) } }); assert.deepEqual(sparseRenderer.getState().quizAnswers, [null, null, 2]);
const frozenBytes = JSON.stringify({ version: 1, state: { phase: 3, answers: [], fruit: { selectedExample: 'bad' }, quizAnswers: 'broken', quizSubmitted: false, completed: false } }); const frozenMemory = new Map([[`${PROGRESS_NAMESPACE}:ki-01`, frozenBytes]]); const frozenRoot = new FakeRoot(); const frozenRenderer = createMissionRenderer({ root: frozenRoot, storage: { getItem: (key) => frozenMemory.get(key) ?? null, setItem: (key, value) => frozenMemory.set(key, value), removeItem: (key) => frozenMemory.delete(key) } }); assert.match(frozenRoot.innerHTML, /unbekanntes Format/); frozenRenderer.reset; const frozenFilm = frozenRoot.querySelector('[data-film-done]'); if (frozenFilm.tagName === 'input') { frozenFilm.checked = true; frozenFilm.dispatch('change'); } assert.equal(frozenMemory.get(`${PROGRESS_NAMESPACE}:ki-01`), frozenBytes); frozenRoot.querySelector('[data-reset]').dispatch('click'); assert.equal(frozenMemory.has(`${PROGRESS_NAMESPACE}:ki-01`), false);
const alternateLesson = { id: 'alternate', module: 'Test', title: 'Alternative Stunde', description: 'Flexibel', duration: 15, objectives: [], phases: [{ id: 'warmup', title: 'Warm-up', minutes: 8, blocks: [{ type: 'task', taskId: 'task-a' }] }, { id: 'check', title: 'Check', minutes: 7, blocks: [{ type: 'quiz', questionIds: ['q1'] }], questions: [{ id: 'q1', prompt: 'Testfrage', choices: ['Nein', 'Ja'], correctIndex: 1, explanation: 'Test' }] }], media: {}, contentBlocks: [], tasks: [{ id: 'task-a', type: 'open-response', title: 'Notiz', prompt: 'Schreibe etwas', exampleAnswer: 'Beispiel', checkLabel: 'Prüfen', exampleLabel: 'Beispiel', reviseLabel: 'Überarbeiten' }], solutions: [], feedback: {}, progress: { version: 1, localOnly: true } }; const alternateRoot = new FakeRoot(); const alternateRenderer = createMissionRenderer({ root: alternateRoot, lesson: alternateLesson, storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } }); assert.match(alternateRoot.innerHTML, /Warm-up/); const alternateDone = alternateRoot.querySelector('[data-phase-done]'); alternateDone.checked = true; alternateDone.dispatch('change'); alternateRoot.querySelector('[data-advance]').dispatch('click'); assert.equal(alternateRenderer.getState().phase, 1); assert.match(alternateRoot.innerHTML, /Check/);

const mediaLesson = { id: 'media-alternate', module: 'Andere Reihe', context: { subject: 'Test', module: 'Modul X', hour: 'Stunde Y' }, title: 'Andere Stunde', description: 'Andere Medienphase', duration: 5, objectives: [], phases: [{ id: 'reading', title: 'Lesen', minutes: 3, blocks: [{ type: 'media', mediaId: 'reading' }] }, { id: 'finish', title: 'Abschluss', minutes: 2, blocks: [{ type: 'prompt', text: 'Ende' }] }], media: { reading: { kind: 'text', title: 'Andere Quelle', provider: 'Beispielanbieter', observation: 'Achte auf ein anderes Muster.', checkboxLabel: 'Ich habe gelesen', selfReportDisclaimer: 'Selbstmeldung.' } }, contentBlocks: [], tasks: [], solutions: [], feedback: {}, progress: { version: 1, localOnly: true } }; const mediaRoot = new FakeRoot(); const mediaRenderer = createMissionRenderer({ root: mediaRoot, lesson: mediaLesson, storage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } }); assert.match(mediaRoot.innerHTML, /Beispielanbieter/); assert.match(mediaRoot.innerHTML, /Achte auf ein anderes Muster/); assert.match(mediaRoot.innerHTML, /Ich habe gelesen/); assert.doesNotMatch(mediaRoot.innerHTML, /Planet Schule|Hunde-App|Hunderassen/); const mediaDone = mediaRoot.querySelector('[data-phase-done]'); mediaDone.checked = true; mediaDone.dispatch('change'); mediaRoot.querySelector('[data-advance]').dispatch('click'); assert.equal(mediaRenderer.getState().phase, 1);

const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
const store = createProgressStore(storage, 'ui-test');
assert.equal(store.save({ phase: 2, answers: { 'task-a': 'Antwort' } }).status, 'success');
assert.deepEqual(store.load().state, { phase: 2, answers: { 'task-a': 'Antwort' } });
const unavailable = createProgressStore({ getItem() { throw new Error('denied'); } }, 'unavailable');
assert.equal(unavailable.load().reason, 'storage-error');
const future = createProgressStore({ getItem: () => JSON.stringify({ version: 99, state: { phase: 3 } }), setItem() { throw new Error('must not overwrite'); } }, 'future');
assert.equal(future.load().reason, 'future-version');
assert.equal(future.save({ phase: 0 }).reason, 'future-version');
console.log('ki mission UI verification passed');
