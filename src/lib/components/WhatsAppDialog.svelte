<script>
	import { site } from '#lib/content/index.js';
	import { waEnabled, wa } from '#lib/whatsapp.svelte.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const u = $derived(c.contact.whatsapp_ui);

	const API = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
	const TIMEOUT_MS = 10000;

	/** @type {HTMLDialogElement | undefined} */
	let dlg = $state();
	/** @type {HTMLElement | undefined} */
	let box = $state();
	/** @type {'loading' | 'verifying' | 'opening' | 'error'} */
	let status = $state('loading');
	let message = $state('');
	let waUrl = $state('');
	/** @type {string | undefined} */
	let widgetId;
	/** @type {Promise<void> | undefined} */
	let apiPromise;

	/** Turnstile betiği yalnızca düğmeye basılınca yüklenir. */
	function loadApi() {
		/** @type {any} */
		const w = window;
		if (w.turnstile) return Promise.resolve();
		apiPromise ??= new Promise((resolve, reject) => {
			const s = document.createElement('script');
			s.src = API;
			s.async = true;
			s.onload = () => resolve();
			s.onerror = () => {
				apiPromise = undefined;
				reject(new Error('load'));
			};
			document.head.append(s);
		});
		return apiPromise;
	}

	/** @param {string} key */
	function fail(key) {
		status = 'error';
		message = u[/** @type {'error' | 'expired'} */ (key)];
	}

	/** @param {string} token */
	async function redeem(token) {
		status = 'opening';
		message = u.opening;
		try {
			const res = await fetch(site.wa_worker_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, lang, topic: wa.topic || undefined }),
				signal: AbortSignal.timeout(TIMEOUT_MS)
			});
			const data = await res.json();
			if (!res.ok || typeof data.url !== 'string') throw new Error('bad');
			waUrl = data.url;
			window.open(data.url, '_blank', 'noopener');
		} catch {
			fail('error');
		}
	}

	async function start() {
		status = 'loading';
		message = u.loading;
		waUrl = '';
		try {
			await loadApi();
		} catch {
			return fail('error');
		}
		if (!box || !wa.open) return;
		/** @type {any} */
		const w = window;
		if (widgetId !== undefined) w.turnstile.remove(widgetId);
		box.replaceChildren();
		status = 'verifying';
		message = u.hint;
		widgetId = w.turnstile.render(box, {
			sitekey: site.turnstile_site_key,
			theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
			language: lang,
			callback: redeem,
			'error-callback': () => fail('error'),
			'timeout-callback': () => fail('expired'),
			'expired-callback': () => fail('expired')
		});
	}

	function teardown() {
		/** @type {any} */
		const w = window;
		if (widgetId !== undefined && w.turnstile) w.turnstile.remove(widgetId);
		widgetId = undefined;
		waUrl = '';
		wa.open = false;
	}

	$effect(() => {
		if (!dlg) return;
		if (wa.open && !dlg.open) {
			dlg.showModal();
			start();
		} else if (!wa.open && dlg.open) dlg.close();
	});
</script>

{#if waEnabled}
	<!-- Yerel <dialog>: Esc ile kapanır, odak içeride kalır, kapanınca düğmeye döner -->
	<dialog
		bind:this={dlg}
		onclose={teardown}
		aria-labelledby="wa-title"
		class="m-auto w-[min(92vw,380px)] rounded-2xl border border-line bg-bg p-6 text-ink backdrop:bg-black/60"
	>
		<h2 id="wa-title" class="text-xl font-semibold">{u.title}</h2>
		<div bind:this={box} class="mt-4 min-h-[65px]"></div>
		<p class="mt-3 text-sm text-muted" role="status" aria-live="polite">{message}</p>
		<div class="mt-5 flex flex-wrap gap-3">
			{#if status === 'error'}
				<button type="button" class="pill !py-2 text-sm" onclick={start}>{u.retry}</button>
			{/if}
			{#if waUrl}
				<a class="pill !py-2 text-sm" href={waUrl} target="_blank" rel="noopener">WhatsApp</a>
			{/if}
			<button
				type="button"
				class="rounded-full border border-line px-4 py-2 text-sm text-muted hover:text-ink"
				onclick={() => dlg?.close()}>{u.close}</button
			>
		</div>
	</dialog>
{/if}
