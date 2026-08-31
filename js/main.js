/* Fouwell site scripts: featured products, catalog filter, inquiry form,
   brand wall, category grid, and product photo fallback to LinkedIn marketing images. */

/* Returns an <img> tag (or fallback div) for a product.
   Priority: real product photo (assets/products/) → LinkedIn marketing image (assets/linkedin/) → noimg placeholder. */
function productImage(p) {
  if (p.photo) {
    return '<img src="assets/products/' + p.photo + '" alt="' + p.model + '" loading="lazy">';
  }
  if (p.linkedin) {
    return '<img class="linkedin-fallback" src="assets/linkedin/' + p.linkedin + '" alt="' + p.model + ' (marketing)" loading="lazy">';
  }
  return '<div class="noimg">' + p.brand + '<br>Photo on request</div>';
}

function productCard(p) {
  const st = STATUS_LABEL[p.status] || STATUS_LABEL.instock;
  return (
    '<article class="prod-card">' +
      '<a class="thumb-link" href="product.html?model=' + encodeURIComponent(p.model) + '">' +
        '<div class="thumb">' + productImage(p) + '</div>' +
      '</a>' +
      '<div class="body">' +
        '<span class="cat">' + p.brand + ' · ' + CATEGORIES[p.cat] + '</span>' +
        '<a class="model-link" href="product.html?model=' + encodeURIComponent(p.model) + '"><h3>' + p.model + '</h3></a>' +
        '<div class="series">' + p.series + '</div>' +
        '<p class="desc">' + p.spec + '</p>' +
        '<div class="meta">' +
          '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
          '<a class="inq-link" href="contact.html?model=' + encodeURIComponent(p.model) + '#inquiry">Inquire →</a>' +
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

/* Render a category card with number, icon style, title, items, desc, and a real product photo. */
function categoryCard(c) {
  return (
    '<a class="cat-card" href="products.html?cat=' + c.id + '">' +
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
   → single real photo (assets/products/) → LinkedIn marketing image (assets/linkedin/). */
function productGallery(p) {
  const imgs = [];
  if (typeof PRODUCT_PHOTOS !== 'undefined' && PRODUCT_PHOTOS[p.model]) {
    PRODUCT_PHOTOS[p.model].forEach(it => imgs.push({ src: it.src, tag: it.tag }));
    return imgs;
  }
  if (p.photo) imgs.push({ src: 'assets/products/' + p.photo, tag: 'Photo' });
  if (p.linkedin) imgs.push({ src: 'assets/linkedin/' + p.linkedin, tag: 'Marketing' });
  return imgs;
}

function brandOf(name) {
  return (typeof BRANDS !== 'undefined') ? BRANDS.find(b => b.name === name) : null;
}

/* Render the full product detail page (product.html?model=xxx). */
function renderProductDetail(p) {
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const st = STATUS_LABEL[p.status] || STATUS_LABEL.instock;
  const brand = brandOf(p.brand);

  // ---- breadcrumb / title ----
  document.getElementById('breadcrumb').innerHTML =
    '<a href="index.html">Home</a> / <a href="products.html">Products</a> / ' +
    (p.cat ? '<a href="products.html?cat=' + p.cat + '">' + esc(CATEGORIES[p.cat]) + '</a> / ' : '') +
    '<span>' + esc(p.model) + '</span>';
  document.title = p.model + ' | ' + p.brand + ' — Fouwell Industrial Automation';
  document.getElementById('page-title').textContent = p.model;
  document.getElementById('page-sub').textContent = p.spec;

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
  if (brand && brand.logo) {
    brandRow.innerHTML =
      '<img class="pd-brand-logo" src="' + brand.logo + '" alt="' + esc(brand.name) + '">' +
      '<span class="pd-brand-name">' + esc(brand.name) + '</span>' +
      '<span class="pd-brand-country">' + esc(brand.country) + '</span>';
    brandRow.querySelector('img').onerror = function () {
      this.outerHTML = '<span class="pd-brand-text">' + esc(brand.name) + '</span>';
    };
  } else {
    brandRow.innerHTML = '<span class="pd-brand-text">' + esc(p.brand) + '</span>';
  }

  // ---- series / model / badges / spec ----
  document.getElementById('pd-series').textContent = p.series ? p.series + ' Series' : '';
  document.getElementById('pd-model').textContent = p.model;
  document.getElementById('pd-badges').innerHTML =
    '<span class="pill ' + st.cls + '">' + st.label + '</span>' +
    '<span class="pill cat">' + esc(CATEGORIES[p.cat]) + '</span>' +
    (brand ? '<span class="pill brand">' + esc(brand.country) + '</span>' : '');
  document.getElementById('pd-spec').textContent = p.spec;

  // ---- actions ----
  document.getElementById('pd-quote').href = 'contact.html?model=' + encodeURIComponent(p.model) + '#inquiry';

  // ---- video ----
  const videos = (typeof PRODUCT_VIDEOS !== 'undefined') ? (PRODUCT_VIDEOS[p.model] || []) : [];
  const vidSection = document.getElementById('detail-video-section');
  if (videos.length) {
    const wrap = document.getElementById('pd-videos');
    wrap.innerHTML = videos.map(v =>
      '<div class="pd-video-card">' +
        '<video controls preload="none" poster="' + (imgs.length ? imgs[0].src : '') + '">' +
          '<source src="' + v.src + '" type="video/mp4">' +
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
        : '<p style="grid-column:1/-1; text-align:center; color:#6b7794; padding:40px 0;">No match — but we source far more than what\'s listed. <a href="contact.html#inquiry">Send us your part number →</a></p>';
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

    render();
  }

  /* ---- Product detail page ---- */
  const root = document.getElementById('detail-root');
  if (root && typeof PRODUCTS !== 'undefined') {
    const model = new URLSearchParams(location.search).get('model');
    const p = PRODUCTS.find(x => x.model === model);

    if (!p) {
      root.style.display = 'block';
      root.innerHTML = '<div class="container"><div class="pd-notfound"><h2>Product not found</h2><p>We could not find "' + (model || '') + '" in our online catalog — but we likely can source it. <a href="contact.html#inquiry">Send us the part number →</a></p></div></div>';
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
