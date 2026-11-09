"use client";

import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

export type Intestazione = { bianco: string; nero: string; testo: string };

/**
 * Cornice dei moduli a passaggi (/prenota, /tesseramento): intestazione mustard
 * con "N di M" e uscita, contenuto, barra in basso con indietro e Continua.
 * La logica (passaggi, validazione, invio) resta nel wizard.
 */
export function ModuloShell({
  intestazione,
  step,
  totale,
  titoloRef,
  onUscita,
  etichettaUscita,
  indietro,
  avanti,
  children,
}: {
  intestazione: Intestazione;
  step: number;
  totale: number;
  titoloRef: React.RefObject<HTMLHeadingElement>;
  /** Sui link verso il sito: puo' fermare la navigazione e chiedere conferma. */
  onUscita: (e: React.MouseEvent) => void;
  /** Es. "Esci dalla prenotazione". */
  etichettaUscita: string;
  /** null al primo passaggio: il pulsante torna al sito. */
  indietro: { onClick: () => void; disabled?: boolean } | null;
  avanti: { etichetta: string; onClick: () => void; disabled: boolean; busy?: boolean };
  children: React.ReactNode;
}) {
  // Oltre l'ultimo passaggio c'e' la schermata finale: niente contatore ne' barra.
  const inCorso = step <= totale;
  return (
    <main className="flex min-h-dvh flex-col bg-[#f7f0de] text-ink">
      <header className="border-b-2 border-ink bg-mustard">
        <div className="mx-auto w-full max-w-2xl px-4 pb-5 pt-5 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" onClick={onUscita} className="font-display text-lg uppercase">
              P&amp;L Skateboarding
            </Link>
            {inCorso && (
              <div className="flex items-center gap-3">
                <span
                  aria-label={`Passaggio ${step} di ${totale}`}
                  className="rounded-full border-2 border-ink bg-white px-3 py-0.5 text-xs font-bold"
                >
                  {step} di {totale}
                </span>
                <Link
                  href="/"
                  onClick={onUscita}
                  aria-label={etichettaUscita}
                  className="btn-press flex h-10 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold"
                >
                  <X aria-hidden="true" size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Esci</span>
                </Link>
              </div>
            )}
          </div>
          <h1 ref={titoloRef} tabIndex={-1} className="mt-3 font-display text-3xl leading-tight outline-none md:text-4xl">
            <span className="text-white">{intestazione.bianco}</span> {intestazione.nero}
          </h1>
          <p className="mt-1 text-sm">{intestazione.testo}</p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6">{children}</section>

      {inCorso && (
        <footer className="sticky bottom-0 border-t-2 border-ink bg-white">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4 md:px-6">
            {indietro === null ? (
              <Link
                href="/"
                onClick={onUscita}
                aria-label="Torna al sito"
                className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white"
              >
                <ArrowLeft size={20} />
              </Link>
            ) : (
              <button
                type="button"
                aria-label="Passaggio precedente"
                disabled={indietro.disabled}
                onClick={indietro.onClick}
                className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white disabled:opacity-40"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button
              type="button"
              disabled={avanti.disabled}
              onClick={avanti.onClick}
              aria-busy={avanti.busy}
              className="rounded-btn bg-ink px-8 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {avanti.etichetta}
            </button>
          </div>
        </footer>
      )}
    </main>
  );
}
