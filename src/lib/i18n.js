/**
 * Bir sayfanın TR ve EN adresleri. Yazı sayfasında çevirisi bilinen dillerin adresi kullanılır;
 * çevirisi olmayan dil için o dilin blog listesine gidilir.
 * @param {string} pathname
 * @param {{ lang: string, path: string }[]} [alternates]
 */
export function langPaths(pathname, alternates = []) {
	let path = pathname;
	if (/\/blog\/[^/]+\/?$/.test(path)) path = path.replace(/\/blog\/[^/]+\/?$/, '/blog/');
	const bare = path.replace(/^\/en(?=\/|$)/, '') || '/';
	const known = Object.fromEntries(alternates.map((a) => [a.lang, a.path]));
	return { tr: known.tr ?? bare, en: known.en ?? `/en${bare}` };
}

const KEY = 'lang-pref';

/** Kullanıcının dil seçimi (dil düğmesi ya da öneri bandı). Seçim yapıldıysa öneri bandı bir daha çıkmaz. */
export function rememberLang(/** @type {string} */ lang) {
	try {
		localStorage.setItem(KEY, lang);
	} catch {
		// gizli pencere vb.: yok say
	}
}

export function chosenLang() {
	try {
		return localStorage.getItem(KEY);
	} catch {
		return null;
	}
}
