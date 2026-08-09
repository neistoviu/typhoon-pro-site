/* ---------------------------------------------------------------------------
   Builds the page from content.js, then runs everything that is not 3D:
   scroll reveals, the nav, the spec disclosures and the auto-repeat animation.
--------------------------------------------------------------------------- */

import { SITE, NAV, MODEL_UI, MODELS, HERO, QUIZ, PRESETS, SOFTWARE, COMPARE,
         CLIENTS, TRY, CALCULATOR, FAQ, SERVICE, NEXT, CTA, FORM,
         FOOTER } from './content.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const leadContext = {};

const track = (name, detail = {}) => {
  const payload = { event: name, ...detail };
  window.dataLayer?.push(payload);
  window.posthog?.capture?.(name, detail);
  document.dispatchEvent(new CustomEvent('typhoon:analytics', { detail: payload }));
};

/* ═══════════════════════════════════════════════ SITE + NAVIGATION ═════ */

(function siteChrome() {
  document.title = SITE.title;
  $('meta[name="description"]').content = SITE.description;
  $('meta[property="og:title"]').content = SITE.title;
  $('meta[property="og:description"]').content = SITE.description;
  $('.nav-brand img').alt = SITE.logoAlt;
  $('.nav-brand span').textContent = NAV.seriesLabel;
  $('.hero-media img').alt = SITE.heroImageAlt;

  const heroVideo = $('.hero-video');
  const hero = $('.hero');
  const heroVideoMedia = matchMedia(SITE.mobileHeroVideo.media);
  heroVideo.poster = SITE.mobileHeroVideo.poster;
  heroVideo.style.setProperty('--hero-video-position', SITE.mobileHeroVideo.position);
  hero.style.setProperty('--hero-mobile-transition', SITE.mobileHeroVideo.transitionColor);

  const loadHeroVideo = () => {
    if (!heroVideoMedia.matches || reduced || heroVideo.dataset.loaded) return;
    heroVideo.dataset.loaded = 'true';
    heroVideo.src = SITE.mobileHeroVideo.src;
    heroVideo.load();
    heroVideo.play().catch(() => {
      /* The poster remains visible when a browser blocks autoplay. */
    });
  };

  heroVideo.addEventListener('loadeddata', () => heroVideo.classList.add('ready'));
  heroVideo.addEventListener('ended', () => {
    heroVideo.pause();
    heroVideo.classList.add('held');
  });
  heroVideo.addEventListener('error', () => {
    heroVideo.classList.add('failed');
    hero.classList.add('video-failed');
  });
  heroVideoMedia.addEventListener('change', loadHeroVideo);
  loadHeroVideo();

  const link = item => `<a href="${item.href}">${item.label}</a>`;
  $('.nav-links').innerHTML = NAV.items.map(link).join('');
  $('.nav-links').setAttribute('aria-label', NAV.primaryLabel);
  $('.nav-cta').textContent = NAV.cta;

  const more = $('.nav-more');
  const moreToggle = $('.nav-more-toggle', more);
  const moreMenu = $('.nav-more-menu', more);
  moreToggle.textContent = NAV.largerLabel;
  moreMenu.innerHTML = SITE.fullRange.map(link).join('');

  const menuToggle = $('.nav-menu-toggle');
  $('span', menuToggle).textContent = NAV.menuLabel;
  const mobile = $('.nav-mobile');
  $('.nav-mobile-links').setAttribute('aria-label', NAV.mobileLabel);
  $('.nav-mobile-links').innerHTML = [
    ...NAV.items.map(link),
    `<span class="nav-mobile-label">${NAV.largerLabel}</span>`,
    ...SITE.fullRange.map(link),
    `<button class="btn" type="button" data-lead-intent="pricing" data-source-section="mobile_navigation">${NAV.cta}</button>`,
  ].join('');

  const closeMore = () => {
    moreToggle.setAttribute('aria-expanded', 'false');
    moreMenu.hidden = true;
  };
  moreToggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = moreMenu.hidden;
    moreMenu.hidden = !open;
    moreToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!more.contains(e.target)) closeMore(); });

  const setMobile = open => {
    mobile.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    $('span', menuToggle).textContent = open ? NAV.closeLabel : NAV.menuLabel;
    document.body.classList.toggle('menu-open', open);
  };
  menuToggle.addEventListener('click', () => setMobile(mobile.hidden));
  $('.nav-mobile-links').addEventListener('click', e => {
    if (e.target.closest('a,button')) setMobile(false);
  });
  addEventListener('resize', () => { if (innerWidth > 860) setMobile(false); }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════ HERO ═══════ */

(function hero() {
  $('.hero .eyebrow').textContent = HERO.eyebrow;
  $('.hero-title').innerHTML = HERO.title
    .map(l => `<span class="ln"><i>${l}</i></span>`).join('');
  $('.hero-sub').textContent = HERO.sub;
  const primary = $('.hero-actions button');
  const secondary = $('.hero-actions a');
  primary.textContent = HERO.cta;
  secondary.textContent = HERO.ctaSecondary;
  $('.scroll-hint').insertAdjacentHTML('afterbegin', HERO.scrollHint);
  $('.hero-badges').innerHTML = HERO.badges.map(x => `<li>${x}</li>`).join('');
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

    /* The ways in are the same three every time — a recommendation is only
       useful next to the thing you do about it. */
    const ways = NEXT.actions.map(a => `
      <button class="btn btn-ghost" type="button" data-lead-intent="${a.intent}"
              data-source-section="model_finder">${a.t}</button>`).join('');

    const side = lead => `
      <div class="quiz-side">
        ${lead}
        ${ways}
        <p class="quiz-note">${NEXT.body}</p>
        <button class="quiz-again mono" type="button">${QUIZ.again}</button>
      </div>`;

    if (key === 'bigger') {
      const b = QUIZ.bigger;
      out.innerHTML = `
        <div class="quiz-main">
          <p class="quiz-result-label mono">${QUIZ.resultLabel}</p>
          <h3 class="quiz-result-name">${b.name}</h3>
          <p class="quiz-result-lead">${b.lead}</p>
          <p class="quiz-result-body">${b.body}</p>
        </div>
        ${side(`<div class="quiz-large-links">${b.links.map(x =>
          `<a class="btn" href="${x.href}">${x.label}</a>`).join('')}</div>`)}`;
    } else {
      const m = MODELS.find(x => x.key === key);
      leadContext.model = m.name;
      out.innerHTML = `
        <div class="quiz-main">
          <p class="quiz-result-label mono">${QUIZ.resultLabel}</p>
          <h3 class="quiz-result-name">${m.name}</h3>
          <p class="quiz-result-lead">${m.lead}</p>
          <p class="quiz-result-body">${m.body}</p>
          <dl class="quiz-figures">
            <div><dt class="mono">${MODEL_UI.replacesLabel}</dt><dd>${m.replaces.replace('Replaces a ', '')}</dd></div>
            <div><dt class="mono">${MODEL_UI.outputLabel}</dt><dd>${m.stats[0].v} ${m.stats[0].u}</dd></div>
            <div><dt class="mono">${MODEL_UI.batchesLabel}</dt><dd>${m.stats[1].v} / hour</dd></div>
          </dl>
        </div>
        ${side(`<a class="btn" href="#m-${m.key}">See the ${m.name.replace('Typhoon ', '')}</a>
          <button class="btn btn-ghost" type="button" data-lead-intent="pricing"
                  data-lead-model="${m.name}" data-source-section="model_finder_result">${QUIZ.cta}</button>`)}`;
    }

    out.hidden = false;
    const again = $('.quiz-again', out);
    if (again) again.addEventListener('click', () => {
      delete picked.status; delete picked.volume;
      $$('.quiz-opt', body).forEach(b => b.setAttribute('aria-pressed', 'false'));
      out.hidden = true;
      s.scrollIntoView({ block: 'start' });
    });
    track('model_finder_result', { model: key, status: picked.status || '', volume: picked.volume || '' });
  }

  $$('.quiz-opt', body).forEach(btn => btn.addEventListener('click', () => {
    const { q, v } = btn.dataset;
    picked[q] = v;
    leadContext[q] = v;
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

  const specs = m.specs.map((g, gi) => `
    <details${gi === 0 ? ' open' : ''}>
      <summary>${g.group}<span class="ic"></span></summary>
      <dl>${g.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </details>`).join('');

  const tabs = MODEL_UI.tabs.map((tab, ti) => `
    <button class="model-tab" id="model-${m.key}-tab-${tab.key}" type="button"
            role="tab" data-model-tab="${tab.key}"
            aria-controls="model-${m.key}-panel-${tab.key}"
            aria-selected="${ti === 0}" tabindex="${ti === 0 ? '0' : '-1'}">
      ${tab.label}
    </button>`).join('');

  /* The compact setup view reuses only the spec rows selected in content.js,
     so its editable labels and values are never duplicated in the renderer. */
  const modelSpecRows = m.specs.flatMap(group => group.rows);
  const fitRows = MODEL_UI.fitSpecLabels
    .map(label => modelSpecRows.find(([rowLabel]) => rowLabel === label))
    .filter(Boolean);
  const dimensionDrawings = m.dimensionDrawings.map(drawing => `
    <img src="${drawing.src}" alt="${drawing.alt}"
         width="${drawing.width}" height="${drawing.height}"
         loading="lazy" decoding="async">`).join('');
  const playVideoLabel = MODEL_UI.playVideoLabel.replace('{model}', m.name);

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
    : `<div class="price-tag"><span class="p">${MODEL_UI.priceOnRequest}</span><span class="n">${m.priceNote}</span></div>`;

  return `
  <section class="chapter" id="m-${m.key}" data-model="${m.key}">
    <div class="chapter-inner">
      <div class="chapter-stage">
        <div class="chapter-void"></div>
        <p class="model-load-status mono" aria-live="polite">${MODEL_UI.loading3d}</p>
        <div class="presets" data-rise>
          <span class="presets-label mono">${MODEL_UI.colourLabel}</span>
          <div class="swatches" role="group" aria-label="${MODEL_UI.colourGroupLabel}">${swatches}</div>
          <span class="presets-name mono"></span>
        </div>
      </div>
      <div class="chapter-panel">
        <p class="chapter-tag mono" data-rise>
          <b>${String(i + 1).padStart(2, '0')} / ${String(MODELS.length).padStart(2, '0')}</b>
          <span>${m.replaces}</span>
        </p>
        <h2 class="chapter-name" data-rise>${m.name}</h2>
        <div class="model-tabs mono" role="tablist" aria-label="${MODEL_UI.tabsLabel}" data-rise>
          ${tabs}
        </div>

        <div class="model-pages" data-model-pages>
          <section class="model-page" id="model-${m.key}-panel-overview"
                   role="tabpanel" data-model-view="overview"
                   aria-labelledby="model-${m.key}-tab-overview">
            <p class="chapter-lead">${m.lead}</p>
            <p class="chapter-body">${m.body}</p>
            <div class="stat-row">${stats}</div>
            <div class="model-choice-actions">
              <button class="btn" type="button" data-lead-intent="pricing"
                      data-lead-model="${m.name}" data-source-section="model_overview">
                ${MODEL_UI.readyLabel}
              </button>
            </div>
          </section>

          <section class="model-page" id="model-${m.key}-panel-specs"
                   role="tabpanel" data-model-view="specs"
                   aria-labelledby="model-${m.key}-tab-specs" hidden>
            <div class="specs">${specs}</div>
            <div class="model-panel-cta">
              <button class="btn btn-sm" type="button" data-lead-intent="pricing"
                      data-lead-model="${m.name}" data-source-section="model_tech_specs">
                ${MODEL_UI.quoteLabel}
              </button>
            </div>
          </section>

          <section class="model-page" id="model-${m.key}-panel-fit"
                   role="tabpanel" data-model-view="fit"
                   aria-labelledby="model-${m.key}-tab-fit" hidden>
            <div class="model-fit-copy">
              <p class="model-section-label mono">${MODEL_UI.bestFitLabel}</p>
              <p>${m.forWhom}</p>
            </div>
            <div>
              <p class="model-section-label mono">${MODEL_UI.installationLabel}</p>
              <dl class="fit-facts">
                ${fitRows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
              </dl>
            </div>
            <figure class="model-drawing">
              <div class="model-drawing-grid">${dimensionDrawings}</div>
            </figure>
            <div class="chapter-actions">
              ${price}
              <button class="btn btn-sm" type="button" data-lead-intent="pricing"
                      data-lead-model="${m.name}" data-source-section="model_fit_setup">
                ${MODEL_UI.quoteLabel}
              </button>
            </div>
          </section>

          <section class="model-page" id="model-${m.key}-panel-video"
                   role="tabpanel" data-model-view="video"
                   aria-labelledby="model-${m.key}-tab-video" hidden>
            <div class="model-video-shell">
              <button class="model-video-poster" type="button" data-video-play
                      data-video-id="${m.video.id}" aria-label="${playVideoLabel}">
                <img alt="" width="480" height="360" loading="lazy" decoding="async"
                     data-video-thumb data-src="https://i.ytimg.com/vi/${m.video.id}/hqdefault.jpg">
                <span class="model-video-overlay">
                  <span class="model-video-play-icon" aria-hidden="true"></span>
                  <span>${m.video.title}</span>
                </span>
              </button>
              <iframe class="model-video-frame" data-video-frame hidden
                      title="${m.video.title}"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div class="model-video-copy">
              <p>${m.video.note}</p>
              <a href="${m.video.url}" target="_blank" rel="noopener">${MODEL_UI.watchOnYouTubeLabel}</a>
            </div>
            <p class="model-video-load-note mono">${MODEL_UI.videoLoadNote}</p>
          </section>
        </div>

        <div class="model-view-footer mono" data-rise>
          <span class="model-view-status" aria-live="polite">01 / ${String(MODEL_UI.tabs.length).padStart(2, '0')} · ${MODEL_UI.tabs[0].label}</span>
        </div>
      </div>
    </div>
  </section>`;
}).join('');

/* Vertical scroll changes the model. Tabs and a deliberate phone swipe change
   the information shown for that model. The mouse wheel is never
   remapped horizontally, so reading a specification cannot rotate the roaster
   instead of scrolling the text. */
$$('.chapter').forEach(ch => {
  const tabs = $$('[data-model-tab]', ch);
  const pages = $$('[data-model-view]', ch);
  const all = $$('details', ch);
  const status = $('.model-view-status', ch);
  const videoPlay = $('[data-video-play]', ch);
  const videoFrame = $('[data-video-frame]', ch);
  const videoThumb = $('[data-video-thumb]', ch);
  let activeIndex = 0;

  const prepareVideo = () => {
    if (!videoThumb.hasAttribute('src')) videoThumb.src = videoThumb.dataset.src;
  };
  const resetVideo = () => {
    if (!videoFrame.hasAttribute('src')) return;
    videoFrame.removeAttribute('src');
    videoFrame.hidden = true;
    videoPlay.hidden = false;
  };

  const syncOpenState = () => {
    const inSpecs = MODEL_UI.tabs[activeIndex]?.key === 'specs';
    const inFit = MODEL_UI.tabs[activeIndex]?.key === 'fit';
    ch.classList.toggle('specs-open', inSpecs && all.some(d => d.open));
    ch.classList.toggle('fit-open', inFit);
  };

  const showView = (key, { focusTab = false, source = 'tab', report = true } = {}) => {
    const nextIndex = MODEL_UI.tabs.findIndex(tab => tab.key === key);
    if (nextIndex < 0) return;
    const changed = nextIndex !== activeIndex;
    activeIndex = nextIndex;

    tabs.forEach((tab, index) => {
      const selected = index === activeIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    pages.forEach((page, index) => {
      const selected = index === activeIndex;
      page.hidden = !selected;
      page.classList.toggle('is-active', selected);
      if (selected && changed && !reduced) {
        page.classList.remove('model-page-enter');
        requestAnimationFrame(() => page.classList.add('model-page-enter'));
      }
    });

    ch.dataset.view = key;
    status.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(MODEL_UI.tabs.length).padStart(2, '0')} · ${MODEL_UI.tabs[activeIndex].label}`;
    if (key === 'video') prepareVideo();
    else resetVideo();
    syncOpenState();
    if (changed && report) {
      track('model_detail_view', { model: ch.dataset.model, view: key, source });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showView(tab.dataset.modelTab));
    tab.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next == null) return;
      e.preventDefault();
      showView(tabs[next].dataset.modelTab, { focusTab: true, source: 'keyboard' });
    });
  });

  videoPlay.addEventListener('click', () => {
    prepareVideo();
    videoFrame.src = `https://www.youtube-nocookie.com/embed/${videoPlay.dataset.videoId}?autoplay=1&rel=0`;
    videoFrame.hidden = false;
    videoPlay.hidden = true;
    track('model_video_play', { model: ch.dataset.model, video_id: videoPlay.dataset.videoId });
  });

  let touchStart = null;
  const pagesBox = $('[data-model-pages]', ch);
  pagesBox.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') touchStart = { x: e.clientX, y: e.clientY };
  }, { passive: true });
  pagesBox.addEventListener('pointerup', e => {
    if (!touchStart || e.pointerType !== 'touch') return;
    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const next = dx < 0
      ? (activeIndex + 1) % MODEL_UI.tabs.length
      : (activeIndex - 1 + MODEL_UI.tabs.length) % MODEL_UI.tabs.length;
    showView(MODEL_UI.tabs[next].key, { source: 'swipe' });
  }, { passive: true });
  pagesBox.addEventListener('pointercancel', () => { touchStart = null; }, { passive: true });

  all.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) all.forEach(o => { if (o !== d) o.open = false; });
    requestAnimationFrame(syncOpenState);
  }));
  showView(MODEL_UI.tabs[0].key, { report: false });
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
  cta.dataset.leadIntent = CLIENTS.ctaIntent;
  cta.dataset.sourceSection = 'client_references';

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

  const filters = $('.client-filters');
  filters.innerHTML = CLIENTS.filters.map((f, i) => `
    <button type="button" aria-pressed="${i === 0}" data-filter="${f}">${f}</button>`).join('');
  filters.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    const filter = button.dataset.filter;
    $$('button', filters).forEach(x => x.setAttribute('aria-pressed', String(x === button)));
    $$('.client', s).forEach((card, i) => {
      const client = CLIENTS.items[i];
      card.hidden = filter !== 'All' && !client.tags.includes(filter);
    });
    track('client_filter', { filter });
  });
})();

