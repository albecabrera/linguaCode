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

const KI_MISSION_03_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Eine Klangkiste misst die Lautstärke. Was ist das Merkmal und was sind die Labels?', choices: ['Merkmal: Lautstärke; Labels: „leise“ und „laut“.', 'Merkmal: „leise“; Label: die Lautstärke.', 'Merkmal und Label bedeuten immer dasselbe.'], correctIndex: 0, explanation: 'Das Merkmal ist der beobachtete Wert. Ein Label ist die zugeordnete Kategorie.' },
  { id: 'q2', prompt: 'Mit dem Schwellenwert 6 gilt: Wert ≤ 6 → „leise“, Wert > 6 → „laut“. Welches Label erhält Wert 7?', choices: ['leise', 'laut', 'Das lässt sich mit einem Schwellenwert nicht entscheiden.'], correctIndex: 1, explanation: '7 ist größer als 6, deshalb lautet das Label „laut“.' },
  { id: 'q3', prompt: 'Mit derselben Regel: Welches Label erhält genau den Wert 6?', choices: ['leise', 'laut', 'Es gibt kein Label für den Grenzwert.'], correctIndex: 0, explanation: 'Die Regel sagt „Wert ≤ 6“; deshalb gehört auch 6 noch zu „leise“.' },
  { id: 'q4', prompt: 'Welche Aussage beschreibt ein Label?', choices: ['Die gemessene Lautstärke als Zahl.', 'Die Kategorie, die einer Beobachtung zugeordnet wird.', 'Ein Beweis, dass die Entscheidung immer stimmt.'], correctIndex: 1, explanation: '„Leise“ und „laut“ sind Kategorien, also Labels. Ein Label garantiert keine fehlerfreie Entscheidung.' },
  { id: 'q5', prompt: 'Was bewirkt ein Schwellenwert in der Klangkiste?', choices: ['Er entfernt die gemessenen Werte.', 'Er trennt die Werte in die Labels „leise“ und „laut“.', 'Er sorgt dafür, dass jedes Testbeispiel richtig ist.'], correctIndex: 1, explanation: 'Der Schwellenwert legt fest, an welcher Grenze sich das zugeordnete Label ändert.' },
]);

