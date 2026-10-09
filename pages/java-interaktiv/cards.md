# LinguaCode – Java-Lernkartei (Oberstufe NRW)

> **Implementierungsbriefing und vollständiger Karteninhalt (78 Karten)**  
> Fach: Informatik · Zielgruppe: EF bis Q-Phase · Sprache: Deutsch  
> Quelle: die in dieser Unterhaltung konzipierten Java-Präsentationsfolien 1–78.

## Auftrag für die LinguaCode-App

Integriere eine **interaktive Lernkartei „Java Oberstufe NRW“** als neues Lernmodul in LinguaCode. Verwende die Karten unten als **inhaltliche Datenquelle**. Die Ansicht soll auf iPad, Laptop und Smartboard funktionieren. Bestehende Routen, Komponenten, Design- und Datenschutzmechanismen der App erhalten; nicht ungefragt umstrukturieren.

### Erforderliche Funktionen

1. **Lernsets** nach Themen/Nummerierung; wählbar sind alle Karten, eine Einheit oder ein individuell gemischter Satz.
2. **Vorderseite:** Frage, optionales Java-Codebeispiel mit Syntaxhervorhebung. **Rückseite:** korrekte Antwort und kurze Erklärung; zunächst verborgen, per Tippen aufdecken.
3. **Lernmodus:** nächste/vorherige Karte; „gewusst“/„noch üben“; Fortschritt und lokale Sitzungsauswertung.
4. **Quizmodus:** Bei geeigneten Fragen Multiple Choice mit mindestens drei plausiblen Alternativen erzeugen, die richtige Antwort erst nach Eingabe zeigen. Bei offen formulierten Fragen Selbsteinschätzung statt unzuverlässiger exakter Freitextbewertung.
5. **Code-Challenge:** Bei Karten mit `Typ: simulation` vorhandene interaktive Beispiel-Simulatoren aus der Präsentation nachbauen (nur gültige, klar definierte Teilmenge); niemals beliebigen Java-Code als ausgeführt ausgeben. Für echten Java-Code optional eine bestehende sichere Laufzeitumgebung anbinden, **keinen** unsicheren serverseitigen Shell-Executor bauen.
6. **Lehrermodus:** Lösung/Antworten standardmäßig verborgen; auf Knopfdruck aufdecken; Smartboard-Schriftgröße und Tastatur-/Touch-Navigation.
7. **Speicherstand:** Lernfortschritt datensparsam speichern; ohne Klarnamen von Lernenden. Falls Serverpersistenz genutzt wird, vorhandenes anonymes Session-/Alias-System verwenden.
8. **Barrierearmut:** Tastaturbedienung, klare Fokuszustände, hohe Kontraste, keine ausschließlich farbcodierten Rückmeldungen.
9. **Import:** Karten anhand `Karte: N`, `Themenbereich`, `Frage`, `Antwort`, `Java-Beispiel`, `Typ` zuverlässig einlesen; Codeblöcke niemals anhand von Semikolons oder Zeilenumbrüchen trennen.
10. **Qualitätssicherung:** Tests für Parsing, Kartenreihenfolge, Anzeigen/Verbergen, Quiz-Auswertung und Grenzfälle; vor Deployment bestehende Tests ausführen.

### Lernsets

- **1–8:** Java-Grundlagen
- **9–18:** Variablen und Datentypen
- **19–24:** Bedingungen und Entscheidungen
- **25–30:** Schleifen
- **31–36:** Methoden
- **37–48:** Objektorientierung und Testen
- **49–53:** Arrays
- **54–58:** ArrayList und Referenzen
- **59–63:** Rekursion
- **64–68:** Suchen und Sortieren
- **69–73:** Stack, Queue und verkettete Listen
- **74–78:** Effizienz, Tests und Projekt

### Didaktische Hinweise

- Die Kartei enthält **Lern- und Wiederholungsfragen**, ersetzt nicht das eigenständige Implementieren und Testen mit einem Java-Compiler.
- Beispiele sind Unterrichtsausschnitte; nicht jeder einzelne Java-Codeblock ist eine eigenständig kompilierbare Datei.
- Im NRW-Oberstufenunterricht auch UML, Abstraktion, Modellierung und die für den gewählten Lehrplan/Abiturjahrgang festgelegten Datenstruktur-Schnittstellen berücksichtigen.
- Manche Standardbibliotheksbeispiele verwenden `java.util.ArrayList`, `java.util.Stack` und `java.util.Queue`; ggf. gesondert mit den in NRW-Unterlagen vorgegebenen Klassen vergleichen.

