"use client";

import { useCallback, useEffect, useRef } from "react";
import { Check, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

const ALTEZZA = 170;
const INCHIOSTRO = "#141414";

/**
 * Firma su canvas con Pointer Events (dito, penna e mouse).
 * - touch-action: none, cosi' firmando non scorre la pagina.
 * - Salva un PNG (data URL) a fine tratto; se il riquadro cambia larghezza
 *   (rotazione del telefono) ridisegna la firma salvata invece di perderla.
 * - Non e' usabile da tastiera: il modulo offre l'alternativa "firmo di persona".
 */
export function Firma({
  id,
  valore,
  onCambia,
  errore,
  etichetta,
  descrittoDa,
}: {
  id: string;
  valore: string | null;
  onCambia: (png: string | null) => void;
  errore?: boolean;
  etichetta: string;
  descrittoDa?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const disegnando = useRef(false);
  const tracciato = useRef(false);
  const valoreRef = useRef(valore);
  valoreRef.current = valore;

  const prepara = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    if (!w || c.width === Math.round(w * dpr)) return;
    c.width = Math.round(w * dpr);
    c.height = Math.round(ALTEZZA * dpr);
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INCHIOSTRO;
    // Ridimensionare il canvas lo svuota: rimette la firma gia' fatta.
    const salvata = valoreRef.current;
    if (salvata) {
      const img = new window.Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, ALTEZZA);
      img.src = salvata;
    }
  }, []);

  useEffect(() => {
    prepara();
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(prepara);
    ro.observe(c);
    return () => ro.disconnect();
  }, [prepara]);

  const punto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  const inizia = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = e.currentTarget.getContext("2d")!;
    const [x, y] = punto(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Un tocco senza movimento lascia comunque un punto.
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    disegnando.current = true;
    tracciato.current = true;
  };

  const muovi = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!disegnando.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    // Eventi uniti dal browser: piu' punti per un tratto piu' liscio.
    const eventi = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const r = e.currentTarget.getBoundingClientRect();
    for (const ev of eventi) ctx.lineTo(ev.clientX - r.left, ev.clientY - r.top);
    ctx.stroke();
  };

  const finisci = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!disegnando.current) return;
    disegnando.current = false;
    if (tracciato.current) onCambia(e.currentTarget.toDataURL("image/png"));
  };

  const cancella = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    tracciato.current = false;
    onCambia(null);
  };

  return (
    <div>
      <div
        className={cn(
          "relative overflow-hidden rounded-card border-2 border-dashed border-ink bg-white",
          errore && "border-red-700 bg-red-50",
        )}
      >
        <canvas
          ref={canvasRef}
          id={id}
          role="img"
          // Focus da codice sul primo errore; non e' raggiungibile con Tab.
          tabIndex={-1}
          aria-label={etichetta}
          aria-describedby={descrittoDa}
          onPointerDown={inizia}
          onPointerMove={muovi}
          onPointerUp={finisci}
          onPointerCancel={finisci}
          style={{ height: ALTEZZA }}
          className="block w-full cursor-crosshair touch-none"
        />
        {!valore && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-4 border-t border-ink/30 pt-1 text-xs text-ink/50">
            Firma qui
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p aria-live="polite" className="flex items-center gap-1.5 text-sm font-semibold">
          {valore && (
            <>
              <Check aria-hidden="true" size={16} className="text-green-700" /> Firma inserita
            </>
          )}
        </p>
        <button
          type="button"
          onClick={cancella}
          disabled={!valore}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold underline underline-offset-4 disabled:opacity-40"
        >
          <Eraser aria-hidden="true" size={16} /> Cancella firma
        </button>
      </div>
    </div>
  );
}
