export const TASKS = [
  {level:1, topic:'Faires Teilen', prompt:'8 Apfelstücke werden fair auf 4 Teller verteilt. Welcher Bruch zeigt einen Telleranteil?', options:['1/2','1/4','4/8'], answer:'1/4', explain:'Ein Teller bekommt 1 von 4 gleich großen Teilen: 1/4.'},
  {level:1, topic:'Zähler & Nenner', prompt:'Welche Zahl ist der Zähler bei 3/5?', options:['3','5','8'], answer:'3', explain:'Der Zähler steht oben und zählt die genommenen Teile.'},
  {level:1, topic:'Brucharten', prompt:'Was ist 7/4 für eine Bruchart?', options:['echter Bruch','unechter Bruch','Stammbruch'], answer:'unechter Bruch', explain:'Der Zähler ist größer als der Nenner. Deshalb ist 7/4 unecht.'},
  {level:2, topic:'Vergleichen', prompt:'Welcher Bruch ist größer?', options:['3/8','5/8','gleich groß'], answer:'5/8', explain:'Bei gleichem Nenner ist der größere Zähler der größere Bruch.'},
  {level:2, topic:'Gleichwertige Brüche', prompt:'Welcher Bruch ist gleichwertig zu 2/3?', options:['4/6','3/5','2/6'], answer:'4/6', explain:'Zähler und Nenner werden beide mit 2 erweitert: 2/3 = 4/6.'},
  {level:2, topic:'Erweitern & Kürzen', prompt:'Kürze 6/8 vollständig.', options:['3/4','2/4','6/4'], answer:'3/4', explain:'Zähler und Nenner werden durch 2 geteilt: 6/8 = 3/4.'},
  {level:3, topic:'Gleichnamig addieren', prompt:'Rechne: 2/7 + 3/7 = ?', options:['5/7','5/14','6/7'], answer:'5/7', explain:'Der Nenner bleibt 7; nur die Zähler werden addiert: 2 + 3 = 5.'},
  {level:3, topic:'Gleichnamig subtrahieren', prompt:'Rechne: 6/9 − 2/9 = ?', options:['4/9','4/18','8/9'], answer:'4/9', explain:'Der Nenner bleibt 9; 6 − 2 = 4.'},
  {level:3, topic:'Rechen-Abenteuer', prompt:'Welche Rechnung ist richtig?', options:['1/6 + 4/6 = 5/6','1/6 + 4/6 = 5/12','1/6 + 4/6 = 4/6'], answer:'1/6 + 4/6 = 5/6', explain:'Gleichnamige Brüche behalten ihren Nenner.'},
  {level:4, topic:'Ungleichnamig', prompt:'Rechne: 1/2 + 1/4 = ?', options:['3/4','2/6','1/6'], answer:'3/4', explain:'Erweitere 1/2 zu 2/4. Dann gilt 2/4 + 1/4 = 3/4.'},
  {level:4, topic:'Gemischte Zahl', prompt:'Schreibe 5/4 als gemischte Zahl.', options:['1 1/4','4 1/5','5 1/4'], answer:'1 1/4', explain:'5/4 enthält ein Ganzes und 1/4: also 1 1/4.'},
  {level:4, topic:'Fehler erkennen', prompt:'Mia sagt: 1/3 + 1/3 = 2/6. Was ist ihr Fehler?', options:['Sie hat die Nenner addiert.','Sie hat die Zähler addiert.','Es gibt keinen Fehler.'], answer:'Sie hat die Nenner addiert.', explain:'Bei gleichnamigen Brüchen bleibt der Nenner 3. Richtig ist 2/3.'}
];

