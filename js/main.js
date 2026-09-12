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
   - /products/<slug>/                              (new SEO-friendly URL)
   - /products/?model=<model>                       (legacy query-string, kept for backward-compat) */
function resolveProductFromURL() {
  if (typeof PRODUCTS === 'undefined') return null;
  const path = location.pathname;
  const m = path.match(/^\/products\/([^/]+)\/?$/);
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

/* Inject dynamic JSON-LD (Product + BreadcrumbList + FAQPage when present) into <head>.
   Called by renderProductDetail(). Google and AI engines read this for rich results. */
function injectProductSchema(p) {
  // Strip any previously injected dynamic schemas from this page
  document.querySelectorAll('script[data-fouwell-dynamic-schema]').forEach(s => s.remove());

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const url = 'https://fouwell.com' + productUrl(p);
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
    description: p.spec,
    image: imgAbs,
    brand: { '@type': 'Brand', name: p.brand },
    category: (typeof CATEGORIES !== 'undefined' && CATEGORIES[p.cat]) || p.cat,
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
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fouwell.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://fouwell.com/products/' }
    ]
  };
  if (p.cat && typeof CATEGORIES !== 'undefined') {
    breadcrumb.itemListElement.push({
      '@type': 'ListItem', position: 3,
      name: CATEGORIES[p.cat],
      item: 'https://fouwell.com' + categoryUrl(p.cat)
    });
  }
  breadcrumb.itemListElement.push({
    '@type': 'ListItem', position: breadcrumb.itemListElement.length + 1,
    name: p.model, item: url
  });

  const scripts = [product, breadcrumb];
  // Same hand-written-FAQ-wins-else-generic-template fallback as renderProductFAQ(), so
  // the FAQPage schema stays in sync with what's actually rendered on the page.
  const faqForSchema = (Array.isArray(p.faq) && p.faq.length)
    ? p.faq
    : (typeof genericFaqFor === 'function' ? genericFaqFor(p, (typeof CATEGORIES !== 'undefined' && CATEGORIES[p.cat]) || p.cat) : []);
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
  // category-aware FAQ template (js/faq-templates.js) instead of hiding the section —
  // every claim in it is already published elsewhere on the site (pd-points, /about/,
  // /contact/), just restated as extractable Q&A pairs.
  const faq = (Array.isArray(p.faq) && p.faq.length)
    ? p.faq
    : (typeof genericFaqFor === 'function' ? genericFaqFor(p, (typeof CATEGORIES !== 'undefined' && CATEGORIES[p.cat]) || p.cat) : []);
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
    sub.textContent = p.brand + ' ' + p.model + ' datasheet, manual collection and CAD symbols — download for engineering reference.';
  }
  section.style.display = '';
}

/* Stage B: Render the "Typical Applications" cards. Shown only when p.applications[] is set. */
function renderProductApplications(p) {
  const section = document.getElementById('detail-applications-section');
  if (!section) return;
  const list = document.getElementById('pd-applications');
  if (!Array.isArray(p.applications) || !p.applications.length) {
    section.style.display = 'none';
    return;
  }
  const intro = document.getElementById('pd-app-intro');
  if (intro) {
    intro.textContent = (p.brand + ' ' + p.model) + ' is typically used in the following applications:';
  }
  list.innerHTML = p.applications.map(a =>
    '<div class="pd-app-card">' +
      '<div class="pd-app-icon" aria-hidden="true">' + (a.icon || '●') + '</div>' +
      '<div class="pd-app-title">' + _escFaq(a.title || '') + '</div>' +
      '<div class="pd-app-desc">'  + _escFaq(a.desc  || '') + '</div>' +
    '</div>'
  ).join('');
  section.style.display = '';
}

