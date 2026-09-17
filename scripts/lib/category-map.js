/* Site-facing product pages only have 6 top-level categories (js/data.js CATEGORIES const),
 * but wiki/products/ uses ~36 fine-grained categories (Relay, Cable, Inverter, ...). The
 * 04-独立站内容包/[Model].md frontmatter's `category:` field is supposed to already be one
 * of the 6 site buckets, hand-picked by whoever wrote the content package — but nothing ever
 * validated that choice against anything, so a wrong value (syntactically valid, semantically
 * wrong — e.g. a Relay typed as "controllers" instead of "spares") shipped straight to
 * production with no warning (caught 2026-09-14 auditing SZR-LY4-N1-AC220V against the
 * "独立站页面SEO审计标准" in products-schema.md — see that section's 相关性 factor).
 *
 * This map is the source of truth for "which of the 6 site buckets does each wiki category
 * belong to" — derived from the *existing* mapping already in production for every wiki
 * category in use as of 2026-09-14 (cross-checked every wiki/products/*.md category against
 * its live js/data.js `cat` value), plus Relay (newly added, corrected to "spares"). Shared
 * by generate-data-entry.js (validates new entries before they're added) and seo-audit.js
 * (checks existing entries stay consistent) — one source of truth, not two copies that can
 * drift. Whenever a genuinely new wiki category shows up that isn't in this map, both scripts
 * throw/flag rather than guessing — add the mapping here deliberately instead of letting a
 * silent default reach production again. */
const SITE_CATEGORIES = new Set(['controllers', 'hmi', 'servo', 'drives', 'sensors', 'spares']);

const WIKI_CATEGORY_TO_SITE_CATEGORY = {
  // controllers — PLC & Controllers
  PLC: 'controllers', IOModule: 'controllers', PositioningModule: 'controllers',
  BaseUnit: 'controllers', MotorProtection: 'controllers',
  // hmi — HMI & Panel PCs
  HMI: 'hmi',
  // servo — Servo Systems
  Servo: 'servo', ServoAmplifier: 'servo',
  // drives — Drives & Starters
  Inverter: 'drives', SoftStarter: 'drives', MotorStarter: 'drives',
  MotorModule: 'drives', GearMotor: 'drives',
  // sensors — Sensors & Instruments
  ProximitySensor: 'sensors', ProximitySwitch: 'sensors', LevelMeter: 'sensors',
  PressureSwitch: 'sensors', LimitSwitch: 'sensors', MagneticSwitch: 'sensors',
  TemperatureController: 'sensors', Potentiometer: 'sensors', Encoder: 'sensors',
  Counter: 'sensors', ASiModule: 'sensors', DisplacementSensor: 'sensors',
  // spares — Spare Parts & Components
  Cable: 'spares', Contactor: 'spares', DriveBoard: 'spares', SolenoidValve: 'spares',
  PowerSupply: 'spares', InterfaceModule: 'spares', WaterRegulatingValve: 'spares',
  VoltageRelay: 'spares', ProtectionRelay: 'spares', Filter: 'spares',
  AngleSeatValve: 'spares', Relay: 'spares',
};

module.exports = { SITE_CATEGORIES, WIKI_CATEGORY_TO_SITE_CATEGORY };
