<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import { site } from '#lib/content/index.js';
	import SectionHeading from './SectionHeading.svelte';

	/**
	 * Başlangıç fiyatları. `pricing.publish` false iken bölüm görünmez; `price: null` olan kartta
	 * fiyat yerine "Teklif alın" yazar. CTA'da "BIONLUK" yazan adres site.json'daki profile dönüşür.
	 * @type {{ c: import('#lib/content/index.js').Content, lang: string }}
	 */
	let { c, lang } = $props();
	const p = $derived(c.pricing);
	const fmt = $derived(new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'tr-TR'));
	/** @param {string} href */
	const target = (href) => (href === 'BIONLUK' ? site.bionluk : href);
</script>

{#if p.publish}
	<section class="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="fiyatlar">
		<SectionHeading id="fiyatlar" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
		<div class="grid gap-5 md:grid-cols-3">
			{#each p.items as item, i (item.id)}
				<article class="reveal glow-card flex flex-col p-7" use:reveal={i * 90} use:spotlight>
					<h3 class="text-lg font-semibold tracking-tight">{item.title}</h3>
					<p class="mt-4">
						{#if item.price}
							<span class="text-gradient text-4xl font-semibold tracking-tight"
								>{fmt.format(item.price)}</span
							>
							<span class="ml-1 text-sm text-muted">{p.from}</span>
						{:else}
							<span class="text-2xl font-semibold tracking-tight">{p.quote}</span>
						{/if}
					</p>
					<ul class="mt-6 flex-1 space-y-2.5 text-sm">
						{#each item.features as f (f)}
							<li class="flex gap-2.5">
								<svg
									viewBox="0 0 24 24"
									class="mt-0.5 size-4 shrink-0 text-violet"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" /></svg
								>
								<span class="text-muted">{f}</span>
							</li>
						{/each}
					</ul>
					<a
						href={target(item.cta.href)}
						rel={item.cta.href === 'BIONLUK' ? 'noopener' : undefined}
						class="mt-7 rounded-full border border-line-strong px-5 py-2.5 text-center text-sm font-medium transition-colors hover:bg-ink/[0.06]"
						>{item.cta.label}</a
					>
				</article>
			{/each}
		</div>
	</section>
{/if}
