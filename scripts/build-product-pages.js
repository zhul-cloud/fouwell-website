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
  PRODUCTS, BRANDS, CATEGORIES, NON_GENUINE_BRANDS, PRODUCT_VIDEOS, genericFaqFor, genericApplicationsFor,
  pickProductReviews, pickReviewCount, buildProductAggregateRating, SELLER_AGGREGATE_RATING,
  SHIPPING_DETAILS, RETURN_POLICY, DATA_LAST_UPDATED, PRICE_VALID_UNTIL
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

/* Hand-written p.applications[] (deep pages) wins; standard pages fall back to the generic
   category-level template — same rule as faqFor(), kept in sync with js/main.js's
   renderProductApplications(). */
function applicationsFor(p) {
  return (Array.isArray(p.applications) && p.applications.length) ? p.applications : genericApplicationsFor(p);
}
function isSpecificApplications(p) {
  return Array.isArray(p.applications) && p.applications.length > 0;
}

/* ---- port of renderProductApplications() in js/main.js — static version ---- */
function buildApplicationsHtml(p) {
  return applicationsFor(p).map(a =>
    '<div class="pd-app-card">' +
      '<div class="pd-app-icon" aria-hidden="true">' + (a.icon || '●') + '</div>' +
      '<div class="pd-app-title">' + escHtml(a.title || '') + '</div>' +
      '<div class="pd-app-desc">'  + escHtml(a.desc  || '') + '</div>' +
    '</div>'
  ).join('\n        ');
}

/* ---- port of renderProductCompatibility() in js/main.js — static version ---- */
/* Relationship-type taxonomy (2026-09-17) — keep in sync with js/main.js's COMPAT_TYPE_LABEL. */
const COMPAT_TYPE_LABEL = {
  direct: 'Direct Replacement',
  successor: 'Manufacturer Successor',
  functional: 'Functional Alternative',
  compatible: 'Compatible',
  cross_reference: 'Cross Reference',
  same_series: 'Same Series'
};
function buildCompatibilityHtml(p) {
  const hasType = p.compatibility.some(c => c.type);
  return '<thead><tr><th>Original Part Number</th>' + (hasType ? '<th>Relationship</th>' : '') + '<th>Compatibility Note</th></tr></thead>' +
    '<tbody>' +
      p.compatibility.map(c =>
        '<tr><td><code class="pd-compat-code">' + escHtml(c.from || '') + '</code></td>' +
        (hasType ? '<td><span class="pill pd-compat-type pd-compat-type-' + escHtml(c.type || '') + '">' + escHtml(COMPAT_TYPE_LABEL[c.type] || c.type || '') + '</span></td>' : '') +
        '<td>' + escHtml(c.note || '') + '</td></tr>'
      ).join('') +
    '</tbody>';
}
/* Standard pages (no p.compatibility[]) get an inquiry CTA instead of a fabricated table —
   see js/faq-templates.js header comment for why compatibility is treated differently from
   FAQ/applications. */
