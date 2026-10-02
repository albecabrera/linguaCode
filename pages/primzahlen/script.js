const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const choice=(options,answer,explanation,extra={})=>({type:'choice',options,answer,explanation,...extra});
const yesNo=(number,answer,explanation,extra={})=>({type:'yes-no',number,answer,explanation,...extra});
const input=(prompt,answer,explanation,acceptedAnswers=[answer],extra={})=>({type:'input',prompt,answer:String(answer),acceptedAnswers:acceptedAnswers.map(String),explanation,...extra});
const primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
const primeSet=primes.join(', ');

const learnCards=[
  {kind:'definition',number:'★',title:'Was ist eine Primzahl?',text:'Wenn eine Zahl genau zwei Teiler hat, nämlich die 1 und sich selbst, dann heißt die Zahl Primzahl.',example:'13 = {1, 13} · Die Teilermenge enthält genau zwei Teiler.',discovery:{prompt:'Vergleiche die Teilermengen von 13 und 12.',set:'T₁₃ = {1, 13}   ·   T₁₂ = {1, 2, 3, 4, 6, 12}',result:'13 ist eine Primzahl. 12 ist keine Primzahl, weil sie mehr als zwei Teiler hat.',rule:'Primzahl: genau zwei Teiler – 1 und die Zahl selbst.',extra:'Wichtig: Die 1 ist keine Primzahl, weil sie nur einen Teiler hat.'}},
  {kind:'definition',number:'2',title:'Die 2 ist besonders',text:'Die 2 ist die kleinste Primzahl und die einzige gerade Primzahl.',example:'T₂ = {1, 2} · Die 2 hat genau zwei Teiler.',discovery:{prompt:'Prüfe die geraden Zahlen 2, 4, 6 und 8.',set:'T₂ = {1, 2}   ·   T₄ = {1, 2, 4}   ·   T₆ = {1, 2, 3, 6}',result:'Nur die 2 hat unter den geraden Zahlen genau zwei Teiler.',rule:'Alle geraden Zahlen größer als 2 sind keine Primzahlen.',extra:'Merke: Die 2 ist die einzige gerade Primzahl.'}},
  {kind:'definition',number:'✓',title:'Primzahl oder nicht?',text:'Um eine Zahl zu prüfen, suchst du Teilerpaare. Gibt es mehr als die beiden Teiler 1 und die Zahl selbst, ist sie keine Primzahl.',example:'17 = 1 · 17 · Deshalb ist 17 eine Primzahl.',discovery:{prompt:'Finde ein Teilerpaar von 21 außer 1 · 21.',set:'21 = 3 · 7',result:'21 hat die Teiler 1, 3, 7 und 21. Deshalb ist 21 keine Primzahl.',rule:'Ein zusätzlicher Teiler reicht aus, damit eine Zahl keine Primzahl ist.',extra:'Bei größeren Zahlen hilft dir das Sieb des Eratosthenes.'}},
  {kind:'sieve',number:'🔎',title:'Das Sieb des Eratosthenes',text:'Mit diesem Verfahren kannst du Primzahlen bis 100 „aussieben“. Streiche zusammengesetzte Zahlen durch; die übrigen Zahlen sind Primzahlen.',example:'1 durchstreichen → 2 markieren → Vielfache von 2, 3, 5 und 7 durchstreichen.',extra:'Die Vielfachen von 11 sind bis 100 bereits durchgestrichen. Danach bleiben genau die Primzahlen übrig.'}
];

