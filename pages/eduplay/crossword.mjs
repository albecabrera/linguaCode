import { MAX_CROSSWORD_GRID_SIDE } from './model.mjs';
export const CROSSWORD_WORK_BUDGET = 5000;

// German umlauts become AE/OE/UE; ß becomes SS. Other accents are stripped.
export function normalizeWord(word) {
  return String(word)
    .replace(/[äÄ]/g, 'AE')
    .replace(/[öÖ]/g, 'OE')
    .replace(/[üÜ]/g, 'UE')
    .replace(/[ßẞ]/g, 'SS')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}
export function generateCrossword(words) {
  const pending = words.map(w => ({...w,answer:normalizeWord(w.word)})).sort((a,b) => b.answer.length - a.answer.length);
  const grid = new Map(), placed = [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let workUnits = 0, workBudgetExceeded = false;
  const key = (x,y) => `${x},${y}`;
  const get = (x,y) => grid.get(key(x,y));
  function fitsGrid(word,x,y,direction) {
    if (!word.length || word.length > MAX_CROSSWORD_GRID_SIDE) return false;
    const dx = direction === 'across' ? 1 : 0, dy = 1 - dx;
    const endX = x + dx * (word.length - 1), endY = y + dy * (word.length - 1);
    const nextMinX = Math.min(minX, x, endX), nextMaxX = Math.max(maxX, x, endX);
    const nextMinY = Math.min(minY, y, endY), nextMaxY = Math.max(maxY, y, endY);
    return nextMaxX - nextMinX + 1 <= MAX_CROSSWORD_GRID_SIDE && nextMaxY - nextMinY + 1 <= MAX_CROSSWORD_GRID_SIDE && (nextMaxX - nextMinX + 1) * (nextMaxY - nextMinY + 1) <= MAX_CROSSWORD_GRID_SIDE ** 2;
  }
  function canPlace(word,x,y,direction, requireCross) {
    if (workUnits >= CROSSWORD_WORK_BUDGET) { workBudgetExceeded = true; return false; }
    workUnits++;
    if (!fitsGrid(word,x,y,direction)) return false;
    const dx = direction === 'across' ? 1 : 0, dy = 1 - dx;
    if (get(x-dx,y-dy) || get(x+dx*word.length,y+dy*word.length)) return false;
    let crosses = 0;
    for (let i=0;i<word.length;i++) {
      const cx=x+dx*i,cy=y+dy*i, cell=get(cx,cy);
      if (cell) {
        if (cell.letter !== word[i] || cell.entries.some(entry => entry.direction === direction)) return false;
        crosses++;
      } else if (get(cx+dy,cy+dx) || get(cx-dy,cy-dx)) return false;
    }
    return !requireCross || crosses > 0;
  }
  function place(item,x,y,direction) {
    const dx=direction==='across'?1:0,dy=1-dx;
    const entry={...item,x,y,direction}; placed.push(entry);
    for (let i=0;i<item.answer.length;i++) {
      const cx=x+dx*i,cy=y+dy*i,k=key(cx,cy);
      if (!grid.has(k)) grid.set(k,{x:cx,y:cy,letter:item.answer[i],entries:[]});
      grid.get(k).entries.push({id:item.id,direction});
    }
    minX = Math.min(minX, x); maxX = Math.max(maxX, x + dx * (item.answer.length - 1));
    minY = Math.min(minY, y); maxY = Math.max(maxY, y + dy * (item.answer.length - 1));
  }
  if (pending[0]?.answer && fitsGrid(pending[0].answer,0,0,'across')) { const first=pending.shift(); place(first,0,0,'across'); }
  let progress=true;
  while (pending.length && progress) {
    progress=false;
    for (let n=0;n<pending.length && !workBudgetExceeded;n++) {
      const item=pending[n]; let found=null;
      for (const cell of grid.values()) {
        for (let i=0;i<item.answer.length && !found && !workBudgetExceeded;i++) if (item.answer[i]===cell.letter) {
          for (const direction of ['across','down']) {
            const dx=direction==='across'?1:0,dy=1-dx,x=cell.x-dx*i,y=cell.y-dy*i;
            if (canPlace(item.answer,x,y,direction,true)) { found={x,y,direction}; break; }
          }
        }
        if (found) break;
      }
      if (found) { place(item,found.x,found.y,found.direction); pending.splice(n--,1); progress=true; }
    }
  }
  const cells=[...grid.values()];
  if (!cells.length) return {placed:[],cells:[],unplaced:pending,width:0,height:0,workUnits,workBudget:CROSSWORD_WORK_BUDGET,workBudgetExceeded};
  const offsetMinX=Math.min(...cells.map(c=>c.x)),offsetMinY=Math.min(...cells.map(c=>c.y));
  cells.forEach(c => { c.x-=offsetMinX; c.y-=offsetMinY; });
  placed.forEach(w => { w.x-=offsetMinX; w.y-=offsetMinY; });
  const starts=[...new Set(placed.map(w=>key(w.x,w.y)))].map(k=>k.split(',').map(Number)).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  placed.forEach(w=>{w.number=starts.findIndex(([x,y])=>x===w.x&&y===w.y)+1;});
  cells.forEach(c=>{const start=placed.find(w=>w.x===c.x&&w.y===c.y); if(start)c.number=start.number;});
  return {placed,cells,unplaced:pending,width:Math.max(...cells.map(c=>c.x))+1,height:Math.max(...cells.map(c=>c.y))+1,workUnits,workBudget:CROSSWORD_WORK_BUDGET,workBudgetExceeded};
}
