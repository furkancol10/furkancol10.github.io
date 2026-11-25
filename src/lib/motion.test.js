// @ts-nocheck — node:test; svelte-check @types/node içermiyor
import test from 'node:test';
import assert from 'node:assert/strict';
import { countValue } from './motion.js';

test('t < t0 (k<0) iken değer 0 olmalı, negatif olmamalı', () => {
	for (const dt of [-1, -50, -1260, -5000]) {
		const { k, v } = countValue(277, 1000 + dt, 1000);
		assert.equal(k, 0);
		assert.equal(v, 0);
	}
});

test('ilerleme: ortada 0..hedef arası, sonda tam hedef', () => {
	const mid = countValue(277, 800, 0).v;
	assert.ok(mid > 0 && mid < 277);
	const end = countValue(277, 5000, 0);
	assert.equal(end.k, 1);
	assert.equal(end.v, 277);
});
