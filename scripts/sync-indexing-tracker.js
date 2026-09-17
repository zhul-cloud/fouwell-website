/* Keep wiki/products/GSC索引提交追踪表.md, wiki/products/Bing索引提交追踪表.md AND
 * wiki/products/Yandex索引提交追踪表.md in sync with what actually exists on the site — same
 * sitemap-v2.xml source of truth, same run, so the three trackers never drift apart.
 *
 * 2026-09-14 (later same day): split off a dedicated Yandex table per user request, EN/RU
 * pages no longer share a table — GSC and Bing only ever track the EN (non-/ru/) URLs, and
 * Yandex only ever tracks the RU (/ru/) URLs. Earlier the same day RU rows had been appended
 * into the GSC/Bing tables tagged "（俄语）"; those 130 rows were removed from both as part of
 * this change (Yandex is the correct home for them, and GSC/Yandex/Bing serve genuinely
 * different regions/audiences here — RU pages target the Russian market specifically, which
 * is exactly Yandex's audience, not Google/Bing's).
 *
 * Google doesn't expose an API for the "Request Indexing" button (confirmed 2026-09-12 —
 * neither the Search Console API nor the Indexing API, which is restricted to JobPosting/
 * BroadcastEvent content, cover it), so the GSC table stays a manually-worked checklist:
 * someone goes to GSC, does URL Inspection -> Request Indexing by hand, then edits the
 * table's 提交状态/提交日期/收录确认日期 columns.
 *
 * Bing and Yandex are structurally different from GSC, not just "the same thing for a
 * different engine": since 2026-09-14 every URL in sitemap-v2.xml is already bulk-submitted
 * to both the moment it exists there, via two automated paths (sitemap registered in Bing
 * Webmaster Tools + IndexNow push on every deploy.sh run — IndexNow fans out to Bing AND
 * Yandex in one call) — there's no per-URL manual submission step to track for either, so
 * neither table has a 提交状态 column. What they track is purely 收录确认状态, checked by
 * hand (Bing Webmaster Tools' URL Inspection for Bing; user decided 2026-09-14 not to invest
 * in Yandex Webmaster Tools specifically, so the Yandex column stays checked via a plain
 * `site:fouwell.com` search on yandex.com until/unless that decision changes — see wiki/log.md
 * same date). Bing has no bulk indexed-status API either, same class of limitation as GSC.
 *
 * What THIS script automates for all three tables is the part that's actually safe and
 * mechanical: reading sitemap-v2.xml (the source of truth for "what pages exist") and
 * appending a fresh row for any URL that isn't in the table yet — so new product/hub pages
 * never silently fall outside any tracking loop. It never touches an existing row in any
 * file, so manual status edits are always preserved.
 *
 * Run: node scripts/sync-indexing-tracker.js
 * Run this any time build-product-pages.js / build-hub-pages.js / the -ru.js equivalents add
 * new URLs.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITEMAP = path.join(ROOT, 'sitemap-v2.xml');
const GSC_TRACKER = path.join(ROOT, '..', 'wiki', 'products', 'GSC索引提交追踪表.md');
const BING_TRACKER = path.join(ROOT, '..', 'wiki', 'products', 'Bing索引提交追踪表.md');
const YANDEX_TRACKER = path.join(ROOT, '..', 'wiki', 'products', 'Yandex索引提交追踪表.md');

const CATEGORY_KEYS = ['controllers', 'hmi', 'servo', 'drives', 'sensors', 'spares'];

// classify() only ever sees URLs of one language at a time now (GSC/Bing get the EN list,
// Yandex gets the RU list — filtered before this is called), so it just strips whichever
// prefix is present and classifies the URL shape; no more "（俄语）" tagging, since a table's
// rows are now all the same language by construction.
function classify(url) {
  let u = url.replace('https://fouwell.com', '').replace(/^\/ru/, '') || '/';

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
const allSitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const sitemapUrls = allSitemapUrls.filter(u => !u.startsWith('https://fouwell.com/ru'));
const ruSitemapUrls = allSitemapUrls.filter(u => u.startsWith('https://fouwell.com/ru'));

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
const today = createdAt.slice(0, 10);

/* Shared insert logic: read `trackerPath`, find URLs already present (tolerant of
 * Obsidian's auto-formatted column padding — extra spaces before the next "|", not just the
 * plain "| url |" form; this exact class of bug silently duplicated rows for URLs already in
 * the GSC table on 2026-09-13), build one row per new URL via `rowFor(url)`, and insert them
 * as the new first data rows (right below the header separator) so both tables stay sorted
 * newest-first. Returns the number of rows inserted. */
