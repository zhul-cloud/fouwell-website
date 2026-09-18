/* Fouwell product catalog data
   Categories: controllers | hmi | servo | drives | sensors | spares
   Status: instock | legacy | discont
   `linkedin`: path to marketing image under wiki/marketing/<brand>/.../LinkedIn/ (used as photo fallback)
   `sell_price` / `sell_price_currency`: when present, published as Offer.price/priceCurrency
   in the Product schema (see injectProductSchema() / build-product-pages.js). Sourced from
   internal 采购价/售价/同行价 when available, else an external reference price (eBay first,
   then general web search; median if multiple; converted to USD) — see
   schema/products-schema.md "AI价格解析" for the full procedure and the 2026-09-12 decision
   record. `price_source` (internal-only, not published in Schema) notes where each SKU's
   number came from, e.g. "internal:sell_price", "ebay_ref", "web_ref:median_of_4". */

const PRODUCTS = [
  // ---- Siemens ----
  { brand: "Siemens", model: "6ES7212-1AE40-0XB0", series: "S7-1200", cat: "controllers",
    spec: "CPU 1212C DC/DC/DC, 8DI/6DO/2AI, 24VDC, CE/CCC",
    status: "instock", photo: "6ES7212-1AE40-0XB0.jpg", linkedin: "6ES7212-1AE40-0XB0.png", sell_price: 246.1, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- Stage B: rich fields (other 47 products can adopt this template) ---- */
    datasheet: "/datasheets/6ES7212-1AE40-0XB0.pdf",
    specs: [
      ["Order code (MLFB)",  "6ES7212-1AE40-0XB0"],
      ["Product type",        "CPU 1212C"],
      ["Power supply",        "24 V DC (DC/DC/DC)"],
      ["Program memory",      "50 KB (user program, integrated)"],
      ["Data memory",         "2 MB (load memory, integrated)"],
      ["Retentive memory",    "10 KB (battery-free, via NVRAM)"],
      ["Bit memory (M)",      "4096 bytes"],
      ["Counters / Timers",   "Unlimited (limited only by memory)"],
      ["Digital inputs",      "8 × 24 V DC (4 of them HSC up to 100 kHz)"],
      ["Digital outputs",     "6 × 24 V DC transistor, 0.5 A"],
      ["Analog inputs",       "2 × 0–10 V (10-bit)"],
      ["Communication ports", "1 × PROFINET (2-port switch), expandable via CM/CP"],
      ["Programming",         "TIA Portal V13 SP1+, STEP 7 Basic V13+"],
      ["Execution time",      "0.08 µs per bit operation"],
      ["Operating temp.",     "−20 °C … +60 °C horizontal mounting"],
      ["Approvals",           "CE, UL, cUL, FM, RCM, CCC, KC, EAC"],
      ["Dimensions (W×H×D)", "90 × 100 × 75 mm"],
      ["Net weight",          "≈ 310 g"],
      ["Country of origin",   "Germany / China (Siemens official channel)"]
    ],
    applications: [
      { icon: "🏭", title: "Small machine control",
        desc: "Conveyors, packaging lines, mixers, filling machines — replaces relay logic and replaces micro-PLCs in 8–32 I/O class." },
      { icon: "💧", title: "Water & pump stations",
        desc: "Pump sequencing, level control, pressure regulation — built-in PID and retentive memory handle unattended operation after power loss." },
      { icon: "🏢", title: "Building automation",
        desc: "HVAC, lighting, access control — the on-board PROFINET port talks directly to ET 200 remote I/O and HMI without extra modules." },
      { icon: "🧵", title: "Textile & printing machines",
        desc: "High-speed counting via 4 onboard HSC inputs (up to 100 kHz) — direct connection to encoders without extra counters." }
    ],
    compatibility: [
      // type field added 2026-09-17: relationship_type classification (see PartNumber字段级
      // Schema提案.md) applied to these existing, already-verified notes — classifying, not
      // inventing new claims. "same_series"/"cross_reference" unused here since all 4 rows are
      // genuine replacement/compatible candidates, not just same-family cross-references.
      { from: "6ES7212-1AE30-0XB0", type: "direct", note: "Direct predecessor — same firmware, same pin-out, drop-in replacement." },
      { from: "6ES7212-1AE31-0XB0", type: "compatible", note: "Earlier firmware revision — also compatible, same I/O count." },
      { from: "6ES7212-1BE40-0XB0", type: "functional", note: "Different firmware signature — check project; can be migrated via TIA Portal." },
      { from: "6ES7212-1HE40-0XB0", type: "functional", note: "AC/DC/RLY variant — same CPU, only PSU/relay outputs differ. Verify output type before swap." }
    ],
    faq: [
      { q: "What does the order code 6ES7212-1AE40-0XB0 mean?",
        a: "It is a Siemens SIMATIC S7-1200 CPU 1212C with DC/DC/DC power supply, 8 digital inputs, 6 digital outputs and 2 analog inputs, in 24 VDC — supplied with CE and CCC approvals. Fouwell sources this part from official Siemens channels and ships it worldwide with full traceability." },
      { q: "Is this CPU 1212C compatible with Siemens TIA Portal and STEP 7?",
        a: "Yes. The 6ES7212-1AE40-0XB0 is fully supported by Siemens TIA Portal V13 SP1 and later, and by STEP 7 Basic in the same line. Programming, hardware configuration and firmware updates all work the same as other S7-1200 CPUs." },
      { q: "How does the CPU 1212C compare with other S7-1200 models (1211C / 1214C / 1215C / 1217C)?",
        a: "The 1212C sits in the middle of the family: bigger than the 1211C (6DI/4DO/2AI, 30 KB) but smaller than 1214C (14DI/10DO/2AI), 1215C (14DI/10DO/2AI/2AO with 2 PROFINET ports and analog outputs) and 1217C (16DI/16DO with 1 ns bit time). For 8DI/6DO/2AI it gives the best price-per-I/O and leaves expansion room via one SB (signal board) and up to 3 CM (communication) modules." },
      { q: "What are the limits on bit memory, counters, timers and retentive data?",
        a: "Bit memory (M) is 4 KB; counters, timers and function blocks are limited only by program memory (50 KB). Retentive data is 10 KB of non-volatile memory that survives power loss — enough to hold recipes, counters and operator setpoints without a battery. If your project needs more, move up to the 1214C (75 KB program / 10 KB retentive) or 1215C (100 KB / 10 KB)." },
      { q: "What fieldbus and HMI protocols are supported out of the box?",
        a: "The on-board PROFINET interface supports PROFINET IO (controller and device), S7 communication, TCP/IP, ISO-on-TCP, Modbus TCP (via library) and open user comm. Through the RS485 / CM 1241 add-on you get Modbus RTU master/slave, USS and ASCII. PROFINET also natively drives Siemens HMI (KTP / Comfort / Unified) and third-party HMI via the open Ethernet protocol." },
      { q: "How is the unit shipped and how long does delivery take?",
        a: "In-stock units ship within 24 hours via DHL, FedEx or UPS with full insurance. Economy air freight to most Asian / Middle East / European destinations arrives in 3–5 working days; sea freight is available for larger orders. Each box ships in original Siemens packaging with an inspection report." },
      { q: "Do you offer a warranty on this Siemens PLC?",
        a: "Yes. Every Fouwell-supplied Siemens part is 100% genuine, factory-sealed, and backed by a 12-month replacement warranty against manufacturing defects. Warranty does not cover damage from improper installation, lightning, or use outside the official Siemens specifications." },
      { q: "Can you cross-reference an old or hard-to-find S7-1200 part number?",
        a: "Yes. Send your original Siemens part number (e.g. 6ES7212-1AE30-0XB0 or any S7-1200 / S7-1500 / ET 200 code) to info@fouwell.com and our engineers will reply with current availability, alternatives and a price within one business day — usually within an hour during Asia/Shanghai office hours." }
    ]
  },
  { brand: "Siemens", model: "3RM1002-1AA04", series: "SIRIUS 3RM1", cat: "drives", spec: "Solid-state motor starter with overload protection, 0.4–2.0A, 230/400/500V, Made in Germany", status: "instock", photo: "3RM1002-1AA04.jpg", linkedin: "3RM1002-1AA04.png", sell_price: 240.84, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Solid-state motor starter (motor protection + soft on/off)"],
      ["Rated current", "0.4–2.0 A (adjustable)"],
      ["Voltage range", "230/400/500 V"],
      ["Series", "SIRIUS 3RM1"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "🏭", title: "Small motor soft protection",
        desc: "Overload and short-circuit protection plus soft start/stop for small 3-phase motors where a full VFD isn't needed." },
      { icon: "🔧", title: "Relay panel replacement",
        desc: "Direct swap for older contactor+overload-relay combinations in a single compact SIRIUS 3RM1 unit." }
    ],
    faq: [
      { q: "What does the 3RM1002-1AA04 do that a regular contactor doesn't?",
        a: "It combines motor protection (overload/short-circuit) and soft start/stop electronics in one solid-state unit, covering a 0.4-2.0A adjustable range across 230/400/500V — no separate overload relay needed." },
      { q: "Is this in stock and genuine Siemens?",
        a: "Yes, in stock and 100% genuine, sourced through official Siemens channels, 100% inspected before shipping." },
      { q: "Can you cross-reference an older SIRIUS 3RM model?",
        a: "Send your exact part number to info@fouwell.com and our engineers will confirm the current equivalent within one business day." }
    ]
  },

  // ---- Schneider ----
  { brand: "Schneider", model: "ATV12HU15M2", series: "Altivar 12", cat: "drives", spec: "1.5kW inverter, single-phase 200–240V input, 3-phase output, 7.5A", status: "instock", photo: "ATV12HU15M2.jpg", linkedin: "ATV12HU15M2.png", sell_price: 215.66, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "1.5 kW"],
      ["Input", "Single-phase 200–240 V"],
      ["Output", "3-phase"],
      ["Rated current", "7.5 A"],
      ["Series", "Altivar 12"]
    ],
    applications: [
      { icon: "⚙️", title: "Single-phase-to-3-phase motor retrofit",
        desc: "Runs an existing 3-phase motor from a single-phase 200-240V supply — common in sites without 3-phase power available." },
      { icon: "🏭", title: "Small machine speed control",
        desc: "Compact micro-drive for conveyors, small pumps and fans up to 1.5kW where a simple ramp/speed control is all that's needed." }
    ],
    faq: [
      { q: "Can the ATV12HU15M2 run on single-phase input and still drive a 3-phase motor?",
        a: "Yes — that's exactly what the Altivar 12 series is built for: single-phase 200-240V in, full 3-phase output, up to 1.5kW / 7.5A on this model." },
      { q: "Is this in stock, and how fast does it ship?",
        a: "Yes, in stock — ships within 24 hours via DHL/FedEx/UPS, 3-5 working days air freight to most destinations." },
      { q: "Do you offer a warranty?",
        a: "Yes, every genuine Schneider unit we supply carries a 12-month replacement warranty against manufacturing defects." }
    ]
  },
  { brand: "Schneider", model: "LT3-SA00M", series: "LT3SA (Telemecanique)", cat: "spares", spec: "PTC thermistor motor protection relay, 115/230V dual voltage, 2 relay outputs, Made in France", status: "instock", photo: "LT3-SA00M.jpg", linkedin: "LT3-SA00M.png", sell_price: 267.66, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "PTC thermistor motor protection relay"],
      ["Voltage", "115/230 V dual voltage"],
      ["Outputs", "2 relay outputs"],
      ["Origin", "France"],
      ["Series", "LT3SA"]
    ],
    applications: [
      { icon: "🏭", title: "Motor thermal protection",
        desc: "PTC thermistor-based relay trips on motor winding temperature directly (via embedded PTC sensors in the motor), catching thermal faults a standard overload relay based on current alone can miss." }
    ],
    faq: [
      { q: "Does the LT3-SA00M need a PTC sensor embedded in the motor to work?",
        a: "Yes — it monitors PTC thermistor sensors embedded in the motor windings, so the motor needs to have PTC sensors wired out to use this relay's thermal protection function." },
      { q: "Is this genuine Telemecanique and in stock?",
        a: "Yes, in stock, genuine Telemecanique (Schneider Electric brand), ships within 24 hours." }
    ]
  },

  // ---- Mitsubishi ----
  { brand: "Mitsubishi", model: "FR-D740-050-EC", series: "FR-D700", cat: "drives", spec: "2.2kW inverter, 3-phase 400V, 5.0A, CE certified", status: "instock", photo: null, linkedin: "FR-D740-050-EC.png", sell_price: 739.98, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "2.2 kW"],
      ["Input/Output", "3-phase 400 V"],
      ["Rated current", "5.0 A"],
      ["Series", "FR-D700"],
      ["Certification", "CE"]
    ],
    applications: [
      { icon: "🏭", title: "Compact machine control",
        desc: "FR-D700 is Mitsubishi's compact general-purpose inverter line — fans, pumps and small conveyors where panel space is tight." },
      { icon: "🔁", title: "Retrofit of older FR-E/FR-D series drives",
        desc: "Common upgrade path for machines still running earlier-generation Mitsubishi compact inverters." }
    ],
    faq: [
      { q: "What's the rated capacity of the FR-D740-050-EC?",
        a: "2.2kW, 3-phase 400V input/output, 5.0A rated current, CE certified." },
      { q: "Is this genuine Mitsubishi and currently in production?",
        a: "Yes, genuine Mitsubishi stock, in production, sourced through official channels with full traceability." },
      { q: "Can you help cross-reference an older FR-E700 or FR-D700 part number?",
        a: "Yes — send your exact part number and our engineers will confirm the current equivalent, availability and price within one business day." }
    ]
  },
  { brand: "Mitsubishi", model: "FR-A740-7.5K", series: "FR-A700", cat: "drives", spec: "7.5kW inverter, 3-phase 400V, vector control", status: "discont", photo: null, linkedin: "FR-A740-7.5K.png", sell_price: 789.17, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "7.5 kW"],
      ["Input/Output", "3-phase 400 V"],
      ["Control", "Vector control"],
      ["Series", "FR-A700"],
      ["Lifecycle", "Discontinued — replaced by FR-A840-7.5K (FR-A800 series)"]
    ],
    applications: [
      { icon: "🔧", title: "Legacy machine maintenance",
        desc: "Sourced as spare/replacement stock to keep existing FR-A700-based machines running until a planned upgrade." }
    ],
    faq: [
      { q: "Is the FR-A740-7.5K still available, and what replaces it?",
        a: "The FR-A700 series has been discontinued by Mitsubishi and replaced by the FR-A800 series — the FR-A840-7.5K is the confirmed direct replacement, also available from Fouwell. We can still help source remaining FR-A740-7.5K stock where available." },
      { q: "Can I drop in the FR-A840-7.5K instead of repairing an FR-A740-7.5K?",
        a: "In most cases yes for the power/voltage rating, but parameter sets and terminal wiring differ between FR-A700 and FR-A800 — confirm your specific application with our engineers before swapping." }
    ],
    compatibility: [
      { from: "FR-A740-7.5K", type: "successor", note: "Discontinued — FR-A840-7.5K (FR-A800 series) is Mitsubishi's confirmed direct replacement for this power rating, also in Fouwell's current stock." }
    ]
  },
  { brand: "Mitsubishi", model: "FR-A840-7.5K", series: "FR-A800", cat: "drives", spec: "7.5kW — direct replacement for FR-A740-7.5K", status: "instock", photo: null, linkedin: "FR-A740-7.5K.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "7.5 kW"],
      ["Series", "FR-A800"],
      ["Role", "Direct replacement for FR-A740-7.5K (FR-A700 series, discontinued)"]
    ],
    applications: [
      { icon: "🏭", title: "Vector-control machine drives",
        desc: "General-purpose vector-control inverter for machines needing precise torque/speed control at the 7.5kW class." },
      { icon: "🔁", title: "FR-A700 fleet upgrade",
        desc: "Standard replacement path for sites migrating existing FR-A700-series installations to current-production FR-A800." }
    ],
    faq: [
      { q: "Is the FR-A840-7.5K a direct replacement for the FR-A740-7.5K?",
        a: "Yes — it's Mitsubishi's current-production replacement at the same 7.5kW rating for the discontinued FR-A700 series. Confirm parameter/wiring differences with our engineers before swapping into an existing installation." },
      { q: "Is this in stock and genuine Mitsubishi?",
        a: "Yes, in stock, genuine Mitsubishi, 100% inspected before shipping, ships within 24 hours." }
    ],
    compatibility: [
      { from: "FR-A740-7.5K", type: "successor", note: "This unit is the confirmed current-production replacement for the discontinued FR-A740-7.5K (FR-A700 series) at the same 7.5kW rating." }
    ]
  },
  { brand: "Mitsubishi", model: "MR-J3-60B", series: "MELSERVO-J3", cat: "servo", spec: "600W servo amplifier, 200–230V input, Japan original", status: "legacy", photo: "MR-J3-60B.jpg", linkedin: "MR-J3-60B.png", sell_price: 251.58, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "600 W"],
      ["Input voltage", "200–230 V"],
      ["Series", "MELSERVO-J3"],
      ["Origin", "Japan (original)"],
      ["Lifecycle", "Legacy line, no longer in regular production"]
    ],
    applications: [
      { icon: "🛠️", title: "Legacy machine tool / packaging axis maintenance",
        desc: "MELSERVO-J3 was Mitsubishi's standard servo generation on machines built through the 2000s-2010s — keeps an existing axis running without a drive/motor redesign." }
    ],
    faq: [
      { q: "Is the MR-J3-60B still in regular production?",
        a: "No — this is a MELSERVO-J3 legacy line. Fouwell sources it through existing stock and our supplier network; lead time is typically longer than an in-stock item, so confirm current availability before you commit a repair schedule to it." },
      { q: "What's the current-generation Mitsubishi servo equivalent?",
        a: "Mitsubishi's current line is MELSERVO-J5 (with J4 as an intermediate generation) — there's no single confirmed drop-in replacement for the MR-J3-60B on file, since motor flange/shaft/encoder and drive pairing all need to match. Send your full nameplate details and we'll check current options rather than guess at a cross-reference." },
      { q: "Is this genuine Mitsubishi?",
        a: "Yes, sourced as original Japan-made Mitsubishi stock, 100% inspected before shipping." }
    ]
  },

  // ---- OMRON ----
  { brand: "OMRON", model: "NS10-TV01B-V2", series: "NS10", cat: "hmi",
    spec: "10.4\" TFT touchscreen, 640×480, RS-232/422/485 + Ethernet, IP65, Japan original",
    status: "instock", photo: "NS10-TV01B-V2.jpg", linkedin: "NS10-TV01B-V2.png", sell_price: 892.45, sell_price_currency: "USD", price_source: "ebay_ref",
    specs: [
      ["Order code",           "NS10-TV01B-V2"],
      ["Product type",         "NS10-series HMI touch panel"],
      ["Display",              "10.4\" TFT color touchscreen, 640×480 (VGA)"],
      ["Communication",        "RS-232/RS-422/RS-485 serial (Host Link/NT Link) + Ethernet"],
      ["Programming software", "OMRON CX-Designer"],
      ["Enclosure rating",     "IP65 front panel"],
      ["Compatible controllers", "OMRON CS/CJ/CP1-series PLCs via serial or Ethernet; other brands via standard protocols where supported"],
      ["Product line position", "NS-series — OMRON's HMI line prior to the current NA-series"],
      ["Country of origin",    "Japan (OMRON official channel)"]
    ],
    applications: [
      { icon: "🖥️", title: "Machine operator interface",
        desc: "Standard operator panel for status display, alarm handling and manual control on production machines using OMRON CS/CJ/CP1 controllers." },
      { icon: "🏭", title: "Retrofit of legacy OMRON control panels",
        desc: "Common replacement part for panels originally built around the NS-series when the PLC side stays on CS/CJ/CP1 and only the HMI needs replacing." },
      { icon: "📊", title: "Process monitoring & recipe screens",
        desc: "640×480 resolution and Ethernet connectivity support multi-screen recipe management and trend/alarm display for small-to-mid process lines." }
    ],
    compatibility: [
      { from: "NS10-TV00B / earlier NS10 hardware revisions", note: "Same NS10 form factor and mounting cutout — confirm firmware/CX-Designer project compatibility before swapping." },
      { from: "OMRON NA-series (current HMI line)", note: "NA-series is OMRON's current-generation HMI and isn't a drop-in replacement (different mounting, different software — Sysmac Studio/NA-Designer instead of CX-Designer). Treat it as a planned upgrade, not a direct swap." }
    ],
    faq: [
      { q: "What does NS10-TV01B-V2 mean, and what size screen is it?",
        a: "It's an OMRON NS-series HMI with a 10.4-inch TFT color touchscreen at 640×480 resolution, IP65-rated front panel, with serial (RS-232/422/485) and Ethernet communication." },
      { q: "What software do I need to program this HMI?",
        a: "OMRON CX-Designer — the official screen-editing software for the NS-series. If you don't have an existing project file for your machine, we can help confirm what's needed based on your PLC model." },
      { q: "Which PLCs does the NS10-TV01B-V2 connect to?",
        a: "It's designed for OMRON's CS/CJ/CP1-series PLCs over serial (Host Link/NT Link) or Ethernet. Connection to other brands' PLCs is possible where a supported protocol driver exists in CX-Designer — tell us your PLC model and we'll confirm." },
      { q: "Is there a current-generation replacement for the NS-series?",
        a: "Yes — OMRON's current HMI line is the NA-series, but it isn't a drop-in swap (different mounting cutout and different programming software). If you're planning a longer-term upgrade rather than an urgent repair, ask us about migration options." },
      { q: "Is the NS10-TV01B-V2 in stock and how fast can it ship?",
        a: "Yes, this is an in-stock item — it ships within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations." },
      { q: "Do you offer a warranty on this HMI?",
        a: "Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty doesn't cover damage from improper installation, incorrect wiring/voltage, or use outside OMRON's official specifications." },
      { q: "Can you help cross-reference an older or discontinued OMRON HMI?",
        a: "Yes. Send your exact original part number to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day." }
    ]
  },
  { brand: "OMRON", model: "3G3MX2-AB002-V1", series: "MX2", cat: "drives", spec: "0.2kW compact inverter, single-phase 200V", status: "discont", photo: null, linkedin: "3G3MX2-AB002-V1.png", sell_price: 671.0, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "0.2 kW"],
      ["Input", "Single-phase 200 V"],
      ["Series", "MX2"],
      ["Lifecycle", "Discontinued — replaced by 3G3MX2-AB002-V2 (identical specifications)"]
    ],
    applications: [
      { icon: "🔧", title: "Legacy machine maintenance",
        desc: "Sourced as spare stock for existing MX2-based small machines until a planned upgrade to V2." }
    ],
    faq: [
      { q: "Is the 3G3MX2-AB002-V1 still available?",
        a: "It's been discontinued and replaced by the 3G3MX2-AB002-V2, which has identical specifications and is a drop-in swap. We can still help source remaining V1 stock where available, or supply the V2 directly." }
    ],
    compatibility: [
      { from: "3G3MX2-AB002-V1", type: "direct", note: "3G3MX2-AB002-V2 has identical specifications and is a confirmed drop-in replacement for this discontinued model." }
    ]
  },
  { brand: "OMRON", model: "3G3MX2-AB002-V2", series: "MX2", cat: "drives", spec: "0.2kW — V1 replacement, identical specifications", status: "instock", photo: null, linkedin: "3G3MX2-AB002-V1.png", sell_price: 345.0, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "0.2 kW"],
      ["Input", "Single-phase 200 V"],
      ["Series", "MX2"],
      ["Role", "Direct replacement for 3G3MX2-AB002-V1, identical specifications"]
    ],
    applications: [
      { icon: "🏭", title: "Compact single-phase machine control",
        desc: "OMRON MX2 series micro-inverter for small conveyors, fans and simple single-axis machines." }
    ],
    faq: [
      { q: "Is the 3G3MX2-AB002-V2 a drop-in replacement for the V1?",
        a: "Yes — identical specifications, direct swap for the discontinued 3G3MX2-AB002-V1." },
      { q: "Is this in stock and genuine OMRON?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ],
    compatibility: [
      { from: "3G3MX2-AB002-V1", type: "direct", note: "This unit has identical specifications to the discontinued V1 and is a confirmed drop-in replacement." }
    ]
  },
  { brand: "OMRON", model: "R88M-KE75030H", series: "Accurax G5", cat: "servo", spec: "750W servo motor, 2.4N·m, 3000r/min, 3φAC120V, IP67, CE/UL", status: "instock", photo: "R88M-KE75030H.jpg", linkedin: "R88M-KE75030H.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "750 W"],
      ["Rated torque", "2.4 N·m"],
      ["Rated speed", "3000 r/min"],
      ["Voltage", "3φ AC 120 V"],
      ["Protection", "IP67"],
      ["Certification", "CE/UL"],
      ["Series", "Accurax G5"]
    ],
    applications: [
      { icon: "🤖", title: "Compact axis servo drives",
        desc: "IP67-rated Accurax G5 motor for washdown-tolerant or exposed-mounting axes in packaging and assembly equipment." },
      { icon: "🏭", title: "Machine tool and pick-and-place axes",
        desc: "750W/2.4N·m class servo for small-to-mid precision positioning axes." }
    ],
    faq: [
      { q: "Is the R88M-KE75030H IP67 rated for washdown environments?",
        a: "Yes, IP67-rated motor housing — suitable for exposed or washdown-prone mounting locations typical in food/packaging machinery, subject to correct cable gland/connector installation." },
      { q: "What OMRON drive does this motor pair with?",
        a: "Accurax G5 motors pair with Accurax G5-series servo drives — confirm your exact drive model and cable configuration with us before ordering." },
      { q: "Is this in stock and genuine OMRON?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  },
  { brand: "OMRON", model: "R88D-KN08H-ECT", series: "Accurax G5", cat: "servo",
    spec: "750W servo drive, 200–240VAC, EtherCAT, matches R88M-KE75030H, CE/UL/TUV",
    status: "instock", photo: "R88D-KN08H-ECT.jpg", linkedin: "R88D-KN08H-ECT.png", sell_price: 241.39, sell_price_currency: "USD", price_source: "ebay_ref",
    specs: [
      ["Order code",              "R88D-KN08H-ECT"],
      ["Product type",            "Accurax G5 servo drive (EtherCAT)"],
      ["Power supply",            "200–240 VAC, single/3-phase"],
      ["Rated output",            "750 W"],
      ["Communication",           "EtherCAT (CiA402 drive profile)"],
      ["Control modes",           "Position / speed / torque control"],
      ["Matching motor",          "OMRON R88M-KE75030H (750W, 3000 r/min) — also in our catalog"],
      ["Programming software",    "CX-Drive for drive-level setup/tuning; Sysmac Studio when paired with an NJ/NX machine controller"],
      ["Certifications",         "CE, UL, TÜV"],
      ["Country of origin",       "Japan (OMRON official channel)"]
    ],
    applications: [
      { icon: "🤖", title: "Pick-and-place & assembly",
        desc: "EtherCAT's deterministic cycle time makes the G5 a common choice for multi-axis pick-and-place cells and small assembly robots." },
      { icon: "📦", title: "Packaging & labeling machines",
        desc: "Precise position control keeps indexing, cutting and labeling stations synchronized to line speed." },
      { icon: "🏭", title: "CNC & dedicated machine axes",
        desc: "750W class output suits light-duty axis drives on dedicated machines where a full CNC servo package isn't needed." },
      { icon: "🔧", title: "Retrofit of older OMRON servo lines",
        desc: "A common upgrade path when replacing older non-EtherCAT OMRON servo systems that need to join a networked control architecture." }
    ],
    compatibility: [
      { from: "R88M-KE75030H", note: "Matched OMRON Accurax G5 motor for this drive — same catalog, sold separately. Confirm the cable/connector kit when ordering both." },
      { from: "Older non-EtherCAT Accurax G5 (pulse/analog interface)", note: "Same G5 motor family but a different communication interface — check your controller's network before treating this as a drop-in replacement." },
      { from: "Discontinued OMRON G-series (pre-Accurax)", note: "Different generation, different connectors/cabling — send your exact original part number and we'll confirm true compatibility rather than going by series name alone." }
    ],
    faq: [
      { q: "What does the order code R88D-KN08H-ECT mean?",
        a: "It's an OMRON Accurax G5 servo drive rated for 750W output, 200–240VAC single/3-phase supply, with an EtherCAT (ECT) communication interface — the direct drive-side match for the R88M-KE75030H servo motor also in our catalog." },
      { q: "Does the R88D-KN08H-ECT need a specific OMRON motor, or does it work with any servo motor?",
        a: "Accurax G5 drives are matched to specific OMRON Accurax G5 motors — this drive is rated for the R88M-KE75030H (750W). It isn't designed to run third-party servo motors; if you need a different power rating, tell us the application and we can match the correct drive+motor pair." },
      { q: "What controllers and software work with this EtherCAT drive?",
        a: "Any EtherCAT master supporting the CiA402 drive profile can control it. On the OMRON side that's typically an NJ/NX-series machine controller programmed in Sysmac Studio, or a CJ/CS controller with an EtherCAT master unit. CX-Drive is used for drive-level parameter setup and tuning." },
      { q: "Is the R88D-KN08H-ECT in stock and how fast can it ship?",
        a: "Yes, this is an in-stock item — it ships within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations." },
      { q: "Do you offer a warranty on this servo drive?",
        a: "Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty doesn't cover damage from improper installation, incorrect wiring/voltage, or use outside OMRON's official specifications." },
      { q: "Can you help cross-reference an older or discontinued OMRON servo drive?",
        a: "Yes. Send your exact original part number to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day." },
      { q: "How is it shipped internationally?",
        a: "Worldwide via DHL, FedEx, UPS (air) or sea freight for larger orders, with full insurance and original OMRON packaging. We also maintain an HK warehouse for faster regional consolidation on some orders." }
    ]
  },
  { brand: "OMRON", model: "E5AC-QR4D5M-000", series: "E5AC", cat: "sensors", spec: "Digital temperature controller, 96×96mm, 4 auxiliary outputs, 24VAC/VDC", status: "instock", photo: null, linkedin: "E5AC-QR4D5M-000.png",
    sell_price: 216.38, sell_price_currency: "USD", price_source: "ebay_ref",
    specs: [
      ["Type", "Digital temperature controller"],
      ["Panel cutout", "96×96 mm"],
      ["Auxiliary outputs", "4"],
      ["Power", "24VAC/VDC"],
      ["Series", "E5AC"]
    ],
    applications: [
      { icon: "🌡️", title: "Process temperature control",
        desc: "96×96mm panel-mount PID temperature controller with 4 auxiliary outputs for alarm/event signalling alongside the main control loop." }
    ],
    faq: [
      { q: "What do the 4 auxiliary outputs on the E5AC-QR4D5M-000 do?",
        a: "They're configurable for alarm/event signalling (e.g. high/low temperature alarms) separate from the main control output — confirm your exact wiring plan against the OMRON E5AC manual." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  },

  // ---- Yaskawa ----
  { brand: "Yaskawa", model: "CIMR-VB4A0038FBA", series: "V1000", cat: "drives", spec: "18.5kW(ND)/15kW(HD) inverter, 3-phase 380V", status: "legacy", photo: null, linkedin: "CIMR-VB4A0038FBA.png", sell_price: 698.28, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "18.5 kW (ND) / 15 kW (HD)"],
      ["Input", "3-phase 380 V"],
      ["Series", "V1000"],
      ["Lifecycle", "Legacy — replaced by GA50C4038EBA (GA500 series)"]
    ],
    applications: [
      { icon: "🔧", title: "Legacy machine maintenance",
        desc: "Sourced through Fouwell's stock and supplier network to keep existing V1000-based machines running." }
    ],
    faq: [
      { q: "Is the CIMR-VB4A0038FBA still available, and is there a current-production option?",
        a: "This is a Yaskawa V1000-series legacy line, no longer in regular production. The GA50C4038EBA (GA500 series) is Yaskawa's confirmed replacement at the same power rating, also available from Fouwell. Lead time on the legacy V1000 unit is typically longer than an in-stock item — confirm current availability with us first." }
    ],
    compatibility: [
      { from: "CIMR-VB4A0038FBA", type: "successor", note: "GA50C4038EBA (GA500 series) is Yaskawa's confirmed replacement at the same power rating." }
    ]
  },
  { brand: "Yaskawa", model: "GA50C4038EBA", series: "GA500", cat: "drives", spec: "18.5kW(ND)/15kW(HD) — V1000 replacement", status: "instock", photo: null, linkedin: "CIMR-VB4A0038FBA.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "18.5 kW (ND) / 15 kW (HD)"],
      ["Series", "GA500"],
      ["Role", "Replacement for V1000 CIMR-VB4A0038FBA"]
    ],
    applications: [
      { icon: "🏭", title: "General-purpose machine drives",
        desc: "Yaskawa's current compact general-purpose inverter line, covering the same power classes as the legacy V1000 series." },
      { icon: "🔁", title: "V1000 fleet upgrade",
        desc: "Standard replacement path for sites migrating existing V1000 installations to current-production GA500." }
    ],
    faq: [
      { q: "Is the GA50C4038EBA a replacement for the V1000 CIMR-VB4A0038FBA?",
        a: "Yes — same power rating (18.5kW ND / 15kW HD), Yaskawa's current-production GA500-series equivalent." },
      { q: "Is this in stock and genuine Yaskawa?",
        a: "Yes, in stock, genuine Yaskawa, ships within 24 hours." }
    ],
    compatibility: [
      { from: "CIMR-VB4A0038FBA", type: "successor", note: "This unit is Yaskawa's confirmed replacement for the legacy V1000-series CIMR-VB4A0038FBA at the same power rating." }
    ]
  },
  { brand: "Yaskawa", model: "CIPR-GA70D4038ABMA-AAAABA", series: "GA700", cat: "drives", spec: "18.5kW HD / 22kW ND inverter, 3-phase 400V, built-in EMC filter", status: "instock", photo: null, linkedin: "CIPR-GA70D4038ABMA-AAAABA.png", sell_price: 1950.0, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "18.5 kW HD / 22 kW ND"],
      ["Input", "3-phase 400 V"],
      ["Series", "GA700"],
      ["EMC", "Built-in EMC filter"]
    ],
    applications: [
      { icon: "🏭", title: "High-performance machine drives",
        desc: "GA700 is Yaskawa's high-function drive line — applications needing tighter speed/torque control than the general-purpose GA500 line provides." },
      { icon: "🔌", title: "EMC-sensitive installations",
        desc: "Built-in EMC filter simplifies compliance in panels with sensitive nearby electronics, without adding an external filter module." }
    ],
    faq: [
      { q: "What's the difference between the GA700 and GA500 series?",
        a: "GA700 is Yaskawa's higher-function drive line with more advanced control modes and a built-in EMC filter, versus GA500's general-purpose positioning — check your application's control requirements to confirm which series fits." },
      { q: "Is this in stock and genuine Yaskawa?",
        a: "Yes, in stock, genuine Yaskawa, ships within 24 hours." }
    ]
  },
  { brand: "Yaskawa", model: "CIMR-AB4A0011FBA", series: "A1000", cat: "drives",
    spec: "5.5kW(ND)/3.7kW(HD) inverter, 3-phase 400V, open/closed-loop vector control",
    status: "instock", photo: "CIMR-AB4A0011FBA.jpg", linkedin: "CIMR-AB4A0011FBA.png", sell_price: 648.0, sell_price_currency: "USD", price_source: "ebay_ref",
    specs: [
      ["Order code",           "CIMR-AB4A0011FBA"],
      ["Product type",         "Yaskawa A1000 vector AC drive"],
      ["Rated capacity",       "5.5 kW Normal Duty / 3.7 kW Heavy Duty"],
      ["Input/output",         "3-phase, 380–480V class"],
      ["Control modes",        "V/f, open-loop vector, closed-loop vector (with PG feedback option card)"],
      ["Communication",        "Built-in Modbus RTU; optional cards for EtherNet/IP, PROFIBUS-DP, DeviceNet, CC-Link"],
      ["Programming/monitoring", "Yaskawa DriveWizard software, or the LCD digital operator with a copy function"],
      ["Product line position", "A1000 is Yaskawa's flagship vector-control drive line, successor to the earlier F7/G7 series"],
      ["Country of origin",    "Japan (Yaskawa official channel)"]
    ],
    applications: [
      { icon: "🌀", title: "Pumps & fans (HVAC, water treatment)",
        desc: "Vector control with a wide speed range suits variable-torque pump/fan loads as well as constant-torque duty." },
      { icon: "🏗️", title: "Conveyors & material handling",
        desc: "Open-loop vector control gives strong starting torque for belt/roller conveyors without added encoder hardware." },
      { icon: "🧵", title: "Extrusion & winding lines",
        desc: "Closed-loop vector mode (with a PG feedback card) supports tension-control applications common in extrusion, winding and unwinding lines." },
      { icon: "⚙️", title: "Machine-tool spindle & auxiliary drives",
        desc: "5.5kW/3.7kW class fits auxiliary spindle drives and mid-size machine-tool axes where full servo control isn't required." }
    ],
    compatibility: [
      { from: "Yaskawa F7 / G7 series (predecessor lines)", note: "A1000 is the direct successor to Yaskawa's older F7 (fan/pump) and G7 (general vector) drives — same-power-class parts are usually a straightforward panel-wiring swap, but confirm the terminal layout before replacing." },
      { from: "Yaskawa GA700 (current-generation replacement)", note: "For a new installation rather than replacing an existing A1000, Yaskawa's current flagship vector drive is the GA700 — we also stock CIPR-GA70D4038ABMA-AAAABA in a comparable power class." },
      { from: "Different voltage/power variant of CIMR-AB", note: "Same A1000 family but a different kW rating or voltage class — send your nameplate details and we'll confirm the exact cross-reference." }
    ],
    faq: [
      { q: "What does the order code CIMR-AB4A0011FBA mean?",
        a: "It identifies a Yaskawa A1000-series vector AC drive rated 5.5kW Normal Duty / 3.7kW Heavy Duty, for 3-phase 380–480V input — Yaskawa's flagship vector-control drive line." },
      { q: "What control modes does the A1000 support?",
        a: "V/f (basic), open-loop vector (higher starting torque without feedback hardware), and closed-loop vector with a PG feedback option card for the tightest speed regulation — selectable in the drive's parameters." },
      { q: "Does this drive need special software to program, or can it be set up from the keypad?",
        a: "Both. Every parameter can be set from the built-in LCD digital operator, including a copy function to clone settings across multiple drives. Yaskawa's free DriveWizard software adds graphing, more detailed parameter descriptions and PC-based backup." },
      { q: "Is there a newer Yaskawa drive that replaces the A1000?",
        a: "Yaskawa's current-generation flagship vector drive is the GA700, which we also stock (CIPR-GA70D4038ABMA-AAAABA). The A1000 is still a fully supported active line — we can help you decide between staying with A1000 for parts commonality or moving to GA700 for new installations." },
      { q: "Is the CIMR-AB4A0011FBA in stock and how fast can it ship?",
        a: "Yes, this is an in-stock item — it ships within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations." },
      { q: "Do you offer a warranty on this drive?",
        a: "Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty doesn't cover damage from improper installation, incorrect wiring/voltage, or use outside Yaskawa's official specifications." },
      { q: "Can you help cross-reference an older or discontinued Yaskawa drive?",
        a: "Yes. Send your exact original part number to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day." }
    ]
  },
  { brand: "Yaskawa", model: "SGM7J-08A6A6C", series: "Sigma-7", cat: "servo", spec: "750W servo motor, 200V, 24-bit absolute encoder, with brake, IP67", status: "instock", photo: null, linkedin: "SGM7J-08A6A6C.png", sell_price: 368.79, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "750 W"],
      ["Voltage", "200 V"],
      ["Encoder", "24-bit absolute"],
      ["Brake", "Built-in"],
      ["Protection", "IP67"],
      ["Series", "Sigma-7"]
    ],
    applications: [
      { icon: "🤖", title: "High-precision positioning axes",
        desc: "24-bit absolute encoder eliminates homing-on-power-up — used where axes must retain absolute position through a power cycle (vertical axes especially benefit from the built-in brake)." },
      { icon: "🏭", title: "Current-generation machine builds",
        desc: "Sigma-7 is Yaskawa's current servo generation — the standard choice for new machine designs rather than a legacy replacement." }
    ],
    faq: [
      { q: "Does the SGM7J-08A6A6C need to be homed after every power-up?",
        a: "No — it has a 24-bit absolute encoder, so position is retained through a power cycle as long as the battery-backed absolute data is maintained, unlike an incremental-encoder motor that needs re-homing." },
      { q: "What Yaskawa drive pairs with this motor?",
        a: "Sigma-7 motors pair with Sigma-7-series (SGD7S/SGD7W) servo drives — confirm your exact drive model with us before ordering." },
      { q: "Is this in stock and genuine Yaskawa?",
        a: "Yes, in stock, genuine Yaskawa, ships within 24 hours." }
    ]
  },
  { brand: "Yaskawa", model: "SGMAH-04ADA-TF13", series: "Sigma-II", cat: "servo", spec: "400W servo motor, 200V, 2.6A, 1.27N·m, 3000r/min, Japan original legacy spare", status: "legacy", photo: "SGMAH-04ADA-TF13.jpg", linkedin: "SGMAH-04ADA-TF13.png", sell_price: 1005.27, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-17: same Tier C -> Tier B enrichment as 6EP3437-8SB00-0AY0, second example
       covering a different brand/category (Yaskawa servo vs Siemens power supply) and a
       different lifecycle status (legacy). No specific successor model number is claimed —
       Sigma-II has no single confirmed 1:1 replacement on file, and inventing one would be
       exactly the "AI invented replacement" case the field schema's AI Permission Level rules
       forbid (see wiki/seo-geo/PartNumber字段级Schema提案.md §79). ---- */
    specs: [
      ["Series", "Sigma-II (Yaskawa)"],
      ["Rated output", "400 W"],
      ["Rated voltage", "200 V"],
      ["Rated current", "2.6 A"],
      ["Rated torque", "1.27 N·m"],
      ["Rated speed", "3000 r/min"],
      ["Origin", "Japan (original)"]
    ],
    applications: [
      { icon: "🛠️", title: "Legacy machine tool / CNC axis maintenance",
        desc: "Sigma-II was Yaskawa's standard servo generation on machine tools and pick-and-place equipment built through the 2000s–early 2010s — this keeps an existing axis running without a drive/motor redesign." },
      { icon: "📦", title: "Packaging & converting machinery",
        desc: "Small/mid-torque indexing and web-handling axes on packaging lines built around Sigma-II hardware." },
      { icon: "🤖", title: "Assembly line retrofits",
        desc: "Direct swap for a failed Sigma-II axis in an existing line, avoiding a full drive/motor/cable re-engineering job." }
    ],
    faq: [
      { q: "Is the SGMAH-04ADA-TF13 still in regular production?",
        a: "No — this is a Sigma-II legacy line, no longer in regular Yaskawa production. Fouwell sources it through existing stock and our supplier network; lead time is typically longer than an in-stock item, so confirm current availability before you commit a repair schedule to it." },
      { q: "What Yaskawa drive does this motor pair with?",
        a: "Sigma-II motors like the SGMAH series are designed to pair with Sigma-II generation drives (SGDM/SGDH series). Confirm your exact drive model and cable/connector configuration with us before ordering — Sigma-II motor/drive/cable combinations are model-specific." },
      { q: "Is there a current-generation replacement if I can't find a Sigma-II unit?",
        a: "Yaskawa's current servo generation is Sigma-7, but there is no single confirmed drop-in replacement for the SGMAH-04ADA-TF13 on file — flange size, shaft, brake and connector configuration all need to match. Send us your full nameplate details and we'll check current options rather than guess at a cross-reference." },
      { q: "Does this include the encoder cable and connector?",
        a: "Motor only unless otherwise agreed — confirm what you need (cable, connector, brake wiring) when you request a quote so we can quote the full set correctly." },
      { q: "Is this genuine Yaskawa, and how is it shipped?",
        a: "Yes, sourced as original Japan-made Yaskawa stock. Ships within 24 hours if in stock, otherwise per the lead time confirmed at quote, via DHL/FedEx/UPS with full insurance and original packaging." }
    ]
  },

  // ---- Allen-Bradley ----
  { brand: "Allen-Bradley", model: "2097-V34PR6-LM", series: "Kinetix 350", cat: "servo", spec: "Single-axis servo drive, 400/480VAC, 6.0A, STO CAT.3/D, EtherNet/IP, USA original", status: "instock", photo: "2097-V34PR6-LM.jpg", linkedin: "2097-V34PR6-LM.png", sell_price: 1911.68, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Single-axis servo drive"],
      ["Voltage", "400/480 VAC"],
      ["Rated current", "6.0 A"],
      ["Safety", "STO CAT.3/D"],
      ["Network", "EtherNet/IP"],
      ["Series", "Kinetix 350"],
      ["Origin", "USA (original)"]
    ],
    applications: [
      { icon: "🤖", title: "EtherNet/IP machine control integration",
        desc: "Kinetix 350 integrates directly into a Rockwell/Allen-Bradley EtherNet/IP control architecture — common where the rest of the line already runs Logix controllers." },
      { icon: "🛡️", title: "Safety-rated axes",
        desc: "Built-in STO (Safe Torque Off) to CAT.3/D lets the axis participate in a machine safety circuit without an external safety relay for torque removal." }
    ],
    faq: [
      { q: "What does STO CAT.3/D mean on the 2097-V34PR6-LM?",
        a: "Safe Torque Off certified to Category 3 / Performance Level D under ISO 13849 — the drive can safely remove motor torque as part of a machine safety circuit without external contactors." },
      { q: "Does this need a Logix controller to run?",
        a: "Kinetix 350 communicates over EtherNet/IP and is designed to integrate with Rockwell Automation Logix-family controllers — confirm your control architecture with us if you're unsure it fits." },
      { q: "Is this in stock and genuine Allen-Bradley?",
        a: "Yes, in stock, genuine Allen-Bradley, sourced through official channels, ships within 24 hours." }
    ]
  },
  { brand: "Allen-Bradley", model: "150-C30NBD", series: "SMC-3", cat: "drives", spec: "Soft starter, 30A (3-wire)/51A (Delta), 3-phase 200–480V", status: "instock", photo: "150-C30NBD.jpg", linkedin: "150-C30NBD.png", sell_price: 402.36, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated current", "30A (3-wire) / 51A (Delta)"],
      ["Voltage", "3-phase 200-480V"],
      ["Type", "Soft starter"],
      ["Series", "SMC-3"],
      ["Origin", "USA (original)"]
    ],
    applications: [
      { icon: "🏭", title: "Motor soft start/stop",
        desc: "Reduces inrush current and mechanical shock on motor start/stop compared to direct-on-line starting — common on pumps, fans and conveyors where a full VFD isn't needed." }
    ],
    faq: [
      { q: "What's the difference between the 3-wire and Delta current ratings on the 150-C30NBD?",
        a: "30A applies in standard 3-wire (in-line) connection; 51A applies when wired in a Delta (inside-the-delta) configuration on the motor — confirm which wiring topology matches your installation before sizing." },
      { q: "Is this genuine Allen-Bradley and in stock?",
        a: "Yes, in stock, genuine Allen-Bradley, sourced through official channels, ships within 24 hours." }
    ]
  },

  // ---- ABB ----
  { brand: "ABB", model: "3AFE68257913", series: "AIBP-51", cat: "spares", spec: "Input bridge protection board, 3× Vishay components, RoHS, Finland original", status: "instock", photo: "3AFE68257913.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Input bridge protection board"],
      ["Components", "3× Vishay components"],
      ["Compliance", "RoHS"],
      ["Origin", "Finland (original)"]
    ],
    applications: [
      { icon: "🔧", title: "Drive input-bridge repair",
        desc: "Replacement protection board for the input rectifier bridge section of an ABB drive — used for board-level repair rather than replacing the whole drive." }
    ],
    faq: [
      { q: "Which ABB drive series does the 3AFE68257913 fit?",
        a: "Confirm your exact drive model against the ABB spare parts documentation or send us your drive's full nameplate — this is a specific internal board, not a universal part." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, made in Finland, ships within 24 hours." }
    ]
  },
  { brand: "ABB", model: "3AFE68249457", series: "APOW-01C + NRED-61", cat: "spares", spec: "Power supply board for drives, Finland original", status: "instock", photo: "3AFE68249457.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Power supply board for drives"],
      ["Origin", "Finland (original)"]
    ],
    applications: [
      { icon: "🔧", title: "Drive power-supply board repair",
        desc: "Board-level replacement for the internal power supply section of an ABB drive." }
    ],
    faq: [
      { q: "Which ABB drive does the 3AFE68249457 fit?",
        a: "Confirm your exact drive model against ABB spare parts documentation or send us your drive's full nameplate — this is a specific internal board, not a universal part." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, made in Finland, ships within 24 hours." }
    ]
  },
  { brand: "ABB", model: "68561906A", series: "AGDR-71C", cat: "spares",
    spec: "IGBT gate drive board with Fuji 6MBI225U-120 module, for ACS800/ACS880",
    status: "instock", photo: "68561906A.png", linkedin: "68561906A.png",
    specs: [
      ["Order code",        "68561906A"],
      ["Product type",      "AGDR-71C — IGBT gate driver board"],
      ["Used in",           "ABB ACS800 and ACS880 series industrial drives"],
      ["Key component",     "Interfaces with a Fuji Electric 6MBI225U-120 IGBT module"],
      ["Board function",    "Converts low-level control signals into the gate drive signals needed to switch the power IGBT module, and reports fault/status back to the drive's control board"],
      ["Handling",          "ESD-sensitive board — anti-static precautions required during installation"],
      ["Country of origin", "Finland (ABB official channel — original ABB drives spares business)"]
    ],
    applications: [
      { icon: "⚙️", title: "ACS800 general-purpose drives",
        desc: "Common gate-driver replacement part for ACS800-series drives built around the Fuji 6MBI225U-120 IGBT module." },
      { icon: "🏭", title: "ACS880 industrial drives",
        desc: "Also used in relevant ACS880 configurations sharing the same power module and gate-drive interface." },
      { icon: "🔧", title: "Drive repair & refurbishment",
        desc: "Frequently sourced by panel builders and drive repair shops replacing a failed gate-driver stage rather than the entire power module or full drive." }
    ],
    compatibility: [
      { from: "Other AGDR-7xC board revisions", note: "ABB has released multiple AGDR-7xC board revisions across ACS800/ACS880 generations — confirm your drive's exact type code and IGBT module (e.g. Fuji 6MBI225U-120) before ordering, since boards for different IGBT modules aren't interchangeable." },
      { from: "Full ACS800/ACS880 power stage replacement", note: "If the IGBT module itself (not just the gate driver) has failed, you'll need the module and board together — send us your drive's full type code and we'll confirm what's needed." }
    ],
    faq: [
      { q: "What is the ABB 68561906A / AGDR-71C board used for?",
        a: "It's an IGBT gate driver board used in ABB ACS800 and ACS880 series industrial drives, built around the Fuji Electric 6MBI225U-120 IGBT module — it converts the drive's control signals into the gate signals needed to switch the power module and reports fault/status back to the drive." },
      { q: "How do I know if this is the right board for my drive?",
        a: "Send us your ABB drive's full type code (from the nameplate) and, if visible, the IGBT module part number — we'll confirm whether the AGDR-71C / 68561906A is the correct board revision for your specific unit before you order." },
      { q: "Is this a new or refurbished/repaired board?",
        a: "We supply genuine ABB-sourced boards through official channels; if a tested-used option is also available for your specific need, we'll tell you clearly which one you're quoted — we don't sell mismatched or generically-compatible clones as ABB originals." },
      { q: "Can you also supply the matching Fuji 6MBI225U-120 IGBT module if that's the failed component?",
        a: "Yes — if you need the power module as well as (or instead of) the gate driver board, tell us your drive's full type code and we'll quote both as a set or separately depending on what actually failed." },
      { q: "Is the 68561906A in stock and how fast can it ship?",
        a: "Yes, this is an in-stock item — it ships within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations." },
      { q: "Do you offer a warranty on this board?",
        a: "Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty doesn't cover damage from improper installation, incorrect wiring/voltage, or use outside ABB's official specifications." },
      { q: "Can you help cross-reference an older or different ABB drive board part number?",
        a: "Yes. Send your exact part number to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day." }
    ]
  },
  { brand: "ABB", model: "3ABD64644521", series: "RPLC-03C", cat: "spares", spec: "Drive control panel cable, 3m", status: "instock", photo: "3ABD64644521.jpg", linkedin: "3ABD64644521.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Drive control panel cable"],
      ["Length", "3 m"]
    ],
    applications: [
      { icon: "🔧", title: "Drive control panel connection repair",
        desc: "Replacement cable connecting an ABB drive's control panel to the drive body — used when the original cable is damaged or missing." }
    ],
    faq: [
      { q: "What does the 3ABD64644521 cable connect?",
        a: "It's the control panel cable linking an ABB drive's operator panel to the drive itself — confirm your exact drive model matches this cable's connector type before ordering." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, ships within 24 hours." }
    ]
  },
  { brand: "ABB", model: "61059113", series: "Plastic Fibre Optic", cat: "spares", spec: "Double plastic fibre optic cable, 5m, gate drive ↔ main control board", status: "instock", photo: "61059113.jpg", linkedin: "61059113.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Double plastic fibre optic cable"],
      ["Length", "5 m"],
      ["Application", "Gate drive ↔ main control board link"]
    ],
    applications: [
      { icon: "🔌", title: "Gate drive to main board signal isolation",
        desc: "Fibre optic link between an ABB drive's gate drive board and main control board — provides electrical isolation for the gate-firing signal path." }
    ],
    faq: [
      { q: "Why does this connection use fibre optic instead of copper wire?",
        a: "Fibre optic provides electrical isolation between the high-voltage gate drive section and the main control board, avoiding noise coupling and providing safety isolation — standard practice in this class of drive electronics." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, ships within 24 hours." }
    ]
  },

  // ---- Delta ----
  { brand: "Delta", model: "AS228P-A", series: "AS200", cat: "controllers", spec: "PLC CPU module, 16DI/12DO, 24VDC, built-in Ethernet + 2×RS485 + CAN, CE/UKCA/UL", status: "instock", photo: "AS228P-A.jpg", linkedin: "AS228P-A.png", sell_price: 356.59, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["I/O", "16 DI / 12 DO"],
      ["Power", "24 VDC"],
      ["Communication", "Built-in Ethernet + 2× RS485 + CAN"],
      ["Certification", "CE/UKCA/UL"],
      ["Series", "AS200"]
    ],
    applications: [
      { icon: "🏭", title: "Compact machine control",
        desc: "16DI/12DO CPU with built-in Ethernet and dual RS485+CAN suits small-to-mid machine control without extra communication modules." }
    ],
    faq: [
      { q: "Does the AS228P-A need a separate communication module?",
        a: "No — Ethernet, 2×RS485 and CAN are all built into the CPU, so most small-machine communication needs are covered without add-on modules." },
      { q: "Is this genuine Delta and in stock?",
        a: "Yes, in stock, genuine Delta, ships within 24 hours." }
    ]
  },
  { brand: "Delta", model: "ASD-B3-0721-M", series: "ASDA-B3", cat: "servo", spec: "750W servo drive, 200–230VAC, CE/UKCA/UL certified", status: "instock", photo: "ASD-B3-0721-M.jpg", linkedin: "ASD-B3-0721-M.png", sell_price: 381.09, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "750 W"],
      ["Voltage", "200–230 VAC"],
      ["Certification", "CE/UKCA/UL"],
      ["Series", "ASDA-B3"]
    ],
    applications: [
      { icon: "🏭", title: "General machine-axis servo drives",
        desc: "ASDA-B3 is Delta's current general-purpose servo line — machine tool, packaging and pick-and-place axes at the 750W class." }
    ],
    faq: [
      { q: "What's the voltage range of the ASD-B3-0721-M?",
        a: "200-230VAC, CE/UKCA/UL certified." },
      { q: "What Delta motor does this drive pair with?",
        a: "ASDA-B3 drives pair with ECMA-series servo motors — confirm your exact motor model with us before ordering." },
      { q: "Is this in stock and genuine Delta?",
        a: "Yes, in stock, genuine Delta, ships within 24 hours." }
    ]
  },

  // ---- LS Electric ----
  { brand: "LS Electric", model: "LSLV0004G100-4E0NN", series: "G100", cat: "drives", spec: "0.4kW/0.5HP inverter, 3-phase 380–480V, CE/UL, built-in EMC", status: "instock", photo: "LSLV0004G100-4E0NN.jpg", linkedin: "LSLV0004G100-4E0NN.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "0.4 kW / 0.5 HP"],
      ["Input", "3-phase 380–480 V"],
      ["Series", "G100"],
      ["EMC", "Built-in EMC filter"],
      ["Certification", "CE/UL"],
      ["Origin", "Korea"]
    ],
    applications: [
      { icon: "🏭", title: "Small machine speed control",
        desc: "Compact general-purpose inverter for small pumps, fans and conveyors at the sub-1kW class." }
    ],
    faq: [
      { q: "What's the power rating of the LSLV0004G100-4E0NN?",
        a: "0.4kW / 0.5HP, 3-phase 380-480V input, built-in EMC filter, CE/UL certified." },
      { q: "Is this in stock and genuine LS Electric?",
        a: "Yes, in stock, genuine LS Electric, ships within 24 hours." }
    ]
  },
  { brand: "LS Electric", model: "XGF-PD4H", series: "XGT", cat: "controllers", spec: "Positioning module, line-drive differential pulse output, 4-axis, UL/CE/KC, Made in Korea", status: "instock", photo: "XGF-PD4H.jpg", linkedin: "XGF-PD4H.png", sell_price: 920.84, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Positioning module"],
      ["Output", "Line-drive differential pulse"],
      ["Axes", "4-axis"],
      ["Certification", "UL/CE/KC"],
      ["Origin", "Korea"],
      ["Series", "XGT"]
    ],
    applications: [
      { icon: "🤖", title: "Multi-axis pulse-driven positioning",
        desc: "4-axis line-drive differential pulse output module for coordinating multiple stepper/servo axes from an LS Electric XGT PLC." }
    ],
    faq: [
      { q: "What PLC series does the XGF-PD4H fit?",
        a: "LS Electric's XGT series — it's a positioning expansion module, not a standalone controller." },
      { q: "Is this in stock and genuine LS Electric?",
        a: "Yes, in stock, genuine LS Electric, ships within 24 hours." }
    ]
  },

  // ---- INVT ----
  { brand: "INVT", model: "GD200A-018G/022P-4", series: "GD200A", cat: "drives", spec: "18.5kW (G heavy duty) / 22kW (P variable torque) inverter, 3-phase 380–440V", status: "instock", photo: null, linkedin: "GD200A-018G_022P-4.png", sell_price: 1110.59, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "18.5 kW (G, heavy duty) / 22 kW (P, variable torque)"],
      ["Input", "3-phase 380–440 V"],
      ["Series", "GD200A"]
    ],
    applications: [
      { icon: "🏭", title: "General-purpose motor control",
        desc: "INVT's mainstream general-purpose inverter line, dual-rated for constant-torque (heavy duty) or variable-torque loads like fans and pumps at this power class." }
    ],
    faq: [
      { q: "What do the G and P ratings mean on the GD200A-018G/022P-4?",
        a: "G (18.5kW) is the heavy-duty/constant-torque rating for loads like conveyors and compressors; P (22kW) is the variable-torque rating for fan/pump-type loads — the same physical unit is dual-rated depending on how it's configured." },
      { q: "Is this in stock and genuine INVT?",
        a: "Yes, in stock, genuine INVT, ships within 24 hours." }
    ]
  },

  // ---- Pro-face / Beckhoff ----
  { brand: "Pro-face", model: "PFXGP4301TADW", series: "GP4000", cat: "hmi", spec: "7.5\" TFT touchscreen, 640×480, RS-232/485 + Ethernet, IP65, DC24V", status: "instock", photo: "PFXGP4301TADW.jpg", linkedin: "PFXGP4301TADW.png", sell_price: 292.71, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Screen", "7.5\" TFT touchscreen"],
      ["Resolution", "640×480"],
      ["Communication", "RS-232/485 + Ethernet"],
      ["Protection", "IP65 (front)"],
      ["Power", "DC24V"],
      ["Series", "GP4000"]
    ],
    applications: [
      { icon: "🖥️", title: "Machine operator interface",
        desc: "IP65-rated front panel suits mounting directly on a control cabinet door in washdown or dusty environments." }
    ],
    faq: [
      { q: "Is the front of the PFXGP4301TADW washdown-rated?",
        a: "Yes, IP65-rated front panel — suitable for cabinet-door mounting in washdown/dusty environments, subject to correct panel gasket installation." },
      { q: "What PLCs does this GP4000-series HMI communicate with?",
        a: "GP4000 supports multi-protocol PLC communication over RS-232/485 and Ethernet — confirm your specific PLC brand/protocol with us if you're unsure of compatibility." },
      { q: "Is this genuine Pro-face and in stock?",
        a: "Yes, in stock, genuine Pro-face, ships within 24 hours." }
    ]
  },
  { brand: "Beckhoff", model: "CP6702-1028-0040", series: "CP6702", cat: "hmi", spec: "15\" touch Panel PC, Celeron 1.4GHz, 2GB RAM, 20GB CFast, DC24V", status: "instock", photo: null, linkedin: "CP6702-1028-0040.png", sell_price: 9932.25, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Screen", "15\" touch Panel PC"],
      ["Processor", "Celeron 1.4GHz"],
      ["Memory", "2GB RAM"],
      ["Storage", "20GB CFast"],
      ["Power", "DC24V"],
      ["Series", "CP6702"]
    ],
    applications: [
      { icon: "🖥️", title: "Panel PC for SCADA/HMI runtime",
        desc: "Full Panel PC (not a dedicated HMI controller) — runs Windows-based SCADA/HMI software directly, suited to machines needing more processing power or software flexibility than a fixed-function HMI provides." }
    ],
    faq: [
      { q: "Is this a full PC or a dedicated HMI panel?",
        a: "It's a Beckhoff CP6702 Panel PC — a full industrial PC (Celeron 1.4GHz, 2GB RAM, 20GB CFast storage) with a touchscreen, not a fixed-function HMI. It runs a full OS and your SCADA/HMI software." },
      { q: "What operating system does the CP6702 ship with?",
        a: "Confirm the exact OS/image with us at RFQ — Beckhoff Panel PCs are typically offered in multiple Windows configurations depending on the order code." },
      { q: "Is this genuine Beckhoff and in stock?",
        a: "Yes, in stock, genuine Beckhoff, ships within 24 hours." }
    ]
  },

  // ---- Sensors & instruments ----
  { brand: "VEGA", model: "PS6X.2SWYDBXATKMKHAXXXXXXX", series: "VEGAPULS 6X", cat: "sensors",
    spec: "80GHz radar level meter, PP horn antenna, 120m range, 4–20mA HART, IP66/68, Germany original",
    status: "instock", photo: "PS6X.2SWYDBXATKMKHAXXXXXXX.jpg", linkedin: "PS6X.2SWYDBXATKMKHAXXXXXXX.png",
    specs: [
      ["Order code",           "PS6X.2SWYDBXATKMKHAXXXXXXX"],
      ["Product type",         "VEGAPULS 6X — 80GHz radar level transmitter"],
      ["Antenna",              "PP (polypropylene) horn antenna"],
      ["Measuring range",      "Up to 120 m"],
      ["Output signal",        "4–20mA HART (2-wire loop-powered)"],
      ["Protection rating",    "IP66/IP68"],
      ["Commissioning",        "Bluetooth (VEGA Tools smartphone app) or PACTware/DTM — no need to open the housing"],
      ["Process connection",   "Threaded or flanged per ordering code — confirm the exact connection size from your original order"],
      ["Product line position", "6X series — VEGA's current 80GHz radar generation, successor to the earlier 26GHz 60-series (e.g. VEGAPULS 64, also in our catalog)"],
      ["Country of origin",    "Germany (VEGA official channel)"]
    ],
    applications: [
      { icon: "🛢️", title: "Bulk solids & silo level",
        desc: "80GHz focusing handles dusty conditions and internal obstructions (agitators, ladders) common in solids storage better than lower-frequency radar." },
      { icon: "💧", title: "Liquid storage tanks",
        desc: "Non-contact measurement with no moving parts — suited to tanks where fouling, foam or vapor would affect contact-based level sensors." },
      { icon: "🏭", title: "Process vessels with condensation/turbulence",
        desc: "The narrow beam angle and advanced signal processing filter out false echoes from condensation, agitator blades and turbulent surfaces." }
    ],
    compatibility: [
      { from: "VEGAPULS 64 (26GHz, also in our catalog)", note: "A different radar generation, not a direct swap — the 64 is VEGA's compact 26GHz line, the 6X is the newer 80GHz line with a narrower beam angle. Confirm which frequency your application was originally specified for before substituting." },
      { from: "Earlier VEGAPULS 6X hardware/firmware revisions", note: "Same 80GHz platform — send your exact order code (the long string on the nameplate) and we'll confirm parameter/output compatibility before shipment." }
    ],
    faq: [
      { q: "What does the long order code on this VEGAPULS 6X mean?",
        a: "It's VEGA's ordering code encoding antenna type (PP horn), process connection, output signal, seal material and other build options for this specific 80GHz radar level sensor. Send us your full nameplate code and we can confirm the exact configuration or find the closest sourceable match." },
      { q: "What's the difference between this VEGAPULS 6X and the VEGAPULS 64 you also sell?",
        a: "They're different radar generations: the 6X operates at 80GHz with a narrower beam angle (better for tight nozzles and internal obstructions), while the 64 is VEGA's 26GHz compact line. They aren't interchangeable — the right choice depends on your tank geometry and process conditions, which we're happy to help confirm." },
      { q: "How do I configure or commission this sensor?",
        a: "Through Bluetooth using the VEGA Tools smartphone app, or via PACTware with the VEGA DTM — no need to open the housing or bring a special programming cable to site." },
      { q: "What output signal does this unit provide?",
        a: "4–20mA with HART, in a standard 2-wire loop-powered configuration — compatible with most existing analog level-monitoring loops and PLC analog inputs." },
      { q: "Is this VEGAPULS 6X in stock and how fast can it ship?",
        a: "Yes, this is an in-stock item — it ships within 24 hours via DHL, FedEx or UPS, with air freight typically arriving in 3–5 working days to most Asian, Middle Eastern and European destinations." },
      { q: "Do you offer a warranty on this sensor?",
        a: "Yes. Every Fouwell-supplied part is backed by a 12-month replacement warranty against manufacturing defects. Warranty doesn't cover damage from improper installation, incorrect wiring/voltage, or use outside VEGA's official specifications." },
      { q: "Can you help cross-reference an older or different VEGA part number?",
        a: "Yes. Send your exact order code to info@fouwell.com and our engineers will confirm the current equivalent, availability and pricing — usually within one business day." }
    ]
  },
  { brand: "VEGA", model: "PS6X-222-2TC", series: "VEGAPULS 6X", cat: "sensors", spec: "80GHz radar level meter, outdoor IP66/IP67 Type 4X, 4–20mA HART, Germany original", status: "instock", photo: "VEGAPULS-6X.jpg", linkedin: "PS6X-222-2TC.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Frequency", "80 GHz radar"],
      ["Protection", "IP66/IP67 Type 4X"],
      ["Output", "4-20mA HART"],
      ["Application", "Outdoor level measurement"],
      ["Series", "VEGAPULS 6X"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "📡", title: "Outdoor tank/silo level measurement",
        desc: "80GHz radar with IP66/67 Type 4X protection handles outdoor weather exposure directly — no separate enclosure needed for the transmitter head." },
      { icon: "🏭", title: "HART-integrated process control",
        desc: "4-20mA HART output integrates directly into existing DCS/PLC analog loops while still allowing digital configuration/diagnostics over HART." }
    ],
    faq: [
      { q: "Can the PS6X-222-2TC be mounted outdoors without extra protection?",
        a: "Yes — IP66/IP67 Type 4X rating covers outdoor weather exposure directly. Confirm cable gland/connector installation is correctly sealed for full-rating protection." },
      { q: "Does this need a separate HART modem to configure?",
        a: "A HART modem/communicator or a compatible DCS/PLC HART interface is needed for full digital configuration; the 4-20mA loop itself works with standard analog input cards." },
      { q: "Is this genuine VEGA and in stock?",
        a: "Yes, in stock, genuine VEGA, made in Germany, ships within 24 hours." }
    ]
  },
  { brand: "VEGA", model: "PS64.RXHCAHXBM00M", series: "VEGAPULS 64", cat: "sensors", spec: "80GHz compact radar, full stainless steel, PTFE, −1~10bar, 30m range, Germany original", status: "instock", photo: "VEGAPULS-64.jpg", linkedin: "PS64.RXHCAHXBM00M.png",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Frequency", "80 GHz radar (compact)"],
      ["Wetted material", "Full stainless steel + PTFE"],
      ["Range", "−1 to 10 bar / 30 m"],
      ["Series", "VEGAPULS 64"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "📡", title: "Hygienic/chemical-resistant level measurement",
        desc: "Full stainless-steel + PTFE wetted parts suit hygienic (food/pharma) or chemically aggressive process media where standard sensor materials would corrode." },
      { icon: "🧪", title: "High-pressure vessel level measurement",
        desc: "Rated to 10 bar, suited to pressurized tanks and reactors beyond what an atmospheric-only level sensor can handle." }
    ],
    faq: [
      { q: "What media is the PS64.RXHCAHXBM00M's wetted parts suited to?",
        a: "Full stainless steel construction with PTFE — suited to hygienic (food/pharma) and chemically aggressive process media that would corrode standard sensor materials. Confirm exact chemical compatibility for your specific media with us or VEGA's compatibility charts." },
      { q: "What's the maximum measuring range and pressure rating?",
        a: "30m measuring range, −1 to 10 bar process pressure rating." },
      { q: "Is this genuine VEGA and in stock?",
        a: "Yes, in stock, genuine VEGA, made in Germany, ships within 24 hours." }
    ]
  },
  { brand: "Honeywell", model: "943-F4V-2D-1C0-300E", series: "943", cat: "sensors", spec: "Proximity sensor, analog 0–10V + switching output, teach-in, 15–30VDC", status: "instock", photo: "943-F4V-2D-1C0-300E.jpg", linkedin: null, sell_price: 709.04, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Output", "Analog 0-10V + switching output"],
      ["Feature", "Teach-in"],
      ["Power", "15-30 VDC"],
      ["Series", "943"]
    ],
    applications: [
      { icon: "📏", title: "Distance/level sensing with analog output",
        desc: "Combined analog 0-10V and switching output lets one sensor feed both a continuous PLC reading and a discrete alarm/trigger point." }
    ],
    faq: [
      { q: "What does teach-in mean on the 943-F4V-2D-1C0-300E?",
        a: "Teach-in lets you set the sensor's switching/analog range directly at the sensor (button press at target positions) instead of programming it through a separate configuration tool." },
      { q: "Is this genuine Honeywell and in stock?",
        a: "Yes, in stock, genuine Honeywell, ships within 24 hours." }
    ]
  },
  { brand: "TURCK", model: "Ni5-G12K-AP6X", series: "Ni5-G12K", cat: "sensors", spec: "M12 inductive proximity switch, PNP NO 3-wire, Sn 5mm, 10–30VDC, CE/UL", status: "instock", photo: "Ni5-G12K-AP6X.jpg", linkedin: "Ni5-G12K-AP6X.png", sell_price: 25.46, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Sensing distance", "5 mm"],
      ["Output", "PNP NO, 3-wire"],
      ["Housing", "M12"],
      ["Power", "10-30 VDC"],
      ["Certification", "CE/UL"],
      ["Series", "Ni5-G12K"]
    ],
    applications: [
      { icon: "🔍", title: "Standard machine proximity detection",
        desc: "M12 PNP inductive proximity switch for general presence/position detection on conveyors, indexing tables and machine guards." }
    ],
    faq: [
      { q: "What's the sensing distance of the Ni5-G12K-AP6X?",
        a: "5mm nominal sensing distance for ferrous/non-ferrous metal targets, M12 housing, PNP NO 3-wire output." },
      { q: "Is this genuine TURCK and in stock?",
        a: "Yes, in stock, genuine TURCK, ships within 24 hours." }
    ]
  },
  { brand: "Barksdale", model: "B2T-A48SS-P5", series: "B2T", cat: "sensors", spec: "Pressure switch, 240–4800 PSI, SS wetted parts, NEMA 4, 10A, USA original", status: "instock", photo: "B2T-A48SS-P5.jpg", linkedin: "B2T-A48SS-P5.png", sell_price: 866.0, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Range", "240–4800 PSI"],
      ["Wetted parts", "Stainless steel"],
      ["Enclosure", "NEMA 4"],
      ["Switch rating", "10 A"],
      ["Series", "B2T"],
      ["Origin", "USA (original)"]
    ],
    applications: [
      { icon: "🏭", title: "High-pressure hydraulic/pneumatic monitoring",
        desc: "240-4800 PSI range with stainless wetted parts suits high-pressure hydraulic systems where a general-purpose pressure switch isn't rated high enough." }
    ],
    faq: [
      { q: "What's the pressure range of the B2T-A48SS-P5?",
        a: "240-4800 PSI adjustable setpoint range, stainless steel wetted parts, NEMA 4 enclosure, 10A switch rating." },
      { q: "Is this genuine Barksdale and in stock?",
        a: "Yes, in stock, genuine Barksdale, sourced from official channels, ships within 24 hours." }
    ]
  },
  { brand: "POSITAL", model: "OCD-DPC1B-1212-C100-H3P", series: "OCD-DPC1B", cat: "sensors", spec: "Multiturn absolute encoder, 4096×4096 (24-bit), Profibus DP, Made in Poland", status: "instock", photo: "OCD-DPC1B-1212-C100-H3P.jpg", linkedin: "OCD-DPC1B-1212-C100-H3P.png", sell_price: 635.63, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Multiturn absolute encoder"],
      ["Resolution", "4096×4096 (24-bit)"],
      ["Interface", "Profibus DP"],
      ["Origin", "Poland"],
      ["Series", "OCD-DPC1B"]
    ],
    applications: [
      { icon: "🎯", title: "Absolute position feedback on Profibus networks",
        desc: "24-bit multiturn absolute resolution over Profibus DP suits crane, hoist and large-axis positioning where power-loss position retention and network integration both matter." }
    ],
    faq: [
      { q: "What does 4096×4096 (24-bit) resolution mean on the OCD-DPC1B-1212-C100-H3P?",
        a: "4096 steps per revolution (singleturn) × 4096 revolutions (multiturn) = 24-bit total absolute resolution — position is retained through power loss without a battery, unlike an incremental encoder." },
      { q: "Is this genuine POSITAL and in stock?",
        a: "Yes, in stock, genuine POSITAL, made in Poland, ships within 24 hours." }
    ]
  },
  { brand: "CX", model: "CSP50-8-500BZ-5-30TG5", series: "CSP50", cat: "sensors", spec: "Incremental rotary encoder, 500PPR, 8mm shaft, DC5–30V, differential ABZ output", status: "instock", photo: "CSP50-8-500BZ-5-30TG5.jpg", linkedin: "CSP50-8-500BZ-5-30TG5.png", sell_price: 76.76, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Incremental rotary encoder"],
      ["Resolution", "500 PPR"],
      ["Shaft", "8mm"],
      ["Power", "DC5-30V"],
      ["Output", "Differential ABZ"],
      ["Series", "CSP50"]
    ],
    applications: [
      { icon: "🎯", title: "Speed/position feedback for motion control",
        desc: "500PPR incremental encoder with differential ABZ output for speed and relative-position feedback on servo/stepper motion axes." }
    ],
    faq: [
      { q: "What's the pulse resolution of the CSP50-8-500BZ-5-30TG5?",
        a: "500 pulses per revolution, differential ABZ output, wide 5-30VDC supply range." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  },

  // ---- Components & spares ----
  { brand: "Weidmüller", model: "SKH-F48", series: "SKH", cat: "spares", spec: "Passive interface terminal module, 32-point screw terminal ↔ ribbon cable, DIN rail, CE, Made in Poland", status: "instock", photo: "SKH-F48.jpg", linkedin: "SKH-F48.png", sell_price: 33.0, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Passive interface terminal module"],
      ["Terminals", "32-point screw terminal ↔ ribbon cable"],
      ["Mounting", "DIN rail"],
      ["Certification", "CE"],
      ["Origin", "Poland"],
      ["Series", "SKH"]
    ],
    applications: [
      { icon: "🔌", title: "PLC I/O signal breakout",
        desc: "Breaks out a PLC's ribbon-cable I/O connector to individual screw terminals on a DIN rail, simplifying field wiring without a dedicated terminal block per point." }
    ],
    faq: [
      { q: "Does the SKH-F48 include any active electronics?",
        a: "No — it's a passive breakout module, purely wiring 32 screw terminals to the ribbon cable connector with no active signal conditioning." },
      { q: "Is this genuine Weidmüller and in stock?",
        a: "Yes, in stock, genuine Weidmüller, made in Poland, ships within 24 hours." }
    ]
  },
  { brand: "FANOX", model: "U3N-400", series: "U3N", cat: "spares", spec: "3-phase + neutral voltage monitoring relay, 400VAC, DIP-adjustable thresholds, 2 relay outputs, Made in Spain", status: "instock", photo: "U3N-400.jpg", linkedin: "U3N-400.png", sell_price: 209.95, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "3-phase + neutral voltage monitoring relay"],
      ["Voltage", "400VAC"],
      ["Adjustment", "DIP-adjustable thresholds"],
      ["Outputs", "2 relay outputs"],
      ["Origin", "Spain"],
      ["Series", "U3N"]
    ],
    applications: [
      { icon: "⚡", title: "Phase-loss/voltage-fault protection",
        desc: "Monitors 3-phase + neutral supply for under/over-voltage and phase-loss conditions, tripping motor circuits before a voltage fault causes motor damage." }
    ],
    faq: [
      { q: "How are the trip thresholds set on the U3N-400?",
        a: "Via DIP switches on the unit — no external programming tool needed, adjustable directly on the relay body." },
      { q: "Is this genuine FANOX and in stock?",
        a: "Yes, in stock, genuine FANOX, made in Spain, ships within 24 hours." }
    ]
  },
  { brand: "Bosch Rexroth", model: "1.0630-H6XL-A00-0-M", series: "H6XL", cat: "spares", spec: "Replacement hydraulic filter element, German factory original", status: "instock", photo: "1.0630-H6XL-A00-0-M.jpg", linkedin: null, sell_price: 234.8, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Hydraulic filter element"],
      ["Origin", "Germany (factory original)"]
    ],
    applications: [
      { icon: "🔧", title: "Hydraulic system filter replacement",
        desc: "Scheduled replacement element for hydraulic filter housings using the H6XL series — keeping hydraulic fluid clean to protect pumps and valves from contamination wear." }
    ],
    faq: [
      { q: "How often should the 1.0630-H6XL-A00-0-M be replaced?",
        a: "Follow your hydraulic system's maintenance schedule or filter differential-pressure indicator — replacement interval depends on system contamination load, not a fixed universal number." },
      { q: "Is this genuine Bosch Rexroth and in stock?",
        a: "Yes, in stock, genuine Bosch Rexroth, made in Germany, ships within 24 hours." }
    ]
  },
  { brand: "Tianhe", model: "WDJ36-II", series: "WDJ36", cat: "sensors", spec: "Precision conductive-plastic potentiometer, custom resistance/travel, bulk stock", status: "instock", photo: "WDJ36-II.jpg", linkedin: "WDJ36-II.png", sell_price: 87.97, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Precision conductive-plastic potentiometer"],
      ["Resistance/travel", "Custom (per order)"],
      ["Series", "WDJ36"]
    ],
    applications: [
      { icon: "📏", title: "Custom position feedback",
        desc: "Conductive-plastic potentiometer for position/angle feedback where a custom resistance and travel range is needed for the application, rather than a fixed off-the-shelf spec." }
    ],
    faq: [
      { q: "Can the resistance/travel range be customized on the WDJ36-II?",
        a: "Yes — this is a custom-spec conductive-plastic potentiometer; send your required resistance value and travel range and we'll confirm what's available/producible." },
      { q: "Is this in stock?",
        a: "Bulk stock available — send your required quantity and specification for a quote." }
    ]
  },
  { brand: "DPG", model: "5GN-20-K", series: "5IK120GN-CF", cat: "drives", spec: "Single-phase AC gear motor, 120W, 220V 60Hz, 1350r/min, 20:1 ratio", status: "instock", photo: "5GN-20-K.jpg", linkedin: "5GN-20-K.png", sell_price: 257.21, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Power", "120 W"],
      ["Voltage", "220 V, 60 Hz"],
      ["Speed", "1350 r/min (motor), 20:1 gear ratio"],
      ["Type", "Single-phase AC gear motor"],
      ["Series", "5IK120GN-CF"]
    ],
    applications: [
      { icon: "⚙️", title: "Low-speed indexing drives",
        desc: "20:1 gear ratio brings 1350r/min motor speed down to a low-speed output shaft suited to indexing tables, small conveyors and mixers." }
    ],
    faq: [
      { q: "What output speed does the 5GN-20-K give with its 20:1 gearhead?",
        a: "The 1350r/min motor speed is reduced to roughly 67.5r/min at the output shaft through the built-in 20:1 gear ratio." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  },
  { brand: "General", model: "80ST-M02430", series: "80ST", cat: "servo", spec: "0.75kW AC servo motor, 220V, 2.39N·m, 3000RPM", status: "instock", photo: null, linkedin: "R88M-KE75030H.png", sell_price: 364.94, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "0.75 kW"],
      ["Voltage", "220 V"],
      ["Rated torque", "2.39 N·m"],
      ["Rated speed", "3000 RPM"],
      ["Frame", "80ST"]
    ],
    applications: [
      { icon: "🏭", title: "General AC servo axes",
        desc: "80ST-frame AC servo motor for general machine positioning axes at the sub-1kW class." }
    ],
    faq: [
      { q: "What's the frame size and rating of the 80ST-M02430?",
        a: "80mm frame (80ST series), 0.75kW rated output, 2.39N·m rated torque, 3000RPM rated speed, 220V." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  },
  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "ABB", model: "UA75-30-00RA", series: "UA75", cat: "spares", spec: "The ABB UA75-30-00RA is a capacitor-switching contactor rated for 400V/60kvar power factor correction duty", status: "instock", photo: "UA75-30-00RA.jpg", linkedin: null, sell_price: 281.12, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Capacitor-switching contactor"],
      ["Rating", "400V / 60kvar power factor correction"]
    ],
    applications: [
      { icon: "⚡", title: "Power factor correction switching",
        desc: "Specifically designed to switch capacitor banks for power-factor correction — standard AC contactors aren't rated for the high inrush current of capacitor switching and can fail prematurely if substituted." }
    ],
    faq: [
      { q: "Can a standard AC contactor be used instead of the UA75-30-00RA for capacitor switching?",
        a: "Not recommended — capacitor-switching contactors are built to handle the high inrush current of charging a capacitor bank on closing; a standard motor contactor substituted here typically has a much shorter service life or fails outright." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ABB/Contactor/UA75-30-00RA/营销素材包/04-独立站内容包/UA75-30-00RA.md
  { brand: "AirTAC", model: "X-PK506", series: "PK506", cat: "sensors", spec: "The AirTAC X-PK506 is a mechanical pressure switch with auto-reset, adjustable 1-6 kgf/cm² range and 1-4 kgf/cm² differential", status: "instock", photo: "X-PK506.jpg", linkedin: null, sell_price: 29.45, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Mechanical pressure switch"],
      ["Reset", "Auto-reset"],
      ["Range", "1-6 kgf/cm² (adjustable)"],
      ["Differential", "1-4 kgf/cm²"],
      ["Series", "PK506"]
    ],
    applications: [
      { icon: "🏭", title: "Pneumatic system pressure monitoring",
        desc: "Auto-reset mechanical pressure switch for compressed-air/pneumatic circuit monitoring — no manual reset needed after a pressure excursion clears." }
    ],
    faq: [
      { q: "Does the X-PK506 need to be manually reset after tripping?",
        a: "No — it's an auto-reset switch, it re-engages automatically once pressure returns within the adjustable 1-6 kgf/cm² range (1-4 kgf/cm² differential)." },
      { q: "Is this genuine AirTAC and in stock?",
        a: "Yes, in stock, genuine AirTAC, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/AirTAC/PressureSwitch/X-PK506/营销素材包/04-独立站内容包/X-PK506.md
  { brand: "Burkert", model: "ID-No-00007225", series: "Type 2000", cat: "spares", spec: "The Burkert Type 2000 (ID-No 00007225) is a pneumatically actuated 2/2-way angle seat valve, DN25/PN25, with PTFE seal and G1 threaded connection", status: "instock", photo: "ID-No-00007225.jpg", linkedin: null, sell_price: 219.22, sell_price_currency: "USD", price_source: "web_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Pneumatically actuated 2/2-way angle seat valve"],
      ["Size", "DN25/PN25"],
      ["Seal", "PTFE"],
      ["Connection", "G1 threaded"],
      ["Series", "Type 2000"]
    ],
    applications: [
      { icon: "🏭", title: "Process fluid on/off control",
        desc: "Angle-seat design gives a straighter flow path and lower pressure drop than a standard globe valve at this size, suited to steam, hot water and process fluid on/off duty." }
    ],
    faq: [
      { q: "What media is the PTFE seal on the ID-No-00007225 suited to?",
        a: "PTFE seals are broadly chemical-resistant and suited to steam, hot water and many process fluids — confirm exact chemical/temperature compatibility for your specific media against Bürkert's compatibility data." },
      { q: "Is this genuine Bürkert and in stock?",
        a: "Yes, in stock, genuine Bürkert, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Burkert/AngleSeatValve/ID-No-00007225/营销素材包/04-独立站内容包/ID-No-00007225.md
  { brand: "Danfoss", model: "AVTA15-003N2182", series: "AVTA", cat: "spares", spec: "Self-acting water regulating valve, DN15, PN16, 50-90C temperature control range, no external power required", status: "instock", photo: "AVTA15-003N2182.jpg", linkedin: null, sell_price: 415.9, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Self-acting water regulating valve"],
      ["Size", "DN15"],
      ["Pressure", "PN16"],
      ["Temperature range", "50–90°C"],
      ["Power", "No external power required"],
      ["Series", "AVTA"]
    ],
    applications: [
      { icon: "🌡️", title: "Self-acting temperature control",
        desc: "Modulates water flow to maintain a set temperature using only the process medium's own thermal expansion — no electrical power, controller or actuator needed, useful in locations without control power available." }
    ],
    faq: [
      { q: "Does the AVTA15-003N2182 need electrical power or a separate controller to work?",
        a: "No — it's self-acting, using the thermal expansion of a sensor element to modulate the valve directly, no external power or control signal required." },
      { q: "Is this genuine Danfoss and in stock?",
        a: "Yes, in stock, genuine Danfoss, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Danfoss/WaterRegulatingValve/AVTA15-003N2182/营销素材包/04-独立站内容包/AVTA15-003N2182.md
  { brand: "Haiwell", model: "B7H-W", series: "B7H", cat: "hmi", spec: "7-inch WiFi-enabled intelligent HMI touch panel with built-in cloud SCADA support", status: "instock", photo: "B7H-W.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Screen", "7-inch"],
      ["Connectivity", "Built-in WiFi"],
      ["Feature", "Cloud SCADA support"],
      ["Series", "B7H"]
    ],
    applications: [
      { icon: "📶", title: "Remote-accessible small machine HMI",
        desc: "Built-in WiFi and cloud SCADA support let this HMI be monitored/configured remotely, without running a dedicated wired network to the panel." }
    ],
    faq: [
      { q: "Can the B7H-W be monitored remotely over the cloud?",
        a: "Yes — it has built-in cloud SCADA support alongside WiFi connectivity, letting you monitor/configure it without a local wired network connection (confirm data/cloud service requirements with us if this matters for your deployment)." },
      { q: "Is this genuine Haiwell and in stock?",
        a: "Yes, in stock, genuine Haiwell, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Haiwell/HMI/B7H-W/营销素材包/04-独立站内容包/B7H-W.md
  { brand: "JAKON", model: "JK76", series: "JK76", cat: "sensors", spec: "Intelligent digital counter/length meter for production line counting and length measurement", status: "instock", photo: "JK76.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Intelligent digital counter / length meter"],
      ["Application", "Production line counting and length measurement"],
      ["Series", "JK76"]
    ],
    applications: [
      { icon: "🔢", title: "Production line piece counting",
        desc: "Digital counter for tallying parts/cycles on a production line, typically fed from a proximity sensor or photoelectric switch trigger." },
      { icon: "📏", title: "In-line length measurement",
        desc: "Configurable for length measurement mode alongside counting — for material fed past a rotary encoder or similar pulse source." }
    ],
    faq: [
      { q: "Does the JK76 do both counting and length measurement?",
        a: "Yes — it's an intelligent counter/length meter that can be configured for either function depending on your input sensor and application setup." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/JAKON/Counter/JK76/营销素材包/04-独立站内容包/JK76.md
  { brand: "MAC", model: "250B-611JA", series: "250B", cat: "spares", spec: "3/4-way solenoid and air/hand operated valve, 24VDC 8.5W coil, 25-150 PSI", status: "instock", photo: "250B-611JA.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "3/4-way solenoid and air/hand operated valve"],
      ["Coil", "24VDC, 8.5W"],
      ["Pressure range", "25-150 PSI"],
      ["Series", "250B"]
    ],
    applications: [
      { icon: "🏭", title: "Pneumatic actuator control",
        desc: "3/4-way valve switches air to single or double-acting pneumatic cylinders; combined solenoid + manual air/hand override lets the machine be actuated for maintenance without electrical power." }
    ],
    faq: [
      { q: "Can the 250B-611JA be actuated manually without electrical power?",
        a: "Yes — it has an air/hand operated override in addition to the 24VDC solenoid, useful for maintenance or troubleshooting without needing to energize the coil." },
      { q: "Is this genuine MAC and in stock?",
        a: "Yes, in stock, genuine MAC Valves, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/MAC/SolenoidValve/250B-611JA/营销素材包/04-独立站内容包/250B-611JA.md
  { brand: "PWERUN", model: "FX3U-30MR", series: "FX3U-compatible", cat: "controllers", spec: "The FX3U-30MR is an FX3U instruction-set compatible PLC control board manufactured by PWERUN (not a genuine Mitsubishi product)", status: "instock", photo: "FX3U-30MR.jpg", linkedin: null, sell_price: 42.09, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "FX3U instruction-set compatible PLC control board"],
      ["Manufacturer", "PWERUN (not genuine Mitsubishi)"],
      ["I/O count", "30 points class (per FX3U-30MR naming)"]
    ],
    applications: [
      { icon: "🔧", title: "Cost-sensitive FX3U-compatible replacement",
        desc: "Instruction-set compatible board for machines running FX3U-based programs where a lower-cost compatible option is acceptable — not a genuine Mitsubishi part." }
    ],
    faq: [
      { q: "Is the FX3U-30MR a genuine Mitsubishi PLC?",
        a: "No — it's manufactured by PWERUN as an FX3U instruction-set compatible board, not a genuine Mitsubishi product. Fouwell discloses this clearly; if you need genuine Mitsubishi FX3U hardware, tell us and we'll source that instead." },
      { q: "Will my existing FX3U program run on this board?",
        a: "It's built to be instruction-set compatible with FX3U programming, but we recommend confirming your specific instruction set and I/O configuration with us before ordering, since compatible boards can have edge-case differences from genuine Mitsubishi firmware." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PLC/FX3U-30MR/营销素材包/04-独立站内容包/FX3U-30MR.md
  { brand: "OMRON", model: "E2E-X18MB1D30", series: "E2E", cat: "sensors", spec: "The OMRON E2E-X18MB1D30 is an inductive proximity sensor, 10-30VDC, with 2m cable and 100mA max load current", status: "instock", photo: "E2E-X18MB1D30.jpg", linkedin: null, sell_price: 127.8, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Inductive proximity sensor"],
      ["Voltage", "10-30 VDC"],
      ["Cable", "2m"],
      ["Max load current", "100 mA"],
      ["Series", "E2E"]
    ],
    applications: [
      { icon: "🔍", title: "Standard machine proximity detection",
        desc: "General-purpose inductive proximity sensor for presence/position detection on conveyors and machine guards." }
    ],
    faq: [
      { q: "What's the load current rating of the E2E-X18MB1D30?",
        a: "100mA max load current, 10-30VDC supply, fixed 2m cable." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/ProximitySwitch/E2E-X18MB1D30/营销素材包/04-独立站内容包/E2E-X18MB1D30.md
  { brand: "OMRON", model: "E2E-X1R5F2", series: "E2E", cat: "sensors", spec: "The OMRON E2E-X1R5F2 is an inductive proximity sensor, 12-24VDC, with 2m cable", status: "instock", photo: "E2E-X1R5F2.jpg", linkedin: null, sell_price: 187.99, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Inductive proximity sensor"],
      ["Voltage", "12-24 VDC"],
      ["Cable", "2m"],
      ["Series", "E2E"]
    ],
    applications: [
      { icon: "🔍", title: "Compact-body proximity detection",
        desc: "Small-body E2E sensor for tight-clearance mounting locations on machine guards and part-detection points." }
    ],
    faq: [
      { q: "What's the voltage range of the E2E-X1R5F2?",
        a: "12-24VDC, fixed 2m cable." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/ProximitySwitch/E2E-X1R5F2/营销素材包/04-独立站内容包/E2E-X1R5F2.md
  { brand: "Panasonic", model: "MSM15205C", series: "MINAS", cat: "servo", spec: "MINAS-series AC servo motor, 1.5kW, 3-phase 200V, 3000rpm rated speed, 4.77Nm rated torque", status: "instock", photo: "MSM15205C.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "1.5 kW"],
      ["Voltage", "3-phase 200 V"],
      ["Rated speed", "3000 rpm"],
      ["Rated torque", "4.77 N·m"],
      ["Series", "MINAS"]
    ],
    applications: [
      { icon: "🏭", title: "Precision machine-axis positioning",
        desc: "MINAS is Panasonic's servo motor line for general and precision positioning axes — this 1.5kW/4.77N·m class fits mid-size machine and robotics axes." }
    ],
    faq: [
      { q: "What Panasonic drive pairs with the MSM15205C?",
        a: "MINAS-series motors pair with MINAS-series servo drives (A5/A6 generation, confirm which with your nameplate) — send us your exact drive model and cable configuration before ordering." },
      { q: "Is this in stock and genuine Panasonic?",
        a: "Yes, in stock, genuine Panasonic, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Panasonic/Servo/MSM15205C/营销素材包/04-独立站内容包/MSM15205C.md
  { brand: "Schneider", model: "LC1D32M7", series: "TeSys D", cat: "spares", spec: "The Schneider LC1D32M7 is a TeSys D series AC contactor rated 32A continuous current, 220V coil, with 1NO+1NC auxiliary contacts", status: "instock", photo: "LC1D32M7.jpg", linkedin: null, sell_price: 90.93, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "AC contactor"],
      ["Rated current", "32A continuous"],
      ["Coil voltage", "220V"],
      ["Auxiliary contacts", "1NO+1NC"],
      ["Series", "TeSys D"]
    ],
    applications: [
      { icon: "🏭", title: "Motor and general load switching",
        desc: "TeSys D is Schneider's mainstream contactor line — motor starters, lighting and general load switching at this 32A class." }
    ],
    faq: [
      { q: "What do the auxiliary contacts on the LC1D32M7 do?",
        a: "1NO+1NC auxiliary contacts provide status feedback to the control circuit (e.g. confirming the contactor is actually closed) separate from the main power contacts." },
      { q: "Is this genuine Schneider and in stock?",
        a: "Yes, in stock, genuine Schneider Electric, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Schneider/Contactor/LC1D32M7/营销素材包/04-独立站内容包/LC1D32M7.md
  { brand: "Siemens", model: "6SL3120-2TE21-0AA4", series: "SINAMICS S120", cat: "drives", spec: "The Siemens 6SL3120-2TE21-0AA4 is a SINAMICS S120 Double Motor Module with two independent 9A outputs at 3AC 400V, fed from a common DC600V bus, with 4x DRIVE-CLiQ interfaces", status: "instock", photo: "6SL3120-2TE21-0AA4.jpg", linkedin: null, sell_price: 628.06, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Double Motor Module"],
      ["Output", "2× independent 9 A outputs, 3AC 400 V"],
      ["DC bus", "Common DC600V bus (fed from a SINAMICS S120 infeed)"],
      ["Interfaces", "4× DRIVE-CLiQ"],
      ["Series", "SINAMICS S120"]
    ],
    applications: [
      { icon: "🏭", title: "Multi-axis machine control",
        desc: "One Double Motor Module drives two independent axes off a shared DC bus — common in SINAMICS S120 multi-axis machine tool and packaging line setups." }
    ],
    faq: [
      { q: "Can the two outputs on the 6SL3120-2TE21-0AA4 be used independently?",
        a: "Yes — it's a Double Motor Module, meaning two fully independent 9A/3AC400V outputs sharing one DC600V bus fed from your SINAMICS S120 infeed module." },
      { q: "What does DRIVE-CLiQ connect to?",
        a: "DRIVE-CLiQ is Siemens' digital drive-system bus connecting this module to the S120 control unit and other DRIVE-CLiQ-capable components (motors, encoders, other power modules) — 4 ports are provided on this unit." },
      { q: "Is this in stock and genuine Siemens?",
        a: "Yes, in stock, genuine Siemens, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/MotorModule/6SL3120-2TE21-0AA4/营销素材包/04-独立站内容包/6SL3120-2TE21-0AA4.md
  { brand: "Siemens", model: "6EP3437-8SB00-0AY0", series: "SITOP PSU8200", cat: "spares", spec: "The Siemens 6EP3437-8SB00-0AY0 is a SITOP PSU8200 series switched-mode power supply, 3AC 400-500V input, DC24V/40A output, adjustable 24-28V", status: "instock", photo: "6EP3437-8SB00-0AY0.jpg", linkedin: null, sell_price: 314.69, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-17: enriched from Tier C (structured page) to Tier B, demo of PartNumber实体化架构提案/产品页技术规范提案/字段级Schema提案 content architecture applied to a real thin SKU. All fields below are restructured from the existing spec text or general, verifiable SITOP PSU8200-family engineering knowledge — no fabricated per-unit claims (no datasheet added: Fouwell does not have a verified original-Siemens datasheet file for this exact order code on file, so the section stays hidden rather than showing a placeholder). ---- */
    specs: [
      ["Order code (MLFB)", "6EP3437-8SB00-0AY0"],
      ["Product line", "SITOP PSU8200"],
      ["Input", "3 AC 400–500 V"],
      ["Output voltage", "24–28 V DC, adjustable"],
      ["Output current", "40 A"],
      ["Mounting", "DIN rail (TS 35)"],
      ["Redundancy", "Supports parallel/redundant operation with other PSU8200 units (Siemens SITOP redundancy module required)"]
    ],
    applications: [
      { icon: "🏭", title: "Control cabinet 24V backbone",
        desc: "Primary 24V DC supply for PLC, HMI, sensor and actuator loads in a machine or panel build — the standard role for a SITOP-class supply." },
      { icon: "💧", title: "Process & utility control",
        desc: "Stable 24V rail for PID loops, instrumentation and remote I/O in water/utility and process control panels." },
      { icon: "🔁", title: "Redundant/critical-load setups",
        desc: "PSU8200 units are designed to run in parallel for N+1 redundancy — used where a single power supply failure can't be allowed to stop the line." }
    ],
    faq: [
      { q: "What does the order code 6EP3437-8SB00-0AY0 tell me about this unit?",
        a: "It identifies this as a Siemens SITOP PSU8200 series switched-mode power supply with 3AC 400–500V input and 24V/40A DC output, adjustable 24–28V. Fouwell sources it through official Siemens channels with full traceability." },
      { q: "Can I run this directly from a 400V or 500V 3-phase supply without a transformer?",
        a: "Yes — the rated input range (3AC 400–500V) covers both directly; no step-down transformer is needed within that band." },
      { q: "Can I adjust the output voltage, and by how much?",
        a: "Yes, the output is adjustable from 24V up to 28V DC — useful for compensating cable voltage drop on long DC runs to remote I/O or actuators." },
      { q: "Can multiple PSU8200 units be paralleled for redundancy?",
        a: "The PSU8200 series is designed to support parallel operation for redundant/N+1 setups. Confirm the exact redundancy module/wiring for your configuration with our engineers when you request a quote." },
      { q: "Is this in stock, and is it genuine Siemens?",
        a: "Yes — this is an in-stock, genuine Siemens unit, 100% inspected before shipping, and ships within 24 hours via DHL/FedEx/UPS." },
      { q: "Do you have the official Siemens datasheet on file for this exact order code?",
        a: "We don't currently have a verified original-Siemens datasheet on file for 6EP3437-8SB00-0AY0 specifically — send a request and we'll source the correct document from Siemens before shipment rather than send you a generic SITOP PSU8200 sheet that may not match this exact variant." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/PowerSupply/6EP3437-8SB00-0AY0/营销素材包/04-独立站内容包/6EP3437-8SB00-0AY0.md
  { brand: "Telemecanique", model: "XS512BLPAL5", series: "XS5", cat: "sensors", spec: "The Telemecanique XS512BLPAL5 is an inductive proximity switch with 2mm sensing distance, PNP NO 3-wire output, 12-48VDC", status: "instock", photo: "XS512BLPAL5.jpg", linkedin: null,
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Inductive proximity switch"],
      ["Sensing distance", "2 mm"],
      ["Output", "PNP NO, 3-wire"],
      ["Voltage", "12-48 VDC"],
      ["Series", "XS5"]
    ],
    applications: [
      { icon: "🔍", title: "Compact proximity detection",
        desc: "M12-class inductive switch for standard presence/position detection in machine guards and indexing stations." }
    ],
    faq: [
      { q: "What's the sensing distance of the XS512BLPAL5?",
        a: "2mm nominal sensing distance for metal targets, PNP NO 3-wire output, 12-48VDC." },
      { q: "Is this genuine Telemecanique and in stock?",
        a: "Yes, in stock, genuine Telemecanique (Schneider Electric brand), ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Telemecanique/ProximitySwitch/XS512BLPAL5/营销素材包/04-独立站内容包/XS512BLPAL5.md
  { brand: "Yaskawa", model: "SGMGV-13DDA6H", series: "Sigma-V", cat: "servo", spec: "The Yaskawa SGMGV-13DDA6H is a Sigma-V series AC servo motor rated 1.3kW, 400V, 1500rpm rated speed, 8.34Nm rated torque, with incremental encoder", status: "instock", photo: "SGMGV-13DDA6H.jpg", linkedin: null, sell_price: 3735.45, sell_price_currency: "USD", price_source: "web_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "1.3 kW"],
      ["Voltage", "400 V"],
      ["Rated speed", "1500 rpm"],
      ["Rated torque", "8.34 N·m"],
      ["Encoder", "Incremental"],
      ["Series", "Sigma-V"]
    ],
    applications: [
      { icon: "🛠️", title: "Legacy machine tool / CNC axis maintenance",
        desc: "Sigma-V was Yaskawa's standard servo generation before Sigma-7 — used to keep existing machines built on this generation running." },
      { icon: "🤖", title: "High-torque low-speed axes",
        desc: "1500rpm rated speed with 8.34N·m torque suits axes needing more torque at lower speed than a typical 3000rpm servo motor provides." }
    ],
    faq: [
      { q: "What Yaskawa drive pairs with the SGMGV-13DDA6H?",
        a: "Sigma-V motors pair with Sigma-V-series (SGDV) servo drives — confirm your exact drive model and cable configuration with us before ordering." },
      { q: "Is there a current-generation replacement?",
        a: "Yaskawa's current servo generation is Sigma-7, but there's no single confirmed drop-in replacement for the SGMGV-13DDA6H on file — flange size, shaft, brake and connector configuration all need to match. Send us your full nameplate details and we'll check current options." },
      { q: "Is this genuine Yaskawa and in stock?",
        a: "Yes, in stock, genuine Yaskawa, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Yaskawa/Servo/SGMGV-13DDA6H/营销素材包/04-独立站内容包/SGMGV-13DDA6H.md
  { brand: "ifm", model: "AC3216", series: "SmartLine", cat: "sensors", spec: "The ifm AC3216 is a SmartLine AS-Interface I/O module with 4 analog current inputs (4-20mA each), IP20, supporting 2/3/4-wire sensor connections", status: "instock", photo: "AC3216.jpg", linkedin: null, sell_price: 707.41, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "SmartLine AS-Interface I/O module"],
      ["Inputs", "4× analog current (4-20mA)"],
      ["Protection", "IP20"],
      ["Wiring", "2/3/4-wire sensor support"],
      ["Series", "SmartLine"]
    ],
    applications: [
      { icon: "🔌", title: "AS-Interface analog sensor integration",
        desc: "Brings 4 analog 4-20mA sensor signals onto an AS-Interface network, letting analog sensors share the same bus wiring as digital AS-i devices instead of running separate analog cabling to the PLC." }
    ],
    faq: [
      { q: "Can the AC3216 accept sensors with different wire counts?",
        a: "Yes — it supports 2/3/4-wire sensor connections across its 4 analog current inputs, so mixed sensor types can connect to the same module." },
      { q: "Is this genuine ifm and in stock?",
        a: "Yes, in stock, genuine ifm, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ifm/ASiModule/AC3216/营销素材包/04-独立站内容包/AC3216.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "OMRON", model: "E6C2-CWZ6C 2500P/R", series: "E6C2-C", cat: "sensors", spec: "Incremental rotary encoder, 50mm body, 2500 pulses/revolution, NPN open-collector output, DC5-24V", status: "instock", photo: null, linkedin: null, sell_price: 46.97, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Incremental rotary encoder"],
      ["Body size", "50 mm"],
      ["Resolution", "2500 pulses/revolution"],
      ["Output", "NPN open-collector"],
      ["Power", "DC5-24V"],
      ["Series", "E6C2-C"]
    ],
    applications: [
      { icon: "🎯", title: "Speed/position feedback for motion control",
        desc: "2500PPR incremental encoder for speed and relative-position feedback on general motion-control axes and conveyor speed monitoring." }
    ],
    faq: [
      { q: "What output type does the E6C2-CWZ6C 2500P/R use?",
        a: "NPN open-collector output, 2500 pulses per revolution, wide DC5-24V supply range." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/Encoder/E6C2-CWZ6C-2500P_R/营销素材包/04-独立站内容包/E6C2-CWZ6C-2500P_R.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "OMRON", model: "R88M-K1K530H-S2", series: "G5", cat: "servo", spec: "G5 series AC servo motor, 1.5kW, 200V, 3000rpm, incremental encoder, keyed shaft", status: "instock", photo: null, linkedin: null, sell_price: 187.85, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Rated output", "1.5 kW"],
      ["Voltage", "200 V"],
      ["Rated speed", "3000 rpm"],
      ["Encoder", "Incremental"],
      ["Shaft", "Keyed"],
      ["Series", "G5"]
    ],
    applications: [
      { icon: "🏭", title: "Machine tool and material-handling axes",
        desc: "1.5kW-class G5 servo motor for mid-size positioning axes, keyed shaft suited to direct mechanical coupling without a clamp-type hub." }
    ],
    faq: [
      { q: "Is the R88M-K1K530H-S2 keyed or smooth shaft?",
        a: "Keyed shaft, per the -S2 suffix — confirm this matches your existing coupling before ordering, since OMRON G5 motors are also offered with smooth-shaft variants." },
      { q: "What OMRON drive pairs with this motor?",
        a: "G5-series motors pair with Accurax/G5-series servo drives — confirm your exact drive model with us before ordering." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/Servo/R88M-K1K530H-S2/营销素材包/04-独立站内容包/R88M-K1K530H-S2.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "Siemens", model: "6ES7193-6BP00-0DA0", series: "SIMATIC ET200SP", cat: "controllers", spec: "SIMATIC ET200SP BaseUnit, type BU15-P16+A0+2D, 24V DC/10A supply, FM/ATEX/IECEx certified for hazardous locations, made in Germany", status: "instock", photo: null, linkedin: null, sell_price: 44.99, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "SIMATIC ET200SP BaseUnit"],
      ["Variant", "BU15-P16+A0+2D"],
      ["Power", "24 V DC / 10 A supply"],
      ["Certification", "FM/ATEX/IECEx (hazardous locations)"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "⚠️", title: "Hazardous-location remote I/O",
        desc: "FM/ATEX/IECEx certification allows this ET200SP BaseUnit to be used in classified hazardous-area installations (oil & gas, chemical processing) where standard I/O bases aren't rated." }
    ],
    faq: [
      { q: "What does the BU15-P16+A0+2D variant code mean?",
        a: "It identifies this specific BaseUnit's power routing and terminal configuration within the ET200SP BaseUnit family — confirm compatibility with your specific I/O module before ordering if you're unsure." },
      { q: "Is this certified for hazardous-area installation?",
        a: "Yes, FM/ATEX/IECEx certified for hazardous locations — confirm the exact zone/division rating required for your installation against the certificate before purchase." },
      { q: "Is this genuine Siemens and in stock?",
        a: "Yes, in stock, genuine Siemens, made in Germany, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/BaseUnit/6ES7193-6BP00-0DA0/营销素材包/04-独立站内容包/6ES7193-6BP00-0DA0.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "OMRON", model: "CJ1W-NC413", series: "CJ1", cat: "controllers", spec: "CJ series position control unit, 4-axis pulse output (open collector), compatible with CJ1/CJ2 series PLC", status: "instock", photo: null, linkedin: null, sell_price: 313.11, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Position control unit"],
      ["Axes", "4-axis"],
      ["Output", "Pulse output (open collector)"],
      ["Compatibility", "CJ1/CJ2 series PLC"]
    ],
    applications: [
      { icon: "🤖", title: "Multi-axis pulse positioning",
        desc: "4-axis open-collector pulse output module for coordinating stepper/servo axes from a CJ1/CJ2-series OMRON PLC." }
    ],
    faq: [
      { q: "Does the CJ1W-NC413 work with both CJ1 and CJ2 PLCs?",
        a: "Yes, it's compatible with both the CJ1 and CJ2 series." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/PositioningModule/CJ1W-NC413/营销素材包/04-独立站内容包/CJ1W-NC413.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "Mitsubishi", model: "GS2107-WTBD-N", series: "GOT2000", cat: "hmi", spec: "GOT2000 series 7\" wide TFT touch panel, WVGA (800x480), DC24V, Ethernet port", status: "instock", photo: null, linkedin: null, sell_price: 145.6, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Screen", "7\" wide TFT touch panel"],
      ["Resolution", "WVGA (800×480)"],
      ["Power", "DC24V"],
      ["Communication", "Ethernet port"],
      ["Series", "GOT2000"]
    ],
    applications: [
      { icon: "🖥️", title: "Machine operator interface",
        desc: "GOT2000 is Mitsubishi's current HMI line — this 7\" WVGA model gives more screen resolution than the older GOT1000 generation at a comparable size." }
    ],
    faq: [
      { q: "What PLCs does the GS2107-WTBD-N connect to natively?",
        a: "GOT2000 supports Mitsubishi's FX/Q/L/iQ-R PLC families natively over its Ethernet port, plus multi-vendor protocols — confirm your exact PLC model with us if unsure of compatibility." },
      { q: "Is this genuine Mitsubishi and in stock?",
        a: "Yes, in stock, genuine Mitsubishi, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/HMI/GS2107-WTBD-N/营销素材包/04-独立站内容包/GS2107-WTBD-N.md
  { brand: "Mitsubishi", model: "A2USCPU-S1", series: "MELSEC-AnS", cat: "controllers", spec: "MELSEC-AnS series CPU module, 1024-point control scale, 14k-step program capacity. Discontinued — legacy stock sourced by Fouwell", status: "discont", photo: null, linkedin: null, sell_price: 64.35, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "CPU module"],
      ["I/O scale", "1024-point"],
      ["Program capacity", "14k steps"],
      ["Series", "MELSEC-AnS"],
      ["Lifecycle", "Discontinued — legacy stock only"]
    ],
    applications: [
      { icon: "🔧", title: "Legacy MELSEC-AnS machine maintenance",
        desc: "Sourced as legacy stock to keep older MELSEC-AnS-based machines running until a planned control system upgrade." }
    ],
    faq: [
      { q: "Is the A2USCPU-S1 still in production?",
        a: "No — MELSEC-AnS is a discontinued Mitsubishi series and we have not identified an official replacement CPU for it. Fouwell sources remaining legacy stock through our supplier network; send your application details and we'll confirm current availability." },
      { q: "What's the program capacity and I/O scale?",
        a: "14k program steps, 1024-point I/O control scale." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PLC/A2USCPU-S1/营销素材包/04-独立站内容包/A2USCPU-S1.md
  { brand: "OMRON", model: "CP2E-N60DT-D", series: "CP2E-N", cat: "controllers", spec: "CP2E-N series programmable controller, 36 digital inputs, 24 transistor (NPN) outputs, dual Ethernet ports", status: "instock", photo: null, linkedin: null, sell_price: 201.93, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Digital inputs", "36"],
      ["Digital outputs", "24 (transistor, NPN)"],
      ["Communication", "Dual Ethernet ports"],
      ["Series", "CP2E-N"]
    ],
    applications: [
      { icon: "🏭", title: "Mid-size machine control",
        desc: "36DI/24DO NPN-output CPU with dual Ethernet — enough I/O for a mid-complexity machine without expansion racks, and dual ports simplify daisy-chained network topology." }
    ],
    faq: [
      { q: "Why does the CP2E-N60DT-D have two Ethernet ports?",
        a: "Dual ports allow daisy-chaining multiple devices on the network without a separate switch — common in machine-level Ethernet/IP or EtherCAT-style topologies (confirm your protocol needs against the CP2E-N spec)." },
      { q: "Is this genuine OMRON and in stock?",
        a: "Yes, in stock, genuine OMRON, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/OMRON/PLC/CP2E-N60DT-D/营销素材包/04-独立站内容包/CP2E-N60DT-D.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "ABB", model: "DC522", series: "AC500", cat: "controllers", spec: "AC500 series S500 digital I/O module, 16 configurable DI/DO channels, 24VDC/0.5A", status: "instock", photo: null, linkedin: null, sell_price: 211.35, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Channels", "16 (configurable DI/DO)"],
      ["Power supply", "24 VDC"],
      ["Output current", "0.5 A"],
      ["Series", "AC500 (S500 I/O module)"]
    ],
    applications: [
      { icon: "🏭", title: "AC500 I/O expansion",
        desc: "16-channel configurable digital I/O expansion for an existing ABB AC500 PLC system." }
    ],
    faq: [
      { q: "Can each of the 16 channels be independently set as input or output?",
        a: "Yes — this is a configurable DI/DO module, each channel can be set as digital input or output per your application." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ABB/PLC/DC522/营销素材包/04-独立站内容包/DC522.md
  { brand: "ABB", model: "DI524", series: "AC500", cat: "controllers", spec: "AC500 series S500 digital input module, 32 DI channels, 24VDC, 1-wire", status: "instock", photo: null, linkedin: null, sell_price: 318.29, sell_price_currency: "USD", price_source: "web_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Channels", "32 DI"],
      ["Power supply", "24 VDC"],
      ["Wiring", "1-wire"],
      ["Series", "AC500 (S500 module)"]
    ],
    applications: [
      { icon: "🏭", title: "High-density digital input expansion",
        desc: "32-channel digital input expansion for an existing ABB AC500 PLC system, for machines with a large number of sensors/switches to monitor." }
    ],
    faq: [
      { q: "How many inputs does the DI524 provide?",
        a: "32 digital inputs, 24VDC, 1-wire connection." },
      { q: "Is this genuine ABB and in stock?",
        a: "Yes, in stock, genuine ABB, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ABB/PLC/DI524/营销素材包/04-独立站内容包/DI524.md
  { brand: "ABB", model: "SIF2-B28N-V 0,2-PO", series: "SIF2", cat: "sensors", spec: "Inductive proximity sensor, 2mm sensing distance, square PBT housing. Sourcing note: original part status disputed (see FAQ)", status: "instock", photo: null, linkedin: null, sell_price: 125.24, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Inductive proximity sensor"],
      ["Sensing distance", "2 mm"],
      ["Housing", "Square PBT"],
      ["Series", "SIF2"]
    ],
    applications: [
      { icon: "🔍", title: "Standard proximity detection",
        desc: "General-purpose square-body inductive sensor for presence/position detection on machine guards and indexing stations." }
    ],
    faq: [
      { q: "Is this a genuine ABB original part?",
        a: "We disclose this openly rather than assume: our sourcing inquiry recorded this part's status as active, but two independent quote sources both flagged it as a discontinued part with a replacement/compatible unit being what's actually available — not confirmed new-production ABB stock. We have not identified the specific replacement model. If you need a verified-genuine ABB original, tell us and we'll confirm sourcing options before you order; if a compatible equivalent is acceptable, we can proceed on that basis with the same disclosure to you in writing." },
      { q: "Why does the listing not say '100% Genuine ABB'?",
        a: "Because we can't currently back that specific claim for this part number — see the previous answer. We'd rather tell you the real sourcing picture than make a claim we can't stand behind." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ABB/ProximitySensor/SIF2-B28N-V_0,2-PO/营销素材包/04-独立站内容包/SIF2-B28N-V_0,2-PO.md
  { brand: "ASA-Schalttechnik", model: "SM 10 T17S", series: "SM 10", cat: "sensors", spec: "Limit switch, 250VAC 10A, IP65, order no. 8032 0629", status: "instock", photo: null, linkedin: null, sell_price: 81.41, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Limit switch"],
      ["Rating", "250VAC, 10A"],
      ["Protection", "IP65"],
      ["Order no.", "8032 0629"],
      ["Series", "SM 10"]
    ],
    applications: [
      { icon: "🔒", title: "Machine guard/position limit sensing",
        desc: "IP65-rated mechanical limit switch for end-of-travel or guard-interlock detection on machine axes and doors." }
    ],
    faq: [
      { q: "Is the SM 10 T17S rated for outdoor/washdown use?",
        a: "IP65-rated enclosure, suitable for dusty/washdown-prone environments subject to correct cable gland installation." },
      { q: "Is this genuine ASA-Schalttechnik and in stock?",
        a: "Yes, in stock, genuine ASA-Schalttechnik, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/ASA-Schalttechnik/LimitSwitch/SM_10_T17S/营销素材包/04-独立站内容包/SM_10_T17S.md
  { brand: "AlifTech", model: "AG-39DF", series: "AG-39", cat: "sensors", spec: "Magnetic switch, 2-wire electronic, normally open, T-slot mount", status: "instock", photo: null, linkedin: null, sell_price: 5.48, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Magnetic switch"],
      ["Wiring", "2-wire electronic"],
      ["Contact", "Normally open"],
      ["Mounting", "T-slot"],
      ["Series", "AG-39"]
    ],
    applications: [
      { icon: "🔩", title: "Pneumatic cylinder position sensing",
        desc: "T-slot mount magnetic reed/electronic switch for detecting piston position on T-slot pneumatic cylinders." }
    ],
    faq: [
      { q: "What cylinder mounting does the AG-39DF fit?",
        a: "T-slot mount, designed to slide into the T-slot groove on compatible pneumatic cylinders." },
      { q: "Is this genuine AlifTech and in stock?",
        a: "Yes, in stock, genuine AlifTech, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/AlifTech/MagneticSwitch/AG-39DF/营销素材包/04-独立站内容包/AG-39DF.md
  { brand: "Honeywell", model: "SZR-LY4-N1-AC220V", series: "SZR-LY", cat: "spares", spec: "Interposing relay, 4PDT (4NO/4NC), 10A, 220VAC coil, LED indicator", status: "instock", photo: null, linkedin: null, sell_price: 18.79, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Interposing relay"],
      ["Contact configuration", "4PDT (4NO/4NC)"],
      ["Rated current", "10A"],
      ["Coil voltage", "220VAC"],
      ["Indicator", "LED"],
      ["Series", "SZR-LY"]
    ],
    applications: [
      { icon: "🔌", title: "PLC output signal interposing",
        desc: "Isolates and amplifies a PLC's low-power output to switch a higher-current field load, protecting the PLC output card from direct load switching." }
    ],
    faq: [
      { q: "What does 4PDT (4NO/4NC) mean on the SZR-LY4-N1-AC220V?",
        a: "Four independent pole sets, each with one normally-open and one normally-closed contact — lets one relay switch up to 4 separate circuits (or provide both NO and NC signalling) from a single coil trigger." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Honeywell/Relay/SZR-LY4-N1-AC220V/营销素材包/04-独立站内容包/SZR-LY4-N1-AC220V.md
  { brand: "QUEEN", model: "MD-15WAG-SCS13-M16", series: "MD", cat: "spares", spec: "Solenoid valve, SCS13 stainless steel body, PT 1/2 port, DC24V, normally closed", status: "instock", photo: null, linkedin: null, sell_price: 29.75, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Solenoid valve"],
      ["Body material", "SCS13 stainless steel"],
      ["Port size", "PT 1/2"],
      ["Voltage", "DC24V"],
      ["Default state", "Normally closed"],
      ["Series", "MD"]
    ],
    applications: [
      { icon: "🏭", title: "Corrosion-resistant fluid control",
        desc: "SCS13 stainless-steel body suits process fluids or environments where a standard brass/aluminum valve body would corrode — food, chemical or marine-adjacent installations." }
    ],
    faq: [
      { q: "What makes the MD-15WAG-SCS13-M16 suited to corrosive environments?",
        a: "SCS13 stainless steel body construction resists corrosion from many process fluids and washdown environments that would attack a standard brass or aluminum valve body — confirm exact chemical compatibility for your specific media." },
      { q: "Is this in stock?",
        a: "Yes, in stock, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/QUEEN/SolenoidValve/MD-15WAG-SCS13-M16/营销素材包/04-独立站内容包/MD-15WAG-SCS13-M16.md

  // ---- generate-data-entry.js additions (2026-09-14) ----
  { brand: "Siemens", model: "6ES7131-6BH01-0BA0", series: "SIMATIC ET200SP", cat: "controllers", spec: "SIMATIC ET200SP digital input module, 16x24VDC, FM/ATEX/IECEx certified for hazardous locations, made in Germany", status: "instock", photo: null, linkedin: null, sell_price: 73.41, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "SIMATIC ET200SP digital input module"],
      ["Inputs", "16× 24VDC"],
      ["Certification", "FM/ATEX/IECEx (hazardous locations)"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "⚠️", title: "Hazardous-location digital input",
        desc: "FM/ATEX/IECEx-certified DI module for classified hazardous-area installations within an ET200SP remote I/O station." }
    ],
    faq: [
      { q: "Is this module certified for hazardous locations?",
        a: "Yes, FM/ATEX/IECEx certified — confirm the exact zone/division rating your installation requires against the certificate before purchase." },
      { q: "Is this genuine Siemens and in stock?",
        a: "Yes, in stock, genuine Siemens, made in Germany, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/IOModule/6ES7131-6BH01-0BA0/营销素材包/04-独立站内容包/6ES7131-6BH01-0BA0.md
  { brand: "Siemens", model: "3UF7020-1AU01-0", series: "SIMOCODE pro S", cat: "controllers", spec: "SIMOCODE pro S motor protection basic unit, AC110-240V, PROFIBUS DP, 2×NO auxiliary contacts, made in Germany", status: "instock", photo: null, linkedin: null, sell_price: 259.73, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "SIMOCODE pro S motor protection basic unit"],
      ["Voltage", "AC 110–240 V"],
      ["Communication", "PROFIBUS DP"],
      ["Contacts", "2× NO auxiliary"],
      ["Origin", "Germany"]
    ],
    applications: [
      { icon: "🏭", title: "Networked motor protection",
        desc: "SIMOCODE pro S combines motor protection with PROFIBUS DP communication, letting the PLC read motor status/diagnostics directly instead of just hard-wired trip contacts." }
    ],
    faq: [
      { q: "What does PROFIBUS DP give me over a standard overload relay?",
        a: "Direct digital motor status/diagnostics (current, trip cause, etc.) back to the PLC over the network, instead of only a hard-wired trip contact — useful for predictive maintenance and faster fault diagnosis." },
      { q: "Is this genuine Siemens and in stock?",
        a: "Yes, in stock, genuine Siemens, made in Germany, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/MotorProtection/3UF7020-1AU01-0/营销素材包/04-独立站内容包/3UF7020-1AU01-0.md
  { brand: "Siemens", model: "6ES7222-1HH32-0XB0", series: "SIMATIC S7-1200 SM1222", cat: "controllers", spec: "SIMATIC S7-1200 SM1222 digital output module, 16x relay, 30VDC/250VAC 2A/pt", status: "instock", photo: null, linkedin: null, sell_price: 105.81, sell_price_currency: "USD", price_source: "ebay_ref",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "SIMATIC S7-1200 SM1222 digital output module"],
      ["Outputs", "16× relay"],
      ["Rating", "30 VDC / 250 VAC, 2A per point"],
      ["Series", "S7-1200 signal modules"]
    ],
    applications: [
      { icon: "🏭", title: "S7-1200 relay output expansion",
        desc: "16 relay outputs add switching capacity for contactors, solenoids and pilot lights beyond an S7-1200 CPU's onboard transistor outputs — relay outputs also handle AC loads directly, unlike transistor outputs." }
    ],
    faq: [
      { q: "Can this module switch AC loads directly?",
        a: "Yes — relay outputs (unlike transistor outputs) can switch both AC (up to 250VAC) and DC (up to 30VDC) loads directly, rated 2A per point." },
      { q: "Does this fit any S7-1200 CPU?",
        a: "Yes, SM1222 signal modules are compatible across the S7-1200 CPU family (1211C/1212C/1214C/1215C/1217C)." },
      { q: "Is this genuine Siemens and in stock?",
        a: "Yes, in stock, genuine Siemens, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Siemens/PLC/6ES7222-1HH32-0XB0/营销素材包/04-独立站内容包/6ES7222-1HH32-0XB0.md

  // ---- generate-data-entry.js additions (2026-09-14) ----
  { brand: "Balluff", model: "BTL7-E570-M0400-K-SR32", series: "BTL7", cat: "sensors", spec: "Micropulse magnetostrictive displacement sensor, rod style, 4-20mA output, 400mm range, M12 8-pin", status: "instock", photo: null, linkedin: null, sell_price: 969.99, sell_price_currency: "USD", price_source: "procurement_quote_min",
    /* ---- 2026-09-18 batch enrichment: Tier C -> Tier B, Part1-3 chain applied ---- */
    specs: [
      ["Type", "Micropulse magnetostrictive displacement sensor"],
      ["Style", "Rod"],
      ["Output", "4-20mA"],
      ["Range", "400mm"],
      ["Connector", "M12 8-pin"],
      ["Series", "BTL7"]
    ],
    applications: [
      { icon: "📏", title: "Continuous position feedback on hydraulic cylinders",
        desc: "Magnetostrictive rod-style sensors are commonly installed inside a hydraulic cylinder bore for continuous, non-contact absolute position feedback without the wear of a contact potentiometer." },
      { icon: "🏭", title: "Linear axis position measurement",
        desc: "4-20mA analog output integrates directly into standard PLC analog input cards for linear position feedback on presses, injection molding machines and material-handling axes." }
    ],
    faq: [
      { q: "Is the BTL7-E570-M0400-K-SR32 contact or non-contact measurement?",
        a: "Non-contact — magnetostrictive rod sensors measure the position of a free-floating magnet along the rod without physical contact, avoiding the wear point of a contact-type potentiometer." },
      { q: "What's the measuring range and output signal?",
        a: "400mm range, 4-20mA analog output, M12 8-pin connector." },
      { q: "Is this genuine Balluff and in stock?",
        a: "Yes, in stock, genuine Balluff, ships within 24 hours." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Balluff/DisplacementSensor/BTL7-E570-M0400-K-SR32/营销素材包/04-独立站内容包/BTL7-E570-M0400-K-SR32.md

  // ---- generate-data-entry.js additions (2026-09-16) ----
  { brand: "Lenze", model: "EVS9324-ES", series: "9300", cat: "servo", spec: "9300 series servo inverter, 3.0kW, 3/PE AC 400-480V input, 7A output", status: "discont", photo: null, linkedin: null, sell_price: 1125.68, sell_price_currency: "USD", price_source: "procurement_quote_min",
    // 2026-09-16: dead-end EOL SKU — no official replacement identified, only sourcing lead is
    // refurbished stock (see wiki/marketing/Lenze/ServoAmplifier/EVS9324-ES/营销素材包/00-营销计划/plan.md).
    // These two fields make js/faq-templates.js / js/i18n-ru.js / build-product-pages(-ru).js /
    // main.js render honest copy instead of the default discont "replaced by a current
    // equivalent, genuine, official channels, original packaging" template.
    no_known_replacement: true,
    condition_note: 'The only sourcing lead we have found for this part number is refurbished stock, not new production.',
    condition_note_ru: 'Единственный найденный источник этой детали — восстановленные единицы, не новое производство.',
    specs: [
      ["Power", "3.0 kW"],
      ["Input", "3/PE AC 400–480 V"],
      ["Output current", "7 A"],
      ["Series", "9300"],
      ["Lifecycle", "Discontinued — no official replacement identified"]
    ],
    applications: [
      { icon: "🔧", title: "Legacy 9300-series machine maintenance",
        desc: "Sourced as refurbished stock to keep existing Lenze 9300-based servo axes running until a planned control system upgrade." }
    ],
    faq: [
      { q: "Is the EVS9324-ES still available, and is there a current-production replacement?",
        a: "The Lenze 9300 series has been discontinued and we have not identified an official replacement model for it. The only sourcing lead we've found is refurbished stock, not new production — send your application details and we'll confirm current availability and condition before you order." },
      { q: "What's the power/current rating?",
        a: "3.0kW rated power, 3/PE AC 400-480V input, 7A output current." }
    ]
  }, // generate-data-entry.js <- wiki/marketing/Lenze/ServoAmplifier/EVS9324-ES/营销素材包/04-独立站内容包/EVS9324-ES.md

];

/* ---- Brand wall — 35+ brands we supply
   `logo` points to a real PNG/SVG in assets/brands/; if missing, render text-only fallback.
   `color` is the brand's primary color, used to render the text logo with brand identity. */
const BRANDS = [
  { name: "Siemens",       country: "Germany",       logo: "/assets/brands/real/siemens.svg",    color: "#009999" },
  { name: "Schneider",     country: "France",        logo: "/assets/brands/real/schneider-electric.svg",  color: "#3DCD58" },
  { name: "ABB",           country: "Switzerland",   logo: "/assets/brands/real/abb.svg", color: "#FF000F" },
  { name: "Mitsubishi",    country: "Japan",         logo: "/assets/brands/real/mitsubishi.svg", color: "#E60012" },
  { name: "OMRON",         country: "Japan",         logo: "/assets/brands/real/omron.svg", color: "#1F3A93" },
  { name: "Yaskawa",       country: "Japan",         logo: "/assets/brands/real/yaskawa.ico", color: "#0F4C9C" },
  { name: "Panasonic",     country: "Japan",         logo: "/assets/brands/real/panasonic.svg", color: "#0F2D62" },
  { name: "Keyence",       country: "Japan",         logo: "/assets/brands/real/keyence.ico", color: "#E60012" },
  { name: "SICK",          country: "Germany",       logo: "/assets/brands/real/sick.svg", color: "#004A98" },
  { name: "Balluff",       country: "Germany",       logo: "/assets/brands/real/balluff.svg", color: "#000000" },
  { name: "ifm",           country: "Germany",       logo: "/assets/brands/real/ifm.svg", color: "#F39200" },
  { name: "Endress+Hauser",country: "Switzerland",   logo: "/assets/brands/real/endress-hauser.svg", color: "#005CA9" },
  { name: "Pepperl+Fuchs", country: "Germany",       logo: "/assets/brands/real/pepperl-fuchs.svg", color: "#E2001A" },
  { name: "Honeywell",     country: "USA",           logo: "/assets/brands/real/honeywell.svg", color: "#EE2A24" },
  { name: "TURCK",         country: "Germany",       logo: "/assets/brands/real/turck.svg", color: "#FECC00" },
  { name: "WIKA",          country: "Germany",       logo: "/assets/brands/real/wika.svg", color: "#005CA9" },
  { name: "NORD",          country: "Germany",       logo: "/assets/brands/real/nord.svg", color: "#004A98" },
  { name: "Autonics",      country: "Korea",         logo: "/assets/brands/real/autonics.svg", color: "#0066B3" },
  { name: "Baumer",        country: "Germany",       logo: "/assets/brands/real/baumer.svg", color: "#003D7E" },
  { name: "Fuji Electric", country: "Japan",         logo: "/assets/brands/real/fuji-electric.svg", color: "#DA251D" },
  { name: "Festo",         country: "Germany",       logo: "/assets/brands/real/festo.svg", color: "#007CC0" },
  { name: "SMC",           country: "Japan",         logo: "/assets/brands/real/smc.svg", color: "#0F4C9C" },
  { name: "Norgren",       country: "UK",            logo: "/assets/brands/real/norgren.ico", color: "#004A98" },
  { name: "AirTAC",        country: "Taiwan, China", logo: "/assets/brands/real/airtac.ico", color: "#005BAC" },
  { name: "Burkert",       country: "Germany",       logo: "/assets/brands/real/burkert.svg", color: "#1A3A6C" },
  { name: "Dungs",         country: "Germany",       logo: "/assets/brands/real/dungs.svg", color: "#003D7E" },
  { name: "ASCA",          country: "France",        logo: "/assets/brands/real/asca.svg", color: "#E2001A" },
  { name: "Danfoss",       country: "Denmark",       logo: "/assets/brands/real/danfoss.svg", color: "#003D7E" },
  { name: "Lenze",         country: "Germany",       logo: "/assets/brands/real/lenze.svg", color: "#005CA9" },
  { name: "Toshiba",       country: "Japan",         logo: "/assets/brands/real/toshiba.svg", color: "#FF0000" },
  { name: "Weidmüller",    country: "Germany",       logo: "/assets/brands/real/weidmuller.svg", color: "#006F4E" },
  { name: "Phoenix Contact", country: "Germany",     logo: "/assets/brands/real/phoenix-contact.svg", color: "#0F4C9C" },
  { name: "Legrand",       country: "France",        logo: "/assets/brands/real/legrand.svg", color: "#C8102E" },
  { name: "SKF",           country: "Sweden",        logo: "/assets/brands/real/skf.svg", color: "#003D7E" },
  { name: "Finder",        country: "Italy",         logo: "/assets/brands/real/finder.svg", color: "#005CA9" },
  { name: "ebm-papst",     country: "Germany",       logo: "/assets/brands/real/ebmpapst.svg", color: "#003D7E" },
  { name: "Leuze",         country: "Germany",       logo: "/assets/brands/real/leuze-electronic.svg", color: "#000000" },
  { name: "CHINT",         country: "China",         logo: "/assets/brands/real/chint.svg", color: "#E60012" },
  { name: "EUCHNER",       country: "Germany",       logo: "/assets/brands/real/euchner.svg", color: "#E2001A" },
  { name: "Delta",         country: "Taiwan, China", logo: "/assets/brands/real/delta-favicon.ico",     color: "#005BAC" },
  { name: "VEGA",          country: "Germany",       logo: "/assets/brands/real/vega.svg",           color: "#1678c3" },
  { name: "Kinco",         country: "China",         logo: "/assets/brands/real/kinco.svg",     color: "#005BAC" },
  { name: "Allen-Bradley", country: "USA",           logo: "/assets/brands/real/allen-bradley.svg", color: "#CC0000" }
];

/* ---- 10 Product categories — used on home page
   `img` is a representative product photo, used as a thumbnail for the category card. */
const CATEGORIES_HOME = [
  { id: "drives",   no: "01", title: "Drives & Motion Control", items: "VFDs · Servo Drives · Inverters · Soft Starters · Controllers",
    desc: "Complete drive lineup from 0.2kW to 22kW+, including vector and servo control.", img: "/assets/products/CIMR-AB4A0011FBA.jpg" },
  { id: "plc",      no: "02", title: "PLC & Automation",       items: "PLCs · I/O Modules · Industrial PCs",
    desc: "Modular PLCs, remote I/O and backplanes for machine and process control.", img: "/assets/products/6ES7212-1AE40-0XB0.jpg" },
  { id: "hmi",      no: "03", title: "HMI & Display",           items: "HMIs · Touch Panels · Industrial Monitors",
    desc: "Touchscreen panels from 4\" to 15\" with multi-protocol support.", img: "/assets/products/PFXGP4301TADW.jpg" },
  { id: "sensors",  no: "04", title: "Sensors & Instrumentation", items: "Proximity · Photoelectric · Pressure · Flow · Level",
    desc: "Inductive, photoelectric, radar level, pressure and encoder sensors.", img: "/assets/products/PS6X.2SWYDBXATKMKHAXXXXXXX.jpg" },
  { id: "motors",   no: "05", title: "Motors & Drives",          items: "AC Motors · Servo Motors · Gear Motors · Steppers",
    desc: "Servo, gear and stepper motors matched to drives for turnkey systems.", img: "/assets/products/R88M-KE75030H.jpg" },
  { id: "elec",     no: "06", title: "Electrical Components",    items: "MCBs · MCCBs · Contactors · Relays · Terminal Blocks",
    desc: "DIN-rail components, protection and switching for control cabinets.", img: "/assets/products/3RM1002-1AA04.jpg" },
  { id: "power",    no: "07", title: "Power Supply & Conversion", items: "Power Supplies · UPS · Converters · Transformers",
    desc: "Industrial-grade power supplies, DC-UPS and voltage conversion.", img: "/assets/products/3AFE68257913.jpg" },
  { id: "comm",     no: "08", title: "Industrial Communication",  items: "Industrial Gateways · Switches · Cabling · IoT · IIoT",
    desc: "Protocol gateways, managed switches and fieldbus cabling.", img: "/assets/products/SKH-F48.jpg" },
  { id: "pneu",     no: "09", title: "Pneumatics & Hydraulics",   items: "Valves · Cylinders · FRLs · Fittings · Solenoid Valves",
    desc: "Pneumatic and hydraulic components for actuators and motion.", img: "/assets/products/5GN-20-K.jpg" },
  { id: "gear",     no: "10", title: "Gear & Transmission Equipment", items: "Gearboxes · Gear Motors · Couplings · Reducers",
    desc: "Speed reducers, gear motors and couplings for torque transfer.", img: "/assets/products/5GN-20-K.jpg" }
];

const CATEGORIES = {
  controllers: "PLC & Controllers",
  hmi: "HMI & Panel PCs",
  servo: "Servo Systems",
  drives: "Drives & Starters",
  sensors: "Sensors & Instruments",
  spares: "Spare Parts & Components"
};

/* Brands stocked here that are disclosed compatible/non-OEM parts, not authentic branded
 * product (e.g. PWERUN's FX3U-instruction-set-compatible board, sold under `brand: "PWERUN"`
 * rather than "Mitsubishi" precisely so this distinction holds; "Generic" for parts with no
 * single identifiable manufacturer). buildMetaDescription() in js/main.js and
 * scripts/build-product-pages.js both read this to skip the "Genuine ..." claim — that word is
 * a factual OEM-authenticity assertion and would be false for these. Add a brand here whenever
 * a SKU is added under a brand name that itself signals "compatible/not OEM" rather than the
 * real manufacturer's name. */
const NON_GENUINE_BRANDS = new Set(["PWERUN", "Generic", "General"]);

const STATUS_LABEL = {
  instock: { label: "In Stock", cls: "instock" },
  legacy: { label: "Legacy Line", cls: "legacy" },
  discont: { label: "Replaced", cls: "discont" }
};
