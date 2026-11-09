// INVIO SIMULATO: da sostituire con la POST ad Apps Script mantenendo lo stesso
// contratto (`inviaPrenotazione`). Vedi CLAUDE.md, sezione Backend:
// fetch normale con `Content-Type: text/plain`, leggendo la risposta, mai `no-cors`.
// Il backend ricontrolla il posto sotto LockService: se nel frattempo e' finito
// risponde "pieno" e il wizard rimanda al calendario.

import type { DatiPrenotazione } from "@/lib/prenota/dati";
import type { Modalita, Pacchetto } from "@/lib/prenota/pacchetto";
import type { FasciaId, FormatoId, FormulaId } from "@/lib/prenota/regole";

export type Prenotazione = {
  fascia: FasciaId;
  formula: FormulaId;
  formato: FormatoId | null;
  data: string;
  slotId: string;
  /** Solo per i corsi: lezione singola o pacchetto mensile. */
  modalita: Modalita | null;
  /** Date a lezione nel mese in corso e date del pacchetto: il backend le prenota tutte. */
  pacchetto: Pacchetto | null;
  dati: DatiPrenotazione;
  privacy: true;
};

export type EsitoInvio = { ok: true; id: string } | { ok: false; motivo: "pieno" | "rete" };

export async function inviaPrenotazione(p: Prenotazione): Promise<EsitoInvio> {
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, id: `PL-${p.data.replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` };
}
