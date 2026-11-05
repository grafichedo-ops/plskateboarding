# P&L Skateboarding (Push and Learn)

Sito della scuola di skate di Matteo a Roma: homepage, prenotazione di corsi e lezioni, tesseramento online.
Rispondi in italiano, in modo diretto e pratico.

## Stack e convenzioni
- Next.js 15 (App Router), React 18, TypeScript, Tailwind 3, shadcn/ui, GSAP, lucide-react.
- Non migrare a Vite, non usare stili inline salvo valori dinamici.
- Testi della homepage in `content/copy.ts`, non nei componenti.
- Colori: `mustard` #D19E1B (lo stesso dei frame dell'hero), `ink` #141414, crema #f7f0de.
- Font: Cubano se esiste `public/fonts/Cubano.woff2`, altrimenti Lilita One; Inter per i testi.
- Stile: illustrato + neo-brutalista (`.btn-press`, `.card-hard`, `shadow-hard-*`).
- Accessibilita': radio veri o ruoli ARIA, focus visibile, stato mai affidato al solo colore.
- Pagine: `/` ufficiale, `/draft/homepage-scroll` bozza noindex, `/homepage2` redirect a `/` (cartella eliminabile).

## Flusso /prenota (5 step)
File: `components/prenota/`, `lib/prenota/regole.ts`, `lib/prenota/disponibilita.ts`.
1. Chi: 4-6, 7-12, 13-17, Adulti.
2. Come: Corso, Privata, Inclusiva. Privata e Inclusiva richiedono singola o coppia.
3. Quando: calendario unico. FATTO, con dati di prova.
4. Dati: DA FARE. Partecipante; genitore se minore; attrezzatura; note. Nessun campo allergie o salute.
5. Riepilogo: DA FARE. Prezzo, avviso tessera, privacy, conferma. Poi schermata finale con calendario e disdetta.

Regole del calendario:
- Corso: solo corsi per la fascia. Privata: private + corsi della fascia. Inclusiva: solo private.
- 13-17: nessun corso, solo singole e private.
- Se da Privata si sceglie un corso, formula e prezzo diventano quelli del corso.
- Assenza di Matteo: X rossa, giorno non selezionabile. Puo' valere per un giorno o per una fascia oraria.
- Weekend chiusi, tranne quelli aperti da Matteo. Colle Oppio: se piove la lezione passa al Quiver.

Orari:
- The Quiver (Via Alessandro Severo 209, Garbatella).
  - Mer 17-18 e 18-19: bambini generico.
  - Gio e Ven 17-18: 4-6; 18-19: 7-12; 19-20: adulti.
- Colle Oppio: Lun e Mer 10-11, Ven 14-16.
- BEAT (lun, mar): fuori dal sito per ora.

Assunzioni da confermare: corso a data singola; Ven 14-16 diviso in due lezioni da un'ora; privata Quiver Mer 19-20 (segnaposto).
Prezzi, posti, IBAN, associazione e mittente non sono definiti: non inventarli.

## Backend
Stessa architettura di `../savages-site/apps-script/Backend.gs`: Google Sheet + Apps Script, ma Sheet, script, mittente e IBAN separati.
- Tab: Slot fissi, Assenze, Aperture, Prenotazioni, Tesserati.
- Sostituire `caricaDisponibilita` con la GET mantenendo il tipo `Giorno[]`; nascondere gli orari di oggi gia' passati.
- POST con `fetch` normale e `text/plain`, leggendo la risposta. Non usare `no-cors`.
- `LockService` e ricontrollo del posto alla conferma, disdetta fino a 3 ore prima, promemoria 6 ore prima.
- Riusare `pagato`, `allievo_presente`, `coach_presente`. Rimuovere gioco, classifica ed eventi.
- Il deploy di Apps Script si fa a mano dall'editor Google.

NON replicare da Savages:
- `setSharing(ANYONE_WITH_LINK)`: certificati e firme devono restare privati.
- Disdetta eseguita dalla GET: serve la pagina `/gestisci` con conferma esplicita.
- Blocco dei minori nel tesseramento: per P&L servono i dati e la firma del genitore.

## Ancora da collegare
- `/tesseramento` e' un segnaposto.
- Instagram, card F.A.Q. e Collaborazioni non hanno ancora una destinazione.
- `next build` non e' stata ancora eseguita dopo queste modifiche.

Riferimenti: board FigJam https://www.figma.com/board/aYZJW6ohvNxGaNF5p1UfIc
