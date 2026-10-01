const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const choice=(divisor,options,answer,explanation,extra={})=>({type:'choice',divisor,options,answer,explanation,...extra});
const yesNo=(divisor,number,answer,explanation,extra={})=>({type:'yes-no',divisor,number,answer,explanation,...extra});
const digit=(divisor,template,options,answer,explanation,extra={})=>({type:'digit',divisor,template,options,answer,explanation,...extra});
const input=(divisor,prompt,answer,explanation,extra={})=>({type:'input',divisor,prompt,answer:String(answer),explanation,...extra});

const rules=[
  {n:2,title:'Teilbar durch 2',text:'Die letzte Ziffer ist 0, 2, 4, 6 oder 8.',example:'248 ist durch 2 teilbar, weil 8 gerade ist.',discovery:{prompt:'Prüfe die Endziffern von 120, 122, 124 und 125. Was fällt dir auf?',set:'120 · 122 · 124 · 125',result:'Nur Zahlen mit einer geraden Endziffer sind durch 2 teilbar.',rule:'Eine Zahl ist durch 2 teilbar, wenn ihre letzte Ziffer 0, 2, 4, 6 oder 8 ist.',levels:'Achte auf die letzte Ziffer.',extra:'♛ Merke: Gerade Zahlen sind durch 2 teilbar.'},tasks:[choice(2,['348','351','365','379'],'348','348 endet auf 8. 8 ist gerade.'),yesNo(2,'1 426',true,'1 426 endet auf 6. Deshalb ist die Zahl durch 2 teilbar.'),digit(2,'53□',['1','4','7','9'],'4','534 endet auf 4. Deshalb ist 534 durch 2 teilbar.'),input(2,'Ergänze 53□ und trage die ganze Zahl ein. Sie soll durch 2 teilbar sein.','534','534 endet auf 4. Deshalb ist 534 durch 2 teilbar.',{acceptedAnswers:['530','532','534','536','538']})]},
  {n:3,title:'Teilbar durch 3',text:'Die Quersumme ist durch 3 teilbar.',example:'123: 1+2+3=6. Deshalb ist 123 durch 3 teilbar.',discovery:{prompt:'Bestimme jeweils die Quersumme der Vielfachen von 3. Was fällt dir auf?',set:'V(3) = {3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, …}',result:'Die Quersummen sind auch Vielfache von 3.',rule:'Eine Zahl ist durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist.',levels:'⭐ AH S. 8 · ⭐⭐ AH S. 9 · ⭐⭐⭐ AH S. 9',extra:'♛ Zusatzaufgabe: ⭐ AH S. 9 · ⭐⭐ AH S. 10 · ⭐⭐⭐ AH S. 10'},tasks:[choice(3,['257','258','262','274'],'258','2 + 5 + 8 = 15. 15 ist durch 3 teilbar.'),yesNo(3,'1 254',true,'1 + 2 + 5 + 4 = 12. 12 ist durch 3 teilbar.'),digit(3,'4□2',['1','2','3','5'],'3','4 + 3 + 2 = 9. 9 ist durch 3 teilbar.'),input(3,'Ergänze 4□2 und trage die ganze Zahl ein. Sie soll durch 3 teilbar sein.','432','4 + 3 + 2 = 9. 9 ist durch 3 teilbar.',{acceptedAnswers:['402','432','462','492']})]},
  {n:5,title:'Teilbar durch 5',text:'Die letzte Ziffer ist 0 oder 5.',example:'1 235 endet auf 5 und ist deshalb durch 5 teilbar.',discovery:{prompt:'Vergleiche 120, 125, 130 und 134. Welche Endziffern kommen bei den durch 5 teilbaren Zahlen vor?',set:'120 · 125 · 130 · 134',result:'Durch 5 teilbare Zahlen enden auf 0 oder 5.',rule:'Eine Zahl ist durch 5 teilbar, wenn ihre letzte Ziffer 0 oder 5 ist.',levels:'Achte auf die letzte Ziffer.',extra:'♛ Zusatz: Eine Zahl mit der Endziffer 0 ist außerdem durch 10 teilbar.'},tasks:[choice(5,['1 472','1 475','1 477','1 479'],'1 475','1 475 endet auf 5.'),yesNo(5,'2 340',true,'2 340 endet auf 0. Deshalb ist die Zahl durch 5 teilbar.'),digit(5,'82□',['0','2','5','8'],'5','825 endet auf 5. Die Aufgabe fragt außerdem: nicht durch 10 – deshalb passt 0 nicht.',{notDivisors:[10]}),input(5,'Ergänze 82□ und trage die ganze Zahl ein. Sie soll durch 5, aber nicht durch 10 teilbar sein.','825','825 endet auf 5 und nicht auf 0.',{acceptedAnswers:['825']})]},
  {n:6,title:'Teilbar durch 6',text:'Die Zahl ist gleichzeitig durch 2 und durch 3 teilbar.',example:'42 ist gerade und 4+2=6. Deshalb ist 42 durch 6 teilbar.',discovery:{prompt:'Prüfe 12, 18, 24 und 25. Welche zwei Regeln müssen gleichzeitig gelten?',set:'12 · 18 · 24 · 25',result:'Eine Zahl ist durch 6 teilbar, wenn sie durch 2 und durch 3 teilbar ist.',rule:'Für die Teilbarkeit durch 6 prüfst du: gerade Zahl und Quersumme durch 3 teilbar.',levels:'Achte auf beide Bedingungen.',extra:'♛ Zusatz: 42 ist gerade und 4 + 2 = 6.'},tasks:[choice(6,['132','124','135','142'],'132','132 ist gerade und 1 + 3 + 2 = 6. Die Zahl ist durch 2 und 3 teilbar.'),yesNo(6,'318',true,'318 ist gerade und 3 + 1 + 8 = 12. Deshalb ist 318 durch 6 teilbar.'),digit(6,'4□2',['1','3','5','7'],'3','432 ist gerade und 4 + 3 + 2 = 9. Deshalb ist 432 durch 6 teilbar.'),input(6,'Ergänze 4□2 und trage die ganze Zahl ein. Sie soll durch 6 teilbar sein.','432','432 ist gerade und die Quersumme 9 ist durch 3 teilbar.',{acceptedAnswers:['402','432','462','492']})]},
  {n:9,title:'Teilbar durch 9',text:'Die Quersumme ist durch 9 teilbar.',example:'729: 7+2+9=18. Deshalb ist 729 durch 9 teilbar.',discovery:{prompt:'Bestimme jeweils die Quersumme der Vielfachen von 9. Was fällt dir auf?',set:'V(9) = {9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108, 117, 126, 135, 144, 153, …}',result:'Die Quersummen sind auch Vielfache von 9.',rule:'Eine Zahl ist durch 9 teilbar, wenn ihre Quersumme durch 9 teilbar ist.',levels:'⭐ AH S. 8 · ⭐⭐ AH S. 9 · ⭐⭐⭐ AH S. 9',extra:'♛ Zusatzaufgabe: ⭐ AH S. 9 · ⭐⭐ AH S. 10 · ⭐⭐⭐ AH S. 10'},tasks:[choice(9,['638','639','641','650'],'639','6 + 3 + 9 = 18. 18 ist durch 9 teilbar.'),yesNo(9,'4 536',true,'4 + 5 + 3 + 6 = 18. 18 ist durch 9 teilbar.'),digit(9,'7□4',['2','5','7','8'],'7','7 + 7 + 4 = 18. 18 ist durch 9 teilbar.'),input(9,'Ergänze 7□4 und trage die ganze Zahl ein. Sie soll durch 9 teilbar sein.','774','7 + 7 + 4 = 18. 18 ist durch 9 teilbar.',{acceptedAnswers:['774']})]},
  {n:10,title:'Teilbar durch 10',text:'Die letzte Ziffer ist 0.',example:'5 430 endet auf 0 und ist deshalb durch 10 teilbar.',discovery:{prompt:'Vergleiche 120, 130, 140 und 145. Welche Endziffer haben die durch 10 teilbaren Zahlen?',set:'120 · 130 · 140 · 145',result:'Durch 10 teilbare Zahlen enden immer auf 0.',rule:'Eine Zahl ist durch 10 teilbar, wenn ihre letzte Ziffer 0 ist.',levels:'Achte auf die letzte Ziffer.',extra:'♛ Zusatz: Jede durch 10 teilbare Zahl ist auch durch 2 und durch 5 teilbar.'},tasks:[choice(10,['3 210','3 212','3 215','3 218'],'3 210','3 210 endet auf 0.'),yesNo(10,'7 890',true,'7 890 endet auf 0. Deshalb ist die Zahl durch 10 teilbar.'),digit(10,'46□',['0','2','5','8'],'0','460 endet auf 0. Deshalb ist 460 durch 10 teilbar.'),input(10,'Ergänze 46□ und trage die ganze Zahl ein. Sie soll durch 10 teilbar sein.','460','460 endet auf 0. Deshalb ist 460 durch 10 teilbar.',{acceptedAnswers:['460']})]}
];

