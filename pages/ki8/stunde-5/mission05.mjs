import { getLesson } from '../mission/lesson-data.mjs';
import { createThemeController } from '../mission/theme.mjs';

const lesson = getLesson('ki-05');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const browserStorage = () => { try { return globalThis.localStorage; } catch { return null; } };

export function createMission05({ root, storage = browserStorage() } = {}) {
  if (!root) throw new TypeError('Mission root is required.');
  const themeController = createThemeController({ documentLike: root.ownerDocument ?? globalThis.document, storage });
  const render = () => {
    const dark = themeController.getTheme() === 'dark';
    root.innerHTML = `<div class="mission-shell mission05-shell"><main class="mission-content">
      <header class="mission-hero"><div class="hero-heading"><p class="eyebrow">${esc(lesson.module)} · ${esc(lesson.context.subject)} · ${esc(lesson.context.hour)}</p><button type="button" class="theme-toggle" data-theme-toggle aria-label="${dark ? 'Hellmodus' : 'Dunkelmodus'} aktivieren"><span data-theme-icon aria-hidden="true">${dark ? '☀' : '☾'}</span></button></div>
        <h1>${esc(lesson.title)}</h1><p>${esc(lesson.description)}</p><p><a class="button-link" href="../">Zur Missionsübersicht</a></p>
      </header>
      <div class="progress-summary" role="status"><div class="progress-label"><strong>Arbeitsauftrag</strong><span>2 Schritte · noch nicht automatisch abgeschlossen</span></div><progress max="2" value="0"></progress></div>
      <nav class="phase-nav" aria-label="Arbeitsauftrag"><ol><li><span>1</span>Arbeitsblatt bearbeiten</li><li><span>2</span>Praktische Aufgabe</li></ol></nav>
      <div class="mission05-lab">
        <section class="lab-section worksheet-section" aria-labelledby="worksheet-title"><p class="eyebrow">Schritt 1 · Arbeitsblatt</p><h2 id="worksheet-title">Arbeitsblatt bearbeiten</h2><p>Lies und bearbeite zuerst das Arbeitsblatt. Beantworte die drei Fragen aus <strong>Aufgabe 1</strong> und plane anschließend deinen eigenen Entscheidungsbaum in <strong>Aufgabe 2</strong>.</p>
          <figure class="worksheet-figure"><img src="./arbeitsblatt-entscheidungsbaeume.png" width="1199" height="1312" alt="Arbeitsblatt ‚Entscheidungsbäume erstellen‘ mit Definitionen und Symbolen, einem Regenschirm-Beispiel sowie Aufgabe 1 mit drei Verständnisfragen und Aufgabe 2 zum Verkehrsweg zur Schule"><figcaption>Entscheidungsbäume erstellen · Informatik-Arbeitsblatt</figcaption></figure>
          <p class="worksheet-actions"><a class="button-link" href="./arbeitsblatt-entscheidungsbaeume.png" download>Arbeitsblatt herunterladen oder drucken</a></p>
          <details class="transcription"><summary>Inhalt des Arbeitsblatts als Text</summary><div><p><strong>Entscheidungsbäume erstellen:</strong> Das Arbeitsblatt erklärt Entscheidungsbäume, ihre Fragen, Äste und Ergebnisse. Ein Regenschirm-Beispiel zeigt, wie Entscheidungen Schritt für Schritt zu einem Ergebnis führen.</p><p><strong>Aufgabe 1:</strong> Beantworte: Was ist die Startfrage? Welche zwei Antworten gibt es? Welche Ergebnisse können am Ende stehen?</p><p><strong>Aufgabe 2:</strong> Erstelle zum Thema „Welches Verkehrsmittel nehme ich zur Schule?“ einen eigenen Entscheidungsbaum mit mindestens 3 Fragen und 4 möglichen Ergebnissen.</p><p>Optional: Prüfe deinen Baum mit einer Partnerin oder einem Partner.</p></div></details>
          <label class="acknowledgement"><input type="checkbox" data-worksheet-done> Ich habe das Arbeitsblatt bearbeitet.</label>
        </section>
        <section class="lab-section practice-section" aria-labelledby="practice-title"><p class="eyebrow">Schritt 2 · Praktische Aufgabe</p><h2 id="practice-title">Erstelle deinen eigenen Entscheidungsbaum</h2><p>Nutze genau das Thema <strong>„Welches Verkehrsmittel nehme ich zur Schule?“</strong>. Dein Baum enthält <strong>mindestens 3 Fragen</strong> und <strong>4 mögliche Ergebnisse</strong>.</p><p><a class="button-link primary-action" href="https://app.diagrams.net" target="_blank" rel="noopener noreferrer">Entscheidungsbaum in diagrams.net erstellen ↗</a></p><p class="external-note">Der Link öffnet das externe Zeichenwerkzeug diagrams.net in einem neuen Tab. Prüfe vor dem Schließen, wie du deine Arbeit dort speichern oder exportieren möchtest.</p><aside class="partner-check"><strong>Optional: Partner-Check</strong><ul><li>Sind mindestens 3 Fragen enthalten?</li><li>Gibt es mindestens 4 mögliche Ergebnisse?</li><li>Führt jeder Weg zu einem verständlichen Ergebnis?</li></ul></aside>
        </section>
      </div>
      <footer class="mission-footer"><p>Dein Arbeitsblatt und dein Entscheidungsbaum werden nicht automatisch als erledigt markiert. Nutze die Checkliste zur eigenen Orientierung.</p></footer>
    </main></div>`;
    root.querySelector('[data-theme-toggle]')?.addEventListener('click', () => { themeController.toggle(); render(); });
  };
  render();
  return { getState: () => ({ completed: false }), reset: render };
}

if (typeof document !== 'undefined') { const root = document.querySelector('#mission-app'); if (root) createMission05({ root }); }
