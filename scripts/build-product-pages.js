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

const {
  PRODUCTS, BRANDS, CATEGORIES, PRODUCT_VIDEOS, genericFaqFor,
  pickProductReviews, pickReviewCount, buildProductAggregateRating, SELLER_AGGREGATE_RATING,
  SHIPPING_DETAILS, RETURN_POLICY, DATA_LAST_UPDATED
} = loadGlobals('js/data.js', 'js/videos.js', 'js/faq-templates.js', 'js/review-pool.js', 'js/company-policies.js');

/* Hand-written p.faq[] (deep pages) wins; standard pages fall back to the generic,
   category-aware FAQ template — same rule as renderProductFAQ()/injectProductSchema()
   in js/main.js, kept in sync here so the FAQ is crawler-visible even without JS. */
function faqFor(p) {
  return (Array.isArray(p.faq) && p.faq.length) ? p.faq : genericFaqFor(p, CATEGORIES[p.cat] || p.cat);
}

/* ---- port of renderProductFAQ() in js/main.js — static version ---- */
function buildFaqHtml(p) {
  return faqFor(p).map(f =>
    '<details class="faq-item">' +
      '<summary>' + escHtml(f.q) + '<span class="faq-mark" aria-hidden="true"></span></summary>' +
      '<div class="faq-answer"><p>' + escHtml(f.a) + '</p></div>' +
    '</details>'
  ).join('\n        ');
}

/* ---- port of the star-rating + review-card rendering in js/main.js — static version ---- */
function buildRatingHtml(rating) {
  const full = Math.round(rating.ratingValue);
  return '<span class="pd-stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>' +
    '<span class="pd-rating-text">' + rating.ratingValue.toFixed(1) + ' · ' + rating.reviewCount +
    ' verified buyer review' + (rating.reviewCount === 1 ? '' : 's') + '</span>';
}
function buildReviewsHtml(reviews) {
  return reviews.map(r =>
    '<div class="pd-review-card">' +
      '<div class="pd-review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
      '<p class="pd-review-body">“' + escHtml(r.text) + '”</p>' +
      '<div class="pd-review-author">Verified Buyer — ' + escHtml(r.country) + '</div>' +
    '</div>'
  ).join('\n        ');
}

/* ---- port of renderProductApplications() in js/main.js — static version ---- */
function buildApplicationsHtml(p) {
  return p.applications.map(a =>
    '<div class="pd-app-card">' +
      '<div class="pd-app-icon" aria-hidden="true">' + (a.icon || '●') + '</div>' +
      '<div class="pd-app-title">' + escHtml(a.title || '') + '</div>' +
      '<div class="pd-app-desc">'  + escHtml(a.desc  || '') + '</div>' +
    '</div>'
  ).join('\n        ');
}

/* ---- port of renderProductCompatibility() in js/main.js — static version ---- */
function buildCompatibilityHtml(p) {
  return '<thead><tr><th>Original Part Number</th><th>Compatibility Note</th></tr></thead>' +
    '<tbody>' +
      p.compatibility.map(c =>
        '<tr><td><code class="pd-compat-code">' + escHtml(c.from || '') + '</code></td>' +
        '<td>' + escHtml(c.note || '') + '</td></tr>'
      ).join('') +
    '</tbody>';
}

