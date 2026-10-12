<script>
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { data, children } = $props();
</script>

<Nav c={data.c} lang={data.lang} />
<main id="icerik" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Footer c={data.c} year={data.year} />
