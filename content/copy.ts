// Testi del sito P&L Skateboarding: aggiorna qui, non nei componenti.
// Voce: quella del profilo Instagram @pushandlearn (vedi CLAUDE.md, "Tono").
// Questi oggetti li legge anche la bozza /draft/homepage-scroll: i campi
// strutturali (h1Split, h1Accent...) restano anche dove la homepage non li usa.
//
// TODO_MATTEO: segnaposto per i dati che solo Matteo puo' dare. Un blocco che
// contiene ancora TODO_MATTEO non viene mostrato in pagina (vedi daCompilare).

export const TODO = "TODO_MATTEO";
/** true se il testo e' ancora da compilare: il blocco va nascosto. */
export const daCompilare = (v: string | null | undefined) => !v || v.trim() === "" || v.includes(TODO);

export const INSTAGRAM_URL = "https://www.instagram.com/pushandlearn/";

/** Unico titolo confermato da Edo. Non aggiungerne altri senza conferma. */
export const CREDENZIALE_FISR = "Istruttore Federale FISR Livello 3";
export const CREDENZIALE_SKATE_ITALIA = "Docente e Tecnico per Italian Skateboarding e Skate Italia";

/**
 * Contatto per le feste di compleanno (link mailto:, tel:, WhatsApp...).
 * Finche' resta TODO_MATTEO il bottone porta a Instagram.
 */
export const CONTATTO_COMPLEANNI: string = TODO;

/** Immagine con dimensioni reali del file (lette dal PNG/WebP, non stimate). */
export type Immagine = { src: string; alt: string; w: number; h: number };

/**
 * Illustrazioni in public/images (sfondo trasparente). Dimensioni lette dai file.
 * `alt` e' quello descrittivo: dove l'illustrazione e' solo un accento il
 * componente passa alt="".
 */
export const ILLU = {
  matteoCiao: { src: "/images/matteo-ciao.webp", w: 785, h: 1600, alt: "Matteo saluta con la mano, lo skate sotto il braccio" },
  matteoAdulti: { src: "/images/matteo-adulti.webp", w: 1459, h: 1530, alt: "Matteo tiene per mano un'allieva adulta in piedi sullo skate" },
  matteoAssistenza: { src: "/images/matteo-assistenza.webp", w: 1600, h: 1377, alt: "Matteo, in ginocchio, tiene le mani di un bambino in piedi sullo skate" },
  matteoCinque: { src: "/images/matteo-cinque.webp", w: 1600, h: 1466, alt: "Matteo batte il cinque a un bambino con il casco" },
  inclusioneGruppo: { src: "/images/inclusione-gruppo.webp", w: 1600, h: 902, alt: "Quattro ragazzi che skatano insieme, uno in carrozzina" },
  compleanno: { src: "/images/compleanno.webp", w: 1600, h: 1181, alt: "Torta di compleanno appoggiata su uno skate, tra palloncini e cappellini" },
  theQuiver: { src: "/images/the-quiver.webp", w: 1600, h: 1022, alt: "Il capannone del The Quiver con la rampa all'interno" },
  colleOppio: { src: "/images/colle-oppio.webp", w: 1600, h: 1274, alt: "Lo skatepark di Colle Oppio tra i pini, con il Colosseo sullo sfondo" },
  tessera: { src: "/images/tessera.webp", w: 1424, h: 1329, alt: "Tessera e penna per firmare" },
  attrezzatura: { src: "/images/attrezzatura.webp", w: 1600, h: 1542, alt: "Skate, casco, ginocchiere e polsiere" },
  pioggia: { src: "/images/pioggia.webp", w: 1600, h: 1438, alt: "Skate sotto un ombrello aperto, sotto la pioggia" },
  calendario: { src: "/images/calendario.webp", w: 1360, h: 1600, alt: "Calendario con un giorno cerchiato" },
} satisfies Record<string, Immagine>;

export const meta = {
  home: {
    title: "Lezioni di skate a Roma per bambini, ragazzi e adulti | P&L Skateboarding",
    description:
      "Lezioni di skate a Roma con un metodo educativo e inclusivo: corsi e lezioni private per bambini, ragazzi e adulti al The Quiver (Garbatella) e a Colle Oppio.",
  },
  chiSono: {
    title: "Chi sono — Matteo, istruttore di skate a Roma | P&L Skateboarding",
    description:
      "Sono Matteo, Istruttore Federale FISR Livello 3. Insegno skateboard a Roma con il metodo Push and Learn, a persone di tutte le età e di tutti i livelli.",
  },
  corsi: {
    title: "Corsi e lezioni di skate a Roma | P&L Skateboarding",
    description: "Corsi di gruppo, lezioni private e inclusive per bambini, ragazzi e adulti a Roma.",
  },
  faq: {
    title: "F.A.Q. | P&L Skateboarding",
    description: "Risposte su corsi, lezioni, prenotazione, tesseramento e attrezzatura.",
  },
};

