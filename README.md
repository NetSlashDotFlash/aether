# ÆTHER — Creature Cosmiche

App mobile PWA installabile su Android e iOS, con salvataggio cloud tramite account Google.

---

## Struttura file

```
aether/
├── index.html          # App principale + layout + login Firebase
├── game.js             # Logica di gioco completa
├── sw.js               # Service Worker (funziona offline)
├── manifest.json       # Configurazione PWA
├── icons/
│   ├── icon-48.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-192.png
│   ├── icon-192-maskable.png
│   ├── icon-512.png
│   └── icon-512-maskable.png
└── screenshots/
    ├── screen1.png
    └── screen2.png
```

---

## Deploy su GitHub Pages

### 1. Carica i file
- Apri il repository su GitHub
- Trascina tutti i file e le cartelle nella pagina
- Commit changes

### 2. Attiva GitHub Pages
- Vai in **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main` → `/ (root)` → Save

L'app sarà live su:
```
https://netslashdotflash.github.io/aether/
```

---

## Installa sul telefono

### Android (Chrome)
1. Apri il link in Chrome
2. Tocca il banner **"Installa ÆTHER"** oppure menu ⋮ → "Aggiungi a schermata Home"

### iPhone (Safari)
1. Apri il link in **Safari** (non Chrome)
2. Tocca **Condividi** ↑ → **"Aggiungi a schermata Home"**

---

## Come si gioca

### Uovo
- L'uovo si schiude dopo **7 giorni reali**
- Toccalo ogni tanto per vegliarlo
- *Demo*: toccalo 21 volte per schiuderlo subito
- La razza è assegnata casualmente alla schiusa tra 10 specie

### Razze disponibili
| Specie | Carattere | Note |
|--------|-----------|------|
| Luminfang | Pigro, curioso | Fame lenta (~26h) |
| Volcanox | Aggressivo, impulsivo | Brucia tutto in fretta (~17h) |
| Umbrasel | Timido, pauroso | Si annoia facilmente |
| Crystalis | Calmo, riflessivo | Equilibrato |
| Aetherwyrm | Maestoso, antico | Quasi non mangia (~43h) |
| Thalasyn | Sereno, acquatico | Poca sete, molta fame |
| Geolem | Paziente, lento | Metabolismo lentissimo (~37h) |
| Zephyrix | Iperattivo, instabile | Si esaurisce in ~14h |
| Mycelith | Misterioso, fungino | Poca fame, molta sete |
| Stormkin | Elettrico, caotico | Brucia energia rapidissimo |

### Bisogni
I bisogni calano in tempo reale. A velocità 1.0× si esauriscono in ~24h.
Ogni razza ha i suoi moltiplicatori. Se Fame o Sete scendono a 0, la creatura perde HP.

- 🍖 **Fame** — dai cibo (costa ◈8)
- 💧 **Sete** — dai acqua (costa ◈4)
- ⚡ **Energia** — si recupera dormendo
- 🎮 **Noia** — gioca o usa un giocattolo
- ❤ **HP** — si perde per fame/sete/danni, si cura con l'elisir

### Sonno
- Tocca **"Dormi"** per far addormentare la creatura
- Si sveglia automaticamente dopo 4-10h (dipende dalla razza e da quanta energia manca)
- Se l'energia arriva a 0, si addormenta da sola
- Durante il sonno i bisogni calano lentamente e HP si rigenera

### Azioni (colonna destra)
Il pallino verde indica che l'azione è disponibile. Le azioni hanno cooldown reali:
- **Nutrì** — 6h cooldown
- **Acqua** — 4h cooldown
- **Gioca** — 8h cooldown (guadagni ◈3)
- **Allena** — 14h cooldown (guadagni ◈5)
- **Cura** — 2h cooldown (costa ◈22)
- **Dormi / Sveglia** — gestisce il sonno

### Evoluzioni
Le evoluzioni avvengono in modo spontaneo in base alle attività svolte:
- **Cucciolo → Giovane**: dopo 30 giorni reali
- **Giovane → Adulto**: dopo 90 giorni reali
- **Adulto → Antico**: dopo 365 giorni reali

Ogni razza ha 3 percorsi evolutivi per stadio (es. Cacciatore, Mistico, Gentile).
Il percorso dipende da cosa fai: chi caccia molto evolve diversamente da chi medita.

### Tratti
I tratti si sbloccano lentamente nel tempo — i primi compaiono dopo 1-2 settimane di gioco attivo. Sono di 4 tipi:

- **✦ Abilità** — sbloccano azioni speciali (Caccia, Meditazione, Esplorazione)
- **◆ Resistenze** — riducono danni o rallentano certi bisogni
- **☽ Fobie** — effetti negativi casuali (paura del buio, ipersensibilità...)
- **◐ Vulnerabilità** — accelerano certi bisogni (metabolismo vorrace, pelle porosa...)

Sono disponibili **142+ tratti** in totale, molti esclusivi per razza o stadio evolutivo.
Tocca **TRATTI** in alto a destra per vedere quelli scoperti.

### Aetherin (◈)
La moneta di gioco. Si guadagna:
- Giocando (+◈3) e allenandosi (+◈5)
- Passivamente: +◈1 ogni ora
- Tornando da caccia, meditazione ed esplorazione

Si spende nell'**Emporio** (tocca ◈ in alto) per cibo, acqua, cure e giocattoli.

---

## Account e salvataggio cloud

L'app usa **Firebase** per salvare i progressi nel cloud.
- Accedi con il tuo account Google
- I progressi sono sincronizzati automaticamente
- Puoi giocare su più dispositivi con lo stesso account
- Il puntino in basso a destra indica lo stato di sincronizzazione:
  - 🟢 Verde = sincronizzato
  - 🟡 Giallo = salvataggio in corso
  - 🔴 Rosso = errore di connessione (i dati sono comunque salvati localmente)

---

## Il gioco è lento per design
La creatura cresce in tempo reale. Controllala 1-2 volte al giorno.
Non serve stare incollati — basta non abbandonarla per giorni interi senza nutrirla.
