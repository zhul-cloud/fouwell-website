/* ProductRepository implementation backed by the ERP v1.0.0 商品主数据模块 (Product Master
 * module), once it exists. Confirmed so far (2026-09-17, see wiki/seo-geo/Product-Master
 * 数据层架构决策.md "待确认事项" for the full record of what's confirmed vs still guessed):
 *
 *   1. Auth: JWT bearer token — `Authorization: Bearer <token>`. CONFIRMED.
 *   2. Category + brand master data ALSO migrate to ERP, same pattern as product data —
 *      NOT site-local. getCategories()/getBrands()/isNonGenuineBrand() are real ERP-backed
 *      methods here, not stubs-that-probably-stay-local like the first draft assumed.
 *   3. Content fields (datasheet/specs/applications/compatibility/faq) ARE in ERP Product
 *      Master's scope — CONFIRMED. ERP is meant to be a full replacement for js/data.js's
 *      per-product record, not just the commercial/technical fact subset.
 *   4. Pagination: call the backend's own pagination endpoint/params — CONFIRMED. This file
 *      auto-loops through pages inside list()/getCategories()/getBrands() so callers still
 *      get back a plain array; see "why auto-loop" note on _requestAllPages().
 *
 * DB schema now exists as a draft: wiki/seo-geo/Product-Master-schema.sql (product /
 * product_brand / product_category / product_series / product_specification /
 * product_document / product_application / product_relationship / product_faq). The field
 * name guesses below are no longer arbitrary — they're that schema's columns translated to
 * camelCase, matching the JSON field-naming convention already used by this ERP's real
 * Supplier/Customer VOs (zhul-erp-backend/.../masterdata/dto/SupplierVO.java: plain Java
 * fields like `contactName`/`mainBrands`, no snake_case, no nested join objects — flat DTOs
 * with the FK as a plain id field). Still a GUESS until a real Product VO exists — no ERP
 * masterdata module currently has a Product entity (only Customer/Supplier as of
 * 2026-09-17) — but grounded in this codebase's actual convention rather than invented.
 *
 * Still genuinely unknown and left as TODO: exact base URL, exact endpoint paths, whether
 * ProductVO denormalizes brandName/categoryCode/seriesName onto the product record the way
 * guessed below (vs. requiring a separate id->name lookup via getBrands()/getCategories()),
 * exact pagination param/response shape (page+pageSize vs cursor — guessed as page+pageSize
 * below, isolated in one place to change). Every TODO below is a real unknown, not a
 * stylistic gap.
 *
 * ============================== PLACEHOLDER — DO NOT WIRE UP YET ==============================
 * This must not be pointed at by factory.js's default source, and must not be trusted to
 * return real data, until the TODOs are resolved against the actual API contract from
 * IT/ERP dev. Per this project's standing rule (schema/products-schema.md: "不确定的价格/
 * 参数一律留空，不编造"), every method still throws instead of returning guessed data —
 * confirming the SHAPE of the integration (points 1-4 above) is not the same as having a
 * real base URL/response to test against.
 * =================================================================================================
 */
const { ProductRepository } = require('./interface');

class ErpProductRepository extends ProductRepository {
  /**
   * @param {Object} opts
   * @param {string} [opts.baseUrl]  TODO: confirm real base URL once ERP exposes it.
   *   Env var placeholder: ERP_API_BASE_URL.
   * @param {string} [opts.token]    JWT — env var placeholder: ERP_API_TOKEN. TODO: confirm
   *   how the build obtains/refreshes this (static long-lived token vs a login step this
   *   class needs to perform itself vs injected by CI). Also still open: is the ERP API
   *   reachable from wherever the site build actually runs (dev machine today), or is it
   *   internal-network-only? If internal-only, this class needs a different transport later
   *   (e.g. runs inside Fouwell's network / behind a VPN step in deploy.sh) — the JWT answer
   *   doesn't resolve network reachability, only the auth scheme once reachable.
   */
  constructor(opts = {}) {
    super();
    this.baseUrl = opts.baseUrl || process.env.ERP_API_BASE_URL || null;
    this.token = opts.token || process.env.ERP_API_TOKEN || null;
    this.pageSize = opts.pageSize || 100; // TODO: confirm ERP's max/default page size
  }

  _assertConfigured() {
    if (!this.baseUrl || !this.token) {
      throw new Error(
        'ErpProductRepository: ERP_API_BASE_URL / ERP_API_TOKEN not set, and the ERP ' +
        'Product Master API contract (exact base URL + endpoint paths) is not confirmed yet ' +
        '(see wiki/seo-geo/Product-Master数据层架构决策.md "待确认事项"). Auth scheme (JWT) ' +
        'and data scope (categories/brands/content fields all in ERP) are confirmed — what\'s ' +
        'still missing is the actual URL to call.'
      );
    }
  }

