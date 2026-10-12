<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';

	/**
	 * Yalnızca gerçek yorumlar: { quote, name, role } — içerikte dizi boşsa bölüm hiç görünmez.
	 * @type {{ c: import('#lib/content/index.js').Content }}
	 */
	let { c } = $props();
	/** @type {{ quote: string, name: string, role?: string }[]} */
	const items = $derived(/** @type {any} */ (c.testimonials.items));
</script>

{#if items.length}
	<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="yorumlar">
		<SectionHeading id="yorumlar" eyebrow={c.testimonials.eyebrow} title={c.testimonials.title} />
		<div class="grid gap-5 md:grid-cols-2">
			{#each items as t, i (t.name + i)}
				<figure class="reveal glow-card p-7" use:reveal={i * 90} use:spotlight>
					<blockquote class="text-lg leading-relaxed">“{t.quote}”</blockquote>
					<figcaption class="mt-5 text-sm text-muted">
						<span class="text-ink">{t.name}</span>{#if t.role}
							· {t.role}{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	</section>
{/if}