export const hero = {
  h1: "IMPARA A SKATARE A ROMA, DA DOVE SEI TU",
  // parole iniziali in bianco nel titolo
  h1Split: 5,
  paragraph:
    "Corsi e lezioni di skateboard per bambini, ragazzi e adulti. Un metodo educativo e inclusivo, con un istruttore sempre accanto a te.",
  // frasi del paragrafo da mettere in grassetto: devono comparire identiche nel testo.
  paragraphBold: ["Corsi e lezioni di skateboard", "un istruttore sempre accanto a te"],
  ctaPrimary: "Prenota la tua lezione",
  ctaSecondary: "Tesserati",
  ctaSecondaryHref: "/tesseramento",
  credenziali: CREDENZIALE_FISR,
};

/** Sezione "Chi sono" della homepage (l'export resta chiSiamo per la bozza). */
export const chiSiamo = {
  h1: "LO SKATE SI IMPARA. E NON TI LASCIO MAI DA SOLO",
  h1Split: 4,
  // Parole in mustard nella variante chiara: "LO SKATE SI IMPARA."
  h1Accent: [0, 1, 2, 3],
  paragraph:
    "Ogni percorso parte dai tuoi punti di forza. Con il metodo delle assistenze ti seguo passo dopo passo, per ridurre il rischio di caduta e costruire fiducia sulla tavola.",
  cta: "Conosci Matteo",
  ctaHref: "/chi-sono",
};

export const corsiCarosello = {
  h1: "SI PARTE DA QUI, A QUALSIASI ETÀ",
  h1Split: 4,
  cards: [
    {
      id: "bambini-4-6",
      fascia: "4-6",
      title: "Skate per bambini 4-6",
      description: "Equilibrio, gioco e prime spinte. Il cinque a fine lezione è obbligatorio.",
      ctaPrimary: "Vedi i corsi",
      ctaSecondary: "Lezione privata",
      image: "/images/puppet-kids-m.png",
    },
    {
      id: "bambini-7-12",
      fascia: "7-12",
      title: "Skate per bambini 7-12",
      description: "Basi solide, nuovi trick e tanta fiducia sulla tavola.",
      ctaPrimary: "Vedi i corsi",
      ctaSecondary: "Lezione privata",
      image: "/images/puppet-teen-m.png",
    },
    {
      id: "ragazzi",
      fascia: "13-17",
      title: "Skate per ragazzi 13-17",
      description: "Lezioni singole o private per crescere con il tuo ritmo.",
      // 13-17 non ha corsi: il carosello mostra solo la CTA secondaria.
      ctaPrimary: "Vedi i corsi",
      ctaSecondary: "Lezione privata",
      image: "/images/puppet-boy-busto.png",
    },
    {
      id: "adulti",
      fascia: "adulti",
      title: "Skate per adulti",
      description: "Non è mai troppo tardi. Zero pressione, zero paragoni.",
      ctaPrimary: "Vedi i corsi",
      ctaSecondary: "Lezione privata",
      image: "/images/puppet-adult-m.png",
    },
  ],
};

export const doveFacciamo = {
  h1: "CI VEDIAMO A ROMA",
  h1Split: 2,
  paragraph: "Corsi al The Quiver, lezioni anche a Colle Oppio. Se piove a Colle Oppio, ci spostiamo al Quiver.",
  locations: [
    {
      name: "The Quiver",
      address: "Via Alessandro Severo 209, Garbatella",
      immagine: ILLU.theQuiver,
    },
    {
      name: "Colle Oppio",
      address: "Skatepark di Colle Oppio, di fronte al Colosseo",
      immagine: ILLU.colleOppio,
    },
  ],
  cta: "Vedi orari e prenota",
};

export const tesseramento = {
  h1: "ENTRA IN PUSH AND LEARN",
  h1Split: 2,
  // Contenuti invariati: nessun vantaggio nuovo finche' Matteo non li conferma.
  benefits: [
    {
      title: "Metodo su misura",
      description: "Un percorso costruito sulle tue capacità, senza confronti e senza fretta.",
    },
    {
      title: "Assistenza costante",
      description: "Non skati mai da sola/o: un istruttore ti segue in ogni fase dell'apprendimento.",
    },
    {
      title: "Accesso a tutte le sedi",
      description: "Prenota lezioni e corsi in tutte le location P&L a Roma.",
    },
    {
      title: "Community P&L",
      description: "Entri a far parte di un gruppo che skata, cresce e si allena insieme.",
    },
  ],
  /** Accento decorativo sopra il titolo (alt vuoto). */
  immagine: ILLU.tessera,
  priceLabel: "*Prezzo annuale",
  price: "30€",
  cta: "Tesserati",
};

