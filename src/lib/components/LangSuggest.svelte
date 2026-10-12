<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { langPaths, chosenLang, rememberLang } from '#lib/i18n.js';

	/**
	 * Tarayıcı dili sayfa dilinden farklıysa diğer sürümü öneren küçük bant.
	 * Yönlendirme yapılmaz (arama motorları her iki sürümü de görsün diye).
	 * Metin, önerilen dilin kendi içeriğinden gelir (TR sayfada İngilizce öneri).
	 * @type {{ lang: string, suggest: { text: string, cta: string, dismiss: string } }}
	 */
	let { lang, suggest } = $props();

	const target = $derived(lang === 'en' ? 'tr' : 'en');
	const href = $derived(langPaths(page.url.pathname, page.data.alternates)[target]);
	let show = $state(false);

	onMount(() => {
		if (chosenLang()) return;
		const prefersTr = (navigator.languages ?? [navigator.language]).some((l) =>
			l?.toLowerCase().startsWith('tr')
		);
		show = lang === 'tr' ? !prefersTr : prefersTr;
	});

	/** Hangi dil seçilirse seçilsin bant bir daha gösterilmez. @param {string} l */
	function choose(l) {
		rememberLang(l);
		show = false;
	}
</script>

{#if show}
	<div
		class="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-surface/90 p-3 pl-4 text-sm shadow-xl backdrop-blur-xl"
		role="region"
		aria-label={suggest.text}
		lang={target}
		transition:fly={{ y: 24, duration: 300 }}
	>
		<p class="flex-1 text-muted">{suggest.text}</p>
		<a
			{href}
			hreflang={target}
			onclick={() => choose(target)}
			class="shrink-0 rounded-full bg-ink px-3.5 py-1.5 font-medium text-bg">{suggest.cta}</a
		>
		<button
			type="button"
			onclick={() => choose(lang)}
			class="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:text-ink"
			aria-label={suggest.dismiss}
		>
			<svg
				viewBox="0 0 24 24"
				class="size-4"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	</div>
{/if}
