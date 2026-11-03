(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  let saved;
  try { saved = localStorage.getItem('linguacode-theme'); } catch { /* Storage can be blocked. */ }
  let theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function render() {
    const dark = theme === 'dark';
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
    button.textContent = dark ? '☀ Hell' : '☾ Dunkel';
  }
  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('linguacode-theme', theme); } catch { /* Theme still works for this visit. */ }
    render();
  });
  render();
})();
