<script>
	import { reveal } from '#lib/actions.js';

	/** @type {{ eyebrow: string, title: string, id?: string, lead?: string }} */
	let { eyebrow, title, id, lead } = $props();
</script>

<div class="reveal mb-12 max-w-3xl md:mb-16" use:reveal>
	<p class="font-mono text-xs tracking-[0.25em] text-violet uppercase">{eyebrow}</p>
	<h2
		{id}
		class="mt-4 font-serif text-5xl leading-[1.02] font-normal tracking-tight text-balance md:text-7xl"
	>
		{title}
	</h2>
	{#if lead}
		<p class="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
	{/if}
</div>
