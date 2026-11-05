"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Boxed } from "@/components/Boxed";
import { chiSono } from "@/content/copy";

/**
 * Banner di /chi-sono: un bambino sul rail cresce fino a diventare Matteo,
 * guidato dallo scroll. Stessa tecnica di components/ScrollStage.tsx:
 * - pin CSS (wrapper alto 300vh + pannello sticky), MAI `pin: true` di
 *   ScrollTrigger insieme allo sticky: rompe lo scrub;
 * - ScrollTrigger usato solo come sorgente di progresso;
 * - due trigger: video con scrub lungo (le seek costano), testi con scrub corto.
 *
 * Video crescita-rail-scrub.mp4: 5,04 s, 2036x1016, 24 fps, all-intra (ogni
 * fotogramma e' chiave, quindi la seek in qualunque punto e' economica),
 * senza audio, moov in testa. Il personaggio sta fra il 62% e il 90% della
 * larghezza: la meta' sinistra e' libera per il testo.
 *
 * Layout:
 * - da lg il video copre tutto il pannello e il testo sta a sinistra;
 * - sotto lg il pannello e' una colonna: testo sopra su fondo pieno, video
 *   sotto con object-position spostata a destra. Cosi' il testo non finisce
 *   mai sopra al personaggio.
 *
 * prefers-reduced-motion: niente 300vh ne' scrub (anche il JS esce subito),
 * ultimo fotogramma come immagine e testo definitivo gia' visibile.
 */

/** Inseguimento dello scroll in secondi: stessi valori di ScrollStage. */
const SCRUB = { video: 1.2, testi: 0.4 };

/** Fasi del testo, in frazioni dello scroll del banner. */
const FASI = { seconda: 0.35, finale: 0.7 };

/** Durata di una dissolvenza, in frazioni dello scroll. */
const FADE = 0.05;

/** Spostamento verticale, in px, con cui un testo entra ed esce. */
const DRIFT = 24;

/** Mai "none" sulle comparse: serve una curva, non una rampa lineare. */
const EASE = { enter: "power2.out", exit: "power2.in" };

/**
 * Margine dalla fine del file: una seek esattamente su `duration` su alcuni
 * browser porta il video in stato "ended" e puo' mostrare un fotogramma nero.
 * Mezzo fotogramma a 24 fps.
 */
const MARGINE_FINE = 1 / 48;

/** Dimensioni dei titoli di passaggio e dell'h1: uguali, cosi' il cambio non salta. */
const TITOLO = "font-display text-[2.5rem] leading-[1.05] text-ink min-[390px]:text-5xl md:text-6xl lg:text-7xl";

