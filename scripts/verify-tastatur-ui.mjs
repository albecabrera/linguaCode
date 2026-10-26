// Lightweight DOM integration harness, not a replacement for device/browser testing.
import assert from 'node:assert/strict';
import fs from 'node:fs';
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.dataset={};this.style={};this.attributes={};this.value='';this.hidden=false;this.readOnly=false;this.selectionStart=0;this.selectionEnd=0;this.classes=new Set();this.classList={add:(...c)=>c.forEach(x=>this.classes.add(x)),remove:(...c)=>c.forEach(x=>this.classes.delete(x)),contains:c=>this.classes.has(c),toggle:(c,on)=>{on=on??!this.classes.has(c);if(on)this.classes.add(c);else this.classes.delete(c);return on;}};}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(type,fn){(this.events[type]??=[]).push(fn);}
 fire(type,event={}){for(const fn of this.events[type]||[])fn(event);}
 focus(){document.activeElement=this;}
 setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
}
const html=fs.readFileSync(new URL('../pages/tastatur/index.html',import.meta.url),'utf8');
const elements=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element()]));
elements.get('next').hidden=true;
globalThis.document={activeElement:null,getElementById:id=>elements.get(id),createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
globalThis.window={addEventListener(){}};globalThis.location={hostname:'localhost',search:''};
globalThis.setInterval=()=>0;globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};
await import('../pages/tastatur/app.js');
const get=id=>elements.get(id),type=text=>{const input=get('typing');input.value=text;input.setSelectionRange(text.length,text.length);input.fire('input',{isComposing:false});};
const enter=()=>get('typing').fire('keydown',{code:'Enter',key:'Enter',getModifierState:()=>false,preventDefault(){},shiftKey:false});
const findKey=code=>['main-keys','navigation','numpad','functions'].flatMap(id=>get(id).children).find(b=>b.dataset.code===code);
findKey('ShiftLeft').fire('click');findKey('KeyA').fire('click');assert.equal(get('typing').value,'A');
get('levels').children[5].fire('click');
for(const text of ['Ich heiße Max und bin 11 Jahre alt.','Übung macht den Meister!','Wo befindet sich die Enter-Taste?']){type(text);enter();}
assert.equal(get('results').hidden,false,'Challenge must show a result');assert.equal(get('typing').readOnly,true);
assert.ok(get('results').children.some(x=>x.textContent?.includes('92 richtige Zeicheneingaben · 0 Fehler · 100 %')));
assert.ok(get('results').children.some(x=>x.textContent==='★★★'));
get('restart').fire('click');assert.equal(get('typing').readOnly,false);
get('levels').children[2].fire('click');type('Informatik');assert.ok(get('marked').children.some(x=>x.className==='wrong'));
get('free').fire('click');findKey('KeyY').fire('click');findKey('KeyZ').fire('click');assert.equal(get('typing').value,'zy');
findKey('CapsLock').fire('click');findKey('BracketLeft').fire('click');findKey('Digit1').fire('click');assert.equal(get('typing').value,'zyÜ!');
findKey('CapsLock').fire('click');findKey('NumpadEnter').fire('click');assert.equal(get('typing').value,'zyÜ!\n');
get('tab-in-text').checked=true;findKey('Tab').fire('click');assert.equal(get('typing').value,'zyÜ!\n\t');
findKey('AltRight').fire('click');findKey('KeyQ').fire('click');assert.equal(get('typing').value,'zyÜ!\n\t@');
console.log('PASS: DOM harness — virtual/real-input handlers, challenge result, restart, marking, free text, Shift/Caps/Alt Gr/Tab/Enter.');