---

## Karteikarten

### Karte: 01 – Hallo Welt
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Was ist das Ziel unseres ersten Java-Programms?
- **Antwort:** Den Text „Hallo Welt!“ auf der Konsole ausgeben.

**Java-Beispiel:**

```java
System.out.println("Hallo Welt!");
```

### Karte: 02 – Erste Klasse
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Was bedeutet class in Java?
- **Antwort:** Mit class definierst du eine Klasse: den Bauplan für Objekte.

**Java-Beispiel:**

```java
public class HalloWelt { }
```

### Karte: 03 – Klassenname
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Welche Aufgabe hat HalloWelt in public class HalloWelt?
- **Antwort:** HalloWelt ist der Name der Klasse.

**Java-Beispiel:**

```java
public class HalloWelt { }
```

### Karte: 04 – Startmethode
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Wofür steht main?
- **Antwort:** main ist der Einstiegspunkt einer üblichen Java-Anwendung.

**Java-Beispiel:**

```java
public static void main(String[] args) { }
```

### Karte: 05 – public static void
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Was bedeuten public, static und void bei main?
- **Antwort:** public: aufrufbar; static: ohne Instanz aufrufbar; void: kein Rückgabewert.

**Java-Beispiel:**

```java
public static void main(String[] args) { }
```

### Karte: 06 – println
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Welche Aufgabe hat System.out.println?
- **Antwort:** Gibt den übergebenen Wert aus und beginnt anschließend eine neue Zeile.

**Java-Beispiel:**

```java
System.out.println("Hallo Welt!");
```

### Karte: 07 – Geschweifte Klammern
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Wozu dienen { und }?
- **Antwort:** Sie kennzeichnen zusammengehörige Codeblöcke, etwa Klasse und Methode.

**Java-Beispiel:**

```java
public class Beispiel {
  public static void main(String[] args) {
  }
}
```

### Karte: 08 – Erste Lernkontrolle
- **Themenbereich:** Grundlagen
- **Typ:** flashcard
- **Frage:** Wie sieht ein vollständiges Java-Programm mit Ausgabe aus?
- **Antwort:** Eine Klasse mit main-Methode und println-Anweisung.

**Java-Beispiel:**

```java
public class HalloWelt {
  public static void main(String[] args) {
    System.out.println("Hallo Welt!");
  }
}
```

### Karte: 09 – Speichern
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was ist eine Variable?
- **Antwort:** Ein benannter Speicherplatz für einen Wert eines bestimmten Datentyps.

**Java-Beispiel:**

```java
int alter = 12;
```

### Karte: 10 – Variable lesen
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Welche Ausgabe liefert int alter = 12; System.out.println(alter);?
- **Antwort:** 12

**Java-Beispiel:**

```java
int alter = 12;
System.out.println(alter);
```

### Karte: 11 – Datentypen
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Wofür stehen int, String und boolean?
- **Antwort:** int: ganze Zahl; String: Text; boolean: true oder false.

**Java-Beispiel:**

```java
int punkte = 15;
String name = "Mia";
boolean fertig = true;
```

### Karte: 12 – Ganzzahlen
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Welcher Datentyp eignet sich für eine ganze Zahl?
- **Antwort:** int, sofern der Wertebereich passt.

**Java-Beispiel:**

```java
int anzahl = 8;
```

### Karte: 13 – Zuweisung
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was bewirkt alter = 14; nach int alter = 12;?
- **Antwort:** Der Wert wird von 12 auf 14 geändert.

**Java-Beispiel:**

```java
int alter = 12;
alter = 14;
```

### Karte: 14 – Punkt vor Strich
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was ergibt 10 + 5 * 2?
- **Antwort:** 20, denn die Multiplikation erfolgt zuerst.

**Java-Beispiel:**

```java
System.out.println(10 + 5 * 2);
```

### Karte: 15 – Addition
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was gibt System.out.println(a + b) für a=7 und b=5 aus?
- **Antwort:** 12

**Java-Beispiel:**

```java
int a = 7;
int b = 5;
System.out.println(a + b);
```

### Karte: 16 – Verkettung
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was gibt "Alter: " + 12 aus?
- **Antwort:** Alter: 12

**Java-Beispiel:**

