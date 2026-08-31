/* 为 8 个无法获取真实 logo 的品牌生成精致 wordmark 文字徽章
 * 风格: 白底 + 品牌主色细字 + 同色细下划线(短), viewBox 200x60
 * 避免大色块以保持品牌墙整洁
 */
const fs = require('fs');
const path = require('path');

const brands = [
  { name: 'SICK',     color: '#E2001A', size: 32, ul: 36 },
  { name: 'TURCK',    color: '#0066B3', size: 30, ul: 38 },
  { name: 'WIKA',     color: '#005AA0', size: 32, ul: 30 },
  { name: 'Autonics', color: '#003478', size: 26, ul: 32 },
  { name: 'Baumer',   color: '#0095D3', size: 30, ul: 36 },
  { name: 'CHINT',    color: '#E60012', size: 32, ul: 30 },
  { name: 'EUCHNER',  color: '#004F9F', size: 28, ul: 38 },
  { name: 'Kinco',    color: '#1A4F8C', size: 30, ul: 28, sub: '步科' },
];

const outDir = path.join(process.cwd(), 'assets/brands/real');
fs.mkdirSync(outDir, { recursive: true });

for (const b of brands) {
  const cx = 100; // viewBox 200x60 center
  const subLine = b.sub ? `<text x="${cx}" y="52" font-size="10" fill="#666" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" letter-spacing="2">${b.sub}</text>` : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <text x="${cx}" y="34" font-size="${b.size}" font-weight="700" fill="${b.color}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" letter-spacing="1">${b.name}</text>
  <line x1="${cx - b.ul/2}" y1="42" x2="${cx + b.ul/2}" y2="42" stroke="${b.color}" stroke-width="2" stroke-linecap="round"/>
  ${subLine}
</svg>`;
  const file = b.name.toLowerCase() + '.svg';
  fs.writeFileSync(path.join(outDir, file), svg);
  console.log('  wrote', file, '(' + svg.length + ' bytes)');
}
