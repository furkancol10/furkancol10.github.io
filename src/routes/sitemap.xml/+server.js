import { allPosts, postHref } from '#lib/blog.js';
import { getContent, site } from '#lib/content/index.js';

export const prerender = true;
export const trailingSlash = 'never';

const examples = getContent('tr').examples.items.flatMap((i) => [
	`/ornekler/${i.id}/`,
	`/en/examples/${i.id}/`
]);

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const pages = [
		'/',
		'/en/',
		'/ben-kimim/',
		'/en/about/',
		'/wordpress/',
		'/en/wordpress/',
		'/blog/',
		'/en/blog/',
		'/ornekler/',
		'/en/examples/',
		...examples
	].map((p) => ({
		loc: p,
		lastmod: today
	}));
	const posts = allPosts().map((p) => ({ loc: postHref(p), lastmod: p.date }));

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages, ...posts].map((u) => `  <url><loc>${site.url}${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
