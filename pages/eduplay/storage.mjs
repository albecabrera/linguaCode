import { validateActivity } from './model.mjs';
const KEY = 'linguacode.eduplay.drafts.v1';
// Storage is injected so a future authenticated backend can implement the same interface.
export function createDraftStore(storage) {
  function list() {
    const raw=storage.getItem(KEY);
    if(raw===null)return [];
    let values;
    try { values=JSON.parse(raw); } catch { throw new Error('Lokale Entwürfe konnten nicht gelesen werden.'); }
    if(!Array.isArray(values)||values.some(value=>validateActivity(value).length)) throw new Error('Lokale Entwürfe sind ungültig.');
    return values;
  }
  function save(activity) {
    const errors=validateActivity(activity);if(errors.length)throw new Error(errors.join(' '));
    const values=list(), index=values.findIndex(value=>value.id===activity.id);
    if(index<0)values.push(activity);else values[index]=activity;
    storage.setItem(KEY,JSON.stringify(values));
  }
  function remove(id) { storage.setItem(KEY,JSON.stringify(list().filter(value=>value.id!==id))); }
  return {list,save,remove};
}