/* ═══════════════════════════════════════════════════════ SOFTWARE ═══════ */

(function software() {
  const s = $('.software');
  $('.wrap', s).innerHTML = `
    <div class="sw-head">
      <p class="eyebrow mono" data-rise></p>
      <h2 class="h2" data-rise></h2>
      <p class="lede" data-rise></p>
    </div>
    <div class="repeat" data-rise>
      <div class="repeat-head">
        <h3 class="h3">${SOFTWARE.repeat.title}</h3>
        <p>${SOFTWARE.repeat.body}</p>
      </div>
      <div class="repeat-tabs mono" role="tablist"></div>
      <div class="repeat-stage">
        <div class="repeat-chart">
          <svg class="repeat-svg" viewBox="0 0 900 470" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
        </div>
        <div class="repeat-side">
          <p class="repeat-desc"></p>
          <dl class="repeat-readout mono">
            ${SOFTWARE.repeat.readout.map(([key, label]) =>
              `<div><dt>${label}</dt><dd data-r="${key}">${SOFTWARE.repeat.initial[key]}</dd></div>`).join('')}
          </dl>
          <p class="repeat-note mono">${SOFTWARE.repeat.note}</p>
        </div>
      </div>
      <div class="repeat-stages mono"></div>
    </div>
    <ul class="sw-features"></ul>`;
  $('.eyebrow', s).textContent = SOFTWARE.eyebrow;
  $('.h2', s).textContent = SOFTWARE.title;
  $('.lede', s).textContent = SOFTWARE.sub;

  $('.sw-features').innerHTML = SOFTWARE.features.map(f => `
    <li data-rise><h4>${f.t}</h4><p>${f.d}</p></li>`).join('');

  $('.repeat-tabs').innerHTML = SOFTWARE.modes.map((m, i) => `
    <button role="tab" data-mode="${m.key}" aria-selected="${i === 0}">${m.name}</button>`).join('');
})();

