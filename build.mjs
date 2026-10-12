// İçerik + şablon -> index.html (TR), en/index.html (EN), sitemap.xml, robots.txt
// Çalıştırma: npm run build  (bu betik + Tailwind derlemesi)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { page } from "./templates/page.mjs";

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const site = read("./content/site.json");
const tr = read("./content/tr.json");
const en = read("./content/en.json");

// İki dilde proje kimlikleri ve yayın durumu aynı olmalı (biri unutulursa diller ayrışır)
const ids = (c) => c.projects.items.map((p) => `${p.id}:${p.publish}`).join(",");
if (ids(tr) !== ids(en)) throw new Error(`TR ve EN projeleri farklı:\n  tr: ${ids(tr)}\n  en: ${ids(en)}`);

if (site.bionluk.includes("BIONLUK")) console.warn("UYARI: content/site.json içinde Bionluk profil linki girilmedi");

writeFileSync(new URL("./index.html", import.meta.url), page(site, tr));
mkdirSync(new URL("./en/", import.meta.url), { recursive: true });
writeFileSync(new URL("./en/index.html", import.meta.url), page(site, en));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  new URL("./sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><lastmod>${today}</lastmod></url>
  <url><loc>${site.url}/en/</loc><lastmod>${today}</lastmod></url>
</urlset>
`
);
writeFileSync(new URL("./robots.txt", import.meta.url), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

const shown = tr.projects.items.filter((p) => p.publish).map((p) => p.id);
console.log(`index.html, en/index.html yazıldı; yayındaki projeler: ${shown.join(", ")}`);
