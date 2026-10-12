/** Kullanıcı hareketi azaltmayı istiyor mu? */
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Fare/kalem gibi hassas işaretçi ve hover var mı? (dokunmatikte efektler kapalı) */
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/** @type {IntersectionObserver | undefined} */
let observer;

/**
 * Öğe görünür alana girince .is-visible ekler. Öğe işaretlemede zaten `reveal` sınıfını taşır.
 * @param {HTMLElement} node
 * @param {number} [delay] milisaniye
 */
export function reveal(node, delay = 0) {
	if (delay) node.style.setProperty('--d', `${delay}ms`);
	if (reduced() || !('IntersectionObserver' in window)) {
		node.classList.add('is-visible');
		return;
	}
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					e.target.classList.add('is-visible');
					observer?.unobserve(e.target);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	observer.observe(node);
	return { destroy: () => observer?.unobserve(node) };
}

/**
 * Fare konumunu --x / --y CSS değişkenlerine yazar (glow-card ve hero ışığı kullanır).
 * @param {HTMLElement} node
 */
export function spotlight(node) {
	if (!finePointer()) return;
	/** @param {PointerEvent} e */
	const move = (e) => {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--x', `${e.clientX - r.left}px`);
		node.style.setProperty('--y', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return { destroy: () => node.removeEventListener('pointermove', move) };
}

/**
 * Hafif 3B eğim. Dokunmatikte ve azaltılmış harekette kapalı.
 * @param {HTMLElement} node
 * @param {number} [max] derece
 */
export function tilt(node, max = 5) {
	if (!finePointer() || reduced()) return;
	let frame = 0;
	node.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)';
	/** @param {PointerEvent} e */
	const move = (e) => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const r = node.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width - 0.5;
			const py = (e.clientY - r.top) / r.height - 0.5;
			node.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
		});
	};
	const leave = () => {
		cancelAnimationFrame(frame);
		node.style.transform = '';
	};
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			cancelAnimationFrame(frame);
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
}
