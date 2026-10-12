import { dev } from '$app/env';

/**
 * @typedef {{ title: string, date: string, description: string, draft?: boolean, image?: string }} PostMeta
 * @typedef {PostMeta & { slug: string, lang: string, minutes: number }} Post
 */

// Yalnızca frontmatter ve ham metin okunur; yazı bileşenleri sadece yazı sayfasında yüklenir.
const metas = /** @type {Record<string, PostMeta>} */ (
	import.meta.glob('/src/posts/*/*.md', { eager: true, import: 'metadata' })
);
const raws = /** @type {Record<string, string>} */ (
	import.meta.glob('/src/posts/*/*.md', { eager: true, query: '?raw', import: 'default' })
);

/** @returns {Post[]} Taslaklar yalnızca geliştirme sunucusunda görünür. */
export function allPosts() {
	return Object.entries(metas)
		.map(([path, meta]) => {
			const [, lang, slug] = /** @type {RegExpMatchArray} */ (
				path.match(/\/posts\/(\w+)\/(.+)\.md$/)
			);
			const words = raws[path]
				.replace(/^---[\s\S]*?---/, '')
				.split(/\s+/)
				.filter(Boolean).length;
			return { ...meta, slug, lang, minutes: Math.max(1, Math.round(words / 200)) };
		})
		.filter((p) => dev || !p.draft)
		.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Bir dilin listesi: önce o dildeki yazılar, sonra yalnızca diğer dilde olanlar (EN listede "Türkçe" notuyla).
 * @param {string} lang
 */
export function postsFor(lang) {
	const posts = allPosts();
	const own = posts.filter((p) => p.lang === lang);
	const ownSlugs = new Set(own.map((p) => p.slug));
	const others = posts.filter((p) => p.lang !== lang && !ownSlugs.has(p.slug));
	return { own, others };
}

/** Yazının adresi. @param {Post} p */
export function postHref(p) {
	return `${p.lang === 'en' ? '/en' : ''}/blog/${p.slug}/`;
}
