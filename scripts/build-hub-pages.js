/* Prerender real, crawlable Category Hub pages (/products/<category>/) and Brand Hub
 * pages (/brands/<brand-slug>/) — the middle tier of the site's information architecture
 * that previously did not exist as real URLs at all:
 *   - category filtering was a client-side-only query param (/products/?cat=X, JS-rendered)
 *   - brand filtering was client-side-only JS chip filtering (no URL at all)
 *
 * This follows the 2026-09-12 directory-structure redesign (see
 * wiki/analyses/福唯独立站SEO-GEO解决方案.md and wiki/seo-geo/关键词矩阵与主题集群架构.md,
 * synthesizing the "如何搭建合理的网站层级目录结构" methodology): keyword tier
 * Core -> Category -> Brand/Subtopic -> Product Model should map to a real, discoverable
 * URL + page, with internal links establishing the actual hierarchy — not just a directory
 * on paper.
 *
 * Only categories/brands with real product data get a hub page (no empty shells — same
 * "grows from real data, not a keyword list" legitimacy rule already used for product pages,
 * see wiki/seo-geo/五种高风险SEO玩法-2026.md).
 *
 * Brand hub coverage is driven by which brands actually appear in PRODUCTS, NOT by the
 * BRANDS "brand wall" array (that array is a curated trust/logo list used on the homepage
 * and is missing some brands that do have real SKUs — e.g. LS Electric, INVT, Pro-face,
 * Beckhoff, Barksdale, POSITAL, CX, FANOX, Bosch Rexroth, Tianhe, DPG, General). Where a
 * BRANDS entry exists we use its logo/country; where it doesn't, the hub page still renders
 * from real product data, just without a logo/country line.
 *
 * Run: node scripts/build-hub-pages.js  (after build-product-pages.js, or any time data.js changes)
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT, loadGlobals, productUrl, categoryUrl, brandUrl, brandSlug, escHtml
} = require('./lib/site-data');

const { PRODUCTS, BRANDS, CATEGORIES, STATUS_LABEL, PRODUCT_PHOTOS, PRODUCT_VIDEOS, NON_GENUINE_BRANDS } =
  loadGlobals('js/data.js', 'js/videos.js', 'js/photos.js');

/* Port of productHasRealPhoto/productHasVideo/productMediaScore in js/main.js — static
 * version, same duplication pattern as productCard() below. Keep both in sync. */
function productHasRealPhoto(p) {
  const photos = PRODUCT_PHOTOS[p.model] || [];
  return photos.some((x) => x.tag === 'Photo');
}
function productHasVideo(p) {
  return !!(PRODUCT_VIDEOS[p.model] && PRODUCT_VIDEOS[p.model].length);
}
function productMediaScore(p) {
  return (productHasRealPhoto(p) ? 2 : 0) + (productHasVideo(p) ? 1 : 0);
}
function sortByMedia(list) {
  return list.slice().sort((a, b) => productMediaScore(b) - productMediaScore(a));
}

function brandOf(name) { return BRANDS.find(b => b.name === name); }

/* ---- port of productCard() in js/main.js — static version (no lazy-load JS needed,
   images are still real <img> tags so this degrades identically without JS) ---- */
