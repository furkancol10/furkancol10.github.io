import { error } from '@sveltejs/kit';

/** Türkçe adres yalnızca TR için; İngilizce karşılığı /en/about/. */
export function load({ params }) {
	if (params.lang === 'en') error(404, 'Not found');
	// Dil düğmesi karşı dilin adresini buradan alır (adresler farklı: /ben-kimim/ ve /en/about/)
	return {
		alternates: [
			{ lang: 'tr', path: '/ben-kimim/' },
			{ lang: 'en', path: '/en/about/' }
		]
	};
}
