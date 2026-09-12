# Fouwell 独立站 · SEO/GEO 架构方案

> 文档版本：v1.0 · 2026-08-31
> 适用范围：Fouwell 工业自动化 B2B 静态站 (fouwell.com)
> 维护节奏：每季度复审一次；每加一类新页面或新品牌时增量更新

---

## 0. 为什么需要这份文档

Fouwell 长期目标是**沉淀品牌资产**——既要让 Google 收录、让采购工程师搜得到，也要在 ChatGPT / Perplexity / Claude / Gemini 这类生成式引擎被引用为「权威来源」。

静态站（SiteGround + 纯 HTML/CSS/JS）天然适合 SEO：响应快、URL 干净、HTML 直接可读。但 GEO（Generative Engine Optimization）是 2024–2026 才成型的新战场，规则还在快速迭代。本文档给出**当下可执行的标准**，并标记出哪些字段未来需要扩展。

---

## 1. 全局规则（10 条不可违反）

1. **URL 一律小写连字符（lower-kebab）**，不带 `.html` 后缀，不带查询参数做主路径。
2. **所有内部链接 root-relative**（`/products/...`，不是 `products/...`，也不是 `https://...`），否则在 `/products/<slug>/` 这类深层路径下 CSS/JS/图片会 404。
3. **每个 URL 必须有唯一 `<title>` + `<meta description>` + `<link rel="canonical">`**，三套内容互相呼应，不堆关键词。
4. **每页必须输出对应类型的 JSON-LD**（Organization / WebSite / Product / BreadcrumbList / FAQPage），由 `main.js` 在客户端注入；客户端注入**不影响 SEO**（Google 会执行 JS 后抓取），但对无 JS 抓取是降级。
5. **每张产品图必须有 `alt`**，描述「品牌 + 型号 + 视角」（如 `Siemens 6ES7212-1AE40-0XB0 front view`）。
6. **FAQ 永远用 `<details>/<summary>` 原生元素**，不用 JS-only 的 accordion。原因：无 JS 即可用、可键盘导航、可被 Google / AI 引擎爬取。
7. **Schema 字段命名严格遵守 schema.org**，不发明新词。`@type` 用官方枚举值（`Product`、`FAQPage`、`BreadcrumbList` 等）。
8. **每个产品页必须有一条指向 `/contact/?model=<model>#inquiry` 的 CTA**，URL 上明确带型号，方便 GA4 归因。
9. **不要用 iframe 加载核心内容**——AI 引擎几乎不抓 iframe 内容。
10. **新文件部署后必须清 SiteGround Dynamic Cache**，否则首页/产品页仍是旧版（缓存键不含文件 mtime）。

---

## 2. URL 架构

### 2.1 站点地图

| 类型 | 路径 | 例 | 说明 |
|---|---|---|---|
| 首页 | `/` | `/` | 站点头部，含 Organization + WebSite Schema |
| 关于 | `/about/` | `/about/` | 公司介绍；含 `Meet the Founder` 子锚点 |
| 联系 | `/contact/` | `/contact/` | 表单页，含 InquiryForm Schema |
| 产品列表 | `/products/` | `/products/` | 全量列表 + 搜索筛选 |
| 分类筛选 | `/products/?cat=<id>` | `/products/?cat=controllers` | 同一页面，仅 query 过滤 |
| 产品详情 | `/products/<brand>-<series>-<model>/` | `/products/siemens-s7-1200-6es7212-1ae40-0xb0/` | **所有详情页必须用此模式** |
| FAQ 锚点 | `/products/<slug>/#faq` | 见上 | 由 `<section id="detail-faq-section">` 提供 |
| 文档 | `/docs/<filename>` | `/docs/SEO-GEO-Architecture.md` | 给客户 / 工程师阅读的长文 PDF 替代品 |
| 站点地图 | `/sitemap.xml` | — | 自动生成的 XML |
| Robots | `/robots.txt` | — | Allow: / + Sitemap 声明 |

### 2.2 详情页 slug 生成规则

由 `js/main.js` 的 `productSlug(p)` 函数生成：

```
slug = kebab(brand) + "-" + kebab(series) + "-" + kebab(model)
```

