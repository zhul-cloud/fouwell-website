/* Prerender static /ru/products/<slug>/index.html files — the Russian-language counterpart of
 * scripts/build-product-pages.js (Phase 2/3, 2026-09-14, see wiki/log.md same date and the
 * /ru/ Phase 1 infra it builds on).
 *
 * Deliberately a SEPARATE script rather than a `lang` flag threaded through
 * build-product-pages.js — same reasoning as js/main.js vs build-product-pages.js already being
 * kept in lockstep as two copies rather than one shared renderer: the two languages' template
 * strings, spec-table labels and meta-description grammar are different enough that a shared
 * function would need a { en, ru } branch at nearly every line anyway. If the EN generator
 * changes, check whether this file needs the same change (see EN file's own header comment for
 * the equivalent warning about js/main.js).
 *
 * Content sourcing:
 *   - p.spec (one-liner) -> PRODUCT_SPEC_RU[p.model] (js/i18n-ru.js), all 82 SKUs translated
 *   - p.specs/applications/compatibility/faq (6 deep-page SKUs) -> PRODUCT_DEEP_RU[p.model]
 *   - the other 76 SKUs' FAQ/Applications -> genericFaqFor_ru()/genericApplicationsFor_ru()
 *     (RU port of js/faq-templates.js, category-level generic content, same safety rule: never
 *     fabricates a compatibility table — standard pages get the inquiry CTA instead)
 *   - review text (js/review-pool.js) is NOT translated — these are attributed real Alibaba
 *     Trade Assurance buyer quotes; inventing a Russian paraphrase would misattribute words to a
 *     real reviewer. Only the surrounding UI labels (star count, "Verified Buyer —") are RU.
 *
 * Run: node scripts/build-product-pages-ru.js  (after build-product-pages.js, or any time
 * data.js/i18n-ru.js changes). Requires ru/products/<slug>/ URLs to exist 1:1 with EN
 * products/<slug>/ — every PRODUCTS entry gets both.
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT, loadGlobals, productSlug, productUrl, brandSlug, STATUS_AVAIL, escHtml
} = require('./lib/site-data');

const {
  PRODUCTS, BRANDS, NON_GENUINE_BRANDS,
  pickProductReviews, pickReviewCount, buildProductAggregateRating, SELLER_AGGREGATE_RATING,
  SHIPPING_DETAILS, RETURN_POLICY, DATA_LAST_UPDATED, PRICE_VALID_UNTIL,
  CATEGORIES_RU, PRODUCT_SPEC_RU, PRODUCT_DEEP_RU, UI_RU, ruPlural,
  genericFaqFor_ru, genericApplicationsFor_ru
} = loadGlobals(
  'js/data.js', 'js/videos.js', 'js/photos.js', 'js/faq-templates.js', 'js/review-pool.js',
  'js/company-policies.js', 'js/i18n-ru.js'
);

function ruUrl(p) { return '/ru/products/' + productSlug(p) + '/'; }
function ruCategoryUrl(catKey) { return '/ru/products/' + catKey + '/'; }
function ruBrandUrl(brandName) { return '/ru/brands/' + brandSlug(brandName) + '/'; }
function specRu(p) { return PRODUCT_SPEC_RU[p.model] || p.spec; }
function deepRu(p) { return PRODUCT_DEEP_RU[p.model]; }

function faqFor_ru(p) {
  const deep = deepRu(p);
  return (deep && Array.isArray(deep.faq) && deep.faq.length) ? deep.faq : genericFaqFor_ru(p, CATEGORIES_RU[p.cat] || p.cat);
}
function applicationsFor_ru(p) {
  const deep = deepRu(p);
  return (deep && Array.isArray(deep.applications) && deep.applications.length) ? deep.applications : genericApplicationsFor_ru(p);
}
function isSpecificApplications_ru(p) {
  const deep = deepRu(p);
  return !!(deep && Array.isArray(deep.applications) && deep.applications.length);
}

/* Russian grammatical agreement for "N verified buyer reviews" — see js/i18n-ru.js ruPlural(). */
function ruReviewCountText(n) {
  const reviewWord = ruPlural(n, ['проверенный отзыв', 'проверенных отзыва', 'проверенных отзывов']);
  const buyerWord = ruPlural(n, ['покупателя', 'покупателей', 'покупателей']);
  return n + ' ' + reviewWord + ' ' + buyerWord;
}

