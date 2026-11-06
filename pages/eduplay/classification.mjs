export function scoreClassification(items, assignments) {
  return {correct: items.filter(item => assignments[item.id] === item.categoryId).length, total: items.length};
}
export function mountClassification(container, activity) {
  const {items, categories} = activity.content;
  let assignments = Object.create(null), selected = null, checked = false;
  const el = (tag, text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  function render(focusKey = null) {
    let focusNode = null;
    container.replaceChildren();
    const instruction = el('p','Wähle einen Begriff und danach eine Kategorie – oder ziehe ihn auf die Kategorie.');
    const status = el('p'); status.setAttribute('aria-live','polite');
    const pool = el('div'); pool.className = 'classification-pool';
    const groups = el('div'); groups.className = 'classification-groups';
    function assign(itemId, categoryId) {
      if (!items.some(item => item.id === itemId) || checked) return;
      assignments[itemId] = categoryId; selected = null;
      const nextItem = items.find(item => !assignments[item.id]);
      render(nextItem ? `item:${nextItem.id}` : 'check');
    }
    function makeItem(item) {
      const correct = assignments[item.id] === item.categoryId;
      const resultLabel = correct ? 'Richtig' : 'Falsch';
      const button = el('button',checked ? `${correct ? '✓' : '✗'} ${item.text} – ${resultLabel}` : item.text); button.type = 'button'; button.draggable = !checked;
      button.setAttribute('aria-pressed',String(selected === item.id));
      if (focusKey === `item:${item.id}`) focusNode = button;
      if (checked && assignments[item.id]) {
        button.classList.add(correct ? 'correct' : 'incorrect');
        button.setAttribute('aria-label',`${item.text}: ${resultLabel}`);
      }
      button.addEventListener('click',() => { if (!checked) { selected = selected === item.id ? null : item.id; render(`item:${item.id}`); } });
      button.addEventListener('dragstart',event => event.dataTransfer.setData('text/plain',item.id));
      return button;
    }
    for (const item of items.filter(item => !assignments[item.id])) pool.append(makeItem(item));
    for (const category of categories) {
      const group = el('section'); group.className = 'classification-group';
      const choice = el('button',category.name); choice.type = 'button'; choice.disabled = checked;
      choice.addEventListener('click',() => { if (selected !== null) assign(selected,category.id); });
      group.append(choice);
      group.addEventListener('dragover',event => { if (!checked) event.preventDefault(); });
      group.addEventListener('drop',event => { event.preventDefault(); assign(event.dataTransfer.getData('text/plain'),category.id); });
      for (const item of items.filter(item => assignments[item.id] === category.id)) group.append(makeItem(item));
      groups.append(group);
    }
    const check = el('button', checked ? 'Noch einmal spielen' : 'Zuordnung prüfen'); check.type = 'button';
    if (focusKey === 'check') focusNode = check;
    check.addEventListener('click',() => {
      if (checked) { assignments = Object.create(null); selected = null; checked = false; render('check'); return; }
      if (items.some(item => !assignments[item.id])) { status.textContent = 'Bitte ordne zuerst alle Begriffe zu.'; return; }
      checked = true; render('check');
    });
    if (checked) { const result = scoreClassification(items,assignments); status.textContent = `Richtig: ${result.correct} / ${result.total} · ${Math.round(result.correct / result.total * 100)} %`; }
    else if (selected) status.textContent = 'Wähle jetzt eine Kategorie.';
    container.append(instruction,status,pool,groups,check);
    if (focusNode) focusNode.focus();
  }
  render(); return () => {};
}
