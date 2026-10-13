<script>
	import { inview, track } from '#lib/motion.js';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();
</script>

<div class="v2">
	<section class="wrap block" id="surec" aria-labelledby="h-surec">
		<div class="split">
			<h2 id="h-surec"><span class="mk" use:inview><span>{c.process.title}</span></span></h2>
			<ol class="steps" use:track>
				{#each c.process.steps as s, i (s.title)}
					<li>
						<span class="n">{i + 1}</span>
						<h3>{s.title}</h3>
						<p>{s.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>
</div>
