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
      { from: "6ES7212-1AE30-0XB0", note: "Direct predecessor — same firmware, same pin-out, drop-in replacement." },
      { from: "6ES7212-1AE31-0XB0", note: "Earlier firmware revision — also compatible, same I/O count." },
      { from: "6ES7212-1BE40-0XB0", note: "Different firmware signature — check project; can be migrated via TIA Portal." },
      { from: "6ES7212-1HE40-0XB0", note: "AC/DC/RLY variant — same CPU, only PSU/relay outputs differ. Verify output type before swap." }
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
  { brand: "Siemens", model: "3RM1002-1AA04", series: "SIRIUS 3RM1", cat: "drives", spec: "Solid-state motor starter with overload protection, 0.4–2.0A, 230/400/500V, Made in Germany", status: "instock", photo: "3RM1002-1AA04.jpg", linkedin: "3RM1002-1AA04.png", sell_price: 240.84, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Schneider ----
  { brand: "Schneider", model: "ATV12HU15M2", series: "Altivar 12", cat: "drives", spec: "1.5kW inverter, single-phase 200–240V input, 3-phase output, 7.5A", status: "instock", photo: "ATV12HU15M2.jpg", linkedin: "ATV12HU15M2.png", sell_price: 215.66, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Schneider", model: "LT3-SA00M", series: "LT3SA (Telemecanique)", cat: "spares", spec: "PTC thermistor motor protection relay, 115/230V dual voltage, 2 relay outputs, Made in France", status: "instock", photo: "LT3-SA00M.jpg", linkedin: "LT3-SA00M.png", sell_price: 267.66, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Mitsubishi ----
  { brand: "Mitsubishi", model: "FR-D740-050-EC", series: "FR-D700", cat: "drives", spec: "2.2kW inverter, 3-phase 400V, 5.0A, CE certified", status: "instock", photo: null, linkedin: "FR-D740-050-EC.png", sell_price: 739.98, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Mitsubishi", model: "FR-A740-7.5K", series: "FR-A700", cat: "drives", spec: "7.5kW inverter, 3-phase 400V, vector control", status: "discont", photo: null, linkedin: "FR-A740-7.5K.png", sell_price: 789.17, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Mitsubishi", model: "FR-A840-7.5K", series: "FR-A800", cat: "drives", spec: "7.5kW — direct replacement for FR-A740-7.5K", status: "instock", photo: null, linkedin: "FR-A740-7.5K.png" },
  { brand: "Mitsubishi", model: "MR-J3-60B", series: "MELSERVO-J3", cat: "servo", spec: "600W servo amplifier, 200–230V input, Japan original", status: "legacy", photo: "MR-J3-60B.jpg", linkedin: "MR-J3-60B.png", sell_price: 251.58, sell_price_currency: "USD", price_source: "ebay_ref" },

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
  { brand: "OMRON", model: "3G3MX2-AB002-V1", series: "MX2", cat: "drives", spec: "0.2kW compact inverter, single-phase 200V", status: "discont", photo: null, linkedin: "3G3MX2-AB002-V1.png", sell_price: 671.0, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "OMRON", model: "3G3MX2-AB002-V2", series: "MX2", cat: "drives", spec: "0.2kW — V1 replacement, identical specifications", status: "instock", photo: null, linkedin: "3G3MX2-AB002-V1.png", sell_price: 345.0, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "OMRON", model: "R88M-KE75030H", series: "Accurax G5", cat: "servo", spec: "750W servo motor, 2.4N·m, 3000r/min, 3φAC120V, IP67, CE/UL", status: "instock", photo: "R88M-KE75030H.jpg", linkedin: "R88M-KE75030H.png" },
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
    sell_price: 216.38, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Yaskawa ----
  { brand: "Yaskawa", model: "CIMR-VB4A0038FBA", series: "V1000", cat: "drives", spec: "18.5kW(ND)/15kW(HD) inverter, 3-phase 380V", status: "legacy", photo: null, linkedin: "CIMR-VB4A0038FBA.png", sell_price: 698.28, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Yaskawa", model: "GA50C4038EBA", series: "GA500", cat: "drives", spec: "18.5kW(ND)/15kW(HD) — V1000 replacement", status: "instock", photo: null, linkedin: "CIMR-VB4A0038FBA.png" },
  { brand: "Yaskawa", model: "CIPR-GA70D4038ABMA-AAAABA", series: "GA700", cat: "drives", spec: "18.5kW HD / 22kW ND inverter, 3-phase 400V, built-in EMC filter", status: "instock", photo: null, linkedin: "CIPR-GA70D4038ABMA-AAAABA.png", sell_price: 1950.0, sell_price_currency: "USD", price_source: "ebay_ref" },
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
  { brand: "Yaskawa", model: "SGM7J-08A6A6C", series: "Sigma-7", cat: "servo", spec: "750W servo motor, 200V, 24-bit absolute encoder, with brake, IP67", status: "instock", photo: null, linkedin: "SGM7J-08A6A6C.png", sell_price: 368.79, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Yaskawa", model: "SGMAH-04ADA-TF13", series: "Sigma-II", cat: "servo", spec: "400W servo motor, 200V, 2.6A, 1.27N·m, 3000r/min, Japan original legacy spare", status: "legacy", photo: "SGMAH-04ADA-TF13.jpg", linkedin: "SGMAH-04ADA-TF13.png", sell_price: 1005.27, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Allen-Bradley ----
  { brand: "Allen-Bradley", model: "2097-V34PR6-LM", series: "Kinetix 350", cat: "servo", spec: "Single-axis servo drive, 400/480VAC, 6.0A, STO CAT.3/D, EtherNet/IP, USA original", status: "instock", photo: "2097-V34PR6-LM.jpg", linkedin: "2097-V34PR6-LM.png", sell_price: 1911.68, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Allen-Bradley", model: "150-C30NBD", series: "SMC-3", cat: "drives", spec: "Soft starter, 30A (3-wire)/51A (Delta), 3-phase 200–480V", status: "instock", photo: "150-C30NBD.jpg", linkedin: "150-C30NBD.png", sell_price: 402.36, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- ABB ----
  { brand: "ABB", model: "3AFE68257913", series: "AIBP-51", cat: "spares", spec: "Input bridge protection board, 3× Vishay components, RoHS, Finland original", status: "instock", photo: "3AFE68257913.jpg", linkedin: null },
  { brand: "ABB", model: "3AFE68249457", series: "APOW-01C + NRED-61", cat: "spares", spec: "Power supply board for drives, Finland original", status: "instock", photo: "3AFE68249457.jpg", linkedin: null },
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
  { brand: "ABB", model: "3ABD64644521", series: "RPLC-03C", cat: "spares", spec: "Drive control panel cable, 3m", status: "instock", photo: "3ABD64644521.jpg", linkedin: "3ABD64644521.png" },
  { brand: "ABB", model: "61059113", series: "Plastic Fibre Optic", cat: "spares", spec: "Double plastic fibre optic cable, 5m, gate drive ↔ main control board", status: "instock", photo: "61059113.jpg", linkedin: "61059113.png" },

  // ---- Delta ----
  { brand: "Delta", model: "AS228P-A", series: "AS200", cat: "controllers", spec: "PLC CPU module, 16DI/12DO, 24VDC, built-in Ethernet + 2×RS485 + CAN, CE/UKCA/UL", status: "instock", photo: "AS228P-A.jpg", linkedin: "AS228P-A.png", sell_price: 356.59, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Delta", model: "ASD-B3-0721-M", series: "ASDA-B3", cat: "servo", spec: "750W servo drive, 200–230VAC, CE/UKCA/UL certified", status: "instock", photo: "ASD-B3-0721-M.jpg", linkedin: "ASD-B3-0721-M.png", sell_price: 381.09, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- LS Electric ----
  { brand: "LS Electric", model: "LSLV0004G100-4E0NN", series: "G100", cat: "drives", spec: "0.4kW/0.5HP inverter, 3-phase 380–480V, CE/UL, built-in EMC", status: "instock", photo: "LSLV0004G100-4E0NN.jpg", linkedin: "LSLV0004G100-4E0NN.png" },
  { brand: "LS Electric", model: "XGF-PD4H", series: "XGT", cat: "controllers", spec: "Positioning module, line-drive differential pulse output, 4-axis, UL/CE/KC, Made in Korea", status: "instock", photo: "XGF-PD4H.jpg", linkedin: "XGF-PD4H.png", sell_price: 920.84, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- INVT ----
  { brand: "INVT", model: "GD200A-018G/022P-4", series: "GD200A", cat: "drives", spec: "18.5kW (G heavy duty) / 22kW (P variable torque) inverter, 3-phase 380–440V", status: "instock", photo: null, linkedin: "GD200A-018G_022P-4.png", sell_price: 1110.59, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Pro-face / Beckhoff ----
  { brand: "Pro-face", model: "PFXGP4301TADW", series: "GP4000", cat: "hmi", spec: "7.5\" TFT touchscreen, 640×480, RS-232/485 + Ethernet, IP65, DC24V", status: "instock", photo: "PFXGP4301TADW.jpg", linkedin: "PFXGP4301TADW.png", sell_price: 292.71, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Beckhoff", model: "CP6702-1028-0040", series: "CP6702", cat: "hmi", spec: "15\" touch Panel PC, Celeron 1.4GHz, 2GB RAM, 20GB CFast, DC24V", status: "instock", photo: null, linkedin: "CP6702-1028-0040.png", sell_price: 9932.25, sell_price_currency: "USD", price_source: "ebay_ref" },

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
  { brand: "VEGA", model: "PS6X-222-2TC", series: "VEGAPULS 6X", cat: "sensors", spec: "80GHz radar level meter, outdoor IP66/IP67 Type 4X, 4–20mA HART, Germany original", status: "instock", photo: "VEGAPULS-6X.jpg", linkedin: "PS6X-222-2TC.png" },
  { brand: "VEGA", model: "PS64.RXHCAHXBM00M", series: "VEGAPULS 64", cat: "sensors", spec: "80GHz compact radar, full stainless steel, PTFE, −1~10bar, 30m range, Germany original", status: "instock", photo: "VEGAPULS-64.jpg", linkedin: "PS64.RXHCAHXBM00M.png" },
  { brand: "Honeywell", model: "943-F4V-2D-1C0-300E", series: "943", cat: "sensors", spec: "Proximity sensor, analog 0–10V + switching output, teach-in, 15–30VDC", status: "instock", photo: "943-F4V-2D-1C0-300E.jpg", linkedin: null, sell_price: 709.04, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "TURCK", model: "Ni5-G12K-AP6X", series: "Ni5-G12K", cat: "sensors", spec: "M12 inductive proximity switch, PNP NO 3-wire, Sn 5mm, 10–30VDC, CE/UL", status: "instock", photo: "Ni5-G12K-AP6X.jpg", linkedin: "Ni5-G12K-AP6X.png", sell_price: 25.46, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Barksdale", model: "B2T-A48SS-P5", series: "B2T", cat: "sensors", spec: "Pressure switch, 240–4800 PSI, SS wetted parts, NEMA 4, 10A, USA original", status: "instock", photo: "B2T-A48SS-P5.jpg", linkedin: "B2T-A48SS-P5.png", sell_price: 866.0, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "POSITAL", model: "OCD-DPC1B-1212-C100-H3P", series: "OCD-DPC1B", cat: "sensors", spec: "Multiturn absolute encoder, 4096×4096 (24-bit), Profibus DP, Made in Poland", status: "instock", photo: "OCD-DPC1B-1212-C100-H3P.jpg", linkedin: "OCD-DPC1B-1212-C100-H3P.png", sell_price: 635.63, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "CX", model: "CSP50-8-500BZ-5-30TG5", series: "CSP50", cat: "sensors", spec: "Incremental rotary encoder, 500PPR, 8mm shaft, DC5–30V, differential ABZ output", status: "instock", photo: "CSP50-8-500BZ-5-30TG5.jpg", linkedin: "CSP50-8-500BZ-5-30TG5.png", sell_price: 76.76, sell_price_currency: "USD", price_source: "ebay_ref" },

  // ---- Components & spares ----
  { brand: "Weidmüller", model: "SKH-F48", series: "SKH", cat: "spares", spec: "Passive interface terminal module, 32-point screw terminal ↔ ribbon cable, DIN rail, CE, Made in Poland", status: "instock", photo: "SKH-F48.jpg", linkedin: "SKH-F48.png", sell_price: 33.0, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "FANOX", model: "U3N-400", series: "U3N", cat: "spares", spec: "3-phase + neutral voltage monitoring relay, 400VAC, DIP-adjustable thresholds, 2 relay outputs, Made in Spain", status: "instock", photo: "U3N-400.jpg", linkedin: "U3N-400.png", sell_price: 209.95, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Bosch Rexroth", model: "1.0630-H6XL-A00-0-M", series: "H6XL", cat: "spares", spec: "Replacement hydraulic filter element, German factory original", status: "instock", photo: "1.0630-H6XL-A00-0-M.jpg", linkedin: null, sell_price: 234.8, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "Tianhe", model: "WDJ36-II", series: "WDJ36", cat: "sensors", spec: "Precision conductive-plastic potentiometer, custom resistance/travel, bulk stock", status: "instock", photo: "WDJ36-II.jpg", linkedin: "WDJ36-II.png", sell_price: 87.97, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "DPG", model: "5GN-20-K", series: "5IK120GN-CF", cat: "drives", spec: "Single-phase AC gear motor, 120W, 220V 60Hz, 1350r/min, 20:1 ratio", status: "instock", photo: "5GN-20-K.jpg", linkedin: "5GN-20-K.png", sell_price: 257.21, sell_price_currency: "USD", price_source: "ebay_ref" },
  { brand: "General", model: "80ST-M02430", series: "80ST", cat: "servo", spec: "0.75kW AC servo motor, 220V, 2.39N·m, 3000RPM", status: "instock", photo: null, linkedin: "R88M-KE75030H.png", sell_price: 364.94, sell_price_currency: "USD", price_source: "ebay_ref" },
  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "ABB", model: "UA75-30-00RA", series: "UA75", cat: "spares", spec: "The ABB UA75-30-00RA is a capacitor-switching contactor rated for 400V/60kvar power factor correction duty", status: "instock", photo: "UA75-30-00RA.jpg", linkedin: null, sell_price: 281.12, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/ABB/Contactor/UA75-30-00RA/营销素材包/04-独立站内容包/UA75-30-00RA.md
  { brand: "AirTAC", model: "X-PK506", series: "PK506", cat: "sensors", spec: "The AirTAC X-PK506 is a mechanical pressure switch with auto-reset, adjustable 1-6 kgf/cm² range and 1-4 kgf/cm² differential", status: "instock", photo: "X-PK506.jpg", linkedin: null, sell_price: 29.45, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/AirTAC/PressureSwitch/X-PK506/营销素材包/04-独立站内容包/X-PK506.md
  { brand: "Burkert", model: "ID-No-00007225", series: "Type 2000", cat: "spares", spec: "The Burkert Type 2000 (ID-No 00007225) is a pneumatically actuated 2/2-way angle seat valve, DN25/PN25, with PTFE seal and G1 threaded connection", status: "instock", photo: "ID-No-00007225.jpg", linkedin: null, sell_price: 219.22, sell_price_currency: "USD", price_source: "web_ref" }, // generate-data-entry.js <- wiki/marketing/Burkert/AngleSeatValve/ID-No-00007225/营销素材包/04-独立站内容包/ID-No-00007225.md
  { brand: "Danfoss", model: "AVTA15-003N2182", series: "AVTA", cat: "spares", spec: "Self-acting water regulating valve, DN15, PN16, 50-90C temperature control range, no external power required", status: "instock", photo: "AVTA15-003N2182.jpg", linkedin: null, sell_price: 415.9, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Danfoss/WaterRegulatingValve/AVTA15-003N2182/营销素材包/04-独立站内容包/AVTA15-003N2182.md
  { brand: "Haiwell", model: "B7H-W", series: "B7H", cat: "hmi", spec: "7-inch WiFi-enabled intelligent HMI touch panel with built-in cloud SCADA support", status: "instock", photo: "B7H-W.jpg", linkedin: null }, // generate-data-entry.js <- wiki/marketing/Haiwell/HMI/B7H-W/营销素材包/04-独立站内容包/B7H-W.md
  { brand: "JAKON", model: "JK76", series: "JK76", cat: "sensors", spec: "Intelligent digital counter/length meter for production line counting and length measurement", status: "instock", photo: "JK76.jpg", linkedin: null }, // generate-data-entry.js <- wiki/marketing/JAKON/Counter/JK76/营销素材包/04-独立站内容包/JK76.md
  { brand: "MAC", model: "250B-611JA", series: "250B", cat: "spares", spec: "3/4-way solenoid and air/hand operated valve, 24VDC 8.5W coil, 25-150 PSI", status: "instock", photo: "250B-611JA.jpg", linkedin: null }, // generate-data-entry.js <- wiki/marketing/MAC/SolenoidValve/250B-611JA/营销素材包/04-独立站内容包/250B-611JA.md
  { brand: "PWERUN", model: "FX3U-30MR", series: "FX3U-compatible", cat: "controllers", spec: "The FX3U-30MR is an FX3U instruction-set compatible PLC control board manufactured by PWERUN (not a genuine Mitsubishi product)", status: "instock", photo: "FX3U-30MR.jpg", linkedin: null, sell_price: 42.09, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Mitsubishi/PLC/FX3U-30MR/营销素材包/04-独立站内容包/FX3U-30MR.md
  { brand: "OMRON", model: "E2E-X18MB1D30", series: "E2E", cat: "sensors", spec: "The OMRON E2E-X18MB1D30 is an inductive proximity sensor, 10-30VDC, with 2m cable and 100mA max load current", status: "instock", photo: "E2E-X18MB1D30.jpg", linkedin: null, sell_price: 127.8, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/OMRON/ProximitySwitch/E2E-X18MB1D30/营销素材包/04-独立站内容包/E2E-X18MB1D30.md
  { brand: "OMRON", model: "E2E-X1R5F2", series: "E2E", cat: "sensors", spec: "The OMRON E2E-X1R5F2 is an inductive proximity sensor, 12-24VDC, with 2m cable", status: "instock", photo: "E2E-X1R5F2.jpg", linkedin: null, sell_price: 187.99, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/OMRON/ProximitySwitch/E2E-X1R5F2/营销素材包/04-独立站内容包/E2E-X1R5F2.md
  { brand: "Panasonic", model: "MSM15205C", series: "MINAS", cat: "servo", spec: "MINAS-series AC servo motor, 1.5kW, 3-phase 200V, 3000rpm rated speed, 4.77Nm rated torque", status: "instock", photo: "MSM15205C.jpg", linkedin: null }, // generate-data-entry.js <- wiki/marketing/Panasonic/Servo/MSM15205C/营销素材包/04-独立站内容包/MSM15205C.md
  { brand: "Schneider", model: "LC1D32M7", series: "TeSys D", cat: "spares", spec: "The Schneider LC1D32M7 is a TeSys D series AC contactor rated 32A continuous current, 220V coil, with 1NO+1NC auxiliary contacts", status: "instock", photo: "LC1D32M7.jpg", linkedin: null, sell_price: 90.93, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Schneider/Contactor/LC1D32M7/营销素材包/04-独立站内容包/LC1D32M7.md
  { brand: "Siemens", model: "6SL3120-2TE21-0AA4", series: "SINAMICS S120", cat: "drives", spec: "The Siemens 6SL3120-2TE21-0AA4 is a SINAMICS S120 Double Motor Module with two independent 9A outputs at 3AC 400V, fed from a common DC600V bus, with 4x DRIVE-CLiQ interfaces", status: "instock", photo: "6SL3120-2TE21-0AA4.jpg", linkedin: null, sell_price: 628.06, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Siemens/MotorModule/6SL3120-2TE21-0AA4/营销素材包/04-独立站内容包/6SL3120-2TE21-0AA4.md
  { brand: "Siemens", model: "6EP3437-8SB00-0AY0", series: "SITOP PSU8200", cat: "spares", spec: "The Siemens 6EP3437-8SB00-0AY0 is a SITOP PSU8200 series switched-mode power supply, 3AC 400-500V input, DC24V/40A output, adjustable 24-28V", status: "instock", photo: "6EP3437-8SB00-0AY0.jpg", linkedin: null, sell_price: 314.69, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/Siemens/PowerSupply/6EP3437-8SB00-0AY0/营销素材包/04-独立站内容包/6EP3437-8SB00-0AY0.md
  { brand: "Telemecanique", model: "XS512BLPAL5", series: "XS5", cat: "sensors", spec: "The Telemecanique XS512BLPAL5 is an inductive proximity switch with 2mm sensing distance, PNP NO 3-wire output, 12-48VDC", status: "instock", photo: "XS512BLPAL5.jpg", linkedin: null }, // generate-data-entry.js <- wiki/marketing/Telemecanique/ProximitySwitch/XS512BLPAL5/营销素材包/04-独立站内容包/XS512BLPAL5.md
  { brand: "Yaskawa", model: "SGMGV-13DDA6H", series: "Sigma-V", cat: "servo", spec: "The Yaskawa SGMGV-13DDA6H is a Sigma-V series AC servo motor rated 1.3kW, 400V, 1500rpm rated speed, 8.34Nm rated torque, with incremental encoder", status: "instock", photo: "SGMGV-13DDA6H.jpg", linkedin: null, sell_price: 3735.45, sell_price_currency: "USD", price_source: "web_ref" }, // generate-data-entry.js <- wiki/marketing/Yaskawa/Servo/SGMGV-13DDA6H/营销素材包/04-独立站内容包/SGMGV-13DDA6H.md
  { brand: "ifm", model: "AC3216", series: "SmartLine", cat: "sensors", spec: "The ifm AC3216 is a SmartLine AS-Interface I/O module with 4 analog current inputs (4-20mA each), IP20, supporting 2/3/4-wire sensor connections", status: "instock", photo: "AC3216.jpg", linkedin: null, sell_price: 707.41, sell_price_currency: "USD", price_source: "ebay_ref" }, // generate-data-entry.js <- wiki/marketing/ifm/ASiModule/AC3216/营销素材包/04-独立站内容包/AC3216.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "OMRON", model: "E6C2-CWZ6C 2500P/R", series: "E6C2-C", cat: "sensors", spec: "Incremental rotary encoder, 50mm body, 2500 pulses/revolution, NPN open-collector output, DC5-24V", status: "instock", photo: null, linkedin: null, sell_price: 46.97, sell_price_currency: "USD", price_source: "procurement_quote_min" }, // generate-data-entry.js <- wiki/marketing/OMRON/Encoder/E6C2-CWZ6C-2500P_R/营销素材包/04-独立站内容包/E6C2-CWZ6C-2500P_R.md

  // ---- generate-data-entry.js additions (2026-09-13) ----
  { brand: "OMRON", model: "R88M-K1K530H-S2", series: "G5", cat: "servo", spec: "G5 series AC servo motor, 1.5kW, 200V, 3000rpm, incremental encoder, keyed shaft", status: "instock", photo: null, linkedin: null, sell_price: 187.85, sell_price_currency: "USD", price_source: "procurement_quote_min" }, // generate-data-entry.js <- wiki/marketing/OMRON/Servo/R88M-K1K530H-S2/营销素材包/04-独立站内容包/R88M-K1K530H-S2.md

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
