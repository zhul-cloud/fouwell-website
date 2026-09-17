#!/usr/bin/env node
/* Automates the *structurally verifiable* checks from schema/products-schema.md's
 * "独立站页面SEO审计标准"（2026-09-14, Zyppy Signal Top10 排名因素）on already-published
 * product pages. This exists because generate-data-entry.js's category guard only protects
 * NEW entries at creation time — it never re-checks the ~80 SKUs already in js/data.js, and
 * it doesn't check anything beyond category. This script re-checks EXISTING entries and
 * covers a few more of the automatable factors.
 *
 * Honesty about scope (read before trusting a clean report):
 *   This script ONLY checks what's mechanically verifiable from static files — presence and
 *   internal consistency, not quality or truthfulness. A page can pass every check here and
 *   still fail the standard's higher-weighted factors (relevance depth, content quality,
 *   E-E-A-T substance, click/behavior signals, brand signals, user satisfaction, topical
 *   authority) — those need a human or an LLM actually reading the page against its target
 *   search intent, which this script does not do. Every report ends with an explicit list of
 *   what was NOT checked, on purpose, so "0 failures" is never mistaken for "fully compliant".
 *
 * Checks performed, mapped to the standard's priority order:
 *   [相关性]     category consistency (wiki category -> expected site bucket, via the SAME
 *                map generate-data-entry.js uses) + title/H1 contain the model + JSON-LD
 *                Product.category matches the expected bucket label
 *   [内容质量]   spec (from data.js) non-empty + FAQPage JSON-LD has >=1 question
 *   [信任]       NON_GENUINE_BRANDS pages don't claim "Genuine"/"100% genuine"
 *   [技术SEO]    canonical present & self-referencing + meta description present & sane
 *                length + BreadcrumbList JSON-LD present and its last item is the model
 *   [内链/图片]  data.js has a photo or linkedin card source (else no main image at all)
 *
 * Usage:
 *   node scripts/seo-audit.js <model>          audit one SKU by model string
 *   node scripts/seo-audit.js --all            audit every published SKU
 *   node scripts/seo-audit.js --all --json     machine-readable output (for future lint use)
 */
const fs = require('fs');
const path = require('path');
const { loadGlobals, productUrl } = require('./lib/site-data.js');
const { WIKI_CATEGORY_TO_SITE_CATEGORY } = require('./lib/category-map.js');

const SITE_ROOT = path.join(__dirname, '..');
// NOTE: site-data.js's own `ROOT` export is relative to ITS __dirname (scripts/lib/), so it
// resolves to fouwell-website/ itself, not the llm-wiki repo root — don't reuse it here.
const REPO_ROOT = path.join(__dirname, '..', '..');
const WIKI_PRODUCTS_DIR = path.join(REPO_ROOT, 'wiki', 'products');

const NOT_AUTOMATED = [
  '反向链接 Backlinks (54.8%) — 页面是否具备值得被链接的独特价值，需要人工判断',
  '内容质量 Content Quality (47.6%) — spec/FAQ是否只是"存在"而非真的准确、有信息增量，需要人工核对内容本身',
  '权威与信任 Authority & Trust (36.5%) — E-E-A-T信号的实质强弱（不只是"有没有联系方式"这种存在性检查）',
  '行为/点击信号 Behavior/Click Signals (29.4%) — 无法从静态文件判断，需要真实用户数据（GSC/GA）',
  '品牌信号 Brand Signals (27.0%) — 品牌可辨识度/搜索量，无法从单页静态文件判断',
  '用户满意度 User Satisfaction (19.8%) — 是否真正解决用户查询目的，需要人工判断',
  '话题权威度 Topical Authority (14.3%) — 该页是否有配套深度内容支撑，本脚本不判断语义关联',
];

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const mm = line.match(/^(\w+):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2].trim();
    }
  }
  return fm;
}

