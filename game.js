// ═══════════════════════════════════════════════════
// ÆTHER — game.js v2
// 10 specie, evoluzioni ramificate, stati attivi, sonno automatico
// ═══════════════════════════════════════════════════

const BASE_SPECIES = {
  luminfang:{name:'Luminfang',icon:'🐱',bodyC:'#1e3a28',accentC:'#55bb77',strokeC:'#33994a',auraC:'rgba(70,190,90,.2)',attitude:'lazy',hungerRate:1.8,thirstRate:2.0,boredRate:1.5,energyRate:1.6,
    evoPaths:{juvenile:[{id:'lumi_wild',name:'Luminfang Selvatico',condition:'hunt>=3',desc:'Ha sviluppato istinti predatori.'},{id:'lumi_mystic',name:'Luminfang Mistico',condition:'meditate>=2',desc:'La sua luce si è intensificata.'},{id:'lumi_gentle',name:'Luminfang Gentile',condition:'play>=5',desc:'Docile e affettuoso.'}],
    adult:[{id:'lumi_apex',name:'Luminfang Apex',condition:'hunt>=8',desc:'Predatore perfetto.'},{id:'lumi_sage',name:'Luminfang Saggio',condition:'meditate>=6',desc:'Illuminato dalla luce interiore.'},{id:'lumi_guardian',name:'Luminfang Guardiano',condition:'play>=12',desc:'Protettore leale.'}]}},
  volcanox:{name:'Volcanox',icon:'🔥',bodyC:'#3a0e04',accentC:'#ff5522',strokeC:'#cc3300',auraC:'rgba(210,75,20,.2)',attitude:'aggressive',hungerRate:2.5,thirstRate:3.0,boredRate:2.2,energyRate:2.2,
    evoPaths:{juvenile:[{id:'vol_inferno',name:'Infernox',condition:'hunt>=4',desc:'Le sue fiamme sono diventate blu.'},{id:'vol_stone',name:'Lapillix',condition:'sleep>=5',desc:'La pelle si è calcificata.'},{id:'vol_storm',name:'Tempestix',condition:'play>=4',desc:'Fulmini scorrono tra le scaglie.'}],
    adult:[{id:'vol_pyro',name:'Pyrodrax',condition:'hunt>=10',desc:'Signore del fuoco primordiale.'},{id:'vol_titan',name:'Titanix',condition:'sleep>=12',desc:'Corpo massiccio come la roccia.'},{id:'vol_fulmin',name:'Fulminrex',condition:'play>=10',desc:'Porta tempeste ovunque vada.'}]}},
  umbrasel:{name:'Umbrasel',icon:'👁',bodyC:'#120828',accentC:'#9966ee',strokeC:'#7744cc',auraC:'rgba(95,55,190,.2)',attitude:'fearful',hungerRate:1.2,thirstRate:1.4,boredRate:2.5,energyRate:1.8,
    evoPaths:{juvenile:[{id:'umb_void',name:'Voidsel',condition:'sleep>=6',desc:'Si è dissolto nel vuoto.'},{id:'umb_seer',name:'Seersel',condition:'meditate>=3',desc:'I suoi occhi vedono il futuro.'},{id:'umb_specter',name:'Spectryx',condition:'hunt>=2',desc:'Caccia nell\'ombra.'}],
    adult:[{id:'umb_abyss',name:'Abyssalon',condition:'sleep>=14',desc:'Creatura dell\'abisso dimensionale.'},{id:'umb_oracle',name:'Oraculum',condition:'meditate>=8',desc:'Conosce passato e futuro.'},{id:'umb_nether',name:'Nethrix',condition:'hunt>=7',desc:'Cacciatore tra i piani.'}]}},
  crystalis:{name:'Crystalis',icon:'💎',bodyC:'#0a1e28',accentC:'#22ddee',strokeC:'#00bbcc',auraC:'rgba(0,195,215,.2)',attitude:'calm',hungerRate:1.0,thirstRate:1.2,boredRate:1.8,energyRate:1.4,
    evoPaths:{juvenile:[{id:'cry_aurora',name:'Aurorix',condition:'sleep>=5',desc:'Riflette l\'aurora boreale.'},{id:'cry_blade',name:'Shardenyx',condition:'hunt>=3',desc:'I cristalli si sono affilati.'},{id:'cry_prism',name:'Prismatix',condition:'play>=4',desc:'Proietta arcobaleni.'}],
    adult:[{id:'cry_celest',name:'Celestalux',condition:'sleep>=12',desc:'Corpo di luce solidificata.'},{id:'cry_war',name:'Diamondrax',condition:'hunt>=9',desc:'La forma più dura della materia.'},{id:'cry_rainbow',name:'Spectralix',condition:'play>=11',desc:'Incarna tutti i colori.'}]}},
  aetherwyrm:{name:'Aetherwyrm',icon:'🌟',bodyC:'#140d00',accentC:'#ddaa22',strokeC:'#bb8800',auraC:'rgba(195,165,30,.2)',attitude:'majestic',hungerRate:0.8,thirstRate:0.9,boredRate:1.0,energyRate:1.0,
    evoPaths:{juvenile:[{id:'aew_solar',name:'Solwyrm',condition:'play>=3',desc:'Ha assorbito l\'energia solare.'},{id:'aew_void',name:'Voidwyrm',condition:'sleep>=7',desc:'Si nutre del vuoto cosmico.'},{id:'aew_storm',name:'Stormwyrm',condition:'hunt>=3',desc:'Porta tempeste stellari.'}],
    adult:[{id:'aew_star',name:'Starlord',condition:'play>=9',desc:'Una stella vivente.'},{id:'aew_black',name:'Singularis',condition:'sleep>=16',desc:'Densità di un buco nero.'},{id:'aew_nova',name:'Supernovax',condition:'hunt>=9',desc:'Esplode di energia cosmica.'}]}},
  thalasyn:{name:'Thalasyn',icon:'🌊',bodyC:'#041420',accentC:'#22aaff',strokeC:'#0088dd',auraC:'rgba(25,135,215,.2)',attitude:'calm',hungerRate:1.4,thirstRate:0.5,boredRate:1.6,energyRate:1.3,
    evoPaths:{juvenile:[{id:'tha_deep',name:'Abyssalyn',condition:'sleep>=5',desc:'Si è adattato alle profondità.'},{id:'tha_storm',name:'Maelstrix',condition:'hunt>=3',desc:'Cavalca le tempeste marine.'},{id:'tha_coral',name:'Coralyx',condition:'play>=4',desc:'Fiorito come una barriera corallina.'}],
    adult:[{id:'tha_lev',name:'Leviathos',condition:'sleep>=13',desc:'Signore degli abissi.'},{id:'tha_typ',name:'Typhonyx',condition:'hunt>=8',desc:'Provoca uragani.'},{id:'tha_reef',name:'Reefalis',condition:'play>=10',desc:'Un ecosistema vivente.'}]}},
  geolem:{name:'Geolem',icon:'🪨',bodyC:'#221808',accentC:'#aa8855',strokeC:'#886633',auraC:'rgba(145,105,55,.2)',attitude:'calm',hungerRate:1.0,thirstRate:0.8,boredRate:0.8,energyRate:0.9,
    evoPaths:{juvenile:[{id:'geo_iron',name:'Ironlem',condition:'hunt>=4',desc:'Indurito come il ferro.'},{id:'geo_moss',name:'Mosslem',condition:'play>=5',desc:'La natura lo ha colonizzato.'},{id:'geo_gem',name:'Gemlem',condition:'sleep>=6',desc:'Gemme crescono dalla pelle.'}],
    adult:[{id:'geo_titan',name:'Terratitan',condition:'hunt>=10',desc:'Un colosso di roccia pura.'},{id:'geo_ancient',name:'Ancientlem',condition:'play>=12',desc:'La natura è parte di lui.'},{id:'geo_diamond',name:'Diamaglem',condition:'sleep>=14',desc:'Pressione trasformata in diamante.'}]}},
  zephyrix:{name:'Zephyrix',icon:'🌪',bodyC:'#080818',accentC:'#aaccff',strokeC:'#88aaee',auraC:'rgba(135,175,250,.18)',attitude:'playful',hungerRate:2.2,thirstRate:1.8,boredRate:3.5,energyRate:2.8,
    evoPaths:{juvenile:[{id:'zep_gale',name:'Galerix',condition:'play>=6',desc:'Corre alla velocità del vento.'},{id:'zep_storm',name:'Cyclonyx',condition:'hunt>=4',desc:'È diventato una tempesta.'},{id:'zep_mist',name:'Mistrix',condition:'sleep>=4',desc:'Si è dissolto nella nebbia.'}],
    adult:[{id:'zep_jet',name:'Jetstream',condition:'play>=13',desc:'Supera il suono.'},{id:'zep_hurr',name:'Hurricanyx',condition:'hunt>=10',desc:'Un uragano senziente.'},{id:'zep_phant',name:'Phantomist',condition:'sleep>=11',desc:'Invisibile come l\'aria.'}]}},
  mycelith:{name:'Mycelith',icon:'🍄',bodyC:'#180828',accentC:'#cc88ff',strokeC:'#aa66dd',auraC:'rgba(175,95,250,.18)',attitude:'mysterious',hungerRate:0.9,thirstRate:2.2,boredRate:1.2,energyRate:1.1,
    evoPaths:{juvenile:[{id:'myc_toxic',name:'Toxicelith',condition:'hunt>=3',desc:'Le spore sono velenose.'},{id:'myc_glow',name:'Glowycel',condition:'sleep>=6',desc:'Bioluminescente.'},{id:'myc_net',name:'Networkycel',condition:'play>=4',desc:'Mente collettiva.'}],
    adult:[{id:'myc_plague',name:'Plaguelith',condition:'hunt>=8',desc:'Porta trasformazione ovunque.'},{id:'myc_lum',name:'Lumycelith',condition:'sleep>=14',desc:'Galassia di spore luminose.'},{id:'myc_hive',name:'Hivemycel',condition:'play>=10',desc:'Controlla altri organismi.'}]}},
  stormkin:{name:'Stormkin',icon:'⚡',bodyC:'#080420',accentC:'#ffee44',strokeC:'#ddcc00',auraC:'rgba(250,215,35,.18)',attitude:'aggressive',hungerRate:2.8,thirstRate:2.0,boredRate:3.0,energyRate:2.5,
    evoPaths:{juvenile:[{id:'sto_bolt',name:'Boltkin',condition:'hunt>=4',desc:'Fulmine vivente.'},{id:'sto_thund',name:'Thunderkin',condition:'play>=5',desc:'Il suo tuono si sente da km.'},{id:'sto_stat',name:'Statickin',condition:'sleep>=4',desc:'Accumula energia statica.'}],
    adult:[{id:'sto_zeus',name:'Fulminatus',condition:'hunt>=10',desc:'Signore dei fulmini.'},{id:'sto_god',name:'Tempestatis',condition:'play>=12',desc:'Porta il diluvio.'},{id:'sto_cap',name:'Megavoltix',condition:'sleep>=10',desc:'Energia inesauribile.'}]}},
};

