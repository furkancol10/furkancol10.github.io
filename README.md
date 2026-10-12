# furkancol.me

Kişisel portfolyo ve blog (TR + EN). SvelteKit (Svelte 5) + Tailwind CSS v4, tamamen statik üretilir
ve GitHub Actions ile GitHub Pages'e yayınlanır.

## Geliştirme

Node 24 gerekir (`.nvmrc`).

```sh
npm install
npm run dev       # http://localhost:5173 — taslak yazılar da görünür
npm run check     # tip ve Svelte kontrolü
npm run build     # build/ klasörüne statik site
npm run preview   # derlenmiş siteye bak (taslaklar gizli)
```

`main` dalına push edilince `.github/workflows/deploy.yml` siteyi derleyip yayınlar. Pages ayarında
kaynak **GitHub Actions** olmalı.

## İçerik

| Yol | İçerik |
|---|---|
| `src/lib/content/tr.json`, `en.json` | Tüm metinler: hero, hizmetler, projeler, hakkımda, deneyim, süreç, yorumlar, iletişim, blog etiketleri |
| `src/lib/content/site.json` | Ortak bilgiler: ad, adres, e-posta, Bionluk, GitHub, `formspree_id` |
| `src/posts/tr/*.md`, `src/posts/en/*.md` | Blog yazıları (Markdown) |
| `static/assets/img/` | Proje görselleri (1200×750 WebP) ve paylaşım görseli `og.png` |

- TR ve EN dosyaları aynı yapıda olmalı. Proje kimlikleri ve yayın durumu farklıysa derleme hata verir.
- Bazı alanlar HTML içerebilir (`<br>`, `<b>`): `hero.title`, `hero.lead`, hizmet ve proje metinleri,
  `about.paragraphs`, `contact.text`. Bunlar yalnızca bu dosyalardan gelir, dışarıdan veri girmez.
- **Deneyim:** `experience.items` içinde `publish: false` olan kayıt görünmez (ör. bilgisi eksik staj).
- **Yorumlar:** `testimonials.items` boşsa bölüm hiç görünmez. Yalnızca gerçek müşteri yorumu ekle:
  `{ "quote": "...", "name": "...", "role": "..." }`.
- **İletişim formu:** `site.json`'da `formspree_id` boşsa form yerine e-posta ve kanal bağlantıları görünür.
  Formspree'de form açınca verilen kimliği (`https://formspree.io/f/<kimlik>`) buraya yaz.

## Blog yazısı ekleme

`src/posts/<dil>/<adres>.md` dosyası oluştur:

```md
---
title: 'Başlık'
date: '2026-10-12'
description: 'Liste ve arama sonuçlarında görünen kısa özet.'
draft: true
image: '/assets/img/kapak.webp'
---

Metin...
```

`draft: true` iken yazı yalnızca `npm run dev`'de görünür. Yayınlamak için `false` yap ya da satırı sil.
Aynı adresle iki dilde yazı yoksa diğer dilin listesinde "Türkçe/Turkish only" notuyla görünür.
RSS (`/rss.xml`, `/en/rss.xml`) ve `sitemap.xml` derlemede otomatik üretilir.

## Yeni proje ekleme

`tr.json` ve `en.json` içindeki `projects.items` listesine aynı `id` ile birer kayıt ekle (alanlar: `title`,
`kind`, `year`, `img`, `alt`, `problem`, `solution`, `result`, `stats`, `tags`, `links`, `note`). Görseli
1200×750 WebP olarak `static/assets/img/` altına koy. Müşteri projelerini müşterinin izni olmadan ekleme.

## Yapı

| Yol | İçerik |
|---|---|
| `src/routes/[[lang=lang]]/` | Ana sayfa ve blog (TR kökte, EN `/en/` altında) |
| `src/params.js` | Dil eşleyici: yalnızca `en` |
| `src/lib/components/` | Bölümler (Hero, Projects, About...) ve ortak parçalar |
| `src/lib/actions.js` | Kaydırınca görünme, ışık takibi ve eğim efektleri |
| `src/app.css` | Renkler, yazı tipleri, animasyonlar; hareket azaltma ayarına uyar |
| `src/lib/i18n.js` | Dil adresleri ve dil tercihi (öneri bandı) |
| `src/lib/signature.js` | El yazısı imza ve FC logosunun SVG yolları (otomatik üretilir) |

## Logo ve imza

Menüdeki el yazısı "Furkan Çöl", FC logosu ve `static/favicon.svg`, Great Vibes yazı tipinden
(`scripts/fonts/`, OFL lisansı) üretilir. Yazı ya da logo değişecekse `scripts/signature.mjs` içinde metni
düzenle ve `node scripts/signature.mjs` çalıştır. opentype.js 1.3.4 kullanılır; 2.x bu yazı tipini eksik çiziyor.

Giriş animasyonu oturumda bir kez oynar (`sessionStorage`), "hareketi azalt" açıksa hiç oynamaz.
Tıklayınca ya da bir tuşa basınca atlanır.