export function ChiSonoScrollBanner() {
  const { scroll } = chiSono;
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frase0Ref = useRef<HTMLParagraphElement>(null);
  const frase1Ref = useRef<HTMLParagraphElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const videoEl = videoRef.current;
    let ctx: gsap.Context | undefined;
    let annullato = false;
    let attendiMetadati: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (annullato) return;
      gsap.registerPlugin(ScrollTrigger);

      const wrap = wrapRef.current;
      const video = videoEl;
      const [frase0, frase1, finale, cta] = [frase0Ref.current, frase1Ref.current, finaleRef.current, ctaRef.current];
      if (!wrap || !video || !frase0 || !frase1 || !finale || !cta) return;

      ctx = gsap.context(() => {
        const trigger = {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
        };

        // --- Testi: scrub corto, comparse con easing ------------------------
        const tl = gsap.timeline({ scrollTrigger: { ...trigger, scrub: SCRUB.testi } });
        // Ancora: la timeline dura esattamente 1, come lo scroll del banner.
        tl.to({}, { duration: 1 }, 0);

        const uscita = { autoAlpha: 0, y: -DRIFT, duration: FADE, ease: EASE.exit };
        const entrata = { y: 0, duration: FADE, ease: EASE.enter };

        // 0-35%: prima frase. 35-70%: seconda. Ogni uscita finisce dove inizia l'entrata.
        tl.to(frase0, uscita, FASI.seconda - FADE);
        tl.fromTo(frase1, { autoAlpha: 0, y: DRIFT }, { ...entrata, autoAlpha: 1 }, FASI.seconda);
        tl.to(frase1, uscita, FASI.finale - FADE);

        // 70-100%: h1, testo e CTA. h1 e testo usano solo opacity, mai
        // visibility, cosi' gli screen reader li leggono in ogni momento.
        // La CTA usa autoAlpha: con visibility:hidden non si clicca ne' si
        // raggiunge da tastiera finche' non e' visibile.
        tl.fromTo(finale, { opacity: 0, y: DRIFT }, { ...entrata, opacity: 1 }, FASI.finale);
        tl.fromTo(cta, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE, ease: EASE.enter }, FASI.finale + FADE / 2);

        // --- Video: scrub lungo, ease "none" (1:1 con lo scroll) ------------
        const buildVideo = () => {
          const fine = Math.max(0, video.duration - MARGINE_FINE);
          if (!fine) return;
          gsap
            .timeline({ defaults: { ease: "none" }, scrollTrigger: { ...trigger, scrub: SCRUB.video } })
            .fromTo(video, { currentTime: 0 }, { currentTime: fine, duration: 1 }, 0);
        };

        // duration serve per lo scrub: se i metadati non ci sono ancora, aspetta.
        if (video.readyState >= 1) buildVideo();
        else {
          attendiMetadati = () => ctx?.add(buildVideo);
          video.addEventListener("loadedmetadata", attendiMetadati, { once: true });
        }
      }, wrap);
    })();

    return () => {
      annullato = true;
      if (attendiMetadati) videoEl?.removeEventListener("loadedmetadata", attendiMetadati);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      aria-labelledby="chi-sono-titolo"
      className="relative h-[300vh] bg-[#E1A50F] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden motion-reduce:relative lg:block">
        {/* Testo: in colonna sopra al video sotto lg, a sinistra sopra al video da lg. */}
        <div className="relative z-10 shrink-0 pb-6 pt-24 lg:absolute lg:inset-0 lg:flex lg:items-center lg:py-0">
          <Boxed>
            <div className="grid lg:max-w-[44%]">
              <p
                ref={frase0Ref}
                aria-hidden="true"
                className={`${TITOLO} [grid-area:1/1] motion-reduce:hidden`}
              >
                {scroll.frasi[0]}
              </p>
              <p
                ref={frase1Ref}
                aria-hidden="true"
                className={`${TITOLO} invisible opacity-0 [grid-area:1/1] motion-reduce:hidden`}
              >
                {scroll.frasi[1]}
              </p>
              <div ref={finaleRef} className="opacity-0 [grid-area:1/1] motion-reduce:opacity-100">
                <h1 id="chi-sono-titolo" className={`${TITOLO} mb-5`}>
                  {chiSono.h1}
                </h1>
                <p className="mb-7 max-w-prose text-base text-ink sm:text-lg lg:text-xl">{scroll.testo}</p>
                <Link
                  ref={ctaRef}
                  href="/prenota"
                  className="invisible inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white opacity-0 motion-reduce:visible motion-reduce:opacity-100"
                >
                  {chiSono.cta}
                </Link>
              </div>
            </div>
          </Boxed>
        </div>

        {/* Video: sotto lg occupa lo spazio rimasto, da lg tutto il pannello. */}
        <div className="relative min-h-0 flex-1 lg:absolute lg:inset-0">
          <video
            ref={videoRef}
            src={scroll.video}
            poster={scroll.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[90%_50%] motion-reduce:hidden lg:object-[75%_50%]"
          />
          <Image
            src={scroll.finale.src}
            alt=""
            width={scroll.finale.w}
            height={scroll.finale.h}
            sizes="100vw"
            className="absolute inset-0 hidden h-full w-full object-cover object-[90%_50%] motion-reduce:block lg:object-[75%_50%]"
          />
          {/*
            Sotto lg testo e video si toccano: il giallo del video, decodificato
            dal browser, non e' identico a #E1A50F e si vedeva una riga. La
            sfumatura dal colore del pannello nasconde la giunzione.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#E1A50F] to-transparent lg:hidden"
          />
        </div>
      </div>
    </section>
  );
}
