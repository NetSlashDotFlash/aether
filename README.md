# ÆTHER — Creature Cosmiche

App mobile PWA installabile su Android e iOS.

---

## Struttura file

```
aether-pwa/
├── index.html       # App principale + layout
├── game.js          # Tutta la logica di gioco
├── sw.js            # Service Worker (offline)
├── manifest.json    # Configurazione PWA
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## Deploy su GitHub Pages (5 minuti)

### 1. Crea un repository su GitHub
- Vai su **github.com** → New repository
- Nome: `aether` (o quello che vuoi)
- Lascia pubblico
- **Non** inizializzare con README

### 2. Carica i file
Metodo più semplice — tramite interfaccia web:
- Apri il repository appena creato
- Clicca **"uploading an existing file"**
- Trascina TUTTI i file e la cartella `icons/` nella pagina
- Commit changes

### 3. Attiva GitHub Pages
- Vai in **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `main` → `/ (root)`
- Save

Dopo 1-2 minuti l'app sarà live su:
```
https://netslashdotflash.github.io/aether/
```

---

## Installa sul telefono

### Android (Chrome)
1. Apri il link nel browser Chrome
2. Apparirà un banner "Installa ÆTHER" — tocca **INSTALLA**
3. Oppure: menu ⋮ → "Aggiungi a schermata Home"

### iPhone (Safari)
1. Apri il link in **Safari** (non Chrome)
2. Tocca il pulsante **Condividi** (rettangolo con freccia su)
3. Scorri e tocca **"Aggiungi a schermata Home"**
4. Tocca **Aggiungi**

---

## Come si gioca

- **Uovo**: tocca l'uovo per "vegliarlo". Si schiude dopo 7 giorni reali.
  - *Demo*: tocca 21 volte per schiuderlo subito.
- **Creature**: 5 razze con rarità diversa (Comune → Leggendario).
- **Statistiche** (sinistra): HP, Energia, Forza, Intelligenza.
- **Azioni** (destra): compaiono solo quelle disponibili. Il pallino verde indica "pronta".
- **Abilità**: non ci sono all'inizio. Si sbloccano casualmente giocando, allenando, dormendo. Compariranno come notifica toast.
- **Caccia/Esplora/Medita**: abilità che mandano la creatura via per ore reali. Torna con bonus e malus.
- **Fobie e Vulnerabilità**: possono apparire come tratti negativi casuali.
- **Aetherin (◈)**: moneta guadagnata giocando, allenando e col tempo. Si spende nell'Emporio (tocca ◈).

---

## Il gioco è lento per design
La creatura cresce in tempo reale. Un giorno di vita = un giorno reale.
Controllala 1-2 volte al giorno: nutrita, dissetata, riposata.
