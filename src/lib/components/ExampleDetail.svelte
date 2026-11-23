<script>
	import { prefix } from '#lib/content/index.js';

	/** Tek örneğin sayfası: demo, sorun → çözüm → sonuç, teknolojiler, ekran görüntüleri. */
	/** @type {{ c: import('#lib/content/index.js').Content, lang: string, item: import('#lib/content/index.js').Content['examples']['items'][number] }} */
	let { c, lang, item: p } = $props();
	const x = $derived(c.examples);
	const L = $derived(x.labels);
	/** @type {('problem' | 'solution' | 'result')[]} */
	const parts = ['problem', 'solution', 'result'];
	const base = $derived(`${prefix(lang)}/${lang === 'en' ? 'examples' : 'ornekler'}/`);
	/** Dar (≤540 px) ekran görüntüsü telefon çerçevesine, geniş olan tarayıcı çerçevesine girer. @param {{ w: number }} s */
	const isMobile = (s) => s.w <= 540;
	const WIDGET = '/demos/roi-widget.js';

	/** @type {HTMLElement | undefined} */
	let roiHost = $state();
	let loaded = $state(false);
	let failed = $state(false);
	let mounted = $state(false);

	/** @type {Promise<void> | undefined} */
	let scriptPromise;
	function loadWidget() {
		/** @type {any} */
		const w = window;
		if (w.ROI) return Promise.resolve();
		scriptPromise ??= new Promise((resolve, reject) => {
			let s = /** @type {HTMLScriptElement | null} */ (
				document.querySelector(`script[src="${WIDGET}"]`)
			);
			if (!s) {
				s = document.createElement('script');
				s.src = WIDGET;
				document.head.append(s);
			}
			s.addEventListener('load', () => resolve());
			s.addEventListener('error', () => {
				scriptPromise = undefined;
				s?.remove();
				reject(new Error('roi widget'));
			});
		});
		return scriptPromise;
	}

	// Demo yalnızca tarayıcıda yüklenir (önceden üretilen sayfada script çalışmaz).
	// Örnek (p.id) veya kutu değişince yeniden başlar; ROI.init aynı kutuda tekrar çalışmaz.
	$effect(() => {
		mounted = true;
		const host = roiHost;
		void p.id;
		loaded = false;
		failed = false;
		if (p.demo?.type !== 'roi' || !host) return;
		let alive = true;
		loadWidget().then(
			() => {
				if (!alive) return;
				/** @type {any} */ (window).ROI.init(host);
				loaded = true;
			},
			() => {
				if (alive) failed = true;
			}
		);
		return () => {
			alive = false;
		};
	});
</script>

<div class="v2">
	<article class="wrap ex-detail">
		<a href={base} class="back">← {L.back}</a>
		<p class="eyebrow">{p.kind} · {p.year}</p>
		<h1>{p.title}</h1>
		<p class="lead">{p.summary}</p>

		<div class="ex-actions">
			{#if p.demo?.type !== 'roi'}
				{#if p.demo_url}
					<a href={p.demo_url} rel="noopener" class="pill">{L.demo} ↗</a>
				{:else}
					<p class="soon">{L.coming}. {L.soon_note}</p>
				{/if}
			{/if}
			{#if p.code_url}
				<a href={p.code_url} rel="noopener" class="pill ghost">{L.code} ↗</a>
			{/if}
		</div>

		{#if p.demo?.type === 'roi'}
			<section class="ex-sec" aria-labelledby="ex-live">
				<h2 id="ex-live" class="eyebrow">{L.live}</h2>
				<div class="panel">
					<div bind:this={roiHost} lang="tr" data-roi-calculator data-sector={p.demo.sector}></div>
					{#if failed}
						<p role="alert" class="status">{L.load_error}</p>
					{:else if mounted && !loaded}
						<p role="status" class="status">{L.loading}</p>
					{/if}
					<noscript><p class="status">{L.noscript}</p></noscript>
				</div>
				<p class="note">{p.demo.note}</p>
				{#if L.demo_lang_note}<p class="note" style="margin-top: 4px">{L.demo_lang_note}</p>{/if}
			</section>
		{/if}

		<div class="ex-sec psr">
			{#each parts as k, i (k)}
				<section class={k}>
					<h2 class="lab"><span class="num">{String(i + 1).padStart(2, '0')}</span>{L[k]}</h2>
					<p>{p[k]}</p>
				</section>
			{/each}
		</div>

		{#if p.facts.length}
			<ul class="ex-facts">
				{#each p.facts as [n, l] (l)}
					<li><b>{n}</b><span>{l}</span></li>
				{/each}
			</ul>
		{/if}

		<section class="ex-sec" aria-labelledby="ex-tech">
			<h2 id="ex-tech" class="eyebrow">{L.tech}</h2>
			<ul class="tags">
				{#each p.tags as t (t)}
					<li>{t}</li>
				{/each}
			</ul>
		</section>

		{#if p.shots.length}
			<section class="ex-sec" aria-labelledby="ex-shots">
				<h2 id="ex-shots" class="eyebrow">{L.screens}</h2>
				<div class="gallery">
					{#each p.shots as s (s.src)}
						{#if isMobile(s)}
							<figure class="mob">
								<div class="phone">
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<div
										class="screen"
										class:scroll={s.h / s.w > 2.4}
										tabindex={s.h / s.w > 2.4 ? 0 : undefined}
										role={s.h / s.w > 2.4 ? 'region' : undefined}
										aria-label={s.h / s.w > 2.4 ? s.alt : undefined}
									>
										<img
											src="/assets/examples/{s.src}"
											width={s.w}
											height={s.h}
											alt={s.alt}
											loading="lazy"
											decoding="async"
										/>
									</div>
								</div>
							</figure>
						{:else}
							<figure class="desk" style:--mw={s.h / s.w > 1.2 ? '520px' : '100%'}>
								<div class="browser">
									<div class="bar" aria-hidden="true"><i></i><i></i><i></i></div>
									<img
										src="/assets/examples/{s.src}"
										width={s.w}
										height={s.h}
										alt={s.alt}
										loading="lazy"
										decoding="async"
									/>
								</div>
							</figure>
						{/if}
					{/each}
				</div>
			</section>
		{/if}

		<p class="ex-sec">
			<a href="{prefix(lang)}/?topic=web#iletisim" class="pill">{L.contact}</a>
		</p>
	</article>
</div>
