import assert from 'node:assert/strict';
import {mountStudio, normalizePairCount, updatePairCountSetting, syncPairCountControl} from '../pages/eduplay/studio.mjs';

const activity = {settings:{pairCount:3},content:{pairs:[{}, {}, {}]}};
assert.equal(normalizePairCount('2', 3), 2);
assert.equal(normalizePairCount('', 3), undefined);
assert.equal(normalizePairCount('4', 3), undefined);
assert.equal(updatePairCountSetting(activity, ''), undefined);
assert.equal('pairCount' in activity.settings, false);
activity.settings.pairCount = 3;
assert.equal(updatePairCountSetting(activity, '9'), undefined);
assert.equal('pairCount' in activity.settings, false);
activity.settings.pairCount = 3;
activity.content.pairs.pop();
const input = {max:'', value:''};
syncPairCountControl(input, activity);
assert.equal(input.max, '2');
assert.equal(input.value, '2');
assert.equal('pairCount' in activity.settings, false);
activity.content.pairs.push({});
syncPairCountControl(input, activity);
assert.equal(input.max, '3');
assert.equal(input.value, '3');
class FakeElement {
  constructor(tag) { this.tagName = tag; this.children = []; this.listeners = {}; this.value = ''; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute() {}
  addEventListener(type, listener) { this.listeners[type] = listener; }
  click() { this.listeners.click?.(); }
}
globalThis.document = {createElement: tag => new FakeElement(tag)};
const findText = (node, text) => node.children.find(child => child.textContent === text) || node.children.flatMap(child => findText(child, text) ? [findText(child, text)] : [])[0];
const container = new FakeElement('main');
const editorActivity = {id:'memory-test',schemaVersion:1,type:'memory',title:'Memory',description:'Test',subject:'Spanisch',grade:'7',language:'de',createdAt:'2026-01-01T00:00:00Z',updatedAt:'2026-01-01T00:00:00Z',settings:{},content:{pairs:[{id:'p1',first:'uno',second:'eins'}]}};
mountStudio(container, {list: () => [editorActivity]}, () => {});
findText(container, 'Bearbeiten').click();
assert.doesNotThrow(() => findText(container, 'Hinzufügen').click());
assert.doesNotThrow(() => findText(container, 'Entfernen').click());
console.log('EduPlay studio checks passed');
