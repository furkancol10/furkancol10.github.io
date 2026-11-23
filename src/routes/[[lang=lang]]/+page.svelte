<script>
	import { prefix, site } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import HeroWordmark from '#lib/components/HeroWordmark.svelte';
	import ServicesList from '#lib/components/ServicesList.svelte';
	import Measure from '#lib/components/Measure.svelte';
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

<HeroWordmark {c} />
<ServicesList {c} />
<!-- STEP2: WorkScenes slot; for now keep the existing <Projects/> there -->
<Projects {c} lang={data.lang} />
<Measure {c} lang={data.lang} />
<Demo {c} lang={data.lang} />
<Pricing {c} lang={data.lang} />
<Process {c} />
<About {c} lang={data.lang} />
<Testimonials {c} />
<Contact {c} />
