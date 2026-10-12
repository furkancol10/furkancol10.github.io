<script>
	import { site } from '#lib/content/index.js';

	/**
	 * @type {{
	 *   title: string,
	 *   description: string,
	 *   path: string,
	 *   lang: string,
	 *   alternates?: { lang: string, path: string }[],
	 *   type?: string,
	 *   image?: string,
	 *   jsonld?: object | null
	 * }}
	 */
	let {
		title,
		description,
		path,
		lang,
		alternates = [],
		type = 'website',
		image = '/assets/img/og.png',
		jsonld = null
	} = $props();

	const url = $derived(site.url + path);
	const trAlt = $derived(alternates.find((a) => a.lang === 'tr'));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#each alternates as a (a.lang)}
		<link rel="alternate" hreflang={a.lang} href={site.url + a.path} />
	{/each}
	{#if trAlt}
		<link rel="alternate" hreflang="x-default" href={site.url + trAlt.path} />
	{/if}
	<link
		rel="alternate"
		type="application/rss+xml"
		title="{site.name} · Blog"
		href={site.url + (lang === 'en' ? '/en/rss.xml' : '/rss.xml')}
	/>

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={site.url + image} />
	<meta property="og:locale" content={lang === 'en' ? 'en_US' : 'tr_TR'} />
	<meta name="twitter:card" content="summary_large_image" />

	{#if jsonld}
		<!-- İçerik bizim JSON'umuzdan; '<' kaçırılır ki </script> metni betiği kapatamasın -->
		{@html `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`}
	{/if}
</svelte:head>
