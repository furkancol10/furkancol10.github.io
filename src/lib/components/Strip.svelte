<script>
	/** Kullanılan teknolojilerin kayan şeridi (araç listesi "Kullandığım araçlar" bölümünden türetilir). */
	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();

	const tools = $derived.by(() => {
		/** @type {string[]} */
		const out = [];
		for (const [, v] of c.about.skills) {
			// "OCR (RapidOCR, Tesseract)" → parantez içindekiler tek tek
			for (const t of v.replace(/[^,]*\(([^)]*)\)/g, '$1').split(',')) {
				const s = t.trim();
				if (s && !out.includes(s)) out.push(s);
			}
		}
		return out;
	});
</script>

<div class="v2">
	<div class="strip" role="group" aria-label={c.hero.stack_label}>
		<ul aria-hidden="true">
			{#each [...tools, ...tools] as t, i (i)}<li>{t}</li>{/each}
		</ul>
		<p class="sr-only">{tools.join(', ')}</p>
	</div>
</div>
