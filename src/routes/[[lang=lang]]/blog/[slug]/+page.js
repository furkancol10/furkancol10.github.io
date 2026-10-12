import { error } from '@sveltejs/kit';
import { dev } from '$app/env';

// Yazı bileşenleri yalnızca bu sayfada, tembel yüklenir.
const posts = import.meta.glob('/src/posts/*/*.md');

export async function load({ params, parent }) {
	const { lang } = await parent();
	const loader = posts[`/src/posts/${lang}/${params.slug}.md`];
	if (!loader) error(404, 'Not found');

	const mod =
		/** @type {{ default: import('svelte').Component, metadata: import('#lib/blog.js').PostMeta }} */ (
			await loader()
		);
	if (mod.metadata.draft && !dev) error(404, 'Not found');

	return { component: mod.default, meta: mod.metadata, slug: params.slug };
}
