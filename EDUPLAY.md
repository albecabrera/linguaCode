# EduPlay

EduPlay ergänzt die öffentliche LinguaCode-Seite um Quiz, Memory, Kreuzworträtsel und Klassifikation. Das Studio erstellt lokale Entwürfe ohne Anmeldung. Es ist **kein geschützter Lehrerbereich** und speichert nichts auf einem Server. Lernende benötigen keine Registrierung; Spielergebnisse werden nicht in Aktivitätsdateien gespeichert.

## Architektur und Dateien

Die Anwendung verwendet native JavaScript-Module und benötigt keinen Paketmanager. GitHub Pages veröffentlicht ausschließlich `pages/`.

- `pages/eduplay/index.html`, `app.mjs`, `style.css`: Oberfläche und Navigation.
- `pages/eduplay/model.mjs`, `storage.mjs`, `routes.mjs`: Validierung, austauschbare lokale Speicherung und Links.
- `pages/eduplay/quiz.mjs`, `memory.mjs`, `crossword.mjs`, `crossword-ui.mjs`, `classification.mjs`: Spiele.
- `pages/eduplay/studio.mjs`: grafischer Editor und JSON-Import/-Export.
- `pages/eduplay/examples.mjs`: mit der Website ausgelieferte Beispiele.
- `scripts/verify-eduplay-*.mjs`: fokussierte Node-Tests.

## Lokal starten

Im Projektverzeichnis `python3 -m http.server 8000 --directory pages` ausführen und `http://localhost:8000/eduplay/` öffnen. Ein HTTP-Server ist für JavaScript-Module erforderlich. Es gibt keinen Build-Schritt. Das PHP-Studio ist für EduPlay nicht erforderlich.

## Aktivitäten erstellen

Im EduPlay Studio einen Spieltyp auswählen, Titel, Beschreibung, Fach und Klasse eingeben und Inhalte hinzufügen. Antworten im Quiz als richtig markieren; bei Klassifikation zuerst Kategorien anlegen. Das Studio kann Inhalte verschieben, löschen, validieren, in einer Vorschau öffnen und lokal speichern. Für Memory kann pro Karte Text und optional eine Bildadresse eingetragen werden. Bildadressen dürfen nur relative Pfade innerhalb derselben Website sein (zum Beispiel `/images/karte.png` oder `./images/karte.webp`) oder begrenzte Base64-Daten-URLs für PNG, JPEG, GIF und WebP. Externe URLs, protocol-relative URLs, lokale Netzwerkadressen sowie SVG-Daten werden abgelehnt.

Lokale Entwürfe sind an Browser und Gerät gebunden. Browserdaten können gelöscht oder unzugänglich werden: wichtige Entwürfe regelmäßig als JSON exportieren. Importierte Dateien werden vor der Bearbeitung validiert; ein Import überschreibt nicht automatisch einen gespeicherten Entwurf. Ein gespeicherter Entwurf ist nicht öffentlich und erhält keinen öffentlichen Freigabelink.

## Datenformat, Import und Export

Version 1 ist ein JSON-Objekt mit `id`, `schemaVersion`, `type`, `title`, `description`, `subject`, `grade`, `language`, `createdAt`, `updatedAt`, `settings` und `content`. IDs müssen innerhalb ihrer jeweiligen Sammlung eindeutig sein; Zeitstempel sind ISO-8601-Datumsangaben. `settings` ist ein Objekt; `timerEnabled` aktiviert den Timer bei Quiz und Memory. Beim Quiz setzt `timerSeconds` optional die Zeit pro Frage; `shuffleQuestions` mischt die Fragen. Bei Memory deaktiviert `shuffleCards: false` das Mischen; `pairCount` begrenzt die Anzahl verwendeter Paare und `difficulty` (`easy`, `medium`, `hard`) steuert, wie lange falsche Paare sichtbar bleiben.

- `quiz`: `content.questions` enthält `{id, question, type, options, correctOptionIds, explanation}`. `type` ist `single-choice`, `multiple-choice` oder `true-false`; Optionen enthalten `{id, text}`.
- `memory`: `content.pairs` enthält `{id, first, second}`. Jede Seite ist Text oder `{text, image}`; die Paar-ID bestimmt die Zuordnung.
- `crossword`: `content.words` enthält `{id, word, clue}`. Es sind höchstens 60 Wörter mit höchstens 24 normalisierten Buchstaben pro Wort erlaubt. Der Generator begrenzt das Raster auf 40 × 40 Felder und auf 5.000 deterministische Platzierungskandidaten. Nicht platzierbare Wörter werden vollständig in `unplaced` zurückgegeben; Wörter werden niemals still abgeschnitten oder ein unvollständiges Rätsel veröffentlicht.
- `classification`: `content.categories` enthält `{id, name}`, `content.items` enthält `{id, text, categoryId}`.

