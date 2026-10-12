<script>
	import { page } from '$app/state';
	import { prefix, site } from '#lib/content/index.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();

	let open = $state(false);
	let scrolled = $state(false);

	const home = $derived(`${prefix(lang)}/`);
	const links = $derived([
		{ href: `${home}#hizmetler`, label: c.nav.services },
		{ href: `${home}#projeler`, label: c.nav.projects },
		{ href: `${home}#hakkimda`, label: c.nav.about },
		{ href: `${home}#deneyim`, label: c.nav.experience },
		{ href: `${prefix(lang)}/blog/`, label: c.nav.blog }
	]);

	// Diğer dildeki karşılık: aynı yol, önek değişir. Yazı sayfasında diğer dilin blog listesine gider
	// (yazının çevirisi olmayabilir).
	const altHref = $derived.by(() => {
		let path = page.url.pathname;
		if (/\/blog\/[^/]+\/?$/.test(path)) path = path.replace(/\/blog\/[^/]+\/?$/, '/blog/');
		const bare = path.replace(/^\/en(?=\/|$)/, '') || '/';
		return lang === 'en' ? bare : `/en${bare}`;
	});
</script>

<svelte:window
	onscroll={() => (scrolled = window.scrollY > 12)}
	onkeydown={(e) => e.key === 'Escape' && (open = false)}
/>

<a
	href="#icerik"
	class="sr-only z-[60] rounded-full bg-violet px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
>
	{c.nav.skip}
</a>

<header
	class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 {scrolled ||
	open
		? 'border-b border-line bg-bg/70 backdrop-blur-xl'
		: 'border-b border-transparent'}"
>
	<nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
		<a href={home} class="group flex items-center gap-2.5 font-medium tracking-tight">
			<span
				class="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-deep to-blue font-serif text-lg text-white shadow-[0_0_24px_-4px] shadow-violet/60"
				aria-hidden="true">F</span
			>
			<span>{site.name}</span>
		</a>

		<ul class="hidden items-center gap-1 text-sm text-muted lg:flex">
			{#each links as l (l.href)}
				<li>
					<a href={l.href} class="rounded-full px-3.5 py-2 transition-colors hover:text-ink"
						>{l.label}</a
					>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			<a
				href={altHref}
				hreflang={c.alt.lang}
				class="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
				aria-label={c.alt.name}>{c.alt.label}</a
			>
			<a
				href="{home}#iletisim"
				class="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform hover:scale-[1.03] sm:inline-block"
				>{c.nav.contact}</a
			>
			<button
				type="button"
				class="grid size-9 place-items-center rounded-full border border-line lg:hidden"
				aria-expanded={open}
				aria-controls="mobil-menu"
				aria-label={open ? c.nav.close : c.nav.menu}
				onclick={() => (open = !open)}
			>
				<svg
					viewBox="0 0 24 24"
					class="size-4"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					{#if open}
						<path d="M6 6l12 12M18 6L6 18" />
					{:else}
						<path d="M4 7h16M4 12h16M4 17h16" />
					{/if}
				</svg>
			</button>
		</div>
	</nav>

	{#if open}
		<ul id="mobil-menu" class="mx-auto max-w-6xl space-y-1 px-5 pb-5 lg:hidden">
			{#each [...links, { href: `${home}#iletisim`, label: c.nav.contact }] as l (l.href)}
				<li>
					<a
						href={l.href}
						class="block rounded-xl px-4 py-3 text-muted hover:bg-white/5 hover:text-ink"
						onclick={() => (open = false)}>{l.label}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</header>