/* ══════════════════════════════════════════════════════ COMPARISON ══════ */

(function compare() {
  $('.compare .h2').textContent = COMPARE.title;
  $('.cmp thead').innerHTML =
    `<tr><th></th><th>${COMPARE.headA}</th><th>${COMPARE.headB}</th></tr>`;
  $('.cmp tbody').innerHTML = COMPARE.rows
    .map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
})();

/* ════════════════════════════════════════════════════════ TRY IT ═══════ */

(function tryIt() {
  const s = $('.try');
  $('.wrap', s).innerHTML = `
    <div class="try-head">
      <p class="eyebrow mono" data-rise></p>
      <h2 class="h2" data-rise></h2>
    </div>
    <ul class="try-grid"></ul>`;
  $('.eyebrow', s).textContent = TRY.eyebrow;
  $('.h2', s).textContent = TRY.title;

  $('.try-grid').innerHTML = TRY.items.map(t => `
    <li class="try-card" data-rise>
      <div class="try-shot">
        <img src="img/try/${t.key}.webp" alt="${t.name}"
             width="900" height="675" loading="lazy" decoding="async">
      </div>
      <div class="try-body">
        <h3>${t.name}</h3>
        <p>${t.body}</p>
        <button class="btn btn-ghost" type="button" data-lead-intent="${t.key === 'online' ? 'demo' : t.key}"
                data-source-section="try_before_buying">${t.cta}</button>
      </div>
    </li>`).join('');
})();

