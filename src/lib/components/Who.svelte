<script>
	import { prefix } from '#lib/content/index.js';
	import { inview, pointerGlow, scrub, track, count } from '#lib/motion.js';
	import { mark } from '#lib/signature.js';

	/** "Ben kimim" sayfasının gövdesi (TR: /ben-kimim/, EN: /en/about/). */
	/** @type {{ c: import('#lib/content/index.js').Content, lang: string }} */
	let { c, lang } = $props();
	const w = $derived(c.v2.who);
	const exp = $derived(c.experience.items.filter((e) => e.publish));
	const published = $derived(c.projects.items.filter((p) => p.publish).length);
	// "Kısaca": iki paragraf tek akışta, kelime kelime okunur
	const statement = $derived(c.about.paragraphs.join(' '));
	const words = $derived(statement.split(/\s+/));
</script>

<div class="v2">
	<section class="who wrap" aria-labelledby="baslik" use:pointerGlow>
		<div class="aurora" aria-hidden="true">
			<i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>
		</div>
		<div>
			<h1 id="baslik">
				<span class="l" style="--t:.1s"><span>{w.title1}</span></span><span
					class="l"
					style="--t:.28s"><span class="grad"><em>{w.title2}</em></span></span
				>
			</h1>
			<p class="sub" style="--t:.8s">{w.sub}</p>
		</div>
		<div class="monogram" aria-hidden="true">
			<svg viewBox="0 0 {mark.size} {mark.size}">
				<g stroke-linejoin="round" stroke-width={mark.stroke} transform={mark.transform}>
					{#each mark.glyphs as d, i (i)}<path {d} />{/each}
				</g>
			</svg>
		</div>
	</section>

	<section class="wrap block" aria-labelledby="h-kisaca">
		<div class="split">
			<h2 id="h-kisaca"><span class="mk" use:inview><span>{w.short}</span></span></h2>
			<p class="statement long scrub" use:scrub aria-label={statement}>
				{#each words as word, i (i)}{i ? ' ' : ''}<span class="w" aria-hidden="true">{word}</span
					>{/each}
			</p>
		</div>
	</section>

	<section class="wrap block" aria-label="Rakamlarla">
		<div class="nums">
			<p class="n big"><b use:count={{ to: 277, lang }}>277</b><span>{w.nums_label_ocr}</span></p>
			<p class="n"><b use:count={{ to: 49, lang }}>49</b><span>{w.nums_label_tests}</span></p>
			<p class="n">
				<b use:count={{ to: published, lang }}>{published}</b><span>{w.nums_label_projects}</span>
			</p>
		</div>
	</section>

	<section class="wrap block" aria-labelledby="h-yol">
		<div class="split">
			<h2 id="h-yol"><span class="mk" use:inview><span>{c.experience.eyebrow}</span></span></h2>
			<ol class="timeline" use:track>
				{#each exp as e (e.period + e.title)}
					<li>
						<p class="when">{e.period}</p>
						<h3>{e.title}</h3>
						<p class="org">{e.org}</p>
						<p class="t">{e.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="wrap block" aria-labelledby="h-ilke">
		<div class="split">
			<h2 id="h-ilke"><span class="mk" use:inview><span>{c.process.title}</span></span></h2>
			<ul class="beliefs">
				{#each w.beliefs as [title, text] (title)}
					<li>
						<h3>{title}</h3>
						<p>{text}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="wrap block" aria-labelledby="h-arac">
		<div class="split">
			<h2 id="h-arac"><span class="mk" use:inview><span>{c.about.skills_title}</span></span></h2>
			<div class="toolbox">
				{#each c.about.skills as [k, v] (k)}<p><b>{k}</b><span>{v}</span></p>{/each}
			</div>
		</div>
	</section>

	<section class="wrap block" aria-labelledby="h-simdi">
		<div class="split">
			<h2 id="h-simdi"><span class="mk" use:inview><span>{c.about.now_title}</span></span></h2>
			<div>
				<p class="now"><span class="grad">{c.about.now_text}</span></p>
				<a class="more" href="{prefix(lang)}/#projeler">
					{w.see_projects}
					<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
				</a>
			</div>
		</div>
	</section>
</div>