const practiceTasks=rules.flatMap(rule=>rule.tasks.map((task,index)=>({...task,rule:rule.n,label:`Regel ${rule.n} · Aufgabe ${index+1}`})));
const masterTasks=[
  choice(2,['234','235','237','239'],'234','234 endet auf 4. Deshalb ist 234 durch 2 teilbar.',{label:'Endziffer · durch 2'}),
  input(2,'Trage eine Zahl zwischen 1 240 und 1 250 ein, die durch 2 teilbar ist.','1248','1 248 endet auf 8 und ist gerade.',{acceptedAnswers:['1240','1242','1244','1246','1248','1250'],label:'Zahl eintragen · durch 2'}),
  yesNo(2,'3 517',false,'3 517 endet auf 7. Die Zahl ist deshalb nicht durch 2 teilbar.',{label:'Genau hinschauen · durch 2'}),
  choice(3,['351','352','353','355'],'351','3 + 5 + 1 = 9. 9 ist durch 3 teilbar.',{label:'Quersumme · durch 3'}),
  input(3,'Trage eine Zahl zwischen 1 250 und 1 260 ein, die durch 3 teilbar ist.','1254','1 + 2 + 5 + 4 = 12. 12 ist durch 3 teilbar.',{acceptedAnswers:['1251','1254','1257','1260'],label:'Zahl eintragen · durch 3'}),
  yesNo(3,'2 518',false,'2 + 5 + 1 + 8 = 16. 16 ist nicht durch 3 teilbar.',{label:'Quersumme · durch 3'}),
  choice(5,['2 341','2 345','2 347','2 349'],'2 345','2 345 endet auf 5. Deshalb ist die Zahl durch 5 teilbar.',{label:'Endziffer · durch 5'}),
  input(5,'Trage eine Zahl zwischen 820 und 830 ein, die durch 5, aber nicht durch 10 teilbar ist.','825','825 endet auf 5 und nicht auf 0.',{acceptedAnswers:['825'],notDivisors:[10],label:'Zahl eintragen · durch 5'}),
  yesNo(5,'4 270',true,'4 270 endet auf 0. Deshalb ist die Zahl durch 5 teilbar.',{label:'Genau hinschauen · durch 5'}),
  choice(6,['234','235','238','241'],'234','234 ist gerade und 2 + 3 + 4 = 9. Deshalb ist 234 durch 6 teilbar.',{label:'Kombination · durch 2 und 3'}),
  input(6,'Trage eine Zahl zwischen 400 und 410 ein, die durch 6 teilbar ist.','402','402 ist gerade und 4 + 0 + 2 = 6.',{acceptedAnswers:['402'],label:'Zahl eintragen · durch 6'}),
  yesNo(6,'4 590',true,'4 590 ist gerade und 4 + 5 + 9 + 0 = 18. Deshalb ist die Zahl durch 6 teilbar.',{label:'Kombination · durch 2 und 3'}),
  choice(9,['729','735','741','753'],'729','7 + 2 + 9 = 18. 18 ist durch 9 teilbar.',{label:'Quersumme · durch 9'}),
  input(9,'Trage eine Zahl zwischen 770 und 780 ein, die durch 9 teilbar ist.','774','7 + 7 + 4 = 18. 18 ist durch 9 teilbar.',{acceptedAnswers:['774'],label:'Zahl eintragen · durch 9'}),
  yesNo(9,'4 536',true,'4 + 5 + 3 + 6 = 18. 18 ist durch 9 teilbar.',{label:'Quersumme · durch 9'}),
  choice(10,['3 210','3 212','3 215','3 218'],'3 210','3 210 endet auf 0. Deshalb ist die Zahl durch 10 teilbar.',{label:'Endziffer · durch 10'}),
  input(10,'Trage eine Zahl zwischen 4 550 und 4 560 ein, die durch 10 teilbar ist.','4560','4 560 endet auf 0. Deshalb ist die Zahl durch 10 teilbar.',{acceptedAnswers:['4560'],label:'Zahl eintragen · durch 10'}),
  yesNo(10,'7 895',false,'7 895 endet auf 5. Die Zahl ist deshalb nicht durch 10 teilbar.',{label:'Genau hinschauen · durch 10'})
];

