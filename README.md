# furkancol.me

Kişisel portfolyo sitesi (TR + EN). Sade HTML + Tailwind CSS v4, GitHub Pages'te yayınlanır.

## Güncelleme

1. Metinleri değiştir: `content/tr.json`, `content/en.json` (iki dosya aynı yapıda; proje kimlikleri aynı olmalı,
   farklıysa derleme hata verir). Ortak bilgiler (e-posta, Bionluk linki): `content/site.json`.
2. `npm install` (ilk seferde), sonra `npm run build`
3. Yerelde bak: `npm run serve` → http://127.0.0.1:8000
4. Commit + push → GitHub Pages birkaç dakikada yayınlar.

`index.html`, `en/index.html`, `assets/css/site.css`, `sitemap.xml` ve `robots.txt` derleme çıktısıdır; elle
düzenleme, `npm run build` yeniden üretir.

## Yapı

| Yol | İçerik |
|---|---|
| `content/` | Tüm metinler ve proje kartları |
| `templates/page.mjs` | Sayfa şablonu (Tailwind sınıfları burada) |
| `build.mjs` | İçerik + şablon → HTML, sitemap |
| `src/input.css` | Tailwind girişi: renkler (açık/koyu tema), yazı tipleri |
| `assets/img/` | Proje görselleri (1200×750 WebP) ve paylaşım görseli `og.png` |

## Yeni proje ekleme

`content/tr.json` ve `content/en.json` içindeki `projects.items` listesine aynı `id` ile birer kayıt ekle
(alanlar: `title`, `kind`, `year`, `img`, `alt`, `problem`, `solution`, `result`, `stats`, `tags`, `links`, `note`).
Görseli 1200×750 WebP olarak `assets/img/` altına koy. Müşteri projelerini müşterinin izni olmadan ekleme.