```java
System.out.println("Alter: " + 12);
```

### Karte: 17 – Fehler erkennen
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Was geschieht beim Zugriff auf eine nicht deklarierte Variable?
- **Antwort:** Ein Kompilierfehler, weil der Name nicht aufgelöst werden kann.

**Java-Beispiel:**

```java
System.out.println(name); // name nicht deklariert
```

### Karte: 18 – Mini-Programm
- **Themenbereich:** Variablen
- **Typ:** flashcard
- **Frage:** Wie kombiniert man String und int in einer Ausgabe?
- **Antwort:** Mit dem + Operator zur Textverkettung.

**Java-Beispiel:**

```java
String name = "Mia";
int alter = 12;
System.out.println("Hallo " + name + ", du bist " + alter);
```

### Karte: 19 – if/else
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Was gibt das Programm für alter=17 aus?
- **Antwort:** Minderjährig

**Java-Beispiel:**

```java
int alter=17;
if(alter>=18) System.out.println("Volljährig");
else System.out.println("Minderjährig");
```

### Karte: 20 – boolean
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Was ergibt 17 >= 18?
- **Antwort:** false

**Java-Beispiel:**

```java
boolean volljaehrig = 17 >= 18;
```

### Karte: 21 – Vergleichsoperatoren
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Was ergeben 7==7, 7!=7 und 7>3?
- **Antwort:** true, false, true

**Java-Beispiel:**

```java
int x=7;
System.out.println(x==7);
System.out.println(x!=7);
System.out.println(x>3);
```

### Karte: 22 – Bestanden?
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Ist punkte=49 bei der Grenze >=50 bestanden?
- **Antwort:** Nein, die else-Alternative wird ausgeführt.

**Java-Beispiel:**

```java
if(punkte>=50) System.out.println("Bestanden");
else System.out.println("Nicht bestanden");
```

### Karte: 23 – Logisches UND
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Wann ist A && B true?
- **Antwort:** Nur wenn A und B beide true sind.

**Java-Beispiel:**

```java
boolean ok = alter>=16 && ausweis;
```

### Karte: 24 – Grenzwerte testen
- **Themenbereich:** Entscheidungen
- **Typ:** flashcard
- **Frage:** Welche Werte eignen sich zum Test von alter>=18?
- **Antwort:** 17, 18 und 19 – direkt unter, auf und über der Grenze.

**Java-Beispiel:**

```java
if(alter>=18) { /* ... */ }
```

### Karte: 25 – for
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Wie oft läuft i=1; i<=3; i++?
- **Antwort:** Dreimal: für i = 1, 2, 3.

**Java-Beispiel:**

```java
for(int i=1;i<=3;i++) System.out.println(i);
```

### Karte: 26 – Start bei Null
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Was gibt for(int i=0;i<5;i++) aus?
- **Antwort:** 0, 1, 2, 3, 4

**Java-Beispiel:**

```java
for(int i=0;i<5;i++) System.out.println(i);
```

### Karte: 27 – Wertetabelle
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Was gibt i*2 für i=1 bis 4 aus?
- **Antwort:** 2, 4, 6, 8

**Java-Beispiel:**

```java
for(int i=1;i<=4;i++) System.out.println(i*2);
```

### Karte: 28 – Schleifengrenze
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Welche Ausgabe entsteht für die Obergrenze 0 bei i=1;i<=grenze;i++?
- **Antwort:** Keine Ausgabe – die Bedingung ist von Anfang an falsch.

**Java-Beispiel:**

```java
for(int i=1;i<=0;i++) System.out.println(i);
```

### Karte: 29 – while
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Wie beendet i++ die while-Schleife?
- **Antwort:** Es erhöht i, sodass i<=3 schließlich falsch wird.

**Java-Beispiel:**

```java
int i=1;
while(i<=3){ System.out.println(i); i++; }
```

### Karte: 30 – Endlosschleife
- **Themenbereich:** Schleifen
- **Typ:** flashcard
- **Frage:** Welcher Fehler steckt in while(i<=3) ohne Änderung von i?
- **Antwort:** Die Bedingung bleibt wahr und die Schleife terminiert nicht regulär.

**Java-Beispiel:**

```java
int i=1;
while(i<=3) System.out.println(i);
```

### Karte: 31 – Methoden definieren
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Wozu dient eine Methode?
- **Antwort:** Sie bündelt wiederverwendbare Anweisungen unter einem Namen.

