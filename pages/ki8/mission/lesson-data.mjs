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

const KI_MISSION_02_QUESTIONS = Object.freeze([
  {
    id: 'q1',
    prompt: 'Welche Aussage beschreibt eine feste Regel?',
    choices: ['Wenn die Ampel rot ist, halte an.', 'Das Modell findet selbst häufige Formen in Beispielen.', 'Das Modell probiert neue Daten aus.'],
    correctIndex: 0,
    explanation: 'Eine feste Regel wird von Menschen vorgegeben und gilt nach ihrer Formulierung direkt.',
  },
  {
    id: 'q2',
    prompt: 'Woran erkennt man ein trainiertes Muster?',
    choices: ['Es wurde aus vielen Beispielen gelernt.', 'Es ist immer als Satz im Programm aufgeschrieben.', 'Es funktioniert nur bei genau einem bekannten Beispiel.'],
    correctIndex: 0,
    explanation: 'Ein Modell kann Muster aus Trainingsbeispielen lernen, ohne dass jede einzelne Entscheidung als Regel notiert wurde.',
  },
  {
    id: 'q3',
    prompt: 'Warum braucht man ungesehene Testdaten?',
    choices: ['Damit das Modell mehr Trainingsdaten bekommt.', 'Damit man prüft, ob das Modell auch bei neuen Beispielen funktioniert.', 'Damit feste Regeln nicht mehr gelten.'],
    correctIndex: 1,
    explanation: 'Ungesehene Testdaten zeigen, ob ein Modell verallgemeinern kann und nicht nur bekannte Beispiele auswendig gelernt hat.',
  },
  {
    id: 'q4',
    prompt: 'Was ist eine mögliche Grenze eines Modells?',
    choices: ['Es kann bei neuen oder seltenen Beispielen Fehler machen.', 'Es kann niemals falsche Antworten geben.', 'Es braucht keine passenden Trainingsbeispiele.'],
    correctIndex: 0,
    explanation: 'Wenn neue Beispiele anders sind als die Trainingsdaten, kann ein Modell Schwierigkeiten haben.',
  },
  {
    id: 'q5',
    prompt: 'Welche Reihenfolge passt zu einem fairen Test?',
    choices: ['Testen, trainieren, Testdaten verändern.', 'Trainieren, mit neuen Testdaten prüfen, Ergebnis besprechen.', 'Eine Regel auswendig lernen, dann alle Antworten vorgeben.'],
    correctIndex: 1,
    explanation: 'Erst lernt das Modell aus Trainingsdaten; danach prüft man es mit getrennten, neuen Testdaten.',
  },
]);

