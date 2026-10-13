<script>
	import demo from '#lib/content/demo.json';
	import { tilt } from '#lib/actions.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const r = $derived(c.v2.receipt);

	// Fiş uydurma; sağdaki defter ise Fiş OCR programının gerçek çıktısı (demo.json'daki ilk fiş).
	const fis = demo.fisler[0].sonuc[0];
	const nf = $derived(
		new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'tr-TR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	);
	const date = $derived(lang === 'en' ? '14 Mar 2026' : '14.03.2026');

	const COLS = 32;
	/** @param {string} left @param {string} [mid] @param {string} [right] @param {number} [midCol] */
	function row(left, mid = '', right = '', midCol = 19) {
		const s = left.padEnd(COLS).split('');
		[...mid].forEach((ch, i) => (s[midCol + i] = ch));
		[...right].forEach((ch, i) => (s[COLS - right.length + i] = ch));
		return s.join('');
	}
	/** @param {string} t */
	const ctr = (t) => t.padStart(Math.floor((COLS + t.length) / 2)).padEnd(COLS);
	const DASH = '-'.repeat(COLS);

	/** @typedef {{ text: string, marks?: Record<string, number> }} Line */
	/** @type {{ t: number, lines: Line[] }[]} */
	const groups = [
		{
			t: 0.7,
			lines: [
				{ text: ctr('YILDIZ GIDA'), marks: { 'YILDIZ GIDA': 1.2 } },
				{ text: ctr('SAN. VE TİC. A.Ş.') },
				{ text: ctr('VD: MERKEZ 9990001112'), marks: { '9990001112': 1.5 } }
			]
		},
		{
			t: 1.3,
			lines: [
				{ text: '' },
				{ text: row('TARİH 14/03/2026', '', 'SAAT 18:42'), marks: { '14/03/2026': 2.0 } },
				{ text: row('FİŞ NO 0217') }
			]
		},
		{
			t: 1.7,
			lines: [
				{ text: DASH },
				{ text: row('EKMEK 250G', '%1', '*17,50') },
				{ text: row('SÜT 1L', '%1', '*42,90') },
				{ text: row('BEYAZ PEYNİR', '%1', '*189,90') },
				{ text: row('DETERJAN 3KG', '%20', '*229,90') },
				{ text: row('POŞET', '%20', '*0,25') },
				{ text: DASH }
			]
		},
		{
			t: 2.3,
			lines: [
				{ text: row('TOPKDV', '', '*40,84'), marks: { [row('TOPKDV', '', '*40,84')]: 2.8 } },
				{ text: row('TOPLAM', '', '*480,45'), marks: { [row('TOPLAM', '', '*480,45')]: 2.9 } },
				{ text: DASH }
			]
		},
		{
			t: 2.8,
			lines: [
				{
					text: row('%1', '*2,48', '*250,30', 10),
					marks: { [row('%1', '*2,48', '*250,30', 10)]: 3.3 }
				},
				{
					text: row('%20', '*38,36', '*230,15', 9),
					marks: { [row('%20', '*38,36', '*230,15', 9)]: 3.4 }
				},
				{ text: DASH }
			]
		},
		{ t: 3.3, lines: [{ text: row('KART', '', '************4417') }] }
	];

	/** Satırı, işaretlenecek alt metinde bölüp parçalar halinde döndürür. @param {Line} l */
	function parts(l) {
		for (const [sub, t] of Object.entries(l.marks ?? {})) {
			const i = l.text.indexOf(sub);
			if (i >= 0) return [l.text.slice(0, i), { sub, t }, l.text.slice(i + sub.length)];
		}
		return [l.text];
	}

	const kdv = fis.kdv;
	const ledger = $derived([
		[r.ledger.company, fis.firma, 1.3, false],
		[r.ledger.tax, fis.vkn, 1.6, false],
		[r.ledger.date, date, 2.1, false],
		[r.ledger.vat1, `${nf.format(kdv[0].kdv)} / ${nf.format(kdv[0].toplam)}`, 3.4, false],
		[r.ledger.vat20, `${nf.format(kdv[1].kdv)} / ${nf.format(kdv[1].toplam)}`, 3.5, false],
		[r.ledger.vat, nf.format(fis.toplam_kdv), 3.65, false],
		[r.ledger.total, nf.format(fis.genel_toplam), 3.8, true]
	]);
</script>

<div class="hero-doc">
	<div class="tiltbox" use:tilt={6}>
		<div class="sheet-wrap">
			<pre class="sheet" role="img" aria-label={r.alt}>{#each groups as g (g.t)}<div
						class="grp"
						style="--t:{g.t}s">{#each g.lines as l, i (i)}<span class="ln"
								>{#each parts(l) as p, j (j)}{#if typeof p === 'string'}{p}{:else}<mark
											class="hl"
											style="--t:{p.t}s">{p.sub}</mark
										>{/if}{/each}</span
							>{/each}</div>{/each}</pre>
		</div>
	</div>
	<dl class="ledger">
		{#each ledger as [label, value, t, strong] (label)}
			<div class="lr" class:strong style="--t:{t}s">
				<dt>{label}</dt>
				<span class="dots" aria-hidden="true"></span>
				<dd>{value}</dd>
			</div>
		{/each}
	</dl>
	<p class="verdict" style="--t:4s">
		<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"
			><path d="M4.5 12.5l5 5L19.5 7" /></svg
		>
		<span><b>{r.verified}</b> {r.verdict}</span>
	</p>
	<p class="caption">{r.caption}</p>
</div>
