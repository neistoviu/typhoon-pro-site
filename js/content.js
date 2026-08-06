/* ---------------------------------------------------------------------------
   Everything a non-developer edits lives in this file.
   Copy, numbers, prices, spec tables, software feature cards.
   Nothing else needs touching for a content change.
--------------------------------------------------------------------------- */

/* Prices are deliberately not hard-coded to a number.
   Set `price` to a string like '€24,900' to show it, or leave the
   placeholder to keep the "on request" button. Same for every model. */

/* Paint.
   The .glb files ship painted RAL 1015 Light ivory with RAL 2002 Vermilion
   trim. `paint` repaints a machine at load time — the file is untouched, so a
   colour change is one line here and needs no re-export.

   `body` is the large panelwork, `accent` is the door frame and trim.
   Omit `paint` (or set it to null) to keep the factory ivory/vermilion.
   The `*Name` fields are documentation for whoever edits this next. */

export const MODELS = [
  {
    key: '2pro',
    name: 'Typhoon 2.5 PRO',
    file: 'models/typhoon-2pro.glb',
    batch: '0.3 – 2.5 kg',
    replaces: 'Replaces a 5 kg drum',
    /* Physical height in metres — used only to keep the three machines
       to true relative scale in the opening line-up. */
    realHeight: 1.55,
    paint: null,               // factory ivory + vermilion
    price: null,               // e.g. '€24,900'
    priceNote: 'Ex-works Prague · shipping quoted separately',
    lead: 'The whole roastery in one plug.',
    body: 'A 2.5 PRO turns a café back room into a production floor. It runs off a standard three-phase outlet — no gas line, no flue engineering, no building permit for an open flame. Fifteen kilos an hour out of six square metres.',
    stats: [
      { v: '15',   u: 'kg / hour',   l: 'Sustained output' },
      { v: '6',    u: 'batches / h', l: 'No cooldown pause' },
      { v: '16',   u: 'kW',          l: 'Connection power' },
      { v: '310',  u: 'kg',          l: 'Machine weight' },
    ],
    forWhom: 'Cafés roasting their own, and first-time roasters who need output before they need scale.',
    specs: [
      {
        group: 'Capacity',
        rows: [
          ['Batch size', '0.3 – 2.5 kg'],
          ['Max capacity', '15 kg / hour'],
          ['Batches per hour', '6 – 7'],
          ['Roast time', 'from 7 min'],
        ],
      },
      {
        group: 'Power',
        rows: [
          ['Heater power', '10.5 kW'],
          ['Auxiliary power', '4.78 kW'],
          ['Connection power', '16 kW'],
          ['Voltage / current', '380–400 V · 23 A'],
          ['Energy per kg', '≈ 0.3 kWh'],
        ],
      },
      {
        group: 'Installation',
        rows: [
          ['Machine weight', '310 kg'],
          ['Minimum room area', '15 m²'],
          ['Exhaust — chamber', '136 Nm³/h'],
          ['Exhaust — cooling tray', '462 Nm³/h'],
          ['Noise level', '70.5 dBA · 75 dBC'],
          ['Gas line', 'Not required'],
        ],
      },
    ],
  },

  {
    key: '5pro',
    name: 'Typhoon 5 PRO',
    file: 'models/typhoon-5pro.glb',
    batch: '0.6 – 5 kg',
    replaces: 'Replaces a 10 kg drum',
    realHeight: 1.85,
    paint: {
      body:   '#2F4538', bodyName:   'RAL 6005 Moss green',
      accent: '#E1A100', accentName: 'RAL 1004 Golden yellow',
    },
    price: null,
    priceNote: 'Ex-works Prague · shipping quoted separately',
    lead: 'Shop-roaster footprint. Wholesale output.',
    body: 'Thirty kilos an hour from a machine that fits where a 10 kg drum used to stand — and holds the same profile on batch twenty as it did on batch one, because there is no drum mass to overheat and nothing to let cool.',
    stats: [
      { v: '30',   u: 'kg / hour',   l: 'Sustained output' },
      { v: '6',    u: 'batches / h', l: 'No cooldown pause' },
      { v: '23',   u: 'kW',          l: 'Connection power' },
      { v: '480',  u: 'kg',          l: 'Machine weight' },
    ],
    forWhom: 'Roasteries supplying wholesale accounts who have outgrown a 10 kg drum but not the room it sits in.',
    specs: [
      {
        group: 'Capacity',
        rows: [
          ['Batch size', '0.6 – 5 kg'],
          ['Max capacity', '30 kg / hour'],
          ['Batches per hour', '6 – 7'],
          ['Roast time', 'from 7 min'],
        ],
      },
      {
        group: 'Power',
        rows: [
          ['Heater power', '18 kW'],
          ['Auxiliary power', '5 kW'],
          ['Connection power', '23 kW'],
          ['Voltage / current', '380–400 V · 38 A'],
          ['Energy per kg', '≈ 0.3 kWh'],
        ],
      },
      {
        group: 'Installation',
        rows: [
          ['Machine weight', '480 kg'],
          ['Minimum room area', '25 m²'],
          ['Exhaust — chamber', '180 Nm³/h'],
          ['Exhaust — cooling tray', '748 Nm³/h'],
          ['Noise level', '70.5 dBA · 75 dBC'],
          ['Gas line', 'Not required'],
        ],
      },
    ],
  },

  {
    key: '10pro',
    name: 'Typhoon 10 PRO',
    file: 'models/typhoon-10pro.glb',
    batch: '5 – 10 kg',
    replaces: 'Replaces a 20 kg drum',
    realHeight: 2.15,
    paint: {
      body:   '#154889', bodyName:   'RAL 5005 Signal blue',
      accent: '#F4F4F4', accentName: 'RAL 9003 Signal white',
    },
    price: null,
    priceNote: 'Ex-works Prague · shipping quoted separately',
    lead: 'Sixty kilos an hour, one operator.',
    body: 'The largest PRO. Automatic loading and unloading, profile transfer included, and enough heater reserve that rate-of-rise answers faster than any gas burner can. One person runs a shift that used to take two.',
    stats: [
      { v: '60',   u: 'kg / hour',   l: 'Sustained output' },
      { v: '6',    u: 'batches / h', l: 'No cooldown pause' },
      { v: '46',   u: 'kW',          l: 'Connection power' },
      { v: '920',  u: 'kg',          l: 'Machine weight' },
    ],
    forWhom: 'Established roasteries running multi-tonne months, and café chains roasting centrally for their own stores.',
    specs: [
      {
        group: 'Capacity',
        rows: [
          ['Batch size', '5 – 10 kg'],
          ['Max capacity', '60 kg / hour'],
          ['Batches per hour', '6 – 7'],
          ['Roast time', 'from 7 min'],
        ],
      },
      {
        group: 'Power',
        rows: [
          ['Heater power', '36 kW'],
          ['Auxiliary power', '10 kW'],
          ['Connection power', '46 kW'],
          ['Voltage / current', '380–400 V · 69 A'],
          ['Energy per kg', '≈ 0.3 kWh'],
        ],
      },
      {
        group: 'Installation',
        rows: [
          ['Machine weight', '920 kg'],
          ['Minimum room area', '40 m²'],
          ['Exhaust — chamber', '317 Nm³/h'],
          ['Exhaust — cooling tray', '2 860 Nm³/h'],
          ['Noise level', '70.5 dBA · 75 dBC'],
          ['Gas line', 'Not required'],
        ],
      },
    ],
  },
];