/* ═════════════════════════════════════════════════════ CALCULATOR ═══════ */

(function calculator() {
  const s = $('.calc');
  const formulaId = key => `${key}Formula`;
  $('.wrap', s).innerHTML = `
    <div class="calc-top">
      <p class="eyebrow mono" data-rise>${CALCULATOR.eyebrow}</p>
      <h2 class="h2" data-rise>${CALCULATOR.titleBefore}<span id="headlineSavings"></span>${CALCULATOR.titleAfter}</h2>
      <p class="lede" data-rise>${CALCULATOR.sub}</p>
    </div>
    <div class="calc-grid" data-rise>
      <div class="calc-inputs">
        <h3 class="calc-h3">${CALCULATOR.setupTitle}</h3>
        <div class="calc-field">
          <div class="calc-field-head"><label for="batchRange">${CALCULATOR.machineLabel}</label><output id="batchValue"></output></div>
          <input class="calc-range" id="batchRange" type="range" aria-label="${CALCULATOR.machineLabel}">
          <div class="calc-ticks" id="batchTicks"></div>
        </div>
        <div class="calc-field">
          <div class="calc-field-head"><label for="monthlyRange">${CALCULATOR.volumeLabel}</label><output id="monthlyValue"></output></div>
          <input class="calc-range" id="monthlyRange" type="range" aria-label="${CALCULATOR.volumeLabel}">
          <div class="calc-scale"><span id="monthlyMin"></span><span id="monthlyUnitLabel"></span><span id="monthlyMax"></span></div>
        </div>
        <div class="calc-field">
          <p class="calc-h3">${CALCULATOR.currencyLabel}</p>
          <div class="calc-currency" role="group" aria-label="${CALCULATOR.currencyLabel}">
            ${CALCULATOR.currencies.map(c => `<button class="calc-cur-btn" id="${c.key.toLowerCase()}Btn" type="button">${c.label}</button>`).join('')}
          </div>
        </div>
        <button class="calc-link" id="calcOpen" type="button">${CALCULATOR.methodOpen}</button>
      </div>
      <div class="calc-results">
        <div class="calc-total">
          <span class="calc-total-label mono">${CALCULATOR.totalLabel}</span>
          <strong class="calc-total-value" id="monthlySavings"></strong>
          <span class="calc-total-vs mono">${CALCULATOR.totalVs}</span>
        </div>
        <div class="calc-breakdown">
          ${CALCULATOR.breakdown.map(x => `<div class="calc-row">
            <span class="calc-row-label">${x.label}</span>
            <span class="calc-bar"><i id="bar${x.key}"></i></span>
            <strong class="calc-row-value" id="val${x.key}"></strong>
          </div>`).join('')}
        </div>
        <p class="calc-disclaimer">${CALCULATOR.disclaimer}</p>
        <button class="btn calc-cta" type="button" data-lead-intent="roi" data-source-section="roi_calculator">${CALCULATOR.cta}</button>
      </div>
    </div>
    <div class="calc-modal" id="calcModal" aria-hidden="true">
      <div class="calc-modal-panel" role="dialog" aria-modal="true" aria-labelledby="calcTitle">
        <div class="calc-modal-head">
          <div><h2 class="h3" id="calcTitle">${CALCULATOR.method.title}</h2><p id="calcIntro">${CALCULATOR.method.intro}</p></div>
          <button class="calc-modal-close" id="calcClose" type="button">${CALCULATOR.methodClose}</button>
        </div>
        ${CALCULATOR.method.sections.map(x => `<section class="calc-section">
          <h3>${x.title}</h3><p>${x.body}</p>
          ${x.key === 'costs' ? '<ul class="calc-costs" id="defaultCostList"></ul>' : `<p class="calc-formula mono" id="${formulaId(x.key)}"></p>`}
        </section>`).join('')}
      </div>
    </div>`;
})();

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
    b.addEventListener('click', () => {
      show(+b.dataset.i);
      track('faq_tab', { category: FAQ.groups[+b.dataset.i].name });
    }));
  show(0);
})();