- **全小写**。
- **非字母数字 → 连字符**（`6ES7212-1AE40-0XB0` → `6es7212-1ae40-0xb0`）。
- **多个连续连字符折叠为一个**。
- **前后连字符去除**。
- 三段任一为空则跳过该段（不会产生 `--`）。

实现见 `js/main.js` 顶部 `_slugPiece()` 辅助方法。

### 2.3 兼容策略

- **`/products/<slug>/` 是主版本**，`/product.html?model=<model>` 保留作为 fallback（302 → 主版本，或保留页面跳转逻辑）。
- 老链接、外链、Shopify/WooCommerce 迁移来的 URL 通过 `.htaccess` 301 重定向到新 slug（上线 50+ 产品时再配置，前期 48 个不强求）。

---

## 3. 页面类型与 Meta 标签标准

### 3.1 首页 `/`

```html
<title>Fouwell — Industrial Automation Parts Supplier | 25+ Brands, Global Shipping</title>
<meta name="description" content="Fouwell supplies genuine Siemens, Schneider, Mitsubishi, OMRON, Yaskawa PLCs, HMIs, drives and sensors. 100% inspected, in-stock items ship within 24 hours. Request a quote.">
<link rel="canonical" href="https://fouwell.com/">
```

- 长度：title 50–60 字符，description 140–160 字符。
- 不堆关键词；写「人话」。

### 3.2 产品列表 `/products/`

```html
<title>Industrial Automation Parts Catalog | Fouwell — Siemens, Schneider, Mitsubishi</title>
<meta name="description" content="Browse 48+ genuine PLCs, HMIs, drives, sensors and servo systems from 25+ brands. In-stock items ship same-day. Datasheets, photos and cross-reference available.">
```

### 3.3 产品详情 `/products/<slug>/`

```html
<title>Siemens 6ES7212-1AE40-0XB0 | Fouwell Industrial Automation</title>
<meta name="description" content="Siemens SIMATIC S7-1200 CPU 1212C (6ES7212-1AE40-0XB0) — DC/DC/DC, 8DI/6DO/2AI, 24VDC. In stock, 100% genuine, ships within 24 hours. Datasheet, FAQs and cross-reference on file.">
<link rel="canonical" href="https://fouwell.com/products/siemens-s7-1200-6es7212-1ae40-0xb0/">
```

- `<title>` 模式：`<brand> <model> | Fouwell Industrial Automation`
- `<description>` 模式：紧凑说明 = 品牌系列 + 关键参数 + 「in stock」+ 「datasheet, FAQs available」
- canonical 必须和实际 URL 完全一致（含 trailing slash）。

### 3.4 关于 / 联系

- `<title>`：`About Fouwell — Industrial Automation Parts Supplier Since 2014` / `Contact Fouwell — Request a Quote, 24-Hour Reply`
- 含地理坐标（address），便于「Fuzhou automation supplier」类搜索。