/* --- Opening screen ----------------------------------------------------- */

/* Where every machine starts and ends its turn, in degrees. Change this one
   number to swing the opening pose; scene.js reads it directly. 0° is the
   model's own front, positive turns it clockwise seen from above. */
export const FRONT_DEG = 296;

export const HERO = {
  eyebrow: 'The PRO series',
  /* Four short lines on purpose: the machines start about a third of the
     way across the hero image, and anything wider runs into them. */
  title: ['The coffee roaster', 'for defect-free', 'roasting, 2× faster', 'than drum roasters.'],
  sub: 'Three fully electric, 100% convection roasters. Six to seven batches an hour with no cooldown between them — and software that repeats the profile so the result stops depending on who is on shift.',
  cta: 'Talk to us',
  ctaSecondary: 'See the machines',
  scrollHint: 'Scroll',
};

/* --- The three claims under the hero ------------------------------------ */

/* --- Model finder --------------------------------------------------------
   The quiz from typhoon.coffee, narrowed to the PRO range. Two questions,
   then a recommendation. Anything past what a 10 PRO does in a 40-hour week
   is honestly out of scope for this page and hands over to the main site
   rather than pretending a 10 PRO covers it. */

export const QUIZ = {
  eyebrow: 'Model finder',
  title: 'Which Typhoon fits you?',
  sub: 'Two answers and we will tell you.',

  questions: [
    {
      key: 'status',
      label: 'Where are you now?',
      options: [
        { v: 'cafe',      t: 'Roasting in my coffee shop' },
        { v: 'starting',  t: 'Just starting out' },
        { v: 'upgrading', t: 'Upgrading my roastery' },
        { v: 'hobby',     t: 'Hobby roaster' },
        { v: 'other',     t: 'Something else' },
      ],
    },
    {
      key: 'volume',
      label: 'How many kg a week do you roast?',
      options: [
        { v: 'unknown', t: 'I don’t know yet' },
        { v: '50',      t: 'Up to 50 kg' },
        { v: '100',     t: 'Up to 100 kg' },
        { v: '600',     t: 'Up to 600 kg' },
        { v: '1000',    t: 'Up to 1000 kg' },
        { v: '2000',    t: 'Up to 2000 kg' },
        { v: '4500',    t: 'Up to 4500 kg' },
        { v: '7000',    t: 'Up to 7000 kg' },
      ],
    },
  ],

  /* Weekly volume decides it; status only breaks the tie when the volume is
     not known yet. Capacities: a 2.5 PRO does 15 kg/h, a 5 PRO 30, a 10 PRO
     60 — over a 40-hour week that is 600 / 1200 / 2400 kg. */
  byVolume: {
    '50': '2pro', '100': '2pro', '600': '5pro', '1000': '5pro',
    '2000': '10pro', '4500': 'bigger', '7000': 'bigger',
  },
  byStatus: {
    cafe: '2pro', starting: '2pro', hobby: '2pro',
    upgrading: '5pro', other: '5pro',
  },

  resultLabel: 'Your match',
  bigger: {
    name: 'Typhoon 20 or 30 kg',
    lead: 'More than the PRO range covers.',
    body: 'At that volume you are past what a 10 PRO does in a single shift. The 20 and 30 kg machines live on the main site — same technology, same software, bigger chamber.',
    cta: 'See the full range',
    href: 'https://typhoon.coffee',
  },
  cta: 'Get a quote for this machine',
  again: 'Start over',
};

