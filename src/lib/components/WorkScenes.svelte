<script>
	import '@fontsource/anton/latin-400.css';
	import '@fontsource/anton/latin-ext-400.css';
	import { onMount } from 'svelte';
	import { prefix } from '#lib/content/index.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();

	/**
	 * @typedef {{
	 *   id: string, short: string, title: string, summary: string, kind: string, year: string,
	 *   status: 'ready' | 'soon', bg: string, fg: string,
	 *   src: string, w: number, h: number, alt: string, phone: boolean, ratio: number,
	 *   href: string | null, extra: [string, string][],
	 *   case: null | { problem: string, solution: string, result: string, stats: string[][], tags: string[], links: string[][], note: string }
	 * }} Scene
	 */

	const L = $derived(c.projects.labels);
	const X = $derived(c.examples.labels);
	const firstSentence = (/** @type {string} */ s) => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s;
	/** @type {('problem' | 'solution' | 'result')[]} */
	const parts = ['problem', 'solution', 'result'];
	const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
	const isExt = (/** @type {string} */ u) => /^https?:/.test(u);

	/** @type {Scene[]} */
	const scenes = $derived.by(() => {
		const exDir = `${prefix(lang)}/${lang === 'en' ? 'examples' : 'ornekler'}/`;
		/** @type {Scene[]} */
		const out = [];
		for (const e of c.examples.items) {
			const s = e.shots[0];
			/** @type {[string, string][]} */
			const extra = [];
			if (e.demo_url) extra.push([L.live, e.demo_url]);
			if (e.code_url) extra.push([L.code, e.code_url]);
			out.push({
				id: e.id,
				short: e.short,
				title: e.title,
				summary: e.summary,
				kind: e.kind,
				year: e.year,
				status: /** @type {'ready' | 'soon'} */ (e.status),
				bg: e.scene.bg,
				fg: e.scene.fg,
				src: `/assets/examples/${s.src}`,
				w: s.w,
				h: s.h,
				alt: s.alt,
				phone: s.w <= 600 && s.h / s.w > 1.5,
				ratio: Math.max(s.w / s.h, 1.15),
				href: `${exDir}${e.id}/`,
				extra,
				case: null
			});
		}
		for (const p of c.projects.items) {
			if (!p.publish) continue;
			out.push({
				id: p.id,
				short: p.short,
				title: p.title,
				summary: firstSentence(p.problem),
				kind: p.kind,
				year: p.year,
				status: 'ready',
				bg: p.scene.bg,
				fg: p.scene.fg,
				src: `/assets/img/${p.img}`,
				w: 1200,
				h: 750,
				alt: p.alt,
				phone: false,
				ratio: 1200 / 750,
				href: null,
				extra: [],
				case: {
					problem: p.problem,
					solution: p.solution,
					result: p.result,
					stats: p.stats,
					tags: p.tags,
					links: p.links,
					note: p.note ?? ''
				}
			});
		}
		return out;
	});

	let active = $state(0);
	let railOn = $state(false);
	/** @type {HTMLElement | undefined} */
	let root = $state();

	onMount(() => {
		const mq = matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
		const html = document.documentElement;
		const prevSnap = html.style.scrollSnapType;
		// Gentle snap, desktop only, proximity so it never traps the scroll.
		const syncSnap = () => (html.style.scrollSnapType = mq.matches ? 'y proximity' : prevSnap);
		syncSnap();
		mq.addEventListener('change', syncSnap);

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) active = Number(/** @type {HTMLElement} */ (e.target).dataset.i);
				}
			},
			{ threshold: 0.55 }
		);
		root?.querySelectorAll('.scene').forEach((el) => io.observe(el));
		const io2 = new IntersectionObserver(([e]) => (railOn = e.isIntersecting), { threshold: 0.05 });
		if (root) io2.observe(root);

		return () => {
			mq.removeEventListener('change', syncSnap);
			html.style.scrollSnapType = prevSnap;
			io.disconnect();
			io2.disconnect();
		};
	});
</script>