function productCard(p) {
  // p.no_known_replacement (2026-09-16): see js/main.js statusLabelFor() header comment — the
  // shared "Replaced" label is wrong on a bare pill (no surrounding explanation) for a dead-end
  // EOL SKU with no verified successor.
  const st = (p.status === 'discont' && p.no_known_replacement)
    ? { label: 'Discontinued', cls: STATUS_LABEL.discont.cls }
    : (STATUS_LABEL[p.status] || STATUS_LABEL.instock);
  const url = productUrl(p);
  // Priority: PRODUCT_PHOTOS (full packaged set, matches the detail-page gallery source) ->
  // legacy p.photo/p.linkedin fields -> placeholder. See js/main.js productImage() for the
  // full rationale (2026-09-14 fix — this port previously only checked photo/linkedin).
  const photos = PRODUCT_PHOTOS[p.model] || [];
  const img = photos.length
    ? '<img' + (photos[0].tag === 'Marketing' ? ' class="linkedin-fallback"' : '') +
      ' src="' + photos[0].src + '" alt="' + escHtml(p.model) + (photos[0].tag === 'Marketing' ? ' (marketing)' : '') + '" loading="lazy">'
    : p.photo
    ? '<img src="/assets/products/' + p.photo + '" alt="' + escHtml(p.model) + '" loading="lazy">'
    : p.linkedin
    ? '<img class="linkedin-fallback" src="/assets/linkedin/' + p.linkedin + '" alt="' + escHtml(p.model) + ' (marketing)" loading="lazy">'
    : '<div class="noimg">' + escHtml(p.brand) + '<br>Photo on request</div>';
  return (
    '<article class="prod-card">' +
      '<a class="thumb-link" href="' + url + '"><div class="thumb">' + img + '</div></a>' +
      '<div class="body">' +
        '<span class="cat">' + escHtml(p.brand) + ' · ' + escHtml(CATEGORIES[p.cat]) + '</span>' +
        '<a class="model-link" href="' + url + '"><h3>' + escHtml(p.model) + '</h3></a>' +
        '<div class="series">' + escHtml(p.series || '') + '</div>' +
        '<p class="desc">' + escHtml(p.spec) + '</p>' +
        '<div class="meta">' +
          '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
          '<a class="inq-link" href="/contact/?model=' + encodeURIComponent(p.model) + '#inquiry">Inquire →</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

const PAGE_SHELL = fs.readFileSync(path.join(ROOT, 'products', 'index.html'), 'utf8');

/* Split the shared shell into head/body-open (before the <section class="page-hero">)
   and body-close (from the footer onward) so hub pages reuse the exact same header/nav/
   footer markup as the rest of the site, with only the mid-page content swapped in. */
const HERO_START = PAGE_SHELL.indexOf('<section class="page-hero">');
const CONTENT_END = PAGE_SHELL.indexOf('<footer class="site-footer">');
// Strip the shell's own hreflang block (always /products/ <-> /ru/products/, since the shell
// IS products/index.html) — every generated hub page gets its own correct pair injected below
// instead (2026-09-14, Phase 2/3 fix: previously every category/brand hub page silently
// inherited this same generic pair, which is wrong per-page hreflang and was never caught
// because the RU side of it didn't exist as a real page yet).
const HEAD_AND_NAV = PAGE_SHELL.slice(0, HERO_START)
  .replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n/g, '');
const FOOTER_AND_SCRIPTS = PAGE_SHELL.slice(CONTENT_END);

function renderShell({ title, metaDesc, canonical, breadcrumbHtml, h1, subHtml, bodyHtml, schemas, navActive, altUrl }) {
  let head = HEAD_AND_NAV
    .replace(/<title>[^<]*<\/title>/, '<title>' + escHtml(title) + '</title>')
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + escHtml(metaDesc) + '">')
    .replace('<a href="/products/" class="active">Products</a>', navActive === 'products'
      ? '<a href="/products/" class="active">Products</a>'
      : '<a href="/products/">Products</a>')
    // Per-page lang-switch target (the shell's own copy always points at /ru/products/).
    .replace(/<a class="lang-switch" href="[^"]*">🇷🇺 RU<\/a>/, '<a class="lang-switch" href="' + altUrl + '">🇷🇺 RU</a>');
  const schemaTags = schemas
    .map(obj => '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>')
    .join('\n  ');
  const hreflangTags =
    '<link rel="alternate" hreflang="en" href="' + canonical + '">\n  ' +
    '<link rel="alternate" hreflang="ru" href="https://fouwell.com' + altUrl + '">\n  ' +
    '<link rel="alternate" hreflang="x-default" href="' + canonical + '">';
  head = head.replace('</head>', '  <link rel="canonical" href="' + canonical + '">\n  ' + hreflangTags + '\n  ' + schemaTags + '\n</head>');

  let footer = FOOTER_AND_SCRIPTS
    .replace(/window\.FOUWELL_ALT_URL = '[^']*';/, "window.FOUWELL_ALT_URL = '" + altUrl + "';");

  return head +
    '<section class="page-hero">\n' +
    '    <div class="container">\n' +
    '      <div class="breadcrumb">' + breadcrumbHtml + '</div>\n' +
    '      <h1>' + escHtml(h1) + '</h1>\n' +
    '      ' + subHtml + '\n' +
    '    </div>\n' +
    '  </section>\n\n' +
    '  <section class="section">\n' +
    '    <div class="container">\n' +
    bodyHtml +
    '    </div>\n' +
    '  </section>\n\n' +
    footer;
}