function toNumber(value){return Number(String(value).replace(/\D/g,''))}
function normalizeInput(value){return String(value).trim().replace(/\s+/g,'')}
function targetDivisors(task){return task.divisors||[task.divisor]}
function matches(value,task){const number=toNumber(value);return targetDivisors(task).every(divisor=>number%divisor===0)&&(task.notDivisors||[]).every(divisor=>number%divisor!==0)}
function candidateValue(task,candidate){return task.type==='digit'?task.template.replace('□',candidate):candidate}
function inputAnswers(task){return task.acceptedAnswers||[task.answer]}
function validateTaskBank(){
  [...practiceTasks,...masterTasks].forEach((task,index)=>{
    if(task.type==='input'){
      if(!inputAnswers(task).length||!inputAnswers(task).every(answer=>matches(answer,task)))throw new Error(`Falsche Eingabelösung in Aufgabe ${index+1}.`);
      if(!inputAnswers(task).some(answer=>normalizeInput(answer)===normalizeInput(task.answer)))throw new Error(`Hauptlösung fehlt in Aufgabe ${index+1}.`);
      return;
    }
    const values=task.type==='yes-no'?[task.number]:task.options;
    if(!values.length||new Set(values).size!==values.length)throw new Error(`Ungültige Antwortoptionen in Aufgabe ${index+1}.`);
    if(!targetDivisors(task).every(Number.isInteger)||!(task.notDivisors||[]).every(Number.isInteger))throw new Error(`Ungültiger Teiler in Aufgabe ${index+1}.`);
    if(task.type==='yes-no'){if(matches(task.number,task)!==task.answer)throw new Error(`Falsche Ja/Nein-Lösung in Aufgabe ${index+1}.`);return}
    const correct=values.filter(value=>matches(candidateValue(task,value),task));
    if(correct.length!==1||String(correct[0])!==String(task.answer))throw new Error(`Falsche Lösung in Aufgabe ${index+1}.`);
  });
}
validateTaskBank();

