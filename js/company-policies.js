/* Company-wide shipping/return policy constants for Product schema (Offer.shippingDetails /
 * Offer.hasMerchantReturnPolicy). Same rationale as review-pool.js's seller-level rating:
 * these are real, business-approved statements about Fouwell as a company, accurate on every
 * product page, not per-SKU claims.
 *
 * Decided 2026-09-12 with the user (see schema/products-schema.md "AI价格解析" section and
 * wiki/analyses/福唯独立站SEO-GEO解决方案.md "异常怎么办" for the full discussion):
 * - shippingRate is a real, approved "standard small parcel" starting rate ($35) — most of the
 *   catalog is small boxed components (PLC modules, sensors, HMI panels), not oversized freight.
 *   Heavy/oversized items are NOT covered by this rate (freight-forwarder-quoted instead) — that
 *   nuance lives in visible page text, not in the strict schema field (schema.org's shippingRate
 *   wants one MonetaryAmount, not a conditional).
 * - shippingDestination (2026-09-12, revised): schema.org has no "worldwide" shorthand —
 *   Google's own docs confirm omitting the field means "applicable everywhere", but GSC's
 *   automated checker still flags it as a non-critical missing field regardless, so we now
 *   provide it explicitly. Rather than an arbitrary "we ship everywhere" claim, the country
 *   list below is the REAL set of countries Fouwell's Alibaba buyers are actually in (see
 *   wiki/marketing/_alibaba-reviews/ — same real data source used for the review pool),
 *   which is evidenced shipping history, not an unverifiable blanket claim.
 * - transitTime spans the full 3-9 business day range across all three tiers Fouwell actually
 *   quotes (3-5 / 5-7 / 7-9 depending on destination) — a single combined range is honest since
 *   this file doesn't have a real per-region tier mapping to encode narrower ranges per country.
 * - Returns (hasMerchantReturnPolicy) cover the standard "buyer no longer needs it" case — DOA/
 *   wrong-shipped/damaged items are handled through the already-published 12-month replacement
 *   warranty (a different mechanism, not encoded in this schema field), so returnFees here
 *   reflects the buyer-pays-return-shipping default case, not the warranty-replacement case.
 * - priceValidUntil (2026-09-12 added): fixed constant, same anti-"recomputed every visit"
 *   reasoning as DATA_LAST_UPDATED — bump by hand when reviewing/refreshing eBay reference
 *   prices, not derived from "today" at render time.
 */
const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: 35, currency: 'USD' },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: [
      'US', 'ID', 'TH', 'CO', 'BR', 'UG', 'KH', 'GH', 'MX', 'IN',
      'AE', 'CL', 'LK', 'MY', 'RO', 'ZA', 'VN', 'PL', 'CN', 'HK'
    ]
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 9, unitCode: 'DAY' }
  }
};

/* Offer.validFrom — a fixed, manually-bumped date (not "today" computed at page-load/build
   time), so it means "this product data was last reviewed/regenerated on X", not a
   perpetually-moving date that would misrepresent freshness on every visit. Bump this by
   hand whenever js/data.js's product data actually changes. */
const DATA_LAST_UPDATED = '2026-09-12';

/* Offer.priceValidUntil — how long the eBay/internal reference price is considered current.
   Fixed constant (not "today + N days" computed live) — bump by hand when prices are
   re-checked. ~6 months out from DATA_LAST_UPDATED is a reasonable reference-price shelf life. */
const PRICE_VALID_UNTIL = '2027-03-12';

const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/ReturnShippingFees'
};
