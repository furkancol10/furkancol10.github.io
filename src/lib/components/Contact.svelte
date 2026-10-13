<script>
	import { site } from '#lib/content/index.js';
	import { inview } from '#lib/motion.js';
	import Signature from './Signature.svelte';
	import EmailLink from './EmailLink.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	const f = $derived(c.contact.form);

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
			if (res.ok) form.reset();
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