**Java-Beispiel:**

```java
public static void begruessen(){ System.out.println("Hallo!"); }
```

### Karte: 32 – Parameter
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Was gibt hallo("Mia") aus?
- **Antwort:** Hallo Mia

**Java-Beispiel:**

```java
static void hallo(String name){ System.out.println("Hallo " + name); }
```

### Karte: 33 – return
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Was ergibt doppelt(7)?
- **Antwort:** 14

**Java-Beispiel:**

```java
static int doppelt(int x){ return x*2; }
```

### Karte: 34 – Parameter variieren
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Was ergibt doppelt(-3)?
- **Antwort:** -6

**Java-Beispiel:**

```java
static int doppelt(int x){ return x*2; }
```

### Karte: 35 – Quadrat
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Wie lautet der Aufruf für das Quadrat von 6?
- **Antwort:** quadrat(6), Rückgabe 36.

**Java-Beispiel:**

```java
static int quadrat(int zahl){ return zahl*zahl; }
```

### Karte: 36 – Rückgabetyp
- **Themenbereich:** Methoden
- **Typ:** flashcard
- **Frage:** Was bedeutet int vor addiere?
- **Antwort:** Die Methode gibt eine ganze Zahl vom Typ int zurück.

**Java-Beispiel:**

```java
static int addiere(int a,int b){ return a+b; }
```

### Karte: 37 – Objektmodell
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Welche Attribute/Methoden passen zu einem Konto?
- **Antwort:** Attribute: Inhaber, Kontostand; Methoden: einzahlen, abheben.

**Java-Beispiel:**

```java
class Konto { /* Attribute und Methoden */ }
```

### Karte: 38 – Attribute
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Was ist im Konto-Beispiel ein Attribut?
- **Antwort:** kontostand: eine Zustandsvariable eines Konto-Objekts.

**Java-Beispiel:**

```java
class Konto { private double kontostand; }
```

### Karte: 39 – new
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Was bewirkt new Konto()?
- **Antwort:** Es erzeugt ein neues Objekt der Klasse Konto.

**Java-Beispiel:**

```java
Konto a = new Konto();
Konto b = new Konto();
```

### Karte: 40 – Konstruktor
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Was macht ein Konstruktor?
- **Antwort:** Er initialisiert ein Objekt bei dessen Erzeugung.

**Java-Beispiel:**

```java
public Konto(double startwert){ kontostand=startwert; }
```

### Karte: 41 – Zustand
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Wie hoch ist der Kontostand nach Start=100, +25, +10?
- **Antwort:** 135

**Java-Beispiel:**

```java
Konto konto=new Konto(100);
konto.einzahlen(25);
konto.einzahlen(10);
```

### Karte: 42 – UML
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Wofür stehen + und - im UML-Klassendiagramm?
- **Antwort:** + public, - private.

**Java-Beispiel:**

```java
- kontostand: double
+ einzahlen(betrag: double): void
```

### Karte: 43 – private
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Warum darf ein anderes Objekt kontostand nicht direkt verändern?
- **Antwort:** Weil das Attribut private ist.

**Java-Beispiel:**

```java
private double kontostand;
```

### Karte: 44 – Assoziation
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Was bedeutet private Schueler sprecher; in Kurs?
- **Antwort:** Kurs hält eine Referenz auf ein Schueler-Objekt.

**Java-Beispiel:**

```java
class Kurs { private Schueler sprecher; }
```

### Karte: 45 – Vererbung
- **Themenbereich:** Objektorientierung
- **Typ:** flashcard
- **Frage:** Welche Bedeutung hat extends?
- **Antwort:** Die Unterklasse erbt von der Oberklasse.

**Java-Beispiel:**

```java
class Fahrrad extends Fahrzeug {}
```

### Karte: 46 – Grenzwerte
- **Themenbereich:** Testen
- **Typ:** flashcard
- **Frage:** Welche drei Tests sind für punkte>=50 sinnvoll?
- **Antwort:** 49, 50, 51.

**Java-Beispiel:**

```java
if(punkte>=50) { /* bestanden */ }
```

### Karte: 47 – Konto modellieren
- **Themenbereich:** Projekt
- **Typ:** flashcard
- **Frage:** Welche Sicherheitsregeln sollte eine abheben-Methode prüfen?
- **Antwort:** Positiver Betrag und ausreichendes Guthaben.

