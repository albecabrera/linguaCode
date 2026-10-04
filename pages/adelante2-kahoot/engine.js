export const flattenEntries = (library) => (library?.units || []).flatMap((unit) =>
  (unit.contents || []).map((entry) => ({ ...entry, unitId: unit.id, unitLabel: unit.label }))
);

export const displaySpanish = (entry) => entry.displaySpanish || entry.spanish;

export const normalizeAnswer = (value) => String(value ?? '')
  .normalize('NFC')
  .trim()
  .replace(/\s+/g, ' ')
  .toLocaleLowerCase('de-DE');

export const acceptedAnswers = (entry, direction) => {
  const value = direction === 'german' ? entry.german : entry.spanish;
  return String(value).split(';').map((answer) => normalizeAnswer(answer));
};

export const isAnswerCorrect = (answer, entry, direction = 'spanish') =>
  acceptedAnswers(entry, direction).includes(normalizeAnswer(answer));

export const searchEntries = (entries, filters = {}) => {
  const term = normalizeAnswer(filters.query || '');
  return entries.filter((entry) => {
    const matches = [entry.spanish, entry.displaySpanish, entry.german, ...(entry.tags || []), entry.special]
      .filter(Boolean)
      .some((value) => normalizeAnswer(value).includes(term));
    return (!term || matches)
      && (!filters.unit || entry.unitId === filters.unit)
      && (!filters.type || entry.type === filters.type)
      && (!filters.block || entry.block === filters.block);
  });
};

export const shuffle = (items, random = Math.random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
};

const distractors = (entry, entries, field, count = 3) => shuffle(
  entries.filter((candidate) => candidate.id !== entry.id && candidate[field] !== entry[field]),
).slice(0, count).map((candidate) => candidate[field]);

export const makeQuizQuestion = (entry, entries, kind = 'spanishToGerman', random = Math.random) => {
  if (kind === 'spanishToGerman' || kind === 'germanToSpanish') {
    const promptField = kind === 'spanishToGerman' ? 'spanish' : 'german';
    const answerField = kind === 'spanishToGerman' ? 'german' : 'spanish';
    const options = shuffle([entry[answerField], ...distractors(entry, entries, answerField)], random);
    return { kind, entry, prompt: promptField === 'spanish' ? displaySpanish(entry) : entry.german, options, answer: entry[answerField] };
  }
  if (kind === 'trueFalse') {
    const correct = random() >= 0.5;
    const other = shuffle(entries.filter((candidate) => candidate.id !== entry.id && candidate.german !== entry.german), random)[0] || entry;
    return { kind, entry, prompt: displaySpanish(entry), statement: correct ? entry.german : other.german, answer: correct };
  }
  if (kind === 'typeSpanish') return { kind, entry, prompt: entry.german, answer: entry.spanish };
  if (kind === 'typeGerman') return { kind, entry, prompt: displaySpanish(entry), answer: entry.german };
  if (kind === 'cloze' && entry.example?.sentence) {
    const direction = entry.example.direction || 'spanish';
    const term = direction === 'spanish' ? entry.spanish : entry.german.split(';')[0];
    return { kind, entry, prompt: entry.example.sentence.replace(term, '____'), answer: term, direction };
  }
  return makeQuizQuestion(entry, entries, 'spanishToGerman', random);
};

export const scoreAnswer = (correct, elapsedMs = 0, maxPoints = 1000) => {
  if (!correct) return 0;
  return Math.max(100, maxPoints - Math.min(maxPoints - 100, Math.floor(Math.max(0, elapsedMs) / 100)));
};

export const progressPercent = (progress, entries) => {
  if (!entries.length) return 0;
  const known = entries.filter((entry) => progress?.[entry.id]?.known).length;
  return Math.round((known / entries.length) * 100);
};
