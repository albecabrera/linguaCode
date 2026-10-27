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
  context: { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 1', overviewHref: '../' },
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
  context: { subject: 'WP 8', module: 'Modul 1', hour: 'Stunde 2', overviewHref: '../' },
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
    experienceAi: { url: 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13', kind: 'official-lesson', title: 'Maschinelles Lernen: Regeln und Daten', provider: 'Experience AI', observation: 'Lies, wie regelbasierte und datenbasierte Systeme Probleme unterschiedlich lösen.', relatedMediaIds: ['video'], checkboxLabel: 'Ich habe das Video oder die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://www.youtube.com/watch?v=l_HSWmxMRlU', kind: 'educational-video', title: 'KI und maschinelles Lernen', provider: 'So lernen Maschinen · Plattform Lernende Systeme', linkLabel: 'Video ansehen: KI und maschinelles Lernen (4–7 Min.) ↗', duration: '4–7 Minuten', language: 'de', targetGrade: 'ab Jahrgangsstufe 7', license: 'unverified', observation: 'Kurzes Einführungsvideo dazu, was KI und maschinelles Lernen sind und wie Maschinen aus Daten lernen.' },
    klickpunktSchule: { url: 'https://klickpunktschule.bycs.de/digitalkompass/startseite/ki-kompass/ki-kompass-5-8-uebersicht/ki-kompass-5-8-begleitmaterial/modul-1-wie-funktionieren-ki-systeme-begleitmaterial/maschinelles-lernen-begleitmaterial', kind: 'official-material-page', title: 'Maschinelles Lernen: Begleitmaterial', provider: 'Klickpunkt Schule', observation: 'Die Seite bietet eine Weblektion und Materialhinweise für die Klassen 5–8. Nutze nur die verlinkte Quelle.', checkboxLabel: 'Ich habe die Materialseite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: '„KI und maschinelles Lernen“ ist das erste Video der Reihe „So lernen Maschinen“. Die Reihe ist deutschsprachig, für Lernende ab Jahrgangsstufe 7 geeignet und dauert laut klickpunkt.schule etwa 4–7 Minuten pro Clip; die genaue Dauer dieses Videos ist nicht angegeben. Die Lizenz ist nicht verifiziert; deshalb nur zur Originalquelle verlinken.' },
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
  context: { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 1', overviewHref: '../' },
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
    infSchule: { url: 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI', kind: 'official-learning-sequence', title: 'Entscheide wie eine KI', provider: 'inf-schule', observation: 'Die Lernstrecke nutzt Lebensmittelbeispiele und behandelt überwachtes Lernen, Schwellenwerte und Entscheidungsbäume. Sie empfiehlt vorher die Lernstrecke „Lernende Systeme“.', relatedMediaIds: ['video'], checkboxLabel: 'Ich habe die Lernstrecke oder das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://open.hpi.de/learn/kieinstieg2020/items/yRX6ZcCDd7c7pC2ssvP00?locale=de', kind: 'educational-video', title: '3.6 Entscheidungsbäume', provider: 'openHPI · Künstliche Intelligenz und maschinelles Lernen für Einsteiger', linkLabel: 'Video ansehen: Entscheidungsbäume (8:11 Min.) ↗', duration: '8 Minuten 11 Sekunden', language: 'de', targetGrade: 'Klassen 8–13', license: 'unverified', observation: 'Ein deutschsprachiger Einstieg in Entscheidungsbäume, passend als Ergänzung zur Lernstrecke über Merkmale, Labels und Schwellenwerte.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige openHPI-Video „3.6 Entscheidungsbäume“ gehört zum kostenlosen Einsteigerkurs „Künstliche Intelligenz und maschinelles Lernen für Einsteiger“, der für Klassen 8–13 ohne technische Vorkenntnisse ausgewiesen ist. Der Clip dauert 8 Minuten 11 Sekunden. Eine kostenlose Einschreibung eröffnet weitere Kursinhalte; die Lizenz des Einzelvideos ist nicht verifiziert, deshalb nur zur Originalseite verlinken.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die inf-schule-Lernstrecke behandelt Merkmale, Labels, Schwellenwerte und Entscheidungsbäume. Sie verlinkt eine druckbare Vorlage für Lebensmittel-Datenkarten, ein kostenfreies Kartenset für Schulen sowie weitere ProDaBi-Unterrichtsmaterialien; Zieljahrgang und Lizenz der ergänzenden Materialien sind auf der geprüften Seite nicht genannt.' },
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
  context: { subject: 'WP 8', module: 'Modul 2', hour: 'Stunde 2', overviewHref: '../' },
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
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite erklärt Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler bei ungeeigneten Daten.', relatedMediaIds: ['video'], checkboxLabel: 'Ich habe die Lernstrecke oder das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://open.hpi.de/learn/kieinstieg2020/items/7BZWuq1PbW6Smif7KyAXGO?locale=de', kind: 'educational-video', title: '3.2 Allgemeines Konzept Supervised Learning', provider: 'openHPI · Künstliche Intelligenz und maschinelles Lernen für Einsteiger', linkLabel: 'Video ansehen: Überwachtes Lernen (5:45 Min.) ↗', duration: '5 Minuten 45 Sekunden', language: 'de', targetGrade: 'Klassen 8–13', license: 'unverified', observation: 'Der deutschsprachige Clip führt durch überwachtes Training mit gelabelten Daten, die Validierung von Prognosen an Zielwerten und die Analyse von Modellfehlern. Er ergänzt die bestehende Lernstrecke zu Entscheidungsbäumen, Testobjekten und Fehlern.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige openHPI-Video „3.2 Allgemeines Konzept Supervised Learning“ ist Teil des kostenlosen Einsteigerkurses, der für Klassen 8–13 ohne technische Vorkenntnisse ausgewiesen ist. Es dauert 5 Minuten 45 Sekunden und erläutert überwachtes Training, Validierung von Prognosen an Zielwerten sowie Fehleranalyse. Die Videoseite ist direkt aufrufbar; eine kostenlose Einschreibung eröffnet weitere Kursinhalte. Die Lizenz des Einzelvideos ist nicht verifiziert, deshalb nur zur Originalseite verlinken.' },
    material: { status: 'linked', targetGrade: 'Experience AI: 11–14; inf-schule: not stated', license: 'not-stated', text: 'Experience AI Lektion 4 (für 11–14-Jährige) behandelt Entscheidungsbäume und Trainingsdaten; inf-schule erklärt Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler. Auf den geprüften Seiten wurden keine separaten druckbaren Begleitmaterialien und keine Lizenzangaben bestätigt.' },
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
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 1', overviewHref: '../' },
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
    infSchule: { url: 'https://inf-schule.de/kids/computerinalltag/entscheide-wie-eine-KI', kind: 'official-learning-sequence', title: 'Entscheide wie eine KI', provider: 'inf-schule', observation: 'Die Lernstrecke behandelt überwachtes Lernen, Schwellenwerte und Entscheidungsbäume. Nutze die Abschnitte zu Merkmalen und Regeln.', relatedMediaIds: ['video'], checkboxLabel: 'Ich habe die Lernstrecke oder das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://open.hpi.de/learn/kieinstieg2020/items/yRX6ZcCDd7c7pC2ssvP00?locale=de', kind: 'educational-video', title: '3.6 Entscheidungsbäume', provider: 'openHPI · Künstliche Intelligenz und maschinelles Lernen für Einsteiger', linkLabel: 'Video ansehen: Entscheidungsbäume (8:18 Min.; Schwellenwert ab 5:57) ↗', duration: '8 Minuten 18 Sekunden', language: 'de', targetGrade: 'Klassen 8–13', license: 'unverified', observation: 'Der deutschsprachige Clip zeigt, wie Merkmale und Labels in einen Entscheidungsbaum eingehen; ab 5:57 wird eine weitere Altersgrenze als Unterscheidung eingeführt. Spätere Abschnitte behandeln Gini-Koeffizient und Entropie.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige openHPI-Video „3.6 Entscheidungsbäume“ gehört zum kostenlosen Einsteigerkurs ohne technische Vorkenntnisse, der für Klassen 8–13 ausgewiesen ist. Es dauert 8 Minuten 18 Sekunden; eine Altersgrenze als weitere Unterscheidung wird ab 5:57 gezeigt. Die Videoseite stellt einen Player bereit; der Zugriff auf weitere Kursinhalte erfordert eine kostenlose Einschreibung. Die Lizenz des Einzelvideos ist nicht verifiziert, deshalb nur zur Originalseite verlinken. Gini-Koeffizient und Entropie im späteren Teil sind anspruchsvoller; für M05 reicht ein gezielter Ausschnitt.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die inf-schule-Lernstrecke zu Merkmalen, Schwellenwerten und Entscheidungsbäumen verlinkt eine druckbare Vorlage für Lebensmittel-Datenkarten, ein kostenfreies Kartenset für Schulen über ProDaBi und weitere Unterrichtsmaterialien. Zieljahrgang und Lizenzen der ergänzenden Materialien sind auf der geprüften Seite nicht angegeben.' },
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
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 2', overviewHref: '../' },
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
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite erklärt Trainingsbeispiele, Schwellenwerte, Testobjekte und mögliche Fehler bei ungeeigneten Daten.', relatedMediaIds: ['video', 'saarlandLesson'], checkboxLabel: 'Ich habe eine Lernseite, den Unterrichtsentwurf oder das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion behandelt Entscheidungsbäume und zeigt, wie Trainingsdaten ein Modell beeinflussen.', checkboxLabel: 'Ich habe die Lektion angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://publikationen.bibliothek.kit.edu/1000139088', kind: 'educational-video', title: 'Jetzt geht\'s los mit dem Maschinellen Lernen!', provider: 'Karlsruher Institut für Technologie (KIT)', linkLabel: 'Video ansehen: Trainings- und Testdaten (6:28 Min.; Ausschnitt 3:15–4:29) ↗', duration: '6 Minuten 28 Sekunden', language: 'de', targetGrade: 'not-stated', license: 'CC BY-SA 4.0', observation: 'Das deutschsprachige Video führt Regression und Klassifikation ein. Ab 3:15 geht es um Splits, ab 3:32 um den Trainingsdatensatz und ab 4:17 um den Testdatensatz; Validierungsdaten folgen ab 5:36. Für diese Stunde eignet sich vor allem der Ausschnitt 3:15–4:29.' },
    saarlandLesson: { url: 'https://informatikdidaktik.cs.uni-saarland.de/lebensmittel-ki/', kind: 'educational-material', title: 'Lebensmittel-KI – Unterrichtsstunde für Klasse 8', provider: 'Universität des Saarlandes · Didaktik der Informatik', observation: 'Der Unterrichtsentwurf für Klasse 8 lässt Lernende einen Klassifikator mit Trainingskarten erstellen und ihn mit getrennten Testkarten prüfen. Er verweist auf ProDaBi-Lebensmittelkarten; das zugrunde liegende Material wurde für Klasse 6 entwickelt.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige KIT-Video dauert 6 Minuten 28 Sekunden und ist unter CC BY-SA 4.0 veröffentlicht; eine Zielgruppe wird nicht angegeben. Der Ausschnitt 3:15–4:29 behandelt Datensplits, Trainingsdaten (3:32) und Testdaten (4:17). Spätere Validierungs- und Fehlermetrik-Themen können ausgelassen werden. Das Video bleibt ein externer Link.' },
    material: { status: 'linked', targetGrade: 'Saarland-Universität: Klasse 8; ProDaBi-Grundmaterial: Klasse 6; weitere Seiten: nicht angegeben', license: 'not-stated', text: 'Der Unterrichtsentwurf der Universität des Saarlandes ist ausdrücklich für Klasse 8 beschrieben und nutzt getrennte Trainings- und Testkarten. Das referenzierte ProDaBi-Kartenmaterial wurde für Klasse 6 entwickelt. Die bestehende Experience-AI-Lektion ist für 11–14 Jahre ausgewiesen; inf-schule nennt keinen Zieljahrgang. Für Unterrichtsentwurf, ProDaBi-Karten und die bestehenden Lernseiten ist keine Lizenz angegeben.' },
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
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 3', overviewHref: '../' },
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
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion behandelt Entscheidungsbäume und wie sie Beispiele klassifizieren.', relatedMediaIds: ['video'], checkboxLabel: 'Ich habe die Lektion oder das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://studyflix.de/informatik/ueberwachtes-lernen-8445', kind: 'educational-video', title: 'Überwachtes Lernen', provider: 'Studyflix', linkLabel: 'Video ansehen: Überwachtes Lernen – Testphase (5:21 Min.; ab 1:34) ↗', duration: '5 Minuten 21 Sekunden', language: 'de', targetGrade: 'not-stated', license: 'not-stated', observation: 'Ab 1:34 zeigt das Video die Testphase: Vorhersagen für neue Obstbeispiele werden mit dem tatsächlichen Label verglichen. Die begleitende Seite sagt, die Genauigkeit werde gemessen und optimiert, erklärt aber nicht, ob dieselben Testdaten zur Optimierung dienen. Als Anschauung für den Labelvergleich nutzen; in dieser Mission bleiben Testlabels unverändert und dienen nicht zur Regelanpassung.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige Studyflix-Video dauert 5 Minuten 21 Sekunden; ab 1:34 zeigt es die Testphase mit einer Vorhersage für neue Obstbeispiele und dem Vergleich zum tatsächlichen Label. Die Seite nennt keine Klassenstufe und keine Lizenz. Die Formulierung „Genauigkeit gemessen und optimiert“ erklärt nicht, ob dieselben Testdaten zum Optimieren verwendet werden; die Mission stellt daher klar, dass Testdaten nicht zur Regelanpassung dienen. Das Video bleibt ein externer Link.' },
    material: { status: 'linked', targetGrade: 'ProDaBi: not-stated; Experience AI: 11–14; inf-schule: not stated', license: 'ProDaBi package: CC BY-SA 4.0; other pages: not stated', text: 'Das ProDaBi-Paket zu Entscheidungsbäumen behandelt gelabelte Testbeispiele, Vorhersagevergleiche und Fehlklassifikationen; die Paketlizenz ist CC BY-SA 4.0. Die eingebetteten Videos erscheinen als Drittanbieter-Platzhalter für Vimeo/YouTube; deren Sprache, Laufzeit und konkreter Inhalt sind nicht verifiziert. Daher ist das Paket ein ergänzender Unterrichtshinweis, kein bestätigter Videovorschlag. Experience AI ist für 11–14 Jahre ausgewiesen; inf-schule nennt keinen Zieljahrgang. Lizenzen der übrigen verlinkten Lernseiten sind nicht angegeben.' },
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
  context: { subject: 'WP 8', module: 'Modul 3', hour: 'Stunde 4', overviewHref: '../' },
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
    experienceAi: { url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/4', kind: 'official-lesson', title: 'Lektion 4: Entscheidungsbäume', provider: 'Experience AI', observation: 'Die Lektion erklärt, wie Entscheidungsbäume aus Trainingsdaten entstehen und warum Beispiele die Regel beeinflussen.', relatedMediaIds: ['video', 'hubbsTranscript'], checkboxLabel: 'Ich habe die Lektion, das Video oder das Transkript angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    infSchule: { url: 'https://inf-schule.de/ki/menueansicht/basiswissen_ki/lernarten/entscheidungsBaeume', kind: 'official-learning-page', title: 'Überwachtes Lernen mit Entscheidungsbäumen', provider: 'inf-schule', observation: 'Die Seite behandelt Trainingsbeispiele, Schwellenwerte und die Prüfung von Entscheidungsregeln.', checkboxLabel: 'Ich habe die Seite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
    video: { url: 'https://hubbs.schule/mediathek/woche-6-daten-unter-und-ueberanpassung-mp4', kind: 'educational-video', title: 'Woche 6 | Daten | Unter- und Überanpassung', provider: 'HubbS / KI-Campus', linkLabel: 'Video ansehen: Unter- und Überanpassung (Laufzeit nicht angegeben) ↗', duration: 'not-stated', language: 'de', targetGrade: 'not-stated', license: 'CC BY 4.0', observation: 'Das deutschsprachige Video erklärt Unter- und Überanpassung und behandelt auch Ausreißer. Es nennt keine Laufzeit oder Klassenstufe und behandelt nicht speziell Entscheidungsbaum-Schwellenwerte. Nutze es als freiwillige Begriffserklärung; Verbesserungen stützen sich weiterhin auf Trainingsbeispiele und Merkmale, Testdaten und Testlabels bleiben unangetastet.' },
    hubbsTranscript: { url: 'https://hubbs.schule/mediathek/woche-6-daten-unter-und-ueberanpassung-pdf', kind: 'official-learning-page', title: 'Transkript zum Video: Unter- und Überanpassung', provider: 'HubbS', linkLabel: 'Transkript zum Video (PDF) öffnen ↗', license: 'CC BY 4.0', observation: 'Die Videoseite verlinkt außerdem drei interaktive Vertiefungsaufgaben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige HubbS-Video erklärt Unter- und Überanpassung und Ausreißer in Daten. Laufzeit nicht angegeben; keine Klassenstufe ausgewiesen. Es behandelt nicht speziell Entscheidungsbaum-Schwellenwerte. Nutze es als freiwillige Begriffserklärung; Verbesserungen stützen sich weiter auf Trainingsbeispiele und Merkmale, Testdaten und Testlabels bleiben unangetastet. Externer Link, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: 'HubbS: not-stated; Experience AI: 11–14; inf-schule: not-stated', license: 'HubbS resources: CC BY 4.0; existing pages: not stated', text: 'Das HubbS-Video und das Transkript stehen unter CC BY 4.0. Die Videoseite verlinkt drei interaktive Vertiefungsaufgaben, ebenfalls CC BY 4.0. Zielgruppe und Laufzeit des Videos sind nicht angegeben; HubbS ist ein Hub für berufliche Schulen, daher ist die Eignung für Klasse 8 nicht bestätigt. Experience AI nennt 11–14 Jahre; inf-schule nennt keinen Zieljahrgang. Lizenzen der übrigen Lernseiten sind nicht angegeben.' },
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
  context: { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 1', overviewHref: '../' },
  title: 'Mission 09 – Muster in Beispielen entdecken',
  description: 'Vergleiche erfundene Beispiele, beschreibe gemeinsame beobachtbare Merkmale und vermeide unbelegte Aussagen über Namen oder Ursachen.',
  duration: 45,
  nextHint: 'In der nächsten Mission prüfst du Muster an neuen Fällen und untersuchst mögliche Ausreißer.',
  objectives: [
    'Du beschreibst gemeinsame, beobachtbare Merkmale in erfundenen Beispielen.',
    'Du erklärst, dass ein beobachtetes Muster allein keine Ursache beweist.',
  ],
  phases: [
    { id: 'observe', title: 'Beispiele genau ansehen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-pattern' }] },
    { id: 'compare', title: 'Gemeinsame Merkmale vergleichen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-similarity' }] },
    { id: 'apply', title: 'Ein Muster fair beschreiben', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_09_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_09_QUESTIONS },
  ],
  media: {
    video: { url: 'https://www.youtube.com/watch?v=LAJHeUAP9l4', kind: 'educational-video', title: 'Machine Learning einfach erklärt', provider: 'Hochschule Luzern – Informatik', linkLabel: 'Video ansehen: Machine Learning einfach erklärt (HSLU: ca. 90 Sek.; Lehrerweb: 2:04) ↗', duration: 'HSLU: ca. 90 Sekunden; Lehrerweb: 2:04 (abweichende Angaben)', language: 'de', targetGrade: 'not-stated', license: 'not-stated', observation: 'Das deutschsprachige Video erklärt, wie aus Datensätzen Muster, Strukturen und Zusammenhänge erkannt werden. HSLU nennt ca. 90 Sekunden; Lehrerweb nennt 2:04 (widersprüchliche Laufzeit). Keine Klassenstufe; Lizenz zur Weiternutzung nicht angegeben. Als externen Einstieg verlinken und die erfundenen Musterbeispiele der Mission weiter bearbeiten.', checkboxLabel: 'Ich habe das Video angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige Video der Hochschule Luzern erklärt, wie aus Datensätzen Muster und Zusammenhänge erkannt werden. HSLU nennt ca. 90 Sekunden; Lehrerweb nennt 2:04 (widersprüchliche Laufzeit). Keine Klassenstufe; Lizenz zur Weiternutzung nicht angegeben. Externer Link, nicht kopiert oder eingebettet.' },
    material: { status: 'linked', targetGrade: 'HSLU video: not-stated; Lehrerweb: not-stated', license: 'not-stated', text: 'Lehrerweb bietet eine Unterrichtssequenz mit der Übung „KI für Meere“ (ca. 25 Minuten), in der Lernende einen Klassifikator für Meereslebewesen und Müll trainieren. Die Benutzeroberfläche ist deutsch; die eingebetteten Erklärvideos sind englisch und haben deutsche Untertitel. Zieljahrgang und Lizenz sind nicht angegeben. Die Aktivität ist breiter als M09s erfundene Musterbeispiele und eignet sich als optionale Lehrkraft-Vertiefung.' },
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
  context: { subject: 'WP 8', module: 'Modul 4', hour: 'Stunde 2', overviewHref: '../' },
  title: 'Mission 10 – Muster prüfen und Ausreißer erkennen',
  description: 'Untersuche abweichende, erfundene Beispiele und halte fest, was ein Muster erklärt und wo seine Grenzen liegen.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, ob ein Chatbot Absichten mit festen Regeln oder einem gelernten Modell erkennt.',
  objectives: [
    'Du nennst mögliche Erklärungen für einen abweichenden Fall, ohne ihn vorschnell zu löschen.',
    'Du prüfst Muster an neuen, erfundenen Beispielen und dokumentierst offene Fragen.',
  ],
  phases: [
    { id: 'observe', title: 'Ein Muster genau beschreiben', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-outlier' }] },
    { id: 'compare', title: 'Mögliche Erklärungen untersuchen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-investigate' }] },
    { id: 'apply', title: 'Mit neuen Beispielen prüfen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_10_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_10_QUESTIONS },
  ],
  media: {
    video: { url: 'https://hubbs.schule/mediathek/woche-6-daten-unter-und-ueberanpassung-mp4', kind: 'educational-video', title: 'Woche 6 | Daten | Unter- und Überanpassung', provider: 'HubbS / KI-Campus', linkLabel: 'Video ansehen: Unter- und Überanpassung (Laufzeit nicht angegeben) ↗', duration: 'not-stated', language: 'de', targetGrade: 'not-stated', license: 'CC BY 4.0', relatedMediaIds: ['hubbsTranscript'], observation: 'Das deutschsprachige Video erklärt Unter- und Überanpassung, zeigt, wie man beides erkennen kann und warum es auftritt, und behandelt auch Ausreißer. Laufzeit und Klassenstufe sind nicht angegeben. Nutze es als optionale Begriffserklärung, nicht als vollständigen Prüfplan: Untersuche Abweichungen, teste neue erfundene Beispiele und dokumentiere offene Fragen.' },
    hubbsTranscript: { url: 'https://hubbs.schule/mediathek/woche-6-daten-unter-und-ueberanpassung-pdf', kind: 'official-learning-page', title: 'Transkript zum Video: Unter- und Überanpassung', provider: 'HubbS', linkLabel: 'Transkript zum Video (PDF) öffnen ↗', license: 'CC BY 4.0', observation: 'Die Videoseite verlinkt außerdem drei interaktive Vertiefungsaufgaben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige HubbS-Video erklärt Unter- und Überanpassung und behandelt ausdrücklich Ausreißer in Daten. Die Seite nennt weder Laufzeit noch Klassenstufe; eine kurze Dauer oder Eignung für Klasse 8 ist nicht bestätigt. Das Video deckt nicht M10s vollständigen Prüfplan zum Untersuchen, Testen und Dokumentieren ab. Optionaler konzeptueller Begleiter, externer Link, nicht eingebettet; dasselbe Video ist auch in M08 verknüpft.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'CC BY 4.0', text: 'HubbS verlinkt ein Transkript zum Video und drei interaktive Vertiefungsaufgaben. Video und Transkript stehen laut Anbieter unter CC BY 4.0. Zieljahrgang und Laufzeit des Videos sind nicht angegeben; die Eignung für Klasse 8 ist nicht bestätigt. Die drei Aufgaben sind verlinkte Begleitmaterialien, ihr genauer Inhalt wurde nicht separat geprüft.' },
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
  context: { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 1', overviewHref: '../' },
  title: 'Mission 11 – Intents erkennen: Regel oder gelernte KI?',
  description: 'Unterscheide bei einem fiktiven Schulhof-Bot eine festgelegte Intent-Regel von einem Modell, das Muster aus Beispielen ableitet.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, wie gelabelte Beispiele neuen Formulierungen zugeordnet werden.',
  objectives: [
    'Du erklärst, dass eine feste Intent-Regel einem vorgegebenen Signal folgt.',
    'Du vergleichst feste Bedingungen mit einem Modell, das Muster aus Beispielen ableitet, und benennst, dass auch ein Modell irren kann.',
  ],
  phases: [
    { id: 'observe', title: 'Eine feste Intent-Regel erkennen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-intent-rule' }] },
    { id: 'compare', title: 'Regel und gelerntes Modell vergleichen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-rule-model' }] },
    { id: 'apply', title: 'Formulierungen vorsichtig prüfen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_11_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_11_QUESTIONS },
  ],
  media: {
    video: { url: 'https://hubbs.schule/mediathek/a2-3-trainingsdaten-und-ihre-rolle-beim-maschinellen-lernen-video', kind: 'educational-video', title: 'A2-3 Trainingsdaten und ihre Rolle beim Maschinellen Lernen', provider: 'HubbS / Universität Stuttgart', linkLabel: 'Video ansehen: Trainingsdaten und ihre Rolle beim Maschinellen Lernen (Laufzeit nicht angegeben) ↗', duration: 'not-stated', language: 'de', targetGrade: 'not-stated', license: 'CC BY 4.0', relatedMediaIds: ['experienceAi'], observation: 'Das deutschsprachige Video erklärt Trainingsdaten und annotierte Daten beim maschinellen Lernen. Es behandelt keine feste Chatbot-Intent-Regel und gibt weder Laufzeit noch Klassenstufe an. Nutze es als Teilbegleiter zum gelernten Modell, nicht als vollständigen Vergleich.' },
    experienceAi: { url: 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13', kind: 'official-learning-page', title: 'Maschinelles Lernen: Regeln und Daten', provider: 'Experience AI', linkLabel: 'Unterrichtsmaterial: Maschinelles Lernen – Regeln und Daten ↗', license: 'not-stated', observation: 'Die Unterrichtslektion vergleicht regelbasierte und datenbasierte Problemlösungen. Auf der geprüften Seite ist kein Video ausgewiesen; Lizenz und Zielalter dieser konkreten Lektion sind nicht angegeben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige HubbS-/Universität-Stuttgart-Video behandelt Trainingsdaten, annotierte Daten und maschinelles Lernen (CC BY 4.0). Es benennt weder Laufzeit noch Klassenstufe und behandelt keine feste Chatbot-Intent-Regel; eine kurze Dauer oder vollständige Passung für Klasse 8 ist daher nicht bestätigt. Optionaler Teilbegleiter, externer Link, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'HubbS: CC BY 4.0; Experience AI: not stated', candidateUrl: 'https://experience-ai.org/de/units/understanding-ai-11-14/lessons/13', text: 'Experience AI, „Maschinelles Lernen: Regeln und Daten“, vergleicht regelbasierte und datenbasierte Problemlösungen und ergänzt den Videoanteil. Die geprüfte Seite weist kein Video aus; für diese konkrete Lektion nennt sie keine Lizenz oder Zielaltersgruppe. Die Quellen sind Begleitmaterialien und ersetzen nicht den fiktiven Pausenplan-Vergleich.' },
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

const KI_MISSION_12_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Wozu dienen gelabelte Beispiele für einen Intent-Lernbot?', choices: ['Sie zeigen, welche Sprachmuster zu einem Intent gehören können.', 'Sie garantieren jede spätere Antwort.', 'Sie machen eine Prüfung mit neuen Formulierungen überflüssig.'], correctIndex: 0, explanation: 'Beispiele helfen beim Ableiten von Mustern, sind aber keine Garantie für neue Nachrichten.' },
  { id: 'q2', prompt: 'Ein Lernbot übt mit „Hallo!“ und „Guten Morgen!“ als Begrüßungen. Was sollte ein Team daraus schließen?', choices: ['Das Modell kann Muster lernen, aber nicht jede Begrüßung ist damit sicher erkannt.', 'Das Modell versteht danach jedes Gespräch fehlerfrei.', 'Die Labels müssen vor dem Test geändert werden.'], correctIndex: 0, explanation: 'Gelabelte Beispiele unterstützen das Lernen, garantieren aber keine fehlerfreie Zuordnung.' },
  { id: 'q3', prompt: 'Warum hält ein Team neue, ungesehene Testnachrichten getrennt von den Trainingsbeispielen?', choices: ['So lässt sich unabhängig prüfen, ob das Modell auch andere Formulierungen erkennt.', 'Damit die Testnachrichten heimlich Teil des Trainings werden.', 'Weil Testnachrichten immer private Daten enthalten müssen.'], correctIndex: 0, explanation: 'Getrennte Testbeispiele zeigen, wie das Modell auf neue Formulierungen reagiert, ohne vorher an ihnen zu üben.' },
  { id: 'q4', prompt: 'Eine neue, erfundene Nachricht wird einem falschen Intent zugeordnet. Was ist ein sinnvoller nächster Schritt?', choices: ['Den Fehler notieren und die Zuordnung mit weiteren getrennten Beispielen prüfen.', 'Die Testnachricht sofort zu einem Trainingsbeispiel machen und den Fehler vergessen.', 'Behaupten, dass das Modell nun alle Formulierungen versteht.'], correctIndex: 0, explanation: 'Ein Fehler ist ein Prüfhinweis. Die Testnachricht bleibt für eine unabhängige Auswertung getrennt.' },
  { id: 'q5', prompt: 'Welche Beispiele sind für die Übung geeignet?', choices: ['Erfundene Nachrichten ohne Namen oder private Angaben.', 'Echte private Chats aus der Klasse.', 'Nachrichten mit vollständigen Namen und Adressen.'], correctIndex: 0, explanation: 'Fiktive Nachrichten reichen aus; echte private Nachrichten oder Identifikationsdaten sind nicht nötig.' },
]);

export const KI_MISSION_12 = Object.freeze({
  id: 'ki-12',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 2', overviewHref: '../' },
  title: 'Mission 12 – Beispiele, Lernen und Testen',
  description: 'Untersuche, wie gelabelte, erfundene Nachrichten einem Intent-Lernbot helfen und wie getrennte Testnachrichten neue Formulierungen prüfen.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, wie ein Chatbot unbekannte Nachrichten offen und sicher beantwortet.',
  objectives: [
    'Du erklärst, wie gelabelte Beispiele einem Lernverfahren Muster für Intents zeigen können.',
    'Du hältst neue, ungesehene Testnachrichten getrennt und erklärst, dass ein Modell trotzdem irren kann.',
  ],
  phases: [
    { id: 'observe', title: 'Gelabelte Intent-Beispiele untersuchen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-intent-examples' }] },
    { id: 'compare', title: 'Neue Formulierungen getrennt testen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-unseen-test' }] },
    { id: 'apply', title: 'Ein fiktives Prüfset entwerfen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_12_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_12_QUESTIONS },
  ],
  media: {
    video: { url: 'https://hubbs.schule/mediathek/woche-5-theorie-ueberwachtes-lernen-mp4?page=0', kind: 'educational-video', title: 'Woche 5 | Theorie | Überwachtes Lernen', provider: 'HubbS / KI-Campus', linkLabel: 'Video ansehen: Überwachtes Lernen (Laufzeit nicht angegeben) ↗', duration: 'not-stated', language: 'de', targetGrade: 'not-stated', license: 'CC BY 4.0', relatedMediaIds: ['hubbsTranscript', 'hubbsTask1', 'hubbsTask2'], observation: 'Das deutschsprachige Video erklärt überwachtes Lernen mit Input-Output-Paaren und warum Datensätze in Trainings-, Validierungs- und Testdaten aufgeteilt werden. Laufzeit und Klassenstufe sind nicht angegeben. Es behandelt allgemeine Modellprüfung, nicht speziell Chatbot-Intents oder neue Sprachformulierungen; nutze es als ergänzenden Überblick.' },
    hubbsTranscript: { url: 'https://hubbs.schule/mediathek/woche-5-theorie-ueberwachtes-lernen-pdf', kind: 'official-learning-page', title: 'Transkript: Woche 5 | Theorie | Überwachtes Lernen', provider: 'HubbS / KI-Campus', linkLabel: 'Transkript zum Video (PDF) öffnen ↗', license: 'CC BY 4.0', observation: 'Das deutschsprachige Transkript zum Video behandelt Training, Qualitätsmaße und die Aufteilung in Trainings-, Validierungs- und Testdaten.' },
    hubbsTask1: { url: 'https://hubbs.schule/mediathek/woche-5-theorie-ueberwachtes-lernen-aufgabe-1', kind: 'official-learning-page', title: 'Vertiefungsaufgabe 1: Überwachtes Lernen', provider: 'HubbS / KI-Campus', linkLabel: 'Vertiefungsaufgabe 1 öffnen ↗', license: 'CC BY 4.0', observation: 'Interaktive Vertiefung zum HubbS/KI-Campus-Video.' },
    hubbsTask2: { url: 'https://hubbs.schule/mediathek/woche-5-theorie-ueberwachtes-lernen-aufgabe-2', kind: 'official-learning-page', title: 'Vertiefungsaufgabe 2: Überwachtes Lernen', provider: 'HubbS / KI-Campus', linkLabel: 'Vertiefungsaufgabe 2 öffnen ↗', license: 'CC BY 4.0', observation: 'Interaktive Vertiefung zum HubbS/KI-Campus-Video.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige HubbS-Video zu überwachtem Lernen behandelt Training aus Input-Output-Paaren, Qualitätsmaße und die Aufteilung in Trainings-, Validierungs- und Testdaten (CC BY 4.0). Laufzeit und Klassenstufe nennt der Anbieter nicht. Es erläutert keine Chatbot-Intents oder neuen Sprachformulierungen direkt und ist kein bestätigtes kurzes Video für Klasse 8; verlinkter allgemeiner Begleiter, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'CC BY 4.0', text: 'HubbS verlinkt ein deutschsprachiges CC BY 4.0-Transkript und zwei interaktive Vertiefungsaufgaben zum Video. Die Materialien behandeln überwachtes Lernen und Train-/Testaufteilungen, nicht speziell Chatbot-Intent-Beispiele; eine Zielklassenstufe ist nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Gelabelte, erfundene Beispiele zeigen einem Lernverfahren, welche Sprachmuster zu welchem Intent gehören können. Eine unabhängige, bisher ungesehene Testnachricht prüft, ob die Zuordnung auch bei neuen Formulierungen funktioniert. Sie bleibt vom Training getrennt. Beispiele helfen beim Lernen, sind aber keine Garantie; ein Modell kann sich irren.' },
    { type: 'reflection', id: 'intent-test-reflection', prompt: 'Warum sollte eine neue Testnachricht nicht vor der Prüfung in die Trainingsbeispiele aufgenommen werden?', examples: ['Sie soll unabhängig zeigen, ob das Modell auch ungesehene Formulierungen erkennt. Wird sie vorher zum Training benutzt, prüft sie nicht mehr unabhängig.'] },
  ],
  tasks: [
    { id: 'task-intent-examples', type: 'open-response', title: 'Muster in gelabelten Beispielen finden', prompt: 'Gelabelte, erfundene Nachrichten für einen fiktiven Lernbot: „Hallo!“ → Begrüßung; „Guten Morgen!“ → Begrüßung; „Kannst du mir helfen?“ → Hilfe; „Ich verstehe Aufgabe 2 nicht.“ → Hilfe. Welche Sprachmuster könnte ein Modell ableiten, und warum ist das keine Garantie?', exampleAnswer: 'Die Intent-Labels zeigen, welche Muster zu Begrüßung und Hilfe gehören können. Ein Modell kann daraus typische Formulierungen ableiten; die Beispiele sind aber keine Garantie, dass jede neue Nachricht richtig erkannt wird.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-unseen-test', type: 'open-response', title: 'Eine neue Formulierung getrennt prüfen', prompt: 'Ein Modell wurde mit erfundenen Begrüßungs- und Hilfenachrichten trainiert. Wie könntest du es mit einer neuen, bisher ungesehenen Formulierung testen, ohne diese vorher ins Training aufzunehmen?', exampleAnswer: 'Ich halte eine neue erfundene Nachricht getrennt und prüfe, welchem Intent das Modell sie zuordnet. Die Testnachricht bleibt unabhängig vom Training; ein falsches Ergebnis wird notiert und zeigt, dass das Modell irren kann.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Ein fiktives Prüfset planen', prompt: 'Entwirf erfundene Trainingsbeispiele für zwei Intents und eine getrennte Testnachricht mit neuer Formulierung. Beschreibe, wie du die Vorhersage vergleichst, ohne echte Nachrichten oder Namen zu verwenden.', exampleAnswer: 'Ich kann erfundene Begrüßungen und Hilfenachrichten mit Labels trainieren und eine neue, erfundene Testnachricht getrennt halten. Danach vergleiche ich die Vorhersage mit ihrem bekannten Testlabel und notiere mögliche Fehler. Echte Namen oder private Nachrichten sind nicht nötig.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_13_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Was ist eine sichere Reaktion, wenn eine Nachricht zu keinem bekannten Intent passt?', choices: ['Ehrlich sagen, dass sie nicht verstanden wurde, und um eine andere Formulierung bitten.', 'Eine zufällige Antwort als sicher ausgeben.', 'Die Nachricht mit Namen und Klasse speichern.'], correctIndex: 0, explanation: 'Ein guter Fallback macht Unsicherheit sichtbar, bittet um eine neue Formulierung und speichert keine privaten Inhalte.' },
  { id: 'q2', prompt: 'Ein fiktiver Schulbot versteht eine neue Nachricht nicht. Was sollte er nicht tun?', choices: ['Sagen, dass er die Nachricht nicht verstanden hat.', 'Eine Antwort erfinden und so tun, als sei sie sicher.', 'Um eine andere Formulierung bitten.'], correctIndex: 1, explanation: 'Bei unbekannten Eingaben darf der Bot keine sichere Antwort vortäuschen.' },
  { id: 'q3', prompt: 'Der Bot ordnet eine erfundene Hilfenachricht dem falschen Intent zu. Was kann das Team als Nächstes tun?', choices: ['Die Regel oder Trainingsbeispiele prüfen und mit neuen, getrennten Beispielen testen.', 'Den Fehler verbergen und den Testfall löschen.', 'Unbekannte Eingaben automatisch dem nächsten Intent zuordnen.'], correctIndex: 0, explanation: 'Ein Fehler ist ein Prüfhinweis. Nach einer Anpassung helfen neue, unabhängige Beispiele beim erneuten Test.' },
  { id: 'q4', prompt: 'Welche Nachricht eignet sich für den fiktiven Fallback-Test?', choices: ['Ein echter privater Chat aus der Klasse.', 'Eine erfundene Nachricht ohne Namen oder persönliche Angaben.', 'Eine Nachricht mit Adresse und Kontaktdaten.'], correctIndex: 1, explanation: 'Fiktive, anonyme Beispiele reichen aus; echte private Nachrichten sind nicht erforderlich.' },
  { id: 'q5', prompt: 'Warum soll ein Chatbot bei einer unbekannten Eingabe um eine neue Formulierung bitten?', choices: ['Damit er seine Unsicherheit offen zeigt, statt eine Antwort zu erfinden.', 'Damit er unbekannte Texte dauerhaft aufbewahren kann.', 'Damit er immer irgendeinem Intent eine Antwort zuordnet.'], correctIndex: 0, explanation: 'Ein transparenter Fallback zeigt eine Grenze und hilft der Person, die Frage anders zu stellen.' },
]);

export const KI_MISSION_13 = Object.freeze({
  id: 'ki-13',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 5', hour: 'Stunde 3', overviewHref: '../' },
  title: 'Mission 13 – Unbekannte Eingaben sicher behandeln',
  description: 'Entwirf einen ehrlichen Fallback für unbekannte Nachrichten und prüfe, wie ein Team nach einer Fehlzuordnung sicher weiterarbeitet.',
  duration: 45,
  nextHint: 'In der nächsten Mission prüfst du Behauptungen, indem du Autor, Belege und Methode kritisch untersuchst.',
  objectives: [
    'Du formulierst einen Fallback, der Unsicherheit offen zeigt und um eine neue Formulierung bittet.',
    'Du beschreibst, wie ein Team eine Fehlzuordnung prüft und mit neuen, erfundenen Beispielen erneut testet.',
  ],
  phases: [
    { id: 'observe', title: 'Unbekannte Nachricht erkennen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-fallback' }] },
    { id: 'respond', title: 'Ehrlich und sicher antworten', minutes: 10, blocks: [{ type: 'task', taskId: 'task-wrong-intent' }] },
    { id: 'review', title: 'Fehler prüfen und erneut testen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_13_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_13_QUESTIONS },
  ],
  media: {
    video: { url: 'https://schule.zdf.de/video/ki-fehler-einfach-erklaert-100', kind: 'educational-video', title: 'Künstliche Intelligenz?! Manchmal echt dumm!', provider: 'ZDF goes Schule', linkLabel: 'Video ansehen: Künstliche Intelligenz?! Manchmal echt dumm! (2 Min.) ↗', duration: '2:00', language: 'de', targetGrade: 'not-stated', license: 'not-stated', availabilityEnd: '2030-05-20', relatedMediaIds: ['klickpunktGuidance'], observation: 'Das deutschsprachige ZDF-Video erklärt kurz, dass Chatbots Fehler machen und mitunter Unsinn erzählen. Es zeigt keinen gezielten Fallback für unbekannte Intents und nennt keine Lizenz zur Wiederverwendung. Nutze es nur als Einstieg zu möglichen Fehlern; die sichere Fallback-Regel dieser Mission bleibt maßgeblich.' },
    klickpunktGuidance: { url: 'https://klickpunktschule.bycs.de/beitrag/formulierungs-und-darstellungshilfen-im-kontext-ki', kind: 'official-learning-page', title: 'Formulierungs- und Darstellungshilfen im Kontext KI', provider: 'klickpunkt.schule', linkLabel: 'Hintergrund für Lehrkräfte: KI und unbekannte Antworten ↗', license: 'not-stated', observation: 'Die Lehrkräfte-Hilfe erläutert, dass Chatbots nicht zuverlässig erkennen und kenntlich machen, wenn ihnen Wissen fehlt. Zielklassenstufe und Lizenz sind auf der geprüften Seite nicht angegeben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige ZDF-goes-Schule-Video „Künstliche Intelligenz?! Manchmal echt dumm!“ dauert 2 Minuten und erklärt, dass Chatbots Fehler machen. Es behandelt keinen gezielten Fallback bei unbekannten Intents; eine Lizenz zur Wiederverwendung ist nicht angegeben. Laut ZDF ist es bis zum 20. Mai 2030 verfügbar. Optionaler Fehler-Einstieg, externer Link, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'Die klickpunkt.schule-Hilfe richtet sich an Lehrkräfte und erläutert, dass Chatbots nicht zuverlässig signalisieren, wenn ihnen Wissen fehlt. Sie ist Hintergrund zum sicheren Formulieren, keine direkte Schüleraktivität zu Schulbot-Fallbacks. Zielklassenstufe und Lizenz sind nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Wenn eine Nachricht zu keinem bekannten Intent passt, soll der Chatbot keine Antwort erfinden. Er sagt ehrlich: „Das habe ich noch nicht verstanden. Bitte formuliere es anders.“ So zeigt er seine Grenze, statt eine unsichere Vermutung als Tatsache auszugeben.' },
    { type: 'reflection', id: 'fallback-reflection', prompt: 'Wie hilft ein ehrlicher Fallback der Person und dem Team?', examples: ['Die Person weiß, dass der Bot unsicher ist, und kann anders fragen. Das Team erkennt eine Grenze des aktuellen Intent-Modells und kann es mit neuen, erfundenen Beispielen prüfen.'] },
  ],
  tasks: [
    { id: 'task-fallback', type: 'open-response', title: 'Einen sicheren Fallback formulieren', prompt: 'Ein fiktiver Bot kennt diese Nachricht nicht: „Kannst du mir bei der Aufgabe helfen?“ Formuliere eine ehrliche Antwort, die um eine neue Formulierung bittet und keine Antwort erfindet.', exampleAnswer: '„Das habe ich noch nicht verstanden. Bitte formuliere es anders.“ Der Bot rät nicht und speichert die Nachricht nicht.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-wrong-intent', type: 'open-response', title: 'Eine falsche Intent-Zuordnung untersuchen', prompt: 'Ein fiktiver Bot ordnet die erfundene Nachricht „Ich brauche Hilfe bei Aufgabe 2“ dem Intent Begrüßung zu. Wie kann das Team die Zuordnung prüfen und verbessern?', exampleAnswer: 'Ich prüfe zuerst die Intent-Regel und die gelabelten Trainingsbeispiele. Danach teste ich die überarbeitete Zuordnung mit neuen, erfundenen Beispielen, die vom Training getrennt bleiben.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Fiktiven Fallback-Test planen', prompt: 'Plane für einen fiktiven Schulbot einen unbekannten Nachrichtenfall und einen Fallback. Beschreibe, warum der Bot die Nachricht nicht speichern soll.', exampleAnswer: 'Wir verwenden keine echten Nachrichten; keine unbekannte Eingabe wird gespeichert. Der Bot sagt ehrlich, dass er die erfundene Nachricht nicht versteht, und bittet um eine andere Formulierung.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_14_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Welche Fragen helfen dabei, eine starke Behauptung zu prüfen?', choices: ['Wer ist die Quelle, welche Belege und Messmethode gibt es, und womit wird fair verglichen?', 'Wie oft wird die Behauptung wiederholt?', 'Ob sie zu meiner ersten Meinung passt.'], correctIndex: 0, explanation: 'Eine Prüfung fragt nach Quelle, Belegen, Messmethode und einem fairen Vergleich.' },
  { id: 'q2', prompt: 'Ein fiktiver Blog schreibt: „Unsere Lern-App macht dich in drei Tagen doppelt so klug.“ Was ist ein sinnvoller nächster Schritt?', choices: ['Die App sofort empfehlen, weil die Aussage genau klingt.', 'Nachprüfen, wer die Behauptung aufstellt und wie „doppelt so klug“ gemessen wurde.', 'Die Behauptung für wahr halten, weil ein Blog sie veröffentlicht hat.'], correctIndex: 1, explanation: 'Eine messbare Methode und verlässliche Belege sind nötig; ein genauer oder selbstbewusster Satz beweist nichts.' },
  { id: 'q3', prompt: 'Was macht einen Vergleich aussagekräftiger?', choices: ['Zwei Gruppen unter vergleichbaren Bedingungen untersuchen und die Methode offenlegen.', 'Nur das beste Ergebnis zeigen.', 'Die Messung erst nach dem Ergebnis festlegen.'], correctIndex: 0, explanation: 'Ein fairer Vergleich nutzt nachvollziehbare, vergleichbare Bedingungen und eine erklärte Methode.' },
  { id: 'q4', prompt: 'Was bedeutet kritisches Prüfen?', choices: ['Jede Behauptung automatisch ablehnen.', 'Fragen, welche Belege eine Behauptung stützen und was noch offen ist.', 'Die Behauptung glauben, wenn sie oft geteilt wurde.'], correctIndex: 1, explanation: 'Kritisches Denken prüft Belege und Grenzen; es heißt nicht, alles abzulehnen.' },
  { id: 'q5', prompt: 'Eine Quelle nennt keine Messmethode. Was solltest du daraus schließen?', choices: ['Die Behauptung ist bewiesen.', 'Die fehlende Methode ist eine offene Frage; bitte um nachvollziehbare Informationen.', 'Die Zahl darf nach Gefühl geändert werden.'], correctIndex: 1, explanation: 'Ohne erkennbare Methode lässt sich die Behauptung nicht gut bewerten. Zahlen werden nicht nach Gefühl angepasst.' },
]);

export const KI_MISSION_14 = Object.freeze({
  id: 'ki-14',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 1', overviewHref: '../' },
  title: 'Mission 14 – Behauptungen kritisch prüfen',
  description: 'Prüfe starke Behauptungen anhand ihrer Quelle, Belege, Messmethode und eines fairen Vergleichs.',
  duration: 45,
  nextHint: 'In der nächsten Mission prüfst du Nachrichten auf fehlende Quellen, veraltete Angaben und veränderte Originalinformationen.',
  objectives: [
    'Du zerlegst eine Behauptung in Aussage, Quelle und Beleg.',
    'Du fragst nach Messmethode und fairem Vergleich, ohne eine Aussage vorschnell zu glauben oder abzulehnen.',
  ],
  phases: [
    { id: 'claim', title: 'Eine starke Behauptung erkennen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-claim-check' }] },
    { id: 'source', title: 'Quelle und Belege prüfen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-evidence' }] },
    { id: 'compare', title: 'Messmethode und Vergleich untersuchen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-apply' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_14_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_14_QUESTIONS },
  ],
  media: {
    video: { url: 'https://www.br.de/sogehtmedien/weiterfuehrende-schulen/recherche-so-klappt-der-faktencheck-100.html', kind: 'educational-video', title: 'Recherche – So klappt der Faktencheck', provider: 'BR / so geht MEDIEN', linkLabel: 'Video ansehen: Recherche – So klappt der Faktencheck (unter 10 Min.) ↗', duration: 'under 10 minutes', language: 'de', targetGrade: 'not-stated', license: 'not-stated', relatedMediaIds: ['faktenDoktor'], observation: 'Das deutschsprachige Jugendvideo erklärt, wie Journalistinnen und Journalisten recherchieren und Quellen auf Vertrauenswürdigkeit prüfen; BR verknüpft es mit Unterrichtsablauf, Arbeitsblatt und Quiz. Fakefrei nennt eine Dauer unter zehn Minuten und die Zielgruppe Jugendliche. Das Video deckt nicht gezielt Messmethoden oder faire Studienvergleiche ab; eine Lizenz zur Wiederverwendung ist nicht angegeben.' },
    faktenDoktor: { url: 'https://www.medien-doktor.de/fakten-doktor/', kind: 'official-learning-page', title: 'Fakten-Doktor: Studien und Expert:innen kritisch prüfen', provider: 'Medien-Doktor', linkLabel: 'Unterrichtsmaterial: Fakten-Doktor zu Studien und Expert:innen ↗', license: 'not-stated', targetGrade: '8/9', observation: 'Lehrkräftebereich mit Filmen, Präsentationen und Arbeitsblättern zur Plausibilitätsprüfung wissenschaftlicher Expertinnen und Experten sowie Studien. Vorgesehen für Lehrkräfte ab etwa Klasse 8/9; Dauer der einzelnen Filme und Nutzungsrechte sind nicht angegeben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige BR-/so geht MEDIEN-Video „Recherche – So klappt der Faktencheck“ zeigt journalistische Recherche und die Prüfung vertrauenswürdiger, unabhängiger Quellen (Zwei-Quellen-Prinzip) sowie ausgewogener Berichterstattung. Fakefrei nennt weniger als zehn Minuten und Jugendliche als Zielgruppe; die BR-Seite bietet Unterrichtsablauf, Arbeitsblatt und Quiz. Es deckt M14s Messmethode und fairen Vergleich von Studien nur teilweise ab. Eine Lizenz ist nicht angegeben; externer Link, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: '8/9', license: 'not-stated', text: 'Der Medien-Doktor-Fakten-Doktor stellt Lehrkräften ab etwa Klasse 8/9 Filme, Präsentationen und Arbeitsblätter zur Plausibilitätsprüfung wissenschaftlicher Expert:innen und Studien bereit. Das passt besonders zum Prüfen von Belegen, deckt M14s fiktive Lern-App-Aufgabe aber nicht vollständig ab; Film-Laufzeiten und Nutzungsrechte sind nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Kritisches Prüfen bedeutet nicht, alles abzulehnen. Bei einer starken Behauptung fragst du: Wer ist die Quelle? Welche Belege gibt es? Welche Messmethode wurde verwendet? Gibt es einen fairen Vergleich? Ein selbstbewusster Satz ist noch kein Beweis.' },
    { type: 'reflection', id: 'claim-reflection', prompt: 'Warum reichen eine genaue Zahl oder eine überzeugende Überschrift allein nicht als Beleg?', examples: ['Eine Zahl ist nur dann prüfbar, wenn klar ist, wer sie erhoben hat, was gemessen wurde, mit welcher Methode und womit fair verglichen wurde.'] },
  ],
  tasks: [
    { id: 'task-claim-check', type: 'open-response', title: 'Eine starke Behauptung prüfen', prompt: 'Ein fiktiver Blog behauptet: „Unsere Lern-App macht dich in drei Tagen doppelt so klug.“ Welche Fragen stellst du, bevor du die Behauptung glaubst oder weiterleitest?', exampleAnswer: 'Wer veröffentlicht die Behauptung und welche Quelle wird genannt? Welche Belege gibt es? Welche Messmethode zeigt, ob „doppelt so klug“ zutrifft? Gab es einen fairen Vergleich mit einer passenden Gruppe und unter gleichen Bedingungen? Kritisches Prüfen heißt nicht, alles ablehnen zu müssen; ich prüfe, was die Informationen tatsächlich zeigen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-evidence', type: 'open-response', title: 'Beleg und offene Frage unterscheiden', prompt: 'Die fiktive App-Werbung zeigt nur eine Vorher-nachher-Zahl und nennt keine Quelle oder Messmethode. Was weißt du, und was musst du noch prüfen?', exampleAnswer: 'Ich weiß nur, welche Zahl die Werbung behauptet. Quelle, Messmethode und fairer Vergleich fehlen noch; ich frage nach diesen Informationen, statt die Zahl als bewiesen zu behandeln.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-apply', type: 'open-response', title: 'Einen fairen Vergleich planen', prompt: 'Plane eine faire Prüfung für die fiktive Behauptung. Beschreibe, was gemessen und zwischen welchen vergleichbaren Bedingungen geprüft werden müsste.', exampleAnswer: 'Zuerst lege ich fest, was „besser lernen“ messbar bedeutet. Dann vergleiche ich Gruppen unter gleichen Bedingungen, dokumentiere Quelle und Methode und nenne, was die Ergebnisse nicht beweisen. Es werden keine echten Schülerdaten benötigt.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_15_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Eine fiktive Nachricht nennt eine sensationelle Zahl, aber keine Quelle und kein Datum. Was ist der beste nächste Schritt?', choices: ['Vor dem Teilen innehalten und die Aussage mit verlässlichen Quellen prüfen.', 'Die Zahl als wahr behandeln, weil sie genau klingt.', 'Die Zahl so ändern, dass sie plausibler wirkt.'], correctIndex: 0, explanation: 'Fehlende Quelle und fehlender Zeitpunkt sind Warnzeichen. Prüfe unabhängig, bevor du teilst; ändere keine Zahl nach Gefühl.' },
  { id: 'q2', prompt: 'Zwei fiktive Beiträge nennen unterschiedliche Zahlen zum selben Ereignis. Was hilft bei der Prüfung?', choices: ['Nur den Beitrag lesen, der zur eigenen Meinung passt.', 'Nach überprüfbaren Originalinformationen, Quelle und Datum suchen.', 'Den längeren Beitrag automatisch für richtig halten.'], correctIndex: 1, explanation: 'Vergleiche Quellen und überprüfbare Originalinformationen und achte auf den Zeitpunkt.' },
  { id: 'q3', prompt: 'Warum ist das Datum einer Nachricht wichtig?', choices: ['Eine alte Information kann aus einem früheren Zusammenhang stammen.', 'Das neueste Datum beweist immer, dass alles wahr ist.', 'Das Datum ersetzt den Beleg.'], correctIndex: 0, explanation: 'Zeitpunkt und Kontext helfen beim Einordnen, sind aber allein kein Wahrheitsbeweis.' },
  { id: 'q4', prompt: 'Ein Beitrag schneidet eine Zahl aus einer längeren Originalmeldung heraus. Was solltest du tun?', choices: ['Die Zahl selbst korrigieren, bis sie glaubwürdig aussieht.', 'Die Originalmeldung und ihren Zusammenhang prüfen und Änderungen kenntlich machen.', 'Den Ausschnitt als vollständigen Beleg weiterleiten.'], correctIndex: 1, explanation: 'Prüfe die Originalinformation und ihren Zusammenhang. Zahlen dürfen nicht nach Gefühl verändert werden.' },
  { id: 'q5', prompt: 'Was bedeutet „erst prüfen, dann teilen“?', choices: ['Quelle, Datum und Originalinformationen prüfen und Unsicheres nicht als sicher weitergeben.', 'Jede Nachricht sofort ablehnen.', 'Eine Nachricht weiterleiten, wenn viele Menschen sie geteilt haben.'], correctIndex: 0, explanation: 'Prüfen heißt weder blind glauben noch alles ablehnen. Teile Unsicheres nicht als gesicherte Tatsache.' },
]);

export const KI_MISSION_15 = Object.freeze({
  id: 'ki-15',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 2', overviewHref: '../' },
  title: 'Mission 15 – Fehlinformation erkennen',
  description: 'Halte vor dem Teilen inne und prüfe Quelle, Datum und überprüfbare Originalinformationen, statt Zahlen nach Gefühl zu ändern.',
  duration: 45,
  nextHint: 'In der nächsten Mission schützt du deine Privatsphäre, indem du nur notwendige und erfundene Angaben verwendest.',
  objectives: [
    'Du erkennst fehlende Quellen, fehlende oder alte Datumsangaben und aus dem Zusammenhang gerissene Zahlen als Warnzeichen.',
    'Du prüfst verlässliche Quellen und Originalinformationen, bevor du eine Nachricht teilst; du veränderst Zahlen nicht nach Gefühl.',
  ],
  phases: [
    { id: 'pause', title: 'Vor dem Teilen innehalten', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-pause-before-share' }] },
    { id: 'source-date', title: 'Quelle und Datum prüfen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-source-date' }] },
    { id: 'original', title: 'Originalinformationen vergleichen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-original-information' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_15_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_15_QUESTIONS },
  ],
  media: {
    video: { url: 'https://www.br.de/sogehtmedien/weiterfuehrende-schulen/un-wahrheiten-luegen-erkennen-fakes-fake-news-100.html', kind: 'educational-video', title: 'Fakes und Desinformation im Netz erkennen', provider: 'BR / so geht MEDIEN', linkLabel: 'Video ansehen: Fakes und Desinformation im Netz erkennen (unter 10 Min.) ↗', duration: 'under 10 minutes', language: 'de', targetGrade: 'not-stated', license: 'not-stated', relatedMediaIds: ['checklist'], observation: 'Deutschsprachiges Jugendvideo mit Tipps zum Erkennen von Fakes und Desinformation. Die BR-Seite bietet dazu Quiz, Stundenablauf, Aufgabenblatt und Hintergrundinformationen für die Sekundarstufe. Fakefrei nennt eine Laufzeit unter zehn Minuten. Die Seite nennt keine genaue Klassenstufe und keine Lizenz zur Wiederverwendung; externer Link, nicht eingebettet.' },
    checklist: { url: 'https://www.digibits.de/materialien/checkliste-suchergebnisse-bewerten-und-falschmeldungen-entlarven/', kind: 'official-learning-page', title: 'Suchergebnisse bewerten und Falschmeldungen entlarven', provider: 'DigiBitS / Deutschland sicher im Netz e. V.', linkLabel: 'Unterrichtsmaterial: DigiBitS-Checkliste zu Suchergebnissen und Falschmeldungen ↗', license: 'not-stated', targetGrade: 'not-stated', observation: 'Checkliste für Lernende mit Fragen dazu, wer hinter einer Website steckt, wie Inhalte dargestellt sind und ob Informationen aktuell sind. Hilfreiche Ergänzung zu M15s Prüfung von Quelle, Datum und Kontext; Lizenz zur Wiederverwendung nicht angegeben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige Jugendvideo „Fakes und Desinformation im Netz erkennen“ von BR/so geht MEDIEN unterstützt M15s Prüfung von Fehlinformation, Quellen, Datum und Kontext. Die BR-Seite bietet Quiz, Stundenablauf, Aufgabenblatt und Hintergrund-PDF für die Sekundarstufe; Fakefrei nennt weniger als zehn Minuten. Die genaue Klassenstufe und eine Lizenz zur Wiederverwendung sind nicht angegeben; externer Link, nicht eingebettet.' },
    material: { status: 'linked', targetGrade: 'not-stated', license: 'not-stated', text: 'DigiBitS bietet die Checkliste „Suchergebnisse bewerten und Falschmeldungen entlarven“. Sie fragt, wer hinter einer Website steckt, wie Inhalte dargestellt sind und ob sie aktuell sind. Das passt zu M15s Prüfung von Absender, Darstellung und Aktualität; eine Klassenstufe und Wiederverwendungslizenz sind nicht angegeben.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Fehlinformation kann eine echte Zahl aus einem alten Zusammenhang, eine Nachricht ohne Quelle oder einen Ausschnitt ohne Originalkontext verwenden. Prüfe Quelle, Datum und überprüfbare Originalinformationen. Halte vor dem Teilen inne und ändere Zahlen nicht „nach Augenmaß“.' },
    { type: 'reflection', id: 'misinformation-reflection', prompt: 'Warum reicht eine genaue Zahl allein nicht als Beleg?', examples: ['Ohne Quelle, Datum und Zusammenhang kann eine Zahl falsch eingeordnet sein. Ich suche nach überprüfbaren Originalinformationen und teile Unsicheres nicht als Tatsache.'] },
  ],
  tasks: [
    { id: 'task-pause-before-share', type: 'open-response', title: 'Vor dem Teilen innehalten', prompt: 'Eine fiktive Chatnachricht nennt eine sensationelle Zahl, aber kein Datum und keine Quelle. Was tust du, bevor du sie teilst?', exampleAnswer: 'Ich halte inne und teile sie nicht als Tatsache. Ich prüfe, wer die Zahl veröffentlicht hat, wann sie gilt und ob verlässliche Quellen oder Originalinformationen sie bestätigen. Ich verändere die Zahl nicht nach Gefühl.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-source-date', type: 'open-response', title: 'Quelle und Zeitpunkt untersuchen', prompt: 'Zwei fiktive Beiträge beschreiben dasselbe Ereignis unterschiedlich; einer hat kein Datum. Welche Angaben prüfst du, bevor du urteilst?', exampleAnswer: 'Ich suche nach der ursprünglichen Quelle und einem Datum, prüfe, ob die Information aktuell ist, und vergleiche sie mit einer verlässlichen Quelle. Das Datum allein beweist nicht, dass ein Beitrag wahr ist.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-original-information', type: 'open-response', title: 'Originalinformationen fair vergleichen', prompt: 'Zwei fiktive Beiträge nennen unterschiedliche Zahlen. Wie findest du heraus, was die Originalinformation tatsächlich sagt, ohne eine Zahl „nach Augenmaß“ zu verändern?', exampleAnswer: 'Ich öffne die auffindbare Originalquelle, lese den Zusammenhang und das Datum und vergleiche die Angaben. Wenn etwas fehlt oder unklar bleibt, sage ich das offen, statt die Zahl selbst zu ändern oder als bewiesen weiterzugeben.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_16_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Eine fiktive Rechtschreib-App möchte deinen Namen und deine Adresse speichern, obwohl sie nur einen Satz korrigieren soll. Was ist datensparsam?', choices: ['Nur den nötigen Satz ohne persönliche Angaben prüfen lassen und ihn nicht unnötig speichern.', 'Name, Adresse und mehrere private Chats mitschicken.', 'Alle Angaben dauerhaft speichern, damit die App mehr lernen kann.'], correctIndex: 0, explanation: 'Für die Rechtschreibkorrektur reichen die nötigen Wörter. Identifizierende Angaben und unnötige Speicherung sind nicht erforderlich.' },
  { id: 'q2', prompt: 'Was ist ein gutes Beispiel für eine Frage ohne identifizierende Angaben?', choices: ['„Ich bin [echter Name] aus [Schule] und wohne in [Adresse] …“', '„Wie kann eine fiktive Gruppe eine Aufgabe fair aufteilen?“', 'Ein Foto eines privaten Chats mit Namen senden.'], correctIndex: 1, explanation: 'Eine allgemeine, erfundene Frage braucht keinen echten Namen, Schule, Adresse oder privaten Chat.' },
  { id: 'q3', prompt: 'Warum solltest du private Nachrichten nicht ungeprüft in ein KI-Werkzeug kopieren?', choices: ['Sie können persönliche oder vertrauliche Angaben anderer Menschen enthalten.', 'Private Nachrichten sind immer bessere Trainingsdaten.', 'Ein KI-Werkzeug macht jede Nachricht automatisch anonym.'], correctIndex: 0, explanation: 'Private Nachrichten können andere Personen betreffen. Verwende keine identifizierenden oder vertraulichen Daten.' },
  { id: 'q4', prompt: 'Eine Aufgabe lässt sich mit erfundenen Beispielen lösen. Was ist sinnvoll?', choices: ['Erfundene oder anonymisierte Beispiele nutzen und unnötige Details weglassen.', 'Echte Namen ergänzen, damit das Beispiel realistischer wirkt.', 'Adressen und private Chats sammeln.'], correctIndex: 0, explanation: 'Erfundene oder anonymisierte Beispiele reichen für die Übung; unnötige personenbezogene Angaben bleiben draußen.' },
  { id: 'q5', prompt: 'Welche Regel hilft vor dem Eingeben einer Frage in ein KI-Werkzeug?', choices: ['Nur notwendige Informationen eingeben und persönliche Angaben weglassen.', 'Alles teilen, was das Werkzeug möglicherweise nützlich findet.', 'Eine private Nachricht kopieren, ohne die Beteiligten zu fragen.'], correctIndex: 0, explanation: 'Überlege, welche Information wirklich erforderlich ist, und lasse persönliche oder vertrauliche Angaben weg.' },
]);

export const KI_MISSION_16 = Object.freeze({
  id: 'ki-16',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 3', overviewHref: '../' },
  title: 'Mission 16 – Privatsphäre schützen',
  description: 'Nutze nur notwendige Informationen und übe mit erfundenen oder anonymisierten Beispielen, statt persönliche Daten preiszugeben.',
  duration: 45,
  nextHint: 'In der nächsten Mission untersuchst du, ob Trainingsdaten verschiedene Gruppen und Situationen abdecken und welche Verzerrungen entstehen können.',
  objectives: [
    'Du erkennst, warum Namen, Adressen und private Chats für viele KI-Aufgaben nicht notwendig sind.',
    'Du formulierst Fragen mit erfundenen oder anonymisierten Beispielen und lässt identifizierende Angaben weg.',
  ],
  phases: [
    { id: 'notice', title: 'Persönliche Angaben erkennen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-data-minimization' }] },
    { id: 'reduce', title: 'Notwendige Daten auswählen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-necessary-data' }] },
    { id: 'practice', title: 'Eine sichere Frage formulieren', minutes: 19, blocks: [{ type: 'task', taskId: 'task-safe-ai-question' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_16_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_16_QUESTIONS },
  ],
  media: {
    video: { url: 'https://kultus.hessen.de/video/videoarchiv/smartphones-und-datenschutz', kind: 'educational-video', title: 'Smartphones und Datenschutz', provider: 'Hessen Kultus · Initiative „Datenschutz geht zur Schule“', linkLabel: 'Video ansehen: Smartphones und Datenschutz (4:17 Min.) ↗', duration: '4 Minuten 17 Sekunden', language: 'not-verified', targetGrade: 'not-stated', license: 'not-stated', observation: 'Die Quelle beschreibt Datenverarbeitung beim Smartphone und Datensparsamkeit. Die Klassenstufe und die gesprochene Audiosprache sind nicht verifiziert; das Video behandelt Datenschutz allgemein, nicht speziell KI-Eingaben.' },
  },
  resourceNotes: {
    video: { status: 'user-selected-limited-fit', text: 'Auf Wunsch der Nutzerin/des Nutzers als link-only Begleiter ergänzt: Hessen Kultus beschreibt das 4:17-minütige Video als Beispiel dafür, welche Daten ein Smartphone verarbeitet und wie man Datensparsamkeit praktiziert. Die Quelle nennt keine Klassenstufe; die gesprochene Audiosprache wurde nicht direkt verifiziert. Der Clip behandelt Datenschutz allgemein, nicht speziell das Eingeben von Daten in KI-Werkzeuge. Lizenz- und Wiederverwendungsrechte sind nicht angegeben; nur zur Originalquelle verlinken.' },
    material: { status: 'related-resource-not-linked', targetGrade: 'ab Klassenstufe 8', license: 'not-stated', text: 'App Camps „Rund um Daten“ ist ab Klassenstufe 8 empfohlen und bietet Unterrichtsmaterial zu digitalen Spuren, Datennutzung und Datenschutz. Es ist ergänzendes Material, keine bestätigte spezifische Videoquelle für M16; Inhalte wurden nicht kopiert.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Gib einem KI-Werkzeug nur Informationen, die für die Aufgabe wirklich nötig sind. Namen, Adressen und private Chats sind häufig überflüssig. Übe mit erfundenen oder anonymisierten Beispielen und frage allgemein, ohne identifizierende Angaben preiszugeben.' },
    { type: 'reflection', id: 'privacy-reflection', prompt: 'Welche persönlichen Angaben könntest du vor einer KI-Frage weglassen?', examples: ['Ich lasse echte Namen, Adressen, Schule und private Nachrichten weg. Ich frage allgemein und verwende erfundene oder anonymisierte Beispiele.'] },
  ],
  tasks: [
    { id: 'task-data-minimization', type: 'open-response', title: 'Nur notwendige Daten verwenden', prompt: 'Eine fiktive Rechtschreib-App möchte für die Korrektur eines Satzes auch Namen, Adresse und private Chats speichern. Welche Angaben sind für die Aufgabe notwendig, und was lässt du weg?', exampleAnswer: 'Für die Rechtschreibkorrektur reicht der nötige Satz. Namen, Adresse und private Chatdaten sind nicht notwendig; ich lasse sie weg und speichere nichts Unnötiges.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-necessary-data', type: 'open-response', title: 'Eine Frage datensparsam umformulieren', prompt: 'Formuliere eine fiktive Frage zu einer Gruppenaufgabe so um, dass sie ohne echten Namen, Schule, Adresse oder private Nachrichten auskommt.', exampleAnswer: '„Wie kann eine fiktive Gruppe eine Aufgabe fair aufteilen?“ Die Frage ist allgemein und enthält keine identifizierenden Angaben oder privaten Chatdaten.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-safe-ai-question', type: 'open-response', title: 'Eine sichere KI-Frage prüfen', prompt: 'Eine fiktive Person möchte ein persönliches Problem mit einem KI-Werkzeug besprechen. Welche Informationen sollte sie weglassen, und wie kann sie die Frage allgemein, ohne identifizierende Angaben und anonymisiert formulieren?', exampleAnswer: 'Sie lässt Namen, Schule, Adresse und private Nachrichten weg und beschreibt die Situation allgemein und anonymisiert, ohne identifizierende Angaben zu teilen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_17_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Ein fiktives Bildermodell hat fast nur Tiere bei Tageslicht im Training gesehen. Warum kann das ein Problem sein?', choices: ['Fehlende Beispiele können dazu führen, dass das Modell andere Gruppen oder Situationen schlechter erkennt.', 'Das Modell wird automatisch fair, sobald es viele Bilder hat.', 'Die nicht gezeigten Tiere sind deshalb weniger geeignet.'], correctIndex: 0, explanation: 'Einseitige Trainingsdaten können Lücken erzeugen. Eine Vorhersage sagt nichts über die Eignung von Menschen oder Tieren aus.' },
  { id: 'q2', prompt: 'Ein fiktives Modell erreicht 95 % Gesamtgenauigkeit, erkennt aber eine selten vertretene Gruppe oft falsch. Was ist sinnvoll?', choices: ['Fehler und Datenabdeckung für verschiedene Gruppen prüfen, statt die Gesamtzahl als Fairnessbeweis zu nehmen.', 'Die Fehler der seltenen Gruppe verschweigen.', 'Die Gesamtgenauigkeit beweist, dass jedes Ergebnis fair ist.'], correctIndex: 0, explanation: 'Ein Gesamtwert kann Fehler einzelner Gruppen verdecken. Prüfe Verteilung und Ergebnisse differenziert.' },
  { id: 'q3', prompt: 'Wie gehst du mit einem fiktiven Beispiel um, das von der bisherigen Auswahl abweicht?', choices: ['Es sofort löschen, weil es die Genauigkeit stört.', 'Es als Beweis behandeln, dass alle ähnlichen Fälle gleich sind.', 'Untersuchen, ob es eine Datenlücke oder eine wichtige neue Situation sichtbar macht.'], correctIndex: 2, explanation: 'Abweichungen können auf eine Lücke oder Grenze hinweisen. Prüfe sie, statt sie automatisch zu löschen oder zu verallgemeinern.' },
  { id: 'q4', prompt: 'Was beweist eine einzelne Kennzahl wie die Gesamtgenauigkeit?', choices: ['Dass alle Gruppen gleich gut erkannt werden.', 'Für sich allein nicht, dass ein Modell fair ist.', 'Dass keine Trainingsdaten fehlen.'], correctIndex: 1, explanation: 'Eine Kennzahl allein zeigt nicht, wie Daten und Fehler zwischen Gruppen verteilt sind und beweist keine Fairness.' },
  { id: 'q5', prompt: 'Was kann ein Team tun, wenn wichtige Gruppen oder Situationen im fiktiven Datensatz fehlen?', choices: ['Die Lücken dokumentieren und verantwortungsvoll passende Beispiele ergänzen und erneut prüfen.', 'Das Problem ignorieren, wenn der Gesamtwert hoch ist.', 'Die betroffenen Gruppen für die Fehler verantwortlich machen.'], correctIndex: 0, explanation: 'Dokumentiere Datenlücken, ergänze geeignete Beispiele verantwortungsvoll und prüfe die Ergebnisse erneut.' },
]);

export const KI_MISSION_17 = Object.freeze({
  id: 'ki-17',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 4', overviewHref: '../' },
  title: 'Mission 17 – Bias und Vorurteile untersuchen',
  description: 'Suche in fiktiven Trainingsdaten nach fehlenden Gruppen und Situationen und prüfe, warum Gesamtgenauigkeit allein keine Fairness beweist.',
  duration: 45,
  nextHint: 'In der nächsten Mission prüfst du KI-Vorschläge, achtest auf Datenschutz und übernimmst Verantwortung für deine Entscheidung.',
  objectives: [
    'Du erklärst, wie einseitige oder unvollständige Trainingsdaten verzerrte Modellvorhersagen begünstigen können.',
    'Du suchst nach fehlenden Gruppen und Situationen und beurteilst Modellfehler differenziert, statt Fairness aus einer Kennzahl abzuleiten.',
  ],
  phases: [
    { id: 'bias-example', title: 'Einseitige Beispiele erkennen', minutes: 10, blocks: [{ type: 'media', mediaId: 'video' }, { type: 'task', taskId: 'task-bias-example' }] },
    { id: 'missing-groups', title: 'Fehlende Gruppen und Situationen suchen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-missing-groups' }] },
    { id: 'metric-limits', title: 'Kennzahlen kritisch einordnen', minutes: 19, blocks: [{ type: 'task', taskId: 'task-metric-limits' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_17_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_17_QUESTIONS },
  ],
  media: {
    video: { url: 'https://ki-campus.org/lernangebote/videos/biases-beim-maschinellen-lernen-welche-auswirkungen-haben-verzerrte', kind: 'educational-video', title: 'Biases beim Maschinellen Lernen: Welche Auswirkungen haben verzerrte Trainingsdaten?', provider: 'KI-Campus', linkLabel: 'Video ansehen: Biases beim Maschinellen Lernen ↗', language: 'de', duration: 'not-stated', targetGrade: '8-13 (catalog listing; KI-Campus source course targets prospective primary-school teachers)', license: 'CC BY-SA 4.0', relatedMediaIds: ['hubbsBiasTask'], observation: 'Das deutschsprachige Video behandelt den Trainingsprozess und die Bedeutung ausgewogener Daten. Medienkompetenzrahmen NRW listet es für Klassen 8–13 unter CC BY-SA 4.0; eine Laufzeit ist nicht angegeben. Die KI-Campus-Quellseite ordnet es dem Kurs „Data Literacy für die Grundschule“ für angehende Grundschullehrkräfte zu, was nicht eindeutig zum gelisteten Jahrgang passt. Das Video erklärt nicht gezielt gruppenspezifische Kennzahlen oder warum Gesamtgenauigkeit allein keine Fairness beweist; mit den fiktiven M17-Aufgaben weiterarbeiten.' },
    hubbsBiasTask: { url: 'https://hubbs.schule/mediathek/datenbeschaffung-und-aufbereitung-04-verzerrungen-und-repraesentativitaet-aufgabe-1', kind: 'official-learning-page', title: 'Verzerrungen und Repräsentativität (Aufgabe 1)', provider: 'HubbS / KI-Campus', linkLabel: 'Unterrichtsmaterial: HubbS-Aufgabe zu Verzerrungen und Repräsentativität ↗', language: 'de', targetGrade: 'not-stated', license: 'CC BY 4.0', observation: 'Deutschsprachige Übung zu Verzerrungen, Repräsentativität und Selektionsbias, als Vertiefung zu einem Video über Datenbeschaffung und -aufbereitung. Eine Klassenstufe ist nicht angegeben.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', text: 'Das deutschsprachige KI-Campus-Video „Biases beim Maschinellen Lernen: Welche Auswirkungen haben verzerrte Trainingsdaten?“ behandelt Training und ausgewogene Daten. Medienkompetenzrahmen NRW listet Klassen 8–13 und CC BY-SA 4.0; die Laufzeit ist nicht angegeben. Die KI-Campus-Quellseite nennt als Ursprung einen Kurs für angehende Grundschullehrkräfte, also weicht der Quellkontext von der Katalog-Zielgruppe ab. Gruppenspezifische Fehlerkennzahlen und Grenzen der Gesamtgenauigkeit werden nicht gezielt behandelt.' },
    material: { status: 'candidate', targetGrade: '11-14', license: 'unverified', url: 'https://experience-ai.org/de/units/foundations-of-ai-11-14/lessons/3', text: 'HubbS bietet die deutschsprachige Aufgabe „Verzerrungen und Repräsentativität (Aufgabe 1)“ als Vertiefung zu Bias, Repräsentativität und Selektionsbias unter CC BY 4.0; Klassenstufe und Dauer sind nicht angegeben. Experience AI, „Lektion 3: Das Problem der Voreingenommenheit“, behandelt ebenfalls begrenzte Datensätze, Training/Test, Modellgenauigkeit und verzerrte Vorhersagen; die Seite nennt 11–14 Jahre, die Download-Lizenz ist aber nicht verifiziert. Nichts kopieren oder hosten.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'Wenn Trainingsdaten einseitig oder unvollständig sind, können Modellvorhersagen verzerrt sein. Prüfe, welche Gruppen und Situationen fehlen. Eine Gesamtgenauigkeit kann Fehler einzelner Gruppen verdecken und beweist allein keine Fairness. Eine Modellvorhersage ist kein Urteil über die Eignung eines Menschen.' },
    { type: 'reflection', id: 'bias-reflection', prompt: 'Welche Gruppen oder Situationen könnten in einem Datensatz fehlen, und was sagt eine Gesamtgenauigkeit darüber nicht?', examples: ['Ich prüfe, welche Gruppen und Situationen vertreten sind, und suche nach Lücken. Ein Gesamtwert zeigt nicht automatisch, ob Fehler für alle Gruppen gleich verteilt sind oder das Modell fair ist.'] },
  ],
  tasks: [
    { id: 'task-bias-example', type: 'open-response', title: 'Einseitige Trainingsdaten untersuchen', prompt: 'Ein fiktives Bildermodell hat fast nur Tiere bei Tageslicht gesehen. Was könnte es bei Nacht, anderem Hintergrund oder wenig vertretenen Tiergruppen übersehen?', exampleAnswer: 'Das Modell könnte bei anderen Lichtverhältnissen oder Gruppen mehr Fehler machen. Ich prüfe, welche Beispiele fehlen und wie sich die Vorhersagen unterscheiden, statt die Ergebnisse als allgemeingültig zu behandeln.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-missing-groups', type: 'open-response', title: 'Fehlende Gruppen und Situationen suchen', prompt: 'Ein fiktiver Datensatz zeigt fast nur Tiere bei Tageslicht und aus einer Perspektive. Welche Gruppen und Situationen könnten fehlen, und wie würdest du das prüfen?', exampleAnswer: 'Ich vergleiche, welche Gruppen und Situationen in der Verteilung vertreten sind, dokumentiere Lücken und prüfe die Auswirkungen. Aus einer Modellvorhersage schließe ich nicht auf die Eignung von Menschen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-metric-limits', type: 'open-response', title: 'Eine Kennzahl kritisch prüfen', prompt: 'Ein fiktives Modell hat 95 % Gesamtgenauigkeit, macht aber bei allen Beispielen aus einer selten vertretenen Gruppe Fehler. Reicht die Gesamtgenauigkeit als Fairnessnachweis?', exampleAnswer: 'Nein. Die Gesamtgenauigkeit kann Fehler einzelner Gruppen verdecken. Ich prüfe Datenabdeckung und Fehler je Gruppe; eine einzelne Kennzahl beweist keine Fairness.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

const KI_MISSION_18_QUESTIONS = Object.freeze([
  { id: 'q1', prompt: 'Eine fiktive KI-Antwort enthält eine wichtige Behauptung. Was tust du vor der Verwendung?', choices: ['Die Antwort klingt sicher, also übernehme ich sie sofort.', 'Ich prüfe die Behauptung mit verlässlichen, möglichst unabhängigen Quellen und kennzeichne Unsicherheiten.', 'Ich ändere nur einzelne Wörter, damit die Aussage richtig wirkt.'], correctIndex: 1, explanation: 'Prüfe wichtige Aussagen anhand verlässlicher Quellen und übernimm nichts ungeprüft.' },
  { id: 'q2', prompt: 'Du hast für einen Entwurf KI-Hilfe genutzt. Wie gehst du transparent damit um?', choices: ['Ich beachte die Regeln der Klasse, mache erlaubte KI-Hilfe kenntlich und formuliere die geprüfte Arbeit in eigenen Worten.', 'Ich gebe den KI-Text als vollständig eigene Arbeit aus.', 'Ich verberge jede KI-Hilfe, auch wenn die Klassenregeln etwas anderes verlangen.'], correctIndex: 0, explanation: 'Transparenz richtet sich nach den Regeln der Klasse; prüfe Inhalte und übernimm Verantwortung für deine eigene Arbeit.' },
  { id: 'q3', prompt: 'Ein fiktives KI-System empfiehlt einer fiktiven Person nach drei Antworten eine bestimmte Schulform. Was ist sinnvoll?', choices: ['Die Empfehlung allein entscheidet, weil das System viele Informationen verarbeitet.', 'Die Person muss alle persönlichen Angaben eingeben, damit die Empfehlung sicher wird.', 'Prüfe Grundlage und Grenzen, sprich mit vertrauten Erwachsenen und der Lehrkraft; die KI entscheidet nicht für die Person.'], correctIndex: 2, explanation: 'Eine KI-Empfehlung ist keine Entscheidung. Menschen prüfen, beraten und entscheiden selbst.' },
  { id: 'q4', prompt: 'Ein KI-Chat fragt nach deinem Namen, deiner Adresse und privaten Nachrichten. Was solltest du tun?', choices: ['Alles eingeben, damit die Antwort persönlicher wird.', 'Keine persönlichen oder privaten Angaben teilen und stattdessen ein erfundenes Beispiel verwenden.', 'Nur die Adresse eingeben, wenn die KI freundlich klingt.'], correctIndex: 1, explanation: 'Teile keine unnötigen persönlichen Daten. Für Übungen reichen erfundene Beispiele.' },
  { id: 'q5', prompt: 'Wer trägt die Verantwortung, wenn du einen KI-Vorschlag in deiner Arbeit verwendest?', choices: ['Du prüfst den Vorschlag, beachtest Regeln und entscheidest, ob und wie du ihn verwendest.', 'Ausschließlich das KI-System.', 'Niemand, weil KI-Ausgaben automatisch richtig sind.'], correctIndex: 0, explanation: 'Menschen bleiben für die Nutzung und Prüfung eines KI-Vorschlags verantwortlich.' },
]);

export const KI_MISSION_18 = Object.freeze({
  id: 'ki-18',
  module: 'Künstliche Intelligenz',
  context: { subject: 'WP 8', module: 'Modul 6', hour: 'Stunde 5', overviewHref: '../' },
  title: 'Mission 18 – Verantwortungsvoll nutzen',
  description: 'Prüfe fiktive KI-Vorschläge, beachte Klassenregeln und Datenschutz und triff wichtige Entscheidungen nicht allein aufgrund einer KI-Antwort.',
  duration: 45,
  objectives: [
    'Du überprüfst wichtige KI-Aussagen anhand verlässlicher Quellen und behandelst Unsicherheiten offen.',
    'Du nutzt KI transparent nach den Regeln deiner Klasse, schützt persönliche Daten und behältst die menschliche Verantwortung für Entscheidungen.',
  ],
  phases: [
    { id: 'film', title: 'KI als Lernhilfe kritisch nutzen', minutes: 8, blocks: [{ type: 'media', mediaId: 'video' }] },
    { id: 'verify', title: 'Aussagen prüfen statt blind übernehmen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-check-ai' }] },
    { id: 'transparent', title: 'KI-Hilfe transparent machen', minutes: 10, blocks: [{ type: 'task', taskId: 'task-transparent' }] },
    { id: 'responsibility', title: 'Datenschutz und menschliche Verantwortung', minutes: 11, blocks: [{ type: 'task', taskId: 'task-decision' }, { type: 'task', taskId: 'task-privacy' }] },
    { id: 'quiz', title: 'Abschlussquiz', minutes: 6, blocks: [{ type: 'quiz', questionIds: KI_MISSION_18_QUESTIONS.map(({ id }) => id) }], questions: KI_MISSION_18_QUESTIONS },
  ],
  media: {
    video: { url: 'https://www.planet-schule.de/schwerpunkt/leben-in-der-digitalen-welt/erklaers-mir-so-nutzt-du-ki-zum-lernen-film-100.html', kind: 'official-video', title: 'So nutzt du KI zum Lernen', provider: 'Planet Schule', linkLabel: 'Video ansehen: So nutzt du KI zum Lernen (4 Min.; ab Klasse 5) ↗', duration: '4:00', language: 'de', targetGrade: 'ab Klasse 5', license: 'unverified', availabilityEnd: '2031-08-24', observation: 'Vier Tipps zeigen, wie KI beim Lernen das Verstehen unterstützen kann; hinterfrage KI-Antworten kritisch. Das Video ergänzt M18, deckt aber Datenschutz, transparente Kennzeichnung und menschliche Verantwortung nicht vollständig ab.', checkboxLabel: 'Ich habe die Filmseite angesehen', selfReportDisclaimer: 'Nur eine Selbstmeldung, kein technischer Nachweis.' },
  },
  resourceNotes: {
    video: { status: 'confirmed-source', targetGrade: 'ab Klasse 5', license: 'unverified', url: 'https://www.planet-schule.de/schwerpunkt/leben-in-der-digitalen-welt/erklaers-mir-so-nutzt-du-ki-zum-lernen-film-100.html', text: 'Planet Schule, „So nutzt du KI zum Lernen“: vier Tipps für Lernende ab Klasse 5, darunter Lernen zum Verstehen statt nur Antworten abzurufen und KI-Antworten kritisch zu hinterfragen. Die Seite nennt 4 Minuten und Online-Verfügbarkeit bis 24. August 2031. Passender Teilbegleiter, aber keine vollständige Behandlung von Datenschutz, transparenter Kennzeichnung oder menschlicher Verantwortung. Lizenz zur Wiederverwendung nicht verifiziert; nur zur Originalseite verlinken, nicht einbetten, kopieren oder hosten.' },
    material: { status: 'candidate-not-assigned', targetGrade: 'ab Klasse 7', license: 'unverified', url: 'https://www.klicksafe.de/paedagogen/medien-materialien/ki-and-me-wie-kuenstliche-intelligenz-unser-leben-praegt', text: 'klicksafe/FSM, „KI and me“: sechs Unterrichtsprojekte zu Jugend, Schule und KI-Ethik; als optionale Lehrkraft-Referenz, nicht für Schüler*innen-Aufgaben zugewiesen. Die PDF enthält keinen erkennbaren Lizenzhinweis; nur auf die Originalseite verlinken, nicht kopieren oder hosten.' },
  },
  contentBlocks: [
    { type: 'intro', text: 'KI kann beim Lernen Ideen erklären und Entwürfe unterstützen, aber Antworten können falsch oder unvollständig sein. Prüfe wichtige Aussagen mit verlässlichen Quellen. Beachte die Regeln deiner Klasse, kennzeichne erlaubte KI-Hilfe transparent und schreibe geprüfte Ergebnisse in eigenen Worten. Gib keine persönlichen Daten oder privaten Nachrichten ein. Bei wichtigen Entscheidungen helfen Menschen; eine KI entscheidet nicht für dich.' },
    { type: 'reflection', id: 'responsible-use-reflection', prompt: 'Was prüfst du vor der Verwendung eines KI-Vorschlags, wie schützt du persönliche Daten und wer bleibt für deine Entscheidung verantwortlich?', examples: ['Ich prüfe wichtige Aussagen mit verlässlichen Quellen, nutze erfundene Beispiele statt persönlicher Daten, beachte die Klassenregeln und entscheide selbst, ob ich den Vorschlag verwende.'] },
  ],
  tasks: [
    { id: 'task-check-ai', type: 'open-response', title: 'Eine KI-Behauptung prüfen', prompt: 'Eine fiktive KI-Antwort für ein Referat lautet: „Alle Menschen lernen am besten nachts.“ Wie prüfst du diese Aussage, bevor du sie verwendest?', exampleAnswer: 'Ich suche verlässliche und möglichst unabhängige Belege, prüfe, ob die Aussage zu allgemein ist, und lasse sie weg oder kennzeichne Unsicherheit, wenn die Belege fehlen.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-transparent', type: 'open-response', title: 'KI-Hilfe transparent nutzen', prompt: 'Du hast für einen Entwurf KI-Hilfe genutzt. Wie machst du die KI-Hilfe transparent und stellst sicher, dass die Arbeit deine eigene bleibt?', exampleAnswer: 'Ich beachte die Regeln der Klasse, mache erlaubte KI-Hilfe kenntlich, prüfe die Aussagen und formuliere die Ergebnisse in eigenen Worten, statt ungeprüft zu kopieren.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-decision', type: 'open-response', title: 'Eine Empfehlung nicht zur Entscheidung machen', prompt: 'Ein fiktives KI-System empfiehlt einer fiktiven Person nach drei Antworten eine bestimmte Schulform. Was solltest du prüfen, und wer kann bei der Entscheidung helfen?', exampleAnswer: 'Ich prüfe, auf welchen Angaben die Empfehlung beruht und welche Grenzen sie hat. Die Person kann mit vertrauten Erwachsenen und der Lehrkraft sprechen; die KI entscheidet nicht für sie.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
    { id: 'task-privacy', type: 'open-response', title: 'Persönliche Daten schützen', prompt: 'Ein fiktiver KI-Chat bittet um Namen, Adresse und private Nachrichten. Wie kannst du die Aufgabe sicher weiterbearbeiten?', exampleAnswer: 'Ich teile keine persönlichen Daten oder privaten Nachrichten. Ich formuliere die Situation mit erfundenen Angaben und gebe nur die Informationen an, die für die Aufgabe nötig sind.', checkLabel: 'Meine Antwort prüfen', exampleLabel: 'Beispielantwort anzeigen', reviseLabel: 'Meine Antwort überarbeiten', selfCheck: true, selfCheckOnly: true },
  ],
  solutions: [],
  feedback: { quiz: QUIZ_BAND_LABELS },
  progress: { version: 1, localOnly: true },
});

export const LESSONS = Object.freeze({ 'ki-01': KI_MISSION_01, 'ki-02': KI_MISSION_02, 'ki-03': KI_MISSION_03, 'ki-04': KI_MISSION_04, 'ki-05': KI_MISSION_05, 'ki-06': KI_MISSION_06, 'ki-07': KI_MISSION_07, 'ki-08': KI_MISSION_08, 'ki-09': KI_MISSION_09, 'ki-10': KI_MISSION_10, 'ki-11': KI_MISSION_11, 'ki-12': KI_MISSION_12, 'ki-13': KI_MISSION_13, 'ki-14': KI_MISSION_14, 'ki-15': KI_MISSION_15, 'ki-16': KI_MISSION_16, 'ki-17': KI_MISSION_17, 'ki-18': KI_MISSION_18 });

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
