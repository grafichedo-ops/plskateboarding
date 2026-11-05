"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Boxed } from "@/components/Boxed";
import { SplitHeading } from "@/components/SplitHeading";
import { hero } from "@/content/copy";

/**
 * Banner di /homepage2: titolo e testo a sinistra, skater a destra che gira la
 * testa seguendo il cursore, logo P&L dietro di lui.
 *
 * I frame vengono da public/video/skater-def-outfit.mp4, con lo sfondo (#c79824)
 * scontornato: WebP trasparenti, quindi la figura poggia sul giallo pieno della
 * sezione e sul logo senza rettangoli di colore diverso.
 *
 * Usati solo i frame 110-241 del sorgente: li' la camera resta a livello occhi
 * e la figura ruota sul posto (da spalle a fronte) mantenendo dimensione e
 * posizione. Nella prima meta' del video la camera sale sopra la testa e la
 * figura si rimpicciolisce e scivola: col mouse sarebbe sembrata instabile.
 *
 * Il mouse verticale non puo' pilotare i frame: il video e' un'orbita singola,
 * non una griglia di pose, quindi non esiste un fotogramma che sia insieme
 * "da sopra" e "da destra". La verticale muove la figura in parallasse.
 *
 * <img> nativo e non next/image perche' l'src cambia a ogni movimento del
 * mouse: l'ottimizzatore aggiungerebbe latenza proprio sullo scambio.
 */

const FRAME_COUNT = 83;

/**
 * Vista frontale (ultimo frame), usata come posa di riposo: e' quella mostrata
 * prima che il mouse entri, su touch e al rientro quando il mouse esce.
 */
const REST_FRAME = FRAME_COUNT - 1;

/**
 * Parallasse verticale: al bordo alto la figura sale di PARALLASSE_Y px e
 * cresce di mezzo PARALLASSE_SCALA, al bordo basso scende e rimpicciolisce
 * dell'altra meta'. Simmetrica attorno allo zero e non da 1.00 a 1.03, se no
 * la posa di riposo (mouse fuori, y = 0) starebbe a 1.015 e la figura farebbe
 * un salto dell'1,5% nel momento in cui il mouse entra nella sezione.
 * Valori piccoli di proposito: e' un accenno di profondita', non un movimento.
 */
const PARALLASSE_Y = 14;
const PARALLASSE_SCALA = 0.03;

/** Durata del rientro al frame frontale quando il mouse esce, in ms. */
const RETURN_MS = 420;

