# wa-gate (WhatsApp geçidi)

Telefon numarası sitede, depoda ya da JS paketinde bulunmaz. Ziyaretçi Turnstile doğrulamasını geçince bu Worker `wa.me` bağlantısını verir.

1. Cloudflare panelinde furkancol.me için bir Turnstile widget'ı oluşturun (site key + secret).
2. `cd workers/wa-gate`
3. `wrangler secret put TURNSTILE_SECRET` ve `wrangler secret put WHATSAPP_NUMBER` (ülke koduyla, yalnızca rakam, örn. biçim: ülke kodu + numara).
4. `wrangler deploy`; çıkan Worker adresini not edin.
5. `src/lib/content/site.json` içinde `turnstile_site_key` (site key) ve `wa_worker_url` (Worker adresi) alanlarını doldurun, siteyi yeniden derleyin. İkisi de doluyken WhatsApp düğmesi görünür.

Yerel geliştirme: `DEV_ORIGINS` (isteğe bağlı, virgülle ayrılmış köken listesi, örn. `http://localhost:5173`) yalnızca yerel Worker için verilir; üretimde boş bırakılır, localhost kökenleri kapalıdır. Worker ayrıca Turnstile'ın döndürdüğü `hostname` ile isteğin Origin ana makinesini karşılaştırır.

Test: `node --test workers/wa-gate/test/*.test.js`. Mesaj metinleri `src/index.js` içindeki `MESSAGES` tablosundadır.