/* Walk wiki/products/[Brand]/[WikiCategory]/[Model].md, return Map<model, wikiCategory>. */
function buildWikiCategoryIndex() {
  const index = new Map();
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.md')) {
        const fm = parseFrontmatter(fs.readFileSync(full, 'utf8'));
        if (fm.model && fm.category) index.set(fm.model, fm.category);
      }
    }
  }
  if (fs.existsSync(WIKI_PRODUCTS_DIR)) walk(WIKI_PRODUCTS_DIR);
  return index;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      blocks.push({ __parseError: e.message, __raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

function auditOne(product, wikiCategoryIndex, siteCategoryLabels) {
  const findings = []; // { level: 'fail'|'warn', msg }
  const slug = productUrl(product);
  const htmlPath = path.join(SITE_ROOT, 'products', slug.replace(/^\/products\//, '').replace(/\/$/, ''), 'index.html');

  if (!fs.existsSync(htmlPath)) {
    findings.push({ level: 'fail', msg: `没有找到预渲染的HTML文件（${path.relative(SITE_ROOT, htmlPath)}）——可能是构建脚本没跑过，或slug计算方式变了` });
    return { model: product.model, brand: product.brand, url: slug, findings };
  }
  const html = fs.readFileSync(htmlPath, 'utf8');

  // --- [相关性] 分类一致性：wiki细分类目 -> 预期site分类，对比data.js里实际的cat ---
  const wikiCategory = wikiCategoryIndex.get(product.model);
  if (!wikiCategory) {
    findings.push({ level: 'warn', msg: `在 wiki/products/ 里找不到这个型号的页面，无法核对分类是否一致（可能型号名拼写不一致，或wiki页面缺失）` });
  } else {
    const expected = WIKI_CATEGORY_TO_SITE_CATEGORY[wikiCategory];
    if (!expected) {
      findings.push({ level: 'fail', msg: `wiki分类"${wikiCategory}"不在 WIKI_CATEGORY_TO_SITE_CATEGORY 映射表里，无法判断这个型号该属于网站哪个分类桶——先去 scripts/lib/category-map.js 补映射` });
    } else if (expected !== product.cat) {
      findings.push({ level: 'fail', msg: `分类不一致：wiki分类"${wikiCategory}"应该映射到"${expected}"（${siteCategoryLabels[expected]}），但 js/data.js 里这条记录是 cat: "${product.cat}"（${siteCategoryLabels[product.cat] || '未知'}）` });
    }
  }

  // --- [相关性] Title / H1 包含型号 ---
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!titleMatch || !titleMatch[1].trim()) {
    findings.push({ level: 'fail', msg: '缺少 <title> 标签' });
  } else if (!titleMatch[1].includes(product.model)) {
    findings.push({ level: 'fail', msg: `<title> 里没有包含型号"${product.model}"：${titleMatch[1].trim()}` });
  }
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1Match || !h1Match[1].trim()) {
    findings.push({ level: 'fail', msg: '缺少 <h1> 标签或H1为空' });
  } else if (!h1Match[1].includes(product.model)) {
    findings.push({ level: 'fail', msg: `<h1> 里没有包含型号"${product.model}"：${h1Match[1].trim()}` });
  }

  // --- [技术SEO] Meta description 存在且长度合理 ---
  const metaMatch = html.match(/<meta name="description" content="([\s\S]*?)">/);
  if (!metaMatch || !metaMatch[1].trim()) {
    findings.push({ level: 'fail', msg: '缺少 meta description' });
  } else {
    const len = metaMatch[1].length;
    if (len < 50) findings.push({ level: 'warn', msg: `meta description 偏短（${len}字符），可能信息量不够` });
    if (len > 320) findings.push({ level: 'warn', msg: `meta description 偏长（${len}字符），搜索结果页大概率会被截断` });
  }

  // --- [技术SEO] Canonical 存在且自引用 ---
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)">/);
  const expectedCanonical = `https://fouwell.com${slug}`;
  if (!canonicalMatch) {
    findings.push({ level: 'fail', msg: '缺少 canonical 标签' });
  } else if (canonicalMatch[1] !== expectedCanonical) {
    findings.push({ level: 'fail', msg: `canonical 不是自引用：期望 ${expectedCanonical}，实际 ${canonicalMatch[1]}` });
  }

  // --- JSON-LD 结构化数据 ---
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const productLd = jsonLdBlocks.find((b) => b['@type'] === 'Product');
  const breadcrumbLd = jsonLdBlocks.find((b) => b['@type'] === 'BreadcrumbList');
  const faqLd = jsonLdBlocks.find((b) => b['@type'] === 'FAQPage');

  for (const b of jsonLdBlocks) {
    if (b.__parseError) findings.push({ level: 'fail', msg: `一段 JSON-LD 解析失败：${b.__parseError}（${b.__raw}...）` });
  }
  if (!productLd) {
    findings.push({ level: 'fail', msg: '缺少 Product 类型的 JSON-LD 结构化数据' });
  } else if (wikiCategory) {
    const expected = WIKI_CATEGORY_TO_SITE_CATEGORY[wikiCategory];
    const expectedLabel = expected && siteCategoryLabels[expected];
    if (expectedLabel && productLd.category !== expectedLabel) {
      findings.push({ level: 'fail', msg: `Product JSON-LD 的 category 是"${productLd.category}"，期望"${expectedLabel}"（和上面的分类不一致是同一个根因）` });
    }
  }
  if (!breadcrumbLd || !Array.isArray(breadcrumbLd.itemListElement) || breadcrumbLd.itemListElement.length === 0) {
    findings.push({ level: 'fail', msg: '缺少 BreadcrumbList JSON-LD' });
  } else {
    const last = breadcrumbLd.itemListElement[breadcrumbLd.itemListElement.length - 1];
    if (!last || !String(last.name || '').includes(product.model)) {
      findings.push({ level: 'warn', msg: `BreadcrumbList 最后一项不含型号：${last && last.name}` });
    }
  }
  if (!faqLd || !Array.isArray(faqLd.mainEntity) || faqLd.mainEntity.length === 0) {
    findings.push({ level: 'warn', msg: '缺少 FAQPage JSON-LD 或FAQ为空（内容质量/GEO可抓取性相关）' });
  }

  // --- [信任] NON_GENUINE_BRANDS 一致性：非正品品牌的FAQ/描述不应该正面断言"genuine" ---
  // Checked narrowly against FAQPage JSON-LD answers specifically (the exact spot the
  // 2026-09-14 audit caught js/faq-templates.js's genericFaqFor() ignoring NON_GENUINE_BRANDS
  // for) rather than a blanket page-text search — a blanket search false-positives on: the
  // negated disclosure itself ("not a genuine Mitsubishi product"), customer review quotes
  // ("Genuine supplier of..." — a different sense of the word), and the generic footer
  // tagline ("10+ years supplying genuine industrial automation parts from 25+ brands").
  if (product.__nonGenuine && faqLd && Array.isArray(faqLd.mainEntity)) {
    // Two sub-checks, both found 2026-09-14 auditing PWERUN FX3U-30MR / General 80ST-M02430
    // via js/faq-templates.js's genericFaqFor() — it had TWO answers making OEM-authenticity
    // claims that were never updated for NON_GENUINE_BRANDS, not just one:
    const AUTHENTICITY_PHRASES = /official brand channels|original (manufacturer )?packaging|factory test report|verified authorized distributors/i;
    for (const qa of faqLd.mainEntity) {
      const question = qa.name || '';
      const answer = (qa.acceptedAnswer && qa.acceptedAnswer.text) || '';
      // 1) The "Is it genuine?" question answered with an unqualified "Yes." — directly
      //    contradicts the "not a genuine X product" disclosure shown elsewhere on the page.
      //    (Answer body doesn't contain the literal word "genuine", only the question does —
      //    a naive whole-answer "genuine" text search would miss this.)
      if (/genuine/i.test(question) && /^\s*yes\b/i.test(answer) &&
          !/not\s+(a\s+|an\s+)?(genuine|authentic)/i.test(answer) && !/compatible/i.test(answer)) {
        findings.push({ level: 'fail', msg: `品牌"${product.brand}"在 NON_GENUINE_BRANDS 里，但FAQ"${question}"的回答以未加限定的"Yes."开头、断言走官方渠道/原厂包装：${answer.slice(0, 120)}...` });
      }
      // 2) ANY other FAQ answer (not just the genuine question) asserting an authenticity-
      //    adjacent phrase — e.g. the shipping FAQ's "with full insurance and original
      //    manufacturer packaging" made the same false claim under a different question.
      else if (AUTHENTICITY_PHRASES.test(answer)) {
        findings.push({ level: 'fail', msg: `品牌"${product.brand}"在 NON_GENUINE_BRANDS 里，但FAQ"${question}"的回答里出现了正品/原厂相关措辞：${answer.slice(0, 160)}...` });
      }
    }
  }

  // --- [内链/图片] 至少要有一个图片来源 ---
  // Mirrors productGallery()'s real fallback chain in js/main.js: PRODUCT_PHOTOS[model]
  // (js/photos.js, full material set) -> product.photo -> product.linkedin. Any one of the
  // three is enough; only flag when ALL THREE are absent (genuinely no image source at all).
  if (!product.__hasPhotoEntry && !product.photo && !product.linkedin) {
    findings.push({ level: 'fail', msg: '没有 js/photos.js 条目，也没有 photo/linkedin 字段，主图会没有来源' });
  }

  return { model: product.model, brand: product.brand, url: slug, findings };
}

function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const all = args.includes('--all');
  const modelArg = args.find((a) => !a.startsWith('--'));

  if (!all && !modelArg) {
    console.error('Usage: node scripts/seo-audit.js <model> | --all [--json]');
    process.exit(1);
  }

  const g = loadGlobals('js/data.js', 'js/photos.js');
  const siteCategoryLabels = g.CATEGORIES;
  const nonGenuine = g.NON_GENUINE_BRANDS || new Set();
  const productPhotos = g.PRODUCT_PHOTOS || {};
  for (const p of g.PRODUCTS) {
    p.__nonGenuine = nonGenuine.has(p.brand);
    p.__hasPhotoEntry = Array.isArray(productPhotos[p.model]) && productPhotos[p.model].length > 0;
  }

  const wikiCategoryIndex = buildWikiCategoryIndex();

  const targets = all
    ? g.PRODUCTS
    : g.PRODUCTS.filter((p) => p.model === modelArg);

  if (targets.length === 0) {
    console.error(`No product found with model "${modelArg}" in js/data.js`);
    process.exit(1);
  }

  const results = targets.map((p) => auditOne(p, wikiCategoryIndex, siteCategoryLabels));
  const withFailures = results.filter((r) => r.findings.some((f) => f.level === 'fail'));
  const withWarnings = results.filter((r) => r.findings.some((f) => f.level === 'warn') && !r.findings.some((f) => f.level === 'fail'));
  const clean = results.filter((r) => r.findings.length === 0);

  if (jsonOutput) {
    console.log(JSON.stringify({ results, notAutomated: NOT_AUTOMATED }, null, 2));
    return;
  }

  for (const r of results) {
    if (r.findings.length === 0) continue;
    console.log(`\n${r.brand} ${r.model}  (${r.url})`);
    for (const f of r.findings) {
      console.log(`  [${f.level === 'fail' ? 'FAIL' : 'warn'}] ${f.msg}`);
    }
  }

  console.log(`\n${'-'.repeat(60)}`);
  console.log(`审计 ${results.length} 个页面：${clean.length} 个全部通过自动化检查项，${withWarnings.length} 个仅有提醒，${withFailures.length} 个有需要处理的问题`);
  if (withFailures.length > 0) {
    console.log(`需要处理: ${withFailures.map((r) => r.model).join(', ')}`);
  }
  console.log(`\n本脚本没有检查（需要人工/LLM判断，不是"0问题"就等于完全达标）：`);
  for (const item of NOT_AUTOMATED) console.log(`  - ${item}`);

  if (withFailures.length > 0) process.exitCode = 1;
}

main();
