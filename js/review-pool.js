/* Real customer feedback framework for Product schema (Offer.review / aggregateRating).
 *
 * Two-tier lookup (2026-09-12 design, per user request):
 *   1. REVIEWS_BY_MODEL[model] — reviews genuinely confirmed to be about that exact SKU.
 *      Empty today (see note below) — this is the framework/slot for a future dedicated
 *      review database keyed by model number, not yet built.
 *   2. ALL_REVIEWS — falls back here when a model has no confirmed match. Every entry is a
 *      real, unedited (or lightly formatted) quote from Fouwell's verified Alibaba Trade
 *      Assurance feedback page (fouwell.en.alibaba.com/company_profile/feedback.html),
 *      scraped and curated 2026-09-12: all 20 pages / 67 reviews pulled, filtered to
 *      "Satisfied"(4★)+ ratings, deduplicated, and capped at 2 quotes per country so one
 *      bulk multi-line-item order doesn't dominate the pool. Full raw scrape kept for
 *      reference (see products-schema.md's "AI价格解析"/review-DB section for the pointer).
 *
 * Why the fallback pick is DETERMINISTIC (hash of brand+model), not truly random on every
 * render: the static prerendered HTML (build-product-pages.js) and the JS-hydrated version
 * (main.js) must show identical content, or the page a crawler sees and the page a visitor
 * sees diverge — which is its own structured-data-mismatch problem, arguably worse than the
 * "some products share review text" issue this was meant to fix. A bigger, more varied pool
 * (25 quotes vs. the original 4) solves the actual complaint (pages felt templated/repeated)
 * without introducing that inconsistency. When REVIEWS_BY_MODEL gets populated for a given
 * model, its confirmed reviews are used instead — no more falling back to the shared pool for
 * that SKU at all.
 *
 * Loaded as a plain browser global (like faq-templates.js) and via the same Node vm sandbox
 * used by scripts/lib/site-data.js's loadGlobals() for build-product-pages.js.
 */

/* Populate as real per-model review matches are confirmed, e.g.:
   'R88D-KN08H-ECT': [{ rating: 5, country: 'Japan', text: '...' }] */
const REVIEWS_BY_MODEL = {};

const ALL_REVIEWS = [
  { rating: 4, country: 'Indonesia', text: 'very good' },
  { rating: 5, country: 'Thailand', text: 'Good' },
  { rating: 5, country: 'Colombia', text: "we haved one problem with the main board and i can't solve, but supplier send me a new one for guaranty" },
  { rating: 5, country: 'Colombia', text: 'original product.' },
  { rating: 4, country: 'Uganda', text: 'it’s original' },
  { rating: 5, country: 'Thailand', text: 'good price and good product.' },
  { rating: 5, country: 'Myanmar', text: 'satisfied' },
  { rating: 5, country: 'United States', text: 'Awesome product, great service from Fuzhou' },
  { rating: 5, country: 'Ghana', text: 'Nice item and the supplier was quick at addressing my issues' },
  { rating: 5, country: 'Ghana', text: 'excellent item and delivery was very fast' },
  { rating: 4, country: 'Cambodia', text: 'the product is good' },
  { rating: 4, country: 'Cambodia', text: 'i like it yhe same origenal' },
  { rating: 5, country: 'Mexico', text: 'great service and attention from Elsa, I am very happy with all my previous purchases' },
  { rating: 5, country: 'Indonesia', text: 'great' },
  { rating: 5, country: 'United States', text: 'All came in in great shape. Delivery: 5star Quality: 5star Design: 5star Service: 5star' },
  { rating: 5, country: 'India', text: 'Service: good' },
  { rating: 5, country: 'India', text: 'Quality: good' },
  { rating: 5, country: 'Chile', text: 'Service: Excellent service, attentive and efficient. Highly recommended.' },
  { rating: 5, country: 'Sri Lanka', text: 'can recommend this supplier.' },
  { rating: 5, country: 'Malaysia', text: 'good' },
  { rating: 5, country: 'United Arab Emirates', text: 'Excellent supplier. High-quality products, reliable delivery, and great communication throughout the entire process. Highly recommended.' },
  { rating: 5, country: 'United Arab Emirates', text: 'We are extremely satisfied with this supplier. The product quality consistently meets our expectations, shipments arrive on time, and their customer service is responsive and professional. We look forward to continuing our partnership.' },
  { rating: 5, country: 'South Africa', text: 'Great' },
  { rating: 5, country: 'South Africa', text: 'Awesome' },
  { rating: 5, country: 'Vietnam', text: 'The quality is good as prescribed' }
];

/* Real company-wide rating from the same Alibaba feedback page — used for
   Offer.seller.aggregateRating (accurate on every page, since Fouwell is the seller on
   every page) rather than pretending it's a per-product figure. */
const SELLER_AGGREGATE_RATING = { ratingValue: 4.8, reviewCount: 67, bestRating: 5, worstRating: 1 };

function _hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

/* Model-specific reviews win when confirmed; otherwise a deterministic (reproducible, not
   random-per-render) rotation through the shared pool — see file header for why. */
function pickProductReviews(p, count) {
  count = count || 2;
  if (REVIEWS_BY_MODEL[p.model] && REVIEWS_BY_MODEL[p.model].length) {
    return REVIEWS_BY_MODEL[p.model].slice(0, count);
  }
  const start = _hashStr(p.brand + p.model) % ALL_REVIEWS.length;
  const out = [];
  for (let i = 0; i < count; i++) out.push(ALL_REVIEWS[(start + i) % ALL_REVIEWS.length]);
  return out;
}
function buildProductAggregateRating(reviews) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { ratingValue: Math.round(avg * 10) / 10, reviewCount: reviews.length, bestRating: 5, worstRating: 1 };
}