### 3.5 OG / Twitter Card（全站通用）

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://fouwell.com/assets/og-<page>.jpg">
<meta property="og:url" content="https://fouwell.com/...">
<meta property="og:type" content="website">           <!-- 或 "product" -->
<meta property="og:site_name" content="Fouwell">
<meta name="twitter:card" content="summary_large_image">
```

- 详情页 og:type 用 `product`，其他页用 `website`。
- og:image 推荐 1200×630，< 200 KB。

---

## 4. JSON-LD Schema 字段表（按页面类型）

由 `js/main.js` 的 `injectProductSchema()` 等渲染。**当前已实现：首页 Organization+WebSite、详情页 Product+BreadcrumbList+FAQPage、列表页 BreadcrumbList。**

### 4.1 首页（Organization + WebSite）

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fouwell.com/#org",
      "name": "Fuzhou Fouwell Technology Co., Ltd.",
      "alternateName": "Fouwell",
      "url": "https://fouwell.com",
      "logo": "https://fouwell.com/assets/logo.png",
      "description": "Industrial automation parts supplier (PLCs, HMIs, drives, sensors) since 2014. 25+ brands, 48+ SKUs in stock, global shipping.",
      "foundingDate": "2014",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "...",
        "addressLocality": "Fuzhou",
        "addressRegion": "Fujian",
        "postalCode": "350001",
        "addressCountry": "CN"
      },
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+86-133-8591-5251",
        "contactType": "sales",
        "email": "info@fouwell.com",
        "availableLanguage": ["English", "Chinese"]
      }],
      "sameAs": [
        "https://www.linkedin.com/company/fouwell",
        "https://www.alibaba.com/...fouwell"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://fouwell.com/#site",
      "url": "https://fouwell.com",
      "name": "Fouwell",
      "publisher": { "@id": "https://fouwell.com/#org" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://fouwell.com/products/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

### 4.2 产品详情（Product + BreadcrumbList + FAQPage）

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": "https://fouwell.com/products/<slug>/#product",
      "name": "6ES7212-1AE40-0XB0",
      "alternateName": "Siemens SIMATIC S7-1200 CPU 1212C DC/DC/DC",
      "sku": "6ES7212-1AE40-0XB0",
      "mpn": "6ES7212-1AE40-0XB0",
      "brand": { "@type": "Brand", "name": "Siemens" },
      "category": "PLC & Controllers",
      "description": "CPU 1212C DC/DC/DC, 8DI/6DO/2AI, 24VDC, CE/CCC",
      "image": [
        "https://fouwell.com/assets/products/6ES7212-1AE40-0XB0.jpg",
        "..."
      ],
      "offers": {
        "@type": "Offer",
        "url": "https://fouwell.com/products/<slug>/",
        "priceCurrency": "USD",
        "price": "0",                                  // 不公开价格 → 0 或不写
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock", // legacy → LimitedAvailability, discont → Discontinued
        "itemCondition": "https://schema.org/NewCondition",
        "seller": { "@id": "https://fouwell.com/#org" }
      },
      "additionalProperty": [
        // p.specs[] 转过来的 kv 对
        { "@type": "PropertyValue", "name": "Power supply", "value": "24 V DC (DC/DC/DC)" },
        { "@type": "PropertyValue", "name": "Digital inputs", "value": "8 × 24 V DC" },
        ...
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fouwell.com/" },
        { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://fouwell.com/products/" },
        { "@type": "ListItem", "position": 3, "name": "PLC & Controllers", "item": "https://fouwell.com/products/?cat=controllers" },
        { "@type": "ListItem", "position": 4, "name": "6ES7212-1AE40-0XB0" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What does the order code 6ES7212-1AE40-0XB0 mean?",
          "acceptedAnswer": { "@type": "Answer", "text": "It is a Siemens SIMATIC S7-1200 CPU 1212C with ..." } },
        ...
      ]
    }
  ]
}
```

字段规范：

| 字段 | 必填 | 规则 |
|---|---|---|
| `name` | ✓ | 完整型号（含 MLFB） |
| `sku` / `mpn` | ✓ | 同 `name` |
| `image[]` | ✓ | 6–8 张产品图，URL 必须 root-absolute |
| `offers.availability` | ✓ | instock→InStock / legacy→LimitedAvailability / discont→Discontinued |
| `offers.price` | ✗ | B2B 不公开 → 写 `0` 或不写 |
| `additionalProperty[]` | ✗ | 仅当 `p.specs[]` 存在时附加 |
| `aggregateRating` | ✗ | 暂无用户评分 → 不写，避免假数据 |

### 4.3 列表页（ItemList + BreadcrumbList）

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://fouwell.com/products/<slug1>/", "name": "..." },
    ...
  ]
}
```

待实施：列表页批量注入 ItemList（48 个产品太长会被 Google 截断 → 限制前 20 个）。

---

## 5. FAQ / 长文内容模板

### 5.1 FAQ 数量与配比

每个深度产品页 **8 条 FAQ**，配比如下（参考 S7-1200 样板）：

| # | 类型 | 示例问题 |
|---|---|---|
| 1 | 型号解读 | What does the order code X mean? |
| 2 | 软件兼容 | Is this CPU compatible with TIA Portal / STEP 7? |
| 3 | 同系列对比 | How does the X compare with other Y models (A/B/C)? |
| 4 | 技术参数 | What are the limits on memory, counters, retentive data? |
| 5 | 协议 / 接口 | What fieldbus and HMI protocols are supported? |
| 6 | 物流 / 交付 | How is the unit shipped and how long does delivery take? |
| 7 | 质保 / 售后 | Do you offer a warranty? |
| 8 | 替代 / 停产 | Can you cross-reference an old or hard-to-find part number? |

**首问首答不超过 200 字**（Google 直接抓 FAQ 摘要时的长度上限）；中段回答可到 400–600 字。

### 5.2 FAQ 写法规范

- **首句必答问题本身**，不要绕弯。
- **品牌名、型号、关键参数至少出现一次**（便于 AI 引擎匹配）。
- **每条 Q/A 之间留空行**（HTML 里换行即可，CSS 不需要专门样式）。
- **不要写「请咨询客服」这种空话**，直接给出可执行的数字（如「1 working hour」「3–5 working days」）。
- **价格不写数字**——B2B 询盘制，价格写在 `/contact/#inquiry` 的回复邮件里。

