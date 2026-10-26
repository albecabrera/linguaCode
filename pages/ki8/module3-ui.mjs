import {lessons, gradeChoice} from './module3-core.mjs';

for (const [hourIndex, lesson] of lessons.entries()) {
  const container = document.getElementById(`activities-${hourIndex + 1}`);
  const progress = document.getElementById(`progress-${hourIndex + 1}`);
  const attempted = new Set();
  for (const activity of lesson.activities) {
    const form = document.createElement('form');
    form.className = 'activity';
    const group = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = activity.prompt;
    group.append(legend);
    for (const [index, text] of activity.options.entries()) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = activity.id; input.value = String(index); input.required = true;
      const caption = document.createElement('span'); caption.textContent = text;
      label.append(input, caption); group.append(label);
    }
    const button = document.createElement('button'); button.type = 'submit'; button.textContent = 'Antwort prüfen';
    const feedback = document.createElement('p'); feedback.className = 'answer-feedback'; feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite');
    form.append(group, button, feedback);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const selected = form.querySelector('input:checked');
      if (!selected) { feedback.textContent = 'Wähle zuerst eine Antwort.'; return; }
      const result = gradeChoice(activity.id, Number(selected.value));
      feedback.textContent = `${result.correct ? 'Richtig.' : 'Noch nicht.'} ${result.explanation}`;
      attempted.add(activity.id);
      progress.textContent = `${attempted.size} von ${lesson.activities.length} Aufgaben geprüft – nur für diese geöffnete Seite.`;
    });
    container.append(form);
  }
}
