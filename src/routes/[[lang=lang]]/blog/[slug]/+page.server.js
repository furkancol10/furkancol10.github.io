import { allPosts, postHref } from '#lib/blog.js';

/** Aynı adresli yazının hangi dillerde yayında olduğu (hreflang ve dil seçici için). */
export function load({ params }) {
	const alternates = allPosts()
		.filter((p) => p.slug === params.slug)
		.map((p) => ({ lang: p.lang, path: postHref(p) }));
	return { alternates };
}
