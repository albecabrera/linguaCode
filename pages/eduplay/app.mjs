import {activities} from './examples.mjs';
import {routeFromURL,activityURL} from './routes.mjs';
import {createDraftStore} from './storage.mjs';
import {mountStudio} from './studio.mjs';
import {mountQuiz} from './quiz.mjs';
import {mountMemory} from './memory.mjs';
import {mountCrossword} from './crossword-ui.mjs';
import {mountClassification} from './classification.mjs';

const app=document.querySelector('#app');let cleanup=()=>{};
const labels={quiz:'Quiz',memory:'Memory',crossword:'Kreuzworträtsel',classification:'Klassifikation'};
const games={quiz:mountQuiz,memory:mountMemory,crossword:mountCrossword,classification:mountClassification};
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function button(text,action){const b=el('button',text);b.type='button';b.addEventListener('click',action);return b;}
function navigate(search){history.pushState(null,'',search);render();window.scrollTo(0,0);}
function share(activity) {
  const url=activityURL(location.href,activity.id),input=document.querySelector('#share-url'),status=document.querySelector('#share-status');
  input.value=url;status.textContent='';
  try {const qr=qrcode(0,'M');qr.addData(url);qr.make();document.querySelector('#qr').src=qr.createDataURL(6,4);document.querySelector('#share').showModal();}
  catch {status.textContent='QR-Code konnte nicht erstellt werden.';document.querySelector('#share').showModal();}
}
function play(activity, preview=false, back=()=>navigate('./')) {
  cleanup();app.replaceChildren();
  const top=el('div');top.className='game-heading';top.append(button('← Zurück',back),el('p',`${labels[activity.type]} · ${activity.subject} · Klasse ${activity.grade}${preview?' · Vorschau (lokaler Entwurf)':''}`),el('h1',activity.title),el('p',activity.description));
  if(!preview)top.append(button('Link / QR-Code',()=>share(activity)));
  const area=el('section');area.className=`game-panel ${activity.type}`;app.append(top,area);
  cleanup=games[activity.type](area,activity)||(()=>{});
}
function home(){
  app.replaceChildren();const hero=el('section');hero.className='hero';hero.append(el('p','ENTDECKEN · SPIELEN · LERNEN'),el('h1','EduPlay'),el('p','Entdecke interaktive Lernspiele und übe in deinem Tempo.'));
  const tiles=el('div');tiles.className='type-grid';for(const [type,label] of Object.entries(labels)){const tile=el('div');tile.className=`type-tile ${type}`;tile.append(el('h2',label));tiles.append(tile);}hero.append(tiles);app.append(hero);
  const filters=el('div');filters.className='filters';
  const search=el('input');search.type='search';search.placeholder='Aktivität suchen';search.setAttribute('aria-label','Aktivität suchen');
  const subject=el('select'),grade=el('select');subject.setAttribute('aria-label','Fach');grade.setAttribute('aria-label','Klassenstufe');
  function options(select,values,all){const first=el('option',all);first.value='';select.append(first);for(const value of values){const opt=el('option',value);opt.value=value;select.append(opt);}}
  options(subject,[...new Set(activities.map(a=>a.subject))].sort(),'Alle Fächer');options(grade,[...new Set(activities.map(a=>a.grade))].sort((a,b)=>Number(a)-Number(b)),'Alle Klassen');filters.append(search,subject,grade);
  const heading=el('h2','Aktivitäten'),grid=el('div');grid.className='activity-grid';const empty=el('p','Keine passenden Aktivitäten gefunden.');empty.hidden=true;app.append(heading,filters,grid,empty);
  function update(){grid.replaceChildren();const visible=activities.filter(a=>a.title.toLocaleLowerCase('de').includes(search.value.trim().toLocaleLowerCase('de'))&&(!subject.value||a.subject===subject.value)&&(!grade.value||a.grade===grade.value));empty.hidden=visible.length>0;
    for(const a of visible){const card=el('article');card.className=`activity-card ${a.type}`;card.append(el('p',`${labels[a.type]} · ${a.subject} · Klasse ${a.grade}`),el('h3',a.title),el('p',a.description));const link=el('a','Spiel öffnen');link.href=activityURL(location.href,a.id);card.append(link,button('Link / QR',()=>share(a)));grid.append(card);}}
  [search,subject,grade].forEach(x=>x.addEventListener('input',update));update();
}
function render(){cleanup();cleanup=()=>{};const route=routeFromURL(location.href);
  if(route.view==='home')return home();
  if(route.view==='studio'){try{const store=createDraftStore(localStorage);cleanup=mountStudio(app,store,(activity,back)=>play(activity,true,()=>{cleanup();cleanup=()=>{};back();}));}catch{app.replaceChildren(el('p','Lokaler Speicher ist nicht verfügbar.'));}return;}
  const activity=activities.find(a=>a.id===route.id);if(activity)return play(activity);
  app.replaceChildren(el('h1','Aktivität nicht gefunden'),el('p','Dieser Link verweist auf keine hier veröffentlichte Aktivität.'),button('Zur Übersicht',()=>navigate('./')));
}
window.addEventListener('popstate',render);
document.querySelector('#share-close').addEventListener('click',()=>document.querySelector('#share').close());
document.querySelector('#copy').addEventListener('click',async()=>{const input=document.querySelector('#share-url');try{await navigator.clipboard.writeText(input.value);document.querySelector('#share-status').textContent='Link kopiert.';}catch{input.select();document.querySelector('#share-status').textContent='Bitte den markierten Link manuell kopieren.';}});
document.querySelector('#print').addEventListener('click',()=>window.print());
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#fullscreen').textContent='Vollbild nicht verfügbar';}});
render();
