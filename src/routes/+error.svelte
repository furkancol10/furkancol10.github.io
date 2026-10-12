<script>
	import { page } from '$app/state';

	const en = $derived(page.url.pathname.startsWith('/en'));
</script>

<svelte:head>
	<title>{page.status} · Furkan Çöl</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-dvh place-items-center px-5 text-center">
	<div>
		<p class="text-gradient font-mono text-7xl font-medium">{page.status}</p>
		<p class="mt-4 text-lg text-muted">
			{en ? 'This page could not be found.' : 'Aradığınız sayfa bulunamadı.'}
		</p>
		<a
			href={en ? '/en/' : '/'}
			class="mt-8 inline-block rounded-full border border-line-strong px-6 py-3 hover:bg-white/[0.06]"
		>
			{en ? 'Back to home' : 'Ana sayfaya dön'}
		</a>
	</div>
</main>
