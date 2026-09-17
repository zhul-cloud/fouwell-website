/* ProductRepository implementation backed by the existing js/data.js (loaded the same way
 * build-product-pages.js already does, via the shared loadGlobals() sandbox in
 * scripts/lib/site-data.js). This is the reference implementation — ErpProductRepository
 * must return data shaped exactly like this one until a real migration is deliberately done.
 *
 * Reused as-is, not reinvented: this file does NOT duplicate the sandbox-loading trick —
 * js/data.js is written as browser globals (`const PRODUCTS = [...]`) because it's also
 * loaded directly by the browser in js/main.js, so it can't become a CommonJS module without
 * breaking the client-side page. loadGlobals() already solves that; this file just wraps it
 * behind the ProductRepository shape.
 */
const { ROOT, loadGlobals, productSlug, slugPiece } = require('../site-data');
const { ProductRepository } = require('./interface');

class LocalProductRepository extends ProductRepository {
  constructor() {
    super();
    this._loaded = null; // lazy — most callers only need this within a single build script run
  }

  _data() {
    if (!this._loaded) {
      const g = loadGlobals('js/data.js');
      this._loaded = {
        PRODUCTS: g.PRODUCTS,
        CATEGORIES: g.CATEGORIES,
        BRANDS: g.BRANDS,
        NON_GENUINE_BRANDS: g.NON_GENUINE_BRANDS
      };
    }
    return this._loaded;
  }

  async getByMPN(mpn) {
    const needle = slugPiece(mpn);
    const { PRODUCTS } = this._data();
    return PRODUCTS.find(p => slugPiece(p.model) === needle) || null;
  }

  async getBySlug(slug) {
    const { PRODUCTS } = this._data();
    return PRODUCTS.find(p => productSlug(p) === slug) || null;
  }

  async list(filter = {}) {
    const { PRODUCTS } = this._data();
    return PRODUCTS.filter(p =>
      (!filter.brand || p.brand === filter.brand) &&
      (!filter.cat || p.cat === filter.cat) &&
      (!filter.status || p.status === filter.status)
    );
  }

  async getCategories() {
    return this._data().CATEGORIES;
  }

  async getBrands() {
    return this._data().BRANDS;
  }

  async isNonGenuineBrand(brand) {
    return this._data().NON_GENUINE_BRANDS.has(brand);
  }
}

module.exports = { LocalProductRepository };
