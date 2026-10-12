<script>
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import '@fontsource/instrument-serif/400.css';
	import '@fontsource/instrument-serif/400-italic.css';
	import '../app.css';
	import { onMount } from 'svelte';

	/** @type {{ children: import('svelte').Snippet }} */
	let { children } = $props();

	// app.html'deki yedek zamanlayıcıya "uygulama açıldı" haberi (reveal animasyonları güvenle çalışır)
	onMount(() => {
		/** @type {any} */ (window).__hydrated = true;
	});
</script>

{@render children()}