/** Banner promozionali della homepage (components/sections/BannerPromo.tsx). */
export const banner = {
  fisr: {
    titolo: "ISTRUTTORE FEDERALE FISR LIVELLO 3",
    testo: "Impari con un metodo chiaro, in un percorso seguito passo dopo passo.",
    cta: { label: "Scopri il metodo", href: "/chi-sono#metodo" },
    loghi: [
      { src: "/images/logo-fisr.webp", alt: "FISR, Federazione Italiana Sport Rotellistici", w: 67, h: 64 },
      { src: "/images/logo-skate-italia.webp", alt: "Skate Italia", w: 99, h: 43 },
    ],
    // Solo perche' la sezione Chi sono della homepage usa ancora la foto.
    immagine: ILLU.matteoCiao,
  },
  inclusive: {
    titolo: "LEZIONI INCLUSIVE",
    testo: "Un percorso privato, singolo o di coppia, costruito sulle capacità di ogni persona.",
    cta: { label: "Prenota una lezione inclusiva", href: "/prenota?formula=inclusiva" },
    immagine: ILLU.matteoAssistenza,
  },
  compleanni: {
    titolo: "FESTA DI COMPLEANNO SUGLI SKATE",
    testo:
      "Una festa per bambini tra giochi, equilibrio e prime spinte sulla tavola. Scrivimi e organizziamo insieme la giornata.",
    cta: daCompilare(CONTATTO_COMPLEANNI)
      ? { label: "Scrivimi su Instagram", href: INSTAGRAM_URL }
      : { label: "Contattami", href: CONTATTO_COMPLEANNI },
    immagine: ILLU.compleanno,
  },
};

/** Sezione "Dalle lezioni": frasi vere dai reel di @pushandlearn. */
export const dalleLezioni = {
  h2: "COSA SUCCEDE IN LEZIONE",
  linkLabel: "Guarda il reel",
  cards: [
    { frase: "Il piedino storto è una prerogativa", href: "https://www.instagram.com/reel/DfUTPTSAcdW/" },
    { frase: "Il cinque è sempre obbligatorio", href: "https://www.instagram.com/reel/DeMxdC0gDsS/" },
    { frase: "La schiena DRITTAAAA (non troppo però ecco)", href: "https://www.instagram.com/reel/DeHF3NUgyNz/" },
  ],
};

export const faqIgCollab = {
  cards: [
    {
      id: "faq",
      title: "F.A.Q.",
      description:
        "Hai dubbi su corsi, orari o attrezzatura? Trovi qui le risposte alle domande più frequenti, prima di iniziare.",
      cta: "Apri le F.A.Q.",
      href: "/faq",
      icon: "/images/icon-faq.png",
    },
    {
      id: "instagram",
      title: "Instagram",
      description: "Lezioni, cadute e piccoli traguardi: li trovi su Instagram.",
      cta: "Seguici",
      href: INSTAGRAM_URL,
      icon: "/images/icon-instagram.png",
    },
    {
      id: "collaborazioni",
      title: "Collaborazioni",
      description:
        "Negozi, associazioni, spazi urbani: se vuoi costruire qualcosa insieme a P&L, scrivici la tua idea.",
      // Nessun contatto dedicato: come i compleanni, si scrive su Instagram.
      cta: "Scrivici su Instagram",
      href: INSTAGRAM_URL,
      icon: "/images/icon-collab.png",
    },
  ],
};

