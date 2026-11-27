#!/usr/bin/env node
/* Runs after the page builders (see erp/build.sh):
 *   1. writes <meta name="erp-release" content="WP…"> into each product page (English and
 *      Russian) whose site-data product carries `release`, so the online check can tell the
 *      new page from a cached old one;
 *   2. gives every /js/*.js and /css/*.css reference in every .html one fresh ?v= version,
 *      the same rule scripts/deploy.sh applies (assets are cached for a year).
 *
 *   node erp/postbuild.js FILE --cache-version V
 */
const fs = require('fs');
const path = require('path');
const { ROOT, readJson } = require('./lib');
const { productSlug } = require('../scripts/lib/site-data');

const LANG_DIRS = ['products', path.join('ru', 'products')];
const META_RE = /\n?[ \t]*<meta name="erp-release" content="[^"]*">/g;

function stampReleases(data, root = ROOT) {
  let stamped = 0;
  for (const p of data.products) {
    for (const dir of LANG_DIRS) {
      const file = path.join(root, dir, productSlug(p), 'index.html');
      if (!fs.existsSync(file)) continue;
      const html = fs.readFileSync(file, 'utf8');
      let out = html.replace(META_RE, '');
      if (p.release) {
        if (!out.includes('</head>')) throw new Error(`${file}: no </head>`);
        out = out.replace('</head>', `  <meta name="erp-release" content="${p.release}">\n</head>`);
        stamped += 1;
      }
      if (out !== html) fs.writeFileSync(file, out);
    }
  }
  return stamped;
}

function bumpCacheVersion(version, root = ROOT) {
  if (!/^[A-Za-z0-9]+$/.test(version)) throw new Error('cache version must be letters and digits');
  let changed = 0;
  for (const file of htmlFiles(root)) {
    const html = fs.readFileSync(file, 'utf8');
    const out = html.replace(/\.(js|css)\?v=[A-Za-z0-9]+/g, `.$1?v=${version}`);
    if (out !== html) { fs.writeFileSync(file, out); changed += 1; }
  }
  return changed;
}

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === 'erp') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(full);
    else if (e.name.endsWith('.html')) yield full;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--cache-version');
  const version = i >= 0 ? args[i + 1] : null;
  const file = args.find((a, j) => !a.startsWith('--') && args[j - 1] !== '--cache-version');
  try {
    const data = readJson(file || path.join(ROOT, 'erp', 'site-data.json'));
    const stamped = stampReleases(data);
    const bumped = version ? bumpCacheVersion(version) : 0;
    console.log(JSON.stringify({ stamped, bumped }));
  } catch (e) {
    console.error(JSON.stringify({ errors: [e.message] }));
    process.exit(1);
  }
}

module.exports = { stampReleases, bumpCacheVersion };
