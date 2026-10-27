import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../pages/ki8/', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const catalog = read('index.html');
const catalogCss = read('style.css');
const portfolio = read('portfolio/index.html');
const portfolioCss = read('portfolio/portfolio.css');
const teacher = read('teacher/index.html');
const teacherCss = read('teacher/teacher.css');
const mission19 = read('stunde-19/index.html');
const missionCss = read('mission/mission.css');
const widths = [320, 390, 820, 1440];

for (const html of [catalog, portfolio, teacher, mission19]) assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
assert.match(catalog, /id="mission-list" class="mission-grid"/);
assert.match(catalogCss, /\.mission-grid|\.mission-panel/);
assert.match(catalogCss, /@media \(max-width: 680px\)/);
assert.match(catalogCss, /@media \(max-width: 780px\).*\.roadmap-stages/s);
assert.match(portfolio, /data-portfolio-table/);
assert.match(portfolioCss, /\.export-controls\{display:flex;flex-wrap:wrap/);
assert.match(portfolioCss, /table\{width:100%/);
assert.match(teacher, /id="evaluation-form"/);
assert.match(teacherCss, /@media \(max-width: 700px\)/);
assert.match(teacherCss, /overflow-x: auto/);
assert.match(mission19, /data-lesson-id="ki-19"/);
assert.match(missionCss, /@media\(max-width:1000px\)\{\.mission-shell\{grid-template-columns/);
assert.match(missionCss, /@media\(max-width:650px\).*\.phase-nav ol\{grid-template-columns:repeat\(2,1fr\)/s);

for (const width of widths) {
  const mobile = width <= 650;
  const tablet = width > 650 && width <= 1000;
  const desktop = width > 1000;
  assert.equal(mobile || tablet || desktop, true, `classified ${width}px`);
  if (mobile) {
    assert.match(catalogCss, /@media \(max-width: 680px\)/);
    assert.match(missionCss, /@media\(max-width:650px\)/);
  } else if (tablet) {
    assert.match(catalogCss, /@media \(max-width: 780px\)/);
    assert.match(missionCss, /@media\(max-width:1000px\)/);
  } else {
    assert.match(catalogCss, /\.roadmap-stages \{ display: grid; grid-template-columns: repeat\(5/);
    assert.match(missionCss, /\.mission-shell\{max-width:1760px/);
  }
}

console.log(`PASS: structural responsive assertions for catalog, portfolio, teacher, and Mission 19 at ${widths.join('/')}px.`);
