/* Fouwell product catalog data
   Categories: controllers | hmi | servo | drives | sensors | spares
   Status: instock | legacy | discont
   `linkedin`: path to marketing image under wiki/marketing/<brand>/.../LinkedIn/ (used as photo fallback) */

const PRODUCTS = [
  // ---- Siemens ----
  { brand: "Siemens", model: "6ES7212-1AE40-0XB0", series: "S7-1200", cat: "controllers", spec: "CPU 1212C DC/DC/DC, 8DI/6DO/2AI, 24VDC, CE/CCC", status: "instock", photo: "6ES7212-1AE40-0XB0.jpg", linkedin: "6ES7212-1AE40-0XB0.png" },
  { brand: "Siemens", model: "3RM1002-1AA04", series: "SIRIUS 3RM1", cat: "drives", spec: "Solid-state motor starter with overload protection, 0.4–2.0A, 230/400/500V, Made in Germany", status: "instock", photo: "3RM1002-1AA04.jpg", linkedin: "3RM1002-1AA04.png" },

  // ---- Schneider ----
  { brand: "Schneider", model: "ATV12HU15M2", series: "Altivar 12", cat: "drives", spec: "1.5kW inverter, single-phase 200–240V input, 3-phase output, 7.5A", status: "instock", photo: "ATV12HU15M2.jpg", linkedin: "ATV12HU15M2.png" },
  { brand: "Schneider", model: "LT3-SA00M", series: "LT3SA (Telemecanique)", cat: "spares", spec: "PTC thermistor motor protection relay, 115/230V dual voltage, 2 relay outputs, Made in France", status: "instock", photo: "LT3-SA00M.jpg", linkedin: "LT3-SA00M.png" },

  // ---- Mitsubishi ----
  { brand: "Mitsubishi", model: "FR-D740-050-EC", series: "FR-D700", cat: "drives", spec: "2.2kW inverter, 3-phase 400V, 5.0A, CE certified", status: "instock", photo: null, linkedin: "FR-D740-050-EC.png" },
  { brand: "Mitsubishi", model: "FR-A740-7.5K", series: "FR-A700", cat: "drives", spec: "7.5kW inverter, 3-phase 400V, vector control", status: "discont", photo: null, linkedin: "FR-A740-7.5K.png" },
  { brand: "Mitsubishi", model: "FR-A840-7.5K", series: "FR-A800", cat: "drives", spec: "7.5kW — direct replacement for FR-A740-7.5K", status: "instock", photo: null, linkedin: "FR-A740-7.5K.png" },
  { brand: "Mitsubishi", model: "MR-J3-60B", series: "MELSERVO-J3", cat: "servo", spec: "600W servo amplifier, 200–230V input, Japan original", status: "legacy", photo: "MR-J3-60B.jpg", linkedin: "MR-J3-60B.png" },

  // ---- OMRON ----
  { brand: "OMRON", model: "NS10-TV01B-V2", series: "NS10", cat: "hmi", spec: "10.4\" TFT touchscreen, 640×480, RS-232/422/485 + Ethernet, IP65, Japan original", status: "instock", photo: "NS10-TV01B-V2.jpg", linkedin: "NS10-TV01B-V2.png" },
  { brand: "OMRON", model: "3G3MX2-AB002-V1", series: "MX2", cat: "drives", spec: "0.2kW compact inverter, single-phase 200V", status: "discont", photo: null, linkedin: "3G3MX2-AB002-V1.png" },
  { brand: "OMRON", model: "3G3MX2-AB002-V2", series: "MX2", cat: "drives", spec: "0.2kW — V1 replacement, identical specifications", status: "instock", photo: null, linkedin: "3G3MX2-AB002-V1.png" },
  { brand: "OMRON", model: "R88M-KE75030H", series: "Accurax G5", cat: "servo", spec: "750W servo motor, 2.4N·m, 3000r/min, 3φAC120V, IP67, CE/UL", status: "instock", photo: "R88M-KE75030H.jpg", linkedin: "R88M-KE75030H.png" },
  { brand: "OMRON", model: "R88D-KN08H-ECT", series: "Accurax G5", cat: "servo", spec: "750W servo drive, 200–240VAC, EtherCAT, matches R88M-KE75030H, CE/UL/TUV", status: "instock", photo: "R88D-KN08H-ECT.jpg", linkedin: "R88D-KN08H-ECT.png" },
  { brand: "OMRON", model: "E5AC-QR4D5M-000", series: "E5AC", cat: "sensors", spec: "Digital temperature controller, 96×96mm, 4 auxiliary outputs, 24VAC/VDC", status: "instock", photo: null, linkedin: "E5AC-QR4D5M-000.png" },

  // ---- Yaskawa ----
  { brand: "Yaskawa", model: "CIMR-VB4A0038FBA", series: "V1000", cat: "drives", spec: "18.5kW(ND)/15kW(HD) inverter, 3-phase 380V", status: "legacy", photo: null, linkedin: "CIMR-VB4A0038FBA.png" },
  { brand: "Yaskawa", model: "GA50C4038EBA", series: "GA500", cat: "drives", spec: "18.5kW(ND)/15kW(HD) — V1000 replacement", status: "instock", photo: null, linkedin: "CIMR-VB4A0038FBA.png" },
  { brand: "Yaskawa", model: "CIPR-GA70D4038ABMA-AAAABA", series: "GA700", cat: "drives", spec: "18.5kW HD / 22kW ND inverter, 3-phase 400V, built-in EMC filter", status: "instock", photo: null, linkedin: "CIPR-GA70D4038ABMA-AAAABA.png" },
  { brand: "Yaskawa", model: "CIMR-AB4A0011FBA", series: "A1000", cat: "drives", spec: "5.5kW(ND)/3.7kW(HD) inverter, 3-phase 400V, open/closed-loop vector control", status: "instock", photo: "CIMR-AB4A0011FBA.jpg", linkedin: "CIMR-AB4A0011FBA.png" },
  { brand: "Yaskawa", model: "SGM7J-08A6A6C", series: "Sigma-7", cat: "servo", spec: "750W servo motor, 200V, 24-bit absolute encoder, with brake, IP67", status: "instock", photo: null, linkedin: "SGM7J-08A6A6C.png" },
  { brand: "Yaskawa", model: "SGMAH-04ADA-TF13", series: "Sigma-II", cat: "servo", spec: "400W servo motor, 200V, 2.6A, 1.27N·m, 3000r/min, Japan original legacy spare", status: "legacy", photo: "SGMAH-04ADA-TF13.jpg", linkedin: "SGMAH-04ADA-TF13.png" },

  // ---- Allen-Bradley ----
  { brand: "Allen-Bradley", model: "2097-V34PR6-LM", series: "Kinetix 350", cat: "servo", spec: "Single-axis servo drive, 400/480VAC, 6.0A, STO CAT.3/D, EtherNet/IP, USA original", status: "instock", photo: "2097-V34PR6-LM.jpg", linkedin: "2097-V34PR6-LM.png" },
  { brand: "Allen-Bradley", model: "150-C30NBD", series: "SMC-3", cat: "drives", spec: "Soft starter, 30A (3-wire)/51A (Delta), 3-phase 200–480V", status: "instock", photo: "150-C30NBD.jpg", linkedin: "150-C30NBD.png" },

  // ---- ABB ----
  { brand: "ABB", model: "3AFE68257913", series: "AIBP-51", cat: "spares", spec: "Input bridge protection board, 3× Vishay components, RoHS, Finland original", status: "instock", photo: "3AFE68257913.jpg", linkedin: null },
  { brand: "ABB", model: "3AFE68249457", series: "APOW-01C + NRED-61", cat: "spares", spec: "Power supply board for drives, Finland original", status: "instock", photo: "3AFE68249457.jpg", linkedin: null },
  { brand: "ABB", model: "68561906A", series: "AGDR-71C", cat: "spares", spec: "IGBT gate drive board with Fuji 6MBI225U-120 module, for ACS800/ACS880", status: "instock", photo: "68561906A.png", linkedin: "68561906A.png" },
  { brand: "ABB", model: "3ABD64644521", series: "RPLC-03C", cat: "spares", spec: "Drive control panel cable, 3m", status: "instock", photo: "3ABD64644521.jpg", linkedin: "3ABD64644521.png" },
  { brand: "ABB", model: "61059113", series: "Plastic Fibre Optic", cat: "spares", spec: "Double plastic fibre optic cable, 5m, gate drive ↔ main control board", status: "instock", photo: "61059113.jpg", linkedin: "61059113.png" },

  // ---- Delta ----
  { brand: "Delta", model: "AS228P-A", series: "AS200", cat: "controllers", spec: "PLC CPU module, 16DI/12DO, 24VDC, built-in Ethernet + 2×RS485 + CAN, CE/UKCA/UL", status: "instock", photo: "AS228P-A.jpg", linkedin: "AS228P-A.png" },
  { brand: "Delta", model: "ASD-B3-0721-M", series: "ASDA-B3", cat: "servo", spec: "750W servo drive, 200–230VAC, CE/UKCA/UL certified", status: "instock", photo: "ASD-B3-0721-M.jpg", linkedin: "ASD-B3-0721-M.png" },

  // ---- LS Electric ----
  { brand: "LS Electric", model: "LSLV0004G100-4E0NN", series: "G100", cat: "drives", spec: "0.4kW/0.5HP inverter, 3-phase 380–480V, CE/UL, built-in EMC", status: "instock", photo: "LSLV0004G100-4E0NN.jpg", linkedin: "LSLV0004G100-4E0NN.png" },
  { brand: "LS Electric", model: "XGF-PD4H", series: "XGT", cat: "controllers", spec: "Positioning module, line-drive differential pulse output, 4-axis, UL/CE/KC, Made in Korea", status: "instock", photo: "XGF-PD4H.jpg", linkedin: "XGF-PD4H.png" },

  // ---- INVT ----
  { brand: "INVT", model: "GD200A-018G/022P-4", series: "GD200A", cat: "drives", spec: "18.5kW (G heavy duty) / 22kW (P variable torque) inverter, 3-phase 380–440V", status: "instock", photo: null, linkedin: "GD200A-018G_022P-4.png" },

  // ---- Pro-face / Beckhoff ----
  { brand: "Pro-face", model: "PFXGP4301TADW", series: "GP4000", cat: "hmi", spec: "7.5\" TFT touchscreen, 640×480, RS-232/485 + Ethernet, IP65, DC24V", status: "instock", photo: "PFXGP4301TADW.jpg", linkedin: "PFXGP4301TADW.png" },
  { brand: "Beckhoff", model: "CP6702-1028-0040", series: "CP6702", cat: "hmi", spec: "15\" touch Panel PC, Celeron 1.4GHz, 2GB RAM, 20GB CFast, DC24V", status: "instock", photo: null, linkedin: "CP6702-1028-0040.png" },

  // ---- Sensors & instruments ----
  { brand: "VEGA", model: "PS6X.2SWYDBXATKMKHAXXXXXXX", series: "VEGAPULS 6X", cat: "sensors", spec: "80GHz radar level meter, PP horn antenna, 120m range, 4–20mA HART, IP66/68, Germany original", status: "instock", photo: "PS6X.2SWYDBXATKMKHAXXXXXXX.jpg", linkedin: "PS6X.2SWYDBXATKMKHAXXXXXXX.png" },
  { brand: "VEGA", model: "PS6X-222-2TC", series: "VEGAPULS 6X", cat: "sensors", spec: "80GHz radar level meter, outdoor IP66/IP67 Type 4X, 4–20mA HART, Germany original", status: "instock", photo: "VEGAPULS-6X.jpg", linkedin: "PS6X-222-2TC.png" },
  { brand: "VEGA", model: "PS64.RXHCAHXBM00M", series: "VEGAPULS 64", cat: "sensors", spec: "80GHz compact radar, full stainless steel, PTFE, −1~10bar, 30m range, Germany original", status: "instock", photo: "VEGAPULS-64.jpg", linkedin: "PS64.RXHCAHXBM00M.png" },
  { brand: "Honeywell", model: "943-F4V-2D-1C0-300E", series: "943", cat: "sensors", spec: "Proximity sensor, analog 0–10V + switching output, teach-in, 15–30VDC", status: "instock", photo: "943-F4V-2D-1C0-300E.jpg", linkedin: null },
  { brand: "TURCK", model: "Ni5-G12K-AP6X", series: "Ni5-G12K", cat: "sensors", spec: "M12 inductive proximity switch, PNP NO 3-wire, Sn 5mm, 10–30VDC, CE/UL", status: "instock", photo: "Ni5-G12K-AP6X.jpg", linkedin: "Ni5-G12K-AP6X.png" },
  { brand: "Barksdale", model: "B2T-A48SS-P5", series: "B2T", cat: "sensors", spec: "Pressure switch, 240–4800 PSI, SS wetted parts, NEMA 4, 10A, USA original", status: "instock", photo: "B2T-A48SS-P5.jpg", linkedin: "B2T-A48SS-P5.png" },
  { brand: "POSITAL", model: "OCD-DPC1B-1212-C100-H3P", series: "OCD-DPC1B", cat: "sensors", spec: "Multiturn absolute encoder, 4096×4096 (24-bit), Profibus DP, Made in Poland", status: "instock", photo: "OCD-DPC1B-1212-C100-H3P.jpg", linkedin: "OCD-DPC1B-1212-C100-H3P.png" },
  { brand: "CX", model: "CSP50-8-500BZ-5-30TG5", series: "CSP50", cat: "sensors", spec: "Incremental rotary encoder, 500PPR, 8mm shaft, DC5–30V, differential ABZ output", status: "instock", photo: "CSP50-8-500BZ-5-30TG5.jpg", linkedin: "CSP50-8-500BZ-5-30TG5.png" },

  // ---- Components & spares ----
  { brand: "Weidmüller", model: "SKH-F48", series: "SKH", cat: "spares", spec: "Passive interface terminal module, 32-point screw terminal ↔ ribbon cable, DIN rail, CE, Made in Poland", status: "instock", photo: "SKH-F48.jpg", linkedin: "SKH-F48.png" },
  { brand: "FANOX", model: "U3N-400", series: "U3N", cat: "spares", spec: "3-phase + neutral voltage monitoring relay, 400VAC, DIP-adjustable thresholds, 2 relay outputs, Made in Spain", status: "instock", photo: "U3N-400.jpg", linkedin: "U3N-400.png" },
  { brand: "Bosch Rexroth", model: "1.0630-H6XL-A00-0-M", series: "H6XL", cat: "spares", spec: "Replacement hydraulic filter element, German factory original", status: "instock", photo: "1.0630-H6XL-A00-0-M.jpg", linkedin: null },
  { brand: "Tianhe", model: "WDJ36-II", series: "WDJ36", cat: "sensors", spec: "Precision conductive-plastic potentiometer, custom resistance/travel, bulk stock", status: "instock", photo: "WDJ36-II.jpg", linkedin: "WDJ36-II.png" },
  { brand: "DPG", model: "5GN-20-K", series: "5IK120GN-CF", cat: "drives", spec: "Single-phase AC gear motor, 120W, 220V 60Hz, 1350r/min, 20:1 ratio", status: "instock", photo: "5GN-20-K.jpg", linkedin: "5GN-20-K.png" },
  { brand: "General", model: "80ST-M02430", series: "80ST", cat: "servo", spec: "0.75kW AC servo motor, 220V, 2.39N·m, 3000RPM", status: "instock", photo: null, linkedin: "R88M-KE75030H.png" }
];

