<script>
	import { inview } from '#lib/motion.js';
	import { tilt } from '#lib/actions.js';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();

	const items = $derived(c.projects.items.filter((p) => p.publish));
	const L = $derived(c.projects.labels);
	/** @type {('problem' | 'solution' | 'result')[]} */
	const parts = ['problem', 'solution', 'result'];
	// Görselli projeler: "shot" (görsel altta) ya da "offset" (görsel solda). Fiş OCR'ın görseli ana sayfadaki fiştir.
	/** @type {Record<string, '' | 'offset'>} */
	const SHOTS = { 'cari-takip': '', intshop: 'offset' };
	/** @param {string} id */
	const has = (id) => id in SHOTS;
</script>

{#snippet head(/** @type {number} */ i, /** @type {typeof items[number]} */ p)}
	<header>
		<span class="num">{String(i + 1).padStart(2, '0')}</span>
		<h3>{p.title}</h3>
		<p class="meta">{p.kind} · {p.year}</p>
	</header>
{/snippet}

{#snippet facts(/** @type {typeof items[number]} */ p)}
	{#if p.stats.length}
		<p class="facts">
			{#each p.stats as [n, l], i (l)}{i ? ' · ' : ''}<b>{n}</b> {l}{/each}
		</p>
	{/if}
{/snippet}

{#snippet foot(/** @type {typeof items[number]} */ p)}
	<p class="tech">{p.tags.join(' · ')}</p>
	<p class="links">
		{#each p.links as [kind, url] (url)}
			<!-- '#' ile başlayan: sayfa içi (canlı demo); diğerleri dış bağlantı -->
			<a href={url} rel={url.startsWith('#') ? undefined : 'noopener'}
				>{L[/** @type {'live' | 'code'} */ (kind)]} {url.startsWith('#') ? '↓' : '↗'}</a
			>
		{/each}
		{#if !p.links.length && p.note}<span class="note">{p.note}</span>{/if}
	</p>
{/snippet}

{#snippet plate(/** @type {typeof items[number]} */ p)}
	<figure class="plate window">
		<div class="crop" use:inview={{ watch: 'parent' }}>
			<div class="tiltbox" use:tilt={5}>
				<img
					src="/assets/img/{p.img}"
					width="1200"
					height="750"
					alt={p.alt}
					loading="lazy"
					decoding="async"
				/>
			</div>
		</div>
	</figure>
{/snippet}

<div class="v2">
	<section class="wrap block" id="projeler" aria-labelledby="h-proje">
		<h2 id="h-proje"><span class="mk" use:inview><span>{c.projects.title}</span></span></h2>

		{#each items as p, i (p.id)}
			{#if has(p.id) && SHOTS[p.id] === 'offset'}
				<article class="proj shot offset" id={p.id}>
					{@render plate(p)}
					<div class="split">
						{@render head(i, p)}
						<div class="copy">
							<p>{p.solution}</p>
							{@render foot(p)}
						</div>
					</div>
				</article>
			{:else if has(p.id)}
				<article class="proj shot" id={p.id}>
					<div class="split">
						{@render head(i, p)}
						<div class="copy">
							{#each parts as k (k)}<p><b>{L[k]}.</b> {p[k]}</p>{/each}
						</div>
					</div>
					{@render plate(p)}
					{@render facts(p)}
					{@render foot(p)}
				</article>
			{:else}
				<article class="proj" id={p.id}>
					<div class="split">
						{@render head(i, p)}
						<div class="copy">
							{#if p.problem}
								{#each parts as k (k)}<p><b>{L[k]}.</b> {p[k]}</p>{/each}
							{:else}
								<p>{p.solution}</p>
							{/if}
							{@render facts(p)}
							{@render foot(p)}
						</div>
					</div>
				</article>
			{/if}
		{/each}
	</section>
</div>
