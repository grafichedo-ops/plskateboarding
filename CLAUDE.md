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
- Pagine: `/` ufficiale, `/chi-sono`, `/corsi-e-lezioni`, `/faq`, `/prenota`, `/tesseramento` (segnaposto), `/draft/homepage-scroll` bozza noindex, `/homepage2` redirect a `/` (cartella eliminabile).
- Menu: Chi sono -> `/chi-sono`, Corsi e Lezioni -> `/corsi-e-lezioni`, Sedi e Orari -> `/corsi-e-lezioni#orari`, F.A.Q. -> `/faq`. Footer Sedi -> `/corsi-e-lezioni#sedi`.
- Componenti condivisi delle pagine interne: `PageHero` (banner mustard con h1) e `CtaFinale`.
- `/corsi-e-lezioni` legge orari e sedi delle formule da `orarioSettimanale()` e `sediPer()` in `lib/prenota/disponibilita.ts`: nessun orario duplicato. Gli slot `daConfermare` restano prenotabili ma non compaiono negli orari pubblici.
- `/faq`: `<details>`/`<summary>`; le risposte TODO_MATTEO sono escluse dalla pagina e dal JSON-LD FAQPage, e una categoria senza domande visibili sparisce.
- `content/copy.ts` lo legge anche la bozza a scroll: non rinominare gli export e tieni i campi strutturali (`h1Split`, `h1Accent`).
- Banner homepage: `components/sections/BannerPromo.tsx` (varianti ink, card, mustard). `immagine: null` mostra il placeholder "Immagine da inserire".

## Illustrazioni (`public/images/*.webp`, registro `ILLU` in `content/copy.ts`)
Sfondo trasparente e tratto nero: sempre `object-contain`, proporzioni del file, niente bordi, ritagli o filtri. Sul nero vanno su un fondo mustard. Alt vuoto quando sono solo un accento. Mai la stessa illustrazione due volte nella stessa schermata.
- Homepage: banner FISR `matteo-ciao` (solo finche' Chi sono usa la foto `matteo-con-bambino.png`); lezioni inclusive `matteo-assistenza`; compleanni `compleanno`; sedi `the-quiver` e `colle-oppio`; tesseramento `tessera` sopra il titolo.
- `/chi-sono`: banner `matteo-ciao`; metodo `matteo-adulti`, `matteo-assistenza`, `matteo-cinque`.
- `/corsi-e-lezioni`: hero `matteo-ciao` (non `matteo-cinque`: e' gia' nella card Bambini subito sotto); per eta' Bambini `matteo-cinque` (una per le due card), Ragazzi `matteo-assistenza`, Adulti `matteo-adulti`; sedi `the-quiver`, `colle-oppio`; inclusive `inclusione-gruppo`; compleanni `compleanno`; `attrezzatura`, `pioggia`.
- `/prenota`: conferma `matteo-cinque`; mese senza orari `calendario`; step Dati `attrezzatura` piccola.
- `/faq`: accenti per categoria `pioggia` (Prenotazione), `tessera` (Tesseramento), `attrezzatura` (Attrezzatura e pagamenti, nascosta finche' tutte TODO).

## Tono (voce di @pushandlearn)
- Diretto, caldo e ironico, ma chiaro. Frasi brevi. Si parla a genitori e adulti principianti, in prima persona (Matteo).
- Riferimenti veri: "Il piedino storto è una prerogativa", "Il cinque è sempre obbligatorio", "La schiena DRITTAAAA (non troppo però ecco)".
- Niente gergo da agenzia, promesse assolute, toni da influencer, numeri di follower.
- Non inventare biografia, anni di esperienza, numero allievi, risultati, prezzi, testimonianze, titoli.
- Titoli confermati: "Istruttore Federale FISR Livello 3" (confermato da Edo) e "Docente e Tecnico per Italian Skateboarding e Skate Italia". Nessun altro.
- "Inclusivo" resta generico: niente diagnosi o condizioni specifiche. Non citare BEAT.
- Dato mancante: `TODO_MATTEO` in `content/copy.ts`; `daCompilare()` nasconde il blocco finche' non e' compilato.
- Foto: solo quelle in `public/images`, niente frame o video presi da Instagram, niente stock, niente immagini generate di bambini. Le foto con minori vanno verificate (liberatoria).

## Flusso /prenota (5 step)
File: `components/prenota/`, `lib/prenota/` (regole, disponibilita, dati, invio, agenda, date).
1. Chi: 4-6, 7-12, 13-17, Adulti.
2. Come: Corso, Privata, Inclusiva. Privata e Inclusiva richiedono singola o coppia.
3. Quando: calendario unico. FATTO, con dati di prova.
4. Dati: FATTO (`DatiForm.tsx`, `lib/prenota/dati.ts`). Partecipante (due se coppia); genitore se minore, altrimenti contatti dell'adulto; attrezzatura; note. Nessun campo allergie o salute. Niente data di nascita: fa fede la fascia del passaggio 1.
5. Riepilogo: FATTO (`Riepilogo.tsx`). Prezzo, privacy, conferma. Niente avviso tessera nel form: lo ricorda Matteo o un banner non invasivo. Poi schermata finale (`Conferma.tsx`) con Google Calendar, file .ics (`lib/prenota/agenda.ts`, ora di Roma) e disdetta.
   - Invio simulato in `lib/prenota/invio.ts`: da sostituire con la POST mantenendo `inviaPrenotazione`. Esito `pieno` rimanda al calendario.
   - Prezzi in `PREZZI` (`regole.ts`) tutti null: il riepilogo mostra "Da definire".
   - Manca la pagina dell'informativa privacy da collegare al consenso.

Regole del calendario:
- Corso: solo corsi per la fascia. Privata: private + corsi della fascia. Inclusiva: solo private.
- 13-17: nessun corso, solo singole e private.
- Se da Privata si sceglie un corso, formula e prezzo diventano quelli del corso.
- Assenza di Matteo: X rossa, giorno non selezionabile. Puo' valere per un giorno o per una fascia oraria.
- Weekend chiusi, tranne quelli aperti da Matteo. Colle Oppio: se piove la lezione passa al Quiver.

Orari:
- The Quiver (Via Alessandro Severo 209, Garbatella).
  - Mer 17-18: 4-6; 18-19: 7-12.
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
- Card F.A.Q. -> `/faq`. Card Collaborazioni -> Instagram (non c'e' un contatto dedicato). Instagram e' collegato.
- FAQ con TODO_MATTEO: cosa portare, come si paga, quanto costa una lezione.
- `CONTATTO_COMPLEANNI` e' TODO_MATTEO: il banner compleanni porta a Instagram.
- Biografia di `/chi-sono` (`chiSono.bio.testo`) e' TODO_MATTEO: la sezione e' nascosta.

Riferimenti: board FigJam https://www.figma.com/board/aYZJW6ohvNxGaNF5p1UfIc