**Java-Beispiel:**

```java
class Konto { private double kontostand; }
```

### Karte: 48 – Zustand und Verhalten
- **Themenbereich:** Lernkontrolle
- **Typ:** flashcard
- **Frage:** Was ist der Unterschied zwischen Attribut und Methode?
- **Antwort:** Attribut beschreibt Zustand, Methode Verhalten.

**Java-Beispiel:**

```java
class Konto { private double stand; public void einzahlen(double b){} }
```

### Karte: 49 – Array
- **Themenbereich:** Arrays
- **Typ:** flashcard
- **Frage:** Warum benutzt man Arrays?
- **Antwort:** Um mehrere Werte eines Typs zusammen zu verwalten.

**Java-Beispiel:**

```java
int[] punkte={8,12,15,10};
```

### Karte: 50 – Index
- **Themenbereich:** Arrays
- **Typ:** flashcard
- **Frage:** Was gibt a[1] bei {4,9,12} aus?
- **Antwort:** 9, denn die Indizes beginnen bei 0.

**Java-Beispiel:**

```java
int[] a={4,9,12};
System.out.println(a[1]);
```

### Karte: 51 – Array-Schleife
- **Themenbereich:** Arrays
- **Typ:** flashcard
- **Frage:** Welche Werte werden ausgegeben?
- **Antwort:** 2, 4 und 6.

**Java-Beispiel:**

```java
int[] a={2,4,6};
for(int i=0;i<a.length;i++) System.out.println(a[i]);
```

### Karte: 52 – Indexfehler
- **Themenbereich:** Arrays
- **Typ:** flashcard
- **Frage:** Was passiert bei a[3] für ein Array mit drei Elementen?
- **Antwort:** ArrayIndexOutOfBoundsException.

**Java-Beispiel:**

```java
int[] a={3,5,7};
System.out.println(a[3]);
```

### Karte: 53 – Array summieren
- **Themenbereich:** Arrays
- **Typ:** simulation
- **Frage:** Wie berechnet man die Summe aller Werte?
- **Antwort:** Mit einer Summenvariable und einer Schleife.

**Java-Beispiel:**

```java
int summe=0;
for(int x:werte) summe+=x;
```

**Interaktion:** Eingabe mehrerer Werte, Summe live berechnen.

### Karte: 54 – Dynamische Liste
- **Themenbereich:** ArrayList
- **Typ:** flashcard
- **Frage:** Was ist der zentrale Unterschied zwischen Array und ArrayList?
- **Antwort:** Array hat feste Länge; ArrayList kann dynamisch wachsen/schrumpfen.

**Java-Beispiel:**

```java
import java.util.ArrayList;
ArrayList<String> namen=new ArrayList<>();
namen.add("Mia");
```

### Karte: 55 – set
- **Themenbereich:** ArrayList
- **Typ:** flashcard
- **Frage:** Was bewirkt n.set(0,"Eva")?
- **Antwort:** Ersetzt das Element an Index 0 durch Eva.

**Java-Beispiel:**

```java
n.add("Mia");
n.add("Ali");
n.set(0,"Eva");
```

### Karte: 56 – remove
- **Themenbereich:** ArrayList
- **Typ:** flashcard
- **Frage:** Was bleibt nach remove(0) in [3,6]?
- **Antwort:** [6].

**Java-Beispiel:**

```java
ArrayList<Integer> liste=new ArrayList<>();
liste.add(3); liste.add(6); liste.remove(0);
```

### Karte: 57 – Aliasing
- **Themenbereich:** Referenzen
- **Typ:** flashcard
- **Frage:** Warum enthält a nach b.add("B") auch B, wenn b=a?
- **Antwort:** a und b referenzieren dieselbe ArrayList.

**Java-Beispiel:**

```java
ArrayList<String> a=new ArrayList<>();
a.add("A");
ArrayList<String> b=a;
b.add("B");
```

### Karte: 58 – Kurs und Schüler
- **Themenbereich:** UML
- **Typ:** flashcard
- **Frage:** Wie modelliert man eine Kursliste von Schülern?
- **Antwort:** Als Assoziation zu 0..* Schueler-Objekten.

**Java-Beispiel:**

```java
class Kurs { private ArrayList<Schueler> gruppe; }
```

### Karte: 59 – Summe rekursiv
- **Themenbereich:** Rekursion
- **Typ:** flashcard
- **Frage:** Was ergibt summe(3)?
- **Antwort:** 6 (3+2+1+0).

