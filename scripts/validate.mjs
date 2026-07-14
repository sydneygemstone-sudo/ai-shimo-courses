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
assert((full.match(/\bS\('/g) || []).length === 90, 'full-course: every one of 90 slides needs its own teacher script');
for (const id of ['rehearsalBtn','teacherSay','teacherDo','teacherBridge']) {
  assert(full.includes(`id="${id}"`), `full-course: teacher rehearsal control missing ${id}`);
}
assert(full.includes("query.get('teacher')==='1'"), 'full-course: direct teacher rehearsal route missing');
assert(full.includes("title:'教毛球认猫狗'") && full.includes("toolTitle:'毛球认猫狗小游戏'"), 'full-course: lesson 4 cat/dog story missing');
const aiLabSource = full.slice(full.indexOf('const aiLabs={'), full.indexOf('const S='));
assert((aiLabSource.match(/\n\s+\d+:\{name:/g) || []).length === 10, 'full-course: every lesson needs one real AI lab');
for (const url of [
  'https://www.autodraw.com/',
  'https://teachablemachine.withgoogle.com/train/image',
  'https://quickdraw.withgoogle.com/',
  'https://teachablemachine.withgoogle.com/train/audio',
  'https://artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw?hl=en',
  'https://www.perplexity.ai/',
  'https://chatgpt.com/',
  'https://artsandculture.google.com/experiment/say-what-you-see/jwG3m7wQShZngw?hl=en',
  'https://artsandculture.google.com/experiment/giga-manga/UAHzM-yZUdUpNA?hl=en',
]) {
  assert(aiLabSource.includes(url), `full-course: real AI lab URL missing ${url}`);
}
for (const token of ['liveTab','localTab','livePanel','localPanel','openAi','labFeedback','data-lab-result']) {
  assert(full.includes(token), `full-course: real/local AI lab control missing ${token}`);
}
assert(full.includes('✨ 真实 AI 实战') && full.includes('本地预演 / 断网兜底'), 'full-course: real AI must be the visible primary path');
assert(full.includes('target="_blank" rel="noopener"'), 'full-course: external AI tools must open safely in a separate tab');
for (const id of ['catSamples','dogSamples','trainerSteps','trainerNext','trainerFeedback']) {
  assert(full.includes(`id="${id}"`), `full-course: lesson 4 guided interaction missing ${id}`);
}
for (const banned of ['太阳能量','森林能量','训练题','训练台','考试题','考试','考题','新题','测评','控制台','得分','永久变聪明','永远变聪明']) {
  assert(!full.includes(banned), `full-course: rejected lesson 4 wording returned: ${banned}`);
}
assert(full.includes("card.dataset.sample==='wrong-cat'") && full.includes('state.tool.trainerPhase=5'), 'full-course: lesson 4 find-fix-retry flow missing');
assert(full.includes("if(s.type==='tool')$('teacherPanel').hidden=true"), 'full-course: rehearsal overlay must close on interactive tool slides');
assert(full.includes('promptResult') && full.includes('improvePrompt'), 'full-course: prompt tool must show and improve a result');
assert(full.includes("how==='最后考我'") && full.includes('问题：'), 'full-course: quiz-style prompt must produce an actual question');
assert(full.includes('projectArtifact') && full.includes('fixArtifact'), 'full-course: final project must include a fixable artifact');

const topLevel = await readdir(root);
assert(!topLevel.some(name => /secrets|\.env$/i.test(name)), 'repository root: sensitive filename detected');

console.log('validate: bright PPT decks, 16-slide high course, 10 real AI labs, 90 teacher scripts, local fallbacks and routes passed');
