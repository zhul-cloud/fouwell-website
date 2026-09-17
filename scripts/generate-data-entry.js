/* Parses wiki/marketing/.../营销素材包/04-独立站内容包/[Model].md content packages and appends
 * missing SKUs to js/data.js's PRODUCTS array. This is the automation gap flagged in
 * schema/products-schema.md's "独立站产品页字段映射" section ("生成独立商品页"这一步仍未自动化) —
 * built 2026-09-13 to publish the "独立站待发布" backlog tracked in wiki/marketing/发布状态.md.
 *
 * What it does:
 *   1. Reads current js/data.js PRODUCTS (via the same vm-sandbox loadGlobals() used by
 *      build-product-pages.js) to know which (model) values already exist — never duplicates.
 *   2. Scans the wiki repo for 04-独立站内容包/[Model].md files not yet in data.js.
 *   3. Parses frontmatter (brand/model/series/category/status) + "一句话规格摘要" section (→ spec)
 *      + "价格" section (→ sell_price/sell_price_currency/price_source).
 *   4. Looks for assets/products/[Model].<ext> (photo) — does NOT invent a photo path if missing.
 *   5. Appends one new PRODUCTS entry per SKU, alphabetically after the existing array, with a
 *      comment noting the source content-package path for traceability.
 *
 * This does NOT run build-product-pages.js / build-hub-pages.js / sync-indexing-tracker.js —
 * run those separately after reviewing the diff to js/data.js.
 *
 * Run: node scripts/generate-data-entry.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const { loadGlobals } = require('./lib/site-data.js');

const ROOT = path.join(__dirname, '..', '..'); // llm-wiki repo root
const SITE_ROOT = path.join(__dirname, '..');  // fouwell-website root
const MARKETING_DIR = path.join(ROOT, 'wiki', 'marketing');
const DATA_JS_PATH = path.join(SITE_ROOT, 'js', 'data.js');

const DRY_RUN = process.argv.includes('--dry-run');

function findContentPackages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '04-独立站内容包') {
        for (const f of fs.readdirSync(full)) {
          if (f.endsWith('.md')) out.push(path.join(full, f));
        }
      } else {
        findContentPackages(full, out);
      }
    }
  }
  return out;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const mm = line.match(/^(\w+):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2].trim();
    }
  }
  return fm;
}

function extractSection(content, heading) {
  const re = new RegExp(`## ${heading}\\n+([\\s\\S]*?)(?=\\n## |$)`);
  const m = content.match(re);
  return m ? m[1].trim() : '';
}

function parsePriceSection(content) {
  const section = extractSection(content, '价格.*');
  // fallback: find a section literally starting with "## 价格"
  const raw = content.match(/## 价格[^\n]*\n+([\s\S]*?)(?=\n## |$)/);
  const text = raw ? raw[1] : section;
  const priceMatch = text.match(/售价 sell_price[^：:]*[：:]\s*([\d.]+)/);
  const sourceMatch = text.match(/价格来源 price_source[^：:]*[：:]\s*(\S+)/);
  if (priceMatch && !isNaN(parseFloat(priceMatch[1]))) {
    return {
      sell_price: parseFloat(priceMatch[1]),
      sell_price_currency: 'USD',
      price_source: sourceMatch ? sourceMatch[1] : undefined,
    };
  }
  return {};
}

function findPhoto(model) {
  const dir = path.join(SITE_ROOT, 'assets', 'products');
  if (!fs.existsSync(dir)) return null;
  for (const ext of ['jpg', 'jpeg', 'png']) {
    const f = `${model}.${ext}`;
    if (fs.existsSync(path.join(dir, f))) return f;
  }
  return null;
}

function jsStr(s) {
  return JSON.stringify(s == null ? null : String(s));
}

// Category mapping lives in scripts/lib/category-map.js — shared with seo-audit.js so both
// scripts validate new AND existing entries against the exact same source of truth.
const { SITE_CATEGORIES, WIKI_CATEGORY_TO_SITE_CATEGORY } = require('./lib/category-map.js');

function main() {
  const g = loadGlobals('js/data.js');
  const existingModels = new Set(g.PRODUCTS.map((p) => p.model));

  const packages = findContentPackages(MARKETING_DIR);
  const newEntries = [];

  for (const pkgPath of packages) {
    const content = fs.readFileSync(pkgPath, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm.model || existingModels.has(fm.model)) continue;

    // Path shape: MARKETING_DIR/[Brand]/[WikiCategory]/[Model]/营销素材包/04-独立站内容包/[Model].md
    const relParts = path.relative(MARKETING_DIR, pkgPath).split(path.sep);
    const wikiCategory = relParts[1];

    if (!SITE_CATEGORIES.has(fm.category)) {
      throw new Error(
        `${fm.brand} ${fm.model}: content package category "${fm.category}" (${pkgPath}) is not ` +
        `one of the 6 valid site categories (${[...SITE_CATEGORIES].join('/')}). Fix the ` +
        `category: field in the content package before running this script again.`
      );
    }
    const expectedSiteCategory = WIKI_CATEGORY_TO_SITE_CATEGORY[wikiCategory];
    if (!expectedSiteCategory) {
      throw new Error(
        `${fm.brand} ${fm.model}: wiki category "${wikiCategory}" (from ${pkgPath}) has no entry in ` +
        `WIKI_CATEGORY_TO_SITE_CATEGORY in this script. Add one deliberately (pick the closest of ` +
        `controllers/hmi/servo/drives/sensors/spares) before this SKU can be published — do not ` +
        `guess by leaving it unmapped, that's exactly how the SZR-LY4-N1-AC220V Relay→controllers ` +
        `bug (2026-09-14) happened.`
      );
    }
    if (fm.category !== expectedSiteCategory) {
      throw new Error(
        `${fm.brand} ${fm.model}: content package says category: ${fm.category}, but wiki category ` +
        `"${wikiCategory}" maps to "${expectedSiteCategory}" (see WIKI_CATEGORY_TO_SITE_CATEGORY). ` +
        `Fix the category: field in ${pkgPath} — if "${fm.category}" is actually correct for this ` +
        `SKU despite the usual mapping, update WIKI_CATEGORY_TO_SITE_CATEGORY intentionally instead ` +
        `of silently overriding it here.`
      );
    }

    const summary = extractSection(content, '一句话规格摘要') || '';
    const price = parsePriceSection(content);
    const photo = findPhoto(fm.model);

    const entry = {
      brand: fm.brand,
      model: fm.model,
      series: fm.series,
      cat: fm.category,
      spec: summary.replace(/\.$/, ''),
      status: fm.status === 'instock' ? 'instock' : fm.status,
      photo: photo,
      linkedin: null,
      ...price,
    };
    newEntries.push({ entry, source: path.relative(ROOT, pkgPath) });
  }

  if (newEntries.length === 0) {
    console.log('No new SKUs to add — all 04-独立站内容包 files already represented in data.js.');
    return;
  }

  console.log(`Found ${newEntries.length} new SKU(s) to add:`);
  for (const { entry, source } of newEntries) console.log(`  ${entry.brand} ${entry.model}  <- ${source}`);

  const lines = newEntries.map(({ entry, source }) => {
    const parts = [
      `brand: ${jsStr(entry.brand)}`,
      `model: ${jsStr(entry.model)}`,
      `series: ${jsStr(entry.series)}`,
      `cat: ${jsStr(entry.cat)}`,
      `spec: ${jsStr(entry.spec)}`,
      `status: ${jsStr(entry.status)}`,
      `photo: ${entry.photo ? jsStr(entry.photo) : 'null'}`,
      `linkedin: ${entry.linkedin ? jsStr(entry.linkedin) : 'null'}`,
    ];
    if (entry.sell_price != null) {
      parts.push(`sell_price: ${entry.sell_price}`);
      parts.push(`sell_price_currency: ${jsStr(entry.sell_price_currency)}`);
      parts.push(`price_source: ${jsStr(entry.price_source)}`);
    }
    return `  { ${parts.join(', ')} }, // generate-data-entry.js <- ${source}`;
  });

  if (DRY_RUN) {
    console.log('\n--dry-run: would insert before the closing "];" of PRODUCTS:\n');
    console.log(lines.join('\n'));
    return;
  }

  const dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
  const marker = '\n];\n';
  const idx = dataJs.lastIndexOf('const PRODUCTS = [');
  const closeIdx = dataJs.indexOf(marker, idx);
  if (closeIdx === -1) throw new Error('Could not find PRODUCTS array closing "];" in js/data.js');

  const insertion = `\n  // ---- generate-data-entry.js additions (${new Date().toISOString().slice(0, 10)}) ----\n${lines.join('\n')}\n`;
  const updated = dataJs.slice(0, closeIdx) + insertion + dataJs.slice(closeIdx);
  fs.writeFileSync(DATA_JS_PATH, updated);
  console.log(`\nAppended ${newEntries.length} entries to js/data.js.`);
}

main();
