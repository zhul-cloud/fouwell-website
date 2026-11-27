# ERP adapter

How ERP publishes products to this site. ERP never edits the site's data files or pages
directly: it writes `erp/site-data.json` and runs the scripts in this folder. Anything about
how pages look stays in this repo.

| File | Who runs it | What it does |
| --- | --- | --- |
| `build.sh [FILE]` | ERP publisher | Apply `FILE` to the data files, rebuild all English and Russian pages, stamp release marks, bump cache versions |
| `verify.js CHECKS [--root DIR]` | ERP publisher | Open product pages in Chromium with caching off and check them |
| `export-existing.js [--out FILE]` | ERP import | Export every product on the site in the same format |
| `apply-site-data.js`, `postbuild.js`, `lib.js` | `build.sh` | Internals |

Setup once: `cd erp && npm ci` (installs Playwright 1.58.2; the browser comes from the
publisher image or `npx playwright install chromium`). Tests: `cd erp && npm test`.

## site-data.json, version 1

```json
{
  "schemaVersion": 1,
  "site": { "code": "fouwell.com", "nonGenuineBrands": ["PWERUN", "Generic", "General"] },
  "generatedAt": "2026-11-27T08:00:00.000Z",
  "release": "WP10001",
  "products": [ { …product… } ]
}
```

- **The file is the full catalog**: every product on the site, in display order, including
  the ones ERP has not changed since import (sent back exactly as exported). A site product
  missing from the file fails the build; removing products is not supported.
- `site.nonGenuineBrands` (optional) replaces `NON_GENUINE_BRANDS` in `js/data.js`.
- `release` (optional) is the release order number, for logs.

### Product

A product is a `js/data.js` `PRODUCTS` entry plus six extra keys. All non-extra keys are
copied into `PRODUCTS` as they are, including fields this document does not list, so fields
only this site uses survive an import and re-publish.

| Key | Required | Notes |
| --- | --- | --- |
| `brand`, `model`, `spec` | yes | non-empty strings; `model` is unique and is the key of every per-model map |
| `series` | yes | string, may be empty |
| `cat` | yes | a key of `CATEGORIES` in `js/data.js` |
| `status` | yes | a key of `STATUS_LABEL` in `js/data.js` (`instock`, `legacy`, `discont`, `quote`) |
| `photo`, `linkedin` | no | string or `null`. A file name under `/assets/products/` / `/assets/linkedin/`, **or a full `https://` URL**. `photo` is the main image in the Product schema |
| `sell_price`, `sell_price_currency` | no | positive number + currency code, published as the Offer price |
| `price_source` | no | internal note, not shown on pages |
| `overview`, `overview_ru`, `meta_description`, `meta_description_ru`, `specs`, `applications`, `compatibility`, `faq`, `datasheet`, … | no | as in `js/data.js` |
| **`slug`** | no | if given, must equal the site's slug (below); ERP sends the locked slug so a renamed brand/series/model fails loudly instead of moving the page |
| **`release`** | no | `WP…`; written into the product's English and Russian page as `<meta name="erp-release" content="WP…">`. Send the release that last published this product on every build, so pages not in this release keep their mark |
| **`photos`** | no | `[{ "src", "tag": "Photo" \| "Marketing" }]` → `PRODUCT_PHOTOS[model]`, first is the main gallery image. Empty or missing removes the gallery |
| **`videos`** | no | `[{ "src", "title" }]` → `PRODUCT_VIDEOS[model]` |
| **`spec_ru`** | no | Russian one-line spec → `PRODUCT_SPEC_RU[model]` |
| **`deep_ru`** | no | Russian specs/applications/compatibility/faq → `PRODUCT_DEEP_RU[model]` |

Media `src` must start with `/` (a file in this repo) or `https://` (object storage).
New media from ERP are always `https://` URLs; ERP does not commit image or video files.
Products imported from the site keep their `/assets/...` paths. Since 2026-11-27 new files
under `assets/products/`, `assets/videos/` and `assets/linkedin/` are not committed (see
`.gitignore`); they exist on the live server, so the local check redirects missing
`/assets/...` files to the live site (`--asset-fallback https://fouwell.com`).

Per-model maps (`PRODUCT_PHOTOS`, `PRODUCT_VIDEOS`, `PRODUCT_SPEC_RU`, `PRODUCT_DEEP_RU`) are
updated only for models in the file; keys that match no product are left as they are.

### Slug

```
slugPiece(s) = lower(s) → replace runs of space _ . / with "-" → drop anything not a-z 0-9 -
               → collapse "--" → trim "-"
slug         = [slugPiece(brand), slugPiece(series), slugPiece(model)] without empty parts, joined by "-"
pages        = /products/<slug>/  and  /ru/products/<slug>/
```

Same as `productSlug()` in `scripts/lib/site-data.js` and `js/main.js`.

## build.sh

```
CACHE_VERSION=20261127120000 erp/build.sh erp/site-data.json
```

1. `apply-site-data.js` validates the file and rewrites only these regions: `PRODUCTS` and
   `NON_GENUINE_BRANDS` in `js/data.js`, `PRODUCT_PHOTOS`, `PRODUCT_VIDEOS`, and
   `PRODUCT_SPEC_RU` / `PRODUCT_DEEP_RU` in `js/i18n-ru.js`. On any error nothing is written.
2. Runs `scripts/build-product-pages.js`, `build-hub-pages.js`, `build-product-pages-ru.js`,
   `build-hub-pages-ru.js` in that order.
3. `postbuild.js` stamps release marks and sets one `?v=` on every `.js`/`.css` reference
   (default version: current time).

Stdout is one JSON line per step. On failure stderr ends with `{"errors":[…]}` and the exit
code is non-zero. Building an unchanged export changes no page except `?v=` versions and the
sitemap date (covered by `npm test`).

`erp/` is excluded from deploys (`scripts/deploy.sh`).

## verify.js

Input: `[{ "url": "https://fouwell.com/products/<slug>/", "images": 6, "video": true, "release": "WP10001" }]`

Per page: HTTP 200; `<link rel="canonical">` equals `url`; `#pd-main-img` loaded with a
width above 0 when `images > 0`; number of `#pd-thumbs .pd-thumb` equals `images`; with
`video: true` the video section is shown and has a `<video>`, with `false` it is hidden;
`erp-release` equals `release` when given.

`--root DIR` serves `DIR` on a local port (local check before deploy); without it the real
URL is opened with a random query parameter (online check). Output:
`{"ok": bool, "results": [{ "url", "ok", "errors": [...], "found": {...} }]}`, exit 1 if any
page fails.

## export-existing.js

Writes the current catalog in the format above (`slug` filled in, no `release`). Warnings go
to stderr as `{"warnings":[…]}`: `orphan` (a photos/videos/Russian entry whose key matches no
product) and `no_image`.