/* ════════════════════════════════════════════════════════ SERVICE ═══════ */

(() => {
  const s = $('.service');
  $('.wrap', s).innerHTML = `
    <div class="service-head">
      <p class="eyebrow mono" data-rise>${SERVICE.eyebrow}</p>
      <h2 class="h2" data-rise>${SERVICE.title}</h2>
      <p class="lede" data-rise>${SERVICE.sub}</p>
    </div>
    <ul class="svc-list">${SERVICE.items.map(item => `
      <li data-rise><h3>${item.t}</h3><p>${item.d}</p></li>`).join('')}</ul>`;
})();

/* ════════════════════════════════════════════════════════ CONTACT ═══════ */

(function formsAndContact() {
  const formMarkup = (prefix, modal = false) => `
    <form class="lead-form" data-lead-form="${prefix}" novalidate>
      <div class="lead-form-head">
        <p class="eyebrow mono">${CTA.eyebrow}</p>
        <h2 class="h3" ${modal ? 'id="modalFormTitle"' : ''}>${modal ? FORM.intents.pricing.title : FORM.title}</h2>
        <p>${FORM.sub}</p>
      </div>
      <div class="lead-fields">
        ${['name','email','phone'].map(key => `<label class="lead-field">
          <span>${FORM.fields[key].label}</span>
          <input type="${key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}" name="${key}"
            placeholder="${FORM.fields[key].placeholder}" autocomplete="${key === 'name' ? 'name' : key === 'email' ? 'email' : 'tel'}" required>
        </label>`).join('')}
        <fieldset class="lead-choice">
          <legend>${FORM.fields.status.label}</legend>
          <div>${FORM.fields.status.options.map((option, i) => `<label><input type="radio" name="current_status" value="${option}" ${i === 0 ? 'required' : ''}><span>${option}</span></label>`).join('')}</div>
        </fieldset>
        <label class="lead-field">
          <span>${FORM.fields.volume.label}</span>
          <select name="production_target" required><option value=""></option>${FORM.fields.volume.options.map(option => `<option>${option}</option>`).join('')}</select>
        </label>
        <label class="lead-field lead-message">
          <span>${FORM.fields.message.label}<small>${FORM.fields.message.optional}</small></span>
          <textarea name="message" placeholder="${FORM.fields.message.placeholder}" rows="3"></textarea>
        </label>
        <label class="lead-consent"><input type="checkbox" name="consent" required><span>${FORM.consent} <a href="${SITE.privacyUrl}" target="_blank" rel="noopener">${FORM.privacyLabel}</a></span></label>
        <input class="lead-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      </div>
      <button class="btn lead-submit" type="submit">${FORM.submit}</button>
      <p class="lead-response" aria-live="polite"></p>
    </form>`;

  $('[data-form-slot="inline"]').innerHTML = formMarkup('inline');
  $('[data-form-slot="modal"]').innerHTML = formMarkup('modal', true);

  $('.cta .eyebrow').textContent = CTA.eyebrow;
  $('.cta-title').textContent = CTA.title;
  $('.cta .lede').textContent = CTA.sub;
  $('.cta-meta').innerHTML = `
    <li><a href="mailto:${CTA.email}">${CTA.email}</a></li>
    <li><a href="tel:${CTA.phone.replace(/\s/g, '')}">${CTA.phone}</a></li>
    <li>${CTA.address}</li>`;

  const params = new URLSearchParams(location.search);
  const cookie = name => document.cookie.split('; ').find(x => x.startsWith(`${name}=`))?.split('=').slice(1).join('=') || '';
  const analyticsContext = () => ({
    utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '', utm_term: params.get('utm_term') || '',
    gclid: params.get('gclid') || '', ga_clientid: cookie('_ga'), ym_clientid: cookie('_ym_uid'),
    ph_distinct_id: window.posthog?.get_distinct_id?.() || '', page: location.href,
    referrer: document.referrer, locale: navigator.language,
  });

  const modal = $('#leadModal');
  const modalPanel = $('.lead-modal-panel', modal);
  const modalForm = $('[data-lead-form="modal"]');
  let lastFocus;

  const setFormIntent = (form, intent = 'pricing', model = '', source = '') => {
    const choice = FORM.intents[intent] || FORM.intents.pricing;
    form.dataset.intent = intent;
    form.dataset.model = model;
    form.dataset.sourceSection = source;
    const title = $('.lead-form-head .h3', form);
    const submit = $('.lead-submit', form);
    if (title) title.textContent = choice.title;
    submit.textContent = choice.submit;
  };
  setFormIntent($('[data-lead-form="inline"]'), 'pricing', '', 'contact');

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lastFocus?.focus();
  };
  const openModal = trigger => {
    lastFocus = trigger;
    const roi = trigger.dataset.leadIntent === 'roi' ? window.__typhoonCalculator?.getState?.() : null;
    leadContext.roi = roi || leadContext.roi;
    setFormIntent(modalForm, trigger.dataset.leadIntent, trigger.dataset.leadModel || leadContext.model || '', trigger.dataset.sourceSection || 'page');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => $('input[name="name"]', modalForm)?.focus());
    track('lead_form_open', { intent: modalForm.dataset.intent, model: modalForm.dataset.model, source_section: modalForm.dataset.sourceSection });
  };

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lead-intent]');
    if (trigger) { e.preventDefault(); openModal(trigger); }
  });
  $('.lead-modal-close').textContent = FORM.close;
  $('.lead-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  $$('[data-lead-form]').forEach(form => {
    let startedAt = Date.now();
    form.addEventListener('input', () => { if (!form.dataset.started) { form.dataset.started = 'true'; startedAt = Date.now(); track('lead_form_start', { placement: form.dataset.leadForm }); } }, { once: true });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const button = $('.lead-submit', form);
      const response = $('.lead-response', form);
      const data = Object.fromEntries(new FormData(form));
      const payload = {
        ...data, ...analyticsContext(), consent: data.consent === 'on',
        intent: form.dataset.intent || 'pricing', equipment: form.dataset.model || leadContext.model || '',
        source: FORM.source, source_section: form.dataset.sourceSection || form.dataset.leadForm,
        formId: `typhoon_pro_${form.dataset.leadForm}`, button_text: button.textContent,
        quiz_status: leadContext.status || '', quiz_volume: leadContext.volume || '',
        roi_inputs: leadContext.roi ? JSON.stringify(leadContext.roi) : '',
        form_started_at: new Date(startedAt).toISOString(),
        submission_id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      };
      const original = button.textContent;
      button.disabled = true;
      button.textContent = FORM.pending;
      response.textContent = '';
      try {
        const sent = await fetch(FORM.endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), keepalive: true,
        });
        if (!sent.ok) throw new Error(`HTTP ${sent.status}`);
        button.textContent = FORM.success;
        track('lead_form_submit', { intent: payload.intent, model: payload.equipment, source_section: payload.source_section });
        setTimeout(() => location.assign(FORM.successPage), 350);
      } catch (error) {
        console.error('[typhoon] lead form failed', error);
        button.disabled = false;
        button.textContent = original;
        response.innerHTML = `${FORM.error} <a href="mailto:${CTA.email}">${CTA.email}</a>`;
        track('lead_form_error', { intent: payload.intent, source_section: payload.source_section });
      }
    });
  });

  $('.foot-grid').innerHTML = `
    <span>© ${new Date().getFullYear()} ${FOOTER.copyright}</span>
    <span>${FOOTER.fullRangeLabel}: ${SITE.fullRange.map(x => `<a href="${x.href}">${x.label}</a>`).join(' · ')}</span>
    <a href="${SITE.privacyUrl}">${FOOTER.privacyLabel}</a>
    <a href="${SITE.mainSite}">${new URL(SITE.mainSite).hostname}</a>`;
})();

