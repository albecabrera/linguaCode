export const sets = [
  [1,8,'Java-Grundlagen'],[9,18,'Variablen und Datentypen'],[19,24,'Bedingungen und Entscheidungen'],[25,30,'Schleifen'],[31,36,'Methoden'],[37,48,'Objektorientierung und Testen'],[49,53,'Arrays'],[54,58,'ArrayList und Referenzen'],[59,63,'Rekursion'],[64,68,'Suchen und Sortieren'],[69,73,'Stack, Queue und verkettete Listen'],[74,78,'Effizienz, Tests und Projekt']
];
export function parseCards(markdown) {
  const normalized = markdown.replace(/\r\n?/g,'\n');
  // Only headings outside fenced blocks delimit cards; never split Java statements.
  const lines = normalized.split('\n'); let fenced = false; const starts = [];
  lines.forEach((line,index) => { if (/^```/.test(line)) fenced = !fenced; else if (!fenced && /^### Karte: \d+ – /.test(line)) starts.push(index); });
  const cards = starts.map((start,index) => {
    const block = lines.slice(start,starts[index+1] ?? lines.length).join('\n');
    const heading = block.match(/^### Karte: (\d+) – (.+)/);
    const field = name => { const match = block.match(new RegExp('^- \\*\\*'+name+':\\*\\* (.+)$','m')); if (!match) throw new Error('Fehlendes Feld '+name); return match[1]; };
    const code = block.match(/```java\n([\s\S]*?)\n```/);
    return {id:Number(heading[1]),title:heading[2],topic:field('Themenbereich'),type:field('Typ'),question:field('Frage'),answer:field('Antwort'),code:code?.[1] ?? '',interaction:block.match(/\*\*Interaktion:\*\* (.+)/)?.[1] ?? ''};
  });
  if (cards.length !== 78 || cards.some((card,i)=>card.id!==i+1 || !['flashcard','simulation'].includes(card.type))) throw new Error('Erwartet: Karten 1–78 in Reihenfolge.');
  return cards;
}
// Curated distractors only: unrelated card answers would make poor quizzes.
export const distractors = {
  3:['Der Name einer Variablen.','Ein Java-Schlüsselwort für Schleifen.','Der Rückgabewert von main.'],
  10:['alter','0','Eine Fehlermeldung, weil alter nicht gelesen werden darf.'],
  12:['boolean, unabhängig vom Wert.','String als numerischer Ganzzahltyp.','void als Datentyp für Zahlen.'],
  13:['Der Wert bleibt 12.','Eine zweite Variable alter entsteht.','Die Variable wird gelöscht.'],
  62:['4.','16.','120.'],
  65:['Index 1.','Index 3.','Index 10.']
};
export function shuffle(items, random = Math.random) { const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; }
export function quizOptions(card,random = Math.random){ return distractors[card.id] ? shuffle([card.answer,...distractors[card.id]],random) : null; }
export function grade(card,answer){return answer===card.answer;}
export function summarize(ids,progress){return {known:ids.filter(id=>progress[id]==='known').length,practice:ids.filter(id=>progress[id]==='practice').length};}
export function readProgress(storage){try{const data=JSON.parse(storage.getItem('linguacode-java-cards-v1')||'{}');return Object.fromEntries(Object.entries(data).filter(([id,value])=>/^\d+$/.test(id)&&Number(id)>=1&&Number(id)<=78&&['known','practice'].includes(value)));}catch{return {};}}
export function simulate(id,input){
  if(id===53){const parts=input.trim().split(/[\s,;]+/);if(!input.trim()||parts.length>30||parts.some(x=>!/^[-+]?\d+$/.test(x)))throw new Error('1–30 ganze Zahlen eingeben, getrennt durch Leerzeichen oder Komma.');const nums=parts.map(Number);const sum=nums.reduce((a,b)=>a+b,0);if(nums.some(n=>!Number.isSafeInteger(n)||Math.abs(n)>1000000))throw new Error('Werte zwischen −1000000 und 1000000 eingeben.');return `Summe: ${sum}`;}
  const n=Number(input);
  if(id===62){if(!/^\d+$/.test(input)||n>7)throw new Error('n muss eine ganze Zahl von 0 bis 7 sein.');let result=1;for(let i=2;i<=n;i++)result*=i;return `fak(${n}) = ${result}`;}
  if(id===65){if(!/^[-+]?\d+$/.test(input))throw new Error('Eine ganze Zahl eingeben.');const index=[3,7,10,15,21].indexOf(n);return index<0?'Nicht gefunden (Index −1).':`Index ${index}`;}
  if(id===76){if(!/^\d+$/.test(input)||n<1||n>65536)throw new Error('n muss zwischen 1 und 65536 liegen.');return `Lineare Suche: bis zu ${n} Prüfungen. Binäre Suche: bis zu ${Math.floor(Math.log2(n))+1} Prüfungen (sortierte Daten, Suche nach einem Wert).`;}
  throw new Error('Diese Karte hat keine Zahlen-Simulation.');
}
export function bubbleStep(values,step){const a=[...values];const n=a.length;const total=n*(n-1)/2;if(step>=total)return {values:a,done:true,detail:'Sortierung abgeschlossen.'};let pass=0,index=step;while(index>=n-1-pass){index-=n-1-pass;pass++;}const swapped=a[index]>a[index+1];if(swapped)[a[index],a[index+1]]=[a[index+1],a[index]];return {values:a,done:step+1===total,detail:`Position ${index} und ${index+1} vergleichen: ${swapped?'tauschen':'nicht tauschen'}.`};}
