/* Generic per-category FAQ fallback for "standard page" SKUs that don't have a hand-written
 * p.faq[] (the deep-page treatment). Every claim here is already published elsewhere on the
 * site (pd-points list on product.html, /about/, /contact/) — this only restates those same
 * facts as explicit Q&A pairs so they're extractable by Google/AI engines, per the site's
 * "深度页/标准页" content-tier strategy (see wiki/analyses/福唯独立站SEO-GEO解决方案.md and
 * schema/products-schema.md's 标准页字段结构 — "没有[客户原始问题]则用品类通用FAQ模板").
 *
 * Deliberately does NOT fabricate a compatibility/cross-reference table for standard pages —
 * unlike FAQ, a "compatible part number" claim would be actual false data if invented, so
 * renderProductCompatibility() keeps hiding that section until a SKU has a real p.compatibility[].
 *
 * Loaded as a plain browser global (like data.js) AND via the same Node vm sandbox used by
 * scripts/lib/site-data.js's loadGlobals() for build-product-pages.js — keep it free of
 * browser-only APIs (no `document`/`window`) so both environments can use it.
 */
function genericFaqFor(p, categoryName) {
  const cat = categoryName || p.cat;
  const availQA = (() => {
    if (p.status === 'legacy') {
      return {
        q: 'Is the ' + p.model + ' still available, and how long does delivery take?',
        a: 'The ' + p.model + ' is a legacy line — no longer in regular production, but Fouwell can still source it through our existing stock and supplier network. Lead time is typically longer than an in-stock item; send us your required quantity and we’ll confirm current availability and delivery time within one business day.'
      };
    }
    if (p.status === 'discont') {
      return {
        q: 'The ' + p.model + ' shows as replaced — is it still available, and what replaces it?',
        a: 'The ' + p.model + ' has been discontinued by ' + p.brand + ' and replaced by a current equivalent. We can still help source remaining ' + p.model + ' stock where available, or recommend the direct replacement — send your application details to info@fouwell.com and we’ll confirm the best option.'
      };
    }
    return {
      q: 'Is the ' + p.model + ' in stock, and how fast can it ship?',
      a: 'Yes, this is an in-stock item — in-stock parts ship within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations; sea freight is available for larger orders.'
    };
  })();

  return [
    {
      q: 'Is the ' + p.brand + ' ' + p.model + ' genuine, and where does Fouwell source it from?',
      a: 'Yes. Fouwell sources every ' + p.brand + ' part through official brand channels or verified authorized distributors, and every unit is 100% inspected before shipping. For the ' + p.model + ' specifically, we can provide original packaging, labeling and, where available, a factory test report on request.'
    },
    availQA,
    {
      q: 'Is there a minimum order quantity (MOQ) for the ' + p.model + '?',
      a: 'No fixed MOQ for standard parts — we regularly ship single units for maintenance and spare-part orders as well as bulk quantities for production lines. Larger quantities qualify for better per-unit pricing; send your required quantity for a quote.'
    },
    {
      q: 'Do you offer a warranty on this ' + cat + '?',
      a: 'Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty does not cover damage from improper installation, incorrect wiring or voltage, or use outside the manufacturer’s official specifications.'
    },
    {
      q: 'Can you help cross-reference an older or different ' + p.brand + ' part number?',
      a: 'Yes. Send your exact part number (old or new) to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day, often within the hour during Asia/Shanghai office hours.'
    },
    {
      q: 'How is the ' + p.model + ' shipped, and can you ship internationally?',
      a: 'We ship worldwide via DHL, FedEx, UPS (air) or sea freight for larger orders, with full insurance and original manufacturer packaging. We also maintain an HK warehouse for faster regional consolidation on some orders.'
    }
  ];
}