function buildFaqHtml_ru(p) {
  return faqFor_ru(p).map(f =>
    '<details class="faq-item">' +
      '<summary>' + escHtml(f.q) + '<span class="faq-mark" aria-hidden="true"></span></summary>' +
      '<div class="faq-answer"><p>' + escHtml(f.a) + '</p></div>' +
    '</details>'
  ).join('\n        ');
}

function buildRatingHtml_ru(rating) {
  const full = Math.round(rating.ratingValue);
  return '<span class="pd-stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>' +
    '<span class="pd-rating-text">' + rating.ratingValue.toFixed(1) + ' · ' + ruReviewCountText(rating.reviewCount) + '</span>';
}
function buildReviewsHtml_ru(reviews) {
  return reviews.map(r =>
    '<div class="pd-review-card">' +
      '<div class="pd-review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
      '<p class="pd-review-body">“' + escHtml(r.text) + '”</p>' +
      '<div class="pd-review-author">' + UI_RU.verifiedBuyer + ' ' + escHtml(r.country) + '</div>' +
    '</div>'
  ).join('\n        ');
}

function buildApplicationsHtml_ru(p) {
  return applicationsFor_ru(p).map(a =>
    '<div class="pd-app-card">' +
      '<div class="pd-app-icon" aria-hidden="true">' + (a.icon || '●') + '</div>' +
      '<div class="pd-app-title">' + escHtml(a.title || '') + '</div>' +
      '<div class="pd-app-desc">'  + escHtml(a.desc  || '') + '</div>' +
    '</div>'
  ).join('\n        ');
}

function buildCompatibilityHtml_ru(rows) {
  return '<thead><tr><th>' + UI_RU.compatHeaders[0] + '</th><th>' + UI_RU.compatHeaders[1] + '</th></tr></thead>' +
    '<tbody>' +
      rows.map(c =>
        '<tr><td><code class="pd-compat-code">' + escHtml(c.from || '') + '</code></td>' +
        '<td>' + escHtml(c.note || '') + '</td></tr>'
      ).join('') +
    '</tbody>';
}
function buildCompatibilityCtaHtml_ru(p) {
  return '<a class="btn btn-primary" href="/ru/contact/?model=' + encodeURIComponent(p.model) + '#inquiry">' + UI_RU.compatCtaBtn + '</a>';
}

function buildSchemas_ru(p) {
  const url = 'https://fouwell.com' + ruUrl(p);
  const brand = BRANDS.find(b => b.name === p.brand);
  const imgAbs = p.photo ? 'https://fouwell.com/assets/products/' + p.photo
    : p.linkedin ? 'https://fouwell.com/assets/linkedin/' + p.linkedin
    : 'https://fouwell.com/assets/logo.png';

  const productReviews = pickProductReviews(p);
  const productRating = productReviews.length ? buildProductAggregateRating(productReviews, pickReviewCount(p)) : null;

  const product = {
    '@context': 'https://schema.org', '@type': 'Product', '@id': url + '#product',
    name: p.brand + ' ' + p.model, sku: p.model, mpn: p.model, productID: p.model,
    description: specRu(p), image: imgAbs, inLanguage: 'ru',
    brand: { '@type': 'Brand', name: p.brand },
    category: CATEGORIES_RU[p.cat] || p.cat, url,
    offers: Object.assign(
      {
        '@type': 'Offer', url,
        availability: STATUS_AVAIL[p.status] || 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
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
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://fouwell.com/ru/' },
      { '@type': 'ListItem', position: 2, name: 'Продукция', item: 'https://fouwell.com/ru/products/' }
    ]
  };
  if (p.cat) {
    breadcrumb.itemListElement.push({
      '@type': 'ListItem', position: 3, name: CATEGORIES_RU[p.cat] || p.cat,
      item: 'https://fouwell.com' + ruCategoryUrl(p.cat)
    });
  }
  breadcrumb.itemListElement.push({
    '@type': 'ListItem', position: breadcrumb.itemListElement.length + 1, name: p.model, item: url
  });

  const schemas = [product, breadcrumb];
  const faq = faqFor_ru(p);
  if (faq.length) {
    schemas.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
    });
  }
  return schemas;
}

