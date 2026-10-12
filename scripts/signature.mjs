// El yazısı imzanın, FC logosunun, favicon'un ve paylaşım görselinin kaynağı: Meow Script yazı tipi.
// Harfler SVG yollarına çevrilir; böylece giriş animasyonu harf harf "çizilir" ve logo yazı tipine bağımlı olmaz.
// Çalıştırma: node scripts/signature.mjs
//   → src/lib/signature.js, static/favicon.svg, scripts/og.html ve (Edge bulunursa) static/assets/img/og.png
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as ot from 'opentype.js';

const FONT = 'scripts/fonts/MeowScript-Regular.ttf'; // OFL lisanslı (scripts/fonts/OFL.txt)
const FONT_NAME = 'Meow Script';

// opentype.js 1.3.4 kullanılır: 2.x bazı el yazısı tiplerinin konturlarını eksik çiziyor.
const parse = ot.parse ?? ot.default.parse;
const buf = readFileSync(FONT);
const font = parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Metni harf başına yollara çevirir, sıkı bir viewBox ile döndürür. */
function build(text, size = 100, pad = 4) {
	// Harfler tek tek yerleştirilir (kerning dahil); metin şekillendirici kullanılmaz.
	const scale = size / font.unitsPerEm;
	let x = 0;
	let prev = null;
	const paths = [];
	for (const ch of text) {
		const g = font.charToGlyph(ch);
		if (prev) x += font.getKerningValue(prev, g) * scale;
		paths.push(g.getPath(x, size, size));
		x += g.advanceWidth * scale;
		prev = g;
	}
	const glyphs = paths
		.map((p) => ({ d: p.toPathData(2), box: p.getBoundingBox() }))
		.filter((g) => g.d.length > 0);
	const x1 = Math.min(...glyphs.map((g) => g.box.x1)) - pad;
	const y1 = Math.min(...glyphs.map((g) => g.box.y1)) - pad;
	const x2 = Math.max(...glyphs.map((g) => g.box.x2)) + pad;
	const y2 = Math.max(...glyphs.map((g) => g.box.y2)) + pad;
	const r = (n) => Math.round(n * 100) / 100;
	return { viewBox: [r(x1), r(y1), r(x2 - x1), r(y2 - y1)].join(' '), glyphs: glyphs.map((g) => g.d) };
}

const name = build('Furkan Çöl');
const mark = build('FC', 100, 2);

// Logo: 64×64 gradyan kare içinde beyaz FC, karenin ortasına oturtulur.
const [mx, my, mw, mh] = mark.viewBox.split(' ').map(Number);
const S = 64;
const scale = Math.min((S * 0.74) / mw, (S * 0.74) / mh);
const tx = (S - mw * scale) / 2 - mx * scale;
const ty = (S - mh * scale) / 2 - my * scale;
// İnce el yazısı küçük boyutta kaybolmasın diye harflere kontur eklenir (yazı tipi birimiyle).
const markFit = {
	size: S,
	transform: `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})`,
	stroke: 5
};

writeFileSync(
	'src/lib/signature.js',
	`// Otomatik üretildi: node scripts/signature.mjs (${FONT_NAME}). Elle düzenleme.
export const name = ${JSON.stringify(name)};
export const mark = ${JSON.stringify({ ...mark, ...markFit })};
`
);

const markSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${size}" height="${size}">
<defs><linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>
<rect width="${S}" height="${S}" rx="16" fill="url(#mg)"/>
<g fill="#fff" stroke="#fff" stroke-width="${markFit.stroke}" stroke-linejoin="round" transform="${markFit.transform}">${mark.glyphs.map((d) => `<path d="${d}"/>`).join('')}</g>
</svg>`;

writeFileSync('static/favicon.svg', markSvg(S).replace(/ width="\d+" height="\d+"/, '') + '\n');

// Paylaşım görseli (WhatsApp, LinkedIn, X önizlemesi): 1200×630, açık tema.
const og = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url('../node_modules/@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:Geist;src:url('../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:'Geist Mono';src:url('../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2') format('woff2');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:Geist,sans-serif;color:#11111b;background:#f8f8fb;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgb(15 15 30/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(15 15 30/.05) 1px,transparent 1px);background-size:64px 64px;-webkit-mask-image:radial-gradient(ellipse 75% 70% at 40% 40%,#000 25%,transparent 100%)}
.glow{position:absolute;border-radius:50%;filter:blur(40px)}
.a{width:640px;height:640px;left:-120px;top:-260px;background:radial-gradient(closest-side,rgb(124 58 237/.22),transparent)}
.b{width:620px;height:620px;right:-160px;bottom:-280px;background:radial-gradient(closest-side,rgb(59 130 246/.2),transparent)}
.wrap{position:absolute;left:96px;top:118px;right:96px}
.row{display:flex;align-items:center;gap:30px}
.sig{height:170px;width:auto}
.tag{margin-top:34px;font-family:'Geist Mono';font-size:22px;letter-spacing:.22em;text-transform:uppercase;color:#55556a}
.lead{margin-top:16px;font-size:40px;font-weight:600;letter-spacing:-.02em;line-height:1.15}
.lead span{background:linear-gradient(100deg,#7c3aed,#2563eb 50%,#0891b2);-webkit-background-clip:text;background-clip:text;color:transparent}
.url{position:absolute;left:96px;bottom:56px;font-size:24px;font-weight:500;color:#55556a}
</style></head><body>
<div class="grid"></div><div class="glow a"></div><div class="glow b"></div>
<div class="wrap">
<div class="row">${markSvg(132)}
<svg class="sig" viewBox="${name.viewBox}"><defs><linearGradient id="sg" gradientUnits="userSpaceOnUse" x1="${name.viewBox.split(' ')[0]}" y1="0" x2="${+name.viewBox.split(' ')[0] + +name.viewBox.split(' ')[2]}" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset=".55" stop-color="#2563eb"/><stop offset="1" stop-color="#0891b2"/></linearGradient></defs>
<g fill="url(#sg)" stroke="url(#sg)" stroke-width="1.2" stroke-linejoin="round">${name.glyphs.map((d) => `<path d="${d}"/>`).join('')}</g></svg></div>
<p class="tag">Yazılım geliştirici · OCR, otomasyon, web</p>
<p class="lead">Belgelerden veriye, <span>fikirden çalışan yazılıma.</span></p>
</div>
<p class="url">furkancol.me</p>
</body></html>
`;
writeFileSync('scripts/og.html', og);

// Edge (Windows) varsa og.html'i PNG'ye çevir; yoksa nasıl yapılacağını yaz.
const edge = [
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
].find(existsSync);
const ogPng = resolve('static/assets/img/og.png');
if (edge) {
	spawnSync(edge, [
		'--headless=new',
		'--hide-scrollbars',
		'--window-size=1200,630',
		'--virtual-time-budget=3000',
		`--screenshot=${ogPng}`,
		pathToFileURL(resolve('scripts/og.html')).href
	]);
	console.log('og.png yazıldı');
} else {
	console.log('Edge bulunamadı: scripts/og.html dosyasını 1200×630 ekran görüntüsü olarak static/assets/img/og.png yap');
}
console.log('ok', { name: name.viewBox, harf: name.glyphs.length, mark: mark.viewBox });
