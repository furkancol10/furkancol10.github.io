<script>
	import { reveal, spotlight, tilt } from '#lib/actions.js';
	import SectionHeading from './SectionHeading.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();

	const items = $derived(c.projects.items.filter((p) => p.publish));
	const L = $derived(c.projects.labels);
	/** @type {('problem' | 'solution' | 'result')[]} */
	const parts = ['problem', 'solution', 'result'];
</script>

<section class="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32" aria-labelledby="projeler">
	<SectionHeading id="projeler" eyebrow={c.projects.eyebrow} title={c.projects.title} />

	<div class="space-y-10 md:space-y-16">
		{#each items as p, i (p.id)}
			<article
				class="reveal glow-card grid gap-8 p-5 md:p-8 lg:grid-cols-2 lg:gap-12"
				use:reveal
				use:spotlight
			>
				<div class={i % 2 ? 'lg:order-last' : ''}>
					<div
						class="overflow-clip rounded-xl border border-line bg-surface shadow-[0_30px_80px_-30px] shadow-violet-deep/50"
						use:tilt
					>
						<img
							src="/assets/img/{p.img}"
							alt={p.alt}
							width="1200"
							height="750"
							loading={i === 0 ? 'eager' : 'lazy'}
							decoding="async"
							class="block h-auto w-full"
						/>
					</div>
				</div>

				<div class="flex flex-col">
					<p class="font-mono text-xs tracking-[0.2em] text-violet uppercase">
						{p.kind} · {p.year}
					</p>
					<h3 class="mt-3 text-3xl font-semibold tracking-tight text-balance">{p.title}</h3>

					<dl class="mt-6 space-y-4 leading-relaxed">
						{#each parts as k (k)}
							<div>
								<dt class="text-sm font-medium text-ink">{L[k]}</dt>
								<dd class="mt-1 text-muted">{@html p[k]}</dd>
							</div>
						{/each}
					</dl>

					<dl class="mt-7 grid grid-cols-3 gap-4 border-y border-line py-5">
						{#each p.stats as [num, label] (label)}
							<div>
								<dt class="sr-only">{label}</dt>
								<dd class="text-gradient text-2xl font-semibold tracking-tight md:text-3xl">
									{num}
								</dd>
								<dd class="mt-1 text-xs leading-snug text-muted">{label}</dd>
							</div>
						{/each}
					</dl>

					<ul class="mt-6 flex flex-wrap gap-2">
						{#each p.tags as t (t)}
							<li class="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-muted">
								{t}
							</li>
						{/each}
					</ul>

					<div class="mt-6">
						{#if p.links.length}
							<div class="flex flex-wrap gap-3">
								{#each p.links as [kind, url] (url)}
									<a
										href={url}
										rel="noopener"
										class="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors hover:bg-ink/[0.06]"
									>
										{L[/** @type {'live' | 'code'} */ (kind)]} <span aria-hidden="true">↗</span>
									</a>
								{/each}
							</div>
						{:else if p.note}
							<p class="text-sm text-muted">{p.note}</p>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>
