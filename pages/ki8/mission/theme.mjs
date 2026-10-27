export const THEME_STORAGE_KEY = 'linguacode-ki-theme';
const THEMES = new Set(['light', 'dark']);

function browserStorage() {
  try { return globalThis.localStorage; } catch { return null; }
}

function systemTheme(matchMedia) {
  try { return matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  catch { return 'light'; }
}

function storedTheme(storage) {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY);
    return THEMES.has(value) ? value : null;
  } catch {
    return null;
  }
}

export function createThemeController({documentLike = globalThis.document, storage, matchMedia = globalThis.matchMedia} = {}) {
  const root = documentLike?.documentElement;
  const preferenceStorage = storage === undefined && documentLike ? browserStorage() : storage;
  let explicitPreference = storedTheme(preferenceStorage);
  let theme = explicitPreference ?? systemTheme(matchMedia);
  const mediaQuery = (() => {
    try { return matchMedia?.('(prefers-color-scheme: dark)'); } catch { return null; }
  })();

  const syncButtons = () => {
    for (const button of documentLike?.querySelectorAll?.('[data-theme-toggle]') ?? []) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  };
  const apply = (nextTheme, persist) => {
    if (!THEMES.has(nextTheme)) return false;
    theme = nextTheme;
    root?.setAttribute('data-theme', theme);
    if (persist) {
      explicitPreference = theme;
      try { preferenceStorage?.setItem(THEME_STORAGE_KEY, theme); } catch { /* The current page still uses the selected theme. */ }
    }
    syncButtons();
    return true;
  };
  const onClick = (event) => {
    if (!event.target?.closest?.('[data-theme-toggle]')) return;
    apply(theme === 'dark' ? 'light' : 'dark', true);
  };
  const onSystemChange = (event) => {
    if (explicitPreference === null) apply(event.matches ? 'dark' : 'light', false);
  };

  root?.setAttribute('data-theme', theme);
  documentLike?.addEventListener?.('click', onClick);
  mediaQuery?.addEventListener?.('change', onSystemChange);
  syncButtons();

  return {
    getTheme: () => theme,
    setTheme: (nextTheme) => apply(nextTheme, true),
    toggle: () => apply(theme === 'dark' ? 'light' : 'dark', true),
    dispose() {
      documentLike?.removeEventListener?.('click', onClick);
      mediaQuery?.removeEventListener?.('change', onSystemChange);
    },
  };
}