let written = 0;

/* ==================== Category hub pages: /products/<cat>/ ==================== */
for (const [catKey, catName] of Object.entries(CATEGORIES)) {
  const products = sortByMedia(PRODUCTS.filter(p => p.cat === catKey));
  if (!products.length) continue; // no empty shells

  const brandsHere = [...new Set(products.map(p => p.brand))].sort();
  const url = 'https://fouwell.com' + categoryUrl(catKey);

  const breadcrumbHtml = '<a href="/">Home</a> / <a href="/products/">Products</a> / <span>' + escHtml(catName) + '</span>';
  const subHtml = '<p>' + products.length + ' model' + (products.length === 1 ? '' : 's') + ' in stock or sourceable across ' +
    brandsHere.length + ' brand' + (brandsHere.length === 1 ? '' : 's') +
    ' — all from official authorized channels. Don’t see your exact part number? <a href="/contact/#inquiry">Send it to us</a>.</p>';

  const brandLinksHtml = brandsHere.map(b =>
    '<a class="chip" href="' + brandUrl(b) + '">' + escHtml(b) + '</a>'
  ).join(' ');

  const otherCatsHtml = Object.entries(CATEGORIES)
    .filter(([k]) => k !== catKey && PRODUCTS.some(p => p.cat === k))
    .map(([k, name]) => '<a href="' + categoryUrl(k) + '">' + escHtml(name) + '</a>')
    .join(' · ');

  const bodyHtml =
    '      <div class="filter-bar" style="margin-bottom:20px;">\n' +
    '        <div class="chips">' + brandLinksHtml + '</div>\n' +
    '      </div>\n' +
    '      <div class="result-count">' + products.length + ' product' + (products.length === 1 ? '' : 's') + ' found</div>\n' +
    '      <div class="feat-grid">\n' + products.map(productCard).join('\n') + '\n      </div>\n' +
    '      <div style="margin-top:44px;">\n' +
    '        <p style="color:#6b7794; margin-bottom:12px;">Other categories: ' + otherCatsHtml + '</p>\n' +
    '        <div class="cta-band">\n' +
    '          <div>\n' +
    '            <h2>Can’t find your part number?</h2>\n' +
    '            <p>We source from 25+ brand channels, including discontinued and hard-to-find components. Send your list — we’ll confirm stock and pricing the same day.</p>\n' +
    '          </div>\n' +
    '          <a href="/contact/#inquiry" class="btn btn-primary">Send Part List</a>\n' +
    '        </div>\n' +
    '      </div>\n';

  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://fouwell.com/products/' },
        { '@type': 'ListItem', position: 3, name: catName, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: catName + ' | Fouwell', url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.model,
          url: 'https://fouwell.com' + productUrl(p)
        }))
      }
    }
  ];

  const html = renderShell({
    title: catName + ' | Fouwell Industrial Automation',
    metaDesc: 'Genuine ' + catName + ' from ' + brandsHere.slice(0, 5).join(', ') +
      (brandsHere.length > 5 ? ' and more' : '') + ' — ' + products.length + ' models in stock or sourceable. Fast quote from Fouwell, verified industrial automation parts supplier.',
    canonical: url,
    breadcrumbHtml, h1: catName, subHtml, bodyHtml, schemas, navActive: 'products',
    altUrl: '/ru' + categoryUrl(catKey)
  });

  const dir = path.join(ROOT, 'products', catKey);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

