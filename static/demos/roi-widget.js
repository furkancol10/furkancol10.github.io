/* ROI Hesaplayıcı - bağımlılıksız */
window.__ROI_CSS__=".roi{--ctl:#6b7280;--bg:#fff;--fg:#1c2433;--mut:#5b6577;--line:#dde2ea;--card:#f5f7fa;--acc:#2f5fd0;--accfg:#fff;--neg:#b42318;--ok:#0b7a4b;\n  font:16px/1.5 system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:16px;max-width:720px;margin:0 auto;box-sizing:border-box}\n@media (prefers-color-scheme:dark){.roi:not([data-theme=light]){--bg:#141922;--fg:#e8ecf3;--mut:#9aa5b8;--line:#2c3544;--ctl:#7b879b;--card:#1c2330;--acc:#7da2ff;--accfg:#0d1320;--neg:#ff8a80;--ok:#5fd6a0}}\n.roi[data-theme=dark]{--bg:#141922;--fg:#e8ecf3;--mut:#9aa5b8;--line:#2c3544;--ctl:#7b879b;--card:#1c2330;--acc:#7da2ff;--accfg:#0d1320;--neg:#ff8a80;--ok:#5fd6a0}\n.roi *{box-sizing:border-box}\n.roi-head{display:flex;justify-content:space-between;align-items:center;gap:8px}\n.roi-title{font-size:1.25rem;margin:0}\n.roi-theme{min-width:44px;min-height:44px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:10px;font-size:1.1rem;cursor:pointer}\n.roi-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}\n.roi-tab{min-height:44px;padding:6px 12px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:999px;font:inherit;font-size:.9rem;cursor:pointer}\n.roi-tab[aria-pressed=true]{background:var(--acc);color:var(--accfg);border-color:var(--acc)}\n.roi-note{color:var(--mut);font-size:.85rem;margin:0 0 12px}\n.roi-field{margin-bottom:12px}\n.roi-label{display:block;font-size:.9rem;font-weight:600;margin-bottom:4px}\n.roi-ctl{display:flex;align-items:center;gap:8px}\n.roi-range{flex:1 1 40%;min-width:0;accent-color:var(--acc);height:44px}\n.roi-num{width:7.5rem;flex:0 0 auto;min-height:44px;padding:6px 8px;border:1px solid var(--ctl);border-radius:8px;background:var(--bg);color:var(--fg);font:inherit;text-align:right}\n.roi-unit{flex:0 0 3.5rem;font-size:.8rem;color:var(--mut)}\n.roi-results{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}\n.roi-stat{background:var(--card);border-radius:10px;padding:10px 12px;min-width:0}\n.roi-stat-l{display:block;font-size:.8rem;color:var(--mut)}\n.roi-stat-v{font-size:1.1rem;overflow-wrap:anywhere}\n.roi-main{outline:2px solid var(--acc)}\n.roi-neg .roi-stat-v{color:var(--neg)}\n.roi-chart{width:100%;overflow:hidden}\n.roi-chart svg{display:block;max-width:100%}\n.roi-tick{font-size:12px;fill:var(--mut)}\n.roi-be{font-size:13px;font-weight:700;fill:var(--fg)}\n.roi-grid{stroke:var(--line);stroke-width:1}\n.roi-line{stroke:var(--acc);stroke-width:2.5}\n.roi-inv{stroke:var(--neg);stroke-width:1.5;stroke-dasharray:5 4}\n.roi-dot{fill:var(--ok);stroke:var(--bg);stroke-width:2}\n.roi-pt{fill:var(--acc)}\n.roi-legend{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;font-size:.85rem;color:var(--mut)}\n.roi-k1,.roi-k2{display:inline-block;width:18px;height:3px;margin-right:6px;background:var(--acc)}\n.roi-k2{background:var(--neg)}\n.roi-cta{display:block;width:100%;min-height:48px;margin-top:14px;padding:10px 16px;border:0;border-radius:10px;background:var(--acc);color:var(--accfg);font:inherit;font-weight:700;cursor:pointer}\n.roi-lead{margin-top:14px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--card)}\n.roi-lead h3,.roi-leads h3{margin:0 0 8px;font-size:1rem}\n.roi-lead label{display:block;font-size:.85rem;font-weight:600;margin-top:8px}\n.roi-lead input,.roi-lead textarea{width:100%;min-height:44px;padding:8px;border:1px solid var(--ctl);border-radius:8px;background:var(--bg);color:var(--fg);font:inherit}\n.roi-msg{margin:8px 0 0;font-size:.85rem;color:var(--ok)}\n.roi-leads{margin-top:14px}\n.roi-leads ul{list-style:none;padding:0;margin:0}\n.roi-leads li{padding:8px 0;border-bottom:1px solid var(--line);overflow-wrap:anywhere}\n.roi-leads small{color:var(--mut)}\n.roi-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}\n.roi-sec{min-height:44px;padding:6px 12px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;font:inherit;cursor:pointer}\n.roi button:focus-visible,.roi input:focus-visible,.roi textarea:focus-visible,.roi-lead:focus-visible{outline:3px solid var(--acc);outline-offset:2px}\n@media (max-width:420px){.roi{padding:12px;border-radius:10px}.roi-results{grid-template-columns:1fr}.roi-num{width:6.5rem}.roi-unit{flex-basis:3rem}}\n\n.roi-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\n";
/* Sektör ayarları: yalnızca veri. Yeni sektör = aşağıya yeni bir giriş eklemek.
   formula.plus / formula.minus: her biri bir "çarpım" listesi; çarpım = alan anahtarları.
   Aylık net ek gelir = toplam(plus) - toplam(minus). Tüm rakamlar ÖRNEKTİR. */
