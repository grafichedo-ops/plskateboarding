// Step 4: dati del partecipante, del genitore (se minore), attrezzatura e note.
// Nessun campo su allergie o salute, per scelta: vedi CLAUDE.md.

import type { FasciaId, FormatoId } from "@/lib/prenota/regole";

export type Persona = { nome: string; cognome: string };
export type Contatti = { email: string; telefono: string };
export type Prestito = "ho" | "prestito";

export type DatiPrenotazione = {
  partecipanti: Persona[];
  /** Solo se il partecipante e' minorenne. */
  genitore: { nome: string; cognome: string } & Contatti;
  /** Contatti del partecipante adulto. */
  contatti: Contatti;
  tavola: Prestito | null;
  protezioni: Prestito | null;
  note: string;
};

export const personaVuota = (): Persona => ({ nome: "", cognome: "" });

export const datiVuoti = (): DatiPrenotazione => ({
  partecipanti: [personaVuota()],
  genitore: { nome: "", cognome: "", email: "", telefono: "" },
  contatti: { email: "", telefono: "" },
  tavola: null,
  protezioni: null,
  note: "",
});

export const NOTE_MAX = 500;

export const isMinore = (fascia: FasciaId) => fascia !== "adulti";

/** Il numero di partecipanti dipende dal formato: coppia = 2. */
export function quantiPartecipanti(formato: FormatoId | null) {
  return formato === "coppia" ? 2 : 1;
}

export type Errori = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Accetta +39, spazi, trattini e punti; servono almeno 8 cifre.
const TELEFONO = /^\+?[\d\s.\-()]{8,20}$/;

function obbligatorio(err: Errori, chiave: string, valore: string, messaggio: string) {
  if (!valore.trim()) err[chiave] = messaggio;
}

function validaContatti(err: Errori, prefisso: string, c: Contatti) {
  if (!c.email.trim()) err[`${prefisso}.email`] = "Inserisci l'email.";
  else if (!EMAIL.test(c.email.trim())) err[`${prefisso}.email`] = "L'email non sembra corretta.";
  const cifre = c.telefono.replace(/\D/g, "");
  if (!c.telefono.trim()) err[`${prefisso}.telefono`] = "Inserisci il numero di telefono.";
  else if (!TELEFONO.test(c.telefono.trim()) || cifre.length < 8)
    err[`${prefisso}.telefono`] = "Il numero di telefono non sembra corretto.";
}

/**
 * Restituisce gli errori per chiave di campo (es. "p0.nome", "genitore.email").
 * L'eta' non si chiede: fa fede la fascia scelta al passaggio 1.
 */
export function validaDati(d: DatiPrenotazione, fascia: FasciaId): Errori {
  const err: Errori = {};

  d.partecipanti.forEach((p, i) => {
    const k = `p${i}`;
    obbligatorio(err, `${k}.nome`, p.nome, "Inserisci il nome.");
    obbligatorio(err, `${k}.cognome`, p.cognome, "Inserisci il cognome.");
    // Stesso ordine del modulo: i contatti dell'adulto stanno nel blocco del primo partecipante.
    if (i === 0 && !isMinore(fascia)) validaContatti(err, "contatti", d.contatti);
  });

  if (isMinore(fascia)) {
    obbligatorio(err, "genitore.nome", d.genitore.nome, "Inserisci il nome del genitore.");
    obbligatorio(err, "genitore.cognome", d.genitore.cognome, "Inserisci il cognome del genitore.");
    validaContatti(err, "genitore", d.genitore);
  }

  if (!d.tavola) err.tavola = "Indica se hai già una tavola.";
  if (!d.protezioni) err.protezioni = "Indica se hai già casco e protezioni.";
  if (d.note.length > NOTE_MAX) err.note = `Massimo ${NOTE_MAX} caratteri.`;

  return err;
}