<section class="ws ed" id="projeler" aria-labelledby="h-work" bind:this={root}>
	<h2 id="h-work" class="sr-only">{L.block}</h2>

	{#each scenes as s, i (s.id)}
		<section
			class="scene"
			class:flip={i % 2 === 1}
			id={s.id}
			data-i={i}
			style="--bg:{s.bg};--fg:{s.fg}"
			aria-labelledby="t-{s.id}"
		>
			<div class="inner">
				<div class="text">
					<p class="wmeta">
						<span class="idx">{pad(i + 1)} / {pad(scenes.length)}</span>
						<span class="wchip" class:wsoon={s.status !== 'ready'}
							>{s.status === 'ready' ? X.ready : X.coming}</span
						>
						<span class="wkind">{s.kind} · {s.year}</span>
					</p>
					<h3 id="t-{s.id}">
						<span aria-hidden={s.short !== s.title ? 'true' : undefined}>{s.short}</span>{#if s.short !== s.title}<span
								class="sr-only">{s.title}</span
							>{/if}
					</h3>
					<p class="wsum">{s.summary}</p>

					{#if s.href}
						<p class="acts">
							<a class="cta" href={s.href}>{L.open} <span aria-hidden="true">→</span></a>
							{#each s.extra as [label, url] (url)}
								<a class="wsub" href={url} target="_blank" rel="noopener">{label} ↗</a>
							{/each}
						</p>
					{/if}

					{#if s.case}
						<details class="case">
							<summary class="cta"
								><span>{L.case}</span><span class="pm" aria-hidden="true"></span></summary
							>
							<div class="wpanel">
								{#each parts as k (k)}
									<p><b>{L[k]}.</b> {s.case[k]}</p>
								{/each}
								{#if s.case.stats.length}
									<p class="figs">
										{#each s.case.stats as [n, l], j (l)}{j ? ' · ' : ''}<b>{n}</b> {l}{/each}
									</p>
								{/if}
								<p class="tagl">{s.case.tags.join(' / ')}</p>
								{#if s.case.links.length}
									<p class="outl">
										{#each s.case.links as [kind, url] (url)}
											<a href={url} target={isExt(url) ? '_blank' : undefined} rel={isExt(url) ? 'noopener' : undefined}
												>{L[/** @type {'live' | 'code'} */ (kind)]} {isExt(url) ? '↗' : '↓'}</a
											>
										{/each}
									</p>
								{:else if s.case.note}
									<p class="aside">{s.case.note}</p>
								{/if}
							</div>
						</details>
					{/if}
				</div>

				<div class="dev {s.phone ? 'wphone' : 'wbrowser'}">
					<div class="frame" style="--ar:{s.phone ? s.w / s.h : s.ratio}">
						{#if !s.phone}
							<div class="wbar" aria-hidden="true"><i></i><i></i><i></i></div>
						{/if}
						<img
							src={s.src}
							alt={s.alt}
							width={s.w}
							height={s.h}
							loading={i === 0 ? 'eager' : 'lazy'}
							decoding="async"
						/>
					</div>
				</div>
			</div>
		</section>
	{/each}

	<div class="rail" class:won={railOn} aria-hidden="true" style="--fg:{scenes[active]?.fg}">
		{#each scenes as s, i (s.id)}<span class:cur={i === active}></span>{/each}
	</div>
</section>

<style>
	.ws {
		--nav-h: 64px;
		position: relative;
		font-family: var(--font-sans);
	}
	.scene {
		/* html has scroll-padding-top: 6rem for anchors; cancel it so the scene top
		   sits exactly at the viewport top (the fixed nav overlays the scene padding). */
		scroll-margin-top: -6rem;
		scroll-snap-align: start;
		min-height: 85svh;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--bg);
		color: var(--fg);
		padding: calc(var(--nav-h) + clamp(24px, 4vw, 48px)) 0 clamp(40px, 6vw, 72px);
	}
	#projeler {
		scroll-margin-top: -6rem;
	}
	.scene :global(:focus-visible) {
		outline: 3px solid currentColor;
		outline-offset: 4px;
		border-radius: 4px;
	}
	.inner {
		width: 100%;
		max-width: 1320px;
		margin: 0 auto;
		padding: 0 clamp(20px, 4vw, 56px);
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 6vw, 40px);
		align-items: center;
	}
	/* mobile: image on top, text below */
	.dev {
		order: -1;
		display: flex;
		justify-content: center;
	}
	.wmeta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 14px;
		margin: 0 0 clamp(12px, 2vw, 20px);
		font: 600 12px/1 var(--font-sans);
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.wchip {
		border: 2px solid currentColor;
		border-radius: 999px;
		padding: 6px 12px;
	}
	.wchip.wsoon {
		border-style: dashed;
	}
	h3 {
		margin: 0;
		font: 400 clamp(52px, 17vw, 96px) / 0.92 var(--ed-display);
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}
	.wsum {
		margin: clamp(14px, 2vw, 24px) 0 0;
		max-width: 44ch;
		font-size: clamp(17px, 1.5vw, 21px);
		line-height: 1.45;
		font-weight: 500;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		margin: clamp(20px, 3vw, 32px) 0 0;
	}
	.cta,
	.wsub {
		font: 700 13px/1 var(--font-sans);
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-decoration: none;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 0 22px;
		border: 2px solid currentColor;
		border-radius: 999px;
		cursor: pointer;
		list-style: none;
		transition: background-color 0.2s, color 0.2s;
	}
	.cta:hover {
		background: var(--fg);
		color: var(--bg);
	}
	.wsub {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.case {
		margin-top: clamp(20px, 3vw, 32px);
	}
	.pm {
		position: relative;
		width: 12px;
		height: 12px;
	}
	.pm::before,
	.pm::after {
		content: '';
		position: absolute;
		background: currentColor;
		inset: 5px 0;
	}
	.pm::after {
		inset: 0 5px;
		transition: transform 0.2s;
	}
	.case[open] .pm::after {
		transform: scaleY(0);
	}
	.wpanel {
		margin-top: 20px;
		padding-top: 18px;
		border-top: 2px solid currentColor;
		max-width: 56ch;
		font-size: 16px;
		line-height: 1.55;
	}
	.wpanel p {
		margin: 0 0 12px;
	}
	.wpanel .tagl,
	.wpanel .outl {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.wpanel a {
		font-weight: 700;
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 5px;
		margin-right: 18px;
	}

	/* device frames */
	.frame {
		position: relative;
		background: #0b0b0d;
		box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.45);
		overflow: hidden;
	}
	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
	.wbrowser .frame {
		width: min(100%, 640px);
		border-radius: 12px;
		border: 2px solid #0b0b0d;
	}
	.wbrowser .frame img {
		aspect-ratio: var(--ar);
		height: auto;
		background: #fff;
	}
	.wbar {
		display: flex;
		gap: 6px;
		padding: 9px 12px;
		background: #1c1c20;
	}
	.wbar i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #5b5b63;
	}
	.wphone .frame {
		height: min(56svh, 460px);
		aspect-ratio: var(--ar);
		border: 8px solid #0b0b0d;
		border-radius: 30px;
	}
	.rail {
		display: none;
	}

	@media (min-width: 1024px) {
		.scene {
			min-height: 100svh;
		}
		.inner {
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
			gap: clamp(40px, 5vw, 80px);
		}
		.dev {
			order: 0;
		}
		.flip .dev {
			order: -1;
		}
		h3 {
			font-size: clamp(88px, 11vw, 190px);
		}
		.wbrowser .frame {
			width: min(100%, 720px);
		}
		.wphone .frame {
			height: min(68svh, 640px);
		}
		.rail {
			position: fixed;
			z-index: 10;
			right: clamp(10px, 1.6vw, 24px);
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			flex-direction: column;
			gap: 12px;
			color: var(--fg);
			opacity: 0;
			transition: opacity 0.3s, color 0.3s;
			pointer-events: none;
		}
		.rail.won {
			opacity: 1;
		}
		.rail span {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			border: 2px solid currentColor;
			box-sizing: border-box;
			transition: transform 0.3s, background-color 0.3s;
		}
		.rail span.cur {
			background: currentColor;
			transform: scale(1.5);
		}
	}
	@media (prefers-reduced-motion: no-preference) {
		.frame {
			transform: rotate(2deg);
			transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
		}
		.flip .frame {
			transform: rotate(-2deg);
		}
		.scene:hover .frame {
			transform: rotate(0.5deg);
		}
		@media (min-width: 1024px) {
			.frame {
				transform: rotate(3deg);
			}
			.flip .frame {
				transform: rotate(-3deg);
			}
		}
	}
</style>
