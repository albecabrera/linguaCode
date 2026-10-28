export const PRESENTATION_STORAGE_KEY = 'linguacode:ki-wp8:presentation:v1';

function readPreference(storage) {
  try { return storage?.getItem(PRESENTATION_STORAGE_KEY) === 'on'; } catch { return false; }
}

function writePreference(storage, enabled) {
  try { storage?.setItem(PRESENTATION_STORAGE_KEY, enabled ? 'on' : 'off'); } catch { /* local preference is optional */ }
}

function enterFullscreen(documentLike) {
  const requestFullscreen = documentLike?.documentElement?.requestFullscreen;
  if (typeof requestFullscreen !== 'function') return;
  try {
    const result = requestFullscreen.call(documentLike.documentElement);
    result?.catch?.(() => {});
  } catch { /* fullscreen is optional and browser-controlled */ }
}

function exitFullscreen(documentLike) {
  if (!documentLike?.fullscreenElement || typeof documentLike.exitFullscreen !== 'function') return;
  try {
    const result = documentLike.exitFullscreen.call(documentLike);
    result?.catch?.(() => {});
  } catch { /* fullscreen is optional and browser-controlled */ }
}

export function createPresentationController({documentLike = globalThis.document, storage} = {}) {
  let enabled = readPreference(storage);

  const sync = () => {
    const root = documentLike?.documentElement ?? documentLike;
    if (root) {
      root.dataset ??= {};
      root.dataset.presentation = String(enabled);
    }
    const toggle = documentLike?.querySelector('[data-presentation-toggle]');
    if (!toggle) return;
    const label = enabled ? 'Smartboard-Modus beenden' : 'Smartboard-Modus aktivieren';
    const setAttribute = (name, value) => {
      if (typeof toggle.setAttribute === 'function') toggle.setAttribute(name, value);
      else { toggle.attrs ??= {}; toggle.attrs[name] = value; }
    };
    setAttribute('aria-pressed', String(enabled));
    setAttribute('aria-label', label);
    setAttribute('title', label);
    toggle.textContent = label;
  };

  const setEnabled = (nextEnabled) => {
    enabled = Boolean(nextEnabled);
    writePreference(storage, enabled);
    sync();
    return enabled;
  };

  return {
    bind() {
      sync();
      const toggle = documentLike?.querySelector('[data-presentation-toggle]');
      if (toggle) toggle.addEventListener('click', () => {
        const nextEnabled = setEnabled(!enabled);
        if (nextEnabled) enterFullscreen(documentLike);
        else exitFullscreen(documentLike);
      });
      return this;
    },
    sync,
    setEnabled,
    isEnabled: () => enabled,
  };
}
