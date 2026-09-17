/* Prerender Russian-language Category Hub pages (/ru/products/<category>/) and Brand Hub
 * pages (/ru/brands/<brand-slug>/) — the RU counterpart of scripts/build-hub-pages.js
 * (Phase 2/3, 2026-09-14, see wiki/log.md same date).
 *
 * Also regenerates ru/brands/index.html, replacing the Phase 1 hand-authored snapshot (which
 * linked out to the EN /brands/<slug>/ pages with a "not translated yet" disclosure) now that
 * real /ru/brands/<slug>/ pages exist — see schema/products-schema.md's /ru/ section for the
 * Phase 1 -> Phase 2/3 handoff note. ru/products/index.html itself is NOT regenerated here —
 * it's a hand-authored marketing shell (topbar/hero copy) whose #catalog-grid is populated by
 * js/main.js at runtime; only its "still in English" disclosure banner needs removing (done as
 * a one-off Edit, not by this script).
 *
 * Deliberately a separate script from build-hub-pages.js — same "kept in lockstep as two
 * copies" reasoning as build-product-pages.js vs build-product-pages-ru.js (see that file's
 * header comment).
 *
 * Run: node scripts/build-hub-pages-ru.js  (after build-hub-pages.js, or any time
 * data.js/i18n-ru.js changes)
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT, loadGlobals, productUrl, productSlug, categoryUrl, brandUrl, brandSlug, escHtml
} = require('./lib/site-data');

const {
  PRODUCTS, BRANDS, NON_GENUINE_BRANDS, PRODUCT_PHOTOS, PRODUCT_VIDEOS,
  CATEGORIES_RU, STATUS_LABEL_RU, PRODUCT_SPEC_RU, COUNTRY_RU, UI_RU, ruPlural
} = loadGlobals('js/data.js', 'js/videos.js', 'js/photos.js', 'js/i18n-ru.js');

function productHasRealPhoto(p) { return (PRODUCT_PHOTOS[p.model] || []).some((x) => x.tag === 'Photo'); }
function productHasVideo(p) { return !!(PRODUCT_VIDEOS[p.model] && PRODUCT_VIDEOS[p.model].length); }
function productMediaScore(p) { return (productHasRealPhoto(p) ? 2 : 0) + (productHasVideo(p) ? 1 : 0); }
function sortByMedia(list) { return list.slice().sort((a, b) => productMediaScore(b) - productMediaScore(a)); }
function brandOf(name) { return BRANDS.find(b => b.name === name); }
function specRu(p) { return PRODUCT_SPEC_RU[p.model] || p.spec; }
function ruCategoryUrl(catKey) { return '/ru/products/' + catKey + '/'; }
function ruBrandUrl(brandName) { return '/ru/brands/' + brandSlug(brandName) + '/'; }

/* ---- port of productCard() — RU version, links to /ru/products/<slug>/ ---- */
function productCard(p) {
  // p.no_known_replacement (2026-09-16): RU mirror of the same fix in build-hub-pages.js /
  // js/main.js statusLabelFor() — see that function's header comment.
  const st = (p.status === 'discont' && p.no_known_replacement)
    ? { label: UI_RU.discontinuedLabel, cls: STATUS_LABEL_RU.discont.cls }
    : (STATUS_LABEL_RU[p.status] || STATUS_LABEL_RU.instock);
  const url = ruUrlOf(p);
  const photos = PRODUCT_PHOTOS[p.model] || [];
  const img = photos.length
    ? '<img' + (photos[0].tag === 'Marketing' ? ' class="linkedin-fallback"' : '') +
      ' src="' + photos[0].src + '" alt="' + escHtml(p.model) + (photos[0].tag === 'Marketing' ? ' (маркетинг)' : '') + '" loading="lazy">'
    : p.photo
    ? '<img src="/assets/products/' + p.photo + '" alt="' + escHtml(p.model) + '" loading="lazy">'
    : p.linkedin
    ? '<img class="linkedin-fallback" src="/assets/linkedin/' + p.linkedin + '" alt="' + escHtml(p.model) + ' (маркетинг)" loading="lazy">'
    : '<div class="noimg">' + escHtml(p.brand) + '<br>' + UI_RU.photoOnRequest + '</div>';
  return (
    '<article class="prod-card">' +
      '<a class="thumb-link" href="' + url + '"><div class="thumb">' + img + '</div></a>' +
      '<div class="body">' +
        '<span class="cat">' + escHtml(p.brand) + ' · ' + escHtml(CATEGORIES_RU[p.cat] || p.cat) + '</span>' +
        '<a class="model-link" href="' + url + '"><h3>' + escHtml(p.model) + '</h3></a>' +
        '<div class="series">' + escHtml(p.series || '') + '</div>' +
        '<p class="desc">' + escHtml(specRu(p)) + '</p>' +
        '<div class="meta">' +
          '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
          '<a class="inq-link" href="/ru/contact/?model=' + encodeURIComponent(p.model) + '#inquiry">' + UI_RU.inquire + '</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}
function ruUrlOf(p) { return '/ru/products/' + productSlug(p) + '/'; }

const PAGE_SHELL = fs.readFileSync(path.join(ROOT, 'ru', 'products', 'index.html'), 'utf8');
const HERO_START = PAGE_SHELL.indexOf('<section class="page-hero">');
const CONTENT_END = PAGE_SHELL.indexOf('<footer class="site-footer">');
const HEAD_AND_NAV = PAGE_SHELL.slice(0, HERO_START)
  .replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n/g, '');
const FOOTER_AND_SCRIPTS = PAGE_SHELL.slice(CONTENT_END);

function renderShell({ title, metaDesc, canonical, breadcrumbHtml, h1, subHtml, bodyHtml, schemas, navActive, altUrl }) {
  let head = HEAD_AND_NAV
    .replace(/<title>[^<]*<\/title>/, '<title>' + escHtml(title) + '</title>')
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + escHtml(metaDesc) + '">')
    .replace('<a href="/ru/products/" class="active">Продукция</a>', navActive === 'products'
      ? '<a href="/ru/products/" class="active">Продукция</a>'
      : '<a href="/ru/products/">Продукция</a>')
    .replace(/<a class="lang-switch" href="[^"]*">🇺🇸 EN<\/a>/, '<a class="lang-switch" href="' + altUrl + '">🇺🇸 EN</a>');
  const schemaTags = schemas
    .map(obj => '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>')
    .join('\n  ');
  const hreflangTags =
    '<link rel="alternate" hreflang="en" href="https://fouwell.com' + altUrl + '">\n  ' +
    '<link rel="alternate" hreflang="ru" href="' + canonical + '">\n  ' +
    '<link rel="alternate" hreflang="x-default" href="https://fouwell.com' + altUrl + '">';
  head = head.replace('</head>', '  <link rel="canonical" href="' + canonical + '">\n  ' + hreflangTags + '\n  ' + schemaTags + '\n</head>');

  const footer = FOOTER_AND_SCRIPTS
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

/* ==================== Category hub pages: /ru/products/<cat>/ ==================== */
for (const [catKey, catName] of Object.entries(CATEGORIES_RU)) {
  const products = sortByMedia(PRODUCTS.filter(p => p.cat === catKey));
  if (!products.length) continue;

  const brandsHere = [...new Set(products.map(p => p.brand))].sort();
  const url = 'https://fouwell.com' + ruCategoryUrl(catKey);

  const breadcrumbHtml = '<a href="/ru/">Главная</a> / <a href="/ru/products/">Продукция</a> / <span>' + escHtml(catName) + '</span>';
  const modelWord = ruPlural(products.length, ['модель', 'модели', 'моделей']);
  const subHtml = '<p>' + products.length + ' ' + modelWord + ' в наличии или под заказ — от ' + brandsHere.length +
    ' брендов, все по официальным авторизованным каналам. Не нашли нужный артикул? <a href="/ru/contact/#inquiry">Отправьте его нам</a>.</p>';

  const brandLinksHtml = brandsHere.map(b =>
    '<a class="chip" href="' + ruBrandUrl(b) + '">' + escHtml(b) + '</a>'
  ).join(' ');

  const otherCatsHtml = Object.keys(CATEGORIES_RU)
    .filter(k => k !== catKey && PRODUCTS.some(p => p.cat === k))
    .map(k => '<a href="' + ruCategoryUrl(k) + '">' + escHtml(CATEGORIES_RU[k]) + '</a>')
    .join(' · ');

  const bodyHtml =
    '      <div class="filter-bar" style="margin-bottom:20px;">\n' +
    '        <div class="chips">' + brandLinksHtml + '</div>\n' +
    '      </div>\n' +
    '      <div class="result-count">' + products.length + ' ' + ruPlural(products.length, ['товар найден', 'товара найдено', 'товаров найдено']) + '</div>\n' +
    '      <div class="feat-grid">\n' + products.map(productCard).join('\n') + '\n      </div>\n' +
    '      <div style="margin-top:44px;">\n' +
    '        <p style="color:#6b7794; margin-bottom:12px;">' + UI_RU.otherCategories + ' ' + otherCatsHtml + '</p>\n' +
    '        <div class="cta-band">\n' +
    '          <div>\n' +
    '            <h2>' + UI_RU.ctaCatTitle + '</h2>\n' +
    '            <p>' + UI_RU.ctaCatBody + '</p>\n' +
    '          </div>\n' +
    '          <a href="/ru/contact/#inquiry" class="btn btn-primary">' + UI_RU.sendPartList + '</a>\n' +
    '        </div>\n' +
    '      </div>\n';

  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://fouwell.com/ru/' },
        { '@type': 'ListItem', position: 2, name: 'Продукция', item: 'https://fouwell.com/ru/products/' },
        { '@type': 'ListItem', position: 3, name: catName, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: catName + ' | Fouwell', url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.model,
          url: 'https://fouwell.com' + ruUrlOf(p)
        }))
      }
    }
  ];

  const html = renderShell({
    title: catName + ' | Fouwell — промышленная автоматизация',
    // NOT catName.toLowerCase() — unlike English, Russian keeps acronyms (ПЛК/HMI/КИП) capitalized
    // mid-sentence; lowercasing turned "ПЛК и контроллеры" into "плк и контроллеры" (found 2026-09-14
    // spot-checking the generated meta description).
    metaDesc: 'Оригинальные ' + catName + ' от ' + brandsHere.slice(0, 5).join(', ') +
      (brandsHere.length > 5 ? ' и других брендов' : '') + ' — ' + products.length + ' моделей в наличии или под заказ. ' + UI_RU.metaDescSuffix,
    canonical: url,
    breadcrumbHtml, h1: catName, subHtml, bodyHtml, schemas, navActive: 'products',
    altUrl: categoryUrl(catKey)
  });

  const dir = path.join(ROOT, 'ru', 'products', catKey);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

