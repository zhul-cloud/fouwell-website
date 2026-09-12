/* Generic per-category FAQ fallback for "standard page" SKUs that don't have a hand-written
 * p.faq[] (the deep-page treatment). Every claim here is already published elsewhere on the
 * site (pd-points list on product.html, /about/, /contact/) — this only restates those same
 * facts as explicit Q&A pairs so they're extractable by Google/AI engines, per the site's
 * "深度页/标准页" content-tier strategy (see wiki/analyses/福唯独立站SEO-GEO解决方案.md and
 * schema/products-schema.md's 标准页字段结构 — "没有[客户原始问题]则用品类通用FAQ模板").
 *
 * genericApplicationsFor() below follows the same "safe to genericize" logic as the FAQ
 * template: these are broad, category-level statements about what this TYPE of product is
 * typically used for, not a specific technical claim about this exact SKU — same standard
 * as the FAQ content.
 *
 * Deliberately does NOT fabricate a compatibility/cross-reference TABLE for standard pages —
 * unlike applications/FAQ, "part number X replaces part number Y" is a specific, checkable
 * technical claim that could lead to a real wrong-part order if invented. Standard pages show
 * the Compatible & Replacement section with an inquiry CTA instead of a table (2026-09-12,
 * see renderProductCompatibility() in js/main.js) — never a fabricated table.
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

/* Generic, category-level "Typical Applications" for standard pages without a hand-written
   p.applications[]. Broad, true-for-the-category statements (not a specific claim about this
   exact SKU) — same safety standard as genericFaqFor() above. */
const GENERIC_APPLICATIONS_BY_CATEGORY = {
  controllers: [
    { icon: '🏭', title: 'Machine control', desc: 'Conveyors, packaging lines, mixers and filling machines — small-to-mid I/O count PLCs commonly replace relay logic in this class of equipment.' },
    { icon: '🏢', title: 'Building automation', desc: 'HVAC, lighting and access control panels where a compact controller handles a fixed, well-defined set of I/O points.' },
    { icon: '💧', title: 'Water & process control', desc: 'Pump sequencing, level control and simple process loops on skid-mounted or standalone equipment.' },
    { icon: '🔧', title: 'Retrofit of legacy panels', desc: 'A common replacement part when an older PLC in an existing control panel needs to be swapped for a current, sourceable model.' }
  ],
  hmi: [
    { icon: '🖥️', title: 'Machine operator interface', desc: 'Status display, alarm handling and manual control for production machines and skid equipment.' },
    { icon: '📊', title: 'Recipe & production monitoring', desc: 'Multi-screen recipe management and trend/alarm display for small-to-mid process lines.' },
    { icon: '🔧', title: 'Retrofit of legacy panels', desc: 'A common replacement part when an older touch panel in an existing control cabinet needs to be swapped for a current, sourceable model.' }
  ],
  servo: [
    { icon: '🤖', title: 'Pick-and-place & assembly', desc: 'Multi-axis pick-and-place cells and small assembly automation where precise, repeatable positioning is required.' },
    { icon: '📦', title: 'Packaging & labeling machines', desc: 'Indexing, cutting and labeling stations that need to stay synchronized to line speed.' },
    { icon: '⚙️', title: 'CNC & dedicated machine axes', desc: 'Axis drives on dedicated machines and light-duty CNC applications.' }
  ],
  drives: [
    { icon: '🌀', title: 'Pumps & fans', desc: 'HVAC and water-treatment pump/fan loads that benefit from variable-speed control for energy savings and process control.' },
    { icon: '🏗️', title: 'Conveyors & material handling', desc: 'Belt and roller conveyor speed control, often needing strong starting torque without added feedback hardware.' },
    { icon: '⚙️', title: 'General machine motor control', desc: 'Auxiliary and main motor control on general-purpose industrial machinery.' }
  ],
  sensors: [
    { icon: '📏', title: 'Level, position & pressure monitoring', desc: 'Process vessels, tanks and pipelines where continuous or point-level measurement feeds into a control loop.' },
    { icon: '🛑', title: 'Machine safety & part detection', desc: 'Presence/position sensing for machine safety interlocks and part-detection on production lines.' },
    { icon: '🔁', title: 'Process control feedback', desc: 'Analog or digital feedback signals into PLCs and process controllers for closed-loop control.' }
  ],
  spares: [
    { icon: '🔧', title: 'Drive & PLC panel repair', desc: 'Replacement boards, cables and interface components for maintaining existing control panels.' },
    { icon: '♻️', title: 'Obsolete/discontinued part replacement', desc: 'Sourcing for components no longer available through standard distribution, to keep existing equipment running.' },
    { icon: '🏗️', title: 'New panel builds', desc: 'Standard spare/interface components stocked for panel builders assembling new control cabinets.' }
  ]
};
function genericApplicationsFor(p) {
  return GENERIC_APPLICATIONS_BY_CATEGORY[p.cat] || [];
}
