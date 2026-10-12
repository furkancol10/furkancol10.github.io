<script>
	import { prefix, site } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Services from '#lib/components/Services.svelte';
	import Projects from '#lib/components/Projects.svelte';
	import About from '#lib/components/About.svelte';
	import Experience from '#lib/components/Experience.svelte';
	import Process from '#lib/components/Process.svelte';
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

<Hero {c} />
<Services {c} />
<Projects {c} />
<About {c} />
<Experience {c} />
<Process {c} />
<Testimonials {c} />
<Contact {c} />
