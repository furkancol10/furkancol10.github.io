# Tasarım planı (2026-11-23)

Kaynak: Figma portfolyo örnekleri listesi → Hydrogen (siteleri açamadı, yalnızca notlardan analiz) → Neon planı. Doğrulanmamış fikirler; ekran görüntüleriyle teyit edilmeden uygulanmaz.

### 1. Direction: *Editorial Proof-First Workshop*

Combine the site's existing high-contrast dark editorial system and embedded live demos with persistent mobile-first contact CTAs and a dual-track work structure separating real client systems from ready SMB tools. Reject fullscreen splash intros, 3D/distortion gimmicks, video auto-play, side-scrolling, and fabricated testimonials—Armut/Bionluk buyers arrive on phones needing instant proof and a low-friction way to request a quote. Treating Hydrogen's unverified list as raw ideas only, this hybrid preserves what already makes the site memorable while fixing its two biggest leaks: split v1/v2 styling and buried mobile conversion paths.

---

### 2. What Is Already Good and Must Stay

- **v2 visual system & a11y guards**: Dark blue-black base, Instrument Serif + Geist Variable/Mono typography, zero-FOUC dark/light boot, and `prefers-reduced-motion` handling in [v2.css](file:///home/pcf/Desktop/projeler/furkancol.me/src/v2.css), [app.html](file:///home/pcf/Desktop/projeler/furkancol.me/src/app.html), and [motion.js](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/motion.js).
- **Interactive proof-of-work**: The thermal-receipt OCR verification in [Receipt.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Receipt.svelte), live OCR inspector in [Demo.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Demo.svelte), and embedded ROI calculator in [ExampleDetail.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/ExampleDetail.svelte).
- **Honest SMB conversion plumbing**: Typed TR/EN JSON ([tr.json](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/content/tr.json)), transparent starting prices ([Pricing.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Pricing.svelte)), progressive Formspree form + Bionluk link ([Contact.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Contact.svelte)), empty-guarded testimonials ([Testimonials.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Testimonials.svelte)), and personal timeline ([Who.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Who.svelte)).

---

### 3. Change List (Ordered by Impact / Cost)

1. **Remove blocking splash intro (S)** — [Intro.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Intro.svelte), [app.html](file:///home/pcf/Desktop/projeler/furkancol.me/src/app.html#L19-L27), [app.css](file:///home/pcf/Desktop/projeler/furkancol.me/src/app.css#L199-L242), [+layout.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/routes/[[lang=lang]]/+layout.svelte#L37). Drop the 2–3s fullscreen intro lock (`html.intro`); keep nav and footer signatures for immediate mobile LCP.
2. **Always-visible mobile Contact CTA (S)** — [Nav.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Nav.svelte#L67-L195). Remove `hidden ... md:inline-block` from the `#iletisim` pill; below `640px`, hide the wide signature SVG (keep `Mark`) and move the theme toggle into the drawer so 360px fits cleanly.
3. **Hero enquiry CTA & homepage pacing (S)** — [Hero.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Hero.svelte#L23-L26), [+page.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/routes/[[lang=lang]]/+page.svelte#L41-L51), [tr.json](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/content/tr.json), [en.json](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/content/en.json). Promote direct `#iletisim` CTA alongside `#projeler`, and move `Pricing` right after `Demo` (ahead of `Process`/`About`) so buyers reach prices sooner.
4. **Dual-track work bridge & filter (M)** — [Projects.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Projects.svelte), [Services.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Services.svelte), [ExamplesList.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/ExamplesList.svelte), [tr.json](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/content/tr.json), [en.json](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/content/en.json). Link homepage `Projects` directly to ready `/ornekler/` SMB demos (`roi-hesaplayici`, `randevu-sistemi`, `qr-menu`), make `Services` rows link to relevant demos/contact (matching their hover cues), and add reactive filter chips (`All` / `Ready Demos` / `Coming Soon`) on `ExamplesList`.
5. **Low-friction scope prefill in Contact (S)** — [Contact.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Contact.svelte#L74-L105), [Pricing.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Pricing.svelte). Add one-tap topic chips (`OCR/Otomasyon`, `Web/Araç`, `WordPress Geçişi`) that populate a `topic` field, selectable via query/hash from `Pricing` and `ExampleDetail` CTAs.
6. **Unify v1 sections onto v2 editorial styling (M)** — [Demo.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Demo.svelte), [ExamplesList.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/ExamplesList.svelte), [ExampleDetail.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/ExampleDetail.svelte), [Testimonials.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Testimonials.svelte), [v2.css](file:///home/pcf/Desktop/projeler/furkancol.me/src/v2.css). Replace legacy `SectionHeading`/`grid-bg`/`blur` reveals with `.v2` typography and split layout; replace `ExampleDetail`'s cramped `h-96` image crop with aspect-safe device frames and scannable Problem/Solution/Result summary blocks.

---

### 4. Shippable Phases (≤1 Day Each)

- **Phase 1 — Mobile First-Impression & Conversion**: Items 1–3. *Done when*: `npm run build` succeeds; 360px TR & EN load straight into Hero (no splash), Contact pill is visible in header with `scrollWidth <= innerWidth`, and `Pricing` precedes `Process`.
- **Phase 2 — Dual-Track Discovery & Scope Prefill**: Items 4–5. *Done when*: `/ornekler/` filter buttons toggle items with keyboard support and zero CLS; `Services`/`Pricing`/`ExampleDetail` CTAs jump to `#iletisim` with the corresponding scope chip preselected in TR & EN.
- **Phase 3 — v2 Visual Unification**: Item 6. *Done when*: homepage and `/ornekler/**` share `.v2` typography with zero `SectionHeading`/`grid-bg` leakage; OCR demo and `roi-widget.js` work interactively at 360px and 1280px in dark and light themes.

---

### 5. Risks & Pre-Ship Verification

- **360px TR/EN nav & hero wrap**: Capture real screenshots at `360×800` and `1280×800` across TR/EN and dark/light (Turkish strings run wider).
- **Accent & muted contrast**: Run axe/Lighthouse contrast checks on `--violet`, `--ink-2`, and `.pill` buttons in both modes (enforce WCAG AA ≥4.5:1 normal text).
- **Demo overflow & focus**: Keyboard-test [Demo.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/Demo.svelte) KDV table and `roi-widget.js` inside [ExampleDetail.svelte](file:///home/pcf/Desktop/projeler/furkancol.me/src/lib/components/ExampleDetail.svelte) at 360px for focus traps and horizontal overflow.
- **Motion & static perf**: Verify `prefers-reduced-motion: reduce` reveals all text immediately (no stuck `.scrub`/`.receipt` states) and run Lighthouse mobile on the static build (LCP <2.5s, CLS <0.05).

---

### 6. Two Decisions for the Owner

1. **Add a WhatsApp Business link in `Contact` and mobile drawer, or stay Formspree + Email + Bionluk only?** *Recommendation*: Add WhatsApp (prefilled TR/EN message) if comfortable sharing a business number—Turkish SMB leads reply far faster on WhatsApp than email forms; otherwise elevate Bionluk beside the form button.
2. **Keep the light/dark toggle or simplify to dark-only?** *Recommendation*: Keep both modes (already built with zero-FOUC in `app.html`) and tuck the toggle into the mobile drawer below 640px, preserving outdoor mobile readability without cluttering the 360px header.


---
## Hydrogen araştırma çıktısı

NO WEB ACCESS

Step 2 — Site-by-site takeaways
- 1 mikematas.com: Steal device previews, per-project video play, and personal About for case-study cards.
- 2 spencergabor.work: skip: not relevant (minimal-white gallery and curved side-scroll clash with dark SMB dev focus).
- 3 perryw-2023.webflow.io: Steal role/problem/learnings case-study structure and simple Work/Info separation.
- 4 bradleyziffer.com: Steal personal wording, storytelling case studies, and subtle motion to build SMB trust.
- 5 nataliealmosa.ca: Steal top-right Contact placement (skip draggable elements).
- 6 dotconor.com: Steal phased case studies (discovery/strategy/impact) and split-screen features beside app images.
- 7 danielsun.space: Steal bold name-led hero and responsive scroll-story section (keep letter hover subtle).
- 8 marco.fyi: Steal clickable live prototypes embedded directly inside case-study pages.
- 9 gabrielvaldivia.com: Steal role/goal/impact summaries, product walkthroughs, and testimonials for credibility.
- 10 pavlosanchez.com: Steal immediately visible contact and social links above the fold.
- 11 onur.design: skip: not relevant (designer gallery, awards, and comment widget add bloat without SMB value).
- 12 blunar.cz: skip: not relevant (novelty turntable/collage metaphor obscures services for practical business buyers).
- 13 williambout.me: Steal bio-first vertical flow with zero-click scroll-focused project previews.
- 14 karinasirqueira.com: skip: not relevant (abstract shape nav and side-scroll hurt discoverability for non-design clients).
- 15 jessicahische.is: Steal category filtering, client/overview credits, and before/after project comparisons.
- 16 sinantokmak.framer.website: Steal high-contrast dark mode, bold type, large cards, tech stack, and history sections.
- 17 raffi.town: skip: not relevant (phone home-screen gimmick slows access to services and pricing).
- 18 simonpan.com: Steal low-noise, typography-led case studies mapping decisions to business outcomes.
- 19 jkane.co: Steal generous spacing, crisp typography, and zero distracting transitions.
- 20 bruno-simon.com: skip: not relevant (3D Three.js driving game is heavy, inaccessible, and impractical for SMB leads).
- 21 robin-noguier.com: Steal bold type, fast project-list navigation, and light micro-interactions.
- 22 dionpieters.dev: skip: not relevant (heavy real-time distortion hurts performance and readability).
- 23 pratibhajoshi.com: Steal large thumbnails and hierarchy separating client case studies from small tool experiments.

Step 3 — Reusable patterns
- Structured outcome case studies (3, 6, 9, 15, 18): Role/problem/impact, phases, and before/after comparisons. SvelteKit cost: low (typed content routes). Risk: mobile wall-of-text; TR/EN copy length mismatch.
- Embedded live demos & split walkthroughs (1, 6, 8, 9): Interactive demos, device previews, or video beside feature notes. SvelteKit cost: med (sandboxed iframes or Svelte components). Risk: performance from media/iframes; mobile overflow; accessibility focus traps.
- High-contrast dark typography system (7, 16, 19, 21): Dark blue-black base, violet accent, bold type, generous spacing, no noisy transitions. SvelteKit cost: low (CSS tokens). Risk: accessibility contrast on violet accents and dark text.
- Dual-track work & tech-stack grid (13, 15, 16, 21, 23): Category filter separating SMB client sites from web tools, plus stack/history. SvelteKit cost: low (reactive filter state). Risk: mobile image payload if thumbnails aren't sized/lazy-loaded.
- Immediate contact & social proof (5, 9, 10): Persistent top-right Contact CTA, visible social links, and testimonials near examples. SvelteKit cost: low (layout header + card components). Risk: mobile nav crowding alongside a TR/EN switcher.
- Personal voice & restrained motion (1, 4, 7, 13, 21): Personal About/bio-first narrative with subtle hover/scroll reveals. SvelteKit cost: med (IntersectionObserver/CSS transitions). Risk: accessibility (`prefers-reduced-motion`); mobile scroll jank if overdone.

