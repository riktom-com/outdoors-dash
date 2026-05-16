'use strict';

/* ═══════════════════════════════════════════════════════════════════
   LOCATIONS — 12 preset South Georgia rivers, WMAs, and lakes
   ═══════════════════════════════════════════════════════════════════ */
const LOCATIONS = [
  // ── Rivers ──────────────────────────────────────────────────────
  {
    id: 'withlacoochee-pinetta', name: 'Withlacoochee River — Pinetta Area',
    type: 'river', lat: 30.5981, lon: -83.3001, county: 'Lowndes',
    gaugeId: '02317500', floodStage: 77.0, actionStage: 70.0,
    desc: 'Popular bass and bream stretch near the GA–FL line. Good access at Spook Bridge.',
    tags: ['fishing', 'kayak', 'bass', 'bream'],
  },
  {
    id: 'alapaha-statenville', name: 'Alapaha River — Statenville',
    type: 'river', lat: 30.6989, lon: -83.0326, county: 'Echols',
    gaugeId: '02317796', floodStage: 20.0, actionStage: 16.0,
    desc: 'Remote blackwater river through Echols County — catfish, bass, and solitude.',
    tags: ['fishing', 'kayak', 'catfish', 'bass'],
  },
  {
    id: 'suwannee-fargo', name: 'Suwannee River — Fargo',
    type: 'river', lat: 30.6772, lon: -82.5725, county: 'Clinch',
    gaugeId: '02315000', floodStage: 57.0, actionStage: 45.0,
    desc: 'Upper Suwannee at Fargo — great for canoe camping and bass. Headwaters of the Okefenokee drainage.',
    tags: ['fishing', 'canoe', 'camping', 'bass'],
  },
  {
    id: 'flint-newton', name: 'Flint River — Newton',
    type: 'river', lat: 31.3160, lon: -84.3378, county: 'Baker',
    gaugeId: '02353000', floodStage: 38.0, actionStage: 33.0,
    desc: 'Excellent striped bass and catfish stretch in Baker County.',
    tags: ['fishing', 'striped bass', 'catfish'],
  },
  {
    id: 'flint-bainbridge', name: 'Flint River — Bainbridge',
    type: 'river', lat: 30.9077, lon: -84.5716, county: 'Decatur',
    gaugeId: '02357000', floodStage: 72.0, actionStage: 65.0,
    desc: 'Lower Flint above Lake Seminole — popular for catfish and trophy stripers.',
    tags: ['fishing', 'catfish', 'striped bass'],
  },
  {
    id: 'satilla-waycross', name: 'Satilla River — Waycross',
    type: 'river', lat: 31.2135, lon: -82.3574, county: 'Ware',
    gaugeId: '02229000', floodStage: 14.0, actionStage: 11.0,
    desc: 'Blackwater system known for largemouth bass and bream fishing. Gorgeous tannin-stained water.',
    tags: ['fishing', 'bass', 'bream', 'kayak'],
  },

  // ── WMAs & Hunting Areas ─────────────────────────────────────────
  {
    id: 'grand-bay-wma', name: 'Grand Bay WMA',
    type: 'wma', lat: 30.8457, lon: -83.1817, county: 'Lowndes',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: '26,000-acre wetland WMA in Lowndes County. Deer, turkey, dove, waterfowl, and some of the best birding in South Georgia.',
    tags: ['hunting', 'deer', 'turkey', 'dove', 'waterfowl', 'birding'],
  },
  {
    id: 'bullard-creek-wma', name: 'Bullard Creek WMA',
    type: 'wma', lat: 31.5930, lon: -82.3476, county: 'Appling',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: 'Timber and wetland WMA in Appling County — deer, turkey, and small game across creek bottoms.',
    tags: ['hunting', 'deer', 'turkey', 'small game'],
  },
  {
    id: 'alapaha-wma', name: 'Alapaha WMA',
    type: 'wma', lat: 31.4070, lon: -83.2188, county: 'Irwin',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: 'Public hunting land across Irwin County — good deer and turkey hunting with large blocks of longleaf pine.',
    tags: ['hunting', 'deer', 'turkey'],
  },

  // ── Lakes & Fishing Spots ────────────────────────────────────────
  {
    id: 'banks-lake-nwr', name: 'Banks Lake NWR',
    type: 'lake', lat: 31.0831, lon: -83.0278, county: 'Lanier',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: 'National Wildlife Refuge with excellent largemouth bass, crappie, and bream. Waterfowl hunting in season.',
    tags: ['fishing', 'bass', 'crappie', 'waterfowl', 'hunting'],
  },
  {
    id: 'reed-bingham-sp', name: 'Reed Bingham State Park',
    type: 'lake', lat: 31.2340, lon: -83.4883, county: 'Cook',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: 'Lake Alapaha — excellent bass, bream, and catfish fishing. Also home to one of the largest black vulture roosts in the Southeast.',
    tags: ['fishing', 'bass', 'bream', 'catfish', 'birding'],
  },
  {
    id: 'lake-seminole', name: 'Lake Seminole',
    type: 'lake', lat: 30.7896, lon: -84.8788, county: 'Seminole',
    gaugeId: null, floodStage: null, actionStage: null,
    desc: 'One of South Georgia\'s top bass lakes. Also known for crappie, striped bass, and trophy catfish. Boat ramps on both GA and FL shores.',
    tags: ['fishing', 'bass', 'crappie', 'striped bass'],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════════ */
const S = {
  loc:        null,
  savedIds:   [],
  river:      null,   // { stage, cfs, trend, status, statusClass } | { error: true }
  weather:    null,   // NWS forecast properties
  alerts:     [],     // NWS alert features array
  solunarNow: null,   // computed solunar object
  forecast3:  [],     // 3-element array for today/tomorrow/+2
  score:      null,   // { value, label, color, emoji, sublabel, factors[] }
  map:        null,   // Leaflet map instance
  marker:     null,   // Leaflet marker
  refreshTimer: null,
};

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);

function init() {
  loadSaved();
  buildLocationSelect();

  document.getElementById('loc-select').addEventListener('change', e => selectLocation(e.target.value));
  document.getElementById('fav-btn').addEventListener('click', toggleFav);
  document.getElementById('share-btn').addEventListener('click', shareTrip);
  document.getElementById('refresh-btn').addEventListener('click', () => { if (S.loc) selectLocation(S.loc.id); });
  document.getElementById('map-toggle').addEventListener('click', toggleMap);
  document.getElementById('map-close').addEventListener('click', () => {
    document.getElementById('map-section').classList.add('hidden');
    document.getElementById('map-toggle').textContent = '🗺️ Map';
  });

  initMap();
  selectLocation(LOCATIONS[0].id);

  // Auto-refresh every 10 minutes
  S.refreshTimer = setInterval(() => { if (S.loc) selectLocation(S.loc.id); }, 10 * 60 * 1000);
}

/* ═══════════════════════════════════════════════════════════════════
   LOCATION SELECT
   ═══════════════════════════════════════════════════════════════════ */
function buildLocationSelect() {
  const sel = document.getElementById('loc-select');
  sel.innerHTML = '';

  const saved = LOCATIONS.filter(l => S.savedIds.includes(l.id));
  if (saved.length) {
    const og = makeOptGroup('★ Saved Locations', saved);
    sel.appendChild(og);
  }

  const groups = [
    { label: '🎣 Rivers',              filter: l => l.type === 'river' },
    { label: '🦌 WMAs & Hunting Areas', filter: l => l.type === 'wma'   },
    { label: '🐟 Lakes & Fishing Spots', filter: l => l.type === 'lake'  },
  ];
  groups.forEach(g => sel.appendChild(makeOptGroup(g.label, LOCATIONS.filter(g.filter))));
}

function makeOptGroup(label, locs) {
  const og = document.createElement('optgroup');
  og.label = label;
  locs.forEach(l => {
    const o = document.createElement('option');
    o.value = l.id;
    o.textContent = l.name;
    og.appendChild(o);
  });
  return og;
}

async function selectLocation(id) {
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  S.loc = loc;
  S.river = null; S.weather = null; S.alerts = []; S.score = null;
  S.solunarNow = null; S.forecast3 = [];

  // Sync select element
  document.getElementById('loc-select').value = id;
  updateLocHeader();
  updateFavBtn();
  showSkeletons();

  const tasks = [fetchWeatherAndAlerts()];
  if (loc.gaugeId) tasks.push(fetchRiver());
  await Promise.allSettled(tasks);

  computeSolunar();
  computeScore();
  renderAll();
  updateMap();
}

/* ═══════════════════════════════════════════════════════════════════
   DATA FETCHING
   ═══════════════════════════════════════════════════════════════════ */
async function fetchRiver() {
  try {
    const url = `https://waterservices.usgs.gov/nwis/iv/?sites=${S.loc.gaugeId}&parameterCd=00065,00060&period=PT3H&siteStatus=all&format=json`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error('USGS error');
    const data = await res.json();

    const ts = data.value?.timeSeries || [];
    const stageTs = ts.find(t => t.variable.variableCode[0].value === '00065');
    const cfsTs   = ts.find(t => t.variable.variableCode[0].value === '00060');

    const sv = stageTs?.values[0]?.value || [];
    const cv = cfsTs?.values[0]?.value   || [];

    const parseVal = v => { const n = parseFloat(v); return (isNaN(n) || n < -900) ? null : n; };
    const stage = sv.length ? parseVal(sv[sv.length - 1].value) : null;
    const cfs   = cv.length ? parseVal(cv[cv.length - 1].value) : null;

    let trend = '→';
    if (sv.length >= 4) {
      const first = parseVal(sv[0].value);
      if (first !== null && stage !== null) {
        const diff = stage - first;
        if (diff > 0.15) trend = '↑';
        else if (diff < -0.15) trend = '↓';
      }
    }

    let status = 'Normal', statusClass = 'good';
    if (stage !== null && S.loc.floodStage) {
      if (stage >= S.loc.floodStage)   { status = 'Flood Stage';  statusClass = 'bad'; }
      else if (stage >= S.loc.actionStage) { status = 'Action Stage'; statusClass = 'caution'; }
    }

    S.river = { stage, cfs, trend, status, statusClass };
  } catch {
    S.river = { error: true };
  }
}

async function fetchWeatherAndAlerts() {
  try {
    // Step 1: NWS Points → get forecast URL + zone codes
    const ptRes = await fetch(`https://api.weather.gov/points/${S.loc.lat},${S.loc.lon}`, {
      headers: { 'User-Agent': 'riktom.com outdoors dashboard (hello@riktom.com)' },
    });
    if (!ptRes.ok) return;
    const pt = (await ptRes.json()).properties;

    // Extract zone codes from URLs like ".../zones/forecast/GAZ113"
    const fzCode  = pt.forecastZone?.split('/').pop() || '';
    const ctyCode = pt.county?.split('/').pop()       || '';

    // Step 2: parallel — forecast + forecast zone alerts + county alerts
    const [fcRes, al1Res, al2Res] = await Promise.all([
      fetch(pt.forecast, { headers: { 'User-Agent': 'riktom.com (hello@riktom.com)' } }),
      fzCode  ? fetch(`https://api.weather.gov/alerts/active?zone=${fzCode}`)  : Promise.resolve(null),
      ctyCode ? fetch(`https://api.weather.gov/alerts/active?zone=${ctyCode}`) : Promise.resolve(null),
    ]);

    if (fcRes.ok) S.weather = (await fcRes.json()).properties;

    // Merge & deduplicate alerts
    const seen = new Set();
    const merged = [];
    for (const r of [al1Res, al2Res]) {
      if (!r || !r.ok) continue;
      const feats = (await r.json()).features || [];
      feats.forEach(f => { if (!seen.has(f.id)) { seen.add(f.id); merged.push(f); } });
    }
    S.alerts = merged;
  } catch {
    S.weather = null;
    S.alerts  = [];
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SOLUNAR CALCULATIONS
   ═══════════════════════════════════════════════════════════════════ */
function jdFromDate(d) {
  const Y = d.getUTCFullYear(), M = d.getUTCMonth() + 1, D = d.getUTCDate();
  const H = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const a = Math.floor((14 - M) / 12);
  const y = Y + 4800 - a, m = M + 12 * a - 3;
  const JD = D + Math.floor((153 * m + 2) / 5) + 365 * y
           + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return JD - 0.5 + H / 24;
}

function moonDataForJD(jd) {
  const d = jd - 2451545.0;
  const moonLon = ((218.316 + 13.176396 * d) % 360 + 360) % 360;
  const L       = ((280.460 + 0.9856474 * d) % 360 + 360) % 360;
  const g       = ((357.528 + 0.9856003 * d) % 360) * Math.PI / 180;
  const sunLon  = ((L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360 + 360) % 360;
  const phaseAngle = ((moonLon - sunLon) % 360 + 360) % 360; // 0=new, 180=full
  const phase   = phaseAngle / 360;

  // Approximate local transit hour for Eastern time (UTC−4 summer / UTC−5 winter)
  // At new moon phase≈0: transit near noon (12:00 local)
  // Transit hour shifts ≈ phase × 24 hours later
  const estOffset = isDST(new Date()) ? -4 : -5;
  const lonOffset = (S.loc ? S.loc.lon : -83.2) / 15; // longitude correction hours
  const transitHr = ((12 + phase * 24 + lonOffset - estOffset) % 24 + 24) % 24;
  const antiHr    = (transitHr + 12) % 24;
  const riseHr    = ((transitHr - 6) % 24 + 24) % 24;
  const setHr     = (transitHr + 6) % 24;

  return { phase, phaseAngle, transitHr, antiHr, riseHr, setHr };
}

function isDST(d) {
  const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return d.getTimezoneOffset() < Math.max(jan, jul);
}

function hrInPeriod(hr, center, halfWidth) {
  const diff = Math.abs(((hr - center) % 24 + 24) % 24);
  return Math.min(diff, 24 - diff) <= halfWidth;
}

function fmtHr(h) {
  const hh   = Math.floor(((h % 24) + 24) % 24);
  const mm   = Math.round(((h % 1) + 1) % 1 * 60);
  const ampm = hh < 12 ? 'AM' : 'PM';
  const h12  = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
  return `${h12}:${mm.toString().padStart(2, '0')} ${ampm}`;
}

function getMoonIcon(phase) {
  if (phase < 0.0625 || phase >= 0.9375) return '🌑';
  if (phase < 0.1875) return '🌒';
  if (phase < 0.3125) return '🌓';
  if (phase < 0.4375) return '🌔';
  if (phase < 0.5625) return '🌕';
  if (phase < 0.6875) return '🌖';
  if (phase < 0.8125) return '🌗';
  return '🌘';
}

function solunarScore(localHr, md, checkDawnDusk) {
  const inMajor = hrInPeriod(localHr, md.transitHr, 1.0) || hrInPeriod(localHr, md.antiHr, 1.0);
  const inMinor = hrInPeriod(localHr, md.riseHr, 0.75)   || hrInPeriod(localHr, md.setHr, 0.75);
  const phaseBonus = Math.cos(md.phaseAngle * Math.PI / 180) ** 2; // 1.0 at new/full
  const isDawn  = localHr >= 5.5 && localHr <= 8.0;
  const isDusk  = localHr >= 18.0 && localHr <= 20.5;

  let score = 30;
  if (inMajor)     score += 40;
  else if (inMinor) score += 20;
  score += Math.round(phaseBonus * 20);
  if (checkDawnDusk && (isDawn || isDusk)) score += 15;
  return Math.min(100, score);
}

function ratingFromScore(s) {
  if (s >= 78) return { rating: 'Excellent', color: '#2e7d32' };
  if (s >= 56) return { rating: 'Good',      color: '#558b2f' };
  if (s >= 34) return { rating: 'Fair',      color: '#f57f17' };
  return            { rating: 'Poor',        color: '#c62828' };
}

function computeSolunar() {
  const now   = new Date();
  const jd    = jdFromDate(now);
  const md    = moonDataForJD(jd);
  const estOff = isDST(now) ? -4 : -5;
  const localHr = ((now.getUTCHours() + estOff) % 24 + 24) % 24 + now.getUTCMinutes() / 60;

  const inMajor = hrInPeriod(localHr, md.transitHr, 1.0) || hrInPeriod(localHr, md.antiHr, 1.0);
  const inMinor = hrInPeriod(localHr, md.riseHr, 0.75)   || hrInPeriod(localHr, md.setHr, 0.75);
  const score   = solunarScore(localHr, md, true);
  const { rating, color } = ratingFromScore(score);

  const windows = [
    { label: `${fmtHr(md.transitHr - 1)} – ${fmtHr(md.transitHr + 1)}`, type: 'Major' },
    { label: `${fmtHr(md.antiHr - 1)} – ${fmtHr(md.antiHr + 1)}`,       type: 'Major' },
    { label: `${fmtHr(md.riseHr - 0.75)} – ${fmtHr(md.riseHr + 0.75)}`, type: 'Minor' },
    { label: `${fmtHr(md.setHr - 0.75)} – ${fmtHr(md.setHr + 0.75)}`,   type: 'Minor' },
  ];

  S.solunarNow = {
    score, rating, color,
    inMajor, inMinor,
    moonIcon: getMoonIcon(md.phase),
    windows,
  };

  // 3-day forecast: rate each day by whether dawn/dusk overlaps a major/minor period
  const DAWN = 6.5, DUSK = 19.0;
  S.forecast3 = [0, 1, 2].map(daysAhead => {
    const d2 = new Date(now);
    d2.setDate(d2.getDate() + daysAhead);
    d2.setUTCHours(12, 0, 0, 0);
    const md2    = moonDataForJD(jdFromDate(d2));
    const dawnSc = solunarScore(DAWN, md2, false);
    const duskSc = solunarScore(DUSK, md2, false);
    const dayScore = Math.round((dawnSc + duskSc) / 2);
    const { rating: r, color: c } = ratingFromScore(dayScore);

    const dawnMajor = hrInPeriod(DAWN, md2.transitHr, 1) || hrInPeriod(DAWN, md2.antiHr, 1);
    const duskMajor = hrInPeriod(DUSK, md2.transitHr, 1) || hrInPeriod(DUSK, md2.antiHr, 1);
    const dawnMinor = hrInPeriod(DAWN, md2.riseHr, 0.75) || hrInPeriod(DAWN, md2.setHr, 0.75);
    const duskMinor = hrInPeriod(DUSK, md2.riseHr, 0.75) || hrInPeriod(DUSK, md2.setHr, 0.75);

    const bestWindow =
      dawnMajor ? `Dawn Major — ${fmtHr(DAWN - 1)} – ${fmtHr(DAWN + 1)}` :
      duskMajor ? `Dusk Major — ${fmtHr(DUSK - 1)} – ${fmtHr(DUSK + 1)}` :
      dawnMinor ? `Dawn Minor — ${fmtHr(DAWN - 0.75)} – ${fmtHr(DAWN + 0.75)}` :
      duskMinor ? `Dusk Minor — ${fmtHr(DUSK - 0.75)} – ${fmtHr(DUSK + 0.75)}` :
                  `Midday — ${fmtHr(md2.transitHr - 1)} – ${fmtHr(md2.transitHr + 1)}`;

    const lbl = daysAhead === 0 ? 'Today'
              : daysAhead === 1 ? 'Tomorrow'
              : d2.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return { dayLabel: lbl, rating: r, ratingColor: c, score: dayScore, bestWindow, moonIcon: getMoonIcon(md2.phase) };
  });
}

/* ═══════════════════════════════════════════════════════════════════
   GO / NO GO SCORE
   ═══════════════════════════════════════════════════════════════════ */
function computeScore() {
  let value = 70;
  const factors = [];

  const add = (icon, text, impact) => { value += impact; factors.push({ icon, text, impact }); };

  // ── River ────────────────────────────────────────────────────────
  if (S.river && !S.river.error && S.loc.gaugeId) {
    if (S.river.status === 'Flood Stage')  add('🚨', 'River at flood stage',    -40);
    else if (S.river.status === 'Action Stage') add('⚠️', 'River above action stage', -15);
    else                                   add('✅', 'River at normal levels',  +10);
  }

  // ── NWS Alerts ───────────────────────────────────────────────────
  const hasEvt = (...terms) => S.alerts.some(a => terms.some(t => a.properties.event.includes(t)));
  if (hasEvt('Tornado Warning'))                 add('🌪️', 'Tornado warning active',             -60);
  if (hasEvt('Severe Thunderstorm Warning'))      add('⛈️', 'Severe thunderstorm warning',        -35);
  if (hasEvt('Flash Flood Warning'))              add('🌊', 'Flash flood warning',                -30);
  if (hasEvt('Flood Warning', 'Flood Advisory')) add('💧', 'Flood warning active',               -20);
  if (hasEvt('Red Flag Warning'))                 add('🔥', 'Red Flag Warning — extreme fire risk', -20);
  if (hasEvt('Fire Weather Watch'))               add('🔥', 'Fire Weather Watch in effect',       -10);
  if (S.alerts.length === 0)                      add('✅', 'No active weather alerts',           +5);

  // ── Weather ──────────────────────────────────────────────────────
  if (S.weather?.periods?.length) {
    const p       = S.weather.periods[0];
    const winds   = (p.windSpeed || '').match(/\d+/g)?.map(Number) || [0];
    const windMax = Math.max(...winds);
    const precip  = p.probabilityOfPrecipitation?.value ?? 0;
    const temp    = p.temperature ?? 75;

    if (windMax > 25)    add('💨', `High winds: ${p.windSpeed}`,       -10);
    else if (windMax > 15) add('💨', `Breezy: ${p.windSpeed}`,          -5);

    if (precip > 70)     add('🌧️', `Heavy rain likely (${precip}%)`,  -20);
    else if (precip > 40) add('🌦️', `Rain chance: ${precip}%`,        -10);
    else if (precip < 15) add('☀️', 'Clear skies expected',            +5);

    if (temp > 100)      add('🌡️', `Dangerous heat: ${temp}°F`,       -15);
    else if (temp < 30)  add('🌡️', `Freezing temps: ${temp}°F`,       -10);
  }

  // ── Solunar ──────────────────────────────────────────────────────
  if (S.solunarNow) {
    if (S.solunarNow.rating === 'Excellent') add('🌙', 'Excellent solunar period now',  +20);
    else if (S.solunarNow.rating === 'Good') add('🌙', 'Good solunar period',           +10);
    else if (S.solunarNow.rating === 'Poor') add('🌙', 'Poor solunar period',            -5);
  }

  value = Math.max(0, Math.min(100, Math.round(value)));

  let label, color, emoji, sublabel;
  if      (value >= 82) { label = 'GO';      color = '#2e7d32'; emoji = '✅'; sublabel = 'Great conditions — head out'; }
  else if (value >= 66) { label = 'GOOD';    color = '#558b2f'; emoji = '👍'; sublabel = 'Solid trip — conditions favorable'; }
  else if (value >= 50) { label = 'FAIR';    color = '#8d6e00'; emoji = '⚡'; sublabel = 'Manageable — some concerns'; }
  else if (value >= 35) { label = 'CAUTION'; color = '#e65100'; emoji = '⚠️'; sublabel = 'Consider waiting'; }
  else                  { label = 'NO GO';   color = '#c62828'; emoji = '❌'; sublabel = 'Conditions are poor — stay home'; }

  S.score = { value, label, color, emoji, sublabel, factors };
}

/* ═══════════════════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════════════════ */
function renderAll() {
  renderGoNoGo();
  renderRiver();
  renderWeather();
  renderAlerts();
  renderSolunar();
  renderForecast3();
  document.getElementById('last-updated').textContent =
    `Updated ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

function renderGoNoGo() {
  const el = document.getElementById('gonogo-card');
  const sc = S.score;
  if (!sc) { el.innerHTML = skelHtml('Go / No Go'); return; }

  el.innerHTML = `
    <div class="card-title">🎯 Go / No Go</div>
    <div class="gonogo-inner">
      <div class="gonogo-score" style="border-color:${sc.color};color:${sc.color}">${sc.value}</div>
      <div class="gonogo-label" style="color:${sc.color}">${sc.emoji} ${sc.label}</div>
      <div class="gonogo-sublabel">${sc.sublabel}</div>
    </div>
    <div class="gonogo-factors">
      ${sc.factors.slice(0, 5).map(f => `
        <div class="factor-row ${f.impact >= 0 ? 'pos' : 'neg'}">
          <span class="factor-icon">${f.icon}</span>
          <span class="factor-text">${esc(f.text)}</span>
          <span class="factor-impact">${f.impact > 0 ? '+' : ''}${f.impact}</span>
        </div>`).join('')}
    </div>`;
}

function renderRiver() {
  const el = document.getElementById('river-card');
  if (!S.loc.gaugeId) {
    el.innerHTML = `<div class="card-title">🌊 River Conditions</div>
      <p class="no-data">No river gauge for this location. Check <a href="https://river.riktom.com" target="_blank">RiverWatch</a> for nearby gauges.</p>`;
    return;
  }
  if (!S.river || S.river.error) {
    el.innerHTML = `<div class="card-title">🌊 River Conditions</div><p class="no-data">Data unavailable — USGS may be temporarily offline.</p>`;
    return;
  }
  const { stage, cfs, trend, status, statusClass } = S.river;
  el.innerHTML = `
    <div class="card-title">🌊 River Conditions</div>
    <div class="river-stage">
      <span class="stage-val">${stage !== null ? stage.toFixed(1) : '—'} ft</span>
      <span class="trend ${trend === '↑' ? 'rising' : trend === '↓' ? 'falling' : ''}">${trend}</span>
    </div>
    <div class="river-cfs">${cfs !== null ? cfs.toLocaleString() + ' cfs discharge' : ''}</div>
    <div class="status-badge ${statusClass}">${status}</div>
    <div class="gauge-note">USGS Gauge #${S.loc.gaugeId} · 3-hr trend</div>`;
}

function renderWeather() {
  const el = document.getElementById('weather-card');
  if (!S.weather?.periods?.length) {
    el.innerHTML = `<div class="card-title">🌤️ Weather</div><p class="no-data">Weather data unavailable.</p>`;
    return;
  }
  const today   = S.weather.periods[0];
  const tonight = S.weather.periods[1];
  const winds   = (today.windSpeed || '').match(/\d+/g)?.map(Number) || [0];
  const windMax = Math.max(...winds);
  const precip  = today.probabilityOfPrecipitation?.value ?? '—';
  const detail  = today.detailedForecast || '';

  el.innerHTML = `
    <div class="card-title">🌤️ Weather</div>
    <div class="weather-main">
      <div class="weather-temp">
        <span class="temp-high">${today.temperature}°</span>
        <span class="temp-sep">/</span>
        <span class="temp-low">${tonight?.temperature ?? '—'}°F</span>
      </div>
      <div class="weather-desc">${esc(today.shortForecast)}</div>
    </div>
    <div class="weather-details">
      <div class="wd-item">💨 ${esc(today.windDirection || '')} ${esc(today.windSpeed || '—')}</div>
      <div class="wd-item">🌧️ ${precip}% precip</div>
    </div>
    <div class="weather-detail-text">${esc(detail.substring(0, 160))}${detail.length > 160 ? '…' : ''}</div>`;
}

function renderAlerts() {
  const el = document.getElementById('alerts-card');
  if (!S.weather && !S.alerts) { el.innerHTML = skelHtml('Alerts'); return; }

  const alertsHtml = S.alerts.length
    ? S.alerts.slice(0, 5).map(a => {
        const sev = a.properties.severity;
        const cls = (sev === 'Extreme' || sev === 'Severe') ? 'alert-high' : 'alert-mod';
        return `<div class="alert-item ${cls}">
          <strong>${esc(a.properties.event)}</strong>
          <span>${esc((a.properties.headline || '').replace(/\*.*$/s, '').trim().substring(0, 120))}</span>
        </div>`;
      }).join('')
    : `<div class="alert-clear">✅ No active alerts for ${esc(S.loc.county)} County</div>`;

  el.innerHTML = `<div class="card-title">⚠️ Alerts</div><div class="alerts-list">${alertsHtml}</div>`;
}

function renderSolunar() {
  const el = document.getElementById('solunar-card');
  if (!S.solunarNow) { el.innerHTML = skelHtml('Activity Now'); return; }
  const s = S.solunarNow;

  el.innerHTML = `
    <div class="card-title">🌙 Activity Right Now</div>
    <div class="sol-rating" style="color:${s.color}">${s.moonIcon} ${s.rating}</div>
    <div class="sol-bar-wrap">
      <div class="sol-bar-track">
        <div class="sol-bar-fill" style="width:${s.score}%;background:${s.color}"></div>
      </div>
      <span class="sol-bar-label">${s.score}/100</span>
    </div>
    <div class="sol-status">
      ${s.inMajor ? '<span class="period-badge major">🎯 Major Period Active</span>'
       : s.inMinor ? '<span class="period-badge minor">● Minor Period Active</span>'
       : '<span class="period-badge none">Between solunar periods</span>'}
    </div>
    <div class="sol-windows-title">Today's Best Windows</div>
    <div class="sol-windows">
      ${s.windows.map(w => `
        <div class="sol-win ${w.type.toLowerCase()}">
          <span class="win-type">${w.type}</span>
          <span class="win-time">${w.label}</span>
        </div>`).join('')}
    </div>`;
}

function renderForecast3() {
  const el = document.getElementById('forecast3-card');
  if (!S.forecast3.length) { el.innerHTML = skelHtml('3-Day Forecast'); return; }

  el.innerHTML = `
    <div class="card-title">📅 3-Day Activity Forecast</div>
    <div class="fc3-grid">
      ${S.forecast3.map(d => `
        <div class="fc3-day">
          <div class="fc3-label">${d.dayLabel}</div>
          <div class="fc3-moon">${d.moonIcon}</div>
          <div class="fc3-rating" style="color:${d.ratingColor}">${d.rating}</div>
          <div class="fc3-window">${d.bestWindow}</div>
        </div>`).join('')}
    </div>`;
}

function skelHtml(title) {
  return `<div class="card-title">${title}</div>
    <div class="skeleton circle"></div>
    <div class="skeleton"></div><div class="skeleton short"></div>`;
}

function showSkeletons() {
  ['gonogo-card','river-card','weather-card','alerts-card','solunar-card','forecast3-card']
    .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = skelHtml('…'); });
}

/* ═══════════════════════════════════════════════════════════════════
   LOCATION HEADER
   ═══════════════════════════════════════════════════════════════════ */
function updateLocHeader() {
  if (!S.loc) return;
  document.getElementById('loc-name').textContent = S.loc.name;

  const typeEmoji = { river: '🎣', wma: '🦌', lake: '🐟' }[S.loc.type] || '📍';
  const tags = S.loc.tags.slice(0, 5).map(t => `<span class="meta-tag">${esc(t)}</span>`).join('');
  document.getElementById('loc-meta').innerHTML =
    `${typeEmoji} ${esc(S.loc.county)} County, GA &nbsp;·&nbsp; ${tags}
     <div class="loc-desc">${esc(S.loc.desc)}</div>`;
}

/* ═══════════════════════════════════════════════════════════════════
   MAP
   ═══════════════════════════════════════════════════════════════════ */
function initMap() {
  S.map = L.map('map', { zoomControl: true }).setView([31.0, -83.2], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(S.map);
}

function updateMap() {
  if (!S.map || !S.loc) return;
  S.map.setView([S.loc.lat, S.loc.lon], 11);
  if (S.marker) S.map.removeLayer(S.marker);
  const icon = { river: '🎣', wma: '🦌', lake: '🐟' }[S.loc.type] || '📍';
  S.marker = L.marker([S.loc.lat, S.loc.lon])
    .addTo(S.map)
    .bindPopup(`<strong>${S.loc.name}</strong><br>${S.loc.county} County, GA
      ${S.score ? `<br><strong style="color:${S.score.color}">${S.score.emoji} ${S.score.label} (${S.score.value}/100)</strong>` : ''}`);
}

function toggleMap() {
  const sec = document.getElementById('map-section');
  const btn = document.getElementById('map-toggle');
  const hide = !sec.classList.toggle('hidden');
  btn.textContent = hide ? '🗺️ Map' : '🗺️ Hide Map';
  if (!hide) setTimeout(() => S.map?.invalidateSize(), 200);
}

/* ═══════════════════════════════════════════════════════════════════
   FAVORITES
   ═══════════════════════════════════════════════════════════════════ */
function loadSaved() {
  try { S.savedIds = JSON.parse(localStorage.getItem('riktom_dash_saved') || '[]'); }
  catch { S.savedIds = []; }
}
function persistSaved() {
  localStorage.setItem('riktom_dash_saved', JSON.stringify(S.savedIds));
}
function toggleFav() {
  if (!S.loc) return;
  const idx = S.savedIds.indexOf(S.loc.id);
  if (idx === -1) S.savedIds.push(S.loc.id);
  else S.savedIds.splice(idx, 1);
  persistSaved();
  buildLocationSelect();
  document.getElementById('loc-select').value = S.loc.id;
  updateFavBtn();
  showToast(idx === -1 ? '★ Location saved!' : 'Location removed from saved.');
}
function updateFavBtn() {
  const saved = S.loc && S.savedIds.includes(S.loc.id);
  const btn = document.getElementById('fav-btn');
  btn.textContent = saved ? '★ Saved' : '☆ Save';
  btn.classList.toggle('saved', !!saved);
}

/* ═══════════════════════════════════════════════════════════════════
   SHARE
   ═══════════════════════════════════════════════════════════════════ */
function shareTrip() {
  const { loc, score: sc, river: r, weather: wx, solunarNow: sol, alerts } = S;
  if (!loc || !sc) { showToast('Still loading — try again in a moment.'); return; }

  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const p    = wx?.periods?.[0];
  let text   = `🎯 Trip Plan — ${loc.name}\n`;
  text      += `📅 ${date} | ${loc.county} County, GA\n\n`;
  text      += `GO/NO GO: ${sc.emoji} ${sc.label} (${sc.value}/100)\n`;
  text      += `${sc.sublabel}\n\n`;
  if (r && !r.error && loc.gaugeId)
    text += `🌊 River: ${r.stage !== null ? r.stage.toFixed(1) + ' ft' : '—'} — ${r.status} ${r.trend}\n`;
  text += alerts.length ? `⚠️ ${alerts.length} active weather alert(s)\n` : `✅ No active alerts\n`;
  if (p) text += `🌤️ ${p.shortForecast}, High ${p.temperature}°F, Wind ${p.windDirection} ${p.windSpeed}\n`;
  if (sol) text += `🌙 Activity: ${sol.rating} — Best window: ${sol.windows[0]?.label}\n`;
  text += `\nPlanned with riktom.com/dashboard`;

  if (navigator.share) {
    navigator.share({ title: `Trip Plan: ${loc.name}`, text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => showToast('📋 Trip card copied to clipboard!'))
      .catch(() => showToast('Copy not supported — screenshot this page.'));
  }
}

/* ═══════════════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════════════ */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}
