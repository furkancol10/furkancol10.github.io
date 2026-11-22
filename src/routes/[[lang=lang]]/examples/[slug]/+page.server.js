import { error } from '@sveltejs/kit';
import { getContent } from '#lib/content/index.js';

/** Dil düğmesi için iki dilin adresi aynı yapıdadır; bilinmeyen örnek 404. */
export function load({ params }) {
	if (params.lang !== 'en') error(404, 'Not found');
	const item = getContent(params.lang ?? 'tr').examples.items.find((i) => i.id === params.slug);
	if (!item) error(404, 'Not found');
	return {
		slug: params.slug,
		alternates: [
			{ lang: 'tr', path: `/ornekler/${params.slug}/` },
			{ lang: 'en', path: `/en/examples/${params.slug}/` }
		]
	};
}
