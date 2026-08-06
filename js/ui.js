/* ---------------------------------------------------------------------------
   Builds the page from content.js, then runs everything that is not 3D:
   scroll reveals, the nav, the spec disclosures and the auto-repeat animation.
--------------------------------------------------------------------------- */

import { MODELS, HERO, QUIZ, PRESETS, SOFTWARE, COMPARE, CLIENTS, CALC, FAQ, SERVICE,
         NEXT, CTA } from './content.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════ HERO ═══════ */

(function hero() {
  $('.hero .eyebrow').textContent = HERO.eyebrow;
  $('.hero-title').innerHTML = HERO.title
    .map(l => `<span class="ln"><i>${l}</i></span>`).join('');
  $('.hero-sub').textContent = HERO.sub;
  const [a, b] = $$('.hero-actions a');
  a.textContent = HERO.cta;
  b.textContent = HERO.ctaSecondary;
  $('.scroll-hint').insertAdjacentHTML('afterbegin', HERO.scrollHint);
})();

/* ═══════════════════════════════════════════════════ MODEL FINDER ═══════ */
/*
   Two questions, then a recommendation. The answer comes from weekly volume;
   status only breaks the tie when someone has not picked a volume yet —
   which is most first-time visitors, and the reason the status question is
   there at all.
*/

(function finder() {
  const s = $('.quiz');
  $('.eyebrow', s).textContent = QUIZ.eyebrow;
  $('.h2', s).textContent = QUIZ.title;
  $('.lede', s).textContent = QUIZ.sub;

  const body = $('.quiz-body');
  const out  = $('.quiz-result');
  const picked = {};

  body.innerHTML = QUIZ.questions.map(q => `
    <fieldset class="quiz-q" data-rise>
      <legend class="quiz-label mono">${q.label}</legend>
      <div class="quiz-opts">
        ${q.options.map(o => `
          <button class="quiz-opt" type="button"
                  data-q="${q.key}" data-v="${o.v}" aria-pressed="false">${o.t}</button>`).join('')}
      </div>
    </fieldset>`).join('');

  function decide() {
    if (!picked.status && !picked.volume) return null;
    const byVol = picked.volume && picked.volume !== 'unknown'
      ? QUIZ.byVolume[picked.volume] : null;
    return byVol || QUIZ.byStatus[picked.status] || null;
  }

  function render() {
    const key = decide();
    if (!key) { out.hidden = true; return; }

    if (key === 'bigger') {
      const b = QUIZ.bigger;
      out.innerHTML = `
        <p class="quiz-result-label mono">${QUIZ.resultLabel}</p>
        <h3 class="quiz-result-name">${b.name}</h3>
        <p class="quiz-result-lead">${b.lead}</p>
        <p class="quiz-result-body">${b.body}</p>
        <div class="quiz-actions">
          <a class="btn" href="${b.href}">${b.cta}</a>
          <button class="btn btn-ghost quiz-again" type="button">${QUIZ.again}</button>
        </div>`;
    } else {
      const m = MODELS.find(x => x.key === key);
      out.innerHTML = `
        <p class="quiz-result-label mono">${QUIZ.resultLabel}</p>
        <h3 class="quiz-result-name">${m.name}</h3>
        <p class="quiz-result-lead">${m.lead}</p>
        <p class="quiz-result-body">${m.body}</p>
        <dl class="quiz-figures">
          <div><dt class="mono">Replaces</dt><dd>${m.replaces.replace('Replaces a ', '')}</dd></div>
          <div><dt class="mono">Output</dt><dd>${m.stats[0].v} ${m.stats[0].u}</dd></div>
          <div><dt class="mono">Batches</dt><dd>${m.stats[1].v} / hour</dd></div>
        </dl>
        <div class="quiz-actions">
          <a class="btn" href="#m-${m.key}">See the ${m.name.replace('Typhoon ', '')}</a>
          <a class="btn btn-ghost" href="#contact">${QUIZ.cta}</a>
          <button class="btn btn-ghost quiz-again" type="button">${QUIZ.again}</button>
        </div>`;
    }

    out.hidden = false;
    const again = $('.quiz-again', out);
    if (again) again.addEventListener('click', () => {
      delete picked.status; delete picked.volume;
      $$('.quiz-opt', body).forEach(b => b.setAttribute('aria-pressed', 'false'));
      out.hidden = true;
      s.scrollIntoView({ block: 'start' });
    });
  }

  $$('.quiz-opt', body).forEach(btn => btn.addEventListener('click', () => {
    const { q, v } = btn.dataset;
    picked[q] = v;
    $$(`.quiz-opt[data-q="${q}"]`, body)
      .forEach(o => o.setAttribute('aria-pressed', o === btn));
    render();
  }));
})();

