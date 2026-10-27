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

export const LESSONS = Object.freeze({ 'ki-01': KI_MISSION_01, 'ki-02': KI_MISSION_02, 'ki-03': KI_MISSION_03, 'ki-04': KI_MISSION_04, 'ki-05': KI_MISSION_05 });

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
