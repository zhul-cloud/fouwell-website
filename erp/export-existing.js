#!/usr/bin/env node
/* Exports every product currently on the site in site-data.json format (erp/README.md),
 * for ERP's "import existing products" step.
 *
 *   node erp/export-existing.js [--out FILE] [--site fouwell.com]
 *
 * Writes JSON to FILE (or stdout). Problems that ERP should show to the user (media keys
 * with no matching product, products without photos) go to stderr as JSON lines under
 * "warnings", and never change the exported data. */
const fs = require('fs');
const { SCHEMA_VERSION, loadSite, plain, siteVocab, validate } = require('./lib');
const { productSlug } = require('../scripts/lib/site-data');

function exportExisting(site, siteCode) {
  const s = site || loadSite();
  const products = plain(s.PRODUCTS).map((p) => {
    const out = { ...p, slug: productSlug(p) };
    if (s.PRODUCT_PHOTOS[p.model]) out.photos = plain(s.PRODUCT_PHOTOS[p.model]);
    if (s.PRODUCT_VIDEOS[p.model]) out.videos = plain(s.PRODUCT_VIDEOS[p.model]);
    if (s.PRODUCT_SPEC_RU[p.model] !== undefined) out.spec_ru = s.PRODUCT_SPEC_RU[p.model];
    if (s.PRODUCT_DEEP_RU[p.model] !== undefined) out.deep_ru = plain(s.PRODUCT_DEEP_RU[p.model]);
    return out;
  });
  const models = new Set(products.map((p) => p.model));
  const warnings = [];
  for (const [name, map] of [['photos', s.PRODUCT_PHOTOS], ['videos', s.PRODUCT_VIDEOS], ['spec_ru', s.PRODUCT_SPEC_RU], ['deep_ru', s.PRODUCT_DEEP_RU]]) {
    for (const k of Object.keys(map)) if (!models.has(k)) warnings.push({ type: 'orphan', field: name, key: k });
  }
  for (const p of products) if (!p.photos && !p.photo && !p.linkedin) warnings.push({ type: 'no_image', model: p.model });
  const data = {
    schemaVersion: SCHEMA_VERSION,
    site: { code: siteCode, nonGenuineBrands: [...s.NON_GENUINE_BRANDS] },
    generatedAt: new Date().toISOString(),
    products
  };
  return { data, warnings };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
  const site = loadSite();
  const { data, warnings } = exportExisting(site, opt('--site', 'fouwell.com'));
  const errs = validate(data, siteVocab(site));
  if (errs.length) {
    console.error(JSON.stringify({ errors: errs }));
    process.exit(1);
  }
  const json = JSON.stringify(data, null, 2) + '\n';
  const out = opt('--out');
  if (out) fs.writeFileSync(out, json); else process.stdout.write(json);
  if (warnings.length) console.error(JSON.stringify({ warnings }));
}

module.exports = { exportExisting };
