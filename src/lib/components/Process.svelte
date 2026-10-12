<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
</script>

<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="surec">
	<SectionHeading id="surec" eyebrow={c.process.eyebrow} title={c.process.title} />

	<ol class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each c.process.steps as s, i (s.title)}
			<li class="reveal group glow-card p-7" use:reveal={i * 90} use:spotlight>
				<span
					class="block font-mono text-5xl font-medium text-ink/10 transition-colors duration-500 group-hover:text-violet/60"
					aria-hidden="true">{String(i + 1).padStart(2, '0')}</span
				>
				<h3 class="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
				<p class="mt-3 leading-relaxed text-muted">{s.text}</p>
			</li>
		{/each}
	</ol>
</section>