export const KI_MISSION_03 = Object.freeze({
  id: 'ki-03',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 1', overviewHref: '../modul-2.html#stunde-1' },
  title: 'Mission 03 – Merkmale, Labels und Schwellenwerte',
  description: 'Unterscheide beobachtete Merkmale von Labels und wende eine klare Schwellenwert-Regel auf neue Werte an.',
  duration: 45,
  objectives: ['Du unterscheidest Merkmale und Labels und wendest einen Schwellenwert auf ein neues Beispiel an.'],
  phases: [
    { id: 'material', title: 'Lernstrecke: Entscheide wie eine KI', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'features', title: 'Merkmale und Labels', minutes: 10, blocks: [{ type: 'task', taskId: 'task-feature' }] },
    { id: 'threshold', title: 'Schwellenwert anwenden', minutes: 19, blocks: [{ type: 'task', taskId: 'task-threshold' }, { type: 'task', taskId: 'task-boundary' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_03_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_03_QUESTIONS },
  ],
  media: {
    infSchule: { url: 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI', kind: 'official-learning-sequence', title: 'Entscheide wie eine KI', provider: 'inf-schule', observation: 'Die Lernstrecke nutzt Lebensmittelbeispiele und behandelt überwachtes Lernen, Schwellenwerte und Entscheidungsbäume. Sie empfiehlt vorher die Lernstrecke „Lernende Systeme“.', checkboxLabel: 'Ich habe die Lernstrecke angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Für diese Stunde wurde kein spezifisches Video bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die ergänzende inf-schule-Lernstrecke ist verlinkt; Zieljahrgang und Lizenz sind auf der geprüften Seite nicht genannt.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Ein Merkmal ist ein beobachteter Wert. Ein Label ist die Kategorie, die ihm zugeordnet wird. Ein Schwellenwert teilt Werte nach einer Regel in Labels ein.' },
    { type: 'reflection', id: 'threshold-reflection', prompt: 'Warum muss die Regel genau sagen, was am Schwellenwert selbst passiert?', examples: ['Damit klar ist, zu welchem Label der Grenzwert gehört.', 'Hier gehört 6 wegen „≤ 6“ noch zum Label „leise“.'] },
  ],
  tasks: [
    { id: 'task-feature', type: 'open-response', title: 'Merkmal oder Label?', prompt: 'Eine fiktive Klangkiste nutzt die Lautstärke eines Klatschens als Merkmal. Das Label „leise“ steht für Werte bis einschließlich 6, „laut“ für Werte über 6. Was ist hier das Merkmal und was sind die Labels?', exampleAnswer: 'Das Merkmal ist die gemessene Lautstärke. „Leise“ und „laut“ sind die Labels, also die Kategorien.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-threshold', type: 'open-response', title: 'Neues Beispiel testen', prompt: 'Mit dem Schwellenwert 6 gilt: Wert ≤ 6 → „leise“, Wert > 6 → „laut“. Welches Label erhält das neue Testbeispiel mit Wert 7? Begründe deine Entscheidung.', exampleAnswer: 'Das Label lautet „laut“, weil 7 größer als der Schwellenwert 6 ist.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-boundary', type: 'open-response', title: 'Grenzwert prüfen', prompt: 'Welches Label erhält der genaue Grenzwert 6? Erkläre, welches Zeichen in der Regel dafür entscheidend ist.', exampleAnswer: 'Der Wert 6 erhält das Label „leise“, weil die Regel „Wert ≤ 6“ den Grenzwert einschließt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_04_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Wozu dienen Trainingsdaten beim Erstellen eines Entscheidungsbaums?', choices: ['Sie helfen, passende Merkmale und Schwellenwerte zu finden.', 'Sie beweisen, dass jede spätere Vorhersage stimmt.', 'Sie ersetzen die Testdaten.'], correctIndex: 0, explanation: 'Trainingsdaten helfen, Regeln und Schwellenwerte für die bekannten Beispiele zu finden.' },
  { id: 'q2', prompt: 'Warum nutzen wir getrennte, neue Testdaten?', choices: ['Damit das Modell mehr Zeit zum Lernen hat.', 'Damit wir prüfen, ob es auch bei neuen Beispielen funktioniert.', 'Damit das Modell die Testlabels schon beim Training sieht.'], correctIndex: 1, explanation: 'Getrennte Testdaten zeigen, ob das Modell mit ungesehenen Beispielen zurechtkommt.' },
  { id: 'q3', prompt: 'Ein Testobjekt hat das Label „gesund“, das Modell sagt aber „ungesund“. Was ist passiert?', choices: ['Dieses Testobjekt wurde falsch klassifiziert.', 'Das Modell hat sich selbst neu programmiert.', 'Die Testdaten sind jetzt Trainingsdaten.'], correctIndex: 0, explanation: 'Vorhersage und bekanntes Label stimmen bei diesem Testobjekt nicht überein.' },
  { id: 'q4', prompt: 'Was ist ein fairer Umgang mit einem Fehler im Test?', choices: ['Das Testlabel ändern, bis die Vorhersage stimmt.', 'Den Fehler notieren und weitere getrennte Testbeispiele prüfen.', 'Das fehlerhafte Beispiel aus allen Auswertungen entfernen.'], correctIndex: 1, explanation: 'Ein Test soll unabhängig bleiben; das Testlabel wird nicht passend gemacht.' },
  { id: 'q5', prompt: 'Beweist eine einzelne falsche Testvorhersage, dass das Modell unbrauchbar ist?', choices: ['Ja, ein Fehler beweist immer, dass kein Modell helfen kann.', 'Nein. Sie zeigt einen Fehler bei diesem Beispiel; weitere Ergebnisse helfen bei der Beurteilung.', 'Ja, denn Testdaten dürfen nie Fehler enthalten.'], correctIndex: 1, explanation: 'Ein Fehler ist ein wichtiger Hinweis, aber allein kein Beweis, dass ein Modell insgesamt unbrauchbar ist.' },
]);

export const KI_MISSION_04 = Object.freeze({
  id: 'ki-04',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 2', overviewHref: '../modul-2.html#stunde-2' },
  title: 'Mission 04 – Trainieren, testen und Fehler untersuchen',
  description: 'Trenne Trainings- und Testdaten und untersuche, was eine falsche Vorhersage wirklich zeigt.',
  duration: 45,
  objectives: [
    'Du unterscheidest Trainingsdaten von getrennten Testdaten.',
    'Du beschreibst eine Fehlklassifikation und erklärst, warum ein einzelner Fehler ein Modell nicht automatisch unbrauchbar macht.',
  ],
  phases: [
    { id: 'decision-trees', title: 'Entscheidungsbäume kennenlernen', minutes: 10, blocks: [{ type: 'media', mediaId: 'experienceAi' }] },
    { id: 'training-and-test', title: 'Training und Test unterscheiden', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'investigate-errors', title: 'Fehler untersuchen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-split' }, { type: 'task', taskId: 'task-error' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_04_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_04_QUESTIONS },
  ],
  media: {
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion erklärt, wie Entscheidungsbäume Klassifizierungsmodelle bilden und wie Trainingsdaten ein Modell verändern.', checkboxLabel: 'Ich habe die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite erklärt Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler bei ungeeigneten Daten.', checkboxLabel: 'Ich habe die Seite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein geeignetes, spezifisches Video für diese Stunde wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die verlinkten Seiten erläutern Entscheidungsbäume, Trainingsdaten und Testobjekte. Zieljahrgang und Lizenz sind auf den geprüften Seiten nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Beim Training sucht ein Modell passende Merkmale und Schwellenwerte in bekannten Beispielen. Mit getrennten, ungesehenen Testdaten prüfen wir, ob die Vorhersage auch bei neuen Beispielen funktioniert. Eine falsche Vorhersage ist ein Fehler, aber kein Beweis, dass das ganze Modell unbrauchbar ist.' },
    { type: 'reflection', id: 'test-reflection', prompt: 'Warum sollte ein Testbeispiel nach dem Test nicht einfach zum Trainingsbeispiel werden?', examples: ['Sonst wäre es nicht mehr unabhängig und würde nicht zeigen, wie das Modell mit neuen Beispielen umgeht.'] },
  ],
  tasks: [
    { id: 'task-split', type: 'open-response', title: 'Training und Test trennen', prompt: 'Ein Modell wird mit bekannten, gelabelten Beispielen trainiert. Warum prüfen wir es danach mit neuen Testbeispielen, die es beim Training nicht gesehen hat?', exampleAnswer: 'Getrennte Testdaten zeigen, ob das gelernte Muster auch bei neuen Beispielen funktioniert. Testdaten werden nicht zum Training oder zum Anpassen der Regel verwendet. Werden sie dafür genutzt, prüfen wir das Modell nicht mehr unabhängig.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-error', type: 'open-response', title: 'Eine Fehlklassifikation untersuchen', prompt: 'Bei einem getrennten Test sagt ein Modell „ungesund“ voraus, das bekannte Label lautet aber „gesund“. Was kannst du daraus schließen – und was noch nicht?', exampleAnswer: 'Das Modell hat dieses Testobjekt falsch klassifiziert. Der Fehler ist ein Hinweis, den wir mit weiteren unabhängigen Testbeispielen untersuchen. Allein beweist er nicht, dass das Modell unbrauchbar ist; das Testlabel darf nicht passend geändert werden.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_05_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Was ist bei der fiktiven Lieferregel das Merkmal?', choices: ['Die Akkuladung in Prozent.', 'Das Label „Ladepause“.', 'Der Name des Roboters.'], correctIndex: 0, explanation: 'Die Akkuladung ist der beobachtete Wert und damit das Merkmal.' },
  { id: 'q2', prompt: 'Welche Aussage ordnet die Labels richtig zu?', choices: ['„Ladepause“ und „weiterfahren“ sind Labels.', 'Die Zahl 30 ist immer das Label.', 'Der Robotername ist das Merkmal.'], correctIndex: 0, explanation: 'Labels sind die Kategorien, die einer Beobachtung zugeordnet werden.' },
  { id: 'q3', prompt: 'Die Regel lautet: bis einschließlich 30 % → „Ladepause“, darüber → „weiterfahren“. Was gilt bei genau 30 %?', choices: ['Ladepause.', 'Weiterfahren.', 'Die Regel enthält für 30 % keine Entscheidung.'], correctIndex: 0, explanation: '„Bis einschließlich 30 %“ schließt den Grenzwert 30 % ein.' },
  { id: 'q4', prompt: 'Eine Lernkarte mit Punktzahl 7 wird nach der Regel „ab 7 → bereit“ eingeordnet. Welches Label erhält sie?', choices: ['bereit', 'üben', 'kein Label'], correctIndex: 0, explanation: '„Ab 7“ bedeutet 7 oder mehr; deshalb erhält die Karte das Label „bereit“.' },
  { id: 'q5', prompt: 'Was macht ein Schwellenwert in einer einfachen Regel?', choices: ['Er trennt Werte danach, welches Label sie erhalten.', 'Er beweist, dass jede Vorhersage immer stimmt.', 'Er löscht die beobachteten Merkmale.'], correctIndex: 0, explanation: 'Ein Schwellenwert legt fest, an welcher Grenze sich die zugeordnete Kategorie ändert.' },
]);

export const KI_MISSION_05 = Object.freeze({
  id: 'ki-05',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 1', overviewHref: '../modul-3.html#stunde-1' },
  title: 'Mission 05 – Vom Merkmal zur ersten Regel',
  description: 'Verbinde ein beobachtetes Merkmal mit einem Label und untersuche, was genau an einem Schwellenwert gilt.',
  duration: 45,
  objectives: [
    'Du unterscheidest das Merkmal von den Labels einer Regel.',
    'Du wendest die Grenzen ≤30 % und ≥7 korrekt an.',
  ],
  phases: [
    { id: 'thresholds', title: 'Schwellenwerte entdecken', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'feature-and-label', title: 'Merkmal und Labels unterscheiden', minutes: 10, blocks: [{ type: 'task', taskId: 'task-feature' }] },
    { id: 'apply-rules', title: 'Grenzwerte anwenden', minutes: 19, blocks: [{ type: 'task', taskId: 'task-battery' }, { type: 'task', taskId: 'task-score' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_05_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_05_QUESTIONS },
  ],
  media: {
    infSchule: { url: 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI', kind: 'official-learning-sequence', title: 'Entscheide wie eine KI', provider: 'inf-schule', observation: 'Die Lernstrecke behandelt überwachtes Lernen, Schwellenwerte und Entscheidungsbäume. Nutze die Abschnitte zu Merkmalen und Regeln.', checkboxLabel: 'Ich habe die Lernstrecke angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Für diese Stunde wurde kein spezifisches Video bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die inf-schule-Lernstrecke zu Merkmalen, Schwellenwerten und Entscheidungsbäumen ist verlinkt. Zieljahrgang und Lizenz sind auf der geprüften Seite nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Ein Merkmal ist ein beobachteter Wert; ein Label ist die zugeordnete Kategorie. Bei einer fiktiven Lieferregel gilt bis einschließlich 30 % „Ladepause“ und darüber „weiterfahren“. Bei Lernkarten bedeutet eine Punktzahl ab 7 das Label „bereit“; darunter heißt es „üben“. Die Grenzwerte selbst gehören also jeweils zu „Ladepause“ und „bereit“.' },
    { type: 'reflection', id: 'boundary-reflection', prompt: 'Warum sind die Wörter „bis einschließlich“ und „ab“ wichtig?', examples: ['Sie zeigen, ob der Grenzwert selbst noch zur Kategorie gehört.', 'Genau 30 % ist noch „Ladepause“; genau 7 ist schon „bereit“.'] },
  ],
  tasks: [
    { id: 'task-feature', type: 'open-response', title: 'Merkmal oder Label?', prompt: 'Eine fiktive Lieferregel nutzt die Akkuladung in Prozent. Bis einschließlich 30 % lautet das Label „Ladepause“, darüber „weiterfahren“. Was ist das Merkmal und was sind die Labels?', exampleAnswer: 'Das Merkmal ist die Akkuladung in Prozent. „Ladepause“ und „weiterfahren“ sind die Labels.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-battery', type: 'open-response', title: 'Grenzwert bei der Akkuladung', prompt: 'Die Regel lautet: Akkuladung ≤ 30 % → „Ladepause“, darüber → „weiterfahren“. Welches Label erhält ein Roboter bei genau 30 % und welches bei 31 %?', exampleAnswer: 'Bei 30 % gilt „Ladepause“, weil ≤ den Grenzwert einschließt. Bei 31 % gilt „weiterfahren“, weil der Wert über 30 % liegt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-score', type: 'open-response', title: 'Grenzwert bei Lernkarten', prompt: 'Eine Karte erhält ab einer Punktzahl ≥ 7 das Label „bereit“, darunter „üben“. Welches Label erhalten die Punktzahlen 6 und 7?', exampleAnswer: 'Bei 6 heißt das Label „üben“. Bei 7 heißt es „bereit“, weil ≥ den Grenzwert einschließt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_06_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Wozu dienen Trainingsdaten beim Erstellen eines Entscheidungsbaums?', choices: ['Sie helfen, passende Merkmale und Schwellenwerte zu finden.', 'Sie beweisen, dass jede spätere Vorhersage stimmt.', 'Sie ersetzen die Testdaten.'], correctIndex: 0, explanation: 'Trainingsbeispiele helfen, Regeln für bekannte Fälle zu finden; sie garantieren keine fehlerfreie Vorhersage.' },
  { id: 'q2', prompt: 'Warum werden einige gelabelte Beispiele als Testdaten zurückgehalten?', choices: ['Damit der fertige Baum an ungesehenen Fällen geprüft werden kann.', 'Damit der Baum die Testlabels beim Training auswendig lernt.', 'Damit nur die einfachsten Beispiele gezählt werden.'], correctIndex: 0, explanation: 'Getrennte Testdaten zeigen, wie eine Regel bei Beispielen funktioniert, die beim Training nicht verwendet wurden.' },
  { id: 'q3', prompt: 'Was passiert, wenn Testdaten bereits beim Trainieren oder Auswählen der Regel benutzt wurden?', choices: ['Der Test ist nicht mehr unabhängig.', 'Der Baum wird dadurch automatisch fehlerfrei.', 'Die Testlabels verschwinden.'], correctIndex: 0, explanation: 'Wenn Testdaten in Training oder Regelwahl einfließen, prüfen sie die Regel nicht mehr unabhängig.' },
  { id: 'q4', prompt: 'Eine fiktive Sortierkiste hat sechs gelabelte Trainingsbeispiele. Was können sie leisten?', choices: ['Sie helfen, passende Fragen und Schwellenwerte zu finden.', 'Sie beweisen, dass jede neue Sortierung richtig sein wird.', 'Sie ersetzen neue Testbeispiele.'], correctIndex: 0, explanation: 'Trainingsbeispiele helfen beim Finden von Regeln, sind aber kein Beweis für richtige Vorhersagen auf neuen Fällen.' },
  { id: 'q5', prompt: 'Welche Reihenfolge hält Training und Test auseinander?', choices: ['Mit Trainingsbeispielen Regeln finden, danach getrennte ungesehene Testbeispiele prüfen.', 'Erst Testbeispiele ansehen, dann ihre Labels beim Training verwenden.', 'Testlabels nach jeder Vorhersage passend verändern.'], correctIndex: 0, explanation: 'Erst wird mit Trainingsdaten eine Regel gefunden; danach wird sie mit unabhängigen, ungesehenen Testdaten geprüft.' },
]);

export const KI_MISSION_06 = Object.freeze({
  id: 'ki-06',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 2', overviewHref: '../modul-3.html#stunde-2' },
  title: 'Mission 06 – Trainingsdaten und Aufteilungen',
  description: 'Finde heraus, wie gelabelte Trainingsbeispiele Regeln unterstützen und warum getrennte Testdaten außen vor bleiben.',
  duration: 45,
  objectives: [
    'Du erklärst, wie Trainingsdaten beim Finden von Entscheidungsregeln helfen.',
    'Du begründest, warum ungesehene Testbeispiele nicht zum Training oder zur Regelwahl gehören.',
  ],
  phases: [
    { id: 'training-data', title: 'Trainingsdaten verstehen', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'holdout-test', title: 'Testdaten getrennt halten', minutes: 10, blocks: [{ type: 'media', mediaId: 'experienceAi' }] },
    { id: 'split-examples', title: 'Training und Test aufteilen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-training' }, { type: 'task', taskId: 'task-holdout' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_06_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_06_QUESTIONS },
  ],
  media: {
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite erklärt Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler bei ungeeigneten Daten.', checkboxLabel: 'Ich habe die Seite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion behandelt Entscheidungsbäume und zeigt, wie Trainingsdaten ein Modell beeinflussen.', checkboxLabel: 'Ich habe die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein geeignetes, spezifisches Video für diese Stunde wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die verlinkten Lernseiten behandeln überwachte Entscheidungsbäume, Trainingsbeispiele und Testobjekte. Zieljahrgang und Lizenz sind auf den geprüften Seiten nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Sechs gelabelte Trainingsbeispiele einer fiktiven Sortierkiste helfen, passende Fragen und Schwellenwerte zu finden. Einige getrennte Testdaten bleiben außen vor, bis die Regel geprüft wird. Sie wurden im Training nicht verwendet und dürfen weder in das Training noch in die Regelwahl einfließen; nur so bleiben sie ein unabhängiger Test.' },
    { type: 'reflection', id: 'split-reflection', prompt: 'Was wäre anders, wenn die Regel schon mit den Testbeispielen ausgewählt würde?', examples: ['Dann würden die Beispiele nicht mehr unabhängig prüfen, ob die Regel mit ungesehenen Fällen funktioniert.'] },
  ],
  tasks: [
    { id: 'task-training', type: 'open-response', title: 'Wozu trainieren?', prompt: 'Eine fiktive Sortierkiste hat sechs bereits gelabelte Trainingsbeispiele. Wozu dienen sie beim Trainieren eines Entscheidungsbaums?', exampleAnswer: 'Sie helfen, geeignete Fragen und Schwellenwerte für Regeln zu finden. Sie beweisen nicht, dass jede Vorhersage auf einem neuen Beispiel stimmt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-holdout', type: 'open-response', title: 'Testbeispiele zurückhalten', prompt: 'Warum bleiben einige gelabelte Beispiele getrennt, bis der Baum fertig trainiert ist? Was darf nicht mit diesen Testbeispielen gemacht werden?', exampleAnswer: 'Sie prüfen, ob die gefundene Regel auch bei ungesehenen Beispielen funktioniert. Die getrennten Testbeispiele dürfen weder zum Training noch zur Regelwahl verwendet werden. Sonst wären sie nicht mehr unabhängig.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_07_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Welche Vorhersage macht der Baum bei 21 °C?', choices: ['Fenster offen.', 'Fenster zu.', 'Ohne Trainingswert gibt es keine Vorhersage.'], correctIndex: 0, explanation: '21 °C liegt über dem Schwellenwert von 18 °C. Der Baum sagt „Fenster offen“ voraus.' },
  { id: 'q2', prompt: 'Welches Label sagt der Baum bei genau 18 °C voraus?', choices: ['Fenster offen.', 'Fenster zu.', 'Der Schwellenwert gilt nur oberhalb von 18 °C.'], correctIndex: 0, explanation: 'Die Regel lautet Temperatur ≥ 18 °C. Der Grenzwert selbst gehört also zur Gruppe „Fenster offen“.' },
  { id: 'q3', prompt: 'Der Baum sagt „Fenster offen“, das bekannte Testlabel lautet „Fenster zu“. Was zeigt der Vergleich?', choices: ['Eine Fehlklassifikation: Vorhersage und bekanntes Label unterscheiden sich.', 'Der Test hat kein Label.', 'Die Testdaten müssen umbenannt werden.'], correctIndex: 0, explanation: 'Der vorhergesagte Wert stimmt nicht mit dem bekannten Testlabel überein. Das ist eine Fehlklassifikation.' },
  { id: 'q4', prompt: 'Warum vergleichen wir eine Vorhersage mit einem bekannten Testlabel?', choices: ['Um zu prüfen, ob die Regel dieses Beispiel richtig einordnet.', 'Um das Testlabel passend zur Vorhersage zu ändern.', 'Um Testbeispiele nachträglich ins Training einzubauen.'], correctIndex: 0, explanation: 'Das bekannte Label zeigt, ob die Vorhersage für das Testbeispiel stimmt; es bleibt dabei unverändert.' },
  { id: 'q5', prompt: 'Was darf nach einem Fehler beim Testen nicht passieren?', choices: ['Das bekannte Testlabel ändern, damit die Regel richtig erscheint.', 'Die Vorhersage mit dem Label vergleichen.', 'Die Grenze der Regel untersuchen.'], correctIndex: 0, explanation: 'Ein echtes Testlabel bleibt unverändert. So bleibt die Prüfung aussagekräftig.' },
]);

export const KI_MISSION_07 = Object.freeze({
  id: 'ki-07',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 3', overviewHref: '../modul-3.html#stunde-3' },
  title: 'Mission 07 – Regeln an Testbeispielen prüfen',
  description: 'Wende eine Schwellenwertregel auf Temperaturbeispiele an und vergleiche ihre Vorhersage mit dem bekannten Testlabel.',
  duration: 45,
  objectives: ['Du wendest die Regel Temperatur ≥ 18 °C auf ein Beispiel an.', 'Du vergleichst eine Vorhersage mit dem bekannten Testlabel.', 'Du erkennst eine Fehlklassifikation, ohne das Testlabel zu verändern.'],
  phases: [
    { id: 'threshold', title: 'Die Temperaturregel lesen', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'decision-tree', title: 'Einem Entscheidungsbaum folgen', minutes: 10, blocks: [{ type: 'media', mediaId: 'experienceAi' }] },
    { id: 'test-examples', title: 'Vorhersage und Label vergleichen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-temperature' }, { type: 'task', taskId: 'task-label' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_07_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_07_QUESTIONS },
  ],
  media: {
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite erklärt Schwellenwerte, Testobjekte und den Vergleich von Vorhersagen mit Labels.', checkboxLabel: 'Ich habe die Seite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion behandelt Entscheidungsbäume und wie sie Beispiele klassifizieren.', checkboxLabel: 'Ich habe die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein geeignetes, spezifisches Video für diese Stunde wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die verlinkten Seiten behandeln Entscheidungsbäume, Schwellenwerte und Testbeispiele. Zieljahrgang und Lizenz sind auf den geprüften Seiten nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Ein fiktiver Baum entscheidet nach der Regel Temperatur ≥ 18 °C: Bei Ja sagt er „Fenster offen“, sonst „Fenster zu“. Prüfe neue Testbeispiele, indem du die Vorhersage mit ihrem bekannten Label vergleichst. Ändere das Testlabel nicht: Der Vergleich soll zeigen, ob die Regel stimmt oder eine Fehlklassifikation macht.' },
    { type: 'reflection', id: 'test-reflection', prompt: 'Was lernst du, wenn die Vorhersage nicht mit dem bekannten Testlabel übereinstimmt?', examples: ['Die Regel hat dieses Beispiel falsch eingeordnet. Das Testlabel bleibt unverändert; der Fehler zeigt eine Grenze der Regel.'] },
  ],
  tasks: [
    { id: 'task-temperature', type: 'open-response', title: 'Schwellenwert anwenden', prompt: 'Die Regel lautet Temperatur ≥ 18 °C → „Fenster offen“, sonst „Fenster zu“. Was sagt sie bei genau 18 °C und bei 17 °C voraus?', exampleAnswer: 'Bei genau 18 °C gilt ≥ 18, also sagt der Baum „Fenster offen“. Bei 17 °C liegt der Wert unterhalb des Schwellenwerts, also sagt er „Fenster zu“.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-label', type: 'open-response', title: 'Vorhersage mit Label vergleichen', prompt: 'Der Baum sagt für 16 °C „Fenster offen“ voraus. Das bekannte Testlabel lautet „Fenster zu“. Stimmen Vorhersage und Label überein, und was darfst du mit dem Testlabel tun?', exampleAnswer: 'Nein. Vorhersage und bekanntes Label stimmen nicht überein; das ist eine Fehlklassifikation. Das Testlabel bleibt unverändert.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_08_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Welche Beispiele dürfen beim Überarbeiten einer Regel helfen?', choices: ['Die gelabelten Trainingsbeispiele.', 'Die Testlabels, bis alle Antworten stimmen.', 'Nur Beispiele, bei denen der Baum schon richtig liegt.'], correctIndex: 0, explanation: 'Regeln und Merkmale werden anhand der Trainingsdaten überprüft und überarbeitet.' },
  { id: 'q2', prompt: 'Was muss mit bekannten Testlabels passieren?', choices: ['Sie bleiben unverändert.', 'Sie werden an die Vorhersage angepasst.', 'Sie werden beim Training als Merkmale verwendet.'], correctIndex: 0, explanation: 'Ein Testlabel darf nicht angepasst werden, damit die Prüfung unabhängig bleibt.' },
  { id: 'q3', prompt: 'Warum darf man Testdaten nicht zum Aussuchen eines Schwellenwerts nutzen?', choices: ['Sonst sind sie nicht mehr unabhängig für den Test.', 'Weil Testdaten keine Labels haben.', 'Weil Schwellenwerte keine Zahlen enthalten.'], correctIndex: 0, explanation: 'Wer die Testdaten zur Regelwahl nutzt, passt die Regel an bekannte Prüffälle an.' },
  { id: 'q4', prompt: 'Eine Regel macht bei neuen Fällen Fehler. Was ist ein sinnvoller nächster Schritt?', choices: ['Trainingsbeispiele und passende Merkmale prüfen.', 'Fehlerhafte Testlabels umschreiben.', 'Die Testfälle aus dem Ergebnis löschen.'], correctIndex: 0, explanation: 'Die Trainingsdaten können auf passende Beispiele und Merkmale untersucht werden; Testlabels bleiben unberührt.' },
  { id: 'q5', prompt: 'Was macht einen späteren Test aussagekräftig?', choices: ['Getrennte Testbeispiele werden erst nach der Regelwahl verwendet.', 'Die Testbeispiele werden zuerst zum Training hinzugefügt.', 'Die Testlabels werden so geändert, dass alle Vorhersagen stimmen.'], correctIndex: 0, explanation: 'Ein unabhängiger Test prüft die fertige Regel an Beispielen, die nicht zur Auswahl oder Anpassung dienten.' },
]);

export const KI_MISSION_08 = Object.freeze({
  id: 'ki-08',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 4', overviewHref: '../modul-3.html#stunde-4' },
  title: 'Mission 08 – Verbessern, ohne den Test zu verraten',
  description: 'Untersuche Trainingsbeispiele, Merkmale und Schwellenwerte, ohne bekannte Testlabels oder Testdaten zur Regelwahl zu verwenden.',
  duration: 45,
  objectives: [
    'Du untersuchst Trainingsbeispiele und passende Merkmale, um eine Regel zu verbessern.',
    'Du erklärst, warum Testdaten getrennt bleiben und Testlabels unverändert sein müssen.',
  ],
  phases: [
    { id: 'improve', title: 'Fehler als Hinweis verstehen', minutes: 10, blocks: [{ type: 'media', mediaId: 'experienceAi' }] },
    { id: 'training-data', title: 'Trainingsdaten und Regeln prüfen', minutes: 10, blocks: [{ type: 'media', mediaId: 'infSchule' }] },
    { id: 'practice', title: 'Verbessern, ohne Testdaten zu verraten', minutes: 19, blocks: [{ type: 'task', taskId: 'task-training-review' }, { type: 'task', taskId: 'task-test-integrity' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_08_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_08_QUESTIONS },
  ],
  media: {
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion erklärt, wie Entscheidungsbäume aus Trainingsdaten entstehen und warum Beispiele die Regel beeinflussen.', checkboxLabel: 'Ich habe die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite behandelt Trainingsbeispiele, Schwellenwerte und die Prüfung von Entscheidungsregeln.', checkboxLabel: 'Ich habe die Seite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein geeignetes, spezifisches Video für diese Stunde wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die verlinkten Seiten behandeln Entscheidungsbäume und Trainingsdaten. Zieljahrgang und Lizenz sind auf den geprüften Seiten nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Eine Regel darf verbessert werden, wenn Trainingsbeispiele, Merkmale oder Schwellenwerte dafür sprechen. Testbeispiele bleiben getrennt: Sie werden weder zum Training noch zur Auswahl der Regel verwendet. Bekannte Testlabels bleiben unverändert, damit der spätere Test unabhängig bleibt.' },
    { type: 'reflection', id: 'test-integrity-reflection', prompt: 'Warum wäre es unfair, nach einem Testfehler das bekannte Testlabel oder die Regel passend zu ändern?', examples: ['Dann würde die Testprüfung ihre Unabhängigkeit verlieren. Verbesserungen müssen sich auf Trainingsdaten stützen; der Test bleibt unverändert.'] },
  ],
  tasks: [
    { id: 'task-training-review', type: 'open-response', title: 'Trainingsbeispiele prüfen', prompt: 'Eine fiktive Sortierregel macht Fehler. Welche Trainingsbeispiele, Merkmale oder Schwellenwerte könntest du prüfen, bevor du eine Regel änderst?', exampleAnswer: 'Ich prüfe, ob die Trainingsbeispiele unterschiedliche Fälle enthalten und ob das Merkmal zur Aufgabe passt. Eine Änderung der Regel stütze ich auf Trainingsdaten und teste sie später unabhängig; die getrennten Testdaten bleiben unberührt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-test-integrity', type: 'open-response', title: 'Testlabel schützen', prompt: 'Bei einem Test stimmt die Vorhersage nicht mit dem bekannten Testlabel überein. Was darfst du nicht ändern, und worauf muss sich eine mögliche Verbesserung stützen?', exampleAnswer: 'Das bekannte Testlabel bleibt unverändert und Testdaten werden nicht zum Aussuchen der Regel verwendet. Eine mögliche Verbesserung stützt sich auf Trainingsbeispiele, Merkmale oder Schwellenwerte; danach prüft ein unabhängiger Test die Regel.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_09_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Was ist ein Muster in mehreren Beispielen?', choices: ['Eine gemeinsame, beobachtbare Eigenschaft.', 'Eine Vermutung über den Namen der Beispiele.', 'Ein Beweis dafür, warum die Beispiele entstanden sind.'], correctIndex: 0, explanation: 'Ein Muster beschreibt eine wiederkehrende Beziehung oder beobachtbare Gemeinsamkeit.' },
  { id: 'q2', prompt: 'Eine fiktive Sortiermaschine ordnet 2, 4, 6 und 8 als „gerade“ ein. Welches Merkmal passt zu allen vier Zahlen?', choices: ['Alle lassen sich ohne Rest durch 2 teilen.', 'Alle sind größer als 10.', 'Alle wurden am selben Tag aufgeschrieben.'], correctIndex: 0, explanation: 'Die Teilbarkeit durch 2 ist ein beobachtbares gemeinsames Merkmal.' },
  { id: 'q3', prompt: 'Drei erfundene Geräusche sind kurz und hell. Was ist ein guter nächster Schritt?', choices: ['Die gemeinsamen Merkmale beschreiben und mit weiteren Beispielen prüfen.', 'Aus den Dateinamen sicher auf die Ursache schließen.', 'Das abweichende Geräusch umbenennen, bis es passt.'], correctIndex: 0, explanation: 'Merkmale lassen sich vergleichen und an weiteren Beispielen prüfen; Namen belegen keine Ursache.' },
  { id: 'q4', prompt: 'Was zeigt ein Muster zunächst?', choices: ['Eine beobachtete Gemeinsamkeit, nicht automatisch eine Ursache.', 'Dass die Beispiele denselben Namen haben müssen.', 'Dass jedes neue Beispiel sicher dazugehört.'], correctIndex: 0, explanation: 'Ein Muster fasst Beobachtungen zusammen. Es erklärt nicht automatisch, wodurch sie verursacht wurden.' },
  { id: 'q5', prompt: 'Wie kann eine Gruppe ein Muster fair beschreiben?', choices: ['Mit neutralen, erfundenen Beispielen und klaren beobachtbaren Merkmalen.', 'Nur mit den Namen der Beispiele.', 'Mit einer Ursache, die nicht untersucht wurde.'], correctIndex: 0, explanation: 'Neutrale Beispiele und klare Merkmale machen sichtbar, worauf sich das Muster stützt.' },
]);

export const KI_MISSION_09 = Object.freeze({
  id: 'ki-09',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 1', overviewHref: '../modul-4.html#stunde-1' },
  title: 'Mission 09 – Muster in Beispielen entdecken',
  description: 'Vergleiche erfundene Beispiele, beschreibe gemeinsame beobachtbare Merkmale und vermeide unbelegte Aussagen über Namen oder Ursachen.',
  duration: 45,
  nextHint: 'In der nächsten Mission prüfst du Muster an neuen Fällen und untersuchst mögliche Ausreißer.',
  objectives: [
    'Du beschreibst gemeinsame, beobachtbare Merkmale in erfundenen Beispielen.',
    'Du erklärst, dass ein beobachtetes Muster allein keine Ursache beweist.',
  ],
  phases: [
    { id: 'observe', title: 'Beispiele genau ansehen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-pattern' }] },
    { id: 'compare', title: 'Gemeinsame Merkmale vergleichen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-similarity' }] },
    { id: 'apply', title: 'Ein Muster fair beschreiben', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_09_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_09_QUESTIONS },
  ],
  media: {},
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein passendes Video für Mustererkennung in Beispielen wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'unconfirmed', targetGrade: 'not-stated', license: 'not-stated', text: 'Kein passendes externes Material wurde für diese Stunde bestätigt. Die Aufgaben verwenden eigenständige, erfundene Beispiele.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Ein Muster beschreibt eine wiederkehrende Beziehung oder gemeinsame Eigenschaft. Wir vergleichen beobachtbare Merkmale in erfundenen Beispielen. Ein Muster benennt zunächst eine Gemeinsamkeit; es beweist nicht automatisch eine Ursache.' },
    { type: 'reflection', id: 'pattern-reflection', prompt: 'Warum sollte eine Beschreibung sagen, was wir beobachtet haben, statt eine Ursache zu erfinden?', examples: ['Beobachtbare Merkmale lassen sich an Beispielen prüfen. Eine Ursache muss gesondert untersucht werden.'] },
  ],
  tasks: [
    { id: 'task-pattern', type: 'open-response', title: 'Ein gemeinsames Merkmal finden', prompt: 'Eine fiktive Sortiermaschine sieht die Zahlen 2, 4, 6 und 8 und ordnet sie als „gerade“ ein. Welches beobachtbare Merkmal haben alle vier Zahlen gemeinsam?', exampleAnswer: 'Alle Zahlen lassen sich ohne Rest durch 2 teilen. Das ist ein gemeinsames, beobachtbares Merkmal.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-similarity', type: 'open-response', title: 'Ähnlichkeiten ohne Ursache beschreiben', prompt: 'Drei erfundene Geräusche haben die Merkmale „kurz“ und „hell“. Ein viertes ist „lang“ und „tief“. Welche Gemeinsamkeit siehst du, und was kannst du daraus noch nicht über die Ursache schließen?', exampleAnswer: 'Die ersten drei teilen die beobachtbaren Merkmale „kurz“ und „hell“. Daraus allein folgt nicht, warum sie so klingen oder ob die Merkmale die Ursache sind.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Ein neutrales Muster entwerfen', prompt: 'Erfinde sechs neutrale Beispiele mit zwei gemeinsamen Merkmalen. Beschreibe die Merkmale, ohne echte Personen oder unbelegte Ursachen zu nennen.', exampleAnswer: 'Zum Beispiel sechs erfundene Formen, die alle drei Seiten und einen blauen Rand haben. Die Beschreibung nennt beobachtbare Merkmale und behauptet nicht, warum sie entstanden sind.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_10_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Eine fiktive Lernkarten-KI erkennt Karten mit blauem Rand und drei Symbolen. Eine Karte hat fünf Symbole. Wie sollte sie diese Abweichung behandeln?', choices: ['Sie untersucht den Fall, statt ihn sofort einzuordnen oder zu verwerfen.', 'Sie löscht die Karte, damit das Muster einfacher aussieht.', 'Sie ändert das Muster für alle Karten, ohne weitere Beispiele zu prüfen.'], correctIndex: 0, explanation: 'Eine Abweichung sollte untersucht werden; sie allein zeigt noch nicht, warum der Fall anders ist.' },
  { id: 'q2', prompt: 'Welche Erklärungen sind für einen abweichenden Fall möglich?', choices: ['Ein Datenfehler, eine neue Gruppe oder eine Grenze des aktuellen Musters.', 'Immer nur ein Tippfehler.', 'Der Beweis, dass jedes bisherige Beispiel falsch war.'], correctIndex: 0, explanation: 'Ein Ausreißer kann auf einen Datenfehler, eine weitere Gruppe oder eine Grenze des bisherigen Musters hinweisen.' },
  { id: 'q3', prompt: 'Was ist ein hilfreicher nächster Schritt, wenn ein Beispiel nicht zum Muster passt?', choices: ['Den Fall prüfen und das Muster an neuen, erfundenen Beispielen testen.', 'Den Fall löschen, ohne nachzusehen.', 'Sicher behaupten, das Muster gelte immer.'], correctIndex: 0, explanation: 'Prüfen und Testen hilft, zwischen einem Fehler, einer neuen Gruppe und einer Mustergrenze zu unterscheiden.' },
  { id: 'q4', prompt: 'Warum sollten Abweichungen dokumentiert werden?', choices: ['Damit sichtbar bleibt, welche Fälle noch geprüft werden müssen.', 'Damit niemand mehr die Beispiele vergleichen kann.', 'Damit aus einer Vermutung eine sichere Ursache wird.'], correctIndex: 0, explanation: 'Dokumentierte Abweichungen helfen, offene Fragen und die Grenzen eines Musters nachvollziehbar zu halten.' },
  { id: 'q5', prompt: 'Welche Aussage über ein Muster ist fair?', choices: ['Ein Muster kann nützlich sein und trotzdem Grenzen haben.', 'Ein Muster muss ausnahmslos zu jedem neuen Fall passen.', 'Ein einzelner Ausreißer darf nie weiter untersucht werden.'], correctIndex: 0, explanation: 'Muster sind prüfbare Beschreibungen; neue Fälle können ihre Grenzen sichtbar machen.' },
]);

export const KI_MISSION_10 = Object.freeze({
  id: 'ki-10',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 2', overviewHref: '../modul-4.html#stunde-2' },
  title: 'Mission 10 – Muster prüfen und Ausreißer erkennen',
  description: 'Untersuche abweichende, erfundene Beispiele und halte fest, was ein Muster erklärt und wo seine Grenzen liegen.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, ob ein Chatbot Absichten mit festen Regeln oder einem gelernten Modell erkennt.',
  objectives: [
    'Du nennst mögliche Erklärungen für einen abweichenden Fall, ohne ihn vorschnell zu löschen.',
    'Du prüfst Muster an neuen, erfundenen Beispielen und dokumentierst offene Fragen.',
  ],
  phases: [
    { id: 'observe', title: 'Ein Muster genau beschreiben', minutes: 10, blocks: [{ type: 'task', taskId: 'task-outlier' }] },
    { id: 'compare', title: 'Mögliche Erklärungen untersuchen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-investigate' }] },
    { id: 'apply', title: 'Mit neuen Beispielen prüfen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_10_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_10_QUESTIONS },
  ],
  media: {},
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein passendes Video zu Mustern und Ausreißern wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'unconfirmed', targetGrade: 'not-stated', license: 'not-stated', text: 'Kein passendes externes Material zu Mustern und Ausreißern wurde bestätigt. Die Beispiele dieser Mission sind eigenständig und erfunden.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Eine Abweichung passt nicht ohne Weiteres zu einem beobachteten Muster. Sie kann auf einen Datenfehler, eine neue Gruppe oder eine Grenze des aktuellen Musters hinweisen. Wir untersuchen den Fall und löschen ihn nicht einfach.' },
    { type: 'reflection', id: 'outlier-reflection', prompt: 'Warum sollte eine einzelne Abweichung nicht sofort gelöscht oder als Fehler festgelegt werden?', examples: ['Sie könnte ein Datenfehler sein, aber auch eine neue Gruppe oder eine Grenze des aktuellen Musters zeigen. Weitere erfundene Beispiele helfen beim Prüfen; die Abweichung bleibt dokumentiert.'] },
  ],
  tasks: [
    { id: 'task-outlier', type: 'open-response', title: 'Eine Abweichung ernst nehmen', prompt: 'Eine fiktive Lernkarten-KI erkennt Karten mit blauem Rand und drei Symbolen. Eine erfundene Karte hat einen blauen Rand, aber fünf Symbole. Welche Erklärungen sind möglich, und solltest du die Karte löschen?', exampleAnswer: 'Es könnte ein Datenfehler sein, eine neue Gruppe oder eine Grenze des aktuellen Musters. Ich prüfe den Fall und lösche ihn nicht einfach, weil die Abweichung wichtige Hinweise enthalten kann.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-investigate', type: 'open-response', title: 'Einen Prüfplan entwerfen', prompt: 'Wie könntest du die Regel an neuen, erfundenen Beispielen prüfen und festhalten, was du dabei beobachtest?', exampleAnswer: 'Ich prüfe weitere erfundene Karten, vergleiche ihre Merkmale mit dem Muster, halte Abweichungen und offene Fragen fest und dokumentiere sie. Ich behaupte nicht vorschnell, dass eine Erklärung sicher stimmt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Ein Muster mit Grenzen beschreiben', prompt: 'Erfinde eine kleine Gruppe mit einem gemeinsamen Muster und einen abweichenden Fall. Beschreibe, welche drei Erklärungen für den Fall möglich sind und wie du weiterprüfen würdest.', exampleAnswer: 'Bei erfundenen Formen haben die meisten drei Ecken; eine hat vier. Das kann ein Datenfehler, eine neue Gruppe oder eine Grenze des Musters sein. Ich prüfe weitere erfundene Formen und dokumentiere die Abweichung, statt sie zu löschen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_11_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Ein fiktiver Schulhof-Bot antwortet nur, wenn eine Nachricht das festgelegte Wort „Pausenplan“ enthält. Was beschreibt das?', choices: ['Eine feste Intent-Regel mit einem vorgegebenen Signal.', 'Ein Modell, das durch jede Nachricht automatisch dazulernt.', 'Eine Garantie, dass der Bot jede Frage versteht.'], correctIndex: 0, explanation: 'Das Signal und die Antwort wurden festgelegt; die Regel lernt nicht selbstständig.' },
  { id: 'q2', prompt: 'Was macht ein gelerntes Intent-Modell anders als diese feste Regel?', choices: ['Es kann Muster aus gelabelten Beispielen ableiten, statt nur ein festgelegtes Wort zu prüfen.', 'Es kennt jede Absicht sicher, auch ohne Beispiele.', 'Es speichert automatisch die Namen aller fragenden Personen.'], correctIndex: 0, explanation: 'Ein Modell kann aus gelabelten Beispielen Muster ableiten, ist aber nicht fehlerfrei und braucht keine persönlichen Daten.' },
  { id: 'q3', prompt: 'Was kann passieren, wenn jemand statt „Pausenplan“ die Frage „Wann ist die Pause?“ schreibt?', choices: ['Die feste Wortregel erkennt das Signal möglicherweise nicht.', 'Die feste Regel versteht die neue Formulierung sicher.', 'Das beweist, dass die Nachricht falsch ist.'], correctIndex: 0, explanation: 'Eine starre Wortbedingung kann andere Formulierungen übersehen.' },
  { id: 'q4', prompt: 'Wer kann die Bedingung einer festen Regel ändern?', choices: ['Menschen, die den Bot entwerfen oder warten.', 'Die feste Regel selbst, sobald sie ein Beispiel sieht.', 'Niemand, auch nicht das Entwicklerteam.'], correctIndex: 0, explanation: 'Eine feste Bedingung wird von Menschen geändert; das ist nicht dasselbe wie selbstständiges Lernen.' },
  { id: 'q5', prompt: 'Welche Aussage ist vorsichtig und richtig?', choices: ['Feste Regeln folgen vorgegebenen Bedingungen; gelernte Modelle können Muster ableiten und trotzdem irren.', 'Ein gelerntes Modell erkennt jede neue Absicht immer richtig.', 'Eine feste Regel und ein gelerntes Modell funktionieren genau gleich.'], correctIndex: 0, explanation: 'Die beiden Ansätze unterscheiden sich, und auch ein gelerntes Modell kann sich irren.' },
]);

export const KI_MISSION_11 = Object.freeze({
  id: 'ki-11',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 1', overviewHref: '../modul-5.html#stunde-1' },
  title: 'Mission 11 – Intents erkennen: Regel oder gelernte KI?',
  description: 'Unterscheide bei einem fiktiven Schulhof-Bot eine festgelegte Intent-Regel von einem Modell, das Muster aus Beispielen ableitet.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, wie gelabelte Beispiele neuen Formulierungen zugeordnet werden.',
  objectives: [
    'Du erklärst, dass eine feste Intent-Regel einem vorgegebenen Signal folgt.',
    'Du vergleichst feste Bedingungen mit einem Modell, das Muster aus Beispielen ableitet, und benennst, dass auch ein Modell irren kann.',
  ],
  phases: [
    { id: 'observe', title: 'Eine feste Intent-Regel erkennen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-intent-rule' }] },
    { id: 'compare', title: 'Regel und gelerntes Modell vergleichen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-rule-model' }] },
    { id: 'apply', title: 'Formulierungen vorsichtig prüfen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_11_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_11_QUESTIONS },
  ],
  media: {},
  resourceNotes: {
    video: { status: 'unconfirmed', text: 'Kein passendes Video zu festen Intent-Regeln und gelernten Chatbot-Modellen wurde bestätigt; es ist keines zugewiesen.' },
    material: { status: 'unconfirmed', targetGrade: 'not-stated', license: 'not-stated', candidateUrl: 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13', text: 'Experience AI, „Maschinelles Lernen: Regeln und Daten“, ist eine teilweise passende Quelle für den allgemeinen Unterschied zwischen Regeln und datenbasierten Systemen; eine direkte Aktivität zu Chatbot-Intents ist nicht bestätigt. Alterseignung und Lizenzstatus sind nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Eine feste Intent-Regel prüft ein vorgegebenes Signal und liefert eine festgelegte Antwort. Ein gelerntes Modell leitet Muster aus Beispielen ab, kann aber irren. Diese Ansätze sind verschieden: Eine Regel wird von Menschen geändert; ein Modell wird anhand von Beispielen trainiert. Wir üben mit einem fiktiven Schulhof-Bot und ohne persönliche Nachrichten.' },
    { type: 'reflection', id: 'intent-reflection', prompt: 'Warum könnte die feste Wortregel „Pausenplan“ eine anders formulierte Frage übersehen?', examples: ['Die Regel prüft nur das vorgegebene Signal. Ein gelerntes Modell kann Varianten aus Beispielen zuordnen, aber auch dabei Fehler machen.'] },
  ],
  tasks: [
    { id: 'task-intent-rule', type: 'open-response', title: 'Das feste Signal erkennen', prompt: 'Ein fiktiver Schulhof-Bot antwortet auf „Pausenplan?“ mit einem vorab gespeicherten Hinweis. Er prüft nur, ob das Wort „Pausenplan“ vorkommt. Ist das eine feste Intent-Regel oder ein gelerntes Modell? Erkläre, was geschieht, wenn jemand „Wann ist die Pause?“ schreibt.', exampleAnswer: 'Das ist eine feste Intent-Regel: Das Signalwort „Pausenplan“ löst eine vorher festgelegte Antwort aus. Die andere Formulierung enthält das festgelegte Wort nicht und kann deshalb übersehen werden. Die Regel lernt nicht selbstständig.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-rule-model', type: 'open-response', title: 'Regel und Modell vergleichen', prompt: 'Vergleiche eine feste Wortregel mit einem Modell, das anhand gelabelter, erfundener Nachrichten trainiert wurde. Was ist festgelegt, was kann aus Beispielen entstehen, und welche Grenze bleibt?', exampleAnswer: 'Bei der Regel ist das Signal und die Antwort festgelegt. Ein Modell kann Muster aus gelabelten Beispielen ableiten und dadurch andere Formulierungen erkennen; es kann aber trotzdem irren. Für beide Ansätze braucht man keine echten Namen oder privaten Nachrichten.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Einen sicheren Prüfplan skizzieren', prompt: 'Erfinde zwei harmlose Fragen zum Pausenplan: eine mit dem festgelegten Signalwort und eine mit anderer Formulierung. Sage voraus, welche die feste Regel erkennt, und beschreibe, wie ein Team ein gelerntes Modell mit erfundenen Beispielen vorsichtig prüfen könnte.', exampleAnswer: '„Pausenplan?“ enthält das festgelegte Signal; „Wann ist die Pause?“ ist eine andere Formulierung und kann von der festen Regel übersehen werden. Ein Team kann ein gelerntes Modell mit erfundenen Beispielen prüfen und seine Grenzen festhalten. Echte Nachrichten oder Namen sind nicht nötig.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

export const LESSONS = Object.freeze({ 'ki-01': KI_MISSION_01, 'ki-02': KI_MISSION_02, 'ki-03': KI_MISSION_03, 'ki-04': KI_MISSION_04, 'ki-05': KI_MISSION_05, 'ki-06': KI_MISSION_06, 'ki-07': KI_MISSION_07, 'ki-08': KI_MISSION_08, 'ki-09': KI_MISSION_09, 'ki-10': KI_MISSION_10, 'ki-11': KI_MISSION_11 });

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