### 5.3 长文内容模板（500–1200 词）

适用：博客文章、应用案例、白皮书、技术对比。

结构：

```
H1: <主题，1 个关键词>
  简介 (50 词)：核心结论前置
  TOC (3-7 节)
  §1 背景 / 问题定义
  §2 方案 / 选型依据
  §3 实操 / 步骤
  §4 常见问题
  §5 结论 + CTA → /contact/?topic=<id>#inquiry
```

样式：
- 每节 H2 必须包含 1 个次要关键词。
- 至少 3 张原创图（产品图、应用现场截图、接线图）。
- 文末附 3–5 条「延伸阅读」内链（同主题其他产品/文章）。

---

## 6. 图片 / 视频优化

### 6.1 产品图

| 项 | 标准 |
|---|---|
| 命名 | `<model>.jpg` 或 `<model>-<n>.jpg`（同型号多角度） |
| 尺寸 | 原图 ≥ 1600×1600；前端展示 600×600 (thumbnail) + 1200×1200 (zoom) |
| 格式 | `.jpg` (产品照片) / `.webp` (banner) / `.png` (logo, line art) |
| 体积 | 单图 ≤ 250 KB；首屏主图 ≤ 150 KB |
| alt | `Brand Model view-angle`，如 `Siemens 6ES7212-1AE40-0XB0 front view` |

### 6.2 视频

- 容器：`<video controls preload="none" poster="<first-frame>.jpg">`
- `preload="none"`：避免页面加载时下载全部视频文件。
- 仅在视口内的视频才挂 `data-src`（懒加载）。
- MP4 / WebM 双格式优先，但首版仅 MP4 即可。

---

## 7. 站点性能（Core Web Vitals）

- **LCP** (Largest Contentful Paint)：< 2.5s
  - 首屏主图使用 `<link rel="preload" as="image">`
  - CSS 内联关键路径（Critical CSS）；非关键 CSS 异步加载
- **CLS** (Cumulative Layout Shift)：< 0.1
  - 所有 `<img>` 显式写 `width` / `height`
  - 字体使用 `font-display: swap` + 预加载
- **INP** (Interaction to Next Paint)：< 200ms
  - 不在主线程跑重 JS（产品数据 ≤ 50 KB）
  - 事件委托，少量 listener

部署后实测（PageSpeed Insights）：首屏 LCP 控制在 2s 以内。

---

## 8. Sitemap / Robots / 内链

### 8.1 sitemap.xml

- 位置：`/sitemap.xml`
- 更新频率：每加产品时手动跑一次脚本（`scripts/build-sitemap.js`，已实现）。
- 当前规模：52 URL（4 静态 + 48 产品）。Google Search Console 上限是 50000 条，48 个产品远低于上限，不需要分片。

### 8.2 robots.txt

```
User-agent: *
Allow: /

Sitemap: https://fouwell.com/sitemap.xml
```

**关键**：SiteGround 默认会注入 `User-agent: *` + `Crawl-delay: 10`，在 `public_html/robots.txt` 部署自己的版本即可覆盖。

### 8.3 内链规则

1. **每个产品详情页必须链接到 ≥ 1 个同品牌产品、≥ 1 个同类目产品**（related grid 已实现，8 个）。
2. **每个 FAQ 末尾的 CTA 链接到 `/contact/?model=<model>#inquiry`**——URL 携带型号，方便 GA4 转化归因。
3. **首页 / 关于 / 联系不要反向链接到所有产品页**——只链到旗舰 SKU（S7-1200 CPU 1212C、Altivar 12、FR-D740 等），保持 PageRank 不被稀释。
4. **404 页保留搜索框 + 推荐产品**——已实现（`/contact/#inquiry` fallback）。

