/* Fouwell site scripts: featured products, catalog filter, inquiry form,
   brand wall, category grid, and product photo fallback to LinkedIn marketing images. */

/* ============== SEO-friendly URL + Schema + FAQ infrastructure ============== */

/* Lowercase, hyphenated, ASCII slug for a product: brand + series + model.
   Used to build /products/<slug>/ URLs that are stable, human-readable, and
   rank well in both Google and generative engines (ChatGPT, Perplexity, etc.). */
function _slugPiece(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[\s_./]+/g, '-')        // spaces / underscores / dots / slashes → hyphen
    .replace(/[^a-z0-9-]/g, '')       // strip anything that isn't a-z, 0-9, hyphen
    .replace(/-+/g, '-')              // collapse multiple hyphens
    .replace(/^-|-$/g, '');           // trim leading/trailing hyphens
}
function productSlug(p) {
  return [_slugPiece(p.brand), _slugPiece(p.series), _slugPiece(p.model)]
    .filter(Boolean)
    .join('-');
}
function productUrl(p) { return '/products/' + productSlug(p) + '/'; }

/* Category hub (/products/<cat>/) and brand hub (/brands/<brand-slug>/) URLs — real,
   crawlable pages added 2026-09-12 (see scripts/build-hub-pages.js) replacing the old
   ?cat= query-filter-only / JS-chip-only approach with a real internal-link hierarchy. */
function categoryUrl(catKey) { return '/products/' + catKey + '/'; }
function brandUrl(brandName) { return '/brands/' + _slugPiece(brandName) + '/'; }

/* Build a slug → product lookup map. Called once after data.js has loaded. */
function buildProductSlugIndex() {
  PRODUCT_BY_SLUG = {};
  if (typeof PRODUCTS === 'undefined') return PRODUCT_BY_SLUG;
  PRODUCTS.forEach(p => { PRODUCT_BY_SLUG[productSlug(p)] = p; });
  return PRODUCT_BY_SLUG;
}

/* Resolve current URL to a product object. Supports:
   - /products/<slug>/ and /ru/products/<slug>/     (new SEO-friendly URL, both languages)
   - /products/?model=<model>                       (legacy query-string, kept for backward-compat)
   Bug found 2026-09-14 testing the RU product pages: this regex originally only matched
   /products/..., so on /ru/products/<slug>/ it always returned null — the DOMContentLoaded
   handler then treated every RU product page as "not found" and replaced #detail-root's
   innerHTML (price/rating/quote/gallery) with the not-found message, and renderProductDetail()
   never ran at all (so #related-grid also silently stayed empty). Caught via ego-browser,
   not caught by any static-HTML check, because the static prerender was correct — only the
   client-side hydration path was broken. */
function resolveProductFromURL() {
  if (typeof PRODUCTS === 'undefined') return null;
  const path = location.pathname;
  const m = path.match(/^\/(?:ru\/)?products\/([^/]+)\/?$/);
  if (m) {
    const slug = decodeURIComponent(m[1]);
    if (typeof PRODUCT_BY_SLUG === 'undefined') buildProductSlugIndex();
    if (PRODUCT_BY_SLUG[slug]) return PRODUCT_BY_SLUG[slug];
    // Fallback: try to match by model substring at the end of the slug
    const tail = slug.split('-').slice(-2).join('-');
    return PRODUCTS.find(p => productSlug(p).endsWith(tail)) || null;
  }
  const model = new URLSearchParams(location.search).get('model');
  if (model) return PRODUCTS.find(p => p.model === model) || null;
  return null;
}

/* Map our internal status to schema.org availability. */
const STATUS_AVAIL = {
  instock: 'https://schema.org/InStock',
  legacy:  'https://schema.org/LimitedAvailability',
  discont: 'https://schema.org/Discontinued'
};

/* ============== RU language helpers (2026-09-14, Phase 2/3) ==============
   Every RU page sets window.FOUWELL_LANG = 'ru' and loads js/i18n-ru.js before this file (see
   ru/product.html, ru/products/<cat>/, ru/brands/<slug>/, and the 5 Phase 1 core pages). These
   helpers pick the RU data source when present, falling back to the EN one otherwise — so this
   same renderProductDetail()/productCard()/etc. code path works for both languages without a
   { en, ru } branch at every call site. See js/i18n-ru.js for the RU data/template functions
   (CATEGORIES_RU, STATUS_LABEL_RU, PRODUCT_SPEC_RU, PRODUCT_DEEP_RU, genericFaqFor_ru(),
   genericApplicationsFor_ru(), UI_RU) and scripts/build-product-pages-ru.js / build-hub-pages-ru.js
   for the static-prerender mirror of this same logic — keep both in sync. */
function isRu() { return typeof window !== 'undefined' && window.FOUWELL_LANG === 'ru'; }
function catNameFor(catKey) {
  if (isRu() && typeof CATEGORIES_RU !== 'undefined') return CATEGORIES_RU[catKey] || (typeof CATEGORIES !== 'undefined' ? CATEGORIES[catKey] : catKey);
  return (typeof CATEGORIES !== 'undefined') ? CATEGORIES[catKey] : catKey;
}
function statusInfoFor(status) {
  if (isRu() && typeof STATUS_LABEL_RU !== 'undefined') return STATUS_LABEL_RU[status] || STATUS_LABEL_RU.instock;
  return STATUS_LABEL[status] || STATUS_LABEL.instock;
}
/* Wraps statusInfoFor() to correct the status *pill* text for a discont SKU with
   p.no_known_replacement (2026-09-16, see js/faq-templates.js genericFaqFor() header comment) —
   the shared STATUS_LABEL.discont/STATUS_LABEL_RU.discont label ("Replaced"/"Заменено") is
   accurate for every other discont SKU (a real successor model exists), but says the wrong
   thing on a pill with no surrounding explanation for a dead-end EOL part with no known
   replacement. Used at every card/badge render site instead of calling statusInfoFor()
   directly, so the fix applies everywhere a status pill shows, not just the detail page. */
