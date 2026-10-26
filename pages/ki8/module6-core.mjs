// Independently authored fictional examples for critical evaluation; no real data, sources or services.
export const lessons = [
  {
    id: 'stunde-1', minutes: 45, title: 'Behauptungen kritisch prüfen',
    activities: [
      { id: 'kritik-1', prompt: 'Ein fiktiver Blog behauptet: „Unsere Lern-App macht dich in drei Tagen doppelt so klug.“ Welche Reaktion ist am kritischsten?', options: ['Die Aussage sofort weiterleiten, weil sie motivierend klingt.', 'Nach Belegen, Messmethode und einem fairen Vergleich fragen.', 'Die Aussage glauben, weil eine App immer objektiv misst.'], correct: 1, explanation: 'Eine gute Prüfung fragt nach Belegen, der Messmethode und einem Vergleich. Eine starke Behauptung ist nicht durch ihren Ton bewiesen.' },
      { id: 'kritik-2', prompt: 'Welche Frage hilft dir bei einer fiktiven Nachricht zuerst, die Quelle einzuschätzen?', options: ['Wer hat sie veröffentlicht und worauf verweist die Quelle?', 'Wie viele Ausrufezeichen stehen in der Überschrift?', 'Ob die Nachricht zu meiner ersten Meinung passt.'], correct: 0, explanation: 'Herkunft und Belege sind wichtige Prüfschritte. Lautstärke und persönliche Zustimmung sagen nichts über die Zuverlässigkeit aus.' },
    ],
  },
  {
    id: 'stunde-2', minutes: 45, title: 'Fehlinformation erkennen',
    activities: [
      { id: 'info-1', prompt: 'Eine erfundene Chatnachricht nennt eine sensationelle Zahl, aber kein Datum und keine Quelle. Was ist angemessen?', options: ['Sie als sicher wahr behandeln, weil die Zahl genau klingt.', 'Sie vor dem Teilen zurückhalten und die Behauptung mit verlässlichen Quellen vergleichen.', 'Die Zahl verändern, bis sie plausibel wirkt.'], correct: 1, explanation: 'Fehlende Quelle und fehlender Zeitpunkt sind Warnzeichen. Vor dem Teilen prüfst du die Behauptung unabhängig, statt sie zu verstärken.' },
      { id: 'info-2', prompt: 'Zwei fiktive Beiträge beschreiben dasselbe Ereignis unterschiedlich. Welcher nächste Schritt ist sinnvoll?', options: ['Nur den Beitrag lesen, der die eigene Meinung bestätigt.', 'Beide Überschriften vergleichen und nach überprüfbaren Originalinformationen suchen.', 'Den längeren Beitrag automatisch für richtig halten.'], correct: 1, explanation: 'Vergleichen, Einordnung und überprüfbare Originalinformationen helfen gegen Fehlinformation. Länge oder Zustimmung sind kein Beweis.' },
    ],
  },
  {
    id: 'stunde-3', minutes: 45, title: 'Privatsphäre schützen',
    activities: [
      { id: 'privacy-1', prompt: 'Eine fiktive Schreib-App möchte Namen, genaue Adresse und private Chattexte speichern, obwohl sie nur Rechtschreibung prüfen soll. Was passt zum Datenschutz?', options: ['Alle Daten eingeben, damit die App möglichst viel weiß.', 'Nur notwendige, erfundene Beispieldaten verwenden und die Datennutzung hinterfragen.', 'Die Daten eines anderen Menschen verwenden.'], correct: 1, explanation: 'Für eine Rechtschreibprüfung sind Adresse und private Texte nicht nötig. Datensparsamkeit und erfundene Beispiele schützen die Privatsphäre.' },
      { id: 'privacy-2', prompt: 'Du möchtest eine KI nach einem persönlichen Problem fragen. Welche Formulierung ist am sichersten?', options: ['Eine anonymisierte, allgemeine Beschreibung ohne Namen oder identifizierende Details.', 'Vollständiger Name, Schule und private Kontaktdaten.', 'Ein Foto eines privaten Dokuments mit allen Angaben.'], correct: 0, explanation: 'Eine allgemeine, anonymisierte Beschreibung reduziert identifizierende Informationen. Private Dokumente und Kontaktdaten gehören nicht in eine offene Eingabe.' },
    ],
  },
  {
    id: 'stunde-4', minutes: 45, title: 'Bias und Vorurteile untersuchen',
    activities: [
      { id: 'bias-1', prompt: 'Ein fiktives Auswahlmodell empfiehlt fast nur Personen aus einer einzigen Gruppe, weil die Trainingsdaten einseitig waren. Was zeigt das?', options: ['Daten können Vorurteile oder Verzerrungen in Modellvorschläge bringen.', 'Ein Modell ist immer fair, sobald es eine Zahl ausgibt.', 'Die betroffene Gruppe ist automatisch weniger geeignet.'], correct: 0, explanation: 'Einseitige Daten können zu Bias führen. Die Ausgabe beschreibt nicht automatisch die Eignung von Menschen und muss kritisch geprüft werden.' },
      { id: 'bias-2', prompt: 'Wie lässt sich ein fiktiver Bilder-Datensatz vor dem Training fairer prüfen?', options: ['Nur besonders einfache Beispiele behalten.', 'Gruppen und Situationen sichtbar machen, Lücken suchen und die Auswahl begründen.', 'Fehler verschweigen, damit die Genauigkeit besser aussieht.'], correct: 1, explanation: 'Eine begründete Prüfung auf Lücken und ein vielfältiger Datensatz können Verzerrungen sichtbar machen. Verschweigen verhindert Lernen aus Fehlern.' },
    ],
  },
  {
    id: 'stunde-5', minutes: 45, title: 'Verantwortungsvoll nutzen',
    activities: [
      { id: 'use-1', prompt: 'Eine KI schreibt einen fiktiven Absatz für ein Referat. Welche Nutzung ist verantwortlich?', options: ['Den Absatz ungeprüft als eigene Recherche abgeben.', 'Den Vorschlag als Entwurf kennzeichnen, Fakten prüfen und eigene Gedanken ergänzen.', 'Die KI für alle Entscheidungen verantwortlich machen.'], correct: 1, explanation: 'Ein KI-Vorschlag kann Fehler enthalten. Prüfen, transparent kennzeichnen und selbst weiterdenken erhält die eigene Verantwortung.' },
      { id: 'use-2', prompt: 'Wann solltest du eine KI-Antwort nicht allein für eine wichtige Entscheidung verwenden?', options: ['Wenn Folgen wichtig sind und die Antwort nicht nachvollziehbar oder überprüft ist.', 'Immer dann, wenn der Text freundlich klingt.', 'Nie, denn eine KI kann keine Fehler machen.'], correct: 0, explanation: 'Bei wichtigen Folgen brauchst du nachvollziehbare Informationen und gegebenenfalls menschliche Beratung. Freundlicher Ton ist keine Qualitätsgarantie.' },
    ],
  },
];

export function gradeChoice(id, choice) {
  const activity = lessons.flatMap(({activities}) => activities).find((item) => item.id === id);
  if (!activity || !Number.isInteger(choice) || choice < 0 || choice >= activity.options.length) throw new RangeError('Unbekannte Aufgabe oder Antwort.');
  return {correct: choice === activity.correct, explanation: activity.explanation};
}