---

## 9. GEO（生成式引擎优化）专项

> 这是 2025–2026 新出现的战场：让 ChatGPT、Perplexity、Claude、Gemini 在回答用户问题时引用 Fouwell 的产品页作为权威来源。

### 9.1 GEO 与 SEO 的差异

| 维度 | 传统 SEO | GEO |
|---|---|---|
| 目标 | 搜索引擎 Top 10 | 被 AI 引擎引用 |
| 评估 | 排名 / 点击 | 引用次数 / 摘要准确度 |
| 优化对象 | 关键词密度、外链 | **事实陈述清晰度、FAQ 完整度、Schema 完整度** |
| 主要引擎 | Google / Bing | ChatGPT / Perplexity / Claude / Gemini / 豆包 |

### 9.2 GEO 优化清单（**已实施**打 ✓）

- ✓ **每页必填 FAQ**（事实陈述型，便于引擎抽取）。
- ✓ **JSON-LD 完整**（`FAQPage` schema 让 Perplexity 直接渲染问答卡片）。
- ✓ **产品型号 / 品牌 / 关键参数在首段出现**（实体识别率高）。
- ✓ **每个产品有独立 URL**，不是 `/product.html?model=xxx` 这种动态参数（引擎不抓动态参数）。
- ✓ **`additionalProperty` 把规格表转成 PropertyValue**，AI 可直接解析。
- ✓ **跨型号交叉引用**（`compatibility[]` 表）——「X 能替代 Y 吗」类问题命中率提升。
- ○ **生产日期 / 末次更新日期**（Article schema 的 `dateModified`）— 待每季度手动维护。
- ○ **作者 / 审核人署名**（Person schema）— 待开通 `info@fouwell.com` 实名认证。
- ○ **多语言版本**（中 / 英）— 阶段 D 任务。

### 9.3 GEO 反向 prompt（让 AI 引擎「想起」你）

核心思路：**把你的产品页内容写得像「事实数据库条目」**，而不是「营销文案」。对照：

❌ 营销口吻：
> "We are the leading supplier of premium industrial automation solutions..."

✓ 事实陈述：
> "The Siemens 6ES7212-1AE40-0XB0 is a SIMATIC S7-1200 CPU 1212C with 8 digital inputs, 6 digital outputs and 2 analog inputs, in 24 VDC power. Compatible with TIA Portal V13 SP1+."

后者在 Perplexity 检索「Siemens S7-1200 1212C specs」时，更容易被引用为事实。

### 9.4 监测 GEO 表现

- 每月在 ChatGPT / Perplexity / Claude 跑 5 个目标 query：
  - `<brand> <model> specifications`
  - `<brand> <model> vs <competitor>`
  - `cross reference for <part number>`
  - `industrial automation parts supplier in China`
  - `<category> for <industry>`
- 记录引用 Fouwell 的次数（目标：6 个月内 ≥ 30% query 命中）。

---

## 10. 内容生产 SOP

### 10.1 新增一个产品

1. 在 `js/data.js` 的 `PRODUCTS` 数组里新增 entry，**必填字段**：
   - `brand`, `model`, `series`, `cat`, `spec`, `status`, `photo`
2. 若做深度样板（首选 / 高价值产品）：额外填 `datasheet`, `specs[]`, `applications[]`, `compatibility[]`, `faq[8 条]`。
3. 在 `assets/products/` 放图（至少 1 张正面照）。
4. 跑 `scripts/build-sitemap.js`（TODO）或手动更新 sitemap。
5. 部署 + 清 SiteGround Dynamic Cache。

### 10.2 新增一个品牌

1. `js/data.js` 的 `BRANDS` 数组追加：`{ name, country, logo, since }`。
2. logo 文件放 `assets/brands/real/<slug>.svg`（优先矢量）。
3. 跑 sitemap 脚本（如有自动化）。
4. 部署。

### 10.3 质检清单（每条产品页上线前过一遍）