const frameSrc = (i: number) =>
  `/video/skater-orbit-frames/frame-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Posizione orizzontale del mouse (0-1) -> frame.
 * Lineare e non a due tratti come nel banner precedente: li' la posa di riposo
 * stava a meta' sequenza, qui sta a fondo corsa (la vista frontale), quindi
 * bordo sinistro = di spalle, bordo destro = di fronte.
 */
function frameForPointer(p: number) {
  const x = Math.min(1, Math.max(0, p));
  return Math.round(x * (FRAME_COUNT - 1));
}

/** Mette in <strong> le frasi indicate, dove le trova nel testo. */
function conGrassetti(testo: string, frasi: readonly string[]) {
  // Tipo esplicito (stringa o elemento) invece di ReactNode: ReactNode include
  // se stesso come array e manda in confusione l'inferenza su flatMap.
  let parti: (string | React.ReactElement)[] = [testo];
  for (const frase of frasi) {
    const nuove: (string | React.ReactElement)[] = [];
    for (const parte of parti) {
      if (typeof parte !== "string" || !parte.includes(frase)) {
        nuove.push(parte);
        continue;
      }
      const [prima, ...resto] = parte.split(frase);
      nuove.push(
        prima,
        <strong key={frase} className="font-semibold">
          {frase}
        </strong>,
        resto.join(frase)
      );
    }
    parti = nuove;
  }
  return parti;
}

export function HeroSkaterTracker() {
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const frameRef = useRef(REST_FRAME);
  const targetRef = useRef(REST_FRAME);
  /** Offset verticale corrente e voluto, in px. */
  const yRef = useRef(0);
  const yTargetRef = useRef(0);
  /** Il puntatore era dentro al riquadro della sezione al movimento scorso. */
  const dentroRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const returnRafRef = useRef<number | null>(null);
  const preloadRef = useRef<HTMLImageElement[]>([]);

  const [pronto, setPronto] = useState(false);
  const [tracciabile, setTracciabile] = useState(false);

  // Su touch non c'e' un mousemove continuo: niente tracking, testa frontale.
  useEffect(() => {
    setTracciabile(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  useEffect(() => {
    let annullato = false;
    let caricati = 0;
    const immagini: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      // window.Image e non Image: qui Image e' il componente di next/image
      // importato per il logo, che coprirebbe il costruttore del browser.
      const im = new window.Image();
      const fatto = () => {
        caricati += 1;
        if (!annullato && caricati === FRAME_COUNT) setPronto(true);
      };
      im.onload = fatto;
      im.onerror = fatto;
      im.src = frameSrc(i);
      immagini.push(im);
    }
    // I riferimenti restano vivi, se no il browser puo' scartarli dalla cache.
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

  /**
   * y va da -PARALLASSE_Y (mouse in alto) a +PARALLASSE_Y (mouse in basso),
   * ed e' 0 a riposo. La scala e' massima in alto, cosi' salire avvicina la
   * figura, e vale esattamente 1 a y = 0.
   * transform-origin e' il bordo basso (origin-bottom sull'<img>): scalando dal
   * centro lo skate si staccherebbe da terra.
   */
  const applicaParallasse = useCallback((y: number, forza = false) => {
    const img = imgRef.current;
    if (!img) return;
    // Sotto un decimo di pixel non si vede: si evita di riscrivere lo stile a
    // ogni tick. forza serve all'ultimo passo del rientro, che deve azzerare
    // davvero anche se manca poco.
    if (!forza && Math.abs(y - yRef.current) < 0.1) return;
    yRef.current = y;
    const scala = 1 - (PARALLASSE_SCALA / 2) * (y / PARALLASSE_Y);
    img.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scala.toFixed(4)})`;
  }, []);

  // Un solo aggiornamento per tick di rendering, per entrambi gli assi.
  const programmaDisegno = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applicaFrame(targetRef.current);
      applicaParallasse(yTargetRef.current);
    });
  }, [applicaFrame, applicaParallasse]);

  /** Riporta frame e parallasse alla posa di riposo, con easing. */
  const rientra = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const partenzaFrame = frameRef.current;
    const partenzaY = yRef.current;
    if (partenzaFrame === REST_FRAME && partenzaY === 0) return;
    yTargetRef.current = 0;
    const inizio = performance.now();
    const passo = (ora: number) => {
      const t = Math.min(1, (ora - inizio) / RETURN_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      applicaFrame(
        Math.round(partenzaFrame + (REST_FRAME - partenzaFrame) * eased)
      );
      if (t < 1) applicaParallasse(partenzaY * (1 - eased));
      else applicaParallasse(0, true);
      returnRafRef.current = t < 1 ? requestAnimationFrame(passo) : null;
    };
    returnRafRef.current = requestAnimationFrame(passo);
  }, [applicaFrame, applicaParallasse]);

  /**
   * Il movimento si ascolta su window e non con onMouseMove sulla <section>
   * perche' l'header e' fixed e copre la fascia alta del banner: con il
   * listener sull'elemento, salire verso l'alto lo attraversa e fa scattare
   * onMouseLeave: la figura tornava a riposo proprio a meta' corsa verso l'alto.
   * Con il test sul rettangolo, l'header e' parte dell'area tracciata.
   */
  useEffect(() => {
    if (!pronto || !tracciabile) return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dentro =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;

      if (!dentro) {
        if (dentroRef.current) {
          dentroRef.current = false;
          rientra();
        }
        return;
      }

      dentroRef.current = true;
      if (returnRafRef.current !== null) {
        cancelAnimationFrame(returnRafRef.current);
        returnRafRef.current = null;
      }
      targetRef.current = frameForPointer((e.clientX - r.left) / r.width);
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      yTargetRef.current = (py - 0.5) * 2 * PARALLASSE_Y;
      programmaDisegno();
    };

    // Il mouse che esce dalla finestra non produce un mousemove fuori dal
    // riquadro: senza questo la figura resterebbe bloccata nell'ultima posa.
    const onEsceDallaFinestra = () => {
      if (!dentroRef.current) return;
      dentroRef.current = false;
      rientra();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onEsceDallaFinestra);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onEsceDallaFinestra);
    };
  }, [pronto, tracciabile, programmaDisegno, rientra]);

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
      className="relative min-h-screen w-full overflow-hidden bg-mustard"
    >
      {/*
        Logo P&L dietro allo skater, tagliato in alto e a destra come nel
        riferimento. Solo da lg: su schermi stretti finirebbe sotto al titolo
        e ne ridurrebbe la leggibilita'.
      */}
      <Image
        src="/images/logo-background-hero.png"
        alt=""
        aria-hidden="true"
        width={1460}
        height={1346}
        priority
        className="pointer-events-none absolute -right-[8%] -top-[8%] z-0 hidden h-[62vh] w-auto select-none lg:block"
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-center gap-10 pb-10 pt-28 lg:pb-0 lg:pt-16">
        <Boxed>
          <div className="max-w-2xl lg:w-1/2">
          <SplitHeading
            as="h1"
            text={hero.h1}
            split={hero.h1Split}
            className="mb-6 text-5xl md:text-6xl lg:text-7xl"
          />
          <p className="mb-8 max-w-prose text-lg text-ink lg:text-xl">
            {conGrassetti(hero.paragraph, hero.paragraphBold)}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/prenota"
              className="btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href="/#faq"
              className="btn-press rounded-btn bg-white px-6 py-3 font-semibold text-ink"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
          </div>
        </Boxed>

        {/*
          Skater: su desktop ancorato in basso a ~72% della larghezza e alto il
          74% dello schermo, come nel riferimento; su mobile scende sotto al testo.
        */}
        <div className="flex justify-center lg:absolute lg:bottom-[3vh] lg:left-[72%] lg:-translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={frameSrc(REST_FRAME)}
            alt="Skater P&L in piedi sullo skate, gira la testa seguendo il cursore"
            draggable={false}
            className="h-[55vh] w-auto origin-bottom select-none will-change-transform lg:h-[74vh]"
          />
        </div>
      </div>
    </section>
  );
}
