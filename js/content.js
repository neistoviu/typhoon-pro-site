/* ---------------------------------------------------------------------------
   Everything a non-developer edits lives in this file.
   Copy, numbers, prices, spec tables, software feature cards.
   Nothing else needs touching for a content change.
--------------------------------------------------------------------------- */

/* Prices are deliberately not hard-coded to a number.
   Set `price` to a string like '€24,900' to show it, or leave the
   placeholder to keep the "on request" button. Same for every model. */

export const SITE = {
  title: 'Typhoon PRO | Electric convection coffee roasters',
  description: 'Typhoon 2.5 PRO, 5 PRO and 10 PRO electric convection coffee roasters. Compare models, estimate running costs and request pricing.',
  heroImageAlt: 'Typhoon 2.5 PRO, 5 PRO and 10 PRO roasters side by side',
  logoAlt: 'Typhoon Roasters',
  mainSite: 'https://typhoon.coffee',
  privacyUrl: 'https://typhoon.coffee/privacy/',
  fullRange: [
    { label: 'Typhoon 20 kg', href: 'https://typhoon.coffee/equipment/typhoon-20kg/' },
    { label: 'Typhoon 30 kg', href: 'https://typhoon.coffee/equipment/typhoon-30kg/' },
  ],
};

export const NAV = {
  primaryLabel: 'Primary navigation',
  mobileLabel: 'Mobile navigation',
  seriesLabel: 'PRO series',
  menuLabel: 'Menu',
  closeLabel: 'Close',
  largerLabel: 'Larger roasters',
  items: [
    { label: 'Find yours', href: '#finder' },
    { label: 'Machines', href: '#lineup' },
    { label: 'Software', href: '#software' },
    { label: 'ROI', href: '#calc' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: 'Get pricing & specs',
};

export const MODEL_UI = {
  cardsTitle: 'Three sizes. One production system.',
  cardsSub: 'Choose by output and installation requirements. The calculator and enquiry form stay focused on these three PRO models.',
  outputLabel: 'Output',
  areaLabel: 'Minimum room area',
  replacesLabel: 'Replaces',
  batchesLabel: 'Batches',
  fitLabel: 'Best fit',
  viewLabel: 'View in 3D',
  colourLabel: 'Colour',
  colourGroupLabel: 'Colour presets',
  priceOnRequest: 'Price on request',
  quoteLabel: 'Get pricing & specs',
  loading3d: 'Loading 3D preview',
  unavailable3d: '3D preview unavailable. Specifications remain available.',
};

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
    body: 'A 2.5 PRO turns a café back room into a production floor. It uses three-phase power with no gas line or open flame. Output reaches 15 kg per hour, and installation planning starts with a minimum room area of 15 m².',
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
    body: 'Thirty kilos an hour from a machine that fits where a 10 kg drum used to stand. The convection chamber has no drum mass to overheat, so production can continue without a between-batch cooldown protocol.',
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
    body: 'The largest PRO combines 60 kg per hour with automatic loading and unloading. Profile transfer is included, and the repeat modes handle the recorded settings or temperature curve while one operator monitors production.',
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
  title: ['Double your output.', 'Keep the roast', 'batch after batch.'],
  sub: 'Three fully electric, 100% convection roasters. Run up to six batches per hour without a cooldown pause, then use the software to repeat the profile across shifts.',
  cta: 'Get pricing & specs',
  ctaSecondary: 'See the machines',
  scrollHint: 'Scroll',
  badges: ['100% convection', 'No gas line', '≈0.3 kWh / kg', '24-month warranty'],
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
    links: SITE.fullRange,
  },
  cta: 'Get a quote for this machine',
  again: 'Start over',
};

/* --- Software section ---------------------------------------------------- */

