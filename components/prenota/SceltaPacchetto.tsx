"use client";

import { useEffect, useRef, useState } from "react";
import { SceltaCard } from "@/components/modulo/SceltaCard";
import { dataEstesa, daISO } from "@/lib/prenota/date";
import type { Slot } from "@/lib/prenota/disponibilita";
import { calcolaPacchetto, type Modalita, type Pacchetto } from "@/lib/prenota/pacchetto";
import { PACCHETTO_MENSILE, prezzo, type FasciaId } from "@/lib/prenota/regole";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0 });
const nomeMese = new Intl.DateTimeFormat("it-IT", { month: "long" });
const giornoSettimana = new Intl.DateTimeFormat("it-IT", { weekday: "long" });

export const formattaEuro = (n: number) => euro.format(n);

/** "11, 18 e 25 novembre" (stesso mese) */
export function elencoGiorni(date: string[]) {
  if (!date.length) return "";
  const giorni = date.map((d) => String(daISO(d).getDate()));
  const lista = giorni.length > 1 ? `${giorni.slice(0, -1).join(", ")} e ${giorni[giorni.length - 1]}` : giorni[0];
  return `${lista} ${nomeMese.format(daISO(date[0]))}`;
}

export const meseDi = (aaaamm: string) => nomeMese.format(daISO(`${aaaamm}-01`));

/** Prezzo pieno barrato, letto dagli screen reader come "invece di". */
export function PrezzoPacchetto() {
  return (
    <>
      <strong>{euro.format(PACCHETTO_MENSILE.prezzo)} al mese</strong>{" "}
      <s aria-hidden="true" className="text-ink/60">
        {euro.format(PACCHETTO_MENSILE.listino)}
      </s>
      <span className="sr-only">invece di {euro.format(PACCHETTO_MENSILE.listino)}</span>
    </>
  );
}

/** Righe del pacchetto: lezioni a prezzo pieno nel mese in corso, poi il pacchetto. */
export function RecapPacchetto({ p }: { p: Pacchetto }) {
  const singola = prezzo("corso", null) ?? 0;
  return (
    <span className="mt-2 block space-y-1.5 text-sm">
      {p.aLezione.length > 0 && (
        <span className="block">
          <span className="font-semibold">A {meseDi(p.aLezione[0].slice(0, 7))}, a lezione:</span> {elencoGiorni(p.aLezione)} ·{" "}
          {p.aLezione.length} × {euro.format(singola)} = {euro.format(p.aLezione.length * singola)}
        </span>
      )}
      <span className="block">
        <span className="font-semibold">
          {p.aLezione.length ? `Da ${meseDi(p.mese)}, pacchetto:` : `Pacchetto di ${meseDi(p.mese)}:`}
        </span>{" "}
        {p.date.length ? elencoGiorni(p.date) : "date in arrivo"} · <PrezzoPacchetto />
      </span>
    </span>
  );
}

/**
 * Dopo un orario di corso: lezione singola o pacchetto mensile.
 * <dialog> nativo con showModal(): focus intrappolato, Esc = annulla.
 */
export function SceltaPacchetto({
  slot,
  data,
  fascia,
  iniziale,
  onConferma,
  onAnnulla,
}: {
  /** null = chiusa */
  slot: Slot | null;
  data: string | null;
  fascia: FasciaId;
  iniziale: Modalita | null;
  onConferma: (modalita: Modalita, pacchetto: Pacchetto | null) => void;
  onAnnulla: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [scelta, setScelta] = useState<Modalita | null>(iniziale);
  const [pacchetto, setPacchetto] = useState<Pacchetto | null>(null);
  const [errore, setErrore] = useState(false);
  const aperta = !!slot && !!data;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aperta && !d.open) d.showModal();
    if (!aperta && d.open) d.close();
  }, [aperta]);

  useEffect(() => {
    if (!slot || !data) return;
    let attivo = true;
    setScelta(iniziale);
    setPacchetto(null);
    setErrore(false);
    calcolaPacchetto(data, slot, fascia)
      .then((p) => attivo && setPacchetto(p))
      .catch(() => attivo && setErrore(true));
    return () => {
      attivo = false;
    };
  }, [slot, data, fascia, iniziale]);

  const singola = prezzo("corso", null);
  const pronta = scelta === "singola" || (scelta === "pacchetto" && !!pacchetto);

  return (
    <dialog
      ref={ref}
      aria-labelledby="pacchetto-titolo"
      aria-describedby="pacchetto-testo"
      onClose={onAnnulla}
      onClick={(e) => e.target === e.currentTarget && onAnnulla()}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-card border-2 border-ink bg-[#f7f0de] p-0 text-ink shadow-hard-lg backdrop:bg-ink/60"
    >
      {slot && data && (
        <div className="p-5 sm:p-6">
          <h2 id="pacchetto-titolo" className="font-display text-2xl uppercase leading-tight">
            Un giorno solo o tutto il mese?
          </h2>
          <p id="pacchetto-testo" className="mt-1 text-sm">
            Corso del {giornoSettimana.format(daISO(data))} alle {slot.inizio}, {slot.sede}.
          </p>

          <fieldset className="mt-5 grid gap-3">
            <legend className="sr-only">Come vuoi prenotare</legend>
            <SceltaCard name="modalita" value="singola" scelta={scelta === "singola"} onScegli={() => setScelta("singola")}>
              <span className="pr-14">
                <span className="block font-display text-lg">Solo questo giorno</span>
                <span className="block text-sm">
                  {dataEstesa(data)} · <strong>{singola === null ? "prezzo da definire" : euro.format(singola)}</strong>
                </span>
              </span>
            </SceltaCard>
            <SceltaCard name="modalita" value="pacchetto" scelta={scelta === "pacchetto"} onScegli={() => setScelta("pacchetto")}>
              <span className="pr-14">
                <span className="block font-display text-lg">Pacchetto mensile</span>
                {pacchetto ? (
                  <RecapPacchetto p={pacchetto} />
                ) : errore ? (
                  <span className="mt-1 block text-sm text-red-700">Non riusciamo a calcolare le date. Riprova tra poco.</span>
                ) : (
                  <span className="mt-1 block text-sm text-ink/70" aria-live="polite">
                    Calcolo le date…
                  </span>
                )}
              </span>
            </SceltaCard>
          </fieldset>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onAnnulla} className="btn-press rounded-btn bg-white px-5 py-3 font-semibold">
              Annulla
            </button>
            <button
              type="button"
              disabled={!pronta}
              onClick={() => scelta && onConferma(scelta, scelta === "pacchetto" ? pacchetto : null)}
              className="rounded-btn bg-ink px-5 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Conferma
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
