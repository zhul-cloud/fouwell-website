/* Real customer feedback framework for Product schema (Offer.review / aggregateRating).
 *
 * Two-tier lookup (2026-09-12 design, per user request):
 *   1. REVIEWS_BY_MODEL[model] — reviews genuinely confirmed to be about that exact SKU.
 *      Empty today (see note below) — this is the framework/slot for a future dedicated
 *      review database keyed by model number, not yet built.
 *   2. ALL_REVIEWS — falls back here when a model has no confirmed match.
 *
 * ALL_REVIEWS SOURCING (updated 2026-09-13, supersedes the 2026-09-12 single-store version):
 * Reviews are curated from the `alibaba-store-reviews` skill's archive at
 * `wiki/marketing/_alibaba-reviews/<store>/reviews.json` in the wiki repo — every store that
 * gets scraped there is a candidate feeder for this pool going forward (per explicit user
 * decision on 2026-09-13; see wiki/log.md same date). Each entry's `source` field names the
 * originating store slug (or `a+b` if the same text happened to also appear verbatim from a
 * second store) for traceability back to that store's `reviews.json`, but is not read by any
 * rendering code — it's a maintenance breadcrumb only.
 *
 * IMPORTANT — this is a deliberate scope change from "Fouwell's own verified buyers" to
 * "verified buyers across the scraped Alibaba stores, Fouwell's own account included": as of
 * this update the pool blends Fouwell's own store (`fouwell`) with two competitor stores
 * (`zhishuyunkong`, `youro`) scraped for market research. The page still labels every card
 * "Verified Buyer" and every JSON-LD Review still names `author: Verified Buyer (<country>)` —
 * for the non-`fouwell`-sourced entries that phrasing is literally true of *some* Alibaba
 * seller's buyer, not necessarily one who bought from Fouwell. Flagged to the user as a
 * fake-review/misattribution risk before implementing; user chose to proceed with all stores
 * pooled anyway. If this pool's sourcing model changes again, update this comment.
 *
 * Curation rule applied when (re)building this array from the store archives: pool every
 * store's `reviews.json`, dedupe by (review text lowercased, country) so the same order's
 * repeated line-item text isn't counted twice, keep only `overall_stars >= 4`, drop empty
 * `review_content`, drop entries that render visibly broken (e.g. the Alibaba page itself
 * truncates some long reviews at ~280 chars ending in "..." — a "show more" the scrape didn't
 * expand; excluded rather than shown mid-sentence — see alibaba-store-reviews skill note),
 * English-language only (site is English; non-English real quotes stay in the store's own
 * `reviews.json`/`reviews.md`, not translated or otherwise altered), then cap at 2 quotes per
 * country so one bulk multi-line-item order or one heavily-represented country doesn't
 * dominate the pool. Fullwidth "：" separators some stores use for field labels (e.g.
 * "Service：") are normalized to ASCII "Service:" for display consistency; a stray trailing
 * curly/straight quote artifact is stripped; embedded newlines are collapsed to spaces.
 *
 * Why the fallback pick is DETERMINISTIC (hash of brand+model), not truly random on every
 * render: the static prerendered HTML (build-product-pages.js) and the JS-hydrated version
 * (main.js) must show identical content, or the page a crawler sees and the page a visitor
 * sees diverge — which is its own structured-data-mismatch problem, arguably worse than the
 * "some products share review text" issue this was meant to fix. A bigger, more varied pool
 * solves the actual complaint (pages felt templated/repeated) without introducing that
 * inconsistency. When REVIEWS_BY_MODEL gets populated for a given model, its confirmed
 * reviews are used instead — no more falling back to the shared pool for that SKU at all.
 *
 * Loaded as a plain browser global (like faq-templates.js) and via the same Node vm sandbox
 * used by scripts/lib/site-data.js's loadGlobals() for build-product-pages.js.
 */

/* Populate as real per-model review matches are confirmed, e.g.:
   'R88D-KN08H-ECT': [{ rating: 5, country: 'Japan', text: '...' }] */
