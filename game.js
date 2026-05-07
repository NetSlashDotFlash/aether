// ═══════════════════════════════════════════════════
// ÆTHER — game.js v2
// 10 specie, evoluzioni ramificate, stati attivi, sonno automatico
// ═══════════════════════════════════════════════════

// Drain rates: base 4.2/h means 0→100 in 24h at 1.0x multiplier
// hungerRate/thirstRate: multiplier on 4.2/h base
// boredRate: boredom gain per hour
// energyRate: energy loss per hour while awake
const BASE_SPECIES = {
  luminfang:{name:'Luminfang',icon:'🐱',bodyC:'#1e3a28',accentC:'#55bb77',strokeC:'#33994a',auraC:'rgba(70,190,90,.2)',attitude:'lazy',hungerRate:0.90,thirstRate:1.00,boredRate:2.5,energyRate:3.5,
    evoPaths:{juvenile:[{id:'lumi_wild',name:'Luminfang Selvatico',condition:'hunt>=3',desc:'Ha sviluppato istinti predatori.'},{id:'lumi_mystic',name:'Luminfang Mistico',condition:'meditate>=2',desc:'La sua luce si è intensificata.'},{id:'lumi_gentle',name:'Luminfang Gentile',condition:'play>=5',desc:'Docile e affettuoso.'}],
    adult:[{id:'lumi_apex',name:'Luminfang Apex',condition:'hunt>=8',desc:'Predatore perfetto.'},{id:'lumi_sage',name:'Luminfang Saggio',condition:'meditate>=6',desc:'Illuminato dalla luce interiore.'},{id:'lumi_guardian',name:'Luminfang Guardiano',condition:'play>=12',desc:'Protettore leale.'}]}},
  volcanox:{name:'Volcanox',icon:'🔥',bodyC:'#3a0e04',accentC:'#ff5522',strokeC:'#cc3300',auraC:'rgba(210,75,20,.2)',attitude:'aggressive',hungerRate:1.4,thirstRate:1.6,boredRate:3.5,energyRate:5.5,
    evoPaths:{juvenile:[{id:'vol_inferno',name:'Infernox',condition:'hunt>=4',desc:'Le sue fiamme sono diventate blu.'},{id:'vol_stone',name:'Lapillix',condition:'sleep>=5',desc:'La pelle si è calcificata.'},{id:'vol_storm',name:'Tempestix',condition:'play>=4',desc:'Fulmini scorrono tra le scaglie.'}],
    adult:[{id:'vol_pyro',name:'Pyrodrax',condition:'hunt>=10',desc:'Signore del fuoco primordiale.'},{id:'vol_titan',name:'Titanix',condition:'sleep>=12',desc:'Corpo massiccio come la roccia.'},{id:'vol_fulmin',name:'Fulminrex',condition:'play>=10',desc:'Porta tempeste ovunque vada.'}]}},
  umbrasel:{name:'Umbrasel',icon:'👁',bodyC:'#120828',accentC:'#9966ee',strokeC:'#7744cc',auraC:'rgba(95,55,190,.2)',attitude:'fearful',hungerRate:0.7,thirstRate:0.8,boredRate:4.0,energyRate:4.0,
    evoPaths:{juvenile:[{id:'umb_void',name:'Voidsel',condition:'sleep>=6',desc:'Si è dissolto nel vuoto.'},{id:'umb_seer',name:'Seersel',condition:'meditate>=3',desc:'I suoi occhi vedono il futuro.'},{id:'umb_specter',name:'Spectryx',condition:'hunt>=2',desc:'Caccia nell\'ombra.'}],
    adult:[{id:'umb_abyss',name:'Abyssalon',condition:'sleep>=14',desc:'Creatura dell\'abisso dimensionale.'},{id:'umb_oracle',name:'Oraculum',condition:'meditate>=8',desc:'Conosce passato e futuro.'},{id:'umb_nether',name:'Nethrix',condition:'hunt>=7',desc:'Cacciatore tra i piani.'}]}},
  crystalis:{name:'Crystalis',icon:'💎',bodyC:'#0a1e28',accentC:'#22ddee',strokeC:'#00bbcc',auraC:'rgba(0,195,215,.2)',attitude:'calm',hungerRate:0.8,thirstRate:0.85,boredRate:2.0,energyRate:3.0,
    evoPaths:{juvenile:[{id:'cry_aurora',name:'Aurorix',condition:'sleep>=5',desc:'Riflette l\'aurora boreale.'},{id:'cry_blade',name:'Shardenyx',condition:'hunt>=3',desc:'I cristalli si sono affilati.'},{id:'cry_prism',name:'Prismatix',condition:'play>=4',desc:'Proietta arcobaleni.'}],
    adult:[{id:'cry_celest',name:'Celestalux',condition:'sleep>=12',desc:'Corpo di luce solidificata.'},{id:'cry_war',name:'Diamondrax',condition:'hunt>=9',desc:'La forma più dura della materia.'},{id:'cry_rainbow',name:'Spectralix',condition:'play>=11',desc:'Incarna tutti i colori.'}]}},
  aetherwyrm:{name:'Aetherwyrm',icon:'🌟',bodyC:'#140d00',accentC:'#ddaa22',strokeC:'#bb8800',auraC:'rgba(195,165,30,.2)',attitude:'majestic',hungerRate:0.55,thirstRate:0.6,boredRate:1.5,energyRate:2.5,
    evoPaths:{juvenile:[{id:'aew_solar',name:'Solwyrm',condition:'play>=3',desc:'Ha assorbito l\'energia solare.'},{id:'aew_void',name:'Voidwyrm',condition:'sleep>=7',desc:'Si nutre del vuoto cosmico.'},{id:'aew_storm',name:'Stormwyrm',condition:'hunt>=3',desc:'Porta tempeste stellari.'}],
    adult:[{id:'aew_star',name:'Starlord',condition:'play>=9',desc:'Una stella vivente.'},{id:'aew_black',name:'Singularis',condition:'sleep>=16',desc:'Densità di un buco nero.'},{id:'aew_nova',name:'Supernovax',condition:'hunt>=9',desc:'Esplode di energia cosmica.'}]}},
  thalasyn:{name:'Thalasyn',icon:'🌊',bodyC:'#041420',accentC:'#22aaff',strokeC:'#0088dd',auraC:'rgba(25,135,215,.2)',attitude:'calm',hungerRate:0.95,thirstRate:0.4,boredRate:2.8,energyRate:3.2,
    evoPaths:{juvenile:[{id:'tha_deep',name:'Abyssalyn',condition:'sleep>=5',desc:'Si è adattato alle profondità.'},{id:'tha_storm',name:'Maelstrix',condition:'hunt>=3',desc:'Cavalca le tempeste marine.'},{id:'tha_coral',name:'Coralyx',condition:'play>=4',desc:'Fiorito come una barriera corallina.'}],
    adult:[{id:'tha_lev',name:'Leviathos',condition:'sleep>=13',desc:'Signore degli abissi.'},{id:'tha_typ',name:'Typhonyx',condition:'hunt>=8',desc:'Provoca uragani.'},{id:'tha_reef',name:'Reefalis',condition:'play>=10',desc:'Un ecosistema vivente.'}]}},
  geolem:{name:'Geolem',icon:'🪨',bodyC:'#221808',accentC:'#aa8855',strokeC:'#886633',auraC:'rgba(145,105,55,.2)',attitude:'calm',hungerRate:0.65,thirstRate:0.55,boredRate:1.5,energyRate:2.0,
    evoPaths:{juvenile:[{id:'geo_iron',name:'Ironlem',condition:'hunt>=4',desc:'Indurito come il ferro.'},{id:'geo_moss',name:'Mosslem',condition:'play>=5',desc:'La natura lo ha colonizzato.'},{id:'geo_gem',name:'Gemlem',condition:'sleep>=6',desc:'Gemme crescono dalla pelle.'}],
    adult:[{id:'geo_titan',name:'Terratitan',condition:'hunt>=10',desc:'Un colosso di roccia pura.'},{id:'geo_ancient',name:'Ancientlem',condition:'play>=12',desc:'La natura è parte di lui.'},{id:'geo_diamond',name:'Diamaglem',condition:'sleep>=14',desc:'Pressione trasformata in diamante.'}]}},
  zephyrix:{name:'Zephyrix',icon:'🌪',bodyC:'#080818',accentC:'#aaccff',strokeC:'#88aaee',auraC:'rgba(135,175,250,.18)',attitude:'playful',hungerRate:1.6,thirstRate:1.4,boredRate:5.0,energyRate:6.5,
    evoPaths:{juvenile:[{id:'zep_gale',name:'Galerix',condition:'play>=6',desc:'Corre alla velocità del vento.'},{id:'zep_storm',name:'Cyclonyx',condition:'hunt>=4',desc:'È diventato una tempesta.'},{id:'zep_mist',name:'Mistrix',condition:'sleep>=4',desc:'Si è dissolto nella nebbia.'}],
    adult:[{id:'zep_jet',name:'Jetstream',condition:'play>=13',desc:'Supera il suono.'},{id:'zep_hurr',name:'Hurricanyx',condition:'hunt>=10',desc:'Un uragano senziente.'},{id:'zep_phant',name:'Phantomist',condition:'sleep>=11',desc:'Invisibile come l\'aria.'}]}},
  mycelith:{name:'Mycelith',icon:'🍄',bodyC:'#180828',accentC:'#cc88ff',strokeC:'#aa66dd',auraC:'rgba(175,95,250,.18)',attitude:'mysterious',hungerRate:0.6,thirstRate:1.5,boredRate:2.2,energyRate:3.0,
    evoPaths:{juvenile:[{id:'myc_toxic',name:'Toxicelith',condition:'hunt>=3',desc:'Le spore sono velenose.'},{id:'myc_glow',name:'Glowycel',condition:'sleep>=6',desc:'Bioluminescente.'},{id:'myc_net',name:'Networkycel',condition:'play>=4',desc:'Mente collettiva.'}],
    adult:[{id:'myc_plague',name:'Plaguelith',condition:'hunt>=8',desc:'Porta trasformazione ovunque.'},{id:'myc_lum',name:'Lumycelith',condition:'sleep>=14',desc:'Galassia di spore luminose.'},{id:'myc_hive',name:'Hivemycel',condition:'play>=10',desc:'Controlla altri organismi.'}]}},
  stormkin:{name:'Stormkin',icon:'⚡',bodyC:'#080420',accentC:'#ffee44',strokeC:'#ddcc00',auraC:'rgba(250,215,35,.18)',attitude:'aggressive',hungerRate:1.7,thirstRate:1.2,boredRate:4.5,energyRate:6.0,
    evoPaths:{juvenile:[{id:'sto_bolt',name:'Boltkin',condition:'hunt>=4',desc:'Fulmine vivente.'},{id:'sto_thund',name:'Thunderkin',condition:'play>=5',desc:'Il suo tuono si sente da km.'},{id:'sto_stat',name:'Statickin',condition:'sleep>=4',desc:'Accumula energia statica.'}],
    adult:[{id:'sto_zeus',name:'Fulminatus',condition:'hunt>=10',desc:'Signore dei fulmini.'},{id:'sto_god',name:'Tempestatis',condition:'play>=12',desc:'Porta il diluvio.'},{id:'sto_cap',name:'Megavoltix',condition:'sleep>=10',desc:'Energia inesauribile.'}]}},
};