function buildCompatibilityCtaHtml(p) {
  return '<a class="btn btn-primary" href="/contact/?model=' + encodeURIComponent(p.model) + '#inquiry">Send Your Part Number →</a>';
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
      (typeof p.sell_price === 'number')
        ? { price: p.sell_price, priceCurrency: p.sell_price_currency || 'USD', priceValidUntil: PRICE_VALID_UNTIL }
        : {}
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
  // p.no_known_replacement (2026-09-16): see js/faq-templates.js genericFaqFor() header comment
  // for why "Replaced by a current equivalent" isn't safe to assert for every discont SKU.
  const availPhrase = p.status === 'discont'
    ? (p.no_known_replacement ? 'Discontinued, refurbished stock only' : 'Replaced by a current equivalent')
    : p.status === 'legacy' ? 'Legacy line, still sourceable'
    : 'In stock, ships in 24h';
  // "Genuine" is a factual OEM-authenticity claim — never true for disclosed
  // compatible/non-OEM brands (see NON_GENUINE_BRANDS in js/data.js's comment header).
  const qualifier = NON_GENUINE_BRANDS.has(p.brand) ? '' : 'Genuine ';
  return qualifier + p.brand + ' ' + p.model + ' — ' + p.spec + '. ' +
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
  const ruUrl = '/ru/products/' + productSlug(p) + '/';
  const schemaTags = buildSchemas(p)
    .map(obj => '<script type="application/ld+json" data-fouwell-dynamic-schema="1">' + JSON.stringify(obj) + '</script>')
    .join('\n  ');

  let html = TEMPLATE;
  html = html
    .replace(/#EN_URL_ABS#/g, url)
    .replace(/#RU_URL_ABS#/g, 'https://fouwell.com' + ruUrl)
    .replace(/#RU_URL#/g, ruUrl);
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
  // Static price line — only when p.sell_price is set, so the visible page always
  // matches what the JSON-LD Offer.price claims (Google requires markup to reflect visible
  // content; price-only-in-JSON-LD-nowhere-on-page was exactly the gap found 2026-09-12).
  // 2026-09-13: dropped the "Reference price ... contact us for a confirmed quote" hedge
  // copy per user request — every sell_price now has a real sourced price_source (internal /
  // procurement_quote_min / ebay_ref / web_ref), none fabricated, so shown as a plain price.
  if (typeof p.sell_price === 'number') {
    html = html.replace(
      '<p class="pd-price-ref" id="pd-price-ref" style="display:none;"></p>',
      '<p class="pd-price-ref" id="pd-price-ref">Price: <strong>$' + p.sell_price.toFixed(2) + '</strong></p>'
    );
  }
  // Static "100% genuine" trust bullet — false for disclosed compatible/non-OEM brands
  // (see NON_GENUINE_BRANDS in js/data.js), so crawlers and non-JS clients must see the
  // corrected claim baked in too, not just after js/main.js hydrates.
  if (NON_GENUINE_BRANDS.has(p.brand)) {
    html = html.replace(
      '<li id="pd-genuine-badge"><span class="pt">✓</span> 100% genuine — official brand channels</li>',
      '<li id="pd-genuine-badge"><span class="pt">✓</span> Compatibility verified, quality-checked before shipping</li>'
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
  // Static "Typical Applications" — hand-written for deep pages, generic category-level
  // template for standard pages (2026-09-12) — every SKU now shows this section.
  {
    const specific = isSpecificApplications(p);
    html = html
      .replace(
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">See where this part is typically used.</p>',
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">' +
          (specific
            ? escHtml(p.brand + ' ' + p.model) + ' is typically used in the following applications:'
            : escHtml(CATEGORIES[p.cat] || p.cat) + ' like this one are typically used in the following applications:') +
          '</p>'
      )
      .replace(
        '<div class="pd-app-grid" id="pd-applications"></div>',
        '<div class="pd-app-grid" id="pd-applications">\n        ' + buildApplicationsHtml(p) + '\n      </div>'
      );
  }
  // Static "Compatible & Replacement Part Numbers" — hand-written table for deep pages;
  // standard pages (2026-09-12) show the section with an inquiry CTA instead of a table —
  // never a fabricated "part X replaces part Y" claim (see buildCompatibilityCtaHtml above).
  {
    const hasReal = Array.isArray(p.compatibility) && p.compatibility.length;
    html = html.replace(
      '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">If your machine uses an older or different part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we\'ll confirm compatibility before shipment.</p>',
      '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">' +
        (hasReal
          ? 'If your machine uses an older or different ' + escHtml(p.brand) + ' part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we’ll confirm compatibility before shipment.'
          : 'If your machine uses an older or different ' + escHtml(p.brand) + ' part number, we can confirm compatibility for you directly — we don’t have a pre-built cross-reference table for this exact model yet.') +
        '</p>'
    );
    if (hasReal) {
      html = html.replace(
        '<table class="pd-compat-table" id="pd-compat-table" style="display:none;"></table>',
        '<table class="pd-compat-table" id="pd-compat-table">' + buildCompatibilityHtml(p) + '</table>'
      );
    } else {
      html = html.replace(
        '<div class="pd-compat-cta" id="pd-compat-cta" style="display:none;"></div>',
        '<div class="pd-compat-cta" id="pd-compat-cta">' + buildCompatibilityCtaHtml(p) + '</div>'
      );
    }
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