/* ==================== Brand hub pages: /brands/<brand-slug>/ ==================== */
const brandsWithProducts = [...new Set(PRODUCTS.map(p => p.brand))].sort();
for (const brandName of brandsWithProducts) {
  const products = sortByMedia(PRODUCTS.filter(p => p.brand === brandName));
  const brand = brandOf(brandName); // may be undefined — hub still builds from real product data
  // "genuine" is a factual OEM-authenticity claim — false for disclosed compatible/non-OEM
  // brands (see NON_GENUINE_BRANDS in js/data.js; same rule already applied per-product in
  // buildMetaDescription()/main.js, found missing here 2026-09-14 while adding the RU mirror).
  const nonGenuine = NON_GENUINE_BRANDS.has(brandName);
  const url = 'https://fouwell.com' + brandUrl(brandName);

  const catsHere = [...new Set(products.map(p => p.cat))];
  const catLine = catsHere.map(c => CATEGORIES[c]).join(', ');

  const breadcrumbHtml = '<a href="/">Home</a> / <a href="/brands/">Brands</a> / <span>' + escHtml(brandName) + '</span>';
  const subHtml = '<p>' + products.length + (nonGenuine ? ' ' : ' genuine ') + escHtml(brandName) + ' model' + (products.length === 1 ? '' : 's') +
    (brand ? ' from ' + escHtml(brand.country) : '') + ' — ' + escHtml(catLine) + '. All sourced through official channels, 100% inspected before shipping.</p>';

  const catLinksHtml = catsHere.map(c =>
    '<a class="chip" href="' + categoryUrl(c) + '">' + escHtml(CATEGORIES[c]) + '</a>'
  ).join(' ');

  const otherBrandsHtml = brandsWithProducts
    .filter(b => b !== brandName)
    .slice(0, 12)
    .map(b => '<a href="' + brandUrl(b) + '">' + escHtml(b) + '</a>')
    .join(' · ');

  const bodyHtml =
    '      <div class="filter-bar" style="margin-bottom:20px;">\n' +
    '        <div class="chips">' + catLinksHtml + '</div>\n' +
    '      </div>\n' +
    '      <div class="result-count">' + products.length + ' product' + (products.length === 1 ? '' : 's') + ' found</div>\n' +
    '      <div class="feat-grid">\n' + products.map(productCard).join('\n') + '\n      </div>\n' +
    '      <div style="margin-top:44px;">\n' +
    '        <p style="color:#6b7794; margin-bottom:12px;">Other brands we supply: ' + otherBrandsHtml + ' — <a href="/products/">see full catalog</a>.</p>\n' +
    '        <div class="cta-band">\n' +
    '          <div>\n' +
    '            <h2>Need a ' + escHtml(brandName) + ' part not listed here?</h2>\n' +
    '            <p>Send the exact part number — we’ll confirm stock, lead time and pricing the same day.</p>\n' +
    '          </div>\n' +
    '          <a href="/contact/#inquiry" class="btn btn-primary">Send Part Number</a>\n' +
    '        </div>\n' +
    '      </div>\n';

  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
        { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://fouwell.com/brands/' },
        { '@type': 'ListItem', position: 3, name: brandName, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: brandName + ' | Fouwell', url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.model,
          url: 'https://fouwell.com' + productUrl(p)
        }))
      }
    }
  ];

  const html = renderShell({
    title: brandName + ' Parts Supplier | Fouwell Industrial Automation',
    metaDesc: (nonGenuine ? '' : 'Genuine ') + brandName + ' industrial automation parts' + (brand ? ' (' + brand.country + ')' : '') +
      ' — ' + products.length + ' models: ' + catLine + '. Official channel sourcing, fast quote from Fouwell.',
    canonical: url,
    breadcrumbHtml, h1: brandName, subHtml, bodyHtml, schemas, navActive: 'brands',
    altUrl: '/ru' + brandUrl(brandName)
  });

  const dir = path.join(ROOT, 'brands', brandSlug(brandName));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

/* ==================== Brands index: /brands/ ==================== */
{
  const url = 'https://fouwell.com/brands/';
  const rows = brandsWithProducts.map(b => {
    const brand = brandOf(b);
    const count = PRODUCTS.filter(p => p.brand === b).length;
    return '<a class="brand-tile" href="' + brandUrl(b) + '">' +
      (brand && brand.logo
        ? '<div class="brand-logo"><img src="' + brand.logo + '" alt="' + escHtml(b) + '" loading="lazy"></div>'
        : '<div class="brand-logo"><div class="brand-logo-text">' + escHtml(b) + '</div></div>') +
      '<div class="brand-name">' + escHtml(b) + '</div>' +
      '<div class="brand-country">' + (brand ? escHtml(brand.country) : '') + ' · ' + count + ' model' + (count === 1 ? '' : 's') + '</div>' +
      '</a>';
  }).join('\n');

  const breadcrumbHtml = '<a href="/">Home</a> / <span>Brands</span>';
  const subHtml = '<p>' + brandsWithProducts.length + ' brands with active, sourceable catalog data — click a brand to see its full model list.</p>';
  const bodyHtml = '      <div class="brand-wall">\n' + rows + '\n      </div>\n';

  const schemas = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: url }
    ]
  }];

  const html = renderShell({
    title: 'Brands We Supply | Fouwell Industrial Automation',
    metaDesc: 'Fouwell sources genuine industrial automation parts from ' + brandsWithProducts.length +
      ' brands including Siemens, ABB, Mitsubishi, OMRON, Yaskawa and Allen-Bradley — official channels, fast quotes.',
    canonical: url,
    breadcrumbHtml, h1: 'Brands We Supply', subHtml, bodyHtml, schemas, navActive: 'brands',
    altUrl: '/ru/brands/'
  });

  const dir = path.join(ROOT, 'brands');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