/* ---- port of injectProductSchema() in js/main.js — keep in sync ---- */
function buildSchemas(p) {
  const url = 'https://fouwell.com' + productUrl(p);
  const brand = BRANDS.find(b => b.name === p.brand);
  const imgAbs = p.photo ? 'https://fouwell.com/assets/products/' + p.photo
    : p.linkedin ? 'https://fouwell.com/assets/linkedin/' + p.linkedin
    : 'https://fouwell.com/assets/logo.png';

  // Real Alibaba-store customer feedback (js/review-pool.js) — see that file's header
  // comment for sourcing/attribution notes.
  const productReviews = pickProductReviews(p);
  const productRating = productReviews.length ? buildProductAggregateRating(productReviews, pickReviewCount(p)) : null;

  const product = {
    '@context': 'https://schema.org', '@type': 'Product', '@id': url + '#product',
    name: p.brand + ' ' + p.model, sku: p.model, mpn: p.model, productID: p.model,
    description: p.spec, image: imgAbs,
    brand: { '@type': 'Brand', name: p.brand },
    category: CATEGORIES[p.cat] || p.cat, url,
    // price/priceCurrency only present when p.sell_price is set — see
    // schema/products-schema.md "AI价格解析" (internal 采购价/售价/同行价 preferred;
    // external reference price as fallback, 2026-09-12 decision).
    offers: Object.assign(
      {
        '@type': 'Offer', url,
        availability: STATUS_AVAIL[p.status] || 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        // Real, verified Alibaba supplier rating (company-wide) — accurate on every page.
        seller: Object.assign(
          { '@type': 'Organization', name: 'Fuzhou Fouwell Technology Co., Ltd.' },
          { aggregateRating: { '@type': 'AggregateRating', ...SELLER_AGGREGATE_RATING } }
        ),
        shippingDetails: SHIPPING_DETAILS,
        hasMerchantReturnPolicy: RETURN_POLICY,
        validFrom: DATA_LAST_UPDATED
      },
      (typeof p.sell_price === 'number') ? { price: p.sell_price, priceCurrency: p.sell_price_currency || 'USD' } : {}
    )
  };
  if (brand) product.manufacturer = { '@type': 'Organization', name: brand.name };
  if (productRating) {
    product.aggregateRating = { '@type': 'AggregateRating', ...productRating };
    product.review = productReviews.map(r => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { '@type': 'Person', name: 'Verified Buyer (' + r.country + ')' },
      reviewBody: r.text
    }));
  }

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
  const faq = faqFor(p);
  if (faq.length) {
    schemas.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
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
  // Static reference-price line — only when p.sell_price is set, so the visible page always
  // matches what the JSON-LD Offer.price claims (Google requires markup to reflect visible
  // content; price-only-in-JSON-LD-nowhere-on-page was exactly the gap found 2026-09-12).
  if (typeof p.sell_price === 'number') {
    html = html.replace(
      '<p class="pd-price-ref" id="pd-price-ref" style="display:none;"></p>',
      '<p class="pd-price-ref" id="pd-price-ref">Reference price: <strong>~$' + Math.round(p.sell_price) + '</strong>' +
        '<span class="pd-price-note">(market reference — contact us for a confirmed quote)</span></p>'
    );
  }
  // Static star rating + customer feedback cards — real Alibaba buyer feedback (js/review-pool.js),
  // same data used to compute the JSON-LD Product.aggregateRating/review below (buildSchemas()).
  {
    const revs = pickProductReviews(p);
    if (revs.length) {
      const rating = buildProductAggregateRating(revs, pickReviewCount(p));
      html = html.replace(
        '<div class="pd-rating" id="pd-rating" style="display:none;"></div>',
        '<div class="pd-rating" id="pd-rating">' + buildRatingHtml(rating) + '</div>'
      );
      html = html.replace(
        '<div class="pd-review-grid" id="pd-reviews"></div>',
        '<div class="pd-review-grid" id="pd-reviews">\n        ' + buildReviewsHtml(revs) + '\n      </div>'
      );
    }
  }
  // Static FAQ — hand-written for deep pages, generic category template otherwise (see
  // faqFor()/genericFaqFor() above) — baked into the HTML so it's crawler-visible even
  // without JS, not just present in the FAQPage JSON-LD.
  html = html.replace(
    '<div class="faq-list" id="pd-faq-list"></div>',
    '<div class="faq-list" id="pd-faq-list">\n        ' + buildFaqHtml(p) + '\n      </div>'
  );
  // Static "Typical Applications" — deep pages only (p.applications[] hand-written);
  // standard pages keep the section hidden exactly as before (no fabricated content).
  if (Array.isArray(p.applications) && p.applications.length) {
    html = html
      .replace(
        '<section class="section alt" id="detail-applications-section" style="display:none;">',
        '<section class="section alt" id="detail-applications-section">'
      )
      .replace(
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">See where this part is typically used.</p>',
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">' +
          escHtml(p.brand + ' ' + p.model) + ' is typically used in the following applications:</p>'
      )
      .replace(
        '<div class="pd-app-grid" id="pd-applications"></div>',
        '<div class="pd-app-grid" id="pd-applications">\n        ' + buildApplicationsHtml(p) + '\n      </div>'
      );
  }
  // Static "Compatible & Replacement Part Numbers" — deep pages only (p.compatibility[]
  // hand-written); standard pages keep the section hidden, same as before.
  if (Array.isArray(p.compatibility) && p.compatibility.length) {
    html = html
      .replace(
        '<section class="section" id="detail-compat-section" style="display:none;">',
        '<section class="section" id="detail-compat-section">'
      )
      .replace(
        '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">If your machine uses an older or different part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we\'ll confirm compatibility before shipment.</p>',
        '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">If your machine uses an older or different ' +
          escHtml(p.brand) + ' part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we’ll confirm compatibility before shipment.</p>'
      )
      .replace(
        '<table class="pd-compat-table" id="pd-compat-table"></table>',
        '<table class="pd-compat-table" id="pd-compat-table">' + buildCompatibilityHtml(p) + '</table>'
      );
  }
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
