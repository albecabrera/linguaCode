// Infinitive, accepted simple-past forms, German meaning; transcribed from the supplied pages 292–293.
const rows = [
  ['be','was/were','sein'],['become','became','werden'],['begin','began','anfangen'],
  ['bet','bet','wetten'],['bite','bit','beißen'],['blow up','blew up','in die Luft sprengen'],
  ['break','broke','(zer)brechen'],['bring','brought','(mit)bringen'],['build','built','bauen'],
  ['burn','burnt/burned','(ab)brennen'],['buy','bought','kaufen'],['catch','caught','(auf)fangen'],
  ['choose','chose','(aus)wählen'],['come','came','kommen'],['cost','cost','kosten'],
  ['creep','crept','schleichen'],['cut','cut','schneiden'],['do','did','machen; tun'],
  ['draw','drew','zeichnen'],['drink','drank','trinken'],['drive','drove','fahren'],
  ['eat','ate','essen; fressen'],['fall','fell','(um)fallen'],['feed','fed','(zu) essen geben; füttern'],
  ['feel','felt','(sich) fühlen'],['fight','fought','(be)kämpfen'],['find','found','finden'],
  ['fly','flew','fliegen'],['forget','forgot','vergessen'],['get','got','bekommen'],
  ['give','gave','geben'],['go','went','fahren; gehen'],['hang up','hung up','aufhängen'],
  ['have','had','haben'],['hear','heard','hören'],['hide','hid','(sich) verstecken'],
  ['hold up','held up','hochhalten'],['hold','held','halten'],['hurt','hurt','wehtun; verletzen'],
  ['keep','kept','(bei)behalten'],['know','knew','kennen; wissen'],
  ['lead','led','führen'],['learn','learnt/learned','lernen; erfahren'], ['leave','left','verlassen'],
  ['let','let','lassen'],['lie','lay','liegen; sich hinlegen'],['light','lit','anzünden'],
  ['lose','lost','verlieren'],['make','made','machen'],['mean','meant','bedeuten; meinen'],
  ['meet','met','(sich) treffen'],['pay','paid','(be)zahlen'],['put','put','legen; setzen; stellen'],
  ['read','read','lesen'],['ride','rode','fahren; reiten'],['ring up','rang up','anrufen'],
  ['run','ran','rennen'],['say','said','sagen'],['see','saw','sehen'],
  ['sell','sold','verkaufen'],['send','sent','(zu)schicken'],['set off','set off','aufbrechen; loslaufen'],
  ['shoot off','shot off','losschießen'],['show','showed','zeigen'],['sing','sang','singen'],
  ['sit','sat','sitzen'],['sleep','slept','schlafen'],['smell','smelt/smelled','riechen'],
  ['speak','spoke','sprechen'],['spend','spent','ausgeben (Geld); verbringen (Zeit)'],
  ['spoil','spoilt/spoiled','ruinieren'],['stand','stood','stehen'],['steal','stole','stehlen'],
  ['swim','swam','schwimmen'],['take','took','(mit)nehmen'],['tell','told','erzählen; sagen'],
  ['think','thought','denken; glauben; meinen'],['throw','threw','werfen'],
  ['understand','understood','verstehen'],['wake up','woke up','aufwachen; aufwecken'],
  ['wear','wore','tragen (Kleidung)'],['win','won','gewinnen'],['write','wrote','schreiben']
];
export const VERBS = rows.map(([base, past, german]) => Object.freeze({base, past: Object.freeze(past.split('/')), german}));
export const normalize = value => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en');
export function createSession(items = VERBS) { return {items: [...items], index: 0, errors: [], correct: 0}; }
export function submit(session, answer) {
  const item = session.items[session.index];
  if (!item) return {status: 'finished'};
  const correct = item.past.some(form => normalize(form) === normalize(answer));
  if (correct) session.correct++;
  else session.errors.push({base: item.base, answer: answer.trim() || '—', expected: item.past.join(' / ')});
  session.index++;
  return {correct, status: session.index === session.items.length ? 'finished' : 'next', item};
}
export function retryMistakes(session) {
  const names = new Set(session.errors.map(error => error.base));
  return createSession(VERBS.filter(item => names.has(item.base)));
}
