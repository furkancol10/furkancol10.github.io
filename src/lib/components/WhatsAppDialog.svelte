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

	/** Her açılış/kapanışta artar: eski start()/redeem() çağrıları sonucu yok sayar. */
	let gen = 0;
	/** @type {AbortController | undefined} */
	let ctrl;
	/** @type {Element | null} */
	let trigger = null;

	/** Turnstile betiği yalnızca düğmeye basılınca yüklenir. */
	function loadApi() {
		/** @type {any} */
		const w = window;
		if (w.turnstile) return Promise.resolve();
		apiPromise ??= new Promise((resolve, reject) => {
			const s = document.createElement('script');
			s.src = API;
			s.async = true;
			s.onload = () => {
				// Engelleyici boş bir yanıt verirse onload tetiklenir ama turnstile tanımsız kalır
				if (w.turnstile) resolve();
				else {
					apiPromise = undefined;
					s.remove();
					reject(new Error('stub'));
				}
			};
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

	/** @param {string} token @param {number} my */
	async function redeem(token, my) {
		if (my !== gen) return;
		status = 'opening';
		message = u.opening;
		try {
			const res = await fetch(site.wa_worker_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, lang, topic: wa.topic || undefined }),
				signal: AbortSignal.any([AbortSignal.timeout(TIMEOUT_MS), ...(ctrl ? [ctrl.signal] : [])])
			});
			const data = await res.json();
			if (my !== gen) return;
			if (!res.ok || typeof data.url !== 'string' || !data.url.startsWith('https://wa.me/'))
				throw new Error('bad');
			waUrl = data.url;
			if (!window.open(data.url, '_blank', 'noopener')) message = u.blocked;
		} catch {
			if (my === gen) fail('error');
		}
	}

	async function start() {
		const my = ++gen;
		ctrl?.abort();
		ctrl = new AbortController();
		status = 'loading';
		message = u.loading;
		waUrl = '';
		try {
			await loadApi();
			if (my !== gen || !box || !wa.open) return;
			/** @type {any} */
			const w = window;
			if (widgetId !== undefined) w.turnstile.remove(widgetId);
			widgetId = undefined;
			box.replaceChildren();
			status = 'verifying';
			message = u.hint;
			widgetId = w.turnstile.render(box, {
				sitekey: site.turnstile_site_key,
				theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
				language: lang,
				callback: (/** @type {string} */ t) => redeem(t, my),
				'error-callback': () => my === gen && fail('error'),
				'timeout-callback': () => my === gen && fail('expired'),
				'expired-callback': () => my === gen && fail('expired')
			});
		} catch {
			if (my === gen) fail('error');
		}
	}

	function teardown() {
		/** @type {any} */
		const w = window;
		gen++;
		ctrl?.abort();
		try {
			if (widgetId !== undefined && w.turnstile) w.turnstile.remove(widgetId);
		} catch {}
		widgetId = undefined;
		waUrl = '';
		wa.open = false;
		// Tetikleyici kapanan mobil menüdeyse (odak body'ye düşer) menü düğmesine geri ver
		if (!trigger || trigger === document.body || !trigger.isConnected) {
			const t = /** @type {HTMLElement | null} */ (
				document.querySelector('[aria-controls="mobil-menu"]')
			);
			if (t && t.offsetParent) t.focus();
		}
		trigger = null;
	}

	$effect(() => {
		if (!dlg) return;
		if (wa.open && !dlg.open) {
			trigger = document.activeElement;
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