// Trait system: hundreds of possible traits
// minCount = minimum action count before trait CAN unlock
// prob = probability per check (checked each time action is performed)
// First traits appear after ~1-2 weeks of daily play
const ALL_TRAITS=[
  {id:'caccia',cat:'abilita',name:'Istinto di Caccia',icon:'⚔',desc:'Può andare a caccia e tornare con risorse.',color:'#e8855a',bg:'rgba(232,133,90,.12)',unlock:{trigger:'play',minCount:18,prob:0.08},
   action:{id:'hunt',label:'Caccia',icon:'⚔',cooldownH:24,absence:{minH:2,maxH:6,label:'CACCIA',desc:'sta cacciando nell\'oscurità.'},enCost:30,reward:{coins:{min:15,max:45}},malus:{hp:{min:0,max:14}}}},
  {id:'meditazione',cat:'abilita',name:'Meditazione Eterea',icon:'◈',desc:'Si immerge in trance per recuperare energia.',color:'#7c9fbf',bg:'rgba(124,159,191,.12)',unlock:{trigger:'train',minCount:15,prob:0.08},
   action:{id:'meditate',label:'Medita',icon:'◈',cooldownH:18,absence:{minH:1,maxH:3,label:'MEDITAZIONE',desc:'è in trance profonda.'},enCost:0,reward:{coins:{min:5,max:18},energy:30},malus:{}}},
  {id:'esplorazione',cat:'abilita',name:'Spirito Esploratore',icon:'◎',desc:'Esplora e torna con risorse rare.',color:'#55bb77',bg:'rgba(85,187,119,.12)',unlock:{trigger:'play',minCount:22,prob:0.06},
   action:{id:'explore',label:'Esplora',icon:'◎',cooldownH:20,absence:{minH:3,maxH:8,label:'ESPLORAZIONE',desc:'sta esplorando regioni remote.'},enCost:20,reward:{coins:{min:20,max:60}},malus:{hp:{min:0,max:10}}}},
  {id:'cura_nat',cat:'abilita',name:'Guarigione Naturale',icon:'✦',desc:'Si rigenera lentamente nel tempo.',color:'#00e5c8',bg:'rgba(0,229,200,.1)',unlock:{trigger:'sleep',minCount:20,prob:0.07},action:null},
  {id:'res_fuoco',cat:'resistenza',name:'Resistenza al Fuoco',icon:'🔥',desc:'I danni da calore si riducono.',color:'#ff7722',bg:'rgba(255,119,34,.1)',unlock:{trigger:'hunt',minCount:12,prob:0.09},action:null},
  {id:'corazza',cat:'resistenza',name:'Corazza Naturale',icon:'◆',desc:'La pelle si è indurita.',color:'#aabb99',bg:'rgba(170,187,153,.1)',unlock:{trigger:'train',minCount:25,prob:0.06},action:null},
  {id:'fobia_buio',cat:'fobia',name:'Paura del Buio',icon:'☽',desc:'Perde HP extra nelle ore notturne.',color:'#9966aa',bg:'rgba(153,102,170,.1)',unlock:{trigger:'random',prob:0.03},action:null},
  {id:'vuln_fame',cat:'vulnerabilita',name:'Metabolismo Vorrace',icon:'◐',desc:'Ha fame il doppio del normale.',color:'#e8a060',bg:'rgba(232,160,96,.1)',unlock:{trigger:'random',prob:0.03},action:null},
  {id:'vuln_sete',cat:'vulnerabilita',name:'Pelle Porosa',icon:'◒',desc:'Ha sete più velocemente.',color:'#6699cc',bg:'rgba(102,153,204,.1)',unlock:{trigger:'random',prob:0.025},action:null},
];

const TRAIT_MAP={};
ALL_TRAITS.forEach(t=>{const k=t.unlock.trigger;if(!TRAIT_MAP[k])TRAIT_MAP[k]=[];TRAIT_MAP[k].push(t);});

const BASE_ACTIONS=[
  {id:'feed',label:'Nutrì',icon:'🍖',cooldownH:6,cost:8},
  {id:'water',label:'Acqua',icon:'💧',cooldownH:4,cost:4},
  {id:'play',label:'Gioca',icon:'◈',cooldownH:8,cost:0},
  {id:'train',label:'Allena',icon:'▲',cooldownH:14,cost:0},
  {id:'cure',label:'Cura',icon:'✦',cooldownH:2,cost:22},
];

const SHOP_ITEMS=[
  {id:'food_s',name:'Razione Base',icon:'🍖',desc:'Fame +35, HP +5',cost:8,fn:g=>{g.hunger=Math.min(100,g.hunger+35);g.hp=Math.min(100,g.hp+5)}},
  {id:'food_l',name:'Banchetto Mistico',icon:'🍗',desc:'Fame +75, HP +12',cost:18,fn:g=>{g.hunger=Math.min(100,g.hunger+75);g.hp=Math.min(100,g.hp+12)}},
  {id:'water_s',name:'Acqua dell\'Etere',icon:'💧',desc:'Sete +42',cost:4,fn:g=>{g.thirst=Math.min(100,g.thirst+42)}},
  {id:'elixir',name:'Elisir Vitale',icon:'✦',desc:'HP +45',cost:22,fn:g=>{g.hp=Math.min(100,g.hp+45)}},
  {id:'tonic_e',name:'Tonico Energetico',icon:'⚡',desc:'Energia +40',cost:14,fn:g=>{g.energy=Math.min(100,g.energy+40)}},
  {id:'toy',name:'Giocattolo Mistico',icon:'🎮',desc:'Noia −50',cost:10,fn:g=>{g.boredom=Math.max(0,g.boredom-50)}},
];

// ── STATE ────────────────────────────────────────
function loadG(){return migrateG(window.G)||null;}
function saveG(){if(window.saveToCloud)window.saveToCloud(G);try{localStorage.setItem('aether_v4_bk',JSON.stringify(G));}catch(e){}}

let G=null; // initialized by window.startGame after Firebase auth
function newGame(){return{phase:'egg',eggStart:Date.now(),eggDuration:7*24*3600*1000,eggTaps:0,speciesId:null,name:null,birthMs:null,currentForm:null,stage:'hatchling',hp:90,hunger:85,thirst:85,energy:90,boredom:10,isSleeping:false,sleepStart:null,sleepDuration:null,absence:null,coins:15,nextCoinMs:Date.now()+3600000,counts:{play:0,train:0,sleep:0,hunt:0,explore:0,meditate:0},cooldowns:{},unlockedTraitIds:[],evoLog:[],lastTickMs:Date.now()};}

// ── SAVE MIGRATION ───────────────────────────────────────────────
function migrateG(g){
  if(!g) return g;
  // Fix sleep state
  if(g.sleepStart===undefined) g.sleepStart=null;
  if(g.sleepDuration===undefined) g.sleepDuration=null;
  if(g.isSleeping===undefined) g.isSleeping=false;
  if(g.isSleeping&&!g.sleepDuration) g.isSleeping=false;
  // Fix missing fields
  if(g.boredom===undefined) g.boredom=20;
  if(g.hp===undefined) g.hp=80;
  if(g.coins===undefined) g.coins=10;
  if(g.nextCoinMs===undefined) g.nextCoinMs=Date.now()+3600000;
  if(!g.counts) g.counts={};
  ['play','train','sleep','hunt','explore','meditate'].forEach(k=>{if(g.counts[k]===undefined)g.counts[k]=0;});
  if(!g.unlockedTraitIds) g.unlockedTraitIds=[];
  if(!g.evoLog) g.evoLog=[];
  if(!g.cooldowns) g.cooldowns={};
  // Fix stage based on age (only upgrade, never downgrade)
  if(g.phase==='alive'&&g.birthMs){
    const ageH=(Date.now()-g.birthMs)/3600000;
    const correct=ageH<720?'hatchling':ageH<2160?'juvenile':ageH<8760?'adult':'elder';
    const order=['hatchling','juvenile','adult','elder'];
    if(order.indexOf(correct)>order.indexOf(g.stage||'hatchling')) g.stage=correct;
    if(!g.stage) g.stage='hatchling';
  }
  // Remove buggy sleep cooldown (>14h means old bug)
  if(g.cooldowns&&g.cooldowns.sleep&&(g.cooldowns.sleep-Date.now())>14*3600000) delete g.cooldowns.sleep;
  // Cap needs 0-100
  ['hp','hunger','thirst','energy','boredom'].forEach(k=>{if(g[k]!==undefined)g[k]=Math.max(0,Math.min(100,g[k]));});
  // Cap offline catchup to 12h
  const now=Date.now();
  if(!g.lastTickMs||g.lastTickMs>now) g.lastTickMs=now;
  if(now-g.lastTickMs>12*3600000) g.lastTickMs=now-12*3600000;
  return g;
}


function getSp(){return BASE_SPECIES[G.speciesId]||BASE_SPECIES.luminfang;}
function getUnlockedTraits(){return G.unlockedTraitIds.map(id=>ALL_TRAITS.find(t=>t.id===id)).filter(Boolean);}
function getUnlockedActions(){return getUnlockedTraits().filter(t=>t.action).map(t=>t.action);}
function hasTrait(id){return G.unlockedTraitIds.includes(id);}
function getCurrentForm(){const sp=getSp();if(!G.currentForm)return null;for(const paths of Object.values(sp.evoPaths||{})){const f=paths.find(p=>p.id===G.currentForm);if(f)return f;}return null;}

