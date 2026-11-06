import {validateActivity, importActivity, exportActivity} from './model.mjs';
import {generateCrossword} from './crossword.mjs';

const id = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const el = (tag,text) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
export function normalizePairCount(value, pairTotal) {
  const count = Number(value);
  return Number.isInteger(count) && count >= 1 && count <= pairTotal ? count : undefined;
}
export function updatePairCountSetting(activity, rawValue) {
  const count = normalizePairCount(rawValue, activity.content.pairs.length);
  if (count === undefined) delete activity.settings.pairCount;
  else activity.settings.pairCount = count;
  return count;
}
export function syncPairCountControl(input, activity) {
  const pairTotal = activity.content.pairs.length;
  input.max = String(Math.max(1, pairTotal));
  const count = normalizePairCount(activity.settings.pairCount, pairTotal);
  if (count === undefined) {
    delete activity.settings.pairCount;
    input.value = pairTotal ? String(pairTotal) : '';
  } else input.value = String(count);
}
function button(text,action) {const b=el('button',text);b.type='button';b.addEventListener('click',action);return b;}
function freshId(existingIds) { let value; do value=id(); while(existingIds.has(value)); return value; }
function download(activity) {
  const url=URL.createObjectURL(new Blob([exportActivity(activity)],{type:'application/json'}));
  const link=el('a');link.href=url;link.download=`eduplay-${activity.id.replace(/[^a-z0-9_-]/gi,'-')}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function blank(type) {
  const stamp=new Date().toISOString();
  const content={quiz:{questions:[]},memory:{pairs:[]},crossword:{words:[]},classification:{categories:[],items:[]}}[type];
  return {id:id(),schemaVersion:1,type,title:'',description:'',subject:'Informatik',grade:'6',language:'de',createdAt:stamp,updatedAt:stamp,settings:{},content};
}
export function mountStudio(container, store, preview) {
  function displayError(target,error){target.textContent=error instanceof Error?error.message:String(error);}
  function list() {
    container.replaceChildren();container.append(el('h2','EduPlay Studio'),el('p','Entwürfe werden nur in diesem Browser auf diesem Gerät gespeichert. Es gibt keinen geschützten Lehrerbereich und keine automatische Veröffentlichung.'));
    const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const types=el('select');for(const [value,label] of [['quiz','Quiz'],['memory','Memory'],['crossword','Kreuzworträtsel'],['classification','Klassifikation']]){const o=el('option',label);o.value=value;types.append(o);}types.setAttribute('aria-label','Spieltyp');
    const create=button('Neue Aktivität erstellen',()=>edit(blank(types.value)));
    const file=el('input');file.type='file';file.accept='.json,application/json';file.setAttribute('aria-label','Aktivität als JSON importieren');
    file.addEventListener('change',async()=>{try{const f=file.files[0];if(!f)return;if(f.size>1024*1024)throw new Error('Die Datei darf höchstens 1 MB groß sein.');const activity=importActivity(await f.text());const existingIds=new Set(store.list().map(draft=>draft.id));let notice='';if(existingIds.has(activity.id)){activity.id=freshId(existingIds);notice='Eine Aktivität mit dieser ID ist bereits vorhanden. Der Import wurde als neue lokale Kopie geöffnet.';}edit(activity,notice);}catch(error){displayError(status,error);}});
    container.append(types,create,file,status);
    let drafts;try{drafts=store.list();}catch(error){displayError(status,error);return;}
    if(!drafts.length)container.append(el('p','Noch keine lokalen Entwürfe vorhanden.'));
    for(const activity of drafts){
      const card=el('article');card.className='studio-card';card.append(el('h3',activity.title),el('p',`${activity.subject} · Klasse ${activity.grade} · lokaler Entwurf`));
      card.append(button('Bearbeiten',()=>edit(structuredClone(activity))),button('Vorschau',()=>preview(activity,()=>list())),button('Duplizieren',()=>{const copy=structuredClone(activity);copy.id=id();copy.title+=' (Kopie)';copy.createdAt=copy.updatedAt=new Date().toISOString();try{store.save(copy);list();}catch(error){displayError(status,error);}}),button('Exportieren',()=>{try{download(activity);}catch(error){displayError(status,error);}}),button('Löschen',()=>{if(confirm(`„${activity.title}“ endgültig aus diesem Browser löschen?`)){try{store.remove(activity.id);list();}catch(error){displayError(status,error);}}}));container.append(card);
    }
  }
  function edit(activity,notice='') {
    container.replaceChildren();container.append(button('← Meine Aktivitäten',list),el('h2','Aktivität bearbeiten'),el('p','Änderungen sind erst nach „Lokal speichern“ in diesem Browser gesichert.'),...(notice ? [el('p',notice)] : []));
    const form=el('div');form.className='studio-form';
    function field(parent,label,obj,key,options={}) {
      const wrapper=el('label',label);let input;
      if(options.select){input=el('select');for(const [value,text] of options.select){const o=el('option',text);o.value=value;input.append(o);}input.value=obj[key]??'';}
      else {input=el(options.multiline?'textarea':'input');if(!options.multiline)input.type=options.type||'text';input.value=obj[key]??'';}
      input.addEventListener('input',()=>{obj[key]=input.value;});wrapper.append(input);parent.append(wrapper);return input;
    }
    field(form,'Titel',activity,'title');field(form,'Beschreibung',activity,'description',{multiline:true});field(form,'Fach',activity,'subject');field(form,'Klassenstufe',activity,'grade',{select:Array.from({length:9},(_,i)=>[String(i+5),String(i+5)])});
    const language=field(form,'Sprache',activity,'language',{select:[['de','Deutsch'],['es','Spanisch'],['en','Englisch']]});language.value=activity.language;
    const timer=el('label','Timer aktivieren '), check=el('input');check.type='checkbox';check.checked=!!activity.settings.timerEnabled;check.addEventListener('change',()=>{activity.settings.timerEnabled=check.checked;});timer.append(check);form.append(timer);
    let pairInput;
    if(activity.type==='memory'){
      const shuffle=el('label','Karten mischen '), shuffleCheck=el('input');shuffleCheck.type='checkbox';shuffleCheck.checked=activity.settings.shuffleCards !== false;shuffleCheck.addEventListener('change',()=>{activity.settings.shuffleCards=shuffleCheck.checked;});shuffle.append(shuffleCheck);form.append(shuffle);
      const pairCount=el('label','Anzahl der Paare ');pairInput=el('input');pairInput.type='number';pairInput.min='1';pairInput.addEventListener('input',()=>{updatePairCountSetting(activity,pairInput.value);});syncPairCountControl(pairInput,activity);pairCount.append(pairInput);form.append(pairCount);
      const difficulty=el('label','Schwierigkeit '), difficultySelect=el('select');for(const [value,label] of [['easy','Leicht'],['medium','Mittel'],['hard','Schwer']]){const option=el('option',label);option.value=value;difficultySelect.append(option);}difficultySelect.value=activity.settings.difficulty || 'medium';difficultySelect.addEventListener('change',()=>{activity.settings.difficulty=difficultySelect.value;});difficulty.append(difficultySelect);form.append(difficulty);
    }
    const items=el('div');
    function collection(title,array,add,draw) {
      const section=el('section');section.className='studio-section';section.append(el('h3',title));
      array.forEach((item,index)=>{
        const box=el('fieldset');box.append(el('legend',`${title} ${index+1}`));draw(box,item,index);
        const up=button('↑',()=>{if(index>0){[array[index-1],array[index]]=[array[index],array[index-1]];renderItems();}});up.setAttribute('aria-label',`${title} ${index+1} nach oben verschieben`); const down=button('↓',()=>{if(index<array.length-1){[array[index+1],array[index]]=[array[index],array[index+1]];renderItems();}});down.setAttribute('aria-label',`${title} ${index+1} nach unten verschieben`); const remove=button('Entfernen',()=>{array.splice(index,1);renderItems();});remove.setAttribute('aria-label',`${title} ${index+1} entfernen`);box.append(up,down,remove);section.append(box);
      });section.append(button('Hinzufügen',()=>{array.push(add());renderItems();}));items.append(section);
    }
    function renderItems(){
      items.replaceChildren();const c=activity.content;
      if(activity.type==='quiz')collection('Frage',c.questions,()=>({id:id(),question:'',type:'single-choice',options:[{id:id(),text:''},{id:id(),text:''}],correctOptionIds:[],explanation:''}),(box,q)=>{
        field(box,'Frage',q,'question');field(box,'Typ',q,'type',{select:[['single-choice','Eine richtige Antwort'],['multiple-choice','Mehrere richtige Antworten'],['true-false','Richtig / Falsch']]});
        q.options.forEach((option,index)=>{const row=el('div');field(row,`Antwort ${index+1}`,option,'text');const label=el('label','Richtig '),mark=el('input');mark.type='checkbox';mark.checked=q.correctOptionIds.includes(option.id);mark.addEventListener('change',()=>{q.correctOptionIds=mark.checked?[...new Set([...q.correctOptionIds,option.id])]:q.correctOptionIds.filter(x=>x!==option.id);});label.append(mark);const remove=button('Antwort entfernen',()=>{if(q.options.length>2){q.options.splice(index,1);q.correctOptionIds=q.correctOptionIds.filter(x=>x!==option.id);renderItems();}});remove.setAttribute('aria-label',`Antwort ${index+1} entfernen`);row.append(label,remove);box.append(row);});
        box.append(button('Antwort hinzufügen',()=>{if(q.options.length<4){q.options.push({id:id(),text:''});renderItems();}}));field(box,'Erklärung (optional)',q,'explanation',{multiline:true});
      });
      if(activity.type==='memory')collection('Paar',c.pairs,()=>({id:id(),first:'',second:''}),(box,p)=>{for(const [key,label] of [['first','Erste Karte'],['second','Zweite Karte']]){if(typeof p[key]==='string')p[key]={text:p[key],image:''};field(box,`${label}: Text`,p[key],'text');field(box,`${label}: Bildadresse (optional)`,p[key],'image');}});
      if(activity.type==='crossword')collection('Wort',c.words,()=>({id:id(),word:'',clue:''}),(box,w)=>{field(box,'Wort',w,'word');field(box,'Hinweis',w,'clue');});
      if(activity.type==='classification'){
        collection('Kategorie',c.categories,()=>({id:id(),name:''}),(box,c)=>field(box,'Name',c,'name'));
        collection('Begriff',c.items,()=>({id:id(),text:'',categoryId:c.categories[0]?.id||''}),(box,item)=>{field(box,'Begriff',item,'text');field(box,'Kategorie',item,'categoryId',{select:[['','Bitte wählen'],...c.categories.map(x=>[x.id,x.name])]});});
      }
      if(activity.type==='memory')syncPairCountControl(pairInput,activity);
    }
    renderItems();const status=el('p');status.setAttribute('role','alert');status.setAttribute('aria-live','assertive');
    function validate(){const errors=validateActivity(activity);if(activity.type==='crossword'&&!errors.length){const result=generateCrossword(activity.content.words);if(result.unplaced.length)errors.push(`Nicht platzierbar: ${result.unplaced.map(w=>w.word).join(', ')}.`);}if(errors.length){status.textContent=errors.join(' ');return false;}status.textContent='Aktivität ist gültig.';return true;}
    const actions=el('div');actions.append(button('Validieren',validate),button('Vorschau',()=>{if(validate())preview(structuredClone(activity),()=>edit(activity));}),button('Lokal speichern',()=>{activity.updatedAt=new Date().toISOString();if(validate())try{store.save(activity);list();}catch(error){displayError(status,error);}}),button('JSON exportieren',()=>{activity.updatedAt=new Date().toISOString();if(validate())try{download(activity);}catch(error){displayError(status,error);}}));
    container.append(form,items,actions,status);
  }
  list();return ()=>{};
}
