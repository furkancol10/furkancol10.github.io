import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Runes her yerde açık; mdsvex eski sözdizimi ürettiği için .md dosyaları ve kütüphaneler hariç.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md')
						? undefined
						: true
			},
			adapter: adapter({ strict: true, fallback: '404.html' }),
			preprocess: [mdsvex({ extensions: ['.md'] })],
			extensions: ['.svelte', '.md'],
			prerender: {
				// XML uçları sayfalardan <a> ile bağlanmadığı için açıkça listelenir.
				entries: ['*', '/en/', '/blog/', '/en/blog/', '/rss.xml', '/en/rss.xml', '/sitemap.xml'],
				// Yalnızca taslak yazı varken blog/[slug] hiç taranmaz; bu beklenen durum.
				handleUnseenRoutes: 'warn'
			}
		})
	]
});