function statusLabelFor(p) {
  const st = statusInfoFor(p.status);
  if (p.status === 'discont' && p.no_known_replacement) {
    const label = isRu() && typeof UI_RU !== 'undefined' ? (UI_RU.discontinuedLabel || 'Снято с производства') : 'Discontinued';
    return { label, cls: st.cls };
  }
  return st;
}
function specTextFor(p) {
  if (isRu() && typeof PRODUCT_SPEC_RU !== 'undefined' && PRODUCT_SPEC_RU[p.model]) return PRODUCT_SPEC_RU[p.model];
  return p.spec;
}
function countryTextFor(country) {
  if (isRu() && typeof COUNTRY_RU !== 'undefined') return COUNTRY_RU[country] || country;
  return country;
}
function productUrlFor(p) { return isRu() ? '/ru/products/' + productSlug(p) + '/' : productUrl(p); }
function categoryUrlFor(catKey) { return isRu() ? '/ru/products/' + catKey + '/' : categoryUrl(catKey); }
function brandUrlFor(brandName) { return isRu() ? '/ru/brands/' + _slugPiece(brandName) + '/' : brandUrl(brandName); }
function contactUrlFor() { return isRu() ? '/ru/contact/' : '/contact/'; }
function deepRuFor(p) { return (typeof PRODUCT_DEEP_RU !== 'undefined') ? PRODUCT_DEEP_RU[p.model] : null; }
function faqForCurrentLang(p) {
  if (isRu()) {
    const deep = deepRuFor(p);
    if (deep && Array.isArray(deep.faq) && deep.faq.length) return deep.faq;
    return (typeof genericFaqFor_ru === 'function') ? genericFaqFor_ru(p, catNameFor(p.cat)) : [];
  }
  return (Array.isArray(p.faq) && p.faq.length) ? p.faq : (typeof genericFaqFor === 'function' ? genericFaqFor(p, catNameFor(p.cat)) : []);
}
function applicationsForCurrentLang(p) {
  if (isRu()) {
    const deep = deepRuFor(p);
    if (deep && Array.isArray(deep.applications) && deep.applications.length) return deep.applications;
    return (typeof genericApplicationsFor_ru === 'function') ? genericApplicationsFor_ru(p) : [];
  }
  return (Array.isArray(p.applications) && p.applications.length) ? p.applications : (typeof genericApplicationsFor === 'function' ? genericApplicationsFor(p) : []);
}
function isSpecificApplicationsCurrentLang(p) {
  if (isRu()) {
    const deep = deepRuFor(p);
    return !!(deep && Array.isArray(deep.applications) && deep.applications.length);
  }
  return Array.isArray(p.applications) && p.applications.length > 0;
}
function compatibilityForCurrentLang(p) {
  if (isRu()) {
    const deep = deepRuFor(p);
    return (deep && Array.isArray(deep.compatibility) && deep.compatibility.length) ? deep.compatibility : null;
  }
  return (Array.isArray(p.compatibility) && p.compatibility.length) ? p.compatibility : null;
}

/* Relationship-type taxonomy (2026-09-17, see wiki/seo-geo/PartNumber字段级Schema提案.md and
   Product-Master-schema.sql's product_relationship.relationship_type) applied to
   p.compatibility[] entries. Optional per-entry `type` key — entries without it render exactly
   as before (2-column table, no badge), so this is backward-compatible with every existing
   compatibility[] array on the site. Replaces the old approach of one uniform note string for
   every row with a short classification, same idea as the fix for the "hardcoded brand-specific
   wording" class of bug (SOP文档 "异常怎么办" 第8条). */
const COMPAT_TYPE_LABEL = {
  direct: 'Direct Replacement',
  successor: 'Manufacturer Successor',
  functional: 'Functional Alternative',
  compatible: 'Compatible',
  cross_reference: 'Cross Reference',
  same_series: 'Same Series'
};

/* Inject dynamic JSON-LD (Product + BreadcrumbList + FAQPage when present) into <head>.
   Called by renderProductDetail(). Google and AI engines read this for rich results. */
function injectProductSchema(p) {
  // Strip any previously injected dynamic schemas from this page
  document.querySelectorAll('script[data-fouwell-dynamic-schema]').forEach(s => s.remove());

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const url = 'https://fouwell.com' + productUrlFor(p);
  const brand = (typeof BRANDS !== 'undefined') ? BRANDS.find(b => b.name === p.brand) : null;
  const imgAbs = (() => {
    if (p.photo) return 'https://fouwell.com/assets/products/' + p.photo;
    if (p.linkedin) return 'https://fouwell.com/assets/linkedin/' + p.linkedin;
    return 'https://fouwell.com/assets/logo.png';
  })();

  // Real Alibaba-store customer feedback (js/review-pool.js) — see that file's header
  // comment for sourcing/attribution notes. Product-level review/aggregateRating uses each
  // reviewer's own free-text comment only, not the specific item they originally ordered.
  const productReviews = (typeof pickProductReviews === 'function') ? pickProductReviews(p) : [];
  const productRating = productReviews.length && typeof buildProductAggregateRating === 'function'
    ? buildProductAggregateRating(productReviews, pickReviewCount(p)) : null;

  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url + '#product',
    name: p.brand + ' ' + p.model,
    sku: p.model,
    mpn: p.model,
    productID: p.model,
    description: specTextFor(p),
    image: imgAbs,
    ...(isRu() ? { inLanguage: 'ru' } : {}),
    brand: { '@type': 'Brand', name: p.brand },
    category: catNameFor(p.cat) || p.cat,
    url: url,
    offers: Object.assign(
      {
        '@type': 'Offer',
        url: url,
        availability: STATUS_AVAIL[p.status] || 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        // aggregateRating here is Fouwell's real, verified Alibaba supplier rating
        // (company-wide, not this specific SKU) — accurate on every page since Fouwell
        // is the seller on every page. See js/review-pool.js.
        seller: Object.assign(
          { '@type': 'Organization', name: 'Fuzhou Fouwell Technology Co., Ltd.' },
          (typeof SELLER_AGGREGATE_RATING !== 'undefined') ? { aggregateRating: { '@type': 'AggregateRating', ...SELLER_AGGREGATE_RATING } } : {}
        ),
        // Company-wide shipping/return policy — see js/company-policies.js for sourcing
        // notes and the 2026-09-12 decision record (standard small-parcel rate; heavy/
        // oversized items are freight-quoted separately, not covered by this flat rate).
        ...(typeof SHIPPING_DETAILS !== 'undefined' ? { shippingDetails: SHIPPING_DETAILS } : {}),
        ...(typeof RETURN_POLICY !== 'undefined' ? { hasMerchantReturnPolicy: RETURN_POLICY } : {}),
        // validFrom = fixed DATA_LAST_UPDATED constant (js/company-policies.js), NOT
        // today's date computed at load time — a per-visit "today" would misrepresent
        // freshness on every single page view.
        ...(typeof DATA_LAST_UPDATED !== 'undefined' ? { validFrom: DATA_LAST_UPDATED } : {})
      },
      // price/priceCurrency only present when p.sell_price is set — see
      // schema/products-schema.md "AI价格解析" for how it's populated (internal
      // 采购价/售价/同行价 preferred; external reference price — eBay first, then
      // general web search, median if multiple, converted to USD — as fallback,
      // 2026-09-12 decision). No price published for SKUs with none of the above,
      // rather than a fake placeholder.
      (typeof p.sell_price === 'number')
        ? Object.assign(
            { price: p.sell_price, priceCurrency: p.sell_price_currency || 'USD' },
            (typeof PRICE_VALID_UNTIL !== 'undefined') ? { priceValidUntil: PRICE_VALID_UNTIL } : {}
          )
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
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: isRu()
      ? [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://fouwell.com/ru/' },
          { '@type': 'ListItem', position: 2, name: 'Продукция', item: 'https://fouwell.com/ru/products/' }
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
          { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://fouwell.com/products/' }
        ]
  };
  if (p.cat) {
    breadcrumb.itemListElement.push({
      '@type': 'ListItem', position: 3,
      name: catNameFor(p.cat),
      item: 'https://fouwell.com' + categoryUrlFor(p.cat)
    });
  }
  breadcrumb.itemListElement.push({
    '@type': 'ListItem', position: breadcrumb.itemListElement.length + 1,
    name: p.model, item: url
  });

  const scripts = [product, breadcrumb];
  // Same hand-written-FAQ-wins-else-generic-template fallback as renderProductFAQ(), so
  // the FAQPage schema stays in sync with what's actually rendered on the page.
  const faqForSchema = faqForCurrentLang(p);
  if (faqForSchema.length) {
    scripts.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqForSchema.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }
  scripts.forEach(obj => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.fouwellDynamicSchema = '1';
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  });
}

