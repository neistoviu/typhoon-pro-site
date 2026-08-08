/* ---------------------------------------------------------------------------
   The machines.

   One fixed canvas behind the page. Three models, loaded once, moved by
   scroll: a line-up across the opening screen, then a horizontal carousel
   that brings each machine forward for its own chapter and turns it.

   The canvas only ever shows through the hero, the pillars and the three
   chapters — every section after that paints its own background over it.
--------------------------------------------------------------------------- */

import * as THREE from 'three';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader }   from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MODELS, MODEL_UI, FRONT_DEG } from './content.js';

const canvas  = document.getElementById('stage');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const TAU = Math.PI * 2;
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
/* Smoothstep keeps the hand-off between line-up and carousel from
   arriving and leaving at a constant speed, which reads as mechanical. */
const ease = t => t * t * (3 - 2 * t);

/* ══════════════════════════════════════════════════════ renderer ═══════ */

const renderer = new THREE.WebGLRenderer({
  canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 0, 6);

/* A studio, not a room: the machines are steel and glass and read as flat
   grey without something to reflect. */
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

scene.add(new THREE.HemisphereLight(0xffffff, 0xdedbd4, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.35);
key.position.set(2.6, 4.2, 3.4);
scene.add(key);
const rim = new THREE.DirectionalLight(0xffffff, 0.55);
rim.position.set(-3.4, 1.6, -2.4);
scene.add(rim);

/* ═════════════════════════════════════════════ soft contact shadow ═════ */
/* A shadow map would need a catcher plane, and a grey plane on a paper-white
   page is worse than no shadow at all. A gradient sprite does the job. */

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d').createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(21,23,27,.34)');
  g.addColorStop(0.45, 'rgba(21,23,27,.13)');
  g.addColorStop(1,    'rgba(21,23,27,0)');
  const ctx = c.getContext('2d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const shadowMat = new THREE.MeshBasicMaterial({
  map: shadowTexture(), transparent: true, depthWrite: false,
});

/* ══════════════════════════════════════════════════════ the models ═════ */

const draco = new DRACOLoader()
  .setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.163.0/examples/jsm/libs/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);

/* ---- repainting ---------------------------------------------------------
   The exported models have their paint baked in, but the two painted
   materials are identifiable by colour: everything else on the machine is
   steel, glass, black plastic or coffee. So a repaint is a lookup, not a
   re-export — find the material still wearing the factory colour and change
   it. Colours are compared in linear space, which is what Three.js stores.  */

const FACTORY = {
  body:   new THREE.Color(0.8228, 0.7454, 0.5776),   // RAL 1015 Light ivory
  accent: new THREE.Color(0.5149, 0.0423, 0.0343),   // RAL 2002 Vermilion
};
/* Loose enough to survive the float rounding of a glTF round-trip, tight
   enough that nothing else on the machine is within reach of it. */
const MATCH = 0.02;

const near = (c, ref) =>
  Math.abs(c.r - ref.r) < MATCH &&
  Math.abs(c.g - ref.g) < MATCH &&
  Math.abs(c.b - ref.b) < MATCH;

/* Finds the two painted materials once, at load. Storing them matters:
   after the first repaint they no longer wear the factory colour, so a
   colour-matching lookup would only ever work a single time — and the preset
   buttons need to switch back and forth all day. */
function findPaint(root) {
  const seen = new Set();
  const found = { body: [], accent: [] };

  root.traverse(o => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(mat => {
      if (!mat || !mat.color || seen.has(mat.uuid)) return;
      seen.add(mat.uuid);
      if (near(mat.color, FACTORY.body)) found.body.push(mat);
      else if (near(mat.color, FACTORY.accent)) found.accent.push(mat);
    });
  });

  /* A silent miss would ship a machine in the wrong colour, and the only
     symptom is a picture that looks fine. Say so. */
  if (!found.body.length || !found.accent.length) {
    console.warn('[typhoon] paint groups not found — body:', found.body.length,
                 'accent:', found.accent.length, '(model re-exported in new colours?)');
  }
  return found;
}

const hex = c => parseInt(c.slice(1), 16);

function repaint(groups, paint) {
  if (!groups || !paint) return;
  if (paint.body)   groups.body.forEach(m => m.color.setHex(hex(paint.body)));
  if (paint.accent) groups.accent.forEach(m => m.color.setHex(hex(paint.accent)));
}

const rigs = [];                       // one per model, index-aligned to MODELS
const pendingPaint = new Map();

/* The preset buttons in each chapter ask for a repaint; the scene owns
   knowing which materials are the paint. Decoupled through an event so
   neither module has to import the other. */
document.addEventListener('typhoon:paint', e => {
  const r = rigs.find(x => x && x.key === e.detail.model);
  const paint = { body: e.detail.body, accent: e.detail.accent };
  if (r) repaint(r.groups, paint);
  else pendingPaint.set(e.detail.model, paint);
});

