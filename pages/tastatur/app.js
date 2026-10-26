import {rows,keys,functionKeys,navigation,numpad,output,needed,edit,assess,score,guidance,levels} from './engine.js';
const $=id=>document.getElementById(id), typing=$('typing');
let mode=0,tasks=levels[0].tasks,index=0,correct=0,errors=0,started=null,finished=null,previous='',shift=false,caps=false,alt=false,num=true,dead='',physicalShift=false,physicalAlt=false,flashTimers=new Map(),advanceTimer;
const buttons=new Map();
function makeKey(k){
 const b=document.createElement('button');b.type='button';b.className='key'+(k.label!==undefined?' action':'');b.dataset.code=k.code;
 b.setAttribute('aria-label',k.label || (k.code==='Space'?'Leertaste':`${k.base==='ß'?'ß':k.base.toUpperCase()}${k.shifted!==k.base && !/[a-zäöü]/.test(k.base)?' / '+k.shifted:''}${k.alt?' / Alt Gr '+k.alt:''}`));
 if(k.label!==undefined)b.textContent=k.label;else{const upper=document.createElement('span');upper.className='upper';upper.textContent=/[a-zäöü]/.test(k.base)?'':k.shifted!==k.base?k.shifted:'';const base=document.createElement('span');base.className='base';base.textContent=k.code==='Space'?'Leertaste':/[a-zäöü]/.test(k.base)?k.base.toUpperCase():k.base;const a=document.createElement('span');a.className='alt';a.textContent=k.alt;b.append(upper,base,a);}
 // Pointer presses preserve the text selection; keyboard activation remains native.
 b.addEventListener('pointerdown',e=>e.preventDefault());b.addEventListener('click',()=>virtualKey(k));buttons.set(k.code,b);return b;
}
functionKeys.forEach(k=>$('functions').append(makeKey(k)));
rows.forEach((row,r)=>{let col=1;row.forEach(k=>{if(k.code!=='EnterFoot'){const b=makeKey(k);b.style.gridColumn=`${col} / span ${k.width}`;b.style.gridRow=r+1;if(k.code==='Enter'){b.classList.add('enter');b.style.gridRow='2 / span 2';}$('main-keys').append(b);}col+=k.width;});});
navigation.forEach((k,i)=>{const b=makeKey(k);b.style.gridColumn=i<6?i%3+1:({ArrowUp:2,ArrowLeft:1,ArrowDown:2,ArrowRight:3})[k.code];b.style.gridRow=i<6?Math.floor(i/3)+1:k.code==='ArrowUp'?4:5;$('navigation').append(b);});
const numPositions=[[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[4,2],[1,3],[2,3],[3,3],[1,4],[2,4],[3,4],[4,4],[1,5],[3,5]];
numpad.forEach((k,i)=>{const b=makeKey(k);const [col,row]=numPositions[i];b.style.gridColumn=`${col} / span ${k.code==='Numpad0'?2:1}`;b.style.gridRow=`${row} / span ${['NumpadAdd','NumpadEnter'].includes(k.code)?2:1}`;$('numpad').append(b);});
levels.forEach((level,i)=>{const b=document.createElement('button');const badge=document.createElement('b');badge.textContent=i+1;b.append(badge,document.createTextNode(level.title));b.addEventListener('click',()=>start(i));$('levels').append(b);});
const explanations={ShiftLeft:'Halte Shift gedrückt und drücke gleichzeitig die andere Taste. Virtuell: Shift einmal anklicken, dann das Zeichen.',ShiftRight:'Beide Umschalttasten funktionieren gleich: Shift halten, dann die andere Taste drücken.',CapsLock:'Die Feststelltaste bleibt an, bis du sie erneut drückst. Im deutschen Windows-Layout verändert sie auch viele Zahlen und Satzzeichen! Shift kehrt ihre Wirkung kurz um.',Space:'Mit der langen Leertaste machst du einen Abstand zwischen zwei Wörtern.',Backspace:'Die Rücktaste löscht das Zeichen LINKS vom Cursor.',Delete:'Entf löscht das Zeichen RECHTS vom Cursor.',Enter:'Enter beginnt im freien Schreiben eine neue Zeile. In Übungen bestätigt Enter einen fertigen Text.',NumpadEnter:'Enter bestätigt die Eingabe oder beginnt eine neue Zeile.',Tab:'Tab wechselt zur nächsten Schaltfläche. Schalte im freien Schreiben „Tabulator im Text üben“ ein, um einen Tabulator einzufügen. Umschalt + Tab verlässt das Feld.',ArrowLeft:'Mit ← bewegst du den Cursor nach links, ohne etwas zu löschen.',ArrowRight:'Mit → bewegst du den Cursor nach rechts, ohne etwas zu löschen.',ArrowUp:'Mit ↑ bewegst du den Cursor in die Zeile darüber.',ArrowDown:'Mit ↓ bewegst du den Cursor in die Zeile darunter.',Home:'Pos1 setzt den Cursor an den Anfang der Zeile.',End:'Ende setzt den Cursor an das Ende der Zeile.',AltRight:'Halte Alt Gr für das kleine Zeichen unten rechts auf einer Taste, zum Beispiel @. Virtuell: Alt Gr anklicken, dann Q.',NumLock:'Num schaltet den Nummernblock zwischen Zahlen und Cursorsteuerung um.',Insert:'Einfg kann in anderen Programmen zwischen Einfügen und Überschreiben umschalten. Hier bleiben wir im Einfügemodus.'};
function task(){return tasks[index];}
function hint(){if(finished!==null)return {codes:[],message:'Geschafft! Wähle eine andere Lernstufe oder starte neu.'};return mode==='free'?{codes:[],message:'Schreibe frei. Enter beginnt eine neue Zeile.'}:guidance(typing.value,task().target,typing.selectionStart,mode===4);}
function liveStats(){const stats=score(correct,errors);const seconds=started?Math.max(0,Math.round(((finished??Date.now())-started)/1000)):0;$('live-stats').hidden=mode!==5;$('live-stats').textContent=`${correct} richtige Zeicheneingaben · ${errors} Fehler · ${stats.accuracy} % Genauigkeit · ${seconds} s`;}
setInterval(liveStats,1000);
function render(){
 liveStats();
 const h=hint();const codes=h.codes.length?h.codes:needed(h.char,caps);
 buttons.forEach((b,code)=>{b.classList.toggle('needed',codes.includes(code));b.classList.toggle('on',code==='CapsLock'&&caps||code==='NumLock'&&num||code.startsWith('Shift')&&(shift||physicalShift)||code==='AltRight'&&(alt||physicalAlt));if(['CapsLock','NumLock','ShiftLeft','ShiftRight','AltRight'].includes(code))b.setAttribute('aria-pressed',String(b.classList.contains('on')));});
 $('modifiers').textContent=[caps?'Feststell an':'',shift||physicalShift?'Shift an':'',alt||physicalAlt?'Alt Gr an':'',dead?'Akzent wartet':''].filter(Boolean).join(' · ');
 $('marked').replaceChildren();if(mode!=='free')for(let i=0;i<typing.value.length;i++){const span=document.createElement('span');span.className=typing.value[i]===task().target[i]?'correct':'wrong';span.textContent=typing.value[i]===' '?'␣':typing.value[i]==='\t'?'⇥':typing.value[i];$('marked').append(span);}
 $('next').hidden=mode==='free'||typing.value!==task().target||finished!==null;
 $('feedback').textContent=feedbackOverride||h.message;
 $('help').textContent=codes.map(code=>explanations[code]).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' ')|| (mode==='free'?'Klicke eine Taste an oder schreibe mit der echten Tastatur.':'Die blau umrandete Taste ist als Nächstes dran. '+h.message);
 if(mode!=='free'){let matched=0;while(matched<task().target.length&&typing.value[matched]===task().target[matched])matched++;$('progress').value=100*(index+matched/task().target.length)/tasks.length;}
}
function loadTask(){
 clearTimeout(advanceTimer);feedbackOverride='';previous=mode==='free'?'':task().initial||'';typing.value=previous;typing.readOnly=false;typing.setSelectionRange(previous.length,previous.length);
 $('target').textContent=mode==='free'?'Dein Text, deine Ideen.':task().target;
 $('instruction').textContent=mode==='free'?'Du kannst zum Beispiel über dein Lieblingsfach schreiben. Dein Text wird nicht gespeichert.':task().instruction||levels[mode].intro;
 $('position').textContent=mode==='free'?'Ohne Bewertung':`Aufgabe ${index+1} von ${tasks.length}`;
 $('task-title').textContent=mode==='free'?'Freies Schreiben':customTitle||levels[mode].title;
 $('results').hidden=true;$('progress').hidden=mode==='free';$('tab-option').hidden=mode!=='free';render();typing.focus({preventScroll:true});
}
let customTitle='';
function start(nextMode,customTasks=null,title=''){
 mode=nextMode;customTitle=title;tasks=customTasks||(mode==='free'?[]:levels[mode].tasks);index=0;correct=0;errors=0;started=null;finished=null;shift=false;caps=false;alt=false;dead='';$('tab-in-text').checked=false;
 [...$('levels').children].forEach((b,i)=>{b.classList.toggle('active',i===mode);b.setAttribute('aria-current',i===mode?'step':'false');});$('free').classList.toggle('active',mode==='free');loadTask();
}
function flash(code,good){const b=buttons.get(code);if(!b)return;clearTimeout(flashTimers.get(code));b.classList.remove('good','bad');b.classList.add(good?'good':'bad');flashTimers.set(code,setTimeout(()=>b.classList.remove('good','bad'),380));}
let lastCode='',feedbackOverride='';
function evaluate(){
 if(typing.value===previous){render();return;}feedbackOverride='';if(!started)started=Date.now();
 if(mode!=='free'){
  const result=assess(previous,typing.value,task().target,mode===4);correct+=result.correct;errors+=result.errors;
  flash(lastCode||needed(result.delta.inserted[0],caps).at(-1),result.errors===0);
  previous=typing.value;render();
  if(result.errors){const expected=task().target[result.delta.start];feedbackOverride=expected===' '?'Hier fehlt ein Leerzeichen. Lösche den Fehler und drücke die Leertaste.':expected&&expected.toLowerCase()===result.delta.inserted.toLowerCase()?'Der Buchstabe stimmt, aber seine Größe nicht. Prüfe Shift und Feststell.':'Noch nicht richtig. '+hint().message;$('feedback').textContent=feedbackOverride;}
  if(result.complete&&mode===0){const current=index;advanceTimer=setTimeout(()=>{if(mode===0&&index===current&&typing.value===task().target)next();},500);}
 }else{previous=typing.value;flash(lastCode,true);render();}
}
function next(){
 if(mode==='free'||typing.value!==task().target||finished!==null)return;
 if(index+1<tasks.length){index++;loadTask();return;}
 finished=Date.now();typing.readOnly=true;$('next').hidden=true;$('progress').value=100;
 const stats=score(correct,errors);const seconds=started?Math.max(1,Math.round((finished-started)/1000)):0;
 const section=$('results');section.replaceChildren();const heading=document.createElement('h2');heading.textContent='Stark! Lernstufe geschafft.';const stars=document.createElement('div');stars.className='stars';stars.textContent='★'.repeat(stats.stars)+'☆'.repeat(3-stats.stars);stars.setAttribute('aria-label',`${stats.stars} von 3 Sternen`);const p=document.createElement('p');p.textContent=`${correct} richtige Zeicheneingaben · ${errors} Fehler · ${stats.accuracy} % Genauigkeit · ${seconds} Sekunden`;const note=document.createElement('p');note.textContent='Sterne: ab 98 % drei, ab 90 % zwei. Fehler bleiben auch nach dem Korrigieren gezählt. Die Zeit gibt keine Punkte.';section.append(heading,stars,p,note);section.hidden=false;$('feedback').textContent='Geschafft! Wähle eine andere Lernstufe oder starte neu.';
}
function virtualKey(k){
 lastCode=k.code;
 if(k.code.startsWith('Shift')){shift=!shift;render();return;}
 if(k.code==='CapsLock'){caps=!caps;render();return;}
 if(k.code==='AltRight'){alt=!alt;render();return;}
 if(k.code==='NumLock'){num=!num;render();return;}
 if(typing.readOnly)return;
 let command=output(k,{shift:shift||physicalShift,caps,alt:alt||physicalAlt,num});
 if(command===null){
  if(k.code==='Enter'||k.code==='NumpadEnter'){if(mode==='free')command='\n';else{next();if(finished===null)render();return;}}
  else if(k.code==='Tab'){if(mode==='free'&&$('tab-in-text').checked)command='\t';else{($('next').hidden?$('restart'):$('next')).focus();$('feedback').textContent=explanations.Tab;return;}}
  else if(['Backspace','Delete','Home','End','PageUp','PageDown','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k.code))command=k.code;
  else{$('feedback').textContent=explanations[k.code]||'Diese Taste steuert Windows oder ein Programm. Wir lösen hier keine Systembefehle aus.';return;}
 }
 if(['^','´','`'].includes(command)&&['Backquote','Equal'].includes(k.code)){dead=command;shift=false;alt=false;render();return;}
 if(dead&&command.length===1){const combining={'^':'\u0302','´':'\u0301','`':'\u0300'}[dead];const composed=(command+combining).normalize('NFC');command=command===' '||command===dead?dead:composed.length===1?composed:dead+command;dead='';}
 if(command==='Backspace'&&dead){dead='';render();return;}
 const result=edit(typing.value,typing.selectionStart,typing.selectionEnd,command);
 if(result.text.length>500){$('feedback').textContent='Dein Text ist schon 500 Zeichen lang.';return;}
 typing.focus({preventScroll:true});typing.value=result.text;typing.setSelectionRange(result.cursor,result.cursor);shift=false;alt=false;evaluate();
}
// Let the browser process real text editing, selections, IME and OS shortcuts.
typing.addEventListener('input',e=>{if(!e.isComposing)evaluate();});typing.addEventListener('compositionend',evaluate);
typing.addEventListener('paste',e=>{if(mode!=='free'){e.preventDefault();$('feedback').textContent='Tippe selbst – Einfügen zählt hier nicht als Übung.';}});
typing.addEventListener('drop',e=>{if(mode!=='free')e.preventDefault();});
typing.addEventListener('keydown',e=>{
 lastCode=e.code;caps=e.getModifierState('CapsLock');if(e.code==='NumLock'||e.location===3)num=e.getModifierState('NumLock');physicalShift=e.shiftKey;physicalAlt=e.getModifierState('AltGraph');buttons.get(e.code)?.classList.add('pressed');render();
 if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
 if(e.key==='Tab'&&mode==='free'&&$('tab-in-text').checked&&!e.shiftKey){e.preventDefault();virtualKey({code:'Tab',label:'Tab'});return;}
 if(e.key==='Enter'&&mode!=='free'){e.preventDefault();if(typing.value===task().target)next();else{feedbackOverride='Der Text ist noch nicht fertig. '+hint().message;$('feedback').textContent=feedbackOverride;}return;}
});
typing.addEventListener('keyup',e=>{buttons.get(e.code)?.classList.remove('pressed');physicalShift=e.shiftKey;physicalAlt=e.getModifierState('AltGraph');caps=e.getModifierState('CapsLock');render();});
window.addEventListener('blur',()=>{physicalShift=false;physicalAlt=false;buttons.forEach(b=>b.classList.remove('pressed'));render();});
typing.addEventListener('click',render);typing.addEventListener('select',render);
$('free').addEventListener('click',()=>start('free'));$('restart').addEventListener('click',()=>start(mode,customTitle?tasks:null,customTitle));$('next').addEventListener('click',next);
$('help-toggle').addEventListener('click',()=>{$('help').hidden=!$('help').hidden;$('help-toggle').setAttribute('aria-expanded',String(!$('help').hidden));});
// No dead localhost teacher link on GitHub Pages; static student hosting has no PHP.
if(location.hostname.endsWith('github.io'))$('teacher-link').hidden=true;
start(0);
const exercise=new URLSearchParams(location.search).get('exercise');
if(exercise&&/^\d+$/.test(exercise)){
 try{const response=await fetch(`/teacher/tastatur/${exercise}/data`,{headers:{Accept:'application/json'},cache:'no-store'});if(!response.ok)throw Error();const content=await response.json();start(content.level-1,content.texts.map(target=>({target})),content.title);}catch{$('feedback').textContent='Die Lehrerübung konnte nicht geladen werden. Öffne sie über den angemeldeten Lehrerbereich.';}
}
