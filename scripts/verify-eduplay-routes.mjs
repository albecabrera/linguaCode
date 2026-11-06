import assert from 'node:assert/strict';
import { routeFromURL, activityURL } from '../pages/eduplay/routes.mjs';
const base='https://example.org/linguaCode/eduplay/';
assert.deepEqual(routeFromURL(`${base}?game=abc`),{view:'game',id:'abc'});
assert.deepEqual(routeFromURL(`${base}?studio=1`),{view:'studio'});
assert.deepEqual(routeFromURL(base),{view:'home'});
assert.equal(activityURL(`${base}?studio=1#x`,'quiz 1'),`${base}?game=quiz+1`);
console.log('EduPlay routing checks passed');
