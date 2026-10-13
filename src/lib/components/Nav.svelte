<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { prefix, site } from '#lib/content/index.js';
	import { langPaths, rememberLang } from '#lib/i18n.js';
	import Mark from './Mark.svelte';
	import Signature from './Signature.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();

	let open = $state(false);
	let scrolled = $state(false);
	// Sayfa kaydırılmış konumda açılırsa (bağlantıda #bölüm, yenileme) arka plan hemen gelsin
	onMount(() => (scrolled = window.scrollY > 12));

	const home = $derived(`${prefix(lang)}/`);
	const links = $derived([
		{ href: `${home}#hizmetler`, label: c.nav.services },
		{ href: `${home}#projeler`, label: c.nav.projects },
		{ href: `${prefix(lang)}/${lang === 'en' ? 'about' : 'ben-kimim'}/`, label: c.nav.whoami },
		{ href: `${prefix(lang)}/blog/`, label: c.nav.blog }
	]);

	const paths = $derived(langPaths(page.url.pathname, page.data.alternates));
	const langs = $derived([
		{ code: 'tr', label: 'TR', name: 'Türkçe', href: paths.tr },
		{ code: 'en', label: 'EN', name: 'English', href: paths.en }
	]);

	/** Açık/koyu tema geçişi; seçim tarayıcıda saklanır (app.html sayfa açılırken uygular). */
	function toggleTheme() {
		const dark = document.documentElement.classList.toggle('dark');
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch {
			// gizli pencere vb.: yalnızca bu oturumda geçerli
		}
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', dark ? '#060610' : '#f6f6fc');
	}
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
	<nav
		class="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-[clamp(20px,4vw,56px)]"
	>
		<a href={home} class="flex shrink-0 items-center gap-2" aria-label={site.name}>
			<Mark class="size-9 drop-shadow-[0_4px_14px_rgb(124_58_237/0.35)]" />
			<Signature gradient target class="h-8 w-auto" />
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
			<!-- Dil seçici: iki seçenek de görünür, etkin olan dolu -->
			<div
				class="flex items-center rounded-full border border-line bg-ink/[0.03] p-0.5 text-xs font-medium"
				role="group"
				aria-label={c.nav.language}
			>
				<svg
					viewBox="0 0 24 24"
					class="mx-1.5 hidden size-3.5 text-muted sm:block"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" /><path
						d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
					/>
				</svg>
				{#each langs as l (l.code)}
					<a
						href={l.href}
						hreflang={l.code}
						lang={l.code}
						title={l.name}
						aria-current={l.code === lang ? 'true' : undefined}
						onclick={() => rememberLang(l.code)}
						class="rounded-full px-2.5 py-1 transition-colors {l.code === lang
							? 'bg-ink text-bg'
							: 'text-muted hover:text-ink'}"
					>
						<span class="sm:hidden">{l.label}</span><span class="hidden sm:inline">{l.name}</span>
					</a>
				{/each}
			</div>

			<!-- Tema düğmesi: simge CSS ile değişir (dark: ön eki), JS durumuna gerek yok -->
			<button
				type="button"
				onclick={toggleTheme}
				class="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
				aria-label={c.nav.theme}
				title={c.nav.theme}
			>
				<svg
					viewBox="0 0 24 24"
					class="size-4 dark:hidden"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke-linejoin="round" />
				</svg>
				<svg
					viewBox="0 0 24 24"
					class="hidden size-4 dark:block"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="4" />
					<path
						d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
						stroke-linecap="round"
					/>
				</svg>
			</button>

			<a href="{home}#iletisim" class="pill hidden !py-2 text-sm md:inline-block">{c.nav.contact}</a
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
		<ul
			id="mobil-menu"
			class="mx-auto max-w-[1320px] space-y-1 px-[clamp(20px,4vw,56px)] pb-5 lg:hidden"
		>
			{#each [...links, { href: `${home}#iletisim`, label: c.nav.contact }] as l (l.href)}
				<li>
					<a
						href={l.href}
						class="block rounded-xl px-4 py-3 text-muted hover:bg-ink/5 hover:text-ink"
						onclick={() => (open = false)}>{l.label}</a
					>
				</li>
			{/each}
		</ul>
	{/if}
</header>