/* ---- Brand wall — 35+ brands we supply
   `logo` points to a real PNG/SVG in assets/brands/; if missing, render text-only fallback.
   `color` is the brand's primary color, used to render the text logo with brand identity. */
const BRANDS = [
  { name: "Siemens",       country: "Germany",       logo: "assets/brands/real/siemens.svg",    color: "#009999" },
  { name: "Schneider",     country: "France",        logo: "assets/brands/real/schneider-electric.svg",  color: "#3DCD58" },
  { name: "ABB",           country: "Switzerland",   logo: "assets/brands/real/abb.svg", color: "#FF000F" },
  { name: "Mitsubishi",    country: "Japan",         logo: "assets/brands/real/mitsubishi.svg", color: "#E60012" },
  { name: "OMRON",         country: "Japan",         logo: "assets/brands/real/omron.svg", color: "#1F3A93" },
  { name: "Yaskawa",       country: "Japan",         logo: "assets/brands/real/yaskawa.ico", color: "#0F4C9C" },
  { name: "Panasonic",     country: "Japan",         logo: "assets/brands/real/panasonic.svg", color: "#0F2D62" },
  { name: "Keyence",       country: "Japan",         logo: "assets/brands/real/keyence.ico", color: "#E60012" },
  { name: "SICK",          country: "Germany",       logo: "assets/brands/real/sick.svg", color: "#004A98" },
  { name: "Balluff",       country: "Germany",       logo: "assets/brands/real/balluff.svg", color: "#000000" },
  { name: "ifm",           country: "Germany",       logo: "assets/brands/real/ifm.svg", color: "#F39200" },
  { name: "Endress+Hauser",country: "Switzerland",   logo: "assets/brands/real/endress-hauser.svg", color: "#005CA9" },
  { name: "Pepperl+Fuchs", country: "Germany",       logo: "assets/brands/real/pepperl-fuchs.svg", color: "#E2001A" },
  { name: "Honeywell",     country: "USA",           logo: "assets/brands/real/honeywell.svg", color: "#EE2A24" },
  { name: "TURCK",         country: "Germany",       logo: "assets/brands/real/turck.svg", color: "#FECC00" },
  { name: "WIKA",          country: "Germany",       logo: "assets/brands/real/wika.svg", color: "#005CA9" },
  { name: "NORD",          country: "Germany",       logo: "assets/brands/real/nord.svg", color: "#004A98" },
  { name: "Autonics",      country: "Korea",         logo: "assets/brands/real/autonics.svg", color: "#0066B3" },
  { name: "Baumer",        country: "Germany",       logo: "assets/brands/real/baumer.svg", color: "#003D7E" },
  { name: "Fuji Electric", country: "Japan",         logo: "assets/brands/real/fuji-electric.svg", color: "#DA251D" },
  { name: "Festo",         country: "Germany",       logo: "assets/brands/real/festo.svg", color: "#007CC0" },
  { name: "SMC",           country: "Japan",         logo: "assets/brands/real/smc.svg", color: "#0F4C9C" },
  { name: "Norgren",       country: "UK",            logo: "assets/brands/real/norgren.ico", color: "#004A98" },
  { name: "AirTAC",        country: "Taiwan, China", logo: "assets/brands/real/airtac.ico", color: "#005BAC" },
  { name: "Burkert",       country: "Germany",       logo: "assets/brands/real/burkert.svg", color: "#1A3A6C" },
  { name: "Dungs",         country: "Germany",       logo: "assets/brands/real/dungs.svg", color: "#003D7E" },
  { name: "ASCA",          country: "France",        logo: "assets/brands/real/asca.svg", color: "#E2001A" },
  { name: "Danfoss",       country: "Denmark",       logo: "assets/brands/real/danfoss.svg", color: "#003D7E" },
  { name: "Lenze",         country: "Germany",       logo: "assets/brands/real/lenze.svg", color: "#005CA9" },
  { name: "Toshiba",       country: "Japan",         logo: "assets/brands/real/toshiba.svg", color: "#FF0000" },
  { name: "Weidmüller",    country: "Germany",       logo: "assets/brands/real/weidmuller.svg", color: "#006F4E" },
  { name: "Phoenix Contact", country: "Germany",     logo: "assets/brands/real/phoenix-contact.svg", color: "#0F4C9C" },
  { name: "Legrand",       country: "France",        logo: "assets/brands/real/legrand.svg", color: "#C8102E" },
  { name: "SKF",           country: "Sweden",        logo: "assets/brands/real/skf.svg", color: "#003D7E" },
  { name: "Finder",        country: "Italy",         logo: "assets/brands/real/finder.svg", color: "#005CA9" },
  { name: "ebm-papst",     country: "Germany",       logo: "assets/brands/real/ebmpapst.svg", color: "#003D7E" },
  { name: "Leuze",         country: "Germany",       logo: "assets/brands/real/leuze-electronic.svg", color: "#000000" },
  { name: "CHINT",         country: "China",         logo: "assets/brands/real/chint.svg", color: "#E60012" },
  { name: "EUCHNER",       country: "Germany",       logo: "assets/brands/real/euchner.svg", color: "#E2001A" },
  { name: "Delta",         country: "Taiwan, China", logo: "assets/brands/real/delta-favicon.ico",     color: "#005BAC" },
  { name: "VEGA",          country: "Germany",       logo: "assets/brands/real/vega.svg",           color: "#1678c3" },
  { name: "Kinco",         country: "China",         logo: "assets/brands/real/kinco.svg",     color: "#005BAC" },
  { name: "Allen-Bradley", country: "USA",           logo: "assets/brands/real/allen-bradley.svg", color: "#CC0000" }
];

