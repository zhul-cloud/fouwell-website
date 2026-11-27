#!/usr/bin/env node
/* Writes erp/site-data.json into the site's data files (erp/README.md "How build.sh applies it").
 *
 *   node erp/apply-site-data.js [FILE]      (default erp/site-data.json)
 *
 * - js/data.js PRODUCTS is replaced by the products in FILE, in FILE's order. FILE is the
 *   full catalog: a product on the site that is missing from FILE is an error (unpublishing
 *   is out of scope), never a silent deletion.
 * - PRODUCT_PHOTOS / PRODUCT_VIDEOS / PRODUCT_SPEC_RU / PRODUCT_DEEP_RU are updated per model:
 *   set when the product carries the field, removed when it does not. Keys that belong to no
 *   product are left alone (they are site-owned leftovers ERP does not manage).
 * - NON_GENUINE_BRANDS is replaced when site.nonGenuineBrands is given.
 * Exits 1 with {"errors":[…]} on stderr and leaves every file untouched when anything fails. */
const fs = require('fs');
const path = require('path');
const { ROOT, EXTRA_KEYS, REGIONS, loadSite, plain, siteVocab, validate, readJson } = require('./lib');

function applySiteData(data, root = ROOT) {
  const site = loadSite(root);
  const errs = validate(data, siteVocab(site));
  const incoming = new Set((data.products || []).map((p) => p && p.model));
  const missing = site.PRODUCTS.map((p) => p.model).filter((m) => !incoming.has(m));
  if (missing.length) errs.push(`site-data must list every product on the site; missing: ${missing.join(', ')}`);
  if (errs.length) return { errors: errs };

  const products = data.products.map((p) => {
    const entry = {};
    for (const [k, v] of Object.entries(p)) if (!EXTRA_KEYS.includes(k)) entry[k] = v;
    return entry;
  });
  const maps = {
    photos: plain(site.PRODUCT_PHOTOS),
    videos: plain(site.PRODUCT_VIDEOS),
    specRu: plain(site.PRODUCT_SPEC_RU),
    deepRu: plain(site.PRODUCT_DEEP_RU)
  };
  const field = { photos: 'photos', videos: 'videos', specRu: 'spec_ru', deepRu: 'deep_ru' };
  for (const p of data.products) {
    for (const [region, key] of Object.entries(field)) {
      const v = p[key];
      const empty = v === undefined || (Array.isArray(v) && v.length === 0);
      if (empty) delete maps[region][p.model]; else maps[region][p.model] = v;
    }
  }

  const files = {};
  const read = (f) => (files[f] !== undefined ? files[f] : (files[f] = fs.readFileSync(path.join(root, f), 'utf8')));
  const write = (region, body) => { const r = REGIONS[region]; files[r.file] = replaceRegion(read(r.file), r, body); };
  write('products', products.map((p) => indent(JSON.stringify(p, null, 2)) + ',').join('\n'));
  write('photos', mapBody(maps.photos, false));
  write('videos', mapBody(maps.videos, false));
  write('specRu', mapBody(maps.specRu, false));
  write('deepRu', mapBody(maps.deepRu, true));
  if (data.site.nonGenuineBrands) write('nonGenuine', `const NON_GENUINE_BRANDS = new Set(${JSON.stringify(data.site.nonGenuineBrands)});`);

  const originals = {};
  for (const f of Object.keys(files)) originals[f] = fs.readFileSync(path.join(root, f), 'utf8');
  for (const [f, text] of Object.entries(files)) fs.writeFileSync(path.join(root, f), text);
  try {
    verifyWritten(root, products, maps);
  } catch (e) {
    for (const [f, text] of Object.entries(originals)) fs.writeFileSync(path.join(root, f), text);
    throw e;
  }
  return { products: products.length, files: Object.keys(files) };
}

/* What the browser/builders will now load must equal what we meant to write. */
function verifyWritten(root, products, maps) {
  const after = loadSite(root);
  const check = [
    ['PRODUCTS', plain(after.PRODUCTS), products],
    ['PRODUCT_PHOTOS', plain(after.PRODUCT_PHOTOS), maps.photos],
    ['PRODUCT_VIDEOS', plain(after.PRODUCT_VIDEOS), maps.videos],
    ['PRODUCT_SPEC_RU', plain(after.PRODUCT_SPEC_RU), maps.specRu],
    ['PRODUCT_DEEP_RU', plain(after.PRODUCT_DEEP_RU), maps.deepRu]
  ];
  for (const [name, got, want] of check) {
    if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`${name} did not round-trip after writing; files restored`);
  }
}

/* Replaces the lines from the declaration (`open`, at column 0) to the first following line
   equal to `close`. With close === null only the declaration line itself is replaced. */
function replaceRegion(text, region, body) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(region.open));
  if (start < 0) throw new Error(`${region.file}: cannot find "${region.open}"`);
  if (region.close === null) {
    lines.splice(start, 1, body);
    return lines.join('\n');
  }
  const end = lines.findIndex((l, i) => i > start && l === region.close);
  if (end < 0) throw new Error(`${region.file}: cannot find closing "${region.close}" for "${region.open}"`);
  lines.splice(start + 1, end - start - 1, ...(body ? body.split('\n') : []));
  return lines.join('\n');
}

function mapBody(map, pretty) {
  return Object.entries(map)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${pretty ? JSON.stringify(v, null, 2).replace(/\n/g, '\n  ') : JSON.stringify(v)},`)
    .join('\n');
}

function indent(s) { return s.split('\n').map((l) => '  ' + l).join('\n'); }

if (require.main === module) {
  const file = process.argv[2] || path.join(ROOT, 'erp', 'site-data.json');
  let result;
  try {
    result = applySiteData(readJson(file));
  } catch (e) {
    result = { errors: [e.message] };
  }
  if (result.errors) {
    console.error(JSON.stringify({ errors: result.errors }));
    process.exit(1);
  }
  console.log(JSON.stringify(result));
}

module.exports = { applySiteData, replaceRegion };
