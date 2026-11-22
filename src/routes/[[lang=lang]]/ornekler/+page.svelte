<script>
	import { prefix } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import ExamplesList from '#lib/components/ExamplesList.svelte';
	import Contact from '#lib/components/Contact.svelte';

	let { data } = $props();
	const c = $derived(data.c);
</script>

<Seo
	title={c.examples.meta_title}
	description={c.examples.meta_description}
	path="{prefix(data.lang)}/ornekler/"
	lang={data.lang}
	alternates={data.alternates}
/>

<ExamplesList {c} lang={data.lang} />
<Contact {c} />
