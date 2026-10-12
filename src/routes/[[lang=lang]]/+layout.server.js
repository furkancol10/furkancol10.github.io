import { getContent } from '#lib/content/index.js';

/** İçerik sunucuda (derleme anında) yüklenir; tarayıcıya yalnızca o dilin verisi gider. */
export function load({ params }) {
	const lang = params.lang ?? 'tr';
	return { lang, c: getContent(lang), year: new Date().getFullYear() };
}
