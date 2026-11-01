import { VERBS, createSession, submit, retryMistakes } from './core.mjs';
const app = document.querySelector('#app');
const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let session = createSession();
function render() {
  if (session.index === session.items.length) return renderResults();
  const item = session.items[session.index];
  app.innerHTML = `<div class="panel"><div class="meta"><span>Aufgabe ${session.index + 1} / ${session.items.length}</span><span>${session.correct} richtig</span></div><progress value="${session.index}" max="${session.items.length}"></progress><p class="hint">${escape(item.german)}</p><h2>${escape(item.base)} <span>→ ?</span></h2><form id="answer-form"><label for="answer">Simple Past</label><div class="answer-row"><input id="answer" autocomplete="off" autocapitalize="off" spellcheck="false" required placeholder="Vergangenheitsform" aria-describedby="answer-help"><button type="submit">Prüfen</button></div><small id="answer-help">Groß- und Kleinschreibung spielen keine Rolle.</small></form><p id="feedback" role="status"></p></div>`;
  const form = app.querySelector('form');
  const input = app.querySelector('input');
  input.focus();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = submit(session, input.value);
    form.hidden = true;
    const feedback = app.querySelector('#feedback');
    feedback.className = result.correct ? 'correct' : 'incorrect';
    feedback.textContent = result.correct ? 'Richtig!' : `Noch nicht. Richtig: ${result.item.past.join(' / ')}`;
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = result.status === 'finished' ? 'Auswertung ansehen' : 'Nächstes Verb';
    next.addEventListener('click', render, {once: true});
    app.querySelector('.panel').append(next);
    next.focus();
  });
}
function renderResults() {
  const errors = session.errors;
  app.innerHTML = `<div class="panel"><p class="eyebrow">Deine Auswertung</p><h2>${session.correct} von ${session.items.length} richtig</h2><p>${errors.length ? 'Diese Formen kannst du noch einmal üben:' : 'Alle Formen richtig – stark!'}</p>${errors.length ? `<div class="table-wrap"><table><thead><tr><th>Verb</th><th>Deine Antwort</th><th>Simple Past</th></tr></thead><tbody>${errors.map(error => `<tr><td>${escape(error.base)}</td><td>${escape(error.answer)}</td><td>${escape(error.expected)}</td></tr>`).join('')}</tbody></table></div><button id="retry">Nur Fehler wiederholen</button>` : ''}<button class="secondary" id="restart">Alle Verben noch einmal</button></div>`;
  app.querySelector('#retry')?.addEventListener('click', () => { session = retryMistakes(session); render(); });
  app.querySelector('#restart').addEventListener('click', () => { session = createSession(); render(); });
}
const shortUrl = new URL('../s/sp/', location.href).href;
document.querySelector('#shortlink').href = shortUrl;
document.querySelector('#shortlink').textContent = shortUrl;
const code = qrcode(0, 'M');
code.addData(shortUrl); code.make();
document.querySelector('#qr').src = code.createDataURL(5, 0);
render();
