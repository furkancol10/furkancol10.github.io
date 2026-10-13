import { error } from '@sveltejs/kit';

/** İngilizce adres yalnızca /en/about/; Türkçe karşılığı /ben-kimim/. */
export function load({ params }) {
	if (params.lang !== 'en') error(404, 'Not found');
	// Dil düğmesi karşı dilin adresini buradan alır (adresler farklı: /ben-kimim/ ve /en/about/)
	return {
		alternates: [
			{ lang: 'tr', path: '/ben-kimim/' },
			{ lang: 'en', path: '/en/about/' }
		]
	};
}
