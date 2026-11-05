# P&L Skateboarding — Homepage

Sito per P&L Skateboarding, scuola di skate a Roma. Next.js + Tailwind +
shadcn/ui, hero con video scrollato via GSAP, stile sketch/illustrativo
con accenti neo-brutalist (bottoni a pressione, card con hard shadow).

## 1. Installa le dipendenze

```bash
npm install
```

## 2. Asset da aggiungere prima del primo `npm run dev`

Segui i `README.md` dentro ciascuna cartella:

- `public/video/README.md` — video hero (Magnific)
- `public/images/README.md` — puppet corsi + icone FAQ/IG/Collab (Magnific)
- `public/fonts/README.md` — font Cubano (licenza a parte)

Senza questi file il sito parte comunque (Next non rompe la build per un
404 su un'immagine/video), ma hero e card risulteranno vuoti.

## 3. Header — @efferd/header-2

Il progetto è già configurato per il registry `@efferd` (vedi
`components.json`). Il file `components/Nav.tsx` attuale è un header
funzionante di base, temporaneo: sostituiscilo con `header-2` quando lo
installi.

```bash
# 1. Skill shadcn (se non già presente)
npx skills add shadcn/ui

# 2. Il progetto ha già components.json — skip init, salta al punto 3
#    (se per qualche motivo manca: npx shadcn@latest init)

# 3. Il registry @efferd è già dentro components.json — skip

# 4. Installa il componente
npx shadcn@latest add @efferd/header-2
```

Dopo l'installazione:
- Il componente atterra in `components/ui/`.
- Sostituisci l'uso di `<Nav />` in `app/page.tsx` con il nuovo header,
  passandogli i contenuti da `content/copy.ts` (`nav.logo`, `nav.links`,
  `nav.cta`) così il testo resta unica fonte di verità.
- Verifica che i colori del componente (probabilmente token shadcn
  neutri) siano riallineati alla palette P&L (`#D8A800`, `#141414`,
  bianco) — il componente scaricato userà le CSS variable di
  `app/globals.css`/`tailwind.config.ts`, ma controlla a vista.

## 4. Avvia il dev server

```bash
npm run dev
```

## Struttura

```
app/
  layout.tsx        # font Cubano + Inter, metadata
  page.tsx           # assembla le sezioni della homepage
  globals.css         # tailwind + variabili colore + utility neo-brutalist
components/
  Nav.tsx             # header temporaneo (da sostituire con @efferd/header-2)
  ScrollHero.tsx      # pin scroll + scrub video (GSAP)
  sections/           # le 7 sezioni della homepage (Frame 1-7 del mockup Figma)
content/
  copy.ts             # TUTTI i testi del sito — unica fonte di verità
public/
  video/ images/ fonts/   # asset da aggiungere (vedi README in ciascuna)
```

## Prossimi step (non in questa homepage)

- Pagina form prenotazione lezione + tesseramento, stile Savages Surfskate
  Roma, stesso backend Google — da fare dopo che il cliente approva questa
  homepage.
- Popolare i contatti/sedi definitivi nel footer (`content/copy.ts` →
  `footer`), attualmente riprende solo le sedi di `doveFacciamo`.
