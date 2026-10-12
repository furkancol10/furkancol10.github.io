// Tek sayfa şablonu: page(site, c) -> HTML. c = content/tr.json ya da en.json
// İçerikteki metinler güvenilir (kendi yazdığımız JSON); <br>, <b> gibi etiketlere izin verilir.

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const tag = (t) =>
  `<li class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-xs text-ink-2">${esc(t)}</li>`;

function service(s, i) {
  return `
      <article class="flex flex-col rounded-2xl border border-rule bg-card p-6 shadow-sm">
        <p class="font-mono text-xs tracking-widest text-accent">0${i + 1}</p>
        <h3 class="mt-3 font-serif text-3xl leading-tight">${s.title}</h3>
        <p class="mt-3 grow leading-relaxed text-ink-2">${s.text}</p>
        <ul class="mt-5 flex flex-wrap gap-2">${s.tags.map(tag).join("")}</ul>
      </article>`;
}

function project(p, labels, i) {
  const links = p.links.length
    ? p.links
        .map(
          ([kind, url]) => `
          <a href="${esc(url)}" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">
            ${esc(labels[kind])} <span aria-hidden="true">↗</span></a>`
        )
        .join("")
    : `<p class="text-sm text-ink-2">${esc(p.note || "")}</p>`;
  const stats = p.stats
    .map(
      ([num, label]) => `
          <div><dt class="font-serif text-4xl leading-none">${esc(num)}</dt>
               <dd class="mt-1 text-sm text-ink-2">${esc(label)}</dd></div>`
    )
    .join("");
  const flip = i % 2 === 1 ? "lg:order-last" : "";
  return `
      <article id="${p.id}" class="grid items-start gap-8 border-t border-rule py-14 lg:grid-cols-2 lg:gap-14">
        <figure class="${flip} overflow-hidden rounded-2xl border border-rule bg-card shadow-sm">
          <img src="/assets/img/${p.img}" alt="${esc(p.alt)}" width="1200" height="750" loading="lazy" decoding="async"
               class="block h-auto w-full">
        </figure>
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-ink-2">${esc(p.kind)} · ${esc(p.year)}</p>
          <h3 class="mt-2 font-serif text-4xl leading-tight md:text-5xl">${p.title}</h3>
          <dl class="mt-6 space-y-4 leading-relaxed">
            <div><dt class="text-sm font-semibold text-accent">${esc(labels.problem)}</dt><dd class="mt-1">${p.problem}</dd></div>
            <div><dt class="text-sm font-semibold text-accent">${esc(labels.solution)}</dt><dd class="mt-1">${p.solution}</dd></div>
            <div><dt class="text-sm font-semibold text-accent">${esc(labels.result)}</dt><dd class="mt-1">${p.result}</dd></div>
          </dl>
          <dl class="mt-7 grid grid-cols-3 gap-4 border-y border-rule py-5">${stats}</dl>
          <ul class="mt-6 flex flex-wrap gap-2">${p.tags.map(tag).join("")}</ul>
          <div class="mt-6 flex flex-wrap gap-3">${links}</div>
        </div>
      </article>`;
}

