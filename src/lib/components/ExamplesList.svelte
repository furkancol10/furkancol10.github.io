<script>
	import { prefix } from '#lib/content/index.js';
	import { reveal, spotlight } from '#lib/actions.js';

	/** Örnekler listesi (TR: /ornekler/, EN: /en/examples/). */
	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const x = $derived(c.examples);
	const base = $derived(`${prefix(lang)}/${lang === 'en' ? 'examples' : 'ornekler'}/`);
</script>

<section class="relative isolate mx-auto max-w-5xl px-5 pt-36 pb-24 md:px-8 md:pt-44">
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<p class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{x.eyebrow}</p>
	<h1 class="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">{x.title}</h1>
	<p class="mt-5 max-w-2xl text-lg text-muted">{x.lead}</p>

	<ul class="mt-14 grid gap-5 md:grid-cols-2">
		{#each x.items as p (p.id)}
			<li class="reveal" use:reveal>
				<a href="{base}{p.id}/" class="glow-card flex h-full flex-col p-7 md:p-8" use:spotlight>
					<img
						src="/assets/examples/{p.shots[0].src}"
						width={p.shots[0].w}
						height={p.shots[0].h}
						alt=""
						loading="lazy"
						class="mb-6 h-52 w-full rounded-xl border border-line object-cover object-top"
					/>
					<p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
						<span>{p.kind} · {p.year}</span>
						<span
							class="rounded-full border px-2 py-0.5 {p.status === 'ready'
								? 'border-violet/40 text-violet'
								: 'border-line'}">{p.status === 'ready' ? x.labels.ready : x.labels.coming}</span
						>
					</p>
					<h2 class="mt-3 text-2xl font-semibold tracking-tight">{p.title}</h2>
					<p class="mt-3 text-muted">{p.summary}</p>
					<p class="mt-4 font-mono text-xs text-muted">{p.tags.join(' · ')}</p>
					<p class="mt-5 text-sm font-medium text-violet">{x.labels.detail} →</p>
				</a>
			</li>
		{/each}
	</ul>
</section>
