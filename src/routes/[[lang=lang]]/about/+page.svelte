<script>
	import { prefix, site } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import Who from '#lib/components/Who.svelte';
	import Contact from '#lib/components/Contact.svelte';

	let { data } = $props();
	const c = $derived(data.c);

	const person = $derived({
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		mainEntity: {
			'@type': 'Person',
			name: site.name,
			url: site.url + '/',
			jobTitle: c.hero.eyebrow,
			sameAs: [site.github, site.bionluk]
		}
	});
</script>

<Seo
	title={c.v2.who.meta_title}
	description={c.v2.who.meta_description}
	path="{prefix(data.lang)}/{data.lang === 'en' ? 'about' : 'ben-kimim'}/"
	lang={data.lang}
	alternates={[
		{ lang: 'tr', path: '/ben-kimim/' },
		{ lang: 'en', path: '/en/about/' }
	]}
	jsonld={person}
/>

<Who {c} lang={data.lang} />
<Contact {c} />
