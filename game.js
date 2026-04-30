// ═══════════════════════════════════════════════════
// ÆTHER — game.js
// ═══════════════════════════════════════════════════

// ── RAZZE ────────────────────────────────────────
const RACES = {
  luminfang:{
    name:'Luminfang', rarity:'Comune', rarityC:'#88bb88', w:50,
    attitude:'lazy',
    bodyC:'#1e4028', accentC:'#55bb77', strokeC:'#33994a',
    auraC:'rgba(60,180,90,.2)',
    baseStr:30, baseInt:55,
    names:['Vael','Siro','Aelo','Miru','Selva','Lyra'],
    personality:'Curioso e giocoso, ma tendenzialmente pigro.',
    traitCategories:['abilita','resistenza','fobia','vulnerabilita'],
  },
  volcanox:{
    name:'Volcanox', rarity:'Non comune', rarityC:'#cc7733', w:25,
    attitude:'aggressive',
    bodyC:'#3a0e04', accentC:'#ff4a1a', strokeC:'#cc3310',
    auraC:'rgba(200,80,20,.2)',
    baseStr:82, baseInt:28,
    names:['Ignar','Kael','Brax','Vorn','Caldar','Embyr'],
    personality:'Aggressivo e impulsivo. Brucia di energia primordiale.',
    traitCategories:['abilita','resistenza','fobia'],
  },
  umbrasel:{
    name:'Umbrasel', rarity:'Raro', rarityC:'#9966cc', w:15,
    attitude:'fearful',
    bodyC:'#120828', accentC:'#8855cc', strokeC:'#6633aa',
    auraC:'rgba(90,50,180,.2)',
    baseStr:18, baseInt:92,
    names:['Shael','Myra','Vyx','Ombre','Syl','Nyx'],
    personality:'Timido e pauroso ma di intelligenza soprannaturale.',
    traitCategories:['abilita','fobia','vulnerabilita'],
  },
  crystalis:{
    name:'Crystalis', rarity:'Epico', rarityC:'#33bbcc', w:8,
    attitude:'calm',
    bodyC:'#081e28', accentC:'#11bbcc', strokeC:'#009aaa',
    auraC:'rgba(0,180,200,.2)',
    baseStr:52, baseInt:78,
    names:['Kyris','Aelun','Sorel','Vanta','Prisma','Serel'],
    personality:'Calmo e riflessivo. Equilibra forza e intelletto.',
    traitCategories:['abilita','resistenza'],
  },
  aetherwyrm:{
    name:'Aetherwyrm', rarity:'Leggendario', rarityC:'#d4a830', w:2,
    attitude:'majestic',
    bodyC:'#120e00', accentC:'#c9a020', strokeC:'#a07e10',
    auraC:'rgba(190,160,30,.2)',
    baseStr:72, baseInt:88,
    names:['Aurel','Zyr','Thalos','Solein','Aeon','Caelum'],
    personality:'Antico e maestoso. Porta il peso del cosmo.',
    traitCategories:['abilita','resistenza','fobia','vulnerabilita'],
  }
};