/* Stage B: Render the cross-reference / compatibility table. Shown only when p.compatibility[] is set. */
function renderProductCompatibility(p) {
  const section = document.getElementById('detail-compat-section');
  if (!section) return;
  const tbl = document.getElementById('pd-compat-table');
  if (!Array.isArray(p.compatibility) || !p.compatibility.length) {
    section.style.display = 'none';
    return;
  }
  const intro = document.getElementById('pd-compat-intro');
  if (intro) {
    intro.textContent = 'If your machine uses an older or different ' + p.brand + ' part number, the table below shows drop-in options. Send your exact part number to info@fouwell.com and we’ll confirm compatibility before shipment.';
  }
  tbl.innerHTML =
    '<thead><tr><th>Original Part Number</th><th>Compatibility Note</th></tr></thead>' +
    '<tbody>' +
      p.compatibility.map(c =>
        '<tr><td><code class="pd-compat-code">' + _escFaq(c.from || '') + '</code></td>' +
        '<td>' + _escFaq(c.note || '') + '</td></tr>'
      ).join('') +
    '</tbody>';
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

/* Returns an <img> tag (or fallback div) for a product.
   Priority: real product photo (assets/products/) → LinkedIn marketing image (assets/linkedin/) → noimg placeholder. */
function productImage(p) {
  if (p.photo) {
    return '<img src="/assets/products/' + p.photo + '?' + ASSET_V + '" alt="' + p.model + '" loading="lazy">';
  }
  if (p.linkedin) {
    return '<img class="linkedin-fallback" src="/assets/linkedin/' + p.linkedin + '?' + ASSET_V + '" alt="' + p.model + ' (marketing)" loading="lazy">';
  }
  return '<div class="noimg">' + p.brand + '<br>Photo on request</div>';
}

function productCard(p) {
  const st = STATUS_LABEL[p.status] || STATUS_LABEL.instock;
  const url = productUrl(p);
  return (
    '<article class="prod-card">' +
      '<a class="thumb-link" href="' + url + '">' +
        '<div class="thumb">' + productImage(p) + '</div>' +
      '</a>' +
      '<div class="body">' +
        '<span class="cat">' + p.brand + ' · ' + CATEGORIES[p.cat] + '</span>' +
        '<a class="model-link" href="' + url + '"><h3>' + p.model + '</h3></a>' +
        '<div class="series">' + p.series + '</div>' +
        '<p class="desc">' + p.spec + '</p>' +
        '<div class="meta">' +
          '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
          '<a class="inq-link" href="/contact/?model=' + encodeURIComponent(p.model) + '#inquiry">Inquire →</a>' +
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
      '<div class="brand-country">' + b.country + '</div>' +
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
  const href = realCat ? '/products/' + realCat + '/' : '/products/';
  return (
    '<a class="cat-card" href="' + href + '">' +
      '<div class="cat-num">' + c.no + '</div>' +
      '<h3>' + c.title + '</h3>' +
      '<div class="cat-items">' + c.items + '</div>' +
      '<p class="cat-desc">' + c.desc + '</p>' +
      '<div class="cat-photo"><img src="' + c.img + '" alt="' + c.title + '" loading="lazy"></div>' +
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
  const st = STATUS_LABEL[p.status] || STATUS_LABEL.instock;
  const brand = brandOf(p.brand);

  // ---- breadcrumb / title ----
  document.getElementById('breadcrumb').innerHTML =
    '<a href="/">Home</a> / <a href="/products/">Products</a> / ' +
    (p.cat ? '<a href="' + categoryUrl(p.cat) + '">' + esc(CATEGORIES[p.cat]) + '</a> / ' : '') +
    '<span>' + esc(p.model) + '</span>';
  document.title = p.brand + ' ' + p.model + ' | Fouwell Industrial Automation';
  document.getElementById('page-title').textContent = p.brand + ' ' + p.model;
  document.getElementById('page-sub').textContent = p.spec;
  const crosslinks = document.getElementById('pd-crosslinks');
  if (crosslinks) {
    crosslinks.innerHTML = 'Browse more: <a href="' + categoryUrl(p.cat) + '">' + esc(CATEGORIES[p.cat]) +
      '</a> · <a href="' + brandUrl(p.brand) + '">' + esc(p.brand) + ' parts</a>';
  }

  // ---- meta description (per-product, was previously a single generic string for all pages) ----
  const availPhrase = p.status === 'discont' ? 'Replaced by a current equivalent'
    : p.status === 'legacy' ? 'Legacy line, still sourceable'
    : 'In stock, ships in 24h';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content',
      'Genuine ' + p.brand + ' ' + p.model + ' — ' + p.spec + '. ' +
      availPhrase + '. Get a fast quote from Fouwell, verified industrial automation parts supplier.');
  }

  // ---- canonical link ----
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', 'https://fouwell.com' + productUrl(p));

  // ---- gallery ----
  const imgs = productGallery(p);
  const mainImg = document.getElementById('pd-main-img');
  const thumbs = document.getElementById('pd-thumbs');
  const zoom = document.getElementById('pd-zoom');

  if (!imgs.length) {
    mainImg.alt = p.model;
    mainImg.style.display = 'none';
    zoom.style.display = 'none';
    thumbs.innerHTML = '<div class="pd-noimg">' + esc(p.brand) + '<br>Photo on request</div>';
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
  const brandHref = brandUrl(p.brand);
  if (brand && brand.logo) {
    brandRow.innerHTML =
      '<a href="' + brandHref + '"><img class="pd-brand-logo" src="' + brand.logo + '" alt="' + esc(brand.name) + '"></a>' +
      '<a class="pd-brand-name" href="' + brandHref + '">' + esc(brand.name) + '</a>' +
      '<span class="pd-brand-country">' + esc(brand.country) + '</span>';
    brandRow.querySelector('img').onerror = function () {
      this.parentNode.outerHTML = '<a class="pd-brand-text" href="' + brandHref + '">' + esc(brand.name) + '</a>';
    };
  } else {
    brandRow.innerHTML = '<a class="pd-brand-text" href="' + brandHref + '">' + esc(p.brand) + '</a>';
  }

  // ---- series / model / badges / spec ----
  document.getElementById('pd-series').textContent = p.series ? p.series + ' Series' : '';
  document.getElementById('pd-model').textContent = p.model;
  document.getElementById('pd-badges').innerHTML =
    '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
    '<a class="pill cat" href="' + categoryUrl(p.cat) + '">' + esc(CATEGORIES[p.cat]) + '</a>' +
    (brand ? '<span class="pill brand">' + esc(brand.country) + '</span>' : '');
  document.getElementById('pd-spec').textContent = p.spec;

  // ---- reference price (only when p.sell_price is set — see schema/products-schema.md
  // "AI价格解析": internal price preferred, external eBay/web reference as fallback.
  // Labeled explicitly as a reference, not a firm quote, since it may come from a
  // third-party listing rather than Fouwell's own pricing. ----
  const priceRef = document.getElementById('pd-price-ref');
  if (priceRef) {
    if (typeof p.sell_price === 'number') {
      priceRef.innerHTML = 'Reference price: <strong>~$' + Math.round(p.sell_price) + '</strong>' +
        '<span class="pd-price-note">(market reference — contact us for a confirmed quote)</span>';
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
      ratingEl.innerHTML = '<span class="pd-stars">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>' +
        '<span class="pd-rating-text">' + rating.ratingValue.toFixed(1) + ' · ' + rating.reviewCount + ' verified buyer review' + (rating.reviewCount === 1 ? '' : 's') + '</span>';
      ratingEl.style.display = '';
    }
  }

  // ---- customer feedback cards (same review-pool.js data as the rating above) ----
  const reviewsSection = document.getElementById('detail-reviews-section');
  const reviewsGrid = document.getElementById('pd-reviews');
  if (reviewsGrid && typeof pickProductReviews === 'function') {
    const revs = pickProductReviews(p);
    if (revs.length) {
      reviewsGrid.innerHTML = revs.map(r =>
        '<div class="pd-review-card">' +
          '<div class="pd-review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
          '<p class="pd-review-body">“' + esc(r.text) + '”</p>' +
          '<div class="pd-review-author">Verified Buyer — ' + esc(r.country) + '</div>' +
        '</div>'
      ).join('');
      if (reviewsSection) reviewsSection.style.display = '';
    } else if (reviewsSection) {
      reviewsSection.style.display = 'none';
    }
  }

  // ---- actions ----
  document.getElementById('pd-quote').href = '/contact/?model=' + encodeURIComponent(p.model) + '#inquiry';

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
  const rows = [
    ['Model', esc(p.model)],
    ['Brand', esc(p.brand) + (brand ? ' (' + esc(brand.country) + ')' : '')],
    ['Series', esc(p.series || '—')],
    ['Category', esc(CATEGORIES[p.cat] || '—')],
    ['Availability', st.label + (p.status === 'discont' ? ' — new version available' : '')],
    ['Specification', esc(p.spec)],
    ['Product Video', videos.length ? videos.map(v => esc(v.title)).join(', ') : 'Available on request']
  ];
  // Stage B: Append detailed specs (key/value rows from p.specs[]) when present.
  if (Array.isArray(p.specs) && p.specs.length) {
    p.specs.forEach(([k, v]) => {
      // Skip keys already shown in the basic block to avoid duplication
      const baseKeys = ['model', 'brand', 'series', 'category', 'availability', 'specification', 'product video'];
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
      catSel.insertAdjacentHTML('beforeend', '<option value="' + k + '">' + CATEGORIES[k] + '</option>');
    });

    let state = { brand: '', cat: '', status: '', q: '' };

    function render() {
      const q = state.q.trim().toLowerCase();
      const list = PRODUCTS.filter(p => {
        if (state.brand && p.brand !== state.brand) return false;
        if (state.cat && p.cat !== state.cat) return false;
        if (state.status && p.status !== state.status) return false;
        if (q) {
          const hay = (p.brand + ' ' + p.model + ' ' + p.series + ' ' + p.spec + ' ' + CATEGORIES[p.cat]).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      countEl.textContent = list.length + ' product' + (list.length === 1 ? '' : 's') + ' found';
      grid.innerHTML = list.length
        ? list.map(productCard).join('')
        : '<p style="grid-column:1/-1; text-align:center; color:#6b7794; padding:40px 0;">No match — but we source far more than what\'s listed. <a href="/contact/#inquiry">Send us your part number →</a></p>';
      chipWrap.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.brand === state.brand));
    }

    brandSel.addEventListener('change', () => { state.brand = brandSel.value; render(); });
    catSel.addEventListener('change', () => { state.cat = catSel.value; render(); });
    statusSel.addEventListener('change', () => { state.status = statusSel.value; render(); });
    searchInput.addEventListener('input', () => { state.q = searchInput.value; render(); });

    chipWrap.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.brand = (state.brand === chip.dataset.brand) ? '' : chip.dataset.brand;
      brandSel.value = state.brand;
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

      let canonicalHref = 'https://fouwell.com/products/';
      if (params.get('cat') && !params.get('brand') && !params.get('q') && !params.get('status')) {
        canonicalHref = 'https://fouwell.com' + categoryUrl(params.get('cat'));
      } else if (params.get('brand') && !params.get('cat') && !params.get('q') && !params.get('status')) {
        canonicalHref = 'https://fouwell.com' + brandUrl(params.get('brand'));
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
      root.innerHTML = '<div class="container"><div class="pd-notfound"><h2>Product not found</h2><p>We could not find "' + asked + '" in our online catalog — but we likely can source it. <a href="/contact/#inquiry">Send us the part number →</a></p></div></div>';
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
      e.preventDefault();
      const name = document.getElementById('if-name').value;
      const email = document.getElementById('if-email').value;
      const country = document.getElementById('if-country').value;
      const type = document.getElementById('if-type') ? document.getElementById('if-type').value : '';
      const parts = document.getElementById('if-parts').value;
      const msg = document.getElementById('if-message').value;
      const subject = 'Inquiry from ' + name + (parts ? ' — ' + parts.split('\n')[0].slice(0, 40) : '');
      const body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Country: ' + (country || '-') + '\n' +
        'Type: ' + (type || '-') + '\n\n' +
        'Part numbers / requirements:\n' + (parts || '-') + '\n\n' +
        'Message:\n' + (msg || '-') + '\n';

      const success = document.getElementById('form-success');
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

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
        finish('Thank you, <b>' + name.replace(/[<>]/g, '') + '</b>! Your inquiry has been sent to <b>info@fouwell.com</b>. Our team will reply within one business day.');
        form.reset();
      })
      .catch(function () {
        /* Fallback: if the relay is unreachable, open the visitor's email client. */
        finish('Thank you, <b>' + name.replace(/[<>]/g, '') + '</b>! Direct delivery is temporarily unavailable, so we opened your email client instead — just press send, addressed to <b>info@fouwell.com</b>.');
        window.location.href = 'mailto:info@fouwell.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        form.reset();
      });
    });
  }
});
