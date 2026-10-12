/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
	const lang = event.url.pathname === '/en' || event.url.pathname.startsWith('/en/') ? 'en' : 'tr';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
}
