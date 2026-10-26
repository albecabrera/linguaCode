export const PROGRESS_NAMESPACE = 'linguacode:ki-wp8:mission-01:v1';

const CURRENT_VERSION = 1;
const SUCCESS = 'success';
const UNAVAILABLE = 'unavailable';

function unavailable(reason) {
  return {status: UNAVAILABLE, reason};
}

function isPlainValue(value, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object' || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((item) => isPlainValue(item, seen));
  if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return false;
  for (const property of Object.keys(value)) {
    if (property === '__proto__' || property === 'prototype' || property === 'constructor') return false;
    if (!isPlainValue(value[property], seen)) return false;
  }
  return true;
}

function storageKey(key) {
  return `${PROGRESS_NAMESPACE}:${key}`;
}

export function createProgressStore(storage, key) {
  if (typeof key !== 'string' || key.length === 0) {
    throw new TypeError('Progress key must be a non-empty string.');
  }

  const targetKey = storageKey(key);
  let futureVersionDetected = false;

  function load() {
    if (!storage || typeof storage.getItem !== 'function') return unavailable('storage-error');
    let raw;
    try {
      raw = storage.getItem(targetKey);
    } catch {
      return unavailable('storage-error');
    }
    if (raw === null) return {status: SUCCESS, state: null};

    let envelope;
    try {
      envelope = JSON.parse(raw);
    } catch {
      return unavailable('malformed-data');
    }
    if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
      return unavailable('malformed-data');
    }
    if (envelope.version > CURRENT_VERSION) {
      futureVersionDetected = true;
      return unavailable('future-version');
    }
    if (envelope.version !== CURRENT_VERSION || !isPlainValue(envelope.state)) {
      return unavailable('malformed-data');
    }
    return {status: SUCCESS, state: envelope.state};
  }

  function save(state) {
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
      return unavailable('storage-error');
    }
    let raw;
    try {
      raw = storage.getItem(targetKey);
    } catch {
      return unavailable('storage-error');
    }
    if (futureVersionDetected || raw !== null) {
      let envelope;
      try {
        envelope = raw === null ? null : JSON.parse(raw);
      } catch {
        envelope = null;
      }
      if (envelope && typeof envelope === 'object' && !Array.isArray(envelope) && envelope.version > CURRENT_VERSION) {
        futureVersionDetected = true;
        return unavailable('future-version');
      }
    }
    if (!isPlainValue(state)) return unavailable('unsafe-state');
    try {
      storage.setItem(targetKey, JSON.stringify({version: CURRENT_VERSION, state}));
      return {status: SUCCESS};
    } catch {
      return unavailable('storage-error');
    }
  }

  function reset() {
    if (!storage || typeof storage.removeItem !== 'function') return unavailable('storage-error');
    try {
      storage.removeItem(targetKey);
      futureVersionDetected = false;
      return {status: SUCCESS};
    } catch {
      return unavailable('storage-error');
    }
  }

  return {load, save, reset};
}