/* ═══════════════════════════════════════════════ MODEL CHAPTERS ═════════ */

$('#lineup').innerHTML = MODELS.map((m, i) => {
  const stats = m.stats.map(s => `
    <div>
      <div class="v">${s.v}</div>
      <div class="u mono">${s.u}</div>
      <div class="l">${s.l}</div>
    </div>`).join('');

  const specs = m.specs.map(g => `
    <details>
      <summary>${g.group}<span class="ic"></span></summary>
      <dl>${g.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </details>`).join('');

  /* Which preset a machine opens on: whichever one matches the paint it was
     given above. No match simply means nothing starts selected. */
  const openOn = PRESETS.findIndex(pr =>
    (m.paint ? m.paint.body : '#EAE0C8').toUpperCase() === pr.body.toUpperCase());

  const swatches = PRESETS.map((pr, pi) => `
    <button class="swatch-btn" type="button"
            data-model="${m.key}" data-preset="${pr.key}"
            aria-pressed="${pi === openOn}"
            title="${pr.name} — ${pr.ral}">
      <i style="--a:${pr.body};--b:${pr.accent}"></i>
      <span class="sr">${pr.name}</span>
    </button>`).join('');

  /* A price only appears once someone fills it in content.js.
     Until then the button carries the ask, which is what the sales
     process actually wants anyway. */
  const price = m.price
    ? `<div class="price-tag"><span class="p">${m.price}</span><span class="n">${m.priceNote}</span></div>`
    : `<div class="price-tag"><span class="p">Price on request</span><span class="n">${m.priceNote}</span></div>`;

  return `
  <section class="chapter" id="m-${m.key}" data-model="${m.key}">
    <div class="chapter-inner">
      <div class="chapter-stage">
        <div class="chapter-void"></div>
        <div class="presets" data-rise>
          <span class="presets-label mono">Colour</span>
          <div class="swatches" role="group" aria-label="Colour presets">${swatches}</div>
          <span class="presets-name mono"></span>
        </div>
      </div>
      <div class="chapter-panel">
        <p class="chapter-tag mono" data-rise>
          <b>${String(i + 1).padStart(2, '0')} / ${String(MODELS.length).padStart(2, '0')}</b>
          <span>${m.replaces}</span>
        </p>
        <h2 class="chapter-name" data-rise>${m.name}</h2>
        <p class="chapter-lead" data-rise>${m.lead}</p>
        <p class="chapter-body" data-rise>${m.body}</p>
        <div class="stat-row" data-rise>${stats}</div>
        <div class="specs" data-rise>${specs}</div>
        <div class="chapter-actions" data-rise>
          ${price}
          <a class="btn" href="#contact">Get a quote</a>
        </div>
      </div>
    </div>
  </section>`;
}).join('');

/* Only one spec group open at a time, per chapter — the panel is fixed
   height on desktop and three open groups would overflow it. */
$$('.chapter').forEach(ch => {
  const all = $$('details', ch);
  all.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) all.forEach(o => { if (o !== d) o.open = false; });
  }));
});