// ── BG CANVAS ────────────────────────────────────
const canvas=document.getElementById('bg-canvas'),ctx=canvas.getContext('2d');let stars=[];
function initCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;stars=Array.from({length:80},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:.3+Math.random()*1.2,a:Math.random(),spd:.0015+Math.random()*.003,ph:Math.random()*Math.PI*2}));}
function drawBg(t){ctx.clearRect(0,0,canvas.width,canvas.height);for(const s of stars){s.a=.12+.55*Math.abs(Math.sin(t*s.spd+s.ph));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(165,200,235,${s.a})`;ctx.fill();}requestAnimationFrame(t=>drawBg(t/1000));}
initCanvas();window.addEventListener('resize',initCanvas);requestAnimationFrame(t=>drawBg(t/1000));

// ── SPLASH ───────────────────────────────────────
// Splash: fade out after 1.4s, then show login screen
// Firebase will call window.startGame() when ready
setTimeout(() => {
  const splash = document.getElementById('splash');
  if (splash) {
    splash.classList.add('fade');
    setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 900);
  }
  // Show login screen — Firebase onAuthStateChanged will hide it if already logged in
  document.getElementById('login-screen').classList.add('on');
}, 1400);

function boot(){
  if(!G){console.error('boot() called with null G');return;}
  if(G.phase==='egg'){document.getElementById('egg-view').style.display='flex';document.getElementById('app').style.display='none';updateEggUI();setInterval(updateEggUI,20000);}
  else{document.getElementById('egg-view').style.display='none';document.getElementById('app').style.display='grid';initMainApp();}
  checkInstallPrompt();
}

// ── EGG ──────────────────────────────────────────
function updateEggUI(){
  const elapsed=Date.now()-G.eggStart,pct=Math.min(1,elapsed/G.eggDuration),rem=Math.max(0,G.eggDuration-elapsed);
  document.getElementById('egg-bar-fill').style.width=(pct*100)+'%';
  if(rem<3600000)document.getElementById('egg-days').textContent=`Si schiude in ${Math.ceil(rem/60000)}min`;
  else if(rem<86400000)document.getElementById('egg-days').textContent=`Si schiude in ${Math.ceil(rem/3600000)}h`;
  else document.getElementById('egg-days').textContent=`Giorno ${Math.floor(elapsed/86400000)+1} di 7`;
  if(pct>.80){const c=document.getElementById('ecracks');if(c)c.style.opacity=((pct-.80)/.20).toFixed(2);}
  if(pct>=1)hatchEgg();
}
let tapCount=0;
document.getElementById('egg-view').addEventListener('click',()=>{
  tapCount++;G.eggTaps=(G.eggTaps||0)+1;saveG();
  const w=document.getElementById('egg-float');w.style.transform='scale(1.07)';setTimeout(()=>w.style.transform='',150);
  spawnPt(window.innerWidth/2,window.innerHeight*.44,'#9966cc',5);
  if(tapCount>=21){G.eggDuration=500;saveG();}
  document.getElementById('egg-taps-info').textContent=tapCount<21?`demo: ancora ${21-tapCount} tap`:'';
});

const NAMES=['Vael','Siro','Aelo','Myra','Kael','Syl','Aurel','Zyr','Kyris','Ignar','Brax','Shael','Lyra','Nyx','Solein','Miru','Caldar','Ombre','Aeon','Embyr','Tira','Vex','Lorin','Sabel','Quarix'];
function hatchEgg(){
  const keys=Object.keys(BASE_SPECIES);
  const speciesId=keys[Math.floor(Math.random()*keys.length)];
  const sp=BASE_SPECIES[speciesId];
  const name=NAMES[Math.floor(Math.random()*NAMES.length)];
  G={...newGame(),phase:'alive',speciesId,name,birthMs:Date.now(),stage:'hatchling',hp:85,hunger:80,thirst:80,energy:90,boredom:10,coins:15};
  saveG();
  document.getElementById('egg-view').style.display='none';
  document.getElementById('app').style.display='grid';
  initMainApp();setNotif(`${name} è nato! Un piccolo ${sp.name}.`);
}

// ── MAIN APP ─────────────────────────────────────
function initMainApp(){const sp=getSp();document.getElementById('hdr-name').textContent=G.name;document.getElementById('c-aura').style.background=`radial-gradient(circle,${sp.auraC} 0%,transparent 68%)`;renderAll();gameTick();}

function renderAll(){renderHeader();renderCreature();renderStates();renderActions();renderActivity();updateCoinTimer();}

// ── HEADER ───────────────────────────────────────
function renderHeader(){
  const sp=getSp(),form=getCurrentForm();
  const displayName=form?form.name:sp.name;
  const stageLabel={hatchling:'Cucciolo',juvenile:'Giovane',adult:'Adulto',elder:'Antico'}[G.stage]||'';
  const ageH=G.birthMs?(Date.now()-G.birthMs)/3600000:0;
  const ageStr=ageH<24?`${Math.floor(ageH)}h`:ageH<720?`${Math.floor(ageH/24)}g`:ageH<8760?`${Math.floor(ageH/720)}m`:`${Math.floor(ageH/8760)}a`;
  document.getElementById('hdr-sub').textContent=`${displayName} · ${stageLabel}`;
  document.getElementById('hdr-age').textContent=ageStr+' di vita';
}

// ── CREATURE SVG ─────────────────────────────────
function renderCreature(){
  const absent=isAbsent(),overlay=document.getElementById('absence-overlay');
  overlay.classList.toggle('on',absent||G.isSleeping);
  if(G.isSleeping){
    document.getElementById('absence-title').textContent='DORME';
    document.getElementById('absence-desc').textContent=`${G.name} sta dormendo profondamente.`;
    const rem=G.sleepStart&&G.sleepDuration?Math.max(0,(G.sleepStart+G.sleepDuration)-Date.now()):0;
    document.getElementById('absence-cd').textContent=rem>0?`Si sveglia tra ${fmtMs(rem)}`:'Quasi sveglio...';
  }else if(absent){
    const ab=G.absence;
    document.getElementById('absence-title').textContent=ab.label||'ASSENTE';
    document.getElementById('absence-desc').textContent=`${G.name} ${ab.desc}`;
    const rem=Math.max(0,ab.endsMs-Date.now());
    document.getElementById('absence-cd').textContent=rem>0?`Torna tra ${fmtMs(rem)}`:'Sta tornando...';
  }
  const sp=getSp();
  const scale=G.stage==='hatchling'?.55:G.stage==='juvenile'?.76:G.stage==='adult'?.95:1.1;
  const sz=Math.round(108*scale);
  let eye='normal';
  if(G.isSleeping)eye='sleep';
  else if(G.hunger<20)eye='hungry';
  else if(G.thirst<20)eye='thirsty';
  else if(G.boredom>75)eye='bored';
  else if(G.energy<15)eye='tired';
  document.getElementById('c-sprite').innerHTML=buildSVG(sp,sz,eye);
  // trait pills
  const wrap=document.getElementById('traits-wrap');
  wrap.innerHTML=getUnlockedTraits().slice(-4).map(t=>`<div class="tpill" style="background:${t.bg};border:1px solid ${t.color}33;color:${t.color}">${t.icon}</div>`).join('');
}

function buildSVG(sp,size,eye){
  const r=size/2,cx=r,cy=r*1.08,br=r*.60;
  const ac=sp.accentC,bc=sp.bodyC,sc=sp.strokeC;
  const eyeMap={
    normal:`<circle cx="${cx-br*.28}" cy="${cy-br*.1}" r="${br*.13}" fill="${ac}" opacity=".9"/><circle cx="${cx+br*.28}" cy="${cy-br*.1}" r="${br*.13}" fill="${ac}" opacity=".9"/><circle cx="${cx-br*.23}" cy="${cy-br*.13}" r="${br*.05}" fill="rgba(255,255,255,.7)"/><circle cx="${cx+br*.23}" cy="${cy-br*.13}" r="${br*.05}" fill="rgba(255,255,255,.7)"/>`,
    sleep:`<path d="M${cx-br*.38},${cy-br*.08} Q${cx-br*.28},${cy} ${cx-br*.18},${cy-br*.08}" fill="none" stroke="${ac}" stroke-width="${br*.07}" stroke-linecap="round"/><path d="M${cx+br*.18},${cy-br*.08} Q${cx+br*.28},${cy} ${cx+br*.38},${cy-br*.08}" fill="none" stroke="${ac}" stroke-width="${br*.07}" stroke-linecap="round"/>`,
    hungry:`<circle cx="${cx-br*.28}" cy="${cy-br*.06}" r="${br*.12}" fill="${ac}" opacity=".65"/><circle cx="${cx+br*.28}" cy="${cy-br*.06}" r="${br*.12}" fill="${ac}" opacity=".65"/><path d="M${cx-br*.15},${cy+br*.2} Q${cx},${cy+br*.12} ${cx+br*.15},${cy+br*.2}" fill="none" stroke="${ac}" stroke-width="${br*.05}" stroke-linecap="round"/>`,
    thirsty:`<circle cx="${cx-br*.28}" cy="${cy-br*.08}" r="${br*.1}" fill="${ac}" opacity=".55"/><circle cx="${cx+br*.28}" cy="${cy-br*.08}" r="${br*.1}" fill="${ac}" opacity=".55"/>`,
    bored:`<path d="M${cx-br*.32},${cy-br*.08} Q${cx-br*.24},${cy-br*.04} ${cx-br*.16},${cy-br*.08}" fill="none" stroke="${ac}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".45"/><path d="M${cx+br*.16},${cy-br*.08} Q${cx+br*.24},${cy-br*.04} ${cx+br*.32},${cy-br*.08}" fill="none" stroke="${ac}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".45"/>`,
    tired:`<path d="M${cx-br*.38},${cy-br*.07} Q${cx-br*.28},${cy-br*.03} ${cx-br*.18},${cy-br*.07}" fill="none" stroke="${ac}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".45"/><path d="M${cx+br*.18},${cy-br*.07} Q${cx+br*.28},${cy-br*.03} ${cx+br*.38},${cy-br*.07}" fill="none" stroke="${ac}" stroke-width="${br*.06}" stroke-linecap="round" opacity=".45"/>`,
  };
  const extrasMap={
    luminfang:`<ellipse cx="${cx-br*.52}" cy="${cy-br*1.06}" rx="${br*.17}" ry="${br*.36}" fill="${bc}" stroke="${sc}" stroke-width="1.1" opacity=".9"/><ellipse cx="${cx+br*.52}" cy="${cy-br*1.06}" rx="${br*.17}" ry="${br*.36}" fill="${bc}" stroke="${sc}" stroke-width="1.1" opacity=".9"/>`,
    volcanox:`<polygon points="${cx},${cy-br*1.4} ${cx-br*.23},${cy-br*.9} ${cx+br*.23},${cy-br*.9}" fill="${ac}" opacity=".6"/><path d="M${cx-br*.62},${cy+br*.3} Q${cx-br*.8},${cy+br*.6} ${cx-br*.5},${cy+br*.78}" fill="none" stroke="${ac}" stroke-width="${br*.11}" stroke-linecap="round" opacity=".4"/>`,
    umbrasel:`<ellipse cx="${cx}" cy="${cy+br*.72}" rx="${br*.84}" ry="${br*.2}" fill="${ac}" opacity=".16"/><circle cx="${cx-br*.56}" cy="${cy-br*.38}" r="${br*.07}" fill="${ac}" opacity=".5"/><circle cx="${cx+br*.56}" cy="${cy-br*.38}" r="${br*.07}" fill="${ac}" opacity=".5"/>`,
    crystalis:`<polygon points="${cx},${cy-br*1.24} ${cx-br*.19},${cy-br*.82} ${cx+br*.19},${cy-br*.82}" fill="${ac}" opacity=".4"/><path d="M${cx-br*.7},${cy-br*.18} L${cx-br*.9},${cy+br*.2} L${cx-br*.6},${cy+br*.32}" fill="none" stroke="${ac}" stroke-width="1.4" opacity=".36"/><path d="M${cx+br*.7},${cy-br*.18} L${cx+br*.9},${cy+br*.2} L${cx+br*.6},${cy+br*.32}" fill="none" stroke="${ac}" stroke-width="1.4" opacity=".36"/>`,
    aetherwyrm:`<ellipse cx="${cx}" cy="${cy-br*1.18}" rx="${br*.64}" ry="${br*.17}" fill="${ac}" opacity=".2" transform="rotate(-8,${cx},${cy-br*1.18})"/><path d="M${cx-br*.52},${cy+br*.62} Q${cx},${cy+br*1.04} ${cx+br*.52},${cy+br*.62}" fill="none" stroke="${ac}" stroke-width="2.2" opacity=".34" stroke-linecap="round"/>`,
    thalasyn:`<path d="M${cx-br*.7},${cy+br*.2} Q${cx-br*.85},${cy+br*.55} ${cx-br*.6},${cy+br*.75}" fill="none" stroke="${ac}" stroke-width="${br*.1}" stroke-linecap="round" opacity=".5"/><path d="M${cx+br*.7},${cy+br*.2} Q${cx+br*.85},${cy+br*.55} ${cx+br*.6},${cy+br*.75}" fill="none" stroke="${ac}" stroke-width="${br*.1}" stroke-linecap="round" opacity=".5"/>`,
    geolem:`<rect x="${cx-br*.65}" y="${cy-br*.3}" width="${br*.18}" height="${br*.6}" rx="3" fill="${ac}" opacity=".3"/><rect x="${cx+br*.47}" y="${cy-br*.3}" width="${br*.18}" height="${br*.6}" rx="3" fill="${ac}" opacity=".3"/>`,
    zephyrix:`<ellipse cx="${cx}" cy="${cy-br*1.1}" rx="${br*.65}" ry="${br*.14}" fill="${ac}" opacity=".22" transform="rotate(5,${cx},${cy-br*1.1})"/><path d="M${cx-br*.6},${cy+br*.1} L${cx-br*.9},${cy+br*.4}" fill="none" stroke="${ac}" stroke-width="${br*.08}" opacity=".4" stroke-linecap="round"/><path d="M${cx+br*.6},${cy+br*.1} L${cx+br*.9},${cy+br*.4}" fill="none" stroke="${ac}" stroke-width="${br*.08}" opacity=".4" stroke-linecap="round"/>`,
    mycelith:`<circle cx="${cx-br*.55}" cy="${cy-br*.5}" r="${br*.1}" fill="${ac}" opacity=".5"/><circle cx="${cx+br*.55}" cy="${cy-br*.5}" r="${br*.08}" fill="${ac}" opacity=".4"/><circle cx="${cx}" cy="${cy-br*1.1}" r="${br*.12}" fill="${ac}" opacity=".35"/>`,
    stormkin:`<path d="M${cx-br*.1},${cy-br*1.3} L${cx-br*.35},${cy-br*.7} L${cx},${cy-br*.7} L${cx-br*.25},${cy-br*.1}" fill="none" stroke="${ac}" stroke-width="${br*.1}" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`,
  };
  const extras=extrasMap[G.speciesId]||'';
  const zzz=eye==='sleep'?`<text x="${cx+br*.62}" y="${cy-br*.52}" font-size="${br*.3}" fill="${ac}" opacity=".5" font-family="serif">z</text>`:'';
  return `<svg width="${size}" height="${Math.round(size*1.18)}" viewBox="0 0 ${size} ${Math.round(size*1.18)}">
<defs><radialGradient id="bG" cx="38%" cy="32%"><stop offset="0%" stop-color="${ac}" stop-opacity=".22"/><stop offset="100%" stop-color="${bc}"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter></defs>
${extras}<ellipse cx="${cx}" cy="${cy}" rx="${br}" ry="${br*.88}" fill="url(#bG)" stroke="${sc}" stroke-width="1.4" filter="url(#glow)" opacity=".95"/>
<ellipse cx="${cx-br*.18}" cy="${cy-br*.3}" rx="${br*.2}" ry="${br*.13}" fill="rgba(255,255,255,.07)" transform="rotate(-20,${cx-br*.18},${cy-br*.3})"/>
${eyeMap[eye]||eyeMap.normal}${zzz}</svg>`;
}