const practiceTasks=[
  choice(['21','29','35','51'],'29','29 hat nur die Teiler 1 und 29.'),
  yesNo('91',false,'91 = 7 · 13. Die Zahl hat zusätzliche Teiler und ist deshalb keine Primzahl.'),
  choice(['15','17','21','27'],'17','17 ist nur durch 1 und 17 teilbar.'),
  input('Nenne eine Primzahl zwischen 40 und 50.','43','41, 43 oder 47 sind Primzahlen.', ['41','43','47']),
  choice(['39','47','49','51'],'47','47 bleibt beim Sieb übrig. Die anderen Zahlen sind durch 3 oder 7 teilbar.'),
  yesNo('1',false,'Die 1 hat nur einen Teiler: sich selbst. Sie ist keine Primzahl.'),
  input('Trage alle Primzahlen zwischen 10 und 20 ein.','11,13,17,19','Zwischen 10 und 20 liegen die Primzahlen 11, 13, 17 und 19.', ['11,13,17,19','11 13 17 19']),
  choice(['3','4','5','6'],'4','Zwischen 1 und 10 liegen 2, 3, 5 und 7 – also vier Primzahlen.')
].map((task,index)=>({...task,label:`Primzahl-Training · Aufgabe ${index+1}`}));

const masterTasks=[
  choice(['77','79','81','83'],'79','79 hat genau die Teiler 1 und 79.'),
  yesNo('97',true,'97 bleibt beim Sieb übrig und hat genau zwei Teiler.'),
  choice(['1','2','3','4'],'2','Eine Primzahl hat genau zwei Teiler: 1 und sich selbst.'),
  input('Trage eine Primzahl zwischen 60 und 70 ein.','61','61 oder 67 sind Primzahlen.', ['61','67']),
  yesNo('57',false,'57 = 3 · 19. Deshalb ist 57 keine Primzahl.'),
  choice(['69','71','75','77'],'71','71 hat keine weiteren Teiler außer 1 und 71.'),
  choice(['89','91','93','95'],'89','89 ist eine Primzahl. 91, 93 und 95 haben zusätzliche Teiler.'),
  input('Trage die Primzahlen zwischen 90 und 100 ein.','97','Bis 100 bleibt aus diesem Bereich nur 97 übrig.', ['97'])
].map((task,index)=>({...task,label:`Meisterprüfung · Aufgabe ${index+1}`}));

const state={mode:'learn',index:0,score:0,correct:0,sound:true,answered:false,items:[],sieveStep:0};
const sieveSteps=[
  {button:'1 streichen',numbers:[1],message:'Die 1 ist keine Primzahl: Sie hat nur einen Teiler.'},
  {button:'2 markieren',numbers:[2],message:'2 ist eine Primzahl. Markiere sie.'},
  {button:'Vielfache von 2',numbers:Array.from({length:49},(_,i)=>4+i*2),message:'Streiche alle Vielfachen von 2 außer der 2 durch.'},
  {button:'3 markieren + Vielfache',numbers:[3,...Array.from({length:32},(_,i)=>6+i*3)],message:'Markiere 3 und streiche ihre Vielfachen durch.'},
  {button:'5 markieren + Vielfache',numbers:[5,...Array.from({length:18},(_,i)=>10+i*5)],message:'Markiere 5 und streiche ihre Vielfachen durch.'},
  {button:'7 markieren + Vielfache',numbers:[7,...Array.from({length:13},(_,i)=>14+i*7)],message:'Markiere 7 und streiche ihre Vielfachen durch.'},
  {button:'Übrig gebliebene markieren',numbers:primes.filter(n=>![2,3,5,7].includes(n)),message:'Alle nicht durchgestrichenen Zahlen sind Primzahlen.'}
];

