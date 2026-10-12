import site from './site.json';
import tr from './tr.json';
import en from './en.json';

/** @typedef {typeof tr} Content */

/** @type {Record<string, Content>} */
const all = { tr, en };

// TR ve EN aynı projeleri aynı sırayla yayınlamalı; yoksa derleme durur (eski build.mjs kontrolü).
/** @param {Content} c */
const ids = (c) => c.projects.items.map((p) => `${p.id}:${p.publish}`).join(',');
if (ids(tr) !== ids(en)) {
	throw new Error(`TR ve EN projeleri uyuşmuyor:\n  tr: ${ids(tr)}\n  en: ${ids(en)}`);
}

export { site };

/** @param {string} lang */
export function getContent(lang) {
	return all[lang] ?? tr;
}

/** URL öneki: TR kökte, EN /en altında. @param {string} lang */
export function prefix(lang) {
	return lang === 'en' ? '/en' : '';
}
