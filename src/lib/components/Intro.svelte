<script>
	import { onMount } from 'svelte';
	import Signature from './Signature.svelte';

	/**
	 * Oturumdaki ilk açılışta: ortada büyük "Furkan Çöl" harf harf yazılır (CSS, bkz. app.css),
	 * sonra küçülüp menüdeki imzanın yerine kayar ve sayfa ortaya çıkar.
	 * Oynayıp oynamayacağına app.html karar verir (html.intro); burada yalnızca hareket yönetilir.
	 */

	/** @type {HTMLDivElement} */
	let overlay;
	/** @type {HTMLDivElement} */
	let holder;

	const MOVE_MS = 850;
	const HOLD_MS = 180; // yazı bittikten sonra kısa bir duraklama
	const SAFETY_MS = 4500; // animasyon bilgisi alınamazsa en geç bu anda kay

	onMount(() => {
		const root = document.documentElement;
		if (!root.classList.contains('intro')) return;
		try {
			sessionStorage.setItem('intro', '1'); // yarıda yenilenirse tekrar oynamasın
		} catch {
			// gizli pencere: her açılışta oynayabilir, sorun değil
		}

		let done = false;
		const timers = /** @type {number[]} */ ([]);

		const finish = () => {
			if (done) return;
			done = true;
			timers.forEach(clearTimeout);
			root.classList.remove('intro');
			removeEventListener('keydown', finish);
		};

		let flying = false;
		const fly = () => {
			if (flying || done) return;
			flying = true;
			const target = document.querySelector('[data-signature-target]');
			const svg = holder.querySelector('svg');
			if (!target || !svg) return finish();
			const from = svg.getBoundingClientRect();
			const to = target.getBoundingClientRect();
			const s = to.width / from.width;
			svg.style.transformOrigin = '0 0';
			svg.style.transition = `transform ${MOVE_MS}ms cubic-bezier(0.7, 0, 0.2, 1)`;
			svg.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${s})`;
			overlay.classList.add('intro-leaving');
			timers.push(window.setTimeout(finish, MOVE_MS + 60));
		};

		// Çizim CSS ile sayfa açılır açılmaz başlar; JS ise ağdan sonra gelir. Sabit süre beklemek yerine
		// harflerin animasyonlarının bitmesi beklenir (JS geç yüklenirse çizim çoktan bitmiş olabilir).
		const anims = holder.querySelector('svg')?.getAnimations?.({ subtree: true }) ?? [];
		Promise.all(anims.map((a) => a.finished))
			.catch(() => {})
			.then(() => timers.push(window.setTimeout(fly, HOLD_MS)));
		timers.push(window.setTimeout(fly, SAFETY_MS));
		addEventListener('keydown', finish);
		return () => {
			timers.forEach(clearTimeout);
			removeEventListener('keydown', finish);
		};
	});
</script>

<!-- Yalnızca html.intro varken görünür (app.css). Tıklayınca ya da bir tuşa basınca atlanır. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	class="intro-overlay fixed inset-0 z-[100] place-items-center"
	bind:this={overlay}
	onclick={() => document.documentElement.classList.remove('intro')}
	role="presentation"
>
	<div class="intro-bg absolute inset-0 bg-bg"></div>
	<div class="relative px-6" bind:this={holder}>
		<Signature draw gradient class="h-auto w-[min(82vw,620px)]" />
	</div>
</div>
