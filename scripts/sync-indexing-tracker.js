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
// Tolerant of Obsidian's auto-formatted column padding (extra spaces before the next "|"),
// not just the plain "| url |" form — same class of bug as the separator-row regex above,
// found 2026-09-13 when it silently duplicated rows for URLs already in the table.
const existingUrls = new Set([...tracker.matchAll(/\|\s*(https:\/\/fouwell\.com\S*?)\s*\|/g)].map(m => m[1]));

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
const today = createdAt.slice(0, 10);
// Column order: URL | 类型 | 创建时间 | 上线日期 | 提交状态 | 提交日期 | 收录确认日期 | 备注
const newRows = sitemapUrls
  .filter(u => !existingUrls.has(u))
  .map(u => `| ${u} | ${classify(u)} | ${createdAt} | ${today} | 未提交 |  |  |  |`);

if (!newRows.length) {
  console.log('No new URLs — tracker already covers everything in sitemap-v2.xml.');
  process.exit(0);
}

// Insert right below the header separator row (i.e. as the new first data row), not at the
// end — the table is kept sorted newest-first by 创建时间, and every new run's rows should
// land above all older ones. Anchor on the markdown separator row (e.g. "|---|---|...|")
// rather than "last line starting with '|'" — the separator row itself starts with "|-",
// not "| ", so a naive scan finds the *header* as the last match when the table is still
// empty and inserts new rows above the separator, corrupting it.
const lines = tracker.split('\n');
// Match a full separator row regardless of column count or Obsidian's auto-formatted
// spacing (e.g. "| ----- | ----- | ... |" as well as the plain "|---|---|" form) — each
// cell between pipes must contain only dashes, colons, and whitespace.
const sepIndex = lines.findIndex(l => {
  if (!/^\|.*\|\s*$/.test(l)) return false;
  const cells = l.trim().slice(1, -1).split('|');
  return cells.length > 0 && cells.every(c => /^[\s:-]+$/.test(c));
});
if (sepIndex === -1) {
  console.error('Could not find the table header separator row ("|---|...|") in ' + TRACKER + ' — insert rows manually.');
  process.exit(1);
}
lines.splice(sepIndex + 1, 0, ...newRows);
fs.writeFileSync(TRACKER, lines.join('\n'), 'utf8');
console.log('Inserted ' + newRows.length + ' new row(s) at the top of ' + path.relative(ROOT, TRACKER) + ':');
newRows.forEach(r => console.log('  ' + r));
