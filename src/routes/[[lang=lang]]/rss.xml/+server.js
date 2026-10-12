import { postsFor, postHref } from '#lib/blog.js';
import { getContent, site } from '#lib/content/index.js';

export const prerender = true;
export const trailingSlash = 'never';

/** @param {string} s */
const x = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET({ params }) {
	const lang = params.lang ?? 'tr';
	const c = getContent(lang);
	const { own } = postsFor(lang);
	const home = `${site.url}${lang === 'en' ? '/en' : ''}/blog/`;

	const items = own
		.map(
			(p) => `<item>
<title>${x(p.title)}</title>
<link>${site.url}${postHref(p)}</link>
<guid>${site.url}${postHref(p)}</guid>
<pubDate>${new Date(p.date).toUTCString()}</pubDate>
<description>${x(p.description)}</description>
</item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${x(site.name)} · ${x(c.blog.title)}</title>
<link>${home}</link>
<description>${x(c.blog.lead)}</description>
<language>${lang}</language>
${items}
</channel>
</rss>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