(function (root) {
  'use strict';
  var SECTORS = {
    fitness: {
      name: 'Fitness / ölçüm cihazı',
      title: 'Ölçüm Cihazı Yatırım Geri Dönüşü',
      investmentLabel: 'Cihaz yatırım bedeli',
      fields: [
        { k: 'investment', l: 'Cihaz yatırım bedeli', u: 'TL', min: 0, max: 5000000, step: 10000, def: 1500000, money: true },
        { k: 'daily', l: 'Günlük ölçüm sayısı', u: 'ölçüm', min: 0, max: 40, step: 1, def: 8 },
        { k: 'fee', l: 'Ölçüm başı ücret', u: 'TL', min: 0, max: 3000, step: 25, def: 400, money: true },
        { k: 'days', l: 'Ayda çalışma günü', u: 'gün', min: 1, max: 31, step: 1, def: 26, hard: true },
        { k: 'members', l: 'Cihaz sayesinde aylık yeni üye (opsiyonel)', u: 'kişi', min: 0, max: 100, step: 1, def: 10 },
        { k: 'memberFee', l: 'Aylık üyelik ücreti (opsiyonel)', u: 'TL', min: 0, max: 10000, step: 50, def: 1500, money: true }
      ],
      formula: { plus: [['daily', 'fee', 'days'], ['members', 'memberFee']], minus: [] },
      revenueLabel: 'Aylık ek gelir'
    },
    estetik: {
      name: 'Estetik klinik cihazı',
      title: 'Klinik Cihazı Yatırım Geri Dönüşü',
      investmentLabel: 'Cihaz yatırım bedeli',
      fields: [
        { k: 'investment', l: 'Cihaz yatırım bedeli', u: 'TL', min: 0, max: 8000000, step: 25000, def: 2500000, money: true },
        { k: 'daily', l: 'Günlük seans sayısı', u: 'seans', min: 0, max: 30, step: 1, def: 6 },
        { k: 'fee', l: 'Seans başı ücret', u: 'TL', min: 0, max: 20000, step: 100, def: 3500, money: true },
        { k: 'days', l: 'Ayda çalışma günü', u: 'gün', min: 1, max: 31, step: 1, def: 24, hard: true },
        { k: 'cost', l: 'Seans başı sarf malzeme maliyeti', u: 'TL', min: 0, max: 5000, step: 50, def: 600, money: true }
      ],
      formula: { plus: [['daily', 'fee', 'days']], minus: [['daily', 'cost', 'days']] },
      revenueLabel: 'Aylık net ek kazanç'
    },
    ges: {
      name: 'Güneş paneli (GES)',
      title: 'GES Yatırım Geri Dönüşü',
      investmentLabel: 'Kurulum bedeli',
      fields: [
        { k: 'investment', l: 'Kurulum bedeli', u: 'TL', min: 0, max: 5000000, step: 10000, def: 600000, money: true },
        { k: 'kwp', l: 'Kurulu güç', u: 'kWp', min: 1, max: 500, step: 1, def: 50 },
        { k: 'yield', l: 'Aylık üretim (kWp başına)', u: 'kWh', min: 20, max: 200, step: 5, def: 120 },
        { k: 'tariff', l: 'Elektrik birim fiyatı', u: 'TL/kWh', min: 0, max: 15, step: 0.25, def: 4, money: true, decimals: 2 },
        { k: 'maint', l: 'Aylık bakım / sigorta gideri', u: 'TL', min: 0, max: 20000, step: 100, def: 1500, money: true }
      ],
      formula: { plus: [['kwp', 'yield', 'tariff']], minus: [['maint']] },
      revenueLabel: 'Aylık net tasarruf'
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = SECTORS;
  root.ROI_SECTORS = SECTORS;
})(typeof window !== 'undefined' ? window : globalThis);

/* Çekirdek: saf hesap + tr-TR biçimlendirme (DOM yok). */
(function (root) {
  'use strict';
  function num(v) { v = Number(v); return isFinite(v) && v > 0 ? v : 0; }
  function sum(list, v) {
    return (list || []).reduce(function (t, keys) {
      return t + keys.reduce(function (p, k) { return p * num(v[k]); }, 1);
    }, 0);
  }
  function calculate(sector, v) {
    var f = sector.formula, invest = num(v.investment);
    var monthly = sum(f.plus, v) - sum(f.minus, v);
    return {
      invest: invest, monthly: monthly,
      paybackMonths: monthly > 0 ? invest / monthly : null,
      net12: monthly * 12 - invest, net24: monthly * 24 - invest
    };
  }
  /* Grafik değer aralığı: negatif aylık akışta eksen sıfırın altına iner. */
  function chartRange(r, months) {
    return { min: Math.min(0, r.monthly * months), max: Math.max(r.invest, r.monthly * months, 1) };
  }
  function cumulative(r, months) {
    var a = []; for (var m = 0; m <= months; m++) a.push({ m: m, v: r.monthly * m }); return a;
  }
  var nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
  /* "1.500.000" ya da "1.500.000,5" -> 1500000 / 1500000.5 */
  /* decimals=true: tek nokta + ',' yok + noktadan sonra <=2 hane (4.5) ondalık sayılır; "1.500" binliktir. */
  function parseTR(s, decimals) {
    s = String(s == null ? '' : s);
    if (decimals && s.indexOf(',') < 0 && /^\d*\.\d{1,2}$/.test(s) && !/^\d{1,3}\.\d{3}$/.test(s)) s = s.replace('.', ',');
    s = s.replace(/[^\d,]/g, '');
    var i = s.indexOf(',');
    if (i >= 0) s = s.slice(0, i) + '.' + s.slice(i + 1).replace(/,/g, '');
    var n = parseFloat(s); return isFinite(n) ? n : 0;
  }
  function formatTR(n, decimals) { return (decimals ? nf2 : nf).format(num(n)); }
  /* Yazarken binlik ayırıcıyı canlı uygular; ondalık kısmı korur. */
  function formatTyping(s, decimals) {
    s = String(s);
    if (decimals && s.indexOf(',') < 0 && /^\d*\.\d{1,2}$/.test(s)) s = s.replace('.', ',');
    s = s.replace(/[^\d,]/g, '');
    var i = s.indexOf(','), ip = i >= 0 ? s.slice(0, i) : s, fp = i >= 0 ? s.slice(i + 1).replace(/,/g, '') : null;
    ip = ip.replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (fp !== null && decimals) return ip + ',' + fp.slice(0, 2);
    return ip;
  }
  function tl(v) { return nf.format(Math.round(v) + 0) + ' TL'; }
  /* Biçimlenince imleç: yazılan rakam ve virgül sayısı korunarak yeni metindeki konum. */
  function caretAfter(before, pos, after) {
    var n = before.slice(0, pos).replace(/[^\d,]/g, '').length, p = 0, c = 0;
    while (p < after.length && c < n) { if (/[\d,]/.test(after[p])) c++; p++; }
    return p;
  }
  function sanitizeUrl(u) {
    u = String(u == null ? '' : u).replace(/[\u0000-\u0020\u007f-\u009f]/g, '');
    if (!u) return '';
    if (/^[a-z][a-z0-9+.\-]*:/i.test(u)) return /^https?:/i.test(u) ? u : '';
    return u;
  }
  function clampField(f, v) {
    v = Number(v);
    if (!isFinite(v)) return f.def;
    if (v < 0) v = 0;
    return f.hard ? Math.min(f.max, Math.max(f.min, v)) : v;
  }
  function sanitizeLeads(a) {
    if (!Array.isArray(a)) return [];
    var str = function (x) { return typeof x === 'string' ? x : x == null || typeof x === 'object' ? '' : String(x); };
    return a.filter(function (l) { return l && typeof l === 'object'; }).map(function (l) {
      var m = Number(l.monthly), pb = l.payback === '' || l.payback == null ? NaN : Number(l.payback);
      return { date: str(l.date), name: str(l.name), contact: str(l.contact), sector: str(l.sector),
        monthly: isFinite(m) ? m : 0, payback: isFinite(pb) ? pb : '', note: str(l.note) };
    });
  }
  function tickLabel(gv) { return gv >= 1e6 || gv <= -1e6 ? nf1.format(gv / 1e6) + ' Mn' : Math.abs(gv) >= 1000 ? nf.format(Math.round(gv / 1000)) + ' bin' : nf.format(Math.round(gv)); }
  function yAxisWidth(labels) {
    return Math.max.apply(null, labels.map(function (t) { return t.length; })) * 7 + 10;
  }
  /* Ortalanmış etiketin [L, W-R] içinde kalan merkez x'i. */
  function clampLabelX(x, w, L, W, R) {
    return Math.max(L + w / 2, Math.min(x, W - R - w / 2));
  }
  function csvEscape(s) {
    if (typeof s === 'number') return isFinite(s) ? String(s).replace('.', ',') : '';   /* Türkçe Excel: ondalık virgül */
    s = String(s == null ? '' : s);
    if (/^[\s=+\-@]/.test(s)) s = "'" + s;   /* tablo formülü enjeksiyonuna karşı */
    return /[",;\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCSV(rows, cols) {
    return '﻿' + [cols.map(function (c) { return csvEscape(c.h); }).join(';')]
      .concat(rows.map(function (r) { return cols.map(function (c) { return csvEscape(r[c.k]); }).join(';'); })).join('\r\n');
  }
  root.ROI_CORE = { calculate: calculate, cumulative: cumulative, parseTR: parseTR, formatTR: formatTR,
    formatTyping: formatTyping, tl: tl, chartRange: chartRange, caretAfter: caretAfter,
    sanitizeUrl: sanitizeUrl, clampField: clampField, sanitizeLeads: sanitizeLeads, tickLabel: tickLabel,
    yAxisWidth: yAxisWidth, clampLabelX: clampLabelX, csvEscape: csvEscape, nf: nf, nf1: nf1, toCSV: toCSV };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ROI_CORE;
})(typeof window !== 'undefined' ? window : globalThis);

/* Arayüz. Gerekli: ROI_SECTORS, ROI_CORE (build.mjs hepsini tek dosyada birleştirir). */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var C = root.ROI_CORE, SECTORS = root.ROI_SECTORS, uid = 0, LS = 'roi-leads';

  function el(tag, cls, html) {
    var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function loadLeads() { try { var a = JSON.parse(localStorage.getItem(LS)); return C.sanitizeLeads(a); } catch (e) { return []; } }
  function saveLeads(a) { try { localStorage.setItem(LS, JSON.stringify(a)); return true; } catch (e) { return false; } }

  function init(host) {
    if (host.__roi) return; host.__roi = true;
    var d = host.dataset, id = ++uid, sectors = root.ROI_SECTORS;
    var key = sectors[d.sector] ? d.sector : Object.keys(sectors)[0];
    var vals = {}, last, inputs = {}, theme = d.theme || '';
    var cb = d.callback || '', ctaUrl = C.sanitizeUrl(d.ctaUrl), ctaText = d.cta || 'Bu hesapla teklif al';

    var wrap = el('div', 'roi'); if (theme) wrap.setAttribute('data-theme', theme);
    var head = el('div', 'roi-head');
    var h = el('h2', 'roi-title'); head.appendChild(h);
    var tbtn = el('button', 'roi-theme', '◐'); tbtn.type = 'button';
    function isDark() { return wrap.getAttribute('data-theme') === 'dark' || (!wrap.getAttribute('data-theme') && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
    tbtn.setAttribute('aria-label', 'Açık / koyu tema'); head.appendChild(tbtn);
    wrap.appendChild(head); tbtn.setAttribute('aria-pressed', isDark());

    var tabs = el('div', 'roi-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Sektör');
    Object.keys(sectors).forEach(function (k) {
      var b = el('button', 'roi-tab'); b.type = 'button'; b.textContent = sectors[k].name; b.dataset.k = k;
      b.addEventListener('click', function () { key = k; build(); }); tabs.appendChild(b);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(el('p', 'roi-note', 'Tüm varsayılan rakamlar örnektir; kendi değerlerinizle güncelleyin.'));
    var form = el('div', 'roi-inputs'), out = el('div', 'roi-results'), chart = el('div', 'roi-chart');
    out.setAttribute('role', 'region'); out.setAttribute('aria-label', 'Sonuçlar');
    var sr = el('div', 'roi-sr'); sr.setAttribute('role', 'status'); sr.setAttribute('aria-live', 'polite'); var srT = 0;
    var btn = el('button', 'roi-cta'); btn.textContent = ctaText; btn.type = 'button';
    var lead = el('form', 'roi-lead'); lead.hidden = true; lead.setAttribute('tabindex', '-1');
    var list = el('div', 'roi-leads');
    [form, out, sr, chart, btn, lead, list].forEach(function (n) { wrap.appendChild(n); });
    host.appendChild(wrap);

    tbtn.addEventListener('click', function () {
      var dark = isDark();
      wrap.setAttribute('data-theme', dark ? 'light' : 'dark'); tbtn.setAttribute('aria-pressed', !dark);
    });

    function build() {
      var s = sectors[key]; h.textContent = d.title || s.title; form.innerHTML = ''; inputs = {}; vals = {};
      Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-pressed', b.dataset.k === key); });
      s.fields.forEach(function (f) {
        var v = C.clampField(f, d[f.k] != null && d[f.k] !== '' ? +d[f.k] : f.def); vals[f.k] = v;
        var fid = 'roi-' + id + '-' + f.k, row = el('div', 'roi-field');
        var lab = el('label', 'roi-label', esc(f.l)); lab.htmlFor = fid + '-n';
        var ctl = el('div', 'roi-ctl');
        var rng = el('input', 'roi-range'); rng.type = 'range'; rng.min = f.min; rng.max = f.max; rng.step = f.step;
        rng.value = v; rng.setAttribute('aria-label', f.l + ' (kaydırıcı)');
        var num = el('input', 'roi-num'); num.type = 'text'; num.id = fid + '-n';
        num.inputMode = f.decimals ? 'decimal' : 'numeric'; num.autocomplete = 'off';
        num.value = C.formatTR(v, f.decimals);
        var unit = el('span', 'roi-unit', esc(f.u)); unit.id = fid + '-u'; rng.setAttribute('aria-describedby', unit.id); num.setAttribute('aria-describedby', unit.id);
        ctl.appendChild(rng); ctl.appendChild(num); ctl.appendChild(unit);
        row.appendChild(lab); row.appendChild(ctl); form.appendChild(row);
        rng.addEventListener('input', function () { vals[f.k] = +rng.value; num.value = C.formatTR(vals[f.k], f.decimals); update(); });
        num.addEventListener('input', function () {
          var before = num.value, pos = num.selectionStart;
          var t = C.formatTyping(before, f.decimals); num.value = t;
          var p = C.caretAfter(before, pos, t);
          try { num.setSelectionRange(p, p); } catch (e) {}
          vals[f.k] = C.clampField(f, C.parseTR(t, f.decimals)); rng.value = Math.min(vals[f.k], f.max); update();
        });
        num.addEventListener('blur', function () { num.value = C.formatTR(vals[f.k], f.decimals); });
      });
      update();
    }

    function stat(l, v, cls) { return '<div class="roi-stat ' + (cls || '') + '"><span class="roi-stat-l">' + l + '</span><strong class="roi-stat-v">' + v + '</strong></div>'; }
    function pbText(r) { return r.paybackMonths == null ? (r.monthly < 0 ? 'Geri dönmüyor' : 'Hesaplanamıyor') : C.nf1.format(r.paybackMonths) + ' ay'; }
    function update() {
      var s = sectors[key], r = last = C.calculate(s, vals);
      out.innerHTML = stat(s.revenueLabel, C.tl(r.monthly)) + stat('Geri dönüş süresi', pbText(r), 'roi-main') +
        stat('12 ay net getiri', C.tl(r.net12), r.net12 < 0 ? 'roi-neg' : '') +
        stat('24 ay net getiri', C.tl(r.net24), r.net24 < 0 ? 'roi-neg' : '');
      draw(r);
      clearTimeout(srT); srT = setTimeout(function () { sr.textContent = s.revenueLabel + ' ' + C.tl(r.monthly) + ', geri dönüş ' + pbText(r) + '.'; }, 700);
    }

    /* Grafik gerçek piksel genişliğinde çizilir (viewBox ölçeklemesi yok), yazı mobilde de 12px kalır. */
    function draw(r) {
      var W = Math.max(chart.clientWidth || 320, 240), narrow = W < 420, H = narrow ? 240 : 260;
      var R = 14, T = 26, B = 34;
      var months = Math.max(24, r.paybackMonths ? Math.min(60, Math.ceil(r.paybackMonths * 1.3)) : 24);
      var rg = C.chartRange(r, months), maxV = rg.max, minV = rg.min, ticks = [];
      for (var g0 = 0; g0 <= 4; g0++) ticks.push(C.tickLabel(minV + (maxV - minV) * g0 / 4));
      var L = Math.max(narrow ? 40 : 54, C.yAxisWidth(ticks));
      var x = function (m) { return L + (W - L - R) * m / months; };
      var y = function (v) { return T + (H - T - B) * (1 - (v - minV) / (maxV - minV)); };
      var pts = C.cumulative(r, months).map(function (p) { return x(p.m).toFixed(1) + ',' + y(p.v).toFixed(1); }).join(' ');
      var s = '<svg width="' + W + '" height="' + H + '" role="img" aria-label="12 ve 24 aylık kümülatif getiri ile yatırım bedeli grafiği">';
      for (var g = 0; g <= 4; g++) {
        var gv = minV + (maxV - minV) * g / 4;
        s += '<line class="roi-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(gv) + '" y2="' + y(gv) + '"/><text class="roi-tick" x="' + (L - 6) +
          '" y="' + (y(gv) + 4) + '" text-anchor="end">' + ticks[g] + '</text>';
      }
      var step = months > 36 || narrow ? 12 : 6;
      for (var m = 0; m <= months; m += step)
        s += '<text class="roi-tick" x="' + x(m) + '" y="' + (H - 10) + '" text-anchor="' + (m === 0 ? 'start' : m + step > months ? 'end' : 'middle') + '">' + m + '. ay</text>';
      [12, 24].forEach(function (mm) {
        s += '<circle class="roi-pt" cx="' + x(mm) + '" cy="' + y(r.monthly * mm) + '" r="4"/>';
      });
      s += '<line class="roi-inv" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(r.invest) + '" y2="' + y(r.invest) + '"/><polyline class="roi-line" fill="none" points="' + pts + '"/>';
      if (r.paybackMonths != null && r.paybackMonths <= months) {
        var bx = x(r.paybackMonths), by = y(r.invest);
        s += '<circle class="roi-dot" cx="' + bx + '" cy="' + by + '" r="6"/><text class="roi-be" x="' + C.clampLabelX(bx, 125, L, W, R) +
          '" y="' + (by - 12) + '" text-anchor="middle">Başabaş: ' + C.nf1.format(r.paybackMonths) + ' ay</text>';
      }
      chart.innerHTML = s + '</svg><div class="roi-legend"><span class="roi-k1"></span>Kümülatif ek gelir<span class="roi-k2"></span>Yatırım bedeli</div>';
    }
    if (window.ResizeObserver) { var lw = 0; new ResizeObserver(function () { if (chart.clientWidth !== lw) { lw = chart.clientWidth; if (last) draw(last); } }).observe(chart); }

    function payload() {
      var s = sectors[key], r = last, p = { sector: s.name };
      s.fields.forEach(function (f) { p[f.k] = vals[f.k]; });
      p.monthly = Math.round(r.monthly); p.paybackMonths = r.paybackMonths == null ? null : Math.round(r.paybackMonths * 10) / 10;
      p.net12 = Math.round(r.net12); p.net24 = Math.round(r.net24);
      p.note = 'ROI hesabı (' + s.name + '): ' + s.fields.map(function (f) { return f.l + ' ' + C.formatTR(vals[f.k], f.decimals) + ' ' + f.u; }).join(', ') +
        '; ' + s.revenueLabel.toLowerCase() + ' ' + C.tl(p.monthly) + ', geri dönüş ' + (p.paybackMonths == null ? '-' : C.nf1.format(p.paybackMonths) + ' ay') + '.';
      return p;
    }
    btn.addEventListener('click', function () {
      var p = payload();
      host.dispatchEvent(new CustomEvent('roi:quote', { detail: p, bubbles: true }));
      var fn = cb && typeof root[cb] === 'function' ? root[cb] : null;
      if (fn) { fn(p); return; }
      if (ctaUrl) {
        var q = new URLSearchParams(); Object.keys(p).forEach(function (k) { if (p[k] != null) q.set(k, p[k]); });
        window.location.href = ctaUrl + (ctaUrl.indexOf('?') < 0 ? '?' : '&') + q.toString(); return;
      }
      var lid = 'roi-' + id + '-lead';
      lead.hidden = false; lead.innerHTML = '<h3>Teklif talebi</h3>' +
        '<label for="' + lid + '-a">Ad soyad</label><input id="' + lid + '-a" name="name" required autocomplete="name">' +
        '<label for="' + lid + '-c">Telefon veya e-posta</label><input id="' + lid + '-c" name="contact" required autocomplete="tel">' +
        '<label for="' + lid + '-n">Not (hesaptan otomatik dolduruldu)</label><textarea id="' + lid + '-n" name="note" rows="4"></textarea>' +
        '<button type="submit" class="roi-cta">Talebi kaydet</button><p class="roi-msg" role="status"></p>';
      lead.elements.note.value = p.note; lead.__p = p; lead.focus();
    });
    lead.addEventListener('submit', function (e) {
      e.preventDefault(); var f = lead.elements, old = lead.__p, p = payload();
      if (f.note.value.trim() === old.note.trim()) f.note.value = p.note;   /* kullanıcı notu düzenlemediyse güncel hesapla yenile */
      lead.__p = p;
      var rec = { date: new Date().toLocaleString('tr-TR'), name: f.name.value.trim(), contact: f.contact.value.trim(), sector: p.sector,
        monthly: p.monthly, payback: p.paybackMonths == null ? '' : p.paybackMonths, note: f.note.value.trim() };
      var all = loadLeads(); all.push(rec);
      var ok = saveLeads(all), msg = lead.querySelector('.roi-msg');
      msg.textContent = ok ? 'Talep bu tarayıcıya kaydedildi.' : 'Tarayıcı depolaması kullanılamıyor; talep kaydedilemedi.';
      if (ok) { f.name.value = ''; f.contact.value = ''; }
      renderLeads(ok ? all : null);
    });

    function renderLeads(all) {
      all = all || loadLeads(); list.innerHTML = '';
      if (!all.length) return;
      var html = '<h3>Kayıtlı talepler (' + all.length + ')</h3><ul>' + all.slice(-5).reverse().map(function (l) {
        return '<li><strong>' + esc(l.name) + '</strong> · ' + esc(l.contact) + '<br><small>' + esc(l.date) + ' · ' + esc(l.sector) + ' · ' + C.tl(l.monthly) + '/ay</small></li>';
      }).join('') + '</ul><div class="roi-actions"><button type="button" class="roi-sec" data-a="csv">CSV indir</button><button type="button" class="roi-sec" data-a="clear">Listeyi temizle</button></div>';
      list.innerHTML = html;
    }
    list.addEventListener('click', function (e) {
      var a = e.target.dataset && e.target.dataset.a;
      if (a === 'clear') { saveLeads([]); renderLeads([]); }
      if (a === 'csv') {
        var csv = C.toCSV(loadLeads(), [{ k: 'date', h: 'Tarih' }, { k: 'name', h: 'Ad soyad' }, { k: 'contact', h: 'İletişim' }, { k: 'sector', h: 'Sektör' },
          { k: 'monthly', h: 'Aylık kazanç (TL)' }, { k: 'payback', h: 'Geri dönüş (ay)' }, { k: 'note', h: 'Not' }]);
        var u = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), a2 = document.createElement('a');
        a2.href = u; a2.download = 'talepler.csv'; document.body.appendChild(a2); a2.click(); a2.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
      }
    });
    build(); renderLeads();
  }

  var css = root.__ROI_CSS__;
  if (css) { var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }
  function boot() { Array.prototype.forEach.call(document.querySelectorAll('[data-roi-calculator]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  root.ROI = { init: init };
})(typeof window !== 'undefined' ? window : globalThis);