function buildMetaDescription_ru(p) {
  // p.no_known_replacement (2026-09-16): see js/faq-templates.js genericFaqFor() header comment.
  const availPhrase = p.status === 'discont'
    ? (p.no_known_replacement ? UI_RU.availDiscontNoReplacement : UI_RU.availDiscont)
    : p.status === 'legacy' ? UI_RU.availLegacy
    : UI_RU.availInstock;
  const qualifier = NON_GENUINE_BRANDS.has(p.brand) ? '' : UI_RU.genuinePrefix;
  return qualifier + p.brand + ' ' + p.model + ' — ' + specRu(p) + '. ' + availPhrase + '. ' + UI_RU.metaDescSuffix;
}

function buildBreadcrumbHtml_ru(p) {
  return '<a href="/ru/">Главная</a> / <a href="/ru/products/">Продукция</a> / ' +
    (p.cat ? '<a href="' + ruCategoryUrl(p.cat) + '">' + escHtml(CATEGORIES_RU[p.cat] || p.cat) + '</a> / ' : '') +
    '<span>' + escHtml(p.model) + '</span>';
}

const TEMPLATE = fs.readFileSync(path.join(ROOT, 'ru', 'product.html'), 'utf8');

function renderPage_ru(p) {
  const title = p.brand + ' ' + p.model + ' | Fouwell — промышленная автоматизация';
  const metaDesc = buildMetaDescription_ru(p);
  const url = 'https://fouwell.com' + ruUrl(p);
  const enUrl = productUrl(p);
  const schemaTags = buildSchemas_ru(p)
    .map(obj => '<script type="application/ld+json" data-fouwell-dynamic-schema="1">' + JSON.stringify(obj) + '</script>')
    .join('\n  ');

  let html = TEMPLATE;
  html = html
    .replace(/#RU_URL_ABS#/g, url)
    .replace(/#EN_URL_ABS#/g, 'https://fouwell.com' + enUrl)
    .replace(/#EN_URL#/g, enUrl);
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escHtml(title) + '</title>');
  html = html.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + escHtml(metaDesc) + '">');
  html = html.replace('</head>', '  <link rel="canonical" href="' + url + '">\n  ' + schemaTags + '\n</head>');
  html = html.replace(
    /<div class="breadcrumb" id="breadcrumb">[^<]*(?:<a[^>]*>[^<]*<\/a>[^<]*)*<\/div>/,
    '<div class="breadcrumb" id="breadcrumb">' + buildBreadcrumbHtml_ru(p) + '</div>'
  );
  html = html.replace(
    '<h1 id="page-title">Карточка товара</h1>',
    '<h1 id="page-title">' + escHtml(p.brand + ' ' + p.model) + '</h1>'
  );
  html = html.replace(
    '<p id="page-sub">Оригинальные детали промышленной автоматизации, поставляемые по официальным каналам.</p>',
    '<p id="page-sub">' + escHtml(specRu(p)) + '</p>'
  );
  html = html.replace(
    '<p class="pd-crosslinks" id="pd-crosslinks"></p>',
    '<p class="pd-crosslinks" id="pd-crosslinks">' + UI_RU.browseMore + ' ' +
      '<a href="' + ruCategoryUrl(p.cat) + '">' + escHtml(CATEGORIES_RU[p.cat] || p.cat) + '</a> · ' +
      '<a href="' + ruBrandUrl(p.brand) + '">' + escHtml(p.brand) + ' — ' + UI_RU.partsWord + '</a></p>'
  );
  if (typeof p.sell_price === 'number') {
    html = html.replace(
      '<p class="pd-price-ref" id="pd-price-ref" style="display:none;"></p>',
      '<p class="pd-price-ref" id="pd-price-ref">' + UI_RU.priceLabel + ' <strong>$' + p.sell_price.toFixed(2) + '</strong></p>'
    );
  }
  if (NON_GENUINE_BRANDS.has(p.brand)) {
    html = html.replace(
      '<li id="pd-genuine-badge"><span class="pt">✓</span> 100% оригинал — официальные каналы бренда</li>',
      '<li id="pd-genuine-badge"><span class="pt">✓</span> ' + UI_RU.genuineBadgeNonOem + '</li>'
    );
  }
  {
    const revs = pickProductReviews(p);
    if (revs.length) {
      const rating = buildProductAggregateRating(revs, pickReviewCount(p));
      html = html.replace(
        '<div class="pd-rating" id="pd-rating" style="display:none;"></div>',
        '<div class="pd-rating" id="pd-rating">' + buildRatingHtml_ru(rating) + '</div>'
      );
      html = html.replace(
        '<div class="pd-review-grid" id="pd-reviews"></div>',
        '<div class="pd-review-grid" id="pd-reviews">\n        ' + buildReviewsHtml_ru(revs) + '\n      </div>'
      );
    }
  }
  html = html.replace(
    '<div class="faq-list" id="pd-faq-list"></div>',
    '<div class="faq-list" id="pd-faq-list">\n        ' + buildFaqHtml_ru(p) + '\n      </div>'
  );
  {
    const specific = isSpecificApplications_ru(p);
    html = html
      .replace(
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">Узнайте, где обычно применяется эта деталь.</p>',
        '<p id="pd-app-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">' +
          (specific
            ? escHtml(p.brand + ' ' + p.model) + ' обычно используется в следующих областях:'
            : escHtml(CATEGORIES_RU[p.cat] || p.cat) + ', подобные этому, обычно используются в следующих областях:') +
          '</p>'
      )
      .replace(
        '<div class="pd-app-grid" id="pd-applications"></div>',
        '<div class="pd-app-grid" id="pd-applications">\n        ' + buildApplicationsHtml_ru(p) + '\n      </div>'
      );
  }
  {
    const deep = deepRu(p);
    const hasReal = deep && Array.isArray(deep.compatibility) && deep.compatibility.length;
    html = html.replace(
      '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">Если в вашем оборудовании используется более старый или другой номер детали, таблица ниже показывает варианты прямой замены. Отправьте точный номер детали на info@fouwell.com — мы подтвердим совместимость перед отгрузкой.</p>',
      '<p id="pd-compat-intro" style="text-align:left; margin:0 auto 0; color:#5a6473; max-width:760px;">' +
        (hasReal
          ? 'Если в вашем оборудовании используется более старый или другой номер детали ' + escHtml(p.brand) + ', таблица ниже показывает варианты прямой замены. Отправьте точный номер детали на info@fouwell.com — мы подтвердим совместимость перед отгрузкой.'
          : 'Если в вашем оборудовании используется более старый или другой номер детали ' + escHtml(p.brand) + ', мы можем подтвердить совместимость напрямую — у нас пока нет готовой таблицы аналогов именно для этой модели.') +
        '</p>'
    );
    if (hasReal) {
      html = html.replace(
        '<table class="pd-compat-table" id="pd-compat-table" style="display:none;"></table>',
        '<table class="pd-compat-table" id="pd-compat-table">' + buildCompatibilityHtml_ru(deep.compatibility) + '</table>'
      );
    } else {
      html = html.replace(
        '<div class="pd-compat-cta" id="pd-compat-cta" style="display:none;"></div>',
        '<div class="pd-compat-cta" id="pd-compat-cta">' + buildCompatibilityCtaHtml_ru(p) + '</div>'
      );
    }
  }
  // Datasheet CTA subtitle (same PDF asset as the EN page — the file itself isn't translated,
  // only the surrounding label). Gallery, spec table, related-grid and the video section stay
  // JS-only here too, exactly matching build-product-pages.js's scope — js/main.js's RU
  // branches (renderProductDetail()) render them client-side for both languages alike.
  if (p.datasheet) {
    html = html.replace(
      '<div class="pd-ds-sub" id="pd-ds-sub">Siemens 6ES7212-1AE40-0XB0 — технический паспорт, руководства и CAD-символы — скачайте для инженерных расчётов.</div>',
      '<div class="pd-ds-sub" id="pd-ds-sub">' + escHtml(p.brand + ' ' + p.model) + ' — технический паспорт, руководства и CAD-символы — скачайте для инженерных расчётов.</div>'
    );
  }
  return html;
}

let written = 0;
for (const p of PRODUCTS) {
  const slug = productSlug(p);
  const dir = path.join(ROOT, 'ru', 'products', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderPage_ru(p), 'utf8');
  written++;
}
console.log('Prerendered ' + written + ' RU product pages under ru/products/<slug>/index.html');