**Java-Beispiel:**

```java
static int summe(int n){
  if(n==0)return 0;
  return n+summe(n-1);
}
```

### Karte: 60 – Basisfall
- **Themenbereich:** Rekursion
- **Typ:** flashcard
- **Frage:** Warum benötigt Rekursion einen Basisfall?
- **Antwort:** Damit die rekursiven Aufrufe enden.

**Java-Beispiel:**

```java
if(n==0)return;
```

### Karte: 61 – Reihenfolge
- **Themenbereich:** Rekursion
- **Typ:** flashcard
- **Frage:** Warum gibt test(3) die Zahlen 1,2,3 aus?
- **Antwort:** Die Ausgabe steht nach dem rekursiven Aufruf und erfolgt beim Zurückkehren.

**Java-Beispiel:**

```java
static void test(int n){
  if(n==0)return;
  test(n-1);
  System.out.println(n);
}
```

### Karte: 62 – Fakultät
- **Themenbereich:** Rekursion
- **Typ:** simulation
- **Frage:** Was ergibt fak(4)?
- **Antwort:** 24.

**Java-Beispiel:**

```java
static int fak(int n){
  if(n<=1)return 1;
  return n*fak(n-1);
}
```

**Interaktion:** n von 0 bis 7 berechnen.

### Karte: 63 – Iteration vs. Rekursion
- **Themenbereich:** Rekursion
- **Typ:** flashcard
- **Frage:** Wann ist Rekursion besonders passend?
- **Antwort:** Wenn ein Problem in kleinere gleichartige Teilprobleme zerlegt wird, z. B. Baumdurchläufe.

**Java-Beispiel:**

```java
// rekursiver Aufruf: methode(n-1);
```

### Karte: 64 – Lineare Suche
- **Themenbereich:** Suchen
- **Typ:** flashcard
- **Frage:** Was bedeutet Rückgabe -1 bei einer Suchmethode?
- **Antwort:** Der gesuchte Wert wurde nicht gefunden.

**Java-Beispiel:**

```java
for(int i=0;i<a.length;i++) if(a[i]==gesucht)return i;
return -1;
```

### Karte: 65 – Suchsimulation
- **Themenbereich:** Suchen
- **Typ:** simulation
- **Frage:** An welchem Index steht 10 in {3,7,10,15,21}?
- **Antwort:** Index 2.

**Java-Beispiel:**

```java
int[] a={3,7,10,15,21};
```

**Interaktion:** Gesuchten Wert eingeben und Index zeigen.

### Karte: 66 – Binäre Suche
- **Themenbereich:** Suchen
- **Typ:** flashcard
- **Frage:** Welche Voraussetzung benötigt die binäre Suche in diesem Beispiel?
- **Antwort:** Eine aufsteigend sortierte Folge.

**Java-Beispiel:**

```java
int[] a={2,4,6,8,10,12,14};
```

### Karte: 67 – Bubble Sort
- **Themenbereich:** Sortieren
- **Typ:** flashcard
- **Frage:** Wie sieht {5,2,4} nach einem Durchlauf aus?
- **Antwort:** {2,4,5}.

**Java-Beispiel:**

```java
int[] a={5,2,4};
```

### Karte: 68 – Vergleichen und Tauschen
- **Themenbereich:** Sortieren
- **Typ:** simulation
- **Frage:** Was macht Bubble Sort?
- **Antwort:** Benachbarte Werte vergleichen und bei falscher Reihenfolge tauschen.

**Java-Beispiel:**

```java
int[] a={5,1,4,2};
```

**Interaktion:** Sortierschritte einzeln zeigen.

### Karte: 69 – LIFO
- **Themenbereich:** Stack
- **Typ:** flashcard
- **Frage:** Welches Element bleibt nach push(2),push(5),pop() oben?
- **Antwort:** 2.

**Java-Beispiel:**

```java
Stack<Integer> s=new Stack<>();
s.push(2);s.push(5);s.pop();
```

### Karte: 70 – Anwendungsfälle
- **Themenbereich:** Stack
- **Typ:** flashcard
- **Frage:** Nenne einen Einsatz für einen Stack.
- **Antwort:** Rückgängig-Funktion oder Methodenaufrufstapel.

**Java-Beispiel:**

```java
// Last In, First Out (LIFO)
```

