<script>
	import { prefix, site } from '#lib/content/index.js';
	import { reveal, spotlight } from '#lib/actions.js';
	import Seo from '#lib/components/Seo.svelte';
	import EmailLink from '#lib/components/EmailLink.svelte';
	import SectionHeading from '#lib/components/SectionHeading.svelte';

	let { data } = $props();
	const w = $derived(data.c.wp);
	const home = $derived(`${prefix(data.lang)}/`);

	// Arama motorları için: hizmet tanımı ve SSS (Google soru-cevap olarak gösterebilir)
	const jsonld = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'Service',
			name: w.meta.title,
			description: w.meta.description,
			provider: { '@type': 'Person', name: site.name, url: site.url + '/' },
			areaServed: 'TR',
			url: `${site.url}${prefix(data.lang)}/wordpress/`
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: w.faq.map((f) => ({
				'@type': 'Question',
				name: f.q,
				acceptedAnswer: { '@type': 'Answer', text: f.a }
			}))
		}
	]);
</script>

<Seo
	title={w.meta.title}
	description={w.meta.description}
	path="{prefix(data.lang)}/wordpress/"
	lang={data.lang}
	alternates={[
		{ lang: 'tr', path: '/wordpress/' },
		{ lang: 'en', path: '/en/wordpress/' }
	]}
	{jsonld}
/>

<!-- Giriş -->
<section class="relative isolate overflow-clip pt-36 pb-16 md:pt-44 md:pb-24" use:spotlight>
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<div
		class="pointer-events-none absolute top-0 left-[15%] -z-10 h-[40rem] w-[32rem] animate-spotlight rounded-full bg-[radial-gradient(closest-side,var(--hero-a),transparent)] opacity-0 blur-2xl"
		aria-hidden="true"
	></div>
	<div class="mx-auto max-w-6xl px-5 md:px-8">
		<p class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{w.eyebrow}</p>
		<h1
			class="mt-5 max-w-4xl text-[2.4rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl"
		>
			{@html w.title}
		</h1>
		<p class="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{w.lead}</p>
		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href="{home}#iletisim"
				class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-deep to-blue px-6 py-3 font-medium text-white shadow-[0_8px_32px_-8px] shadow-violet-deep/70 transition-transform hover:scale-[1.03]"
			>
				{w.cta} <span aria-hidden="true">→</span>
			</a>
			<p class="text-sm text-muted">{w.cta_note}</p>
		</div>
	</div>
</section>

<!-- Neden -->
<section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-labelledby="neden">
	<SectionHeading id="neden" eyebrow="01" title={w.why_title} />
	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each w.why as item, i (item.title)}
			<article class="reveal glow-card p-7" use:reveal={i * 80} use:spotlight>
				<h3 class="text-lg font-semibold tracking-tight">{item.title}</h3>
				<p class="mt-3 leading-relaxed text-muted">{item.text}</p>
			</article>
		{/each}
	</div>
</section>

<!-- Süreç -->
<section class="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24" aria-labelledby="nasil">
	<SectionHeading id="nasil" eyebrow="02" title={w.steps_title} />
	<ol class="grid gap-5 md:grid-cols-2">
		{#each w.steps as s, i (s.title)}
			<li class="reveal glow-card flex gap-5 p-7" use:reveal={i * 80} use:spotlight>
				<span class="font-mono text-3xl text-violet/70" aria-hidden="true"
					>{String(i + 1).padStart(2, '0')}</span
				>
				<div>
					<h3 class="text-lg font-semibold tracking-tight">{s.title}</h3>
					<p class="mt-2 leading-relaxed text-muted">{s.text}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<!-- Korunanlar + örnek -->
<section class="mx-auto grid max-w-6xl gap-5 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
	<div class="reveal glow-card p-8" use:reveal use:spotlight>
		<h2 class="text-2xl font-semibold tracking-tight">{w.kept_title}</h2>
		<ul class="mt-5 space-y-3">
			{#each w.kept as k (k)}
				<li class="flex gap-3">
					<svg
						viewBox="0 0 24 24"
						class="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" /></svg
					>
					<span>{k}</span>
				</li>
			{/each}
		</ul>
	</div>
	<div class="reveal glow-card flex flex-col p-8" use:reveal={100} use:spotlight>
		<h2 class="text-2xl font-semibold tracking-tight">{w.case_title}</h2>
		<p class="mt-4 flex-1 leading-relaxed text-muted">{w.case_text}</p>
		<a href={home} class="mt-6 text-violet hover:underline"
			>{w.case_link} <span aria-hidden="true">→</span></a
		>
	</div>
</section>

<!-- SSS -->
<section class="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24" aria-labelledby="sss">
	<h2 id="sss" class="text-3xl font-semibold tracking-tight md:text-4xl">{w.faq_title}</h2>
	<div class="mt-8 divide-y divide-line border-y border-line">
		{#each w.faq as f (f.q)}
			<details class="group py-5">
				<summary
					class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium"
				>
					{f.q}
					<span class="text-muted transition-transform group-open:rotate-45" aria-hidden="true"
						>+</span
					>
				</summary>
				<p class="mt-3 leading-relaxed text-muted">{f.a}</p>
			</details>
		{/each}
	</div>

	<div class="mt-14 flex flex-wrap items-center gap-3">
		<a
			href="{home}#iletisim"
			class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-deep to-blue px-6 py-3 font-medium text-white transition-transform hover:scale-[1.03]"
			>{w.cta} <span aria-hidden="true">→</span></a
		>
		<EmailLink
			showAddress
			class="rounded-full border border-line-strong px-6 py-3 transition-colors hover:bg-ink/[0.06]"
		/>
	</div>
</section>
