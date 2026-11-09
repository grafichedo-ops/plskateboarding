// Dati del tesseramento online. Diverso da Savages (vedi CLAUDE.md): i minori
// si possono tesserare, con dati e firma di un genitore o tutore.

export type PerChi = "me" | "minore";
export type Contatti = { email: string; telefono: string };

export type Anagrafica = {
  nome: string;
  cognome: string;
  /** AAAA-MM-GG, dal campo data. */
  nascita: string;
  luogoNascita: string;
  codiceFiscale: string;
  indirizzo: string;
  cap: string;
  comune: string;
};

export type Genitore = { nome: string; cognome: string; codiceFiscale: string } & Contatti;

export type Certificato = "ora" | "dopo";
export type Immagini = "si" | "no";

export type DatiTesseramento = {
  perChi: PerChi | null;
  tesserato: Anagrafica;
  /** Contatti del tesserato maggiorenne. */
  contatti: Contatti;
  /** Solo se il tesserato e' minorenne. */
  genitore: Genitore;
  certificato: Certificato | null;
  fileCertificato: File | null;
  statuto: boolean;
  privacy: boolean;
  immagini: Immagini | null;
  /** PNG in data URL, oppure null. */
  firma: string | null;
  /** Alternativa alla firma sul dispositivo (accessibilita'): si firma alla prima lezione. */
  firmaDiPersona: boolean;
};

export const datiVuoti = (): DatiTesseramento => ({
  perChi: null,
  tesserato: { nome: "", cognome: "", nascita: "", luogoNascita: "", codiceFiscale: "", indirizzo: "", cap: "", comune: "" },
  contatti: { email: "", telefono: "" },
  genitore: { nome: "", cognome: "", codiceFiscale: "", email: "", telefono: "" },
  certificato: null,
  fileCertificato: null,
  statuto: false,
  privacy: false,
  immagini: null,
  firma: null,
  firmaDiPersona: false,
});

export type Errori = Record<string, string>;