const REVIEWS_BY_MODEL = {};

const ALL_REVIEWS = [
  { rating: 5, country: 'Argentina', text: 'Servicio: Excellent company and personalized service. They contacted me via WhatsApp to answer all my questions. I recommend them 100%.', source: 'zhishuyunkong' },
  { rating: 5, country: 'Australia', text: 'it works perfectly', source: 'zhishuyunkong' },
  { rating: 5, country: 'Australia', text: 'great products', source: 'zhishuyunkong' },
  { rating: 5, country: 'Bosnia and Herzegovina', text: 'All the best', source: 'youro' },
  { rating: 5, country: 'Bosnia and Herzegovina', text: 'Everything is ok, I am satisfied with the cooperation, quality, communication and price. All recommendations for cooperation with this seller', source: 'youro' },
  { rating: 5, country: 'Cambodia', text: 'the product is good', source: 'fouwell' },
  { rating: 5, country: 'Cambodia', text: 'i like it yhe same origenal', source: 'fouwell' },
  { rating: 5, country: 'Canada', text: 'Everything is good quality, the company is really amazing to do business and the shipping is fast. I really recommend.', source: 'youro' },
  { rating: 5, country: 'Canada', text: 'Original quality', source: 'youro' },
  { rating: 5, country: 'Chile', text: 'Service: Excellent service, attentive and efficient. Highly recommended.', source: 'fouwell' },
  { rating: 5, country: 'Colombia', text: "we haved one problem with the main board and i can't solve, but supplier send me a new one for guaranty", source: 'fouwell' },
  { rating: 5, country: 'Colombia', text: 'Supplier ever send me exactly what i looking for.', source: 'fouwell' },
  { rating: 5, country: 'Costa Rica', text: 'Excellent product and customer support', source: 'youro' },
  { rating: 5, country: 'Costa Rica', text: 'Excellent quality and delivery time', source: 'youro' },
  { rating: 5, country: 'Egypt', text: 'Delivery: 5 satrs Quality: 5 satrs Design: 5 satrs Service: 5 satrs', source: 'zhishuyunkong' },
  { rating: 5, country: 'Finland', text: 'Products was perfect and Kamila customer service is excellent.will order again! Thanks', source: 'youro' },
  { rating: 5, country: 'Germany', text: 'good support great communication', source: 'youro' },
  { rating: 5, country: 'Ghana', text: 'Nice item and the supplier was quick at addressing my issues', source: 'fouwell' },
  { rating: 5, country: 'Ghana', text: 'excellent item and delivery was very fast', source: 'fouwell' },
  { rating: 5, country: 'India', text: 'packing is very good, we found in good condition', source: 'fouwell' },
  { rating: 5, country: 'India', text: 'Five stars all the way! The service, the product, and the overall experience were outstanding. I will definitely be a repeat customer and will recommend them to everyone I know.', source: 'youro' },
  { rating: 5, country: 'Indonesia', text: 'good product. seller response is fast. no doubt to buy in this store', source: 'fouwell' },
  { rating: 5, country: 'Indonesia', text: 'quick response, communicative seller , safe packing, quick delivery. thank you', source: 'zhishuyunkong' },
  { rating: 5, country: 'Israel', text: 'everything a seven star', source: 'youro' },
  { rating: 5, country: 'Israel', text: 'excellent service and quick delivery', source: 'youro' },
  { rating: 5, country: 'Italy', text: 'Delivery: Very fast!! Service: Cindy very nice and helpful!!', source: 'youro' },
  { rating: 5, country: 'Italy', text: 'Product received in a very short time, packaging very good and the seller Cindy was very kind with us.', source: 'youro' },
  { rating: 5, country: 'Kazakhstan', text: 'Quality:good Design:very good Service:best Delivery:fast', source: 'youro' },
  { rating: 5, country: 'Kazakhstan', text: 'Original new, thank you Ennerson', source: 'youro' },
  { rating: 5, country: 'Kuwait', text: 'Good service', source: 'fouwell' },
  { rating: 5, country: 'Lebanon', text: 'very good', source: 'fouwell' },
  { rating: 5, country: 'Lebanon', text: 'very nice', source: 'fouwell' },
  { rating: 5, country: 'Malaysia', text: 'Recommend products..', source: 'youro' },
  { rating: 5, country: 'Malaysia', text: 'Good product', source: 'zhishuyunkong' },
  { rating: 5, country: 'Mali', text: 'The quality is good.', source: 'youro' },
  { rating: 5, country: 'Mali', text: 'Best seller', source: 'youro' },
  { rating: 5, country: 'Mexico', text: 'great service and attention from Elsa, I am very happy with all my previous purchases', source: 'fouwell' },
  { rating: 5, country: 'Mexico', text: 'excellent product quality, great service, fast shipping', source: 'fouwell' },
  { rating: 5, country: 'Myanmar', text: 'satisfied', source: 'fouwell' },
  { rating: 5, country: 'Nigeria', text: 'Original. customer service is 100%', source: 'youro' },
  { rating: 5, country: 'Nigeria', text: 'Excellent. Coming back for more', source: 'youro' },
  { rating: 5, country: 'Pakistan', text: 'Delivery: Fast Delivery Quality: Excellent Quality Service: Super excellent service', source: 'youro' },
  { rating: 5, country: 'Pakistan', text: 'Same product as ordered Shippng fast', source: 'youro' },
  { rating: 5, country: 'Peru', text: "Excellent service! Quality products. They found a customer for life. The company's punctuality is a point to highlight.", source: 'youro' },
  { rating: 5, country: 'Philippines', text: 'Genuine supplier of electronic, automation and electrical.', source: 'youro' },
  { rating: 5, country: 'Philippines', text: 'Great supplier! High-quality products, timely delivery, and excellent communication. Highly reliable and professional. Will definitely order again!', source: 'youro' },
  { rating: 5, country: 'Qatar', text: 'Amazing', source: 'fouwell' },
  { rating: 5, country: 'Qatar', text: 'Good one', source: 'fouwell' },
  { rating: 5, country: 'Romania', text: 'The products have arrived and are in order Very very fast delivery. Thank you very much. You are a reliable seller *****', source: 'fouwell' },
  { rating: 5, country: 'Russian Federation', text: 'Excellent supplier', source: 'youro' },
  { rating: 5, country: 'Russian Federation', text: 'Fast delivery, original quality . Flexible payment terms', source: 'youro' },
  { rating: 5, country: 'Saudi Arabia', text: 'Service: excellent Delivery: excellent Quality: excellent Design: excellent', source: 'fouwell' },
  { rating: 5, country: 'Saudi Arabia', text: 'we recieve product and tested.It response good.', source: 'youro' },
  { rating: 5, country: 'South Africa', text: 'Great products and the owner Kevin is Hand On', source: 'fouwell' },
  { rating: 5, country: 'South Africa', text: 'this product works exactly as expected.. great service overall', source: 'youro' },
  { rating: 5, country: 'Sri Lanka', text: 'The customer service is very Good Fast delivey, very well packed. can recommend this supplier.', source: 'fouwell' },
  { rating: 5, country: 'Thailand', text: 'good price and good product.', source: 'fouwell' },
  { rating: 5, country: 'Thailand', text: 'Good', source: 'fouwell' },
  { rating: 5, country: 'Trinidad and Tobago', text: 'Great product', source: 'youro' },
  { rating: 5, country: 'Turkey', text: 'I advice . trustable supplier', source: 'youro' },
  { rating: 5, country: 'Uganda', text: 'it’s original', source: 'fouwell' },
  { rating: 4, country: 'Uganda', text: 'high quality', source: 'fouwell' },
  { rating: 5, country: 'United Arab Emirates', text: 'Excellent supplier. High-quality products, reliable delivery, and great communication throughout the entire process. Highly recommended.', source: 'fouwell' },
  { rating: 5, country: 'United Arab Emirates', text: 'We are extremely satisfied with this supplier. The product quality consistently meets our expectations, shipments arrive on time, and their customer service is responsive and professional. We look forward to continuing our partnership.', source: 'fouwell' },
  { rating: 5, country: 'United States', text: 'Awesome product, great service from Fuzhou', source: 'fouwell' },
  { rating: 5, country: 'United States', text: 'The product is great, I really like it, I will buy again next time.', source: 'fouwell' },
  { rating: 5, country: 'Uzbekistan', text: 'on time and quality great', source: 'youro' },
  { rating: 5, country: 'Uzbekistan', text: 'excellent', source: 'youro' },
  { rating: 5, country: 'Venezuela', text: 'good quality', source: 'youro' },
  { rating: 5, country: 'Venezuela', text: 'Everything is ok, fast.', source: 'youro' },
  { rating: 5, country: 'Vietnam', text: 'The quality is good as prescribed', source: 'fouwell' },
  { rating: 5, country: 'Zambia', text: 'Good product and quality', source: 'youro' },
  { rating: 5, country: 'Zambia', text: 'Great', source: 'youro' }
];

