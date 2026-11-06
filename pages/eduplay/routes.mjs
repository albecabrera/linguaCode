export function routeFromURL(input) {
  const url = new URL(input);
  const game = url.searchParams.get('game');
  if (game) return {view:'game',id:game};
  if (url.searchParams.get('studio') === '1') return {view:'studio'};
  return {view:'home'};
}
export function activityURL(input,id) {
  const url = new URL(input);
  url.search=''; url.hash=''; url.searchParams.set('game',id);
  return url.href;
}
