# Brief for the next agent

Paste this whole file as your opening message, or point the agent at it.

---

## What this is

A standalone product site for **three coffee roasters only** — Typhoon 2.5 PRO,
5 PRO and 10 PRO. The 20 and 30 kg machines have no local product sections;
they remain outbound links to their own pages on
[typhoon.coffee](https://typhoon.coffee) in the menu, footer and out-of-range
finder result.

- **Folder:** `/Users/nikolas/Desktop/typhoon claude/typhoon-pro-site`
- **Repo:** https://github.com/neistoviu/typhoon-pro-site (branch `main`)
- **Read `README.md` first.** It documents the architecture and, more usefully,
  the decisions that are easy to undo by accident.

## Stack

Static HTML, CSS and JavaScript on Three.js. **No build step, no framework, no
bundler** — the same shape as the sibling project `typhoon-configurator`. Keep
it that way unless there is a reason that survives being said out loud.

Everything from `package.json` down — `app/`, `build/`, `worker/`,
`next.config.ts`, `scripts/prepare-static.mjs`, `_headers`, `.openai/` — is a
deployment wrapper added separately. It copies `css/ img/ js/ models/
index.html` and `thank-you.html` into `public/` and modifies none of them. The site does not depend
on it.

## Running it

Do not open `index.html` from the filesystem — the models are fetched over HTTP
and `file://` blocks them.

```bash
npx serve "/Users/nikolas/Desktop/typhoon claude/typhoon-pro-site" -l 8790
```

## The one rule

**`js/content.js` is the single source of truth for everything a
non-programmer would want to change** — copy, specs, prices, colour presets,
client list, FAQ, quiz routing, the opening 3D angle. A content change should
never require touching `index.html`, `ui.js` or `style.css`.

If you add a section, add its copy to `content.js`, its markup skeleton to
`index.html`, and fill it from `ui.js` like every other block does.

## Files

| File | What it is |
|------|-----------|
| `index.html` | Page skeleton; repeating blocks are filled in by `js/ui.js` |
| `js/content.js` | **Everything editable** |
| `js/scene.js` | Three.js — loads the models, moves them with the scroll |
| `js/ui.js` | Builds the page from `content.js`; reveals, disclosures, the roast animation |
| `js/calculator.js` | Savings calculator — arithmetic ported verbatim from `typhoon-roi-calculator/` |
| `worker/index.ts` | Static assets plus the same-origin `/api/lead` form relay |
| `thank-you.html` | Form success route, populated from `content.js` |
| `css/style.css` | All styling |
| `models/*.glb` | The three machines, ~1 MB each |
| `img/` | Hero crops, client photos, colour renders, try-it photos |

## Things that will bite

Each of these cost real time to find. They are in `README.md` in full; this is
the short list.

1. **`.chapter-void` must stay empty.** `scene.js` measures exactly that box to
   size and place the 3D model. Anything put inside it changes the framing.
2. **`FRONT_DEG` in `content.js`** is the opening angle of every machine.
   Check it by eye after any model re-export — a machine that spends its whole
   chapter showing the cyclone is the most obvious thing that can be wrong.
   `__typhoon.setFront(deg)` in the console dials it in live.
3. **Phones are deliberately different.** The canvas must not be sized in
   `dvh`, `.chapter-void` is `svh`, and rotation is manual rather than tied to
   scroll or a shared timer when `view.narrow`. The box uses `touch-action:
   pan-y`, so vertical gestures keep scrolling while horizontal gestures turn
   the machine. Its position has a short mobile-only filter to hide stepped
   momentum-scroll coordinates, and the phone pixel ratio is capped at 1.35.
   Undoing these brings back the judder.
4. **Machines are fitted on their rotation-safe radius**, `hypot(x, z)`, not
   their front-on width — otherwise a machine grows into the copy halfway
   through its turn.
5. **Repainting.** `findPaint()` locates the two painted materials once, at
   load, by the factory colour they arrive wearing, and keeps them. Do not
   re-find them by colour later: after the first repaint they no longer match.
6. **The roast chart defines rate of rise first and integrates it** to get the
   bean curve, not the other way round. Drawing a shape and differentiating it
   is what produced the sharp corners in the first version. Its live bean line
   is revealed with one SVG clipping window, not a dash offset: the visible
   line must always be a single continuous prefix from Charge to the playhead.
7. **A changed `.glb` needs a new filename.** `vercel.json` marks `/models/*`
   immutable for a year.
8. **Do not `git add -A` blindly.** A parallel agent works in this folder and
   its half-finished files get swept in. Stage what you changed.
9. **Model details use labelled tabs and touch swipe, never arrow buttons or the
   mouse wheel.** Vertical scroll must keep changing the model. The overview has
   one primary button, which opens the lead form with that model selected.
   Visitors open technical specifications through the Tech specs tab. Each
   model also has a lazy-loaded Video view. The right-hand panel must stay
   top-aligned so the model heading and tabs do not jump between views of
   different heights. Leaving Video must unload the YouTube player so hidden
   audio stops.
10. **The comparison table must not scroll sideways on phones.** Its mobile
    layout puts the characteristic across the row and the Drum / Typhoon values
    in two columns underneath. Do not restore a fixed table width there.
11. **The mobile hero video plays once.** It is muted, inline and deliberately
    has no `loop`; the browser holds its last frame. The current MP4 is already
    encoded 1.5 times slower. Keep the current 1920 × 1080 quality: the former
    960 × 540, 360 KB version made the thin title and moving beans visibly soft
    on a full-screen phone. Its poster must remain a frame from that same video,
    otherwise the old machine photograph flashes before playback. Its source,
    poster, transition colour, mobile media query and crop position live in
    `SITE.mobileHeroVideo`. Desktop keeps the existing hero photograph, and
    reduced-motion keeps the portrait photograph.
12. **Dimension drawings are local assets.** Each model owns two files under
    `MODELS[].dimensionDrawings`, and its `Dimensions` value is a normal spec
    row selected into Fit & setup by `MODEL_UI.fitSpecLabels`. The Fit panel
    must keep its own desktop scrolling because both drawings make it taller
    than a short viewport.
13. **The mobile menu must stay outside the fixed header.** A header with
    `backdrop-filter` becomes the containing block for fixed descendants on
    mobile browsers and clips a nested menu to the header height. `#mobileMenu`
    is deliberately a sibling of `.nav`, with its own viewport-level layer and
    safe-area padding.
14. **Model scale is intentional and editable.** `MODELS[].displayScale` keeps
    the 2.5 PRO at 1, the 5 PRO at 1.1 and the physically largest 10 PRO at
    1.22. The rotation-safe fit remains the base; do not remove the multiplier
    and make the 10 PRO look smallest again.
15. **PRO is a display mark, not a second model name.** The complete editable
    name stays in `MODELS[].name`; `ui.js` only separates a trailing `PRO` into
    its own span. It uses Orbitron in the brand blue while the Typhoon name and
    model number keep the primary heading face. Do not duplicate model names in
    HTML or CSS to preserve `content.js` as the source of truth.

## Open items

- **Prices are `null`** on all three machines, so each shows "Price on
  request". There is no verified public PRO price list to publish from.
- **Room areas are resolved:** use 15 / 25 / 40 m² for the 2.5 / 5 / 10 PRO.
- **Form delivery depends on one secret:** production hosting must provide
  `LEAD_WEBHOOK_URL`. Never put the webhook URL in `content.js` or commit it.
- **The FAQ mixes two sources.** "Pricing & payment" is typhoon.coffee's
  wording verbatim; the other seven were written from `company-knowledge/`
  because the main site keeps them behind tabs that only fetch on a real click.
- **`company-knowledge/product/software.md` is out of date** — it lists three
  auto-repeat modes. There are two: by power and by temperature.
- **Configurator links** point at typhoon.coffee until it has a URL of its own.

## House style

- Answers to Nikolas in **Russian**, plain language, technical terms explained
  briefly in brackets the first time. He is new to code.
- Site copy in **English**, for clients.
- Prose in the interface: sentences, not marketing fragments. Specific numbers
  beat adjectives.
- Comments explain **why**, and only where the reason is not obvious from the
  code. No comment that restates the line under it.
- Verify in the browser before claiming something works, and say plainly when
  something could not be verified.