// ── STATES ───────────────────────────────────────
function renderStates(){
  const states=[
    {icon:'🍖',val:G.hunger,bad:G.hunger<25,invert:true},
    {icon:'💧',val:G.thirst,bad:G.thirst<25,invert:true},
    {icon:'⚡',val:G.energy,bad:G.energy<20,invert:true},
    {icon:'🎮',val:100-G.boredom,bad:G.boredom>70,invert:false},
    {icon:'❤',val:G.hp,bad:G.hp<30,invert:true},
  ];
  const col=document.getElementById('states-col');
  col.innerHTML=states.map(s=>{
    const pct=Math.max(0,Math.min(100,s.val));
    const color=s.bad?'#e05a6a':pct>60?'#00e5c8':'#c9a84c';
    return `<div class="state-item${s.bad?' state-bad':''}"><span class="state-icon" style="color:${color}">${s.icon}</span><div class="state-bar-wrap"><div class="state-bar-fill" style="width:${pct}%;background:${color}"></div></div></div>`;
  }).join('');
}

// ── ACTIVITY TEXT ─────────────────────────────────
function renderActivity(){
  const el=document.getElementById('activity-text');if(!el)return;
  const sp=getSp();
  if(G.isSleeping){el.textContent=`${G.name} sta dormendo...`;return;}
  if(isAbsent()){el.textContent=`${G.name} ${G.absence.desc}`;return;}
  if(G.hunger<25){el.textContent=`${G.name} cerca cibo con insistenza.`;return;}
  if(G.thirst<25){el.textContent=`${G.name} è assetato.`;return;}
  if(G.energy<20){el.textContent=`${G.name} si sta addormentando in piedi.`;return;}
  if(G.boredom>70){el.textContent=`${G.name} fissa il vuoto, annoiato.`;return;}
  const idle={lazy:[`${G.name} sonnecchia al sole.`,`${G.name} osserva curioso.`,`${G.name} si stira pigro.`],aggressive:[`${G.name} graffia le pareti.`,`${G.name} ruggisce piano.`,`${G.name} si esercita.`],fearful:[`${G.name} è nascosto nell'angolo.`,`${G.name} osserva tremante.`,`${G.name} sussurra a sé stesso.`],calm:[`${G.name} medita in silenzio.`,`${G.name} respira lentamente.`,`${G.name} contempla l'infinito.`],majestic:[`${G.name} si muove con grazia.`,`${G.name} osserva dall'alto.`,`${G.name} emana luce.`],playful:[`${G.name} rimbalza ovunque.`,`${G.name} insegue la propria ombra.`,`${G.name} fa capriole.`],mysterious:[`${G.name} emette strane spore.`,`${G.name} sussurra formule.`,`${G.name} scompare un momento.`]}[sp.attitude]||[`${G.name} è tranquillo.`];
  el.textContent=idle[Math.floor(Date.now()/60000)%idle.length];
}

// ── COIN TIMER ───────────────────────────────────
function updateCoinTimer(){
  document.getElementById('coin-val').textContent=Math.floor(G.coins);
  const el=document.getElementById('coin-timer');if(!el)return;
  const rem=Math.max(0,G.nextCoinMs-Date.now());
  const m=Math.ceil(rem/60000);
  el.textContent=rem===0?'+◈ presto':m<60?`+◈ in ${m}m`:`+◈ in ${Math.ceil(m/60)}h`;
}

// ── ACTIONS ──────────────────────────────────────
function cdRem(id){const c=G.cooldowns[id];return c?Math.max(0,c-Date.now()):0;}
function isCdActive(id){return cdRem(id)>0;}
function setCd(id,hours){G.cooldowns[id]=Date.now()+hours*3600000;}
function isAbsent(){return G.absence&&Date.now()<G.absence.endsMs;}
function fmtMs(ms){const h=Math.floor(ms/3600000),m=Math.ceil((ms%3600000)/60000);return h>0?`${h}h${m>0?` ${m}m`:''}`:m>0?`${m}m`:'<1m';}

function renderActions(){
  const col=document.getElementById('actions-col');col.innerHTML='';
  const absent=isAbsent()||G.isSleeping;
  const all=[...BASE_ACTIONS,...getUnlockedActions()];
  all.forEach(act=>{
    const cd=cdRem(act.id),locked=absent,disabled=cd>0||locked;
    const div=document.createElement('div');
    div.className='abtn'+(cd>0?' cd':'')+(locked?' absent-lock':'')+(disabled?'':' rdy');
    if(act.cost>0)div.dataset.cost=`◈${act.cost}`;
    div.innerHTML=`<span class="aicon">${act.icon}</span><span class="alabel">${act.label}</span><span class="acd">${cd>0?fmtMs(cd):locked?'…':''}</span>`;
    if(!disabled)div.addEventListener('click',()=>doAction(act));
    col.appendChild(div);
  });
  // sleep/wake
  const sd=document.createElement('div');
  if(G.isSleeping){
    sd.className='abtn rdy';sd.innerHTML=`<span class="aicon">☀</span><span class="alabel">Sveglia</span><span class="acd"></span>`;
    sd.addEventListener('click',wakeUp);
  }else{
    const cd=cdRem('sleep');const abLock=isAbsent();const dis=cd>0||abLock;
    sd.className='abtn'+(cd>0?' cd':'')+(abLock?' absent-lock':'')+(dis?'':' rdy');
    sd.innerHTML=`<span class="aicon">☽</span><span class="alabel">Dormi</span><span class="acd">${cd>0?fmtMs(cd):abLock?'…':''}</span>`;
    if(!dis)sd.addEventListener('click',putToSleep);
  }
  col.appendChild(sd);
}

