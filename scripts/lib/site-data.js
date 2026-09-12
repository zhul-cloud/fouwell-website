/* Shared data-loading + slug/URL helpers used by every prerender script under scripts/.
 * Single source of truth so build-product-pages.js and build-hub-pages.js can't drift
 * out of sync with each other (they previously duplicated this logic — see git history).
 *
 * The slug/URL logic here MUST stay in lockstep with the equivalent functions in
 * js/main.js (productSlug/_slugPiece, injectProductSchema's category breadcrumb).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..');

/* Load data.js / videos.js (written as browser globals, not CommonJS modules) by
   sandbox-evaluating them rather than touching those files. Top-level `const`/`let`
   create lexical bindings, not properties on the vm context object — rewrite to `var`
   (only at statement start) so they attach to the sandbox and are readable afterwards. */
function loadGlobals(...files) {
  const sandbox = {};
  vm.createContext(sandbox);
  for (const f of files) {
    let code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    code = code.replace(/^(const|let)\b/gm, 'var');
    vm.runInContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

function slugPiece(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[\s_./]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
function productSlug(p) {
  return [slugPiece(p.brand), slugPiece(p.series), slugPiece(p.model)].filter(Boolean).join('-');
}
function productUrl(p) { return '/products/' + productSlug(p) + '/'; }

/* Category slugs ARE the CATEGORIES keys (controllers/hmi/servo/drives/sensors/spares) —
   already URL-safe, so no separate slugify step. Category hub lives at /products/<key>/,
   nested under /products/ same as the video's Core->Category directory-depth model. */
function categorySlug(catKey) { return catKey; }
function categoryUrl(catKey) { return '/products/' + categorySlug(catKey) + '/'; }

function brandSlug(name) { return slugPiece(name); }
function brandUrl(name) { return '/brands/' + brandSlug(name) + '/'; }

const STATUS_AVAIL = {
  instock: 'https://schema.org/InStock',
  legacy: 'https://schema.org/LimitedAvailability',
  discont: 'https://schema.org/Discontinued'
};

function escHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

module.exports = {
  ROOT, loadGlobals, slugPiece, productSlug, productUrl,
  categorySlug, categoryUrl, brandSlug, brandUrl,
  STATUS_AVAIL, escHtml
};
