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

<article class="relative isolate mx-auto max-w-4xl px-5 pt-36 pb-24 md:px-8 md:pt-44">
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<a href={base} class="text-sm text-muted hover:text-ink">← {L.back}</a>
	<p class="mt-8 font-mono text-xs tracking-[0.25em] text-violet uppercase">
		{p.kind} · {p.year}
	</p>
	<h1 class="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-6xl">{p.title}</h1>
	<p class="mt-5 max-w-2xl text-lg text-muted">{p.summary}</p>

	{#if p.demo?.type === 'roi'}
		<section class="mt-12" aria-label={L.live}>
			<h2 class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{L.live}</h2>
			<div class="glow-card mt-4 p-4 md:p-6">
				<div bind:this={roiHost} lang="tr" data-roi-calculator data-sector={p.demo.sector}></div>
				{#if failed}
					<p role="alert" class="p-4 text-sm text-muted">{L.load_error}</p>
				{:else if mounted && !loaded}
					<p role="status" class="p-4 text-sm text-muted">{L.loading}</p>
				{/if}
				<noscript><p class="p-4 text-sm text-muted">{L.noscript}</p></noscript>
			</div>
			<p class="mt-3 text-sm text-muted">{p.demo.note}</p>
			{#if L.demo_lang_note}<p class="mt-1 text-sm text-muted">{L.demo_lang_note}</p>{/if}
		</section>
	{:else if p.demo_url}
		<p class="mt-8">
			<a href={p.demo_url} rel="noopener" class="pill inline-block">{L.demo} ↗</a>
		</p>
	{:else}
		<p
			class="mt-8 inline-block rounded-full border border-line px-4 py-2 font-mono text-xs text-muted"
		>
			{L.coming}. {L.soon_note}
		</p>
	{/if}

	<div class="mt-14 space-y-8">
		{#each parts as k (k)}
			<section>
				<h2 class="text-2xl font-semibold tracking-tight">{L[k]}</h2>
				<p class="mt-3 text-lg leading-relaxed text-muted">{p[k]}</p>
			</section>
		{/each}
	</div>

	{#if p.facts.length}
		<ul class="mt-10 grid gap-4 sm:grid-cols-3">
			{#each p.facts as [n, l] (l)}
				<li class="rounded-xl border border-line p-4">
					<b class="block text-2xl font-semibold">{n}</b>
					<span class="text-sm text-muted">{l}</span>
				</li>
			{/each}
		</ul>
	{/if}

	<h2 class="mt-14 font-mono text-xs tracking-[0.25em] text-violet uppercase">{L.tech}</h2>
	<ul class="mt-4 flex flex-wrap gap-2">
		{#each p.tags as t (t)}
			<li class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{t}</li>
		{/each}
	</ul>

	{#if p.shots.length}
		<h2 class="mt-14 font-mono text-xs tracking-[0.25em] text-violet uppercase">{L.screens}</h2>
		<ul class="mt-4 grid items-start gap-4 sm:grid-cols-3">
			{#each p.shots as s (s.src)}
				<li>
					<img
						src="/assets/examples/{s.src}"
						width={s.w}
						height={s.h}
						alt={s.alt}
						loading="lazy"
						decoding="async"
						class="w-full rounded-xl border border-line object-cover object-top {s.h / s.w > 2
							? 'h-96'
							: ''}"
					/>
				</li>
			{/each}
		</ul>
	{/if}

	<p class="mt-14">
		<a href="{prefix(lang)}/#iletisim" class="pill inline-block">{L.contact}</a>
	</p>
</article>
