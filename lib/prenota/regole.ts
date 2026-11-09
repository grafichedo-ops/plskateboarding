// Regole del flusso di prenotazione. Il calendario le ricevera' dal backend:
// qui resta solo cio' che decide quali scelte mostrare.

export type FasciaId = "4-6" | "7-12" | "13-17" | "adulti";
export type FormulaId = "corso" | "privata" | "inclusiva";
export type FormatoId = "singola" | "coppia";

export const FASCE: {
  id: FasciaId;
  titolo: string;
  eta: string;
  descrizione: string;
  immagine: string;
}[] = [
  { id: "4-6", titolo: "Bambini", eta: "4-6 anni", descrizione: "primi passi in sicurezza", immagine: "/images/puppet-kids-m.png" },
  { id: "7-12", titolo: "Bambini", eta: "7-12 anni", descrizione: "basi e confidenza sulla tavola", immagine: "/images/puppet-teen-m.png" },
  { id: "13-17", titolo: "Ragazzi", eta: "13-17 anni", descrizione: "tecnica, equilibrio e stile", immagine: "/images/puppet-boy-busto.png" },
  { id: "adulti", titolo: "Adulti", eta: "18+", descrizione: "inizia o perfeziona la tecnica", immagine: "/images/puppet-adult-m.png" },
];

export const FORMULE: { id: FormulaId; titolo: string; descrizione: string; serveFormato: boolean }[] = [
  { id: "corso", titolo: "Corso", descrizione: "Lezione di gruppo con i giorni fissi al Quiver.", serveFormato: false },
  { id: "privata", titolo: "Lezione privata", descrizione: "Solo tu, o in coppia, con l'istruttore.", serveFormato: true },
  { id: "inclusiva", titolo: "Lezione inclusiva", descrizione: "Percorso dedicato, solo in forma privata.", serveFormato: true },
];

export const FORMATI: { id: FormatoId; titolo: string }[] = [
  { id: "singola", titolo: "Singola" },
  { id: "coppia", titolo: "Coppia" },
];

/** La fascia 13-17 non ha corsi: solo lezioni private e inclusive. */
export function formulePer(fascia: FasciaId | null) {
  return FORMULE.filter((f) => f.id !== "corso" || fascia !== "13-17");
}

export function fasciaValida(v?: string): FasciaId | null {
  return FASCE.find((f) => f.id === v)?.id ?? null;
}

export function formulaValida(v: string | undefined, fascia: FasciaId | null): FormulaId | null {
  return formulePer(fascia).find((f) => f.id === v)?.id ?? null;
}

export const SEDI: Record<string, { indirizzo: string; nota?: string }> = {
  "The Quiver": { indirizzo: "Via Alessandro Severo 209, Garbatella, Roma" },
  "Colle Oppio": {
    indirizzo: "Parco di Colle Oppio, Roma",
    nota: "Se piove la lezione si sposta al Quiver, in Via Alessandro Severo 209.",
  },
};

/**
 * Prezzi: null finche' Matteo non li comunica, e il riepilogo mostra
 * "da definire" invece di un numero inventato.
 * Corso: 20 euro a lezione (da Edo, 9 novembre 2026).
 */
const PREZZI: Record<string, number | null> = {
  corso: 20,
  "privata-singola": null,
  "privata-coppia": null,
  "inclusiva-singola": null,
  "inclusiva-coppia": null,
};

export function prezzo(formula: FormulaId, formato: FormatoId | null): number | null {
  return PREZZI[formula === "corso" ? "corso" : `${formula}-${formato}`] ?? null;
}

/** Pacchetto mensile del corso: prezzo pieno barrato e prezzo scontato (da Edo, 9 novembre 2026). */
export const PACCHETTO_MENSILE = { listino: 80, prezzo: 60 };
