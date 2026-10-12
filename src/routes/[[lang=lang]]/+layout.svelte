<script>
	import Nav from '#lib/components/Nav.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import LangSuggest from '#lib/components/LangSuggest.svelte';
	import Intro from '#lib/components/Intro.svelte';
	import { site } from '#lib/content/index.js';

	let { data, children } = $props();
</script>

<svelte:head>
	<!-- Google Search Console sahiplik doğrulaması (site.json'da değer varsa) -->
	{#if site.google_site_verification}
		<meta name="google-site-verification" content={site.google_site_verification} />
	{/if}
	<!-- Cloudflare Web Analytics: çerezsiz ziyaret sayımı (site.json'da token varsa) -->
	{#if site.cf_analytics_token}
		<script
			defer
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon={JSON.stringify({ token: site.cf_analytics_token })}
		></script>
	{/if}
</svelte:head>

<Intro />
<Nav c={data.c} lang={data.lang} />
<main id="icerik" tabindex="-1" class="outline-none">
	{@render children()}
</main>
<Footer c={data.c} year={data.year} />
<LangSuggest lang={data.lang} suggest={data.suggest} />
