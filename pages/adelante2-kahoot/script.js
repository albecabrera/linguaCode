import {
  acceptedAnswers,
  displaySpanish,
  flattenEntries,
  isAnswerCorrect,
  makeQuizQuestion,
  normalizeAnswer,
  progressPercent,
  scoreAnswer,
  searchEntries,
  shuffle,
} from './engine.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

let library;
let entries = [];
let selected = new Set(storage.get('adelante2-selected', []));
let progress = storage.get('adelante2-progress', {});
let currentView = 'library';
let flashcards = null;
let quiz = null;
let competition = null;

const announce = (message) => { $('#live-region').textContent = message; };
const selectedEntries = () => entries.filter((entry) => selected.has(entry.id));
const saveProgress = () => storage.set('adelante2-progress', progress);
const saveSelection = () => storage.set('adelante2-selected', [...selected]);

function setView(view) {
  currentView = view;
  $$('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  $$('[data-view-panel]').forEach((panel) => { panel.hidden = panel.dataset.viewPanel !== view; });
  if (view === 'library') renderLibrary();
  if (view === 'flashcards') renderFlashcards();
  if (view === 'quiz') renderQuiz();
  if (view === 'competition') renderCompetition();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fillFilters() {
  const units = [...new Map(entries.map((entry) => [entry.unitId, entry.unitLabel])).entries()];
  const types = [...new Map(entries.map((entry) => [entry.type, entry.typeLabel])).entries()];
  const blocks = [...new Map(entries.map((entry) => [entry.block, entry.blockLabel])).entries()];
  const fill = (selector, values) => { $(selector).insertAdjacentHTML('beforeend', values.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join('')); };
  fill('#unit-filter', units); fill('#type-filter', types); fill('#block-filter', blocks);
}

function renderSelection() {
  const count = selected.size;
  $('#selection-count').textContent = `${count} ausgewählt`;
  $('#selection-hint').textContent = count ? `${progressPercent(progress, selectedEntries())}% Fortschritt in dieser Auswahl` : 'Wähle Wörter aus der Bibliothek.';
  $('#clear-selection').disabled = !count;
  $$('.select-entry').forEach((button) => {
    const isSelected = selected.has(button.dataset.entry);
    button.textContent = isSelected ? 'Ausgewählt' : 'Auswählen';
    button.closest('.entry-card')?.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderLibrary() {
  const filtered = searchEntries(entries, { query: $('#search').value, unit: $('#unit-filter').value, type: $('#type-filter').value, block: $('#block-filter').value });
  $('#result-count').textContent = `${filtered.length} Begriff${filtered.length === 1 ? '' : 'e'}`;
  $('#entry-list').innerHTML = filtered.length ? filtered.map((entry) => `<article class="entry-card ${selected.has(entry.id) ? 'selected' : ''}">
    <div class="entry-top"><span class="chip">${esc(entry.blockLabel)}</span><button class="select-entry" type="button" data-entry="${esc(entry.id)}" aria-pressed="${selected.has(entry.id)}">${selected.has(entry.id) ? 'Ausgewählt' : 'Auswählen'}</button></div>
    <h3>${esc(displaySpanish(entry))}</h3><p class="translation">${esc(entry.german)}</p>
    ${entry.special ? `<span class="special">Buchhinweis: ${esc(entry.special)}</span>` : ''}
    <div class="entry-footer"><span>${esc(entry.unitLabel)}</span><span>${esc(entry.typeLabel)}</span></div>
  </article>`).join('') : '<p class="empty">Keine passenden Begriffe gefunden. Prüfe Suchbegriff oder Filter.</p>';
  $$('.select-entry').forEach((button) => button.addEventListener('click', () => {
    if (selected.has(button.dataset.entry)) selected.delete(button.dataset.entry); else selected.add(button.dataset.entry);
    saveSelection(); renderLibrary(); renderSelection();
  }));
  renderSelection();
}

function requireSelection() {
  if (selected.size) return true;
  setView('library'); announce('Bitte wähle zuerst mindestens einen Begriff aus.');
  $('#selection-hint').textContent = 'Bitte zuerst mindestens einen Begriff auswählen.';
  return false;
}

function startFlashcards() {
  if (!requireSelection()) return;
  flashcards = { items: shuffle(selectedEntries()), index: 0, wrong: [], repeating: false, revealed: false, direction: 'spanish', done: 0 };
  setView('flashcards');
}

function finishFlashcards() {
  const repeated = flashcards.repeating;
  $('#flashcards-view').innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Karteikarten</p><h2>Runde geschafft!</h2></div></div><div class="practice-card"><div class="result-score">${flashcards.done}<small>${repeated ? 'Wiederholungen gemeistert' : 'Karten bearbeitet'}</small></div><p class="feedback-box good">Dein Lernstand wurde lokal auf diesem Gerät gespeichert.</p><div class="result-actions"><button id="flashcards-again" type="button">Noch einmal</button><button class="secondary" id="flashcards-library" type="button">Zur Bibliothek</button></div></div></div>`;
  $('#flashcards-again').onclick = startFlashcards; $('#flashcards-library').onclick = () => setView('library');
}

function nextFlashcard(markKnown) {
  const entry = flashcards.items[flashcards.index];
  const itemProgress = progress[entry.id] || { known: false, attempts: 0, correct: 0 };
  itemProgress.attempts += 1;
  if (markKnown) { itemProgress.known = true; itemProgress.correct += 1; } else { itemProgress.known = false; flashcards.wrong.push(entry); }
  progress[entry.id] = itemProgress; saveProgress(); flashcards.done += 1; flashcards.index += 1;
  if (flashcards.index >= flashcards.items.length && !flashcards.repeating && flashcards.wrong.length) { flashcards.items = shuffle(flashcards.wrong); flashcards.wrong = []; flashcards.index = 0; flashcards.repeating = true; }
  if (flashcards.index >= flashcards.items.length) finishFlashcards(); else { flashcards.revealed = false; renderFlashcards(); }
}

function renderFlashcards() {
  const target = $('#flashcards-view');
  if (!flashcards) { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Solo üben</p><h2>Karteikarten</h2></div></div><div class="practice-card"><p class="lead">${selected.size ? `${selected.size} ausgewählte Begriffe liegen bereit.` : 'Wähle zuerst Begriffe in der Bibliothek aus.'}</p><div class="quiz-actions"><button id="start-flashcards" type="button" ${selected.size ? '' : 'disabled'}>Karteikarten starten</button><button class="secondary" id="flashcards-back" type="button">Bibliothek öffnen</button></div></div></div>`; $('#start-flashcards').onclick = startFlashcards; $('#flashcards-back').onclick = () => setView('library'); return; }
  const entry = flashcards.items[flashcards.index];
  const showingFront = flashcards.direction === 'spanish' ? displaySpanish(entry) : entry.german;
  const showingBack = flashcards.direction === 'spanish' ? entry.german : displaySpanish(entry);
  target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">${flashcards.repeating ? 'Wiederholung' : 'Solo üben'}</p><h2>Karteikarten</h2></div><label><span class="sr-only">Richtung</span><select id="card-direction"><option value="spanish" ${flashcards.direction === 'spanish' ? 'selected' : ''}>Spanisch → Deutsch</option><option value="german" ${flashcards.direction === 'german' ? 'selected' : ''}>Deutsch → Spanisch</option></select></label></div><div class="progress-line" aria-label="Fortschritt"><span style="width:${Math.round((flashcards.index / flashcards.items.length) * 100)}%"></span></div><p class="room-status">Karte ${flashcards.index + 1} von ${flashcards.items.length}${flashcards.repeating ? ' · falsch beantwortete Karten' : ''}</p><div class="practice-card"><button class="flashcard" id="flashcard" type="button" aria-label="Karte umdrehen"><span><span class="direction">${flashcards.revealed ? 'Lösung' : flashcards.direction === 'spanish' ? 'Spanisch' : 'Deutsch'}</span><span class="term">${esc(flashcards.revealed ? showingBack : showingFront)}</span><span class="hint">${flashcards.revealed ? (entry.example ? esc(entry.example.sentence) : 'Welche Antwort passt?') : 'Klicken oder Enter zum Umdrehen'}</span></span></button><div class="flashcard-controls"><button class="again" id="flash-again" type="button" ${flashcards.revealed ? '' : 'disabled'}>Nochmal üben</button><button class="known" id="flash-known" type="button" ${flashcards.revealed ? '' : 'disabled'}>Ich wusste es</button></div></div></div>`;
  $('#card-direction').onchange = (event) => { flashcards.direction = event.target.value; flashcards.revealed = false; renderFlashcards(); };
  $('#flashcard').onclick = () => { flashcards.revealed = !flashcards.revealed; renderFlashcards(); };
  $('#flashcard').onkeydown = (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flashcards.revealed = !flashcards.revealed; renderFlashcards(); } };
  $('#flash-again').onclick = () => nextFlashcard(false); $('#flash-known').onclick = () => nextFlashcard(true);
}

const quizKindLabel = { spanishToGerman: 'Spanisch → Deutsch', germanToSpanish: 'Deutsch → Spanisch', trueFalse: 'Richtig oder falsch', typeSpanish: 'Spanisch eintippen', typeGerman: 'Deutsch eintippen', cloze: 'Lückensatz' };

function startQuiz() {
  if (!requireSelection()) return;
  const pool = selectedEntries();
  const kinds = ['spanishToGerman', 'germanToSpanish', 'trueFalse', 'typeSpanish', 'typeGerman', 'cloze'];
  quiz = { questions: pool.map((entry, index) => makeQuizQuestion(entry, pool, kinds[index % kinds.length])).sort(() => Math.random() - .5), index: 0, score: 0, answered: false, startedAt: 0 };
  setView('quiz');
}

function quizSolution(question) {
  if (question.kind === 'trueFalse') return question.answer ? 'Richtig' : 'Falsch';
  return question.answer;
}

function answerQuiz(value, button = null) {
  if (quiz.answered) return;
  const question = quiz.questions[quiz.index];
  const correct = question.kind === 'trueFalse' ? Boolean(value) === question.answer : question.kind.startsWith('type') || question.kind === 'cloze' ? isAnswerCorrect(value, question.entry, question.kind === 'typeGerman' || question.direction === 'german' ? 'german' : 'spanish') : normalizeAnswer(value) === normalizeAnswer(question.answer);
  quiz.answered = true; quiz.score += Number(correct); progress[question.entry.id] = { ...(progress[question.entry.id] || {}), known: correct, attempts: (progress[question.entry.id]?.attempts || 0) + 1, correct: (progress[question.entry.id]?.correct || 0) + Number(correct) }; saveProgress();
  $$('.answer-grid button, .typing-form button', $('#quiz-view')).forEach((item) => { item.disabled = true; if (item.dataset.value === String(question.answer) || item.dataset.value === quizSolution(question)) item.classList.add('correct'); });
  if (button && !correct) button.classList.add('wrong');
  const feedback = correct ? '<strong>Richtig!</strong> Sehr gut.' : `<strong>Noch nicht.</strong> Die Lösung ist: <strong>${esc(quizSolution(question))}</strong>. Achte auf Akzente und Sonderzeichen.`;
  $('#quiz-feedback').className = `feedback-box ${correct ? 'good' : 'bad'}`; $('#quiz-feedback').innerHTML = feedback; $('#quiz-next').hidden = false;
  announce(correct ? 'Richtig' : `Falsch. Lösung: ${quizSolution(question)}`);
}

function renderQuiz() {
  const target = $('#quiz-view');
  if (!quiz) { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Solo testen</p><h2>Quizmodus</h2></div></div><div class="practice-card"><p class="lead">Mehrere Fragetypen entstehen direkt aus deiner Auswahl. Eingabefragen prüfen die korrekten Akzente.</p><div class="quiz-actions"><button id="start-quiz" type="button" ${selected.size ? '' : 'disabled'}>Quiz starten</button><button class="secondary" id="quiz-back" type="button">Bibliothek öffnen</button></div></div></div>`; $('#start-quiz').onclick = startQuiz; $('#quiz-back').onclick = () => setView('library'); return; }
  if (quiz.index >= quiz.questions.length) { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Quiz abgeschlossen</p><h2>Stark gespielt!</h2></div></div><div class="practice-card"><div class="result-score">${quiz.score}/${quiz.questions.length}<small>richtig beantwortet</small></div><div class="result-actions"><button id="quiz-again" type="button">Noch einmal</button><button class="secondary" id="quiz-library" type="button">Zur Bibliothek</button></div></div></div>`; $('#quiz-again').onclick = startQuiz; $('#quiz-library').onclick = () => setView('library'); return; }
  const question = quiz.questions[quiz.index]; const typed = ['typeSpanish', 'typeGerman', 'cloze'].includes(question.kind); const prompt = question.kind === 'cloze' ? question.prompt : question.prompt;
  const answerArea = typed ? `<form class="typing-form" id="typing-form"><label class="sr-only" for="quiz-answer">Antwort</label><input class="answer-input" id="quiz-answer" autocomplete="off" spellcheck="false" placeholder="Antwort mit korrekten Akzenten …"><button type="submit">Prüfen</button></form>` : question.kind === 'trueFalse' ? `<div class="answer-grid"><button class="true" type="button" data-value="true">✓ Richtig</button><button class="false" type="button" data-value="false">✕ Falsch</button></div>` : `<div class="answer-grid">${question.options.map((option) => `<button type="button" data-value="${esc(option)}">${esc(option)}</button>`).join('')}</div>`;
  target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Frage ${quiz.index + 1} von ${quiz.questions.length}</p><h2>Quizmodus</h2></div><span class="count-pill">${quiz.score} richtig</span></div><div class="progress-line"><span style="width:${(quiz.index / quiz.questions.length) * 100}%"></span></div><div class="question-card"><p class="question-kind">${quizKindLabel[question.kind]}</p><h3>${esc(prompt)}</h3>${question.kind === 'trueFalse' ? `<p class="lead">${esc(question.statement)}</p>` : ''}${answerArea}<div id="quiz-feedback" class="feedback-box" aria-live="polite"></div><div class="quiz-actions"><button class="secondary" id="quiz-next" type="button" hidden>Nächste Frage</button></div></div></div>`;
  quiz.startedAt = performance.now();
  $$('#quiz-view [data-value]').forEach((button) => button.onclick = () => answerQuiz(question.kind === 'trueFalse' ? button.dataset.value === 'true' : button.dataset.value, button));
  $('#typing-form')?.addEventListener('submit', (event) => { event.preventDefault(); answerQuiz($('#quiz-answer').value); });
  $('#quiz-next').onclick = () => { quiz.index += 1; quiz.answered = false; renderQuiz(); };
}

const roomKey = (code) => `adelante2-room-${code}`;
const randomId = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const randomCode = () => Math.random().toString(36).slice(2, 6).toUpperCase();
const roomPlayer = (name, id = randomId()) => ({ id, name: name.trim().slice(0, 22) || 'Spieler', score: 0, lastSeen: Date.now(), connected: true });

function postRoom(message) { competition?.channel?.postMessage(message); }
function saveRoom() { if (!competition?.room) return; localStorage.setItem(roomKey(competition.room.code), JSON.stringify(competition.room)); postRoom({ type: 'room', room: competition.room }); renderCompetition(); }
function loadRoom(code) { try { return JSON.parse(localStorage.getItem(roomKey(code)) || 'null'); } catch { return null; } }
function openRoom(room, isHost, player) {
  competition?.channel?.close();
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(`adelante2-room-${room.code}`) : null;
  competition = { room, isHost, player, channel, answered: false, timeout: null, heartbeat: null };
  if (channel) channel.onmessage = (event) => handleRoomMessage(event.data);
  window.addEventListener('storage', (event) => { if (event.key === roomKey(room.code) && event.newValue) { const next = JSON.parse(event.newValue); competition.room = next; renderCompetition(); } });
  competition.heartbeat = window.setInterval(() => { if (!competition) return; if (competition.isHost) prunePlayers(); else postRoom({ type: 'heartbeat', playerId: competition.player.id }); }, 4000);
  renderCompetition();
}

function handleRoomMessage(message) {
  if (!competition || !message) return;
  if (message.type === 'join' && competition.isHost) { if (!competition.room.players.some((player) => player.id === message.player.id)) competition.room.players.push({ ...message.player, lastSeen: Date.now(), connected: true }); saveRoom(); return; }
  if (message.type === 'heartbeat' && competition.isHost) { const player = competition.room.players.find((item) => item.id === message.playerId); if (player) { player.lastSeen = Date.now(); player.connected = true; saveRoom(); } return; }
  if (message.type === 'leave' && competition.isHost) { const player = competition.room.players.find((item) => item.id === message.playerId); if (player) player.connected = false; saveRoom(); return; }
  if (message.type === 'answer' && competition.isHost) { receiveRoomAnswer(message); return; }
  if (message.type === 'room' && message.room?.code === competition.room.code) { competition.room = message.room; renderCompetition(); }
}

function prunePlayers() {
  const now = Date.now(); let changed = false;
  competition.room.players.forEach((player) => { if (player.id !== competition.room.hostId && player.connected && now - player.lastSeen > 12000) { player.connected = false; changed = true; } });
  if (changed) saveRoom();
}

function competitionQuestions(pool) {
  const kinds = ['spanishToGerman', 'germanToSpanish', 'trueFalse'];
  return shuffle(pool).map((entry, index) => makeQuizQuestion(entry, pool, kinds[index % kinds.length]));
}

function startRoomRound() {
  const pool = entries.filter((entry) => competition.room.entryIds.includes(entry.id));
  if (!pool.length) return;
  competition.room.questions = competitionQuestions(pool); competition.room.current = 0; competition.room.answers = {}; competition.room.phase = 'question'; competition.room.deadline = Date.now() + 12000; competition.room.players.forEach((player) => { player.score = 0; player.connected = true; });
  competition.answered = false; saveRoom(); scheduleRoundTimeout();
}

function scheduleRoundTimeout() {
  clearTimeout(competition.timeout); competition.timeout = window.setTimeout(() => { if (!competition?.isHost || competition.room.phase !== 'question') return; showRoomResults(); }, 12000);
}

function submitRoomAnswer(value) {
  if (!competition || competition.answered || competition.room.phase !== 'question') return;
  competition.answered = true; const question = competition.room.questions[competition.room.current]; const started = competition.room.deadline - 12000; const elapsed = Math.max(0, Date.now() - started); const message = { type: 'answer', playerId: competition.player.id, value, elapsed };
  if (competition.isHost) receiveRoomAnswer(message); else postRoom(message);
}

function receiveRoomAnswer(message) {
  const room = competition.room; if (room.phase !== 'question' || room.answers[message.playerId]) return;
  const question = room.questions[room.current]; const correct = question.kind === 'trueFalse' ? Boolean(message.value) === question.answer : normalizeAnswer(message.value) === normalizeAnswer(question.answer); const points = scoreAnswer(correct, message.elapsed);
  room.answers[message.playerId] = { correct, points }; const player = room.players.find((item) => item.id === message.playerId); if (player) player.score += points; saveRoom();
  if (room.players.filter((item) => item.connected).every((item) => room.answers[item.id])) showRoomResults();
}

function showRoomResults() { if (!competition?.isHost || competition.room.phase !== 'question') return; clearTimeout(competition.timeout); competition.room.phase = 'results'; saveRoom(); window.setTimeout(() => { if (!competition?.isHost || competition.room.phase !== 'results') return; if (competition.room.current + 1 >= competition.room.questions.length) { competition.room.phase = 'finished'; saveRoom(); } else { competition.room.current += 1; competition.room.answers = {}; competition.room.phase = 'question'; competition.room.deadline = Date.now() + 12000; competition.answered = false; saveRoom(); scheduleRoundTimeout(); } }, 3000); }

function createRoom(name) {
  if (!requireSelection()) return;
  let code = randomCode(); while (loadRoom(code)) code = randomCode();
  const player = roomPlayer(name); const room = { code, hostId: player.id, players: [player], entryIds: selectedEntries().map((entry) => entry.id), questions: [], current: 0, answers: {}, phase: 'lobby', deadline: 0 };
  localStorage.setItem(roomKey(code), JSON.stringify(room)); openRoom(room, true, player); announce(`Raum ${code} erstellt.`);
}

function joinRoom(code, name) {
  const room = loadRoom(code.toUpperCase()); if (!room) { const error = $('#room-error'); error.textContent = 'Dieser Raum wurde in diesem Browser nicht gefunden.'; error.hidden = false; return; }
  const player = roomPlayer(name); openRoom(room, false, player); postRoom({ type: 'join', player }); announce(`Raum ${room.code} beigetreten.`);
}

function leaveRoom() { if (!competition) return; postRoom({ type: 'leave', playerId: competition.player.id }); clearTimeout(competition.timeout); clearInterval(competition.heartbeat); competition.channel?.close(); competition = null; renderCompetition(); }

function renderScoreList(room) { return `<ol class="score-list">${[...room.players].filter((player) => player.connected || player.id === room.hostId).sort((a, b) => b.score - a.score).map((player, index) => `<li><span>${index + 1}. ${esc(player.name)}${player.id === room.hostId ? ' ★' : ''}</span><strong>${player.score}</strong></li>`).join('')}</ol>`; }

function renderCompetition() {
  const target = $('#competition-view');
  if (!competition) { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Gemeinsam lernen</p><h2>Wettbewerb</h2></div></div><div class="library-note"><span class="note-icon">i</span><p><strong>Lokaler Raum:</strong> Raum-Code und Synchronisierung funktionieren ohne externe Plattform in Tabs derselben Browser-Origin. Für schulweite Mehrgeräte-Räume ist ein servergestütztes Realtime-Backend noch offen.</p></div><div class="room-grid"><article class="room-choice"><span class="chip">Lehrkraft oder Host</span><h3>Spiel erstellen</h3><p>Erzeuge einen Raum-Code und starte die ausgewählten Begriffe.</p><button id="create-room" type="button" ${selected.size ? '' : 'disabled'}>Raum erstellen</button></article><article class="room-choice"><span class="chip">Schülerinnen und Schüler</span><h3>Beitreten</h3><p>Mit Spitznamen und Raum-Code in eine laufende Runde eintreten.</p><button id="join-room" type="button">Raum beitreten</button></article></div><p class="small-note">${selected.size ? `${selected.size} Begriffe sind für die nächste Runde ausgewählt.` : 'Wähle zuerst Begriffe in der Bibliothek aus.'}</p></div>`;
    $('#create-room').onclick = () => showRoomNameForm('create'); $('#join-room').onclick = () => showRoomNameForm('join'); return;
  }
  const room = competition.room;
  if (room.phase === 'lobby') { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Warteraum</p><h2>Raum bereit</h2></div><button class="secondary" id="leave-room" type="button">Raum verlassen</button></div><div class="room-card"><p class="room-status">Teile diesen Code:</p><div class="code-display">${esc(room.code)}</div><div class="roster">${room.players.filter((player) => player.connected).map((player) => `<span class="player-pill ${player.id === room.hostId ? 'host' : ''}">${esc(player.name)}${player.id === room.hostId ? ' ★' : ''}</span>`).join('')}</div><p class="room-status">${room.players.filter((player) => player.connected).length} Spieler im Raum · ${room.entryIds.length} Begriffe</p>${competition.isHost ? '<button id="start-room" type="button">Runde starten</button>' : '<p class="room-status">Die Host-Person startet die Runde.</p>'}</div></div>`; $('#leave-room').onclick = leaveRoom; $('#start-room')?.addEventListener('click', startRoomRound); return; }
  if (room.phase === 'question') { renderRoomQuestion(target); return; }
  if (room.phase === 'results') { target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Zwischenstand</p><h2>Runde ${room.current + 1} geschafft</h2></div></div><div class="room-card"><p class="room-status">Nächste Frage folgt automatisch.</p>${renderScoreList(room)}</div></div>`; return; }
  target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">Finale</p><h2>Rangliste</h2></div><button class="secondary" id="leave-room" type="button">Raum verlassen</button></div><div class="room-card">${renderScoreList(room)}${competition.isHost ? '<button id="restart-room" type="button">Neue Runde starten</button>' : ''}</div></div>`; $('#leave-room').onclick = leaveRoom; $('#restart-room')?.addEventListener('click', startRoomRound);
}

function renderRoomQuestion(target) {
  const question = competition.room.questions[competition.room.current]; const answered = competition.answered; const answerArea = question.kind === 'trueFalse' ? `<div class="answer-grid"><button class="true" type="button" data-value="true" ${answered ? 'disabled' : ''}>✓ Richtig</button><button class="false" type="button" data-value="false" ${answered ? 'disabled' : ''}>✕ Falsch</button></div>` : `<div class="answer-grid">${question.options.map((option) => `<button type="button" data-value="${esc(option)}" ${answered ? 'disabled' : ''}>${esc(option)}</button>`).join('')}</div>`;
  target.innerHTML = `<div class="mode-shell room-question"><div class="mode-head"><div><p class="eyebrow">Frage ${competition.room.current + 1} von ${competition.room.questions.length}</p><h2>Wettbewerb</h2></div><button class="secondary" id="leave-room" type="button">Verlassen</button></div><div class="room-meta"><span>Raum ${esc(competition.room.code)}</span><span>${Math.max(0, Math.ceil((competition.room.deadline - Date.now()) / 1000))} Sekunden</span></div><div class="question-card"><p class="question-kind">${quizKindLabel[question.kind]}</p><h3>${esc(question.prompt)}</h3>${question.kind === 'trueFalse' ? `<p class="lead">${esc(question.statement)}</p>` : ''}${answerArea}<p class="room-status">${answered ? 'Antwort gespeichert – warte auf die anderen.' : 'Schnelle richtige Antworten bringen mehr Punkte.'}</p></div></div>`;
  $('#leave-room').onclick = leaveRoom; $$('#competition-view [data-value]').forEach((button) => button.onclick = () => submitRoomAnswer(question.kind === 'trueFalse' ? button.dataset.value === 'true' : button.dataset.value));
}

function showRoomNameForm(action) {
  const target = $('#competition-view'); target.innerHTML = `<div class="mode-shell"><div class="mode-head"><div><p class="eyebrow">${action === 'create' ? 'Spiel erstellen' : 'Raum beitreten'}</p><h2>${action === 'create' ? 'Wer bist du?' : 'Code eingeben'}</h2></div></div><div class="room-card"><form class="room-form" id="room-form"><label>Spitzname<input class="name-input" id="room-name" maxlength="22" required placeholder="z. B. María"></label>${action === 'join' ? '<label>Raum-Code<input class="name-input" id="room-code" maxlength="4" required pattern="[A-Za-z0-9]{4}" placeholder="ABCD" autocapitalize="characters"></label><p id="room-error" class="feedback-box bad" hidden></p>' : ''}<button type="submit">${action === 'create' ? 'Raum erstellen' : 'Beitreten'}</button><button class="secondary" id="room-cancel" type="button">Abbrechen</button></form></div></div>`;
  $('#room-cancel').onclick = renderCompetition; $('#room-form').onsubmit = (event) => { event.preventDefault(); if (action === 'create') createRoom($('#room-name').value); else joinRoom($('#room-code').value.trim(), $('#room-name').value); };
}

function setup() {
  fillFilters(); renderLibrary(); renderSelection();
  $$('.nav-button').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  ['#search', '#unit-filter', '#type-filter', '#block-filter'].forEach((selector) => $(selector).addEventListener(selector === '#search' ? 'input' : 'change', renderLibrary));
  $('#select-visible').onclick = () => { searchEntries(entries, { query: $('#search').value, unit: $('#unit-filter').value, type: $('#type-filter').value, block: $('#block-filter').value }).forEach((entry) => selected.add(entry.id)); saveSelection(); renderLibrary(); };
  $('#clear-selection').onclick = () => { selected.clear(); saveSelection(); renderLibrary(); };
  $('#flashcards-view').hidden = true; $('#quiz-view').hidden = true; $('#competition-view').hidden = true;
  window.addEventListener('beforeunload', () => { if (competition) postRoom({ type: 'leave', playerId: competition.player.id }); });
}

fetch('content.json').then((response) => { if (!response.ok) throw new Error('content'); return response.json(); }).then((data) => { library = data; entries = flattenEntries(library); selected = new Set([...selected].filter((id) => entries.some((entry) => entry.id === id))); setup(); }).catch(() => { document.querySelector('main').innerHTML = '<section class="practice-card"><h1>Inhalte konnten nicht geladen werden.</h1><p>Bitte lade die Seite erneut oder informiere deine Lehrkraft.</p></section>'; });
