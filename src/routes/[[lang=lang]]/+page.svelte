<script>
	import { prefix, site } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Strip from '#lib/components/Strip.svelte';
	import Measure from '#lib/components/Measure.svelte';
	import Services from '#lib/components/Services.svelte';
	import Projects from '#lib/components/Projects.svelte';
	import Demo from '#lib/components/Demo.svelte';
	import About from '#lib/components/About.svelte';
	import Process from '#lib/components/Process.svelte';
	import Pricing from '#lib/components/Pricing.svelte';
	import Testimonials from '#lib/components/Testimonials.svelte';
	import Contact from '#lib/components/Contact.svelte';

	let { data } = $props();
	const c = $derived(data.c);

	const person = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		url: site.url + '/',
		jobTitle: c.hero.eyebrow,
		sameAs: [site.github, site.bionluk]
	});
</script>

<Seo
	title={c.meta.title}
	description={c.meta.description}
	path="{prefix(data.lang)}/"
	lang={data.lang}
	alternates={[
		{ lang: 'tr', path: '/' },
		{ lang: 'en', path: '/en/' }
	]}
	jsonld={person}
/>

<Hero {c} lang={data.lang} />
<Strip {c} />
<Measure {c} lang={data.lang} />
<Services {c} />
<Projects {c} />
<Demo {c} lang={data.lang} />
<Process {c} />
<About {c} lang={data.lang} />
<Pricing {c} lang={data.lang} />
<Testimonials {c} />
<Contact {c} />
