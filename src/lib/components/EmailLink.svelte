<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { site } from '#lib/content/index.js';

	/**
	 * Adres HTML'de düz metin olarak durmaz (botlara karşı); mailto bağlantısı tarayıcıda kurulur.
	 * @type {{ label?: string, showAddress?: boolean, class?: string, children?: import('svelte').Snippet }}
	 */
	let { label, showAddress = false, class: klass = '', children } = $props();

	// JS yüklenmeden önce: ana sayfadaki iletişim bölümü (her sayfada geçerli bir hedef)
	let href = $state(`${page.url.pathname.startsWith('/en') ? '/en' : ''}/#iletisim`);
	let address = $state(`${site.email_user} [at] ${site.email_domain}`);

	onMount(() => {
		const a = `${site.email_user}@${site.email_domain}`;
		href = `mailto:${a}`;
		address = a;
	});
</script>

<a {href} class={klass}>
	{@render children?.()}
	{#if showAddress}{address}{:else}{label}{/if}
</a>
