import assert from 'node:assert/strict';
import {createProgressStore, PROGRESS_NAMESPACE, progressKeyForLesson} from '../pages/ki8/mission/progress.mjs';

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
  keys() { return [...this.#values.keys()]; }
}

const storage = new MemoryStorage();
assert.equal(progressKeyForLesson('ki-01'), 'ki-01');
assert.equal(progressKeyForLesson('ki-02'), 'ki-02');
assert.equal(progressKeyForLesson('ki-03'), 'ki-03');
const mission01Store = createProgressStore(storage, progressKeyForLesson('ki-01'));
const mission02Store = createProgressStore(storage, progressKeyForLesson('ki-02'));
const mission03Store = createProgressStore(storage, progressKeyForLesson('ki-03'));
assert.deepEqual(mission01Store.save({phase: 1}), {status: 'success'});
assert.deepEqual(mission02Store.load(), {status: 'success', state: null});
assert.deepEqual(mission02Store.save({phase: 2}), {status: 'success'});
assert.deepEqual(mission03Store.load(), {status: 'success', state: null});
assert.deepEqual(mission03Store.save({phase: 3}), {status: 'success'});
assert.deepEqual(mission01Store.load(), {status: 'success', state: {phase: 1}});
assert.deepEqual(mission02Store.load(), {status: 'success', state: {phase: 2}});
assert.deepEqual(mission03Store.load(), {status: 'success', state: {phase: 3}});
assert.equal(storage.getItem(`${PROGRESS_NAMESPACE}:ki-01`), JSON.stringify({version: 1, state: {phase: 1}}));
assert.equal(storage.getItem(`${PROGRESS_NAMESPACE}:ki-02`), JSON.stringify({version: 1, state: {phase: 2}}));
assert.equal(storage.getItem(`${PROGRESS_NAMESPACE}:ki-03`), JSON.stringify({version: 1, state: {phase: 3}}));
assert.deepEqual(mission03Store.reset(), {status: 'success'});
assert.equal(storage.getItem(`${PROGRESS_NAMESPACE}:ki-03`), null);
assert.deepEqual(mission01Store.load(), {status: 'success', state: {phase: 1}});
assert.deepEqual(mission02Store.load(), {status: 'success', state: {phase: 2}});
const key = 'lesson-01';
const store = createProgressStore(storage, key);
const saved = {phase: 'quiz', answers: {first: 2}, completed: false, tags: ['local']};
assert.deepEqual(store.load(), {status: 'success', state: null});
assert.deepEqual(store.save(saved), {status: 'success'});
assert.deepEqual(store.load(), {status: 'success', state: saved});
assert.deepEqual(createProgressStore(storage, key).load(), {status: 'success', state: saved});

const unrelatedKey = 'unrelated';
storage.setItem(unrelatedKey, 'keep me');
assert.deepEqual(store.reset(), {status: 'success'});
assert.deepEqual(store.load(), {status: 'success', state: null});
assert.equal(storage.getItem(unrelatedKey), 'keep me');

const unavailable = {
  getItem() { throw new Error('blocked'); },
  setItem() { throw new Error('blocked'); },
  removeItem() { throw new Error('blocked'); },
};
const unavailableStore = createProgressStore(unavailable, key);
assert.deepEqual(unavailableStore.load(), {status: 'unavailable', reason: 'storage-error'});
assert.deepEqual(unavailableStore.save(saved), {status: 'unavailable', reason: 'storage-error'});
assert.deepEqual(unavailableStore.reset(), {status: 'unavailable', reason: 'storage-error'});

const corruptStorage = new MemoryStorage();
const corruptStore = createProgressStore(corruptStorage, key);
corruptStorage.setItem(`${PROGRESS_NAMESPACE}:${key}`, '{not-json');
assert.deepEqual(corruptStore.load(), {status: 'unavailable', reason: 'malformed-data'});
assert.deepEqual(corruptStore.save(saved), {status: 'success'});
assert.deepEqual(corruptStore.load(), {status: 'success', state: saved});

const futureStorage = new MemoryStorage();
const futureStore = createProgressStore(futureStorage, key);
const futureKey = `${PROGRESS_NAMESPACE}:${key}`;
const futureData = JSON.stringify({version: 99, state: {future: true}});
futureStorage.setItem(futureKey, futureData);
assert.deepEqual(futureStore.save(saved), {status: 'unavailable', reason: 'future-version'});
assert.equal(futureStorage.getItem(futureKey), futureData);
assert.deepEqual(futureStore.load(), {status: 'unavailable', reason: 'future-version'});
assert.deepEqual(futureStore.reset(), {status: 'success'});
assert.equal(futureStorage.getItem(futureKey), null);

const raceStorage = new MemoryStorage();
const raceStore = createProgressStore(raceStorage, key);
assert.deepEqual(raceStore.load(), {status: 'success', state: null});
raceStorage.setItem(futureKey, futureData);
assert.deepEqual(raceStore.save(saved), {status: 'unavailable', reason: 'future-version'});
assert.equal(raceStorage.getItem(futureKey), futureData);

const safeStorage = new MemoryStorage();
const safeStore = createProgressStore(safeStorage, 'safe');
const safeState = {__proto__: {polluted: true}, constructor: 'allowed?', nested: {prototype: 'plain'}};
assert.deepEqual(safeStore.save(safeState), {status: 'unavailable', reason: 'unsafe-state'});
assert.deepEqual(safeStore.load(), {status: 'success', state: null});
assert.equal({}.polluted, undefined);
assert.deepEqual(safeStore.save({answer: 7, enabled: true, note: null, list: ['x']}), {status: 'success'});

console.log('PASS: reload, unavailable/corrupt/future storage, reset isolation, typed plain values, and prototype-injection rejection.');
