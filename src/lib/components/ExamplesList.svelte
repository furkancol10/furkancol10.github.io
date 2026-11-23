<script>
	import { prefix } from '#lib/content/index.js';

	/** Örnekler listesi (TR: /ornekler/, EN: /en/examples/). */
	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const x = $derived(c.examples);
	/** @type {'all' | 'ready' | 'soon'} */
	let filter = $state('all');
	const chips = $derived([
		{ key: 'all', label: x.filters.all },
		{ key: 'ready', label: x.labels.ready },
		{ key: 'soon', label: x.labels.coming }
	]);
	/** @param {{ status: string }} p */
	const shows = (p) => filter === 'all' || p.status === filter;
	const shown = $derived(x.items.filter(shows).length);
	const base = $derived(`${prefix(lang)}/${lang === 'en' ? 'examples' : 'ornekler'}/`);
</script>

<div class="v2">
	<section class="wrap ex-page" aria-labelledby="ex-h">
		<header class="ex-head">
			<p class="eyebrow">{x.eyebrow}</p>
			<h1 id="ex-h">{x.title}</h1>
			<p class="lead">{x.lead}</p>
		</header>

		<div class="fchips" role="group" aria-label={x.filters.label}>
			{#each chips as ch (ch.key)}
				<button
					type="button"
					class="fchip"
					aria-pressed={filter === ch.key}
					onclick={() => (filter = /** @type {'all' | 'ready' | 'soon'} */ (ch.key))}>{ch.label}</button
				>
			{/each}
			<span class="sr-only" role="status" aria-live="polite"
				>{x.filters.shown.replace('{n}', String(shown))}</span
			>
		</div>

		<ul class="ex-grid">
			{#each x.items as p (p.id)}
				<li class:hidden={!shows(p)}>
					<a href="{base}{p.id}/" class="ex-card">
						{#if p.shots[0]}
							<div class="ex-thumb">
								<img
									src="/assets/examples/{p.shots[0].src}"
									width={p.shots[0].w}
									height={p.shots[0].h}
									alt=""
									loading="lazy"
									decoding="async"
								/>
							</div>
						{/if}
						<p class="ex-meta">
							<span class="tech">{p.kind} · {p.year}</span>
							<span class="badge" class:on={p.status === 'ready'}
								>{p.status === 'ready' ? x.labels.ready : x.labels.coming}</span
							>
						</p>
						<h2>{p.title}</h2>
						<p class="sum">{p.summary}</p>
						<p class="tech">{p.tags.join(' · ')}</p>
						<p class="go">{x.labels.detail} →</p>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>
