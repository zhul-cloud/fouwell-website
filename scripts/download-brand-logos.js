/* 下载 43 个品牌官方 Logo（Clearbit Logo API，透明/白底 PNG）
 * 每个品牌按候选域名优先级尝试，成功即保存到 assets/brands/real/<Name>.png
 */
const fs = require('fs');
const path = require('path');

const brands = {
  Siemens: ['siemens.com'],
  Schneider: ['se.com', 'schneider-electric.com'],
  ABB: ['abb.com'],
  Mitsubishi: ['mitsubishielectric.com', 'mitsubishielectric.co.jp'],
  OMRON: ['omron.com'],
  Yaskawa: ['yaskawa.com'],
  Panasonic: ['panasonic.com'],
  Keyence: ['keyence.com'],
  SICK: ['sick.com'],
  Balluff: ['balluff.com'],
  ifm: ['ifm.com'],
  EndressHauser: ['endress.com'],
  PepperlFuchs: ['pepperl-fuchs.com'],
  Honeywell: ['honeywell.com'],
  TURCK: ['turck.com'],
  WIKA: ['wika.com'],
  NORD: ['nord.com'],
  Autonics: ['autonics.com'],
  Baumer: ['baumer.com'],
  FujiElectric: ['fujielectric.com'],
  Festo: ['festo.com'],
  SMC: ['smcworld.com'],
  Norgren: ['norgren.com'],
  AirTAC: ['airtac.com'],
  Burkert: ['burkert.com'],
  Dungs: ['dungs.com'],
  ASCA: ['asca.fr'],
  Danfoss: ['danfoss.com'],
  Lenze: ['lenze.com'],
  Toshiba: ['toshiba.com', 'global.toshiba.com'],
  Weidmller: ['weidmueller.com'],
  PhoenixContact: ['phoenixcontact.com'],
  Legrand: ['legrand.com'],
  SKF: ['skf.com'],
  Finder: ['finderrelays.net', 'findernet.com'],
  ebmpapst: ['ebmpapst.com'],
  Leuze: ['leuze.com'],
  CHINT: ['chintglobal.com', 'chint.com'],
  EUCHNER: ['euchner.de'],
  Delta: ['deltaww.com'],
  VEGA: ['vega.com'],
  Kinco: ['kinco.com'],
  AllenBradley: ['rockwellautomation.com', 'ab.com'],
};

(async () => {
  const dir = path.join(process.cwd(), 'assets/brands/real');
  fs.mkdirSync(dir, { recursive: true });
  const ok = [], fail = [];
  for (const [name, domains] of Object.entries(brands)) {
    let saved = false;
    for (const domain of domains) {
      const url = 'https://logo.clearbit.com/' + domain + '?size=256';
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
        });
        const ct = res.headers.get('content-type') || '';
        const buf = Buffer.from(await res.arrayBuffer());
        if (res.ok && buf.length > 3000 && ct.includes('image')) {
          fs.writeFileSync(path.join(dir, name + '.png'), buf);
          ok.push(name + ' ← ' + domain + ' (' + (buf.length / 1024).toFixed(0) + 'KB ' + ct + ')');
          saved = true;
          break;
        }
      } catch (e) { /* try next domain */ }
    }
    if (!saved) fail.push(name);
  }
  console.log('=== 成功 ' + ok.length + ' ===');
  ok.forEach(l => console.log('  OK  ' + l));
  console.log('=== 失败 ' + fail.length + ': ' + fail.join(', ') + ' ===');
})();