const state={mode:'learn',index:0,score:0,correct:0,sound:true,answered:false,items:[]};
function show(id){$$('.screen').forEach(x=>{x.hidden=x.id!==id;x.classList.toggle('active',x.id===id)});window.scrollTo({top:0,behavior:'smooth'})}
function beep(ok){if(!state.sound)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:180;g.gain.value=.05;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.12)}
function save(){localStorage.setItem('linguacode-teilbarkeit-score',String(Math.max(Number(localStorage.getItem('linguacode-teilbarkeit-score')||0),state.score)))}
function optionsMarkup(options){return `<div class="options">${options.map(option=>`<button class="option" type="button" data-answer="${option}">${option}</button>`).join('')}</div>`}
function inputMarkup(){return '<div class="number-answer"><input id="number-answer" class="number-input" type="text" inputmode="numeric" autocomplete="off" aria-label="Zahl eintragen" placeholder="Zahl eintragen"><button class="primary" id="input-check" type="button">Prüfen</button></div>'}
function renderTask(task){
  const label=task.label?`<p class="task-label">${task.label}</p>`:'';
  const divisors=targetDivisors(task).join(' und ');
  const excluded=task.notDivisors?.length?` und nicht durch ${task.notDivisors.join(' und ')}`:'';
  if(task.type==='choice')return `${label}<p class="explanation">Welche Zahl ist durch <strong>${divisors}</strong>${excluded} teilbar?</p>${optionsMarkup(task.options)}`;
  if(task.type==='yes-no')return `${label}<p class="explanation">Ist <strong>${task.number}</strong> durch <strong>${divisors}</strong>${excluded} teilbar?</p>${optionsMarkup(['Ja','Nein'])}`;
  if(task.type==='input')return `${label}<p class="explanation">${task.prompt}</p>${inputMarkup()}`;
  return `${label}<p class="explanation">Welche Ziffer passt in <strong>${task.template}</strong>, damit die Zahl durch <strong>${divisors}</strong>${excluded} teilbar ist?</p>${optionsMarkup(task.options)}`;
}
function render(){
  const item=state.items[state.index];state.answered=false;const learn=state.mode==='learn';
  $('#counter').textContent=`${learn?'Karte':'Aufgabe'} ${state.index+1} von ${state.items.length}`;$('#score').textContent=`${state.score} Punkte`;$('#progress-bar').style.width=`${state.index/state.items.length*100}%`;$('#feedback').className='feedback';$('#feedback').textContent='';$('#hint-button').textContent=learn?'💡 Merksatz':'💡 Tipp';
  if(learn){
    const body=`<p class="explanation">${item.text}</p><div class="example">${item.example}</div>${item.discovery?`<div class="discovery"><strong>Entdecke:</strong> ${item.discovery.prompt}<p>${item.discovery.set}</p><b>${item.discovery.result}</b><p class="rule-callout">${item.discovery.rule}</p><small>${item.discovery.levels}<br>${item.discovery.extra}</small></div>`:''}`;
    $('#card').innerHTML=`<div class="rule-number">${item.n}</div><h2>${item.title}</h2>${body}`;
  }else{
    $('#card').innerHTML=`<div class="rule-number">${item.rule||'★'}</div><h2>${state.mode==='master'?'Meisterfrage':'Zahlen-Detektiv'}</h2>${renderTask(item)}`;
    $$('.option').forEach(button=>button.addEventListener('click',()=>answer(button,item)));
    const inputField=$('#number-answer');const inputCheck=$('#input-check');
    inputCheck?.addEventListener('click',()=>answerInput(inputField.value,item));
    inputField?.addEventListener('keydown',event=>{if(event.key==='Enter')answerInput(inputField.value,item)});
  }
}
function isCorrect(value,task){
  if(task.type==='yes-no')return String(value)===String(task.answer);
  if(task.type==='input')return inputAnswers(task).some(answer=>normalizeInput(answer)===normalizeInput(value));
  return String(value)===String(task.answer);
}
function submitAnswer(value,task,button){
  if(state.answered)return;state.answered=true;const ok=isCorrect(value,task);
  if(button){$$('.option').forEach(option=>option.disabled=true);button.classList.add(ok?'correct':'wrong')}
  if(task.type==='input'){$('#number-answer')?.setAttribute('disabled','disabled');if($('#input-check'))$('#input-check').disabled=true}
  if(ok){state.correct++;state.score+=10;$('#feedback').className='feedback show good';$('#feedback').textContent=`✅ Richtig! ${task.explanation}`;beep(true)}else{$('#feedback').className='feedback show';$('#feedback').textContent=`Noch nicht. ${task.explanation}`;beep(false)}
  $('#score').textContent=`${state.score} Punkte`;save();
}
function answer(button,task){const selected=task.type==='yes-no'?button.dataset.answer==='Ja':button.dataset.answer;submitAnswer(selected,task,button)}
function answerInput(value,task){submitAnswer(value.trim(),task,null)}
function next(){if(state.index>=state.items.length-1){finish();return}state.index++;render()}
function finish(){$('#finish-score').textContent=state.score;$('#finish-correct').textContent=`${state.correct}/${state.items.length}`;$('#finish-message').textContent=state.correct===state.items.length?'Du beherrschst die Teilbarkeitsregeln sicher.':'Guter Start – wiederhole die Regeln mit „Entdecken“ und versuche es noch einmal.';show('finish-screen')}
function startMode(){state.index=0;state.score=0;state.correct=0;state.items=state.mode==='learn'?rules:state.mode==='practice'?practiceTasks:masterTasks;$('#mode-label').textContent=state.mode==='learn'?'ENTDECKEN':state.mode==='practice'?'TRAINIEREN':'MEISTERPRÜFUNG';$('#activity-title').textContent=state.mode==='learn'?'Regelkarte':state.mode==='practice'?'Zahlen-Detektiv':'Meisterprüfung';show('activity-screen');render()}
$$('.mode-card').forEach(button=>button.addEventListener('click',()=>{$$('.mode-card').forEach(card=>card.classList.remove('selected'));button.classList.add('selected');state.mode=button.dataset.mode}));
$('#start-button').addEventListener('click',startMode);$('#next-button').addEventListener('click',next);$('#hint-button').addEventListener('click',()=>{const item=state.items[state.index];$('#feedback').className='feedback show';$('#feedback').textContent=state.mode==='learn'?`Merksatz: ${item.text}`:`Tipp: ${item.explanation}`});$('#back-button').addEventListener('click',()=>show('start-screen'));$('#home-button').addEventListener('click',()=>show('start-screen'));$('#again-button').addEventListener('click',startMode);$('#sound-toggle').addEventListener('click',event=>{state.sound=!state.sound;event.currentTarget.textContent=state.sound?'🔊 Ton':'🔇 Ton';event.currentTarget.setAttribute('aria-pressed',state.sound)});