console.log('Prerendered ' + written + ' hub pages (category + brand + brands index).');

/* ==================== Regenerate sitemap-v2.xml ====================
 * Previously hand-maintained (product URLs only). Now fully regenerated here so the new
 * category/brand hub URLs can't silently drift out of sync with what actually exists —
 * same reasoning as the shared slug helpers: one generator, not two hand-kept lists. */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: 'https://fouwell.com/', changefreq: 'daily', priority: '1.0' },
  { loc: 'https://fouwell.com/products/', changefreq: 'daily', priority: '0.9' },
  { loc: 'https://fouwell.com/brands/', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://fouwell.com/about/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://fouwell.com/contact/', changefreq: 'monthly', priority: '0.5' },
  // /ru/ — 5 hand-authored core pages (Phase 1, 2026-09-14) + category/brand/product hubs
  // (Phase 2/3, same date, see wiki/log.md) generated by build-hub-pages-ru.js /
  // build-product-pages-ru.js — 1:1 with every EN URL below, looped the same way.
  { loc: 'https://fouwell.com/ru/', changefreq: 'daily', priority: '0.9' },
  { loc: 'https://fouwell.com/ru/products/', changefreq: 'daily', priority: '0.8' },
  { loc: 'https://fouwell.com/ru/brands/', changefreq: 'weekly', priority: '0.65' },
  { loc: 'https://fouwell.com/ru/about/', changefreq: 'monthly', priority: '0.45' },
  { loc: 'https://fouwell.com/ru/contact/', changefreq: 'monthly', priority: '0.45' }
];
Object.keys(CATEGORIES).forEach(catKey => {
  if (PRODUCTS.some(p => p.cat === catKey)) {
    urls.push({ loc: 'https://fouwell.com' + categoryUrl(catKey), changefreq: 'weekly', priority: '0.8' });
    urls.push({ loc: 'https://fouwell.com/ru' + categoryUrl(catKey), changefreq: 'weekly', priority: '0.7' });
  }
});
brandsWithProducts.forEach(b => {
  urls.push({ loc: 'https://fouwell.com' + brandUrl(b), changefreq: 'weekly', priority: '0.75' });
  urls.push({ loc: 'https://fouwell.com/ru' + brandUrl(b), changefreq: 'weekly', priority: '0.65' });
});
PRODUCTS.forEach(p => {
  urls.push({ loc: 'https://fouwell.com' + productUrl(p), changefreq: 'weekly', priority: '0.8' });
  urls.push({ loc: 'https://fouwell.com/ru' + productUrl(p), changefreq: 'weekly', priority: '0.7' });
});

const sitemapXml = '<?xml version=\'1.0\' encoding=\'UTF-8\'?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  urls.map(u => '<url><loc>' + u.loc + '</loc><lastmod>' + today + '</lastmod><changefreq>' + u.changefreq + '</changefreq><priority>' + u.priority + '</priority></url>').join('') +
  '</urlset>';
fs.writeFileSync(path.join(ROOT, 'sitemap-v2.xml'), sitemapXml, 'utf8');
const catHubCount = Object.keys(CATEGORIES).filter(k => PRODUCTS.some(p => p.cat === k)).length;
console.log('Regenerated sitemap-v2.xml with ' + urls.length + ' URLs (added ' + catHubCount + ' category + ' + brandsWithProducts.length + ' brand + 1 /brands/ hub URLs).');