### Karte: 71 – FIFO
- **Themenbereich:** Queue
- **Typ:** flashcard
- **Frage:** Welches Element verlässt [A,B] zuerst?
- **Antwort:** A.

**Java-Beispiel:**

```java
Queue<String> q=new ArrayDeque<>();
q.add("A");q.add("B");q.remove();
```

### Karte: 72 – Stack vs. Queue
- **Themenbereich:** Datenstrukturen
- **Typ:** simulation
- **Frage:** Wie unterscheiden sich LIFO und FIFO?
- **Antwort:** LIFO: zuletzt hinein zuerst hinaus. FIFO: zuerst hinein zuerst hinaus.

**Java-Beispiel:**

```java
// Stack: LIFO
// Queue: FIFO
```

**Interaktion:** Elemente hinzufügen und entfernen.

### Karte: 73 – Knoten
- **Themenbereich:** Verkettete Liste
- **Typ:** flashcard
- **Frage:** Wofür benötigt ein Knoten naechster?
- **Antwort:** Als Referenz auf den nächsten Knoten, ggf. null.

**Java-Beispiel:**

```java
class Knoten { int wert; Knoten naechster; }
```

### Karte: 74 – Komplexität
- **Themenbereich:** Effizienz
- **Typ:** flashcard
- **Frage:** Welche Größenordnungen haben lineare/binäre Suche und Bubble Sort?
- **Antwort:** O(n), O(log n), O(n²) im Worst Case.

**Java-Beispiel:**

```java
// lineare Suche O(n)
// binäre Suche O(log n)
// Bubble Sort O(n²)
```

### Karte: 75 – Sortierte Daten
- **Themenbereich:** Effizienz
- **Typ:** flashcard
- **Frage:** Welches Suchverfahren nutzt die Sortierung?
- **Antwort:** Die binäre Suche.

**Java-Beispiel:**

```java
int[] a={2,4,6,8,10};
```

### Karte: 76 – Wachstum
- **Themenbereich:** Effizienz
- **Typ:** simulation
- **Frage:** Wie wächst die Anzahl Prüfungen bei binärer Suche ungefähr?
- **Antwort:** Logarithmisch: bei Verdopplung der Datenmenge etwa eine zusätzliche Halbierung/Prüfung.

**Java-Beispiel:**

```java
// n = 8,16,32,64
```

**Interaktion:** n variieren und Aufwand vergleichen.

### Karte: 77 – Testsätze
- **Themenbereich:** Testen
- **Typ:** flashcard
- **Frage:** Welche Tests sind für eine Suchmethode sinnvoll?
- **Antwort:** Leeres Array, ein Element, nicht gefunden, erster/letzter Index, Duplikate.

**Java-Beispiel:**

```java
int[] leer={};
int[] eins={4};
int[] doppelt={4,4,4};
```

### Karte: 78 – Kursverwaltung
- **Themenbereich:** Projekt
- **Typ:** flashcard
- **Frage:** Welche Schritte gehören zum Mini-Projekt Kursverwaltung?
- **Antwort:** UML modellieren, Klasse implementieren, hinzufügen/suchen/ausgeben, Tests dokumentieren.

**Java-Beispiel:**

```java
class Kurs {
  private ArrayList<Schueler> gruppe;
}
```

---

## Akzeptanzkriterien

- [ ] Genau **78** Karten importiert, IDs 1–78 eindeutig und sortiert.
- [ ] Karte 49–78 als eigenes Set filterbar.
- [ ] Jede Rückseite wird erst auf Nutzeraktion sichtbar.
- [ ] Syntaxhervorhebung beschädigt keine Sonderzeichen wie `<`, `>`, `&&` oder `String[]`.
- [ ] Quizbewertungen werden nur bei beantworteten Fragen gezählt; eine erneute Aufdeckung vergibt keine zusätzlichen Punkte.
- [ ] Fehlende/nicht numerische/extreme Simulationseingaben werden abgefangen.
- [ ] Lernmodus funktioniert per Maus, Touch und Tastatur.
- [ ] Mobile Ansicht bei 320 px ohne abgeschnittene Inhalte; Smartboard-Modus mit großen Zielen.
- [ ] Keine echten personenbezogenen Daten von Schülerinnen und Schülern erforderlich.
- [ ] Vor Integration: bestehende LinguaCode-Struktur prüfen und nur gezielt ergänzen.