export const SOFTWARE = {
  eyebrow: 'Typhoon PRO software',
  title: 'The profile is the product.',
  sub: 'Every PRO ships with our own roast-control software on a 13-inch touchscreen. It records what a good roast did, then does it again — replaying the settings, or chasing the curve.',

  repeat: {
    title: 'Roast it once. The machine keeps it.',
    body: 'Coffee goes in and the operator presses start. The machine then reproduces the reference roast. Choose whether it follows the recorded settings or the bean-temperature curve.',
    readout: [
      ['batch', 'Batch'],
      ['stage', 'Stage'],
      ['bean', 'Bean'],
      ['dtr', 'DTR'],
      ['dev', 'Deviation'],
    ],
    initial: { batch: '1', stage: 'Prepare', bean: '—', dtr: '—', dev: '—' },
    note: 'The ghost line is the reference profile. With no drum mass to cool between batches, the machine can start the next roast without a cooldown protocol.',
  },

  chart: {
    events: ['Charge', 'Turn point', 'First crack', 'Drop'],
    axis: { temperature: '°C', rateOfRise: 'RoR', percent: '%' },
    legend: [
      { label: 'Bean', series: 'bean' },
      { label: 'Air', series: 'air' },
      { label: 'RoR', series: 'bean' },
      { label: 'Power', series: 'power' },
      { label: 'Fan', series: 'fan' },
    ],
    stages: ['Prepare', 'Ready', 'Loading', 'Roasting', 'Unloading', 'Cooling'],
    roastingLabel: 'Roasting',
    droppedLabel: 'Dropped',
  },

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
      long: 'The target is the curve, not the settings. The controller trims power and airflow live to keep bean temperature near the reference line and compensate for differences such as a colder room or a wetter lot.',
      highlight: ['bean', 'air'],
    },
  ],

  features: [
    { t: 'Roast library',        d: 'Profiles sorted by name, origin, process and weight. Turn any recorded roast into a master profile in two taps.' },
    { t: 'Event-based control',  d: 'Set checkpoints and automate power, airflow and temperature changes at exact moments in the roast.' },
    { t: 'Online profile library', d: 'Profiles live online as well as on the machine, so a curve can be pulled onto any Typhoon instead of being rebuilt from scratch.' },
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
  title: '1000+ Typhoon roasters installed worldwide.',
  sub: 'The owners below include cafés, wholesale roasteries, ambassadors and distributors across four continents. We can put you in touch with one near you.',
  cta: 'Connect me with a client nearby',
  ctaIntent: 'client_reference',
  filters: ['All', '2.5 kg', '5 kg', '10 kg', 'Ambassador', 'Distributor'],
  items: [
    { key: 'alpha',     name: 'Alpha Coffee Equipement',  country: 'United States', tags: ['Distributor', '10 kg'] },
    { key: 'angry',     name: 'The Angry Roaster',        country: 'Canada',        tags: ['Distributor', '10 kg'] },
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

export const CALCULATOR = {
  eyebrow: 'Running cost',
  titleBefore: 'How could Typhoon save you ',
  titleAfter: '?',
  sub: 'Choose a PRO model and monthly output. The estimate compares labour, energy and defect assumptions against a same-size drum setup.',
  setupTitle: 'Your Typhoon setup',
  machineLabel: 'Machine',
  volumeLabel: 'Roasted per month',
  currencyLabel: 'Currency and unit',
  currencies: [
    { key: 'EUR', label: 'EUR · kg' },
    { key: 'USD', label: 'USD · lb' },
  ],
  methodOpen: 'See assumptions and formulas',
  methodClose: 'Close',
  totalLabel: 'Estimated monthly saving',
  totalVs: 'vs. a same-size drum setup',
  breakdown: [
    { key: 'Labor', label: 'Labour' },
    { key: 'Energy', label: 'Energy' },
    { key: 'Defect', label: 'Coffee defects' },
  ],
  cta: 'Discuss this estimate',
  disclaimer: 'Illustrative estimate, not a guarantee. Open the assumptions to see exactly how it is calculated.',
  batchOptionsKg: [2.5, 5, 10],
  initial: { currency: 'EUR', batchKg: 10, monthlyKg: 6500 },
  assumptions: {
    kgToLb: 2.20462,
    weeksPerMonth: 4.33,
    typhoonBatchesPerHour: 6,
    workHoursPerDay: 8,
    workDaysPerWeek: 5,
    drumBatchesPerHour: 3.5,
    drumLoad: 0.90,
    typhoonEnergyKwhKg: 0.30,
    drumEnergyKwhKg: 0.75,
    typhoonDefectRate: 0.01,
    drumDefectRate: 0.06,
    costs: {
      EUR: { energy: 0.25, labor: 15, green: 10 },
      USD: { energy: 0.13, labor: 18, green: 5 },
    },
  },
  method: {
    title: 'How this estimate is calculated',
    intro: 'The estimate uses your chosen machine and monthly output. It caps volume at one 40-hour production week for that model.',
    sections: [
      { key: 'volume', title: '1 · Monthly volume', body: 'Your target output, capped at what one Typhoon can produce in a 40-hour week.' },
      { key: 'drumSetup', title: '2 · Comparable drum setup', body: 'A same-size drum runs fewer batches per hour and is modelled at 90% batch loading.' },
      { key: 'labor', title: '3 · Labour', body: 'Drum roasting hours minus Typhoon roasting hours, multiplied by the hourly labour cost.' },
      { key: 'energy', title: '4 · Energy', body: 'The model uses 0.30 kWh/kg for Typhoon and 0.75 kWh/kg for the comparison drum.' },
      { key: 'defect', title: '5 · Coffee defects', body: 'The estimate compares a 1% Typhoon defect assumption with a 6% drum assumption. Both figures are shown so the result can be judged as an estimate rather than a guarantee.' },
      { key: 'costs', title: 'Assumed costs', body: 'These default inputs keep the first calculation simple. They are visible here so the result can be checked.' },
    ],
    labels: {
      currentSetup: 'Current setup',
      maxOutput: 'Maximum for this Typhoon in one 40-hour week',
      comparable: 'Comparable same-size drum roasters',
      equivalent: 'Equivalent single drum batch',
      electricity: 'Electricity',
      labour: 'Labour',
      greenCoffee: 'Green coffee',
      currentSaving: 'Current estimated saving',
    },
    templates: {
      intro: '{currentSetup}: {machine} Typhoon and {monthly}/month. {maxOutput}: {maximum}/month.',
      volume: '{monthly}/month = {weekly}/week',
      drumSetup: '{comparable}: {count}. {equivalent}: ~{batch}.',
      labour: 'Typhoon {typhoonHours} h/month vs same-size drum {drumHours} h/month = {savedHours} saved hours × {hourlyCost}/hour = {saving}',
      energy: '{volume} kg/month × {difference} kWh/kg × {energyCost}/kWh = {saving}',
      defect: '{volume} kg/month × {difference}% × {coffeeCost}/kg = {saving}',
    },
  },
};

/* --- Comparison against a drum ------------------------------------------- */

export const COMPARE = {
  title: 'More usable output from the same shift.',
  rows: [
    ['Roast time',            'up to 14 min',              'up to 7 min'],
    ['Batches',               '3.5 / hour',                '6 – 7 / hour'],
    ['Heating method',        '80% hot metal (conduction)','100% hot air (convection)'],
    ['Drum-contact defects',  'contact risk remains',      'no hot metal contact'],
    ['Between-batch protocol','5 – 10 min',                'not needed'],
    ['Noise level',           'loud',                      '70.5 dBA — quiet'],
    ['Energy source',         'gas',                       'electric only'],
    ['Running-cost estimate', 'manual calculation',        'interactive estimate below'],
  ],
  headA: 'Drum roaster',
  headB: 'Typhoon PRO',
};

/* --- Try it before you buy ----------------------------------------------
   The three low-commitment steps from typhoon.coffee. On the main site each
   is a full-width band with a large photograph; here they are one row of
   three, because they are three versions of the same offer and reading them
   side by side is the point. */

export const TRY = {
  eyebrow: 'Before you commit',
  title: 'Taste it, watch it, or come and use it.',
  items: [
    {
      key: 'samples',
      name: 'Coffee roasted on a Typhoon',
      body: 'A sample set — espresso, filter and a special lot — roasted fresh and shipped to you free.',
      cta: 'Order samples',
      subject: 'Typhoon PRO — coffee samples',
    },
    {
      key: 'online',
      name: 'An online roasting session',
      body: 'Thirty minutes on a call: we roast live, walk you through the machine, and send samples afterwards.',
      cta: 'Book an online demo',
      subject: 'Typhoon PRO — online roasting session',
    },
    {
      key: 'showroom',
      name: 'Our Prague showroom',
      body: 'Roast on the machine yourself, ask everything, and stay for a cupping in our coffee shop.',
      cta: 'Book a visit',
      subject: 'Typhoon PRO — showroom visit',
    },
  ],
};

export const SERVICE = {
  eyebrow: 'Service and onboarding',
  title: 'Your production plan starts before delivery.',
  sub: 'The machine, software, installation preparation, training and support are handled as one production transition.',
  items: [
    { t: '24-month warranty', d: 'Remote diagnostics and software updates are included.' },
    { t: 'Spare parts on site', d: 'Heaters, sensors, chamber glass, gaskets and actuators ship with the roaster.' },
    { t: 'Site review', d: 'Our engineers review the floor plan, ventilation and electrical preparation before installation.' },
    { t: 'Remote diagnostics', d: 'Most cases begin online so the team can read logs and diagnose the machine without waiting for a visit.' },
    { t: 'On-site when required', d: 'An engineer visit remains available when the case cannot be completed remotely.' },
    { t: 'Training included', d: 'We build the first profiles with your team during commissioning and prepare operators for daily production.' },
  ],
};

export const CUSTOMIZATION = {
  eyebrow: 'Colours and configuration',
  title: 'Build it around your space and brand.',
  sub: 'Choose any RAL colour for the body and trim. Add loading, destoning, exhaust filtration or blending equipment to match the production flow.',
  cta: 'Discuss colours and equipment',
  images: ['colour-1.webp', 'colour-2.webp', 'colour-3.webp', 'colour-4.webp', 'colour-5.webp', 'colour-6.webp', 'colour-7.webp', 'colour-8.webp', 'colour-9.webp'],
};

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
        ['How does remote support work?',
         'Support begins with a remote connection so the team can read logs and diagnose the machine. Most cases can be handled without an engineer visit; an on-site visit remains available when required.'],
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
  body: 'Typhoon roasters are installed at 1000+ roasteries worldwide. Minimum room area is 15 m² for the 2.5 PRO, 25 m² for the 5 PRO and 40 m² for the 10 PRO. All three models require 380–400 V three-phase power.',
  actions: [
    { t: 'Schedule a demo call', intent: 'demo', primary: true },
    { t: 'Send me pricing', intent: 'pricing' },
    { t: 'Order roasted samples', intent: 'samples' },
  ],
};

/* --- Closing ------------------------------------------------------------- */

export const CTA = {
  eyebrow: 'Next step',
  title: 'Get the right model, site requirements and price.',
  sub: 'Tell us where you are now and how much coffee you plan to roast. We will reply with the best-fit PRO model and the next practical step.',
  email: 'ds-sales@typhoon-roaster.com',
  phone: '+420 774 501 511',
  address: 'Vršovická 627/55, 101 00 Prague 10, Czech Republic',
  mainSite: 'https://typhoon.coffee',
};

export const FORM = {
  endpoint: '/api/lead',
  source: 'Typhoon PRO local site',
  title: 'Tell us about your roastery',
  sub: 'This takes about a minute. A Typhoon specialist will use the details to recommend the right model and preparation path.',
  fields: {
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Work email', placeholder: 'name@company.com' },
    phone: { label: 'Phone', placeholder: '+1 555 123 4567' },
    status: {
      label: 'Current situation',
      options: ['New business', 'Upgrading my roastery', 'Start roasting in my shop', 'Hobby roaster', 'Other'],
    },
    volume: {
      label: 'Planned weekly output',
      options: ['I don’t know yet', 'Up to 100 kg', '100–600 kg', '600–1,200 kg', '1,200–2,400 kg', 'More than 2,400 kg'],
    },
    message: { label: 'Anything we should know?', placeholder: 'Current roaster, target date, country or questions', optional: 'Optional' },
  },
  consent: 'I agree that Typhoon may use these details to respond to my request.',
  privacyLabel: 'Privacy policy',
  submit: 'Send request',
  pending: 'Sending…',
  success: 'Request sent',
  error: 'The form could not be sent. Please try again or email us directly.',
  close: 'Close',
  intents: {
    pricing: { title: 'Get pricing and specifications', submit: 'Request pricing & specs' },
    demo: { title: 'Book a live roasting session', submit: 'Request a demo' },
    samples: { title: 'Order coffee samples', submit: 'Request samples' },
    showroom: { title: 'Visit the Prague showroom', submit: 'Request a visit' },
    client_reference: { title: 'Speak with a Typhoon owner nearby', submit: 'Request an introduction' },
    colors: { title: 'Discuss colours and equipment', submit: 'Request configuration help' },
    roi: { title: 'Discuss your running-cost estimate', submit: 'Send my estimate' },
  },
  successPage: '/thank-you/',
  thankYou: {
    eyebrow: 'Request received',
    title: 'Thank you. We have your details.',
    body: 'A Typhoon specialist will review the request and contact you using the details you provided.',
    primary: 'Return to Typhoon PRO',
    secondary: 'Explore the full range',
  },
};

export const FOOTER = {
  copyright: 'Typhoon Roasters',
  fullRangeLabel: 'Full range',
  privacyLabel: 'Privacy',
};