function show(id){$$('.screen').forEach(x=>{x.hidden=x.id!==id;x.classList.toggle('active',x.id===id)});window.scrollTo({top:0,behavior:'smooth'})}
function beep(ok){if(!state.sound)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=ok?660:180;g.gain.value=.05;o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.12)}
function save(){localStorage.setItem('linguacode-primzahlen-score',String(Math.max(Number(localStorage.getItem('linguacode-primzahlen-score')||0),state.score)))}
function normalize(value){return String(value).trim().toLowerCase().replace(/[{}]/g,'').replace(/\s+/g,'').replace(/;/g,',')}
function optionsMarkup(options){return `<div class="options">${options.map(option=>`<button class="option" type="button" data-answer="${option}">${option}</button>`).join('')}</div>`}
function inputMarkup(){return '<div class="number-answer"><input id="number-answer" class="number-input" type="text" inputmode="numeric" autocomplete="off" aria-label="Antwort eintragen" placeholder="Antwort eintragen"><button class="primary" id="input-check" type="button">Prüfen</button></div>'}
function renderTask(task){const label=task.label?`<p class="task-label">${task.label}</p>`:'';if(task.type==='choice')return `${label}<p class="explanation">Welche Aussage stimmt?</p>${optionsMarkup(task.options)}`;if(task.type==='yes-no')return `${label}<p class="explanation">Ist <strong>${task.number}</strong> eine Primzahl?</p>${optionsMarkup(['Ja','Nein'])}`;return `${label}<p class="explanation">${task.prompt}</p>${inputMarkup()}`}
function sieveMarkup(){const step=sieveSteps[state.sieveStep];const actions=new Map();for(let i=0;i<=state.sieveStep;i++){const current=sieveSteps[i];current.numbers.forEach(number=>{if(number===1)actions.set(number,'one');else if(i===sieveSteps.length-1)actions.set(number,'prime');else if([2,3,5,7].includes(number)&&i>=1)actions.set(number,'prime');else if(i>=2&&number!==2&&number!==3&&number!==5&&number!==7)actions.set(number,'crossed')})}return `<div class="sieve-intro"><p><strong>Anleitung:</strong> Klicke Schritt für Schritt durch das Sieb. Die grünen Felder sind Primzahlen; durchgestrichene Zahlen sind keine Primzahlen.</p></div><div class="sieve-grid" aria-label="Zahlen von 1 bis 100">${Array.from({length:100},(_,i)=>i+1).map(number=>{const status=actions.get(number)||'';return `<div class="sieve-cell ${status} ${step.numbers.includes(number)?'current':''}" role="img" aria-label="${number}${status==='prime'?' Primzahl':status?' durchgestrichen':''}">${number}</div>`}).join('')}</div><div class="sieve-controls"><button class="sieve-button primary-step" id="sieve-next" type="button">${state.sieveStep<sieveSteps.length-1?step.button:'Sieb zurücksetzen'}</button><span class="sieve-status" aria-live="polite">${state.sieveStep<sieveSteps.length-1?step.message:'Fertig: Die grünen Zahlen sind die Primzahlen bis 100.'}</span></div>`}
function render(){const item=state.items[state.index];state.answered=false;const learn=state.mode==='learn';$('#counter').textContent=`${learn?'Karte':'Aufgabe'} ${state.index+1} von ${state.items.length}`;$('#score').textContent=`${state.score} Punkte`;$('#progress-bar').style.width=`${state.index/state.items.length*100}%`;$('#feedback').className='feedback';$('#feedback').textContent='';$('#hint-button').textContent=learn?'💡 Merksatz':'💡 Tipp';if(learn){const body=item.kind==='sieve'?`${item.text}<div class="example">${item.example}</div>${sieveMarkup()}<p class="discovery"><strong>Merke:</strong> ${item.extra}</p>`:`<p class="explanation">${item.text}</p><div class="example">${item.example}</div><div class="discovery"><strong>Entdecke:</strong> ${item.discovery.prompt}<p>${item.discovery.set}</p><b>${item.discovery.result}</b><p class="rule-callout">${item.discovery.rule}</p><small>${item.discovery.extra}</small></div>`;$('#card').innerHTML=`<div class="rule-number">${item.number}</div><h2>${item.title}</h2>${body}`;if(item.kind==='sieve')$('#sieve-next').addEventListener('click',advanceSieve)}else{$('#card').innerHTML=`<div class="rule-number">${state.mode==='master'?'★':'?'}</div><h2>${state.mode==='master'?'Meisterfrage':'Primzahl-Detektiv'}</h2>${renderTask(item)}`;$$('.option').forEach(button=>button.addEventListener('click',()=>answer(button,item)));const inputField=$('#number-answer');const inputCheck=$('#input-check');inputCheck?.addEventListener('click',()=>answerInput(inputField.value,item));inputField?.addEventListener('keydown',event=>{if(event.key==='Enter')answerInput(inputField.value,item)})}}
function advanceSieve(){if(state.sieveStep>=sieveSteps.length-1){state.sieveStep=0}else state.sieveStep++;render()}
function isCorrect(value,task){if(task.type==='yes-no')return String(value)===String(task.answer);if(task.type==='input')return task.acceptedAnswers.some(answer=>normalize(answer)===normalize(value));return String(value)===String(task.answer)}
function submitAnswer(value,task,button){if(state.answered)return;state.answered=true;const ok=isCorrect(value,task);if(button){$$('.option').forEach(option=>option.disabled=true);button.classList.add(ok?'correct':'wrong')}if(task.type==='input'){$('#number-answer')?.setAttribute('disabled','disabled');if($('#input-check'))$('#input-check').disabled=true}if(ok){state.correct++;state.score+=10;$('#feedback').className='feedback show good';$('#feedback').textContent=`✅ Richtig! ${task.explanation}`;beep(true)}else{$('#feedback').className='feedback show';$('#feedback').textContent=`Noch nicht. ${task.explanation}`;beep(false)}$('#score').textContent=`${state.score} Punkte`;save()}
function answer(button,task){const selected=task.type==='yes-no'?button.dataset.answer==='Ja':button.dataset.answer;submitAnswer(selected,task,button)}
function answerInput(value,task){submitAnswer(value.trim(),task,null)}
function next(){if(state.index>=state.items.length-1){finish();return}state.index++;state.sieveStep=0;render()}
function finish(){$('#finish-score').textContent=state.score;$('#finish-correct').textContent=`${state.correct}/${state.items.length}`;$('#finish-message').textContent=state.correct===state.items.length?'Du erkennst Primzahlen sicher und hast das Sieb gemeistert.':'Guter Start – wiederhole die Karten und versuche es noch einmal.';show('finish-screen')}
function startMode(){state.index=0;state.score=0;state.correct=0;state.sieveStep=0;state.items=state.mode==='learn'?learnCards:state.mode==='practice'?practiceTasks:masterTasks;$('#mode-label').textContent=state.mode==='learn'?'ENTDECKEN':state.mode==='practice'?'TRAINIEREN':'MEISTERPRÜFUNG';$('#activity-title').textContent=state.mode==='learn'?'Primzahl-Karte':state.mode==='practice'?'Primzahl-Detektiv':'Meisterprüfung';show('activity-screen');render()}
$$('.mode-card').forEach(button=>button.addEventListener('click',()=>{$$('.mode-card').forEach(card=>card.classList.remove('selected'));button.classList.add('selected');state.mode=button.dataset.mode}));$('#start-button').addEventListener('click',startMode);$('#next-button').addEventListener('click',next);$('#hint-button').addEventListener('click',()=>{const item=state.items[state.index];$('#feedback').className='feedback show';$('#feedback').textContent=state.mode==='learn'?(item.kind==='sieve'?`Merksatz: ${item.extra}`:`Merksatz: ${item.discovery.rule}`):`Tipp: ${item.explanation}`});$('#back-button').addEventListener('click',()=>show('start-screen'));$('#home-button').addEventListener('click',()=>show('start-screen'));$('#again-button').addEventListener('click',startMode);$('#sound-toggle').addEventListener('click',event=>{state.sound=!state.sound;event.currentTarget.textContent=state.sound?'🔊 Ton':'🔇 Ton';event.currentTarget.setAttribute('aria-pressed',state.sound)});
