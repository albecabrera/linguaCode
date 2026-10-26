// German Windows T1 (KBDGR): Caps Lock also shifts most number/punctuation keys.
export const key = (code, base, shifted = base, alt = '', width = 4, caps = true) => ({code, base, shifted, alt, width, caps});
const action = (code, label, width = 4) => ({code, label, width});
const letters = text => [...text].map(char => key('Key' + ({z:'Y',y:'Z'}[char] || char.toUpperCase()), char, char.toUpperCase(), ({q:'@',e:'€',m:'µ'})[char] || ''));
export const rows = [
 [key('Backquote','^','°','',4,false), ...[...'1234567890'].map((n,i) => key('Digit'+n,n,[...'!"§$%&/()='][i],({2:'²',3:'³',7:'{',8:'[',9:']',0:'}'})[n] || '')),key('Minus','ß','?','\\'),key('Equal','´','`','',4,false),action('Backspace','⌫ Rück',8)],
 [action('Tab','↹ Tab',6),...letters('qwertzuiop'),key('BracketLeft','ü','Ü'),key('BracketRight','+','*','~'),action('Enter','↵ Enter',6)],
 [action('CapsLock','⇪ Feststell',7),...letters('asdfghjkl'),key('Semicolon','ö','Ö'),key('Quote','ä','Ä'),key('Backslash','#',"'"),{code:'EnterFoot',label:'',width:5}],
 [action('ShiftLeft','⇧ Shift',5),key('IntlBackslash','<','>','|',4,false),...letters('yxcvbnm'),key('Comma',',',';'),key('Period','.',':'),key('Slash','-','_','',4,false),action('ShiftRight','⇧ Shift',11)],
 [action('ControlLeft','Strg',6),action('MetaLeft','⊞',5),action('AltLeft','Alt',5),key('Space',' ',' ','',24,false),action('AltRight','Alt Gr',6),action('MetaRight','⊞',4),action('ContextMenu','▤',4),action('ControlRight','Strg',6)]
];
export const functionKeys = [action('Escape','Esc'),...Array.from({length:12},(_,i)=>action('F'+(i+1),'F'+(i+1))),action('PrintScreen','Druck'),action('ScrollLock','Rollen'),action('Pause','Pause')];
export const navigation = [action('Insert','Einfg'),action('Home','Pos1'),action('PageUp','Bild ↑'),action('Delete','Entf'),action('End','Ende'),action('PageDown','Bild ↓'),action('ArrowUp','↑'),action('ArrowLeft','←'),action('ArrowDown','↓'),action('ArrowRight','→')];
export const numpad = [action('NumLock','Num'),key('NumpadDivide','/','/','',4,false),key('NumpadMultiply','*','*','',4,false),key('NumpadSubtract','-','-','',4,false),...[7,8,9].map(n=>key('Numpad'+n,''+n,''+n,'',4,false)),key('NumpadAdd','+','+','',4,false),...[4,5,6,1,2,3].map(n=>key('Numpad'+n,''+n,''+n,'',4,false)),action('NumpadEnter','↵'),key('Numpad0','0','0','',8,false),key('NumpadDecimal',',',',','',4,false)];
export const keys = [...rows.flat(),...functionKeys,...navigation,...numpad];
export function output(k,{shift=false,caps=false,alt=false,num=true}={}) {
 if (!k || k.base === undefined) return null;
 if (alt) return k.alt || null;
 if (k.code.startsWith('Numpad') && (shift || !num)) {
  return ({Numpad0:'Insert',Numpad1:'End',Numpad2:'ArrowDown',Numpad3:'PageDown',Numpad4:'ArrowLeft',Numpad5:null,Numpad6:'ArrowRight',Numpad7:'Home',Numpad8:'ArrowUp',Numpad9:'PageUp',NumpadDecimal:'Delete'})[k.code] ?? (k.code === 'Numpad5' ? null : k.base);
 }
 return (shift !== (caps && k.caps)) ? k.shifted : k.base;
}
export function needed(char, caps=false) {
 if (char === '\n') return ['Enter'];
 if (char === '\t') return ['Tab'];
 for (const k of rows.flat()) {
  for (const shift of [false,true]) if (output(k,{caps,shift}) === char) return shift ? ['ShiftLeft','ShiftRight',k.code] : [k.code];
  if (k.alt === char && char) return ['AltRight',k.code];
 }
 return [];
}
export function edit(value,start,end,command) {
 let text = value; let cursor = start;
 const lineStart = start===0 ? 0 : value.lastIndexOf('\n',start-1)+1;
 let lineEnd = value.indexOf('\n',start); if(lineEnd<0)lineEnd=value.length;
 if (command === 'Backspace') { const from = start===end ? Math.max(0,start-1) : start; text=value.slice(0,from)+value.slice(end); cursor=from; }
 else if(command === 'Delete') text=value.slice(0,start)+value.slice(start===end ? end+1 : end);
 else if(command === 'ArrowLeft') cursor=start===end ? Math.max(0,start-1) : start;
 else if(command === 'ArrowRight') cursor=start===end ? Math.min(value.length,end+1) : end;
 else if(command === 'Home') cursor=lineStart;
 else if(command === 'End') cursor=lineEnd;
 else if(command === 'ArrowUp' || command === 'PageUp') { const prevEnd=Math.max(0,lineStart-1); const prevStart=value.lastIndexOf('\n',prevEnd-1)+1;cursor=Math.min(prevEnd,prevStart+start-lineStart); }
 else if(command === 'ArrowDown' || command === 'PageDown') { let nextEnd=value.indexOf('\n',lineEnd+1);if(nextEnd<0)nextEnd=value.length;cursor=Math.min(nextEnd,lineEnd+1+start-lineStart); }
 else { text=value.slice(0,start)+command+value.slice(end);cursor=start+command.length; }
 return {text,cursor:Math.min(cursor,text.length)};
}
export function difference(before,after) {
 let start=0;while(start<before.length && start<after.length && before[start]===after[start])start++;
 let oldEnd=before.length,newEnd=after.length;
 while(oldEnd>start && newEnd>start && before[oldEnd-1]===after[newEnd-1]){oldEnd--;newEnd--;}
 return {start,removed:before.slice(start,oldEnd),inserted:after.slice(start,newEnd)};
}
export function distance(a,b) {
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){const row=[i];for(let j=1;j<=b.length;j++)row[j]=Math.min(row[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]!==b[j-1]));prev=row;}
 return prev[b.length];
}
export function assess(before,after,target,correction=false) {
 const delta=difference(before,after);let correct=0,errors=0;
 if(correction){const improvement=distance(before,target)-distance(after,target);if(improvement>0)correct=Math.max(delta.inserted.length,delta.removed.length,1);else if(improvement<0)errors=Math.max(delta.inserted.length,delta.removed.length,1);}
 else for(let i=0;i<delta.inserted.length;i++){if(delta.inserted[i]===target[delta.start+i])correct++;else errors++;}
 return {correct,errors,complete:after===target,delta};
}
export function score(correct,errors) { const accuracy=correct+errors ? Math.round(100*correct/(correct+errors)) : 100;return {accuracy,stars:accuracy>=98?3:accuracy>=90?2:1}; }
export function guidance(value,target,cursor,correction=false) {
 if(value===target)return {codes:['Enter'],message:'Geschafft! Bestätige mit Enter.'};
 let first=0;while(first<value.length && value[first]===target[first])first++;
 if(correction || first<value.length){
  if(cursor>first+1)return {codes:['ArrowLeft'],message:'Bewege den Cursor mit ← zur Fehlerstelle.'};
  if(cursor<first)return {codes:['ArrowRight'],message:'Bewege den Cursor mit → zur Fehlerstelle.'};
  if(value.length>target.length || (value[first] && value[first]!==target[first] && (!correction || value.length>=target.length)))return {codes:[cursor>first?'Backspace':'Delete'],message:cursor>first?'Lösche das falsche Zeichen links mit der Rücktaste.':'Lösche das falsche Zeichen rechts mit Entf.'};
  if(cursor!==first)return {codes:['ArrowLeft'],message:'Gehe ein Zeichen nach links und ergänze das fehlende Zeichen.'};
 }
 const char=target[cursor];return {char,codes:[],message:char===' '?'Jetzt kommt ein Leerzeichen.':char && char===char.toUpperCase() && char!==char.toLowerCase()?'Achte auf den Großbuchstaben: Shift halten oder Feststelltaste verwenden.':'Tippe das nächste Zeichen.'};
}
export const levels = [
 {title:'Buchstaben entdecken',intro:'Finde den Buchstaben. Großbuchstaben brauchen Shift!',tasks:['A','M','S','E','T','Z','Ü','ß'].map(target=>({target}))},
 {title:'Wörter schreiben',intro:'Schreibe das Wort genau ab.',tasks:['Computer','Schule','Informatik','Tastatur','Bildschirm','Maus','Unterricht'].map(target=>({target}))},
 {title:'Groß und klein',intro:'Shift gilt für eine Taste. Feststell bleibt an, bis du sie wieder ausschaltest.',tasks:['informatik','INFORMATIK','Informatik','Meine Schule'].map(target=>({target}))},
 {title:'Sätze schreiben',intro:'Achte auf Abstände, Satzzeichen und Großbuchstaben. Bestätige mit Enter.',tasks:['Ich gehe in die Klasse 6.','Mein Lieblingsfach ist Informatik.','Heute lernen wir die Tastatur kennen.','Ich kann große und kleine Buchstaben schreiben.','Der Computer hat eine Maus und eine Tastatur.','Übung macht den Meister!','Wo befindet sich die Enter-Taste?','Ich heiße Max und bin 11 Jahre alt.'].map(target=>({target}))},
 {title:'Fehler korrigieren',intro:'Bewege den Cursor mit den Pfeilen. Rück löscht links, Entf rechts.',tasks:[{target:'Ich gehe in die Schule.',initial:'Ich gehe in die Schulle.',instruction:'Entferne das überflüssige l mit der Rücktaste.'},{target:'Heute ist Informatikunterricht.',initial:'Heute ist Informatikuntericht.',instruction:'Ergänze das fehlende r.'},{target:'Die Maus ist klein.',initial:'Die Mauss ist klein.',instruction:'Gehe mit Pos1 und → zur Fehlerstelle und lösche mit Entf.'}]},
 {title:'Tastatur-Challenge',intro:'Genauigkeit zählt mehr als Tempo. Die Zeit verändert deine Sterne nicht.',tasks:['Ich heiße Max und bin 11 Jahre alt.','Übung macht den Meister!','Wo befindet sich die Enter-Taste?'].map(target=>({target}))}
];
