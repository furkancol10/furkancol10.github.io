import { error } from '@sveltejs/kit';

/** Türkçe adres /ornekler/, İngilizce adres /en/examples/. */
export function load({ params }) {
	if (params.lang !== 'en') error(404, 'Not found');
	return {
		alternates: [
			{ lang: 'tr', path: '/ornekler/' },
			{ lang: 'en', path: '/en/examples/' }
		]
	};
}
