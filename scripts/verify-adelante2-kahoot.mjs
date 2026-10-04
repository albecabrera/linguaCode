import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  flattenEntries,
  isAnswerCorrect,
  makeQuizQuestion,
  progressPercent,
  searchEntries,
  scoreAnswer,
} from '../pages/adelante2-kahoot/engine.js';

const library = JSON.parse(fs.readFileSync(new URL('../pages/adelante2-kahoot/content.json', import.meta.url), 'utf8'));
const entries = flattenEntries(library);

assert.equal(library.units.length, 1, 'Es darf nur eine Start-Unidad geben.');
assert.equal(library.units[0].id, 'unidad-1');
assert.equal(entries.length, 34, 'Unidad 1 muss genau 34 Startvokabeln enthalten.');
assert.equal(entries.filter((entry) => entry.unitId === 'unidad-2').length, 0);
assert.equal(entries.find((entry) => entry.spanish === 'practicar deporte')?.special, 'c-qu');
assert.equal(entries.find((entry) => entry.spanish === 'probar algo')?.special, '-ue-');
assert.equal(entries.find((entry) => entry.spanish === 'dar un paseo')?.special, 'irr.');

const spanishSearch = searchEntries(entries, { query: 'situación' });
assert.equal(spanishSearch.length, 1);
assert.equal(spanishSearch[0].german, 'die Lage; die Situation');
assert.equal(searchEntries(entries, { query: 'Verkehrsschild' })[0].spanish, 'la señal');
assert.equal(searchEntries(entries, { block: 'bloque-a' }).length, 11);
assert.equal(searchEntries(entries, { unit: 'unidad-1', type: 'vocabulario' }).length, 34);

const ria = entries.find((entry) => entry.spanish === 'la ría');
assert.equal(isAnswerCorrect('la ría', ria), true);
assert.equal(isAnswerCorrect('la ria', ria), false, 'Fehlende Akzente müssen als falsch gelten.');
assert.equal(isAnswerCorrect('die Situation', entries.find((entry) => entry.spanish === 'la situación'), 'german'), true);

const sample = entries.slice(0, 5);
for (const kind of ['spanishToGerman', 'germanToSpanish', 'trueFalse', 'typeSpanish', 'typeGerman']) {
  const question = makeQuizQuestion(sample[0], sample, kind, () => 0.9);
  assert.equal(question.kind, kind);
}
const clozeEntry = { ...sample[0], example: { sentence: 'Wir besuchen die autonome Region.', direction: 'german' } };
assert.equal(makeQuizQuestion(clozeEntry, sample, 'cloze').kind, 'cloze');
assert.ok(scoreAnswer(true, 100) > scoreAnswer(true, 5000));
assert.equal(scoreAnswer(false, 0), 0);
assert.equal(progressPercent({ [sample[0].id]: { known: true } }, sample), 20);

console.log(`adelante2-Kahoot-Prüfung erfolgreich: ${entries.length} Einträge, Suche, Akzentprüfung, Fragetypen und Punkteberechnung.`);
