import { getLesson, gradeQuiz } from '../mission/lesson-data.mjs';
import { createProgressStore } from '../mission/progress.mjs';
import { createThemeController } from '../mission/theme.mjs';

const lesson = getLesson('ki-06');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const browserStorage = () => { try { return globalThis.localStorage; } catch { return null; } };
const missionRoutes = Array.from({ length: 19 }, (_, index) => { const number = String(index + 1).padStart(2, '0'); return { lessonId: `ki-${number}`, folder: `stunde-${index + 1}` }; });
export const training = [
  { color: 'red', shape: 'circle', size: 'large', label: 'A' }, { color: 'red', shape: 'circle', size: 'small', label: 'A' },
  { color: 'blue', shape: 'square', size: 'large', label: 'B' }, { color: 'blue', shape: 'square', size: 'small', label: 'B' },
];
export const tests = [{ color: 'red', shape: 'square', size: 'large', label: 'A' }, { color: 'blue', shape: 'circle', size: 'large', label: 'B' }];

export function predict(rule, item) {
  if (!rule) return '—';
  return rule === 'color' ? (item.color === 'red' ? 'A' : 'B') : (item.shape === 'circle' ? 'A' : 'B');
}
export function score(rule) { return tests.filter((item) => predict(rule, item) === item.label).length; }
export function stateFrom(saved) {
  return { phase: 0, videoDone: false, rule: null, labelsRevealed: false, sandbox: { color: 'red', shape: 'circle', rule: 'color' }, quizAnswers: [null, null, null], quizSubmitted: false, summaryDone: false, completed: false, ...saved };
}

const card = (item, label = true) => `<div class="data-card"><span class="shape ${item.shape} ${item.color} ${item.size}" aria-hidden="true"></span><strong>${label ? `Label ${item.label}` : 'Testmerkmal'}</strong><span>${item.color === 'red' ? 'Rot' : 'Blau'} · ${item.shape === 'circle' ? 'Kreis' : 'Quadrat'} · ${item.size === 'small' ? 'klein' : 'groß'}</span></div>`;
export function renderTrainingCards() { return training.map((item) => card(item)).join(''); }
export function renderTestCards(rule) { return tests.map((item) => `<div class="data-card"><span class="shape ${item.shape} ${item.color} ${item.size}" aria-hidden="true"></span><strong>${item.color === 'red' ? 'Rot' : 'Blau'} ${item.shape === 'circle' ? 'Kreis' : 'Quadrat'}</strong><span>Vorhersage: <b>${predict(rule, item)}</b></span></div>`).join(''); }
function renderJourneySidebar(storage, state) {
  const snapshots = missionRoutes.map((route) => {
    const mission = getLesson(route.lessonId);
    if (!mission) return null;
    if (route.lessonId === lesson.id) return { route, mission, state, available: true };
    const loaded = createProgressStore(storage, route.lessonId).load();
    return { route, mission, state: loaded.status === 'success' ? (loaded.state ?? { phase: 0, completed: false }) : undefined, available: loaded.status === 'success' };
  }).filter(Boolean);
  const items = snapshots.map(({ route, mission, state: snapshotState, available }, index) => {
    const phaseCount = mission.phases.length;
    const completedCount = available ? (snapshotState.completed ? phaseCount : Math.min(snapshotState.phase ?? 0, phaseCount)) : 0;
    const current = mission.id === lesson.id;
    const label = available ? `${completedCount} von ${phaseCount} Phasen abgeschlossen` : 'Fortschritt nicht verfügbar';
    const name = mission.title.replace(/^Mission \d+\s*[–-]\s*/, '');
    const markers = mission.phases.map((phase, phaseIndex) => {
      const done = available && phaseIndex < completedCount;
      const active = available && !snapshotState.completed && phaseIndex === (snapshotState.phase ?? 0);
      return `<span class="journey-phase ${done ? 'is-complete' : active ? 'is-current' : available ? 'is-open' : 'is-unknown'}" role="img" aria-label="${esc(`${phase.title}: ${done ? 'abgeschlossen' : active ? 'aktuell' : 'offen'}`)}">${done ? '✓' : active ? '•' : available ? phaseIndex + 1 : '?'}</span>`;
    }).join('');
    return `<li class="journey-item ${current ? 'is-current' : ''} ${available && snapshotState.completed ? 'is-complete' : ''}"><a class="journey-link" href="../${route.folder}/" ${current ? 'aria-current="page"' : ''} aria-label="${esc(`${mission.title}: ${label}`)}"><span class="journey-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="journey-copy"><strong>${esc(name)}</strong><span class="journey-progress-label">${esc(label)}</span><progress max="${phaseCount}" value="${completedCount}" aria-label="${esc(`${mission.title}: ${label}`)}"></progress></span></a><div class="journey-phase-list" role="group" aria-label="${esc(`${mission.title}: Phasenstatus`)}">${markers}</div></li>`;
  }).join('');
  const availableCount = snapshots.filter(({ available }) => available).length;
  const completeCount = snapshots.filter(({ available, state: snapshotState }) => available && snapshotState.completed).length;
  return `<aside class="journey-sidebar" aria-label="Missionsfortschritt"><details open><summary class="journey-summary" aria-controls="journey-nav"><span class="sr-only">Missionen ein- oder ausblenden. </span><span class="eyebrow">Lernpfad</span><strong>Alle 19 Missionen</strong><span>${completeCount} von ${availableCount} lesbaren Missionen abgeschlossen</span><progress max="${availableCount}" value="${completeCount}">${completeCount}/${availableCount}</progress></summary><nav id="journey-nav" class="journey-nav" aria-label="Alle Missionen"><ol>${items}</ol></nav><p class="journey-privacy">Der Fortschritt wird nur lokal in diesem Browser gelesen.</p></details></aside>`;
}

