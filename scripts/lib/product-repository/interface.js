/* ProductRepository contract — the seam between "how pages get built" and "where product
 * data comes from". Every build script (build-product-pages.js, build-hub-pages.js,
 * seo-audit.js, sync-indexing-tracker.js, generate-data-entry.js) should eventually read
 * product data through an object shaped like this, instead of calling loadGlobals('js/data.js')
 * directly — so swapping the data source later (ERP) means writing a new implementation of
 * this contract, not touching any of those scripts.
 *
 * STATUS (2026-09-17): this interface + LocalProductRepository exist as a placeholder. No
 * build script has been rewired to use them yet — that's a separate, deliberately deferred
 * step (see wiki/seo-geo/Product-Master数据层架构决策.md "落地顺序"). Nothing currently
 * imports this directory; it is safe to have in the tree.
 *
 * Design notes:
 *   - Scope is deliberately narrow: only what build scripts actually consume today (see
 *     PRODUCTS/CATEGORIES/BRANDS/NON_GENUINE_BRANDS usage in build-product-pages.js). Do NOT
 *     pre-add methods for fields nothing reads yet (e.g. a separate getRelationships()) —
 *     extend this contract when a concrete Phase 1 feature needs it (open/closed: open for
 *     that kind of extension, not for speculative ones).
 *   - Plain JS + JSDoc, not TypeScript — matches the rest of this codebase (no package.json,
 *     no build step, scripts run directly with `node`). If the ERP module's own stack is
 *     TypeScript, revisit this decision (see wiki page "待确认事项").
 *   - Every method is synchronous in LocalProductRepository (data.js is small, read once)
 *     but declared here as Promise-returning so ErpProductRepository (a real HTTP call) can
 *     implement the same shape without a breaking change later. Callers should `await` these
 *     even against the local implementation.
 */

/**
 * @typedef {Object} ProductEntity
 * Shape mirrors the objects currently in js/data.js's PRODUCTS array — this is the P0 field
 * set from wiki/seo-geo/PartNumber字段级Schema提案.md, trimmed to fields this codebase
 * actually uses today. Extend only when a real feature needs a new field.
 * @property {string} brand
 * @property {string} model            MPN, as displayed (display_mpn in the field schema doc)
 * @property {string} [series]
 * @property {string} cat              category key, must be a key in categories map
 * @property {string} spec
 * @property {'instock'|'legacy'|'discont'} status
 * @property {string} [photo]
 * @property {string} [linkedin]
 * @property {number} [sell_price]
 * @property {string} [sell_price_currency]
 * @property {string} [price_source]
 * @property {string} [datasheet]      URL/path — MUST belong to this exact model (see
 *                                     Document Integrity Rule, wiki/seo-geo/PartNumber产品页技术规范提案.md §24)
 * @property {Array<[string,string]>} [specs]
 * @property {Array<{icon:string,title:string,desc:string}>} [applications]
 * @property {Array<{from:string,note:string}>} [compatibility]
 * @property {Array<{q:string,a:string}>} [faq]
 */

class ProductRepository {
  /** @returns {Promise<ProductEntity|null>} */
  async getByMPN(_mpn) { throw new Error('ProductRepository.getByMPN not implemented'); }

  /** @returns {Promise<ProductEntity|null>} */
  async getBySlug(_slug) { throw new Error('ProductRepository.getBySlug not implemented'); }

  /**
   * @param {{brand?:string, cat?:string, status?:string}} [filter]
   * @returns {Promise<ProductEntity[]>}
   */
  async list(_filter) { throw new Error('ProductRepository.list not implemented'); }

  /** @returns {Promise<Record<string,string>>} category key -> display label */
  async getCategories() { throw new Error('ProductRepository.getCategories not implemented'); }

  /** @returns {Promise<Array<{name:string,country:string,logo:string,color:string}>>} */
  async getBrands() { throw new Error('ProductRepository.getBrands not implemented'); }

  /** @returns {Promise<boolean>} true if `brand` is a disclosed compatible/non-OEM brand */
  async isNonGenuineBrand(_brand) { throw new Error('ProductRepository.isNonGenuineBrand not implemented'); }
}

module.exports = { ProductRepository };