export const chiSono = {
  h1: "CIAO, SONO MATTEO",
  h1Split: 1, // "CIAO," in bianco
  immagine: ILLU.matteoCiao,
  intro:
    "Insegno skateboard con un approccio educativo e inclusivo, a persone di tutte le età e di tutti i livelli.",
  cta: "Prenota la tua lezione",
  metodo: {
    h2: "IL METODO PUSH AND LEARN",
    blocchi: [
      {
        titolo: "Si parte da te",
        immagine: ILLU.matteoAdulti,
        testo: "Ogni percorso parte dai tuoi punti di forza ed è costruito sulle tue capacità, senza confronti.",
      },
      {
        titolo: "Non sei mai da solo",
        immagine: ILLU.matteoAssistenza,
        testo:
          "Con il metodo delle assistenze ti seguo passo dopo passo, per ridurre il rischio di caduta e costruire fiducia sulla tavola.",
      },
      {
        titolo: "Si impara senza fretta",
        immagine: ILLU.matteoCinque,
        testo: "Ognuno ha il suo ritmo. Zero pressione, zero paragoni: si cresce lezione dopo lezione.",
      },
    ],
  },
  perChi: {
    h2: "PER CHI È",
    gruppi: [
      {
        titolo: "Bambini",
        testo: "Dai 4 ai 12 anni, con corsi di gruppo e lezioni private.",
        immagine: "/images/puppet-kids-m.png",
        link: [
          { label: "Prenota per 4-6 anni", href: "/prenota?fascia=4-6" },
          { label: "Prenota per 7-12 anni", href: "/prenota?fascia=7-12" },
        ],
      },
      {
        titolo: "Ragazzi",
        testo: "Dai 13 ai 17 anni, con lezioni singole o private. Per questa fascia non ci sono corsi.",
        immagine: "/images/puppet-boy-busto.png",
        link: [{ label: "Prenota per 13-17 anni", href: "/prenota?fascia=13-17" }],
      },
      {
        titolo: "Adulti",
        testo: "Non è mai troppo tardi: corsi di gruppo e lezioni private, anche se parti da zero.",
        immagine: "/images/puppet-adult-m.png",
        link: [{ label: "Prenota per adulti", href: "/prenota?fascia=adulti" }],
      },
    ],
  },
  credenziali: {
    h2: "CREDENZIALI",
    voci: [
      { testo: CREDENZIALE_FISR, logo: banner.fisr.loghi[0] },
      { testo: CREDENZIALE_SKATE_ITALIA, logo: banner.fisr.loghi[1] },
    ],
  },
  bio: {
    h2: "LA MIA STORIA",
    // Biografia di Matteo: finche' resta TODO_MATTEO la sezione non compare.
    testo: TODO,
  },
  finale: {
    h2: "LA PRIMA SPINTA LA FACCIAMO INSIEME",
    cta: "Prenota la tua lezione",
  },
};

export const nav = {
  logo: "P&L Skateboarding",
  links: [
    { label: "Chi sono", href: "/chi-sono" },
    { label: "Corsi e Lezioni", href: "/corsi-e-lezioni" },
    { label: "Sedi e Orari", href: "/corsi-e-lezioni#orari" },
    { label: "Tesseramenti", href: "/tesseramento" },
    { label: "F.A.Q.", href: "/faq" },
  ],
  cta: "Prenota Ora",
};

// Footer: struttura provvisoria (indirizzi gia' noti da doveFacciamo).
export const footer = {
  logo: "P&L Skateboarding",
  columns: [
    {
      title: "Menu",
      links: nav.links,
    },
    {
      title: "Sedi",
      links: doveFacciamo.locations.map((l) => ({
        label: l.name,
        href: "/corsi-e-lezioni#sedi",
      })),
    },
    {
      title: "Social",
      links: [{ label: "Instagram", href: INSTAGRAM_URL }],
    },
  ],
  copyright: `© ${new Date().getFullYear()} P&L Skateboarding — Tutti i diritti riservati`,
};

