import { site } from '#lib/content/index.js';

/** WhatsApp düğmesi yalnızca Turnstile site anahtarı ve Worker adresi doldurulunca görünür. Numara sitede yoktur; Worker verir. */
export const waEnabled = Boolean(site.turnstile_site_key && site.wa_worker_url);

/** Ortak durum: diyalog açık mı, iletişim formunda seçili konu (Worker'a yalnızca kimliği gider). */
export const wa = $state({ open: false, topic: '' });

export function openWhatsApp() {
	wa.open = true;
}
