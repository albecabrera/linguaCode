import { createGame, start as startGameClock, timeout, answer, advance } from './core.mjs';
const $ = id => document.getElementById(id);
const names = ['Equipo Verde', 'Equipo Naranja'];
let game = createGame();
let timerHandle = null;
let selectedDuration = 3;

function stopTimer() {
  if (timerHandle !== null) { clearInterval(timerHandle); timerHandle = null; }
}
function renderTimer() {
  const remaining = game.deadline === null ? selectedDuration * 60_000 : Math.max(0, game.deadline - Date.now());
  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  $('timer').textContent = `Zeit: ${minutes}:${String(seconds).padStart(2, '0')}`;
  $('timer').setAttribute('aria-label', `Verbleibende Zeit: ${totalSeconds} Sekunden`);
}
function endGame() {
  stopTimer();
  renderTeam(0); renderTeam(1); renderScore();
  $('result').hidden = false;
  $('result-title').textContent = game.winner === null ? 'Unentschieden – ¡bien hecho!' : `${names[game.winner]} gewinnt!`;
  $('result-detail').textContent = `${game.teams[0].score} : ${game.teams[1].score} Punkte. ${game.endedBy === 'timeout' ? 'Die Zeit ist abgelaufen.' : Math.abs(game.position) >= 5 ? 'Das Seil hat die Ziellinie erreicht.' : 'Beide Teams haben alle Aufgaben abgeschlossen.'}`;
  $('match-status').textContent = $('result-title').textContent;
  $('result-title').focus({ preventScroll: true });
}
function renderTeam(team) {
  const gameAtRender = game;
  const state = game.teams[team];
  const panel = $(`team-${team}`);
  panel.replaceChildren();
  const heading = document.createElement('div');
  heading.className = 'team-head';
  heading.textContent = `${names[team]} · ${state.score} Punkte · Aufgabe ${Math.min(state.index + 1, game.teamQuestions[team].length)} / ${game.teamQuestions[team].length}`;
  panel.append(heading);
  if (state.index >= game.teamQuestions[team].length) {
    const waiting = document.createElement('h2');
    waiting.textContent = 'Alle Aufgaben beantwortet. Das andere Team spielt noch.';
    panel.append(waiting);
    return;
  }
  const question = game.teamQuestions[team][state.index];
  const title = document.createElement('h2');
  title.textContent = question.prompt;
  panel.append(title);
  const choices = document.createElement('div');
  choices.className = 'answers';
  const index = state.index;
  question.options.forEach((option, choice) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = option;
    button.disabled = Boolean(state.feedback) || game.phase === 'finished';
    if (state.feedback && choice === question.correct) button.className = 'correct';
    if (state.feedback && !state.feedback.correct && choice === state.feedback.choice) button.className = 'wrong';
    button.addEventListener('click', () => {
      if (game !== gameAtRender) return;
      const previousPosition = game.position;
      const accepted = answer(game, team, index, choice, Date.now());
      if (accepted) { renderTeam(team); renderScore(game.position - previousPosition); }
      if (game.phase === 'finished') endGame();
    });
    choices.append(button);
  });
  const feedback = document.createElement('p');
  feedback.className = 'feedback'; feedback.setAttribute('role', 'status');
  feedback.textContent = state.feedback ? `${state.feedback.correct ? '✓ Richtig! Ein Zug für euch.' : '✗ Noch nicht richtig.'} Lösung: ${question.options[question.correct]}` : 'Wählt genau eine Antwort.';
  panel.append(choices, feedback);
  if (state.feedback && game.phase === 'playing') {
    const next = document.createElement('button');
    next.type = 'button'; next.className = 'next';
    next.textContent = state.index === game.teamQuestions[team].length - 1 ? 'Team abschließen ✓' : 'Weiter →';
    next.addEventListener('click', () => {
      if (game !== gameAtRender) return;
      const accepted = game.teams[team].index === index && advance(game, team, Date.now());
      if (accepted) { renderTeam(team); renderScore(); }
      if (game.phase === 'finished') endGame();
    });
    panel.append(next);
  }
}
function renderScore(pullDirection = 0, resetMotion = false) {
  game.teams.forEach((team, i) => { $(`score-${i}`).textContent = team.score; });
  const scene = $('rope'); scene.style.transform = `translateX(${game.position * 1.5}%)`;
  if (resetMotion) { scene.classList.remove('pull-left', 'pull-right'); scene.dataset.pullSequence = '0'; }
  else if (pullDirection) { scene.classList.remove('pull-left', 'pull-right'); void scene.offsetWidth; scene.classList.add(pullDirection < 0 ? 'pull-left' : 'pull-right'); scene.dataset.pullSequence = String(Number(scene.dataset.pullSequence || 0) + 1); }
  $('match-status').textContent = game.position === 0 ? 'Gleichstand · Das Seil ist in der Mitte' : `${names[game.position < 0 ? 0 : 1]} führt mit ${Math.abs(game.position)} Zug${Math.abs(game.position) === 1 ? '' : 'en'}`;
  renderTimer();
}
function start() {
  stopTimer(); game = createGame(Math.random, selectedDuration); startGameClock(game, Date.now());
  $('intro').hidden = true; $('result').hidden = true; $('teams').hidden = false; $('reset').hidden = false;
  renderTeam(0); renderTeam(1); renderScore(0, true); renderTimer();
  timerHandle = setInterval(() => { if (timeout(game, Date.now())) endGame(); else renderTimer(); }, 250);
}
$('start').addEventListener('click', start);
$('restart').addEventListener('click', start);
function syncDurationButtons() {
  [1, 3, 5].map(minutes => $(`duration-${minutes}`)).forEach(option => {
    const selected = Number(option.dataset.duration) === selectedDuration;
    if (selected) option.classList.add('selected'); else option.classList.remove('selected');
    option.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}
$('reset').addEventListener('click', () => { stopTimer(); game = createGame(); syncDurationButtons(); $('intro').hidden = false; $('teams').hidden = true; $('result').hidden = true; $('reset').hidden = true; renderScore(0, true); $('start').focus(); });
[1, 3, 5].map(minutes => $(`duration-${minutes}`)).forEach(button => button.addEventListener('click', () => { selectedDuration = Number(button.dataset.duration); [1, 3, 5].map(minutes => $(`duration-${minutes}`)).forEach(option => { if (option === button) option.classList.add('selected'); else option.classList.remove('selected'); option.setAttribute('aria-pressed', option === button ? 'true' : 'false'); }); }));
$('fullscreen').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('screen-note').textContent = 'Vollbild ist hier nicht verfügbar. Das Spiel funktioniert auch ohne Vollbild.'; } });
document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Vollbild verlassen ↙' : 'Vollbild ↗'; });
