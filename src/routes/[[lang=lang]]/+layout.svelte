<script>
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import LangSuggest from '#lib/components/LangSuggest.svelte';
	import Intro from '#lib/components/Intro.svelte';

	let { data, children } = $props();
</script>

<Intro />
<Nav c={data.c} lang={data.lang} />
<main id="icerik" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Footer c={data.c} year={data.year} />
<LangSuggest lang={data.lang} suggest={data.suggest} />
