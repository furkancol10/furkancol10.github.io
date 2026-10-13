<script>
	import { site } from '#lib/content/index.js';
	import { inview } from '#lib/motion.js';

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
	<div class="v2">
		<section class="wrap block" id="fiyatlar" aria-labelledby="h-fiyat">
			<div class="split">
				<h2 id="h-fiyat"><span class="mk" use:inview><span>{p.title}</span></span></h2>
				<div>
					<p class="price-lead">{p.lead}</p>
					<ul class="prices">
						{#each p.items as item (item.id)}
							<li>
								<h3>{item.title}</h3>
								<p class="price">
									{#if item.price}<b>{fmt.format(item.price)}</b> {p.from}{:else}{p.quote}{/if}
								</p>
								<p class="feat">{item.features.slice(0, 2).join(' · ')}</p>
								<p class="links">
									<a
										href={target(item.cta.href)}
										rel={item.cta.href === 'BIONLUK' ? 'noopener' : undefined}
										>{item.cta.label} {target(item.cta.href).startsWith('http') ? '↗' : '→'}</a
									>
								</p>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
	</div>
{/if}
