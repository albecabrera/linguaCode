import {generateCrossword, normalizeWord} from './crossword.mjs';

export function mountCrossword(container, activity) {
  const puzzle = generateCrossword(activity.content.words);
  let direction = 'across';
  const label = () => direction === 'across' ? 'waagerecht' : 'senkrecht';
  const move = (x, y, dx, dy, inputs) => inputs.get(`${x + dx},${y + dy}`)?.focus();
  const node = (tag, text) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    return element;
  };

  function render() {
    container.replaceChildren();
    if (puzzle.unplaced.length) {
      const error = node('p', `Nicht platzierbar: ${puzzle.unplaced.map(word => word.word).join(', ')}. Bitte bearbeite das Rätsel im Studio.`);
      error.setAttribute('role', 'alert');
      container.append(error);
      return;
    }
    const instructions = node('p', 'Wähle ein Feld und fülle das Rätsel aus. Umlaute werden als AE, OE und UE geschrieben; ß als SS.');
    const toggle = node('button', `Richtung: ${label()}`);
    toggle.type = 'button';
    const setDirection = value => { direction = value; toggle.textContent = `Richtung: ${label()}`; };
    toggle.addEventListener('click', () => setDirection(direction === 'across' ? 'down' : 'across'));

    const wrap = node('div');
    wrap.className = 'crossword-scroll';
    const grid = node('div');
    grid.className = 'crossword-grid';
    grid.style.gridTemplateColumns = `repeat(${puzzle.width}, minmax(2.3rem, 1fr))`;
    const inputs = new Map();
    const cells = new Map(puzzle.cells.map(cell => [`${cell.x},${cell.y}`, cell]));
    let selected = null;
    let clickedInput = null;
    const progress = node('p');
    progress.setAttribute('aria-live', 'polite');
    const updateProgress = () => {
      const filled = [...inputs.values()].filter(input => input.value).length;
      progress.textContent = `${filled} von ${puzzle.cells.length} Feldern ausgefüllt.`;
    };
    const focusCell = (x, y) => inputs.get(`${x},${y}`)?.focus();

    for (let y = 0; y < puzzle.height; y++) for (let x = 0; x < puzzle.width; x++) {
      const cell = cells.get(`${x},${y}`);
      const square = node('div');
      square.className = cell ? 'crossword-cell' : 'crossword-empty';
      if (cell) {
        if (cell.number) {
          const number = node('span', String(cell.number));
          number.className = 'crossword-number';
          square.append(number);
        }
        const input = node('input');
        input.type = 'text';
        input.maxLength = 1;
        input.inputMode = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-label', `Zeile ${y + 1}, Spalte ${x + 1}${cell.number ? `, Start ${cell.number}` : ''}`);
        input.addEventListener('focus', () => { selected = {input, x, y}; });
        input.addEventListener('click', () => {
          if (clickedInput === input && cell.entries.length > 1) setDirection(direction === 'across' ? 'down' : 'across');
          clickedInput = input;
          selected = {input, x, y};
        });
        input.addEventListener('input', () => {
          input.value = normalizeWord(input.value).slice(0, 1);
          input.classList.remove('correct', 'incorrect');
          updateProgress();
          if (input.value) move(x, y, direction === 'across' ? 1 : 0, direction === 'down' ? 1 : 0, inputs);
        });
        input.addEventListener('keydown', event => {
          const moves = {ArrowLeft: [-1, 0, 'across'], ArrowRight: [1, 0, 'across'], ArrowUp: [0, -1, 'down'], ArrowDown: [0, 1, 'down']};
          if (moves[event.key]) {
            event.preventDefault();
            const [dx, dy, nextDirection] = moves[event.key];
            setDirection(nextDirection);
            move(x, y, dx, dy, inputs);
          } else if (event.key === 'Backspace' && !input.value) {
            move(x, y, direction === 'across' ? -1 : 0, direction === 'down' ? -1 : 0, inputs);
          }
        });
        square.append(input);
        inputs.set(`${x},${y}`, input);
      }
      grid.append(square);
    }
    wrap.append(grid);

    const clues = node('div');
    clues.className = 'crossword-clues';
    for (const [currentDirection, title] of [['across', 'Waagerecht'], ['down', 'Senkrecht']]) {
      const section = node('section');
      const list = node('ol');
      section.append(node('h3', title));
      puzzle.placed.filter(word => word.direction === currentDirection).sort((a, b) => a.number - b.number).forEach(word => {
        const clue = node('li', `${word.number}. ${word.clue} (${word.answer.length})`);
        clue.tabIndex = 0;
        clue.addEventListener('click', () => { setDirection(currentDirection); focusCell(word.x, word.y); });
        clue.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setDirection(currentDirection); focusCell(word.x, word.y); } });
        list.append(clue);
      });
      section.append(list);
      clues.append(section);
    }

    const feedback = node('p');
    feedback.setAttribute('aria-live', 'polite');
    const keyboard = node('div');
    keyboard.className = 'crossword-keyboard';
    keyboard.setAttribute('aria-label', 'Bildschirmtastatur');
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      const key = node('button', letter);
      key.type = 'button';
      key.addEventListener('pointerdown', event => event.preventDefault());
      key.addEventListener('click', () => { if (selected) { selected.input.value = letter; selected.input.dispatchEvent(new Event('input', {bubbles: true})); } });
      keyboard.append(key);
    }
    const erase = node('button', 'Löschen');
    erase.type = 'button';
    erase.addEventListener('pointerdown', event => event.preventDefault());
    erase.addEventListener('click', () => { if (selected) { selected.input.value = ''; selected.input.dispatchEvent(new Event('input', {bubbles: true})); } });
    keyboard.append(erase);

    const check = node('button', 'Überprüfen');
    check.type = 'button';
    check.addEventListener('click', () => {
      let correct = 0;
      for (const cell of puzzle.cells) {
        const input = inputs.get(`${cell.x},${cell.y}`);
        const ok = input.value === cell.letter;
        input.classList.toggle('correct', ok);
        input.classList.toggle('incorrect', !ok && !!input.value);
        if (ok) correct++;
      }
      const solved = puzzle.placed.filter(word => [...word.answer].every((letter, index) => inputs.get(`${word.x + (word.direction === 'across' ? index : 0)},${word.y + (word.direction === 'down' ? index : 0)}`).value === letter)).length;
      feedback.textContent = correct === puzzle.cells.length ? `Geschafft! ${solved} von ${puzzle.placed.length} Wörtern richtig.` : `${correct} von ${puzzle.cells.length} Feldern und ${solved} von ${puzzle.placed.length} Wörtern richtig.`;
    });
    const correct = node('button', 'Fehler korrigieren');
    correct.type = 'button';
    correct.addEventListener('click', () => {
      let corrected = 0;
      for (const cell of puzzle.cells) {
        const input = inputs.get(`${cell.x},${cell.y}`);
        if (input.value && input.value !== cell.letter) {
          input.value = '';
          input.classList.remove('correct', 'incorrect');
          corrected++;
        }
      }
      updateProgress();
      feedback.textContent = corrected ? `${corrected} falsche Felder wurden geleert.` : 'Keine falschen Felder gefunden.';
    });
    const restart = node('button', 'Neu starten');
    restart.type = 'button';
    restart.addEventListener('click', render);
    container.append(instructions, toggle, wrap, clues, keyboard, check, correct, restart, progress, feedback);
    updateProgress();
  }
  render();
  return () => {};
}