  /**
   * @param {string} path      e.g. '/products' — TODO: confirm real paths, see each caller
   * @param {Object} [params]  query params for this request (not pagination — see _requestAllPages)
   */
  async _request(path, params) {
    this._assertConfigured();
    const url = new URL(path, this.baseUrl);
    if (params) for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/json' }
    });
    if (!res.ok) {
      throw new Error(`ERP API ${res.status} ${res.statusText} for ${url} — body: ${await res.text().catch(() => '<unreadable>')}`);
    }
    return res.json();
  }

  /**
   * Loops the backend's pagination until exhausted and returns the full combined array.
   *
   * WHY auto-loop instead of exposing pages to callers: every current consumer of
   * ProductRepository (build-product-pages.js, build-hub-pages.js, seo-audit.js) needs the
   * COMPLETE catalog to generate all pages/sitemaps/checks — none of them want "page 3 of
   * products". So the pagination confirmed in point 4 is absorbed here rather than added to
   * the public interface. Revisit (e.g. add a paginated variant) only if the ERP catalog
   * grows large enough that fetching everything on every build run becomes a real problem —
   * not a concern at current SKU counts, don't build for it speculatively.
   *
   * TODO: page/pageSize + response shape below ({data, meta:{hasMore}}) are guesses. Adjust
   * this one function once ERP's real pagination contract (page+pageSize vs cursor, response
   * envelope field names) is known — nothing else in this file needs to change.
   */
  async _requestAllPages(path, params = {}) {
    const items = [];
    let page = 1;
    for (;;) {
      const res = await this._request(path, { ...params, page, pageSize: this.pageSize });
      // TODO: confirm real envelope shape — guessing { data: [...], meta: { hasMore, total } }
      const pageItems = Array.isArray(res) ? res : (res.data || res.items || []);
      items.push(...pageItems);
      const hasMore = Array.isArray(res) ? false : !!(res.meta && res.meta.hasMore);
      if (!hasMore || pageItems.length === 0) break;
      page += 1;
    }
    return items;
  }

  async getByMPN(mpn) {
    // TODO endpoint guess: GET /products/{mpn} or GET /products?mpnNormalized={mpn} — confirm
    // real path. Filtering by mpnNormalized (not mpnRaw) matches product.uk_tenant_mpn_normalized
    // in the schema — CONFIRM the API accepts a raw/display MPN and normalizes it server-side,
    // or normalize with slugPiece() before sending (reuse from site-data.js, don't reimplement).
    const raw = await this._request('/products', { mpnNormalized: mpn });
    const record = Array.isArray(raw) ? raw[0] : raw;
    return record ? mapErpProductToEntity(record) : null;
  }

  async getBySlug(slug) {
    // ERP has no concept of this site's URL slug (brand-series-mpn kebab string) — resolve
    // locally instead of guessing a slug endpoint that almost certainly doesn't exist.
    // Reuses this site's own slug function so the two stay in lockstep (see interface.js note
    // on productSlug living in scripts/lib/site-data.js).
    const { productSlug } = require('../site-data');
    const all = await this.list();
    return all.find(p => productSlug(p) === slug) || null;
  }

  async list(filter = {}) {
    // TODO endpoint guess: GET /products?brandId=&categoryId=&status= — confirm real path.
    // filter here is this site's shape ({brand, cat, status} — brand/cat are NAMES/KEYS, not
    // ids), but product_brand/product_category are keyed by id — this method would need to
    // resolve filter.brand -> brandId and filter.cat -> categoryId via getBrands()/
    // getCategories() before calling _requestAllPages, OR the real API might accept name/code
    // filters directly. Left as a straight passthrough for now — WILL NOT WORK AS-IS, fix
    // once the real filter param contract is known (this is exactly the kind of guess this
    // whole file explicitly does not want to paper over with a "looks plausible" implementation).
    const raw = await this._requestAllPages('/products', filter);
    return raw.map(mapErpProductToEntity);
  }

  async getCategories() {
    // TODO endpoint guess: GET /categories -> rows shaped like product_category
    // (id, categoryCode, categoryName, parentId, sortOrder, status). CONFIRMED ERP-owned.
    //
    // STRONG RECOMMENDATION for whoever seeds product_category: set categoryCode to exactly
    // this site's 6 existing keys (controllers/hmi/servo/drives/sensors/spares) — see
    // js/data.js's CATEGORIES map. If IT does that, mapErpCategoryToSiteCategory() below
    // becomes a no-op and the whole "translation table" problem this file worried about in
    // the first draft disappears. Flag this to IT before they seed the table, not after.
    const raw = await this._requestAllPages('/categories');
    const out = {};
    for (const c of raw) {
      out[c.categoryCode] = c.categoryName;
    }
    return out;
  }

  async getBrands() {
    // TODO endpoint guess: GET /brands -> rows shaped like product_brand
    // (id, brandName, country, logoUrl, brandColor, isGenuine, status). CONFIRMED ERP-owned,
    // including logo/color — see product_brand table, they're real columns now, not a
    // site-local fallback like the first draft guessed.
    const raw = await this._requestAllPages('/brands');
    return raw.map(b => ({
      name: b.brandName,
      country: b.country,
      logo: b.logoUrl,
      color: b.brandColor
    }));
  }

  async isNonGenuineBrand(brand) {
    // product_brand.isGenuine is a real column now (CONFIRMED scope, see schema) — inverse of
    // this site's NON_GENUINE_BRANDS set semantics: isGenuine=0 means non-genuine/compatible.
    const raw = await this._requestAllPages('/brands');
    const rec = raw.find(b => b.brandName === brand);
    if (!rec) return false;
    return rec.isGenuine === false || rec.isGenuine === 0;
  }
}

