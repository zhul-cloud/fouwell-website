/* ERP adapter tests: node --test erp/test/
 * Build tests run against a throw-away copy of the site (no .git, no assets), so the real
 * working tree is never touched. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { ROOT, loadSite, plain, siteVocab, validate } = require('../lib');

const SAMPLE = path.join(__dirname, 'sample-site-data.json');
const sample = () => JSON.parse(fs.readFileSync(SAMPLE, 'utf8'));
const vocab = siteVocab(loadSite());

function siteCopy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fouwell-erp-'));
  execFileSync('rsync', ['-a', '--exclude=.git', '--exclude=assets', '--exclude=node_modules',
    '--exclude=fouwell-website', '--exclude=_design-preview', ROOT + '/', dir + '/']);
  return dir;
}
const run = (dir, args, env = {}) => spawnSync(args[0], args.slice(1), { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } });

test('sample file is valid', () => {
  assert.deepStrictEqual(validate(sample(), vocab), []);
});

test('invalid input is rejected with a reason', () => {
  const cases = [
    [(d) => { d.schemaVersion = 2; }, /schemaVersion/],
    [(d) => { d.products[0].cat = 'plc'; }, /not a site category/],
    [(d) => { d.products[0].status = 'soldout'; }, /status/],
    [(d) => { d.products[0].slug = 'siemens-6es7214'; }, /does not match/],
    [(d) => { d.products[0].photos[0].src = 'assets/x.jpg'; }, /must start with/],
    [(d) => { d.products[0].sell_price = '318.5'; }, /sell_price/],
    [(d) => { d.products.push({ ...d.products[0] }); }, /duplicate model/]
  ];
  for (const [mutate, re] of cases) {
    const d = sample();
    mutate(d);
    const errs = validate(d, vocab);
    assert.ok(errs.some((e) => re.test(e)), `${re} not in ${JSON.stringify(errs)}`);
  }
});

test('export, apply and rebuild leave every page unchanged', () => {
  const dir = siteCopy();
  const exported = path.join(dir, 'erp', 'site-data.json');
  assert.strictEqual(run(dir, ['node', 'erp/export-existing.js', '--out', exported]).status, 0);
  const before = snapshotPages(dir);
  const r = run(dir, ['bash', 'erp/build.sh', exported], { CACHE_VERSION: 'test1' });
  assert.strictEqual(r.status, 0, r.stderr);
  const after = snapshotPages(dir);
  assert.deepStrictEqual(Object.keys(after).sort(), Object.keys(before).sort());
  const changed = Object.keys(before).filter((f) => normalize(before[f]) !== normalize(after[f]));
  assert.deepStrictEqual(changed, []);
});

test('an ERP product with object-storage media is published with its URLs and release mark', () => {
  const dir = siteCopy();
  const file = path.join(dir, 'erp', 'site-data.json');
  assert.strictEqual(run(dir, ['node', 'erp/export-existing.js', '--out', file]).status, 0);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const p = sample().products[0];
  data.products.push(p);
  fs.writeFileSync(file, JSON.stringify(data));
  const r = run(dir, ['bash', 'erp/build.sh', file], { CACHE_VERSION: 'test2' });
  assert.strictEqual(r.status, 0, r.stderr);

  const en = fs.readFileSync(path.join(dir, 'products', p.slug, 'index.html'), 'utf8');
  const ru = fs.readFileSync(path.join(dir, 'ru', 'products', p.slug, 'index.html'), 'utf8');
  for (const html of [en, ru]) {
    assert.match(html, /<meta name="erp-release" content="WP10001">/);
    assert.ok(html.includes(p.photo), 'schema image uses the object-storage URL');
    assert.ok(!html.includes('/assets/products/https:'), 'no assets prefix in front of a URL');
    assert.ok(html.includes(`https://fouwell.com/${html === ru ? 'ru/' : ''}products/${p.slug}/`), 'canonical');
  }
  assert.ok(ru.includes(p.spec_ru));
  const site = loadSite(dir);
  assert.deepStrictEqual(plain(site.PRODUCT_PHOTOS[p.model]), p.photos);
  assert.deepStrictEqual(plain(site.PRODUCT_VIDEOS[p.model]), p.videos);
  assert.deepStrictEqual(plain(site.PRODUCT_DEEP_RU[p.model]), p.deep_ru);
  const entry = plain(site.PRODUCTS).find((x) => x.model === p.model);
  for (const k of ['slug', 'release', 'photos', 'videos', 'spec_ru', 'deep_ru']) assert.ok(!(k in entry), `${k} stays out of PRODUCTS`);
});

test('a product missing from site-data is an error and no file changes', () => {
  const dir = siteCopy();
  const file = path.join(dir, 'erp', 'site-data.json');
  assert.strictEqual(run(dir, ['node', 'erp/export-existing.js', '--out', file]).status, 0);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const dropped = data.products.pop();
  fs.writeFileSync(file, JSON.stringify(data));
  const before = fs.readFileSync(path.join(dir, 'js', 'data.js'), 'utf8');
  const r = run(dir, ['bash', 'erp/build.sh', file]);
  assert.notStrictEqual(r.status, 0);
  assert.match(r.stderr, new RegExp(`missing: .*${dropped.model.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}`));
  assert.strictEqual(fs.readFileSync(path.join(dir, 'js', 'data.js'), 'utf8'), before);
});

function snapshotPages(dir) {
  const out = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== 'erp' && e.name !== 'node_modules') walk(full); }
      else if (e.name.endsWith('.html') || e.name.endsWith('.xml')) out[path.relative(dir, full)] = fs.readFileSync(full, 'utf8');
    }
  };
  walk(dir);
  return out;
}

/* Cache versions change on every build; sitemap lastmod is the build date. */
function normalize(s) {
  return s.replace(/\.(js|css)\?v=[A-Za-z0-9]+/g, '.$1?v=X').replace(/<lastmod>[^<]*<\/lastmod>/g, '<lastmod/>');
}

