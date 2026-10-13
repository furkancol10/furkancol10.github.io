<script>
	import { count, scrub } from '#lib/motion.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const m = $derived(c.v2.measure);
	const words = $derived(m.statement.split(/\s+/));
	const en = $derived(lang === 'en');
</script>

<div class="v2">
	<section class="measure wrap" aria-labelledby="olculmus">
		<p class="statement scrub" id="olculmus" use:scrub aria-label={m.statement}>
			{#each words as w, i (i)}{i ? ' ' : ''}<span class="w" aria-hidden="true">{w}</span>{/each}
		</p>
		<div class="nums">
			<p class="n big">
				<b use:count={{ to: 277, lang }}>277</b><span>{m.photos}</span>
			</p>
			<p class="n">
				<b use:count={{ to: 72, lang, pre: en ? '' : '%', suf: en ? '%' : '' }}
					>{en ? '72%' : '%72'}</b
				><span>{m.verified}</span>
			</p>
			<p class="n">
				<b use:count={{ to: 1.8, dec: 1, lang, suf: en ? ' s' : ' sn' }}
					>{en ? '1.8 s' : '1,8 sn'}</b
				><span>{m.speed}</span>
			</p>
		</div>
	</section>
</div>
