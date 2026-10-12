<script>
	import { onMount } from 'svelte';

	// Türkiye'nin yaklaşık merkezi
	const LAT = 39;
	const LON = 35;

	/** @type {HTMLCanvasElement} */
	let canvas;
	let ready = $state(false);

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		// @ts-ignore: navigator.connection her tarayıcıda yok
		const saveData = navigator.connection?.saveData === true;
		if (reduced || saveData) return; // statik gradyan küre kalır

		/** @type {import('cobe').Globe | undefined} */
		let globe;
		let frame = 0;
		let visible = false;
		// cobe'da phi boylamı çevirir; bu formül verilen konumu ekranın ortasına getirir.
		let phi = Math.PI - ((LON * Math.PI) / 180 - Math.PI / 2);

		const loop = () => {
			phi += 0.0025;
			globe?.update({ phi });
			if (visible) frame = requestAnimationFrame(loop);
		};

		const io = new IntersectionObserver(async ([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !globe) {
				const { default: createGlobe } = await import('cobe');
				const dpr = Math.min(window.devicePixelRatio || 1, 2);
				const size = canvas.offsetWidth * dpr;
				globe = createGlobe(canvas, {
					devicePixelRatio: dpr,
					width: size,
					height: size,
					phi,
					theta: 0.32,
					dark: 1,
					diffuse: 1.2,
					mapSamples: 14000,
					mapBrightness: 5,
					baseColor: [0.28, 0.24, 0.45],
					markerColor: [0.75, 0.65, 1],
					glowColor: [0.32, 0.28, 0.62],
					markers: [{ location: [LAT, LON], size: 0.09 }]
				});
				ready = true;
			}
			cancelAnimationFrame(frame);
			if (visible) frame = requestAnimationFrame(loop);
		});
		io.observe(canvas);

		return () => {
			io.disconnect();
			cancelAnimationFrame(frame);
			globe?.destroy();
		};
	});
</script>

<div class="relative aspect-square w-full" aria-hidden="true">
	<!-- Yedek: WebGL yoksa, hareket azaltılmışsa ya da yüklenene kadar -->
	<div
		class="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(167_139_250/0.35),rgb(59_130_246/0.12)_45%,transparent_70%)] shadow-[0_0_80px_-10px] shadow-violet-deep/50 transition-opacity duration-700 {ready
			? 'opacity-0'
			: 'opacity-100'}"
	></div>
	<canvas
		bind:this={canvas}
		class="absolute inset-0 size-full transition-opacity duration-1000 {ready
			? 'opacity-100'
			: 'opacity-0'}"
	></canvas>
</div>
