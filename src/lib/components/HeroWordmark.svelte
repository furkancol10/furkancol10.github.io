<script>
	import '@fontsource/anton/latin-400.css';
	import '@fontsource/anton/latin-ext-400.css';
	import antonLatin from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';
	import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
	import { site } from '#lib/content/index.js';
	import EmailLink from './EmailLink.svelte';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	const w = $derived(c.v2.wordmark);
	const [first, ...rest] = site.name.split(' ');

	/** Teklif satırı: JSON'daki işaretlemeyi düz metne indirir (yalnızca metin olarak basılır). */
	const offer = $derived(
		c.hero.title
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.replace(/\s+([,.])/g, '$1')
			.trim()
	);
	const lead = $derived(c.hero.lead.split(/(?<=[.!?])\s/)[0].trim());

	let tilted = $state(false);
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={antonLatin} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={geistLatin} crossorigin="anonymous" />
</svelte:head>

<header class="hw ed" class:tilted>
	<p class="hw-meta">
		<span>{w.role}</span><span class="mid">{w.skills}</span><span>{w.region}</span>
	</p>

	<h1 class="hh">
		<span class="stage">
			<span class="plane" aria-hidden="true"></span>
			<span class="word">
				<span class="layer la"><span class="wd">{first}</span> <span class="wd">{rest.join(' ')}</span></span>
				<span class="layer lb" aria-hidden="true"
					><span class="wd">{first}</span> <span class="wd">{rest.join(' ')}</span></span
				>
			</span>
		</span>
		<span class="sr-only">. </span><span class="line">{offer}</span>
	</h1>

	<p class="hw-lead">{lead}</p>
	<div class="acts">
		<button
			type="button"
			class="pillbtn"
			aria-pressed={tilted}
			aria-label="{w.tilt}. {w.tilt_aria}"
			onclick={() => (tilted = !tilted)}
		>
			{w.tilt}<span class="dot" aria-hidden="true"></span>
		</button>
		<span class="mailwrap">{w.hello} <EmailLink showAddress class="hw-mail" /></span>
	</div>
</header>

<style>
	.hw {
		--pad: clamp(16px, 3vw, 40px);
		--tilt: 2.6vw;
		--top: var(--ed-paper);
		--bot: var(--ed-ink);
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 24px;
		padding: 92px var(--pad) clamp(20px, 3vw, 36px);
		background: var(--top);
		color: var(--bot);
		isolation: isolate;
		overflow: hidden;
	}
	.hw.tilted {
		--tilt: -2.6vw;
	}
	.hh {
		display: contents;
		font-weight: 400;
	}
	.hw :global(:focus-visible) {
		outline: 3px solid var(--ed-ink);
		outline-offset: 3px;
	}
	/* Koyu zemin üzerindeki öğeler (alt yarı) için açık halka */
	.hw :global(.pillbtn:focus-visible),
	.hw :global(.hw-mail:focus-visible) {
		outline-color: var(--ed-paper);
	}
	.hw-meta {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin: 0;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	/* Sahne tam genişlik: iki katman ve zemin düzlemi aynı kutuda, kesim çizgisi birebir örtüşür */
	.stage {
		display: block;
		margin-top: auto;
		position: relative;
		margin-inline: calc(-1 * var(--pad));
		padding-block: 0.1em;
	}
	.plane {
		display: block;
		position: absolute;
		inset: calc(50% - 6vw) 0 -200vh;
		z-index: -1;
		background: var(--bot);
		clip-path: polygon(0 calc(6vw + var(--tilt)), 100% calc(6vw - var(--tilt)), 100% 100%, 0 100%);
		transition: clip-path 0.5s var(--ease-ui, ease);
	}
	.word {
		display: block;
		position: relative;
		margin: 0;
		font-family: var(--ed-display);
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		font-size: clamp(60px, 21vw, 380px);
		white-space: nowrap;
		text-align: center;
	}
	.layer {
		display: block;
		padding-inline: var(--pad);
		color: var(--bot);
	}
	.lb {
		position: absolute;
		inset: 0;
		color: var(--top);
		clip-path: polygon(
			0 calc(50% + var(--tilt)),
			100% calc(50% - var(--tilt)),
			100% calc(100% + 0.4em),
			0 calc(100% + 0.4em)
		);
		transition: clip-path 0.5s var(--ease-ui, ease);
	}
	.line {
		display: block;
		margin: auto 0 10px;
		max-width: 1100px;
		color: var(--top);
		font-family: var(--ed-display);
		text-transform: uppercase;
		font-size: clamp(26px, 4.2vw, 60px);
		line-height: 1.02;
	}
	.hw-lead {
		margin: 0 0 22px;
		color: var(--top);
		max-width: 52ch;
		font-size: clamp(15px, 1.3vw, 18px);
		line-height: 1.5;
	}
	.acts {
		color: var(--top);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 28px;
	}
	.pillbtn {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 14px 26px;
		border: 2px solid var(--top);
		border-radius: 999px;
		background: var(--top);
		color: var(--bot);
		font: 600 15px/1 var(--font-sans);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		cursor: pointer;
		transition: transform 0.2s;
	}
	.pillbtn:hover {
		transform: rotate(-2deg) scale(1.04);
	}
	.pillbtn:active {
		transform: scale(0.95);
	}
	.pillbtn[aria-pressed='true'] {
		background: transparent;
		color: var(--top);
	}
	.pillbtn[aria-pressed='true'] .dot {
		transform: translateX(6px) scale(1.25);
		background: var(--top);
	}
	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--ed-accent);
		transition: transform 0.3s var(--ease-ui, ease);
	}
	.mailwrap {
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.mailwrap :global(.hw-mail) {
		color: inherit;
		font-size: 16px;
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 2px;
	}
	@media (max-width: 640px) {
		.hw {
			--tilt: 0vw;
			padding-top: 84px;
		}
		.hw.tilted {
			--tilt: -4vw;
		}
		.mid {
			display: none;
		}
		.word {
			font-size: 31vw;
			line-height: 1.04;
			white-space: normal;
		}
		.wd {
			display: block;
		}
		.wd + .wd {
			margin-top: 0.07em;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.plane,
		.lb,
		.pillbtn,
		.dot {
			transition: none;
		}
		.pillbtn:hover {
			transform: none;
		}
	}
</style>