export const KI_MISSION_02 = Object.freeze({
  id: 'ki-02',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 2', overviewHref: '../modul-1.html#stunde-2' },
  title: 'Mission 02 – Regeln, Training und Grenzen',
  description: 'Vergleiche feste Regeln mit gelernten Mustern und prüfe, warum ungesehene Testdaten wichtig sind.',
  duration: 45,
  objectives: [
    'Du unterscheidest vorgegebene Regeln von Mustern, die ein Modell aus Trainingsbeispielen lernt.',
    'Du erklärst, warum neue, ungesehene Testdaten zum Prüfen eines Modells wichtig sind.',
  ],
  phases: [
    { id: 'rules', title: 'Regel oder gelerntes Muster?', minutes: 10, blocks: [{ type: 'media', mediaId: 'experienceAi' }] },
    { id: 'materials', title: 'Maschinelles Lernen entdecken', minutes: 10, blocks: [{ type: 'media', mediaId: 'klickpunktSchule' }] },
    { id: 'practice', title: 'Training und Testdaten anwenden', minutes: 19, blocks: [{ type: 'task', taskId: 'task-rules' }, { type: 'task', taskId: 'task-training' }, { type: 'task', taskId: 'task-pattern' }, { type: 'task', taskId: 'task-testing' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_02_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_02_QUESTIONS },
  ],
  media: {
    experienceAi: { url: 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13', kind: 'official-lesson', title: 'Maschinelles Lernen: Regeln und Daten', provider: 'Experience AI', observation: 'Lies, wie regelbasierte und datenbasierte Systeme Probleme unterschiedlich lösen.', checkboxLabel: 'Ich habe die Quelle angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    klickpunktSchule: { url: 'https://klickpunktschule.bycs.de/digitalkompass/startseite/ki-kompass/ki-kompass-5-8-uebersicht/ki-kompass-5-8-begleitmaterial/modul-1-wie-funktionieren-ki-systeme-begleitmaterial/maschinelles-lernen-begleitmaterial', kind: 'official-material-page', title: 'Maschinelles Lernen: Begleitmaterial', provider: 'Klickpunkt Schule', observation: 'Die Seite bietet eine Weblektion und Materialhinweise für die Klassen 5–8. Nutze nur die verlinkte Quelle.', checkboxLabel: 'Ich habe die Materialseite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein spezifisches Video für diese Stunde ist bestätigt; es wird kein Video zugewiesen.' },
    worksheet: { status: 'confirmed-source', text: 'Eine passende Materialseite für Klasse 5–8 ist bestätigt und oben verlinkt; Arbeitsblätter werden nicht kopiert oder eingebettet.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Eine feste Regel wird von Menschen vorgegeben. Ein Modell kann dagegen Muster aus Trainingsbeispielen lernen. Mit neuen, ungesehenen Testdaten prüfen wir, ob es auch außerhalb der Übungsbeispiele funktioniert.' },
    { type: 'reflection', id: 'self-check', prompt: 'Woran würdest du merken, dass ein Modell nur bekannte Beispiele auswendig gelernt hat?', examples: ['Bei neuen Beispielen macht es deutlich mehr Fehler.', 'Die Testdaten wurden beim Training schon verwendet.'] },
  ],
  tasks: [
    { id: 'task-rules', type: 'open-response', title: 'Selbst-Check: Regel oder Muster?', prompt: 'Eine Sortierhilfe sagt: „Alles mit einem roten Aufkleber kommt in Kiste A.“ Ist das eine feste Regel oder ein gelerntes Muster? Begründe deine Antwort.', exampleAnswer: 'Das ist eine feste Regel, weil sie von Menschen vorgegeben ist und direkt auf die Farbe des Aufklebers angewendet wird.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-training', type: 'open-response', title: 'Training planen', prompt: 'Du möchtest ein Modell trainieren, Äpfel und Birnen auf Bildern zu unterscheiden. Nenne zwei Merkmale oder Beispiele, die im Training vorkommen sollten.', exampleAnswer: 'Zum Beispiel Bilder von Äpfeln und Birnen mit unterschiedlichen Farben, Formen und Größen. Beide Obstsorten sollten in verschiedenen Varianten vorkommen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-pattern', type: 'gap-fill', title: 'Begriffe sichern', prompt: 'Ein Modell lernt aus ______. Seine Antworten werden mit neuen ______ geprüft.', selfCheck: true },
    { id: 'task-testing', type: 'open-response', title: 'Warum testen?', prompt: 'Warum sollte ein Modell nicht nur mit den Beispielen geprüft werden, die es schon im Training gesehen hat? Erkläre es mit einem eigenen Beispiel.', exampleAnswer: 'Mit neuen Testdaten sieht man, ob das Modell ein Muster gelernt hat. Wenn es nur bekannte Bilder richtig sortiert, könnte es diese auswendig gelernt haben und bei einem neuen Bild scheitern.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [{ taskId: 'task-pattern', acceptedCategories: ['examples-or-training-data', 'data-or-images'] }],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

export const LESSONS = Object.freeze({ 'ki-01': KI_MISSION_01, 'ki-02': KI_MISSION_02 });

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