Der Import akzeptiert JSON-Dateien bis 1 MB. Zusätzlich begrenzt das gemeinsame Modell jede Sammlung auf höchstens 1.000 Einträge, jeden Textwert auf 10.000 Zeichen und Raster-Bilddaten-URLs auf 256 KiB decodierte Daten. Für Kreuzworträtsel gelten die strengeren Grenzen von 60 Wörtern und 24 normalisierten Buchstaben pro Wort; der Generator verwendet höchstens 40 × 40 Rasterfelder und 5.000 deterministische Platzierungskandidaten. Überschreitet die Suche dieses Budget, endet sie und liefert alle nicht platzierten Wörter explizit zurück. Die Validierung beendet übergroße Sammlungen, zu tiefe Strukturen und überschrittene Prüfbudgets frühzeitig. Diese Grenzen gelten bei Import, Export und lokaler Speicherung; ungültige Daten werden vollständig abgelehnt und nicht abgeschnitten oder still verändert. Unbekannte Schema-Versionen werden abgelehnt; `migrateActivity` ist der Einstiegspunkt für zukünftige Migrationen. Export enthält Aktivitätsdaten, keine Spielergebnisse. Vor Weitergabe Dateien auf vertrauliche oder personenbezogene Inhalte prüfen. Benutzertexte werden als Text und nicht als HTML dargestellt.

## Veröffentlichung und Links

Der lokale Export allein veröffentlicht keine Aktivität. Um eine Aktivität zu veröffentlichen, muss sie in die mit der Website ausgelieferten Daten unter `pages/eduplay/examples.mjs` übernommen, fachlich und technisch geprüft und mit der Website bereitgestellt werden. Das ist derzeit ein manueller Entwicklungsschritt. Vorher sind Freigabelinks für lokale Entwürfe nicht verfügbar. Nach dem Deployment liefert die Übersicht Links und QR-Codes für die mitgelieferten Aktivitäten; deren öffentliche Erreichbarkeit muss nach dem Deployment geprüft werden.

Direktlinks verwenden `eduplay/?game=<id>`; relative Pfade funktionieren auch unter dem GitHub-Pages-Basispfad `/linguaCode/`. Eine Änderung der ID bricht bestehende Links. Das Projekt-Deployment veröffentlicht `pages/` durch den bestehenden GitHub-Actions-Workflow; EduPlay führt selbst kein Deployment aus.

## Spätere Backend- und KI-Anbindung

`createDraftStore` kapselt die lokale Speicherung. Ein späteres Backend sollte einen eigenen authentifizierten Dienst mit serverseitiger Validierung und klarer Berechtigungskontrolle bereitstellen. Das aktuelle Interface ist synchron; eine Netzwerkimplementierung erfordert eine asynchrone Anpassung der Studio-Aufrufe. KI-Vorschläge sollten serverseitig erzeugt und anschließend im Studio geprüft werden; keine API-Schlüssel im Frontend ablegen und keine ungeprüften Inhalte automatisch veröffentlichen.

## Bekannte Einschränkungen

- Kein Server-Login, keine Synchronisierung und keine Veröffentlichung aus dem Browser.
- Kreuzworträtsel verwendet die Normalisierung Ä→AE, Ö→OE, Ü→UE, ß→SS; andere diakritische Zeichen werden entfernt, sonstige Nichtbuchstaben verworfen. Der Generator ist heuristisch und kann Wörter melden, obwohl eine andere Anordnung möglich wäre.
- Memory-Bilder verwenden ausschließlich relative same-origin-Pfade oder begrenzte sichere Raster-Daten-URLs. HTML, SVG, Skripte, externe Hosts und lokale Netzwerkadressen werden nicht gerendert.
- Die Bedienbarkeit in echten Browsern, auf Touch-Geräten und mit unterstützenden Technologien muss vor Produktiveinsatz überprüft werden.

## Tests

`for f in scripts/verify-eduplay-*.mjs; do node "$f" || exit; done` führt die fokussierten Tests aus. Zusätzlich sind manuell Desktop und iPad/Smartphone, Tastaturnavigation, Drag-and-drop und Tippen, Bildkarten, Vollbild, QR-Druck, Export/Import sowie Reload direkter Links auf dem veröffentlichten GitHub-Pages-Pfad zu prüfen. Die Node-Tests ersetzen diese Browserprüfungen nicht.
