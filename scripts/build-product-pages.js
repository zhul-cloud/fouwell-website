/* Prerender static /products/<slug>/index.html files with real Title/Meta/H1/canonical/
 * JSON-LD baked in, so crawlers and non-JS clients (WeChat/LinkedIn previews, AI bots that
 * don't execute scripts) see real content instead of the "Product Detail" placeholder shell.
 *
 * The client-side JS in main.js still runs on top of these files exactly as before — it
 * fills in the gallery, spec table, FAQ, related products, etc. On load it also re-injects
 * the same JSON-LD via injectProductSchema(), which first removes any script tagged
 * data-fouwell-dynamic-schema="1" — so we tag the statically-baked JSON-LD the same way,
 * and the JS's own cleanup-then-reinject step makes this idempotent (no duplicate schema).
 *
 * Run: node scripts/build-product-pages.js
 * Safe to re-run any time data.js/videos.js changes — fully regenerates all product pages.
 *
 * IMPORTANT: the slug/JSON-LD/meta-description/breadcrumb logic here is intentionally kept
 * in lockstep with the equivalent functions in js/main.js (productSlug/_slugPiece,
 * injectProductSchema, renderProductDetail's breadcrumb + meta description). If those
 * change, update this file too. Shared slug/URL helpers live in scripts/lib/site-data.js —
 * update there once and both this script and build-hub-pages.js pick it up.
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT, loadGlobals, productSlug, productUrl, categoryUrl, brandUrl, STATUS_AVAIL, escHtml
} = require('./lib/site-data');

const { PRODUCTS, BRANDS, CATEGORIES, PRODUCT_VIDEOS } = loadGlobals('js/data.js', 'js/videos.js');

/* ---- port of injectProductSchema() in js/main.js — keep in sync ---- */
function buildSchemas(p) {
  const url = 'https://fouwell.com' + productUrl(p);
  const brand = BRANDS.find(b => b.name === p.brand);
  const imgAbs = p.photo ? 'https://fouwell.com/assets/products/' + p.photo
    : p.linkedin ? 'https://fouwell.com/assets/linkedin/' + p.linkedin
    : 'https://fouwell.com/assets/logo.png';

  const product = {
    '@context': 'https://schema.org', '@type': 'Product', '@id': url + '#product',
    name: p.brand + ' ' + p.model, sku: p.model, mpn: p.model, productID: p.model,
    description: p.spec, image: imgAbs,
    brand: { '@type': 'Brand', name: p.brand },
    category: CATEGORIES[p.cat] || p.cat, url,
    offers: {
      '@type': 'Offer', url,
      availability: STATUS_AVAIL[p.status] || 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Fuzhou Fouwell Technology Co., Ltd.' }
    }
  };
  if (brand) product.manufacturer = { '@type': 'Organization', name: brand.name };

  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://fouwell.com/products/' }
    ]
  };
  if (p.cat) {
    breadcrumb.itemListElement.push({
      '@type': 'ListItem', position: 3, name: CATEGORIES[p.cat],
      item: 'https://fouwell.com' + categoryUrl(p.cat)
    });
  }
  breadcrumb.itemListElement.push({
    '@type': 'ListItem', position: breadcrumb.itemListElement.length + 1, name: p.model, item: url
  });

  const schemas = [product, breadcrumb];
  if (Array.isArray(p.faq) && p.faq.length) {
    schemas.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    });
  }
  return schemas;
}

/* ---- port of the meta-description template added to renderProductDetail() in main.js ---- */
function buildMetaDescription(p) {
  const availPhrase = p.status === 'discont' ? 'Replaced by a current equivalent'
    : p.status === 'legacy' ? 'Legacy line, still sourceable'
    : 'In stock, ships in 24h';
  return 'Genuine ' + p.brand + ' ' + p.model + ' — ' + p.spec + '. ' +
    availPhrase + '. Get a fast quote from Fouwell, verified industrial automation parts supplier.';
}

/* ---- port of the breadcrumb built in renderProductDetail() — keep in sync ---- */
function buildBreadcrumbHtml(p) {
  return '<a href="/">Home</a> / <a href="/products/">Products</a> / ' +
    (p.cat ? '<a href="' + categoryUrl(p.cat) + '">' + escHtml(CATEGORIES[p.cat]) + '</a> / ' : '') +
    '<span>' + escHtml(p.model) + '</span>';
}

/* ---- assemble one static HTML file from the product.html template ---- */
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'product.html'), 'utf8');

function renderPage(p) {
  const title = p.brand + ' ' + p.model + ' | Fouwell Industrial Automation';
  const metaDesc = buildMetaDescription(p);
  const url = 'https://fouwell.com' + productUrl(p);
  const schemaTags = buildSchemas(p)
    .map(obj => '<script type="application/ld+json" data-fouwell-dynamic-schema="1">' + JSON.stringify(obj) + '</script>')
    .join('\n  ');

  let html = TEMPLATE;
  html = html.replace(
    /<title>[^<]*<\/title>/,
    '<title>' + escHtml(title) + '</title>'
  );
  html = html.replace(
    /<meta name="description"[^>]*>/,
    '<meta name="description" content="' + escHtml(metaDesc) + '">'
  );
  // Insert canonical link + JSON-LD right before </head> (previously only added by JS at runtime)
  html = html.replace(
    '</head>',
    '  <link rel="canonical" href="' + url + '">\n  ' + schemaTags + '\n</head>'
  );
  // Real, crawlable breadcrumb (was previously JS-only via #breadcrumb) — links to the
  // category hub page, establishing the real internal-link hierarchy from day one.
  html = html.replace(
    /<div class="breadcrumb" id="breadcrumb">[^<]*(?:<a[^>]*>[^<]*<\/a>[^<]*)*<\/div>/,
    '<div class="breadcrumb" id="breadcrumb">' + buildBreadcrumbHtml(p) + '</div>'
  );
  html = html.replace(
    '<h1 id="page-title">Product Detail</h1>',
    '<h1 id="page-title">' + escHtml(p.brand + ' ' + p.model) + '</h1>'
  );
  html = html.replace(
    '<p id="page-sub">Genuine industrial automation parts, sourced from official channels.</p>',
    '<p id="page-sub">' + escHtml(p.spec) + '</p>'
  );
  // Static cross-links to the category + brand hub pages — real, crawlable version of
  // what main.js's renderProductDetail() also writes into #pd-crosslinks at runtime.
  html = html.replace(
    '<p class="pd-crosslinks" id="pd-crosslinks"></p>',
    '<p class="pd-crosslinks" id="pd-crosslinks">Browse more: ' +
      '<a href="' + categoryUrl(p.cat) + '">' + escHtml(CATEGORIES[p.cat]) + '</a> · ' +
      '<a href="' + brandUrl(p.brand) + '">' + escHtml(p.brand) + ' parts</a></p>'
  );
  return html;
}

/* ---- write one file per product ---- */
let written = 0;
for (const p of PRODUCTS) {
  const slug = productSlug(p);
  const dir = path.join(ROOT, 'products', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPage(p), 'utf8');
  written++;
}
console.log('Prerendered ' + written + ' product pages under products/<slug>/index.html');
