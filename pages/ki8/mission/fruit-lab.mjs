const TRAINING_EXAMPLES = Object.freeze([
  Object.freeze({ name: 'Apfel', color: 'rot', shape: 'rund' }),
  Object.freeze({ name: 'Banane', color: 'gelb', shape: 'lang' }),
]);

const FRUIT_EXAMPLES = Object.freeze({
  banana: Object.freeze({ name: 'Banane', color: 'gelb', shape: 'lang' }),
  apple: Object.freeze({ name: 'Apfel', color: 'gelb', shape: 'rund' }),
});

const COPY = Object.freeze({
  title: 'Trainiere deinen eigenen Obst-Detektiv!',
  intro: 'Unser Obst-Detektiv ist ein vereinfachtes Lernmodell. Er zeigt, wie Beispiele und Regeln die Ergebnisse beeinflussen. In den nächsten Stunden lernen wir echte Trainingsverfahren kennen.',
  colorOnlyRule: 'Farbe: Gelb bedeutet Banane.',
  colorRules: Object.freeze(['Rot → Apfel', 'Gelb → Banane']),
  shapeRule: 'Form: Rund bedeutet Apfel.',
  colorOnlyFeedback: 'Achtung, Fehlklassifikation! Unser Modell berücksichtigt bisher nur die Farbe. Auch ein Apfel kann gelb sein.',
  improvedFeedback: 'Die zusätzliche Formregel verbessert die Vorhersage: Der gelbe, runde Apfel wird als Apfel erkannt.',
  reflectionCorrect: 'Richtig! Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.',
  reflectionIncorrect: 'Noch einmal überlegen: Zusätzliche geeignete Merkmale können die Unterscheidung verbessern.',
});

const VALID_EXAMPLES = new Set(Object.keys(FRUIT_EXAMPLES));

export function initialFruitLab() {
  return {
    selectedExample: null,
    shapeRuleEnabled: false,
    examplesApplied: false,
    reflectionAnswer: null,
    optionalText: '',
    copy: COPY,
  };
}

export function fruitLabReducer(state, action) {
  if (!isFruitLabState(state) || !action || typeof action !== 'object') return state;

  switch (action.type) {
    case 'SELECT_EXAMPLE':
      return VALID_EXAMPLES.has(action.example)
        ? { ...state, selectedExample: action.example }
        : state;
    case 'APPLY_EXAMPLES':
      return { ...state, examplesApplied: true };
    case 'ENABLE_SHAPE_RULE':
      return { ...state, shapeRuleEnabled: true };
    case 'DISABLE_SHAPE_RULE':
      return { ...state, shapeRuleEnabled: false };
    case 'SET_REFLECTION': {
      if (typeof action.answer !== 'string') return state;
      const answer = action.answer.trim().toUpperCase();
      return answer === 'A' || answer === 'B' || answer === 'C'
        ? { ...state, reflectionAnswer: answer }
        : state;
    }
    case 'SET_OPTIONAL_TEXT':
      return typeof action.text === 'string' && action.text.length <= 500
        ? { ...state, optionalText: action.text }
        : state;
    default:
      return state;
  }
}

export function deriveFruitLab(state) {
  const selectedFruit = state.selectedExample ? { ...FRUIT_EXAMPLES[state.selectedExample] } : null;
  const testPredictions = Object.fromEntries(Object.entries(FRUIT_EXAMPLES).map(([key, fruit]) => [
    key,
    {
      colorOnly: predictFruit(fruit, false),
      withShapeRule: predictFruit(fruit, state.shapeRuleEnabled),
    },
  ]));
  const colorOnlyPrediction = selectedFruit && selectedFruit.color === 'gelb' ? 'Banane' : null;
  const improvedPrediction = selectedFruit && state.shapeRuleEnabled && selectedFruit.shape === 'rund'
    ? 'Apfel'
    : colorOnlyPrediction;
  const isImproved = Boolean(selectedFruit && colorOnlyPrediction !== improvedPrediction);

  return {
    selectedFruit,
    colorOnlyPrediction,
    improvedPrediction,
    comparison: {
      isImproved,
      message: isImproved ? COPY.improvedFeedback : selectedFruit?.name === 'Apfel' ? COPY.colorOnlyFeedback : null,
    },
    reflection: {
      answer: state.reflectionAnswer,
      correct: state.reflectionAnswer === 'A',
      feedback: state.reflectionAnswer === null
        ? null
        : state.reflectionAnswer === 'A' ? COPY.reflectionCorrect : COPY.reflectionIncorrect,
    },
    examplesApplied: state.examplesApplied,
    trainingExamples: TRAINING_EXAMPLES.map((fruit) => ({ ...fruit })),
    examples: Object.fromEntries(Object.entries(FRUIT_EXAMPLES).map(([key, fruit]) => [key, { ...fruit }])),
    testPredictions,
    copy: COPY,
  };
}

function predictFruit(fruit, shapeRuleEnabled) {
  if (shapeRuleEnabled && fruit.shape === 'rund') return 'Apfel';
  if (fruit.color === 'gelb') return 'Banane';
  if (fruit.color === 'rot') return 'Apfel';
  return null;
}

function isFruitLabState(state) {
  return Boolean(
    state &&
    typeof state === 'object' &&
    (state.selectedExample === null || VALID_EXAMPLES.has(state.selectedExample)) &&
    typeof state.shapeRuleEnabled === 'boolean' &&
    typeof state.examplesApplied === 'boolean' &&
    (state.reflectionAnswer === null || ['A', 'B', 'C'].includes(state.reflectionAnswer)) &&
    typeof state.optionalText === 'string',
  );
}
