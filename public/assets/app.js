(() => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
  const dialog = document.querySelector('#share-dialog');
  document.querySelectorAll('[data-share-url]').forEach((button) => button.addEventListener('click', () => {
    const url = button.dataset.shareUrl;
    document.querySelector('#share-url').value = url;
    document.querySelector('#qr-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
    dialog.showModal();
  }));
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  document.querySelector('#copy-url')?.addEventListener('click', async () => { await navigator.clipboard.writeText(document.querySelector('#share-url').value); document.querySelector('#copy-url').textContent = 'Kopiert'; });
  const root = document.querySelector('[data-quiz]');
  if (!root) return;
  const questions = JSON.parse(root.dataset.quiz); let index = 0; let score = 0;
  const render = () => { const q = questions[index]; const quiz = document.querySelector('#quiz'); if (!q) { quiz.innerHTML = `<section class="result"><p class="eyebrow">Geschafft</p><h2>${score} von ${questions.length} richtig</h2><button id="restart">Noch einmal</button></section>`; document.querySelector('#restart').onclick = () => {index=0;score=0;render();}; return; } quiz.innerHTML = `<p class="progress">Frage ${index + 1} von ${questions.length}</p><h2>${q.question}</h2><div class="answers">${q.options.map((option,i) => `<button data-answer="${i}">${option}</button>`).join('')}</div><p class="feedback" aria-live="polite"></p>`; quiz.querySelectorAll('[data-answer]').forEach((button) => button.onclick = () => { const correct = Number(button.dataset.answer) === q.answer; if (correct) score++; quiz.querySelectorAll('[data-answer]').forEach((answer,i) => {answer.disabled=true; answer.classList.toggle('correct', i===q.answer); answer.classList.toggle('wrong', Number(button.dataset.answer)===i && !correct);}); quiz.querySelector('.feedback').textContent = correct ? 'Richtig!' : 'Noch nicht – sieh dir die Markierung an.'; setTimeout(() => {index++;render();}, 950); }); };
  render();
})();
