/* Shared helpers for the ERP adapter (erp/*.js). Format reference: erp/README.md.
 *
 * The site's data files (js/data.js, js/photos.js, js/videos.js, js/i18n-ru.js) stay the
 * source the page builders and the browser read. ERP never edits them directly: it writes
 * erp/site-data.json, and apply-site-data.js rewrites only the regions listed in REGIONS. */
const fs = require('fs');
const path = require('path');
const { ROOT, loadGlobals, productSlug } = require('../scripts/lib/site-data');

const SCHEMA_VERSION = 1;
/* Product keys that live outside the data.js PRODUCTS entry. Everything else on a
   site-data product is copied into PRODUCTS verbatim (unknown site-only fields included). */
const EXTRA_KEYS = ['slug', 'release', 'photos', 'videos', 'spec_ru', 'deep_ru'];

/* Every region apply-site-data.js may rewrite: file, declaration, closing line. */
const REGIONS = {
  products: { file: 'js/data.js', open: 'const PRODUCTS = [', close: '];' },
  nonGenuine: { file: 'js/data.js', open: 'const NON_GENUINE_BRANDS = new Set(', close: null },
  photos: { file: 'js/photos.js', open: 'const PRODUCT_PHOTOS = {', close: '};' },
  videos: { file: 'js/videos.js', open: 'const PRODUCT_VIDEOS = {', close: '};' },
  specRu: { file: 'js/i18n-ru.js', open: 'const PRODUCT_SPEC_RU = {', close: '};' },
  deepRu: { file: 'js/i18n-ru.js', open: 'const PRODUCT_DEEP_RU = {', close: '};' }
};

function loadSite(root = ROOT) {
  const g = loadGlobalsAt(root, 'js/data.js', 'js/photos.js', 'js/videos.js', 'js/i18n-ru.js');
  return {
    PRODUCTS: g.PRODUCTS,
    CATEGORIES: g.CATEGORIES,
    STATUS_LABEL: g.STATUS_LABEL,
    NON_GENUINE_BRANDS: g.NON_GENUINE_BRANDS,
    PRODUCT_PHOTOS: g.PRODUCT_PHOTOS,
    PRODUCT_VIDEOS: g.PRODUCT_VIDEOS,
    PRODUCT_SPEC_RU: g.PRODUCT_SPEC_RU,
    PRODUCT_DEEP_RU: g.PRODUCT_DEEP_RU
  };
}

function loadGlobalsAt(root, ...files) {
  if (path.resolve(root) === path.resolve(ROOT)) return loadGlobals(...files);
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  for (const f of files) {
    const code = fs.readFileSync(path.join(root, f), 'utf8').replace(/^(const|let)\b/gm, 'var');
    vm.runInContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

/* vm objects come from another realm; round-trip through JSON so deep comparison and
   serialization see plain objects. Sets are not JSON — callers convert them first. */
function plain(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }

function isAssetPath(s) { return typeof s === 'string' && (/^\/[^/]/.test(s) || /^https:\/\/\S+$/.test(s)); }

/* Returns a list of error strings; empty means valid. `vocab` holds the site's own
   vocabularies: { categories: CATEGORIES, statuses: STATUS_LABEL } — their keys are the only
   allowed `cat` / `status` values. */
function siteVocab(site) { return { categories: plain(site.CATEGORIES), statuses: plain(site.STATUS_LABEL) }; }

function validate(data, vocab) {
  const has = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
  const errs = [];
  if (!data || typeof data !== 'object') return ['site-data is not an object'];
  if (data.schemaVersion !== SCHEMA_VERSION) errs.push(`schemaVersion must be ${SCHEMA_VERSION}, got ${JSON.stringify(data.schemaVersion)}`);
  if (!data.site || typeof data.site !== 'object') errs.push('site is required');
  else if (data.site.nonGenuineBrands !== undefined && !isStringArray(data.site.nonGenuineBrands)) errs.push('site.nonGenuineBrands must be an array of strings');
  if (data.release !== undefined && data.release !== null && !/^WP\w+$/.test(String(data.release))) errs.push('release must look like WP…');
  if (!Array.isArray(data.products)) { errs.push('products must be an array'); return errs; }
  const models = new Set();
  const slugs = new Set();
  data.products.forEach((p, i) => {
    const at = `products[${i}]${p && p.model ? ` (${p.model})` : ''}`;
    if (!p || typeof p !== 'object') { errs.push(`${at}: not an object`); return; }
    for (const k of ['brand', 'model', 'spec']) if (!nonEmpty(p[k])) errs.push(`${at}: ${k} is required`);
    if (typeof p.series !== 'string') errs.push(`${at}: series must be a string (may be empty)`);
    if (!has(vocab.categories, p.cat)) errs.push(`${at}: cat "${p.cat}" is not a site category`);
    if (!has(vocab.statuses, p.status)) errs.push(`${at}: status "${p.status}" must be one of ${Object.keys(vocab.statuses || {}).join('/')}`);
    if (models.has(p.model)) errs.push(`${at}: duplicate model`);
    models.add(p.model);
    if (nonEmpty(p.brand) && nonEmpty(p.model)) {
      const s = productSlug(p);
      if (p.slug !== undefined && p.slug !== s) errs.push(`${at}: slug "${p.slug}" does not match the site's slug "${s}" for brand/series/model`);
      if (slugs.has(s)) errs.push(`${at}: duplicate slug "${s}"`);
      slugs.add(s);
    }
    if (p.sell_price !== undefined && !(typeof p.sell_price === 'number' && p.sell_price > 0)) errs.push(`${at}: sell_price must be a positive number`);
    if (p.sell_price !== undefined && !nonEmpty(p.sell_price_currency)) errs.push(`${at}: sell_price_currency is required with sell_price`);
    if (p.release !== undefined && !/^WP\w+$/.test(String(p.release))) errs.push(`${at}: release must look like WP…`);
    checkMedia(errs, at, 'photos', p.photos, (m) => (m.tag === 'Photo' || m.tag === 'Marketing') ? null : 'tag must be Photo or Marketing');
    checkMedia(errs, at, 'videos', p.videos, () => null);
    for (const k of ['photo', 'linkedin']) if (p[k] !== undefined && p[k] !== null && typeof p[k] !== 'string') errs.push(`${at}: ${k} must be a string or null`);
    if (p.spec_ru !== undefined && !nonEmpty(p.spec_ru)) errs.push(`${at}: spec_ru must be a non-empty string when present`);
    if (p.deep_ru !== undefined && (p.deep_ru === null || typeof p.deep_ru !== 'object' || Array.isArray(p.deep_ru))) errs.push(`${at}: deep_ru must be an object when present`);
  });
  return errs;
}

function checkMedia(errs, at, key, list, extra) {
  if (list === undefined) return;
  if (!Array.isArray(list)) { errs.push(`${at}: ${key} must be an array`); return; }
  list.forEach((m, j) => {
    if (!m || !isAssetPath(m.src)) errs.push(`${at}: ${key}[${j}].src must start with "/" or "https://"`);
    else { const e = extra(m); if (e) errs.push(`${at}: ${key}[${j}].${e}`); }
  });
}

function nonEmpty(s) { return typeof s === 'string' && s.trim() !== ''; }
function isStringArray(a) { return Array.isArray(a) && a.every(nonEmpty); }

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { throw new Error(`cannot read ${file}: ${e.message}`); }
}

module.exports = { ROOT, SCHEMA_VERSION, EXTRA_KEYS, REGIONS, loadSite, plain, siteVocab, validate, readJson, isAssetPath };
