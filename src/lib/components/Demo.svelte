<script>
	import { reveal } from '#lib/actions.js';
	import demo from '#lib/content/demo.json';
	import SectionHeading from './SectionHeading.svelte';

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
			? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
			: status === 'DUZELTILDI'
				? 'bg-amber-400/15 text-amber-700 dark:text-amber-300'
				: 'bg-rose-500/12 text-rose-700 dark:text-rose-300'
	);

	/** @param {number} i */
	function pick(i) {
		if (i === current) return;
		current = i;
		pass++;
	}
</script>

<section class="mx-auto max-w-[1320px] px-[clamp(20px,4vw,56px)] py-24 md:py-32" aria-labelledby="demo">
	<SectionHeading id="demo" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

	<div class="reveal" use:reveal>
		<!-- Fiş seçici -->
		<div class="mb-6 flex flex-wrap gap-2" role="tablist" aria-label={t.pick}>
			{#each demo.fisler as f, i (f.id)}
				<button
					type="button"
					role="tab"
					aria-selected={i === current}
					aria-controls="demo-panel"
					onclick={() => pick(i)}
					class="rounded-full border px-4 py-2 text-sm transition-colors {i === current
						? 'border-transparent bg-ink text-bg'
						: 'border-line text-muted hover:border-line-strong hover:text-ink'}"
				>
					{names[f.id] ?? f.id}
				</button>
			{/each}
		</div>

		<div
			id="demo-panel"
			role="tabpanel"
			class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
		>
			<!-- Fotoğraf + tarama ışığı -->
			<div class="glow-card relative self-start p-3">
				{#key pass}
					<div class="relative overflow-clip rounded-xl">
						<img
							src="/assets/demo/{fis.img}"
							alt={names[fis.id]}
							width={fis.w}
							height={fis.h}
							loading="lazy"
							decoding="async"
							class="block h-auto w-full"
						/>
						<span class="demo-scan" aria-hidden="true"></span>
					</div>
				{/key}
			</div>

			<!-- Okunan alanlar -->
			<div class="glow-card p-6 md:p-8" aria-live="polite">
				{#key pass}
					<div class="demo-result">
						<div class="flex flex-wrap items-center gap-3">
							<span class="rounded-full px-3 py-1 text-sm font-medium {tone}"
								>{t.status[status]}</span
							>
							<p class="text-sm text-muted">{t.status_help[status]}</p>
						</div>

						<dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
							{#each fieldKeys as k (k)}
								<div class={k === 'firma' ? 'col-span-2 sm:col-span-3' : ''}>
									<dt class="font-mono text-xs tracking-[0.15em] text-muted uppercase">
										{t.fields[k]}
									</dt>
									<dd class="mt-1 font-mono text-[15px]">
										{k === 'tarih' ? date(r.tarih) : field(k)}
									</dd>
								</div>
							{/each}
							<div>
								<dt class="font-mono text-xs tracking-[0.15em] text-muted uppercase">
									{t.fields.odeme}
								</dt>
								<dd class="mt-1 font-mono text-[15px]">{payment}</dd>
							</div>
						</dl>

						<div class="mt-6 overflow-x-auto">
							<table class="w-full font-mono text-sm">
								<thead class="text-xs tracking-[0.12em] text-muted uppercase">
									<tr class="border-b border-line">
										{#each t.kdv_head as h, i (h)}
											<th class="py-2 font-normal {i ? 'text-right' : 'text-left'}">{h}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each r.kdv as k (k.oran)}
										<tr class="border-b border-line">
											<td class="py-2">%{k.oran}</td>
											<td class="py-2 text-right">{num.format(k.matrah)}</td>
											<td class="py-2 text-right">{num.format(k.kdv)}</td>
											<td class="py-2 text-right">{num.format(k.toplam)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<dl class="mt-5 grid grid-cols-2 gap-4">
							<div>
								<dt class="text-sm text-muted">{t.toplam_kdv}</dt>
								<dd class="mt-1 font-mono text-xl">{num.format(r.toplam_kdv)}</dd>
							</div>
							<div>
								<dt class="text-sm text-muted">{t.genel_toplam}</dt>
								<dd class="mt-1 text-gradient font-mono text-2xl font-semibold">
									{num.format(r.genel_toplam)}
								</dd>
							</div>
						</dl>

						{#if r.notlar.length}
							<div class="mt-6 rounded-xl border border-line bg-ink/[0.03] p-4">
								<p class="font-mono text-xs tracking-[0.15em] text-muted uppercase">{t.notes}</p>
								<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
									{#each r.notlar as n (n)}<li>{note(n)}</li>{/each}
								</ul>
							</div>
						{/if}

						<button
							type="button"
							class="mt-6 text-sm text-violet hover:underline"
							aria-expanded={showJson}
							onclick={() => (showJson = !showJson)}
						>
							{t.json}
							{showJson ? '↑' : '↓'}
						</button>
						{#if showJson}
							<pre
								class="mt-3 max-h-80 overflow-auto rounded-xl border border-line bg-ink/[0.03] p-4 text-xs leading-relaxed">{JSON.stringify(
									r,
									null,
									2
								)}</pre>
						{/if}
					</div>
				{/key}
			</div>
		</div>

		<p class="mt-5 max-w-3xl text-sm text-muted">{t.disclaimer}</p>
	</div>
</section>
