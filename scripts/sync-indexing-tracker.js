/* Keep wiki/products/GSC索引提交追踪表.md in sync with what actually exists on the site.
 *
 * Google doesn't expose an API for the "Request Indexing" button (confirmed 2026-09-12 —
 * neither the Search Console API nor the Indexing API, which is restricted to JobPosting/
 * BroadcastEvent content, cover it), so this stays a manually-worked checklist: someone
 * goes to GSC, does URL Inspection -> Request Indexing by hand, then edits the table's
 * 提交状态/提交日期/收录确认日期 columns.
 *
 * What THIS script automates is the part that's actually safe and mechanical: reading
 * sitemap-v2.xml (the source of truth for "what pages exist") and appending a fresh
 * "未提交" row for any URL that isn't in the table yet — so new product/hub pages never
 * silently fall outside the tracking loop. It never touches an existing row, so manual
 * status edits are always preserved.
 *
 * Run: node scripts/sync-indexing-tracker.js
 * Run this any time build-product-pages.js / build-hub-pages.js adds new URLs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap-v2.xml');
const TRACKER = path.join(ROOT, '..', 'wiki', 'products', 'GSC索引提交追踪表.md');

const CATEGORY_KEYS = ['controllers', 'hmi', 'servo', 'drives', 'sensors', 'spares'];

function classify(url) {
  const u = url.replace('https://fouwell.com', '');
  if (u === '/' || u === '/products/' || u === '/brands/' || u === '/about/' || u === '/contact/') {
    return '核心页面';
  }
  const catMatch = u.match(/^\/products\/([a-z]+)\/$/);
  if (catMatch && CATEGORY_KEYS.includes(catMatch[1])) return '品类Hub';
  if (/^\/products\/[a-z0-9-]+\/$/.test(u)) return '型号页';
  if (/^\/brands\/[a-z0-9-]+\/$/.test(u)) return '品牌Hub';
  return '其他';
}

const xml = fs.readFileSync(SITEMAP, 'utf8');
const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

let tracker = fs.readFileSync(TRACKER, 'utf8');
const existingUrls = new Set([...tracker.matchAll(/\| (https:\/\/fouwell\.com\S*?) \|/g)].map(m => m[1]));

const today = new Date().toISOString().slice(0, 10);
const newRows = sitemapUrls
  .filter(u => !existingUrls.has(u))
  .map(u => `| ${u} | ${classify(u)} | ${today} | 未提交 |  |  |  |`);

if (!newRows.length) {
  console.log('No new URLs — tracker already covers everything in sitemap-v2.xml.');
  process.exit(0);
}

// Append at the end of the table's data rows. Anchor on the markdown separator row
// (e.g. "|---|---|...|") rather than "last line starting with '|'" — the separator row
// itself starts with "|-", not "| ", so a naive scan finds the *header* as the last match
// when the table is still empty and inserts new rows above the separator, corrupting it.
const lines = tracker.split('\n');
const sepIndex = lines.findIndex(l => /^\|[\s:-]+\|\s*$/.test(l));
if (sepIndex === -1) {
  console.error('Could not find the table header separator row ("|---|...|") in ' + TRACKER + ' — insert rows manually.');
  process.exit(1);
}
let insertAt = sepIndex;
for (let i = sepIndex + 1; i < lines.length && lines[i].startsWith('|'); i++) insertAt = i;
lines.splice(insertAt + 1, 0, ...newRows);
fs.writeFileSync(TRACKER, lines.join('\n'), 'utf8');
console.log('Appended ' + newRows.length + ' new row(s) to ' + path.relative(ROOT, TRACKER) + ':');
newRows.forEach(r => console.log('  ' + r));