// ── TRATTI ───────────────────────────────────────
// category: abilita | resistenza | fobia | vulnerabilita
const ALL_TRAITS = [
  // ABILITÀ (con azione associata)
  {
    id:'caccia', cat:'abilita', name:'Istinto di Caccia', icon:'⚔',
    desc:'Può andare a caccia. Torna con risorse ma potrebbe subire ferite.',
    color:'#e8855a', bg:'rgba(232,133,90,.12)',
    unlock:{ trigger:'play', minCount:5, prob:.18 },
    action:{
      id:'hunt', label:'Caccia', icon:'⚔', cooldownH:24,
      absence:{ minH:2, maxH:6, label:'CACCIA', desc:'è partito a cacciare nell\'oscurità.' },
      enCost:30,
      reward:{ coins:{ min:15, max:45 }, str:{ min:3, max:10 } },
      malus:{ hp:{ min:0, max:14 } }
    }
  },
  {
    id:'meditazione', cat:'abilita', name:'Meditazione Eterea', icon:'◈',
    desc:'Si immerge nella meditazione. Recupera energia e acuisce la mente.',
    color:'#7c9fbf', bg:'rgba(124,159,191,.12)',
    unlock:{ trigger:'train', minCount:4, prob:.2 },
    action:{
      id:'meditate', label:'Medita', icon:'◈', cooldownH:16,
      absence:{ minH:1, maxH:3, label:'MEDITAZIONE', desc:'è immerso in uno stato di trance profonda.' },
      enCost:0,
      reward:{ coins:{ min:5, max:18 }, int:{ min:5, max:14 }, energy: 30 },
      malus:{}
    }
  },
  {
    id:'esplorazione', cat:'abilita', name:'Spirito Esploratore', icon:'◎',
    desc:'Esplora territori sconosciuti. Può tornare con risorse rare.',
    color:'#55bb77', bg:'rgba(85,187,119,.12)',
    unlock:{ trigger:'play', minCount:9, prob:.14 },
    action:{
      id:'explore', label:'Esplora', icon:'◎', cooldownH:20,
      absence:{ minH:3, maxH:9, label:'ESPLORA', desc:'sta esplorando regioni remote del mondo.' },
      enCost:22,
      reward:{ coins:{ min:22, max:65 }, int:{ min:2, max:7 }, str:{ min:1, max:5 } },
      malus:{ hp:{ min:0, max:10 } }
    }
  },
  // ABILITÀ PASSIVE
  {
    id:'cura_naturale', cat:'abilita', name:'Guarigione Naturale', icon:'✦',
    desc:'Si autorigena lentamente. HP recupera +1 per ora passiva.',
    color:'#00e5c8', bg:'rgba(0,229,200,.1)',
    unlock:{ trigger:'sleep', minCount:6, prob:.16 },
    action: null
  },
  {
    id:'risparmio', cat:'abilita', name:'Accumulo Eterico', icon:'◆',
    desc:'Accumula passivamente più Aetherin col tempo (+50%).',
    color:'#c9a84c', bg:'rgba(201,168,76,.1)',
    unlock:{ trigger:'random', prob:.06 },
    action: null
  },
  // RESISTENZE
  {
    id:'res_fuoco', cat:'resistenza', name:'Resistenza al Fuoco', icon:'🔥',
    desc:'I danni da calore si riducono. In caccia perde meno HP.',
    color:'#ff7722', bg:'rgba(255,119,34,.1)',
    unlock:{ trigger:'hunt', minCount:2, prob:.22 },
    action: null
  },
  {
    id:'res_freddo', cat:'resistenza', name:'Pelle dell\'Abisso', icon:'❄',
    desc:'Resistente al freddo. Bonus energia durante il riposo.',
    color:'#88ccff', bg:'rgba(136,204,255,.1)',
    unlock:{ trigger:'sleep', minCount:5, prob:.18 },
    action: null
  },
  {
    id:'corazza', cat:'resistenza', name:'Corazza Naturale', icon:'◆',
    desc:'La pelle si indurisce. HP massimo effettivo aumenta di 15.',
    color:'#aabb99', bg:'rgba(170,187,153,.1)',
    unlock:{ trigger:'train', minCount:7, prob:.14 },
    action: null
  },
  // FOBIE (negative)
  {
    id:'fobia_buio', cat:'fobia', name:'Paura del Buio', icon:'☽',
    desc:'Di notte perde HP extra. Detesta dormire da solo.',
    color:'#9966aa', bg:'rgba(153,102,170,.1)',
    unlock:{ trigger:'random', prob:.07 },
    action: null
  },
  {
    id:'fobia_rumore', cat:'fobia', name:'Ipersensibilità', icon:'◉',
    desc:'Ogni azione ha il 15% di causare stress acuto (−5 HP).',
    color:'#cc8866', bg:'rgba(204,136,102,.1)',
    unlock:{ trigger:'random', prob:.055 },
    action: null
  },
  {
    id:'agorafobia', cat:'fobia', name:'Agorafobia', icon:'◫',
    desc:'Odia gli spazi aperti. Malus in caccia ed esplorazione.',
    color:'#aa6688', bg:'rgba(170,102,136,.1)',
    unlock:{ trigger:'random', prob:.045 },
    action: null
  },
  // VULNERABILITÀ (negative)
  {
    id:'vuln_fame', cat:'vulnerabilita', name:'Metabolismo Vorrace', icon:'◐',
    desc:'La fame cala il doppio del normale. Deve mangiare spesso.',
    color:'#e8a060', bg:'rgba(232,160,96,.1)',
    unlock:{ trigger:'random', prob:.07 },
    action: null
  },
  {
    id:'vuln_fatica', cat:'vulnerabilita', name:'Costituzione Fragile', icon:'◑',
    desc:'L\'energia cala più velocemente. Si stanca con facilità.',
    color:'#cc6677', bg:'rgba(204,102,119,.1)',
    unlock:{ trigger:'random', prob:.06 },
    action: null
  },
  {
    id:'vuln_sete', cat:'vulnerabilita', name:'Pelle Porosa', icon:'◒',
    desc:'La sete aumenta rapidamente. Ha bisogno di molta acqua.',
    color:'#6699cc', bg:'rgba(102,153,204,.1)',
    unlock:{ trigger:'random', prob:.055 },
    action: null
  },
];

const TRAIT_MAP = {};
ALL_TRAITS.forEach(t => {
  const key = t.unlock.trigger;
  if (!TRAIT_MAP[key]) TRAIT_MAP[key] = [];
  TRAIT_MAP[key].push(t);
});

// ── AZIONI BASE ──────────────────────────────────
const BASE_ACTIONS = [
  { id:'feed',  label:'Nutrì',  icon:'🍖', cooldownH:6,  cost:8,  desc:'Dai cibo (◈8)' },
  { id:'water', label:'Acqua',  icon:'💧', cooldownH:4,  cost:4,  desc:'Acqua fresca (◈4)' },
  { id:'play',  label:'Gioca',  icon:'◈',  cooldownH:8,  cost:0,  desc:'Gioca insieme' },
  { id:'sleep', label:'Riposa', icon:'☽',  cooldownH:10, cost:0,  desc:'Fai riposare' },
  { id:'train', label:'Allena', icon:'▲',  cooldownH:14, cost:0,  desc:'Allena corpo e mente' },
  { id:'cure',  label:'Cura',   icon:'✦',  cooldownH:2,  cost:22, desc:'Cura HP (◈22)' },
];

// ── SHOP ─────────────────────────────────────────
const SHOP_ITEMS = [
  { id:'food_s',  name:'Razione Base',       icon:'🍖', desc:'Fame +35, HP +5',               cost:8,  fn:g=>{g.hunger=Math.min(100,g.hunger+35);g.hp=Math.min(100,g.hp+5)} },
  { id:'food_l',  name:'Banchetto Mistico',  icon:'🍗', desc:'Fame +75, HP +12',              cost:18, fn:g=>{g.hunger=Math.min(100,g.hunger+75);g.hp=Math.min(100,g.hp+12)} },
  { id:'water_s', name:'Acqua dell\'Etere',  icon:'💧', desc:'Sete +42',                       cost:4,  fn:g=>{g.thirst=Math.min(100,g.thirst+42)} },
  { id:'elixir',  name:'Elisir Vitale',      icon:'✦',  desc:'HP +45',                         cost:22, fn:g=>{g.hp=Math.min(100,g.hp+45)} },
  { id:'tonic_e', name:'Tonico dell\'Etere', icon:'⚡', desc:'Energia +40',                   cost:14, fn:g=>{g.energy=Math.min(100,g.energy+40)} },
  { id:'tonic_s', name:'Tonico della Forza', icon:'⚔',  desc:'Forza +10 permanente',           cost:35, fn:g=>{g.str=Math.min(100,g.str+10)} },
  { id:'tonic_i', name:'Tonico della Mente', icon:'◈',  desc:'Intelligenza +10 permanente',    cost:35, fn:g=>{g.int=Math.min(100,g.int+10)} },
];

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
function loadG() {
  try { const s = localStorage.getItem('aether_v3'); return s ? JSON.parse(s) : null; }
  catch(e) { return null; }
}
function saveG() {
  try { localStorage.setItem('aether_v3', JSON.stringify(G)); } catch(e) {}
}

