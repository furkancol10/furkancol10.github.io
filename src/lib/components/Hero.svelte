<script>
	import { spotlight } from '#lib/actions.js';

	/** @type {{ c: import('#lib/content/index.js').Content }} */
	let { c } = $props();

	// Kayan teknoloji şeridi: Hakkımda'daki araç listesinden (gerçekten kullanılanlar).
	// "OCR (RapidOCR, Tesseract)" gibi gruplar içindeki adlara açılır: "RapidOCR, Tesseract".
	const stack = $derived([
		...new Set(
			c.about.skills
				.flatMap(([, v]) => v.replace(/[^,]*\(([^)]*)\)/g, '$1').split(/,\s*/))
				.map((s) => s.trim())
		)
	]);
</script>

<section
	class="relative isolate overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28"
	aria-labelledby="hero-baslik"
	use:spotlight
>
	<!-- Arka plan: ızgara + spotlight ışıkları + fareyi izleyen hale -->
	<div class="pointer-events-none absolute inset-0 -z-10 grid-bg" aria-hidden="true"></div>
	<div
		class="pointer-events-none absolute top-0 left-[18%] -z-10 h-[46rem] w-[34rem] animate-spotlight rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.38),transparent)] opacity-0 blur-2xl"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[36rem] w-[36rem] animate-drift rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.25),transparent)] blur-2xl"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,-20%),rgb(167_139_250/0.10),transparent_45%)]"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-5 md:px-8">
		<p
			class="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted backdrop-blur"
		>
			<span class="size-2 animate-pulse-dot rounded-full bg-emerald-400" aria-hidden="true"></span>
			{c.hero.badge}
		</p>

		<p class="mt-8 font-mono text-xs tracking-[0.25em] text-muted uppercase">{c.hero.eyebrow}</p>
		<h1
			id="hero-baslik"
			class="mt-5 max-w-4xl text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl md:text-7xl"
		>
			<!-- Güvenilir içerik: kendi JSON'umuz (<br>, gradyan <span>) -->
			{@html c.hero.title}
		</h1>
		<p class="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{@html c.hero.lead}</p>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href="#projeler"
				class="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-deep to-blue px-6 py-3 font-medium text-white shadow-[0_8px_32px_-8px] shadow-violet-deep/70 transition-transform hover:scale-[1.03]"
			>
				{c.hero.cta_primary}
				<span class="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
			</a>
			<a
				href="#iletisim"
				class="inline-flex items-center rounded-full border border-line-strong bg-white/[0.03] px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-white/[0.07]"
			>
				{c.hero.cta_secondary}
			</a>
		</div>
	</div>

	<!-- Teknoloji şeridi -->
	<div class="mt-20 md:mt-28">
		<p
			class="mx-auto max-w-6xl px-5 font-mono text-xs tracking-[0.2em] text-muted/70 uppercase md:px-8"
		>
			{c.hero.stack_label}
		</p>
		<div
			class="mt-5 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
		>
			<ul class="flex shrink-0 animate-marquee gap-3 pr-3 hover:[animation-play-state:paused]">
				{#each [...stack, ...stack] as s, i (i)}
					<li
						class="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm whitespace-nowrap text-muted"
						aria-hidden={i >= stack.length ? 'true' : undefined}
					>
						{s}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
