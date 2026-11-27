#!/usr/bin/env node
/* Checks product pages in a real browser with caching disabled (erp/README.md "verify.js").
 *
 *   node erp/verify.js CHECKS_JSON [--root DIR] [--asset-fallback ORIGIN] [--timeout MS]
 *
 * CHECKS_JSON: [{ "url": "https://fouwell.com/products/<slug>/", "images": 6, "video": true,
 *                 "release": "WP10001" }, …]   (`release` optional)
 *
 * --root DIR       serve DIR on a local port and open each url's path there (local check
 *                  before deploy). Without it the real url is opened (online check).
 * --asset-fallback when a /assets/… file is missing under DIR, redirect to ORIGIN + path.
 *                  Older media are deployed but not committed to the repo (README).
 *
 * Prints {"ok":bool,"results":[{url, ok, errors:[…], found:{…}}]} and exits 1 when any
 * page fails. */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.woff2': 'font/woff2' };

function serve(root, fallback) {
  const base = path.resolve(root);
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end(); }
    let file = path.join(base, rel);
    if (!file.startsWith(base)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (fs.existsSync(file)) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      return fs.createReadStream(file).pipe(res);
    }
    if (fallback && rel.startsWith('/assets/')) { res.writeHead(302, { Location: fallback.replace(/\/$/, '') + req.url }); return res.end(); }
    res.writeHead(404); res.end();
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function checkPage(browser, check, origin, timeout) {
  const errors = [];
  const found = {};
  const target = new URL(check.url);
  const open = origin ? new URL(target.pathname + target.search, origin) : new URL(target);
  open.searchParams.set('_erpcheck', Date.now().toString(36));
  const context = await browser.newContext({ extraHTTPHeaders: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  try {
    const resp = await page.goto(open.toString(), { waitUntil: 'load', timeout });
    found.status = resp ? resp.status() : null;
    if (found.status !== 200) errors.push(`status ${found.status}`);
    found.canonical = await page.$eval('link[rel="canonical"]', (l) => l.getAttribute('href')).catch(() => null);
    if (found.canonical !== check.url) errors.push(`canonical is ${found.canonical}, expected ${check.url}`);
    if (check.release) {
      found.release = await page.$eval('meta[name="erp-release"]', (m) => m.content).catch(() => null);
      if (found.release !== check.release) errors.push(`release mark is ${found.release}, expected ${check.release}`);
    }
    await page.waitForFunction(() => {
      const img = document.getElementById('pd-main-img');
      return !img || img.style.display === 'none' || (img.complete && img.getAttribute('src'));
    }, null, { timeout }).catch(() => errors.push('main image did not finish loading'));
    found.mainImage = await page.evaluate(() => {
      const img = document.getElementById('pd-main-img');
      return img ? { src: img.currentSrc || img.src, width: img.naturalWidth, hidden: img.style.display === 'none' } : null;
    });
    if (check.images > 0 && !(found.mainImage && !found.mainImage.hidden && found.mainImage.width > 0)) {
      errors.push(`main image not loaded (${found.mainImage ? found.mainImage.src : 'no #pd-main-img'})`);
    }
    found.thumbs = await page.$$eval('#pd-thumbs .pd-thumb', (n) => n.length);
    if (typeof check.images === 'number' && found.thumbs !== check.images) errors.push(`${found.thumbs} thumbnails, expected ${check.images}`);
    found.videos = await page.$$eval('#detail-video-section video', (n) => n.length);
    found.videoVisible = await page.$eval('#detail-video-section', (s) => getComputedStyle(s).display !== 'none').catch(() => false);
    if (check.video === true && !(found.videoVisible && found.videos > 0)) errors.push('video section missing');
    if (check.video === false && found.videoVisible) errors.push('video section shown but no video expected');
  } catch (e) {
    errors.push(e.message.split('\n')[0]);
  } finally {
    await context.close();
  }
  return { url: check.url, ok: errors.length === 0, errors, found };
}

async function verify(checks, { root, fallback, timeout = 30000 } = {}) {
  const server = root ? await serve(root, fallback) : null;
  const origin = server ? `http://127.0.0.1:${server.address().port}` : null;
  const browser = await chromium.launch();
  try {
    const results = [];
    for (const c of checks) results.push(await checkPage(browser, c, origin, timeout));
    return { ok: results.every((r) => r.ok), results };
  } finally {
    await browser.close();
    if (server) server.close();
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const input = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--'));
  (async () => {
    const checks = JSON.parse(fs.readFileSync(input, 'utf8'));
    const out = await verify(checks, { root: opt('--root'), fallback: opt('--asset-fallback'), timeout: Number(opt('--timeout')) || 30000 });
    console.log(JSON.stringify(out));
    process.exit(out.ok ? 0 : 1);
  })().catch((e) => { console.error(JSON.stringify({ errors: [e.message] })); process.exit(1); });
}

module.exports = { verify };