let G = loadG() || newGame();

function newGame() {
  return {
    phase: 'egg',
    eggStart: Date.now(),
    eggDuration: 7 * 24 * 3600 * 1000,
    eggTaps: 0,
    // creature
    raceId: null, name: null, birthMs: null,
    // stats
    hp: 80, energy: 90, hunger: 80, thirst: 80, str: 0, int: 0,
    ageHours: 0,
    // economy
    coins: 10,
    // traits
    unlockedTraitIds: [],
    // action counters
    counts: { play:0, train:0, sleep:0, hunt:0, explore:0, meditate:0 },
    // cooldowns { id: expiresMs }
    cooldowns: {},
    // absence { traitId, actionId, endsMs, label, desc }
    absence: null,
    lastTickMs: Date.now(),
  };
}

function getRace() { return RACES[G.raceId] || RACES.luminfang; }
function getUnlockedTraits() {
  return G.unlockedTraitIds.map(id => ALL_TRAITS.find(t => t.id === id)).filter(Boolean);
}
function getUnlockedActions() {
  return getUnlockedTraits().filter(t => t.action).map(t => t.action);
}
function hasTrait(id) { return G.unlockedTraitIds.includes(id); }

// ═══════════════════════════════════════════════════
// BG CANVAS
// ═══════════════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: .3 + Math.random() * 1.2,
    a: Math.random(),
    spd: .0015 + Math.random() * .003,
    ph: Math.random() * Math.PI * 2
  }));
}

