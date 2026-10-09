import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseCards,sets,quizOptions,grade,simulate,bubbleStep,readProgress,summarize,shuffle} from '../pages/java-interaktiv/core.mjs';
const source=fs.readFileSync(new URL('../pages/java-interaktiv/cards.md',import.meta.url),'utf8');
const cards=parseCards(source);
assert.equal(cards.length,78);assert.deepEqual(cards.map(c=>c.id),Array.from({length:78},(_,i)=>i+1));
assert.deepEqual(sets.flatMap(([a,b])=>Array.from({length:b-a+1},(_,i)=>a+i)),cards.map(c=>c.id));
assert.equal(cards[7].code,'public class HalloWelt {\n  public static void main(String[] args) {\n    System.out.println("Hallo Welt!");\n  }\n}');
assert.deepEqual(parseCards(source.replaceAll('\n','\r\n')),cards);
assert.throws(()=>parseCards(source.replace('### Karte: 78','### Karte: 79')));assert.throws(()=>parseCards(source.replace('- **Frage:**','- **KeinFeld:**')));
const fenced=source.replace('System.out.println("Hallo Welt!");','System.out.println("Hallo Welt!");\n### Karte: 99 – Keine echte Karte');assert.equal(parseCards(fenced).length,78);
for(const card of cards){const options=quizOptions(card);if(options){assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.ok(options.includes(card.answer));assert.equal(grade(card,card.answer),true);assert.equal(grade(card,options.find(x=>x!==card.answer)),false);}}
assert.equal(quizOptions(cards[0]),null);assert.equal(simulate(53,'2,4; -6'),'Summe: 0');assert.throws(()=>simulate(53,''));assert.throws(()=>simulate(53,'1,NaN'));assert.throws(()=>simulate(53,'1000001'));
assert.equal(simulate(62,'0'),'fak(0) = 1');assert.equal(simulate(62,'7'),'fak(7) = 5040');for(const n of ['8','-1','2.5',''])assert.throws(()=>simulate(62,n));
assert.equal(simulate(65,'10'),'Index 2');assert.match(simulate(65,'6'),/Nicht gefunden/);assert.throws(()=>simulate(65,'abc'));assert.match(simulate(76,'16'),/bis zu 5 Prüfungen/);assert.throws(()=>simulate(76,'0'));
let values=[5,1,4,2];for(let step=0;step<6;step++)values=bubbleStep(values,step).values;assert.deepEqual(values,[1,2,4,5]);assert.equal(bubbleStep(values,6).done,true);
assert.deepEqual(readProgress({getItem:()=>'{bad'}),{});assert.deepEqual(readProgress({getItem:()=>'{"1":"known","2":"practice","79":"known","3":"bad"}'}),{1:'known',2:'practice'});
assert.deepEqual(summarize([1,2,3],{1:'known',2:'practice',99:'known'}),{known:1,practice:1});assert.deepEqual([...shuffle(cards)].sort((a,b)=>a.id-b.id),cards);
console.log('PASS: 78-card parsing, fences, order, twelve sets, curated quiz grading, progress, simulations and boundaries.');
