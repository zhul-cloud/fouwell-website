/* Submits every URL in sitemap-v2.xml to the IndexNow API (https://www.indexnow.org) —
 * a single ping distributed to every participating search engine (Bing, Yandex, Seznam,
 * Naver, ...), no account/login needed, no per-request click like GSC's "请求编入索引".
 *
 * Why this exists (2026-09-14): Bing Webmaster Tools was never set up for fouwell.com (see
 * wiki/analyses/福唯独立站SEO-GEO解决方案.md item 7) — Bing had only passively discovered
 * ~2 pages via the robots.txt Sitemap directive, versus Google where active GSC "请求编入
 * 索引" submission (see schema/products-schema.md's "新页面上线后的索引提交SOP") got new
 * pages indexed within 24h. IndexNow is the Bing-side equivalent of that active-push
 * behavior, but even simpler to automate — it's a plain HTTP POST, no browser/login flow.
 *
 * Key file: <domain>/<key>.txt containing exactly the key, proves domain ownership to the
 * API. That file must already be deployed (part of fouwell-website/ root, rsynced like any
 * other static file) BEFORE this script's first successful call — deploy.sh runs the rsync
 * before calling this script for that reason.
 *
 * Run: node scripts/indexnow-submit.js [--dry-run]
 * Safe to re-run any time — resubmitting unchanged URLs is a documented no-op per the
 * IndexNow spec, not an error or a duplicate/penalty risk.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_ROOT = path.join(__dirname, '..');
const HOST = 'fouwell.com';
const KEY = '33290065d7a0e6527fa4a26e6325cc8c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'api.indexnow.org';

function extractSitemapUrls() {
  const xml = fs.readFileSync(path.join(SITE_ROOT, 'sitemap-v2.xml'), 'utf8');
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) urls.push(m[1]);
  return urls;
}

function submit(urlList) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    });
    const req = https.request(
      {
        hostname: ENDPOINT,
        path: '/indexnow',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (d) => (data += d));
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const urls = extractSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap-v2.xml`);

  if (dryRun) {
    console.log('--dry-run: not submitting. Key location:', KEY_LOCATION);
    return;
  }

  // IndexNow accepts up to 10,000 URLs per request — well above this site's URL count,
  // so a single request is enough. If the catalog ever grows past that, batch here.
  const result = await submit(urls);
  // 200/202 = accepted. 200 also returned for a request the key-owner has already sent
  // recently — not an error, per IndexNow's own docs.
  if (result.status === 200 || result.status === 202) {
    console.log(`IndexNow: submitted ${urls.length} URLs, status ${result.status}`);
  } else {
    console.error(`IndexNow: unexpected status ${result.status}`, result.body);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('IndexNow submission failed:', err.message);
  process.exitCode = 1;
});
