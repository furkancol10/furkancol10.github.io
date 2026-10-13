/**
 * v2 tasarımının hareket davranışları (Svelte eylemleri). Hepsi hareket azaltma tercihine uyar:
 * azaltılmışsa öğeler bitmiş halde kalır (CSS de aynı kuralı izler). JS yoksa CSS zaten her şeyi gösterir (.js sınıfı yok).
 */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (/** @type {number} */ n, /** @type {number} */ a, /** @type {number} */ b) =>
	Math.min(b, Math.max(a, n));

/** Kaydırma olayını kare başına bir kez çalıştırır. @param {() => void} fn */
function onScrollFrame(fn) {
	let queued = false;
	const run = () => {
		if (queued) return;
		queued = true;
		requestAnimationFrame(() => {
			queued = false;
			fn();
		});
	};
	addEventListener('scroll', run, { passive: true });
	addEventListener('resize', run);
	fn();
	return () => {
		removeEventListener('scroll', run);
		removeEventListener('resize', run);
	};
}

/**
 * Görünür olunca `.in` ekler (başlık maskesi, görsel kırpması, satır açılışı).
 * Kırpılmış (clip-path) öğe kendi başına "görünmez" sayıldığı için gözlemci kırpılmayan kapsayıcıya bağlanır.
 * @param {HTMLElement} node
 * @param {{ watch?: 'self' | 'parent' }} [opts]
 */
export function inview(node, { watch = 'self' } = {}) {
	if (reduced() || !('IntersectionObserver' in window)) {
		node.classList.add('in');
		return;
	}
	const target = watch === 'parent' && node.parentElement ? node.parentElement : node;
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				node.classList.add('in');
				io.disconnect();
			}
		},
		{ threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(target);
	return { destroy: () => io.disconnect() };
}

/**
 * Sayaç: görünür olunca 0'dan hedef değere sayar. Metin işaretlemede zaten son değerdir (JS yoksa o görünür).
 * @param {HTMLElement} node
 * @param {{ to: number, dec?: number, pre?: string, suf?: string, lang?: string }} o
 */
export function count(node, o) {
	const fmt = (/** @type {number} */ v) =>
		(o.pre ?? '') +
		v.toLocaleString(o.lang === 'en' ? 'en-US' : 'tr-TR', {
			minimumFractionDigits: o.dec ?? 0,
			maximumFractionDigits: o.dec ?? 0
		}) +
		(o.suf ?? '');
	if (reduced() || !('IntersectionObserver' in window)) return;
	const io = new IntersectionObserver(
		(entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			io.disconnect();
			const t0 = performance.now();
			const step = (/** @type {number} */ t) => {
				const k = Math.min(1, (t - t0) / 1600);
				node.textContent = fmt(o.to * (1 - Math.pow(1 - k, 4)));
				if (k < 1) requestAnimationFrame(step);
			};
			node.textContent = fmt(0);
			requestAnimationFrame(step);
		},
		{ threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}

/**
 * Kelime kelime okunan cümle: kaydırma ilerlemesi kadar kelime `.on` olur. Kelimeler `.w` ile işaretlemede durur.
 * @param {HTMLElement} node
 */
export function scrub(node) {
	const words = /** @type {HTMLElement[]} */ ([...node.querySelectorAll('.w')]);
	if (reduced()) {
		words.forEach((w) => w.classList.add('on'));
		return;
	}
	return {
		destroy: onScrollFrame(() => {
			const r = node.getBoundingClientRect();
			const vh = innerHeight;
			const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3), 0, 1);
			const n = Math.round(p * words.length);
			words.forEach((w, i) => w.classList.toggle('on', i < n));
		})
	};
}

/**
 * İlerleme çizgisi (süreç, zaman çizelgesi): --p değişkeni ve geçilen maddelere `.on`.
 * @param {HTMLElement} node
 */
export function track(node) {
	const items = /** @type {HTMLElement[]} */ ([...node.querySelectorAll(':scope > li')]);
	if (reduced()) {
		node.style.setProperty('--p', '1');
		items.forEach((li) => li.classList.add('on'));
		return;
	}
	return {
		destroy: onScrollFrame(() => {
			const vh = innerHeight;
			const r = node.getBoundingClientRect();
			node.style.setProperty('--p', clamp((vh * 0.7 - r.top) / r.height, 0, 1).toFixed(3));
			items.forEach((li) => li.classList.toggle('on', li.getBoundingClientRect().top < vh * 0.7));
		})
	};
}

/**
 * Hero ve "Ben kimim" üstünde imleci izleyen ışık (yalnızca ince işaretçide, hareket azaltılmamışsa).
 * @param {HTMLElement} node
 */
export function pointerGlow(node) {
	if (!finePointer() || reduced()) return;
	const glow = document.createElement('div');
	glow.className = 'pointer-glow';
	node.append(glow);
	/** @param {PointerEvent} e */
	const move = (e) => {
		const r = node.getBoundingClientRect();
		glow.style.setProperty('--mx', `${e.clientX - r.left}px`);
		glow.style.setProperty('--my', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			glow.remove();
		}
	};
}
