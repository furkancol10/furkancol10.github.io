<script>
	import { inview } from '#lib/motion.js';

	/**
	 * Yalnızca gerçek yorumlar: { quote, name, role } — içerikte dizi boşsa bölüm hiç görünmez.
	 * @type {{ c: import('#lib/content/index.js').Content }}
	 */
	let { c } = $props();
	/** @type {{ quote: string, name: string, role?: string }[]} */
	const items = $derived(/** @type {any} */ (c.testimonials.items));
</script>

{#if items.length}
	<div class="v2">
		<section class="wrap block" aria-labelledby="yorumlar">
			<div class="sec-head">
				<p class="eyebrow">{c.testimonials.eyebrow}</p>
				<h2 id="yorumlar"><span class="mk" use:inview><span>{c.testimonials.title}</span></span></h2>
			</div>
			<div class="quotes">
				{#each items as t, i (t.name + i)}
					<figure>
						<blockquote>“{t.quote}”</blockquote>
						<figcaption>
							<b>{t.name}</b>{#if t.role}
								· {t.role}{/if}
						</figcaption>
					</figure>
				{/each}
			</div>
		</section>
	</div>
{/if}
