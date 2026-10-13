<script>
	import { pointerGlow } from '#lib/motion.js';
	import EmailLink from './EmailLink.svelte';
	import Receipt from './Receipt.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const h = $derived(c.v2.hero);
</script>

<div class="v2">
	<section class="hero wrap" aria-labelledby="baslik" use:pointerGlow>
		<div class="aurora" aria-hidden="true">
			<i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>
		</div>
		<div class="hero-copy">
			<h1 id="baslik">
				<span class="l" style="--t:.15s"><span>{h.l1}</span></span>
				<span class="l" style="--t:.3s"><span class="grad"><em>{h.l2}</em></span></span>
				<span class="l" style="--t:.45s"><span class="grad"><em>{h.l3}</em></span></span>
			</h1>
			<p class="lead" style="--t:.9s">{c.hero.lead}</p>
			<p class="hero-links" style="--t:1.1s">
				<a class="pill" href="#projeler">{c.hero.cta_primary}</a>
				<span>{h.or_write} <EmailLink showAddress class="mail" /></span>
			</p>
		</div>
		<Receipt {c} {lang} />
	</section>
</div>