/* ==================== Brand hub pages: /ru/brands/<brand-slug>/ ==================== */
const brandsWithProducts = [...new Set(PRODUCTS.map(p => p.brand))].sort();
for (const brandName of brandsWithProducts) {
  const products = sortByMedia(PRODUCTS.filter(p => p.brand === brandName));
  const brand = brandOf(brandName);
  const nonGenuine = NON_GENUINE_BRANDS.has(brandName);
  const url = 'https://fouwell.com' + ruBrandUrl(brandName);

  const catsHere = [...new Set(products.map(p => p.cat))];
  const catLine = catsHere.map(c => CATEGORIES_RU[c]).join(', ');
  const countryRu = brand ? (COUNTRY_RU[brand.country] || brand.country) : '';

  const breadcrumbHtml = '<a href="/ru/">Главная</a> / <a href="/ru/brands/">Бренды</a> / <span>' + escHtml(brandName) + '</span>';
  const modelWord = ruPlural(products.length, ['модель', 'модели', 'моделей']);
  const subHtml = '<p>' + products.length + ' ' + modelWord + ' ' + escHtml(brandName) +
    (nonGenuine ? '' : ' (оригинал)') +
    (countryRu ? ' — ' + escHtml(countryRu) : '') + ' — ' + escHtml(catLine) +
    '. Поставка только по официальным каналам, 100% проверка перед отгрузкой.</p>';

  const catLinksHtml = catsHere.map(c =>
    '<a class="chip" href="' + ruCategoryUrl(c) + '">' + escHtml(CATEGORIES_RU[c]) + '</a>'
  ).join(' ');

  const otherBrandsHtml = brandsWithProducts
    .filter(b => b !== brandName)
    .slice(0, 12)
    .map(b => '<a href="' + ruBrandUrl(b) + '">' + escHtml(b) + '</a>')
    .join(' · ');

  const bodyHtml =
    '      <div class="filter-bar" style="margin-bottom:20px;">\n' +
    '        <div class="chips">' + catLinksHtml + '</div>\n' +
    '      </div>\n' +
    '      <div class="result-count">' + products.length + ' ' + ruPlural(products.length, ['товар найден', 'товара найдено', 'товаров найдено']) + '</div>\n' +
    '      <div class="feat-grid">\n' + products.map(productCard).join('\n') + '\n      </div>\n' +
    '      <div style="margin-top:44px;">\n' +
    '        <p style="color:#6b7794; margin-bottom:12px;">' + UI_RU.otherBrands + ' ' + otherBrandsHtml + ' — <a href="/ru/products/">' + UI_RU.seeFullCatalog + '</a>.</p>\n' +
    '        <div class="cta-band">\n' +
    '          <div>\n' +
    '            <h2>' + UI_RU.ctaBrandTitle(brandName) + '</h2>\n' +
    '            <p>' + UI_RU.ctaBrandBody + '</p>\n' +
    '          </div>\n' +
    '          <a href="/ru/contact/#inquiry" class="btn btn-primary">' + UI_RU.sendPartNumber + '</a>\n' +
    '        </div>\n' +
    '      </div>\n';

  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://fouwell.com/ru/' },
        { '@type': 'ListItem', position: 2, name: 'Бренды', item: 'https://fouwell.com/ru/brands/' },
        { '@type': 'ListItem', position: 3, name: brandName, item: url }
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: brandName + ' | Fouwell', url,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.model,
          url: 'https://fouwell.com' + ruUrlOf(p)
        }))
      }
    }
  ];

  const html = renderShell({
    title: brandName + ' — поставщик деталей | Fouwell',
    metaDesc: (nonGenuine ? '' : 'Оригинальные ') + brandName + ' — детали промышленной автоматизации' + (countryRu ? ' (' + countryRu + ')' : '') +
      ' — ' + products.length + ' моделей: ' + catLine + '. ' + UI_RU.metaDescSuffix,
    canonical: url,
    breadcrumbHtml, h1: brandName, subHtml, bodyHtml, schemas, navActive: 'brands',
    altUrl: brandUrl(brandName)
  });

  const dir = path.join(ROOT, 'ru', 'brands', brandSlug(brandName));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

