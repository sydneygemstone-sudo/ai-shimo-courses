import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

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
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert(script, `${name}: missing inline script`);
  new Function(script);

  const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(!duplicates.length, `${name}: duplicate ids ${duplicates.join(', ')}`);
  assert(!/(?:src|href)="\//.test(html), `${name}: root-absolute asset or link breaks Pages subpaths`);
  assert(!/secrets\.env|maoqiu-terminal\/(?:logs|memory|profile)|api[-_]?key/i.test(html), `${name}: sensitive source reference detected`);
}

const fast = await readFile(new URL('index.html', root), 'utf8');
const autoRoutes = [...fast.matchAll(/href="([^"]+)"[^>]*data-route="autodraw"/g)].map(match => new URL(match[1]).hostname);
const quickRoutes = [...fast.matchAll(/href="([^"]+)"[^>]*data-route="quickdraw"/g)].map(match => new URL(match[1]).hostname);
assert(autoRoutes.length === 2 && autoRoutes.every(host => host === 'www.autodraw.com'), 'fast-track: AutoDraw mapping failed');
assert(quickRoutes.length === 2 && quickRoutes.every(host => host === 'quickdraw.withgoogle.com'), 'fast-track: Quick, Draw! mapping failed');
assert(autoRoutes[0] !== quickRoutes[0], 'fast-track: route collision');
assert((fast.match(/data-track="young"/g) || []).length === 7, 'fast-track: young route must have 7 slides');
assert((fast.match(/data-track="older"/g) || []).length === 7, 'fast-track: grade-3 route must have 7 slides');

const full = await readFile(new URL('full-course/index.html', root), 'utf8');
const lessonIds = [...full.matchAll(/\{id:(\d+),phase:/g)].map(match => Number(match[1]));
assert(JSON.stringify(lessonIds) === JSON.stringify([1,2,3,4,5,6,7,8,9,10]), 'full-course: expected lessons 1 through 10');
for (const lab of ['rules','sensor','data','trainer','timeline','detective','privacy','prompt','agent','project']) {
  assert(full.includes(`lab:'${lab}'`), `full-course: missing ${lab} lab`);
}

const topLevel = await readdir(root);
assert(!topLevel.some(name => /secrets|\.env$/i.test(name)), 'repository root: sensitive filename detected');

console.log('validate: two static courses, 10 lessons, 10 labs, routes and safety checks passed');
