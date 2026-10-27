import { getLesson, gradeQuiz, matchGapFill } from './lesson-data.mjs';
import { createProgressStore, progressKeyForLesson } from './progress.mjs';
import { deriveFruitLab, fruitLabReducer, initialFruitLab } from './fruit-lab.mjs';
import {createThemeController} from './theme.mjs';

export const MISSION_ROUTES = Object.freeze([
  Object.freeze({ path: '/ki8/stunde-1/', lessonId: 'ki-01', progressKey: 'ki-01' }),
  Object.freeze({ path: '/ki8/stunde-2/', lessonId: 'ki-02', progressKey: 'ki-02' }),
  Object.freeze({ path: '/ki8/stunde-3/', lessonId: 'ki-03', progressKey: 'ki-03' }),
  Object.freeze({ path: '/ki8/stunde-4/', lessonId: 'ki-04', progressKey: 'ki-04' }),
  Object.freeze({ path: '/ki8/stunde-5/', lessonId: 'ki-05', progressKey: 'ki-05' }),
  Object.freeze({ path: '/ki8/stunde-6/', lessonId: 'ki-06', progressKey: 'ki-06' }),
  Object.freeze({ path: '/ki8/stunde-7/', lessonId: 'ki-07', progressKey: 'ki-07' }),
  Object.freeze({ path: '/ki8/stunde-8/', lessonId: 'ki-08', progressKey: 'ki-08' }),
  Object.freeze({ path: '/ki8/stunde-9/', lessonId: 'ki-09', progressKey: 'ki-09' }),
  Object.freeze({ path: '/ki8/stunde-10/', lessonId: 'ki-10', progressKey: 'ki-10' }),
  Object.freeze({ path: '/ki8/stunde-11/', lessonId: 'ki-11', progressKey: 'ki-11' }),
  Object.freeze({ path: '/ki8/stunde-12/', lessonId: 'ki-12', progressKey: 'ki-12' }),
  Object.freeze({ path: '/ki8/stunde-13/', lessonId: 'ki-13', progressKey: 'ki-13' }),
  Object.freeze({ path: '/ki8/stunde-14/', lessonId: 'ki-14', progressKey: 'ki-14' }),
  Object.freeze({ path: '/ki8/stunde-15/', lessonId: 'ki-15', progressKey: 'ki-15' }),
  Object.freeze({ path: '/ki8/stunde-16/', lessonId: 'ki-16', progressKey: 'ki-16' }),
  Object.freeze({ path: '/ki8/stunde-17/', lessonId: 'ki-17', progressKey: 'ki-17' }),
  Object.freeze({ path: '/ki8/stunde-18/', lessonId: 'ki-18', progressKey: 'ki-18' }),
]);

export function resolveMissionRoute(pathname = globalThis.location?.pathname) {
  if (typeof pathname !== 'string') return undefined;
  const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return MISSION_ROUTES.find((route) => normalizedPathname === route.path || normalizedPathname.endsWith(route.path));
}

const DEFAULT_STATE = () => ({ phase: 0, answers: {}, fruit: initialFruitLab(), quizAnswers: [], quizSubmitted: false, completed: false });
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

function isPlainObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null); }
function isValidFruitState(value) { return isPlainObject(value) && (value.selectedExample === null || value.selectedExample === 'banana' || value.selectedExample === 'apple') && typeof value.shapeRuleEnabled === 'boolean' && typeof value.examplesApplied === 'boolean' && (value.reflectionAnswer === null || ['A', 'B', 'C'].includes(value.reflectionAnswer)) && typeof value.optionalText === 'string' && value.optionalText.length <= 500; }
function isValidMissionState(value, phaseCount) { return isPlainObject(value) && Number.isInteger(value.phase) && value.phase >= 0 && value.phase < phaseCount && isPlainObject(value.answers) && Object.values(value.answers).every((answer) => typeof answer === 'string' || typeof answer === 'boolean' || (isPlainObject(answer) && Object.values(answer).every((part) => typeof part === 'string'))) && isValidFruitState(value.fruit) && Array.isArray(value.quizAnswers) && value.quizAnswers.every((answer) => answer === null || (Number.isInteger(answer) && answer >= 0 && answer <= 2)) && typeof value.quizSubmitted === 'boolean' && (value.completed === undefined || typeof value.completed === 'boolean'); }

