/* Single switch point for "which ProductRepository implementation is active". Build scripts
 * that adopt this layer should call createProductRepository() once and use the returned
 * object — they should never import local-repository.js or erp-repository.js directly.
 *
 * Not wired into any build script yet (2026-09-17) — see wiki/seo-geo/Product-Master数据层
 * 架构决策.md "落地顺序". This file exists so the switch point itself is decided and in one
 * place before that rewiring happens, not invented ad hoc later.
 */
const { LocalProductRepository } = require('./local-repository');
const { ErpProductRepository } = require('./erp-repository');

/**
 * @param {'local'|'erp'} [source]  defaults to env var PRODUCT_DATA_SOURCE, then 'local'.
 *   'erp' is not usable yet — ErpProductRepository is a placeholder (see that file's header).
 * @returns {import('./interface').ProductRepository}
 */
function createProductRepository(source) {
  const src = source || process.env.PRODUCT_DATA_SOURCE || 'local';
  switch (src) {
    case 'local':
      return new LocalProductRepository();
    case 'erp':
      return new ErpProductRepository({
        baseUrl: process.env.ERP_API_BASE_URL,
        token: process.env.ERP_API_TOKEN
      });
    default:
      throw new Error(`createProductRepository: unknown source "${src}" (expected "local" or "erp")`);
  }
}

module.exports = { createProductRepository };
