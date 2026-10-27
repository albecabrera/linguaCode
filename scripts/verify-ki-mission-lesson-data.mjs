import assert from 'node:assert/strict';
import {
  LESSONS,
  KI_MISSION_01,
  KI_MISSION_02,
  KI_MISSION_03,
  KI_MISSION_04,
  KI_MISSION_05,
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
assert.equal(KI_MISSION_01.title, 'Mission 01 – Was ist künstliche Intelligenz?');
assert.equal(KI_MISSION_01.duration, 45);
assert.deepEqual(KI_MISSION_01.objectives, [
  'Du erklärst, wie Maschinen aus Beispielen Muster lernen.',
  'Du beschreibst, warum geeignete Trainingsdaten wichtig sind.',
  'Du erkennst, dass KI bei neuen Beispielen Fehler machen kann.',
]);
assert.equal(getLesson('ki-01'), KI_MISSION_01);
assert.equal(getLesson('ki-02'), KI_MISSION_02);
assert.equal(KI_MISSION_02.id, 'ki-02');
assert.equal(KI_MISSION_02.title, 'Mission 02 – Regeln, Training und Grenzen');
assert.equal(KI_MISSION_02.duration, 45);
assert.deepEqual(KI_MISSION_02.context, { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 2', overviewHref: '../modul-1.html#stunde-2' });
assert.deepEqual(KI_MISSION_02.objectives, [
  'Du unterscheidest vorgegebene Regeln von Mustern, die ein Modell aus Trainingsbeispielen lernt.',
  'Du erklärst, warum neue, ungesehene Testdaten zum Prüfen eines Modells wichtig sind.',
]);
assert.equal(KI_MISSION_02.media.video, undefined);
assert.equal(KI_MISSION_02.media.experienceAi.url, 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13');
assert.equal(KI_MISSION_02.media.klickpunktSchule.url, 'https://klickpunktschule.bycs.de/digitalkompass/startseite/ki-kompass/ki-kompass-5-8-uebersicht/ki-kompass-5-8-begleitmaterial/modul-1-wie-funktionieren-ki-systeme-begleitmaterial/maschinelles-lernen-begleitmaterial');
assert.equal(KI_MISSION_02.resourceNotes.video.status, 'unconfirmed');
assert.match(KI_MISSION_02.resourceNotes.video.text, /[Kk]ein spezifisches Video/);
assert.equal(KI_MISSION_02.resourceNotes.worksheet.status, 'confirmed-source');
assert.match(KI_MISSION_02.resourceNotes.worksheet.text, /Klasse 5–8/);
assert.deepEqual(KI_MISSION_02.phases.map((phase) => phase.minutes), [10, 10, 19, 6]);
assert.ok(KI_MISSION_02.phases.every(({ blocks }) => !blocks.some(({ type }) => type === 'media') || blocks.length === 1));
assert.equal(KI_MISSION_02.phases.at(-1).blocks[0].type, 'quiz');
assert.equal(KI_MISSION_02.phases.at(-1).questions.length, 5);
assert.ok(KI_MISSION_02.tasks.length >= 3);
assert.ok(KI_MISSION_02.phases.flatMap((phase) => phase.blocks).some((block) => block.type === 'task'));
assert.deepEqual([...new Set(KI_MISSION_02.phases.flatMap((phase) => phase.blocks).map((block) => block.type))].sort(), ['media', 'quiz', 'task']);
assert.deepEqual(KI_MISSION_02.phases.slice(0, 2).map((phase) => phase.blocks), [
  [{ type: 'media', mediaId: 'experienceAi' }],
  [{ type: 'media', mediaId: 'klickpunktSchule' }],
]);
assert.equal(validateLessonDefinition(KI_MISSION_02), true);
assert.equal(getLesson('ki-03'), KI_MISSION_03);
assert.equal(KI_MISSION_03.id, 'ki-03');
assert.equal(KI_MISSION_03.title, 'Mission 03 – Merkmale, Labels und Schwellenwerte');
assert.equal(KI_MISSION_03.duration, 45);
assert.deepEqual(KI_MISSION_03.context, { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 1', overviewHref: '../modul-2.html#stunde-1' });
assert.deepEqual(KI_MISSION_03.objectives, ['Du unterscheidest Merkmale und Labels und wendest einen Schwellenwert auf ein neues Beispiel an.']);
assert.equal(KI_MISSION_03.media.infSchule.url, 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI');
assert.equal(KI_MISSION_03.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_03.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_03.resourceNotes.material.license, 'not-stated');
assert.deepEqual(KI_MISSION_03.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_03.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.deepEqual([...new Set(KI_MISSION_03.phases.flatMap(({ blocks }) => blocks.map(({ type }) => type)))].sort(), ['media', 'quiz', 'task']);
assert.match(KI_MISSION_03.tasks.find(({ id }) => id === 'task-threshold').prompt, /Wert 7/);
assert.match(KI_MISSION_03.tasks.find(({ id }) => id === 'task-threshold').exampleAnswer, /laut/);
assert.deepEqual(KI_MISSION_03.phases.at(-1).questions.map(({ correctIndex }) => correctIndex), [0, 1, 0, 1, 1]);
assert.equal(KI_MISSION_03.phases.at(-1).questions.length, 5);
assert.deepEqual(Object.keys(LESSONS), ['ki-01', 'ki-02', 'ki-03', 'ki-04', 'ki-05']);
assert.equal(getLesson('ki-04'), KI_MISSION_04);
assert.equal(KI_MISSION_04.id, 'ki-04');
assert.equal(KI_MISSION_04.title, 'Mission 04 – Trainieren, testen und Fehler untersuchen');
assert.equal(KI_MISSION_04.duration, 45);
assert.deepEqual(KI_MISSION_04.context, { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 2', overviewHref: '../modul-2.html#stunde-2' });
assert.ok(KI_MISSION_04.objectives.some((objective) => /Trainingsdaten.*Testdaten/.test(objective)));
assert.ok(KI_MISSION_04.objectives.some((objective) => /Fehlklassifikation|Fehler/.test(objective)));
assert.deepEqual(KI_MISSION_04.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_04.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.ok(KI_MISSION_04.phases.filter(({ blocks }) => blocks.some(({ type }) => type === 'media')).every(({ blocks }) => blocks.length === 1));
assert.equal(KI_MISSION_04.media.experienceAi.url, 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4');
assert.equal(KI_MISSION_04.media.infSchule.url, 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume');
assert.equal(KI_MISSION_04.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_04.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_04.resourceNotes.material.license, 'not-stated');
assert.match(KI_MISSION_04.resourceNotes.material.text, /nicht|keine/i);
assert.match(KI_MISSION_04.tasks.find(({ id }) => id === 'task-split').exampleAnswer, /Testdaten.*nicht.*Training/i);
assert.match(KI_MISSION_04.tasks.find(({ id }) => id === 'task-error').exampleAnswer, /Fehler.*nicht.*unbrauchbar/i);
assert.deepEqual(KI_MISSION_04.phases.at(-1).questions.map(({ correctIndex }) => correctIndex), [0, 1, 0, 1, 1]);
assert.equal(KI_MISSION_04.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_04), true);
assert.equal(getLesson('ki-05'), KI_MISSION_05);
assert.equal(KI_MISSION_05.id, 'ki-05');
assert.equal(KI_MISSION_05.title, 'Mission 05 – Vom Merkmal zur ersten Regel');
assert.equal(KI_MISSION_05.duration, 45);
assert.deepEqual(KI_MISSION_05.context, { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 1', overviewHref: '../modul-3.html#stunde-1' });
assert.deepEqual(KI_MISSION_05.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_05.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_05.contentBlocks[0].text, /Merkmal.*30\s*%.*Ladepause.*weiterfahren.*7.*bereit/i);
const batteryTask = KI_MISSION_05.tasks.find(({ id }) => id === 'task-battery');
const scoreTask = KI_MISSION_05.tasks.find(({ id }) => id === 'task-score');
assert.match(batteryTask.prompt, /≤\s*30\s*%/);
assert.match(batteryTask.exampleAnswer, /30\s*%.*Ladepause.*31\s*%.*weiterfahren/i);
assert.match(scoreTask.prompt, /≥\s*7/);
assert.match(scoreTask.exampleAnswer, /6.*üben.*7.*bereit/i);
assert.equal(KI_MISSION_05.media.infSchule.url, 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI');
assert.equal(KI_MISSION_05.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_05.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_05.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_05.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_05), true);

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
