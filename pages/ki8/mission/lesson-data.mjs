const QUIZ_BAND_LABELS = Object.freeze({
  excellent: 'Hervorragend! Du hast die Mission erfolgreich abgeschlossen.',
  good: 'Gut gemacht! Du hast vieles verstanden.',
  retry: 'Du hast erste wichtige Dinge gelernt. Wiederhole die Lernkarten und probiere das Quiz erneut.',
});

const GAP_CATEGORIES = Object.freeze([
  new Set(['beispiele', 'beispielen', 'beispiel', 'trainingsdaten', 'trainingsbilder', 'trainingsbildern']),
  new Set(['daten', 'datenmaterial', 'bilder', 'bildern', 'bild']),
]);
const NEGATION_TOKENS = new Set(['kein', 'keine', 'keinen', 'keinem', 'keiner', 'nicht', 'nie', 'ohne']);

const QUIZ_QUESTIONS = Object.freeze([
  {
    id: 'q1',
    prompt: 'Wie kann eine KI-App lernen, Hunderassen auf Fotos zu unterscheiden?',
    choices: ['Sie verwendet ausschließlich eine feste Liste von Hundenamen.', 'Sie erkennt Muster aus vielen geeigneten Trainingsbildern.', 'Sie erkennt die Rasse immer am Dateinamen.'],
    correctIndex: 1,
    explanation: 'Ein trainiertes Bilderkennungsmodell kann typische Merkmale aus vielen Beispielen lernen.',
  },
  {
    id: 'q2',
    prompt: 'Warum sind geeignete Trainingsdaten wichtig?',
    choices: ['Weil sie einem Modell helfen, Muster zu erkennen.', 'Weil sie jedes spätere Ergebnis garantiert richtig machen.', 'Weil der Bildschirm dadurch schneller reagiert.'],
    correctIndex: 0,
    explanation: 'Trainingsdaten beeinflussen, welche Muster ein Modell lernen kann. Gute Daten garantieren jedoch keine Fehlerfreiheit.',
  },
  {
    id: 'q3',
    prompt: 'Ein KI-Modell hat fast nur Bilder von reinrassigen Hunden gesehen. Was könnte bei einem ungewöhnlich aussehenden Mischlingshund passieren?',
    choices: ['Das Modell erkennt ihn immer sicher.', 'Das Modell muss sich automatisch neu programmieren.', 'Das Modell könnte Schwierigkeiten bei der Zuordnung haben.'],
    correctIndex: 2,
    explanation: 'Ungewöhnliche oder wenig vertretene Beispiele können für ein Modell schwieriger sein.',
  },
  {
    id: 'q4',
    prompt: 'Was haben wir beim Obst-Detektiv festgestellt?',
    choices: ['Die Farbe allein reicht immer aus.', 'Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.', 'Sobald eine Regel funktioniert, kann sie nie mehr Fehler machen.'],
    correctIndex: 1,
    explanation: 'Form und Farbe liefern im Beispiel gemeinsam nützlichere Informationen als nur die Farbe.',
  },
  {
    id: 'q5',
    prompt: 'Welche Aussage über KI stimmt?',
    choices: ['Ein trainiertes KI-Modell kann sich bei neuen Beispielen irren.', 'Jedes Computerprogramm ist automatisch künstliche Intelligenz.', 'KI benötigt niemals Trainings- oder Beispieldaten.'],
    correctIndex: 0,
    explanation: 'Auch ein trainiertes Modell kann falsche Vorhersagen liefern.',
  },
]);