function load(m, i) {
  return new Promise((resolve, reject) => {
    loader.load(m.file, gltf => {
      const inner = gltf.scene;

      /* Recentre on the bounding-box centre so rotation happens about the
         machine, not about wherever the CAD origin happened to be. */
      const box  = new THREE.Box3().setFromObject(inner);
      const size = box.getSize(new THREE.Vector3());
      const mid  = box.getCenter(new THREE.Vector3());
      inner.position.sub(mid);

      inner.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(mat => { if (mat.envMapIntensity != null) mat.envMapIntensity = 1.15; });
      });

      const groups = findPaint(inner);
      repaint(groups, m.paint);
      repaint(groups, pendingPaint.get(m.key));

      const rig = new THREE.Group();          // scroll drives this
      const spin = new THREE.Group();         // holds the model + its shadow
      spin.add(inner);

      const sh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = -size.y / 2 - 0.004;
      sh.scale.set(size.x * 1.55, size.z * 2.0, 1);
      spin.add(sh);

      rig.add(spin);
      rig.visible = false;
      scene.add(rig);

      rigs[i] = {
        rig, spin, key: m.key, groups,
        size,
        /* damped state */
        x: 0, y: 0, s: 0.001, rot: FRONT,
      };

      resolve();
    },
    undefined,
    reject);
  });
}

/* ════════════════════════════════════════════════ page measurements ════ */

const chapterEls = [...document.querySelectorAll('.chapter')];
const voidEls    = chapterEls.map(c => c.querySelector('.chapter-void'));

const view = { w: 0, h: 0, visW: 0, visH: 0, narrow: false };

/* Measured from the canvas, not from `innerWidth`/`innerHeight`. The canvas is
   a fixed, inset:0 element, so its client box *is* the visual viewport and it
   is the same box `getBoundingClientRect()` reports against — reading two
   different sources is how the model ends up a few pixels out of step with the
   page it is supposed to be welded to. */
function resize() {
  const w = canvas.clientWidth  || innerWidth;
  const h = canvas.clientHeight || innerHeight;

  /* A zero measurement is not a viewport, it is a page that has not been laid
     out yet. Writing it through gives a NaN camera aspect and a 0×0 drawing
     buffer, and nothing recovers on its own. */
  if (w <= 0 || h <= 0) return;

  view.narrow = w <= 1000;                 // matches the CSS breakpoint

  /* Reallocating the drawing buffer is expensive, and on a phone the address
     bar sliding fires `resize` continuously. Height-only wobble under the
     address-bar threshold is ignored; the projection is barely affected and
     the alternative is a hitch on every scroll. */
  const sameW = w === view.w;
  const smallH = Math.abs(h - view.h) < 120;
  if (sameW && smallH && view.visH) return;

  view.w = w; view.h = h;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  /* Phones do not need two device pixels per CSS pixel across half a million
     triangles — the dropped frames read as judder long before the extra
     sharpness reads as quality. */
  renderer.setPixelRatio(Math.min(devicePixelRatio, view.narrow ? 1.6 : 2));
  renderer.setSize(w, h, false);

  view.visH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  view.visW = view.visH * camera.aspect;
}
/* Watch the canvas rather than the window. A ResizeObserver fires once the
   element actually has a box — including the very first layout, which a
   `resize` event never reports — so the scene can no longer come up stuck at
   whatever size the page happened to have while it was still being built. */
new ResizeObserver(resize).observe(canvas);
addEventListener('orientationchange', () => { view.w = 0; resize(); });

/* ═══════════════════════════════════════════════════ choreography ══════ */
/*
   Every machine is welded to its own chapter. There is no carousel and no
   shared line-up: a machine rises into view with its section, turns while
   that section is pinned, and leaves upward as the next one arrives. Scroll
   back and it comes back exactly the way it left, because nothing here is
   animation state — it is all a function of where the page is.
*/

/* Where a machine starts and finishes its turn. The number itself lives in
   content.js as `FRONT_DEG` so the opening pose can be swung without opening
   this file — it is the one value here anyone is likely to want to change.

   Verify it by eye after any model re-export: the baked files carry their own
   orientation, and a machine that spends its whole chapter showing the
   cyclone is the most obvious thing that can be wrong here. */
let FRONT = FRONT_DEG * Math.PI / 180;

/* Machines are fitted into the empty `.chapter-void` block the layout
   reserves for them — measured, not guessed. That is what keeps them out of
   the copy at every window size: CSS decides where the block goes, and the
   same box comes back in world units. */
function slotOf(elem, padW = 0.86, padH = 0.88) {
  if (!elem) return { x: 0, y: 0, w: view.visW * 0.5, h: view.visH * 0.6 };

  const r = elem.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return {
    x: ((cx / view.w) * 2 - 1) * view.visW / 2,
    y: (1 - (cy / view.h) * 2) * view.visH / 2,
    w: (r.width  / view.w) * view.visW * padW,
    h: (r.height / view.h) * view.visH * padH,
    top: r.top, bottom: r.bottom,
  };
}