/* Render the FAQ block inside #pd-faq-list. Each entry is a native <details> so it
   works without JS, supports keyboard navigation, and is crawlable by Google. */
function renderProductFAQ(p) {
  const list = document.getElementById('pd-faq-list');
  if (!list) return;
  // Hand-written FAQ (deep pages) wins; standard pages fall back to the generic,
  // category-aware FAQ template (js/faq-templates.js / js/i18n-ru.js) instead of hiding the
  // section — every claim in it is already published elsewhere on the site (pd-points, /about/,
  // /contact/), just restated as extractable Q&A pairs.
  const faq = faqForCurrentLang(p);
  if (!faq.length) {
    const section = document.getElementById('detail-faq-section');
    if (section) section.style.display = 'none';
    return;
  }
  list.innerHTML = faq.map((f, i) =>
    '<details class="faq-item">' +
      '<summary>' + _escFaq(f.q) + '<span class="faq-mark" aria-hidden="true"></span></summary>' +
      '<div class="faq-answer"><p>' + _escFaq(f.a) + '</p></div>' +
    '</details>'
  ).join('');
}
function _escFaq(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ============== End SEO/Schema/FAQ infrastructure ============== */

/* Stage B: Render the detailed datasheet download CTA. Shown only when p.datasheet is set. */
function renderProductDatasheet(p) {
  const section = document.getElementById('detail-datasheet-section');
  if (!section) return;
  if (!p.datasheet) { section.style.display = 'none'; return; }
  const link = document.getElementById('pd-datasheet-link');
  const sub  = document.getElementById('pd-ds-sub');
  if (link) link.href = p.datasheet;
  if (sub && p.brand && p.model) {
    sub.textContent = isRu()
      ? p.brand + ' ' + p.model + ' — технический паспорт, руководства и CAD-символы — скачайте для инженерных расчётов.'
      : p.brand + ' ' + p.model + ' datasheet, manual collection and CAD symbols — download for engineering reference.';
  }
  section.style.display = '';
}

/* Stage B: Render the "Typical Applications" cards. Hand-written p.applications[] (deep
   pages) wins; standard pages fall back to genericApplicationsFor()'s category-level
   template (2026-09-12) — every SKU now shows this section, not just the 6 deep pages. */
function renderProductApplications(p) {
  const section = document.getElementById('detail-applications-section');
  if (!section) return;
  const list = document.getElementById('pd-applications');
  const isSpecific = isSpecificApplicationsCurrentLang(p);
  const apps = applicationsForCurrentLang(p);
  if (!apps.length) {
    section.style.display = 'none';
    return;
  }
  const intro = document.getElementById('pd-app-intro');
  if (intro) {
    intro.textContent = isRu()
      ? (isSpecific
          ? (p.brand + ' ' + p.model) + ' обычно используется в следующих областях:'
          : catNameFor(p.cat) + ', подобные этому, обычно используются в следующих областях:')
      : (isSpecific
          ? (p.brand + ' ' + p.model) + ' is typically used in the following applications:'
          : catNameFor(p.cat) + ' like this one are typically used in the following applications:');
  }
  list.innerHTML = apps.map(a =>
    '<div class="pd-app-card">' +
      '<div class="pd-app-icon" aria-hidden="true">' + (a.icon || '●') + '</div>' +
      '<div class="pd-app-title">' + _escFaq(a.title || '') + '</div>' +
      '<div class="pd-app-desc">'  + _escFaq(a.desc  || '') + '</div>' +
    '</div>'
  ).join('');
  section.style.display = '';
}

/* Stage B: Render the cross-reference / compatibility table. Hand-written p.compatibility[]
   (deep pages) shows a real table; standard pages (2026-09-12) show this section too, but
   with an inquiry CTA instead of a table — never a fabricated "part X replaces part Y" claim,
   since that's a specific, checkable technical statement, unlike the generic FAQ/applications
   fallbacks (see js/faq-templates.js header comment for why compatibility is treated
   differently). */
function renderProductCompatibility(p) {
  const section = document.getElementById('detail-compat-section');
  if (!section) return;
  const tbl = document.getElementById('pd-compat-table');
  const cta = document.getElementById('pd-compat-cta');
  const compatRows = compatibilityForCurrentLang(p);
  const hasReal = !!compatRows;
  const intro = document.getElementById('pd-compat-intro');
  if (intro) {
    intro.textContent = isRu()
      ? (hasReal
          ? 'Если в вашем оборудовании используется более старый или другой номер детали ' + p.brand + ', таблица ниже показывает варианты прямой замены. Отправьте точный номер детали на info@fouwell.com — мы подтвердим совместимость перед отгрузкой.'
          : 'Если в вашем оборудовании используется более старый или другой номер детали ' + p.brand + ', мы можем подтвердить совместимость напрямую — у нас пока нет готовой таблицы аналогов именно для этой модели.')
      : (hasReal
          ? 'If your machine uses an older or different ' + p.brand + ' part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we’ll confirm compatibility before shipment.'
          : 'If your machine uses an older or different ' + p.brand + ' part number, we can confirm compatibility for you directly — we don’t have a pre-built cross-reference table for this exact model yet.');
  }
  if (hasReal) {
    const headers = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.compatHeaders : ['Original Part Number', 'Compatibility Note'];
    const hasType = compatRows.some(c => c.type);
    tbl.innerHTML =
      '<thead><tr><th>' + headers[0] + '</th>' + (hasType ? '<th>Relationship</th>' : '') + '<th>' + headers[1] + '</th></tr></thead>' +
      '<tbody>' +
        compatRows.map(c =>
          '<tr><td><code class="pd-compat-code">' + _escFaq(c.from || '') + '</code></td>' +
          (hasType ? '<td><span class="pill pd-compat-type pd-compat-type-' + _escFaq(c.type || '') + '">' + _escFaq(COMPAT_TYPE_LABEL[c.type] || c.type || '') + '</span></td>' : '') +
          '<td>' + _escFaq(c.note || '') + '</td></tr>'
        ).join('') +
      '</tbody>';
    if (tbl) tbl.style.display = '';
    if (cta) cta.style.display = 'none';
  } else {
    if (tbl) tbl.style.display = 'none';
    if (cta) {
      const btnLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.compatCtaBtn : 'Send Your Part Number →';
      cta.innerHTML = '<a class="btn btn-primary" href="' + contactUrlFor() + '?model=' + encodeURIComponent(p.model) + '#inquiry">' + btnLabel + '</a>';
      cta.style.display = '';
    }
  }
  section.style.display = '';
}

/* Cache-buster version — bump to force browsers + SiteGround Dynamic Cache
   to discard any stale 403/404 HTML they may still hold from before the
   /products/<slug>/ fix landed. Appended to every photo + video URL below. */
const ASSET_V = 'v=20260911final';

function _assetV(url) {
  if (!url) return url;
  return url + (url.indexOf('?') === -1 ? '?' : '&') + ASSET_V;
}

/* Whether a product has a REAL photographed material set (not just a LinkedIn marketing
   card fallback) — PRODUCT_PHOTOS entries are tagged "Photo" for the real thing, "Marketing"
   for the card fallback (see js/photos.js header comment / scripts/build_photos.py). Used
   both to pick the card thumbnail and to rank products with real photos above marketing-
   card-only products in listings (2026-09-14). */
function productHasRealPhoto(p) {
  const photos = (typeof PRODUCT_PHOTOS !== 'undefined' && PRODUCT_PHOTOS[p.model]) || [];
  return photos.some(function (x) { return x.tag === 'Photo'; });
}
function productHasVideo(p) {
  return !!(typeof PRODUCT_VIDEOS !== 'undefined' && PRODUCT_VIDEOS[p.model] && PRODUCT_VIDEOS[p.model].length);
}
/* Sort score for "media-complete" listings first: real photo + video (3) > real photo only
   (2) > video only, no real photo (1) > neither (0). Marketing-card-fallback and no-image
   both score 0 on the photo axis — the point of this ranking is to surface verified real
   material first, a generic fallback card isn't the same signal. */
function productMediaScore(p) {
  return (productHasRealPhoto(p) ? 2 : 0) + (productHasVideo(p) ? 1 : 0);
}

/* Returns an <img> tag (or fallback div) for a product.
   Priority: PRODUCT_PHOTOS (full packaged material set, real photo or marketing-card —
   same source used by the detail-page gallery in productGallery()) → legacy p.photo/
   p.linkedin fields on the PRODUCTS entry (kept as a fallback for any entry that predates
   photos.js) → noimg placeholder. Previously this only checked p.photo/p.linkedin and
   ignored PRODUCT_PHOTOS entirely, so a handful of SKUs with real material in photos.js but
   null photo/linkedin fields on their PRODUCTS entry showed a blank "Photo on request" card
   here despite having a real image on their own detail page (found 2026-09-14, 4 SKUs). */
function productImage(p) {
  const photos = (typeof PRODUCT_PHOTOS !== 'undefined' && PRODUCT_PHOTOS[p.model]) || [];
  if (photos.length) {
    const first = photos[0];
    const cls = first.tag === 'Marketing' ? ' class="linkedin-fallback"' : '';
    const alt = p.model + (first.tag === 'Marketing' ? ' (marketing)' : '');
    return '<img' + cls + ' src="' + _assetV(first.src) + '" alt="' + alt + '" loading="lazy">';
  }
  if (p.photo) {
    return '<img src="/assets/products/' + p.photo + '?' + ASSET_V + '" alt="' + p.model + '" loading="lazy">';
  }
  if (p.linkedin) {
    return '<img class="linkedin-fallback" src="/assets/linkedin/' + p.linkedin + '?' + ASSET_V + '" alt="' + p.model + ' (marketing)" loading="lazy">';
  }
  return '<div class="noimg">' + p.brand + '<br>' + (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.photoOnRequest : 'Photo on request') + '</div>';
}

function productCard(p) {
  const st = statusLabelFor(p);
  const url = productUrlFor(p);
  const inquireLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.inquire : 'Inquire →';
  return (
    '<article class="prod-card">' +
      '<a class="thumb-link" href="' + url + '">' +
        '<div class="thumb">' + productImage(p) + '</div>' +
      '</a>' +
      '<div class="body">' +
        '<span class="cat">' + p.brand + ' · ' + catNameFor(p.cat) + '</span>' +
        '<a class="model-link" href="' + url + '"><h3>' + p.model + '</h3></a>' +
        '<div class="series">' + p.series + '</div>' +
        '<p class="desc">' + specTextFor(p) + '</p>' +
        '<div class="meta">' +
          '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
          '<a class="inq-link" href="' + contactUrlFor() + '?model=' + encodeURIComponent(p.model) + '#inquiry">' + inquireLabel + '</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

/* Render a brand tile. Every brand uses the same uniform SVG badge; the name
   below is always the same size for a consistent look. */
function brandTile(b) {
  const img = b.logo
    ? '<img src="' + b.logo + '" alt="' + b.name + '" loading="lazy">'
    : '<div class="brand-logo-text" style="color:' + b.color + ';">' + b.name + '</div>';
  return (
    '<div class="brand-tile">' +
      '<div class="brand-logo">' + img + '</div>' +
      '<div class="brand-name">' + b.name + '</div>' +
      '<div class="brand-country">' + countryTextFor(b.country) + '</div>' +
    '</div>'
  );
}

/* CATEGORIES_HOME (10 broad marketing categories on the home page) is a wider aspirational
   taxonomy than CATEGORIES (the 6 real values products are actually tagged with) — only some
   ids have a clean real-category hub to link to; the rest fall back to the full catalog
   instead of a "?cat=" filter that would have matched zero products. */
const CATEGORIES_HOME_TO_REAL_CAT = {
  drives: 'drives', plc: 'controllers', hmi: 'hmi', sensors: 'sensors', motors: 'servo'
};

/* Render a category card with number, icon style, title, items, desc, and a real product photo. */
function categoryCard(c) {
  const realCat = CATEGORIES_HOME_TO_REAL_CAT[c.id];
  const href = isRu()
    ? (realCat ? '/ru/products/' + realCat + '/' : '/ru/products/')
    : (realCat ? '/products/' + realCat + '/' : '/products/');
  const tr = (isRu() && typeof CATEGORIES_HOME_RU !== 'undefined' && CATEGORIES_HOME_RU[c.id]) || c;
  return (
    '<a class="cat-card" href="' + href + '">' +
      '<div class="cat-num">' + c.no + '</div>' +
      '<h3>' + tr.title + '</h3>' +
      '<div class="cat-items">' + tr.items + '</div>' +
      '<p class="cat-desc">' + tr.desc + '</p>' +
      '<div class="cat-photo"><img src="' + c.img + '" alt="' + tr.title + '" loading="lazy"></div>' +
    '</a>'
  );
}

/* Build the image gallery array for a product.
   Priority: full original material set (assets/products/<model>/photos + nameplate, via PRODUCT_PHOTOS)
   → single real photo (assets/products/) → LinkedIn marketing image (assets/linkedin/).
   Every src is cache-busted so browsers + the SiteGround Dynamic Cache layer
   are forced to refetch (fixes "photos/video not visible" after the /products/<slug>/ repair). */
function productGallery(p) {
  const imgs = [];
  if (typeof PRODUCT_PHOTOS !== 'undefined' && PRODUCT_PHOTOS[p.model]) {
    PRODUCT_PHOTOS[p.model].forEach(it => imgs.push({ src: _assetV(it.src), tag: it.tag }));
    return imgs;
  }
  if (p.photo) imgs.push({ src: _assetV('/assets/products/' + p.photo), tag: 'Photo' });
  if (p.linkedin) imgs.push({ src: _assetV('/assets/linkedin/' + p.linkedin), tag: 'Marketing' });
  return imgs;
}

function brandOf(name) {
  return (typeof BRANDS !== 'undefined') ? BRANDS.find(b => b.name === name) : null;
}

/* Render the full product detail page (product.html?model=xxx or /products/<slug>/). */
function renderProductDetail(p) {
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const st = statusLabelFor(p);
  const brand = brandOf(p.brand);

  // ---- breadcrumb / title ----
  document.getElementById('breadcrumb').innerHTML = isRu()
    ? '<a href="/ru/">Главная</a> / <a href="/ru/products/">Продукция</a> / ' +
      (p.cat ? '<a href="' + categoryUrlFor(p.cat) + '">' + esc(catNameFor(p.cat)) + '</a> / ' : '') +
      '<span>' + esc(p.model) + '</span>'
    : '<a href="/">Home</a> / <a href="/products/">Products</a> / ' +
      (p.cat ? '<a href="' + categoryUrlFor(p.cat) + '">' + esc(catNameFor(p.cat)) + '</a> / ' : '') +
      '<span>' + esc(p.model) + '</span>';
  document.title = isRu()
    ? p.brand + ' ' + p.model + ' | Fouwell — промышленная автоматизация'
    : p.brand + ' ' + p.model + ' | Fouwell Industrial Automation';
  document.getElementById('page-title').textContent = p.brand + ' ' + p.model;
  document.getElementById('page-sub').textContent = specTextFor(p);
  const crosslinks = document.getElementById('pd-crosslinks');
  if (crosslinks) {
    crosslinks.innerHTML = isRu()
      ? (typeof UI_RU !== 'undefined' ? UI_RU.browseMore : 'Смотреть также:') + ' <a href="' + categoryUrlFor(p.cat) + '">' + esc(catNameFor(p.cat)) +
        '</a> · <a href="' + brandUrlFor(p.brand) + '">' + esc(p.brand) + ' — ' + (typeof UI_RU !== 'undefined' ? UI_RU.partsWord : 'детали') + '</a>'
      : 'Browse more: <a href="' + categoryUrlFor(p.cat) + '">' + esc(catNameFor(p.cat)) +
        '</a> · <a href="' + brandUrlFor(p.brand) + '">' + esc(p.brand) + ' parts</a>';
  }

  // ---- meta description (per-product, was previously a single generic string for all pages) ----
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    // "Genuine" is a factual OEM-authenticity claim — skip it for disclosed compatible/
    // non-OEM brands (see NON_GENUINE_BRANDS in js/data.js).
    const nonGenuine = typeof NON_GENUINE_BRANDS !== 'undefined' && NON_GENUINE_BRANDS.has(p.brand);
    // p.no_known_replacement (2026-09-16): see js/faq-templates.js genericFaqFor() header
    // comment — "Replaced by a current equivalent" isn't safe to assert when no replacement
    // has actually been verified.
    if (isRu() && typeof UI_RU !== 'undefined') {
      const availPhraseRu = p.status === 'discont'
        ? (p.no_known_replacement ? UI_RU.availDiscontNoReplacement : UI_RU.availDiscont)
        : p.status === 'legacy' ? UI_RU.availLegacy
        : UI_RU.availInstock;
      const qualifierRu = nonGenuine ? '' : UI_RU.genuinePrefix;
      metaDesc.setAttribute('content',
        qualifierRu + p.brand + ' ' + p.model + ' — ' + specTextFor(p) + '. ' + availPhraseRu + '. ' + UI_RU.metaDescSuffix);
    } else {
      const availPhrase = p.status === 'discont'
        ? (p.no_known_replacement ? 'Discontinued, refurbished stock only' : 'Replaced by a current equivalent')
        : p.status === 'legacy' ? 'Legacy line, still sourceable'
        : 'In stock, ships in 24h';
      const qualifier = nonGenuine ? '' : 'Genuine ';
      metaDesc.setAttribute('content',
        qualifier + p.brand + ' ' + p.model + ' — ' + p.spec + '. ' +
        availPhrase + '. Get a fast quote from Fouwell, verified industrial automation parts supplier.');
    }
  }

  // ---- canonical link ----
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', 'https://fouwell.com' + productUrlFor(p));

  // ---- gallery ----
  const imgs = productGallery(p);
  const mainImg = document.getElementById('pd-main-img');
  const thumbs = document.getElementById('pd-thumbs');
  const zoom = document.getElementById('pd-zoom');

  if (!imgs.length) {
    mainImg.alt = p.model;
    mainImg.style.display = 'none';
    zoom.style.display = 'none';
    thumbs.innerHTML = '<div class="pd-noimg">' + esc(p.brand) + '<br>' + (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.photoOnRequest : 'Photo on request') + '</div>';
  } else {
    mainImg.src = imgs[0].src;
    mainImg.alt = p.model + ' — ' + imgs[0].tag;
    const badge = document.createElement('span');
    badge.className = 'pd-img-badge';
    badge.textContent = imgs[0].tag;
    mainImg.parentNode.appendChild(badge);
    thumbs.innerHTML = imgs.map((im, i) =>
      '<button class="pd-thumb' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
        '<img src="' + im.src + '" alt="' + esc(p.model) + ' ' + (i + 1) + '" loading="lazy">' +
        '<span>' + im.tag + '</span>' +
      '</button>'
    ).join('');
    thumbs.querySelectorAll('.pd-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.i;
        mainImg.src = imgs[i].src;
        mainImg.alt = p.model + ' — ' + imgs[i].tag;
        document.querySelector('.pd-img-badge').textContent = imgs[i].tag;
        thumbs.querySelectorAll('.pd-thumb').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      });
    });
    // lightbox
    zoom.onclick = () => {
      document.getElementById('lightbox-img').src = mainImg.src;
      document.getElementById('lightbox').style.display = 'flex';
    };
    mainImg.onclick = zoom.onclick;
  }

  // ---- brand row ----
  const brandRow = document.getElementById('pd-brand-row');
  const brandHref = brandUrlFor(p.brand);
  const brandCountry = brand ? countryTextFor(brand.country) : '';
  if (brand && brand.logo) {
    brandRow.innerHTML =
      '<a href="' + brandHref + '"><img class="pd-brand-logo" src="' + brand.logo + '" alt="' + esc(brand.name) + '"></a>' +
      '<a class="pd-brand-name" href="' + brandHref + '">' + esc(brand.name) + '</a>' +
      '<span class="pd-brand-country">' + esc(brandCountry) + '</span>';
    brandRow.querySelector('img').onerror = function () {
      this.parentNode.outerHTML = '<a class="pd-brand-text" href="' + brandHref + '">' + esc(brand.name) + '</a>';
    };
  } else {
    brandRow.innerHTML = '<a class="pd-brand-text" href="' + brandHref + '">' + esc(p.brand) + '</a>';
  }

  // ---- series / model / badges / spec ----
  document.getElementById('pd-series').textContent = p.series
    ? (isRu() ? (typeof UI_RU !== 'undefined' ? UI_RU.seriesLabel : 'Серия') + ' ' + p.series : p.series + ' Series')
    : '';
  document.getElementById('pd-model').textContent = p.model;
  document.getElementById('pd-badges').innerHTML =
    '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
    '<a class="pill cat" href="' + categoryUrlFor(p.cat) + '">' + esc(catNameFor(p.cat)) + '</a>' +
    (brand ? '<span class="pill brand">' + esc(brandCountry) + '</span>' : '');
  document.getElementById('pd-spec').textContent = specTextFor(p);

  // "100% genuine" is a factual OEM-authenticity claim — false for disclosed compatible/
  // non-OEM brands (see NON_GENUINE_BRANDS in js/data.js). Swap the trust-list bullet instead
  // of just hiding it, since compatibility/quality-check is still a real, honest claim.
  const genuineBadge = document.getElementById('pd-genuine-badge');
  if (genuineBadge && typeof NON_GENUINE_BRANDS !== 'undefined' && NON_GENUINE_BRANDS.has(p.brand)) {
    genuineBadge.innerHTML = '<span class="pt">✓</span> ' + (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.genuineBadgeNonOem : 'Compatibility verified, quality-checked before shipping');
  }

  // ---- price (only when p.sell_price is set — see schema/products-schema.md "AI价格解析":
  // internal price / real procurement-quote price preferred, external eBay/web reference as
  // fallback only when neither exists. 2026-09-13: dropped the "Reference price ... contact
  // us for a confirmed quote" hedge copy per user request — every sell_price now has a real
  // sourced price_source (internal / procurement_quote_min / ebay_ref / web_ref), none of
  // them fabricated, so it's shown as a plain price line, not caveated as approximate. ----
  const priceRef = document.getElementById('pd-price-ref');
  if (priceRef) {
    if (typeof p.sell_price === 'number') {
      const priceLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.priceLabel : 'Price:';
      priceRef.innerHTML = priceLabel + ' <strong>$' + p.sell_price.toFixed(2) + '</strong>';
      priceRef.style.display = '';
    } else {
      priceRef.style.display = 'none';
    }
  }

  // ---- star rating (matches the Product.aggregateRating computed for JSON-LD below,
  // from js/review-pool.js's real Alibaba buyer feedback) ----
  const ratingEl = document.getElementById('pd-rating');
  if (ratingEl && typeof pickProductReviews === 'function') {
    const revs = pickProductReviews(p);
    if (revs.length) {
      const rating = buildProductAggregateRating(revs, pickReviewCount(p));
      const full = Math.round(rating.ratingValue);
      const reviewCountText = (isRu() && typeof ruPlural === 'function')
        ? rating.reviewCount + ' ' + ruPlural(rating.reviewCount, ['проверенный отзыв', 'проверенных отзыва', 'проверенных отзывов']) + ' ' + ruPlural(rating.reviewCount, ['покупателя', 'покупателей', 'покупателей'])
        : rating.reviewCount + ' verified buyer review' + (rating.reviewCount === 1 ? '' : 's');
      ratingEl.innerHTML = '<span class="pd-stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>' +
        '<span class="pd-rating-text">' + rating.ratingValue.toFixed(1) + ' · ' + reviewCountText + '</span>';
      ratingEl.style.display = '';
    }
  }

  // ---- customer feedback cards (same review-pool.js data as the rating above) ----
  const reviewsSection = document.getElementById('detail-reviews-section');
  const reviewsGrid = document.getElementById('pd-reviews');
  if (reviewsGrid && typeof pickProductReviews === 'function') {
    const revs = pickProductReviews(p);
    if (revs.length) {
      const verifiedBuyerLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.verifiedBuyer : 'Verified Buyer —';
      reviewsGrid.innerHTML = revs.map(r =>
        '<div class="pd-review-card">' +
          '<div class="pd-review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
          '<p class="pd-review-body">“' + esc(r.text) + '”</p>' +
          '<div class="pd-review-author">' + verifiedBuyerLabel + ' ' + esc(r.country) + '</div>' +
        '</div>'
      ).join('');
      if (reviewsSection) reviewsSection.style.display = '';
    } else if (reviewsSection) {
      reviewsSection.style.display = 'none';
    }
  }

  // ---- actions ----
  document.getElementById('pd-quote').href = contactUrlFor() + '?model=' + encodeURIComponent(p.model) + '#inquiry';

  // ---- video ----
  const videos = (typeof PRODUCT_VIDEOS !== 'undefined') ? (PRODUCT_VIDEOS[p.model] || []) : [];
  const vidSection = document.getElementById('detail-video-section');
  if (videos.length) {
    const wrap = document.getElementById('pd-videos');
    wrap.innerHTML = videos.map(v =>
      '<div class="pd-video-card">' +
        '<video controls preload="none" poster="' + (imgs.length ? _assetV(imgs[0].src) : '') + '">' +
          '<source src="' + _assetV(v.src) + '" type="video/mp4">' +
          'Your browser does not support the video tag.' +
        '</video>' +
        '<div class="pd-video-title">' + esc(v.title) + '</div>' +
      '</div>'
    ).join('');
    vidSection.style.display = 'block';
  }

  // ---- spec table ----
  const specSection = document.getElementById('detail-spec-section');
  specSection.style.display = 'block';
  const labels = (isRu() && typeof UI_RU !== 'undefined') ? UI_RU.specLabels : {
    model: 'Model', brand: 'Brand', series: 'Series', category: 'Category',
    availability: 'Availability', specification: 'Specification', video: 'Product Video',
    videoOnRequest: 'Available on request'
  };
  const rows = [
    [labels.model, esc(p.model)],
    [labels.brand, esc(p.brand) + (brand ? ' (' + esc(brandCountry) + ')' : '')],
    [labels.series, esc(p.series || '—')],
    [labels.category, esc(catNameFor(p.cat) || '—')],
    [labels.availability, st.label + (p.status === 'discont'
      ? (p.no_known_replacement
          ? (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.refurbishedOnly : ' — refurbished stock only')
          : (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.newVersionAvailable : ' — new version available'))
      : '')],
    [labels.specification, esc(specTextFor(p))],
    [labels.video, videos.length ? videos.map(v => esc(v.title)).join(', ') : labels.videoOnRequest]
  ];
  // Stage B: Append detailed specs (key/value rows from p.specs[] / PRODUCT_DEEP_RU[model].specs)
  // when present, skipping keys already shown in the basic block above.
  const deepSpecs = isRu() ? (deepRuFor(p) && deepRuFor(p).specs) : p.specs;
  if (Array.isArray(deepSpecs) && deepSpecs.length) {
    const baseKeys = Object.values(labels).map(s => String(s).toLowerCase());
    deepSpecs.forEach(([k, v]) => {
      if (baseKeys.indexOf(String(k).toLowerCase()) === -1) {
        rows.push([esc(k), esc(v)]);
      }
    });
  }
  document.getElementById('pd-spec-table').innerHTML = rows.map(([k, v]) =>
    '<tr><th>' + k + '</th><td>' + v + '</td></tr>'
  ).join('');

  // ---- related: same brand & category first, then category, then brand ----
  const related = PRODUCTS
    .filter(x => x.model !== p.model)
    .sort((a, b) => {
      const sa = (a.brand === p.brand) + (a.cat === p.cat);
      const sb = (b.brand === p.brand) + (b.cat === p.cat);
      return sb - sa;
    })
    .slice(0, 8);
  document.getElementById('related-grid').innerHTML = related.map(productCard).join('');

  // ---- FAQ + dynamic SEO/GEO schema (Product + BreadcrumbList + FAQPage) ----
  renderProductFAQ(p);
  injectProductSchema(p);

  // ---- Stage B: Datasheet + Applications + Compatibility (rendered only when data is present) ----
  renderProductDatasheet(p);
  renderProductApplications(p);
  renderProductCompatibility(p);
}

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Brand wall on home page ---- */
  const brandWall = document.getElementById('brand-wall');
  if (brandWall && typeof BRANDS !== 'undefined') {
    brandWall.innerHTML = BRANDS.map(brandTile).join('');
  }

  /* ---- 10-category grid on home page ---- */
  const catGrid = document.getElementById('cat-grid');
  if (catGrid && typeof CATEGORIES_HOME !== 'undefined') {
    catGrid.innerHTML = CATEGORIES_HOME.map(categoryCard).join('');
  }

  /* ---- Featured products on home page ---- */
  const featGrid = document.getElementById('featured-grid');
  if (featGrid) {
    const wanted = [
      "6ES7212-1AE40-0XB0", "NS10-TV01B-V2", "CIMR-AB4A0011FBA",
      "PS6X.2SWYDBXATKMKHAXXXXXXX", "2097-V34PR6-LM", "ATV12HU15M2",
      "AS228P-A", "R88D-KN08H-ECT"
    ];
    featGrid.innerHTML = wanted
      .map(m => PRODUCTS.find(p => p.model === m))
      .filter(Boolean)
      .map(productCard)
      .join('');
  }

  /* ---- Catalog page ---- */
  const grid = document.getElementById('catalog-grid');
  if (grid) {
    const brandSel = document.getElementById('f-brand');
    const catSel = document.getElementById('f-cat');
    const statusSel = document.getElementById('f-status');
    const searchInput = document.getElementById('f-search');
    const chipWrap = document.getElementById('brand-chips');
    const countEl = document.getElementById('result-count');

    // populate brand select + chips
    const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
    brands.forEach(b => {
      brandSel.insertAdjacentHTML('beforeend', '<option value="' + b + '">' + b + '</option>');
    });
    Object.keys(CATEGORIES).forEach(k => {
      catSel.insertAdjacentHTML('beforeend', '<option value="' + k + '">' + catNameFor(k) + '</option>');
    });

    let state = { brand: '', cat: '', status: '', q: '', page: 1 };
    const PAGE_SIZE = 24;
    const pagerEl = document.getElementById('catalog-pagination');

    // Products with real photographed material (+ video) rank first — a generic "Photo on
    // request" placeholder or marketing-card-only listing is a weaker trust signal than a
    // real photo set, so surface the media-complete listings before them (2026-09-14).
    // Array.prototype.sort is stable (spec-guaranteed since ES2019, true in every browser
    // this site needs to support), so within the same score the original PRODUCTS order —
    // whatever it already was — is preserved rather than shuffled.
    function sortByMedia(list) {
      return list.slice().sort((a, b) => productMediaScore(b) - productMediaScore(a));
    }

    function renderPagination(totalItems) {
      const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      if (state.page > totalPages) state.page = totalPages;
      if (totalPages <= 1) { pagerEl.innerHTML = ''; return; }

      const cur = state.page;
      // Page numbers to show: first, last, current ± 1, with … filling gaps.
      const pages = new Set([1, totalPages, cur - 1, cur, cur + 1]);
      const sorted = [...pages].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);

      const prevLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.prevPage : 'Previous page';
      const nextLabel = isRu() && typeof UI_RU !== 'undefined' ? UI_RU.nextPage : 'Next page';
      let html = '<button class="page-btn" id="page-prev"' + (cur === 1 ? ' disabled' : '') + ' aria-label="' + prevLabel + '">‹</button>';
      let prev = 0;
      for (const p of sorted) {
        if (prev && p - prev > 1) html += '<span class="page-ellipsis">…</span>';
        html += '<button class="page-btn' + (p === cur ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
        prev = p;
      }
      html += '<button class="page-btn" id="page-next"' + (cur === totalPages ? ' disabled' : '') + ' aria-label="' + nextLabel + '">›</button>';
      pagerEl.innerHTML = html;

      const prevBtn = document.getElementById('page-prev');
      const nextBtn = document.getElementById('page-next');
      if (prevBtn) prevBtn.addEventListener('click', () => goToPage(state.page - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goToPage(state.page + 1));
      pagerEl.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => goToPage(parseInt(btn.dataset.page, 10)));
      });
    }

    function goToPage(n) {
      state.page = n;
      render();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function render() {
      const q = state.q.trim().toLowerCase();
      const filtered = PRODUCTS.filter(p => {
        // Main catalog only lists SKUs with real photographed material (2026-09-14, user
        // request) — a listing page is a browsing/discovery surface, and a marketing-card
        // fallback or bare placeholder there reads as thin/untrustworthy at a glance in a
        // way it doesn't on a single product's own detail page. Video is NOT required (no
        // SKU currently has video without also having real photos anyway — video needs
        // photo material as its source per workflow E). This filter is scoped to THIS page
        // only: category/brand hub pages (build-hub-pages.js) still list every SKU in that
        // category/brand (sorted media-first, not filtered) since they're the complete
        // browse-by-category reference, not a curated storefront view. Filtered-out SKUs'
        // own detail pages are untouched — still live, still linked from hub pages, still
        // in sitemap-v2.xml — this only removes them from THIS listing's display.
        if (!productHasRealPhoto(p)) return false;
        if (state.brand && p.brand !== state.brand) return false;
        if (state.cat && p.cat !== state.cat) return false;
        if (state.status && p.status !== state.status) return false;
        if (q) {
          const hay = (p.brand + ' ' + p.model + ' ' + p.series + ' ' + p.spec + ' ' + specTextFor(p) + ' ' + CATEGORIES[p.cat] + ' ' + catNameFor(p.cat)).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      const list = sortByMedia(filtered);
      countEl.textContent = isRu() && typeof ruPlural === 'function'
        ? list.length + ' ' + ruPlural(list.length, ['товар найден', 'товара найдено', 'товаров найдено'])
        : list.length + ' product' + (list.length === 1 ? '' : 's') + ' found';
      const start = (state.page - 1) * PAGE_SIZE;
      const pageItems = list.slice(start, start + PAGE_SIZE);
      grid.innerHTML = list.length
        ? pageItems.map(productCard).join('')
        : '<p style="grid-column:1/-1; text-align:center; color:#6b7794; padding:40px 0;">' +
          (isRu() && typeof UI_RU !== 'undefined' ? UI_RU.noMatch : 'No match — but we source far more than what\'s listed. <a href="/contact/#inquiry">Send us your part number →</a>') +
          '</p>';
      renderPagination(list.length);
      chipWrap.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.brand === state.brand));
    }

    brandSel.addEventListener('change', () => { state.brand = brandSel.value; state.page = 1; render(); });
    catSel.addEventListener('change', () => { state.cat = catSel.value; state.page = 1; render(); });
    statusSel.addEventListener('change', () => { state.status = statusSel.value; state.page = 1; render(); });
    searchInput.addEventListener('input', () => { state.q = searchInput.value; state.page = 1; render(); });

    chipWrap.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.brand = (state.brand === chip.dataset.brand) ? '' : chip.dataset.brand;
      brandSel.value = state.brand;
      state.page = 1;
      render();
    });

    // chips: top brands
    ['Siemens', 'Mitsubishi', 'OMRON', 'Yaskawa', 'Schneider', 'ABB', 'Delta', 'VEGA', 'Allen-Bradley'].forEach(b => {
      chipWrap.insertAdjacentHTML('beforeend', '<button class="chip" data-brand="' + b + '">' + b + '</button>');
    });

    const params = new URLSearchParams(location.search);
    if (params.get('brand')) { state.brand = params.get('brand'); brandSel.value = state.brand; }
    if (params.get('cat')) { state.cat = params.get('cat'); catSel.value = state.cat; }
    if (params.get('q')) { state.q = params.get('q'); searchInput.value = state.q; }

    // ---- duplicate/low-value URL control: a filtered ?cat=/?brand=/?q= view now
    // duplicates a real hub page (or is a search-fragment with no canonical target of its
    // own), so keep it out of the index and point crawlers at the real page instead of
    // letting Google choose between two near-identical URLs on its own. ----
    if (params.get('cat') || params.get('brand') || params.get('q') || params.get('status')) {
      const robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'noindex,follow';
      document.head.appendChild(robotsMeta);

      let canonicalHref = 'https://fouwell.com' + (isRu() ? '/ru/products/' : '/products/');
      if (params.get('cat') && !params.get('brand') && !params.get('q') && !params.get('status')) {
        canonicalHref = 'https://fouwell.com' + categoryUrlFor(params.get('cat'));
      } else if (params.get('brand') && !params.get('cat') && !params.get('q') && !params.get('status')) {
        canonicalHref = 'https://fouwell.com' + brandUrlFor(params.get('brand'));
      }
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalHref);
    }

    render();
  }

  /* ---- Product detail page ---- */
  const root = document.getElementById('detail-root');
  if (root && typeof PRODUCTS !== 'undefined') {
    // Build slug index on first need, then resolve product from URL path or query string
    if (typeof PRODUCT_BY_SLUG === 'undefined') buildProductSlugIndex();
    const p = resolveProductFromURL();

    if (!p) {
      root.style.display = 'block';
      const asked = (location.pathname.match(/products\/([^/]+)/) || [])[1] || new URLSearchParams(location.search).get('model') || '';
      root.innerHTML = isRu()
        ? '<div class="container"><div class="pd-notfound"><h2>Товар не найден</h2><p>Мы не смогли найти «' + asked + '» в нашем онлайн-каталоге — но, скорее всего, можем его поставить. <a href="/ru/contact/#inquiry">Отправьте нам номер детали →</a></p></div></div>'
        : '<div class="container"><div class="pd-notfound"><h2>Product not found</h2><p>We could not find "' + asked + '" in our online catalog — but we likely can source it. <a href="/contact/#inquiry">Send us the part number →</a></p></div></div>';
    } else {
      renderProductDetail(p);
      root.style.display = 'block';
    }
  }

  /* ---- Inquiry form ---- */
  const form = document.getElementById('inquiry-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const pre = params.get('model');
    if (pre) {
      const input = document.getElementById('if-parts');
      if (input) input.value = pre + ' — ';
    }
    form.addEventListener('submit', function (e) {
      const name = document.getElementById('if-name').value;
      const email = document.getElementById('if-email').value;
      const country = document.getElementById('if-country').value;
      const type = document.getElementById('if-type') ? document.getElementById('if-type').value : '';
      const parts = document.getElementById('if-parts').value;
      const msg = document.getElementById('if-message').value;
      const subject = 'Inquiry from ' + name + (parts ? ' — ' + parts.split('\n')[0].slice(0, 40) : '');

      const isRu = window.FOUWELL_LANG === 'ru';

      /* File-upload path (2026-09-18): FormSubmit's AJAX/JSON endpoint does not support
         attachments (confirmed against their documentation) — only a classic native
         multipart/form-data POST does. So when the visitor has attached a file, we let the
         form submit natively (no preventDefault) instead of intercepting it, after filling
         in the two hidden fields (_subject/_replyto) that depend on the other field values.
         This trades the inline no-reload success message for this case only — a plain
         text-only inquiry below is unaffected and keeps the existing AJAX flow. */
      const filesInput = document.getElementById('if-files');
      const hasFiles = filesInput && filesInput.files && filesInput.files.length > 0;
      if (hasFiles) {
        let totalBytes = 0;
        for (let i = 0; i < filesInput.files.length; i++) totalBytes += filesInput.files[i].size;
        if (totalBytes > 10 * 1024 * 1024) {
          e.preventDefault();
          alert(isRu
            ? 'Общий размер вложений превышает 10MB (ограничение сервиса отправки форм). Уменьшите файлы или отправьте их отдельным письмом на info@fouwell.com.'
            : 'Combined attachment size is over the 10MB limit (a hard limit on the form-relay service). Please reduce the file size(s), or email them separately to info@fouwell.com.');
          return;
        }
        document.getElementById('if-hidden-subject').value = subject;
        document.getElementById('if-hidden-replyto').value = email;
        form.action = 'https://formsubmit.co/info@fouwell.com';
        form.method = 'POST';
        form.enctype = 'multipart/form-data';
        return; // let the browser submit natively — do not preventDefault
      }

      e.preventDefault();
      const body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Country: ' + (country || '-') + '\n' +
        'Type: ' + (type || '-') + '\n\n' +
        'Part numbers / requirements:\n' + (parts || '-') + '\n\n' +
        'Message:\n' + (msg || '-') + '\n';

      // The relay/mailto payload above stays in English regardless of page language — it's
      // an internal notification to Fouwell's own inbox, not visitor-facing copy. Only the
      // 3 strings the visitor actually reads get localized (2026-09-14, /ru/ launch).
      const t = isRu
        ? {
            sending: 'Отправка…',
            success: function (n) { return 'Спасибо, <b>' + n + '</b>! Ваш запрос отправлен на <b>info@fouwell.com</b>. Мы ответим в течение одного рабочего дня.'; },
            fallback: function (n) { return 'Спасибо, <b>' + n + '</b>! Прямая отправка временно недоступна, поэтому мы открыли ваш почтовый клиент — просто нажмите «отправить», адресат уже указан: <b>info@fouwell.com</b>.'; }
          }
        : {
            sending: 'Sending…',
            success: function (n) { return 'Thank you, <b>' + n + '</b>! Your inquiry has been sent to <b>info@fouwell.com</b>. Our team will reply within one business day.'; },
            fallback: function (n) { return 'Thank you, <b>' + n + '</b>! Direct delivery is temporarily unavailable, so we opened your email client instead — just press send, addressed to <b>info@fouwell.com</b>.'; }
          };

      const success = document.getElementById('form-success');
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = t.sending; }

      const finish = function (msg) {
        success.style.display = 'block';
        success.innerHTML = msg;
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      };

      /* Primary channel: POST the inquiry straight to info@fouwell.com
         (FormSubmit relay, no account needed — first submission triggers a
         one-time activation email to info@fouwell.com). */
      fetch('https://formsubmit.co/ajax/info@fouwell.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
          _replyto: email,
          Name: name,
          Email: email,
          Country: country || '-',
          'I am a': type || '-',
          'Part Numbers / Quantity': parts || '-',
          Message: msg || '-'
        })
      })
      .then(function (r) { return r.json(); })
      .then(function () {
        finish(t.success(name.replace(/[<>]/g, '')));
        form.reset();
      })
      .catch(function () {
        /* Fallback: if the relay is unreachable, open the visitor's email client. */
        finish(t.fallback(name.replace(/[<>]/g, '')));
        window.location.href = 'mailto:info@fouwell.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        form.reset();
      });
    });
  }
});
