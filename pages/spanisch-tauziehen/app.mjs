import { createGame, answer, advance } from './core.mjs';
const $ = id => document.getElementById(id);
const names = ['Equipo Verde', 'Equipo Naranja'];
let game = createGame();
function renderTeam(team) {
  const state = game.teams[team];
  const panel = $(`team-${team}`);
  panel.replaceChildren();
  const heading = document.createElement('div');
  heading.className = 'team-head';
  heading.textContent = `${names[team]} · ${state.score} Punkte · Aufgabe ${Math.min(state.index + 1, game.questions.length)} / ${game.questions.length}`;
  panel.append(heading);
  if (state.index >= game.questions.length) {
    const waiting = document.createElement('h2');
    waiting.textContent = 'Alle Aufgaben beantwortet. Das andere Team spielt noch.';
    panel.append(waiting);
    return;
  }
  const question = game.questions[state.index];
  const title = document.createElement('h2');
  title.textContent = question.prompt;
  panel.append(title);
  const choices = document.createElement('div');
  choices.className = 'answers';
  const index = state.index;
  question.options.forEach((option, choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.disabled = Boolean(state.feedback) || game.phase === 'finished';
    if (state.feedback && choice === question.correct) button.className = 'correct';
    if (state.feedback && !state.feedback.correct && choice === state.feedback.choice) button.className = 'wrong';
    button.addEventListener('click', () => {
      const previousPosition = game.position;
      if (answer(game, team, index, choice)) { renderTeam(team); renderScore(game.position - previousPosition); }
    });
    choices.append(button);
  });
  const feedback = document.createElement('p');
  feedback.className = 'feedback';
  feedback.setAttribute('role', 'status');
  feedback.textContent = state.feedback ? `${state.feedback.correct ? '✓ Richtig! Ein Zug für euch.' : '✗ Noch nicht richtig.'} Lösung: ${question.options[question.correct]}` : 'Wählt genau eine Antwort.';
  panel.append(choices, feedback);
  if (state.feedback && game.phase === 'playing') {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'next';
    next.textContent = state.index === game.questions.length - 1 ? 'Team abschließen ✓' : 'Weiter →';
    next.addEventListener('click', () => {
      if (game.teams[team].index === index && advance(game, team)) { renderTeam(team); renderScore(); }
    });
    panel.append(next);
  }
}
function renderScore(pullDirection = 0, resetMotion = false) {
  game.teams.forEach((team, i) => { $(`score-${i}`).textContent = team.score; });
  const scene = $('rope');
  scene.style.transform = `translateX(${game.position * 1.5}%)`;
  if (resetMotion) {
    scene.classList.remove('pull-left', 'pull-right');
    scene.dataset.pullSequence = '0';
  } else if (pullDirection) {
    scene.classList.remove('pull-left', 'pull-right');
    void scene.offsetWidth;
    scene.classList.add(pullDirection < 0 ? 'pull-left' : 'pull-right');
    scene.dataset.pullSequence = String(Number(scene.dataset.pullSequence || 0) + 1);
  }
  $('match-status').textContent = game.position === 0 ? 'Gleichstand · Das Seil ist in der Mitte' : `${names[game.position < 0 ? 0 : 1]} führt mit ${Math.abs(game.position)} Zug${Math.abs(game.position) === 1 ? '' : 'en'}`;
  if (game.phase === 'finished') {
    renderTeam(0); renderTeam(1);
    $('result').hidden = false;
    $('result-title').textContent = game.winner === null ? 'Unentschieden – ¡bien hecho!' : `${names[game.winner]} gewinnt!`;
    $('result-detail').textContent = `${game.teams[0].score} : ${game.teams[1].score} Punkte. ${Math.abs(game.position) >= 5 ? 'Das Seil hat die Ziellinie erreicht.' : 'Beide Teams haben alle Aufgaben abgeschlossen.'}`;
    $('match-status').textContent = $('result-title').textContent;
    $('result-title').focus({ preventScroll: true });
  }
}
function start() {
  game = createGame();
  $('intro').hidden = true;
  $('result').hidden = true;
  $('teams').hidden = false;
  $('reset').hidden = false;
  renderTeam(0); renderTeam(1); renderScore(0, true);
}
$('start').addEventListener('click', start);
$('restart').addEventListener('click', start);
$('reset').addEventListener('click', () => {
  game = createGame();
  $('intro').hidden = false;
  $('teams').hidden = true;
  $('result').hidden = true;
  $('reset').hidden = true;
  renderScore(0, true);
  $('start').focus();
});
$('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { $('screen-note').textContent = 'Vollbild ist hier nicht verfügbar. Das Spiel funktioniert auch ohne Vollbild.'; }
});
document.addEventListener('fullscreenchange', () => {
  $('fullscreen').textContent = document.fullscreenElement ? 'Vollbild verlassen ↙' : 'Vollbild ↗';
});
