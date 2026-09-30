/* Keyboard convention shared by all LinguaCode activities. */
(() => {
  const selectors = [
    '#next-button',
    '#next-task',
    '#challenge-next',
    '#duel-next',
    '#next-after-solution',
    '#finish-challenge',
    '#next',
    '[data-skip]'
  ];

  const isVisible = (button) => {
    if (!button || button.disabled || button.hidden) return false;
    const style = window.getComputedStyle(button);
    return style.display !== 'none' && style.visibility !== 'hidden' && button.getClientRects().length > 0;
  };

  const findNext = () => {
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (isVisible(button)) return button;
    }
    return [...document.querySelectorAll('button')].find((button) => {
      return isVisible(button) && /^(weiter|nächste|fertig|auswerten)/i.test(button.textContent.trim());
    });
  };

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.isComposing) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;

    const next = findNext();
    if (!next) return;
    if (target?.closest('a') || target?.closest('button') === next) return;

    event.preventDefault();
    next.click();
  });
})();
