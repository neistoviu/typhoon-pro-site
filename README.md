# Typhoon PRO — product site

A standalone page for the three PRO machines only: **2.5 PRO, 5 PRO, 10 PRO**.
The 20 and 30 kg machines have no local product sections. They remain outbound
links to their own pages on [typhoon.coffee](https://typhoon.coffee) in the
menu, footer and out-of-range finder result.

Static HTML, CSS and JavaScript on Three.js. No build step, no framework, no
bundler — the same shape as `typhoon-configurator/`.

---

## Files

| File | What it is |
|------|-----------|
| `index.html` | The page skeleton. Repeating blocks are filled in by `js/ui.js` |
| `js/content.js` | **Everything editable** — copy, specs, prices, software cards, contacts |
| `js/scene.js` | Three.js: loads the models and moves them with the scroll |
| `js/ui.js` | Builds the page from `content.js`, scroll reveals, spec disclosures, the auto-repeat animation |
| `css/style.css` | All styling |
| `models/*.glb` | The three machines, ~1 MB each |
| `img/hero/*.webp` | Opening image — separate desktop and mobile crops |
| `img/try/*.webp` | Photographs for the three "before you commit" cards |
| `img/clients/*.webp` | Client logos and photographs, pulled from typhoon.coffee |
| `js/calculator.js` | Savings calculator — arithmetic ported from `typhoon-roi-calculator/` |
| `worker/index.ts` | Static assets plus the same-origin `/api/lead` form relay |
| `thank-you.html` | Form success route, populated from `js/content.js` |
| `img/logo.svg` | Wordmark, ink-coloured, inverted by CSS on the dark section |

**To change wording, numbers or prices, edit `js/content.js`.** Nothing else
needs touching for a content change.

Everything from `package.json` down — `app/`, `build/`, `worker/`,
`next.config.ts`, `scripts/prepare-static.mjs`, `_headers`, `.openai/` — is a
deployment wrapper added separately, not part of the site. It copies
`css/ img/ js/ models/ index.html thank-you.html` into `public/` and changes none of them.

---

## The page, in order

| Section | id | Built by |
|---------|-----|---------|
| Hero — photograph, headline, badges | `#hero` | `HERO` |
| Model finder — two questions, one recommendation, three ways in | `#finder` | `QUIZ` + `NEXT` |
| Three machine chapters — 3D, specs, colour presets | `#lineup` | `MODELS` + `PRESETS` |
| Client references and model filters | `#clients` | `CLIENTS` |
| Comparison against a drum | `#compare` | `COMPARE` |
| Savings calculator | `#calc` | `CALCULATOR` + `js/calculator.js` |
| Software — the auto-repeat explainer and feature grid | `#software` | `SOFTWARE` |
| Service and onboarding | `#service` | `SERVICE` |
| Before you commit — samples, online session, showroom | `#try` | `TRY` |
| FAQ | `#faq` | `FAQ` |
| Contact and real lead form | `#contact` | `CTA` + `FORM` |

---

## Running it locally

Do not open `index.html` from the file system — the models are fetched over
HTTP and `file://` will block them.

```bash
npx serve "typhoon-pro-site" -l 8790
```

Then open <http://localhost:8790>.

---

## Prices

`MODELS[].price` in `js/content.js` is `null` for all three, so each machine
shows **"Price on request"** next to a quote button. Set it to a string to show
a figure instead:

```js
price: '€24,900',
priceNote: 'Ex-works Prague · shipping quoted separately',
```

Nothing else changes — the layout is the same either way. They were left empty
on purpose: there is no verified public PRO price list to publish from, and a
made-up number on a public page is worse than an ask.

---

## The models

Copied from `typhoon-configurator/dist-baked/`. The default paint (RAL 1015
ivory body, RAL 2002 vermilion accent) and every fixed-colour part are baked
in, so they need no config file and no recolouring code.

| File | Size |
|------|------|
| `typhoon-10pro.glb` | 1.4 MB |
| `typhoon-5pro.glb` | 1.1 MB |
| `typhoon-2pro.glb` | 968 KB |

Geometry is Draco-compressed, so the decoder is loaded from the CDN alongside
Three.js. To regenerate them after a CAD or colour change, follow
`typhoon-configurator/dist-baked/README.md`, then copy the three files here.

**A changed model must be given a new filename** — `vercel.json` marks
`/models/*` immutable for a year, so browsers will otherwise keep serving the
old one.

---

## How the scroll choreography works

One `<canvas>`, fixed, behind the whole page. Each model is loaded once, only
when its chapter is getting close to the viewport. This keeps the initial page
and phone download light without changing the choreography.

**Each machine belongs to one chapter and never leaves it.** There is no
opening line-up and no carousel: a machine rises into view with its section,
turns while that section is pinned, and leaves upward as the next arrives.
Scroll back and it returns exactly the way it left, because none of this is
animation state — position, size and angle are all functions of where the page
is. An earlier version slid the machines sideways between chapters and that
read as them crawling away whenever you scrolled back up.

The layout — not the script — decides where a machine goes. Each chapter
reserves an empty `.chapter-void` block: the left column of the sticky split on
desktop, a full-width block above the copy on narrow screens. `scene.js`
measures it with `getBoundingClientRect()` and fits the machine inside. Move
the block in CSS and the machine follows.

Three details worth keeping:

- **`FRONT` is the start and end angle** of every turn — door, screen and
  control panel towards the viewer, swung a little off dead-on. **Check it by
  eye after any model re-export.** The baked files carry their own
  orientation, and a machine that spends its whole chapter showing the cyclone
  is the most obvious thing that can be wrong here.
- **Machines are fitted on their rotation-safe radius**, `hypot(x, z)`, not
  their front-on width. A machine turning through 360° is widest on the
  diagonal, and fitting the narrow face means it grows into the copy halfway
  through the turn.
- **Desktop position stays locked to the box.** On phones, a very short
  mobile-only position filter hides the stepped coordinates produced by
  momentum scrolling without visibly detaching the machine from its block.
- **`MODELS[].displayScale` preserves the size hierarchy.** The rotation-safe
  fit is still the base, then 5 PRO and 10 PRO receive deliberate multipliers
  so the largest machine does not look like the smallest one.

Chapters are `240dvh` tall with a sticky inner panel; that extra height is the
scroll budget the machine turns through. The canvas is only drawn while a
chapter is on screen — every section above and below paints its own background
over it.

## Model detail navigation

Each model has four views in the right-hand panel: Overview, Tech specs,
Fit & setup and Video. The four labelled tabs switch between them on desktop.
A deliberate horizontal swipe does the same on a phone, while vertical touch
movement stays with the page. There are no duplicate previous/next arrow
controls, and the mouse wheel is never converted into horizontal movement.
The panel is aligned to the top of the sticky chapter, so its model label,
heading and tab row do not jump when views with different heights are selected.

The Overview has one sales action. “I’m Ready to Discuss the Details” opens the
real lead form with the current model already selected. Visitors who want more
information use the clearly labelled Tech specs, Fit & setup or Video tabs.
All labels, model copy, specifications and CTA wording remain in
`js/content.js`.

The Video view uses the YouTube ID, direct link, title and note stored on that
model in `js/content.js`. The preview image loads only when the visitor opens
the Video tab. The YouTube player itself loads only after Play is pressed, and
is removed when the visitor leaves the tab so audio cannot continue off-screen.

Fit & setup repeats the selected rows listed in `MODEL_UI.fitSpecLabels` and
shows the side and front dimension drawings from `MODELS[].dimensionDrawings`.
The six PNG files are stored in `img/dimensions/`; they are local copies of the
official diagrams used on each model page at typhoon.coffee. On phones the two
views stack so the measurement labels stay readable. On desktop the panel
scrolls internally, just like an expanded specification table.

---

## The opening photograph

The desktop hero is a photograph, not 3D. Three machines rotating on the first
screen was the wrong first thing to show someone: it says "here is a CAD model"
when the job of that screen is to say "this belongs in a coffee bar". The
machines now appear one at a time, in their own chapters, once a visitor is
already reading about them.

It is art-directed rather than resized. `img/hero/cafe-desktop.webp` keeps the
wide frame — machine on the left, copy in the dark half on the right — and
`cafe-hero-mobile.webp` is a separate 4:5 crop around the machine, because that
composition has no room on a phone. A `<picture>` element picks between them at
760 px.

Both were lifted out of the original render with a gamma curve rather than a
brightness multiply: gamma opens the shadows and leaves the lamps where the
lighting put them, where a flat multiply would blow them out. To regenerate
from a new render, that recipe is a few lines of Pillow — gamma 1.20,
brightness 1.06, saturation 1.04.

Phones replace that photograph with `img/hero/air-roasting-mobile-v3.mp4`.
The 1920 × 1080 H.264 file is encoded 1.5 times slower than the source, autoplays
muted and inline once, then remains on its last frame. Its roughly 2.5 MB
payload deliberately preserves the thin title and moving coffee detail; the
earlier 960 × 540, 360 KB encode was visibly over-compressed on a full-screen
phone. The fallback poster is the film's own first frame, and the unrelated
portrait photograph is hidden while video is enabled, so a slow connection
cannot flash the wrong image before playback.
The film owns 76% of the first mobile viewport and fades into a dark stage for
white copy. Reduced-motion visitors keep the portrait photograph. The file
path, same-frame poster, transition colour, media query and crop position all
live under `SITE.mobileHeroVideo` in `js/content.js`.

## Mobile navigation

The mobile menu is a viewport-level sibling of the fixed header, not its child.
A backdrop-filtered ancestor becomes the containing block for fixed descendants
in mobile browsers; keeping the menu inside the header therefore clipped it to
the header's height after scrolling. The panel now fills the viewport, scrolls
independently and includes safe-area padding for phone screen edges.

## Phones behave differently on purpose

Three separate things made the machines judder on a phone, and all three fixes
are easy to undo by accident:

- **The canvas must not be sized in `dvh`.** It is `position:fixed; inset:0`,
  which already fills the visual viewport. Adding `height:100dvh` on top made
  it resize every time the address bar slid, and each resize reallocates the
  drawing buffer mid-scroll.
- **`.chapter-void` is `40svh`, not `40dvh`.** It is the box the machine is
  fitted into; in `dvh` it changed size whenever the address bar moved, and the
  machine jumped with it. `svh` does not move.
- **Rotation is manual when `view.narrow`.** Each machine arrives at the front
  angle and a horizontal swipe over the empty model box turns it; vertical
  movement remains normal page scroll. This replaces the shared timer that
  could make the next machine appear with its back already facing the visitor.
- **Phone position is filtered, not the scroll itself.** Momentum scrolling
  reports element coordinates in coarse steps, so `scene.js` applies a short
  low-lag filter to the model position and snaps it on first appearance. The
  renderer pixel ratio is capped at 1.35 to leave more frame time for the 3D.
- **The comparison does not scroll sideways.** On phones each characteristic
  spans the row, with the Drum and Typhoon values in two columns underneath.
  The semantic table stays intact; CSS only changes its visual layout.

The viewport is measured from **the canvas**, not from `innerWidth`, and
watched with a `ResizeObserver` — same box `getBoundingClientRect()` reports
against, and it fires on the first layout, which a `resize` event never does.
Pixel ratio is capped at 1.35 on phones.

---

## Lighting

A glTF carries geometry and materials, not lights. Without an environment the
steel and glass render flat and grey — `RoomEnvironment` through a
`PMREMGenerator` is what makes them read as metal.

There is no shadow map. A shadow needs a catcher plane, and a grey plane on a
paper-white page looks worse than no shadow, so each machine carries a soft
radial-gradient sprite under it instead.

---

## The auto-repeat animation

The dark software chapter draws a roast rather than describing one: the
reference profile as a ghost line, the live roast tracking it, power and
airflow on their own strip underneath, the stage bar advancing Prepare → Ready
→ Loading → Roasting → Unloading → Cooling, and the batch counter climbing —
which is the actual claim, that nothing has to cool down in between.

**Rate of rise is defined first and the bean curve is its integral**, not the
other way round:

```
ror(s) = A · (1 − e^(−s/τ₁)) · e^(−s/τ₂)      s = minutes past the turning point
```

A rate that starts at zero, swells shortly after the turning point and decays
towards the drop is what a roast does, and its integral is automatically the
smooth S the bean curve is supposed to be. `A` is solved so the integral lands
exactly on the drop temperature. Doing it the other way — draw a shape, then
differentiate — is what produced the sharp corners in the first version: the
turning point came out a V and the RoR a spike.

Everything else on the chart is smooth for the same reason. Both halves of the
bean curve meet the turning point with **zero slope**, so the minimum is a round
bottom. Power and airflow ramp over about nine seconds instead of stepping,
because a heater cannot make a right angle either.

The bright live bean line is revealed by one rectangular SVG clipping window
whose right edge follows the playhead. Do not replace it with a dash-offset
animation: responsive WebKit can repeat a path-length-based dash pattern and
show several disconnected pieces of the roast at the same time. At every frame
the visible live line must be one continuous prefix from Charge to the current
roast time.

Roast length is 6:45 to the drop on a 7:30 axis, which is what the machine
actually does. The numbers live at the top of the block in `js/ui.js`
(`TP_T`, `FC_T`, `DROP_T`, `CHARGE`, `TP_C`, `END_C`, `POWER`, `FAN`).

Two tabs, matching the two auto-repeat modes the software actually has: by
power and by temperature. **Note:** `company-knowledge/product/software.md`
still lists a third, "by events" — that page is out of date.

It runs only while on screen, and reduced-motion visitors get the finished
roast with no loop.

## Deployment

Static site on Vercel; project root is the output directory. `vercel.json` sets
the immutable cache headers on `/models` and `/img`.

Suggested subdomain: `pro.typhoon.coffee`, linked from the main site's product
section.

---

## Things that will bite

- **Fonts come from Google Fonts.** If the site must work without third-party
  requests, self-host Inter Tight, JetBrains Mono and Orbitron and change the
  `<link>`. Orbitron is used only for the blue `PRO` display mark in model
  headings; the complete model name still comes from `content.js`.
- **Three.js and the Draco decoder come from jsDelivr.** Same caveat; vendor
  them into the repo if the CDN is not acceptable.
- **`window.__typhoon`** is left in `scene.js` on purpose — it exposes the
  scene, camera, rigs and the choreography function for tuning from the
  console. Harmless, but remove it if you would rather not ship it.

---

## The model finder

The quiz from typhoon.coffee, narrowed to the PRO range. The two questions and
their options are the site's; the routing is `QUIZ.byVolume` / `QUIZ.byStatus`
in `content.js`.

**Weekly volume decides it. Status only breaks the tie** when someone has not
picked a volume — which is most first-time visitors, and the reason the status
question exists at all. The cut-offs come from real capacity over a 40-hour
week: 2.5 PRO 600 kg, 5 PRO 1200 kg, 10 PRO 2400 kg. Anything past that routes
to `QUIZ.bigger`, which hands over to the main site rather than pretending a
10 PRO covers 4,500 kg a week.

---

## The FAQ

`FAQ` in `content.js` — eight categories, tabbed, answers as native
`<details>` so the browser handles the open state, the keyboard and
find-in-page.

**Where the answers come from, because it is not one source:**

- **"Pricing & payment" is typhoon.coffee's wording**, verbatim.
- **The other seven were written from `company-knowledge/`** —
  `sales/objections.md`, `product/specs.md`, `product/software.md`,
  `service/warranty.md`, `service/onboarding.md`, `product/models.md`. The
  main site keeps those categories behind Framer tabs that only fetch their
  content on a real click, and that could not be scraped; the knowledge base
  is the same material our sales team quotes from, so the numbers agree.

If the exact site wording matters for a category, paste it over the entry in
`FAQ.groups` — nothing else needs to change.

---

## The clients block

`CLIENTS` in `content.js` — names, countries and role badges taken from
typhoon.coffee/clients. The logos and photographs were **downloaded and
re-encoded into `img/clients/`** rather than hot-linked from the main site's
CDN, so this page does not break when that site reorganises its assets. Nine
are shown, chosen for the PRO range (2.5 / 5 / 10 kg) and geographic spread;
the full list of 46 lives on the main site, which the button links to.

To swap one out: add `<key>.webp` (4:3) and `<key>-logo.webp` to
`img/clients/`, then add the entry to `CLIENTS.items`.

---

## The savings calculator

**The arithmetic is the existing calculator, verbatim.** Every constant, every
formula and every number on screen comes from
`typhoon-roi-calculator/typhoon-roi-calculator.html` — it was not re-derived.
It now lives in `js/calculator.js`.

Exactly two things changed in the logic:

- the inline `onclick` attributes became `addEventListener` calls, so it can be
  a module like the rest of the page;
- the original's `document.title = "Typhoon saves …"` was **removed**. On its
  own page that was fine; on this one it renamed the whole tab every time a
  slider moved.

**The design is this site's**, not the original's. The markup was re-written
with `calc-` prefixed class names — the original used `.hero` and `.page`,
which collide head-on with this page — and styled in the same system as
everything else: Inter Tight and JetBrains Mono, the paper/ink palette, brand
blue for the money, hairline rules instead of cards and shadows. No iframe: it
is part of the page, so its type scale matches its neighbours.

Sanity check after any edit — at the defaults (10 kg, 6,500 kg/month, EUR) it
must read **€5,451** total, **€1,470** labour, **€731** energy and **€3,250**
defects. The conservative public estimate uses six Typhoon batches per hour.
All editable assumptions and labels live under `CALCULATOR` in `content.js`.

---

## What is deliberately not finished

- **Prices.** `MODELS[].price` is `null` on all three, so each shows "Price on
  request". There is no verified public PRO price list to publish from.
- **`QUIZ.bigger`** hands 4,500 kg/week and up to typhoon.coffee. This page
  covers the PRO range only; 20 and 30 kg live on the main site.
- **Lead delivery needs one hosting secret.** Production must provide
  `LEAD_WEBHOOK_URL`. Never hard-code or commit the webhook URL.
- **The FAQ mixes two sources.** "Pricing & payment" is typhoon.coffee's
  wording verbatim; the other seven categories were written from
  `company-knowledge/` because the main site keeps them behind Framer tabs that
  only fetch on a real click. If exact parity matters, paste the site's wording
  over the entry in `FAQ.groups`.
- **Room areas are resolved:** the site consistently uses 15 / 25 / 40 m² for
  the 2.5 / 5 / 10 PRO.
