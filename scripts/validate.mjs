import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const pages = [
  ['fast-track', new URL('index.html', root)],
  ['full-course', new URL('full-course/index.html', root)],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const [name, url] of pages) {
  const html = await readFile(url, 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert(scripts.length, `${name}: missing inline script`);
  scripts.forEach(script => new Function(script));

  const staticHtml = html.replace(/<script>[\s\S]*?<\/script>/g, '');
  const ids = [...staticHtml.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(!duplicates.length, `${name}: duplicate static ids ${duplicates.join(', ')}`);
  assert(!/(?:src|href)="\//.test(html), `${name}: root-absolute asset or link breaks Pages subpaths`);
  assert(!/secrets\.env|maoqiu-terminal\/(?:logs|memory|profile)|api[-_]?key/i.test(html), `${name}: sensitive source reference detected`);
  assert(html.includes('teacherPanel') && html.includes('hidden'), `${name}: hidden teacher notes missing`);
  assert(!/#0d1025|#111226|#171a38|color-scheme:\s*dark/i.test(html), `${name}: rejected dark dashboard palette returned`);
  assert(html.includes('ArrowRight') && html.includes('touchstart'), `${name}: keyboard or touch navigation missing`);
}

const fast = await readFile(new URL('index.html', root), 'utf8');
const highIds = [...fast.matchAll(/id:'h(\d{2})'/g)].map(match => Number(match[1]));
assert(JSON.stringify(highIds) === JSON.stringify(Array.from({ length: 16 }, (_, i) => i + 1)), 'fast-track: expected 16 high-course slides');
assert(fast.includes('href="full-course/"'), 'fast-track: low-age ten-course route missing');
assert(fast.includes("url:'https://www.autodraw.com/'"), 'fast-track: AutoDraw route missing');
assert(fast.includes("url:'https://quickdraw.withgoogle.com/'"), 'fast-track: Quick, Draw! route missing');
assert(fast.includes("fallback:'autodraw'") && fast.includes("fallback:'quickdraw'"), 'fast-track: local drawing fallbacks missing');
assert(fast.includes("type:'trainer'") && fast.includes("type:'sensor'") && fast.includes("type:'debug'"), 'fast-track: core full-screen tools missing');

const full = await readFile(new URL('full-course/index.html', root), 'utf8');
const lessonIds = [...full.matchAll(/\{id:(\d+),icon:/g)].map(match => Number(match[1]));
assert(JSON.stringify(lessonIds) === JSON.stringify([1,2,3,4,5,6,7,8,9,10]), 'full-course: expected lessons 1 through 10');
for (const tool of ['external','sensor','trainer','timeline','detective','privacy','prompt','agent','project']) {
  assert(full.includes(`tool:'${tool}'`), `full-course: missing ${tool} tool`);
}
assert(full.includes("toolTitle:'AutoDraw'") && full.includes("toolUrl:'https://www.autodraw.com/'"), 'full-course: lesson 1 AutoDraw mapping failed');
assert(full.includes("toolTitle:'Quick, Draw!'") && full.includes("toolUrl:'https://quickdraw.withgoogle.com/'"), 'full-course: lesson 3 Quick, Draw! mapping failed');
assert((full.match(/\{type:'/g) || []).length >= 9, 'full-course: nine-slide lesson grammar missing');
assert(full.includes("Math.min(8,+m[2]-1)"), 'full-course: direct slide routing must stay within 9 slides');

const topLevel = await readdir(root);
assert(!topLevel.some(name => /secrets|\.env$/i.test(name)), 'repository root: sensitive filename detected');

console.log('validate: bright PPT decks, 16-slide high course, 10 x 9-slide lessons, tools and routes passed');
