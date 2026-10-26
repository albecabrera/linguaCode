import assert from 'node:assert/strict';
import {
  LESSONS,
  KI_MISSION_01,
  gradeQuiz,
  getLesson,
  matchGapFill,
  scoreBand,
  validateLessonDefinition,
} from '../pages/ki8/mission/lesson-data.mjs';

const questions = KI_MISSION_01.phases.find((phase) => phase.id === 'quiz').questions;

assert.equal(KI_MISSION_01.id, 'ki-01');
assert.equal(KI_MISSION_01.module, 'Künstliche Intelligenz');
assert.deepEqual(KI_MISSION_01.context, { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 1', overviewHref: '../modul-1.html#stunde-1' });
assert.deepEqual(KI_MISSION_01.media.video, { url: 'https://www.planet-schule.de/thema/dennis-und-die-ki-was-ist-ki-100.html', kind: 'official-video', title: 'Was ist künstliche Intelligenz?', provider: 'Planet Schule · WDR', observation: 'Achte besonders darauf, wie die Hunde-App lernt und warum sie sich manchmal irrt.', checkboxLabel: 'Ich habe den Film angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' });
assert.equal(KI_MISSION_01.duration, 45);
assert.equal(KI_MISSION_01.phases.length, 4);
assert.deepEqual(KI_MISSION_01.phases.map((phase) => phase.minutes), [18, 10, 11, 6]);
assert.deepEqual(KI_MISSION_01.tasks.slice(0, 2).map((task) => [task.prompt, task.exampleAnswer]), [
  ['Wie konnte die Hunde-App lernen, unterschiedliche Hunderassen zu erkennen?', 'Die App lernte aus vielen beschrifteten Bildern, erkannte darin Muster und konnte anschließend neue Bilder untersuchen.'],
  ['Ein Hund sieht ungewöhnlich aus und die App erkennt seine Rasse nicht richtig. Woran könnte das liegen?', 'Das ungewöhnliche Aussehen war in den Trainingsdaten vielleicht selten vertreten. Dadurch können Daten, Bedingungen oder Modellfehler die Zuordnung erschweren.'],
]);
assert.equal(KI_MISSION_01.media.video.url, 'https://www.planet-schule.de/thema/dennis-und-die-ki-was-ist-ki-100.html');
assert.equal(KI_MISSION_01.media.worksheet.url, 'https://www.planet-schule.de/thema/dennis-ki-ab1-pdf-100.pdf');
assert.equal(Object.hasOwn(KI_MISSION_01.media, 'teacherGuide'), false);
assert.equal(getLesson('ki-01'), KI_MISSION_01);
assert.equal(validateLessonDefinition(KI_MISSION_01), true);
assert.deepEqual(Object.keys(LESSONS), ['ki-01']);

const expected = [1, 0, 2, 1, 0];
const exactQuiz = [
  ['Wie kann eine KI-App lernen, Hunderassen auf Fotos zu unterscheiden?', ['Sie verwendet ausschließlich eine feste Liste von Hundenamen.', 'Sie erkennt Muster aus vielen geeigneten Trainingsbildern.', 'Sie erkennt die Rasse immer am Dateinamen.'], 'Ein trainiertes Bilderkennungsmodell kann typische Merkmale aus vielen Beispielen lernen.'],
  ['Warum sind geeignete Trainingsdaten wichtig?', ['Weil sie einem Modell helfen, Muster zu erkennen.', 'Weil sie jedes spätere Ergebnis garantiert richtig machen.', 'Weil der Bildschirm dadurch schneller reagiert.'], 'Trainingsdaten beeinflussen, welche Muster ein Modell lernen kann. Gute Daten garantieren jedoch keine Fehlerfreiheit.'],
  ['Ein KI-Modell hat fast nur Bilder von reinrassigen Hunden gesehen. Was könnte bei einem ungewöhnlich aussehenden Mischlingshund passieren?', ['Das Modell erkennt ihn immer sicher.', 'Das Modell muss sich automatisch neu programmieren.', 'Das Modell könnte Schwierigkeiten bei der Zuordnung haben.'], 'Ungewöhnliche oder wenig vertretene Beispiele können für ein Modell schwieriger sein.'],
  ['Was haben wir beim Obst-Detektiv festgestellt?', ['Die Farbe allein reicht immer aus.', 'Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.', 'Sobald eine Regel funktioniert, kann sie nie mehr Fehler machen.'], 'Form und Farbe liefern im Beispiel gemeinsam nützlichere Informationen als nur die Farbe.'],
  ['Welche Aussage über KI stimmt?', ['Ein trainiertes KI-Modell kann sich bei neuen Beispielen irren.', 'Jedes Computerprogramm ist automatisch künstliche Intelligenz.', 'KI benötigt niemals Trainings- oder Beispieldaten.'], 'Auch ein trainiertes Modell kann falsche Vorhersagen liefern.'],
];
assert.deepEqual(questions.map((question) => [question.prompt, question.choices, question.explanation]), exactQuiz);
assert.deepEqual(questions.map((question) => question.correctIndex), expected);
assert.equal(questions.length, 5);

for (let index = 0; index < 5; index += 1) {
  const answers = expected.map((answer, questionIndex) => questionIndex === index ? (answer + 1) % 3 : answer);
  const result = gradeQuiz(KI_MISSION_01, answers);
  assert.equal(result.score, 4);
  assert.equal(result.answers.length, 5);
  assert.equal(result.results[index].correct, false);
}
assert.equal(gradeQuiz(KI_MISSION_01, expected).score, 5);
assert.equal(gradeQuiz(KI_MISSION_01, [0, 0, 0, 0, 0]).score, 2);
assert.equal(gradeQuiz(KI_MISSION_01, [1, 1, 1, 1, 1]).score, 2);
assert.equal(gradeQuiz(KI_MISSION_01, [2, 2, 2, 2, 2]).score, 1);
assert.equal(scoreBand(5).label, 'Hervorragend! Du hast die Mission erfolgreich abgeschlossen.');
assert.equal(scoreBand(4).label, 'Gut gemacht! Du hast vieles verstanden.');
assert.equal(scoreBand(3).label, 'Gut gemacht! Du hast vieles verstanden.');
assert.equal(scoreBand(2).label, 'Du hast erste wichtige Dinge gelernt. Wiederhole die Lernkarten und probiere das Quiz erneut.');
assert.equal(scoreBand(0).label, 'Du hast erste wichtige Dinge gelernt. Wiederhole die Lernkarten und probiere das Quiz erneut.');

assert.equal(matchGapFill(['Beispielen', 'Daten']), true);
assert.equal(matchGapFill('Trainingsdaten und Bilder'), true);
assert.equal(matchGapFill('vielen geeigneten Trainingsbildern und neuen Daten'), true);
assert.equal(matchGapFill({ first: 'Beispiele', second: 'Daten' }), true);
assert.equal(matchGapFill(['keine Bilder', 'Daten']), false);
assert.equal(matchGapFill(['Nichtbeispiele', 'Daten']), false);
assert.equal(matchGapFill(['keine Trainingsdaten', 'Bilder']), false);
assert.equal(matchGapFill(['Bananen', 'Farbe']), false);
assert.equal(matchGapFill(['', 'Bilder']), false);
assert.equal(matchGapFill(['Beispiele']), false);

const secondLesson = {
  id: 'ki-02', module: 'Test', title: 'Zweite Stunde', objectives: ['Objekt'], duration: 10,
  phases: [{ id: 'custom', title: 'Freie Phase', blocks: [{ type: 'prompt', text: 'Hallo' }] }],
  contentBlocks: [{ type: 'card', text: 'Beliebiger Inhalt' }], tasks: [], solutions: [], feedback: {}, media: {}, progress: { version: 1 },
};
assert.equal(validateLessonDefinition(secondLesson), true);
assert.throws(() => validateLessonDefinition({ ...secondLesson, id: '' }));

console.log('KI mission lesson data verification passed');
