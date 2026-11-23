// WhatsApp geçidi: Turnstile doğrulaması geçen isteğe wa.me bağlantısını verir.
// Numara yalnızca Worker sırrında (WHATSAPP_NUMBER) durur; sitede, depoda ya da günlükte yoktur.

const ORIGINS = ['https://furkancol.me'];
const VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_BODY = 4096;
const VERIFY_TIMEOUT_MS = 5000;

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

/** Geliştirme kökenleri yalnızca DEV_ORIGINS (virgüllü) ile açılır; üretimde boştur. @param {string | undefined} dev */
const origins = (dev) => [
	...ORIGINS,
	...(dev ?? '')
		.split(',')
		.map((x) => x.trim())
		.filter(Boolean)
];

/** Gövdeyi en çok MAX_BODY bayt okur; aşarsa akışı keser ve null döner. @param {Request} req */
async function readBody(req) {
	const len = Number(req.headers.get('Content-Length'));
	if (Number.isFinite(len) && len > MAX_BODY) {
		await req.body?.cancel().catch(() => {});
		return null;
	}
	if (!req.body) return '';
	const reader = req.body.getReader();
	const parts = [];
	let size = 0;
	for (;;) {
		let chunk;
		try {
			chunk = await reader.read();
		} catch {
			return null;
		}
		const { done, value } = chunk;
		if (done) break;
		size += value.byteLength;
		if (size > MAX_BODY) {
			await reader.cancel().catch(() => {});
			return null;
		}
		parts.push(value);
	}
	const all = new Uint8Array(size);
	let off = 0;
	for (const p of parts) {
		all.set(p, off);
		off += p.byteLength;
	}
	return new TextDecoder().decode(all);
}

/** @param {Request} req @param {string | undefined} dev */
function cors(req, dev) {
	const origin = req.headers.get('Origin') ?? '';
	/** @type {Record<string, string>} */
	const h = { Vary: 'Origin' };
	if (origins(dev).includes(origin)) {
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
	/** @param {Request} req @param {{ TURNSTILE_SECRET?: string, WHATSAPP_NUMBER?: string, DEV_ORIGINS?: string }} env */
	async fetch(req, env) {
		const headers = cors(req, env.DEV_ORIGINS);
		if (req.method === 'OPTIONS') {
			return new Response(null, {
				status: headers['Access-Control-Allow-Origin'] ? 204 : 403,
				headers
			});
		}
		if (req.method !== 'POST')
			return json({ error: 'method' }, 405, { ...headers, Allow: 'POST, OPTIONS' });
		if (!headers['Access-Control-Allow-Origin']) return json({ error: 'forbidden' }, 403, headers);

		const raw = await readBody(req);
		if (raw === null) return json({ error: 'too_large' }, 413, headers);
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
		const topic =
			typeof body.topic === 'string' && Object.hasOwn(MESSAGES[lang], body.topic)
				? body.topic
				: '_';

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
			const res = await fetch(VERIFY, {
				method: 'POST',
				body: form,
				signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS)
			});
			const out = res.ok ? await res.json() : null;
			// Token başka bir ana makinede üretildiyse (aynı widget birden çok alan adına izinliyse) reddedilir
			const host = new URL(req.headers.get('Origin') ?? '').hostname;
			// hostname yoksa üretimde reddedilir; yalnızca yerel geliştirmede (DEV_ORIGINS) denetim atlanır
			ok = out?.success === true && (env.DEV_ORIGINS ? true : out.hostname === host);
		} catch {
			return json({ error: 'verify' }, 502, headers);
		}
		if (!ok) return json({ error: 'forbidden' }, 403, headers);

		const url = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGES[lang][topic])}`;
		return json({ url }, 200, headers);
	}
};
