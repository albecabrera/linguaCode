# Spiele

`pages/spiele/` ist ein nativer, build-freier Bereich für Unterrichtsspiele auf einem gemeinsamen Bildschirm. Die fünf Spiele und der Editor unterstützen Touch auf Tablets und Smartboards: native Buttons bleiben per Touch, Maus und Tastatur bedienbar, Eingabefelder öffnen die virtuelle Tastatur, und die Seite behält Scrollen sowie Pinch-Zoom bei.

## Formate

- **Tauziehen:** Team A und Team B beantworten parallel und unabhängig ihre Fragen. Jede Frage kann neben der richtigen Antwort bis zu drei optionale falsche Antwortmöglichkeiten enthalten; diese werden automatisch geprüft, eindeutig validiert und per Klick angeboten. Ohne solche Möglichkeiten bleibt die bisherige Texteingabe erhalten. Textantworten werden automatisch verglichen: Unicode-Normalisierung (NFKC), trimmen, Leerraumfolgen zu einem Leerzeichen zusammenfassen und Groß-/Kleinschreibung ignorieren. Leere Antworten werden abgewiesen. Falsche Antworten zählen nicht und geben dem jeweiligen Team die nächste eigene Frage; richtige Antworten bewegen Seil und Figuren. Beide Teams spielen unabhängig bis alle eigenen Fragen beantwortet sind.
- **Glücksrad:** Fragen werden einmalig nacheinander gezogen.
- **Jeopardy:** Kategorien, Punkte und Fragen, die nach Auswahl deaktiviert werden.
- **Memory:** Eigene Kartenpaare aufdecken.
- **Zuordnen:** Begriffe passenden Gruppen zuordnen.

Für jedes Spiel können Titel, Beschreibung, Fach (Informatik, Spanisch, Sport, Mathematik), Klassenstufe und Inhalte bearbeitet werden.

## Speichern und Austausch

Spiele werden mit `localStorage` unter `linguacode.spiele.drafts.v1` gespeichert. Die Speicherung ist an den Browser und das Gerät gebunden. Sie veröffentlicht oder synchronisiert nichts automatisch. Wenn lokaler Speicher fehlt oder das Kontingent voll ist, wird kein Erfolg behauptet und der Entwurf bleibt im Editor erhalten. JSON-Export und -Import erlauben eine manuelle Sicherung bzw. Übertragung.

Importierte JSON-Dateien werden vor dem Öffnen vollständig validiert. Es werden keine externen Bilder oder ausführbaren Inhalte unterstützt.

## Verifikation

Deterministische Modell- und Speicherregeln:

```bash
node scripts/verify-spiele-model.mjs
```

Katalogregression und statische Sicherheitsregeln:

```bash
node scripts/verify-spiele-routes.mjs
```

DOM-UI-Prüfung ohne externe Abhängigkeiten (Editor, Import, Navigation und alle fünf Spiel-Handler):

```bash
node scripts/verify-spiele-ui.mjs
```

Touch-Browser-QA (isoliert, nur für lokale Prüfung): Playwright 1.65.1 sowie Chromium und WebKit liegen im projektlokalen Ordner `.spiele-browser-qa/`; die Produktionsabhängigkeiten bleiben unverändert. Die Touch-Suite erstellt und öffnet alle fünf Spiele in isolierten Chromium-/WebKit-Kontexten und schreibt `touch-*`-Screenshots nach `.spiele-browser-qa/evidence/`.

```bash
PLAYWRIGHT_BROWSERS_PATH="$PWD/.spiele-browser-qa/browsers" node scripts/verify-spiele-touch.mjs
```

Bestehende Browser-QA (Chromium, Desktop-/Tastaturregressionen):

```bash
PLAYWRIGHT_BROWSERS_PATH="$PWD/.spiele-browser-qa/browsers" node scripts/verify-spiele-browser.mjs
```

Bei einer neuen lokalen QA-Umgebung (nicht als Produktionsabhängigkeit) reproduzierbar mit privatem Manifest und lokalen Caches:

```bash
mkdir -p .spiele-browser-qa .spiele-browser-qa/npm-cache
printf '%s\n' '{"name":"linguacode-spiele-browser-qa","private":true,"type":"module"}' > .spiele-browser-qa/package.json
npm install --prefix .spiele-browser-qa --cache "$PWD/.spiele-browser-qa/npm-cache" --ignore-scripts playwright@1.65.1
PLAYWRIGHT_BROWSERS_PATH="$PWD/.spiele-browser-qa/browsers" .spiele-browser-qa/node_modules/.bin/playwright install chromium webkit
```

Danach startet der Test einen statischen Loopback-Server mit `/linguaCode/`-Basis-Pfad und schreibt Screenshots sowie temporäre Export-/Importdateien nach `.spiele-browser-qa/evidence/`. Er prüft im echten Chromium Create/Save/Reopen/Export/Import, alle fünf Spiele, Tastatur, Touch-Emulation, 1440×900, 390×844, reduzierte Bewegung, Filter und EduPlay-Link. Normales `localStorage` wird genutzt; frische Kontexte simulieren nicht verfügbaren Speicher durch fehlschlagendes `getItem`/`setItem` sowie ein Kontingentproblem durch fehlschlagendes `setItem`. Der gültige Entwurf bleibt dabei im Editor und erzeugt keine Karte. Ein echter Browser-Quota-Overflow wurde nicht simuliert. Auch bei absichtlich fehlschlagendem `window.localStorage`-Getter rendert die App weiter; ein gültiger Entwurf bleibt im Editor und zeigt eine ehrliche Nicht-speichern-Meldung. Unter `prefers-reduced-motion: reduce` prüft der Wheel-Test nur unterschiedliche Fragen, Zustand und Erschöpfung; sichtbare Animationsbewegung wird dort nicht behauptet.

Nicht bewiesen: reale Smartboard-/iPad-Hardware, andere Browser, Netzwerkbetrieb, Veröffentlichung oder Synchronisation. Die Animationsbewegung ist eine lokale CSS-Illustration ohne fremde Assets; reduzierte Bewegung deaktiviert Animationen und Übergänge. Die lokale WebKit-Prüfung ist Geräteemulation und keine Safari-/Hardware-Zertifizierung. Tauziehen versucht beim ausdrücklichen Start (Vorschau, Spielen oder eigenständiger Start) einmalig den Vollbildmodus; bei Ablehnung oder fehlender Unterstützung bleibt ein zugänglicher Hinweis sichtbar. Die manuelle Vollbild-Schaltfläche bleibt verfügbar, und ein bereits aktiver Vollbildmodus wird beim Navigieren nicht beendet. Browser-Fehler und fehlende Assets lassen den Test fehlschlagen.