/* ---- 10 Product categories — used on home page
   `img` is a representative product photo, used as a thumbnail for the category card. */
const CATEGORIES_HOME = [
  { id: "drives",   no: "01", title: "Drives & Motion Control", items: "VFDs · Servo Drives · Inverters · Soft Starters · Controllers",
    desc: "Complete drive lineup from 0.2kW to 22kW+, including vector and servo control.", img: "assets/products/CIMR-AB4A0011FBA.jpg" },
  { id: "plc",      no: "02", title: "PLC & Automation",       items: "PLCs · I/O Modules · Industrial PCs",
    desc: "Modular PLCs, remote I/O and backplanes for machine and process control.", img: "assets/products/6ES7212-1AE40-0XB0.jpg" },
  { id: "hmi",      no: "03", title: "HMI & Display",           items: "HMIs · Touch Panels · Industrial Monitors",
    desc: "Touchscreen panels from 4\" to 15\" with multi-protocol support.", img: "assets/products/PFXGP4301TADW.jpg" },
  { id: "sensors",  no: "04", title: "Sensors & Instrumentation", items: "Proximity · Photoelectric · Pressure · Flow · Level",
    desc: "Inductive, photoelectric, radar level, pressure and encoder sensors.", img: "assets/products/PS6X.2SWYDBXATKMKHAXXXXXXX.jpg" },
  { id: "motors",   no: "05", title: "Motors & Drives",          items: "AC Motors · Servo Motors · Gear Motors · Steppers",
    desc: "Servo, gear and stepper motors matched to drives for turnkey systems.", img: "assets/products/R88M-KE75030H.jpg" },
  { id: "elec",     no: "06", title: "Electrical Components",    items: "MCBs · MCCBs · Contactors · Relays · Terminal Blocks",
    desc: "DIN-rail components, protection and switching for control cabinets.", img: "assets/products/3RM1002-1AA04.jpg" },
  { id: "power",    no: "07", title: "Power Supply & Conversion", items: "Power Supplies · UPS · Converters · Transformers",
    desc: "Industrial-grade power supplies, DC-UPS and voltage conversion.", img: "assets/products/3AFE68257913.jpg" },
  { id: "comm",     no: "08", title: "Industrial Communication",  items: "Industrial Gateways · Switches · Cabling · IoT · IIoT",
    desc: "Protocol gateways, managed switches and fieldbus cabling.", img: "assets/products/SKH-F48.jpg" },
  { id: "pneu",     no: "09", title: "Pneumatics & Hydraulics",   items: "Valves · Cylinders · FRLs · Fittings · Solenoid Valves",
    desc: "Pneumatic and hydraulic components for actuators and motion.", img: "assets/products/5GN-20-K.jpg" },
  { id: "gear",     no: "10", title: "Gear & Transmission Equipment", items: "Gearboxes · Gear Motors · Couplings · Reducers",
    desc: "Speed reducers, gear motors and couplings for torque transfer.", img: "assets/products/5GN-20-K.jpg" }
];

const CATEGORIES = {
  controllers: "PLC & Controllers",
  hmi: "HMI & Panel PCs",
  servo: "Servo Systems",
  drives: "Drives & Starters",
  sensors: "Sensors & Instruments",
  spares: "Spare Parts & Components"
};

const STATUS_LABEL = {
  instock: { label: "In Stock", cls: "instock" },
  legacy: { label: "Legacy Line", cls: "legacy" },
  discont: { label: "Replaced", cls: "discont" }
};
