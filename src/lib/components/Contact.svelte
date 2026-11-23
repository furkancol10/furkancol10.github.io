<script>
	import { site } from '#lib/content/index.js';
	import { inview } from '#lib/motion.js';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { waEnabled, openWhatsApp, wa } from '#lib/whatsapp.svelte.js';
	import Signature from './Signature.svelte';
	import EmailLink from './EmailLink.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	const f = $derived(c.contact.form);

	// Konu çipi: Fiyat ve örnek sayfalarındaki bağlantılar /?topic=ocr#iletisim ile önceden seçtirir
	let topic = $state('');
	const pick = (/** @type {string | null} */ t) => {
		if (t && c.contact.topics.some((x) => x.id === t)) topic = t;
	};
	$effect(() => pick(page.url.searchParams.get('topic')));
	// Aynı bağlantıya yeniden tıklamak adresi değiştirmez; tıklamayı yakalayıp çipi yeniden seçeriz
	onMount(() => {
		/** @param {MouseEvent} e */
		const onClick = (e) => {
			const a = /** @type {Element | null} */ (e.target)?.closest?.('a[href*="topic="]');
			if (a) pick(new URL(/** @type {HTMLAnchorElement} */ (a).href).searchParams.get('topic'));
		};
		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	});
	$effect(() => {
		wa.topic = topic;
	});
	// Bu bileşen sayfadan çıkınca seçili konu başka sayfalardaki WhatsApp mesajına sızmasın
	onMount(() => () => {
		wa.topic = '';
	});
	let mounted = $state(false);
	onMount(() => (mounted = true));

	/** @type {'idle' | 'sending' | 'ok' | 'error'} */
	let status = $state('idle');

	/** JS varsa sayfa değiştirmeden gönderir; JS yoksa form normal POST ile Formspree'ye gider. */
	/** @param {SubmitEvent} e */
	async function submit(e) {
		e.preventDefault();
		const form = /** @type {HTMLFormElement} */ (e.currentTarget);
		status = 'sending';
		try {
			const res = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: { Accept: 'application/json' }
			});
			status = res.ok ? 'ok' : 'error';
			if (res.ok) {
				form.reset();
				topic = '';
			}
		} catch {
			status = 'error';
		}
	}

	/** İmza: görünür olunca bir kez yazılır (hareket azaltmada zaten tamam). @param {HTMLElement} node */
	function sign(node) {
		if (
			matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!('IntersectionObserver' in window)
		) {
			node.classList.add('on');
			return;
		}
		const io = new IntersectionObserver(
			(en) => {
				if (en.some((x) => x.isIntersecting)) {
					node.classList.add('on');
					io.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<!-- Kapanış: iki temada da koyu, aurora'lı -->
<div class="v2">
	<section class="anchor" id="iletisim" aria-labelledby="h-iletisim">
		<div class="aurora" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i></div>
		<div class="wrap">
			<div class="split">
				<div>
					<h2 id="h-iletisim"><span class="mk" use:inview><span>{c.contact.title}</span></span></h2>
					<p class="ask">{c.contact.text}</p>
				</div>
				<ul class="reach">
					<li><EmailLink showAddress class="big-mail" /></li>
					{#if waEnabled && mounted}
						<li><button type="button" onclick={openWhatsApp}>{c.contact.whatsapp} ↗</button></li>
					{/if}
					<li><a href={site.bionluk} rel="noopener">{c.contact.bionluk} ↗</a></li>
					<li><a href={site.github} rel="me noopener">{c.contact.github} ↗</a></li>
				</ul>
			</div>

			<!-- Form, Formspree kimliği girilince görünür -->
			{#if site.formspree_id}
				<form
					class="mailform"
					action="https://formspree.io/f/{site.formspree_id}"
					method="POST"
					onsubmit={submit}
				>
					<label>
						<span>{f.name}</span>
						<input name="name" required autocomplete="name" />
					</label>
					<label>
						<span>{f.email}</span>
						<input name="email" type="email" required autocomplete="email" />
					</label>
					<fieldset class="wide topics">
						<legend>{c.contact.topic_label}</legend>
						{#each c.contact.topics as t (t.id)}
							<label class="chip">
								<input type="radio" name="topic" value={t.id} bind:group={topic} />
								<span>{t.label}</span>
							</label>
						{/each}
					</fieldset>
					<label class="wide">
						<span>{f.message}</span>
						<textarea name="message" required rows="4"></textarea>
					</label>
					<!-- Spam tuzağı: insanlar görmez, botlar doldurur -->
					<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="hidden" />
					<div class="wide send">
						<button type="submit" class="pill" disabled={status === 'sending'}>
							{status === 'sending' ? f.sending : f.send}
						</button>
						<p role="status">
							{#if status === 'ok'}<span class="okmsg">{f.success}</span
								>{:else if status === 'error'}<span class="errmsg">{f.error}</span>{/if}
						</p>
					</div>
				</form>
			{/if}

			<div class="signoff">
				<div class="sigwrap" use:sign><Signature class="sig" /></div>
				<p class="fine">© {new Date().getFullYear()} {site.name}. {c.footer}</p>
			</div>
		</div>
	</section>
</div>
