<script>
	import { reveal } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	const items = $derived(c.experience.items.filter((e) => e.publish));
</script>

<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="deneyim">
	<SectionHeading id="deneyim" eyebrow={c.experience.eyebrow} title={c.experience.title} />

	<ol class="relative ml-2 border-l border-line md:ml-4">
		<!-- Çizgi boyunca gradyan ışık -->
		<span
			class="absolute top-0 -left-px h-2/3 w-px bg-gradient-to-b from-violet via-blue to-transparent"
			aria-hidden="true"
		></span>
		{#each items as e, i (e.title)}
			<li class="reveal relative pb-14 pl-8 last:pb-0 md:pl-12" use:reveal={i * 80}>
				<span
					class="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-bg bg-violet shadow-[0_0_16px_2px] shadow-violet/60"
					aria-hidden="true"
				></span>
				<p class="font-mono text-xs tracking-[0.2em] text-violet uppercase">{e.period}</p>
				<h3 class="mt-2 text-2xl font-semibold tracking-tight">{e.title}</h3>
				{#if e.org}<p class="mt-1 text-muted">{e.org}</p>{/if}
				<p class="mt-4 max-w-2xl leading-relaxed text-muted">{e.text}</p>
				{#if e.tags.length}
					<ul class="mt-4 flex flex-wrap gap-2">
						{#each e.tags as t (t)}
							<li class="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted">
								{t}
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ol>
</section>
