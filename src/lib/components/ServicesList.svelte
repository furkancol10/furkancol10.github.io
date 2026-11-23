<script>
	import '@fontsource/anton/latin-400.css';
	import '@fontsource/anton/latin-ext-400.css';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
	/** @param {number} n */
	const pad = (n) => String(n).padStart(2, '0');
</script>

<section class="svc ed" id="hizmetler" aria-labelledby="h-hizmet">
	<h2 id="h-hizmet" class="kick">{c.services.title}</h2>
	<ol>
		{#each c.services.items as s, i (s.title)}
			<li>
				<span class="svc-num" aria-hidden="true">{pad(i + 1)}</span>
				<div class="body">
					<h3>{s.title}</h3>
					<p>{s.text}</p>
					<p class="svc-tags">{s.tags.join(' / ')}</p>
					{#if s.links?.length}
						<p class="svc-links">
							{#each s.links as l (l.href)}
								<a href={l.href}>{l.label} {l.href.startsWith('#') ? '↓' : '→'}</a>
							{/each}
						</p>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.svc {
		padding: clamp(56px, 9vw, 130px) clamp(16px, 3vw, 40px);
		background: var(--ed-paper);
		color: var(--ed-ink);
	}
	.svc :global(:focus-visible) {
		outline: 3px solid var(--ed-accent);
		outline-offset: 3px;
	}
	.kick {
		margin: 0 0 clamp(24px, 4vw, 56px);
		padding-bottom: 14px;
		border-bottom: 2px solid currentColor;
		font: 600 13px/1 var(--font-sans);
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		display: grid;
		grid-template-columns: clamp(80px, 18vw, 260px) minmax(0, 1fr);
		gap: clamp(12px, 3vw, 40px);
		padding: clamp(20px, 3vw, 40px) 0;
		border-bottom: 1px solid currentColor;
	}
	.svc-num {
		font: 400 clamp(64px, 15vw, 220px) / 0.85 var(--ed-display);
	}
	h3 {
		margin: 0 0 12px;
		font: 400 clamp(28px, 4.4vw, 64px) / 1 var(--ed-display);
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}
	.body p {
		margin: 0 0 12px;
		max-width: 62ch;
		font-size: clamp(15px, 1.2vw, 17px);
		line-height: 1.55;
	}
	.body .svc-tags {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.svc-links a {
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 5px;
		text-decoration-thickness: 2px;
	}
	@media (max-width: 640px) {
		li {
			grid-template-columns: 1fr;
		}
		.svc-num {
			font-size: 72px;
		}
	}
</style>