function drawBg(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.a = .12 + .55 * Math.abs(Math.sin(t * s.spd + s.ph));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(165,200,235,${s.a})`;
    ctx.fill();
  }
  requestAnimationFrame(t => drawBg(t / 1000));
}

initCanvas();
window.addEventListener('resize', initCanvas);
requestAnimationFrame(t => drawBg(t / 1000));

// ═══════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════
setTimeout(() => {
  document.getElementById('splash').classList.add('fade');
  setTimeout(() => document.getElementById('splash').remove(), 900);
  boot();
}, 1600);

function boot() {
  if (G.phase === 'egg') {
    document.getElementById('egg-view').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    updateEggUI();
    setInterval(updateEggUI, 20000);
  } else {
    document.getElementById('egg-view').style.display = 'none';
    document.getElementById('app').style.display = 'grid';
    initMainApp();
  }
  checkInstallPrompt();
}

// ═══════════════════════════════════════════════════
// EGG
// ═══════════════════════════════════════════════════
function updateEggUI() {
  const elapsed = Date.now() - G.eggStart;
  const pct = Math.min(1, elapsed / G.eggDuration);
  const rem = Math.max(0, G.eggDuration - elapsed);

  document.getElementById('egg-bar-fill').style.width = (pct * 100) + '%';

  if (rem < 3600000) {
    const m = Math.ceil(rem / 60000);
    document.getElementById('egg-days').textContent = `Si schiude in ${m} min`;
  } else if (rem < 86400000) {
    document.getElementById('egg-days').textContent = `Si schiude in ${Math.ceil(rem / 3600000)}h`;
  } else {
    const d = Math.floor(elapsed / 86400000) + 1;
    document.getElementById('egg-days').textContent = `Giorno ${d} di 7`;
  }

  if (pct > 0.80) {
    const cr = document.getElementById('ecracks');
    if (cr) cr.style.opacity = ((pct - 0.80) / 0.20).toFixed(2);
  }

  if (pct >= 1) hatchEgg();
}

let tapCount = 0;
document.getElementById('egg-view').addEventListener('click', () => {
  tapCount++;
  G.eggTaps = (G.eggTaps || 0) + 1;
  saveG();

  const wrap = document.getElementById('egg-float');
  wrap.style.transform = 'scale(1.07)';
  setTimeout(() => wrap.style.transform = '', 150);
  spawnPt(window.innerWidth / 2, window.innerHeight * .44, '#9966cc', 5);

  // Demo accelerator: 21 taps → hatch immediately
  if (tapCount >= 21) {
    G.eggDuration = 500;
    saveG();
  }
  const rem = 21 - tapCount;
  document.getElementById('egg-taps-info').textContent =
    tapCount < 21 ? `demo: ancora ${rem} tap per schiudere` : '';
});

function pickRace() {
  const total = Object.values(RACES).reduce((a, r) => a + r.w, 0);
  let r = Math.random() * total;
  for (const [id, race] of Object.entries(RACES)) {
    r -= race.w;
    if (r <= 0) return id;
  }
  return 'luminfang';
}

function hatchEgg() {
  const raceId = pickRace();
  const race = RACES[raceId];
  const name = race.names[Math.floor(Math.random() * race.names.length)];
  G = {
    ...newGame(),
    phase: 'alive',
    raceId, name,
    birthMs: Date.now(),
    str: race.baseStr, int: race.baseInt,
    hp: 80, energy: 90, hunger: 80, thirst: 80,
    ageHours: 0, coins: 10,
  };
  saveG();

  document.getElementById('egg-view').style.display = 'none';
  document.getElementById('app').style.display = 'grid';
  initMainApp();
  setNotif(`${name} è nato! Un ${race.rarity.toLowerCase()} ${race.name}.`);
}

// ═══════════════════════════════════════════════════
// MAIN APP INIT
// ═══════════════════════════════════════════════════
function initMainApp() {
  const race = getRace();
  document.getElementById('hdr-name').textContent = G.name;
  document.getElementById('hdr-sub').textContent = `${race.name} · ${race.rarity}`;
  document.getElementById('c-aura').style.background =
    `radial-gradient(circle,${race.auraC} 0%,transparent 68%)`;
  renderCreature();
  renderTraitPills();
  renderActions();
  updateStatsUI();
  gameTick();
}

// ═══════════════════════════════════════════════════
// CREATURE SVG
// ═══════════════════════════════════════════════════
function renderCreature() {
  const absent = isAbsent();
  const overlay = document.getElementById('absence-overlay');
  overlay.classList.toggle('on', absent);

  if (absent) {
    const ab = G.absence;
    document.getElementById('absence-title').textContent = ab.label || 'ASSENTE';
    document.getElementById('absence-desc').textContent = `${G.name} ${ab.desc}`;
    const rem = Math.max(0, ab.endsMs - Date.now());
    const h = Math.floor(rem / 3600000), m = Math.ceil((rem % 3600000) / 60000);
    document.getElementById('absence-cd').textContent =
      h > 0 ? `Ritorno tra ${h}h ${m > 0 ? m + 'm' : ''}` : `Ritorno tra ${m}m`;
  }

  const age = G.ageHours;
  const scale = age < 24 ? .55 : age < 168 ? .72 : age < 720 ? .9 : 1.12;
  const sz = Math.round(108 * scale);
  const sleeping = isCdActive('sleep');
  const eyeState = G.hunger < 20 ? 'sad' : G.energy < 15 ? 'tired' : sleeping ? 'sleep' : 'normal';
  document.getElementById('c-sprite').innerHTML = buildSVG(sz, eyeState);
}

function buildSVG(size, eye) {
  const race = getRace();
  const r = size / 2, cx = r, cy = r * 1.08, br = r * .6;

  const eyes = {
    normal: `<circle cx="${cx-br*.28}" cy="${cy-br*.1}" r="${br*.13}" fill="${race.accentC}" opacity=".9"/>
             <circle cx="${cx+br*.28}" cy="${cy-br*.1}" r="${br*.13}" fill="${race.accentC}" opacity=".9"/>
             <circle cx="${cx-br*.23}" cy="${cy-br*.13}" r="${br*.05}" fill="rgba(255,255,255,.7)"/>
             <circle cx="${cx+br*.23}" cy="${cy-br*.13}" r="${br*.05}" fill="rgba(255,255,255,.7)"/>`,
    sleep:  `<path d="M${cx-br*.38},${cy-br*.08} Q${cx-br*.28},${cy} ${cx-br*.18},${cy-br*.08}" fill="none" stroke="${race.accentC}" stroke-width="${br*.07}" stroke-linecap="round"/>
             <path d="M${cx+br*.18},${cy-br*.08} Q${cx+br*.28},${cy} ${cx+br*.38},${cy-br*.08}" fill="none" stroke="${race.accentC}" stroke-width="${br*.07}" stroke-linecap="round"/>`,
    sad:    `<path d="M${cx-br*.38},${cy-br*.05} Q${cx-br*.28},${cy-br*.14} ${cx-br*.18},${cy-br*.05}" fill="none" stroke="${race.accentC}" stroke-width="${br*.07}" stroke-linecap="round"/>
             <path d="M${cx+br*.18},${cy-br*.05} Q${cx+br*.28},${cy-br*.14} ${cx+br*.38},${cy-br*.05}" fill="none" stroke="${race.accentC}" stroke-width="${br*.07}" stroke-linecap="round"/>`,
    tired:  `<path d="M${cx-br*.38},${cy-br*.07} Q${cx-br*.28},${cy-br*.03} ${cx-br*.18},${cy-br*.07}" fill="none" stroke="${race.accentC}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".5"/>
             <path d="M${cx+br*.18},${cy-br*.07} Q${cx+br*.28},${cy-br*.03} ${cx+br*.38},${cy-br*.07}" fill="none" stroke="${race.accentC}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".5"/>`,
  }[eye] || '';

  const extras = {
    luminfang: `<ellipse cx="${cx-br*.52}" cy="${cy-br*1.06}" rx="${br*.17}" ry="${br*.36}" fill="${race.bodyC}" stroke="${race.strokeC}" stroke-width="1.1" opacity=".92"/>
                <ellipse cx="${cx+br*.52}" cy="${cy-br*1.06}" rx="${br*.17}" ry="${br*.36}" fill="${race.bodyC}" stroke="${race.strokeC}" stroke-width="1.1" opacity=".92"/>`,
    volcanox: `<polygon points="${cx},${cy-br*1.4} ${cx-br*.23},${cy-br*.9} ${cx+br*.23},${cy-br*.9}" fill="${race.accentC}" opacity=".62"/>
               <path d="M${cx-br*.63},${cy+br*.3} Q${cx-br*.8},${cy+br*.6} ${cx-br*.5},${cy+br*.78}" fill="none" stroke="${race.accentC}" stroke-width="${br*.11}" stroke-linecap="round" opacity=".4"/>`,
    umbrasel: `<ellipse cx="${cx}" cy="${cy+br*.73}" rx="${br*.84}" ry="${br*.2}" fill="${race.accentC}" opacity=".17"/>
               <circle cx="${cx-br*.56}" cy="${cy-br*.38}" r="${br*.07}" fill="${race.accentC}" opacity=".52"/>
               <circle cx="${cx+br*.56}" cy="${cy-br*.38}" r="${br*.07}" fill="${race.accentC}" opacity=".52"/>`,
    crystalis: `<polygon points="${cx},${cy-br*1.24} ${cx-br*.19},${cy-br*.82} ${cx+br*.19},${cy-br*.82}" fill="${race.accentC}" opacity=".42"/>
                <path d="M${cx-br*.7},${cy-br*.18} L${cx-br*.9},${cy+br*.2} L${cx-br*.6},${cy+br*.32}" fill="none" stroke="${race.accentC}" stroke-width="1.4" opacity=".38"/>
                <path d="M${cx+br*.7},${cy-br*.18} L${cx+br*.9},${cy+br*.2} L${cx+br*.6},${cy+br*.32}" fill="none" stroke="${race.accentC}" stroke-width="1.4" opacity=".38"/>`,
    aetherwyrm: `<ellipse cx="${cx}" cy="${cy-br*1.18}" rx="${br*.64}" ry="${br*.17}" fill="${race.accentC}" opacity=".2" transform="rotate(-8,${cx},${cy-br*1.18})"/>
                 <path d="M${cx-br*.52},${cy+br*.62} Q${cx},${cy+br*1.04} ${cx+br*.52},${cy+br*.62}" fill="none" stroke="${race.accentC}" stroke-width="2.2" opacity=".35" stroke-linecap="round"/>
                 <circle cx="${cx-br*.38}" cy="${cy-br*.4}" r="${br*.065}" fill="${race.accentC}" opacity=".62"/>
                 <circle cx="${cx+br*.38}" cy="${cy-br*.4}" r="${br*.065}" fill="${race.accentC}" opacity=".62"/>`,
  }[G.raceId] || '';

  const zzz = eye === 'sleep' ? `<text x="${cx+br*.62}" y="${cy-br*.52}" font-size="${br*.3}" fill="${race.accentC}" opacity=".52" font-family="serif">z</text>` : '';

  return `<svg width="${size}" height="${Math.round(size*1.18)}" viewBox="0 0 ${size} ${Math.round(size*1.18)}">
  <defs>
    <radialGradient id="bodyG" cx="38%" cy="32%">
      <stop offset="0%" stop-color="${race.accentC}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${race.bodyC}"/>
    </radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
  </defs>
  ${extras}
  <ellipse cx="${cx}" cy="${cy}" rx="${br}" ry="${br*.88}" fill="url(#bodyG)" stroke="${race.strokeC}" stroke-width="1.4" filter="url(#glow)" opacity=".95"/>
  <ellipse cx="${cx-br*.18}" cy="${cy-br*.3}" rx="${br*.2}" ry="${br*.13}" fill="rgba(255,255,255,.07)" transform="rotate(-20,${cx-br*.18},${cy-br*.3})"/>
  ${eyes}${zzz}
  </svg>`;
}