/* ==================== Brands index: /ru/brands/ (replaces Phase 1 hand-authored snapshot) ==================== */
{
  const url = 'https://fouwell.com/ru/brands/';
  const rows = brandsWithProducts.map(b => {
    const brand = brandOf(b);
    const count = PRODUCTS.filter(p => p.brand === b).length;
    const countryRu = brand ? (COUNTRY_RU[brand.country] || brand.country) : '';
    return '<a class="brand-tile" href="' + ruBrandUrl(b) + '">' +
      (brand && brand.logo
        ? '<div class="brand-logo"><img src="' + brand.logo + '" alt="' + escHtml(b) + '" loading="lazy"></div>'
        : '<div class="brand-logo"><div class="brand-logo-text">' + escHtml(b) + '</div></div>') +
      '<div class="brand-name">' + escHtml(b) + '</div>' +
      '<div class="brand-country">' + (countryRu ? escHtml(countryRu) + ' · ' : '') + count + ' ' + ruPlural(count, ['модель', 'модели', 'моделей']) + '</div>' +
      '</a>';
  }).join('\n');

  const breadcrumbHtml = '<a href="/ru/">Главная</a> / <span>Бренды</span>';
  const subHtml = '<p>' + brandsWithProducts.length + ' брендов с актуальным каталогом моделей — нажмите на бренд, чтобы увидеть полный список.</p>';
  const bodyHtml = '      <div class="brand-wall">\n' + rows + '\n      </div>\n';

  const schemas = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://fouwell.com/ru/' },
      { '@type': 'ListItem', position: 2, name: 'Бренды', item: url }
    ]
  }];

  const html = renderShell({
    title: 'Бренды в поставке | Fouwell Industrial Automation',
    metaDesc: 'Fouwell поставляет оригинальные комплектующие промышленной автоматизации от ' + brandsWithProducts.length +
      ' брендов, включая Siemens, ABB, Mitsubishi, OMRON, Yaskawa и Allen-Bradley — официальные каналы, быстрый расчёт цены.',
    canonical: url,
    breadcrumbHtml, h1: 'Бренды в поставке', subHtml, bodyHtml, schemas, navActive: 'brands',
    altUrl: '/brands/'
  });

  const dir = path.join(ROOT, 'ru', 'brands');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  written++;
}

console.log('Prerendered ' + written + ' RU hub pages (category + brand + /ru/brands/ index).');