/**
 * Adapter: ERP's native product record shape -> this site's ProductEntity shape (see
 * interface.js). This is the ONE function that should absorb all of ERP's field-naming
 * differences, so nothing else in this file (or any build script) needs to know ERP's
 * actual schema.
 *
 * Scope is now confirmed (2026-09-17): ERP Product Master owns ALL of these fields,
 * including datasheet/specs/applications/compatibility/faq — not just commercial/technical
 * facts. Field names below follow wiki/seo-geo/Product-Master-schema.sql's `product` table
 * columns, translated to camelCase (this ERP's real Supplier/Customer VOs are flat camelCase,
 * no snake_case, no nesting — see file header). Still a GUESS pending a real Product VO, but
 * now grounded in an actual schema + an actual convention, not invented from nothing.
 *
 * @param {Object} erp  raw ProductVO-shaped record from the ERP API (shape guessed)
 * @returns {import('./interface').ProductEntity}
 */
function mapErpProductToEntity(erp) {
  return {
    // TODO: assumes ProductVO denormalizes brandName/categoryCode/seriesName onto the product
    // record (plausible for a list/detail VO, unconfirmed) — if not, these need a lookup via
    // erp.brandId/categoryId/seriesId against getBrands()/getCategories() results instead.
    brand: erp.brandName,
    model: erp.mpnDisplay,
    series: erp.seriesName ?? undefined,
    cat: mapErpCategoryToSiteCategory(erp.categoryCode),
    status: mapErpLifecycleAndInventoryToSiteStatus(erp.lifecycleStatus, erp.inventoryStatus),
    spec: erp.specSummary,
    photo: erp.mainImageUrl,
    sell_price: erp.price ?? undefined,
    sell_price_currency: erp.currencyCode ?? undefined,
    price_source: mapErpPriceSourceToSitePriceSource(erp.priceSource, erp.priceRemark),
    // datasheet is now a 1:many relation (product_document), not a single field on `product` —
    // this site's ProductEntity only has one `datasheet` slot though (see interface.js), so
    // pick the first verified DATASHEET-type document. Document Integrity Rule (wiki/seo-geo/
    // PartNumber产品页技术规范提案.md §24) is now structurally enforced by product_document.
    // product_id being a real FK — a document simply cannot exist attached to the wrong
    // product in this schema, unlike the old string-matched js/data.js field.
    datasheet: pickDatasheetUrl(erp.documents),
    specs: mapErpSpecsToSiteSpecs(erp.specifications),
    applications: mapErpApplicationsToSiteApplications(erp.applications),
    compatibility: mapErpRelationshipsToSiteCompatibility(erp.relationships),
    faq: mapErpFaqToSiteFaq(erp.faqs)
  };
}

/** See getCategories()'s note: if product_category.categoryCode is seeded to match this
 *  site's 6 keys directly, this is a no-op. Kept as an explicit function (not inlined) so a
 *  real translation table can replace the identity mapping in one place if seeding doesn't
 *  happen to line up. */
function mapErpCategoryToSiteCategory(categoryCode) {
  return categoryCode;
}

/** This site's `status` conflates two independent ERP dimensions (lifecycleStatus 1-6,
 *  inventoryStatus 1-5) into three values (instock/legacy/discont) — inherently lossy.
 *  TODO / RECOMMENDATION: once ERP is the real source, consider upgrading the SITE side
 *  (js/main.js rendering, build-product-pages.js) to show lifecycle and inventory as two
 *  separate badges instead of collapsing them here — ERP will track richer state than this
 *  3-value model can represent (e.g. "in stock but Legacy" vs "in stock and Active" currently
 *  both render as "In Stock" with no distinction). This function is a working fallback for
 *  the current site templates, not the recommended end state. */
