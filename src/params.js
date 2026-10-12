import { defineParams } from '@sveltejs/kit/params';

export const params = defineParams({
	// TR kök dizinde (/), yalnızca İngilizce için /en/ öneki var.
	lang: (param) => (param === 'en' ? param : undefined)
});