/* --- Software section ---------------------------------------------------- */

export const SOFTWARE = {
  eyebrow: 'Typhoon PRO software',
  title: 'The profile is the product.',
  sub: 'Every PRO ships with our own roast-control software on a 13-inch touchscreen. It records what a good roast did, then does it again — replaying the settings, or chasing the curve.',

  /* the two auto-repeat modes, shown as switchable tabs on the animation */
  modes: [
    {
      key: 'power',
      name: 'By power',
      short: 'Replays the heater and fan curve exactly as recorded.',
      long: 'The machine reproduces the power and airflow steps of the reference roast on the same clock. The most literal repeat there is — the same energy, delivered at the same second, batch after batch.',
      highlight: ['power', 'fan'],
    },
    {
      key: 'temp',
      name: 'By temperature',
      short: 'Chases the recorded bean-temperature curve.',
      long: 'The target is the curve, not the settings. The controller trims power and airflow live to keep bean temperature on the reference line — so a colder room or a wetter lot does not move the roast.',
      highlight: ['bean', 'air'],
    },
  ],

  features: [
    { t: 'Roast library',        d: 'Profiles sorted by name, origin, process and weight. Turn any recorded roast into a master profile in two taps.' },
    { t: 'Event-based control',  d: 'Set checkpoints and automate power, airflow and temperature changes at exact moments in the roast.' },
    { t: 'Cropster & Artisan',   d: 'Both integrate directly. Roast data lands where your QC team already works.' },
    { t: 'Guardrails',           d: 'Airflow, heat and recirculation limits per profile — with manual override whenever the roaster wants it.' },
    { t: 'Remote diagnostics',   d: 'We can see the machine, read its logs and push updates without an engineer visit.' },
    { t: 'Automated protocols',  d: 'Preparation, between-batch settings, loading and unloading run themselves.' },
  ],
};

