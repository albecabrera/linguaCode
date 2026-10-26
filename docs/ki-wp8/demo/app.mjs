import {learners, summary, addFeedback} from './model.mjs';

// In-memory copies only. Refreshing discards demo feedback.
const records = learners.map((item) => ({...item}));
let selected = null;
const $ = (id) => document.getElementById(id);
const cell = (row, value) => {
  const element = document.createElement('td');
  element.textContent = String(value);
  row.append(element);
  return element;
};

function render() {
  const totals = summary(records);
  $('summary').textContent = `${records.length} erfundene Profile · ${totals.completed} von ${totals.possible} Musterkarten abgeschlossen · ${totals.open} offen · ${totals.feedback} Rückmeldung(en)`;
  const body = $('learners');
  body.replaceChildren();
  for (const item of records) {
    const row = document.createElement('tr');
    cell(row, item.code);
    cell(row, item.current);
    const progressCell = cell(row, `${Math.round(100 * item.completed / item.total)} %`);
    const progress = document.createElement('progress');
    progress.value = item.completed;
    progress.max = item.total;
    progress.setAttribute('aria-label', `${item.code}: ${item.completed} von ${item.total} Musterkarten`);
    progressCell.append(progress);
    cell(row, item.total - item.completed);
    cell(row, item.feedback ? 'Beispiel vorhanden' : '–');
    const action = cell(row, '');
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.code = item.code;
    button.textContent = `${item.code} ansehen`;
    action.append(button);
    body.append(row);
  }
}

function showDetail() {
  const record = records.find((item) => item.code === selected);
  if (!record) return;
  $('detail').hidden = false;
  $('detail-title').textContent = `Musteransicht · ${record.code}`;
  $('detail-progress').textContent = `${record.completed} von ${record.total} Musterkarten abgeschlossen; aktuelles Modul: ${record.current}.`;
  $('detail-answer').textContent = record.answer;
  $('detail-feedback').textContent = record.feedback || 'Noch keine Rückmeldung im Beispiel.';
  $('feedback-input').value = '';
  $('feedback-status').textContent = '';
}

$('learners').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-code]');
  if (!button || !records.some((item) => item.code === button.dataset.code)) return;
  selected = button.dataset.code;
  showDetail();
  $('detail-title').focus();
});
$('feedback-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const index = records.findIndex((item) => item.code === selected);
  if (index < 0) return;
  try {
    records[index] = addFeedback(records[index], $('feedback-input').value);
    render();
    showDetail();
    $('feedback-status').textContent = 'Nur in dieser Demo sichtbar; nach dem Neuladen gelöscht.';
  } catch (error) {
    $('feedback-status').textContent = error.message;
  }
});
render();
