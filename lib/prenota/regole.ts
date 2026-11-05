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
  { id: "7-12", titolo: "Bambini", eta: "7-12 anni", descrizione: "basi e confidenza sulla tavola", immagine: "/images/puppet-kids-m.png" },
  { id: "13-17", titolo: "Ragazzi", eta: "13-17 anni", descrizione: "tecnica, equilibrio e stile", immagine: "/images/puppet-teen-m.png" },
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
