import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const NUM = '7'.repeat(11);
const env = { TURNSTILE_SECRET: 'secret', WHATSAPP_NUMBER: NUM };
const req = (method, body, origin = 'https://furkancol.me') =>
	new Request('https://wa.example/', {
		method,
		headers: { Origin: origin, 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body)
	});
const mockVerify = (success) => {
	globalThis.fetch = async () => new Response(JSON.stringify({ success, hostname: 'furkancol.me' }));
};

test('geçerli token -> wa.me bağlantısı, konuya göre metin', async () => {
	mockVerify(true);
	const res = await worker.fetch(req('POST', { token: 't', lang: 'en', topic: 'ocr' }), env);
	assert.equal(res.status, 200);
	assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://furkancol.me');
	const { url } = await res.json();
	assert.ok(url.startsWith(`https://wa.me/${NUM}?text=`));
	assert.match(decodeURIComponent(url), /OCR/);
});

test('geçersiz token -> 403, numara sızmaz', async () => {
	mockVerify(false);
	const res = await worker.fetch(req('POST', { token: 'x' }), env);
	assert.equal(res.status, 403);
	assert.ok(!(await res.text()).includes(NUM));
});

test('yanlış origin -> CORS izni yok ve 403', async () => {
	mockVerify(true);
	const res = await worker.fetch(req('POST', { token: 't' }, 'https://evil.example'), env);
	assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
	assert.equal(res.status, 403);
});

test('GET -> 405', async () => {
	const res = await worker.fetch(req('GET'), env);
	assert.equal(res.status, 405);
});

test('çok büyük gövde -> 413', async () => {
	mockVerify(true);
	const res = await worker.fetch(req('POST', { token: 'a'.repeat(5000) }), env);
	assert.equal(res.status, 413);
});

test('geçerli 2048 karakterlik (CF azami) token kabul edilir (gövde sınırı ~4 KB)', async () => {
	mockVerify(true);
	const res = await worker.fetch(
		req('POST', { token: 'a'.repeat(2048), lang: 'tr', topic: 'ocr' }),
		env
	);
	assert.equal(res.status, 200);
});

test('2048 karakterden uzun token -> 400', async () => {
	mockVerify(true);
	const res = await worker.fetch(req('POST', { token: 'a'.repeat(2049) }), env);
	assert.equal(res.status, 400);
});

for (const topic of ['toString', '__proto__', 'constructor', 'hasOwnProperty']) {
	test(`konu "${topic}" -> varsayılan mesaj`, async () => {
		mockVerify(true);
		const res = await worker.fetch(req('POST', { token: 't', lang: 'tr', topic }), env);
		assert.equal(res.status, 200);
		const { url } = await res.json();
		const text = decodeURIComponent(url.split('?text=')[1]);
		assert.match(text, /görüşmek istiyorum/);
	});
}

test('Content-Length sınırı aşarsa gövde okunmadan 413', async () => {
	mockVerify(true);
	let pulled = false;
	const body = new ReadableStream({
		pull(c) {
			if (pulled) return c.close();
			pulled = true;
			c.enqueue(new TextEncoder().encode('x'));
		}
	});
	const r = new Request('https://wa.example/', {
		method: 'POST',
		headers: { Origin: 'https://furkancol.me', 'Content-Length': '150000000' },
		body,
		duplex: 'half'
	});
	const res = await worker.fetch(r, env);
	assert.equal(res.status, 413);
	assert.equal(pulled, false);
});

test('Content-Length olmayan akış sınırda kesilir', async () => {
	mockVerify(true);
	let chunks = 0;
	const body = new ReadableStream({
		pull(c) {
			chunks++;
			if (chunks > 1000) return c.close();
			c.enqueue(new Uint8Array(1024));
		}
	});
	const r = new Request('https://wa.example/', {
		method: 'POST',
		headers: { Origin: 'https://furkancol.me' },
		body,
		duplex: 'half'
	});
	const res = await worker.fetch(r, env);
	assert.equal(res.status, 413);
	assert.ok(chunks < 50, `akış erken kesilmedi (${chunks} parça okundu)`);
});

test('localhost kökeni üretimde kapalı, DEV_ORIGINS ile açılır', async () => {
	mockVerify(true);
	const dev = 'http://localhost:5173';
	let res = await worker.fetch(req('POST', { token: 't' }, dev), env);
	assert.equal(res.status, 403);
	assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
	res = await worker.fetch(req('POST', { token: 't' }, dev), { ...env, DEV_ORIGINS: dev });
	assert.equal(res.status, 200);
	assert.equal(res.headers.get('Access-Control-Allow-Origin'), dev);
});

test('siteverify hostname istek köken hostname ile uyuşmazsa 403', async () => {
	globalThis.fetch = async () =>
		new Response(JSON.stringify({ success: true, hostname: 'baska.example' }));
	let res = await worker.fetch(req('POST', { token: 't' }), env);
	assert.equal(res.status, 403);
	globalThis.fetch = async () =>
		new Response(JSON.stringify({ success: true, hostname: 'furkancol.me' }));
	res = await worker.fetch(req('POST', { token: 't' }), env);
	assert.equal(res.status, 200);
});

test('siteverify çağrısına zaman aşımı sinyali verilir', async () => {
	/** @type {any} */
	let init;
	globalThis.fetch = async (_u, i) => {
		init = i;
		return new Response(JSON.stringify({ success: true }));
	};
	await worker.fetch(req('POST', { token: 't' }), env);
	assert.ok(init?.signal instanceof AbortSignal);
});

test('siteverify hostname yoksa üretimde 403 (fail-open değil), DEV_ORIGINS ile geçer', async () => {
	globalThis.fetch = async () => new Response(JSON.stringify({ success: true }));
	let res = await worker.fetch(req('POST', { token: 't' }), env);
	assert.equal(res.status, 403);
	const dev = 'http://localhost:5173';
	res = await worker.fetch(req('POST', { token: 't' }, dev), { ...env, DEV_ORIGINS: dev });
	assert.equal(res.status, 200);
});

test('gövde akışı hata verirse 413 ile biter, özel durum sızmaz', async () => {
	mockVerify(true);
	const body = new ReadableStream({
		pull() {
			throw new Error('boom');
		}
	});
	const r = new Request('https://wa.example/', {
		method: 'POST',
		headers: { Origin: 'https://furkancol.me' },
		body,
		duplex: 'half'
	});
	const res = await worker.fetch(r, env);
	assert.equal(res.status, 413);
});
