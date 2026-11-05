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
  ctaSecondary: "Scopri il metodo",
  ctaSecondaryHref: "/chi-sono#metodo",
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
    },
    {
      name: "Colle Oppio",
      address: "Skatepark di Colle Oppio, di fronte al Colosseo",
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
  },
  inclusive: {
    titolo: "LEZIONI INCLUSIVE",
    testo: "Un percorso privato, singolo o di coppia, costruito sulle capacità di ogni persona.",
    cta: { label: "Prenota una lezione inclusiva", href: "/prenota?formula=inclusiva" },
    // null = placeholder "Immagine da inserire". Sostituire con { src, alt, w, h }.
    immagine: null,
  },
  compleanni: {
    titolo: "FESTA DI COMPLEANNO SUGLI SKATE",
    testo:
      "Una festa per bambini tra giochi, equilibrio e prime spinte sulla tavola. Scrivimi e organizziamo insieme la giornata.",
    cta: daCompilare(CONTATTO_COMPLEANNI)
      ? { label: "Scrivimi su Instagram", href: INSTAGRAM_URL }
      : { label: "Contattami", href: CONTATTO_COMPLEANNI },
    immagine: null,
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
      cta: "Apri",
      // Destinazione ancora da definire: resta l'ancora interna.
      href: "#faq",
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
      cta: "Scrivici",
      // Destinazione ancora da definire: resta l'ancora interna.
      href: "#collaborazioni",
      icon: "/images/icon-collab.png",
    },
  ],
};

export const chiSono = {
  h1: "CIAO, SONO MATTEO",
  h1Split: 1, // "CIAO," in bianco
  intro:
    "Insegno skateboard con un approccio educativo e inclusivo, a persone di tutte le età e di tutti i livelli.",
  cta: "Prenota la tua lezione",
  metodo: {
    h2: "IL METODO PUSH AND LEARN",
    blocchi: [
      {
        titolo: "Si parte da te",
        testo: "Ogni percorso parte dai tuoi punti di forza ed è costruito sulle tue capacità, senza confronti.",
      },
      {
        titolo: "Non sei mai da solo",
        testo:
          "Con il metodo delle assistenze ti seguo passo dopo passo, per ridurre il rischio di caduta e costruire fiducia sulla tavola.",
      },
      {
        titolo: "Si impara senza fretta",
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
    { label: "Corsi e Lezioni", href: "/#corsi" },
    { label: "Sedi e Orari", href: "/#dove-facciamo" },
    { label: "Tesseramenti", href: "/tesseramento" },
    { label: "F.A.Q.", href: "/#faq" },
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
        href: "/#dove-facciamo",
      })),
    },
    {
      title: "Social",
      links: [{ label: "Instagram", href: INSTAGRAM_URL }],
    },
  ],
  copyright: `© ${new Date().getFullYear()} P&L Skateboarding — Tutti i diritti riservati`,
};
