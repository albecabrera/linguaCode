const pairs = [
  ['necesitar ayuda', 'Hilfe benötigen'],
  ['resolver una tarea administrativa', 'eine Verwaltungsangelegenheit erledigen'],
  ['seleccionar información', 'Informationen auswählen'],
  ['la información importante', 'die wichtige Information'],
  ['resumir', 'zusammenfassen'],
  ['el resumen', 'die Zusammenfassung'],
  ['explicar', 'erklären'],
  ['comentar', 'kommentieren'],
  ['describir', 'beschreiben'],
  ['mencionar', 'erwähnen'],
  ['los recursos naturales', 'die natürlichen Ressourcen'],
  ['participar en decisiones', 'an Entscheidungen teilnehmen'],
  ['la participación', 'die Beteiligung / Mitbestimmung'],
  ['la discriminación', 'die Diskriminierung'],
  ['la demanda', 'die Forderung'],
  ['defenderse', 'sich verteidigen'],
  ['las formas de lucha', 'die Formen des Widerstands'],
  ['el procedimiento jurídico', 'das Gerichtsverfahren / rechtliche Verfahren'],
  ['la protesta pública', 'der öffentliche Protest'],
  ['luchar por la tierra', 'für das Land kämpfen'],
  ['la salud', 'die Gesundheit'],
  ['el equilibrio', 'das Gleichgewicht'],
  ['la enfermedad', 'die Krankheit'],
  ['la medicina tradicional', 'die traditionelle Medizin'],
  ['la medicina moderna', 'die moderne Medizin'],
  ['la planta medicinal', 'die Heilpflanze'],
  ['la machi', 'die traditionelle Heilerin / spirituelle Autorität der Mapuche'],
  ['el pueblo originario', 'das indigene Volk'],
  ['el pueblo mapuche', 'das Volk der Mapuche'],
  ['la gente de la tierra', 'die Menschen des Landes / der Erde'],
  ['la tierra', 'das Land / die Erde'],
  ['el territorio', 'das Gebiet / Territorium'],
  ['acompañar', 'begleiten'],
  ['la atención intercultural', 'die interkulturelle Versorgung'],
  ['respetar', 'die Achtung haben vor / respektieren'],
  ['las costumbres', 'die Bräuche'],
  ['los conocimientos', 'das Wissen / die Kenntnisse'],
  ['mejorar el diálogo', 'den Dialog verbessern'],
  ['la convivencia', 'das Zusammenleben'],
  ['el escribidor', 'der öffentliche Schreiber / Schreibhelfer'],
  ['el escribano', 'der Schreiber'],
  ['la comunidad', 'die Gemeinschaft'],
  ['la identidad', 'die Identität'],
  ['la lengua', 'die Sprache'],
  ['la memoria', 'das Gedächtnis / die Erinnerung'],
  ['la generación', 'die Generation'],
  ['transmitir', 'weitergeben / überliefern'],
  ['la naturaleza', 'die Natur'],
  ['la espiritualidad', 'die Spiritualität'],
  ['la conquista', 'die Eroberung'],
  ['el conquistador', 'der Eroberer'],
  ['el evangelista', 'der Schreiber / öffentliche Schreibhelfer'],
  ['escribir por encargo', 'im Auftrag schreiben'],
  ['el oficio', 'der Beruf / das Handwerk'],
  ['el oficio centenario', 'der jahrhundertealte Beruf'],
  ['la profesión', 'der Beruf'],
  ['la profesión moribunda', 'der aussterbende Beruf'],
  ['la máquina de escribir', 'die Schreibmaschine'],
  ['la oficina', 'das Büro'],
  ['la oficina móvil', 'das mobile Büro'],
  ['la llegada', 'die Ankunft'],
  ['someter', 'unterwerfen'],
  ['resistir', 'Widerstand leisten'],
  ['la resistencia', 'der Widerstand'],
  ['la sociedad', 'die Gesellschaft'],
  ['estar formado por', 'aus ... bestehen'],
  ['el parentesco', 'die Verwandtschaft'],
  ['el cliente', 'der Kunde'],
  ['prestar un servicio', 'eine Dienstleistung erbringen'],
  ['redactar', 'verfassen'],
  ['redactar una carta', 'einen Brief verfassen'],
  ['la carta de amor', 'der Liebesbrief'],
  ['la factura', 'die Rechnung'],
  ['el documento oficial', 'das offizielle Dokument'],
  ['los papeles', 'die Unterlagen / Papiere'],
  ['leer un documento', 'ein Dokument lesen'],
  ['explicar un texto', 'einen Text erklären'],
  ['el analfabeto / la analfabeta', 'der Analphabet / die Analphabetin'],
  ['el analfabetismo', 'der Analphabetismus'],
  ['la tasa de analfabetismo', 'die Analphabetenquote'],
  ['el invidente / la invidente', 'der sehbehinderte / blinde Mensch'],
  ['el profesional independiente', 'der Selbstständige'],
  ['la mecanografía', 'das Maschinenschreiben'],
  ['la demanda ha disminuido', 'die Nachfrage ist zurückgegangen'],
  ['la autonomía', 'die Autonomie'],
  ['el lonko', 'das Oberhaupt einer Mapuche-Gemeinschaft'],
  ['dirigir', 'leiten / führen'],
  ['organizar alianzas', 'Bündnisse organisieren'],
  ['resolver conflictos', 'Konflikte lösen'],
  ['administrar tierras', 'Ländereien verwalten'],
  ['los derechos', 'die Rechte'],
  ['el derecho de propiedad', 'das Eigentumsrecht'],
  ['el derecho de posesión', 'das Besitzrecht'],
  ['reconocer derechos', 'Rechte anerkennen'],
  ['proteger derechos', 'Rechte schützen'],
  ['reclamar derechos', 'Rechte fordern'],
  ['la restitución de tierras', 'die Rückgabe von Land'],
  ['la devolución de tierras', 'die Rückgabe von Land'],
  ['proteger los recursos', 'Ressourcen schützen']
];