function mapErpLifecycleAndInventoryToSiteStatus(lifecycleStatus, inventoryStatus) {
  if (lifecycleStatus === 4 || lifecycleStatus === 5) return 'discont'; // Discontinued / Obsolete
  if (lifecycleStatus === 3) return 'legacy'; // Legacy
  if (inventoryStatus === 1) return 'instock'; // In Stock, and lifecycle is Active/Current
  return 'legacy'; // Limited/Available-on-request/Out-of-stock/Lead-time, lifecycle still active — closest existing site value
}

/** product.priceSource (tinyint enum, see schema) -> this site's free-text price_source
 *  convention (e.g. "internal:sell_price", "ebay_ref", "web_ref:median_of_4" — see js/data.js
 *  header comment). priceRemark carries the same detail this site used to put after the colon. */
function mapErpPriceSourceToSitePriceSource(priceSource, priceRemark) {
  const base = { 1: 'internal:sell_price', 2: 'ebay_ref', 3: 'web_ref', 4: 'manual', 5: 'supplier_quote' }[priceSource];
  if (!base) return undefined;
  return priceRemark ? `${base}:${priceRemark}` : base;
}

/** product_document rows (see schema, documentType 1=Datasheet) -> single URL, first verified
 *  match. TODO: confirm real field names (documentType/fileUrl/verified) once a real
 *  ProductVO.documents shape is seen — guessed to mirror the DDL columns 1:1. */
function pickDatasheetUrl(documents) {
  if (!Array.isArray(documents)) return undefined;
  const datasheet = documents.find(d => d.documentType === 1 && d.verified) || documents.find(d => d.documentType === 1);
  return datasheet ? datasheet.fileUrl : undefined;
}

/** product_specification rows -> this site's Array<[label, value]> shape (see
 *  interface.js ProductEntity.specs). */
function mapErpSpecsToSiteSpecs(specifications) {
  if (!Array.isArray(specifications)) return undefined;
  return specifications
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(s => [s.specLabel, s.specUnit ? `${s.specValue} ${s.specUnit}` : s.specValue]);
}

/** product_application rows -> this site's Array<{icon, title, desc}> shape. */
function mapErpApplicationsToSiteApplications(applications) {
  if (!Array.isArray(applications)) return undefined;
  return applications
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(a => ({ icon: a.iconKey || '⚙️', title: a.title, desc: a.description }));
}

/** product_relationship rows -> this site's Array<{from, note}> shape (interface.js
 *  ProductEntity.compatibility). This FLATTENS ERP's richer relationship_type/confidence
 *  model down to a single note string — see relationshipTypeLabel() for the per-type wording
 *  fix that replaces the old hardcoded "Siemens code" bug (SOP文档"异常怎么办"第8条).
 *  CONSIDER instead upgrading the site's Cross-Reference rendering to consume
 *  relationshipType/confidence directly rather than flattening here — flattening is the
 *  lower-risk short-term path (no site template changes needed), the richer rendering is the
 *  better long-term one. Low-confidence relationships are dropped, not shown as if verified
 *  (see product_relationship.confidence column comment). */
function mapErpRelationshipsToSiteCompatibility(relationships) {
  if (!Array.isArray(relationships)) return undefined;
  return relationships
    .filter(r => r.confidence !== 4 && r.confidence !== 5) // drop Low/Unknown confidence — don't show as if verified
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(r => ({ from: r.relatedMpn, note: r.note || relationshipTypeLabel(r.relationshipType) }));
}

/** Fallback wording by relationship_type when `note` wasn't filled in — replaces the old
 *  single hardcoded phrase bug with type-appropriate default text. */
function relationshipTypeLabel(relationshipType) {
  return {
    1: 'Direct replacement — same firmware/pin-out, drop-in.',
    2: 'Manufacturer successor model.',
    3: 'Functional alternative — verify before swap.',
    4: 'Compatible part — verify before swap.',
    5: 'Cross-referenced part number.',
    6: 'Same series.'
  }[relationshipType] || 'Related part — contact Fouwell to verify compatibility.';
}

/** product_faq rows -> this site's Array<{q, a}> shape. Excludes source=3 (AI-assisted,
 *  pending review) — those must not reach the public site until a human promotes them to
 *  source=2 (Manual), per the AI Permission Level governance this table encodes. */
function mapErpFaqToSiteFaq(faqs) {
  if (!Array.isArray(faqs)) return undefined;
  return faqs
    .filter(f => f.source !== 3)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(f => ({ q: f.question, a: f.answer }));
}

module.exports = { ErpProductRepository, mapErpProductToEntity };
