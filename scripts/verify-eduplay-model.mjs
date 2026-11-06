import assert from 'node:assert/strict';
import { validateActivity, exportActivity, importActivity, MAX_COLLECTION_ITEMS, MAX_TEXT_LENGTH, MAX_IMAGE_DATA_BYTES, MAX_CROSSWORD_WORDS, MAX_CROSSWORD_WORD_LENGTH } from '../pages/eduplay/model.mjs';
import { activities } from '../pages/eduplay/examples.mjs';

const activity = {id:'quiz-1',schemaVersion:1,type:'quiz',title:'Test',description:'Test',subject:'Informatik',grade:'6',language:'de',createdAt:'2026-01-01T00:00:00Z',updatedAt:'2026-01-01T00:00:00Z',settings:{},content:{questions:[{id:'q1',question:'Frage?',type:'single-choice',options:[{id:'a',text:'Ja'},{id:'b',text:'Nein'}],correctOptionIds:['a'],explanation:''}]}};
assert.deepEqual(validateActivity(activity), []);
assert.deepEqual(importActivity(exportActivity(activity)), activity);
assert.throws(() => importActivity('{'), /JSON/);
assert.throws(() => importActivity(JSON.stringify({...activity, schemaVersion:99})), /Schema/);
assert.ok(validateActivity({...activity,content:{questions:[]}}).length);
assert.ok(validateActivity({...activity,content:{questions:[{...activity.content.questions[0],correctOptionIds:['missing']}]}}).length);
assert.ok(validateActivity({...activity,content:{questions:[null]}}).length);
assert.ok(validateActivity({...activity,type:'unknown'}).length);
const memory=structuredClone(activities.find(a=>a.type==='memory'));memory.content.pairs[0].first='';assert.ok(validateActivity(memory).length);
const unsafeImage=structuredClone(activities.find(a=>a.type==='memory'));unsafeImage.content.pairs[0].first={text:'Test',image:'javascript:alert(1)'};assert.ok(validateActivity(unsafeImage).length);
for (const image of ['https://third-party.example/image.png','http://127.0.0.1/image.png','//third-party.example/image.png','data:image/svg+xml;base64,PHN2Zy8+']) {
  const candidate = structuredClone(activities.find(a=>a.type==='memory')); candidate.content.pairs[0].first = {text:'Test',image};
  assert.throws(() => importActivity(JSON.stringify(candidate)), /Memory-Paare/);
}
for (const image of ['/images/card.png','./images/card.webp','data:image/png;base64,AA==']) {
  const candidate = structuredClone(activities.find(a=>a.type==='memory')); candidate.content.pairs[0].first = {text:'Test',image};
  assert.deepEqual(validateActivity(candidate), []);
}
const oversizedText = {...activity, title:'x'.repeat(MAX_TEXT_LENGTH + 1)};
assert.throws(() => importActivity(JSON.stringify(oversizedText)), /zu lang/);
const oversizedCollection = {...activity, content:{questions:Array.from({length:MAX_COLLECTION_ITEMS + 1},(_,i)=>({...activity.content.questions[0],id:`q${i}`}))}};
assert.throws(() => importActivity(JSON.stringify(oversizedCollection)), /zu viele/);
const oversizedImage = structuredClone(activities.find(a=>a.type==='memory')); oversizedImage.content.pairs[0].first = {text:'Bild',image:`data:image/png;base64,${'A'.repeat(Math.ceil(MAX_IMAGE_DATA_BYTES * 4 / 3) + 4)}`};
assert.throws(() => importActivity(JSON.stringify(oversizedImage)), /Memory-Paare/);
assert.ok(validateActivity({...activity,settings:{timerEnabled:'yes'}}).length);
const malformedMemorySettings = structuredClone(activities.find(a=>a.type==='memory'));
for (const settings of [null, undefined, [], 'invalid']) {
  const candidate = {...malformedMemorySettings};
  if (settings === undefined) delete candidate.settings;
  else candidate.settings = settings;
  assert.doesNotThrow(() => validateActivity(candidate));
  assert.ok(validateActivity(candidate).length);
}
const validMemory = structuredClone(activities.find(a=>a.type==='memory'));
validMemory.settings = {pairCount: 4, difficulty: 'hard', shuffleCards: false, timerEnabled: true};
assert.deepEqual(validateActivity(validMemory), []);
assert.match(validateActivity({...validMemory,settings:{pairCount:0}}).join(' '), /pairCount/);
assert.match(validateActivity({...validMemory,settings:{pairCount:99}}).join(' '), /pairCount/);
assert.match(validateActivity({...validMemory,settings:{difficulty:'impossible'}}).join(' '), /difficulty/);
const crossword=structuredClone(activities.find(a=>a.type==='crossword'));crossword.content.words[0].clue='';assert.ok(validateActivity(crossword).length);
const crosswordBoundary = structuredClone(activities.find(a=>a.type==='crossword'));
crosswordBoundary.content.words = Array.from({length:MAX_CROSSWORD_WORDS}, (_, index) => ({id:`boundary-${index}`,word:'A'.repeat(MAX_CROSSWORD_WORD_LENGTH),clue:'Hinweis'}));
assert.deepEqual(validateActivity(crosswordBoundary), []);
assert.equal(importActivity(JSON.stringify(crosswordBoundary)).content.words.length, MAX_CROSSWORD_WORDS);
const tooManyCrosswordWords = structuredClone(crosswordBoundary); tooManyCrosswordWords.content.words.push({id:'too-many',word:'A',clue:'Hinweis'});
assert.match(validateActivity(tooManyCrosswordWords).join(' '), /Kreuzworträtsel.*viele|Wörter.*viele/);
assert.throws(() => importActivity(JSON.stringify(tooManyCrosswordWords)), /zu viele/);
const tooLongCrosswordWord = structuredClone(activities.find(a=>a.type==='crossword')); tooLongCrosswordWord.content.words[0].word = 'A'.repeat(MAX_CROSSWORD_WORD_LENGTH + 1);
assert.match(validateActivity(tooLongCrosswordWord).join(' '), /Wort.*lang|Kreuzworträtsel/);
assert.throws(() => importActivity(JSON.stringify(tooLongCrosswordWord)), /Kreuzworträtsel/);
const deeplyNested = {...activity, metadata:{}}; let nested = deeplyNested.metadata; for (let i = 0; i < 32; i++) { nested.next = {}; nested = nested.next; }
assert.throws(() => importActivity(JSON.stringify(deeplyNested)), /Prüfbudget|tief/);
const classification=structuredClone(activities.find(a=>a.type==='classification'));classification.content.items[0].categoryId='missing';assert.ok(validateActivity(classification).length);
assert.equal(JSON.parse(exportActivity(activity)).title, activity.title);
console.log('EduPlay model checks passed');