function readJourneyState(route, activeLesson, activeState, storage) {
  const lesson = getLesson(route.lessonId);
  if (!lesson) return { lesson: undefined, state: undefined, available: false };
  if (route.lessonId === activeLesson.id) return { lesson, state: activeState, available: true };
  const loaded = createProgressStore(storage, progressKeyForLesson(route.progressKey)).load();
  if (loaded.status !== 'success') return { lesson, state: undefined, available: false };
  const state = loaded.state ?? DEFAULT_STATE();
  if (!isValidMissionState(state, lesson.phases.length)) return { lesson, state: undefined, available: false };
  return { lesson, state: { ...state, completed: state.completed === true }, available: true };
}

function renderJourneySidebar(activeLesson, activeState, storage) {
  if (!MISSION_ROUTES.some((route) => route.lessonId === activeLesson.id)) return '';
  const snapshots = MISSION_ROUTES.map((route) => ({ route, snapshot: readJourneyState(route, activeLesson, activeState, storage) }));
  const items = snapshots.map(({ route, snapshot }, routeIndex) => {
    if (!snapshot.lesson) return '';
    const { lesson, state, available } = snapshot;
    const phaseCount = lesson.phases.length;
    const completedCount = available ? (state.completed ? phaseCount : state.phase) : 0;
    const missionNumber = String(routeIndex + 1).padStart(2, '0');
    const current = route.lessonId === activeLesson.id;
    const label = available ? `${completedCount} von ${phaseCount} Phasen abgeschlossen` : 'Fortschritt nicht verfügbar';
    const phaseProgress = available ? `<progress max="${phaseCount}" value="${completedCount}" aria-label="${esc(`${lesson.title}: ${label}`)}">${completedCount}/${phaseCount}</progress>` : '<span class="journey-progress-unavailable">Fortschritt nicht verfügbar</span>';
    const name = lesson.title.replace(/^Mission \d+\s*[–-]\s*/, '');
    const phaseMarkers = lesson.phases.map((phase, phaseIndex) => {
      const done = available && phaseIndex < completedCount;
      const active = available && !state.completed && phaseIndex === state.phase;
      const marker = !available ? '?' : done ? '✓' : active ? '•' : String(phaseIndex + 1);
      const phaseLabel = !available ? `${phase.title}: Fortschritt nicht verfügbar` : `${phase.title}: ${done ? 'abgeschlossen' : active ? 'aktuell' : 'offen'}`;
      return `<span class="journey-phase ${done ? 'is-complete' : active ? 'is-current' : available ? 'is-open' : 'is-unknown'}" role="img" aria-label="${esc(phaseLabel)}" title="${esc(phaseLabel)}">${marker}</span>`;
    }).join('');
    return `<li class="journey-item ${current ? 'is-current' : ''} ${available && state.completed ? 'is-complete' : ''}" data-journey-lesson="${esc(route.lessonId)}"><a class="journey-link" href="../${esc(route.path.split('/').filter(Boolean).at(-1))}/" ${current ? 'aria-current="page"' : ''} aria-label="${esc(`${lesson.title}: ${label}`)}"><span class="journey-index">${missionNumber}</span><span class="journey-copy"><strong>${esc(name)}</strong><span class="journey-progress-label">${esc(label)}</span>${phaseProgress}</span></a><div class="journey-phase-list" role="group" aria-label="${esc(`${lesson.title}: Phasenstatus`)}">${phaseMarkers}</div></li>`;
  }).join('');
  const availableMissions = snapshots.filter(({ snapshot }) => snapshot.available).length;
  const completedMissions = snapshots.filter(({ snapshot }) => snapshot.available && snapshot.state.completed).length;
  const unavailableMissions = snapshots.length - availableMissions;
  const completedSummary = `${completedMissions} von ${availableMissions} lesbaren Missionen abgeschlossen`;
  const unavailableSummary = unavailableMissions ? `<p class="journey-unavailable" role="status">Fortschritt für ${unavailableMissions} Missionen nicht verfügbar.</p>` : '';
  return `<aside class="journey-sidebar" aria-label="Missionsfortschritt"><details open><summary class="journey-summary"><span class="eyebrow">Lernpfad</span><strong>Alle 18 Missionen</strong><span>${esc(completedSummary)}</span><progress max="${availableMissions}" value="${completedMissions}" aria-label="${esc(completedSummary)}">${completedMissions}/${availableMissions}</progress>${unavailableSummary}</summary><nav class="journey-nav" aria-label="Alle Missionen"><ol>${items}</ol></nav><p class="journey-privacy">Der Fortschritt wird nur lokal in diesem Browser gelesen.</p></details></aside>`;
}

