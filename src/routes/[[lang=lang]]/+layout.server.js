import { getContent } from '#lib/content/index.js';

/** İçerik sunucuda (derleme anında) yüklenir; tarayıcıya yalnızca o dilin verisi gider. */
export function load({ params }) {
	const lang = params.lang ?? 'tr';
	// Dil öneri bandı, önerilen dilin kendi metniyle gösterilir (TR sayfada İngilizce öneri).
	const suggest = getContent(lang === 'en' ? 'tr' : 'en').suggest;
	return { lang, c: getContent(lang), suggest, year: new Date().getFullYear() };
}
