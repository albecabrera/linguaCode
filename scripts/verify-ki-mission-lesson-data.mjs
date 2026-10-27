import assert from 'node:assert/strict';
import {
  LESSONS,
  KI_MISSION_01,
  KI_MISSION_02,
  KI_MISSION_03,
  KI_MISSION_04,
  KI_MISSION_05,
  KI_MISSION_06,
  KI_MISSION_07,
  KI_MISSION_08,
  KI_MISSION_09,
  KI_MISSION_10,
  KI_MISSION_11,
  KI_MISSION_12,
  KI_MISSION_13,
  KI_MISSION_14,
  KI_MISSION_15,
  KI_MISSION_16,
  KI_MISSION_17,
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
assert.deepEqual(Object.keys(LESSONS), ['ki-01', 'ki-02', 'ki-03', 'ki-04', 'ki-05', 'ki-06', 'ki-07', 'ki-08', 'ki-09', 'ki-10', 'ki-11', 'ki-12', 'ki-13', 'ki-14', 'ki-15', 'ki-16', 'ki-17']);
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
assert.equal(getLesson('ki-06'), KI_MISSION_06);
assert.equal(KI_MISSION_06.id, 'ki-06');
assert.equal(KI_MISSION_06.title, 'Mission 06 – Trainingsdaten und Aufteilungen');
assert.equal(KI_MISSION_06.duration, 45);
assert.deepEqual(KI_MISSION_06.context, { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 2', overviewHref: '../modul-3.html#stunde-2' });
assert.deepEqual(KI_MISSION_06.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_06.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_06.contentBlocks[0].text, /sechs.*Trainingsbeispiele.*getrennte.*Testdaten.*nicht.*Training/i);
const trainingTask = KI_MISSION_06.tasks.find(({ id }) => id === 'task-training');
const holdoutTask = KI_MISSION_06.tasks.find(({ id }) => id === 'task-holdout');
assert.match(trainingTask.exampleAnswer, /Fragen.*Schwellenwerte/i);
assert.match(holdoutTask.exampleAnswer, /weder.*Training.*Regelwahl|nicht.*Training.*Regelwahl/i);
assert.match(holdoutTask.exampleAnswer, /unabhängig/i);
assert.equal(KI_MISSION_06.media.infSchule.url, 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume');
assert.equal(KI_MISSION_06.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_06.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_06.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_06.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_06), true);
assert.equal(getLesson('ki-07'), KI_MISSION_07);
assert.equal(KI_MISSION_07.id, 'ki-07');
assert.equal(KI_MISSION_07.title, 'Mission 07 – Regeln an Testbeispielen prüfen');
assert.equal(KI_MISSION_07.duration, 45);
assert.deepEqual(KI_MISSION_07.context, { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 3', overviewHref: '../modul-3.html#stunde-3' });
assert.deepEqual(KI_MISSION_07.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_07.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_07.contentBlocks[0].text, /18\s*°C.*Testbeispiel.*bekannt.*Label/i);
const temperatureTask = KI_MISSION_07.tasks.find(({ id }) => id === 'task-temperature');
assert.match(temperatureTask.prompt, /genau 18\s*°C.*17\s*°C/i);
assert.match(temperatureTask.exampleAnswer, /18\s*°C.*Fenster offen.*17\s*°C.*Fenster zu/i);
const labelTask = KI_MISSION_07.tasks.find(({ id }) => id === 'task-label');
assert.match(labelTask.prompt, /bekannt.*Testlabel.*Vorhersage.*Label/i);
assert.match(labelTask.exampleAnswer, /Vorhersage.*Label.*überein/i);
assert.equal(KI_MISSION_07.media.infSchule.url, 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume');
assert.equal(KI_MISSION_07.media.experienceAi.url, 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4');
assert.equal(KI_MISSION_07.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_07.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_07.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_07.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_07), true);
assert.deepEqual(Object.keys(LESSONS), ['ki-01', 'ki-02', 'ki-03', 'ki-04', 'ki-05', 'ki-06', 'ki-07', 'ki-08', 'ki-09', 'ki-10', 'ki-11', 'ki-12', 'ki-13', 'ki-14', 'ki-15', 'ki-16', 'ki-17']);
assert.equal(getLesson('ki-08'), KI_MISSION_08);
assert.equal(KI_MISSION_08.id, 'ki-08');
assert.equal(KI_MISSION_08.title, 'Mission 08 – Verbessern, ohne den Test zu verraten');
assert.equal(KI_MISSION_08.duration, 45);
assert.deepEqual(KI_MISSION_08.context, { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 4', overviewHref: '../modul-3.html#stunde-4' });
assert.deepEqual(KI_MISSION_08.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_08.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_08.contentBlocks[0].text, /Trainingsbeispiele.*Merkmale.*Schwellenwerte.*Testlabels.*unverändert/i);
const improveTrainingTask = KI_MISSION_08.tasks.find(({ id }) => id === 'task-training-review');
assert.match(improveTrainingTask.prompt, /Trainingsbeispiel.*Merkmal.*Schwellenwert/i);
assert.match(improveTrainingTask.exampleAnswer, /Trainingsdaten.*Testdaten bleiben unberührt/i);
const preserveTestTask = KI_MISSION_08.tasks.find(({ id }) => id === 'task-test-integrity');
assert.match(preserveTestTask.prompt, /Testlabel.*nicht ändern/i);
assert.match(preserveTestTask.exampleAnswer, /Testlabel.*unverändert/i);
assert.equal(KI_MISSION_08.media.infSchule.url, 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume');
assert.equal(KI_MISSION_08.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_08.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_08.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_08.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_08), true);
assert.equal(getLesson('ki-09'), KI_MISSION_09);
assert.equal(KI_MISSION_09.id, 'ki-09');
assert.equal(KI_MISSION_09.title, 'Mission 09 – Muster in Beispielen entdecken');
assert.equal(KI_MISSION_09.duration, 45);
assert.equal(KI_MISSION_09.nextHint, 'In der nächsten Mission prüfst du Muster an neuen Fällen und untersuchst mögliche Ausreißer.');
assert.deepEqual(KI_MISSION_09.context, { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 1', overviewHref: '../modul-4.html#stunde-1' });
assert.deepEqual(KI_MISSION_09.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_09.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_09.contentBlocks[0].text, /gemeinsam.*Merkmal|beobachtbare.*Gemeinsamkeit/i);
assert.match(KI_MISSION_09.tasks.find(({ id }) => id === 'task-pattern').prompt, /erfund|fiktiv/i);
assert.match(KI_MISSION_09.tasks.find(({ id }) => id === 'task-pattern').exampleAnswer, /beobachtbar|Merkmal/i);
assert.match(KI_MISSION_09.contentBlocks[0].text, /beweist nicht automatisch eine Ursache/);
assert.match(KI_MISSION_09.tasks.find(({ id }) => id === 'task-similarity').exampleAnswer, /Daraus allein folgt nicht, warum/);
assert.match(KI_MISSION_09.tasks.find(({ id }) => id === 'task-apply').prompt, /ohne echte Personen/);
assert.equal(KI_MISSION_09.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_09.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_09.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_09), true);
assert.equal(getLesson('ki-10'), KI_MISSION_10);
assert.equal(KI_MISSION_10.id, 'ki-10');
assert.equal(KI_MISSION_10.title, 'Mission 10 – Muster prüfen und Ausreißer erkennen');
assert.equal(KI_MISSION_10.duration, 45);
assert.deepEqual(KI_MISSION_10.context, { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 2', overviewHref: '../modul-4.html#stunde-2' });
assert.deepEqual(KI_MISSION_10.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_10.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_10.contentBlocks[0].text, /Datenfehler.*neue Gruppe.*Grenze des aktuellen Musters/i);
const outlierTask = KI_MISSION_10.tasks.find(({ id }) => id === 'task-outlier');
assert.match(outlierTask.prompt, /fiktiv|erfunden/i);
assert.match(outlierTask.exampleAnswer, /Datenfehler.*neue Gruppe.*Grenze des aktuellen Musters/i);
assert.match(outlierTask.exampleAnswer, /lösche.*nicht einfach/i);
const outlierReviewTask = KI_MISSION_10.tasks.find(({ id }) => id === 'task-investigate');
assert.match(outlierReviewTask.prompt, /neuen.*erfundenen Beispielen/i);
assert.match(outlierReviewTask.exampleAnswer, /Abweichungen.*dokument/i);
assert.equal(KI_MISSION_10.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_10.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_10.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_10.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_10.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_10), true);
assert.deepEqual(Object.keys(LESSONS), ['ki-01', 'ki-02', 'ki-03', 'ki-04', 'ki-05', 'ki-06', 'ki-07', 'ki-08', 'ki-09', 'ki-10', 'ki-11', 'ki-12', 'ki-13', 'ki-14', 'ki-15', 'ki-16', 'ki-17']);

assert.equal(getLesson('ki-11'), KI_MISSION_11);
assert.equal(KI_MISSION_11.id, 'ki-11');
assert.equal(KI_MISSION_11.title, 'Mission 11 – Intents erkennen: Regel oder gelernte KI?');
assert.equal(KI_MISSION_11.duration, 45);
assert.deepEqual(KI_MISSION_11.context, { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 1', overviewHref: '../modul-5.html#stunde-1' });
assert.deepEqual(KI_MISSION_11.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_11.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_11.contentBlocks[0].text, /feste.*Regel.*gelernt.*Beispiele/i);
const intentRuleTask = KI_MISSION_11.tasks.find(({ id }) => id === 'task-intent-rule');
assert.match(intentRuleTask.prompt, /Pausenplan|fiktiv/i);
assert.match(intentRuleTask.exampleAnswer, /festgelegte.*Bedingung|fest.*Signal/i);
const ruleModelTask = KI_MISSION_11.tasks.find(({ id }) => id === 'task-rule-model');
assert.match(ruleModelTask.prompt, /gelabelter.*erfundener Nachrichten/i);
assert.match(ruleModelTask.exampleAnswer, /Regel.*festgelegt.*Modell.*Beispiele/i);
assert.match(ruleModelTask.exampleAnswer, /kann.*irren/i);
const safeApplyTask = KI_MISSION_11.tasks.find(({ id }) => id === 'task-apply');
assert.match(safeApplyTask.prompt, /Erfinde.*harmlose Fragen/i);
assert.match(safeApplyTask.exampleAnswer, /erfundenen Beispielen/i);
assert.match(safeApplyTask.exampleAnswer, /Echte Nachrichten oder Namen sind nicht nötig/i);
assert.equal(KI_MISSION_11.progress.localOnly, true);
assert.equal(KI_MISSION_11.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_11.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_11.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_11.resourceNotes.material.license, 'not-stated');
assert.match(KI_MISSION_11.resourceNotes.material.text, /Experience AI.*teilweise|teilweise.*Experience AI/i);
assert.equal(KI_MISSION_11.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_11), true);

assert.equal(getLesson('ki-12'), KI_MISSION_12);
assert.equal(KI_MISSION_12.id, 'ki-12');
assert.equal(KI_MISSION_12.title, 'Mission 12 – Beispiele, Lernen und Testen');
assert.equal(KI_MISSION_12.duration, 45);
assert.deepEqual(KI_MISSION_12.context, { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 2', overviewHref: '../modul-5.html#stunde-2' });
assert.deepEqual(KI_MISSION_12.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_12.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_12.contentBlocks[0].text, /gelabelte.*Beispiele.*unabhängig.*Test/i);
const labeledIntentTask = KI_MISSION_12.tasks.find(({ id }) => id === 'task-intent-examples');
assert.match(labeledIntentTask.prompt, /gelabelte.*erfundene Nachrichten/i);
assert.match(labeledIntentTask.exampleAnswer, /Intent.*Muster.*keine Garantie/i);
const unseenTestTask = KI_MISSION_12.tasks.find(({ id }) => id === 'task-unseen-test');
assert.match(unseenTestTask.prompt, /neuen.*ungesehenen.*Formulierung/i);
assert.match(unseenTestTask.exampleAnswer, /unabhängig.*Training|nicht.*Training/i);
assert.match(unseenTestTask.exampleAnswer, /Fehler|irren/i);
const fictionalApplyTask = KI_MISSION_12.tasks.find(({ id }) => id === 'task-apply');
assert.match(fictionalApplyTask.prompt, /erfundene.*Testnachricht/i);
assert.match(fictionalApplyTask.exampleAnswer, /Echte Namen.*private Nachrichten.*nicht nötig/i);
assert.equal(KI_MISSION_12.progress.localOnly, true);
assert.deepEqual(KI_MISSION_12.media, {});
assert.equal(KI_MISSION_12.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_12.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_12.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_12.resourceNotes.material.license, 'not-stated');
assert.match(KI_MISSION_12.resourceNotes.material.text, /Experience AI.*teilweise|teilweise.*Experience AI/i);
assert.equal(KI_MISSION_12.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_12), true);

assert.equal(getLesson('ki-13'), KI_MISSION_13);
assert.equal(KI_MISSION_13.id, 'ki-13');
assert.equal(KI_MISSION_13.title, 'Mission 13 – Unbekannte Eingaben sicher behandeln');
assert.equal(KI_MISSION_13.duration, 45);
assert.deepEqual(KI_MISSION_13.context, { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 3', overviewHref: '../modul-5.html#stunde-3' });
assert.deepEqual(KI_MISSION_13.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_13.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_13.contentBlocks[0].text, /keinem.*Intent.*keine Antwort erfinden.*formuliere es anders/i);
const safeFallbackTask = KI_MISSION_13.tasks.find(({ id }) => id === 'task-fallback');
assert.match(safeFallbackTask.prompt, /fiktiv.*kennt.*nicht.*keine Antwort/i);
assert.match(safeFallbackTask.exampleAnswer, /nicht verstanden.*formuliere es anders.*Nachricht nicht/i);
const wrongIntentTask = KI_MISSION_13.tasks.find(({ id }) => id === 'task-wrong-intent');
assert.match(wrongIntentTask.prompt, /erfunden|fiktiv/i);
assert.match(wrongIntentTask.exampleAnswer, /Regel.*Trainingsbeispiele.*neuen.*Beispielen/i);
const unknownInputApplyTask = KI_MISSION_13.tasks.find(({ id }) => id === 'task-apply');
assert.match(unknownInputApplyTask.prompt, /fiktiv.*unbekannt.*nicht speichern/i);
assert.match(unknownInputApplyTask.exampleAnswer, /keine echten Nachrichten.*keine.*gespeichert/i);
assert.equal(KI_MISSION_13.progress.localOnly, true);
assert.deepEqual(KI_MISSION_13.media, {});
assert.equal(KI_MISSION_13.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_13.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_13.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_13.resourceNotes.material.license, 'not-stated');
assert.match(KI_MISSION_13.resourceNotes.material.text, /Experience AI.*teilweise|teilweise.*Experience AI/i);
assert.equal(KI_MISSION_13.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_13), true);

assert.equal(getLesson('ki-14'), KI_MISSION_14);
assert.equal(KI_MISSION_14.id, 'ki-14');
assert.equal(KI_MISSION_14.title, 'Mission 14 – Behauptungen kritisch prüfen');
assert.equal(KI_MISSION_14.duration, 45);
assert.deepEqual(KI_MISSION_14.context, { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 1', overviewHref: '../modul-6.html#stunde-1' });
assert.deepEqual(KI_MISSION_14.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_14.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_14.contentBlocks[0].text, /Behauptung.*Quelle.*Belege.*Messmethode.*fairen Vergleich/i);
const claimCheckTask = KI_MISSION_14.tasks.find(({ id }) => id === 'task-claim-check');
assert.match(claimCheckTask.prompt, /fiktiv.*Behauptung/i);
assert.match(claimCheckTask.exampleAnswer, /Wer.*Quelle.*Belege.*Messmethode.*fairen Vergleich/i);
assert.match(claimCheckTask.exampleAnswer, /nicht.*alles ablehnen/i);
assert.equal(KI_MISSION_14.progress.localOnly, true);
assert.deepEqual(KI_MISSION_14.media, {});
assert.equal(KI_MISSION_14.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_14.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_14.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_14.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_14.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_14), true);

assert.equal(getLesson('ki-15'), KI_MISSION_15);
assert.equal(KI_MISSION_15.id, 'ki-15');
assert.equal(KI_MISSION_15.title, 'Mission 15 – Fehlinformation erkennen');
assert.equal(KI_MISSION_15.duration, 45);
assert.deepEqual(KI_MISSION_15.context, { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 2', overviewHref: '../modul-6.html#stunde-2' });
assert.deepEqual(KI_MISSION_15.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_15.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_15.contentBlocks[0].text, /Quelle.*Datum.*Originalinformationen/i);
assert.match(KI_MISSION_15.contentBlocks[0].text, /ändere Zahlen nicht.*Augenmaß/i);
const pauseBeforeShareTask = KI_MISSION_15.tasks.find(({ id }) => id === 'task-pause-before-share');
assert.match(pauseBeforeShareTask.prompt, /fiktiv.*Zahl.*kein Datum.*keine Quelle/i);
assert.match(pauseBeforeShareTask.exampleAnswer, /halte inne.*veröffentlicht.*wann.*nicht nach Gefühl/i);
const originalInformationTask = KI_MISSION_15.tasks.find(({ id }) => id === 'task-original-information');
assert.match(originalInformationTask.prompt, /fiktiv.*unterschiedlich.*Originalinformation/i);
assert.match(originalInformationTask.exampleAnswer, /Original.*Datum.*statt die Zahl selbst zu ändern/i);
assert.equal(KI_MISSION_15.progress.localOnly, true);
assert.deepEqual(KI_MISSION_15.media, {});
assert.equal(KI_MISSION_15.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_15.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_15.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_15.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_15.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_15), true);

assert.equal(getLesson('ki-16'), KI_MISSION_16);
assert.equal(KI_MISSION_16.id, 'ki-16');
assert.equal(KI_MISSION_16.title, 'Mission 16 – Privatsphäre schützen');
assert.equal(KI_MISSION_16.duration, 45);
assert.deepEqual(KI_MISSION_16.context, { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 3', overviewHref: '../modul-6.html#stunde-3' });
assert.deepEqual(KI_MISSION_16.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_16.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_16.contentBlocks[0].text, /nur Informationen.*wirklich nötig/i);
assert.match(KI_MISSION_16.contentBlocks[0].text, /erfundenen oder anonymisierten Beispielen/i);
const privacyDataTask = KI_MISSION_16.tasks.find(({ id }) => id === 'task-data-minimization');
assert.match(privacyDataTask.prompt, /fiktive.*App.*Namen.*Adresse.*private.*Chat/i);
assert.match(privacyDataTask.exampleAnswer, /der nötige Satz.*Namen.*Adresse.*private Chatdaten/i);
const privacySafeQuestionTask = KI_MISSION_16.tasks.find(({ id }) => id === 'task-safe-ai-question');
assert.match(privacySafeQuestionTask.prompt, /fiktiv.*persönliche.*ohne.*identifizierende Angaben/i);
assert.match(privacySafeQuestionTask.exampleAnswer, /Namen.*Schule.*allgemein.*anonymisiert/i);
assert.equal(KI_MISSION_16.progress.localOnly, true);
assert.deepEqual(KI_MISSION_16.media, {});
assert.equal(KI_MISSION_16.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_16.resourceNotes.material.status, 'unconfirmed');
assert.equal(KI_MISSION_16.resourceNotes.material.targetGrade, 'not-stated');
assert.equal(KI_MISSION_16.resourceNotes.material.license, 'not-stated');
assert.equal(KI_MISSION_16.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_16), true);

assert.equal(getLesson('ki-17'), KI_MISSION_17);
assert.equal(KI_MISSION_17.id, 'ki-17');
assert.equal(KI_MISSION_17.title, 'Mission 17 – Bias und Vorurteile untersuchen');
assert.equal(KI_MISSION_17.duration, 45);
assert.deepEqual(KI_MISSION_17.context, { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 4', overviewHref: '../modul-6.html#stunde-4' });
assert.deepEqual(KI_MISSION_17.phases.map(({ minutes }) => minutes), [10, 10, 19, 6]);
assert.equal(KI_MISSION_17.phases.reduce((total, { minutes }) => total + minutes, 0), 45);
assert.match(KI_MISSION_17.contentBlocks[0].text, /Trainingsdaten.*einseitig.*unvollständig/i);
assert.match(KI_MISSION_17.contentBlocks[0].text, /Gruppen und Situationen fehlen/i);
assert.match(KI_MISSION_17.contentBlocks[0].text, /Gesamtgenauigkeit.*Fairness/i);
const biasMissingGroupsTask = KI_MISSION_17.tasks.find(({ id }) => id === 'task-missing-groups');
assert.match(biasMissingGroupsTask.prompt, /fiktiv.*Gruppen.*Situationen.*fehlen/i);
assert.match(biasMissingGroupsTask.exampleAnswer, /Gruppen.*Verteilung.*Lücken.*nicht.*Eignung/i);
const biasMetricLimitsTask = KI_MISSION_17.tasks.find(({ id }) => id === 'task-metric-limits');
assert.match(biasMetricLimitsTask.prompt, /fiktiv.*Genauigkeit.*Gruppe/i);
assert.match(biasMetricLimitsTask.exampleAnswer, /Gesamtgenauigkeit.*Gruppen.*einzelne Kennzahl.*Fairness/i);
assert.equal(KI_MISSION_17.progress.localOnly, true);
assert.deepEqual(KI_MISSION_17.media, {});
assert.equal(KI_MISSION_17.resourceNotes.video.status, 'unconfirmed');
assert.equal(KI_MISSION_17.resourceNotes.material.status, 'candidate');
assert.equal(KI_MISSION_17.resourceNotes.material.targetGrade, '11-14');
assert.equal(KI_MISSION_17.resourceNotes.material.license, 'unverified');
assert.equal(KI_MISSION_17.resourceNotes.material.url, 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/3');
assert.equal(KI_MISSION_17.phases.at(-1).questions.length, 5);
assert.equal(validateLessonDefinition(KI_MISSION_17), true);

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
