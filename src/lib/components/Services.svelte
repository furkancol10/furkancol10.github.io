<script>
	import { inview } from '#lib/motion.js';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
</script>

<div class="v2">
	<section class="wrap block" id="hizmetler" aria-labelledby="h-hizmet">
		<div class="split">
			<h2 id="h-hizmet"><span class="mk" use:inview><span>{c.services.title}</span></span></h2>
			<ul class="rows">
				{#each c.services.items as s (s.title)}
					<li>
						<h3>{s.title}</h3>
						<p>{s.text}</p>
						<p class="tech">{s.tags.join(' · ')}</p>
						{#if s.links?.length}
							<p class="links">
								{#each s.links as l (l.href)}
									<a href={l.href}>{l.label} {l.href.startsWith('#') ? '↓' : '→'}</a>
								{/each}
							</p>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</section>
</div>
