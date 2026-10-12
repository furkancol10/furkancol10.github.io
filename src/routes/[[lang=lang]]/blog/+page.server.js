import { postsFor } from '#lib/blog.js';

export function load({ params }) {
	return postsFor(params.lang ?? 'tr');
}
