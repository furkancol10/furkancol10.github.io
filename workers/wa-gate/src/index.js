// WhatsApp geçidi: Turnstile doğrulaması geçen isteğe wa.me bağlantısını verir.
// Numara yalnızca Worker sırrında (WHATSAPP_NUMBER) durur; sitede, depoda ya da günlükte yoktur.

const ORIGINS = ['https://furkancol.me', 'http://localhost:5173'];
const VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_BODY = 2048;

const MESSAGES = {
	tr: {
		_: 'Merhaba Furkan, web sitenizden yazıyorum. Bir işim için görüşmek istiyorum.',
		ocr: 'Merhaba Furkan, web sitenizden yazıyorum. OCR / otomasyon konusunda bir işim var.',
		web: 'Merhaba Furkan, web sitenizden yazıyorum. Bir web uygulaması / araç yaptırmak istiyorum.',
		wp: 'Merhaba Furkan, web sitenizden yazıyorum. WordPress sitemi taşımak istiyorum.',
		other: 'Merhaba Furkan, web sitenizden yazıyorum. Bir konuda fikir almak istiyorum.'
	},
	en: {
		_: "Hi Furkan, I'm writing from your website. I'd like to talk about a project.",
		ocr: "Hi Furkan, I'm writing from your website. I have an OCR / automation project.",
		web: "Hi Furkan, I'm writing from your website. I'd like a web app / tool built.",
		wp: "Hi Furkan, I'm writing from your website. I'd like to move my WordPress site.",
		other: "Hi Furkan, I'm writing from your website. I'd like to ask about something."
	}
};

/** @param {Request} req */
function cors(req) {
	const origin = req.headers.get('Origin') ?? '';
	/** @type {Record<string, string>} */
	const h = { Vary: 'Origin' };
	if (ORIGINS.includes(origin)) {
		h['Access-Control-Allow-Origin'] = origin;
		h['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
		h['Access-Control-Allow-Headers'] = 'Content-Type';
		h['Access-Control-Max-Age'] = '86400';
	}
	return h;
}

/** @param {unknown} body @param {number} status @param {Record<string, string>} headers */
const json = (body, status, headers) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers }
	});

export default {
	/** @param {Request} req @param {{ TURNSTILE_SECRET?: string, WHATSAPP_NUMBER?: string }} env */
	async fetch(req, env) {
		const headers = cors(req);
		if (req.method === 'OPTIONS') {
			return new Response(null, {
				status: headers['Access-Control-Allow-Origin'] ? 204 : 403,
				headers
			});
		}
		if (req.method !== 'POST')
			return json({ error: 'method' }, 405, { ...headers, Allow: 'POST, OPTIONS' });
		if (!headers['Access-Control-Allow-Origin']) return json({ error: 'forbidden' }, 403, headers);

		const raw = await req.text();
		if (raw.length > MAX_BODY) return json({ error: 'too_large' }, 413, headers);
		/** @type {any} */
		let body;
		try {
			body = JSON.parse(raw);
		} catch {
			return json({ error: 'bad_request' }, 400, headers);
		}
		const token = body?.token;
		if (typeof token !== 'string' || !token || token.length > 2048) {
			return json({ error: 'bad_request' }, 400, headers);
		}
		const lang = body.lang === 'en' ? 'en' : 'tr';
		const topic = typeof body.topic === 'string' && body.topic in MESSAGES[lang] ? body.topic : '_';

		if (!env.TURNSTILE_SECRET || !/^\d{6,15}$/.test(env.WHATSAPP_NUMBER ?? '')) {
			return json({ error: 'server' }, 500, headers);
		}

		const form = new FormData();
		form.set('secret', env.TURNSTILE_SECRET);
		form.set('response', token);
		const ip = req.headers.get('CF-Connecting-IP');
		if (ip) form.set('remoteip', ip);

		let ok = false;
		try {
			const res = await fetch(VERIFY, { method: 'POST', body: form });
			ok = res.ok && (await res.json()).success === true;
		} catch {
			return json({ error: 'verify' }, 502, headers);
		}
		if (!ok) return json({ error: 'forbidden' }, 403, headers);

		const url = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES[lang][topic])}`;
		return json({ url }, 200, headers);
	}
};
