// Testi definitivi homepage P&L Skateboarding
// Fonte: PL-Skateboarding-Copy.md — aggiorna qui, non nei componenti.

export const hero = {
  h1: "LEZIONI E CORSI DI SKATE A ROMA",
  // parole iniziali in bianco nel titolo (vedi frame 1 del mockup)
  h1Split: 4,
  paragraph:
    "Impariamo lo skateboard con un metodo pensato per ogni età e livello. Lezioni individuali e corsi di gruppo a Roma, in sicurezza e senza fretta: si parte da dove sei tu.",
  // frasi del paragrafo da mettere in grassetto (vedi banner di /homepage2).
  // Campo strutturale come h1Split: nessuna parola del testo cambia.
  paragraphBold: ["Impariamo lo skateboard", "Lezioni individuali e corsi di gruppo a Roma"],
  ctaPrimary: "Prenota Ora",
  ctaSecondary: "Richiedi Info",
};

export const chiSiamo = {
  h1: "SKATEBOARD A ROMA EDUCATIVO E INCLUSIVO",
  h1Split: 3, // frame 2
  // Indici delle parole in giallo nella variante chiara di /homepage2:
  // "SKATEBOARD A ROMA" (0,1,2) e la "E" (4) in mustard, il resto in nero.
  // Campo strutturale come h1Split: nessuna parola del testo cambia.
  h1Accent: [0, 1, 2, 4],
  paragraph:
    "Creiamo un percorso individualizzato che parte dai tuoi punti di forza. Non ti lasciamo mai sola/o: ti seguiamo passo dopo passo, con il metodo delle assistenze per ridurre al minimo il rischio di caduta e costruire fiducia nelle tue capacità.",
  cta: "Chi siamo",
};

export const corsiCarosello = {
  h1: "LEZIONI SKATE PER TUTTE LE ETÀ",
  h1Split: 3, // frame 3
  cards: [
    {
      id: "bambini-4-6",
      fascia: "4-6",
      title: "Skate per bambini 4-6",
      description:
        "I primi passi sulla tavola: giochiamo con l'equilibrio e la caduta controllata, per far nascere la passione in totale sicurezza.",
      ctaPrimary: "Corsi",
      ctaSecondary: "Lezioni",
      image: "/images/puppet-kids-m.png",
    },
    {
      id: "bambini-7-12",
      fascia: "7-12",
      title: "Skate per bambini 7-12",
      description:
        "Un percorso su misura per prendere confidenza con la tavola e costruire le basi, con il ritmo giusto per ogni bambino.",
      ctaPrimary: "Corsi",
      ctaSecondary: "Lezioni",
      image: "/images/puppet-kids-m.png",
    },
    {
      id: "ragazzi",
      fascia: "13-17",
      title: "Skate per ragazzi 13-17",
      description:
        "Tecnica, progressione e primi trick, in lezioni singole e private seguite da chi lo skate lo vive ogni giorno.",
      ctaPrimary: "Corsi",
      ctaSecondary: "Lezioni",
      image: "/images/puppet-teen-m.png",
    },
    {
      id: "adulti",
      fascia: "adulti",
      title: "Skate per adulti",
      description:
        "Non è mai troppo tardi per iniziare. Lezioni pensate per chi parte da zero o vuole riprendere in mano l'equilibrio, senza pressione e senza paragoni.",
      ctaPrimary: "Corsi",
      ctaSecondary: "Lezioni",
      image: "/images/puppet-adult-m.png",
    },
  ],
};

export const doveFacciamo = {
  h1: "DOVE FACCIAMO LEZIONI A ROMA",
  h1Split: 3, // frame 4
  paragraph:
    "Creiamo un percorso individualizzato sfruttando i punti di forza di ogni allievo, in diversi punti della città.",
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
  // CTA della sezione, presente nel riferimento di /homepage2 ma finora
  // assente qui: stessa etichetta gia' usata in nav.cta e hero.ctaPrimary.
  cta: "Prenota Ora",
};

export const tesseramento = {
  h1: "TESSERATI ORA CON PUSH AND LEARN",
  h1Split: 3, // frame 5
  benefits: [
    {
      title: "Metodo su misura",
      description:
        "Un percorso costruito sulle tue capacità, senza confronti e senza fretta.",
    },
    {
      title: "Assistenza costante",
      description:
        "Non skati mai da sola/o: un istruttore ti segue in ogni fase dell'apprendimento.",
    },
    {
      title: "Accesso a tutte le sedi",
      description:
        "Prenota lezioni e corsi in tutte le location P&L a Roma.",
    },
    {
      title: "Community P&L",
      description:
        "Entri a far parte di un gruppo che skata, cresce e si allena insieme.",
    },
  ],
  priceLabel: "*Prezzo annuale",
  price: "30€",
  cta: "Tesserati",
};

export const faqIgCollab = {
  cards: [
    {
      id: "faq",
      title: "F.A.Q.",
      description:
        "Hai dubbi su corsi, orari o attrezzatura? Trovi qui le risposte alle domande più frequenti, prima di iniziare.",
      cta: "Apri",
      icon: "/images/icon-faq.png",
    },
    {
      id: "instagram",
      title: "Instagram",
      description:
        "Allenamenti, trick e community: seguici per non perderti quello che succede su rail e street a Roma.",
      cta: "Seguici",
      icon: "/images/icon-instagram.png",
    },
    {
      id: "collaborazioni",
      title: "Collaborazioni",
      description:
        "Negozi, associazioni, spazi urbani: se vuoi costruire qualcosa insieme a P&L, scrivici la tua idea.",
      cta: "Scrivici",
      icon: "/images/icon-collab.png",
    },
  ],
};

export const nav = {
  logo: "P&L Skateboarding",
  links: [
    { label: "Chi siamo", href: "/#chi-siamo" },
    { label: "Corsi e Lezioni", href: "/#corsi" },
    { label: "Sedi e Orari", href: "/#dove-facciamo" },
    { label: "Tesseramenti", href: "/tesseramento" },
    { label: "F.A.Q.", href: "/#faq" },
  ],
  cta: "Prenota Ora",
};

// Footer: struttura provvisoria, contenuti da confermare
// (indirizzi già noti da doveFacciamo, resto da definire).
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
      links: [{ label: "Instagram", href: "#" }],
    },
  ],
  copyright: `© ${new Date().getFullYear()} P&L Skateboarding — Tutti i diritti riservati`,
};
