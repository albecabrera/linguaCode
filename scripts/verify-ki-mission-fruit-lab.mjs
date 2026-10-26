import assert from 'node:assert/strict';
import { deriveFruitLab, fruitLabReducer, initialFruitLab } from '../pages/ki8/mission/fruit-lab.mjs';

const initial = initialFruitLab();
assert.equal(initial.selectedExample, null);
assert.equal(initial.shapeRuleEnabled, false);
assert.equal(initial.examplesApplied, false);
assert.equal(initial.reflectionAnswer, null);
assert.equal(initial.optionalText, '');
assert.equal(initial.copy.title, 'Trainiere deinen eigenen Obst-Detektiv!');
assert.deepEqual(initial.copy.colorRules, ['Rot → Apfel', 'Gelb → Banane']);
assert.deepEqual(deriveFruitLab(initial).trainingExamples, [
  { name: 'Apfel', color: 'rot', shape: 'rund' },
  { name: 'Banane', color: 'gelb', shape: 'lang' },
]);
assert.deepEqual(deriveFruitLab(initial).testPredictions, {
  banana: { colorOnly: 'Banane', withShapeRule: 'Banane' },
  apple: { colorOnly: 'Banane', withShapeRule: 'Banane' },
});
assert.equal(
  initial.copy.intro,
  'Unser Obst-Detektiv ist ein vereinfachtes Lernmodell. Er zeigt, wie Beispiele und Regeln die Ergebnisse beeinflussen. In den nächsten Stunden lernen wir echte Trainingsverfahren kennen.',
);

const banana = fruitLabReducer(initial, {
  type: 'SELECT_EXAMPLE',
  example: 'banana',
});
assert.equal(banana.selectedExample, 'banana');
assert.deepEqual(deriveFruitLab(banana).selectedFruit, {
  name: 'Banane',
  color: 'gelb',
  shape: 'lang',
});
assert.equal(deriveFruitLab(banana).colorOnlyPrediction, 'Banane');
assert.equal(deriveFruitLab(banana).improvedPrediction, 'Banane');
assert.equal(banana.examplesApplied, false);

const applied = fruitLabReducer(banana, { type: 'APPLY_EXAMPLES' });
assert.equal(applied.examplesApplied, true);
assert.equal(deriveFruitLab(applied).examplesApplied, true);

const apple = fruitLabReducer(applied, {
  type: 'SELECT_EXAMPLE',
  example: 'apple',
});
const colorOnly = deriveFruitLab(apple);
assert.equal(colorOnly.colorOnlyPrediction, 'Banane');
assert.equal(colorOnly.improvedPrediction, 'Banane');
assert.equal(colorOnly.comparison.isImproved, false);
assert.equal(colorOnly.comparison.message, 'Achtung, Fehlklassifikation! Unser Modell berücksichtigt bisher nur die Farbe. Auch ein Apfel kann gelb sein.');

const withShape = fruitLabReducer(apple, { type: 'ENABLE_SHAPE_RULE' });
const improved = deriveFruitLab(withShape);
assert.equal(withShape.shapeRuleEnabled, true);
assert.equal(improved.colorOnlyPrediction, 'Banane');
assert.equal(improved.improvedPrediction, 'Apfel');
assert.equal(improved.comparison.isImproved, true);
assert.equal(improved.comparison.message, 'Die zusätzliche Formregel verbessert die Vorhersage: Der gelbe, runde Apfel wird als Apfel erkannt.');
assert.deepEqual(improved.testPredictions, {
  banana: { colorOnly: 'Banane', withShapeRule: 'Banane' },
  apple: { colorOnly: 'Banane', withShapeRule: 'Apfel' },
});

const reflectionA = fruitLabReducer(withShape, {
  type: 'SET_REFLECTION',
  answer: 'A',
});
assert.equal(deriveFruitLab(reflectionA).reflection.correct, true);
assert.equal(deriveFruitLab(reflectionA).reflection.feedback, 'Richtig! Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.');
const reflectionLowercase = fruitLabReducer(withShape, {
  type: 'SET_REFLECTION',
  answer: 'a',
});
assert.equal(deriveFruitLab(reflectionLowercase).reflection.correct, true);
const reflectionWrong = fruitLabReducer(withShape, {
  type: 'SET_REFLECTION',
  answer: 'B',
});
assert.equal(deriveFruitLab(reflectionWrong).reflection.correct, false);
assert.equal(deriveFruitLab(reflectionWrong).reflection.feedback, 'Noch einmal überlegen: Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.');
const reflectionC = fruitLabReducer(withShape, {
  type: 'SET_REFLECTION',
  answer: 'C',
});
assert.equal(reflectionC.reflectionAnswer, 'C');
assert.equal(deriveFruitLab(reflectionC).reflection.correct, false);
assert.equal(deriveFruitLab(reflectionC).reflection.feedback, 'Noch einmal überlegen: Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.');

const withText = fruitLabReducer(reflectionA, {
  type: 'SET_OPTIONAL_TEXT',
  text: 'Die Form hilft zusätzlich.',
});
assert.equal(withText.optionalText, 'Die Form hilft zusätzlich.');
assert.equal(fruitLabReducer(withText, { type: 'SET_OPTIONAL_TEXT', text: '' }).optionalText, '');
assert.equal(fruitLabReducer(withText, { type: 'SET_OPTIONAL_TEXT', text: ' '.repeat(500) }).optionalText, ' '.repeat(500));

for (const action of [
  null,
  {},
  { type: 'SELECT_EXAMPLE', example: 'pear' },
  { type: 'SELECT_EXAMPLE', example: '' },
  { type: 'SET_REFLECTION', answer: 'D' },
  { type: 'SET_REFLECTION', answer: '' },
  { type: 'SET_OPTIONAL_TEXT', text: 42 },
  { type: 'SET_OPTIONAL_TEXT', text: 'x'.repeat(501) },
  { type: 'UNKNOWN' },
]) {
  assert.deepEqual(fruitLabReducer(withText, action), withText, `invalid action changed state: ${JSON.stringify(action)}`);
}

const states = [initial, banana, applied, apple, withShape, reflectionA, reflectionC, withText];
for (const state of states) {
  const before = structuredClone(state);
  deriveFruitLab(state);
  assert.deepEqual(state, before, 'deriveFruitLab must not mutate state');
}

console.log('fruit lab verification passed');