function syncTracker(trackerPath, urls, rowFor) {
  let tracker = fs.readFileSync(trackerPath, 'utf8');
  const existingUrls = new Set(
    [...tracker.matchAll(/\|\s*(https:\/\/fouwell\.com\S*?)\s*\|/g)].map(m => m[1])
  );

  const newRows = urls.filter(u => !existingUrls.has(u)).map(rowFor);

  if (!newRows.length) {
    console.log(`No new URLs for ${path.basename(trackerPath)} — already covers everything in sitemap-v2.xml.`);
    return 0;
  }

  const lines = tracker.split('\n');
  // Match a full separator row regardless of column count or Obsidian's auto-formatted
  // spacing (e.g. "| ----- | ----- | ... |" as well as the plain "|---|---|" form) — each
  // cell between pipes must contain only dashes, colons, and whitespace. Anchoring on this
  // rather than "last line starting with '|'" matters because the separator row itself
  // starts with "|-", not "| " — a naive scan finds the *header* as the last match when the
  // table is still empty and inserts new rows above the separator, corrupting it.
  const sepIndex = lines.findIndex(l => {
    if (!/^\|.*\|\s*$/.test(l)) return false;
    const cells = l.trim().slice(1, -1).split('|');
    return cells.length > 0 && cells.every(c => /^[\s:-]+$/.test(c));
  });
  if (sepIndex === -1) {
    console.error(`Could not find the table header separator row ("|---|...|") in ${trackerPath} — insert rows manually.`);
    return 0;
  }
  lines.splice(sepIndex + 1, 0, ...newRows);
  fs.writeFileSync(trackerPath, lines.join('\n'), 'utf8');
  console.log(`Inserted ${newRows.length} new row(s) at the top of ${path.relative(ROOT, trackerPath)}:`);
  newRows.forEach(r => console.log('  ' + r));
  return newRows.length;
}

// GSC table columns: URL | 类型 | 创建时间 | 上线日期 | 提交状态 | 提交日期 | 收录确认日期 | 备注
// EN URLs only — see file header for why RU moved to its own Yandex table.
const gscCount = syncTracker(
  GSC_TRACKER, sitemapUrls,
  (u) => `| ${u} | ${classify(u)} | ${createdAt} | ${today} | 未提交 |  |  |  |`
);

// Bing table columns: URL | 类型 | 创建时间 | 收录确认状态 | 确认日期 | 备注 — no 提交状态
// column, see file header for why (submission is already bulk-automated for every URL here).
// EN URLs only.
const bingCount = syncTracker(
  BING_TRACKER, sitemapUrls,
  (u) => `| ${u} | ${classify(u)} | ${createdAt} | 未确认 |  |  |`
);

// Yandex table columns: same shape as Bing (URL | 类型 | 创建时间 | 收录确认状态 | 确认日期 |
// 备注) — same bulk-auto-submit-via-IndexNow story, see file header. RU URLs only.
const yandexCount = syncTracker(
  YANDEX_TRACKER, ruSitemapUrls,
  (u) => `| ${u} | ${classify(u)} | ${createdAt} | 未确认 |  |  |`
);

if (gscCount === 0 && bingCount === 0 && yandexCount === 0) {
  console.log('All three trackers already cover everything in sitemap-v2.xml — nothing to do.');
}
