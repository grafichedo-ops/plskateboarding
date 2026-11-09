// Corso: lezione singola o pacchetto mensile.
//
// Regola (da Edo, 9 novembre 2026): le lezioni che restano nel mese della data
// scelta si pagano a lezione; dal mese dopo scatta il pacchetto mensile.
// Se la data scelta e' la prima lezione del mese, il pacchetto parte subito:
// altrimenti chi inizia a inizio mese pagherebbe tutto il mese a prezzo pieno.
// DA CONFERMARE con Matteo.

import { caricaDisponibilita, type Slot } from "@/lib/prenota/disponibilita";
import { daISO } from "@/lib/prenota/date";
import type { FasciaId } from "@/lib/prenota/regole";

export type Modalita = "singola" | "pacchetto";

export type Pacchetto = {
  /** Lezioni del mese della data scelta, pagate a lezione (data scelta compresa). */
  aLezione: string[];
  /** Mese del pacchetto, "AAAA-MM", e le sue lezioni. */
  mese: string;
  date: string[];
};

/** Stesso corso negli altri giorni: stesso giorno della settimana, orario e sede. */
async function dateDelCorso(anno: number, mese: number, slot: Slot, fascia: FasciaId) {
  const giorni = await caricaDisponibilita(anno, mese, { fascia, formula: "corso" });
  return giorni
    .filter((g) => g.slots.some((s) => s.tipo === "corso" && s.inizio === slot.inizio && s.sede === slot.sede && !s.pieno))
    .map((g) => g.data);
}

export async function calcolaPacchetto(data: string, slot: Slot, fascia: FasciaId): Promise<Pacchetto> {
  const d = daISO(data);
  const dow = d.getDay();
  const stessoGiorno = (iso: string) => daISO(iso).getDay() === dow;

  const questoMese = (await dateDelCorso(d.getFullYear(), d.getMonth(), slot, fascia)).filter(stessoGiorno);
  const daOggi = questoMese.filter((x) => x >= data);
  // Prima lezione del mese: nessuna data dello stesso corso prima di quella scelta.
  if (!questoMese.some((x) => x < data)) {
    return { aLezione: [], mese: data.slice(0, 7), date: daOggi };
  }

  const prossimo = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  const date = (await dateDelCorso(prossimo.getFullYear(), prossimo.getMonth(), slot, fascia)).filter(stessoGiorno);
  return { aLezione: daOggi, mese: `${prossimo.getFullYear()}-${String(prossimo.getMonth() + 1).padStart(2, "0")}`, date };
}
