# Inhaltsformate

Die Daten einer Übung werden getrennt von ihrer Engine als JSON gespeichert.

## Quiz

```json
{
  "questions": [
    {"question": "¿Cómo estás?", "options": ["Wie geht es dir?", "Wie heißt du?"], "answer": 0}
  ]
}
```

`answer` ist der bei 0 beginnende Index der richtigen Antwort.

## Memory und Zuordnung

```json
{
  "pairs": [
    {"left": "hola", "right": "Hallo"},
    {"left": "adiós", "right": "Tschüss"}
  ]
}
```

Memory verdeckt beide Begriffe; bei Zuordnung werden linke und rechte Begriffe verbunden.

## Lückentext

```json
{
  "text": "Das EVA-Prinzip steht für {{0}}, {{1}} und {{2}}.",
  "blanks": ["Eingabe", "Verarbeitung", "Ausgabe"]
}
```

Die Platzhalter müssen bei `{{0}}` beginnen und genau zur Reihenfolge von `blanks` passen.