function doAction(act){
  if(isCdActive(act.id)||(isAbsent()&&act.id!=='wake')||G.isSleeping)return;
  const cost=act.cost||0;
  if(cost>0&&G.coins<cost){setNotif(`Ti servono ◈${cost}.`);return;}
  if(cost>0)G.coins=Math.max(0,G.coins-cost);
  const sp=getSp();let msg='';
  switch(act.id){
    case 'feed':G.hunger=Math.min(100,G.hunger+38);G.hp=Math.min(100,G.hp+5);msg=`${G.name} ha mangiato.`;spawnPt(cXY().x,cXY().y,'#cc8844',7);break;
    case 'water':G.thirst=Math.min(100,G.thirst+44);G.hp=Math.min(100,G.hp+3);msg=`${G.name} si è dissetato.`;spawnPt(cXY().x,cXY().y,'#4499cc',7);break;
    case 'play':if(G.energy<15){setNotif('Troppo stanco per giocare.');return;}G.energy=Math.max(0,G.energy-18);G.hunger=Math.max(0,G.hunger-8);G.boredom=Math.max(0,G.boredom-35);G.hp=Math.min(100,G.hp+5);G.coins+=3;G.counts.play=(G.counts.play||0)+1;msg=`${G.name} ha giocato. +◈3`;spawnPt(cXY().x,cXY().y,sp.accentC,10);tryUnlock('play');checkEvolution();break;
    case 'train':if(G.energy<20){setNotif('Troppo stanco.');return;}G.energy=Math.max(0,G.energy-25);G.hunger=Math.max(0,G.hunger-12);G.boredom=Math.max(0,G.boredom-15);G.coins+=5;G.counts.train=(G.counts.train||0)+1;msg=`${G.name} si è allenato. +◈5`;tryUnlock('train');checkEvolution();break;
    case 'cure':G.hp=Math.min(100,G.hp+45);msg=`${G.name} curato. HP +45`;spawnPt(cXY().x,cXY().y,'#00e5c8',9);break;
    case 'hunt':{if(G.energy<28){setNotif('Energia insufficiente.');return;}const t=ALL_TRAITS.find(t=>t.id==='caccia');const a=t.action;const hrs=a.absence.minH+Math.random()*(a.absence.maxH-a.absence.minH);G.absence={traitId:'caccia',actionId:'hunt',endsMs:Date.now()+hrs*3600000,label:a.absence.label,desc:a.absence.desc};G.energy=Math.max(0,G.energy-a.enCost);G.counts.hunt=(G.counts.hunt||0)+1;msg=`${G.name} è partito a cacciare. ~${Math.round(hrs)}h.`;tryUnlock('hunt');checkEvolution();break;}
    case 'meditate':{const t=ALL_TRAITS.find(t=>t.id==='meditazione');const a=t.action;const hrs=a.absence.minH+Math.random()*(a.absence.maxH-a.absence.minH);G.absence={traitId:'meditazione',actionId:'meditate',endsMs:Date.now()+hrs*3600000,label:a.absence.label,desc:a.absence.desc};G.counts.meditate=(G.counts.meditate||0)+1;msg=`${G.name} medita. ~${Math.round(hrs)}h.`;checkEvolution();break;}
    case 'explore':{if(G.energy<22){setNotif('Energia insufficiente.');return;}const t=ALL_TRAITS.find(t=>t.id==='esplorazione');const a=t.action;const hrs=a.absence.minH+Math.random()*(a.absence.maxH-a.absence.minH);G.absence={traitId:'esplorazione',actionId:'explore',endsMs:Date.now()+hrs*3600000,label:a.absence.label,desc:a.absence.desc};G.energy=Math.max(0,G.energy-a.enCost);G.counts.explore=(G.counts.explore||0)+1;msg=`${G.name} parte ad esplorare. ~${Math.round(hrs)}h.`;tryUnlock('explore');break;}
  }
  setCd(act.id,act.cooldownH||6);saveG();if(msg)setNotif(msg);renderAll();
}

function putToSleep(){
  if(G.isSleeping||isAbsent())return;
  const sp=getSp();
  // sleep duration based on how tired the creature is
  const missingEnergy=100-G.energy;
  const baseHrs=sp.energyRate>2.2?6:sp.energyRate>1.8?7:8;
  const hrs=Math.max(4,Math.min(10, baseHrs*(missingEnergy/100)*1.5+4));
  G.isSleeping=true;
  G.sleepStart=Date.now();
  G.sleepDuration=hrs*3600000;
  G.counts.sleep=(G.counts.sleep||0)+1;
  // cooldown prevents putting to sleep again immediately after waking
  setCd('sleep', Math.ceil(hrs)+4);
  saveG();
  setNotif(`${G.name} si è addormentato. Si sveglierà tra ~${Math.round(hrs)}h.`);
  tryUnlock('sleep');checkEvolution();renderAll();
}
function wakeUp(){
  if(!G.isSleeping)return;
  G.isSleeping=false;G.sleepStart=null;G.sleepDuration=null;
  saveG();setNotif(`${G.name} si è svegliato.`);renderAll();
}

// ── ABSENCE RETURN ───────────────────────────────
function checkAbsenceReturn(){
  if(G.isSleeping&&G.sleepStart&&G.sleepDuration&&Date.now()>=G.sleepStart+G.sleepDuration){G.isSleeping=false;G.sleepStart=null;G.sleepDuration=null;setNotif(`${G.name} si è svegliato riposato.`);}
  if(!G.absence||Date.now()<G.absence.endsMs)return;
  const ab=G.absence;G.absence=null;
  const trait=ALL_TRAITS.find(t=>t.id===ab.traitId);if(!trait||!trait.action){saveG();return;}
  const r=trait.action.reward||{},mal=trait.action.malus||{},parts=[];
  if(r.coins){const v=r.coins.min+Math.floor(Math.random()*(r.coins.max-r.coins.min+1));G.coins+=v;parts.push(`+◈${v}`);}
  if(r.energy){G.energy=Math.min(100,G.energy+r.energy);parts.push(`Energia +${r.energy}`);}
  if(mal.hp){let v=mal.hp.min+Math.floor(Math.random()*(mal.hp.max-mal.hp.min+1));if(hasTrait('res_fuoco')&&ab.actionId==='hunt')v=Math.max(0,v-5);G.hp=Math.max(0,G.hp-v);if(v>0)parts.push(`HP −${v}`);}
  tryUnlock(ab.actionId||'random');checkEvolution();
  saveG();setNotif(`${G.name} è tornato! ${parts.join(' · ')}`);spawnPt(cXY().x,cXY().y,'#c9a84c',12);renderAll();
}

// ── EVOLUTION ────────────────────────────────────
function checkEvolution(){
  const ageH=G.birthMs?(Date.now()-G.birthMs)/3600000:0;
  // Evolution timing: 30d→Giovane, 90d→Adulto, 365d→Antico
  const newStage=ageH<720?'hatchling':ageH<2160?'juvenile':ageH<8760?'adult':'elder';
  if(newStage!==G.stage){
    const old=G.stage;G.stage=newStage;
    if(newStage!=='hatchling'){tryEvolve(newStage);}
    else if(newStage==='elder')setNotif(`${G.name} è diventato Antico.`);
    saveG();renderHeader();
  }
  if(G.stage!=='hatchling'&&!G.currentForm)tryEvolve(G.stage);
}
function tryEvolve(stage){
  const sp=getSp(),paths=sp.evoPaths?.[stage];if(!paths)return;
  const eligible=paths.filter(p=>{if(!p.condition)return true;const[k,v]=p.condition.split('>=');return(G.counts[k]||0)>=parseInt(v);});
  const pool=eligible.length?eligible:paths;
  let best=pool[0],bestScore=0;
  pool.forEach(p=>{const[k]=p.condition.split('>=');const s=G.counts[k]||0;if(s>bestScore){bestScore=s;best=p;}});
  const chosen=Math.random()<.70?best:pool[Math.floor(Math.random()*pool.length)];
  applyEvolution(chosen,stage);
}
function applyEvolution(path,stage){
  G.currentForm=path.id;G.evoLog.push({stage,form:path.id,name:path.name,ts:Date.now()});saveG();
  const sl={juvenile:'Giovane',adult:'Adulto',elder:'Antico'}[stage]||stage;
  showToast({icon:'✦',name:path.name,desc:path.desc,color:getSp().accentC,bg:'rgba(0,200,180,.08)',badge:`◈ evoluzione — ${sl}`});
  spawnPt(cXY().x,cXY().y,getSp().accentC,16);
}

// ── UNLOCK ───────────────────────────────────────
function tryUnlock(trigger){
  if(!G.speciesId)return;
  // Build candidate pool: universal + race-specific + stage-specific
  const universal = [...(TRAIT_MAP[trigger]||[]), ...(trigger!=='random'?(TRAIT_MAP['random']||[]):[])];
  const raceTr    = (RACE_TRAITS[G.speciesId]||[]).filter(t=>t.unlock.trigger===trigger||(t.unlock.trigger==='random'&&trigger==='random'));
  const stageTr   = (STAGE_TRAITS[G.stage]||[]).filter(t=>t.unlock.trigger===trigger||(t.unlock.trigger==='random'&&trigger==='random'));
  // also include random-trigger race/stage traits on any action (small chance)
  const raceRand  = trigger!=='random'?(RACE_TRAITS[G.speciesId]||[]).filter(t=>t.unlock.trigger==='random'):[];
  const stageRand = trigger!=='random'?(STAGE_TRAITS[G.stage]||[]).filter(t=>t.unlock.trigger==='random'):[];
  const candidates = [...universal, ...raceTr, ...stageTr, ...raceRand, ...stageRand];
  // Shuffle to avoid always unlocking in same order
  candidates.sort(()=>Math.random()-.5);
  for(const trait of candidates){
    if(G.unlockedTraitIds.includes(trait.id))continue;
    const u=trait.unlock;
    const triggerKey=u.trigger==='random'?'random':u.trigger;
    if(u.minCount&&(G.counts[triggerKey]||0)<u.minCount)continue;
    if(u.trigger!=='random'&&u.trigger!==trigger)continue;
    // random trigger: reduce prob per check (fires on every action)
    const prob = u.trigger==='random' ? u.prob*0.3 : u.prob;
    if(Math.random()<prob){
      G.unlockedTraitIds.push(trait.id);
      saveG();renderActions();
      const catLabel={abilita:'✦ abilità',resistenza:'◆ resistenza',fobia:'☽ fobia',vulnerabilita:'◐ vulnerabilità'}[trait.cat]||'';
      showToast({icon:trait.icon,name:trait.name,desc:trait.desc,color:trait.color,bg:trait.bg,badge:catLabel});
      return; // one at a time
    }
  }
}
function showToast(t){
  document.getElementById('toast-badge').textContent=t.badge||'';document.getElementById('toast-badge').style.cssText=`background:${t.bg};color:${t.color};border:1px solid ${t.color}44;border-radius:4px;padding:2px 9px;font-size:8px;letter-spacing:2px;display:inline-block;margin-bottom:8px`;
  document.getElementById('toast-name').textContent=`${t.icon} ${t.name}`;document.getElementById('toast-name').style.color=t.color;document.getElementById('toast-desc').textContent=t.desc;
  const el=document.getElementById('toast');el.style.borderColor=t.color;el.style.display='block';clearTimeout(el._tm);el._tm=setTimeout(()=>el.style.display='none',5500);
}

