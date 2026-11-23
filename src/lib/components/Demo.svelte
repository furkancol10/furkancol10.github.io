<script>
	import { inview } from '#lib/motion.js';
	import demo from '#lib/content/demo.json';

	/**
	 * Fiş OCR canlı demosu. Fişler uydurma; sonuçlar programın bu fotoğraflar için gerçek çıktısı
	 * (OCR/rapor/portfolyo/demo_fisler.py üretir, elle düzeltilmez).
	 * @type {{ c: import('#lib/content/index.js').Content, lang: string }}
	 */
	let { c, lang } = $props();
	const t = $derived(c.demo);

	let current = $state(0);
	// Her seçimde artar; tarama ışığı ve alanların belirme animasyonu yeniden başlar
	let pass = $state(0);
	let showJson = $state(false);

	const fis = $derived(demo.fisler[current]);
	/** @type {Record<string, string>} */
	const names = $derived(t.names);
	/** @type {('firma' | 'vkn' | 'tarih' | 'saat' | 'fis_no')[]} */
	const fieldKeys = ['firma', 'vkn', 'tarih', 'saat', 'fis_no'];
	/** Okunan alan ya da boşsa "—". @param {string} k */
	const field = (k) => /** @type {Record<string, unknown>} */ (r)[k] ?? '—';
	const r = $derived(fis.sonuc[0]);

	const num = $derived(
		new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'tr-TR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	);
	/** @param {string | null} iso */
	const date = (iso) => (iso ? iso.split('-').reverse().join('.') : '—');
	/** @param {string} n */
	const note = (n) => /** @type {Record<string, string>} */ (t.note_map)[n] ?? n;
	const payment = $derived(
		r.odeme === 'KART'
			? `${t.card}${r.kart_son4 ? ` ···· ${r.kart_son4}` : ''}`
			: r.odeme === 'NAKIT'
				? t.cash
				: '—'
	);
	const status = $derived(/** @type {'OK' | 'DUZELTILDI' | 'EKSIK'} */ (r.durum));
	const tone = $derived(
		status === 'OK'
			? 'st-ok'
			: status === 'DUZELTILDI'
				? 'st-fix'
				: 'st-miss'
	);

	/** @param {number} i */
	function pick(i) {
		if (i === current) return;
		current = i;
		pass++;
	}
</script>

<div class="v2">
	<section class="wrap block" aria-labelledby="demo">
		<div class="sec-head">
			<p class="eyebrow">{t.eyebrow}</p>
			<h2 id="demo"><span class="mk" use:inview><span>{t.title}</span></span></h2>
			<p class="lead">{t.lead}</p>
		</div>

		<!-- Fiş seçici -->
		<div class="fchips" role="tablist" aria-label={t.pick} style="margin-bottom: 24px">
			{#each demo.fisler as f, i (f.id)}
				<button
					type="button"
					role="tab"
					class="fchip"
					aria-selected={i === current}
					aria-controls="demo-panel"
					onclick={() => pick(i)}
				>
					{names[f.id] ?? f.id}
				</button>
			{/each}
		</div>

		<div id="demo-panel" role="tabpanel" class="demo-grid">
			<!-- Fotoğraf + tarama ışığı -->
			<div class="panel demo-shot">
				{#key pass}
					<div class="scan">
						<img
							src="/assets/demo/{fis.img}"
							alt={names[fis.id]}
							width={fis.w}
							height={fis.h}
							loading="lazy"
							decoding="async"
						/>
						<span class="demo-scan" aria-hidden="true"></span>
					</div>
				{/key}
			</div>

			<!-- Okunan alanlar -->
			<div class="panel pad" aria-live="polite">
				{#key pass}
					<div class="demo-result">
						<div class="demo-status">
							<span class="tag {tone}">{t.status[status]}</span>
							<p class="meta">{t.status_help[status]}</p>
						</div>

						<dl class="demo-fields">
							{#each fieldKeys as k (k)}
								<div class={k === 'firma' ? 'wide' : ''}>
									<dt>{t.fields[k]}</dt>
									<dd>{k === 'tarih' ? date(r.tarih) : field(k)}</dd>
								</div>
							{/each}
							<div>
								<dt>{t.fields.odeme}</dt>
								<dd>{payment}</dd>
							</div>
						</dl>

						<div class="kdv">
							<table>
								<thead>
									<tr>
										{#each t.kdv_head as h (h)}
											<th scope="col">{h}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each r.kdv as k (k.oran)}
										<tr>
											<td>%{k.oran}</td>
											<td>{num.format(k.matrah)}</td>
											<td>{num.format(k.kdv)}</td>
											<td>{num.format(k.toplam)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<dl class="demo-tot">
							<div>
								<dt>{t.toplam_kdv}</dt>
								<dd>{num.format(r.toplam_kdv)}</dd>
							</div>
							<div>
								<dt>{t.genel_toplam}</dt>
								<dd class="grand grad">{num.format(r.genel_toplam)}</dd>
							</div>
						</dl>

						{#if r.notlar.length}
							<div class="demo-notes">
								<p class="eyebrow">{t.notes}</p>
								<ul>
									{#each r.notlar as n (n)}<li>{note(n)}</li>{/each}
								</ul>
							</div>
						{/if}

						<button
							type="button"
							class="jsonbtn"
							aria-expanded={showJson}
							onclick={() => (showJson = !showJson)}
						>
							{t.json}
							{showJson ? '↑' : '↓'}
						</button>
						{#if showJson}
							<pre class="demo-json">{JSON.stringify(r, null, 2)}</pre>
						{/if}
					</div>
				{/key}
			</div>
		</div>

		<p class="meta demo-disc">{t.disclaimer}</p>
	</section>
</div>