const rewards = [[3, 'Holzschild'], [6, 'Eisenstiefel'], [9, 'Diamantspitzhacke']];
const isEvent = (event) => {
  if (!event || !['wrong', 'progress', 'next'].includes(event.type)) return false;
  if (event.type === 'next') return true;
  if (!Number.isInteger(event.card) || event.card < 0 || event.card >= TASKS.length) return false;
  if (event.type === 'progress' && (!Number.isInteger(event.position) || event.position < 1 || event.position > TASKS.length)) return false;
  return event.type === 'wrong' || event.type === 'progress';
};
const valid = (state) => {
  if (!state || typeof state !== 'object' || typeof state.answered !== 'boolean') return false;
  if (!Number.isInteger(state.index) || state.index < 0 || state.index > TASKS.length) return false;
  if (!Number.isInteger(state.correct) || state.correct < 0 || state.correct > TASKS.length) return false;
  if (!Number.isInteger(state.position) || state.position !== state.correct) return false;
  if (!Number.isInteger(state.streak) || state.streak < 0 || state.streak > state.correct) return false;
  if (!Array.isArray(state.inventory) || state.inventory.some(item => !rewards.some(([, reward]) => reward === item))) return false;
  const expectedInventory = rewards.filter(([threshold]) => threshold <= state.correct).map(([, reward]) => reward);
  if (state.inventory.length !== expectedInventory.length || expectedInventory.some(reward => !state.inventory.includes(reward))) return false;
  if (!Array.isArray(state.events) || state.events.length > TASKS.length * 3 || state.events.some(event => !isEvent(event))) return false;
  if (!state.skills || typeof state.skills !== 'object' || Array.isArray(state.skills)) return false;
  if (!state.mistakes || typeof state.mistakes !== 'object' || Array.isArray(state.mistakes) || Object.values(state.mistakes).some(count => !Number.isInteger(count) || count < 1)) return false;
  if (!state.combat || state.combat.maxHealth !== 3 || !Number.isInteger(state.combat.health) || state.combat.health < 0 || state.combat.health > 3 || !Number.isInteger(state.combat.defeated) || state.combat.defeated < 0 || state.combat.defeated > 1) return false;
  const progress = state.events.filter(event => event.type === 'progress');
  const wrong = state.events.filter(event => event.type === 'wrong');
  if (progress.length !== state.correct || progress.some((event, index) => event.position !== index + 1) || new Set([...progress, ...wrong].map(event => event.card)).size !== progress.length + wrong.length) return false;
  if (wrong.length !== Object.values(state.mistakes).reduce((sum, count) => sum + (Number.isInteger(count) ? count : 0), 0)) return false;
  if (state.index + (state.answered ? 1 : 0) < state.correct || state.index > state.correct + wrong.length || progress.length + wrong.length !== state.index + (state.answered ? 1 : 0)) return false;
  return true;
};

export function createState() { return {index:0, correct:0, streak:0, position:0, answered:false, inventory:[], events:[], skills:{}, mistakes:{}, combat:{health:3, maxHealth:3, defeated:0}}; }
export function resetState() { return createState(); }
export function hydrate(candidate) { return valid(candidate) ? {...candidate, inventory:[...candidate.inventory], events:[...candidate.events], skills:{...candidate.skills}, combat:{...candidate.combat}} : createState(); }

export function answerCard(state, value) {
  if (state.answered || state.index >= TASKS.length) return {state, correct:false, event:{type:'ignored'}};
  const task = TASKS[state.index];
  if (value !== task.answer) {
    const next = {...state, answered:true, streak:0, mistakes:{...state.mistakes, [task.topic]:(state.mistakes[task.topic] || 0) + 1}, events:[...state.events, {type:'wrong', card:state.index}]};
    return {state:next, correct:false, event:next.events.at(-1)};
  }
  const correct = state.correct + 1;
  const nextInventory = [...state.inventory];
  const reward = rewards.find(([threshold]) => threshold === correct)?.[1];
  if (reward && !nextInventory.includes(reward)) nextInventory.push(reward);
  let combat = {...state.combat};
  let event = {type:'progress', card:state.index, position:state.position + 1, reward:reward || null};
  if (task.level >= 3 && combat.health > 0 && combat.defeated === 0) {
    combat.health -= 1;
    if (combat.health === 0) { combat = {...combat, defeated:1}; event = {...event, combat:'defeat'}; }
    else event = {...event, combat:'hit', health:combat.health};
  }
  const next = {...state, correct, streak:state.streak + 1, position:state.position + 1, answered:true, inventory:nextInventory, events:[...state.events, event], skills:{...state.skills, [task.topic]:(state.skills[task.topic] || 0) + 1}, combat};
  return {state:next, correct:true, event};
}
export function advance(state) { return state.answered ? {state:{...state, index:state.index + 1, answered:false}, event:{type:'next'}} : {state, event:{type:'ignored'}}; }