// ── GAME TICK ─────────────────────────────────────
function gameTick(){
  if(G.phase!=='alive')return;
  const now=Date.now(),dtH=Math.min((now-G.lastTickMs)/3600000,8);G.lastTickMs=now;
  const sp=getSp(),absent=isAbsent();
  if(G.isSleeping){
    const sp2=getSp();
    // energy regens based on species (lazy creatures rest better)
    const enRegen = sp2.energyRate<1.5 ? 12 : sp2.energyRate<2.0 ? 10 : 8;
    G.energy=Math.min(100,G.energy+enRegen*dtH);
    G.hunger=Math.max(0,G.hunger-0.4*dtH);
    G.thirst=Math.max(0,G.thirst-0.3*dtH);
    G.boredom=Math.max(0,G.boredom-3*dtH);
    G.hp=Math.min(100,G.hp+1*dtH); // slow heal while sleeping
    // auto-wake when sleep duration has elapsed
    const sleepElapsed = G.sleepStart ? Date.now()-G.sleepStart : 0;
    const sleepDone = G.sleepDuration && sleepElapsed>=G.sleepDuration;
    if(sleepDone || G.energy>=100){
      G.isSleeping=false;G.sleepStart=null;G.sleepDuration=null;
      setNotif(`${G.name} si è svegliato riposato.`);
    }
  }else if(!absent){
    // Base drain: 4.2/h × species multiplier → empties in ~24h at 1.0x
    const BASE_DRAIN = 4.2;
    const hungerMult = hasTrait('vuln_fame') ? 1.6 : 1.0;
    const thirstMult = hasTrait('vuln_sete') ? 1.6 : 1.0;
    G.hunger = Math.max(0, G.hunger - BASE_DRAIN * sp.hungerRate * hungerMult * dtH);
    G.thirst = Math.max(0, G.thirst - BASE_DRAIN * sp.thirstRate * thirstMult * dtH);
    G.energy = Math.max(0, G.energy - sp.energyRate * dtH);
    G.boredom = Math.min(100, G.boredom + sp.boredRate * dtH);
    if(G.hunger<15||G.thirst<15)G.hp=Math.max(1,G.hp-2*dtH);
    if(hasTrait('cura_nat'))G.hp=Math.min(100,G.hp+1*dtH);
    if(G.energy<=0&&!G.isSleeping){putToSleep();setNotif(`${G.name} è crollato per la stanchezza.`);}
  }
  if(now>=G.nextCoinMs){G.coins+=1;G.nextCoinMs=now+3600000;}
  G.hp=Math.max(0,Math.min(100,G.hp));
  checkAbsenceReturn();if(Math.random()<.01)tryUnlock('random');checkEvolution();
  if(!G.isSleeping&&!absent){
    if(G.hunger<20)setNotif(`${G.name} ha fame!`);
    else if(G.thirst<20)setNotif(`${G.name} ha sete!`);
    else if(G.energy<15)setNotif(`${G.name} è esausto.`);
    else if(G.boredom>80)setNotif(`${G.name} è annoiato.`);
  }
  saveG();renderAll();
}

// ── SHOP & ABILITIES ─────────────────────────────
function openShop(){
  document.getElementById('shop-balance').textContent=`◈ ${Math.floor(G.coins)}`;
  document.getElementById('shop-items-list').innerHTML=SHOP_ITEMS.map(item=>{const cant=G.coins<item.cost;return`<div class="sitem${cant?' cant-afford':''}" onclick="buyItem('${item.id}')"><div class="sitem-icon">${item.icon}</div><div class="sitem-info"><div class="sitem-name">${item.name}</div><div class="sitem-desc">${item.desc}</div></div><div class="sitem-cost">◈${item.cost}</div></div>`;}).join('');
  document.getElementById('shop-modal').classList.add('on');
}
function closeShop(){document.getElementById('shop-modal').classList.remove('on');}
function buyItem(id){const item=SHOP_ITEMS.find(i=>i.id===id);if(!item||G.coins<item.cost){setNotif(`Aetherin insufficiente.`);closeShop();return;}G.coins-=item.cost;item.fn(G);saveG();setNotif(`${item.name} usato.`);closeShop();spawnPt(window.innerWidth/2,window.innerHeight*.45,getSp().accentC,10);renderAll();}
function openAbilities(){
  // Include race-specific and stage-specific unlocked traits
  const allUnlocked = G.unlockedTraitIds.map(id=>{
    const fromAll   = ALL_TRAITS.find(t=>t.id===id);
    const fromRace  = (RACE_TRAITS[G.speciesId]||[]).find(t=>t.id===id);
    const fromStage = Object.values(STAGE_TRAITS).flat().find(t=>t.id===id);
    return fromAll||fromRace||fromStage;
  }).filter(Boolean);
  const traits=allUnlocked;
  const evoHtml=G.evoLog.length?`<div style="margin-bottom:14px"><div style="font-family:'Cinzel',serif;font-size:11px;color:var(--teal);letter-spacing:2px;margin-bottom:8px">EVOLUZIONI</div>${G.evoLog.map(e=>`<div style="font-size:11px;color:var(--fog2);margin-bottom:4px">◈ ${e.name}</div>`).join('')}</div>`:'';
  document.getElementById('ab-list').innerHTML=evoHtml+(traits.length?traits.map(t=>{const cl={abilita:'abilità',resistenza:'resistenza',fobia:'fobia',vulnerabilita:'vulnerabilità'}[t.cat]||t.cat;return`<div class="ab-card" style="border-left-color:${t.color}"><div class="ab-card-head"><div class="ab-card-icon">${t.icon}</div><div class="ab-card-name" style="color:${t.color}">${t.name}</div><div class="ab-card-cat" style="background:${t.bg};color:${t.color};border:1px solid ${t.color}33">${cl}</div></div><div class="ab-card-desc">${t.desc}</div></div>`;}).join(''):`<div id="ab-empty">Nessun tratto ancora.<br><br>Gioca e interagisci con ${G.name} per scoprirne.</div>`);
  document.getElementById('abilities-modal').classList.add('on');
}
function closeAbilities(){document.getElementById('abilities-modal').classList.remove('on');}

// ── UTILS ─────────────────────────────────────────
function cXY(){const el=document.getElementById('c-sprite');if(!el)return{x:window.innerWidth/2,y:window.innerHeight/2};const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};}
let notifTm;
function setNotif(txt){const el=document.getElementById('notif');if(!el)return;el.textContent=txt;el.style.opacity='1';clearTimeout(notifTm);notifTm=setTimeout(()=>el.style.opacity='0',5500);}
let msgTm;
function showMsg(txt){const el=document.getElementById('c-msg');el.textContent=txt;el.classList.add('on');clearTimeout(msgTm);msgTm=setTimeout(()=>el.classList.remove('on'),2200);}
function spawnPt(x,y,color,n){const c=document.getElementById('particles');for(let i=0;i<n;i++){const el=document.createElement('div');el.className='pt';const sz=3+Math.random()*5,tx=(Math.random()-.5)*90,ty=-(22+Math.random()*65);el.style.cssText=`width:${sz}px;height:${sz}px;background:${color};left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px;animation-delay:${Math.random()*.14}s`;c.appendChild(el);setTimeout(()=>el.remove(),1000);}}
function tapCreature(){if(G.phase!=='alive'||isAbsent()||G.isSleeping)return;const sp=getSp();const p={lazy:['...','~','zzz'],aggressive:['GRR!','⚔','!'],fearful:['!?','...','◌'],calm:['◈','~','...'],majestic:['...','◈'],playful:['!','♪','~!'],mysterious:['...','??','◉']}[sp.attitude]||['~'];showMsg(p[Math.floor(Math.random()*p.length)]);spawnPt(cXY().x,cXY().y,sp.accentC,4);}

// ── PWA INSTALL ───────────────────────────────────
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if(!localStorage.getItem('install_dismissed'))document.getElementById('install-banner').classList.add('on');});
function doInstall(){if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt.userChoice.then(()=>{deferredPrompt=null;document.getElementById('install-banner').classList.remove('on');});}
function dismissInstall(){localStorage.setItem('install_dismissed','1');document.getElementById('install-banner').classList.remove('on');}
function checkInstallPrompt(){const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent),isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone;if(isIOS&&!isStandalone&&!localStorage.getItem('install_dismissed')){document.getElementById('install-text').textContent='Su iPhone: tocca Condividi ↑ poi "Aggiungi a schermata Home".';document.getElementById('install-btn').style.display='none';setTimeout(()=>document.getElementById('install-banner').classList.add('on'),2000);}}
window.addEventListener('appinstalled',()=>document.getElementById('install-banner').classList.remove('on'));

// ── MAIN LOOP ─────────────────────────────────────
setInterval(gameTick,60000);
setInterval(()=>{if(G.phase==='alive'){checkAbsenceReturn();renderActions();renderCreature();renderActivity();updateCoinTimer();}},15000);
setInterval(()=>{if(G.phase==='alive')updateCoinTimer();},30000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&G.phase==='alive')gameTick();});