export function createMission06({ root, storage = browserStorage() } = {}) {
  if (!root) throw new TypeError('Mission root is required.');
  const store = createProgressStore(storage, 'ki-06');
  const loaded = store.load();
  let state = stateFrom(loaded.status === 'success' && loaded.state ? loaded.state : null);
  let viewPhase = state.phase;
  const theme = createThemeController({ documentLike: root.ownerDocument ?? globalThis.document, storage });
  const save = () => store.save(state);
  const render = () => {
    const phaseTitles = ['Video-Mission', 'Interaktives Labor', 'Wissenscheck', 'Lernbericht in Word'];
    const quiz = lesson.phases.find((phase) => phase.id === 'quiz').questions;
    const labReady = Boolean(state.rule);
    const prediction = labReady ? predict(state.rule, tests[0]) : '—';
    const secondPrediction = labReady ? predict(state.rule, tests[1]) : '—';
    const quizFeedback = state.quizSubmitted ? gradeQuiz(lesson, state.quizAnswers) : null;
    const sandboxPrediction = predict(state.sandbox.rule, state.sandbox);
    root.innerHTML = `<div class="mission-shell mission06-shell">${renderJourneySidebar(storage, state)}<main class="mission-content">
      <header class="mission-hero"><div class="hero-heading"><p class="eyebrow">${esc(lesson.module)} · ${esc(lesson.context.subject)} · ${esc(lesson.context.hour)}</p><button type="button" class="theme-toggle" data-theme-toggle aria-label="${theme.getTheme() === 'dark' ? 'Hellmodus' : 'Dunkelmodus'} aktivieren"><span data-theme-icon aria-hidden="true">${theme.getTheme() === 'dark' ? '☀' : '☾'}</span></button></div><h1>${esc(lesson.title)}</h1><p>${esc(lesson.description)}</p><p><a class="button-link" href="../">Zur Missionsübersicht</a></p></header>
      <div class="progress-summary" role="status"><div class="progress-label"><strong>Mission 06 · 45 Minuten</strong><span>${state.completed ? 'abgeschlossen' : `Phase ${viewPhase + 1} von 4: ${phaseTitles[viewPhase]}`}</span></div><progress max="4" value="${state.completed ? 4 : state.phase}"></progress></div>
      <nav class="phase-nav" aria-label="Missionsphasen"><ol>${phaseTitles.map((title, index) => `<li class="${index === viewPhase ? 'current' : ''}"><span>${index + 1}</span><button type="button" data-phase-target="${index}" ${index > state.phase && !state.completed ? 'disabled' : ''} ${index === viewPhase ? 'aria-current="step"' : ''}>${title}</button></li>`).join('')}</ol></nav>
      ${viewPhase === 0 ? `<section class="phase-card" aria-labelledby="video-title"><p class="eyebrow">Phase 1 · 7 Minuten</p><h2 id="video-title">Video-Mission: Das Geheimnis der Daten</h2><p>Öffne das KIT-Video und sieh dir den Ausschnitt <strong>3:15–4:29</strong> an. Es gibt kein eingebettetes Video: Deine Notizen bleiben auf deinem Gerät.</p><p><a class="button-link" href="${esc(lesson.media.video.url)}" target="_blank" rel="noopener noreferrer">Video ansehen: Trainings- und Testdaten (3:15–4:29) ↗</a></p><label class="check-row"><input type="checkbox" data-video-done ${state.videoDone ? 'checked' : ''}> Ich habe den Videoausschnitt angesehen <small>(Selbstmeldung)</small></label><div class="actions"><button type="button" data-next ${state.videoDone ? '' : 'disabled'}>Weiter zum Labor</button></div></section>` : ''}
      ${viewPhase === 1 ? `<section class="phase-card" aria-labelledby="lab-title"><p class="eyebrow">Phase 2 · 13 Minuten</p><h2 id="lab-title">Interaktives Labor: Finde die Sortierregel</h2><p>Die vier <strong>Trainingskarten</strong> sind gelabelt: rote Karten gehören zu A, blaue Karten zu B. Wähle eine Regel und sperre sie, <strong>bevor</strong> du die Testlabels enthüllst.</p><div class="training-grid">${renderTrainingCards()}</div><fieldset class="rule-choice"><legend>1. Regel auswählen und sperren</legend><label><input type="radio" name="rule" value="color" ${state.rule === 'color' ? 'checked' : ''} ${labReady ? 'disabled' : ''}> Farbregel: Rot → A, sonst → B</label><label><input type="radio" name="rule" value="shape" ${state.rule === 'shape' ? 'checked' : ''} ${labReady ? 'disabled' : ''}> Formregel: Kreis → A, sonst → B</label><button type="button" data-lock-rule ${labReady ? 'disabled' : ''}>Regel sperren</button></fieldset>${labReady ? `<div class="test-area"><h3>2. Unabhängige Testmerkmale</h3><p>Die Labels sind noch verborgen. Sage die Vorhersage für jedes Merkmal voraus:</p><div class="training-grid">${renderTestCards(state.rule)}</div><button type="button" data-reveal-labels ${state.labelsRevealed ? 'disabled' : ''}>Labels getrennt enthüllen</button>${state.labelsRevealed ? `<p class="result">Labels: A und B. <strong>${state.rule === 'color' ? 'Farbregel 2/2' : 'Formregel 0/2'}</strong>. Ein Test bleibt unabhängig, weil die Testbeispiele die Regelwahl nicht beeinflusst haben. Nach einer Regeländerung brauchst du frische Testbeispiele.</p>` : ''}</div>${state.labelsRevealed ? `<div class="sandbox"><h3>3. Sandbox: Neues Beispiel</h3><p>Wähle Merkmale. Die Sandbox zeigt <strong>nur die Vorhersage</strong>, niemals ein bekanntes Label.</p><div class="sandbox-controls"><label>Farbe<select data-sandbox="color"><option value="red" ${state.sandbox.color === 'red' ? 'selected' : ''}>Rot</option><option value="blue" ${state.sandbox.color === 'blue' ? 'selected' : ''}>Blau</option><option value="green" ${state.sandbox.color === 'green' ? 'selected' : ''}>Grün</option></select></label><label>Form<select data-sandbox="shape"><option value="circle" ${state.sandbox.shape === 'circle' ? 'selected' : ''}>Kreis</option><option value="square" ${state.sandbox.shape === 'square' ? 'selected' : ''}>Quadrat</option></select></label><label>Regel<select data-sandbox="rule"><option value="color" ${state.sandbox.rule === 'color' ? 'selected' : ''}>Farbe</option><option value="shape" ${state.sandbox.rule === 'shape' ? 'selected' : ''}>Form</option></select></label></div><p class="sandbox-result">Vorhersage: <strong>${sandboxPrediction}</strong> <span>(kein bekanntes Label)</span></p></div>` : ''}<div class="actions"><button type="button" data-next ${state.labelsRevealed ? '' : 'disabled'}>Weiter zum Wissenscheck</button></div>` : ''}</section>` : ''}
      ${viewPhase === 2 ? `<section class="phase-card" aria-labelledby="quiz-title"><p class="eyebrow">Phase 3 · 5 Minuten</p><h2 id="quiz-title">Daten-Detektiv: Wissenscheck</h2>${quiz.map((question, index) => `<fieldset class="quiz-question"><legend>${index + 1}. ${esc(question.prompt)}</legend>${question.choices.map((choice, choiceIndex) => `<label><input type="radio" name="q-${index}" value="${choiceIndex}" ${state.quizAnswers[index] === choiceIndex ? 'checked' : ''}> ${String.fromCharCode(65 + choiceIndex)}) ${esc(choice)}</label>`).join('')}</fieldset>`).join('')}<button type="button" data-quiz-submit>Quiz auswerten</button>${quizFeedback ? `<div class="result" role="status"><strong>${quizFeedback.score}/${quizFeedback.maxScore} richtig.</strong> Du kannst auch ohne vollständiges Quiz zum Lernbericht weitergehen.</div>` : ''}<div class="actions"><button type="button" data-next>Weiter zum Lernbericht</button></div></section>` : ''}
      ${viewPhase === 3 ? `<section class="phase-card" aria-labelledby="summary-title"><p class="eyebrow">Phase 4 · 20 Minuten</p><h2 id="summary-title">Dein Lernbericht in Word</h2><p>Öffne ein neues Word-Dokument und schreibe in eigenen Worten:</p><ul><li>Was bedeuten Trainingsdaten und Testdaten?</li><li>Welche Regel hast du gewählt und welche Vorhersagen/Labels gab es?</li><li>Warum muss der Test unabhängig bleiben?</li><li>Beschreibe einen Fehler und erkläre, warum zwei Testfälle keine allgemeine Sicherheit beweisen.</li></ul><p>Speichere die Datei nach den Vorgaben deiner Lehrkraft. Der Text wird nicht in diese Webseite eingegeben oder übertragen.</p><label class="check-row"><input type="checkbox" data-summary-done ${state.summaryDone ? 'checked' : ''}> Ich habe den Lernbericht erstellt.</label><div class="actions"><button type="button" data-complete ${state.summaryDone ? '' : 'disabled'}>${state.completed ? 'Mission abgeschlossen' : 'Mission abschließen'}</button></div></section>` : ''}
    </main></div>`;
    bind();
  };
  const bind = () => {
    root.querySelectorAll('[data-phase-target]').forEach((button) => button.addEventListener('click', () => { const target = Number(button.dataset.phaseTarget); if (Number.isInteger(target) && target >= 0 && target <= 3 && (target <= state.phase || state.completed)) { viewPhase = target; render(); } }));
    root.querySelector('[data-theme-toggle]')?.addEventListener('click', () => { theme.toggle(); render(); });
    root.querySelector('[data-video-done]')?.addEventListener('change', (event) => { state.videoDone = event.target.checked; save(); render(); });
    root.querySelector('[data-lock-rule]')?.addEventListener('click', () => { const selected = root.querySelector('input[name="rule"]:checked'); if (selected) { state.rule = selected.value; save(); render(); } });
    root.querySelector('[data-reveal-labels]')?.addEventListener('click', () => { state.labelsRevealed = true; save(); render(); });
    root.querySelectorAll('[data-sandbox]').forEach((input) => input.addEventListener('change', (event) => { state.sandbox[event.target.dataset.sandbox] = event.target.value; save(); render(); }));
    root.querySelectorAll('.quiz-question input').forEach((input) => input.addEventListener('change', (event) => { state.quizAnswers[Number(event.target.name.slice(2))] = Number(event.target.value); state.quizSubmitted = false; save(); }));
    root.querySelector('[data-quiz-submit]')?.addEventListener('click', () => { state.quizSubmitted = true; save(); render(); });
    root.querySelector('[data-summary-done]')?.addEventListener('change', (event) => { state.summaryDone = event.target.checked; save(); render(); });
    root.querySelector('[data-next]')?.addEventListener('click', () => { viewPhase = Math.min(3, viewPhase + 1); state.phase = Math.max(state.phase, viewPhase); save(); render(); });
    root.querySelector('[data-complete]')?.addEventListener('click', () => { state.completed = true; save(); render(); });
  };
  render();
  return { getState: () => structuredClone(state), reset: () => { state = stateFrom(null); viewPhase = 0; save(); render(); } };
}

if (typeof document !== 'undefined') { const root = document.querySelector('#mission-app'); if (root) createMission06({ root }); }
