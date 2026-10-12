<script>
	import { mark } from '#lib/signature.js';

	/** El yazısı FC logosu: gradyan kare içinde beyaz harfler (favicon ile aynı çizim). */
	/** @type {{ class?: string }} */
	let { class: klass = '' } = $props();
	const uid = $props.id();
	const gid = `mark-${uid}`;
</script>

<svg viewBox="0 0 {mark.size} {mark.size}" class={klass} aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#7c3aed" />
			<stop offset="1" stop-color="#2563eb" />
		</linearGradient>
	</defs>
	<rect width={mark.size} height={mark.size} rx="16" fill="url(#{gid})" />
	<g
		fill="#fff"
		stroke="#fff"
		stroke-width={mark.stroke}
		stroke-linejoin="round"
		transform={mark.transform}
	>
		{#each mark.glyphs as d, i (i)}
			<path {d} />
		{/each}
	</g>
</svg>