/* --- Colour presets ------------------------------------------------------
   Applied live to the 3D model in each chapter. `body` is the large
   panelwork, `accent` the door frame and trim — the same two groups the
   repaint in scene.js knows how to find.

   A machine's own `paint` above decides which preset it opens on; if it
   matches none of these it simply opens with nothing selected. */

export const PRESETS = [
  { key: 'ivory',  name: 'Ivory / Vermilion',  ral: 'RAL 1015 · RAL 2002',
    body: '#EAE0C8', accent: '#BE3A34' },
  { key: 'blue',   name: 'Signal blue / White', ral: 'RAL 5005 · RAL 9003',
    body: '#154889', accent: '#F4F4F4' },
  { key: 'moss',   name: 'Moss green / Gold',  ral: 'RAL 6005 · RAL 1004',
    body: '#2F4538', accent: '#E1A100' },
  { key: 'purple', name: 'Purple / Orange',    ral: 'RAL 4006 · RAL 2003',
    body: '#93348C', accent: '#F57F31' },
  { key: 'jet',    name: 'Jet black / White',  ral: 'RAL 9005 · RAL 9003',
    body: '#141416', accent: '#F4F4F4' },
  { key: 'ocean',  name: 'Ocean blue / Cream', ral: 'RAL 5020 · RAL 9001',
    body: '#0C4552', accent: '#E9E0D2' },
];

/* --- Clients -------------------------------------------------------------
   Names, roles and photographs are from typhoon.coffee/clients. Images were
   pulled down and re-encoded into img/clients/ rather than hot-linked, so
   this page does not break when the main site reorganises its CDN. */

export const CLIENTS = {
  eyebrow: 'Our clients',
  title: '1000+ roasteries switched to Typhoon.',
  sub: 'Cafés, wholesale roasteries and distributors across four continents run the PRO series every day. We will put you in touch with one near you.',
  cta: 'Connect me with a client nearby',
  ctaHref: 'https://typhoon.coffee/clients',
  items: [
    { key: 'alpha',     name: 'Alpha Coffee Equipement',  country: 'United States', tags: ['Distributor', '10 PRO'] },
    { key: 'angry',     name: 'The Angry Roaster',        country: 'Canada',        tags: ['Distributor', '10 PRO'] },
    { key: 'velvet',    name: 'Velvet Coffee',            country: 'Belgium',       tags: ['Ambassador', '10 kg'] },
    { key: 'sump',      name: 'Sump Coffee',              country: 'United States', tags: ['10 kg'] },
    { key: 'onoma',     name: 'Onoma Coffee',             country: 'Germany',       tags: ['Ambassador', '5 kg'] },
    { key: 'expe',      name: 'Expe Coffee',              country: 'Switzerland',   tags: ['5 kg'] },
    { key: 'altitude',  name: 'Altitude 925',             country: 'Australia',     tags: ['Ambassador', '5 kg'] },
    { key: 'scarab',    name: 'Scarab Coffee',            country: 'UAE',           tags: ['Distributor', '2.5 kg'] },
    { key: 'thestudio', name: 'TheStudio Coffee Roasters',country: 'Portugal',      tags: ['2.5 kg'] },
  ],
};

/* --- Savings calculator --------------------------------------------------
   The calculator itself is the existing standalone page from
   `typhoon-roi-calculator/`, copied to /calculator and embedded in a frame
   so its styling stays exactly as built. */

export const CALC = {
  eyebrow: 'Running cost',
  title: 'What it saves you every month.',
  sub: 'Pick a machine and your monthly volume. The figure compares a Typhoon against a drum setup roasting the same output — labour, energy and the coffee you stop throwing away.',
  src: 'calculator/index.html',
};

/* --- Comparison against a drum ------------------------------------------- */

export const COMPARE = {
  title: 'Against a drum of the same class',
  rows: [
    ['Roast time',        'up to 14 min',       'from 7 min'],
    ['Batches per hour',  '3.5',                '6 – 7'],
    ['Heat transfer',     '80% conduction',     '100% convection'],
    ['Between batches',   'cooldown protocol',  'none'],
    ['Roasting defects',  'tipping, scorching', 'no contact surface'],
    ['Burner service',    '5 – 10 min protocol','no burner'],
    ['Energy',            'gas + electric',     'electric only'],
  ],
  headA: 'Drum',
  headB: 'Typhoon PRO',
};

