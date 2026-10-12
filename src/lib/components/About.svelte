<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';
	import Globe from './Globe.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	const a = $derived(c.about);
</script>

<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="hakkimda">
	<SectionHeading id="hakkimda" eyebrow={a.eyebrow} title={a.title} />

	<div class="grid gap-5 md:grid-cols-6">
		<!-- Tanıtım -->
		<article
			class="reveal glow-card p-7 md:col-span-4 md:row-span-2 md:p-9"
			use:reveal
			use:spotlight
		>
			<h3 class="font-serif text-4xl italic md:text-5xl">{a.intro_title}</h3>
			{#each a.paragraphs as para, i (i)}
				<p class="mt-5 text-lg leading-relaxed text-muted">{@html para}</p>
			{/each}
		</article>

		<!-- Konum + dünya -->
		<article
			class="reveal glow-card flex flex-col overflow-clip p-7 md:col-span-2 md:row-span-2"
			use:reveal={100}
			use:spotlight
		>
			<h3 class="text-xl font-semibold tracking-tight">{a.location_title}</h3>
			<p class="mt-2 text-muted">{a.location_text}</p>
			<div class="-mx-4 mt-auto -mb-16 pt-4">
				<Globe />
			</div>
		</article>

		<!-- Araçlar -->
		<article class="reveal glow-card p-7 md:col-span-4" use:reveal use:spotlight>
			<h3 class="text-xl font-semibold tracking-tight">{a.skills_title}</h3>
			<dl class="mt-5 grid gap-4 sm:grid-cols-2">
				{#each a.skills as [label, value] (label)}
					<div>
						<dt class="font-mono text-xs tracking-[0.2em] text-violet uppercase">{label}</dt>
						<dd class="mt-1.5 leading-relaxed text-muted">{value}</dd>
					</div>
				{/each}
			</dl>
		</article>

		<!-- Şu an -->
		<article
			class="reveal glow-card flex flex-col justify-between p-7 md:col-span-2"
			use:reveal={100}
			use:spotlight
		>
			<p class="font-mono text-xs tracking-[0.2em] text-muted uppercase">{a.now_title}</p>
			<p class="mt-6 text-gradient text-2xl leading-snug font-semibold">{a.now_text}</p>
		</article>
	</div>
</section>