export function page(site, c) {
  const url = site.url + c.path;
  const altUrl = site.url + c.alt.path;
  const projects = c.projects.items.filter((p) => p.publish);
  return `<!doctype html>
<html lang="${c.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.meta.title)}</title>
  <meta name="description" content="${esc(c.meta.description)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="${c.lang}" href="${url}">
  <link rel="alternate" hreflang="${c.alt.lang}" href="${altUrl}">
  <link rel="alternate" hreflang="x-default" href="${site.url}/">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(c.meta.title)}">
  <meta property="og:description" content="${esc(c.meta.description)}">
  <meta property="og:image" content="${site.url}/assets/img/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${c.lang === "tr" ? "tr_TR" : "en_US"}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f3efe6" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#161512" media="(prefers-color-scheme: dark)">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
</head>
<body class="font-sans text-ink antialiased">
  <a href="#icerik" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">${esc(c.nav.skip)}</a>

  <header class="sticky top-0 z-40 border-b border-rule/70 bg-paper/85 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
      <a href="${c.path}" class="font-serif text-2xl leading-none">${esc(site.name)}</a>
      <ul class="hidden items-center gap-7 text-sm text-ink-2 md:flex">
        <li><a href="#hizmetler" class="hover:text-ink">${esc(c.nav.services)}</a></li>
        <li><a href="#projeler" class="hover:text-ink">${esc(c.nav.projects)}</a></li>
        <li><a href="#hakkimda" class="hover:text-ink">${esc(c.nav.about)}</a></li>
        <li><a href="#iletisim" class="hover:text-ink">${esc(c.nav.contact)}</a></li>
      </ul>
      <a href="${c.alt.path}" hreflang="${c.alt.lang}" lang="${c.alt.lang}" title="${esc(c.alt.name)}"
         class="rounded-full border border-rule px-3 py-1 font-mono text-xs tracking-widest hover:border-accent hover:text-accent">${c.alt.label}</a>
    </nav>
  </header>

  <main id="icerik">
    <section class="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pb-28 md:pt-28">
      <p class="font-mono text-xs uppercase tracking-[0.25em] text-ink-2">${esc(c.hero.eyebrow)}</p>
      <h1 class="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl">${c.hero.title}</h1>
      <p class="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">${c.hero.lead}</p>
      <div class="mt-9 flex flex-wrap gap-3">
        <a href="${esc(site.bionluk)}" target="_blank" rel="noopener"
           class="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink shadow-sm hover:opacity-90">${esc(c.hero.cta_primary)}</a>
        <a href="#iletisim" data-eposta data-u="${site.email_user}" data-d="${site.email_domain}"
           class="rounded-full border border-ink/25 px-6 py-3 font-medium hover:border-accent hover:text-accent">${esc(c.hero.cta_secondary)}</a>
      </div>
    </section>

    <section id="hizmetler" class="mx-auto max-w-6xl px-5 pb-20">
      <h2 class="font-serif text-4xl md:text-5xl">${esc(c.services.title)}</h2>
      <div class="mt-8 grid gap-5 md:grid-cols-3">${c.services.items.map(service).join("")}
      </div>
    </section>

    <section id="projeler" class="mx-auto max-w-6xl px-5 pb-10">
      <h2 class="font-serif text-4xl md:text-5xl">${esc(c.projects.title)}</h2>
      ${projects.map((p, i) => project(p, c.projects.labels, i)).join("")}
    </section>

    <section id="hakkimda" class="mx-auto max-w-6xl border-t border-rule px-5 py-20">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 class="font-serif text-4xl md:text-5xl">${esc(c.about.title)}</h2>
          ${c.about.paragraphs.map((t) => `<p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">${t}</p>`).join("")}
        </div>
        <div class="rounded-2xl border border-rule bg-card p-6 shadow-sm">
          <h3 class="font-mono text-xs uppercase tracking-widest text-ink-2">${esc(c.about.skills_title)}</h3>
          <dl class="mt-4 divide-y divide-rule">
            ${c.about.skills
              .map(([k, v]) => `<div class="grid grid-cols-[7rem_1fr] gap-3 py-3"><dt class="font-medium">${esc(k)}</dt><dd class="text-ink-2">${esc(v)}</dd></div>`)
              .join("")}
          </dl>
        </div>
      </div>
    </section>

    <section id="iletisim" class="mx-auto max-w-6xl px-5 pb-24">
      <div class="rounded-3xl bg-accent px-7 py-14 text-accent-ink md:px-14 md:py-20">
        <h2 class="font-serif text-5xl leading-tight md:text-6xl">${esc(c.contact.title)}</h2>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed opacity-90">${c.contact.text}</p>
        <div class="mt-9 flex flex-wrap gap-3">
          <a href="${esc(site.bionluk)}" target="_blank" rel="noopener"
             class="rounded-full bg-accent-ink px-6 py-3 font-medium text-accent hover:opacity-90">${esc(c.contact.bionluk)} ↗</a>
          <a href="#iletisim" data-eposta data-goster data-u="${site.email_user}" data-d="${site.email_domain}"
             class="rounded-full border border-current px-6 py-3 font-medium hover:opacity-80">${esc(site.email_user)} [at] ${esc(site.email_domain)}</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-rule px-5 py-8 text-sm text-ink-2">
    <p>© ${site.year} ${esc(site.name)}</p>
    <p>${esc(c.footer)}</p>
  </footer>

  <script>
    // E-posta adresi sayfa kaynağında düz yazılmaz (spam botları); tarayıcıda birleştirilir.
    document.querySelectorAll("[data-eposta]").forEach(function (a) {
      var e = a.dataset.u + "@" + a.dataset.d;
      a.href = "mailto:" + e;
      if (a.hasAttribute("data-goster")) a.textContent = e;
    });
  </script>
</body>
</html>
`;
}
