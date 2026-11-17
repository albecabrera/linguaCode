import {
  createEmptyGame,
  validateGame,
  exportGame,
  importGame,
  createGameStore,
  playWheel,
  matchMemory,
  classifyItem,
  id
} from './model.mjs';

const LABELS = { tug: 'Tauziehen', wheel: 'Glücksrad', jeopardy: 'Jeopardy', memory: 'Memory', matching: 'Zuordnen' };
const SUBJECTS = ['Informatik', 'Spanisch', 'Sport', 'Mathematik'];
const TYPES = Object.entries(LABELS);

const makeElement = (tag, text) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
};

function makeButton(text, action, className = '') {
  const node = makeElement('button', text);
  node.type = 'button';
  if (className) node.className = className;
  if (typeof action === 'function') node.addEventListener('click', action);
  return node;
}

function makeStatus(text = '', kind = '') {
  const node = makeElement('p', text);
  node.className = `status ${kind}`;
  node.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  node.setAttribute('aria-live', 'polite');
  return node;
}

function makeField(label, value, onInput, multiline = false) {
  const wrapper = makeElement('label');
  wrapper.className = 'field';
  wrapper.append(makeElement('span', label));
  const input = makeElement(multiline ? 'textarea' : 'input');
  input.value = value ?? '';
  input.addEventListener('input', () => onInput(input.value));
  wrapper.append(input);
  return wrapper;
}

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function mountSpiele(container, storage) {
  let store;
  try { store = storage ? createGameStore(storage) : null; } catch { store = null; }
  let activeCleanup = () => {};
  let importInput;
  let importStatus;

  function replaceStatus(target, text, kind = '') {
    const next = makeStatus(text, kind);
    target.replaceWith(next);
    return next;
  }

  function download(game) {
    try {
      const url = URL.createObjectURL(new Blob([exportGame(game)], { type: 'application/json' }));
      const link = makeElement('a');
      link.href = url;
      link.download = `spiele-${game.id}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      importStatus = replaceStatus(importStatus, `Export nicht möglich: ${error.message}`, 'error');
    }
  }

  function importText(source) {
    try {
      const game = importGame(source);
      edit(structuredClone(game));
      return game;
    } catch (error) {
      importStatus = replaceStatus(importStatus, `Import abgebrochen: ${error.message}`, 'error');
      return null;
    }
  }

  function renderImportControls(parent) {
    const controls = makeElement('div');
    controls.className = 'import-controls actions';
    const label = makeElement('label');
    label.className = 'button-like';
    label.append(makeElement('span', 'JSON importieren'));
    importInput = makeElement('input');
    importInput.type = 'file';
    importInput.accept = '.json,application/json';
    label.append(importInput);
    const button = makeButton('JSON-Datei auswählen', () => importInput.click());
    importStatus = makeStatus('');
    importInput.addEventListener('change', async () => {
      const file = importInput.files?.[0];
      importInput.value = '';
      if (!file) return;
      if (file.size > 1024 * 1024) {
        importStatus = replaceStatus(importStatus, 'Import abgebrochen: JSON darf höchstens 1 MB groß sein.', 'error');
        return;
      }
      try { importText(await file.text()); } catch (error) { importStatus = replaceStatus(importStatus, `Import abgebrochen: ${error.message}`, 'error'); }
    });
    controls.append(label, button, importStatus);
    parent.append(controls);
  }

  function renderHome() {
    activeCleanup();
    activeCleanup = () => {};
    container.replaceChildren();
    const hero = makeElement('section');
    hero.className = 'hero';
    hero.append(
      makeElement('p', 'Unterrichtsspiele für den gemeinsamen Bildschirm'),
      makeElement('h1', 'Spiele erstellen. Sofort spielen.'),
      makeElement('p', 'Erstelle eigene Inhalte für Informatik, Spanisch, Sport oder Mathematik. Alles bleibt lokal in diesem Browser. Es gibt keine automatische Veröffentlichung und keine Online-Mitspieler.'),
      makeButton('Eigenes Tauziehen erstellen', () => edit(createEmptyGame('tug')))
    );
    renderImportControls(hero);
    const formats = makeElement('div');
    formats.className = 'type-grid';
    TYPES.forEach(([type, label]) => {
      const tile = makeButton('', () => edit(createEmptyGame(type)), 'tile');
      tile.append(makeElement('strong', label), makeElement('span', formatDescription(type)));
      formats.append(tile);
    });
    const section = makeElement('section');
    section.id = 'studio';
    section.append(makeElement('h2', 'Meine lokalen Spiele'), makeElement('p', 'Gespeicherte Spiele sind nur auf diesem Gerät verfügbar. JSON-Export ist eine manuelle Sicherung und veröffentlicht nichts.'));
    if (!store) {
      section.append(makeStatus('Lokaler Speicher ist nicht verfügbar. Spiele werden nicht als gespeichert ausgegeben.', 'error'));
    } else {
      try {
        const games = store.list();
        const cards = makeElement('div');
        cards.className = 'game-grid';
        if (!games.length) cards.append(makeElement('p', 'Noch keine eigenen Spiele vorhanden. Wähle oben ein Format.'));
        games.forEach(game => cards.append(gameCard(game)));
        section.append(cards);
      } catch (error) {
        section.append(makeStatus(error.message, 'error'));
      }
    }
    container.append(hero, makeElement('h2', 'Format wählen'), formats, section);
  }

  function formatDescription(type) {
    return {
      tug: 'Fragen beantworten und das Seil gemeinsam bewegen.',
      wheel: 'Zufällig eine noch offene Frage ziehen.',
      jeopardy: 'Kategorien, Punkte und einmalige Fragen.',
      memory: 'Gemischte Kartenpaare aufdecken.',
      matching: 'Begriffe passenden Gruppen zuordnen.'
    }[type];
  }

  function gameCard(game) {
    const card = makeElement('article');
    card.className = 'game-card';
    card.append(makeElement('h3', game.title), makeElement('p', `${LABELS[game.type]} · ${game.subject} · Klasse ${game.grade}`));
    const actions = makeElement('div');
    actions.className = 'actions';
    actions.append(
      makeButton('Bearbeiten', () => edit(structuredClone(game))),
      makeButton('Spielen', () => play(game)),
      makeButton('JSON exportieren', () => download(game)),
      makeButton('Löschen', () => {
        if (!confirm(`„${game.title}“ löschen?`)) return;
        try { store.remove(game.id); renderHome(); } catch (error) { card.append(makeStatus(`Nicht gelöscht: ${error.message}`, 'error')); }
      })
    );
    card.append(actions);
    return card;
  }

  function renderCollection(parent, title, values, draw, create) {
    const area = makeElement('section');
    area.className = 'editor-section';
    area.append(makeElement('h2', title));
    values.forEach((value, index) => {
      const box = makeElement('fieldset');
      box.append(makeElement('legend', `${title} ${index + 1}`));
      draw(box, value);
      box.append(makeButton('Entfernen', () => { values.splice(index, 1); renderEditorContent(); }));
      area.append(box);
    });
    area.append(makeButton(`${title} hinzufügen`, () => { values.push(create()); renderEditorContent(); }));
    parent.append(area);
  }

  let editorGame;
  let editorContentHost;
  function renderEditorContent() {
    editorContentHost.replaceChildren();
    const game = editorGame;
    const drawQuestion = (box, question) => {
      box.append(
        makeField('Frage / Impuls', question.prompt, value => { question.prompt = value; }),
        makeField('Antwort für die Lehrkraft', question.answer, value => { question.answer = value; }),
        makeField('Punkte', question.points ?? 100, value => { question.points = Number(value); })
      );
    };
    if (game.type === 'tug' || game.type === 'wheel') {
      renderCollection(editorContentHost, 'Frage', game.content.questions, drawQuestion, () => ({ id: id(), prompt: '', answer: '', points: 100 }));
    }
    if (game.type === 'jeopardy') {
      renderCollection(editorContentHost, 'Kategorie', game.content.categories, (box, category) => {
        box.append(makeField('Kategoriename', category.name, value => { category.name = value; }));
        const questionHost = makeElement('div');
        renderCollection(questionHost, 'Frage', category.questions, drawQuestion, () => ({ id: id(), prompt: '', answer: '', points: 100 }));
        box.append(questionHost);
      }, () => ({ id: id(), name: '', questions: [] }));
    }
    if (game.type === 'memory') {
      renderCollection(editorContentHost, 'Paar', game.content.pairs, (box, pair) => box.append(
        makeField('Erste Karte', pair.first, value => { pair.first = value; }),
        makeField('Zweite Karte', pair.second, value => { pair.second = value; })
      ), () => ({ id: id(), first: '', second: '' }));
    }
    if (game.type === 'matching') {
      renderCollection(editorContentHost, 'Gruppe', game.content.groups, (box, group) => {
        box.append(makeField('Gruppenname', group.name, value => { group.name = value; }));
        const itemHost = makeElement('div');
        renderCollection(itemHost, 'Begriff', group.items, (itemBox, item) => itemBox.append(makeField('Begriff', item.text, value => { item.text = value; })), () => ({ id: id(), text: '' }));
        box.append(itemHost);
      }, () => ({ id: id(), name: '', items: [] }));
    }
  }

  function edit(game) {
    activeCleanup();
    activeCleanup = () => {};
    editorGame = game;
    container.replaceChildren();
    const title = makeElement('h1', game.title || 'Neues Spiel');
    const form = makeElement('section');
    form.className = 'panel editor';
    const grid = makeElement('div');
    grid.className = 'editor-grid';
    grid.append(
      makeField('Titel', game.title, value => { game.title = value; title.textContent = value || 'Neues Spiel'; }),
      makeField('Beschreibung', game.description, value => { game.description = value; }, true)
    );
    const subject = makeElement('label');
    subject.className = 'field';
    subject.append(makeElement('span', 'Fach'));
    const subjectSelect = makeElement('select');
    SUBJECTS.forEach(value => { const option = makeElement('option', value); option.value = value; option.selected = game.subject === value; subjectSelect.append(option); });
    subjectSelect.addEventListener('change', () => { game.subject = subjectSelect.value; });
    subject.append(subjectSelect);
    grid.append(subject, makeField('Klassenstufe', game.grade, value => { game.grade = value; }));
    form.append(grid);
    editorContentHost = makeElement('div');
    renderEditorContent();
    let status = makeStatus('');
    const setStatus = (text, kind = '') => { status = replaceStatus(status, text, kind); };
    const actions = makeElement('div');
    actions.className = 'actions';
    actions.append(
      makeButton('Validieren', () => {
        const errors = validateGame(game);
        setStatus(errors.length ? errors.join(' ') : 'Inhalt ist gültig.', errors.length ? 'error' : 'success');
      }),
      makeButton('Lokal speichern', () => {
        const errors = validateGame(game);
        if (errors.length) { setStatus(errors.join(' '), 'error'); return; }
        if (!store) { setStatus('Lokaler Speicher ist nicht verfügbar. Nicht gespeichert.', 'error'); return; }
        try { game.updatedAt = new Date().toISOString(); store.save(game); renderHome(); } catch (error) { setStatus(`Nicht gespeichert: ${error.message}`, 'error'); }
      }),
      makeButton('JSON exportieren', () => {
        const errors = validateGame(game);
        if (errors.length) setStatus(errors.join(' '), 'error'); else download(game);
      }),
      makeButton('Vorschau', () => {
        const errors = validateGame(game);
        if (errors.length) setStatus(errors.join(' '), 'error'); else play(structuredClone(game), true);
      })
    );
    container.append(makeButton('← Meine Spiele', renderHome), title, makeElement('p', 'Änderungen werden erst mit „Lokal speichern“ gesichert.'), form, editorContentHost, actions, status);
  }

  function play(game, preview = false) {
    activeCleanup();
    const cleanup = [];
    activeCleanup = () => cleanup.splice(0).forEach(fn => fn());
    container.replaceChildren();
    const top = makeElement('div');
    top.className = 'play-top';
    top.append(makeButton('← Zurück', () => preview ? edit(game) : renderHome()), makeElement('p', `${LABELS[game.type]} · ${game.subject} · Klasse ${game.grade}`), makeElement('h1', game.title));
    const panel = makeElement('section');
    panel.className = 'panel play-panel';
    container.append(top, panel);
    if (game.type === 'tug') playTug(game, panel);
    if (game.type === 'wheel') playWheelGame(game, panel);
    if (game.type === 'jeopardy') playJeopardy(game, panel);
    if (game.type === 'memory') playMemory(game, panel, cleanup);
    if (game.type === 'matching') playMatching(game, panel);
  }

  function answerReveal(host, question) {
    host.replaceChildren();
    const answer = makeElement('p');
    answer.className = 'answer';
    answer.hidden = true;
    answer.textContent = `Antwort für die Lehrkraft: ${question.answer}`;
    const reveal = makeButton('Antwort einblenden', () => { answer.hidden = !answer.hidden; reveal.textContent = answer.hidden ? 'Antwort einblenden' : 'Antwort ausblenden'; });
    host.append(reveal, answer);
  }

  function playTug(game, panel) {
    let blue = 0;
    let red = 0;
    const indexes = [0, 0];
    let finished = false;
    const feedback = makeElement('p'); feedback.className = 'status';
    const score = makeElement('p');
    const rope = makeElement('div'); rope.className = 'rope';
    const stage = makeElement('div'); stage.className = 'tug-stage';
    const createFigure = (team, variant) => {
      const figure = makeElement('div'); figure.className = `tug-figure ${team}-figure figure-${variant}`; figure.setAttribute('aria-hidden', 'true');
      const head = makeElement('span'); head.className = 'figure-head';
      const body = makeElement('span'); body.className = 'figure-body';
      const arm = makeElement('span'); arm.className = 'figure-arm';
      const legs = makeElement('span'); legs.className = 'figure-legs';
      figure.append(head, body, arm, legs);
      return figure;
    };
    const blueFigures = makeElement('div'); blueFigures.className = 'tug-figures blue-figures';
    const redFigures = makeElement('div'); redFigures.className = 'tug-figures red-figures';
    blueFigures.append(createFigure('blue', 'one'), createFigure('blue', 'two'));
    redFigures.append(createFigure('red', 'one'), createFigure('red', 'two'));
    stage.append(blueFigures, rope, redFigures);
    const teamGrid = makeElement('div'); teamGrid.className = 'team-grid tug-teams';
    const tugLayout = makeElement('div'); tugLayout.className = 'tug-layout';
    const teams = [
      { name: 'Team Blau', color: 'blue', add: () => { blue += 1; } },
      { name: 'Team Rot', color: 'red', add: () => { red += 1; } }
    ];
    const normalizeAnswer = value => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('de-DE');
    const answerFields = teams.map((team, teamIndex) => {
      const wrapper = makeElement('div'); wrapper.className = `tug-answer ${team.color}-answer`;
      const prompt = makeElement('p'); prompt.className = 'question tug-team-question';
      const progress = makeElement('progress'); progress.max = game.content.questions.length; progress.setAttribute('aria-label', `${team.name} Fortschritt`);
      const label = makeElement('label'); label.className = 'field';
      const input = makeElement('input'); input.type = 'text'; input.autocomplete = 'off'; input.inputMode = 'text';
      const answerId = `tug-answer-${team.color}`; input.id = answerId; label.htmlFor = answerId;
      label.append(makeElement('span', `${team.name} Antwort`), input); wrapper.append(prompt, progress, label);
      const button = makeButton(`${team.name} antworten`, () => {
        if (finished || indexes[teamIndex] >= game.content.questions.length) return;
        const value = normalizeAnswer(input.value);
        if (!value) { feedback.textContent = `${team.name}: Bitte gib eine Antwort ein.`; feedback.className = 'status error'; input.focus?.(); return; }
        const question = game.content.questions[indexes[teamIndex]];
        const correct = value === normalizeAnswer(question.answer);
        if (correct) team.add();
        indexes[teamIndex] += 1;
        input.value = '';
        feedback.textContent = correct ? `${team.name} hat richtig geantwortet.` : `${team.name}: Falsch – die nächste Frage ist bereit.`;
        feedback.className = correct ? 'status success' : 'status error';
        update();
      }, 'team');
      input.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault?.(); button.click(); } });
      wrapper.append(button); teamGrid.append(wrapper);
      return { prompt, progress, input, button };
    });
    const update = () => {
      finished = indexes.every(index => index >= game.content.questions.length);
      answerFields.forEach(({ prompt, progress, input, button }, teamIndex) => {
        const question = game.content.questions[indexes[teamIndex]];
        prompt.textContent = question ? question.prompt : 'Alle Fragen beantwortet.';
        progress.value = indexes[teamIndex];
        input.disabled = !question || finished; button.disabled = !question || finished;
      });
      if (finished) feedback.textContent = blue === red ? 'Unentschieden!' : blue > red ? 'Team Blau gewinnt!' : 'Team Rot gewinnt!';
      score.textContent = `Team Blau: ${blue} · Team Rot: ${red}`;
      rope.style.setProperty('--rope-position', `${50 + (red - blue) * 12}%`);
      if (blue > red) stage.classList.add('blue-pull'); else stage.classList.remove('blue-pull');
      if (red > blue) stage.classList.add('red-pull'); else stage.classList.remove('red-pull');
    };
    tugLayout.append(teamGrid, stage);
    panel.append(makeElement('p', 'Beide Teams erhalten eigene Fragen und bewegen sich unabhängig durch den Fragenpool. Leerzeichen und Groß-/Kleinschreibung werden bei der Prüfung nicht berücksichtigt; falsche Antworten zählen nicht und geben die nächste Frage frei.'), tugLayout, feedback, score);
    update();
  }

  function playWheelGame(game, panel) {
    let used = [];
    let current = null;
    const wheel = makeElement('div', 'GLÜCKSRAD'); wheel.className = 'wheel-face';
    const prompt = makeElement('p'); prompt.className = 'question';
    const state = makeElement('p');
    const answerHost = makeElement('div');
    const next = makeButton('Glücksrad drehen', () => {
      if (next.disabled) return;
      const result = playWheel(game, used);
      used = result.used;
      current = result.question;
      if (!current) { state.textContent = 'Alle Fragen wurden gezogen. Das Glücksrad ist beendet.'; next.disabled = true; prompt.textContent = ''; return; }
      wheel.classList.remove('spinning');
      void wheel.offsetWidth;
      wheel.classList.add('spinning');
      prompt.textContent = current.prompt;
      state.textContent = `${used.length} von ${game.content.questions.length} Fragen gezogen.`;
      answerReveal(answerHost, current);
    });
    panel.append(makeElement('p', 'Drehe das Glücksrad. Jede Frage erscheint höchstens einmal; die Lehrkraft entscheidet über die Antwort.'), wheel, next, prompt, answerHost, state);
  }

  function playJeopardy(game, panel) {
    let score = 0;
    let currentAnswer = null;
    const scoreText = makeElement('p', 'Punktestand: 0');
    const question = makeElement('p'); question.className = 'question';
    const answer = makeElement('p'); answer.className = 'answer'; answer.hidden = true;
    const award = makeElement('div'); award.className = 'actions'; award.hidden = true;
    const showAnswer = makeButton('Antwort einblenden', () => { answer.hidden = !answer.hidden; showAnswer.textContent = answer.hidden ? 'Antwort einblenden' : 'Antwort ausblenden'; });
    const grid = makeElement('div'); grid.className = 'category-grid';
    const finishQuestion = points => { if (!currentAnswer) return; score += points; scoreText.textContent = `Punktestand: ${score}`; currentAnswer = null; award.hidden = true; answer.hidden = true; showAnswer.disabled = true; };
    game.content.categories.forEach(category => {
      const box = makeElement('div'); box.className = 'category'; box.append(makeElement('strong', category.name));
      category.questions.forEach(item => {
        const tile = makeButton(`${item.points} Punkte`, () => {
          if (currentAnswer) return;
          currentAnswer = item; tile.disabled = true; tile.classList.add('used'); question.textContent = item.prompt; answer.textContent = `Antwort: ${item.answer}`; answer.hidden = true; showAnswer.disabled = false; award.hidden = false;
        });
        box.append(tile);
      });
      grid.append(box);
    });
    award.append(makeButton('Punkt vergeben', () => finishQuestion(currentAnswer?.points || 0)), makeButton('Kein Punkt', () => finishQuestion(0)));
    panel.append(makeElement('p', 'Wählt eine Kategorie und Punktzahl. Jede Frage wird nach der Auswahl deaktiviert.'), scoreText, question, showAnswer, answer, award, grid);
  }

  function playMemory(game, panel, cleanup) {
    const cards = shuffle(game.content.pairs.flatMap(pair => [{ pairId: pair.id, cardId: `${pair.id}-first`, text: pair.first }, { pairId: pair.id, cardId: `${pair.id}-second`, text: pair.second }]));
    const open = [];
    const openData = [];
    let locked = false;
    let matches = 0;
    let timeout;
    const status = makeElement('p');
    const grid = makeElement('div'); grid.className = 'memory-grid';
    const resetOpen = () => { open.splice(0).forEach(card => { card.textContent = 'Aufdecken'; card.classList.remove('revealed'); }); openData.splice(0); locked = false; };
    cleanup.push(() => { if (timeout) clearTimeout(timeout); });
    cards.forEach(cardData => {
      const card = makeButton('Aufdecken');
      card.className = 'memory-card';
      card.addEventListener('click', () => {
        if (locked || card.disabled || open.includes(card)) return;
        card.textContent = cardData.text; card.classList.add('revealed'); open.push(card); openData.push(cardData);
        if (open.length < 2) { status.textContent = 'Noch eine Karte auswählen.'; return; }
        locked = true;
        const result = matchMemory(game, openData[0], openData[1]);
        if (result.matched) {
          open.forEach(item => { item.disabled = true; }); matches += 1; status.textContent = `${matches} von ${game.content.pairs.length} Paaren gefunden.`; open.splice(0); openData.splice(0);
          locked = false;
          if (matches === game.content.pairs.length) status.textContent = 'Memory geschafft! Alle Paare gefunden.';
        } else {
          status.textContent = 'Kein Paar – die Karten werden wieder verdeckt.';
          timeout = setTimeout(resetOpen, 700);
        }
      });
      card.dataset.pairId = cardData.pairId;
      grid.append(card);
    });
    panel.append(makeElement('p', 'Deckt zwei verschiedene Karten auf. Ein Paar wird nach einem Treffer aus dem Spiel genommen.'), grid, status);
  }

  function playMatching(game, panel) {
    const solved = new Set();
    let selected = null;
    const feedback = makeElement('p');
    const items = makeElement('div'); items.className = 'choice-grid';
    const groups = makeElement('div'); groups.className = 'choice-grid';
    const itemButtons = new Map();
    game.content.groups.flatMap(group => group.items).forEach(item => {
      const button = makeButton(item.text, () => { if (solved.has(item.id)) return; selected = item; itemButtons.forEach(node => node.classList.remove('selected')); button.classList.add('selected'); feedback.textContent = `„${item.text}“ ausgewählt. Jetzt eine Gruppe wählen.`; });
      itemButtons.set(item.id, button); items.append(button);
    });
    game.content.groups.forEach(group => groups.append(makeButton(group.name, () => {
      if (!selected) { feedback.textContent = 'Wähle zuerst einen Begriff.'; return; }
      const result = classifyItem(game, selected.id, group.id);
      if (result.correct) { solved.add(selected.id); itemButtons.get(selected.id).disabled = true; feedback.textContent = `Richtig: „${selected.text}“ gehört zu „${group.name}“.`; }
      else feedback.textContent = `Noch einmal: „${selected.text}“ gehört nicht zu „${group.name}“.`;
      itemButtons.forEach(node => node.classList.remove('selected')); selected = null;
      if (solved.size === itemButtons.size) feedback.textContent = 'Zuordnen geschafft! Alle Begriffe sind richtig sortiert.';
    })));
    panel.append(makeElement('p', 'Wähle einen Begriff und danach die passende Gruppe. Jede richtige Zuordnung zählt nur einmal.'), makeElement('h2', 'Begriffe'), items, makeElement('h2', 'Gruppen'), groups, feedback);
  }

  renderHome();
  return { home: renderHome, edit, play, importText };
}

if (typeof document !== 'undefined' && document.querySelector('#app')) {
  const app = document.querySelector('#app');
  let browserStorage = null;
  try { browserStorage = globalThis.localStorage; } catch {}
  mountSpiele(app, browserStorage);
  document.querySelector('#fullscreen')?.addEventListener('click', () => document.documentElement.requestFullscreen?.());
}
