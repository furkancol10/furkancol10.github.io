<script>
	import { site } from '#lib/content/index.js';

	/** @type {{ c: import('#lib/content/index.js').Content, year: number }} */
	let { c, year } = $props();
</script>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8"
	>
		<p>© {year} {site.name}. {c.footer}</p>
		<div class="flex gap-5">
			<a href={site.github} class="hover:text-ink" rel="me noopener">GitHub</a>
			<a href={site.bionluk} class="hover:text-ink" rel="noopener">Bionluk</a>
			<a href="#icerik" class="hover:text-ink">↑</a>
		</div>
	</div>
</footer>
