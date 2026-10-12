<script>
	import { reveal, spotlight } from '#lib/actions.js';
	import { site } from '#lib/content/index.js';
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

	const field =
		'mt-2 w-full rounded-xl border border-line bg-ink/[0.03] px-4 py-3 text-ink placeholder:text-muted/60 focus:border-violet/60 focus:outline-none';
</script>

<section class="relative isolate overflow-clip py-24 md:py-32" aria-labelledby="iletisim">
	<div
		class="pointer-events-none absolute bottom-[-30%] left-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--hero-a),transparent)] blur-2xl"
		aria-hidden="true"
	></div>

	<div
		class="mx-auto grid gap-12 px-5 md:px-8 {site.formspree_id
			? 'max-w-6xl lg:grid-cols-2 lg:gap-16'
			: 'max-w-3xl'}"
	>
		<div class="reveal" use:reveal>
			<p class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{c.contact.eyebrow}</p>
			<h2 id="iletisim" class="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
				{c.contact.title}
			</h2>
			<p class="mt-5 text-lg leading-relaxed text-muted">{@html c.contact.text}</p>

			<p class="mt-10 font-mono text-xs tracking-[0.2em] text-muted uppercase">
				{c.contact.channels_title}
			</p>
			<ul class="mt-4 space-y-3">
				<li>
					<EmailLink
						showAddress
						class="group flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:border-line-strong hover:bg-ink/[0.03]"
					>
						<span class="text-sm text-muted">{c.contact.email}</span>
					</EmailLink>
				</li>
				<li>
					<a
						href={site.bionluk}
						rel="noopener"
						class="flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:border-line-strong hover:bg-ink/[0.03]"
					>
						<span class="text-sm text-muted">Bionluk</span>
						<span>{c.contact.bionluk} <span aria-hidden="true">↗</span></span>
					</a>
				</li>
				<li>
					<a
						href={site.github}
						rel="me noopener"
						class="flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:border-line-strong hover:bg-ink/[0.03]"
					>
						<span class="text-sm text-muted">{c.contact.github}</span>
						<span>@furkancol10 <span aria-hidden="true">↗</span></span>
					</a>
				</li>
			</ul>
		</div>

		<!-- Form, Formspree kimliği girilince görünür; o zamana kadar kanallar tek sütunda kalır -->
		{#if site.formspree_id}
			<div class="reveal glow-card p-7 md:p-9" use:reveal={120} use:spotlight>
				<form action="https://formspree.io/f/{site.formspree_id}" method="POST" onsubmit={submit}>
					<label class="block text-sm">
						{f.name}
						<input name="name" required autocomplete="name" class={field} />
					</label>
					<label class="mt-5 block text-sm">
						{f.email}
						<input name="email" type="email" required autocomplete="email" class={field} />
					</label>
					<label class="mt-5 block text-sm">
						{f.message}
						<textarea name="message" required rows="5" class="{field} resize-y"></textarea>
					</label>
					<!-- Spam tuzağı: insanlar görmez, botlar doldurur -->
					<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="hidden" />
					<button
						type="submit"
						disabled={status === 'sending'}
						class="mt-7 w-full rounded-full bg-gradient-to-r from-violet-deep to-blue px-6 py-3.5 font-medium text-white transition-opacity disabled:opacity-60"
					>
						{status === 'sending' ? f.sending : f.send}
					</button>
					<p class="mt-4 min-h-6 text-sm" role="status">
						{#if status === 'ok'}<span class="text-emerald-700 dark:text-emerald-400"
								>{f.success}</span
							>
						{:else if status === 'error'}<span class="text-rose-700 dark:text-rose-400"
								>{f.error}</span
							>{/if}
					</p>
				</form>
			</div>
		{/if}
	</div>
</section>