// ═══════════════════════════════════════════════════
// TRAIT PILLS
// ═══════════════════════════════════════════════════
function renderTraitPills() {
  const wrap = document.getElementById('traits-wrap');
  const traits = getUnlockedTraits();
  wrap.innerHTML = traits.slice(-4).map(t =>
    `<div class="tpill" style="background:${t.bg};border:1px solid ${t.color}33;color:${t.color}">${t.icon}</div>`
  ).join('');
}

// ═══════════════════════════════════════════════════
// UNLOCK SYSTEM
// ═══════════════════════════════════════════════════
function tryUnlock(trigger) {
  if (!G.raceId) return;
  const race = getRace();

  // increment counter
  if (G.counts[trigger] !== undefined) {
    G.counts[trigger] = (G.counts[trigger] || 0) + 1;
  }

  const candidates = [...(TRAIT_MAP[trigger] || []), ...(trigger !== 'random' ? (TRAIT_MAP['random'] || []) : [])];

  for (const trait of candidates) {
    if (G.unlockedTraitIds.includes(trait.id)) continue;

    // check category allowed for this race
    if (!race.traitCategories.includes(trait.cat)) continue;

    const u = trait.unlock;

    // check minimum counts
    if (u.minCount !== undefined) {
      const key = u.trigger === 'hunt' ? 'hunt' : u.trigger === 'sleep' ? 'sleep' : u.trigger === 'train' ? 'train' : 'play';
      if ((G.counts[key] || 0) < u.minCount) continue;
    }

    // only fire for matching trigger (random fires on any)
    if (u.trigger !== 'random' && u.trigger !== trigger) continue;

    // rarity bonus
    const rarityBonus = { Leggendario: 1.4, Epico: 1.2, Raro: 1.1 }[race.rarity] || 1;

    if (Math.random() < u.prob * rarityBonus) {
      G.unlockedTraitIds.push(trait.id);
      saveG();
      renderTraitPills();
      renderActions();
      showToast(trait);
      return; // one at a time
    }
  }
}

function showToast(trait) {
  const catLabel = {
    abilita: '✦ abilità sbloccata',
    resistenza: '◆ resistenza acquisita',
    fobia: '☽ fobia emersa',
    vulnerabilita: '◐ vulnerabilità scoperta'
  }[trait.cat] || '';

  document.getElementById('toast-badge').textContent = catLabel;
  document.getElementById('toast-badge').style.cssText =
    `background:${trait.bg};color:${trait.color};border:1px solid ${trait.color}44;border-radius:4px;padding:2px 9px;font-size:8px;letter-spacing:2px;display:inline-block;margin-bottom:8px`;
  document.getElementById('toast-name').textContent = trait.name;
  document.getElementById('toast-name').style.color = trait.color;
  document.getElementById('toast-desc').textContent = trait.desc;

  const t = document.getElementById('toast');
  t.style.borderColor = trait.color;
  t.style.display = 'block';
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.style.display = 'none', 5500);
}

// ═══════════════════════════════════════════════════
// COOLDOWNS & ABSENCE
// ═══════════════════════════════════════════════════
function cdRem(id) {
  const c = G.cooldowns[id];
  return c ? Math.max(0, c - Date.now()) : 0;
}
function isCdActive(id) { return cdRem(id) > 0; }
function setCd(id, hours) { G.cooldowns[id] = Date.now() + hours * 3600000; }
function isAbsent() { return G.absence && Date.now() < G.absence.endsMs; }