/* Reported for the console handle and for debugging; the layout does not
   need a single "active" machine any more. */
function choreograph() {
  const mid = view.h * 0.5;
  let active = -1, spin = 0;
  chapterEls.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom > mid) {
      active = i;
      spin = clamp01((mid - r.top) / Math.max(1, r.height));
    }
  });
  return { active, spin };
}

function layout(dt) {
  const mid = view.h * 0.5;
  spinClock += dt;

  rigs.forEach((r, i) => {
    if (!r) return;

    const slot = slotOf(voidEls[i]);
    const ch = chapterEls[i].getBoundingClientRect();

    /* Rotation.

       Desktop: one full turn across the chapter, driven by scroll. The chapter
       is pinned there, so the machine is standing still and only turning —
       scroll is a perfectly good clock for that.

       Phones: driven by time instead. Momentum scrolling delivers position in
       coarse, irregular jumps, and a rotation sampled from it inherits every
       one of them — the machine visibly stutters even when the page itself is
       gliding. A constant turn is smooth by construction and cannot fall out
       of step with a scroll it no longer listens to. */
    const spin = clamp01((mid - ch.top) / Math.max(1, ch.height));
    const tRot = view.narrow
      ? FRONT + spinClock * 0.34
      : FRONT + ease(spin) * TAU;

    /* Fitted on the rotation-safe radius, not the front-on width, so a
       machine never grows into the copy halfway through its turn. */
    const fit = Math.min(slot.w / Math.hypot(r.size.x, r.size.z),
                         slot.h / r.size.y);

    /* Position and size are locked to the box with no damping: the machine
       is part of the page, and a lagging position reads as drift during a
       fast scroll. Only the turn is smoothed. */
    r.x = slot.x;
    r.y = slot.y;
    r.s = fit;
    /* A time-driven turn is already smooth, and damping it would only add
       lag; the scroll-driven one is smoothed because scroll is not. */
    const k = (reduced || view.narrow) ? 1 : 1 - Math.exp(-dt * 11);
    r.rot += (tRot - r.rot) * k;

    r.rig.position.set(r.x, r.y, 0);
    r.rig.scale.setScalar(Math.max(r.s, 1e-4));
    r.spin.rotation.y = r.rot;

    /* Drawn only while its own block is on screen. */
    r.rig.visible = slot.bottom > -60 && slot.top < view.h + 60;
  });
}

/* ══════════════════════════════════════════════════════════ loop ═══════ */

let last = 0, running = true, spinClock = 0;

/* Nothing below the last chapter shows the canvas, so nothing below it needs
   to be drawn. */
function onScreen() {
  const firstC = chapterEls[0].getBoundingClientRect();
  const lastC  = chapterEls.at(-1).getBoundingClientRect();
  return firstC.top < view.h + 200 && lastC.bottom > -200;
}

function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min((now - last) / 1000 || 0, 0.05);
  last = now;

  if (!running) return;
  if (!onScreen()) { canvas.classList.remove('on'); return; }
  canvas.classList.toggle('on', rigs.some(Boolean));

  layout(dt);
  renderer.render(scene, camera);
}

/* ══════════════════════════════════════════════════════════ start ══════ */

resize();
last = performance.now();
requestAnimationFrame(tick);

const loading = new Set();
const loadOne = async i => {
  if (loading.has(i) || rigs[i]) return;
  loading.add(i);
  const status = chapterEls[i]?.querySelector('.model-load-status');
  if (status) status.textContent = MODEL_UI.loading3d;
  try {
    await load(MODELS[i], i);
    resize();
    layout(0.016);
    rigs[i].rig.visible = true;
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    rigs[i].rig.visible = false;
    if (status) status.hidden = true;
    canvas.classList.add('on');
  } catch (error) {
    console.error(`[typhoon] ${MODELS[i].key} model load failed`, error);
    if (status) status.textContent = MODEL_UI.unavailable3d;
  }
};

if ('IntersectionObserver' in window) {
  const modelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = chapterEls.indexOf(entry.target);
      observer.unobserve(entry.target);
      loadOne(i);
    });
  }, { rootMargin: '75% 0px' });
  chapterEls.forEach(chapter => modelObserver.observe(chapter));
} else {
  MODELS.forEach((_, i) => loadOne(i));
}

/* Console handle for visual tuning and diagnostics. */
window.__typhoon = {
  scene, camera, renderer, rigs, view, choreograph, loadModel: loadOne,
  setFront(deg) {
    FRONT = deg * Math.PI / 180;
    rigs.forEach(r => { if (r) r.rot = FRONT; });
    return `FRONT_DEG = ${deg}`;
  },
};
