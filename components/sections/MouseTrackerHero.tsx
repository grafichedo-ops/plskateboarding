"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Banner con "mouse tracker": lo skater gira la testa seguendo la posizione
 * orizzontale del cursore. Corpo fermo, e' una sequenza di frame estratti da
 * public/video/head-turn-source.mp4 a 15fps.
 *
 * Perche' WebP e non PNG: gli stessi 61 frame pesavano 19,9 MB in PNG
 * (326 KB l'uno) e ne pesano 1,56 MB in WebP (25 KB l'uno), a parita' di resa
 * su un'illustrazione a campiture piatte. Con la sequenza precaricata tutta
 * all'avvio, 20 MB non erano proponibili.
 *
 * Perche' <img> e non next/image: qui l'src cambia a ogni movimento del mouse.
 * next/image riscriverebbe ogni richiesta attraverso l'ottimizzatore,
 * aggiungendo latenza proprio dove serve lo scambio immediato.
 */

const FRAME_COUNT = 61;

/**
 * Frame con la testa frontale, usato come riposo e come centro della mappatura.
 * NON e' il frame di mezzo: misurato sul sorgente, l'escursione e' asimmetrica
 * (parte da tre quarti sinistro e arriva appena oltre il frontale), quindi il
 * centro geometrico della sequenza cadrebbe ancora girato a sinistra.
 */
const REST_FRAME = 39;

/** Durata del rientro al frame di riposo quando il mouse esce, in ms. */
const RETURN_MS = 420;

const frameSrc = (i: number) =>
  `/video/head-turn-frames/frame-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Posizione del mouse (0 = bordo sinistro, 1 = destro) -> indice del frame.
 * Due tratti invece di uno solo: cosi' il centro del banner corrisponde alla
 * testa frontale anche se i frame prima e dopo non sono in egual numero.
 */
function frameForPointer(p: number) {
  const x = Math.min(1, Math.max(0, p));
  return x <= 0.5
    ? Math.round((x / 0.5) * REST_FRAME)
    : Math.round(
        REST_FRAME + ((x - 0.5) / 0.5) * (FRAME_COUNT - 1 - REST_FRAME)
      );
}

export function MouseTrackerHero() {
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const frameRef = useRef(REST_FRAME);
  const targetRef = useRef(REST_FRAME);
  const rafRef = useRef<number | null>(null);
  const returnRafRef = useRef<number | null>(null);
  const preloadRef = useRef<HTMLImageElement[]>([]);

  const [pronto, setPronto] = useState(false);
  const [tracciabile, setTracciabile] = useState(false);

  // Solo puntatori veri: su touch non esiste un mousemove continuo, quindi
  // niente tracking forzato, resta il frame frontale statico.
  useEffect(() => {
    setTracciabile(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  // Precarica tutta la sequenza. Gli oggetti Image restano referenziati cosi'
  // il browser non li scarta dalla cache prima dell'uso.
  useEffect(() => {
    let annullato = false;
    let caricati = 0;
    const immagini: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const im = new Image();
      const fatto = () => {
        caricati += 1;
        if (!annullato && caricati === FRAME_COUNT) setPronto(true);
      };
      im.onload = fatto;
      im.onerror = fatto;
      im.src = frameSrc(i);
      immagini.push(im);
    }
    preloadRef.current = immagini;

    return () => {
      annullato = true;
    };
  }, []);

  const applicaFrame = useCallback((i: number) => {
    const img = imgRef.current;
    if (!img || i === frameRef.current) return;
    frameRef.current = i;
    img.src = frameSrc(i);
  }, []);

  // Un solo aggiornamento per tick di rendering: i mousemove arrivano molto
  // piu' fitti dei frame che lo schermo puo' mostrare.
  const programmaDisegno = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applicaFrame(targetRef.current);
    });
  }, [applicaFrame]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!pronto) return;
      const el = containerRef.current;
      if (!el) return;
      if (returnRafRef.current !== null) {
        cancelAnimationFrame(returnRafRef.current);
        returnRafRef.current = null;
      }
      const r = el.getBoundingClientRect();
      targetRef.current = frameForPointer((e.clientX - r.left) / r.width);
      programmaDisegno();
    },
    [pronto, programmaDisegno]
  );

  const onMouseLeave = useCallback(() => {
    if (!pronto) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const partenza = frameRef.current;
    if (partenza === REST_FRAME) return;
    const inizio = performance.now();

    const passo = (ora: number) => {
      const t = Math.min(1, (ora - inizio) / RETURN_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      applicaFrame(Math.round(partenza + (REST_FRAME - partenza) * eased));
      returnRafRef.current = t < 1 ? requestAnimationFrame(passo) : null;
    };
    returnRafRef.current = requestAnimationFrame(passo);
  }, [pronto, applicaFrame]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (returnRafRef.current !== null)
        cancelAnimationFrame(returnRafRef.current);
    },
    []
  );

  return (
    <section
      ref={containerRef}
      onMouseMove={tracciabile ? onMouseMove : undefined}
      onMouseLeave={tracciabile ? onMouseLeave : undefined}
      className="relative min-h-screen w-full overflow-hidden bg-mustard"
    >
      {/*
        object-cover e non contain: il fondo dei frame e' #d19e1b mentre la
        sezione e' #d8a800, quindi una banda vuota mostrerebbe lo stacco fra i
        due gialli. Riempiendo sempre il contenitore il bordo non puo' comparire.
        eslint-disable: qui serve un <img> nativo, vedi nota in testa al file.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={frameSrc(REST_FRAME)}
        alt="Skater P&L in piedi sullo skate davanti al logo, gira la testa seguendo il cursore"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* Finche' la sequenza non e' pronta resta il frame frontale, senza
          tracking: si segnala solo che sta caricando. */}
      <div
        aria-live="polite"
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2 rounded-btn bg-ink/80 px-4 py-2 text-sm text-white transition-opacity duration-300",
          pronto ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        Caricamento…
      </div>
    </section>
  );
}