/* ════════════════════════════════════════════════════ COLOUR PRESETS ════ */
/*
   The buttons do not own the colour — they ask the scene to repaint, and
   scene.js owns finding the two painted materials. Decoupled through an
   event so neither module has to import the other.
*/

$$('.presets').forEach(box => {
  const nameEl = $('.presets-name', box);
  const btns = $$('.swatch-btn', box);

  const show = pr => { nameEl.textContent = pr ? pr.ral : ''; };
  show(PRESETS.find(p => $(`[data-preset="${p.key}"][aria-pressed="true"]`, box)));

  btns.forEach(b => b.addEventListener('click', () => {
    const pr = PRESETS.find(p => p.key === b.dataset.preset);
    btns.forEach(o => o.setAttribute('aria-pressed', o === b));
    show(pr);
    document.dispatchEvent(new CustomEvent('typhoon:paint', {
      detail: { model: b.dataset.model, body: pr.body, accent: pr.accent },
    }));
  }));
});

/* ════════════════════════════════════════════════════════ CLIENTS ═══════ */

(function clients() {
  const s = $('.clients');
  $('.eyebrow', s).textContent = CLIENTS.eyebrow;
  $('.h2', s).textContent = CLIENTS.title;
  $('.lede', s).textContent = CLIENTS.sub;
  const cta = $('.clients-cta', s);
  cta.textContent = CLIENTS.cta;
  cta.href = CLIENTS.ctaHref;

  $('.client-grid').innerHTML = CLIENTS.items.map(c => `
    <li class="client" data-rise>
      <div class="client-shot">
        <img src="img/clients/${c.key}.webp" alt="${c.name}"
             width="900" height="675" loading="lazy" decoding="async">
      </div>
      <div class="client-body">
        <img class="client-logo" src="img/clients/${c.key}-logo.webp" alt=""
             loading="lazy" decoding="async">
        <h3>${c.name}</h3>
        <p class="client-meta mono">
          <span>${c.country}</span>
          ${c.tags.map(t => `<b>${t}</b>`).join('')}
        </p>
      </div>
    </li>`).join('');
})();

/* The calculator's own logic lives in js/calculator.js — this only fills in
   the section label from content.js like every other block. */
$('.calc .eyebrow').textContent = CALC.eyebrow;

/* ════════════════════════════════════════════════════════════ FAQ ═══════ */

(function faq() {
  const s = $('.faq');
  $('.eyebrow', s).textContent = FAQ.eyebrow;
  $('.h2', s).textContent = FAQ.title;

  const tabs = $('.faq-tabs');
  const list = $('.faq-list');

  tabs.innerHTML = FAQ.groups.map((g, i) => `
    <button class="faq-tab" type="button" role="tab"
            data-i="${i}" aria-selected="${i === 0}">${g.name}</button>`).join('');

  /* Answers are rendered as <details> rather than a custom accordion: the
     browser already handles the open state, the keyboard and find-in-page. */
  const show = i => {
    list.innerHTML = FAQ.groups[i].qa.map(([q, a], n) => `
      <details${n === 0 ? ' open' : ''}>
        <summary><span>${q}</span><span class="ic"></span></summary>
        <p>${a}</p>
      </details>`).join('');
    $$('.faq-tab', tabs).forEach(b => b.setAttribute('aria-selected', +b.dataset.i === i));
  };

  $$('.faq-tab', tabs).forEach(b =>
    b.addEventListener('click', () => show(+b.dataset.i)));
  show(0);
})();

/* ════════════════════════════════════════════════════════ SERVICE ═══════ */

$('.svc-list').innerHTML = SERVICE.map(s => `
  <li data-rise><h3>${s.t}</h3><p>${s.d}</p></li>`).join('');

/* ══════════════════════════════════════════════════════ NEXT STEP ═══════ */

(function next() {
  $('.next-body').textContent = NEXT.body;
  $('.next-actions').innerHTML = NEXT.actions.map(a => `
    <a class="btn${a.primary ? '' : ' btn-ghost'}"
       href="mailto:${CTA.email}?subject=${encodeURIComponent(a.subject)}">${a.t}</a>`).join('');
})();