function fmtMs(ms) {
  const h = Math.floor(ms / 3600000), m = Math.ceil((ms % 3600000) / 60000);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

// ═══════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════
function renderActions() {
  const col = document.getElementById('actions-col');
  col.innerHTML = '';
  const race = getRace();
  const absent = isAbsent();
  const allActions = [...BASE_ACTIONS, ...getUnlockedActions()];

  allActions.forEach(act => {
    const cd = cdRem(act.id);
    const absentLock = absent && act.id !== 'sleep';
    const isDisabled = cd > 0 || absentLock;

    const div = document.createElement('div');
    div.className = 'abtn' + (cd > 0 ? ' cd' : '') + (absentLock ? ' absent-lock' : '') + (isDisabled ? '' : ' rdy');

    if (act.cost > 0) div.dataset.cost = `◈${act.cost}`;

    const cdTxt = cd > 0 ? fmtMs(cd) : (absentLock ? '…' : '');

    div.innerHTML = `<span class="aicon">${act.icon}</span><span class="alabel">${act.label}</span><span class="acd">${cdTxt}</span>`;

    if (!isDisabled) {
      div.addEventListener('click', () => doAction(act));
    }

    col.appendChild(div);
  });
}

function doAction(act) {
  if (isCdActive(act.id) || isAbsent()) return;

  const race = getRace();
  const cost = act.cost || 0;
  if (cost > 0 && G.coins < cost) {
    setNotif(`Aetherin insufficiente — ti servono ◈${cost}.`);
    return;
  }
  if (cost > 0) G.coins = Math.max(0, G.coins - cost);

  let msg = '';

  switch (act.id) {
    case 'feed':
      G.hunger = Math.min(100, G.hunger + 35);
      G.hp = Math.min(100, G.hp + 5);
      msg = `${G.name} ha mangiato con gusto.`;
      spawnPt(creatureXY().x, creatureXY().y, '#cc8844', 7);
      break;

    case 'water':
      G.thirst = Math.min(100, G.thirst + 44);
      G.hp = Math.min(100, G.hp + 3);
      msg = `${G.name} si è dissetato.`;
      spawnPt(creatureXY().x, creatureXY().y, '#4499cc', 7);
      break;

    case 'play':
      if (G.energy < 18) { setNotif('Troppo stanco per giocare.'); return; }
      G.energy = Math.max(0, G.energy - 22);
      G.hunger = Math.max(0, G.hunger - 10);
      G.hp = Math.min(100, G.hp + 7);
      G.str = Math.min(100, G.str + (race.attitude === 'lazy' ? 2 : 4));
      G.coins += 3;
      G.counts.play = (G.counts.play || 0) + 1;
      msg = `${G.name} ha giocato. +◈3`;
      spawnPt(creatureXY().x, creatureXY().y, race.accentC, 10);
      tryUnlock('play');
      break;

    case 'sleep':
      G.energy = Math.min(100, G.energy + 50);
      G.hp = Math.min(100, G.hp + 8);
      G.counts.sleep = (G.counts.sleep || 0) + 1;
      msg = `${G.name} si è riposato.`;
      spawnPt(creatureXY().x, creatureXY().y, '#7c9fbf', 5);
      tryUnlock('sleep');
      break;

    case 'train':
      if (G.energy < 22) { setNotif('Troppo stanco per allenarsi.'); return; }
      G.energy = Math.max(0, G.energy - 28);
      G.hunger = Math.max(0, G.hunger - 14);
      { const sG = race.attitude === 'lazy' ? 2 : 6;
        const iG = ['majestic','fearful'].includes(race.attitude) ? 9 : 4;
        G.str = Math.min(100, G.str + sG);
        G.int = Math.min(100, G.int + iG);
        G.coins += 5;
        G.counts.train = (G.counts.train || 0) + 1;
        msg = `Forza +${sG} · Intel +${iG}. +◈5`;
        tryUnlock('train');
      }
      break;

    case 'cure':
      G.hp = Math.min(100, G.hp + 45);
      msg = `${G.name} è stato curato. HP +45`;
      spawnPt(creatureXY().x, creatureXY().y, '#00e5c8', 9);
      break;

    // ── UNLOCKED ACTIONS ──
    case 'hunt': {
      if (G.energy < 30) { setNotif('Energia insufficiente per cacciare.'); return; }
      const trait = ALL_TRAITS.find(t => t.id === 'caccia');
      const a = trait.action;
      const hrs = a.absence.minH + Math.random() * (a.absence.maxH - a.absence.minH);
      G.absence = { traitId: 'caccia', actionId: 'hunt', endsMs: Date.now() + hrs * 3600000, label: a.absence.label, desc: a.absence.desc };
      G.energy = Math.max(0, G.energy - a.enCost);
      G.counts.hunt = (G.counts.hunt || 0) + 1;
      msg = `${G.name} è partito a cacciare. Tornerà tra ~${Math.round(hrs)}h.`;
      tryUnlock('hunt');
      break;
    }
    case 'meditate': {
      const trait = ALL_TRAITS.find(t => t.id === 'meditazione');
      const a = trait.action;
      const hrs = a.absence.minH + Math.random() * (a.absence.maxH - a.absence.minH);
      G.absence = { traitId: 'meditazione', actionId: 'meditate', endsMs: Date.now() + hrs * 3600000, label: a.absence.label, desc: a.absence.desc };
      msg = `${G.name} si è immerso nella meditazione.`;
      break;
    }
    case 'explore': {
      if (G.energy < 25) { setNotif('Energia insufficiente per esplorare.'); return; }
      const trait = ALL_TRAITS.find(t => t.id === 'esplorazione');
      const a = trait.action;
      const hrs = a.absence.minH + Math.random() * (a.absence.maxH - a.absence.minH);
      G.absence = { traitId: 'esplorazione', actionId: 'explore', endsMs: Date.now() + hrs * 3600000, label: a.absence.label, desc: a.absence.desc };
      G.energy = Math.max(0, G.energy - a.enCost);
      G.counts.explore = (G.counts.explore || 0) + 1;
      msg = `${G.name} si è avventurato. Tornerà tra ~${Math.round(hrs)}h.`;
      break;
    }
  }

  setCd(act.id, act.cooldownH);
  saveG();
  if (msg) setNotif(msg);
  updateStatsUI();
  renderActions();
  renderCreature();
}

// ── RETURN FROM ABSENCE ─────────────────────────
function checkAbsenceReturn() {
  if (!G.absence || Date.now() < G.absence.endsMs) return;

  const ab = G.absence;
  G.absence = null;

  const trait = ALL_TRAITS.find(t => t.id === ab.traitId);
  if (!trait || !trait.action) { saveG(); return; }

  const r = trait.action.reward || {};
  const mal = trait.action.malus || {};
  const parts = [];

  // rewards
  if (r.coins) {
    const v = r.coins.min + Math.floor(Math.random() * (r.coins.max - r.coins.min + 1));
    G.coins += v;
    parts.push(`+◈${v}`);
  }
  if (r.str) {
    const v = r.str.min + Math.floor(Math.random() * (r.str.max - r.str.min + 1));
    // agorafobia: reduce hunt reward
    const actual = hasTrait('agorafobia') && ab.actionId === 'hunt' ? Math.max(0, v - 4) : v;
    G.str = Math.min(100, G.str + actual);
    if (actual > 0) parts.push(`Forza +${actual}`);
  }
  if (r.int) {
    const v = r.int.min + Math.floor(Math.random() * (r.int.max - r.int.min + 1));
    G.int = Math.min(100, G.int + v);
    parts.push(`Intel +${v}`);
  }
  if (r.energy) {
    G.energy = Math.min(100, G.energy + r.energy);
    parts.push(`Energia +${r.energy}`);
  }

  // malus
  if (mal.hp) {
    let v = mal.hp.min + Math.floor(Math.random() * (mal.hp.max - mal.hp.min + 1));
    // res_fuoco reduces hunt hp loss
    if (hasTrait('res_fuoco') && ab.actionId === 'hunt') v = Math.max(0, v - 6);
    G.hp = Math.max(0, G.hp - v);
    if (v > 0) parts.push(`HP −${v}`);
  }

  // try new unlock on return
  tryUnlock(ab.actionId || 'random');

  saveG();
  setNotif(`${G.name} è tornato! ${parts.join(' · ')}`);
  spawnPt(creatureXY().x, creatureXY().y, '#c9a84c', 14);
  renderCreature();
  updateStatsUI();
  renderActions();
}

// ═══════════════════════════════════════════════════
// STATS UI
// ═══════════════════════════════════════════════════
const CIRC = 2 * Math.PI * 19; // r=19

function setRing(id, val) {
  const el = document.getElementById('ring-' + id);
  if (el) el.style.strokeDashoffset = (CIRC * (1 - Math.max(0, Math.min(100, val)) / 100)).toFixed(1);
  const v = document.getElementById('val-' + id);
  if (v) v.textContent = Math.round(val);
}

function updateStatsUI() {
  setRing('hp', G.hp);
  setRing('en', G.energy);
  setRing('str', G.str);
  setRing('int', G.int);
  document.getElementById('coin-val').textContent = Math.floor(G.coins);

  const h = G.ageHours;
  const stage = h < 48 ? 'Cucciolo' : h < 360 ? 'Giovane' : h < 2160 ? 'Adulto' : h < 8760 ? 'Anziano' : 'Antico';
  const ageStr = h < 24 ? `${Math.floor(h)}h` : h < 720 ? `${Math.floor(h / 24)}g` :
                 h < 8760 ? `${Math.floor(h / 720)}m ${Math.floor((h % 720) / 24)}g` :
                 `${Math.floor(h / 8760)}a ${Math.floor((h % 8760) / 720)}m`;
  document.getElementById('hdr-age').textContent = `${stage} · ${ageStr}`;

  const cycH = G.ageHours % 24;
  document.getElementById('daybar-fill').style.width = (cycH / 24 * 100) + '%';
  document.getElementById('daybar-lbl').textContent = `${Math.floor(cycH)}h`;
}

// ═══════════════════════════════════════════════════
// GAME TICK
// ═══════════════════════════════════════════════════
function gameTick() {
  if (G.phase !== 'alive') return;

  const now = Date.now();
  const dtH = (now - G.lastTickMs) / 3600000;
  G.lastTickMs = now;
  G.ageHours += dtH;

  const race = getRace();
  const sleeping = isCdActive('sleep');
  const absent = isAbsent();

  const hasVulnFame   = hasTrait('vuln_fame');
  const hasVulnFatica = hasTrait('vuln_fatica');
  const hasVulnSete   = hasTrait('vuln_sete');
  const hasCuraNat    = hasTrait('cura_naturale');
  const hasRisp       = hasTrait('risparmio');
  const hasResFreddo  = hasTrait('res_freddo');
  const hasFobiaBuio  = hasTrait('fobia_buio');

  if (!absent) {
    if (sleeping) {
      const enRegen = (race.attitude === 'lazy' ? 7 : 5.5) * (hasResFreddo ? 1.25 : 1);
      G.energy = Math.min(100, G.energy + enRegen * dtH);
      G.hp = Math.min(100, G.hp + 2 * dtH);
    } else {
      const eDrain = (race.attitude === 'lazy' ? 1.6 : 2.5) * (hasVulnFatica ? 1.55 : 1);
      G.energy = Math.max(0, G.energy - eDrain * dtH);
    }

    const hDrain = 2.2 * (hasVulnFame ? 2.1 : 1);
    const thDrain = 2.6 * (hasVulnSete ? 1.8 : 1);
    G.hunger  = Math.max(0, G.hunger  - hDrain  * dtH);
    G.thirst  = Math.max(0, G.thirst  - thDrain * dtH);

    if (G.hunger < 10 || G.thirst < 10) G.hp = Math.max(0, G.hp - 3 * dtH);
    if (hasCuraNat && !sleeping) G.hp = Math.min(100, G.hp + 1 * dtH);

    // fobia buio — simulate night cycles (simplified: random)
    if (hasFobiaBuio && Math.random() < 0.01 * dtH * 60) {
      G.hp = Math.max(0, G.hp - 2);
    }

    // ipersensibilità: random stress
    if (hasTrait('fobia_rumore') && Math.random() < 0.008 * dtH * 60) {
      G.hp = Math.max(0, G.hp - 5);
    }
  }

  // passive coin income (per hour)
  const baseIncome = hasTrait('risparmio') ? 1.5 : 1.0;
  G.coins += baseIncome * dtH;

  // slow natural growth
  G.str = Math.min(100, G.str + 0.04 * dtH);
  G.int = Math.min(100, G.int + 0.03 * dtH);

  // random trait unlock chance
  if (Math.random() < 0.015) tryUnlock('random');

  // check absence return
  checkAbsenceReturn();

  // alerts
  if (G.hunger < 20 && !sleeping && !absent) setNotif(`${G.name} ha fame!`);
  else if (G.thirst < 20 && !sleeping && !absent) setNotif(`${G.name} ha sete!`);
  else if (G.energy < 12 && !sleeping && !absent) setNotif(`${G.name} è esausto.`);

  saveG();
  updateStatsUI();
  renderActions();
  renderCreature();
}

// ── CREATURE TAP ────────────────────────────────
function tapCreature() {
  if (G.phase !== 'alive' || isAbsent()) return;
  const race = getRace();
  const phrases = {
    lazy:      ['...', '~', '...zzz', '·'],
    aggressive:['GRR!', '⚔', '!', '!!'],
    fearful:   ['!?', '...', '◌', '??'],
    calm:      ['◈', '~', '...', '·'],
    majestic:  ['...', '◈', '~', '·'],
  }[race.attitude] || ['~'];
  showMsg(phrases[Math.floor(Math.random() * phrases.length)]);
  spawnPt(creatureXY().x, creatureXY().y, race.accentC, 4);
}

// ── SHOP ────────────────────────────────────────
function openShop() {
  const list = document.getElementById('shop-items-list');
  document.getElementById('shop-balance').textContent = `◈ ${Math.floor(G.coins)}`;
  list.innerHTML = SHOP_ITEMS.map(item => {
    const cant = G.coins < item.cost;
    return `<div class="sitem${cant ? ' cant-afford' : ''}" onclick="buyItem('${item.id}')">
      <div class="sitem-icon">${item.icon}</div>
      <div class="sitem-info">
        <div class="sitem-name">${item.name}</div>
        <div class="sitem-desc">${item.desc}</div>
      </div>
      <div class="sitem-cost">◈${item.cost}</div>
    </div>`;
  }).join('');
  document.getElementById('shop-modal').classList.add('on');
}
function closeShop() { document.getElementById('shop-modal').classList.remove('on'); }

function buyItem(id) {
  const item = SHOP_ITEMS.find(i => i.id === id);
  if (!item) return;
  if (G.coins < item.cost) { setNotif(`Aetherin insufficiente — ti servono ◈${item.cost}.`); closeShop(); return; }
  G.coins -= item.cost;
  item.fn(G);
  saveG();
  updateStatsUI();
  setNotif(`${item.name} usato.`);
  closeShop();
  spawnPt(window.innerWidth / 2, window.innerHeight * .45, getRace().accentC, 10);
}

// ── ABILITIES MODAL ─────────────────────────────
function openAbilities() {
  const list = document.getElementById('ab-list');
  const traits = getUnlockedTraits();
  if (traits.length === 0) {
    list.innerHTML = `<div id="ab-empty">Nessun tratto scoperto ancora.<br><br>Gioca, allenati e fai riposare<br>${G.name} per sbloccarne.</div>`;
  } else {
    list.innerHTML = traits.map(t => {
      const catLabel = { abilita:'abilità', resistenza:'resistenza', fobia:'fobia', vulnerabilita:'vulnerabilità' }[t.cat] || t.cat;
      return `<div class="ab-card" style="border-left-color:${t.color}">
        <div class="ab-card-head">
          <div class="ab-card-icon">${t.icon}</div>
          <div class="ab-card-name" style="color:${t.color}">${t.name}</div>
          <div class="ab-card-cat" style="background:${t.bg};color:${t.color};border:1px solid ${t.color}33">${catLabel}</div>
        </div>
        <div class="ab-card-desc">${t.desc}</div>
      </div>`;
    }).join('');
  }
  document.getElementById('abilities-modal').classList.add('on');
}
function closeAbilities() { document.getElementById('abilities-modal').classList.remove('on'); }

// ═══════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════
function creatureXY() {
  const el = document.getElementById('c-sprite');
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

let notifTm;
function setNotif(txt) {
  const el = document.getElementById('notif');
  if (!el) return;
  el.textContent = txt;
  el.style.opacity = '1';
  clearTimeout(notifTm);
  notifTm = setTimeout(() => el.style.opacity = '0', 5500);
}

let msgTm;
function showMsg(txt) {
  const el = document.getElementById('c-msg');
  el.textContent = txt;
  el.classList.add('on');
  clearTimeout(msgTm);
  msgTm = setTimeout(() => el.classList.remove('on'), 2200);
}

function spawnPt(x, y, color, n) {
  const c = document.getElementById('particles');
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'pt';
    const sz = 3 + Math.random() * 5;
    const tx = (Math.random() - .5) * 90, ty = -(22 + Math.random() * 65);
    el.style.cssText = `width:${sz}px;height:${sz}px;background:${color};left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px;animation-delay:${Math.random() * .14}s`;
    c.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

// ═══════════════════════════════════════════════════
// PWA INSTALL
// ═══════════════════════════════════════════════════
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (!localStorage.getItem('install_dismissed')) {
    document.getElementById('install-banner').classList.add('on');
  }
});

function doInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    document.getElementById('install-banner').classList.remove('on');
  });
}

function dismissInstall() {
  localStorage.setItem('install_dismissed', '1');
  document.getElementById('install-banner').classList.remove('on');
}

function checkInstallPrompt() {
  // iOS hint
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isIOS && !isStandalone && !localStorage.getItem('install_dismissed')) {
    document.getElementById('install-text').textContent =
      'Su iPhone: tocca il pulsante Condividi ↑ poi "Aggiungi a schermata Home".';
    document.getElementById('install-btn').style.display = 'none';
    setTimeout(() => document.getElementById('install-banner').classList.add('on'), 2000);
  }
}

window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner').classList.remove('on');
});

// ═══════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════
setInterval(gameTick, 60000);          // every minute
setInterval(() => {                     // every 15s: refresh cooldown display + absence
  if (G.phase === 'alive') {
    checkAbsenceReturn();
    renderActions();
    renderCreature();
  }
}, 15000);

// Page visibility: recalculate on return
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && G.phase === 'alive') {
    gameTick();
  }
});
