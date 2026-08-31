/* 用 Wikidata P154(logo image) 补齐剩余品牌的官方 Logo
 * 流程: wbsearchentities 找 QID -> wbgetentities 拿 P154 文件名
 *       -> md5(文件名) 构造 upload.wikimedia.org URL -> 下载 SVG
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const brands = ['Yaskawa','Keyence','SICK','TURCK','WIKA','Autonics','Baumer','Norgren','AirTAC','Dungs','Legrand','ebm-papst','CHINT','EUCHNER','Kinco'];

const API = 'https://www.wikidata.org/w/api.php';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function jfetch(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'FouwellSiteBuilder/1.0 (contact: webmaster@fouwell.com)' }, signal: AbortSignal.timeout(20000) });
  return res.json();
}

function uploadUrl(fileName) {
  const f = fileName.replace(/^File:/i, '');
  const md5 = crypto.createHash('md5').update(f).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/${md5[0]}/${md5.slice(0,2)}/${encodeURIComponent(f)}`;
}

(async () => {
  const dir = path.join(process.cwd(), 'assets/brands/real');
  fs.mkdirSync(dir, { recursive: true });
  const ok = [], fail = [];
  for (const brand of brands) {
    let found = null;
    try {
      const s = await jfetch(`${API}?action=wbsearchentities&search=${encodeURIComponent(brand)}&language=en&format=json&limit=3`);
      const results = (s.search || []).filter(r => r.label && r.label.toLowerCase() === brand.toLowerCase());
      const best = results[0] || (s.search || [])[0];
      if (best) {
        const e = await jfetch(`${API}?action=wbgetentities&ids=${best.id}&props=claims&format=json`);
        const claims = Object.values(e.entities[best.id].claims || {}).flat();
        const p154 = claims.find(c => c.mainsnak && c.mainsnak.datavalue && c.mainsnak.snaktype === 'value' && c.mainsnak.property === 'P154');
        if (p154) {
          const file = p154.mainsnak.datavalue.value;
          const url = uploadUrl(file);
          const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(20000) });
          const buf = Buffer.from(await res.arrayBuffer());
          const ct = res.headers.get('content-type') || '';
          if (res.ok && buf.length > 300 && ct.includes('image')) {
            const ext = (file.match(/\.(svg|png|jpg|jpeg)$/i) || ['','svg'])[1].toLowerCase();
            const out = `${brand.replace(/[^A-Za-z]/g,'')}.${ext === 'jpeg' ? 'jpg' : ext}`;
            fs.writeFileSync(path.join(dir, out), buf);
            found = `${brand} <- ${best.id} ${file} (${(buf.length/1024).toFixed(0)}KB)`;
          }
        }
      }
      if (found) ok.push(found); else fail.push(brand);
    } catch (err) {
      fail.push(brand + ' [err]');
    }
    await sleep(300);
  }
  console.log('=== 成功 ' + ok.length + ' ==='); ok.forEach(l => console.log('  OK  ' + l));
  console.log('=== 失败 ' + fail.length + ': ' + fail.join(', ') + ' ===');
})();
