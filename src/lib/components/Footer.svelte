<script>
	import { site } from '#lib/content/index.js';

	/** @type {{ c: import('#lib/content/index.js').Content, year: number }} */
	let { c, year } = $props();
</script>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-[1320px] px-[clamp(20px,4vw,56px)] flex-col gap-4 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between"
	>
		<p>© {year} {site.name}. {c.footer}</p>
		<div class="flex gap-5">
			<a href={site.github} class="hover:text-ink" rel="me noopener">GitHub</a>
			<a href={site.bionluk} class="hover:text-ink" rel="noopener">Bionluk</a>
			<a href="#icerik" class="hover:text-ink">↑</a>
		</div>
	</div>
</footer>
