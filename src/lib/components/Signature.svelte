<script>
	import { name } from '#lib/signature.js';

	/**
	 * El yazısı "Furkan Çöl" (Great Vibes yollarından).
	 * `draw`: harfler kalemle yazılıyormuş gibi çizilir (yalnızca html.intro varken, bkz. app.css).
	 * `gradient`: dolgu mor-mavi gradyan; yoksa yazı rengini (currentColor) alır.
	 * @type {{ class?: string, draw?: boolean, gradient?: boolean, target?: boolean }}
	 */
	let { class: klass = '', draw = false, gradient = false, target = false } = $props();

	const uid = $props.id();
	const gid = `sig-${uid}`;
	const paint = $derived(gradient ? `url(#${gid})` : 'currentColor');
	// Gradyan tüm yazıya yayılır (harf başına değil), yoksa her harf kendi içinde renk değiştirir.
	const [vx, , vw] = name.viewBox.split(' ').map(Number);
</script>

<svg
	viewBox={name.viewBox}
	class="{klass} {draw ? 'sig-draw' : ''}"
	data-signature-target={target ? '' : undefined}
	aria-hidden="true"
	focusable="false"
>
	{#if gradient}
		<defs>
			<linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={vx} y1="0" x2={vx + vw} y2="0">
				<stop offset="0" stop-color="var(--grad-a)" />
				<stop offset="0.55" stop-color="var(--grad-b)" />
				<stop offset="1" stop-color="var(--grad-c)" />
			</linearGradient>
		</defs>
	{/if}
	<!-- İnce el yazısı küçük boyutta kaybolmasın diye hafif kontur (çizim animasyonunda app.css yönetir) -->
	<g fill={paint} stroke={paint} stroke-width="2.2" stroke-linejoin="round">
		{#each name.glyphs as d, i (i)}
			<path {d} pathLength="1" style="--i:{i}" />
		{/each}
	</g>
</svg>
