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
	globalThis.fetch = async () => new Response(JSON.stringify({ success }));
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