export const CERTIFICATO_TIPI = ["application/pdf", "image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
export const CERTIFICATO_MAX_MB = 10;

/** Eta' compiuta a una certa data (oggi di default). */
export function eta(nascitaISO: string, oggi = new Date()) {
  const [a, m, g] = nascitaISO.split("-").map(Number);
  if (!a || !m || !g) return null;
  let anni = oggi.getFullYear() - a;
  if (oggi.getMonth() + 1 < m || (oggi.getMonth() + 1 === m && oggi.getDate() < g)) anni -= 1;
  return anni;
}

// --- Codice fiscale ---------------------------------------------------------

const CF = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;
// Valori dei caratteri in posizione dispari (1a, 3a, ...): tabella ufficiale.
const DISPARI: Record<string, number> = {
  "0": 1, "1": 0, "2": 5, "3": 7, "4": 9, "5": 13, "6": 15, "7": 17, "8": 19, "9": 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21, K: 2, L: 4, M: 18,
  N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14, U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
};

export const normalizzaCF = (v: string) => v.replace(/\s/g, "").toUpperCase();

/** Formato e carattere di controllo (accetta anche i codici con omocodia). */
export function cfValido(valore: string) {
  const cf = normalizzaCF(valore);
  if (!CF.test(cf)) return false;
  let somma = 0;
  for (let i = 0; i < 15; i++) {
    const c = cf[i];
    // Posizioni pari: cifre 0-9 e lettere A=0 ... Z=25.
    somma += i % 2 === 0 ? DISPARI[c] : /\d/.test(c) ? Number(c) : c.charCodeAt(0) - 65;
  }
  return String.fromCharCode(65 + (somma % 26)) === cf[15];
}

// --- Validazione per passaggio ----------------------------------------------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^\+?[\d\s.\-()]{8,20}$/;

function obbligatorio(err: Errori, chiave: string, valore: string, messaggio: string) {
  if (!valore.trim()) err[chiave] = messaggio;
}

function validaContatti(err: Errori, prefisso: string, c: Contatti) {
  if (!c.email.trim()) err[`${prefisso}.email`] = "Inserisci l'email.";
  else if (!EMAIL.test(c.email.trim())) err[`${prefisso}.email`] = "L'email non sembra corretta.";
  if (!c.telefono.trim()) err[`${prefisso}.telefono`] = "Inserisci il numero di cellulare.";
  else if (!TELEFONO.test(c.telefono.trim()) || c.telefono.replace(/\D/g, "").length < 8)
    err[`${prefisso}.telefono`] = "Il numero non sembra corretto.";
}

function validaCF(err: Errori, chiave: string, valore: string) {
  if (!valore.trim()) err[chiave] = "Inserisci il codice fiscale.";
  else if (!cfValido(valore)) err[chiave] = "Il codice fiscale non è corretto: controlla lettere e numeri.";
}

/** Passaggio 2: anagrafica del tesserato, contatti o genitore. Chiavi nell'ordine del modulo. */
export function validaAnagrafica(d: DatiTesseramento, oggi = new Date()): Errori {
  const err: Errori = {};
  const t = d.tesserato;
  const minore = d.perChi === "minore";
  obbligatorio(err, "t.nome", t.nome, "Inserisci il nome.");
  obbligatorio(err, "t.cognome", t.cognome, "Inserisci il cognome.");

  const anni = t.nascita ? eta(t.nascita, oggi) : null;
  if (!t.nascita) err["t.nascita"] = "Inserisci la data di nascita.";
  else if (anni === null || anni < 0 || anni > 110) err["t.nascita"] = "La data di nascita non sembra corretta.";
  else if (!minore && anni < 18)
    err["t.nascita"] = "Risulta minorenne: torna al passaggio 1 e scegli «Per mio figlio o mia figlia».";
  else if (minore && anni >= 18) err["t.nascita"] = "Risulta maggiorenne: torna al passaggio 1 e scegli «Per me».";

  obbligatorio(err, "t.luogoNascita", t.luogoNascita, "Inserisci il comune (o lo Stato) di nascita.");
  validaCF(err, "t.codiceFiscale", t.codiceFiscale);
  obbligatorio(err, "t.indirizzo", t.indirizzo, "Inserisci l'indirizzo di residenza.");
  if (!t.cap.trim()) err["t.cap"] = "Inserisci il CAP.";
  else if (!/^\d{5}$/.test(t.cap.trim())) err["t.cap"] = "Il CAP ha 5 cifre.";
  obbligatorio(err, "t.comune", t.comune, "Inserisci il comune di residenza.");

  if (!minore) validaContatti(err, "contatti", d.contatti);
  else {
    obbligatorio(err, "g.nome", d.genitore.nome, "Inserisci il nome del genitore.");
    obbligatorio(err, "g.cognome", d.genitore.cognome, "Inserisci il cognome del genitore.");
    validaCF(err, "g.codiceFiscale", d.genitore.codiceFiscale);
    if (!err["g.codiceFiscale"] && normalizzaCF(d.genitore.codiceFiscale) === normalizzaCF(t.codiceFiscale))
      err["g.codiceFiscale"] = "È uguale a quello del tesserato: serve il codice fiscale del genitore.";
    validaContatti(err, "g", d.genitore);
  }
  return err;
}

/** Errore sul file del certificato, oppure null. */
export function erroreFile(f: File | null) {
  if (!f) return "Carica il certificato, oppure scegli «Lo mando dopo».";
  if (f.type && !CERTIFICATO_TIPI.includes(f.type)) return "Formato non supportato: usa PDF, JPG o PNG.";
  if (f.size > CERTIFICATO_MAX_MB * 1024 * 1024) return `Il file supera i ${CERTIFICATO_MAX_MB} MB.`;
  return null;
}

/** Passaggio 3: certificato medico. */
export function validaCertificato(d: DatiTesseramento): Errori {
  const err: Errori = {};
  if (!d.certificato) err.certificato = "Scegli se caricarlo ora o mandarlo dopo.";
  else if (d.certificato === "ora") {
    const e = erroreFile(d.fileCertificato);
    if (e) err.file = e;
  }
  return err;
}

/** Passaggio 4: consensi e firma. */
export function validaConsensi(d: DatiTesseramento): Errori {
  const err: Errori = {};
  if (!d.statuto) err.statuto = "Per tesserarti serve accettare statuto e regolamento.";
  if (!d.privacy) err.privacy = "Serve il consenso al trattamento dei dati.";
  if (!d.immagini) err.immagini = "Scegli sì o no.";
  if (!d.firma && !d.firmaDiPersona) err.firma = "Firma nel riquadro, oppure scegli di firmare di persona.";
  return err;
}
