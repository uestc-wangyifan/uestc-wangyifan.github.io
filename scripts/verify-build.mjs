import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const root = path.resolve('dist');
const failures = [];
let links = 0;
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}
async function isFile(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}
async function resolveFile(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const file = path.resolve(root, `.${decoded}`);
  if (file !== root && !file.startsWith(root + path.sep)) return null;
  for (const candidate of [file, path.join(file, 'index.html'), file + '.html']) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const documents = new Map(await Promise.all(htmlFiles.map(async (file) => [file, load(await readFile(file, 'utf8'))])));
for (const [file, $] of documents) {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const pathname = relative === 'index.html' ? '/' : relative === '404.html' ? '/404.html' : '/' + relative.replace(/index\.html$/, '');
  const origin = new URL($('link[rel="canonical"]').attr('href') || 'https://uestc-wangyifan.github.io').origin;
  const base = new URL(pathname, origin);
  if (!$('title').text() || !$('h1').length || !$('main').length || !$('meta[name="description"]').attr('content')) failures.push(`${relative}: missing page metadata or landmarks`);
  const ids = new Set();
  $('[id]').each((_, element) => {
    const id = $(element).attr('id');
    if (ids.has(id)) failures.push(`${relative}: duplicate id ${id}`);
    ids.add(id);
  });
  for (const element of $('a[href], link[href], img[src], script[src], source[src]')) {
    const reference = $(element).attr('href') || $(element).attr('src');
    if (!reference || /^(mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    const url = new URL(reference, base);
    if (url.origin !== origin) continue;
    links++;
    const target = await resolveFile(url.pathname);
    if (!target) { failures.push(`${relative}: missing target ${reference}`); continue; }
    if (url.hash && target.endsWith('.html')) {
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { failures.push(`${relative}: malformed fragment ${reference}`); continue; }
      const doc = documents.get(target);
      if (doc && ![...doc('[id]')].some((item) => doc(item).attr('id') === id)) failures.push(`${relative}: missing anchor ${reference}`);
    }
  }
  $('img').each((_, element) => { if ($(element).attr('alt') === undefined) failures.push(`${relative}: image without alt text`); });
}
for (const required of ['index.html', 'projects/index.html', 'blog/index.html', 'about/index.html', 'resume/index.html', '404.html', 'rss.xml', 'robots.txt', 'sitemap-index.xml', 'CNAME', '.nojekyll']) {
  if (!(await isFile(path.join(root, required)))) failures.push(`Missing required output: ${required}`);
}
if ((await readFile(path.join(root, 'CNAME'), 'utf8')).trim() !== 'uestcwangyifan.me') failures.push('Incorrect CNAME');
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${htmlFiles.length} HTML pages, ${links} internal links/assets/fragments, required outputs and CNAME.`);