/* Real company-wide rating from Fouwell's own Alibaba feedback page (the store where Fouwell
   itself is the seller of record) — used for Offer.seller.aggregateRating (accurate on every
   page, since Fouwell is the seller on every page) rather than pretending it's a per-product
   figure. Unlike ALL_REVIEWS above, this stays scoped to `fouwell` only — it's a factual claim
   about Fouwell-as-seller, not a display quote, so pooling in other stores' numbers here would
   misstate Fouwell's own rating rather than just diversify a testimonial pool. Last synced
   2026-09-13 from `wiki/marketing/_alibaba-reviews/fouwell/README.md`'s "店铺页面自带的概览统计"
   (the page's own overview widget, not the raw per-card recount, which came out higher at scrape
   time — see that README's "已知局限" for the discrepancy note). */
const SELLER_AGGREGATE_RATING = { ratingValue: 4.8, reviewCount: 67, bestRating: 5, worstRating: 1 };

function _hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

/* Total review count per product: deterministic pseudo-random 1-20 (2026-09-12 rule) —
   represents "this SKU has this many buyer reviews on file", most of which aren't
   individually shown (same pattern as e.g. Amazon's "4.7 ★ (1,240 ratings)" showing only
   a handful of written reviews). Two independent hashes (different salt strings) so this
   number and the display cap below don't move in lockstep. */
