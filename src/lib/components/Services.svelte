<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();

	// Kart simgeleri (sırasıyla: belge, uygulama penceresi, terminal)
	const icons = [
		'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
		'M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01',
		'M4 5h16v14H4zM8 10l3 2-3 2M13 15h3'
	];
</script>

<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="hizmetler">
	<SectionHeading id="hizmetler" eyebrow={c.services.eyebrow} title={c.services.title} />

	<div class="grid gap-5 md:grid-cols-3">
		{#each c.services.items as s, i (s.title)}
			<article class="reveal glow-card flex flex-col p-7" use:reveal={i * 90} use:spotlight>
				<span
					class="grid size-11 place-items-center rounded-xl border border-line bg-gradient-to-br from-violet/20 to-blue/10 text-violet"
					aria-hidden="true"
				>
					<svg
						viewBox="0 0 24 24"
						class="size-5"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
					>
						<path d={icons[i % icons.length]} stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</span>
				<h3 class="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
				<p class="mt-3 flex-1 leading-relaxed text-muted">{@html s.text}</p>
				<ul class="mt-6 flex flex-wrap gap-2">
					{#each s.tags as t (t)}
						<li class="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted">
							{t}
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>
