#!/usr/bin/env bash
# ERP entry point: apply site-data.json to the data files, rebuild every page (English, then
# Russian, which reads the English output), stamp release markers and bump cache versions.
# Format and contract: erp/README.md. Deploying is not part of this script.
#
#   erp/build.sh [SITE_DATA_JSON]      (default erp/site-data.json)
#   CACHE_VERSION=20261127120000 erp/build.sh …   (default: current time)
#
# Prints one JSON line per step on stdout; on failure prints {"errors":[…]} on stderr and
# exits non-zero. Data files are left untouched if applying the data fails.
set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${SITE_DIR}"
DATA="$(cd "$(dirname "${1:-erp/site-data.json}")" && pwd)/$(basename "${1:-erp/site-data.json}")"
CACHE_VERSION="${CACHE_VERSION:-$(date +%Y%m%d%H%M%S)}"

node erp/apply-site-data.js "${DATA}"
for step in build-product-pages build-hub-pages build-product-pages-ru build-hub-pages-ru; do
  if ! out="$(node "scripts/${step}.js" 2>&1)"; then
    printf '%s\n' "${out}" | tail -n 50 >&2
    echo "{\"errors\":[\"${step} failed\"]}" >&2
    exit 1
  fi
  echo "{\"step\":\"${step}\",\"ok\":true}"
done
node erp/postbuild.js "${DATA}" --cache-version "${CACHE_VERSION}"
