# Java-Lab

Das Java-Lab ist eine statische, datengetriebene Schüleroberfläche unter `/java`. Die Aufgaben liegen in `pages/java/tasks.json`; die Oberfläche in `pages/java/index.html`, `script.js` und `style.css`.

## Architektur

- `pages/java/tasks.json`: Lektionen, Aufgaben, Startercode, Hinweise und Validierung.
- `pages/java/script.js`: UI-Zustände, Editor, RUN/CHECK, Fortschritt und lokale XP.
- `public/java-runner.php`: `JavaRunner`-Abstraktion und Docker-Adapter.
- `public/index.php`: JSON-API `/api/java/run` und `/api/java/check`, Aufgabenbewertung, Rate Limit.
- `public/router.php`: lokale Auslieferung von `/java`.

## Runner und Sicherheit

Der Runner ist **fail-closed** und standardmäßig deaktiviert. Für eine Aktivierung benötigt der Server einen vorbereiteten Docker-Runner:

```text
LINGUACODE_JAVA_RUNNER_ENABLED=1
LINGUACODE_JAVA_DOCKER_IMAGE=linguacode-java-runner:23
LINGUACODE_JAVA_WORKDIR=/var/tmp/linguacode-java
LINGUACODE_RATE_LIMIT_SALT=<zufälliger Wert>
```

Der Docker-Prozess nutzt kein Netzwerk, ein read-only Root-Dateisystem, ein begrenztes Arbeitsverzeichnis, Speicher-/CPU-/PID-Limits, `no-new-privileges`, keine Linux-Capabilities, ein Zeitlimit und ein Ausgabelimit. Schülercode wird nie als Shell-Befehl zusammengesetzt. Der Container muss vor dem Betrieb mit einem aktuellen JDK-Image gebaut, gepatcht und administrativ geprüft werden.

Wenn Docker oder das Runner-Image fehlt, meldet die API `runner-unavailable`; die Anwendung fällt nicht auf unsichere lokale Shell-Ausführung zurück.

## Aufgabenformat

```json
{
  "id": "java-1-1-output",
  "type": "code",
  "instruction": "Gib exakt Ich lerne Java! aus.",
  "starterCode": "public class Main { ... }",
  "validation": {
    "compile": true,
    "expectedOutput": "Ich lerne Java!",
    "requiredPatterns": [],
    "forbiddenPatterns": []
  },
  "hints": ["Hinweis 1", "Hinweis 2"],
  "solution": "System.out.println(\"Ich lerne Java!\");"
}
```

`expectedOutput` wird normalisiert verglichen. `requiredPatterns` und `forbiddenPatterns` prüfen Konzepte ergänzend, nicht als alleinige Ausführung.

## Neue Lektion oder Aufgabe

1. Aufgabe in `pages/java/tasks.json` ergänzen.
2. Eine eindeutige ID vergeben.
3. `starterCode`, `hints` und `validation` definieren.
4. Für Codeaufgaben eine vollständige `public class Main` verwenden.
5. `php scripts/verify-java-lab.php` und die Syntaxprüfungen ausführen.

## API

- `POST /api/java/run` mit `{ "code": "..." }`
- `POST /api/java/check` mit `{ "code": "...", "lessonId": "1.1", "taskId": "java-1-1-output" }`

Antworten enthalten `success`, `compiled`, `stdout`, `stderr`, `exitCode`, `executionTime`, `status` und bei der Prüfung `feedback`.

## Troubleshooting

- `runner-unavailable`: Runner ist nicht aktiviert oder das Arbeitsverzeichnis fehlt.
- `compile-error`: Originale `javac`-Meldung steht in `stderr` und wird im UI angezeigt.
- `rate-limit`: maximal 30 Anfragen je 60 Sekunden und anonymisiertem temporärem Schlüssel.
- Auf GitHub Pages ist die Oberfläche statisch; echte Ausführung benötigt die PHP-Route `/java` auf dem konfigurierten LinguaCode-Host.