const ALL_TRAITS=[
  {id:'caccia',cat:'abilita',name:'Istinto di Caccia',icon:'⚔',desc:'Può andare a caccia e tornare con risorse.',color:'#e8855a',bg:'rgba(232,133,90,.12)',unlock:{trigger:'play',minCount:5,prob:.16},
   action:{id:'hunt',label:'Caccia',icon:'⚔',cooldownH:24,absence:{minH:2,maxH:6,label:'CACCIA',desc:'sta cacciando nell\'oscurità.'},enCost:30,reward:{coins:{min:15,max:45}},malus:{hp:{min:0,max:14}}}},
  {id:'meditazione',cat:'abilita',name:'Meditazione Eterea',icon:'◈',desc:'Si immerge in trance per recuperare energia.',color:'#7c9fbf',bg:'rgba(124,159,191,.12)',unlock:{trigger:'train',minCount:3,prob:.18},
   action:{id:'meditate',label:'Medita',icon:'◈',cooldownH:18,absence:{minH:1,maxH:3,label:'MEDITAZIONE',desc:'è in trance profonda.'},enCost:0,reward:{coins:{min:5,max:18},energy:30},malus:{}}},
  {id:'esplorazione',cat:'abilita',name:'Spirito Esploratore',icon:'◎',desc:'Esplora e torna con risorse rare.',color:'#55bb77',bg:'rgba(85,187,119,.12)',unlock:{trigger:'play',minCount:8,prob:.13},
   action:{id:'explore',label:'Esplora',icon:'◎',cooldownH:20,absence:{minH:3,maxH:8,label:'ESPLORAZIONE',desc:'sta esplorando regioni remote.'},enCost:20,reward:{coins:{min:20,max:60}},malus:{hp:{min:0,max:10}}}},
  {id:'cura_nat',cat:'abilita',name:'Guarigione Naturale',icon:'✦',desc:'Si rigenera lentamente nel tempo.',color:'#00e5c8',bg:'rgba(0,229,200,.1)',unlock:{trigger:'sleep',minCount:5,prob:.15},action:null},
  {id:'res_fuoco',cat:'resistenza',name:'Resistenza al Fuoco',icon:'🔥',desc:'I danni da calore si riducono.',color:'#ff7722',bg:'rgba(255,119,34,.1)',unlock:{trigger:'hunt',minCount:2,prob:.2},action:null},
  {id:'corazza',cat:'resistenza',name:'Corazza Naturale',icon:'◆',desc:'La pelle si è indurita.',color:'#aabb99',bg:'rgba(170,187,153,.1)',unlock:{trigger:'train',minCount:6,prob:.13},action:null},
  {id:'fobia_buio',cat:'fobia',name:'Paura del Buio',icon:'☽',desc:'Perde HP extra nelle ore notturne.',color:'#9966aa',bg:'rgba(153,102,170,.1)',unlock:{trigger:'random',prob:.07},action:null},
  {id:'vuln_fame',cat:'vulnerabilita',name:'Metabolismo Vorrace',icon:'◐',desc:'Ha fame il doppio del normale.',color:'#e8a060',bg:'rgba(232,160,96,.1)',unlock:{trigger:'random',prob:.07},action:null},
  {id:'vuln_sete',cat:'vulnerabilita',name:'Pelle Porosa',icon:'◒',desc:'Ha sete più velocemente.',color:'#6699cc',bg:'rgba(102,153,204,.1)',unlock:{trigger:'random',prob:.055},action:null},
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
function loadG(){try{const s=localStorage.getItem('aether_v4');return s?JSON.parse(s):null;}catch(e){return null;}}
function saveG(){try{localStorage.setItem('aether_v4',JSON.stringify(G));}catch(e){}}

let G=loadG()||newGame();
function newGame(){return{phase:'egg',eggStart:Date.now(),eggDuration:7*24*3600*1000,eggTaps:0,speciesId:null,name:null,birthMs:null,currentForm:null,stage:'hatchling',hp:90,hunger:85,thirst:85,energy:90,boredom:10,isSleeping:false,sleepStart:null,sleepDuration:null,absence:null,coins:15,nextCoinMs:Date.now()+3600000,counts:{play:0,train:0,sleep:0,hunt:0,explore:0,meditate:0},cooldowns:{},unlockedTraitIds:[],evoLog:[],lastTickMs:Date.now()};}

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
// Boot triggered by Firebase auth via window.startGame()

function boot(){
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
  const idle={lazy:[`${G.name} sonnecchia al sole.`,`${G.name} osserva curioso.`,`${G.name} si stira pigro.`],aggressive:[`${G.name} graffia le pareti.`,`${G.name} ruggisce piano.`,`${G.name} si esercita.`],fearful:[`${G.name} è nascosto nell\'angolo.`,`${G.name} osserva tremante.`,`${G.name} sussurra a sé stesso.`],calm:[`${G.name} medita in silenzio.`,`${G.name} respira lentamente.`,`${G.name} contempla l\'infinito.`],majestic:[`${G.name} si muove con grazia.`,`${G.name} osserva dall'alto.`,`${G.name} emana luce.`],playful:[`${G.name} rimbalza ovunque.`,`${G.name} insegue la propria ombra.`,`${G.name} fa capriole.`],mysterious:[`${G.name} emette strane spore.`,`${G.name} sussurra formule.`,`${G.name} scompare un momento.`]}[sp.attitude]||[`${G.name} è tranquillo.`];
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
  const missingEn=Math.max(20,100-G.energy);
  const enR=sp.energyRate<1.5?14:sp.energyRate<2.5?11:8;
  const hrs=Math.max(3,Math.min(10,missingEn/enR));
  G.isSleeping=true;G.sleepStart=Date.now();G.sleepDuration=hrs*3600000;
  G.counts.sleep=(G.counts.sleep||0)+1;setCd('sleep',Math.ceil(hrs)+3);
  saveG();setNotif(G.name+' si è addormentato. Si sveglierà tra ~'+Math.round(hrs)+'h.');
  tryUnlock('sleep');checkEvolution();renderAll();
}
function wakeUp(){
  if(!G.isSleeping)return;
  G.isSleeping=false;G.sleepStart=null;G.sleepDuration=null;
  saveG();setNotif(G.name+' si è svegliato.');renderAll();
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
  const newStage=ageH<48?'hatchling':ageH<336?'juvenile':ageH<2160?'adult':'elder';
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
  const candidates=[...(TRAIT_MAP[trigger]||[]),...(trigger!=='random'?(TRAIT_MAP['random']||[]):[])];
  for(const trait of candidates){
    if(G.unlockedTraitIds.includes(trait.id))continue;
    const u=trait.unlock;
    if(u.minCount&&(G.counts[u.trigger]||0)<u.minCount)continue;
    if(u.trigger!=='random'&&u.trigger!==trigger)continue;
    if(Math.random()<u.prob){G.unlockedTraitIds.push(trait.id);saveG();renderActions();showToast({icon:trait.icon,name:trait.name,desc:trait.desc,color:trait.color,bg:trait.bg,badge:{abilita:'✦ abilità',resistenza:'◆ resistenza',fobia:'☽ fobia',vulnerabilita:'◐ vulnerabilità'}[trait.cat]||''});return;}
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
    const enR=sp.energyRate<1.5?14:sp.energyRate<2.5?11:8;
    G.energy=Math.min(100,G.energy+enR*dtH);
    G.hunger=Math.max(0,G.hunger-0.5*dtH);
    G.thirst=Math.max(0,G.thirst-0.4*dtH);
    G.boredom=Math.max(0,G.boredom-4*dtH);
    G.hp=Math.min(100,G.hp+1*dtH);
    const sleptMs=G.sleepStart?Date.now()-G.sleepStart:0;
    const doneSleep=(G.sleepDuration&&sleptMs>=G.sleepDuration)||G.energy>=100;
    if(doneSleep){G.isSleeping=false;G.sleepStart=null;G.sleepDuration=null;setNotif(G.name+' si è svegliato riposato.');}
  }else if(!absent){
    // BD=4.17: at rate 1.0, need empties in 24h real time
    const BD=4.17;
    G.hunger=Math.max(0,G.hunger-BD*sp.hungerRate*(hasTrait('vuln_fame')?1.6:1)*dtH);
    G.thirst=Math.max(0,G.thirst-BD*sp.thirstRate*(hasTrait('vuln_sete')?1.6:1)*dtH);
    G.energy=Math.max(0,G.energy-sp.energyRate*dtH);
    G.boredom=Math.min(100,G.boredom+sp.boredRate*dtH);
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
  const traits=getUnlockedTraits();
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

// ── SAVE MIGRATION ───────────────────────────────────────────────
function migrateG(g){
  if(!g) return null;
  if(g.boredom===undefined) g.boredom=10;
  if(g.isSleeping===undefined) g.isSleeping=false;
  if(g.sleepStart===undefined) g.sleepStart=null;
  if(g.sleepDuration===undefined) g.sleepDuration=null;
  if(g.absence===undefined) g.absence=null;
  if(g.nextCoinMs===undefined) g.nextCoinMs=Date.now()+3600000;
  if(g.counts===undefined) g.counts={play:0,train:0,sleep:0,hunt:0,explore:0,meditate:0};
  if(g.evoLog===undefined) g.evoLog=[];
  if(g.unlockedTraitIds===undefined) g.unlockedTraitIds=[];
  if(g.cooldowns===undefined) g.cooldowns={};
  // Fix corrupted sleep: isSleeping=true but no duration
  if(g.isSleeping&&!g.sleepDuration){g.isSleeping=false;g.sleepStart=null;}
  // Fix expired absence
  if(g.absence&&g.absence.endsMs<Date.now()){g.absence=null;}
  return g;
}

// ── FIREBASE BRIDGE ──────────────────────────────────────────────
window.startGame = function(){
  if(!window.G){
    try{const bk=localStorage.getItem('aether_v4_bk');window.G=bk?JSON.parse(bk):null;}catch(e){}
  }
  G=migrateG(window.G)||newGame();
  window.G=G;
  setTimeout(()=>{
    const s=document.getElementById('splash');
    if(s){s.classList.add('fade');setTimeout(()=>s.remove(),900);}
    boot();
  },1400);
};

window.getSp=getSp;
window.getCurrentForm=getCurrentForm;