function pickReviewCount(p) {
  return 1 + (_hashStr('count:' + p.brand + p.model) % 20); // 1-20
}
/* How many of those reviews actually get a visible card + JSON-LD Review entry: at most 8
   (2026-09-12 rule, revised from an earlier 3-5 random cap), and never more than the total
   reviewCount itself (can't show 8 written reviews when the stated total is, say, 3). */
function pickDisplayCount(p, reviewCount) {
  return Math.min(8, reviewCount);
}

/* Model-specific reviews win when confirmed; otherwise a deterministic (reproducible, not
   random-per-render) rotation through the shared pool — see file header for why. */
function pickProductReviews(p, count) {
  if (count == null) {
    const reviewCount = pickReviewCount(p);
    count = pickDisplayCount(p, reviewCount);
  }
  if (REVIEWS_BY_MODEL[p.model] && REVIEWS_BY_MODEL[p.model].length) {
    return REVIEWS_BY_MODEL[p.model].slice(0, count);
  }
  const start = _hashStr(p.brand + p.model) % ALL_REVIEWS.length;
  const out = [];
  for (let i = 0; i < count; i++) out.push(ALL_REVIEWS[(start + i) % ALL_REVIEWS.length]);
  return out;
}
function buildProductAggregateRating(reviews, reviewCount) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  // reviewCount defaults to reviews.length for callers that don't pass the "total reviews on
  // file" number (pickReviewCount) — e.g. REVIEWS_BY_MODEL callers with a small confirmed set.
  return { ratingValue: Math.round(avg * 10) / 10, reviewCount: reviewCount || reviews.length, bestRating: 5, worstRating: 1 };
}
