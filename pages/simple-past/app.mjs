import {VERBS, createQuest, answerQuest, advanceQuest} from './core.mjs';
import {createView, switchMode, moveStudy, requestTip, resetTip} from './study.mjs';

const app = document.querySelector('#app');
const world = document.querySelector('#world');
const avatar = document.querySelector('#avatar');
const path = document.querySelector('#world-path');
const soundButton = document.querySelector('#sound-toggle');
const tipButton = document.querySelector('#tip-button');
const tipFeedback = document.querySelector('#tip-feedback');
const escape = value => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[char]));
const totalStages = Math.ceil(VERBS.length / 10);
const view = createView(createQuest());
let quest = view.quest;
let gearTier = 0;
let dragonHits = 0;
let dragonActive = false;
let dragonsDefeated = 0;
let soundEnabled = true;
let audio;

path.innerHTML = Array.from({length: 10}, () => '<i></i>').join('');
if (!('AudioContext' in window) && !('webkitAudioContext' in window)) {
  soundButton.disabled = true;
  soundButton.textContent = 'Ton nicht verfügbar';
  soundButton.setAttribute('aria-pressed', 'false');
}
soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  soundButton.setAttribute('aria-label', soundEnabled ? 'Ton ausschalten' : 'Ton einschalten');
  soundButton.textContent = soundEnabled ? '♪ Ton an' : '♪ Ton aus';
});
function playSound(correct) {
  if (!soundEnabled || soundButton.disabled) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') void audio.resume();
    const start = audio.currentTime;
    const notes = correct ? [523, 784] : [220, 164];
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      const at = start + index * 0.09;
      oscillator.type = correct ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, at);
      volume.gain.setValueAtTime(0.001, at);
      volume.gain.exponentialRampToValueAtTime(0.11, at + 0.015);
      volume.gain.exponentialRampToValueAtTime(0.001, at + 0.16);
      oscillator.connect(volume).connect(audio.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.17);
    });
  } catch { // Unsupported audio must not interrupt practice.
    soundEnabled = false;
    soundButton.disabled = true;
    soundButton.textContent = 'Ton nicht verfügbar';
    soundButton.setAttribute('aria-pressed', 'false');
  }
}
function updateWorld(caption = '') {
  const {round, stageIndex, attempt, streak, rewardCount} = quest;
  const progress = round.correct / round.items.length;
  avatar.style.setProperty('--step', progress.toFixed(3));
  path.querySelectorAll('i').forEach((block, index) => block.classList.toggle('lit', index < Math.round(progress * 10)));
  world.classList.toggle('in-cave', gearTier > 0 && !dragonActive);
  document.querySelector('#cave').classList.toggle('open', gearTier > 0);
  document.querySelector('#dragon').hidden = !dragonActive;
  world.setAttribute('aria-label', `Blockwelt: Figur ${round.correct} von ${round.items.length} Schritten bis zum Ziel; Serie ${streak}; ${rewardCount} Belohnungen${dragonActive ? `; Drache braucht noch ${3 - dragonHits} Treffer` : ''}`);
  document.querySelector('#stage-label').textContent = `ETAPPE ${String(stageIndex + 1).padStart(2, '0')} / ${String(totalStages).padStart(2, '0')}`;
  document.querySelector('#round-label').textContent = `RUNDE ${String(attempt).padStart(2, '0')}`;
  document.querySelector('#streak-label').textContent = `SERIE ${streak ? (streak % 10 || 10) : 0} / 10`;
  document.querySelector('#reward-label').textContent = `◆ ${rewardCount} Belohnungen`;
  document.querySelector('#world-caption').textContent = caption || (dragonActive ? `Drachenkampf: Noch ${3 - dragonHits} richtige Treffer!` : 'Jede richtige Antwort bringt dich weiter.');
}
function rewardFor(milestone) {
  if (!milestone) return '';
  if (milestone % 2 === 1) {
    gearTier++;
    return `Höhle entdeckt! Neue Ausrüstung ${gearTier}: ${['Smaragd-Spitzhacke', 'Schutzrüstung', 'Kristallklinge'][(gearTier - 1) % 3]}.`;
  }
  dragonActive = true;
  dragonHits = 0;
  return 'Drachenkampf freigeschaltet! Drei weitere richtige Formen besiegen den Drachen.';
}
function render() {
  updateWorld();
  tipButton.disabled = quest.finished || quest.round.index === quest.round.items.length || view.hintLevel === 2;
  if (quest.finished) return renderFinish();
  if (quest.round.index === quest.round.items.length) return renderRoundEnd();
  const {round, stageIndex} = quest;
  const item = round.items[round.index];
  app.innerHTML = `<div class="card"><div class="card-heading"><span class="card-label">BLOCK ${String(round.index + 1).padStart(2, '0')} / ${String(round.items.length).padStart(2, '0')}</span><span class="card-label">WÖRTER ${String(stageIndex * 10 + 1).padStart(2, '0')}–${String(stageIndex * 10 + round.items.length).padStart(2, '0')}</span></div><div class="card-layout"><div class="verb"><p class="meaning">${escape(item.german)}</p><h2>${escape(item.base)} <span>→ ?</span></h2><p class="card-help">Schreibe die Simple-Past-Form, um den nächsten Block zu erreichen.</p></div><form id="answer-form"><label for="answer">Deine Antwort</label><div class="answer-row"><input id="answer" autocomplete="off" autocapitalize="off" spellcheck="false" required placeholder="Simple Past" aria-describedby="answer-help"><button type="submit">Block setzen →</button></div><small id="answer-help">Groß- und Kleinschreibung spielen keine Rolle.</small></form></div><p id="feedback" role="status" aria-live="polite"></p></div>`;
  const form = app.querySelector('form');
  const input = app.querySelector('input');
  input.focus();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = answerQuest(quest, input.value);
    playSound(result.correct);
    resetTip(view);
    tipButton.disabled = true;
    tipFeedback.textContent = 'Die Antwort ist sichtbar. Weiter geht es mit dem nächsten Verb.';
    form.hidden = true;
    const feedback = app.querySelector('#feedback');
    feedback.className = result.correct ? 'feedback correct' : 'feedback incorrect';
    feedback.textContent = result.correct ? '◆ Richtig! Deine Figur geht weiter.' : `Noch nicht. Richtig: ${result.item.past.join(' / ')}`;
    let battleMessage = '';
    if (result.correct && dragonActive) {
      dragonHits++;
      if (dragonHits === 3) {
        dragonActive = false;
        dragonsDefeated++;
        battleMessage = ' Drache besiegt!';
      } else battleMessage = ` Drachenkampf: noch ${3 - dragonHits} Treffer.`;
    }
    const rewardMessage = rewardFor(result.milestone);
    if (result.correct) {
      world.classList.remove('is-wrong');
      world.classList.add('is-right');
      feedback.textContent = rewardMessage ? `◆ ${rewardMessage}` : `Richtig! Deine Figur geht weiter.${battleMessage}`;
    } else {
      world.classList.remove('is-right');
      world.classList.add('is-wrong');
    }
    updateWorld(rewardMessage || battleMessage || (result.correct ? 'Ein Block geschafft!' : 'Dieser Block kommt in der nächsten Runde zurück.'));
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'next-button';
    next.textContent = rewardMessage ? 'Belohnung annehmen →' : result.status === 'finished' ? 'Etappe auswerten →' : 'Nächstes Verb →';
    next.addEventListener('click', () => { world.classList.remove('is-right', 'is-wrong'); render(); }, {once: true});
    app.querySelector('.card').append(next);
    next.focus();
  });
}
function renderRoundEnd() {
  const {round, stageIndex, attempt} = quest;
  const errors = round.errors;
  const last = (stageIndex + 1) * 10 >= VERBS.length;
  app.innerHTML = `<div class="card result"><p class="card-label">ETAPPE ${String(stageIndex + 1).padStart(2, '0')} · RUNDE ${attempt}</p><h2>${errors.length ? 'Noch eine Runde!' : last ? 'Alle Etappen geschafft!' : 'Etappe gemeistert!'}</h2><p>${errors.length ? `Du hast ${round.correct} von ${round.items.length} Verben richtig geschrieben. Die ganze Etappe kommt noch einmal – auch die richtigen Wörter.` : `Alle ${round.items.length} Verben dieser Etappe sind richtig. Dein Weg geht weiter!`}</p>${errors.length ? `<div class="table-wrap"><table><thead><tr><th>Verb</th><th>Deine Antwort</th><th>Richtig</th></tr></thead><tbody>${errors.map(error => `<tr><td>${escape(error.base)}</td><td>${escape(error.answer)}</td><td>${escape(error.expected)}</td></tr>`).join('')}</tbody></table></div>` : ''}<button type="button" id="continue">${errors.length ? 'Alle Verben erneut üben →' : last ? 'Belohnung ansehen →' : 'Nächste Etappe →'}</button></div>`;
  app.querySelector('#continue').addEventListener('click', () => { advanceQuest(quest); resetTip(view); tipFeedback.textContent = 'Du kannst dir hier unten einen Hinweis holen.'; render(); });
}
function renderFinish() {
  updateWorld('Alle Etappen geschafft!');
  app.innerHTML = `<div class="card result"><p class="card-label">QUEST ABGESCHLOSSEN</p><h2>Dein Weg ist gebaut. ◆</h2><p>Alle ${VERBS.length} Verben hast du Etappe für Etappe richtig geschrieben. Meilensteine: ${quest.rewardCount}. Besiegte Drachen: ${dragonsDefeated}.</p><button type="button" id="restart">Noch einmal starten →</button></div>`;
  app.querySelector('#restart').addEventListener('click', () => { quest = createQuest(); view.quest = quest; resetTip(view); gearTier = 0; dragonHits = 0; dragonActive = false; dragonsDefeated = 0; tipFeedback.textContent = 'Du kannst dir hier unten einen Hinweis holen.'; render(); });
}
function renderStudy() {
  const item = VERBS[view.studyIndex];
  document.querySelector('#study-progress').textContent = `LERNSCHRITT ${String(view.studyIndex + 1).padStart(2, '0')} / ${VERBS.length}`;
  document.querySelector('#study-verb').textContent = item.base;
  document.querySelector('#study-past').textContent = item.past.join(' / ');
  document.querySelector('#study-german').textContent = item.german;
  document.querySelector('#study-prev').disabled = view.studyIndex === 0;
  document.querySelector('#study-next').disabled = view.studyIndex === VERBS.length - 1;
}
function showMode(mode) {
  switchMode(view, mode);
  document.body.dataset.mode = mode;
  for (const name of ['home', 'study', 'game']) document.querySelector(`#${name}-view`).hidden = name !== mode;
  if (mode === 'study') renderStudy();
  if (mode === 'game') render();
  window.scrollTo(0, 0);
}
for (const [id, mode] of [['open-study', 'study'], ['open-game', 'game'], ['study-home', 'home'], ['study-to-game', 'game'], ['game-to-study', 'study'], ['game-home', 'home']]) {
  document.querySelector(`#${id}`).addEventListener('click', () => showMode(mode));
}
document.querySelector('#study-prev').addEventListener('click', () => { moveStudy(view, -1); renderStudy(); });
document.querySelector('#study-next').addEventListener('click', () => { moveStudy(view, 1); renderStudy(); });
tipButton.addEventListener('click', () => {
  const item = quest.round.items[quest.round.index];
  if (!item || quest.finished) return;
  tipFeedback.textContent = requestTip(view, item);
  tipButton.disabled = view.hintLevel === 2;
});
const shortUrl = new URL('../s/sp/', location.href).href;
document.querySelector('#shortlink').href = shortUrl;
document.querySelector('#shortlink').textContent = shortUrl;
const code = qrcode(0, 'M');
code.addData(shortUrl); code.make();
document.querySelector('#qr').src = code.createDataURL(5, 0);
showMode('home');