/* ════════════════════════════════════════════════════════ CONTACT ═══════ */

(function cta() {
  $('.cta-title').textContent = CTA.title;
  $('.cta .lede').textContent = CTA.sub;

  const [q, d] = $$('.cta-actions a');
  q.textContent = CTA.button;
  q.href = `mailto:${CTA.email}?subject=${encodeURIComponent('Typhoon PRO — quote request')}`;
  d.textContent = CTA.secondary;
  d.href = `mailto:${CTA.email}?subject=${encodeURIComponent('Typhoon PRO — demo roast')}`;

  $('.cta-meta').innerHTML = `
    <li><a href="mailto:${CTA.email}">${CTA.email}</a></li>
    <li><a href="tel:${CTA.phone.replace(/\s/g, '')}">${CTA.phone}</a></li>
    <li>${CTA.address}</li>`;

  $('#year').textContent = new Date().getFullYear();
})();

/* ═════════════════════════════════════════════════ SCROLL REVEALS ═══════ */

const riseObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    obs.unobserve(e.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

/* Stagger siblings so a grid does not pop in as one block. */
$$('[data-rise]').forEach(n => {
  const sibs = [...n.parentElement.children].filter(c => c.hasAttribute('data-rise'));
  const i = sibs.indexOf(n);
  if (i > 0) n.style.transitionDelay = `${Math.min(i, 5) * 70}ms`;
  riseObserver.observe(n);
});

/* Safety net. An IntersectionObserver only reports what it happened to
   observe: a fast jump — an anchor link, a restored scroll position, a
   trackpad fling — can carry an element through the viewport between two
   observation ticks and leave it permanently at opacity 0. Nothing on this
   page may stay invisible, so sweep for stragglers as well. */
let sweepQueued = false;
function sweep() {
  sweepQueued = false;
  const limit = innerHeight * 0.94;
  $$('[data-rise]:not(.in)').forEach(n => {
    if (n.getBoundingClientRect().top < limit) n.classList.add('in');
  });
}
addEventListener('scroll', () => {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(sweep);
}, { passive: true });
addEventListener('load', sweep);

/* ═════════════════════════════════════════════════════════════ NAV ══════ */

(function nav() {
  const bar = $('#nav');
  /* Any section that paints a dark background marks itself `data-dark`, and
     the nav flips to light-on-dark while it is over one. Two of them now —
     the hero photograph and the software chapter — so this reads the markup
     rather than naming a section. */
  const darks = $$('[data-dark]');

  const onScroll = () => {
    bar.classList.toggle('stuck', scrollY > 40);
    const y = 56;                                  // the nav's own midline
    bar.classList.toggle('on-dark',
      darks.some(d => {
        const r = d.getBoundingClientRect();
        return r.top <= y && r.bottom >= y;
      }));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
/* ═══════════════════════════════════════════ AUTO-REPEAT ANIMATION ══════ */
/*
   A roast, drawn the way roasting software draws one: the reference profile
   as a ghost line, the live roast tracking it, power and airflow on their own
   strip underneath, the stage bar advancing, and the batch counter climbing —
   which is the actual claim, that nothing has to cool down in between.

   Every curve is smooth by construction. The bean profile is defined once,
   with zero slope at the turning point, and **rate of rise is its numerical
   derivative** rather than a second hand-drawn line. That is what keeps the
   two consistent: a kink in one would have to be a kink in the other, and
   there are none in either.
*/

(function autoRepeat() {
  const svg   = $('.repeat-svg');
  const tabs  = $$('.repeat-tabs button');
  const desc  = $('.repeat-desc');
  const stageBar = $('.repeat-stages');
  const out   = Object.fromEntries(
    $$('[data-r]').map(n => [n.dataset.r, n]));

  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const smooth = u => { const c = clamp01(u); return c * c * (3 - 2 * c); };

  /* ---- the roast -------------------------------------------------------
     Seven minutes, which is what the machine actually does. */
  const TP_T   = 1.05;      // turning point
  const FC_T   = 5.50;      // first crack
  const DROP_T = 6.75;      // drop
  const T_MAX  = 7.5;       // minutes on the axis

  const CHARGE = 180, TP_C = 88, END_C = 205;
  const AIR_0 = 200, AIR_MIN = 168, AIR_END = 210, AIR_T = 1.30;

  /* The rise is defined by its rate of rise and then integrated, rather than
     drawn as a shape and differentiated afterwards. Getting this the right
     way round is what makes both lines behave: a rate that starts at zero,
     swells shortly after the turning point and decays towards the drop is
     what a roast does, and its integral is automatically the smooth S the
     bean curve is supposed to be.

         ror(s) = A · (1 − e^(−s/τ₁)) · e^(−s/τ₂)      s = minutes past TP

     τ₁ sets how fast the rate comes up off the turning point, τ₂ how it
     falls away. A is solved below so the integral lands exactly on END_C. */
  const T1 = 0.45, T2_ = 2.9;
  const SPAN = DROP_T - TP_T;
  const integ = s =>
    T2_ * (1 - Math.exp(-s / T2_)) -
    (T1 * T2_ / (T1 + T2_)) * (1 - Math.exp(-s * (1 / T1 + 1 / T2_)));
  const A_ROR = (END_C - TP_C) / integ(SPAN);

  /* Both halves meet the turning point with zero slope, so the minimum is a
     round bottom rather than a V. A piecewise curve joined at a value but not
     at a slope is exactly what a chart reads as "sharp corner". */
  const beanAt = t => {
    if (t <= TP_T) {
      return TP_C + (CHARGE - TP_C) * Math.pow((TP_T - t) / TP_T, 1.75);
    }
    return TP_C + A_ROR * integ(t - TP_T);
  };

  const airAt = t => {
    if (t <= AIR_T) {
      return AIR_MIN + (AIR_0 - AIR_MIN) * Math.pow((AIR_T - t) / AIR_T, 2);
    }
    const v = clamp01((t - AIR_T) / (DROP_T - AIR_T));
    return AIR_MIN + (AIR_END - AIR_MIN) * Math.pow(Math.sin(v * Math.PI / 2), 1.5);
  };

  /* Rate of rise is the exact derivative of the curve above, not a second
     hand-drawn line — a kink in one would have to be a kink in the other,
     and there are none in either. Read from the turning point on, because
     before it the beans are still losing heat and no roaster reads RoR
     there. */
  const rorAt = s0 => {
    const s = s0 - TP_T;
    return A_ROR * (1 - Math.exp(-s / T1)) * Math.exp(-s / T2_);
  };

  /* Power and airflow ramp over ~9 seconds rather than jumping. A heater
     cannot make a right angle and neither should the chart. */
  const RAMP = 0.16;
  const POWER = [[0, 95], [2.20, 78], [3.90, 88], [5.60, 62]];
  const FAN   = [[0, 96], [1.70, 88], [3.80, 92], [5.40, 86]];
  const stepAt = (steps, t) => {
    let v = steps[0][1];
    for (let i = 1; i < steps.length; i++) {
      v += (steps[i][1] - steps[i - 1][1]) *
           smooth((t - steps[i][0] + RAMP / 2) / RAMP);
    }
    return v;
  };

  const EVENTS = [
    { t: 0,      label: 'Charge' },
    { t: TP_T,   label: 'Turn point' },
    { t: FC_T,   label: 'First crack' },
    { t: DROP_T, label: 'Drop' },
  ];

  /* ---- plot geometry ----------------------------------------------------
     Two panels, like every roasting log: temperatures on top, the settings
     that produced them underneath. Overlaying the two was what pushed the
     step lines into the event labels. */
  const L = 64, R = 856;
  const T = 30,  B = 292;                 // temperature panel
  const T2 = 336, B2 = 416;               // power / airflow strip

  const C_MAX = 250;                      // °C, left axis
  const ROR_MAX = 40;                     // °C/min, right axis

  const x  = t => L + (t / T_MAX) * (R - L);
  const y  = c => B - (c / C_MAX) * (B - T);
  const yR = r => B - (r / ROR_MAX) * (B - T);
  const yP = p => B2 - (p / 112) * (B2 - T2);   // 112 leaves headroom at 100%

  const SAMPLES = 360;
  const pathOf = (fn, from, to, map, jitter = 0) => {
    let d = '';
    for (let i = 0; i <= SAMPLES; i++) {
      const t = from + (i / SAMPLES) * (to - from);
      const v = fn(t) + (jitter ? wobble(t, jitter) : 0);
      d += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + map(v).toFixed(1);
    }
    return d;
  };

  /* Deterministic per-batch wobble. Low frequencies only: anything faster
     than a couple of cycles a minute reads as noise on the line rather than
     as a roast. */
  let seed = 1;
  const wobble = (t, amp) =>
    amp * (Math.sin(t * 2.3 + seed * 2.1) * 0.62 +
           Math.sin(t * 5.1 + seed * 1.3) * 0.38);

  /* ---- furniture -------------------------------------------------------- */
  const g = mk('g', {});
  svg.append(g);

  const GRID = 'rgba(255,255,255,.075)';
  const AXIS = '#7b939c';
  const mono = 'JetBrains Mono, monospace';

  const label = (tx, ty, txt, fill = AXIS, anchor = 'start', size = 11) => {
    const n = mk('text', {
      x: tx, y: ty, fill, 'font-size': size,
      'text-anchor': anchor, 'font-family': mono,
    });
    n.textContent = txt;
    g.append(n);
    return n;
  };

  // temperature panel: horizontal grid + both axes
  for (let c = 0; c <= C_MAX; c += 50) {
    g.append(mk('line', { x1: L, x2: R, y1: y(c), y2: y(c), stroke: GRID, 'stroke-width': 1 }));
    label(L - 10, y(c) + 4, c, AXIS, 'end');
  }
  for (let r = 0; r <= ROR_MAX; r += 10) label(R + 10, yR(r) + 4, r, '#9d8a4e');

  // time grid across both panels
  for (let t = 0; t <= 7; t++) {
    g.append(mk('line', { x1: x(t), x2: x(t), y1: T,  y2: B,  stroke: GRID, 'stroke-width': 1 }));
    g.append(mk('line', { x1: x(t), x2: x(t), y1: T2, y2: B2, stroke: GRID, 'stroke-width': 1 }));
    label(x(t), B2 + 20, `0${t}:00`, AXIS, 'middle');
  }

  // power strip frame
  g.append(mk('line', { x1: L, x2: R, y1: B2, y2: B2, stroke: 'rgba(255,255,255,.16)', 'stroke-width': 1 }));
  g.append(mk('line', { x1: L, x2: R, y1: T2, y2: T2, stroke: GRID, 'stroke-width': 1 }));
  label(L - 10, yP(100) + 4, '100', AXIS, 'end');
  label(L - 10, yP(0)   + 4, '0',   AXIS, 'end');

  label(L - 10, T - 12, '°C',      AXIS, 'end');
  label(R + 10, T - 12, 'RoR',  '#9d8a4e');
  label(L - 10, T2 - 12, '%',      AXIS, 'end');

  // event markers
  const evGroup = mk('g', {});
  EVENTS.forEach(e => {
    evGroup.append(mk('line', {
      x1: x(e.t), x2: x(e.t), y1: T, y2: B2,
      stroke: 'rgba(255,255,255,.30)', 'stroke-width': 1, 'stroke-dasharray': '2 4',
    }));
    const n = mk('text', {
      x: x(e.t) + 6, y: T + 12, fill: '#b7cdd4',
      'font-size': 11, 'font-family': mono,
    });
    n.textContent = e.label;
    evGroup.append(n);
  });
  g.append(evGroup);

  const line = (d, stroke, w = 1.8, extra = {}) => {
    const p = mk('path', {
      d, stroke, fill: 'none', 'stroke-width': w,
      'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...extra,
    });
    g.append(p);
    return p;
  };

  const C = {
    bean: '#5f9dff', air: '#e2503c', ror: '#e8c33d',
    power: '#4bbf73', fan: '#9b7be8', head: '#9ad9ff',
  };

  // reference (ghost) profile — the target the machine is holding
  const ghost = line(pathOf(beanAt, 0, DROP_T, y), C.bean, 6,
                     { opacity: .16, 'stroke-linecap': 'round' });

  const pPower = line(pathOf(t => stepAt(POWER, t), 0, DROP_T, yP), C.power, 1.9);
  const pFan   = line(pathOf(t => stepAt(FAN, t),   0, DROP_T, yP), C.fan,   1.9);
  const pRor   = line(pathOf(rorAt, TP_T, DROP_T, yR), C.ror, 1.7);
  const pAir   = line(pathOf(airAt, 0, DROP_T, y), C.air, 1.9);

  // playhead + head dot
  const head = mk('line', { x1: L, x2: L, y1: T, y2: B2, stroke: C.head, 'stroke-width': 1.2, opacity: 0 });
  const dot  = mk('circle', { r: 4.5, fill: C.head, opacity: 0 });
  g.append(head, dot);

  // legend
  const LEGEND = [['Bean', C.bean, 'bean'], ['Air', C.air, 'air'],
                  ['RoR', C.ror, 'bean'], ['Power', C.power, 'power'],
                  ['Fan', C.fan, 'fan']];
  const legend = mk('g', {});
  LEGEND.forEach(([txt, colour, key], i) => {
    const lx = L + i * 100, ly = B2 + 44;
    legend.append(mk('rect', { x: lx, y: ly - 7, width: 16, height: 2.5, fill: colour, rx: 1.2 }));
    const n = mk('text', { x: lx + 24, y: ly, fill: '#93aab2', 'font-size': 12, 'font-family': mono });
    n.textContent = txt;
    n.dataset.key = key;
    legend.append(n);
  });
  g.append(legend);

  /* ---- the live line: revealed by dash offset --------------------------- */
  const live = line('', C.bean, 2.4);
  let liveLen = 0;

  const newBatch = () => {
    seed += 1.7;
    live.setAttribute('d', pathOf(beanAt, 0, DROP_T, y, 1.1));
    liveLen = live.getTotalLength();
    live.style.strokeDasharray = liveLen;
    live.style.strokeDashoffset = liveLen;
  };
  newBatch();

  /* ---- mode highlighting ------------------------------------------------ */
  const DIM = .34;
  let mode = SOFTWARE.modes[0];

  function applyMode(m) {
    mode = m;
    desc.textContent = m.long;
    const on = new Set(m.highlight);
    const set = (p, key) => p.setAttribute('opacity', on.has(key) ? 1 : DIM);
    set(pPower, 'power');
    set(pFan,   'fan');
    set(pAir,   'air');
    set(pRor,   'bean');
    ghost.setAttribute('opacity', on.has('bean') ? .3 : .16);
    [...legend.querySelectorAll('text')].forEach(n =>
      n.setAttribute('opacity', on.has(n.dataset.key) ? 1 : .42));
    tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m.key));
  }
  tabs.forEach(b => b.addEventListener('click', () =>
    applyMode(SOFTWARE.modes.find(m => m.key === b.dataset.mode))));
  applyMode(mode);

  /* ---- stage bar -------------------------------------------------------- */
  const STAGES = [
    { name: 'Prepare',   until: 0.6 },
    { name: 'Ready',     until: 1.1 },
    { name: 'Loading',   until: 1.7 },
    { name: 'Roasting',  until: 8.4 },
    { name: 'Unloading', until: 9.1 },
    { name: 'Cooling',   until: 10.5 },
  ];
  const CYCLE = STAGES.at(-1).until;
  const ROAST_FROM = 1.7, ROAST_TO = 8.4;

  stageBar.innerHTML = STAGES.map(s => `<span>${s.name}</span>`).join('');
  const stageEls = $$('span', stageBar);

  /* ---- the loop --------------------------------------------------------- */
  let batch = 1, t0 = 0, raf = 0, running = false;

  const mmss = min => {
    const s = Math.max(0, Math.round(min * 60));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };
  const dtrAt = t => (((t - FC_T) / t) * 100).toFixed(1) + ' %';

  function frame(now) {
    if (!running) return;
    if (!t0) t0 = now;
    const e = ((now - t0) / 1000) % CYCLE;

    if (e < 0.05 && liveLen && live.style.strokeDashoffset === '0px') newBatch();

    let si = STAGES.findIndex(s => e < s.until);
    if (si < 0) si = STAGES.length - 1;
    stageEls.forEach((n, i) => {
      n.classList.toggle('on', i === si);
      n.classList.toggle('done', i < si);
    });

    if (e >= ROAST_FROM && e <= ROAST_TO) {
      const p = (e - ROAST_FROM) / (ROAST_TO - ROAST_FROM);
      const rt = p * DROP_T;
      live.style.strokeDashoffset = `${liveLen * (1 - p)}px`;

      head.setAttribute('opacity', .5);
      head.setAttribute('x1', x(rt)); head.setAttribute('x2', x(rt));
      dot.setAttribute('opacity', 1);
      dot.setAttribute('cx', x(rt)); dot.setAttribute('cy', y(beanAt(rt)));

      out.stage.textContent = `Roasting ${mmss(rt)}`;
      out.bean.textContent  = `${beanAt(rt).toFixed(1)} °C`;
      out.dtr.textContent   = rt > FC_T ? dtrAt(rt) : '—';
      out.dev.textContent   = `${Math.abs(wobble(rt, 1.1)).toFixed(1)} °C`;
    } else {
      head.setAttribute('opacity', 0);
      dot.setAttribute('opacity', 0);
      out.stage.textContent = STAGES[si].name;
      if (e < ROAST_FROM) {
        live.style.strokeDashoffset = `${liveLen}px`;
        out.bean.textContent = '—';
        out.dtr.textContent  = '—';
        out.dev.textContent  = '—';
      } else {
        live.style.strokeDashoffset = '0px';
        out.bean.textContent = `${beanAt(DROP_T).toFixed(1)} °C`;
        out.dtr.textContent  = dtrAt(DROP_T);
      }
      if (e > CYCLE - 0.1 && out.batch.dataset.n !== String(batch + 1)) {
        batch += 1;
        out.batch.dataset.n = String(batch);
        out.batch.textContent = batch;
      }
    }
    raf = requestAnimationFrame(frame);
  }

  /* Only animate while it is on screen. */
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !reduced) {
      if (!running) { running = true; t0 = 0; raf = requestAnimationFrame(frame); }
    } else {
      running = false;
      cancelAnimationFrame(raf);
    }
  }, { threshold: 0.15 }).observe($('.repeat-stage'));

  /* Reduced motion: show the finished roast, no loop. */
  if (reduced) {
    live.style.strokeDashoffset = '0px';
    stageEls[3].classList.add('on');
    out.stage.textContent = `Roasting ${mmss(DROP_T)}`;
    out.bean.textContent = `${beanAt(DROP_T).toFixed(1)} °C`;
    out.dtr.textContent  = dtrAt(DROP_T);
    out.dev.textContent  = '0.4 °C';
  }
})();

/* Hero lines animate in once the page has painted. */
addEventListener('load', () => $('.hero').classList.add('ready'), { once: true });
requestAnimationFrame(() => requestAnimationFrame(() =>
  $('.hero').classList.add('ready')));