- [ ] `<title>` 唯一，含品牌 + 型号
- [ ] `<meta description>` 140–160 字符
- [ ] canonical URL 与实际路径一致
- [ ] OG image 1200×630
- [ ] 6+ 张产品图，全部有 alt
- [ ] Breadcrumb 显示 4 层：Home > Products > Category > Model
- [ ] 相关产品 8 个
- [ ] FAQ ≥ 8 条（深度页）/ ≥ 3 条（普通页）
- [ ] 至少 1 个 CTA 指向 `/contact/?model=<model>#inquiry`
- [ ] JSON-LD 三类全部注入（Product / BreadcrumbList / FAQPage）
- [ ] PageSpeed Insights：性能 ≥ 90，SEO ≥ 95

---

## 11. 部署与维护流程

### 11.1 部署命令

```bash
rsync -avz \
  -e "ssh -p 18765 -i ~/.ssh/fouwell_deploy_key -o StrictHostKeyChecking=no" \
  /Users/mac/Documents/llm-wiki/fouwell-website/ \
  u1796-rxnrbib8x7ji@gcam1252.siteground.biz:www/fouwell.com/public_html/
```

⚠️ **rsync 缓存陷阱**：当 rsync 检测到本地文件与目标 mtime 一致时会跳过（即使本地其实修改过）。在批量改动文件后，用 `rsync -avz --checksum` 强制按内容比对。

### 11.2 缓存清理

每次部署后**必须**清 SiteGround Dynamic Cache：

1. 浏览器登录 SiteGround 面板
2. 网站卡片 → **SITE TOOLS** → **SuperCacher** → **Dynamic Cache** 标签
3. fouwell.com 行的 **Flush Cache** 火箭按钮

不可用 SSH 命令行 / `curl PURGE` 方法，Nginx 会忽略。

兜底：3 小时自动失效。

### 11.3 备份策略

- 本地 Git：每完成一个 Stage 提交一次。
- 服务器备份：~/wp-backup-20260901/ 保留半年。
- 关键配置文件（robots.txt / sitemap.xml）保留本地副本。

### 11.4 监控

| 工具 | 指标 | 频率 |
|---|---|---|
| Google Search Console | 收录 / 点击 / 排名 | 每周一次人工查看 |
| GA4 (G-KX8E2TVWQF) | 流量 / 转化 / 询盘 | 每周一次 |
| SiteGround Uptime | 可用性 | 自动告警 |
| 手动 curl 检查 | robots / sitemap 可达 | 每次大改 |

---

## 12. 未来扩展（路线图）

| 阶段 | 内容 | 预计周期 |
|---|---|---|
| **Stage D** | 中 / 英双语；中文站 CN 子域名 | 1–2 月 |
| **Stage E** | WordPress 后台（替换静态站的「内容管理」层）；前台仍静态 | 3–4 月 |
| **Stage F** | Shopify / Shoplazza 上层电商（购物车 + 支付），SEO 入口保留 | 6+ 月 |
| **GEO** | Article / Person / Organization 同名账号体系建设 | 持续 |

---

## 附录 A：相关文件清单

| 文件 | 角色 | 维护频率 |
|---|---|---|
| `js/data.js` | 产品 / 品牌 / 分类主数据 | 每次新增 SKU |
| `js/main.js` | 渲染 + Schema 注入 | 每次新增页面类型 |
| `js/photos.js` | 产品图库（35 SKU） | 每次补图 |
| `js/videos.js` | 视频库（23 SKU） | 每次补视频 |
| `css/style.css` | 全站样式 | 每次新增组件 |
| `product.html` | 产品详情页模板 | 每次新增 section |
| `products.html` | 列表页模板 | 频率低 |
| `index.html` / `about.html` / `contact.html` | 静态页 | 频率低 |
| `sitemap.xml` | 站点地图 | 每次新增/删除 SKU |
| `robots.txt` | 爬虫指令 | 极少改动 |
| `docs/SEO-GEO-Architecture.md` | 本文档 | 每季度 |

---

## 附录 B：变更记录

| 日期 | 变更 | 负责人 |
|---|---|---|
| 2026-08-31 | 初版（Stage A + B + C 整合） | WorkBuddy |
| | | |