/* --- Service ------------------------------------------------------------- */

export const SERVICE = [
  { t: '24 months',        d: 'Warranty, with a spare-parts kit — heaters, sensors, glass, gaskets, actuators — in the crate.' },
  { t: 'One hour',         d: 'Target response time on a service call during working hours.' },
  { t: 'Remote first',     d: 'Most issues are diagnosed and fixed over the connection. No engineer visit, no downtime.' },
  { t: 'Training included', d: 'Online and on-site. Your profiles are built with our roaster during commissioning, then the machine repeats them.' },
];

/* --- FAQ -----------------------------------------------------------------
   "Pricing & payment" is the wording from typhoon.coffee verbatim. The other
   categories are written from `company-knowledge/` — objections.md,
   specs.md, warranty.md, onboarding.md, software.md, models.md — so the
   numbers here and the numbers our sales team quotes are the same ones. */

export const FAQ = {
  eyebrow: 'Questions',
  title: 'What clients ask.',
  groups: [
    {
      name: 'Pricing & payment',
      qa: [
        ['Is shipping included in the price?',
         'No — shipping is calculated separately and depends on your location and the equipment you order. We include a shipping quote in your offer, and there is a delivery discount on a first purchase.'],
        ['Do I have to pay the full amount upfront?',
         'No. Three options: 100% upfront with a discount; 50% deposit now and 50% when the roaster is produced; or an instalment plan — 40% deposit to start production, the rest monthly over up to 12 months at 7%, with no early-repayment penalty.'],
        ['Can I lock the current price if I am not ready to order?',
         'Yes. A 40% deposit reserves your slot in production and holds the price for up to a year, with no commitment to start production immediately.'],
        ['Can I pay in US dollars?',
         'Yes. We invoice in euros, but the exchange rate can be fixed at contract and the invoice issued in USD.'],
        ['Are there bundle discounts?',
         'Yes. The more equipment on the order — destoner, air filter, loader, mixer — the larger the discount on the whole thing.'],
      ],
    },
    {
      name: 'Installation & power',
      qa: [
        ['What power supply does it need?',
         '380–400 V three-phase. Connection power is 16 kW (23 A) for the 2.5 PRO, 23 kW (38 A) for the 5 PRO and 46 kW (69 A) for the 10 PRO.'],
        ['Do I need a gas line?',
         'No. Nothing on a Typhoon burns, so there is no gas connection, no flue engineering for a burner and no gas inspection regime. On a comparable drum, the gas installation alone can run to 30% of the machine price.'],
        ['How much room does it need?',
         'Minimum floor area is 15 m² for the 2.5 PRO, 25 m² for the 5 PRO and 40 m² for the 10 PRO.'],
        ['Will permits be a problem?',
         'There is no open flame, which makes approvals considerably simpler in most jurisdictions. Our engineers review your floor plan, advise on ventilation and give you a preparation checklist before anything is built.'],
        ['What do I get before delivery?',
         'After the deposit: the full technical package — installation guides, specs for your engineers, technical drawings for the facility manager, and a site-preparation checklist.'],
      ],
    },
    {
      name: 'Technology',
      qa: [
        ['Why convection instead of a drum?',
         'Nothing touches hot metal. Heat arrives as air, so the defects that come from contact with a drum wall — tipping, scorching, facing — have nowhere to come from.'],
        ['Can electric keep up on rate of rise?',
         'The heaters carry a large power reserve and respond faster than a gas burner can. Recirculation keeps consumption at about 0.3 kWh per kilo at the same time.'],
        ['Is there really no cooldown between batches?',
         'There is no drum mass to hold or lose heat, so thermal conditions reset the moment a batch drops. Six to seven batches an hour, and batch twenty behaves like batch one.'],
        ['What about fire risk?',
         'There is an integrated fire-prevention system in the cyclone. We do not treat a chaff fire as part of roasting — it is a design problem, and it is designed out.'],
      ],
    },
    {
      name: 'Software & profiles',
      qa: [
        ['What software is included?',
         'Typhoon PRO, on a 13-inch touchscreen, in the base price — not an add-on.'],
        ['Can it repeat a roast on its own?',
         'Yes. Two auto-repeat modes: by power, replaying the heater and airflow curve on the same clock; and by temperature, trimming both live to hold the recorded bean curve.'],
        ['Does it work with Cropster and Artisan?',
         'Both integrate directly, so roast data lands where your QC team already works.'],
        ['Can you move my existing profiles across?',
         'Yes. Profile transfer is part of commissioning — your curves are rebuilt on the machine with our roaster during training.'],
      ],
    },
    {
      name: 'Service & warranty',
      qa: [
        ['What does the warranty cover?',
         '24 months, with remote diagnostics and software updates included, and a spare-parts kit in the crate.'],
        ['What is in the spare-parts kit?',
         'Heaters, sensors, chamber glasses, gaskets and actuators — the parts that would otherwise mean waiting on a delivery.'],
        ['What maintenance does it need?',
         'No burner to calibrate and no gas valves. The chamber opens in one second without tools, there are few moving parts, and most service tasks are minutes rather than hours.'],
        ['How fast do you respond to a problem?',
         'We aim to answer a service call within the hour during working hours. Most issues are diagnosed and fixed over the connection without an engineer visit.'],
      ],
    },
    {
      name: 'Training',
      qa: [
        ['Is training included?',
         'Yes — online and on-site. Your profiles are built with our roaster during commissioning.'],
        ['Do I need a roast master on every shift?',
         'No. Profiles are built once during training and the machine repeats them, so an operator presses start and monitors.'],
        ['Can we start learning before the machine arrives?',
         'Yes. Training materials and pre-installation guides go out right after the deposit, while the machine is still being built.'],
      ],
    },
    {
      name: 'Colour & equipment',
      qa: [
        ['Can I choose the colour?',
         'Any RAL for the body and the trim, and a brand colour can be matched from a swatch. It changes nothing about the price.'],
        ['What comes as standard?',
         'The cyclone and Typhoon PRO software are in the base price — on most competing machines both are add-ons.'],
        ['What can be added?',
         'Automatic green-coffee loader, destoner, exhaust filters and blend mixers.'],
      ],
    },
    {
      name: 'Where it fits',
      qa: [
        ['Can I put one inside a café?',
         'That is what the 2.5 PRO is for. No flame, 50+ mm of insulation, surfaces stay cool and it runs at 70.5 dBA.'],
        ['We have no experienced roasters.',
         'The software, the supplied base profiles and the training are what close that gap — the result stops depending on who is on shift.'],
        ['We roast on a drum now. Will the coffee change?',
         'It is different physics, so yes — fewer defects and tighter repeatability, especially at volume. We transfer your existing profiles so you start from what you already know, and you can taste samples roasted on the machine before committing.'],
      ],
    },
  ],
};