test('verify.js passes a good page and catches a broken main image', { skip: !hasPlaywright() }, async () => {
  const { verify } = require('../verify');
  const dir = siteCopy();
  const model = '61059113';
  execFileSync('rsync', ['-a', '--relative', `assets/products/${model}/`, `assets/videos/${model}.mp4`, dir + '/'], { cwd: ROOT });
  const file = path.join(dir, 'erp', 'site-data.json');
  assert.strictEqual(run(dir, ['node', 'erp/export-existing.js', '--out', file]).status, 0);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const p = data.products.find((x) => x.model === model);
  p.release = 'WP10002';
  fs.writeFileSync(file, JSON.stringify(data));
  assert.strictEqual(run(dir, ['bash', 'erp/build.sh', file]).status, 0);
  const url = `https://fouwell.com/products/${p.slug}/`;
  const good = await verify([{ url, images: p.photos.length, video: true, release: 'WP10002' }], { root: dir });
  assert.ok(good.ok, JSON.stringify(good.results[0].errors));

  p.photos[0].src = `/assets/products/${model}/photos/missing.jpg`;
  fs.writeFileSync(file, JSON.stringify(data));
  assert.strictEqual(run(dir, ['bash', 'erp/build.sh', file]).status, 0);
  const bad = await verify([{ url, images: p.photos.length, video: true, release: 'WP10003' }], { root: dir });
  assert.strictEqual(bad.ok, false);
  const errs = bad.results[0].errors.join(' | ');
  assert.match(errs, /main image not loaded/);
  assert.match(errs, /release mark is WP10002, expected WP10003/);
});

function hasPlaywright() {
  try { require.resolve('playwright', { paths: [path.join(__dirname, '..')] }); return true; } catch (e) { return false; }
}