const aliasGroups = [
  ['el escribidor', 'el escribano', 'el evangelista'],
  ['el oficio', 'la profesión'],
  ['la restitución de tierras', 'la devolución de tierras']
];
const aliasGroupFor = spanish => aliasGroups.find(group => group.includes(spanish)) || [];

const makeQuestion = ([spanish, german], index, random = () => 0.5) => {
  const spanishToGerman = index % 2 === 0;
  const prompt = spanishToGerman ? `Was bedeutet «${spanish}»?` : `Wie heißt „${german}“?`;
  const answer = spanishToGerman ? german : spanish;
  const group = aliasGroupFor(spanish);
  const candidates = pairs.filter(pair => {
    if (pair[0] === spanish) return false;
    if (group.includes(pair[0])) return false;
    const candidate = spanishToGerman ? pair[1] : pair[0];
    return candidate !== answer;
  });
  const uniqueCandidates = [...new Map(candidates.map(pair => {
    const option = spanishToGerman ? pair[1] : pair[0];
    return [option, pair];
  })).values()];
  const distractors = shuffle(uniqueCandidates, random).slice(0, 3).map(pair => spanishToGerman ? pair[1] : pair[0]);
  const options = shuffle([answer, ...distractors], random);
  return { prompt, options, correct: options.indexOf(answer), spanish, german, direction: spanishToGerman ? 'es-de' : 'de-es' };
};
const makeQuestions = (random = () => 0.5) => pairs.map((pair, index) => makeQuestion(pair, index, random));

export const questions = makeQuestions();
export const vocabulary = pairs.map(([spanish, german]) => ({ spanish, german }));

function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createGame(random = Math.random) {
  const gameQuestions = shuffle(pairs, random).map((pair, index) => makeQuestion(pair, index, random));
  return { phase: 'playing', position: 0, winner: null, questions: gameQuestions, teams: [0, 1].map(() => ({ index: 0, score: 0, feedback: null })) };
}
function finish(game) {
  if (Math.abs(game.position) >= 5 || game.teams.every(t => t.index >= game.questions.length)) {
    game.phase = 'finished';
    game.winner = game.position === 0 ? null : game.position < 0 ? 0 : 1;
  }
}
export function answer(game, team, index, choice) {
  const state = game.teams[team];
  if (game.phase !== 'playing' || !state || state.feedback || state.index !== index || !game.questions[index] || !Number.isInteger(choice) || choice < 0 || choice > 3) return false;
  const correct = game.questions[index].correct === choice;
  state.feedback = { correct, choice };
  if (correct) { state.score++; game.position += team === 0 ? -1 : 1; }
  finish(game);
  return true;
}
export function advance(game, team) {
  const state = game.teams[team];
  if (game.phase !== 'playing' || !state?.feedback) return false;
  state.index++;
  state.feedback = null;
  finish(game);
  return true;
}
