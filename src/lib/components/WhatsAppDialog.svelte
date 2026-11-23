<script>
	import { onMount } from 'svelte';
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
	/** @type {HTMLElement | null} */
	let lastClick = null;
	/** Token kullanıldıktan sonra widget geri çağrıları yok sayılır. */
	let settled = false;

	/** Turnstile betiği yalnızca düğmeye basılınca yüklenir; takılırsa zaman aşımıyla reddedilir ve yeniden denenebilir. */
	function loadApi() {
		/** @type {any} */
		const w = window;
		if (w.turnstile) return Promise.resolve();
		apiPromise ??= new Promise((resolve, reject) => {
			const s = document.createElement('script');
			let timer = 0;
			/** @param {string} why */
			const bail = (why) => {
				clearTimeout(timer);
				apiPromise = undefined;
				s.remove();
				reject(new Error(why));
			};
			timer = window.setTimeout(() => bail('timeout'), TIMEOUT_MS);
			s.src = API;
			s.async = true;
			s.onload = () => {
				// Engelleyici boş bir yanıt verirse onload tetiklenir ama turnstile tanımsız kalır
				if (w.turnstile) {
					clearTimeout(timer);
					resolve();
				} else bail('stub');
			};
			s.onerror = () => bail('load');
			document.head.append(s);
		});
		return apiPromise;
	}

	/** @param {string} key */
	function fail(key) {
		status = 'error';
		message = u[/** @type {'error' | 'expired'} */ (key)];
	}

	function removeWidget() {
		/** @type {any} */
		const w = window;
		try {
			if (widgetId !== undefined && w.turnstile) w.turnstile.remove(widgetId);
		} catch {}
		widgetId = undefined;
		box?.replaceChildren();
	}

	/** @param {string} token @param {number} my */
	async function redeem(token, my) {
		if (my !== gen || settled) return;
		// Token tek kullanımlık: widget artık yeni geri çağrı ya da otomatik yenileme üretmesin
		settled = true;
		removeWidget();
		status = 'opening';
		message = u.opening;
		// AbortSignal.any her tarayıcıda yok; sinyalleri elle bağlarız
		const req = new AbortController();
		const onAbort = () => req.abort();
		ctrl?.signal.addEventListener('abort', onAbort);
		const timer = setTimeout(onAbort, TIMEOUT_MS);
		try {
			const res = await fetch(site.wa_worker_url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, lang, topic: wa.topic || undefined }),
				signal: req.signal
			});
			const data = await res.json();
			if (my !== gen) return;
			if (!res.ok || typeof data.url !== 'string' || !data.url.startsWith('https://wa.me/'))
				throw new Error('bad');
			waUrl = data.url;
			// 'noopener' özelliği window.open'ı her zaman null döndürür; onsuz açıp opener'ı elle keseriz
			const win = window.open(data.url, '_blank');
			if (win) {
				try {
					win.opener = null;
				} catch {}
			} else message = u.blocked;
		} catch {
			if (my === gen) fail('error');
		} finally {
			clearTimeout(timer);
			ctrl?.signal.removeEventListener('abort', onAbort);
		}
	}

	async function start() {
		const my = ++gen;
		settled = false;
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
			removeWidget();
			status = 'verifying';
			message = u.hint;
			widgetId = w.turnstile.render(box, {
				sitekey: site.turnstile_site_key,
				theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
				language: lang,
				callback: (/** @type {string} */ t) => redeem(t, my),
				'error-callback': () => my === gen && !settled && fail('error'),
				'timeout-callback': () => my === gen && !settled && fail('expired'),
				'expired-callback': () => my === gen && !settled && fail('expired')
			});
		} catch {
			if (my === gen) fail('error');
		}
	}

	/** @param {Element | null} el */
	const visible = (el) => !!el && el.isConnected && el.getClientRects().length > 0;

	function teardown() {
		gen++;
		ctrl?.abort();
		removeWidget();
		waUrl = '';
		wa.open = false;
		// Odak, diyaloğu açan düğmeye döner; o yoksa/gizliyse (kapanan mobil menü) menü düğmesine
		const t = /** @type {HTMLElement | null} */ (
			document.querySelector('[aria-controls="mobil-menu"]')
		);
		if (visible(trigger)) /** @type {HTMLElement} */ (trigger).focus();
		else if (visible(t)) t?.focus();
		trigger = null;
	}

	// Safari düğmeye tıklayınca odağı body'de bırakır; açan öğeyi tıklamadan kendimiz kaydederiz
	onMount(() => {
		/** @param {MouseEvent} e */
		const rec = (e) => {
			const el = /** @type {Element | null} */ (e.target)?.closest?.('button, a');
			lastClick = el instanceof HTMLElement ? el : null;
		};
		document.addEventListener('click', rec, true);
		return () => {
			document.removeEventListener('click', rec, true);
			// Bileşen açıkken sökülürse: uçuştaki işi kes, widget'ı kaldır, ortak durumu sıfırla
			gen++;
			ctrl?.abort();
			removeWidget();
			wa.open = false;
		};
	});

	$effect(() => {
		if (!dlg) return;
		if (wa.open && !dlg.open) {
			trigger =
				lastClick ?? (document.activeElement === document.body ? null : document.activeElement);
			lastClick = null;
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
