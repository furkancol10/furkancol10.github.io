<script>
	import { prefix } from '#lib/content/index.js';
	import { postHref } from '#lib/blog.js';
	import { reveal, spotlight } from '#lib/actions.js';
	import Seo from '#lib/components/Seo.svelte';

	let { data } = $props();
	const c = $derived(data.c);
	const b = $derived(c.blog);
	const fmt = $derived(
		new Intl.DateTimeFormat(data.lang === 'en' ? 'en-GB' : 'tr-TR', { dateStyle: 'long' })
	);
	const list = $derived([
		...data.own.map((p) => ({ ...p, note: '' })),
		...data.others.map((p) => ({ ...p, note: b.lang_note }))
	]);
</script>

<Seo
	title="{b.title} · Furkan Çöl"
	description={b.lead}
	path="{prefix(data.lang)}/blog/"
	lang={data.lang}
	alternates={[
		{ lang: 'tr', path: '/blog/' },
		{ lang: 'en', path: '/en/blog/' }
	]}
/>

<section class="relative isolate mx-auto max-w-4xl px-5 pt-36 pb-24 md:px-8 md:pt-44">
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<p class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{b.eyebrow}</p>
	<h1 class="mt-4 text-5xl font-semibold tracking-tight md:text-6xl">{b.title}</h1>
	<p class="mt-5 max-w-2xl text-lg text-muted">{b.lead}</p>

	{#if list.length}
		<ul class="mt-14 space-y-5">
			{#each list as p (p.lang + p.slug)}
				<li class="reveal" use:reveal>
					<a href={postHref(p)} class="glow-card block p-7 md:p-8" use:spotlight hreflang={p.lang}>
						<p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
							<time datetime={p.date}>{fmt.format(new Date(p.date))}</time>
							<span aria-hidden="true">·</span>
							<span>{p.minutes} {b.minutes}</span>
							{#if p.note}<span class="rounded-full border border-line px-2 py-0.5">{p.note}</span
								>{/if}
							{#if p.draft}<span
									class="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-700 dark:text-amber-300"
									>{b.draft}</span
								>{/if}
						</p>
						<h2 class="mt-3 text-2xl font-semibold tracking-tight">{p.title}</h2>
						<p class="mt-2 leading-relaxed text-muted">{p.description}</p>
						<p class="mt-5 text-sm text-violet">{b.read} <span aria-hidden="true">→</span></p>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-14 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
			{b.empty}
		</p>
	{/if}
</section>
