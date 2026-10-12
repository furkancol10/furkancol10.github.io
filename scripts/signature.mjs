// El yazısı imza ve FC logosunun SVG yollarını Great Vibes yazı tipinden üretir.
// Yollar sayesinde giriş animasyonu harf harf "çizilir" ve favicon yazı tipine bağımlı olmaz.
// Çalıştırma: node scripts/signature.mjs  →  src/lib/signature.js ve static/favicon.svg
import { readFileSync, writeFileSync } from 'node:fs';
import * as ot from 'opentype.js';

const parse = ot.parse ?? ot.default.parse;
// opentype.js 2.x bu yazı tipinin konturlarını eksik çiziyor; 1.3.4 sürümü ve orijinal TTF kullanılır.
const buf = readFileSync('scripts/fonts/GreatVibes-Regular.ttf'); // OFL lisanslı (scripts/fonts/OFL.txt)
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
const scale = Math.min((S * 0.78) / mw, (S * 0.78) / mh);
const tx = (S - mw * scale) / 2 - mx * scale;
const ty = (S - mh * scale) / 2 - my * scale;
// İnce el yazısı küçük boyutta kaybolmasın diye harflere kontur eklenir (yazı tipi birimiyle).
const markFit = { size: S, transform: `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})`, stroke: 4 };

writeFileSync(
	'src/lib/signature.js',
	`// Otomatik üretildi: node scripts/signature.mjs (Great Vibes). Elle düzenleme.
export const name = ${JSON.stringify(name)};
export const mark = ${JSON.stringify({ ...mark, ...markFit })};
`
);
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>
<rect width="${S}" height="${S}" rx="16" fill="url(#g)"/>
<g fill="#fff" stroke="#fff" stroke-width="${markFit.stroke}" stroke-linejoin="round" transform="${markFit.transform}">${mark.glyphs.map((d) => `<path d="${d}"/>`).join('')}</g>
</svg>
`;
writeFileSync('static/favicon.svg', favicon);
console.log('ok', { name: name.viewBox, harf: name.glyphs.length, mark: mark.viewBox });
