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

  // ---- generate-data-entry.js additions (2026-09-18) ----
  { brand: "WECON", model: "LX3V-2TC-BD", series: "LX3V", cat: "controllers", spec: "WECON LX3V-2TC-BD board-type 2-channel thermocouple input expansion for LX3V series PLC, new sealed stock, 2 units", status: "instock", photo: null, linkedin: null, sell_price: 234.26, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/WECON/ExpansionBoard/LX3V-2TC-BD/营销素材包/04-独立站内容包/LX3V-2TC-BD.md

  // ---- generate-data-entry.js additions (2026-09-18) ----
  { brand: "WECON", model: "LX3V-1616MR-A", series: "LX3V", cat: "controllers", spec: "WECON LX3V-1616MR-A 32-point PLC host, 16 digital inputs, 16 relay outputs, dual serial ports, AC85-264V power, new sealed stock, 2 units", status: "instock", photo: null, linkedin: null, sell_price: 591.61, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/WECON/PLC/LX3V-1616MR-A/营销素材包/04-独立站内容包/LX3V-1616MR-A.md

  // ---- generate-data-entry.js additions (2026-09-18) ----
  { brand: "WECON", model: "PI3070ig-0", series: "PI3070", cat: "hmi", spec: "WECON PI3070ig-0 7-inch touchscreen HMI, 800x480 resolution, USB/Ethernet/dual serial ports, DC24V power, new sealed stock, 2 units", status: "instock", photo: null, linkedin: null, sell_price: 250.15, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/WECON/HMI/PI3070ig-0/营销素材包/04-独立站内容包/PI3070ig-0.md

  // ---- generate-data-entry.js additions (2026-09-22) ----
  { brand: "Lenze", model: "E82EV551K2C", series: "8200 vector", cat: "drives", spec: "0.55kW frequency inverter, 1x240V single-phase input, 8200 vector series, Made in France", status: "instock", photo: null, linkedin: null, sell_price: 375.24, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Lenze/Inverter/E82EV551K2C/营销素材包/04-独立站内容包/E82EV551K2C.md

  // ---- generate-data-entry.js additions (2026-09-22) ----
  { brand: "Generic", model: "S11-M3", series: "S11-M", cat: "sensors", spec: "Non-contact infrared thermometer, 0-500°C range, 24V DC, unbranded/OEM-spec, Made in China", status: "instock", photo: null, linkedin: null, sell_price: 131.47, sell_price_currency: "USD", price_source: "web_ref" }, // generate-data-entry.js <- wiki/marketing/Generic/TemperatureSensor/S11-M3/营销素材包/04-独立站内容包/S11-M3.md

  // ---- generate-data-entry.js additions (2026-09-22) ----
  { brand: "ImagingSource", model: "DMK-33GX264", series: "DMK 33G", cat: "sensors", spec: "GigE monochrome industrial camera, Sony Pregius IMX264, 2448x2048 (5MP), up to 24fps, PoE, Designed in Germany", status: "instock", photo: null, linkedin: null, sell_price: 914, sell_price_currency: "USD", price_source: "web_ref" }, // generate-data-entry.js <- wiki/marketing/ImagingSource/IndustrialCamera/DMK-33GX264/营销素材包/04-独立站内容包/DMK-33GX264.md

  // ---- generate-data-entry.js additions (2026-09-23) ----
  { brand: "Delta", model: "DOP-107EG", series: "DOP-100", cat: "hmi", spec: "7\" HMI touchscreen, 800x600, 65,535 colors, built-in Ethernet + 2 COM + 1 extension COM, CE/UL certified", status: "instock", photo: null, linkedin: null, sell_price: 329.75, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Delta/HMI/DOP-107EG/营销素材包/04-独立站内容包/DOP-107EG.md

  // ---- generate-data-entry.js additions (2026-09-24) ----
  { brand: "Delta", model: "DOP-110WS", series: "DOP-100", cat: "hmi", spec: "10.1\" widescreen HMI touchscreen, 1024x600 (WVGA), 16-bit color, Ethernet + 2 serial ports, UL/UKCA/CE/EAC certified", status: "instock", photo: null, linkedin: null, sell_price: 356.16, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Delta/HMI/DOP-110WS/营销素材包/04-独立站内容包/DOP-110WS.md

  // ---- generate-data-entry.js additions (2026-09-24) ----
  { brand: "Delta", model: "DVP08XN211R", series: "DVP-ES2", cat: "controllers", spec: "DVP-ES2 series 8-point relay output expansion module, 24VDC, 2.0A 250VAC, CE/UL/KC certified", status: "instock", photo: null, linkedin: null, sell_price: 119.91, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Delta/IOModule/DVP08XN211R/营销素材包/04-独立站内容包/DVP08XN211R.md

  // ---- generate-data-entry.js additions (2026-09-24) ----
  { brand: "Delta", model: "DVP20EX200R", series: "DVP-EX2", cat: "controllers", spec: "DVP-EX2 series compact PLC CPU, 8DI/6DO relay output, built-in 4AI/2AO, 32-bit CPU, CE/UL/EAC certified", status: "instock", photo: null, linkedin: null, sell_price: 287.43, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Delta/PLC/DVP20EX200R/营销素材包/04-独立站内容包/DVP20EX200R.md

  // ---- generate-data-entry.js additions (2026-10-07) ----
  { brand: "Weinview", model: "TK8071iP", series: "TK", cat: "hmi", spec: "Touchscreen HMI, 10.5–28 VDC nameplate input, COM1 RS232 / COM2 RS485 markings, USB-A and RJ45 connectors photographed", status: "instock", photo: null, linkedin: null, sell_price: 156.92, sell_price_currency: "USD", price_source: "ebay_ref", overview: "The Weinview TK8071iP is a touchscreen HMI. The photographed unit carries a 10.5–28V DC supply label and COM1 RS232 / COM2 RS485 markings. Fouwell has new original stock with actual unit photographs. For a replacement quote, provide the existing panel label, project backup details and communication wiring requirements.", overview_ru: "Weinview TK8071iP — сенсорная панель оператора. На шильдике указано питание 10,5–28 В DC; на корпусе обозначены COM1 RS232 и COM2 RS485. Новый оригинальный товар в наличии. Перед заказом замены сверьте резервную копию проекта, версию программного обеспечения и схему подключения. Для расчёта предложения отправьте фото шильдика, количество и страну доставки.", meta_description: "TK8071iP: 10.5–28V DC supply label. COM1 RS232 · COM2 RS485. Request a quote from Fouwell.", meta_description_ru: "TK8071iP: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Weinview/HMI/TK8071iP/营销素材包/04-独立站内容包/TK8071iP.md

  // ---- generate-data-entry.js additions (2026-10-07) ----
  { brand: "Kinco", model: "SZ7PE(10m)", series: "SZ", cat: "hmi", spec: "7-inch handheld HMI, 1024×600 resistive touchscreen, 10m cable version marked on the unit label", status: "instock", photo: null, linkedin: null, overview: "The Kinco SZ7PE(10m) is a handheld HMI with a 7-inch, 1024 × 600 display. Its label identifies the 10m cable version; actual length has not been measured. Fouwell has new original stock. Review cable termination, communication requirements and emergency-stop integration before ordering the terminal for your machine.", overview_ru: "Kinco SZ7PE(10m) — ручная панель оператора с экраном 7 дюймов, 1024 × 600. Маркировка указывает исполнение с кабелем 10 м; фактическая длина не измерялась. На фотографиях видны органы управления и концы кабеля. Новый оригинальный товар в наличии. Перед заказом проверьте подключение, требования к связи и схему аварийного останова.", meta_description: "SZ7PE(10m): 10m version on the unit label. 7-inch · 1024 × 600 display. Request a quote from Fouwell.", meta_description_ru: "SZ7PE(10m): новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Kinco/HMI/SZ7PE(10m)/营销素材包/04-独立站内容包/SZ7PE(10m).md

  // ---- generate-data-entry.js additions (2026-10-07) ----
  { brand: "Mitsubishi", model: "FX0N-3A", series: "FX0N", cat: "controllers", spec: "Analog I/O expansion block, 2 inputs and 1 output, 8-bit resolution; manufacturer-discontinued model, new original stock", status: "instock", photo: null, linkedin: null, sell_price: 146.99, sell_price_currency: "USD", price_source: "ebay_ref", overview: "The Mitsubishi FX0N-3A is an analog expansion module with two inputs, one output and 8-bit resolution. Both inputs must use the same signal characteristic. Fouwell has new original stock with actual photographs. Send the PLC CPU model and input/output signal requirements so the quotation can identify the required configuration.", overview_ru: "Mitsubishi FX0N-3A — аналоговый модуль с двумя входами, одним выходом и разрешением 8 бит. Оба входа должны использовать одинаковую характеристику сигнала. Новый оригинальный товар в наличии. Для проверки перед заказом сообщите точную модель ПЛК, типы обоих входных сигналов и требуемый выходной сигнал, а также количество и страну доставки.", meta_description: "FX0N-3A: 2 analog inputs · 1 output. Both inputs: same characteristic. Request a quote from Fouwell.", meta_description_ru: "FX0N-3A: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/IOModule/FX0N-3A/营销素材包/04-独立站内容包/FX0N-3A.md

  // ---- generate-data-entry.js additions (2026-10-07) ----
  { brand: "Yaskawa", model: "CIMR-VB4A0004BBA", series: "V1000", cat: "drives", spec: "V1000 AC drive, three-phase 380–480V input, 1.5kW/4.1A normal duty or 0.75kW/3.4A heavy duty, IP20; made in China", status: "instock", photo: null, linkedin: null, overview: "The Yaskawa CIMR-VB4A0004BBA is a V1000 variable-frequency drive for three-phase 380–480V supply. It is rated 1.5kW / 4.1A at normal duty and 0.75kW / 3.4A at heavy duty. Fouwell has new original stock. Include the motor nameplate and load duty when requesting a replacement quote.", overview_ru: "Yaskawa CIMR-VB4A0004BBA — преобразователь частоты V1000 для трёхфазного питания 380–480 В. Номиналы: 1,5 кВт / 4,1 А при нормальной нагрузке и 0,75 кВт / 3,4 А при тяжёлой нагрузке. Новый оригинальный товар в наличии. Перед заказом сопоставьте ток двигателя, напряжение питания и режим нагрузки. Отправьте шильдик двигателя для расчёта предложения.", meta_description: "CIMR-VB4A0004BBA: Normal duty: 1.5kW · 4.1A. Heavy duty: 0.75kW · 3.4A. Request a quote from Fouwell.", meta_description_ru: "CIMR-VB4A0004BBA: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Yaskawa/Inverter/CIMR-VB4A0004BBA/营销素材包/04-独立站内容包/CIMR-VB4A0004BBA.md

  // ---- generate-data-entry.js additions (2026-10-07) ----
  { brand: "Yaskawa", model: "CIMR-AC4A0139AAA", series: "A1000", cat: "drives", spec: "A1000 AC drive, 400V three-phase, 75kW/139A normal duty or 55kW/112A heavy duty; box marked Made in UK", status: "instock", photo: null, linkedin: null, sell_price: 7049, sell_price_currency: "USD", price_source: "ebay_ref", overview: "The Yaskawa CIMR-AC4A0139AAA is a 400V-class A1000 variable-frequency drive. Its normal-duty rating is 75kW / 139A; its heavy-duty rating is 55kW / 112A. Fouwell has new original stock with actual photographs. Compare the motor current against the required duty, then send both nameplates for a quotation.", overview_ru: "Yaskawa CIMR-AC4A0139AAA — преобразователь частоты A1000 класса 400 В. Номиналы: 75 кВт / 139 А при нормальной нагрузке и 55 кВт / 112 А при тяжёлой нагрузке. Новый оригинальный товар в наличии. Для подбора замены отправьте шильдики двигателя и установленного привода, укажите режим нагрузки, количество и страну доставки.", meta_description: "CIMR-AC4A0139AAA: Normal duty: 75kW · 139A. Heavy duty: 55kW · 112A. Request a quote from Fouwell.", meta_description_ru: "CIMR-AC4A0139AAA: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Yaskawa/Inverter/CIMR-AC4A0139AAA/营销素材包/04-独立站内容包/CIMR-AC4A0139AAA.md

  // ---- generate-data-entry.js additions (2026-10-08) ----
  { brand: "Yaskawa", model: "CIMR-AC4A0165AAA", series: "A1000", cat: "drives", spec: "A1000 AC drive, 400V three-phase, 90kW/165A normal duty or 75kW/150A heavy duty; box marked Made in UK", status: "instock", photo: null, linkedin: null, sell_price: 10777.64, sell_price_currency: "USD", price_source: "ebay_ref", overview: "The Yaskawa CIMR-AC4A0165AAA is a 400V-class A1000 variable-frequency drive rated 90kW / 165A at normal duty and 75kW / 150A at heavy duty. Fouwell has new original stock. Keep the complete 0165 model code in the request and confirm the motor current and duty before ordering.", overview_ru: "Yaskawa CIMR-AC4A0165AAA — преобразователь частоты A1000 класса 400 В. Номиналы: 90 кВт / 165 А при нормальной нагрузке и 75 кВт / 150 А при тяжёлой нагрузке. Новый оригинальный товар в наличии. Указывайте полный код модели при сравнении предложений. Перед заказом проверьте ток двигателя и режим нагрузки.", meta_description: "CIMR-AC4A0165AAA: Normal duty: 90kW · 165A. Heavy duty: 75kW · 150A. Request a quote from Fouwell.", meta_description_ru: "CIMR-AC4A0165AAA: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Yaskawa/Inverter/CIMR-AC4A0165AAA/营销素材包/04-独立站内容包/CIMR-AC4A0165AAA.md

  // ---- generate-data-entry.js additions (2026-10-08) ----
  { brand: "OMRON", model: "CJ1W-OD262", series: "CJ1W", cat: "controllers", spec: "64-point PNP sourcing transistor output unit, 12–24V DC, 0.3A/point, 1.6A/common and 6.4A/unit; two MIL40 interfaces; made in China", status: "instock", photo: null, linkedin: null, sell_price: 212.64, sell_price_currency: "USD", price_source: "ebay_ref", overview: "The OMRON CJ1W-OD262 is a digital output module with 64 PNP sourcing outputs for 12–24V DC loads and two 40-pin MIL interfaces. Mating connectors are not standard accessories. Fouwell has new original stock. Specify output wiring, load current and required connectors in the quotation request.", overview_ru: "OMRON CJ1W-OD262 — модуль с 64 транзисторными выходами PNP для нагрузок 12–24 В DC и двумя 40-контактными интерфейсами MIL. Ответные разъёмы не входят в стандартную комплектацию. Новый оригинальный товар в наличии. Перед заказом проверьте тип выходов, ток нагрузки и требуемые разъёмы. Укажите их в запросе вместе с количеством и страной доставки.", meta_description: "CJ1W-OD262: 64 PNP sourcing outputs. 12–24V DC · 2 × 40-pin MIL. Request a quote from Fouwell.", meta_description_ru: "CJ1W-OD262: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/OMRON/IOModule/CJ1W-OD262/营销素材包/04-独立站内容包/CJ1W-OD262.md

  // ---- generate-data-entry.js additions (2026-10-08) ----
  { brand: "Siemens", model: "6AV6644-0AA01-2AX0", series: "MP377", cat: "hmi", spec: "12.1-inch TFT resistive touchscreen, 800 × 600 pixels, 24V DC; SIMATIC MP 377; WinCC flexible 2007 or later; made in Germany", status: "instock", photo: null, linkedin: null, sell_price: 998, sell_price_currency: "USD", price_source: "user_confirmed", overview: "The Siemens 6AV6644-0AA01-2AX0 is an MP377 12 Touch operator panel with a 12.1-inch, 800 × 600 resistive display and 24V DC supply. Fouwell has new original stock. For a replacement, review the order number, project backup and engineering-software version together before placing the order.", overview_ru: "Siemens 6AV6644-0AA01-2AX0 — панель MP377 12 Touch с резистивным экраном 12,1 дюйма, разрешением 800 × 600 и питанием 24 В DC. Новый оригинальный товар в наличии. Для замены на действующем оборудовании проверьте заказной номер, резервную копию проекта и версию инженерного ПО. Отправьте эти данные, количество и страну доставки для расчёта предложения.", meta_description: "6AV6644-0AA01-2AX0: MP377 12 Touch · 12.1-inch. 800 × 600 · 24V DC. Request a quote from Fouwell.", meta_description_ru: "6AV6644-0AA01-2AX0: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Siemens/HMI/6AV6644-0AA01-2AX0/营销素材包/04-独立站内容包/6AV6644-0AA01-2AX0.md

  // ---- generate-data-entry.js additions (2026-10-08) ----
  { brand: "Delta", model: "VFD015M21A", series: "VFD-M", cat: "drives", spec: "1.5kW (2HP) VFD-M drive; 200–240V AC single/three-phase input; three-phase 0–240V output, 7A; 0.1–400Hz; made in China", status: "instock", photo: null, linkedin: null, sell_price: 60.5, sell_price_currency: "USD", price_source: "user_confirmed", overview: "The Delta VFD015M21A is a 1.5kW VFD-M variable-frequency drive with 200–240V AC input and three-phase 0–240V output rated 7A. Fouwell has new original stock. Send the supply phase and voltage with the motor nameplate so the electrical requirements can be reviewed before ordering.", overview_ru: "Delta VFD015M21A — преобразователь частоты VFD-M мощностью 1,5 кВт с входом 200–240 В AC и трёхфазным выходом 0–240 В, 7 А. Новый оригинальный товар в наличии. Перед заказом сопоставьте напряжение и фазность питания с шильдиком двигателя. Отправьте фотографии обоих шильдиков, количество и страну доставки для расчёта предложения.", meta_description: "VFD015M21A: 1.5kW · 200–240V AC input. Three-phase 0–240V output · 7A. Request a quote from Fouwell.", meta_description_ru: "VFD015M21A: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Delta/Inverter/VFD015M21A/营销素材包/04-独立站内容包/VFD015M21A.md

  // ---- generate-data-entry.js additions (2026-10-08) ----
  { brand: "Siemens", model: "3RT1016-1BB42", series: "SIRIUS-3RT10", cat: "spares", spec: "SIRIUS 3-pole contactor, AC-3 9A / 4kW at 400V, 24V DC coil, 1 NC auxiliary contact, size S00, screw terminals; made in Germany", status: "instock", photo: null, linkedin: null, sell_price: 42.46, sell_price_currency: "USD", price_source: "ebay_reference", overview: "The Siemens 3RT1016-1BB42 is a three-pole SIRIUS contactor with a 24V DC coil and one normally closed auxiliary contact. Its AC-3 rating at 400V is 9A / 4kW. Fouwell has new original stock. Check the control voltage and auxiliary wiring alongside the motor load before ordering.", overview_ru: "Siemens 3RT1016-1BB42 — трёхполюсный контактор SIRIUS с катушкой 24 В DC и одним нормально замкнутым вспомогательным контактом. Номинал AC-3 при 400 В составляет 9 А / 4 кВт. Новый оригинальный товар в наличии. Перед заказом проверьте напряжение катушки, вспомогательную цепь и категорию нагрузки. Отправьте шильдик установленного контактора для расчёта предложения.", meta_description: "3RT1016-1BB42: 24V DC coil · A1+ / A2-. 1 NC auxiliary · terminals 21–22. Request a quote from Fouwell.", meta_description_ru: "3RT1016-1BB42: новый оригинальный товар в наличии. Отправьте шильдик и требования для расчёта предложения Fouwell." }, // generate-data-entry.js <- wiki/marketing/Siemens/Contactor/3RT1016-1BB42/营销素材包/04-独立站内容包/3RT1016-1BB42.md

  {"brand": "Eaton", "model": "XTCE250L22C", "series": "XT", "cat": "spares", "spec": "XT IEC 3-pole non-reversing contactor, 250A, 250–500V AC control supply at 40–60Hz, 2NO+2NC auxiliary contacts; 132kW at 400V AC-3; made in Romania", "status": "instock", "photo": null, "linkedin": null, "sell_price": 3187.74, "sell_price_currency": "USD", "price_source": "web_ref:median_of_2", "overview": "The Eaton XTCE250L22C is a three-pole, non-reversing IEC contactor rated 250A with two normally open and two normally closed auxiliary contacts. The photographed carton identifies DILM250/22(RAC500), a 250–500V AC control supply and 132kW at 400V AC-3. New original stock is available. Check the control circuit before requesting a quote.", "overview_ru": "Eaton XTCE250L22C — трёхполюсный нереверсивный контактор на 250 А с вспомогательными контактами 2НО и 2НЗ. На коробке указаны DILM250/22(RAC500), питание управления 250–500 В AC, 40–60 Гц и мощность двигателя 132 кВт при 400 В, AC-3. Новый оригинальный товар в наличии. Перед заказом сверьте напряжение управления и схему вспомогательных контактов.", "meta_description": "Eaton XTCE250L22C 250A contactor with 250–500V AC control supply and 2NO/2NC auxiliary contacts. View actual photographs and request a quote.", "meta_description_ru": "Контактор Eaton XTCE250L22C, 250 А, питание управления 250–500 В AC, контакты 2НО/2НЗ. Фотографии изделия и запрос предложения."},

  // ---- generate-data-entry.js additions (2026-10-16) ----
  { brand: "Siemens", model: "6ES7952-1AK00-0AA0", series: "SIMATIC S7-400", cat: "controllers", spec: "Siemens SIMATIC S7-400 RAM memory card, 1 Mbyte, long design", status: "instock", photo: null, linkedin: null, sell_price: 94.37, sell_price_currency: "USD", price_source: "user_confirmed" }, // generate-data-entry.js <- wiki/marketing/Siemens/PLCAccessory/6ES7952-1AK00-0AA0/营销素材包/04-独立站内容包/6ES7952-1AK00-0AA0.md

  // ---- generate-data-entry.js additions (2026-10-16) ----
  { brand: "ABB", model: "1SAZ201108R0001", series: "TA-TF", cat: "spares", spec: "ABB DB25/25A single mounting kit for the TA25DU thermal overload relay; the relay is sold separately", status: "instock", photo: null, linkedin: null, sell_price: 30, sell_price_currency: "USD", price_source: "user_provided" }, // generate-data-entry.js <- wiki/marketing/ABB/RelayAccessory/1SAZ201108R0001/营销素材包/04-独立站内容包/1SAZ201108R0001.md

  // ---- generate-data-entry.js additions (2026-10-21) ----
  { brand: "ABB", model: "1SAZ211201R2040", series: "TA25DU", cat: "spares", spec: "TA25DU-8.5M thermal overload relay, 6.0–8.5 A setting range, Class 10A", status: "quote", photo: null, linkedin: null, overview: "ABB 1SAZ211201R2040 identifies the TA25DU-8.5M thermal overload relay. The ABB catalog lists a 6.0–8.5 A setting range and Class 10A. Check motor full-load current and the exact contactor model against ABB selection data before ordering. Availability and commercial terms are confirmed per enquiry.", overview_ru: "ABB 1SAZ211201R2040 — заказной номер теплового реле перегрузки TA25DU-8.5M. В каталоге ABB указаны диапазон настройки 6,0–8,5 A и класс срабатывания 10A. Перед заказом сверьте номинальный ток двигателя и точную модель контактора с данными ABB. Наличие и условия продажи уточняются по запросу.", meta_description: "ABB 1SAZ211201R2040 TA25DU-8.5M thermal overload relay, 6.0–8.5 A, Class 10A. Check motor current and contactor model. Availability on request.", meta_description_ru: "ABB 1SAZ211201R2040 TA25DU-8.5M, тепловое реле перегрузки 6,0–8,5 A, класс 10A. Сверьте ток двигателя и контактор. Наличие уточняется.", authenticity_note: "Confirm the offered unit's source, condition and available documentation for the exact batch before ordering.", authenticity_note_ru: "Перед заказом уточните происхождение, состояние и доступные документы именно для предлагаемой партии.", sell_price: 28, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/ABB/OverloadRelay/1SAZ211201R2040/营销素材包/04-独立站内容包/1SAZ211201R2040.md

  // ---- generate-data-entry.js additions (2026-10-22) ----
  { brand: "ABB", model: "1SAZ211201R2045", series: "TA25DU", cat: "spares", spec: "TA25DU-14M thermal overload relay, 10.0–14.0 A setting range, Class 10A", status: "quote", photo: null, linkedin: null, overview: "ABB 1SAZ211201R2045 identifies the TA25DU-14M thermal overload relay. ABB lists a 10.0–14.0 A setting range and Class 10A. Verify motor full-load current and the exact contactor model before selection. Availability and commercial terms are confirmed per enquiry.", overview_ru: "ABB 1SAZ211201R2045 — заказной номер теплового реле перегрузки TA25DU-14M. В каталоге ABB указан диапазон настройки 10.0–14.0 A и класс срабатывания 10A. Перед выбором проверьте номинальный ток двигателя и точную модель контактора. Наличие и условия продажи уточняются по запросу.", meta_description: "ABB 1SAZ211201R2045 TA25DU-14M thermal overload relay, 10.0–14.0 A, Class 10A. Check motor current and contactor model. Availability on request.", meta_description_ru: "ABB 1SAZ211201R2045 TA25DU-14M, тепловое реле перегрузки 10.0–14.0 A, класс 10A. Проверьте ток двигателя и модель контактора. Наличие уточняется.", authenticity_note: "Confirm the offered batch source, condition and available documentation before ordering.", authenticity_note_ru: "Перед заказом уточните происхождение, состояние и документы именно для предлагаемой партии.", sell_price: 21.17, sell_price_currency: "USD", price_source: "web_ref" }, // generate-data-entry.js <- wiki/marketing/ABB/OverloadRelay/1SAZ211201R2045/营销素材包/04-独立站内容包/1SAZ211201R2045.md
  { brand: "ABB", model: "1SAZ211201R2047", series: "TA25DU", cat: "spares", spec: "TA25DU-19M thermal overload relay, 13.0–19.0 A setting range, Class 10A", status: "quote", photo: null, linkedin: null, overview: "ABB 1SAZ211201R2047 identifies the TA25DU-19M thermal overload relay. ABB lists a 13.0–19.0 A setting range and Class 10A. Verify motor full-load current and the exact contactor model before selection. Availability and commercial terms are confirmed per enquiry.", overview_ru: "ABB 1SAZ211201R2047 — заказной номер теплового реле перегрузки TA25DU-19M. В каталоге ABB указан диапазон настройки 13.0–19.0 A и класс срабатывания 10A. Перед выбором проверьте номинальный ток двигателя и точную модель контактора. Наличие и условия продажи уточняются по запросу.", meta_description: "ABB 1SAZ211201R2047 TA25DU-19M thermal overload relay, 13.0–19.0 A, Class 10A. Check motor current and contactor model. Availability on request.", meta_description_ru: "ABB 1SAZ211201R2047 TA25DU-19M, тепловое реле перегрузки 13.0–19.0 A, класс 10A. Проверьте ток двигателя и модель контактора. Наличие уточняется.", authenticity_note: "Confirm the offered batch source, condition and available documentation before ordering.", authenticity_note_ru: "Перед заказом уточните происхождение, состояние и документы именно для предлагаемой партии.", sell_price: 29.87, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/ABB/OverloadRelay/1SAZ211201R2047/营销素材包/04-独立站内容包/1SAZ211201R2047.md

  // ---- generate-data-entry.js additions (2026-10-26) ----
  { brand: "Mitsubishi", model: "MR-J2S-100A", series: "MELSERVO-J2S", cat: "servo", spec: "1 kW servo amplifier, general-purpose interface, 3-phase 200–230 VAC input, 170 V / 6.0 A output", status: "instock", photo: null, linkedin: null, overview: "The Mitsubishi MR-J2S-100A is a 1 kW MELSERVO-J2S servo amplifier with a general-purpose interface. The main supply is three-phase 200–230 VAC, 50/60 Hz. New original units are in stock at USD 6,934 each. Compare your amplifier, motor, wiring and parameters before ordering; migration requires a separate engineering review.", overview_ru: "Mitsubishi MR-J2S-100A — сервоусилитель MELSERVO-J2S мощностью 1 кВт с универсальным интерфейсом. Основное питание: трёхфазное, 200–230 В переменного тока, 50/60 Гц. Новый оригинальный товар в наличии, цена 6 934 доллара США за единицу. Перед заказом проверьте модель двигателя, подключение и параметры; модернизация требует отдельной инженерной оценки.", meta_description: "Mitsubishi MR-J2S-100A 1 kW servo amplifier. New original, in stock, USD 6,934. Compare motor, wiring and full model before ordering.", meta_description_ru: "Mitsubishi MR-J2S-100A, сервоусилитель 1 кВт. Новый оригинальный товар в наличии, 6 934 USD. Проверьте двигатель, подключение и полную модель.", sell_price: 6934, sell_price_currency: "USD", price_source: "internal" }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/ServoAmplifier/MR-J2S-100A/营销素材包/04-独立站内容包/MR-J2S-100A.md

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"OMRON","model":"H3DK-GE","series":"H3DK","cat":"spares","spec":"Star-delta timer, 240–440 VAC, t1 1–12 or 10–120 s, t2 0.05/0.1/0.25/0.5 s, DIN rail","status":"instock","photo":null,"linkedin":null,"overview":"OMRON H3DK-GE is a 240–440 VAC, 50/60 Hz DIN rail star-delta timer. Star time uses 1–12 or 10–120 s ranges; transfer delay has four fixed selections. The photographed unit is marked Made in China. New original units are in stock at USD 164.25 each. Confirm control voltage, contact load and timing before ordering.","overview_ru":"OMRON H3DK-GE — реле времени «звезда–треугольник» с питанием 240–440 В AC, 50/60 Гц, для DIN-рейки. Время «звезда»: 1–12 или 10–120 с; пауза переключения имеет четыре фиксированных значения. На показанном изделии указано Made in China. Новый оригинальный товар в наличии, 164,25 USD за единицу. Проверьте напряжение управления, нагрузку контактов и настройки.","meta_description":"OMRON H3DK-GE star-delta timer, 240–440 VAC. New original, in stock, USD 164.25. Check t1, t2 and contact load before ordering.","meta_description_ru":"OMRON H3DK-GE, реле «звезда–треугольник», 240–440 В AC. Новый оригинал в наличии, 164,25 USD. Проверьте время и нагрузку контактов.","sell_price":164.25,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which power supply does H3DK-GE use?","a":"240–440 VAC at 50/60 Hz. Check the GE suffix; G and GA variants have different power ratings."},{"q":"How are star time and transfer delay set?","a":"Star time t1 uses 1–12 or 10–120 seconds. Select transfer delay t2 from 0.05, 0.1, 0.25 or 0.5 seconds."},{"q":"Which contact ratings apply to the GE model?","a":"Ith is 2 A. AC-15 ratings are 1.5 A at 120 VAC, 1 A at 240 VAC and 0.3 A at 440 VAC. Check the contactor control load and circuit design."},{"q":"What is the condition, price and origin?","a":"New original units are in stock at USD 164.25 each, as confirmed by Fouwell. The photographed unit and box are marked Made in China; OMRON is a Japanese brand. Confirm available quantity in the quotation."},{"q":"Will it fit my existing starter?","a":"Compare the full model, control voltage, timing ranges, terminal connections and contactor load before selecting a replacement. Direct compatibility is not assumed."},{"q":"How can I request a quote?","a":"Visit https://www.fouwell.com/ with the full model, supply voltage, required timing, quantity and destination. Shipping, delivery and warranty terms are confirmed in the quotation."}],"reviews_verified":false,"order_terms_note":"New original, in stock. USD 164.25 per unit. Available quantity, inspection documents, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 164,25 USD за единицу. Количество, документы проверки, доставка, сроки и гарантия уточняются в коммерческом предложении."}, // H3DK-GE verified facts and order terms

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand": "Panasonic", "model": "MUMA042P1S", "series": "MINAS-E", "cat": "servo", "spec": "MINAS E servo motor, 400 W, 1.3 N·m, 3000 r/min, 2500 P/r incremental encoder, no holding brake", "status": "instock", "photo": "MUMA042P1S/photos/MUMA042P1S_01.jpg", "linkedin": null, "overview": "Panasonic MUMA042P1S is a discontinued MINAS E servo motor rated at 400 W, 1.3 N·m and 3000 r/min. It uses a 2500 P/r incremental encoder and has no holding brake. New original units are in stock at CNY 950 each. Compare the complete motor and driver codes before ordering.", "overview_ru": "Panasonic MUMA042P1S — снятый с производства серводвигатель MINAS E: 400 Вт, 1,3 Н·м, 3000 об/мин. Инкрементальный энкодер 2500 имп./об.; удерживающий тормоз отсутствует. Новый оригинальный товар в наличии по цене 950 CNY за единицу. Перед заказом проверьте полные обозначения двигателя и сервопривода.", "meta_description": "Panasonic MUMA042P1S MINAS E servo motor, 400 W, 1.3 N·m, 3000 rpm. New original, in stock at CNY 950. Confirm motor and driver codes.", "sell_price": 950, "sell_price_currency": "CNY", "price_source": "internal", "faq": [{"q": "What are the main ratings of MUMA042P1S?", "a": "400 W, 1.3 N·m rated torque and 3000 r/min rated speed; maximum speed is 5000 r/min. The encoder is incremental, 2500 P/r."}, {"q": "Why does the label say 114 V while the catalogue says 200 V?", "a": "The catalogue specifies a 200 V voltage class, while the photographed motor nameplate reads three-phase AC 114 V, 2.5 A. These are different references. Use the specified servo driver and official wiring instructions; do not connect the motor directly to mains."}, {"q": "Does this model have a brake and oil seal?", "a": "The official MUMA042P1S specification lists neither a holding brake nor an oil seal. Check the full suffix, shaft and machine requirements when selecting a replacement."}, {"q": "Which drivers are listed by Panasonic?", "a": "Panasonic lists MLDET2310P and MLDET2510P, both discontinued. Confirm driver code, power supply, encoder interface, wiring and parameters. A matching power rating alone does not establish compatibility."}, {"q": "Is it discontinued, and what stock is offered?", "a": "Panasonic marks this model discontinued. Fouwell confirms new original units in stock at CNY 950 per unit. The photographed motor is marked Made in China. Available quantity, shipping and warranty terms are confirmed in the quotation."}, {"q": "What should I send for a quotation?", "a": "Send the complete motor model, current driver model, nameplate photos, required quantity and destination through https://www.fouwell.com/. No direct replacement model is confirmed."}], "reviews_verified": false, "origin": "China", "order_terms_note": "New original, in stock. CNY 950 per unit. Available quantity, inspection documents, shipping, delivery and warranty terms are confirmed in the quotation.", "order_terms_note_ru": "Новый оригинальный товар в наличии, 950 CNY за единицу. Количество, документы проверки, доставка, сроки и гарантия уточняются в предложении.", "order_terms_by_quote": true}, // MUMA042P1S verified facts and native CNY price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"Siemens","model":"6ES7215-1AG40-0XB0","series":"S7-1200","cat":"controllers","spec":"S7-1200 CPU 1215C DC/DC/DC, 24 V DC, 14 DI, 10 transistor DO, 2 AI, 2 AO, 2 PROFINET ports","status":"instock","photo":"6ES7215-1AG40-0XB0/photos/6ES7215-1AG40-0XB0_01.jpg","linkedin":null,"overview":"Siemens 6ES7215-1AG40-0XB0 is a SIMATIC S7-1200 CPU 1215C in the DC/DC/DC variant, with 14 digital inputs, 10 transistor outputs and two PROFINET ports. The photographed packaging shows FS05 and FS08, both labelled FW V04.05.00. New original units are in stock at CNY 2000 each. Confirm the required hardware and project versions before ordering.","overview_ru":"Siemens 6ES7215-1AG40-0XB0 — контроллер SIMATIC S7-1200 CPU 1215C DC/DC/DC: 14 дискретных входов, 10 транзисторных выходов и два порта PROFINET. На показанных упаковках указаны FS05 и FS08, обе с FW V04.05.00. Новый оригинальный товар в наличии по 2000 CNY за единицу. Перед заказом согласуйте аппаратную версию и версию проекта.","meta_description":"Siemens 6ES7215-1AG40-0XB0 CPU 1215C DC/DC/DC. New original, in stock at CNY 2000. Confirm FS, firmware and project requirements.","meta_description_ru":"Siemens 6ES7215-1AG40-0XB0 CPU 1215C DC/DC/DC. Новый оригинал в наличии, 2000 CNY. Проверьте FS, прошивку и проект TIA Portal.","sell_price":2000,"sell_price_currency":"CNY","price_source":"internal","faq":[{"q":"Which CPU variant is 6ES7215-1AG40-0XB0?","a":"It is the SIMATIC S7-1200 CPU 1215C DC/DC/DC. It uses DC power, DC digital inputs and DC transistor outputs. Confirm the full AG40 order code; relay-output versions use different codes."},{"q":"What onboard I/O and network ports does it have?","a":"14 digital inputs at 24 V DC, 10 digital outputs at 24 V DC rated 0.5 A, two 0–10 V analog inputs, two 0–20 mA analog outputs and two PROFINET ports."},{"q":"What do the photographed FS and FW labels show?","a":"The packaging photos show FS05 and FS08 hardware states, both labelled FW V04.05.00. Confirm the hardware state to be supplied and the installed firmware before dispatch. Packaging labels do not establish project compatibility."},{"q":"Will it work with my existing TIA Portal project?","a":"Provide the CPU order code, required firmware/device version, TIA Portal version and project details for checking. Do not assume compatibility or load a project solely because CPU 1215C appears on the box."},{"q":"What are the condition, origin and price?","a":"Fouwell confirms new original stock at CNY 2000 per unit. The photographed boxes are marked Made in Germany. Available quantity, actual supplied hardware state, shipping and warranty terms are confirmed in the quotation."},{"q":"Do the photos show a powered test?","a":"No. These six photographs show packaging and labels. They do not show the CPU body, internal accessories, online diagnostics or a powered functional test. Send the full model, version requirements, quantity and destination through https://www.fouwell.com/ for a quote."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"Germany","order_terms_note":"New original, in stock. CNY 2000 per unit. Available quantity, inspection documents, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 2000 CNY за единицу. Количество, документы проверки, доставка, сроки и гарантия уточняются в предложении."}, // 6ES7215-1AG40-0XB0 verified facts and native CNY price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"Siemens","model":"6SL3210-5BB17-5BV1","series":"SINAMICS-V20","cat":"drives","spec":"SINAMICS V20, 0.75 kW, single-phase 200–240 V AC input, three-phase 4.2 A output, C1 filter, USS/Modbus RTU","status":"instock","photo":"6SL3210-5BB17-5BV1/photos/6SL3210-5BB17-5BV1_01.jpg","linkedin":null,"overview":"Siemens 6SL3210-5BB17-5BV1 is a 0.75 kW SINAMICS V20 frequency converter with single-phase 200–240 V AC input, three-phase output and an integrated C1 filter. The photographed packaging lists 4.2 A output and FS12/FW03.98.02. New original units are in stock at CNY 1200 each. Confirm motor data and supply requirements before ordering.","overview_ru":"Siemens 6SL3210-5BB17-5BV1 — преобразователь частоты SINAMICS V20 мощностью 0,75 кВт: однофазный вход 200–240 В AC, трёхфазный выход и встроенный фильтр C1. На упаковке указаны выходной ток 4,2 А и FS12/FW03.98.02. Новый оригинальный товар в наличии по 1200 CNY за единицу. Перед заказом проверьте параметры двигателя и питания.","meta_description":"Siemens 6SL3210-5BB17-5BV1 V20, 0.75 kW, single-phase 200–240 V input, C1 filter. New original, in stock, CNY 1200. Check motor data.","meta_description_ru":"Siemens 6SL3210-5BB17-5BV1 V20, 0,75 кВт, однофазный вход 200–240 В, фильтр C1. Новый оригинал в наличии, 1200 CNY. Проверьте двигатель.","sell_price":1200,"sell_price_currency":"CNY","price_source":"internal","faq":[{"q":"What supply does 6SL3210-5BB17-5BV1 require?","a":"Single-phase 200–240 V AC input. The packaging lists 10 A input and 50/60 Hz. This is not a three-phase 380–480 V input model; compare the complete order code and site supply."},{"q":"What motor output is specified?","a":"0.75 kW / 1 hp, three-phase output, 4.2 A on the photographed label. Output voltage is 0 to input voltage. Confirm the motor nameplate voltage, current, connection and application requirements."},{"q":"Does this variant include a filter?","a":"Yes. Siemens identifies this exact BV1 model as having an integrated C1 filter. Check the installation and EMC instructions; the filter does not establish compliance for every installation."},{"q":"Which interfaces and controls are provided?","a":"Siemens lists USS / Modbus RTU, a built-in BOP, 4 digital inputs, 2 digital outputs, 2 analog inputs and 1 analog output. Confirm parameter settings and wiring for the application."},{"q":"What do the stock photos and price cover?","a":"Fouwell confirms new original stock at CNY 1200 per unit. The photos show packaging marked Made in China, FS12 and FW03.98.02. They do not show an opened inverter or a powered test. Quantity, supplied configuration, shipping and warranty are confirmed in the quotation."},{"q":"Can I replace any 0.75 kW inverter with it?","a":"No direct interchangeability is assumed. Send the existing full model, supply, motor nameplate, control requirements, quantity and destination through https://www.fouwell.com/. Check current, voltage, filter, dimensions, wiring and parameters before selecting a replacement."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. CNY 1200 per unit. Available quantity, inspection documents, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 1200 CNY за единицу. Количество, документы проверки, доставка, сроки и гарантия уточняются в предложении."}, // 6SL3210-5BB17-5BV1 verified facts and native CNY price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"ENGLER","model":"SSM.1.B1.300.61.S4","series":"SSM","cat":"sensors","spec":"Float level switch, SSM series, article G109391, threaded mounting body and right-angle plug connector","status":"instock","photo":"SSM.1.B1.300.61.S4/photos/SSM.1.B1.300.61.S4_01.jpg","linkedin":null,"overview":"ENGLER SSM.1.B1.300.61.S4 is a float level switch identified by article number G109391 on the photographed label. The photos show the rod, float, threaded mounting body and right-angle plug connector. New original units are in stock at USD 326 each. Confirm the exact drawing, contact rating and medium conditions before ordering.","overview_ru":"ENGLER SSM.1.B1.300.61.S4 — поплавковый выключатель уровня с артикулом G109391 на показанной этикетке. На фото видны шток, поплавок, резьбовое крепление и угловой разъём. Новый оригинальный товар в наличии по 326 USD за единицу. Перед заказом согласуйте точный чертёж, нагрузку контактов и параметры рабочей среды.","meta_description":"ENGLER SSM.1.B1.300.61.S4 float level switch, G109391. New original, in stock, USD 326. Confirm the exact drawing and medium conditions.","meta_description_ru":"ENGLER SSM.1.B1.300.61.S4, поплавковый выключатель G109391. Новый оригинал в наличии, 326 USD. Согласуйте чертёж и рабочую среду.","sell_price":326,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which exact model and article number are offered?","a":"SSM.1.B1.300.61.S4, with A.No. G109391 on the photographed ENGLER label. Include both identifiers when asking for a replacement."},{"q":"What can be checked in the photographs?","a":"The photos show the identification label, threaded mounting body, rod, float and right-angle plug connector. They do not show a measured switching point, electrical load test or operation in a liquid."},{"q":"Does 300 establish the overall installation length?","a":"Do not use the model code alone as a measured overall length. Confirm the drawing for G109391, the mounting reference, switching point and required insertion dimensions before ordering."},{"q":"Can generic SSM contact ratings and wiring be used?","a":"Confirm the electrical rating and terminal diagram for this exact .61 version. An SSM datasheet for a different design is not sufficient to establish its voltage, current, pinout or switching action."},{"q":"Which liquids and conditions are suitable?","a":"Provide the medium, density, temperature, pressure and required switching function. Confirm wetted materials, seal, float suitability and installation orientation against the exact manufacturer specification; suitability for every liquid is not assumed."},{"q":"What are the condition, origin and price?","a":"Fouwell confirms new original stock at USD 326 per unit. The photographed label is marked Made in Germany. Available quantity, exact supplied configuration, inspection, delivery and warranty terms are confirmed in the quotation. Send both model and G109391 with your quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"Germany","order_terms_note":"New original, in stock. USD 326 per unit. Available quantity, inspection documents, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 326 USD за единицу. Количество, документы проверки, доставка, сроки и гарантия уточняются в предложении."}, // SSM.1.B1.300.61.S4 verified facts and native CNY price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"Pilz","model":"PNOZXV1P-777602","series":"PNOZ-X","cat":"spares","spec":"Safety relay, 24 V DC, 2 instantaneous N/O + 1 delayed N/O safety contact, adjustable 1–30s release delay, 22.5 mm","status":"instock","photo":"PNOZXV1P-777602/photos/PNOZXV1P-777602_05.jpg","linkedin":null,"overview":"Pilz PNOZ XV1P 777602 is a 24 V DC safety relay with two instantaneous normally open contacts and one delayed normally open contact. Its release delay is adjustable from 1 to 30 seconds. The 22.5 mm unit uses plug-in screw terminals. New original stock is available at USD 280 per unit.","overview_ru":"Pilz PNOZ XV1P 777602 — реле безопасности на 24 В DC с двумя нормально разомкнутыми контактами мгновенного действия и одним нормально разомкнутым контактом с задержкой отключения. Задержка регулируется от 1 до 30 с. Ширина 22,5 мм, съёмные винтовые клеммы. Новый оригинальный товар в наличии по 280 USD за единицу.","meta_description":"Pilz PNOZ XV1P 777602 safety relay, 24 V DC, 2 instantaneous N/O and 1 delayed N/O, 1–30s. New original, in stock at USD 280.","meta_description_ru":"Pilz PNOZ XV1P 777602, реле безопасности 24 В DC, два мгновенных НО и один НО с задержкой 1–30 с. Новый оригинал в наличии, 280 USD.","sell_price":280,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which exact PNOZ XV1P version is offered?","a":"Order number 777602, designated PNOZ XV1P 30/24VDC 2n/o 1n/o t. Match the order number and full designation when requesting a replacement."},{"q":"What is the supply voltage?","a":"24 V DC, with 3.5 W DC power consumption. These values appear on the photographed label and in the Pilz product data."},{"q":"Which contacts are instantaneous and delayed?","a":"The relay has two instantaneous normally open safety contacts and one delayed normally open safety contact. The photographed front identifies 13–14 and 23–24 as instantaneous outputs and 37–38 as the delayed output. Follow the manufacturer manual for the application wiring."},{"q":"What delay range applies to 777602?","a":"Pilz lists a release time of 1–30 seconds for 777602. The photographed unit has a seconds dial up to 30. Confirm the required delay and exact order number rather than selecting by the PNOZ XV1P family name alone."},{"q":"Does the relay alone establish machine safety compliance?","a":"The unit supports monitoring of E-STOP, safety gates and light curtains. The complete safety function, input wiring, start/reset arrangement, contact loading and selected delay must be designed and validated for the machine using the manufacturer documentation."},{"q":"What are the condition, origin and price?","a":"Fouwell confirms new original stock at USD 280 per unit. This photographed batch is marked Made in France. Available quantity, delivery, shipping and warranty terms are confirmed in the quotation. Send order number 777602, required delay, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"France","order_terms_note":"New original, in stock. USD 280 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 280 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // Pilz 777602 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"ABB","model":"1SBL281074R8010","series":"AX","cat":"spares","spec":"AX32-30-10-80 contactor, 3 poles + 1 N/O auxiliary, AC-3 32A / 15kW at 380–400V, coil 220–230V 50Hz / 230–240V 60Hz","status":"instock","photo":"1SBL281074R8010/photos/1SBL281074R8010_03.jpg","linkedin":null,"overview":"ABB 1SBL281074R8010 is the AX32-30-10-80 three-pole contactor with one built-in normally open auxiliary contact. Its AC coil is rated 220–230 V at 50 Hz or 230–240 V at 60 Hz. Motor duty is 32 A, 15 kW at 380–400 V AC. New original stock is USD 65 per unit.","overview_ru":"ABB 1SBL281074R8010 — трёхполюсный контактор AX32-30-10-80 с одним встроенным нормально разомкнутым вспомогательным контактом. Катушка: 220–230 В AC при 50 Гц или 230–240 В AC при 60 Гц. Для нагрузки AC-3: 32 А, 15 кВт при 380–400 В AC. Новый оригинальный товар в наличии по 65 USD за единицу.","meta_description":"ABB AX32-30-10-80 / 1SBL281074R8010, AC-3 32A 15kW at 400V. Coil 220–230V 50Hz / 230–240V 60Hz. New original stock, USD 65.","meta_description_ru":"ABB AX32-30-10-80 / 1SBL281074R8010, AC-3 32 А, 15 кВт при 400 В. Катушка 220–230 В 50 Гц / 230–240 В 60 Гц. Новый оригинал, 65 USD.","sell_price":65,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which ABB type corresponds to 1SBL281074R8010?","a":"The product ID corresponds to AX32-30-10-80. Match both the complete type and product ID when sourcing a replacement; AX32 alone does not identify the coil version."},{"q":"What coil voltage does the -80 version use?","a":"The photographed R80 coil is marked 220–230 V AC at 50 Hz and 230–240 V AC at 60 Hz. Confirm both the control voltage and frequency. The 690 V insulation marking is not the coil supply rating."},{"q":"How many main and auxiliary contacts are fitted?","a":"Three normally open main poles and one built-in normally open auxiliary contact. The front shows 1L1/3L2/5L3, 2T1/4T2/6T3 and auxiliary 13NO/14NO. Additional contact blocks and overload relays are separate configuration items."},{"q":"What do the 32 A and 55 A ratings mean?","a":"For motor duty AC-3 at 380–400 V AC, the rating is 32 A and 15 kW. The label also states 55 A for AC-1 duty. Select by the actual load category, voltage and operating conditions rather than treating 55 A as the motor-duty rating."},{"q":"What country of origin is shown on this batch?","a":"The photographed carton and side label are marked Made in China. The ABB France address on the label is a company address. Regional catalogue origin information can differ; this offer records the marking on the photographed batch."},{"q":"What are the condition, stock and price?","a":"Fouwell confirms new original stock at USD 65 per unit. Available quantity, supplied accessories, shipping, delivery and warranty terms are confirmed in the quotation. Send 1SBL281074R8010 or AX32-30-10-80, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. USD 65 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 65 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // ABB AX32 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-27) ----
  {"brand":"ABB","model":"1SBL931074R8010","series":"AX","cat":"spares","spec":"AX25-30-10-80 contactor, 3 poles + 1 N/O auxiliary, AC-3 25A / 11kW at 380–400V, R80 coil 220–230V 50Hz / 230–240V 60Hz","status":"instock","photo":"1SBL931074R8010/photos/1SBL931074R8010_05.jpg","linkedin":null,"overview":"ABB 1SBL931074R8010 is the AX25-30-10-80 three-pole AC contactor with one built-in normally open auxiliary contact. Its motor-duty rating is 25 A, 11 kW at 380–400 V AC. The R80 coil uses 220–230 V at 50 Hz or 230–240 V at 60 Hz. New original stock is USD 85 per unit.","overview_ru":"ABB 1SBL931074R8010 — трёхполюсный контактор AX25-30-10-80 с одним встроенным нормально разомкнутым вспомогательным контактом. Номинал AC-3: 25 А, 11 кВт при 380–400 В AC. Катушка R80: 220–230 В при 50 Гц или 230–240 В при 60 Гц. Новый оригинальный товар в наличии по 85 USD за единицу.","meta_description":"ABB AX25-30-10-80 / 1SBL931074R8010, AC-3 25A 11kW at 400V. R80 coil 220–230V 50Hz / 230–240V 60Hz. New original stock, USD 85.","meta_description_ru":"ABB AX25-30-10-80 / 1SBL931074R8010, AC-3 25 А, 11 кВт при 400 В. Катушка R80 220–230 В 50 Гц / 230–240 В 60 Гц. Новый оригинал, 85 USD.","sell_price":85,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which type matches ABB product ID 1SBL931074R8010?","a":"It identifies AX25-30-10-80. Use the complete type and product ID together when requesting a replacement. AX25 alone does not specify the coil voltage or auxiliary-contact arrangement."},{"q":"Is AX25 rated 25 A or 32 A?","a":"The photographed label shows 25 A for AC-3 motor duty at 380–400 V AC and 32 A for AC-1 duty. Motor power at 380–400 V AC is 11 kW. Choose by the actual utilization category, voltage and operating conditions; the two current ratings are not interchangeable."},{"q":"What supply does the R80 coil require?","a":"220–230 V AC at 50 Hz or 230–240 V AC at 60 Hz, as shown on the coil and carton. Match both voltage and frequency to the control supply. The Ui 690 V marking is an insulation rating, not a coil supply value."},{"q":"What contacts and accessories are included in the type?","a":"Three normally open main poles and one built-in normally open auxiliary contact at 13–14. Additional contact blocks, overload relays and interlocks must be selected and quoted separately for the intended assembly."},{"q":"Where was the photographed batch made?","a":"The carton and side label are marked Made in China. The ABB France address identifies a company location and does not change the batch origin. Regional catalogue origin information can differ from the photographed units."},{"q":"What are the condition, availability and price?","a":"Fouwell confirms new original stock at USD 85 per unit. Available quantity, supplied accessories, inspection, shipping, delivery and warranty terms are confirmed in the quotation. Send 1SBL931074R8010 or AX25-30-10-80, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. USD 85 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 85 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // ABB AX25 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-28) ----
  {"brand":"ABB","model":"1SFL991074R8611","series":"AX","cat":"spares","spec":"AX150-30-11-86 contactor, 3 poles, AC-3 150A / 75kW at 380–400V, mounted 1NO + 1NC auxiliary, coil 400–415V 50Hz / 415–440V 60Hz","status":"instock","photo":"1SFL991074R8611/photos/1SFL991074R8611_06.jpg","linkedin":null,"overview":"ABB 1SFL991074R8611 is the AX150-30-11-86 three-pole contactor, rated AC-3 150 A and 75 kW at 380–400 V AC. It has one N/O and one N/C auxiliary contact. Coil code 86 uses 400–415 V at 50 Hz or 415–440 V at 60 Hz. New original stock is USD 130 per unit.","overview_ru":"ABB 1SFL991074R8611 — трёхполюсный контактор AX150-30-11-86 с номиналом AC-3 150 А, 75 кВт при 380–400 В AC. Вспомогательные контакты: 1 НО + 1 НЗ. Катушка 86: 400–415 В при 50 Гц или 415–440 В при 60 Гц. Новый оригинальный товар в наличии по 130 USD за единицу.","meta_description":"ABB AX150-30-11-86 / 1SFL991074R8611, AC-3 150A 75kW at 400V, 1NO+1NC auxiliaries. Coil 400–415V 50Hz / 415–440V 60Hz. USD 130.","meta_description_ru":"ABB AX150-30-11-86 / 1SFL991074R8611: AC-3 150 А, 75 кВт при 400 В, 1НО+1НЗ. Катушка 400–415 В 50 Гц / 415–440 В 60 Гц. 130 USD.","sell_price":130,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which ABB type corresponds to 1SFL991074R8611?","a":"It identifies AX150-30-11-86. Retain the complete product ID and type when requesting a replacement, since the auxiliary-contact arrangement and coil code are part of the configuration."},{"q":"What supply is required by coil code 86?","a":"400–415 V AC at 50 Hz or 415–440 V AC at 60 Hz. These values appear on the photographed coil and carton. Match both voltage and frequency; this is a different coil version from the 220–230 V / 50 Hz AX contactors."},{"q":"What are the main and auxiliary contacts?","a":"Three normally open main poles, with one normally open and one normally closed mounted auxiliary contact. A CAL18X-11 side-mounted block is visible in the photos. Confirm the supplied assembly and required terminal arrangement in the quotation."},{"q":"How do the 150 A and 190 A ratings differ?","a":"For motor duty AC-3 at 380–400 V AC, the rating is 150 A and 75 kW. The side label lists 190 A for AC-1 duty. Select using the application voltage, utilization category and operating conditions rather than treating these two ratings as interchangeable."},{"q":"Where was this batch made and what do the photos show?","a":"The carton and device side label are marked Made in China. The photos show identification, main terminals, coil and auxiliary block. They do not show an energized coil, contact timing or load testing. A company address in Sweden is not the batch origin."},{"q":"What are the condition, availability and price?","a":"Fouwell confirms new original stock at USD 130 per unit. Available quantity, supplied accessories, inspection, shipping, delivery and warranty terms are confirmed in the quotation. Send 1SFL991074R8611 or AX150-30-11-86, control-supply details, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. USD 130 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 130 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // ABB AX150 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-28) ----
  {"brand":"ABB","model":"2CDS212001R0164","series":"SH200","cat":"spares","spec":"SH202-C16 miniature circuit breaker, SH200 family, 2 poles, 16A, C curve, 400V AC / 6kA front marking","status":"instock","photo":"2CDS212001R0164/photos/2CDS212001R0164_03.jpg","linkedin":null,"overview":"ABB 2CDS212001R0164 is the SH202-C16 miniature circuit breaker from the SH200 family. This two-pole, C-curve device has a rated current of 16 A and front markings of 400 V AC and 6 kA. The photographed side label is marked Made in China. Fouwell confirms new original stock at USD 80 per unit.","overview_ru":"ABB 2CDS212001R0164 — автоматический выключатель SH202-C16 серии SH200: 2 полюса, номинальный ток 16 А, характеристика C. На лицевой маркировке указаны 400 В AC и 6 кА. На боковой маркировке партии указано Made in China. Новый оригинальный товар в наличии по 80 USD за единицу.","meta_description":"ABB 2CDS212001R0164 SH202-C16, 2-pole 16A C-curve miniature circuit breaker. New original stock, USD 80. Request a quotation from Fouwell.","meta_description_ru":"ABB 2CDS212001R0164 SH202-C16: автоматический выключатель, 2 полюса, 16 А, характеристика C. Новый оригинальный товар в наличии, 80 USD.","sell_price":80,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"Which type corresponds to 2CDS212001R0164?","a":"The ABB product ID corresponds to SH202-C16, a two-pole 16 A C-curve miniature circuit breaker in the SH200 family. Use the complete product ID and type in a replacement request."},{"q":"What does C16 mean?","a":"C identifies the tripping characteristic and 16 identifies the rated current in amperes. Match both when comparing an installed breaker. The SH202 family name alone does not establish the required current rating."},{"q":"What voltage and breaking-capacity markings are shown?","a":"The C16 front in the batch photograph is marked 400 V AC and 6000 (6 kA). Confirm the applicable manufacturer standard, circuit conditions and protection coordination before specifying a replacement. These markings do not establish a DC rating."},{"q":"What should I check before ordering a replacement?","a":"Send the complete part number, required poles and current characteristic, circuit voltage, installation details and quantity. Confirm installation dimensions and the required protection arrangement against manufacturer documentation. This listing does not establish residual-current protection or accessory compatibility."},{"q":"Where was the photographed batch made?","a":"The side label showing 2CDS212001R0164 and EAN 4016779631105 is marked Made in China. The Heidelberg, Germany company address on the same label is separate from the country-of-origin marking. Public photos are selected side identification views."},{"q":"What are the condition, availability and price?","a":"Fouwell confirms new original stock at USD 80 per unit. Available quantity, inspection, shipping, delivery and warranty terms are confirmed in the quotation. Send 2CDS212001R0164 or SH202-C16, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. USD 80 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 80 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // ABB SH202-C16 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-28) ----
  {"brand":"Siemens","model":"3TK2834-1BB40","series":"3TK28","cat":"spares","spec":"SIRIUS 3TK28 two-hand control safety relay, 24V DC, 2NO + 2NC, 45mm, screw terminals; phased-out model with stock available","status":"instock","photo":"3TK2834-1BB40/photos/3TK2834-1BB40_03.jpg","linkedin":null,"overview":"Siemens 3TK2834-1BB40 is a SIRIUS 3TK28 safety relay for two-hand control. The photographed unit is marked 24 V DC, with two N/O and two N/C contacts and screw terminals. Siemens lists the model as phased out. Fouwell confirms new original stock at USD 860 per unit. The batch is marked Made in Germany.","overview_ru":"Siemens 3TK2834-1BB40 — реле безопасности SIRIUS 3TK28 для двуручного управления. Маркировка: питание 24 В DC, контакты 2 НО + 2 НЗ, винтовые клеммы. Модель снята с производства. Fouwell подтверждает новый оригинальный товар в наличии по 860 USD за единицу. На партии указано Made in Germany.","meta_description":"Siemens 3TK2834-1BB40 two-hand control safety relay, 24V DC, 2NO+2NC, screw terminals. Phased-out model, new original stock at USD 860.","meta_description_ru":"Siemens 3TK2834-1BB40: реле двуручного управления, 24 В DC, 2 НО+2 НЗ, винтовые клеммы. Снятая с производства модель, новый оригинал в наличии, 860 USD.","sell_price":860,"sell_price_currency":"USD","price_source":"internal","faq":[{"q":"What is Siemens 3TK2834-1BB40?","a":"It is a SIRIUS 3TK28 safety relay for two-hand control. The carton identifies a two-hand control unit, and the front and side labels carry the complete 3TK2834-1BB40 order number. Match the complete suffix when sourcing an installed unit."},{"q":"What control voltage does this version use?","a":"The photographed front and carton are marked 24 V DC. The supply terminals are identified A1+ and A2−. Compare the supply type and full order number with the installed device; a different 3TK28 suffix may represent another version."},{"q":"What contact arrangement and terminals are shown?","a":"The carton states 2NO 2NC, and the front diagram identifies 13–14, 23–24, 31–32 and 41–42. The unit has screw terminals. Confirm the required circuit function and terminal mapping from the applicable Siemens operating instructions before replacement."},{"q":"Is this model discontinued, and is 3SK a direct replacement?","a":"Siemens marks 3TK2834-1BB40 as phased out and points to the 3SK family as the preferred successor direction. A specific replacement order number and wiring equivalence have not been established here. Migration requires application and circuit review; our stock offer is for the original 3TK2834-1BB40."},{"q":"What do the photographs establish about this batch?","a":"The side and carton labels show Made in Germany, E03 and EAN 4011209385726. The six photos show the carton, front, side identification and terminals. They do not demonstrate an energized device, two-hand timing or safety-function validation. The side label references instructions 3ZX1012-0TK28-7CA1."},{"q":"What are the condition, availability and price?","a":"Fouwell confirms new original stock at USD 860 per unit. Available quantity, inspection, supplied items, shipping, delivery and warranty terms are confirmed in the quotation. Send the full order number, required quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"Germany","order_terms_note":"New original, in stock. USD 860 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 860 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // Siemens 3TK2834 verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-28) ----
  {"brand":"OMRON","model":"CP2E-N60DR-D","series":"CP2E","cat":"controllers","spec":"CP2E network-model PLC CPU, 60 I/O (36DI + 24 relay outputs), 24V DC, 2 Ethernet ports, 2 option positions, 10 ksteps","status":"instock","photo":"CP2E-N60DR-D/photos/CP2E-N60DR-D_05.jpg","linkedin":null,"overview":"OMRON CP2E-N60DR-D is a CP2E network-model compact PLC CPU with 36 digital inputs and 24 relay outputs. It uses a 24 V DC supply and has two built-in Ethernet ports. The photographed unit is version 1.0 and marked Made in China. Fouwell confirms new original stock at CNY 1,600 per unit.","overview_ru":"OMRON CP2E-N60DR-D — компактный ПЛК CP2E сетевого исполнения: 36 дискретных входов и 24 релейных выхода. Питание 24 В DC, два встроенных порта Ethernet. На аппарате указаны версия 1.0 и Made in China. Fouwell подтверждает новый оригинальный товар в наличии по 1 600 CNY за единицу.","meta_description":"OMRON CP2E-N60DR-D network PLC CPU, 36DI/24 relay outputs, 24V DC and dual Ethernet. New original stock at CNY 1,600. Request a quotation.","meta_description_ru":"OMRON CP2E-N60DR-D: сетевой ПЛК, 36 входов, 24 релейных выхода, 24 В DC, два Ethernet. Новый оригинальный товар в наличии, 1 600 CNY.","sell_price":1600,"sell_price_currency":"CNY","price_source":"internal","faq":[{"q":"What is OMRON CP2E-N60DR-D?","a":"It is a CP2E network-model compact PLC CPU unit with 60 built-in I/O points: 36 digital inputs and 24 relay outputs. Retain the complete CP2E-N60DR-D model when comparing a replacement or preparing a quotation."},{"q":"Does this version use DC supply and relay outputs?","a":"Yes. The photographed side label states SOURCE 24 V DC, 20 W, and the manufacturer lists relay outputs for this model. Match both the CPU supply and output type against the installed controller. Relay and transistor variants are different configurations."},{"q":"What Ethernet and option positions are provided?","a":"The manufacturer lists two built-in Ethernet ports and two option-module positions. The photographed front identifies PORT1A and PORT1B, and the port close-up shows two RJ45 sockets. Option covers in a photo do not establish that optional serial or analog modules are included."},{"q":"What is the program capacity and what should be checked for migration?","a":"The manufacturer product listing specifies 10 ksteps of program memory. Before replacement, confirm the existing project, required functions, communication settings, expansion units and software requirements against the applicable CP2E documentation. This listing does not establish a drop-in replacement for another CP-series CPU."},{"q":"What do the batch photographs show?","a":"The carton and device side label identify CP2E-N60DR-D, version 1.0, lot 31726M and Made in China. Six photos show the carton and papers, front, terminals, side label and Ethernet ports. They do not show a running project, communication test or loaded relay-output test. Carton quantity 1 is a packing marking rather than available stock quantity."},{"q":"What are the condition, availability and selling price?","a":"Fouwell confirms new original stock at CNY 1,600 per unit. This is a selling price in Chinese yuan. Available quantity, optional modules, inspection, shipping, delivery and warranty terms are confirmed in the quotation. Send CP2E-N60DR-D, required configuration, quantity and destination through https://www.fouwell.com/."}],"order_terms_by_quote":true,"reviews_verified":false,"origin":"China","order_terms_note":"New original, in stock. CNY 1,600 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.","order_terms_note_ru":"Новый оригинальный товар в наличии, 1 600 CNY за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."}, // OMRON CP2E verified nameplate and internal USD price

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "Mean Well", model: "EDR-75-12", series: "EDR-75", cat: "spares", spec: "The MEAN WELL EDR-75-12 is a single-output DIN-rail switching power supply rated for 100–240 VAC input and 12 V DC / 6.3 A output, with 75.6 W rated power", status: "instock", photo: "EDR-75-12/photos/EDR-75-12_02.jpg", linkedin: null, sell_price: 15, sell_price_currency: "USD", price_source: "internal" ,
    specs: [["AC input", "100–240 VAC, 50/60 Hz, 1.6 A"], ["DC output", "12 V DC, 6.3 A"], ["Rated output power", "75.6 W"], ["Output adjustment", "12–14 V"], ["Mounting", "TS35/7.5 or TS35/15 DIN rail"], ["Dimensions (W × H × D)", "32 × 125.2 × 102 mm"], ["Net weight", "0.51 kg (manufacturer specification)"], ["Origin marking", "Made in China (visible on batch photo)"]],
    applications: [{icon:"🏭",title:"Industrial control systems",desc:"Listed by MEAN WELL as an EDR-series application; check load and installation requirements."},{icon:"⚙️",title:"Factory automation",desc:"Listed by MEAN WELL as an EDR-series application; verify the required DC load and cabinet conditions."},{icon:"🧰",title:"Electromechanical apparatus",desc:"Listed by MEAN WELL as an EDR-series application; confirm the electrical design for the specific equipment."},{icon:"🔬",title:"Semiconductor fabrication equipment",desc:"Listed by MEAN WELL as an EDR-series application; no specific equipment compatibility is implied."}],
    faq: [
      {q:"What is the MEAN WELL EDR-75-12?",a:"It is a single-output DIN-rail switching power supply in the EDR-75 series, rated for 12 V DC at 6.3 A and 75.6 W."},
      {q:"What AC input does it accept?",a:"The manufacturer lists 100–240 VAC, 50/60 Hz, 1.6 A. Confirm the site supply and wiring before installation."},
      {q:"Can the output voltage be adjusted?",a:"The specified adjustment range is 12–14 V. Set and verify it according to the connected load requirements."},
      {q:"Which DIN rail does it fit?",a:"The manufacturer specifies TS35/7.5 or TS35/15 rails. Follow the official manual for orientation and clearance."},
      {q:"Is it available and what is the price?",a:"Fouwell confirms new original stock at USD 15 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation."},
      {q:"Is it a direct replacement for another power supply?",a:"No cross-reference is confirmed. Compare input, output, load, adjustment, wiring, mounting and enclosure conditions before selecting a replacement."}
    ],
    order_terms_by_quote: true, reviews_verified: false, origin: "China",
    order_terms_note: "New original stock. USD 15 per unit. Available quantity, shipping, delivery and warranty terms are confirmed in the quotation.",
    order_terms_note_ru: "Новый оригинальный товар в наличии. 15 USD за единицу. Количество, доставка, сроки и гарантия уточняются в предложении."
  }, // EDR-75-12 — model-specific content and quotation terms

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "Kinco", model: "MD204L", series: "MD200/300", cat: "hmi", spec: "Kinco MD204L programmable text display, 4.3-inch monochrome 192 × 64 screen, 20 configurable keys; verify revision and supply voltage before ordering", status: "instock", photo: "MD204L/photos/MD204L_01.jpg", linkedin: null, sell_price: 53, sell_price_currency: "USD", price_source: "internal", overview: "Kinco MD204L is a programmable text display with a 4.3-inch monochrome 192 × 64 screen and 20 configurable keys. Kinco documents differ on input voltage by version, so verify the unit revision and label before connecting power. Fouwell lists new original stock at USD 53 per unit; quantity is confirmed by quotation.", overview_ru: "Kinco MD204L — программируемый текстовый дисплей с монохромным экраном 4,3 дюйма, разрешением 192 × 64 и 20 настраиваемыми клавишами. В документах Kinco указаны разные диапазоны питания для разных версий. Перед подключением проверьте ревизию и маркировку устройства. Fouwell указывает новый оригинальный товар в наличии по цене USD 53 за единицу; количество подтвердят при расчёте предложения.", meta_description: "Kinco MD204L text display HMI: 4.3-inch monochrome 192 × 64 screen and 20 keys. Verify revision and supply voltage before ordering.", meta_description_ru: "Kinco MD204L: монохромный дисплей 4,3 дюйма, 192 × 64 и 20 клавиш. Перед заказом уточните ревизию и питание.", reviews_verified: false, order_terms_by_quote: true, authenticity_note: "New original condition stated by seller; confirm batch documentation when requesting a quotation.", authenticity_note_ru: "По данным продавца, товар новый и оригинальный; документы партии уточняются при запросе предложения.", faq: [{"q":"What is the Kinco MD204L?","a":"It is a programmable text display / HMI listed in Kinco's MD200/300 series."},{"q":"What display does the MD204L use?","a":"Kinco lists a 4.3-inch STN monochrome display with 192 × 64 pixels."},{"q":"Is the MD204L a touchscreen?","a":"No. Kinco describes a non-touch panel with 20 configurable membrane keys."},{"q":"Which serial modes are listed?","a":"Kinco's catalogue lists PC RS232 and PLC RS232/RS485/RS422 on COM0. Confirm the project protocol and cable pinout."},{"q":"Which supply voltage should I use?","a":"The available Kinco documents differ by hardware version. Check the unit label and matching manual before applying power."},{"q":"How do I check availability and price?","a":"Fouwell states new original stock at USD 53 per unit. Confirm available quantity, quotation validity and delivery terms with the team."}] }, // generate-data-entry.js <- wiki/marketing/Kinco/HMI/MD204L/营销素材包/04-独立站内容包/MD204L.md

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "WECON", model: "PI8150ig", series: "PI8000ig", cat: "hmi", spec: "WECON PI8150ig 1920×1080 resistive touch HMI, 512MB RAM, 4GB Flash, COM1 serial modes, Ethernet and USB Host/Client; confirm hardware revision for electrical limits", status: "instock", photo: "PI8150ig.jpg", linkedin: null, overview: "The WECON PI8150ig is a PI8000ig-series industrial HMI with a resistive touch screen and 1920 × 1080 resolution. It provides COM1 serial communication modes, one Ethernet port, and USB Host/Client interfaces. Check the exact hardware revision for display-size wording, input-voltage range, and operating temperature before installation.", overview_ru: "WECON PI8150ig — промышленная панель HMI серии PI8000ig с резистивным сенсорным экраном и разрешением 1920 × 1080. Она оснащена последовательным интерфейсом COM1, одним портом Ethernet и интерфейсами USB Host/Client. Перед установкой проверьте ревизию: в документации различаются размер экрана, диапазон питания и рабочая температура.", meta_description: "WECON PI8150ig industrial HMI specifications, 1920 × 1080 display, serial communication, Ethernet, USB interfaces and six product photos. Verify revision-specific power and temperature limits.", meta_description_ru: "Характеристики промышленной HMI WECON PI8150ig: экран 1920 × 1080, последовательный интерфейс, Ethernet, USB и шесть фотографий. Уточните ограничения питания и температуры для своей ревизии.", sell_price: 1590, sell_price_currency: "CNY", price_source: "internal" }, // generate-data-entry.js <- wiki/marketing/WECON/HMI/PI8150ig/营销素材包/04-独立站内容包/PI8150ig.md

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "STIKO", model: "S/N.024366", series: "", cat: "sensors", spec: "STIKO 指针式压力表，Fouwell 内部型号 S/N.024366；用户确认全新原装、现货，售价 USD 120。厂家完整订货号、量程、过程连接、介质兼容性和安装方式待核实，替换采购前请先核对。", status: "instock", photo: "S/N.024366.jpg", linkedin: null, overview: "STIKO pressure gauge listed under Fouwell internal ID S/N.024366. Seller confirms new original condition and in-stock availability at USD 120. The manufacturer order code, range and process connection are unconfirmed. Verify the full instrument code, required range, connection, process medium and mounting before ordering it as a replacement.", overview_ru: "Манометр STIKO предлагается под внутренним артикулом Fouwell S/N.024366. Продавец подтверждает новое оригинальное изделие и наличие по цене 120 USD. Код заказа производителя, диапазон и присоединение не подтверждены. Перед заменой проверьте полный код прибора, диапазон, присоединение, рабочую среду и монтаж.", meta_description: "STIKO pressure gauge, Fouwell internal ID S/N.024366. New original, in stock, USD 120. Confirm the manufacturer's order code, range and process connection before ordering.", meta_description_ru: "Манометр STIKO, внутренний артикул Fouwell S/N.024366. Новое оригинальное изделие в наличии, 120 USD. Перед заказом уточните код производителя, диапазон и присоединение.", sell_price: 120, sell_price_currency: "USD", price_source: "internal" }, // generate-data-entry.js <- wiki/marketing/STIKO/PressureGauge/S-N.024366/营销素材包/04-独立站内容包/S-N.024366.md

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "OMRON", model: "S8VK-C12024/ED2", series: "S8VK-C", cat: "spares", spec: "120 W DIN-rail switching power supply, 24 VDC/5 A output, 100–240 VAC input (base model S8VK-C12024); unit label indicates China; verify /ED2 suffix", status: "instock", photo: "S8VK-C12024/ED2.jpg", linkedin: "S8VK-C12024-ED2.png", overview: "OMRON S8VK-C12024/ED2 is offered new and in stock as a DIN-rail switching power supply. OMRON public data confirms the base model S8VK-C12024 at 120 W, 24 VDC/5 A, with 100–240 VAC input. Verify the user-specified /ED2 suffix against the complete nameplate before replacement.", overview_ru: "OMRON S8VK-C12024/ED2 — новый источник питания на DIN-рейку в наличии. Открытые данные OMRON подтверждают для базовой модели S8VK-C12024 параметры 120 Вт, 24 В DC/5 А и вход 100–240 В AC. На маркировке данного экземпляра указана страна China. Проверьте указанный пользователем суффикс /ED2 по полной маркировке перед заменой.", meta_description: "New OMRON S8VK-C12024/ED2 power supply in stock. Official base-model rating: 120 W, 24 VDC/5 A; verify /ED2 before replacement.", meta_description_ru: "OMRON S8VK-C12024/ED2, новый источник питания на DIN-рейку. Суффикс /ED2 требует проверки; параметры базовой модели: 120 Вт, 24 В DC/5 А.", sell_price: 250, sell_price_currency: "CNY", price_source: "user_provided",
    authenticity_note: "New original condition is user-confirmed. Verify the /ED2 suffix against the complete nameplate; official-channel sourcing is not documented.",
    authenticity_note_ru: "По подтверждению продавца, товар новый и оригинальный. Сверьте суффикс /ED2 по полной маркировке; сведения об официальном канале поставки не представлены.",
    reviews_verified: false,
    order_terms_by_quote: true,
    order_terms_note: "New original condition and in-stock status are user-confirmed. Offer: CNY 250. Confirm quantity and order terms; verify the complete /ED2 nameplate before replacement.",
    order_terms_note_ru: "По подтверждению продавца, товар новый и оригинальный, в наличии. Цена предложения: 250 CNY. Уточните количество и условия заказа; перед заменой проверьте полную маркировку /ED2.",
    specs: [["Model identification", "User-specified S8VK-C12024/ED2; official base model S8VK-C12024"], ["Output", "24 VDC, 5 A; 120 W (base model)"], ["Input", "100–240 VAC (base model)"], ["Country marked on unit label", "China (photo evidence for this unit)"], ["Full suffix", "/ED2 not explained in public OMRON catalog; verify nameplate"]],
    applications: [{ icon: "⚙️", title: "Selection check", desc: "No specific installed application is confirmed for this offer. Evaluate load and startup current, input supply, terminals and mounting against the verified base-model ratings." }],
    faq: [
      { q: "What is the official OMRON base model?", a: "OMRON public materials list S8VK-C12024. The /ED2 suffix is user-specified and is not explained in the public catalog." },
      { q: "What are the base-model output ratings?", a: "120 W, 24 VDC and 5 A. These values apply to the official base model S8VK-C12024." },
      { q: "What input range is documented?", a: "OMRON lists 100–240 VAC for S8VK-C12024. Check the complete unit label and supply conditions before installation." },
      { q: "Is this confirmed as a direct replacement for another supply?", a: "No direct replacement is established here. Compare input, continuous and startup load, terminals, mounting and the complete model code." },
      { q: "Is it in stock and what is the offer price?", a: "The user confirms new original condition, in-stock status and CNY 250. Quantity and order terms should be confirmed when requesting a quote." },
      { q: "What is known about the /ED2 suffix?", a: "The public OMRON materials reviewed do not explain /ED2. Verify the exact designation with the supplier and physical nameplate before ordering." }
    ],
  }, // generate-data-entry.js <- wiki/marketing/OMRON/PowerSupply/S8VK-C12024-ED2/营销素材包/04-独立站内容包/S8VK-C12024-ED2.md

  // ---- generate-data-entry.js additions (2026-10-28) ----
  { brand: "SMC", model: "SY5140-5L0Z", series: "SY5000", cat: "spares", spec: "SMC SY5000 Series 5-port solenoid valve, user-specified model SY5140-5L0Z; related catalog number SY5140-5LZ is rated 24 VDC, but the extra “0” is unconfirmed", status: "instock", photo: "SY5140-5L0Z/photos/SY5140-5L0Z_01.jpg", linkedin: "SY5140-5L0Z.png", overview: "SMC SY5140-5L0Z is the user-specified model for a new, original, in-stock 5-port solenoid valve offered at US$40. SMC's public catalog lists related SY5140-5LZ in the SY5000 Series, rated 24 VDC. The catalog does not confirm the extra “0”; verify the full marking and connection details before replacement.", overview_ru: "SMC SY5140-5L0Z — указанная пользователем модель нового оригинального пятилинейного электромагнитного клапана в наличии по цене 40 долларов США. В открытом каталоге SMC указан близкий номер SY5140-5LZ серии SY5000 с напряжением 24 В DC. Дополнительный символ «0» каталогом не подтверждён; перед заменой проверьте полную маркировку и подключение.", meta_description: "SMC SY5140-5L0Z 5-port solenoid valve, new and in stock at US$40. Exact “0” variant not confirmed in SMC public catalog; verify marking before replacement.", meta_description_ru: "SMC SY5140-5L0Z, пятилинейный электромагнитный клапан, новый, в наличии, 40 долларов США. Вариант с «0» не подтверждён каталогом SMC; сверьте маркировку.", authenticity_note: "New original condition and in-stock status are user-confirmed. The exact user-specified SY5140-5L0Z suffix is not confirmed in SMC's public catalog; verify the complete unit marking before replacement.", authenticity_note_ru: "По подтверждению пользователя, товар новый, оригинальный и имеется в наличии. Точный номер SY5140-5L0Z не подтверждён в открытом каталоге SMC; перед заменой проверьте полную маркировку.", sell_price: 40, sell_price_currency: "USD", price_source: "user_provided", reviews_verified: false, order_terms_by_quote: true, order_terms_note: "Confirm quantity, delivery, warranty, payment and packaging terms when requesting a quote.", order_terms_note_ru: "При запросе предложения уточните количество, сроки поставки, гарантию, оплату и упаковку.", specs: [["Identification", "User-specified model SY5140-5L0Z; SMC public catalog lists related SY5140-5LZ; exact “0” variant not confirmed"], ["Series", "SY5000 (related catalog model)"], ["Valve configuration", "5-port, 2-position, single solenoid; internal pilot (related catalog model)"], ["Rated voltage", "24 VDC (related catalog model)"], ["Electrical entry", "L-type plug connector with 300 mm lead (related catalog model)"], ["Indicator / surge suppression", "Included (related catalog model)"], ["Manual override", "Push-turn locking type (related catalog model)"], ["Base / port thread", "Without sub-plate; Rc thread (related catalog model)"], ["Condition / availability", "New original, in stock; user-confirmed"], ["Price", "US$40; user-provided"], ["Country of origin mark", "Japan, visible on this batch package label"]], applications: [{"icon": "⚙️", "title": "Pneumatic direction control selection", "desc": "The related SMC catalog model is a 5-port, 2-position single-solenoid valve. Confirm the circuit, base/manifold, port thread, coil wiring and operating conditions for the target machine."}], faq: [{"q": "What is the exact model listed here?", "a": "SY5140-5L0Z is the user-specified internal model. SMC’s public catalog lists related model SY5140-5LZ; it does not confirm the additional “0” variant."}, {"q": "What series and valve configuration does SMC list for SY5140-5LZ?", "a": "SMC lists the SY5000 Series, 5-port, 2-position, single-solenoid, internal-pilot configuration for the related catalog number."}, {"q": "What is the rated voltage of the related catalog model?", "a": "The SMC catalog lists 24 VDC for SY5140-5LZ. Check the full marking on the supplied unit before connecting the coil."}, {"q": "What connector is listed?", "a": "The related SY5140-5LZ catalog entry specifies an L-type plug connector with a 300 mm lead. Confirm the actual wiring and connector before installation."}, {"q": "Can this valve replace another SY5000 model directly?", "a": "Direct interchangeability is not confirmed. Compare the full model, valve base/manifold, port thread, coil wiring and circuit requirements."}, {"q": "What are the condition, stock status and price?", "a": "The user confirms new original condition, in-stock status and a price of US$40. Quantity and order terms should be reconfirmed when requesting a quote."}] }, // generate-data-entry.js <- wiki/marketing/SMC/SolenoidValve/SY5140-5L0Z/营销素材包/04-独立站内容包/SY5140-5L0Z.md

  // ---- generate-data-entry.js additions (2026-10-29) ----
  { brand: "Azbil", model: "C15MTV0RA0100", series: "SDC15 / C15", cat: "sensors", spec: "Azbil SDC15 single-loop controller, panel mount, RTD input, SSR voltage-pulse output, AC 100–240 Vac, three event-relay outputs", status: "instock", photo: null, linkedin: null, overview: "Azbil C15MTV0RA0100 is a panel-mount SDC15 single-loop temperature controller with RTD input, voltage-pulse output for SSR drive, AC 100–240 Vac supply and three event-relay outputs. Check the sensor range, wiring and option code before replacement.", overview_ru: "Azbil C15MTV0RA0100 — одноконтурный регулятор температуры SDC15 для панельного монтажа с входом RTD, импульсным выходом напряжения для управления SSR, питанием AC 100–240 Vac и тремя релейными выходами событий. Перед заменой проверьте диапазон датчика, подключение и код опций.", meta_description: "Azbil C15MTV0RA0100 SDC15 controller with RTD input, SSR voltage-pulse output, AC 100–240 Vac and three event relays. Check wiring before replacement.", meta_description_ru: "Регулятор Azbil C15MTV0RA0100 SDC15 с входом RTD, импульсным выходом SSR, питанием AC 100–240 Vac и тремя релейными выходами событий. Перед заменой проверьте подключение.", sell_price: 55, sell_price_currency: "USD", price_source: "internal" }, // generate-data-entry.js <- wiki/marketing/Azbil/TemperatureController/C15MTV0RA0100/营销素材包/04-独立站内容包/C15MTV0RA0100.md

  // ---- generate-data-entry.js additions (2026-10-29) ----
  { brand: "Azbil", model: "C36TC0UA2200", series: "SDC36 / C36", cat: "sensors", reviews_verified: false, authenticity_note: "New original condition and in-stock status are user-confirmed; confirm quantity and terms when requesting a quotation.", authenticity_note_ru: "По подтверждению пользователя, товар новый, оригинальный и имеется в наличии; количество и условия уточняются при запросе предложения.", order_terms_by_quote: true, order_terms_note: "New original, in stock; USD 356. Confirm quantity, warranty, delivery, payment and shipping terms in the quotation.", order_terms_note_ru: "Новый оригинальный товар в наличии; 356 USD. Уточните количество, гарантию, сроки, оплату и доставку в предложении.", spec: "Azbil SDC36 panel-mount single-loop temperature controller, universal PV input, current control output, AC 100–240 Vac, three event relays, auxiliary current output, two CT inputs, four digital inputs and RS-485", status: "instock", photo: null, linkedin: null, overview: "Azbil C36TC0UA2200 is an SDC36 panel-mount single-loop temperature controller with universal input, current control output, AC 100–240 Vac supply, three event relays, auxiliary current output, CT and digital inputs, and RS-485. Confirm configured input range, output settings, wiring, and CT requirements before replacement.", overview_ru: "Azbil C36TC0UA2200 — одноконтурный регулятор температуры SDC36 для панельного монтажа с универсальным входом, токовым управляющим выходом, питанием AC 100–240 Vac, тремя релейными выходами событий, вспомогательным токовым выходом, входами CT и DI, а также RS-485. Перед заменой проверьте настройки входа и выхода, подключение и необходимость трансформаторов тока.", meta_description: "Azbil C36TC0UA2200 SDC36 temperature controller with universal input, current output, AC 100–240 Vac, event relays and RS-485. Check configured range and wiring before replacement.", meta_description_ru: "Azbil C36TC0UA2200 SDC36 — регулятор температуры с универсальным входом, токовым выходом, AC 100–240 Vac и RS-485. Перед заменой проверьте настройки и подключение.", sell_price: 356, sell_price_currency: "USD", price_source: "internal" }, // generate-data-entry.js <- wiki/marketing/Azbil/TemperatureController/C36TC0UA2200/营销素材包/04-独立站内容包/C36TC0UA2200.md

  // ---- generate-data-entry.js additions (2026-10-29) ----
  { brand: "OMRON", model: "E5EC-CR2ADM-804", series: "E5EC-800", cat: "sensors", spec: "OMRON E5EC-CR2ADM-804 E5EC-800 digital temperature controller, linear-current control output, relay output, RS-485, two event inputs, 100–240 VAC", status: "instock", photo: null, linkedin: null, reviews_verified: false, origin: "China", order_terms_by_quote: true, authenticity_note: "New original condition and in-stock status are user-confirmed. Confirm batch documents, quantity and order terms when requesting a quotation.", authenticity_note_ru: "По подтверждению пользователя, товар новый, оригинальный и имеется в наличии. Документы партии, количество и условия уточняются при запросе предложения.", order_terms_note: "USD 80 user-provided. Confirm quantity, delivery, warranty and payment terms in the quotation.", order_terms_note_ru: "Цена 80 USD указана пользователем. Количество, сроки поставки, гарантию и оплату уточните в предложении.", overview: "OMRON E5EC-CR2ADM-804 is an E5EC-800 digital temperature controller with linear-current and relay outputs, RS-485, two event inputs and 100–240 VAC supply. Verify sensor settings and wiring before replacement. User confirms new original stock at USD 80; confirm quantity and order terms by quotation. The batch packaging carries a Made in China mark; it is not an origin certificate.", overview_ru: "OMRON E5EC-CR2ADM-804 — регулятор температуры E5EC-800 с токовым и релейным выходами, RS-485, двумя входами событий и питанием 100–240 В AC. Перед заменой проверьте настройки датчика и подключение. По данным пользователя, товар новый, оригинальный и имеется в наличии за 80 USD; количество и условия уточняются в предложении. На упаковке этой партии указано Made in China; это не сертификат происхождения.", meta_description: "OMRON E5EC-CR2ADM-804 with linear-current output, relay output, RS-485, two event inputs and 100–240 VAC. New original stock at USD 80; verify wiring and settings.", meta_description_ru: "OMRON E5EC-CR2ADM-804: токовый и релейный выходы, RS-485, два входа событий, питание 100–240 В AC. Новый оригинальный товар в наличии за 80 USD.", authenticity_note: "New original condition and in-stock status are user-confirmed. Confirm batch documents, quantity and order terms when requesting a quotation.", authenticity_note_ru: "По подтверждению пользователя, товар новый, оригинальный и имеется в наличии. Документы партии, количество и условия уточняются при запросе предложения.", sell_price: 80, sell_price_currency: "USD", price_source: "user_provided" }, // generate-data-entry.js <- wiki/marketing/OMRON/TemperatureController/E5EC-CR2ADM-804/营销素材包/04-独立站内容包/E5EC-CR2ADM-804.md

  // ---- generate-data-entry.js additions (2026-10-31) ----
  { brand: "OMRON", model: "E5EC-PR2ADM-814", series: "E5EC-800", cat: "sensors", spec: "OMRON E5EC-PR2ADM-814 E5EC-series temperature controller; exact suffix configuration to be confirmed before ordering", status: "instock", photo: null, linkedin: null, overview: "OMRON E5EC-PR2ADM-814 temperature controller offered as new original stock at USD 180. The exact -814 configuration was not found in the public OMRON catalog reviewed; verify the complete code, supply, I/O and wiring against the unit documentation before ordering. Quantity and order terms are confirmed by quotation.", overview_ru: "Регулятор температуры OMRON E5EC-PR2ADM-814 предлагается как новый оригинальный товар в наличии по цене 180 USD. Точную конфигурацию с индексом -814 не удалось подтвердить по открытой документации OMRON; перед заказом сверьте полный код, питание, входы/выходы и подключение с документацией изделия. Количество и условия уточняются в предложении.", meta_description: "OMRON E5EC-PR2ADM-814 temperature controller, new original stock at USD 180. Verify exact suffix and configuration before ordering.", meta_description_ru: "Регулятор температуры OMRON E5EC-PR2ADM-814, новый оригинальный товар в наличии за 180 USD. Перед заказом проверьте точную конфигурацию.", authenticity_note: "New original condition and in-stock status are user-confirmed. Confirm batch documents, quantity and order terms when requesting a quotation.", authenticity_note_ru: "По данным пользователя, товар новый, оригинальный и имеется в наличии. Документы партии, количество и условия уточняются при запросе предложения.", sell_price: 180, sell_price_currency: "USD", price_source: "user_provided" }, // generate-data-entry.js <- wiki/marketing/OMRON/TemperatureController/E5EC-PR2ADM-814/营销素材包/04-独立站内容包/E5EC-PR2ADM-814.md

  // ---- generate-data-entry.js additions (2026-11-01) ----
  { brand: "Leadshine", model: "iSV2-CAN8075V48G", series: "iSV2-CAN", cat: "servo", spec: "750 W integrated servo motor, 48 VDC rated, 24–60 VDC main input, CANopen, 17-bit incremental magnetic encoder, brake, IP20", status: "instock", photo: null, linkedin: null, authenticity_note: "Seller-confirmed as new original stock; ask us to confirm the unit label and order details.", authenticity_note_ru: "По данным продавца, товар новый и оригинальный; маркировку устройства и условия заказа подтвердите при запросе.", sell_price: 248, sell_price_currency: "USD", price_source: "internal:sell_price（用户于2026-11-01提供）", overview: "The Leadshine iSV2-CAN8075V48G is an integrated servo motor rated at 750 W and 48 VDC. It combines a motor, drive and 17-bit incremental magnetic encoder, with CANopen and a brake. Verify the full suffix, supply, controller configuration and mechanical fit before ordering. User-confirmed offer: new original stock at USD 248.", overview_ru: "Leadshine iSV2-CAN8075V48G — интегрированный сервомотор мощностью 750 Вт с номинальным напряжением 48 В DC. В одном устройстве объединены мотор, привод и инкрементальный магнитный энкодер 17 бит; предусмотрены CANopen и тормоз. Перед заказом проверьте полный код, питание, настройки контроллера и механическое соответствие. По данным пользователя: новый оригинал в наличии, USD 248.", meta_description: "Leadshine iSV2-CAN8075V48G integrated servo motor, 750 W, 48 VDC rated, CANopen, 17-bit encoder and brake. User offer USD 248; verify fit.", meta_description_ru: "Интегрированный сервомотор Leadshine iSV2-CAN8075V48G: 750 Вт, 48 В DC, CANopen, энкодер 17 бит и тормоз. Новый оригинал, USD 248.", faq: [{q:"What is the offer for the iSV2-CAN8075V48G?",a:"The current user-confirmed offer is new original stock at USD 248. Confirm quantity and order terms when requesting a quote."},{q:"What should I check before ordering?",a:"Match the complete model code, 24–60 VDC main input, CANopen configuration, brake wiring, shaft and mounting dimensions with your application."},{q:"How can I confirm current stock and delivery terms?",a:"The item was confirmed in stock for this offer. Contact info@fouwell.com with quantity and destination to reconfirm availability and shipping terms."},{q:"What warranty applies?",a:"Warranty terms for this offer were not provided. Please request confirmation with your quotation."},{q:"How is the product shipped?",a:"Shipping options, packing details and delivery time depend on the order and destination. Request confirmation with your quotation."}] }, // generate-data-entry.js <- wiki/marketing/Leadshine/Servo/iSV2-CAN8075V48G/营销素材包/04-独立站内容包/iSV2-CAN8075V48G.md

  // ---- generate-data-entry.js additions (2026-11-01) ----
  { brand: "HORIBA", model: "6108-50B", series: "48/96", cat: "sensors", spec: "HORIBA 6108-50B dome-type combination pH electrode, pH 0–14, standard 5 m cable, product no. 3200265000", status: "instock", photo: null, linkedin: null, overview: "HORIBA 6108-50B is a dome-type combination pH electrode with a pH 0–14 range and standard 5 m cable.", overview_ru: "HORIBA 6108-50B — комбинированный электрод pH купольного типа с диапазоном pH 0–14 и стандартным кабелем 5 м.", meta_description: "HORIBA 6108-50B dome-type combination pH electrode, pH 0–14, 5 m cable. Check holder and process compatibility.", meta_description_ru: "Электрод HORIBA 6108-50B: диапазон pH 0–14, кабель 5 м. Проверьте совместимость с держателем и условия процесса.", sell_price: 452, sell_price_currency: "USD", price_source: "user_provided", 
    specs: [["Manufacturer Part Number", "3200265000"], ["Product type", "Dome-type combination pH electrode"], ["Measurement method", "Glass electrode method"], ["Measuring range", "pH 0–14"], ["Temperature", "−10 to 100 °C (no freezing)"], ["Pressure", "0–0.6 MPa"], ["Cable", "5 m (+5%)"], ["Temperature compensation resistance", "1 kΩ"], ["Reference junction", "Multi-pore ceramic; refillable 3.3 mol KCl"]],
    applications: [{ icon: "🧪", title: "Process pH measurement", desc: "Manufacturer documentation lists the 6108-50B for pH measurement with compatible HORIBA holders and flow chambers. Confirm the actual installation conditions." }],
    compatibility: [{ from: "HORIBA CH-101", type: "listed holder", note: "Listed in HORIBA 48/96 series documentation; confirm configuration." }, { from: "HORIBA CF-251 / CF-301 / CF-401", type: "listed flow chamber", note: "Listed in HORIBA 48/96 series documentation; verify exact assembly." }],
    faq: [{ q: "What is the HORIBA 6108-50B?", a: "A dome-type combination pH electrode, manufacturer part number 3200265000." }, { q: "What is its measuring range?", a: "HORIBA specifies pH 0–14 using the glass electrode method." }, { q: "What process limits are listed?", a: "−10 to 100 °C without freezing and 0–0.6 MPa. Check suitability for the actual process." }, { q: "Which holders are listed?", a: "The 48/96 series brochure lists CH-101, CF-251, CF-301 and CF-401. Confirm the exact installation." }, { q: "Is it interchangeable with another 6108 model?", a: "Do not assume interchangeability by series name. Compare the full model, cable, connection and installed arrangement." }, { q: "What is the current offer?", a: "Seller-confirmed new original stock, stated in stock at USD 452. Confirm quantity and order terms when requesting a quote." }],
    authenticity_note: "Seller-confirmed as new original stock. Confirm the unit label and order terms with the quotation.",
    authenticity_note_ru: "Продавец подтверждает, что товар новый и оригинальный. Сверьте маркировку изделия и условия поставки в коммерческом предложении." }, // generate-data-entry.js <- wiki/marketing/HORIBA/pHElectrode/6108-50B/营销素材包/04-独立站内容包/6108-50B.md

  // ---- generate-data-entry.js additions (2026-11-02) ----
  { brand: "Siemens", model: "6EP3333-3SA00-0AY0", series: "SITOP PSU2200", cat: "spares", spec: "Single-phase stabilized power supply, 24 V DC / 5 A (120 W), rated input 100–240 V AC, 50/60 Hz", status: "instock", photo: "6EP3333-3SA00-0AY0.jpg", linkedin: null, authenticity_note: "Condition and authenticity are supplier-stated for this offer; batch documentation is not independently verified on this page.", authenticity_note_ru: "Состояние и подлинность заявлены поставщиком для данного предложения; документы конкретной партии на этой странице независимо не проверены.", faq: [{"q":"What is Siemens 6EP3333-3SA00-0AY0?","a":"6EP3333-3SA00-0AY0 is a single-phase Siemens SITOP PSU2200 stabilized power supply, rated 24 V DC and 5 A (120 W)."},{"q":"What input does this model accept?","a":"Rated input is 100–240 V AC at 50/60 Hz. The stated operating range is 90–264 V AC; check the operating manual and site conditions."},{"q":"What are the output ratings?","a":"The rated output is 24 V DC, 5 A and 120 W. The specified adjustment range is 21.6–26.4 V."},{"q":"How does this compare with other SITOP PSU2200 versions?","a":"This order number is the 5 A version. Confirm output current, voltage and system load before replacing a 3 A, 10 A or 20 A variant."},{"q":"Is it in stock, and what is the price?","a":"The supplier states new and in stock at USD 14.28. Quantity, batch documentation and delivery terms must be confirmed for the order."},{"q":"How can I request a quotation?","a":"Visit https://www.fouwell.com/ and provide the exact order number, quantity and delivery destination."}], overview: "The Siemens SITOP PSU2200 6EP3333-3SA00-0AY0 is a single-phase stabilized power supply with a 24 V DC, 5 A output rated at 120 W. Rated input is 100–240 V AC at 50/60 Hz. Supplier states the item is new and in stock; confirm quantity and delivery terms when requesting a quote.", overview_ru: "Siemens SITOP PSU2200 6EP3333-3SA00-0AY0 — однофазный стабилизированный источник питания с выходом 24 В DC, 5 А и номинальной мощностью 120 Вт. Номинальное входное напряжение — 100–240 В AC, 50/60 Гц. Поставщик указывает товар как новый и имеющийся в наличии; количество и условия поставки уточняются при запросе.", meta_description: "Siemens SITOP PSU2200 6EP3333-3SA00-0AY0, 24 V DC 5 A (120 W) stabilized power supply. Supplier states new and in stock at USD 14.28; confirm quantity and delivery terms.", meta_description_ru: "Siemens SITOP PSU2200 6EP3333-3SA00-0AY0, стабилизированный источник питания 24 В DC, 5 А (120 Вт). Поставщик указывает наличие; цену и условия поставки подтвердите при запросе.", sell_price: 14.28, sell_price_currency: "USD", price_source: "user_provided", reviews_verified: false }, // generate-data-entry.js <- wiki/marketing/Siemens/PowerSupply/6EP3333-3SA00-0AY0/营销素材包/04-独立站内容包/6EP3333-3SA00-0AY0.md

  // ---- generate-data-entry.js additions (2026-11-02) ----
  { brand: "Siemens", model: "6EP3336-3SB00-0AX0", series: "SITOP PSU4200", cat: "spares", spec: "Single-phase stabilized power supply, 24 V DC / 20 A (480 W), rated input 120–240 V AC, 50/60 Hz", status: "instock", photo: "6EP3336-3SB00-0AX0.jpg", linkedin: null, overview: "The Siemens SITOP PSU4200 6EP3336-3SB00-0AX0 is a single-phase stabilized power supply rated at 24 V DC, 20 A and 480 W. Its rated input is 120–240 V AC at 50/60 Hz, with an 85–264 V AC input range. Supplier states new and in stock at USD 127.02; confirm quantity and delivery terms at quotation.", overview_ru: "Siemens SITOP PSU4200 6EP3336-3SB00-0AX0 — однофазный стабилизированный источник питания с номинальным выходом 24 В постоянного тока, 20 А и 480 Вт. Номинальное входное напряжение — 120–240 В переменного тока, 50/60 Гц; диапазон входного напряжения — 85–264 В переменного тока. Поставщик указывает товар как новый и имеющийся в наличии по цене 127,02 долл. США; количество и условия поставки подтвердите при запросе.", meta_description: "Siemens SITOP PSU4200 6EP3336-3SB00-0AX0 power supply, 24 V DC 20 A, 480 W. Supplier states new and in stock at USD 127.02; confirm quantity and delivery terms.", meta_description_ru: "Siemens SITOP PSU4200 6EP3336-3SB00-0AX0, источник питания 24 В DC, 20 А, 480 Вт. Поставщик указывает наличие; количество и условия поставки подтвердите при запросе.", sell_price: 127.02, sell_price_currency: "USD", price_source: "user_provided", reviews_verified: false, order_terms_by_quote: true, authenticity_note: "New original condition is supplier-stated. Verify batch documentation and country of origin for the offered unit; package photos do not independently establish authenticity.", authenticity_note_ru: "По данным поставщика, товар новый и оригинальный. Подтвердите документы партии и страну происхождения предлагаемого изделия; фотографии упаковки сами по себе не подтверждают подлинность." }, // generate-data-entry.js <- wiki/marketing/Siemens/PowerSupply/6EP3336-3SB00-0AX0/营销素材包/04-独立站内容包/6EP3336-3SB00-0AX0.md

  // ---- generate-data-entry.js additions (2026-11-04) ----
  { brand: "Siemens", model: "6ES7132-6BH01-0BA0", series: "SIMATIC ET200SP", cat: "controllers", spec: "16 PNP digital outputs, 24 V DC, 0.5 A/channel, Standard, BaseUnit A0", status: "instock", photo: null, linkedin: null, authenticity_note: "User confirms new original condition and in-stock status. Quantity and batch documentation should be confirmed with the quotation; packaging photos do not independently prove authenticity.", authenticity_note_ru: "Пользователь подтверждает, что товар новый, оригинальный и имеется в наличии. Количество и документы партии следует подтвердить в предложении; фотографии упаковки сами по себе не доказывают подлинность.", origin: "China", order_terms_by_quote: true, order_terms_note: "User-confirmed new original stock; confirm quantity, batch documents, warranty, delivery and payment terms in the quotation.", order_terms_note_ru: "Пользователь подтверждает новый оригинальный товар в наличии; количество, документы партии, гарантию, сроки поставки и оплату уточните в предложении.", video_heading: "Packaging & Label Check", video_heading_ru: "Проверка упаковки и маркировки", video_description: "Silent captioned slideshow made from packaging photos; it does not show an unpacked unit or an operational test.", video_description_ru: "Беззвучный ролик с субтитрами и фотографиями упаковки; распакованное изделие и проверка работы не показаны.", faq: [{q:"What does Siemens 6ES7132-6BH01-0BA0 do?",a:"It is a SIMATIC ET 200SP digital output module with 16 PNP sourcing outputs, rated 24 V DC and 0.5 A per channel. The Standard version uses BaseUnit type A0."},{q:"What condition and availability are confirmed for this offer?",a:"The user confirms new original condition and in-stock status. Quantity and batch documentation should be confirmed when requesting a quotation."},{q:"Does the listing show a Fouwell selling price?",a:"The displayed amount is a live eBay listing reference, not a confirmed Fouwell quotation. Ask us to confirm the current price for your quantity and destination."},{q:"Do the photos show the module operating?",a:"No. The supplied images and video show packaging and labels. They do not show an unpacked module or an operational test."},{q:"What should I verify before ordering?",a:"Confirm the complete order number, BaseUnit type A0, wiring and system compatibility with the Siemens documentation and your installation."}], overview: "Siemens 6ES7132-6BH01-0BA0 is a SIMATIC ET 200SP digital output module with 16 PNP sourcing outputs rated at 24 V DC and 0.5 A per channel. The Standard module fits BaseUnit type A0. User confirms new original stock; confirm quantity and batch documents when requesting a quotation.", overview_ru: "Siemens 6ES7132-6BH01-0BA0 — модуль дискретных выходов SIMATIC ET 200SP с 16 выходами PNP на 24 В DC и током 0,5 А на канал. Исполнение Standard предназначено для BaseUnit типа A0. Пользователь подтверждает новый оригинальный товар в наличии; количество и документы партии уточните при запросе предложения.", meta_description: "Siemens 6ES7132-6BH01-0BA0 ET 200SP output module: 16 PNP outputs, 24 V DC, 0.5 A/channel, BaseUnit A0. User-confirmed new original stock; request a quote.", meta_description_ru: "Siemens 6ES7132-6BH01-0BA0 ET 200SP: 16 выходов PNP, 24 В DC, 0,5 А/канал, BaseUnit A0. Новый оригинальный товар в наличии по подтверждению пользователя.", sell_price: 104.33, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Siemens/IOModule/6ES7132-6BH01-0BA0/营销素材包/04-独立站内容包/6ES7132-6BH01-0BA0.md

  // ---- generate-data-entry.js additions (2026-11-04) ----
  { brand: "Siemens", model: "6GK7542-5FX00-0XE0", series: "SIMATIC S7-1500", cat: "controllers", spec: "Siemens CP 1542-5 communications processor for connecting SIMATIC S7-1500 to PROFIBUS DP; 9-pin RS-485 interface, DPV1 master or DP device", status: "discont", photo: null, linkedin: null, overview: "Siemens CP 1542-5 connects SIMATIC S7-1500 to PROFIBUS DP, with DPV1 master or device operation. Confirm the CPU and project configuration before ordering. User-confirmed new original stock at USD 300; quantity unspecified.", overview_ru: "Siemens CP 1542-5 подключает SIMATIC S7-1500 к PROFIBUS DP и поддерживает режим DPV1 master или device. Перед заказом проверьте CPU и конфигурацию проекта. Новая оригинальная партия по цене USD 300 подтверждена пользователем; количество не указано.", meta_description: "Siemens 6GK7542-5FX00-0XE0 CP 1542-5 for S7-1500 PROFIBUS DP. Verify CPU and DPV1 role. User-confirmed new original stock at USD 300; quantity unspecified.", meta_description_ru: "Siemens 6GK7542-5FX00-0XE0 CP 1542-5 для PROFIBUS DP в S7-1500. Проверьте CPU и роль DPV1. Новая оригинальная партия за USD 300 подтверждена пользователем; количество уточняется.", video_heading: "Packaging and Label Overview", video_heading_ru: "Обзор упаковки и маркировки", video_description: "This short photo montage shows the product package and label for Siemens CP 1542-5, order number 6GK7542-5FX00-0XE0. It is not a powered or bench-test demonstration. Verify your CPU, PROFIBUS role and project configuration before ordering.", video_description_ru: "Короткий фотомонтаж показывает упаковку и маркировку Siemens CP 1542-5, заказной номер 6GK7542-5FX00-0XE0. Это не демонстрация работы под напряжением и не стендовое испытание. Перед заказом проверьте CPU, роль PROFIBUS и конфигурацию проекта.", sell_price: 300, sell_price_currency: "USD", price_source: "user_confirmed" }, // generate-data-entry.js <- wiki/marketing/Siemens/PLCAccessory/6GK7542-5FX00-0XE0/营销素材包/04-独立站内容包/6GK7542-5FX00-0XE0.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Mitsubishi", model: "MDS-D2-V2-8080", series: "MDS-D2", cat: "servo", spec: "MDS-D2 series 2-axis CNC servo drive unit; confirm motor combination and unit condition before ordering", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/ServoAmplifier/MDS-D2-V2-8080/营销素材包/04-独立站内容包/MDS-D2-V2-8080.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "OMRON", model: "NX-ID3417", series: "NX-series", cat: "controllers", spec: "NX-series digital input unit, 4 PNP inputs, 12–24 VDC rated input, 12-position screwless terminal block", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/OMRON/IOModule/NX-ID3417/营销素材包/04-独立站内容包/NX-ID3417.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Schneider", model: "ATV71HD30N4", series: "Altivar 71", cat: "drives", spec: "Altivar 71 variable speed drive, 30 kW (40 hp), 480 V class, EMC filter and graphic terminal", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Schneider/Inverter/ATV71HD30N4/营销素材包/04-独立站内容包/ATV71HD30N4.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Norgren", model: "B68G-8GK-AR3-RLG", series: "Olympian Plus", cat: "spares", spec: "Olympian Plus G1 filter regulator, 0.4–8 bar adjustment range, 40 µm element, automatic drain and gauge", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Norgren/Filter/B68G-8GK-AR3-RLG/营销素材包/04-独立站内容包/B68G-8GK-AR3-RLG.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Mitsubishi", model: "MDS-D-CV-300", series: "MDS-D", cat: "spares", spec: "MDS-D CNC power supply unit, 200 V class, 30 kW for 30 minutes and 26 kW continuous", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PowerSupply/MDS-D-CV-300/营销素材包/04-独立站内容包/MDS-D-CV-300.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Nidec", model: "E1540H24B7AZ-00", series: "E1540H", cat: "spares", spec: "E1540H centrifugal blower, 24 VDC, 740 mA, 150 × 152 × 40 mm", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Nidec/CoolingFan/E1540H24B7AZ-00/营销素材包/04-独立站内容包/E1540H24B7AZ-00.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Mitsubishi", model: "FX5S-30MT/ES", series: "MELSEC iQ-F FX5S", cat: "controllers", spec: "MELSEC iQ-F FX5S PLC CPU, AC supply, 16 DC inputs and 14 sinking transistor outputs", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PLC/FX5S-30MT_ES/营销素材包/04-独立站内容包/FX5S-30MT_ES.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Mitsubishi", model: "FX5U-32MR/ES", series: "MELSEC iQ-F FX5U", cat: "controllers", spec: "MELSEC iQ-F FX5U PLC CPU, AC supply, 16 DC inputs and 16 relay outputs", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PLC/FX5U-32MR_ES/营销素材包/04-独立站内容包/FX5U-32MR_ES.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "ABB", model: "NPBA-12", series: "NPBA", cat: "spares", spec: "PROFIBUS adapter module for compatible ABB drives, which operate as slave stations on the network", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/ABB/InterfaceModule/NPBA-12/营销素材包/04-独立站内容包/NPBA-12.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "SIKA", model: "VHS10M01171I21", series: "VHS", cat: "sensors", spec: "VHS series flow switch with threaded tee fitting, identified by the article number on the package", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/SIKA/FlowSwitch/VHS10M01171I21/营销素材包/04-独立站内容包/VHS10M01171I21.md

  // ---- generate-data-entry.js additions (2026-11-26) ----
  { brand: "Allen-Bradley", model: "20BD014A3AYNACD0", series: "PowerFlex 700", cat: "drives", spec: "PowerFlex 700 AC drive, 14 A, 10 hp", status: "quote", photo: null, linkedin: null }, // generate-data-entry.js <- wiki/marketing/AllenBradley/Inverter/20BD014A3AYNACD0/营销素材包/04-独立站内容包/20BD014A3AYNACD0.md

];

/* ---- Brand wall — 35+ brands we supply
   `logo` points to a real PNG/SVG in assets/brands/; if missing, render text-only fallback.
   `color` is the brand's primary color, used to render the text logo with brand identity. */
const BRANDS = [
  { name: "Mean Well", country: "Taiwan", logo: "", color: "#0072CE" },
  { name: "STIKO", country: "Netherlands", logo: "", color: "#263b56" },
  { name: "Pilz", country: "Germany", logo: "", color: "#f0c400" },
  { name: "ENGLER", country: "Germany", logo: "", color: "#263b56" },
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
  discont: { label: "Replaced", cls: "discont" },
  quote: { label: "Availability on Request", cls: "quote" }
};
