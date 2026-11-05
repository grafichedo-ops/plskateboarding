// DATI DI PROVA: da sostituire con la GET ad Apps Script mantenendo lo stesso
// contratto (`caricaDisponibilita`). Il calendario non sa da dove arrivano.

import type { FasciaId, FormulaId } from "@/lib/prenota/regole";

export type Slot = {
  id: string;
  inizio: string;
  fine: string;
  sede: string;
  tipo: "corso" | "privata";
  pieno: boolean;
};

export type StatoGiorno = "disponibile" | "corso" | "assenza" | "chiuso";

export type Giorno = { data: string; stato: StatoGiorno; slots: Slot[] };

type Modello = {
  dow: number;
  inizio: string;
  fine: string;
  sede: string;
  tipo: Slot["tipo"];
  fasce?: FasciaId[];
  /** Assunzione non ancora confermata (CLAUDE.md): prenotabile, ma non pubblicata negli orari. */
  daConfermare?: boolean;
};

const QUIVER = "The Quiver";
const COLLE = "Colle Oppio";

// dow: 0 domenica ... 6 sabato
const SETTIMANA: Modello[] = [
  { dow: 1, inizio: "10:00", fine: "11:00", sede: COLLE, tipo: "privata" },
  { dow: 3, inizio: "10:00", fine: "11:00", sede: COLLE, tipo: "privata" },
  { dow: 5, inizio: "14:00", fine: "15:00", sede: COLLE, tipo: "privata" },
  { dow: 5, inizio: "15:00", fine: "16:00", sede: COLLE, tipo: "privata" },
  { dow: 3, inizio: "17:00", fine: "18:00", sede: QUIVER, tipo: "corso", fasce: ["4-6"] },
  { dow: 3, inizio: "18:00", fine: "19:00", sede: QUIVER, tipo: "corso", fasce: ["7-12"] },
  { dow: 3, inizio: "19:00", fine: "20:00", sede: QUIVER, tipo: "privata", daConfermare: true },
  { dow: 4, inizio: "17:00", fine: "18:00", sede: QUIVER, tipo: "corso", fasce: ["4-6"] },
  { dow: 4, inizio: "18:00", fine: "19:00", sede: QUIVER, tipo: "corso", fasce: ["7-12"] },
  { dow: 4, inizio: "19:00", fine: "20:00", sede: QUIVER, tipo: "corso", fasce: ["adulti"] },
  { dow: 5, inizio: "17:00", fine: "18:00", sede: QUIVER, tipo: "corso", fasce: ["4-6"] },
  { dow: 5, inizio: "18:00", fine: "19:00", sede: QUIVER, tipo: "corso", fasce: ["7-12"] },
  { dow: 5, inizio: "19:00", fine: "20:00", sede: QUIVER, tipo: "corso", fasce: ["adulti"] },
];

export function isoDi(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const g = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${g}`;
}

function traGiorni(base: Date, n: number) {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + n);
}

/** Prossima data, da `base` + `min` giorni, che cade nel giorno della settimana `dow`. */
function prossimo(base: Date, min: number, dow: number) {
  const d = traGiorni(base, min);
  return traGiorni(d, (dow - d.getDay() + 7) % 7);
}

function perSelezione(s: Pick<Modello, "tipo" | "fasce">, fascia: FasciaId, formula: FormulaId) {
  if (s.tipo === "corso") return formula !== "inclusiva" && !!s.fasce?.includes(fascia);
  return formula !== "corso";
}

export async function caricaDisponibilita(
  anno: number,
  mese: number,
  selezione: { fascia: FasciaId; formula: FormulaId }
): Promise<Giorno[]> {
  await new Promise((r) => setTimeout(r, 350));

  const oggi = new Date();
  // Esempi degli stati che arriveranno dallo Sheet.
  const assenza = isoDi(prossimo(oggi, 7, 5));
  const pieno = isoDi(prossimo(oggi, 1, 4));
  const apertura = isoDi(prossimo(oggi, 7, 6));

  const giorni: Giorno[] = [];
  const totale = new Date(anno, mese + 1, 0).getDate();
  for (let g = 1; g <= totale; g++) {
    const data = new Date(anno, mese, g);
    const iso = isoDi(data);
    const modelli: Modello[] = SETTIMANA.filter((s) => s.dow === data.getDay());
    if (iso === apertura) modelli.push({ dow: 6, inizio: "11:00", fine: "12:00", sede: COLLE, tipo: "privata" });

    const slots: Slot[] = modelli
      .filter((s) => perSelezione(s, selezione.fascia, selezione.formula))
      .map((s) => ({
        id: `${iso}-${s.inizio}-${s.tipo}`,
        inizio: s.inizio,
        fine: s.fine,
        sede: s.sede,
        tipo: s.tipo,
        pieno: iso === pieno && s.inizio === "18:00",
      }));

    if (iso === assenza && slots.length) giorni.push({ data: iso, stato: "assenza", slots: [] });
    else if (!slots.length) giorni.push({ data: iso, stato: "chiuso", slots: [] });
    else giorni.push({ data: iso, stato: slots.some((s) => s.tipo === "corso") ? "corso" : "disponibile", slots });
  }
  return giorni;
}

const NOMI_GIORNO = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

export type FasciaOraria = { inizio: string; fine: string; tipo: Slot["tipo"]; fasce?: FasciaId[] };

/**
 * Orario settimanale pubblico (pagina /corsi-e-lezioni), dalla stessa
 * SETTIMANA del calendario: niente dati duplicati. Esclude gli slot da
 * confermare e unisce fasce consecutive identiche (Ven 14-15 e 15-16 -> 14-16).
 */
export function orarioSettimanale() {
  const sedi = [...new Set(SETTIMANA.map((s) => s.sede))];
  return sedi.map((sede) => {
    const delSito = SETTIMANA.filter((s) => s.sede === sede && !s.daConfermare);
    const giorni = [...new Set(delSito.map((s) => s.dow))].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
    return {
      sede,
      giorni: giorni.map((dow) => {
        const fasce: FasciaOraria[] = [];
        for (const s of delSito.filter((x) => x.dow === dow).sort((a, b) => a.inizio.localeCompare(b.inizio))) {
          const prec = fasce[fasce.length - 1];
          if (prec && prec.fine === s.inizio && prec.tipo === s.tipo && String(prec.fasce) === String(s.fasce)) prec.fine = s.fine;
          else fasce.push({ inizio: s.inizio, fine: s.fine, tipo: s.tipo, fasce: s.fasce });
        }
        return { dow, nome: NOMI_GIORNO[dow], fasce };
      }),
    };
  });
}

/** Sedi in cui si svolge una formula, dagli stessi slot (esclusi quelli da confermare). */
export function sediPer(tipo: Slot["tipo"]) {
  return [...new Set(SETTIMANA.filter((s) => s.tipo === tipo && !s.daConfermare).map((s) => s.sede))];
}
