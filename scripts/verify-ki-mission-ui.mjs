import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gradeQuiz, matchGapFill, getLesson } from '../pages/ki8/mission/lesson-data.mjs';
import { createProgressStore, PROGRESS_NAMESPACE } from '../pages/ki8/mission/progress.mjs';
import { createMissionRenderer, resolveMissionRoute } from '../pages/ki8/mission/mission.mjs';

const html = fs.readFileSync(new URL('../pages/ki8/stunde-1/index.html', import.meta.url), 'utf8');
const mission02Html = fs.readFileSync(new URL('../pages/ki8/stunde-2/index.html', import.meta.url), 'utf8');
const mission03Html = fs.readFileSync(new URL('../pages/ki8/stunde-3/index.html', import.meta.url), 'utf8');
assert.match(html, /src="\.\.\/mission\/mission\.mjs"/);
assert.match(html, /data-lesson-id="ki-01"/);
assert.match(mission02Html, /src="\.\.\/mission\/mission\.mjs"/);
assert.match(mission02Html, /data-lesson-id="ki-02"/);
assert.match(mission03Html, /src="\.\.\/mission\/mission\.mjs"/);
assert.match(mission03Html, /data-lesson-id="ki-03"/);
assert.deepEqual(resolveMissionRoute('/ki8/stunde-1/'), { path: '/ki8/stunde-1/', lessonId: 'ki-01', progressKey: 'ki-01' });
assert.deepEqual(resolveMissionRoute('/ki8/stunde-2/'), { path: '/ki8/stunde-2/', lessonId: 'ki-02', progressKey: 'ki-02' });
assert.deepEqual(resolveMissionRoute('/ki8/stunde-3/'), { path: '/ki8/stunde-3/', lessonId: 'ki-03', progressKey: 'ki-03' });
assert.equal(resolveMissionRoute('/ki8/stunde-3/?lesson=ki-01'), undefined);
assert.equal(resolveMissionRoute('/ki8/stunde-2/?lesson=ki-01'), undefined);
assert.match(html, /id="mission-app"/);
assert.doesNotMatch(html, /<iframe/i);
const missionSource = fs.readFileSync(new URL('../pages/ki8/mission/mission.mjs', import.meta.url), 'utf8');
assert.doesNotMatch(missionSource, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
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
const mission03Root = new FakeRoot();
const mission03Memory = new Map();
const mission03Storage = { getItem: (key) => mission03Memory.get(key) ?? null, setItem: (key, value) => mission03Memory.set(key, value), removeItem: (key) => mission03Memory.delete(key) };
const mission03Renderer = createMissionRenderer({ root: mission03Root, lesson: getLesson('ki-03'), progressKey: 'ki-03', storage: mission03Storage });
assert.match(mission03Root.innerHTML, /Mission 03 – Merkmale, Labels und Schwellenwerte/);
assert.match(mission03Root.innerHTML, /inf-schule/);
assert.doesNotMatch(mission03Root.innerHTML, /Planet Schule|Hunde-App|Hunderassen/);
const mission03MaterialDone = mission03Root.querySelector('[data-phase-done]');
mission03MaterialDone.checked = true;
mission03MaterialDone.dispatch('change');
assert.ok(mission03Memory.has(`${PROGRESS_NAMESPACE}:ki-03`));
mission03Root.querySelector('[data-advance]').dispatch('click');
assert.equal(mission03Renderer.getState().phase, 1);
assert.match(mission03Root.innerHTML, /Merkmale und Labels/);
const mission03FeatureDone = mission03Root.querySelectorAll('[data-phase-done]').find(({ dataset }) => dataset.phaseId === 'features');
mission03FeatureDone.checked = true;
mission03FeatureDone.dispatch('change');
mission03Root.querySelector('[data-advance="1"]').dispatch('click');
assert.equal(mission03Renderer.getState().phase, 2);
assert.match(mission03Root.innerHTML, /Wert 7/);
const mission04Html = fs.readFileSync(new URL('../pages/ki8/stunde-4/index.html', import.meta.url), 'utf8');
assert.match(mission04Html, /data-lesson-id="ki-04"/);
const mission04Root = new FakeRoot();
const mission04Memory = new Map();
const mission04Storage = { getItem: (key) => mission04Memory.get(key) ?? null, setItem: (key, value) => mission04Memory.set(key, value), removeItem: (key) => mission04Memory.delete(key) };
const mission04Renderer = createMissionRenderer({ root: mission04Root, lesson: getLesson('ki-04'), progressKey: 'ki-04', storage: mission04Storage });
assert.match(mission04Root.innerHTML, /Mission 04 – Trainieren, testen und Fehler untersuchen/);
assert.match(mission04Root.innerHTML, /Experience AI/);
assert.match(mission04Root.innerHTML, /Nur eine Selbstmeldung, kein technischer Nachweis/);
assert.doesNotMatch(mission04Root.innerHTML, /Planet Schule|Hunde-App|Hunderassen/);
const mission04PhaseDone = mission04Root.querySelector('[data-phase-done]');
mission04PhaseDone.checked = true;
mission04PhaseDone.dispatch('change');
assert.ok(mission04Memory.has(`${PROGRESS_NAMESPACE}:ki-04`));
mission04Root.querySelector('[data-advance]').dispatch('click');
assert.equal(mission04Renderer.getState().phase, 1);
assert.match(mission04Root.innerHTML, /inf-schule/);
assert.match(mission04Root.innerHTML, /Training und Test unterscheiden/);
for (const [label, savedBytes] of [['malformed', '{not valid JSON'], ['future', JSON.stringify({ version: 99, state: { phase: 0 } })]]) {
  const m01Bytes = JSON.stringify({ version: 1, state: { phase: 1, mission: 'ki-01' } });
  const m02Bytes = JSON.stringify({ version: 1, state: { phase: 2, mission: 'ki-02' } });
  const protectedMemory = new Map([[`${PROGRESS_NAMESPACE}:ki-01`, m01Bytes], [`${PROGRESS_NAMESPACE}:ki-02`, m02Bytes], [`${PROGRESS_NAMESPACE}:ki-03`, savedBytes]]);
  let protectedWrites = 0;
  const protectedStorage = { getItem: (key) => protectedMemory.get(key) ?? null, setItem: (key, value) => { protectedWrites += 1; protectedMemory.set(key, value); }, removeItem: (key) => protectedMemory.delete(key) };
  const protectedRoot = new FakeRoot();
  createMissionRenderer({ root: protectedRoot, lesson: getLesson('ki-03'), progressKey: 'ki-03', storage: protectedStorage });
  const protectedPhase = protectedRoot.querySelector('[data-phase-done]');
  protectedPhase.checked = true;
  protectedPhase.dispatch('change');
  assert.equal(protectedWrites, 0, `${label} M03 data must not be rewritten`);
  assert.equal(protectedMemory.get(`${PROGRESS_NAMESPACE}:ki-03`), savedBytes);
  assert.equal(protectedMemory.get(`${PROGRESS_NAMESPACE}:ki-01`), m01Bytes);
  assert.equal(protectedMemory.get(`${PROGRESS_NAMESPACE}:ki-02`), m02Bytes);
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

const mission09Root = new FakeRoot();
let mission09Writes = 0;
createMissionRenderer({ root: mission09Root, lesson: getLesson('ki-09'), progressKey: 'ki-09', storage: { getItem: () => null, setItem() { mission09Writes += 1; }, removeItem() {} } });
assert.equal(mission09Writes, 0, 'M09 does not write progress on initial render');
assert.match(mission09Root.innerHTML, /In der nächsten Mission prüfst du Muster an neuen Fällen und untersuchst mögliche Ausreißer\./);
const mission10Root = new FakeRoot();
let mission10Writes = 0;
createMissionRenderer({ root: mission10Root, lesson: getLesson('ki-10'), progressKey: 'ki-10', storage: { getItem: () => null, setItem() { mission10Writes += 1; }, removeItem() {} } });
assert.equal(mission10Writes, 0, 'M10 does not write progress on initial render');
assert.match(mission10Root.innerHTML, /In der nächsten Mission untersuchst du, ob ein Chatbot Absichten mit festen Regeln oder einem gelernten Modell erkennt\./);
const mission11Root = new FakeRoot();
let mission11Writes = 0;
createMissionRenderer({ root: mission11Root, lesson: getLesson('ki-11'), progressKey: 'ki-11', storage: { getItem: () => null, setItem() { mission11Writes += 1; }, removeItem() {} } });
assert.equal(mission11Writes, 0, 'M11 does not write progress on initial render');
assert.match(mission11Root.innerHTML, /In der nächsten Mission untersuchst du, wie gelabelte Beispiele neuen Formulierungen zugeordnet werden\./);
const mission12Root = new FakeRoot();
let mission12Writes = 0;
createMissionRenderer({ root: mission12Root, lesson: getLesson('ki-12'), progressKey: 'ki-12', storage: { getItem: () => null, setItem() { mission12Writes += 1; }, removeItem() {} } });
assert.equal(mission12Writes, 0, 'M12 does not write progress on initial render');
assert.match(mission12Root.innerHTML, /In der nächsten Mission untersuchst du, wie ein Chatbot unbekannte Nachrichten offen und sicher beantwortet\./);
const mission13Root = new FakeRoot();
let mission13Writes = 0;
createMissionRenderer({ root: mission13Root, lesson: getLesson('ki-13'), progressKey: 'ki-13', storage: { getItem: () => null, setItem() { mission13Writes += 1; }, removeItem() {} } });
assert.equal(mission13Writes, 0, 'M13 does not write progress on initial render');
assert.match(mission13Root.innerHTML, /In der nächsten Mission prüfst du Behauptungen, indem du Autor, Belege und Methode kritisch untersuchst\./);
const mission14Root = new FakeRoot();
let mission14Writes = 0;
createMissionRenderer({ root: mission14Root, lesson: getLesson('ki-14'), progressKey: 'ki-14', storage: { getItem: () => null, setItem() { mission14Writes += 1; }, removeItem() {} } });
assert.equal(mission14Writes, 0, 'M14 does not write progress on initial render');
assert.match(mission14Root.innerHTML, /In der nächsten Mission prüfst du Nachrichten auf fehlende Quellen, veraltete Angaben und veränderte Originalinformationen\./);
const mission15Root = new FakeRoot();
let mission15Writes = 0;
createMissionRenderer({ root: mission15Root, lesson: getLesson('ki-15'), progressKey: 'ki-15', storage: { getItem: () => null, setItem() { mission15Writes += 1; }, removeItem() {} } });
assert.equal(mission15Writes, 0, 'M15 does not write progress on initial render');
assert.match(mission15Root.innerHTML, /In der nächsten Mission schützt du deine Privatsphäre, indem du nur notwendige und erfundene Angaben verwendest\./);
const mission16Root = new FakeRoot();
let mission16Writes = 0;
createMissionRenderer({ root: mission16Root, lesson: getLesson('ki-16'), progressKey: 'ki-16', storage: { getItem: () => null, setItem() { mission16Writes += 1; }, removeItem() {} } });
assert.equal(mission16Writes, 0, 'M16 does not write progress on initial render');
assert.match(mission16Root.innerHTML, /In der nächsten Mission untersuchst du, ob Trainingsdaten verschiedene Gruppen und Situationen abdecken und welche Verzerrungen entstehen können\./);
const mission17Root = new FakeRoot();
let mission17Writes = 0;
createMissionRenderer({ root: mission17Root, lesson: getLesson('ki-17'), progressKey: 'ki-17', storage: { getItem: () => null, setItem() { mission17Writes += 1; }, removeItem() {} } });
assert.equal(mission17Writes, 0, 'M17 does not write progress on initial render');
assert.match(mission17Root.innerHTML, /In der nächsten Mission prüfst du KI-Vorschläge, achtest auf Datenschutz und übernimmst Verantwortung für deine Entscheidung\./);

const defaultHintRoot = new FakeRoot();
createMissionRenderer({ root: defaultHintRoot, lesson: getLesson('ki-08'), progressKey: 'ki-08', storage: { getItem: () => null, setItem() {}, removeItem() {} } });
assert.match(defaultHintRoot.innerHTML, /In der nächsten Stunde untersuchen wir genauer, wie Trainingsdaten und Merkmale Modelle beeinflussen\./);
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
const mission18Html = fs.readFileSync(new URL('../pages/ki8/stunde-18/index.html', import.meta.url), 'utf8');
assert.match(mission18Html, /data-lesson-id="ki-18"/);
assert.deepEqual(resolveMissionRoute('/ki8/stunde-18/'), {path: '/ki8/stunde-18/', lessonId: 'ki-18', progressKey: 'ki-18'});
const mission18Root = new FakeRoot();
let mission18Writes = 0;
createMissionRenderer({ root: mission18Root, lesson: getLesson('ki-18'), progressKey: 'ki-18', storage: { getItem: () => null, setItem() { mission18Writes += 1; }, removeItem() {} } });
assert.equal(mission18Writes, 0, 'M18 does not write progress on initial render');
assert.match(mission18Root.innerHTML, /Mission 18 – Verantwortungsvoll nutzen/);
assert.match(mission18Root.innerHTML, /So nutzt du KI zum Lernen/);
assert.ok(mission18Root.innerHTML.includes('https://www.planet-schule.de/schwerpunkt/leben-in-der-digitalen-welt/'));
assert.doesNotMatch(mission18Root.innerHTML, /<iframe/i);
assert.match(mission18Root.innerHTML, /nicht allein aufgrund einer KI-Antwort/);
assert.match(mission18Root.innerHTML, /KI-Hilfe.*transparent/);
assert.match(mission18Root.innerHTML, /Datenschutz|persönliche Daten/i);

console.log('ki mission UI verification passed');
