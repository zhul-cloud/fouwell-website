#!/usr/bin/env bash
# Deploys fouwell-website/ to the SiteGround production server via rsync.
# See docs/SEO-GEO-Architecture.md section 11 for the full deploy/cache-flush SOP.
#
# 2026-09-18: this now runs automatically on every push to main via
# .github/workflows/deploy.yml — you normally don't need to run this by hand
# anymore. Kept as a manual fallback (e.g. testing an rsync from an uncommitted
# working tree, or deploying when CI is down).
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_KEY="${HOME}/.ssh/fouwell_deploy_key"
REMOTE="u1796-rxnrbib8x7ji@gcam1252.siteground.biz:www/fouwell.com/public_html/"

# All /js/*.js and /css/*.css asset references carry a "?v=..." cache-buster, and the
# server sends cache-control: max-age=31536000 (1 year) for both types — so every one of
# them must get a fresh version string on every deploy, or returning visitors' browsers
# keep serving a year-old cached copy forever and never see newly added/changed content
# (found 2026-09-13: data.js's version had been hardcoded to "20260911final" since Sep 11
# and never bumped — new SKUs looked like "Product not found" client-side even though the
# server's raw HTML was correct; other files were on their own stale "...final" strings
# from whenever they were last hand-edited, e.g. photos.js still said 20260911final after
# being fully regenerated with 17 new SKUs' galleries). Bump all of them together, here,
# unconditionally, right before every rsync — one shared timestamp is simpler than tracking
# a separate version per file and costs nothing (every asset gets refetched together anyway
# once any one of data.js/photos.js/etc. changes, since they're loaded on the same pages).
CACHE_VERSION="$(date +%Y%m%d%H%M%S)"
echo "Bumping all asset cache-busters to v=${CACHE_VERSION} across all .html files..."
find "${SITE_DIR}" -name '*.html' -not -path '*/node_modules/*' -print0 \
  | xargs -0 sed -i '' -E "s/\.(js|css)\?v=[A-Za-z0-9]+/.\1?v=${CACHE_VERSION}/g"

rsync -avz --checksum \
  -e "ssh -p 18765 -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  --exclude='.git' \
  --exclude='.gstack' \
  --exclude='.DS_Store' \
  --exclude='node_modules' \
  "${SITE_DIR}/" \
  "${REMOTE}"

# IndexNow (Bing/Yandex/...) push — see scripts/indexnow-submit.js header for why this
# exists. Runs AFTER the rsync so the key file (<key>.txt at the domain root) is already
# live before the API call that references it. Non-fatal: a submission hiccup shouldn't
# fail the whole deploy, so this is best-effort with `|| true`.
echo ""
echo "Pinging IndexNow (Bing/Yandex) with the current sitemap..."
node "${SITE_DIR}/scripts/indexnow-submit.js" || echo "IndexNow submission failed — not fatal, deploy already succeeded."

cat <<'EOF'

Deploy done. Now flush SiteGround Dynamic Cache manually (SSH/curl PURGE won't work):
  SITE TOOLS -> SuperCacher -> Dynamic Cache -> Flush Cache (fouwell.com row)
EOF
