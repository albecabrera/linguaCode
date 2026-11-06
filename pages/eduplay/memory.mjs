import { isSafeMemoryImage } from './model.mjs';

export function resolveMemoryImage(value, baseURI = document.baseURI) {
  if (!isSafeMemoryImage(value)) return null;
  if (value.startsWith('data:')) return value;
  try {
    const url = new URL(value, baseURI);
    return url.origin === new URL(baseURI).origin ? url.href : null;
  } catch { return null; }
}
export function isMatch(first, second) {
  return !!first && !!second && first.cardId !== second.cardId && first.pairId === second.pairId;
}
export function selectPairs(pairs, pairCount) {
  return Number.isInteger(pairCount) && pairCount > 0 ? pairs.slice(0, pairCount) : pairs;
}
export function getHideDelay(settings = {}) {
  return ({easy: 1400, medium: 900, hard: 500}[settings.difficulty] || 900);
}
export function makeCards(pairs, shuffle = true) {
  const cards = pairs.flatMap(pair => [
    {cardId:`${pair.id}:first`, pairId:pair.id, value:pair.first},
    {cardId:`${pair.id}:second`, pairId:pair.id, value:pair.second},
  ]);
  if (shuffle) for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
export function mountMemory(container, activity) {
  let timer = null, hideTimer = null, elapsed = 0, attempts = 0, matches = 0, open = [], locked = false;
  let cards;
  function cleanup() { clearInterval(timer); clearTimeout(hideTimer); timer = hideTimer = null; }
  function start() {
    cleanup(); elapsed = attempts = matches = 0; open = []; locked = false;
    const pairs = selectPairs(activity.content.pairs, activity.settings.pairCount);
    cards = makeCards(pairs, activity.settings.shuffleCards !== false);
    container.replaceChildren();
    const status = document.createElement('p'); status.setAttribute('aria-live','polite');
    const feedback = document.createElement('p'); feedback.className = 'memory-feedback'; feedback.setAttribute('role','status'); feedback.setAttribute('aria-live','polite'); feedback.setAttribute('aria-atomic','true');
    const grid = document.createElement('div'); grid.className = 'memory-grid';
    const result = document.createElement('section'); result.className = 'result'; result.setAttribute('aria-live','polite');
    container.append(status, feedback, grid, result);
    const update = () => { status.textContent = `Treffer: ${matches} / ${pairs.length} · Versuche: ${attempts}${activity.settings.timerEnabled ? ` · Zeit: ${elapsed} s` : ''}`; };
    const buttons = cards.map(card => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'memory-card'; button.textContent = '?'; button.setAttribute('aria-label','Verdeckte Karte aufdecken');
      button.addEventListener('click', () => {
        if (locked || card.matched || open.includes(card)) return;
        button.classList.add('memory-card--revealed');
        button.replaceChildren();
        const value = typeof card.value === 'string' ? {text:card.value} : card.value;
        if (value.image) {
          const source = resolveMemoryImage(value.image);
          if (source) {
            const image = document.createElement('img'); image.referrerPolicy = 'no-referrer'; image.src = source; image.alt = value.text || 'Bildkarte'; button.append(image);
          }
        }
        if (value.text) button.append(document.createTextNode(value.text));
        button.setAttribute('aria-label', value.text || 'Aufgedeckte Bildkarte'); open.push(card);
        if (open.length !== 2) { feedback.textContent = 'Karte aufgedeckt.'; return; }
        attempts++; locked = true;
        if (isMatch(...open)) {
          open.forEach(item => { item.matched = true; buttons[cards.indexOf(item)].classList.add('correct'); });
          matches++; feedback.textContent = '✓ Paar gefunden!'; open = []; locked = false; update();
          if (matches === pairs.length) {
            cleanup();
            const percentage = Math.round(matches / pairs.length * 100);
            const heading = document.createElement('h2'); heading.textContent = 'Geschafft!';
            const points = document.createElement('p'); points.textContent = `Punkte: ${matches} / ${pairs.length}`;
            const percent = document.createElement('p'); percent.textContent = `${percentage} %`;
            const tries = document.createElement('p'); tries.textContent = `Versuche: ${attempts}`;
            const restart = document.createElement('button'); restart.type = 'button'; restart.textContent = 'Noch einmal spielen'; restart.addEventListener('click',start);
            result.append(heading, points, percent, tries, restart);
          }
        } else {
          feedback.textContent = '✗ Noch nicht. Versuch es weiter.'; update(); open.forEach(item => buttons[cards.indexOf(item)].classList.add('incorrect'));
          hideTimer = setTimeout(() => { open.forEach(item => { const b = buttons[cards.indexOf(item)]; b.classList.remove('incorrect','memory-card--revealed'); b.textContent = '?'; b.setAttribute('aria-label','Verdeckte Karte aufdecken'); }); open = []; locked = false; }, getHideDelay(activity.settings));
        }
      });
      grid.append(button); return button;
    });
    update();
    if (activity.settings.timerEnabled) timer = setInterval(() => { elapsed++; update(); },1000);
  }
  start(); return cleanup;
}