// ── FIREBASE BRIDGE ──────────────────────────────
// Called by index.html AFTER Firebase loads the cloud save into window.G
window.startGame = function(uid) {
  function dbg(m){console.log('[startGame]',m);const el=document.getElementById('debug');if(el)el.innerHTML+='[game] '+m+'<br>';}
  dbg('called. uid='+uid+' window.G='+(window.G?window.G.phase:'null'));
  try {
    G = migrateG(window.G) || newGame();
    window.G = G;
    if (uid && G.uid && G.uid !== uid) {
      dbg('UID mismatch! Resetting. G.uid='+G.uid+' uid='+uid);
      G = newGame();
      window.G = G;
    }
    if (uid) G.uid = uid;
    dbg('G.phase='+G.phase+' calling boot()');
    boot();
    dbg('boot() returned OK');
  } catch(e) {
    dbg('ERROR: '+e.message+' '+e.stack);
  }
};

// Expose helpers for profile modal
window.getSp = getSp;
window.getCurrentForm = getCurrentForm;
// ── EXPANDED TRAIT LIBRARY ───────────────────────────────────────
// Race-specific traits: only unlock for matching speciesId
// Stage-specific traits: only unlock after reaching certain stage
// These are checked in tryUnlock() via speciesId and stage filters

const RACE_TRAITS = {
  // LUMINFANG exclusive
  luminfang: [
    {id:'lumi_glow',       name:'Bioluminescenza',     icon:'✨', cat:'abilita',   color:'#88ff99', bg:'rgba(136,255,153,.1)', desc:'Emette luce propria. Riduce la paura del buio.', unlock:{trigger:'sleep', minCount:10, prob:.07}},
    {id:'lumi_purr',       name:'Falsa Morte',         icon:'💤', cat:'abilita',   color:'#aaffcc', bg:'rgba(170,255,204,.1)', desc:'Può fingersi morto per confondere i predatori.', unlock:{trigger:'sleep', minCount:25, prob:.05}},
    {id:'lumi_night',      name:'Vista Crepuscolare',  icon:'🌙', cat:'resistenza', color:'#77bbaa', bg:'rgba(119,187,170,.1)', desc:'Vede perfettamente al buio. Bonus in esplorazione notturna.', unlock:{trigger:'explore', minCount:8, prob:.09}},
    {id:'lumi_lazy_heal',  name:'Pigrizia Terapeutica',icon:'😴', cat:'abilita',   color:'#99ddaa', bg:'rgba(153,221,170,.1)', desc:'Riposa così profondamente da rigenerare HP doppi nel sonno.', unlock:{trigger:'sleep', minCount:30, prob:.04}},
    {id:'lumi_stealth',    name:'Passo Silenzioso',    icon:'👣', cat:'abilita',   color:'#55cc77', bg:'rgba(85,204,119,.1)',  desc:'Si muove senza fare rumore. Bonus in caccia.', unlock:{trigger:'hunt', minCount:5, prob:.10}},
  ],
  // VOLCANOX exclusive
  volcanox: [
    {id:'vol_rage',        name:'Frenesia Vulcanica',  icon:'💢', cat:'abilita',   color:'#ff6633', bg:'rgba(255,102,51,.1)',  desc:'Quando HP scende sotto 30%, la forza raddoppia temporaneamente.', unlock:{trigger:'hunt', minCount:10, prob:.08}},
    {id:'vol_fireblood',   name:'Sangue di Fuoco',     icon:'🔴', cat:'resistenza', color:'#ff4422', bg:'rgba(255,68,34,.1)',   desc:'Il danno da fuoco lo guarisce invece di ferirlo.', unlock:{trigger:'hunt', minCount:20, prob:.05}},
    {id:'vol_ash',         name:'Pelle di Cenere',     icon:'⬛', cat:'resistenza', color:'#aa8866', bg:'rgba(170,136,102,.1)', desc:'Assorbe il 20% dei danni fisici.', unlock:{trigger:'train', minCount:15, prob:.07}},
    {id:'vol_intimidate',  name:'Ruggito Primordiale', icon:'😤', cat:'abilita',   color:'#ff5500', bg:'rgba(255,85,0,.1)',    desc:'Intimorisce le prede. Bonus in caccia, malus in esplorazione.', unlock:{trigger:'play', minCount:20, prob:.06}},
    {id:'vol_temper',      name:'Temperamento Caotico',icon:'⚡', cat:'fobia',     color:'#ff8833', bg:'rgba(255,136,51,.1)',  desc:'Ha scatti d'ira casuali. Ogni tanto rifiuta i comandi.', unlock:{trigger:'random', prob:.04}},
  ],
  // UMBRASEL exclusive
  umbrasel: [
    {id:'umb_precog',      name:'Preveggenza',         icon:'🔮', cat:'abilita',   color:'#bb99ff', bg:'rgba(187,153,255,.1)', desc:'Anticipa eventi casuali. Riduce i malus da caccia ed esplorazione.', unlock:{trigger:'meditate', minCount:8, prob:.09}},
    {id:'umb_phobia_all',  name:'Paranoia',            icon:'👁', cat:'fobia',     color:'#9944aa', bg:'rgba(153,68,170,.1)',  desc:'Ha paura di tutto. Ogni azione ha 10% di causare stress.', unlock:{trigger:'random', prob:.03}},
    {id:'umb_shadow',      name:'Corpo d'Ombra',      icon:'🌑', cat:'abilita',   color:'#8855cc', bg:'rgba(136,85,204,.1)',  desc:'Può attraversare oggetti solidi. Bonus in esplorazione.', unlock:{trigger:'explore', minCount:10, prob:.07}},
    {id:'umb_telepathy',   name:'Telepatia',           icon:'📡', cat:'abilita',   color:'#aa77ee', bg:'rgba(170,119,238,.1)', desc:'Percepisce i pensieri altrui. Intelligenza cresce più velocemente.', unlock:{trigger:'meditate', minCount:20, prob:.05}},
    {id:'umb_invisible',   name:'Invisibilità Parziale',icon:'👻',cat:'abilita',   color:'#ccaaff', bg:'rgba(204,170,255,.1)', desc:'Diventa semi-trasparente sotto stress. Bonus in fuga.', unlock:{trigger:'sleep', minCount:15, prob:.06}},
  ],
  // CRYSTALIS exclusive
  crystalis: [
    {id:'cry_refract',     name:'Rifrazione Solare',   icon:'🌈', cat:'abilita',   color:'#00eeff', bg:'rgba(0,238,255,.1)',   desc:'Converte la luce in energia. Di giorno si rigenera automaticamente.', unlock:{trigger:'play', minCount:12, prob:.08}},
    {id:'cry_shatter',     name:'Scudo Cristallino',   icon:'💠', cat:'resistenza', color:'#33ccdd', bg:'rgba(51,204,221,.1)',  desc:'Un cristallo di difesa assorbe il primo attacco critico ogni giorno.', unlock:{trigger:'train', minCount:18, prob:.06}},
    {id:'cry_resonance',   name:'Risonanza Cosmica',   icon:'🔔', cat:'abilita',   color:'#00ddee', bg:'rgba(0,221,238,.1)',   desc:'Amplifica le abilità delle creature vicine. Sinergia di gruppo.', unlock:{trigger:'meditate', minCount:12, prob:.07}},
    {id:'cry_brittle',     name:'Fragilità Cristallina',icon:'💔',cat:'vulnerabilita',color:'#88ccdd',bg:'rgba(136,204,221,.1)',desc:'Prende il 20% di danni extra dai colpi fisici.', unlock:{trigger:'random', prob:.035}},
    {id:'cry_cold',        name:'Aura Glaciale',       icon:'❄', cat:'resistenza', color:'#aaddee', bg:'rgba(170,221,238,.1)', desc:'Rallenta chi si avvicina. Bonus in difesa.', unlock:{trigger:'sleep', minCount:20, prob:.06}},
  ],
  // AETHERWYRM exclusive
  aetherwyrm: [
    {id:'aew_cosmic',      name:'Coscienza Cosmica',   icon:'🌌', cat:'abilita',   color:'#ffdd88', bg:'rgba(255,221,136,.1)', desc:'Accede alla memoria universale. Tratti si sbloccano più velocemente.', unlock:{trigger:'meditate', minCount:10, prob:.08}},
    {id:'aew_ageless',     name:'Atemporalità',        icon:'⏳', cat:'abilita',   color:'#ddbb44', bg:'rgba(221,187,68,.1)',  desc:'Non invecchia normalmente. Le transizioni di stadio sono più lente.', unlock:{trigger:'sleep', minCount:30, prob:.04}},
    {id:'aew_gravity',     name:'Manipolazione Gravitazionale',icon:'🌀',cat:'abilita',color:'#ccaa33',bg:'rgba(204,170,51,.1)',desc:'Può alterare il peso delle cose. Bonus in esplorazione.', unlock:{trigger:'explore', minCount:15, prob:.06}},
    {id:'aew_astral',      name:'Proiezione Astrale',  icon:'✨', cat:'abilita',   color:'#eedd77', bg:'rgba(238,221,119,.1)', desc:'Può inviare la sua coscienza a esplorare senza muovere il corpo.', unlock:{trigger:'meditate', minCount:25, prob:.04}},
    {id:'aew_ethereal',    name:'Corpo Etereo',        icon:'🌟', cat:'resistenza', color:'#ffee99', bg:'rgba(255,238,153,.1)', desc:'I danni fisici hanno 30% di chance di non averla effetto.', unlock:{trigger:'sleep', minCount:40, prob:.03}},
  ],
  // THALASYN exclusive
  thalasyn: [
    {id:'tha_echoloc',     name:'Ecolocalizzazione',   icon:'🔊', cat:'abilita',   color:'#55aaff', bg:'rgba(85,170,255,.1)',  desc:'Percepisce ogni movimento. Impossibile sorprenderla.', unlock:{trigger:'explore', minCount:8, prob:.09}},
    {id:'tha_toxin',       name:'Veleno Abissale',     icon:'☠', cat:'abilita',   color:'#2299ff', bg:'rgba(34,153,255,.1)',   desc:'Il morso avvelena. Bonus in caccia marina.', unlock:{trigger:'hunt', minCount:10, prob:.08}},
    {id:'tha_drought',     name:'Vulnerabilità Siccità',icon:'🏜',cat:'vulnerabilita',color:'#8899cc',bg:'rgba(136,153,204,.1)',desc:'Senza acqua perde HP più velocemente degli altri.', unlock:{trigger:'random', prob:.04}},
    {id:'tha_current',     name:'Controllo Correnti',  icon:'🌊', cat:'abilita',   color:'#33bbff', bg:'rgba(51,187,255,.1)',  desc:'Usa le correnti marine per spostarsi. Esplorazione riduce meno energia.', unlock:{trigger:'explore', minCount:15, prob:.06}},
    {id:'tha_pressure',    name:'Adattamento Abissale',icon:'💙', cat:'resistenza', color:'#1188dd', bg:'rgba(17,136,221,.1)',  desc:'Sopravvive a pressioni estreme. Caccia marina non causa danni.', unlock:{trigger:'hunt', minCount:20, prob:.05}},
  ],
  // GEOLEM exclusive
  geolem: [
    {id:'geo_regen',       name:'Rigenerazione Litica', icon:'🪨', cat:'abilita',   color:'#ccaa77', bg:'rgba(204,170,119,.1)', desc:'Le crepe nella pietra si chiudono lentamente. HP si rigenera molto lento ma costante.', unlock:{trigger:'sleep', minCount:12, prob:.08}},
    {id:'geo_tremor',      name:'Passo Sismico',        icon:'💥', cat:'abilita',   color:'#aa8855', bg:'rgba(170,136,85,.1)',  desc:'I passi causano piccole scosse. Bonus in combattimento.', unlock:{trigger:'train', minCount:15, prob:.07}},
    {id:'geo_magnetism',   name:'Magnetismo Naturale',  icon:'🧲', cat:'abilita',   color:'#bb9966', bg:'rgba(187,153,102,.1)', desc:'Attrae risorse metalliche durante l'esplorazione.', unlock:{trigger:'explore', minCount:10, prob:.08}},
    {id:'geo_slow',        name:'Inerzia Colossale',    icon:'🐌', cat:'vulnerabilita',color:'#998866',bg:'rgba(153,136,102,.1)',desc:'Si muove lentamente. Alcune azioni richiedono più energia.', unlock:{trigger:'random', prob:.04}},
    {id:'geo_crystal_core',name:'Nucleo Cristallino',   icon:'💎', cat:'resistenza', color:'#ddcc88', bg:'rgba(221,204,136,.1)', desc:'Un nucleo di cristallo lo protegge. Riduce i danni subiti del 25%.', unlock:{trigger:'sleep', minCount:35, prob:.03}},
  ],
  // ZEPHYRIX exclusive
  zephyrix: [
    {id:'zep_speed',       name:'Velocità Supersonale', icon:'💨', cat:'abilita',   color:'#bbddff', bg:'rgba(187,221,255,.1)', desc:'Si sposta alla velocità del suono. Esplorazione dura meno.', unlock:{trigger:'play', minCount:15, prob:.08}},
    {id:'zep_adhd',        name:'Iperattività',         icon:'🌀', cat:'fobia',     color:'#99bbee', bg:'rgba(153,187,238,.1)', desc:'Non riesce a stare fermo. La noia cresce il triplo del normale.', unlock:{trigger:'random', prob:.045}},
    {id:'zep_lightning',   name:'Conduzione Elettrica', icon:'⚡', cat:'abilita',   color:'#aaccff', bg:'rgba(170,204,255,.1)', desc:'Accumula elettricità statica. Bonus contro nemici metallici.', unlock:{trigger:'train', minCount:12, prob:.07}},
    {id:'zep_weather',     name:'Meteoropatia',         icon:'🌪', cat:'abilita',   color:'#88aadd', bg:'rgba(136,170,221,.1)', desc:'Sente i cambiamenti atmosferici. Previsione eventi casuali.', unlock:{trigger:'sleep', minCount:10, prob:.08}},
    {id:'zep_fragile',     name:'Costituzione Aerea',   icon:'🍃', cat:'vulnerabilita',color:'#aabbcc',bg:'rgba(170,187,204,.1)',desc:'Leggero come l'aria. Subisce più danni fisici.', unlock:{trigger:'random', prob:.035}},
  ],
  // MYCELITH exclusive
  mycelith: [
    {id:'myc_spore_heal',  name:'Spore Curative',      icon:'🟣', cat:'abilita',   color:'#dd99ff', bg:'rgba(221,153,255,.1)', desc:'Rilascia spore che guariscono lentamente nel tempo.', unlock:{trigger:'sleep', minCount:10, prob:.09}},
    {id:'myc_network',     name:'Rete Miceliare',      icon:'🕸', cat:'abilita',   color:'#cc88ff', bg:'rgba(204,136,255,.1)', desc:'Comunica con altri organismi. Riceve informazioni sull'ambiente.', unlock:{trigger:'explore', minCount:8, prob:.08}},
    {id:'myc_toxic_cloud', name:'Nube Tossica',        icon:'☁', cat:'abilita',   color:'#bb77ee', bg:'rgba(187,119,238,.1)', desc:'Emette una nube di spore velenose quando attaccata.', unlock:{trigger:'hunt', minCount:8, prob:.08}},
    {id:'myc_rot',         name:'Decomposizione',      icon:'💀', cat:'vulnerabilita',color:'#9966bb',bg:'rgba(153,102,187,.1)',desc:'Si decompone lentamente. Perde HP passivamente se non dorme.', unlock:{trigger:'random', prob:.03}},
    {id:'myc_biolum',      name:'Bioluminescenza Fungina',icon:'🌟',cat:'abilita',  color:'#ee88ff', bg:'rgba(238,136,255,.1)', desc:'Brilla al buio. Può spaventare i predatori notturni.', unlock:{trigger:'sleep', minCount:20, prob:.06}},
  ],
  // STORMKIN exclusive
  stormkin: [
    {id:'sto_overcharge',  name:'Sovraccarico',        icon:'⚡', cat:'abilita',   color:'#ffff44', bg:'rgba(255,255,68,.1)',  desc:'Può scaricare tutta l'energia accumulata in un attacco devastante.', unlock:{trigger:'train', minCount:12, prob:.08}},
    {id:'sto_emp',         name:'Impulso Elettromagnetico',icon:'📡',cat:'abilita', color:'#eedd33', bg:'rgba(238,221,51,.1)',  desc:'Disabilita temporaneamente i meccanismi. Bonus in esplorazione urbana.', unlock:{trigger:'explore', minCount:10, prob:.07}},
    {id:'sto_static_fur',  name:'Pelo Statico',        icon:'🦔', cat:'resistenza', color:'#ffee55', bg:'rgba(255,238,85,.1)',  desc:'Il pelo elettrificato respinge gli attacchi fisici leggeri.', unlock:{trigger:'sleep', minCount:15, prob:.07}},
    {id:'sto_storm_fear',  name:'Fulminofobia',        icon:'🌩', cat:'fobia',     color:'#ddcc44', bg:'rgba(221,204,68,.1)',  desc:'Paradossalmente teme i temporali. Sotto la pioggia perde energia.', unlock:{trigger:'random', prob:.04}},
    {id:'sto_capacitor',   name:'Capacità Inesauribile',icon:'🔋',cat:'abilita',   color:'#ffdd22', bg:'rgba(255,221,34,.1)',  desc:'Immagazzina energia elettrica. Non si stanca mai completamente.', unlock:{trigger:'train', minCount:30, prob:.04}},
  ],
};

// Stage-specific traits (unlock only after reaching certain stage)
const STAGE_TRAITS = {
  juvenile: [
    {id:'stg_curious',     name:'Curiosità Adolescenziale',icon:'🔍',cat:'abilita', color:'#88ccaa', bg:'rgba(136,204,170,.1)', desc:'Da giovane esplora con più entusiasmo. Bonus in esplorazione.', unlock:{trigger:'explore', minCount:5, prob:.12}},
    {id:'stg_clumsy',      name:'Goffaggine Giovanile', icon:'🤕', cat:'vulnerabilita',color:'#cc9988',bg:'rgba(204,153,136,.1)',desc:'Ancora inesperto. Le azioni hanno 10% di costare più energia.', unlock:{trigger:'random', prob:.05}},
    {id:'stg_fast_learn',  name:'Apprendimento Rapido', icon:'📚', cat:'abilita',   color:'#77bbcc', bg:'rgba(119,187,204,.1)', desc:'Da giovane impara più in fretta. Tratti si sbloccano 20% più spesso.', unlock:{trigger:'train', minCount:8, prob:.10}},
  ],
  adult: [
    {id:'stg_experience',  name:'Esperienza Veterana',  icon:'⚔', cat:'abilita',   color:'#ddaa55', bg:'rgba(221,170,85,.1)',  desc:'L'esperienza riduce i malus da caccia del 30%.', unlock:{trigger:'hunt', minCount:15, prob:.09}},
    {id:'stg_wisdom',      name:'Saggezza Matura',      icon:'🦉', cat:'abilita',   color:'#bb9944', bg:'rgba(187,153,68,.1)',  desc:'La mente matura. Medita con doppia efficienza.', unlock:{trigger:'meditate', minCount:15, prob:.08}},
    {id:'stg_chronic_pain',name:'Dolori Cronici',       icon:'💢', cat:'vulnerabilita',color:'#cc8877',bg:'rgba(204,136,119,.1)',desc:'Con l'età arrivano i dolori. HP massimo ridotto di 10.', unlock:{trigger:'random', prob:.04}},
    {id:'stg_territorial', name:'Territorialità',       icon:'🏴', cat:'abilita',   color:'#aa8833', bg:'rgba(170,136,51,.1)',  desc:'Difende il suo spazio. Bonus in difesa, malus in esplorazione.', unlock:{trigger:'sleep', minCount:25, prob:.07}},
  ],
  elder: [
    {id:'stg_legend',      name:'Aura Leggendaria',     icon:'👑', cat:'abilita',   color:'#ffcc44', bg:'rgba(255,204,68,.1)',  desc:'La sua sola presenza intimorisce. Tutti i tratti potenziati del 10%.', unlock:{trigger:'random', prob:.08}},
    {id:'stg_ancient_mem', name:'Memoria Ancestrale',   icon:'📜', cat:'abilita',   color:'#ddbb33', bg:'rgba(221,187,51,.1)',  desc:'Ricorda tutto. Non perde mai le abilità apprese.', unlock:{trigger:'sleep', minCount:50, prob:.06}},
    {id:'stg_frail',       name:'Fragilità Senile',     icon:'🦴', cat:'vulnerabilita',color:'#aaaaaa',bg:'rgba(170,170,170,.1)',desc:'L'età pesa. Energia si rigenera più lentamente.', unlock:{trigger:'random', prob:.06}},
  ],
};

// Helper to get all available traits for current creature
function getAvailableTraits() {
  const raceTr = RACE_TRAITS[G.speciesId] || [];
  const stageTr = STAGE_TRAITS[G.stage] || [];
  const locked = [...ALL_TRAITS, ...raceTr, ...stageTr]
    .filter(t => !G.unlockedTraitIds.includes(t.id));
  return locked;
}