export const KI_MISSION_01 = Object.freeze({
  id: 'ki-01',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 1', overviewHref: '../modul-1.html#stunde-1' },
  title: 'Mission 01 – Was ist künstliche Intelligenz?',
  description: 'Entdecke, wie Maschinen aus Beispielen lernen und warum auch KI Fehler machen kann.',
  duration: 45,
  objectives: [
    'Du erklärst, wie Maschinen aus Beispielen Muster lernen.',
    'Du beschreibst, warum geeignete Trainingsdaten wichtig sind.',
    'Du erkennst, dass KI bei neuen Beispielen Fehler machen kann.',
  ],
  phases: [
    { id: 'film', title: 'Film', minutes: 18, blocks: [{ type: 'media', mediaId: 'video' }] },
    { id: 'worksheet', title: 'Arbeitsblatt', minutes: 10, blocks: [{ type: 'task', taskId: 'task-a' }, { type: 'task', taskId: 'task-b' }, { type: 'task', taskId: 'task-c' }] },
    { id: 'lab', title: 'KI-Labor', minutes: 11, blocks: [{ type: 'fruit-detector', title: 'Trainiere deinen eigenen Obst-Detektiv!' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: QUIZ_QUESTIONS.map(({ id }) => id) }], questions: QUIZ_QUESTIONS },
  ],
  media: {
    video: { url: 'https://www.planet-schule.de/thema/dennis-und-die-ki-was-ist-ki-100.html', kind: 'official-video', title: 'Was ist künstliche Intelligenz?', provider: 'Planet Schule · WDR', observation: 'Achte besonders darauf, wie die Hunde-App lernt und warum sie sich manchmal irrt.', checkboxLabel: 'Ich habe den Film angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    worksheet: { url: 'https://www.planet-schule.de/thema/dennis-ki-ab1-pdf-100.pdf', kind: 'student-worksheet' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Maschinen können aus Beispielen Muster lernen. Sie verstehen diese Muster nicht wie Menschen und können sich irren.' },
    { type: 'reflection', id: 'self-check', prompt: 'Welche Beispiele könnten einem Modell helfen, Obst zu unterscheiden?', examples: ['Bilder mit unterschiedlichen Farben', 'Bilder mit verschiedenen Formen'] },
  ],
  tasks: [
    { id: 'task-a', type: 'open-response', title: 'Aufgabe A', prompt: 'Wie konnte die Hunde-App lernen, unterschiedliche Hunderassen zu erkennen?', exampleAnswer: 'Die App lernte aus vielen beschrifteten Bildern, erkannte darin Muster und konnte anschließend neue Bilder untersuchen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-b', type: 'open-response', title: 'Aufgabe B', prompt: 'Ein Hund sieht ungewöhnlich aus und die App erkennt seine Rasse nicht richtig. Woran könnte das liegen?', exampleAnswer: 'Das ungewöhnliche Aussehen war in den Trainingsdaten vielleicht selten vertreten. Dadurch können Daten, Bedingungen oder Modellfehler die Zuordnung erschweren.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-c', type: 'gap-fill', title: 'Aufgabe C', prompt: 'Ein KI-Modell kann aus ______ Muster lernen. Anschließend kann es neue ______ untersuchen.', selfCheck: true },
  ],
  solutions: [{ taskId: 'task-c', acceptedCategories: ['examples-or-training-data', 'data-or-images'] }],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

export const LESSONS = Object.freeze({ 'ki-01': KI_MISSION_01 });

export function getLesson(id) {
  return LESSONS[id];
}

export function normalizeAnswer(value) {
  return String(value ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('de-DE').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function matchGapFill(answer) {
  const values = Array.isArray(answer) ? answer : answer && typeof answer === 'object'
    ? [answer.first, answer.second] : String(answer ?? '').split(/\s+(?:beziehungsweise|bzw\.?|und)\s+/i);
  if (values.length !== 2 || values.some((value) => !normalizeAnswer(value))) return false;
  return values.every((value, index) => {
    const tokens = new Set(normalizeAnswer(value).split(' '));
    if ([...tokens].some((token) => NEGATION_TOKENS.has(token))) return false;
    return [...GAP_CATEGORIES[index]].some((term) => tokens.has(term));
  });
}

export function scoreBand(score) {
  if (score >= 5) return { key: 'excellent', label: QUIZ_BAND_LABELS.excellent };
  if (score >= 3) return { key: 'good', label: QUIZ_BAND_LABELS.good };
  return { key: 'retry', label: QUIZ_BAND_LABELS.retry };
}

export function gradeQuiz(lesson, answers) {
  const questions = lesson?.phases?.find((phase) => phase.id === 'quiz')?.questions ?? [];
  const submitted = Array.isArray(answers) ? answers : [];
  const results = questions.map((question, index) => ({
    questionId: question.id,
    selectedIndex: submitted[index] ?? null,
    correct: submitted[index] === question.correctIndex,
    explanation: question.explanation,
  }));
  const score = results.filter((result) => result.correct).length;
  return { score, maxScore: questions.length, band: scoreBand(score), answers: submitted, results };
}

export function validateLessonDefinition(lesson) {
  if (!lesson || typeof lesson !== 'object' || !lesson.id || !lesson.module || !lesson.title || !Number.isFinite(lesson.duration)) throw new TypeError('Invalid lesson definition');
  if (!Array.isArray(lesson.objectives) || !Array.isArray(lesson.phases) || !Array.isArray(lesson.contentBlocks)) throw new TypeError('Invalid lesson definition');
  if (!Array.isArray(lesson.tasks) || !Array.isArray(lesson.solutions) || !lesson.media || !lesson.progress) throw new TypeError('Invalid lesson definition');
  if (lesson.phases.some((phase) => !phase || !phase.id || !phase.title || !Array.isArray(phase.blocks))) throw new TypeError('Invalid lesson definition');
  return true;
}
