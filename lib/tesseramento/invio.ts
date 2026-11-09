// INVIO SIMULATO: da sostituire con la POST ad Apps Script mantenendo lo stesso
// contratto (`inviaTesseramento`). Vedi CLAUDE.md, sezione Backend.
// - fetch normale con `Content-Type: text/plain`, leggendo la risposta, mai `no-cors`.
// - Certificato e firma vanno salvati PRIVATI (niente setSharing ANYONE_WITH_LINK):
//   il file viaggia come base64 nel corpo della richiesta, non come link pubblico.
// - Riga nel tab "Tesserati", con i dati del genitore se il tesserato e' minorenne.

import type { DatiTesseramento } from "@/lib/tesseramento/dati";

export type EsitoTesseramento = { ok: true; id: string } | { ok: false; motivo: "rete" };

export async function inviaTesseramento(d: DatiTesseramento): Promise<EsitoTesseramento> {
  await new Promise((r) => setTimeout(r, 700));
  const iniziali = (d.tesserato.cognome.slice(0, 3) || "PL").toUpperCase();
  return { ok: true, id: `TS-${iniziali}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` };
}
