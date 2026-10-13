<script>
	import { prefix } from '#lib/content/index.js';
	import { inview } from '#lib/motion.js';

	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
</script>

<div class="v2">
	<section class="wrap block" id="hakkimda" aria-labelledby="h-hakkimda">
		<div class="split">
			<h2 id="h-hakkimda">
				<span class="mk" use:inview><span>{c.about.intro_title}</span></span>
			</h2>
			<div>
				<p class="teaser">{c.about.paragraphs[0].split(/(?<=\.)\s/)[0]}</p>
				<a class="more" href="{prefix(lang)}/{lang === 'en' ? 'about' : 'ben-kimim'}/">
					{c.v2.about_more}
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
				</a>
			</div>
		</div>
	</section>
</div>
