export function scoreAnswer(selected, correct) {
  return selected.length === correct.length && new Set(selected).size === selected.length && selected.every(id => correct.includes(id));
}

// The caller owns the container and calls the returned cleanup before navigating away.
export function mountQuiz(container, activity) {
  const create = (tag, content, className) => {
    const element = document.createElement(tag);
    if (content !== undefined) element.textContent = content;
    if (className) element.className = className;
    return element;
  };
  const questions = [...activity.content.questions];
  if (activity.settings.shuffleQuestions) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  let index = 0, correctCount = 0, timer = null;
  function clearTimer() { if (timer !== null) clearInterval(timer); timer = null; }
  function render() {
    clearTimer();
    container.replaceChildren();
    if (index === questions.length) {
      const result = create('section');
      result.append(create('h2','Geschafft!'), create('p', `Punkte: ${correctCount} / ${questions.length}`), create('p', `${Math.round(correctCount / questions.length * 100)} %`), create('p', `Richtig: ${correctCount} · Falsch: ${questions.length - correctCount}`));
      const restart = create('button','Noch einmal spielen');
      restart.type = 'button';
      restart.addEventListener('click', () => { index = 0; correctCount = 0; render(); });
      result.append(restart); container.append(result); return;
    }
    const question = questions[index];
    const form = create('form');
    form.append(create('p', `Frage ${index + 1} von ${questions.length}`, 'progress'));
    const fieldset = create('fieldset');
    fieldset.append(create('legend', question.question));
    const inputs = [];
    for (const option of question.options) {
      const label = create('label', undefined, 'quiz-option');
      const input = create('input'); input.type = question.type === 'multiple-choice' ? 'checkbox' : 'radio'; input.name = 'answer'; input.value = option.id;
      const statusMark = create('span', '', 'quiz-status-mark');
      statusMark.setAttribute('aria-hidden', 'true');
      label.append(input, document.createTextNode(` ${option.text}`), statusMark);
      inputs.push({input,label,option}); fieldset.append(label);
    }
    const submit = create('button','Antwort prüfen'); submit.type = 'submit';
    const feedback = create('div', undefined, 'quiz-feedback');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    form.append(fieldset, submit, feedback); container.append(form);
    let answered = false;
    function answer(timedOut = false) {
      if (answered) return;
      const selected = inputs.filter(x => x.input.checked).map(x => x.option.id);
      if (!selected.length && !timedOut) { feedback.textContent = 'Bitte wähle eine Antwort.'; return; }
      answered = true; clearTimer();
      const correct = !timedOut && scoreAnswer(selected, question.correctOptionIds);
      if (correct) correctCount++;
      inputs.forEach(({input,label,option}) => {
        input.disabled = true;
        if (question.correctOptionIds.includes(option.id)) {
          label.classList.add('correct');
          label.setAttribute('data-status', 'correct');
          label.querySelector('.quiz-status-mark').textContent = '✓';
        } else if (input.checked) {
          label.classList.add('incorrect');
          label.setAttribute('data-status', 'incorrect');
          label.querySelector('.quiz-status-mark').textContent = '✗';
        }
      });
      submit.hidden = true;
      feedback.classList.add(timedOut || !correct ? 'quiz-feedback--incorrect' : 'quiz-feedback--correct');
      feedback.append(create('p', timedOut ? 'Die Zeit ist abgelaufen.' : correct ? '✓ Richtig!' : '✗ Leider falsch!'));
      if (question.explanation) feedback.append(create('p', question.explanation));
      const next = create('button', index === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'); next.type = 'button';
      next.addEventListener('click', () => { index++; render(); }); feedback.append(next);
    }
    form.addEventListener('submit', event => { event.preventDefault(); feedback.replaceChildren(); answer(); });
    if (activity.settings.timerEnabled) {
      let seconds = Number.isInteger(activity.settings.timerSeconds) && activity.settings.timerSeconds > 0 ? activity.settings.timerSeconds : 30;
      const clock = create('p', `Zeit: ${seconds} s`); form.prepend(clock);
      timer = setInterval(() => { seconds--; clock.textContent = `Zeit: ${seconds} s`; if (seconds <= 0) answer(true); },1000);
    }
  }
  render();
  return clearTimer;
}
