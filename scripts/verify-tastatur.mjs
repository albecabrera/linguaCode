import assert from 'node:assert/strict';
import {rows,keys,output,needed,edit,assess,score,guidance,levels} from '../pages/tastatur/engine.js';
const get=code=>keys.find(k=>k.code===code);
assert.equal(keys.filter(k=>k.code!=='EnterFoot').length,105);
for(const row of rows)assert.equal(row.reduce((sum,k)=>sum+k.width,0),60);
assert.equal(output(get('KeyY')),'z');assert.equal(output(get('KeyZ')),'y');
for(const [code,base,upper] of [['BracketLeft','ü','Ü'],['Semicolon','ö','Ö'],['Quote','ä','Ä'],['Minus','ß','?'],['Digit1','1','!'],['Comma',',',';'],['Period','.',':']]){
 assert.equal(output(get(code)),base);assert.equal(output(get(code),{shift:true}),upper);
 assert.equal(output(get(code),{caps:true}),upper);assert.equal(output(get(code),{caps:true,shift:true}),base);
}
assert.equal(output(get('Slash'),{caps:true}),'-');assert.equal(output(get('IntlBackslash'),{caps:true}),'<');
assert.equal(output(get('KeyQ'),{alt:true}),'@');assert.equal(output(get('KeyE'),{alt:true}),'€');
assert.deepEqual(needed('I'),['ShiftLeft','ShiftRight','KeyI']);assert.deepEqual(needed('I',true),['KeyI']);
assert.deepEqual(needed('?',true),['Minus']);assert.deepEqual(needed(' '),['Space']);
assert.deepEqual(needed('z'),['KeyY']);assert.deepEqual(needed('y'),['KeyZ']);
assert.equal(output(get('Numpad7'),{num:false}),'Home');assert.equal(output(get('NumpadDecimal'),{num:false}),'Delete');
assert.deepEqual(edit('abc',2,2,'Backspace'),{text:'ac',cursor:1});
assert.deepEqual(edit('abc',1,1,'Delete'),{text:'ac',cursor:1});
assert.deepEqual(edit('abc',0,0,'Backspace'),{text:'abc',cursor:0});
assert.deepEqual(edit('abc',3,3,'Delete'),{text:'abc',cursor:3});
assert.deepEqual(edit('abc',1,3,'Ü'),{text:'aÜ',cursor:2});
assert.deepEqual(edit('abc',0,2,'ArrowRight'),{text:'abc',cursor:2});
assert.deepEqual(edit('\nabc',0,0,'Home'),{text:'\nabc',cursor:0});
assert.deepEqual(edit('ab\ncd',4,4,'Home'),{text:'ab\ncd',cursor:3});
assert.deepEqual(edit('ab\ncd',4,4,'ArrowUp'),{text:'ab\ncd',cursor:1});
assert.deepEqual(edit('ab\ncd',1,1,'ArrowDown'),{text:'ab\ncd',cursor:4});
assert.deepEqual(edit('ab',1,1,'\t'),{text:'a\tb',cursor:2});
assert.equal(assess('','I','Ich').correct,1);assert.equal(assess('','i','Ich').errors,1);
assert.equal(assess('Ix','I','Ich').errors,0,'Deleting an error must not add another error.');
assert.equal(assess('Ich ','Ich h','Ich heiße Max.').correct,1);
assert.equal(assess('a','ä','ä').complete,true);
const correction=levels[4].tasks[0];const extra=correction.initial.indexOf('ll')+1;
const fixed=edit(correction.initial,extra,extra,'Delete');assert.equal(fixed.text,correction.target);
assert.equal(assess(correction.initial,fixed.text,correction.target,true).correct,1);
const missing=levels[4].tasks[1];const at=missing.initial.indexOf('icht');
assert.equal(edit(missing.initial,at,at,'r').text,missing.target);
assert.equal(guidance('Ix','Ich',2).codes[0],'Backspace');
assert.equal(guidance('','A',0).message.includes('Groß'),true);
assert.deepEqual(score(98,2),{accuracy:98,stars:3});assert.deepEqual(score(90,10),{accuracy:90,stars:2});assert.deepEqual(score(89,11),{accuracy:89,stars:1});
for(const level of levels)for(const task of level.tasks)for(const char of task.target)assert.ok(needed(char).length,`No T1 key for ${char}`);
// Every supplied task can be reproduced by virtual key combinations.
for(const level of levels)for(const task of level.tasks){let value='';for(const char of task.target){const codes=needed(char);const k=get(codes.at(-1));value+=output(k,{shift:codes.includes('ShiftLeft'),alt:codes.includes('AltRight')});}assert.equal(value,task.target);}
console.log('PASS: 105 keys, German T1/Caps Lock/Alt Gr, cursor editing, six levels, correction and scoring.');