/* The Three.js code and the large model files are requested only when the
   visitor gets near the model chapters. The specifications and forms work
   even when WebGL or the model CDN is unavailable. */
(() => {
  let requested = false;
  const loadScene = () => {
    if (requested) return;
    requested = true;
    import('./scene.js').catch(error => {
      console.error('[typhoon] 3D module failed', error);
      $$('.model-load-status').forEach(n => n.textContent = MODEL_UI.unavailable3d);
    });
  };
  if (!('IntersectionObserver' in window)) return loadScene();
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(x => x.isIntersecting)) return;
    observer.disconnect();
    loadScene();
  }, { rootMargin: '140% 0px' });
  observer.observe($('#lineup'));
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
    { t: 0,      label: SOFTWARE.chart.events[0] },
    { t: TP_T,   label: SOFTWARE.chart.events[1] },
    { t: FC_T,   label: SOFTWARE.chart.events[2] },
    { t: DROP_T, label: SOFTWARE.chart.events[3] },
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

  label(L - 10, T - 12, SOFTWARE.chart.axis.temperature, AXIS, 'end');
  label(R + 10, T - 12, SOFTWARE.chart.axis.rateOfRise, '#9d8a4e');
  label(L - 10, T2 - 12, SOFTWARE.chart.axis.percent, AXIS, 'end');

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
  const LEGEND = SOFTWARE.chart.legend.map(item => [item.label, C[item.label.toLowerCase()] || C.ror, item.series]);
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

  /* ---- stage bar --------------------------------------------------------
     The machine's cycle is shown for context, but the animation stays on
     Roasting and loops there. Watching Prepare, Ready, Loading, Unloading
     and Cooling tick past was mostly dead time — the roast is the part
     worth looking at, and the batch counter still carries the claim that
     nothing has to cool down in between. */
  const STAGES = SOFTWARE.chart.stages;
  const ROASTING = 3;

  stageBar.innerHTML = STAGES.map(n => `<span>${n}</span>`).join('');
  const stageEls = $$('span', stageBar);
  stageEls.forEach((n, i) => {
    n.classList.toggle('on', i === ROASTING);
    n.classList.toggle('done', i < ROASTING);
  });

  /* ---- the loop --------------------------------------------------------- */
  const DRAW = 7.2;        // seconds to draw one roast
  const HOLD = 1.1;        // finished roast on screen before the next batch
  const CYCLE = DRAW + HOLD;

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

    if (e < DRAW) {
      /* a fresh batch the moment the previous one has finished being held */
      if (live.dataset.done === '1') {
        live.dataset.done = '';
        batch += 1;
        out.batch.textContent = batch;
        newBatch();
      }

      const p = e / DRAW;
      const rt = p * DROP_T;
      live.style.strokeDashoffset = `${liveLen * (1 - p)}px`;

      head.setAttribute('opacity', .5);
      head.setAttribute('x1', x(rt)); head.setAttribute('x2', x(rt));
      dot.setAttribute('opacity', 1);
      dot.setAttribute('cx', x(rt)); dot.setAttribute('cy', y(beanAt(rt)));

      out.stage.textContent = `${SOFTWARE.chart.roastingLabel} ${mmss(rt)}`;
      out.bean.textContent  = `${beanAt(rt).toFixed(1)} °C`;
      out.dtr.textContent   = rt > FC_T ? dtrAt(rt) : '—';
      out.dev.textContent   = `${Math.abs(wobble(rt, 1.1)).toFixed(1)} °C`;
    } else {
      /* held: the completed roast, sitting on the reference line */
      live.dataset.done = '1';
      live.style.strokeDashoffset = '0px';
      head.setAttribute('opacity', 0);
      dot.setAttribute('opacity', 1);
      dot.setAttribute('cx', x(DROP_T)); dot.setAttribute('cy', y(beanAt(DROP_T)));
      out.stage.textContent = `${SOFTWARE.chart.droppedLabel} ${mmss(DROP_T)}`;
      out.bean.textContent = `${beanAt(DROP_T).toFixed(1)} °C`;
      out.dtr.textContent  = dtrAt(DROP_T);
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
    out.stage.textContent = `${SOFTWARE.chart.droppedLabel} ${mmss(DROP_T)}`;
    out.bean.textContent = `${beanAt(DROP_T).toFixed(1)} °C`;
    out.dtr.textContent  = dtrAt(DROP_T);
    out.dev.textContent  = '0.4 °C';
  }
})();

/* Hero lines animate in once the page has painted. */
addEventListener('load', () => $('.hero').classList.add('ready'), { once: true });
requestAnimationFrame(() => requestAnimationFrame(() =>
  $('.hero').classList.add('ready')));
