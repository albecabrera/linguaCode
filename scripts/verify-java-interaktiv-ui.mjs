// DOM logic harness; real browser/device rendering is a separate check.
import fs from 'node:fs';import assert from 'node:assert/strict';
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.value='';this.hidden=false;this.disabled=false;this.checked=false;this.classList={toggle(){}};}
 append(...children){this.children.push(...children);}replaceChildren(...children){this.children=children;}addEventListener(type,fn){(this.events[type]??=[]).push(fn);}fire(type,event={}){for(const fn of this.events[type]||[])fn(event);}closest(){return null;}
}
const html=fs.readFileSync(new URL('../pages/java-interaktiv/index.html',import.meta.url),'utf8');const nodes=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));const $=id=>nodes.get(id);$('set').value='all';$('mode').value='learn';
const keys={};globalThis.document={getElementById:$,createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),body:new Element()};globalThis.window={addEventListener:(key,fn)=>keys[key]=fn,confirm:()=>true};let saved={};globalThis.localStorage={getItem:key=>saved[key]||null,setItem:(key,value)=>saved[key]=value};globalThis.fetch=async()=>({ok:true,text:async()=>fs.readFileSync(new URL('../pages/java-interaktiv/cards.md',import.meta.url),'utf8')});
await import('../pages/java-interaktiv/app.mjs');
assert.equal($('choices').children.length,78);assert.equal($('card').hidden,false);assert.equal($('prev').disabled,true);assert.equal($('answer-panel').hidden,true);assert.equal($('known').disabled,true);
$('reveal').fire('click');assert.equal($('answer-panel').hidden,false);$('known').fire('click');assert.equal($('progress').value,1);assert.equal(JSON.parse(saved['linguacode-java-cards-v1'])[1],'known');
$('next').fire('click');assert.equal($('answer-panel').hidden,true);assert.equal($('known').disabled,true);$('prev').fire('click');assert.equal($('answer-panel').hidden,true);
$('set').value='0';$('set').fire('change');$('mode').value='quiz';$('mode').fire('change');$('next').fire('click');$('next').fire('click');assert.equal($('quiz').children.length,4);assert.equal($('reveal').hidden,true);$('reveal').fire('click');assert.equal($('answer-panel').hidden,true);
$('quiz').children.find(b=>b.textContent==='HalloWelt ist der Name der Klasse.').fire('click');assert.equal($('answer-panel').hidden,false);assert.equal($('feedback').textContent,'Richtig.');assert.ok($('quiz').children.every(b=>b.disabled));
$('next').fire('click');$('next').fire('click');$('next').fire('click');$('next').fire('click');$('next').fire('click');assert.equal($('next').disabled,true);
$('set').value='8';$('set').fire('change');$('next').fire('click');$('next').fire('click');$('next').fire('click');assert.equal($('simulation').hidden,true);$('quiz').children.find(b=>b.textContent==='24.').fire('click');assert.equal($('simulation').hidden,false);
$('mode').value='teacher';$('mode').fire('change');assert.equal($('answer-panel').hidden,true);
$('set').value='custom';$('set').fire('change');$('choices').children[9].children[0].checked=true;$('apply').fire('click');assert.equal($('status').textContent,'Karte 1 von 1');assert.equal($('next').disabled,true);$('mode').value='quiz';$('mode').fire('change');$('quiz').children.find(b=>b.textContent==='0').fire('click');assert.match($('feedback').textContent,/Noch üben/);
$('choices').children[9].children[0].checked=false;$('apply').fire('click');assert.equal($('card').hidden,true);assert.match($('status').textContent,/Keine Karten/);
$('set').value='all';$('set').fire('change');$('mode').value='challenge';$('mode').fire('change');assert.equal($('status').textContent,'Karte 1 von 6');$('sim-input').value='3,4';$('sim-run').fire('click');assert.equal($('sim-output').textContent,'Summe: 7');$('sim-input').value='bad';$('sim-run').fire('click');assert.match($('sim-output').textContent,/ganze Zahlen/);
for(let i=0;i<3;i++)$('next').fire('click');for(let i=0;i<6;i++)$('sim-run').fire('click');assert.match($('sim-output').textContent,/1 · 2 · 4 · 5/);assert.equal($('sim-run').disabled,true);
$('next').fire('click');$('sim-input').value='A';$('sim-add').fire('click');$('sim-input').value='B';$('sim-add').fire('click');$('sim-remove').fire('click');assert.match($('sim-output').textContent,/Stack B · Queue A/);$('sim-reset').fire('click');$('sim-remove').fire('click');assert.match($('sim-output').textContent,/leer/);
$('reset').fire('click');assert.deepEqual(JSON.parse(saved['linguacode-java-cards-v1']),{});
let prevented=false;keys.keydown({target:new Element(),key:'ArrowRight',preventDefault(){prevented=true;}});assert.equal(prevented,true);
console.log('PASS: DOM handlers — hidden answers, reveal/rating, navigation, custom/empty sets, quiz correct/incorrect, teacher, simulations, reset and keyboard.');
