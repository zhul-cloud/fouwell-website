# Fouwell — Industrial Automation Parts B2B Website

Official English website of Fuzhou Fouwell Technology Co., Ltd. (福州福唯科技).

- **Domain:** https://fouwell.com
- **Stack:** Pure static HTML / CSS / JS (no backend)
- **Data driven:** `js/data.js` (products/brands/categories) + `js/photos.js` (gallery assets) + `js/videos.js`
- **Inquiry form:** submits directly to info@fouwell.com via FormSubmit relay

## Local development

```bash
python3 -m http.server 8321
# open http://localhost:8321
```

## Rebuild photo mapping after adding assets

```bash
python3 ../scripts/build_photos.py
```

## Deploy

Hosted on GitHub Pages (branch: `main`, root). Custom domain: `fouwell.com`.
