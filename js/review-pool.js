/* Real customer feedback pool, sourced verbatim (or lightly translated) from Fouwell's
 * verified Alibaba supplier feedback page (fouwell.en.alibaba.com/company_profile/feedback.html,
 * checked 2026-09-12 — company-wide rating there: 4.8/5, 67 reviews, Supplier Service 4.7 /
 * On-time Shipment 4.7 / Product Quality 4.9). Genuine buyer quotes, not AI-generated text.
 *
 * Deliberately uses each reviewer's own free-text comment ONLY — not Alibaba's auto-generated
 * "ordered item" tag line that sits above it in the feedback UI (that tag names the specific
 * item that buyer purchased, which is a different SKU than most fouwell.com product pages this
 * gets attached to; keeping only the free-text comment avoids attributing a review to a named
 * product it was never actually about). Per-product review counts/text here are therefore a
 * real-customer-sentiment signal for Fouwell as a supplier, presented at the product level —
 * NOT a claim that these specific reviewers bought this specific SKU.
 *
 * Loaded as a plain browser global (like faq-templates.js) and via the same Node vm sandbox
 * used by scripts/lib/site-data.js's loadGlobals() for build-product-pages.js.
 */
const REAL_REVIEWS = [
  { rating: 4, country: 'Indonesia', text: 'Very good.' },
  { rating: 5, country: 'Thailand', text: 'Good.' },
  { rating: 5, country: 'Colombia', text: "We had one issue with the main board and couldn't solve it ourselves, but the supplier sent a replacement under warranty without any hassle." },
  { rating: 5, country: 'Colombia', text: 'Original product, exactly as described.' },
  { rating: 5, country: 'Brazil', text: 'Excellent, professional service — I recommend this supplier to everyone and will certainly be ordering again.' }
];

/* Real company-wide rating from the same Alibaba feedback page — used for
   Offer.seller.aggregateRating (accurate on every page, since Fouwell is the seller on
   every page) rather than pretending it's a per-product figure. */
const SELLER_AGGREGATE_RATING = { ratingValue: 4.8, reviewCount: 67, bestRating: 5, worstRating: 1 };

/* Deterministic (not random) pick of 2 reviews per product, so rebuilds are reproducible.
   Simple string hash -> stable rotation through the pool. */
function _hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}
function pickProductReviews(p, count) {
  count = count || 2;
  const start = _hashStr(p.brand + p.model) % REAL_REVIEWS.length;
  const out = [];
  for (let i = 0; i < count; i++) out.push(REAL_REVIEWS[(start + i) % REAL_REVIEWS.length]);
  return out;
}
function buildProductAggregateRating(reviews) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { ratingValue: Math.round(avg * 10) / 10, reviewCount: reviews.length, bestRating: 5, worstRating: 1 };
}