/* --- Next step -----------------------------------------------------------
   The three-ways-in block from typhoon.coffee, copy as written there. Each
   button opens a mail draft with its own subject so an enquiry arrives
   already sorted. */

export const NEXT = {
  body: 'Typhoon roasters are installed at 1000+ successful roasteries worldwide. We guide you through starting a business that typically returns the initial investment within 5 months at just 30% of roaster capacity. We provide a complete online roasting course. Installation requires only 6 m² of space and a 380 V outlet.',
  actions: [
    { t: 'Schedule a demo Zoom call',      subject: 'Typhoon PRO — demo call',      primary: true },
    { t: 'Just send me the price',          subject: 'Typhoon PRO — price list' },
    { t: 'Order samples roasted on Typhoon',subject: 'Typhoon PRO — coffee samples' },
  ],
};

/* --- Closing ------------------------------------------------------------- */

export const CTA = {
  title: 'Which one fits your volume?',
  sub: 'Tell us what you roast in a month and we will tell you which machine — and what it costs to run against what you have now.',
  button: 'Request a quote',
  secondary: 'Book a demo roast',
  email: 'ds-sales@typhoon-roaster.com',
  phone: '+420 774 501 511',
  address: 'Vršovická 627/55, 101 00 Prague 10, Czech Republic',
  mainSite: 'https://typhoon.coffee',
};
