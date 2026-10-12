<script>
	import { prefix, site } from '#lib/content/index.js';
	import Seo from '#lib/components/Seo.svelte';

	let { data } = $props();
	const b = $derived(data.c.blog);
	const m = $derived(data.meta);
	const path = $derived(`${prefix(data.lang)}/blog/${data.slug}/`);
	const fmt = $derived(
		new Intl.DateTimeFormat(data.lang === 'en' ? 'en-GB' : 'tr-TR', { dateStyle: 'long' })
	);
	const Post = $derived(data.component);

	const article = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: m.title,
		description: m.description,
		datePublished: m.date,
		inLanguage: data.lang,
		author: { '@type': 'Person', name: site.name, url: site.url + '/' },
		url: site.url + path
	});
</script>

<Seo
	title="{m.title} · Furkan Çöl"
	description={m.description}
	{path}
	lang={data.lang}
	alternates={data.alternates.length > 1 ? data.alternates : []}
	type="article"
	image={m.image ?? '/assets/img/og.png'}
	jsonld={article}
/>

<article class="relative isolate mx-auto max-w-3xl px-5 pt-36 pb-24 md:px-8 md:pt-44">
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<a href="{prefix(data.lang)}/blog/" class="text-sm text-muted hover:text-ink">← {b.back}</a>

	<header class="mt-8">
		<p class="font-mono text-xs text-muted">
			<time datetime={m.date}>{fmt.format(new Date(m.date))}</time>
			{#if m.draft}<span
					class="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-700 dark:text-amber-300"
					>{b.draft}</span
				>{/if}
		</p>
		<h1 class="mt-4 text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
			{m.title}
		</h1>
		<p class="mt-5 text-lg leading-relaxed text-muted">{m.description}</p>
	</header>

	<div
		class="prose mt-12 max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-violet prose-img:rounded-xl prose-img:border prose-img:border-line"
	>
		<Post />
	</div>
</article>