export function createMissionRenderer({ root, lesson = getLesson('ki-01'), progressKey = lesson?.id, storage = browserStorage(), themeController = createThemeController() } = {}) {
  if (!root || !lesson) throw new TypeError('Mission root and lesson are required.');
  const store = createProgressStore(storage, progressKeyForLesson(progressKey));
  const phaseCount = lesson.phases.length;
  let state = DEFAULT_STATE();
  const loaded = store.load();
  let writesFrozen = loaded.reason === 'malformed-data' || loaded.reason === 'future-version';
  let storageMessage = loaded.status === 'success' ? '' : `Lokaler Fortschritt konnte nicht geladen werden (${loaded.reason}). Diese Sitzung bleibt verfügbar; Antworten werden nicht übertragen.`;
  if (loaded.status === 'success' && loaded.state && isValidMissionState(loaded.state, phaseCount)) state = { ...loaded.state, completed: loaded.state.completed === true };
  else if (loaded.status === 'success' && loaded.state !== null) { writesFrozen = true; storageMessage = 'Der gespeicherte Fortschritt hat ein unbekanntes Format und wurde nicht verwendet. Deine bisherigen Browserdaten wurden nicht überschrieben.'; }
  state.phase = Math.max(0, Math.min(phaseCount - 1, Number.isInteger(state.phase) ? state.phase : 0));

  const saveOnly = () => {
    if (writesFrozen) {
      const status = root.querySelector('.storage-status');
      if (status) status.textContent = storageMessage;
      return { status: 'unavailable', reason: 'invalid-loaded-state' };
    }
    const result = store.save(state);
    if (result.status !== 'success') {
      storageMessage = `Fortschritt wird in diesem Browser nicht gespeichert (${result.reason}). Deine Eingaben bleiben bis zum Schließen dieser Seite sichtbar.`;
      const status = root.querySelector('.storage-status');
      if (status) status.textContent = storageMessage;
    }
    return result;
  };
  const persist = () => { saveOnly(); render(); };
  const setAnswer = (id, value, rerender = true) => { state.answers = { ...state.answers, [id]: value }; if (rerender) persist(); else saveOnly(); };
  const phaseComplete = (index) => state.phase > index;
  const advance = (index) => { if (state.phase === index && index < phaseCount - 1) { state.phase += 1; persist(); } };

  function render() {
    const context = lesson.context ?? {};
    const contextLabel = [context.subject, context.hour].filter(Boolean).join(' · ');
    const contextLink = context.overviewHref ? `<a class="text-link" href="${esc(context.overviewHref)}">Zur Missionsübersicht</a>` : '';
    const progress = state.completed ? 100 : Math.round((state.phase / phaseCount) * 100);
    const themeIsDark = themeController.getTheme() === 'dark';
    const themeLabel = themeIsDark ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren';
    const themeIcon = themeIsDark ? '☀' : '☾';
    root.innerHTML = `<div class="mission-shell">
      ${renderJourneySidebar(lesson, state, storage)}
      <div class="mission-content" id="mission-content">
      <header class="mission-hero"><div class="hero-layout"><div><div class="hero-heading"><p class="eyebrow">${esc(lesson.module)}${contextLabel ? ` · ${esc(contextLabel)}` : ''}</p><button type="button" class="theme-toggle" data-theme-toggle aria-label="${themeLabel}" title="${themeLabel}" aria-pressed="${themeIsDark}"><span data-theme-icon aria-hidden="true">${themeIcon}</span><span class="sr-only" data-theme-label>${themeLabel}</span></button></div><h1>${esc(lesson.title)}</h1></div><svg class="ai-illustration" viewBox="0 0 180 140" aria-hidden="true" focusable="false"><rect x="35" y="30" width="110" height="80" rx="22" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="70" cy="66" r="8" fill="currentColor"/><circle cx="110" cy="66" r="8" fill="currentColor"/><path d="M65 88 Q90 105 115 88 M90 30 V14 M82 14 H98" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path class="ai-spark" d="M20 20 L24 30 L34 34 L24 38 L20 48 L16 38 L6 34 L16 30 Z" fill="var(--gold)"/></svg></div><p>${esc(lesson.description)}</p><p><a class="button-link" href="#phase-${esc(lesson.phases[0]?.id ?? '')}">Mission starten</a> ${contextLink}</p><p class="privacy-note"><strong>Nur auf diesem Gerät:</strong> Antworten bleiben lokal im Browser. Auf gemeinsam genutzten Geräten können andere Nutzerinnen und Nutzer dieselben Daten sehen; im Privatmodus können Daten fehlen. Beim Löschen der Browserdaten oder Gerätewechsel gehen sie verloren.</p></header>
      <div class="progress-summary"><div class="progress-label"><strong>Missionsfortschritt</strong><span>${progress}% · Phase ${state.phase + 1} von ${phaseCount}</span></div><progress max="100" value="${progress}">${progress}%</progress></div>
      <div class="storage-status" role="status" aria-live="polite">${esc(storageMessage)}</div>
      <nav class="phase-nav" aria-label="Missionsphasen"><ol>${lesson.phases.map((phase, index) => { const accessible = index <= state.phase; return `<li class="${state.phase === index ? 'current' : ''} ${phaseComplete(index) ? 'complete' : ''} ${accessible ? '' : 'locked'}"><span aria-hidden="true">${phaseComplete(index) ? '✓' : index + 1}</span>${accessible ? `<a href="#phase-${esc(phase.id)}">${esc(phase.title)}</a>` : `<span aria-disabled="true">${esc(phase.title)}</span>`}<small>${phase.minutes} Min.</small></li>`; }).join('')}</ol></nav>
      <main>${lesson.phases.map((phase, index) => renderPhase(phase, index)).join('')}</main>
      <aside class="next-hint"><strong>Nächster Schritt:</strong> ${esc(lesson.nextHint ?? 'In der nächsten Stunde untersuchen wir genauer, wie Trainingsdaten und Merkmale Modelle beeinflussen.')}</aside>
      <footer class="mission-footer"><button type="button" class="secondary" data-reset>Mission zurücksetzen</button><p>Beim Zurücksetzen werden nur die lokalen Daten dieser Mission gelöscht.</p></footer>
      </div>
    </div>`;
    bind();
  }

  function renderPhase(phase, index) {
    const locked = index > state.phase;
    return `<section id="phase-${esc(phase.id)}" class="phase-card ${locked ? 'locked' : ''}" aria-labelledby="heading-${esc(phase.id)}"><div class="phase-heading"><span class="phase-number">${index + 1}</span><div><p class="eyebrow">Phase ${index + 1} · ${phase.minutes} Minuten</p><h2 id="heading-${esc(phase.id)}">${esc(phase.title)}</h2></div></div>${locked ? '<p class="locked-message">Diese Phase wird freigeschaltet, sobald du die vorherige Phase abschließt.</p>' : `${phase.blocks.map((block) => renderBlock(block, phase, index)).join('')}${phase.blocks.some((block) => block.type === 'task') ? `<div class="phase-complete"><p>${lesson.media?.worksheet ? `<a href="${esc(lesson.media.worksheet.url)}" target="_blank" rel="noopener noreferrer">Offizielles Schüler-Arbeitsblatt öffnen ↗</a>` : 'Arbeitsphase: Bearbeite die Aufgaben und bestätige anschließend.'}</p><label class="check-row"><input type="checkbox" data-phase-done data-phase-id="${esc(phase.id)}" ${(state.answers[`phase-${phase.id}-done`] || (phase.id === 'film' && state.answers.filmDone)) ? 'checked' : ''}> Ich habe diese Phase bearbeitet.</label><button type="button" data-advance="${index}" ${(state.answers[`phase-${phase.id}-done`] || (phase.id === 'film' && state.answers.filmDone)) ? '' : 'disabled'}>Nächste Phase freischalten</button></div>` : ''}`}</section>`;
  }

  function renderMediaLink(media, fallbackLabel = 'Quelle öffnen ↗') {
    if (!media?.url) return '';
    return `<p><a class="button-link" href="${esc(media.url)}" target="_blank" rel="noopener noreferrer">${esc(media.linkLabel ?? fallbackLabel)}</a></p>`;
  }

  function renderBlock(block, phase, index) {
    if (block.type === 'media') {
      const media = lesson.media?.[block.mediaId];
      const relatedMedia = (media?.relatedMediaIds ?? []).map((mediaId) => lesson.media?.[mediaId]).filter((item) => item?.url);
      const mediaLinks = [media, ...relatedMedia].map((item, linkIndex) => renderMediaLink(item, linkIndex === 0 ? 'Quelle öffnen ↗' : `${item.title ?? 'Quelle öffnen'} ↗`)).join('');
      const label = media?.checkboxLabel ?? 'Ich habe diese Phase bearbeitet';
      const disclaimer = media?.selfReportDisclaimer ?? 'Nur eine Selbstmeldung.';
      const phaseHasTasks = phase.blocks.some((item) => item.type === 'task');
      const mediaCompletionControls = phaseHasTasks ? '' : `<label class="check-row"><input type="checkbox" data-phase-done data-phase-id="${esc(phase.id)}" ${phase.id === 'film' ? 'data-film-done' : ''} ${(state.answers[`phase-${phase.id}-done`] || (phase.id === 'film' && state.answers.filmDone)) ? 'checked' : ''}> ${esc(label)} <small>(${esc(disclaimer)})</small></label><button type="button" data-advance="${index}" ${(state.answers[`phase-${phase.id}-done`] || (phase.id === 'film' && state.answers.filmDone)) ? '' : 'disabled'}>Nächste Phase freischalten</button>`;
      return `<div class="content-block"><h3>${esc(media?.title ?? lesson.title)}</h3>${media?.provider ? `<p><strong>${esc(media.provider)}</strong></p>` : ''}${media?.observation ? `<p>${esc(media.observation)}</p>` : ''}${mediaLinks || '<p>Diese Medienphase enthält keine externe Quelle.</p>'}${mediaCompletionControls}</div>`;
    }
    if (block.type === 'task') return renderTask(lesson.tasks.find((task) => task.id === block.taskId));
    if (block.type === 'fruit-detector') return renderFruitLab(index);
    if (block.type === 'quiz') return renderQuiz(phase, index);
    return '';
  }

  function renderTask(task) {
    const answer = state.answers[task.id] ?? '';
    if (task.type === 'gap-fill') return `<article class="task"><h3>${esc(task.title)}</h3><p>${esc(task.prompt)}</p><div class="gap-grid"><label>Erstes Feld<input data-answer="${task.id}.first" value="${esc(answer.first ?? '')}" autocomplete="off"></label><label>Zweites Feld<input data-answer="${task.id}.second" value="${esc(answer.second ?? '')}" autocomplete="off"></label></div><button type="button" data-check-gap="${task.id}">Antwort prüfen</button><p class="feedback" data-feedback="${task.id}" role="status" aria-live="polite"></p></article>`;
    return `<article class="task"><h3>${esc(task.title)}</h3><p>${esc(task.prompt)}</p><textarea data-answer="${task.id}" rows="4" placeholder="Schreibe deine Gedanken hier auf …">${esc(typeof answer === 'string' ? answer : '')}</textarea><div class="task-actions"><button type="button" data-check-open="${task.id}">${esc(task.checkLabel)}</button><button type="button" class="secondary" data-example="${task.id}">${esc(task.exampleLabel)}</button><button type="button" class="secondary" data-revise="${task.id}">${esc(task.reviseLabel)}</button></div><p class="feedback" data-feedback="${task.id}" role="status" aria-live="polite"></p><p class="example" hidden data-example-text="${task.id}">${esc(task.exampleAnswer)}</p></article>`;
  }

  function renderFruitLab(index) {
    const result = deriveFruitLab(state.fruit); const applied = state.fruit.examplesApplied;
    const predicted = applied ? result : { colorOnlyPrediction: 'Beispiele noch nicht übernommen', improvedPrediction: 'Beispiele noch nicht übernommen', comparison: { message: 'Wähle Beispiele aus und übernimm sie, bevor du das Modell vergleichst.' } };
    const training = result.trainingExamples.map((fruit) => `${fruit.color === 'rot' ? '🔴' : '🟡'} ${fruit.color} ${fruit.name} → ${fruit.name}`).join(' · ');
    const prediction = (key, field) => applied ? result.testPredictions[key][field] : 'Noch nicht übernommen';
    return `<div class="content-block"><p class="lab-intro"><strong>${esc(result.copy.title)}</strong><br>${esc(result.copy.intro)}</p><div class="training-examples"><strong>Trainingsbeispiele:</strong><span>${esc(training)}</span></div><p><strong>Testbeispiele:</strong> Beide Testobjekte sind gelb.</p><div class="fruit-grid"><button type="button" class="fruit-choice ${state.fruit.selectedExample === 'banana' ? 'selected' : ''}" data-fruit="banana">🍌 <span>Gelbe Testbanane</span></button><button type="button" class="fruit-choice ${state.fruit.selectedExample === 'apple' ? 'selected' : ''}" data-fruit="apple">🍎 <span>Gelber Testapfel</span></button></div><div class="comparison baseline"><p><strong>Ausgangsmodell:</strong> ${esc(result.copy.colorRules?.join(' · ') ?? 'Rot → Apfel · Gelb → Banane')}</p></div><p><strong>Regeln:</strong> ${esc(result.copy.colorRules?.join(' · ') ?? result.copy.colorOnlyRule)}</p><button type="button" data-apply-examples>Beispiele übernehmen</button><span class="applied-indicator" role="status">${applied ? '✓ Beispiele übernommen' : 'Noch keine Beispiele übernommen'}</span><button type="button" class="secondary" data-shape-rule ${state.fruit.shapeRuleEnabled ? 'disabled' : ''}>Zusätzliche Formregel anwenden</button><div class="prediction-grid comparison" aria-live="polite"><div><strong>Farbe allein</strong><p>Gelbe Banane: ${esc(prediction('banana', 'colorOnly'))}</p><p>Gelber Apfel: ${esc(prediction('apple', 'colorOnly'))}</p></div><div><strong>Mit Formregel</strong><p>Gelbe Banane: ${esc(prediction('banana', 'withShapeRule'))}</p><p>Gelber Apfel: ${esc(prediction('apple', 'withShapeRule'))}</p></div></div><p class="feedback">${esc(predicted.comparison.message ?? '')}</p><fieldset><legend>Was zeigt der Vergleich?</legend>${['A: Ich habe mehr geeignete Merkmale berücksichtigt.', 'B: Ich habe nur die Farbe der Schaltflächen verändert.', 'C: Ich habe die Testobjekte entfernt.'].map((text) => `<label><input type="radio" name="reflection" value="${text[0]}" ${state.fruit.reflectionAnswer === text[0] ? 'checked' : ''}> ${esc(text)}</label>`).join('')}</fieldset><p class="feedback" role="status">${esc(result.reflection.feedback ?? '')}</p><label>Optionale Reflexion zur grünen Banane (Selbst-Check, kein Richtig/Falsch)<textarea data-fruit-text rows="3">${esc(state.fruit.optionalText)}</textarea></label><p class="example">Modellantwort: Eine grüne Banane kann wegen ihrer Farbe schwieriger erkannt werden; zusätzliche Merkmale wie Form helfen.</p><button type="button" data-advance="${index}" ${state.fruit.reflectionAnswer && applied ? '' : 'disabled'}>Abschlussquiz freischalten</button></div>`;
  }

  function renderQuiz(phase, index) {
    const quiz = phase; const graded = state.quizSubmitted ? gradeQuiz(lesson, state.quizAnswers) : null;
    return `<div class="quiz-block">${quiz.questions.map((question, qi) => `<fieldset><legend>${qi + 1}. ${esc(question.prompt)}</legend>${question.choices.map((choice, ci) => `<label><input type="radio" name="q-${qi}" value="${ci}" ${state.quizAnswers[qi] === ci ? 'checked' : ''}> ${esc(choice)}</label>`).join('')}${graded ? `<p class="feedback ${graded.results[qi].correct ? 'success' : 'error'}" role="status">${graded.results[qi].correct ? 'Richtig.' : 'Noch nicht richtig.'} ${esc(question.explanation)}</p>` : ''}</fieldset>`).join('')}<button type="button" data-submit-quiz>Quiz auswerten</button>${graded ? `<div class="score" role="status"><strong>${graded.score}/${graded.maxScore}</strong><p>${esc(graded.band.label)}</p><button type="button" class="secondary" data-reset-quiz>Quiz wiederholen</button><a class="button-link" href="../">Zur Kursübersicht</a></div>` : ''}</div>`;
  }

  function bind() {
    root.querySelector('[data-reset]').onclick = () => { const result = store.reset(); if (result.status === 'success') { state = DEFAULT_STATE(); writesFrozen = false; storageMessage = ''; } else storageMessage = `Zurücksetzen nicht möglich (${result.reason}). Deine lokalen Daten wurden nicht verändert.`; render(); };
    root.querySelectorAll('[data-phase-done]').forEach((input) => input.onchange = () => setAnswer(input.dataset.phaseId === 'film' ? 'filmDone' : `phase-${input.dataset.phaseId}-done`, input.checked));
    root.querySelectorAll('[data-advance]').forEach((button) => button.onclick = () => advance(Number(button.dataset.advance)));
    root.querySelectorAll('[data-answer]').forEach((input) => input.oninput = () => { const [id, part] = input.dataset.answer.split('.'); const previous = state.answers[id]; setAnswer(id, part ? { ...(previous ?? {}), [part]: input.value } : input.value, false); });
    root.querySelectorAll('[data-check-open]').forEach((button) => button.onclick = () => { const task = lesson.tasks.find((item) => item.id === button.dataset.checkOpen); const value = state.answers[task.id] ?? ''; root.querySelector(`[data-feedback="${task.id}"]`).textContent = value.trim() ? 'Selbst-Check: Vergleiche deine Antwort mit der Beispielantwort.' : 'Schreibe zuerst eine eigene Antwort.'; });
    root.querySelectorAll('[data-example]').forEach((button) => button.onclick = () => { const item = root.querySelector(`[data-example-text="${button.dataset.example}"]`); item.hidden = !item.hidden; });
    root.querySelectorAll('[data-revise]').forEach((button) => button.onclick = () => root.querySelector(`[data-answer="${button.dataset.revise}"]`).focus());
    root.querySelectorAll('[data-check-gap]').forEach((button) => button.onclick = () => { const answer = state.answers[button.dataset.checkGap] ?? {}; root.querySelector(`[data-feedback="${button.dataset.checkGap}"]`).textContent = matchGapFill(answer) ? 'Richtig! Vergleiche deine Lösung mit den Begriffen Beispiele/Trainingsdaten und Daten/Bilder.' : 'Noch nicht: Denke an Beispiele oder Trainingsdaten sowie Daten oder Bilder.'; });
    root.querySelectorAll('[data-fruit]').forEach((button) => button.onclick = () => { state.fruit = fruitLabReducer(state.fruit, { type: 'SELECT_EXAMPLE', example: button.dataset.fruit }); persist(); });
    root.querySelector('[data-apply-examples]')?.addEventListener('click', () => { state.fruit = fruitLabReducer(state.fruit, { type: 'APPLY_EXAMPLES' }); persist(); });
    root.querySelector('[data-shape-rule]')?.addEventListener('click', () => { state.fruit = fruitLabReducer(state.fruit, { type: 'ENABLE_SHAPE_RULE' }); persist(); });
    root.querySelectorAll('input[name="reflection"]').forEach((input) => input.onchange = () => { state.fruit = fruitLabReducer(state.fruit, { type: 'SET_REFLECTION', answer: input.value }); persist(); });
    root.querySelector('[data-fruit-text]')?.addEventListener('input', (event) => { state.fruit = fruitLabReducer(state.fruit, { type: 'SET_OPTIONAL_TEXT', text: event.target.value }); saveOnly(); });
    root.querySelectorAll('.quiz-block input[type="radio"]').forEach((input) => input.onchange = () => { const qi = Number(input.name.slice(2)); state.quizAnswers[qi] = Number(input.value); state.quizSubmitted = false; state.completed = false; saveOnly(); });
    root.querySelector('[data-submit-quiz]')?.addEventListener('click', () => { state.quizSubmitted = true; state.completed = true; persist(); });
    root.querySelector('[data-reset-quiz]')?.addEventListener('click', () => { state.quizAnswers = []; state.quizSubmitted = false; state.completed = false; persist(); });
  }
  render();
  return { getState: () => structuredClone(state), reset: () => { const result = store.reset(); if (result.status === 'success') { state = DEFAULT_STATE(); writesFrozen = false; storageMessage = ''; render(); } return result; } };
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('#mission-app');
  const route = resolveMissionRoute();
  const lesson = route ? getLesson(route.lessonId) : undefined;
  if (root && lesson) {
    const themeController = createThemeController();
    createMissionRenderer({ root, lesson, progressKey: route.progressKey, themeController });
  }
}