/** Pagina /corsi-e-lezioni. Orari e sedi delle formule arrivano da lib/prenota/disponibilita.ts. */
export const corsiPage = {
  hero: {
    h1: "CORSI E LEZIONI DI SKATE A ROMA",
    h1Split: 3,
    testo: "Bambini, ragazzi e adulti: scegli il percorso giusto e parti da dove sei tu.",
    cta: "Prenota ora",
    // Da brief sarebbe matteo-cinque, ma e' anche l'illustrazione dei Bambini
    // subito sotto: nella stessa schermata comparirebbe due volte.
    immagine: ILLU.matteoCiao,
  },
  perEta: {
    h2: "PER ETÀ",
    ctaCorso: "Vedi i corsi",
    ctaPrivata: "Lezione privata",
    // Un'illustrazione per gruppo: le due card dei bambini la condividono,
    // cosi' la stessa immagine non compare due volte affiancata.
    gruppi: [
      {
        titolo: "Bambini",
        immagine: ILLU.matteoCinque,
        card: [
          { fascia: "4-6", titolo: "Bambini 4-6", testo: "Equilibrio, gioco e prime spinte.", corso: true },
          { fascia: "7-12", titolo: "Bambini 7-12", testo: "Basi solide e nuova fiducia sulla tavola.", corso: true },
        ],
      },
      {
        titolo: "Ragazzi",
        immagine: ILLU.matteoAssistenza,
        card: [{ fascia: "13-17", titolo: "Ragazzi 13-17", testo: "Lezioni singole o private, con il tuo ritmo.", corso: false }],
      },
      {
        titolo: "Adulti",
        immagine: ILLU.matteoAdulti,
        card: [{ fascia: "adulti", titolo: "Adulti 18+", testo: "Non è mai troppo tardi.", corso: true }],
      },
    ],
  },
  formule: {
    h2: "LE FORMULE",
    colonne: { perChi: "Per chi", dove: "Dove", formato: "Formato", prenotazione: "Prenotazione" },
    // "Dove" non sta qui: lo calcola la pagina dagli slot di disponibilita.ts.
    righe: [
      {
        id: "corso",
        nome: "Corso",
        perChi: "Bambini 4-12 anni e adulti",
        formato: "Di gruppo",
        cta: "Prenota un corso",
        href: "/prenota?formula=corso",
      },
      {
        id: "privata",
        nome: "Lezione privata",
        perChi: "Tutte le fasce d'età",
        formato: "Singola o di coppia",
        cta: "Prenota una lezione privata",
        href: "/prenota?formula=privata",
      },
      {
        id: "inclusiva",
        nome: "Lezione inclusiva",
        perChi: "Tutte le fasce d'età",
        formato: "Singola o di coppia, solo privata",
        cta: "Prenota una lezione inclusiva",
        href: "/prenota?formula=inclusiva",
      },
    ],
  },
  orari: {
    h2: "ORARI",
    nota: "Gli orari disponibili sono sempre aggiornati in fase di prenotazione.",
    corso: "Corso",
    privata: "Lezioni private",
  },
  sedi: { h2: "LE SEDI" },
  info: [
    {
      id: "attrezzatura",
      titolo: "Attrezzatura",
      testo: "Durante la prenotazione potrai indicare cosa ti serve.",
      immagine: ILLU.attrezzatura,
    },
    {
      id: "pioggia",
      titolo: "Se piove",
      testo: "Se piove a Colle Oppio, la lezione si sposta al The Quiver. Ti avvisiamo via email.",
      immagine: ILLU.pioggia,
    },
  ],
};

/**
 * Pagina /faq. Una domanda con risposta TODO_MATTEO non compare, ne' in pagina
 * ne' nei dati strutturati; una categoria senza domande visibili sparisce.
 * `link`: parte della risposta da trasformare in link interno.
 */
export const faq = {
  h1: "DOMANDE FREQUENTI",
  h1Split: 1,
  testo: "Le risposte rapide prima di salire sulla tavola.",
  categorie: [
    {
      id: "lezioni",
      titolo: "Lezioni",
      immagine: null,
      domande: [
        { d: "Devo saper già andare sullo skate?", r: "No, puoi partire da zero." },
        {
          d: "A che età si può iniziare?",
          r: "I corsi partono dai 4 anni. I ragazzi 13-17 seguono lezioni singole o private.",
        },
        {
          d: "Che differenza c'è tra corso e lezione privata?",
          r: "Il corso è di gruppo, la lezione privata è singola o di coppia.",
        },
        { d: "Fate lezioni inclusive?", r: "Sì, in forma privata, singola o di coppia." },
      ],
    },
    {
      id: "prenotazione",
      titolo: "Prenotazione",
      immagine: ILLU.pioggia,
      domande: [
        { d: "Come prenoto?", r: "Scegli età, formula e data su /prenota.", link: { testo: "/prenota", href: "/prenota" } },
        { d: "Posso prenotare per mio figlio?", r: "Sì. Per i minori prenota il genitore." },
        { d: "Posso disdire?", r: "Sì, dal link nell'email di conferma fino a 3 ore prima." },
        { d: "E se piove?", r: "Le lezioni a Colle Oppio si spostano al The Quiver." },
      ],
    },
    {
      id: "tesseramento",
      titolo: "Tesseramento",
      immagine: ILLU.tessera,
      domande: [
        { d: "Serve la tessera?", r: "Puoi fare una prima lezione di prova, poi serve il tesseramento." },
        { d: "Quanto costa?", r: "30€." },
        { d: "Cosa serve?", r: "Dati, firma, bonifico e certificato medico." },
      ],
    },
    {
      id: "attrezzatura-pagamenti",
      titolo: "Attrezzatura e pagamenti",
      immagine: ILLU.attrezzatura,
      domande: [
        { d: "Cosa devo portare?", r: TODO },
        { d: "Come si paga la lezione?", r: TODO },
        { d: "Quanto costa una lezione?", r: TODO },
      ],
    },
  ],
};
