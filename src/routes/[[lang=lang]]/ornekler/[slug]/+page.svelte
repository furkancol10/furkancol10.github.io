<script>
	import { prefix } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';
	import ExampleDetail from '#lib/components/ExampleDetail.svelte';

	let { data } = $props();
	const c = $derived(data.c);
	const item = $derived(c.examples.items.find((i) => i.id === data.slug) ?? c.examples.items[0]);
</script>

<Seo
	title="{item.title} · Furkan Çöl"
	description={item.summary}
	path="{prefix(data.lang)}/ornekler/{data.slug}/"
	lang={data.lang}
	alternates={data.alternates}
	image="/assets/examples/{item.shots[0].src}"
/>

<ExampleDetail {c} lang={data.lang} {item} />
