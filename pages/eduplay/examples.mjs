// Shipped activities are public teaching material, not private drafts.
const stamp = '2026-01-01T00:00:00Z';
const base = (id, type, title, description, subject, grade, content) => ({
  id, schemaVersion: 1, type, title, description, subject, grade, language: 'de',
  createdAt: stamp, updatedAt: stamp, settings: {}, content,
});
const question = (id, question, options, correct, explanation) => ({
  id, question, type: 'single-choice',
  options: options.map((text, index) => ({ id: `a${index + 1}`, text })),
  correctOptionIds: [`a${correct + 1}`], explanation,
});
const quiz = base('hardware-quiz-001', 'quiz', 'Hardware und Software', 'Entdecke Geräte, Programme und ihre Aufgaben.', 'Informatik', '6', {
  questions: [
    question('q1','Was ist Hardware?',['Tastatur','Textverarbeitung','Betriebssystem'],0,'Eine Tastatur ist ein physisches Eingabegerät.'),
    question('q2','Was ist Software?',['Monitor','Browser','Maus'],1,'Ein Browser ist ein Programm.'),
    question('q3','Welches Gerät zeigt Bilder an?',['Monitor','Mikrofon','Tastatur'],0,'Der Monitor ist ein Ausgabegerät.'),
    question('q4','Was nimmt Sprache auf?',['Drucker','Mikrofon','Bildschirm'],1,'Ein Mikrofon erfasst Schall als Eingangssignal.'),
    question('q5','Welche Aufgabe hat ein Betriebssystem?',['Es verwaltet Hardware und Programme.','Es druckt immer auf Papier.','Es ersetzt die Tastatur.'],0,'Das Betriebssystem verwaltet Ressourcen und ermöglicht die Nutzung von Programmen.'),
    question('q6','Was ist ein Eingabegerät?',['Maus','Lautsprecher','Beamer'],0,'Mit der Maus werden Eingaben vorgenommen.'),
    question('q7','Was ist ein Ausgabegerät?',['Scanner','Lautsprecher','Mikrofon'],1,'Lautsprecher geben Ton aus.'),
    question('q8','Womit kann man Texte bearbeiten?',['Textverarbeitung','Netzteil','Kabel'],0,'Eine Textverarbeitung ist eine Anwendung.'),
    question('q9','Was speichert Dateien dauerhaft?',['SSD','Arbeitsspeicher','Prozessor'],0,'Eine SSD speichert Daten auch ohne Strom.'),
    question('q10','Was gehört zur Hardware?',['Prozessor','App','Computerspiel'],0,'Der Prozessor ist ein physisches Bauteil.'),
  ],
});
const memory = base('spanisch-memory-001', 'memory', 'Vocabulario básico', 'Finde die spanischen Wörter und ihre deutschen Bedeutungen.', 'Spanisch', '7', {
  pairs: [['hola','hallo'],['adiós','tschüss'],['gracias','danke'],['por favor','bitte'],['la casa','das Haus'],['el libro','das Buch'],['la escuela','die Schule'],['el amigo','der Freund']].map(([first,second], index) => ({id:`p${index+1}`,first,second})),
});
const crossword = base('algorithmen-kreuzwort-001', 'crossword', 'Algorithmen', 'Finde wichtige Begriffe rund um Algorithmen.', 'Informatik', '7', {
  words: [
    ['ALGORITHMUS','Eine eindeutige Folge von Schritten zur Lösung einer Aufgabe.'],
    ['ANWEISUNG','Ein einzelner auszuführender Schritt.'],
    ['EINGABE','Daten, die einem Programm übergeben werden.'],
    ['AUSGABE','Ein Ergebnis, das ein Programm bereitstellt.'],
    ['BEDINGUNG','Eine Aussage, die wahr oder falsch sein kann.'],
    ['SCHLEIFE','Eine Struktur zur Wiederholung von Schritten.'],
    ['VARIABLE','Ein benannter Speicherplatz für einen veränderlichen Wert.'],
    ['PROGRAMM','Eine in einer Programmiersprache formulierte Folge von Anweisungen.'],
  ].map(([word,clue], index) => ({id:`w${index+1}`,word,clue})),
});
const categories = [{id:'daten',name:'Daten'},{id:'anwendung',name:'Anwendungen'},{id:'risiko',name:'Risiken'}];
const classification = base('ki-zuordnung-001', 'classification', 'Künstliche Intelligenz', 'Ordne Beispiele den passenden Bereichen zu.', 'Informatik', '8', {
  categories,
  items: [
    ['Trainingsbilder','daten'],['Beispieltexte','daten'],['Messwerte','daten'],['Audioaufnahmen','daten'],
    ['Spracherkennung','anwendung'],['Maschinelle Übersetzung','anwendung'],['Bilderkennung','anwendung'],['Empfehlungssystem','anwendung'],
    ['Verzerrte Trainingsdaten','risiko'],['Falschinformationen','risiko'],['Verletzung der Privatsphäre','risiko'],['Benachteiligende Entscheidungen','risiko'],
  ].map(([text,categoryId], index) => ({id:`i${index+1}`,text,categoryId})),
});
export const activities = [quiz, memory, crossword, classification];
