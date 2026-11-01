import {VERBS} from './core.mjs';

const modes = new Set(['home', 'study', 'game']);
export function createView(quest) {
  return {quest, mode: 'home', studyIndex: 0, hintLevel: 0};
}
export function switchMode(view, mode) {
  if (!modes.has(mode)) throw new Error('Unknown mode');
  view.mode = mode;
  return view;
}
export function moveStudy(view, step) {
  view.studyIndex = Math.max(0, Math.min(VERBS.length - 1, view.studyIndex + step));
  return view.studyIndex;
}
export function requestTip(view, item) {
  view.hintLevel = Math.min(2, view.hintLevel + 1);
  const form = item.past[0];
  return view.hintLevel === 1
    ? `Beginnt mit ${form[0]}.`
    : item.base === 'be'
      ? 'Zwei Formen: 3 und 4 Buchstaben, mit / dazwischen.'
      : `Die Form hat ${form.replace(/[^a-z]/gi, '').length} Buchstaben.`;
}
export function resetTip(view) { view.hintLevel = 0; }
