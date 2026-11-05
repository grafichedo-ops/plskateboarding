"use client";

import { useEffect, useRef } from "react";

/**
 * Conferma prima di lasciare la prenotazione.
 * <dialog> nativo con showModal(): focus intrappolato, Esc per chiudere
 * e resto della pagina inerte senza librerie.
 */
export function EsciDialog({
  aperto,
  onResta,
  onEsci,
}: {
  aperto: boolean;
  onResta: () => void;
  onEsci: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aperto && !d.open) d.showModal();
    if (!aperto && d.open) d.close();
  }, [aperto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="esci-titolo"
      aria-describedby="esci-testo"
      // Esc chiude il dialog da solo: riallinea lo stato di React.
      onClose={onResta}
      // Clic sullo sfondo (fuori dal riquadro) = resta.
      onClick={(e) => e.target === e.currentTarget && onResta()}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-card border-2 border-ink bg-[#f7f0de] p-0 text-ink shadow-hard-lg backdrop:bg-ink/60"
    >
      <div className="p-6">
        <h2 id="esci-titolo" className="font-display text-2xl uppercase">
          Sei sicuro/a di uscire?
        </h2>
        <p id="esci-testo" className="mt-2 text-sm">
          La prenotazione non è ancora confermata: se esci, le scelte fatte finora andranno perse.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onEsci}
            className="btn-press rounded-btn bg-white px-5 py-3 font-semibold"
          >
            Esci
          </button>
          {/* autoFocus: l'azione sicura e' quella selezionata di partenza. */}
          <button
            type="button"
            autoFocus
            onClick={onResta}
            className="btn-press rounded-btn bg-ink px-5 py-3 font-semibold text-white"
          >
            Continua a prenotare
          </button>
        </div>
      </div>
    </dialog>
  );
}
