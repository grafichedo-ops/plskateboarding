"use client";

import Image from "next/image";
import Link from "next/link";
import { Rivela } from "@/components/Rivela";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Boxed } from "@/components/Boxed";
import { corsiCarosello } from "@/content/copy";

/**
 * Terza sezione di /homepage2: carosello dei corsi su fondo crema.
 *
 * Diversa dalla CorsiCarosello della homepage: li' le card sono .card-hard
 * (bordo nero 2px + ombra dura) sul mustard, qui hanno un'ombra morbida su
 * fondo chiaro, come nel riferimento. Niente maschera sfumata ai lati: serviva
 * a lasciar intravedere il video del palcoscenico, che qui non c'e'.
 */

/** #f7f0de: il crema caldo del riferimento. */
const FONDO = "#f7f0de";

/**
 * Dimensioni reali dei PNG: i tre puppet NON hanno la stessa tela
 * (474x702, 504x688, 476x728). Dichiararle uguali farebbe calcolare a
 * next/image un aspect ratio sbagliato per due card su tre.
 */
const PUPPET: Record<string, { w: number; h: number }> = {
  "/images/puppet-kids-m.png": { w: 474, h: 702 },
  "/images/puppet-teen-m.png": { w: 504, h: 688 },
  "/images/puppet-adult-m.png": { w: 476, h: 728 },
};

/** Di quanto la testa del puppet sborda sopra il bordo alto della card. */
const SPORGENZA = 80;

export function CorsiCaroselloChiaro() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card?.offsetWidth ?? 640;
    track.scrollBy({ left: direction * (cardWidth + 32), behavior: "smooth" });
  };

  return (
    <section
      id="corsi"
      className="w-full scroll-mt-20 py-20 lg:py-24"
      style={{ backgroundColor: FONDO }}
    >
      <Boxed>
        <Rivela>
        <h2 className="mb-12 max-w-2xl font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
        {corsiCarosello.h1}
      </h2>
        </Rivela>

      {/*
        pt: lo spazio in cui la testa dei puppet sborda sopra la card. Serve
        perche' overflow-x:auto porta overflow-y a `auto`, quindi senza questo
        padding il binario taglierebbe la sporgenza.
      */}
      <Rivela ritardo={120}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth px-1 pb-6 pt-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {corsiCarosello.cards.map((card) => (
          <article
            key={card.id}
            data-card
            className="relative w-[85vw] shrink-0 snap-start rounded-[20px] bg-white p-8 shadow-[0_10px_34px_rgba(20,20,20,0.10)] sm:w-[660px]"
          >
            {/* max-w vincolata: tiene il testo fuori dalla colonna del puppet. */}
            <div className="relative z-10 max-w-[56%] sm:max-w-[340px]">
              <h3 className="mb-3 font-display text-2xl text-ink">
                {card.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-ink/75">
                {card.description}
              </p>
              <div className="flex gap-3">
                {card.fascia !== "13-17" && (
                  <Link
                    href={`/prenota?fascia=${card.fascia}&formula=corso`}
                    className="btn-press rounded-btn bg-ink px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    {card.ctaPrimary}
                  </Link>
                )}
                <Link
                  href={`/prenota?fascia=${card.fascia}&formula=privata`}
                  className="btn-press rounded-btn bg-white px-6 py-2.5 text-sm font-semibold text-ink"
                >
                  {card.ctaSecondary}
                </Link>
              </div>
            </div>

            {/*
              Puppet ancorato al bordo basso della card (i PNG hanno 0px di
              trasparenza sotto, quindi i piedi cadono esattamente sul bordo) e
              alto quanto la card piu' la sporgenza, cosi' la testa esce sopra.
              Su mobile la card e' stretta e alta: li' e' dimensionato in
              larghezza e resta dentro, se no coprirebbe la descrizione.
            */}
            <Image
              src={card.image}
              alt=""
              aria-hidden="true"
              width={PUPPET[card.image]?.w ?? 474}
              height={PUPPET[card.image]?.h ?? 702}
              className="pointer-events-none absolute bottom-0 right-4 z-0 w-[36%] select-none object-contain object-bottom sm:w-auto sm:max-w-[240px]"
              style={{ height: `calc(100% + ${SPORGENZA}px)` }}
            />
          </article>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Card precedente"
          className="btn-press flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Card successiva"
          className="btn-press flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink"
        >
          <ArrowRight size={22} />
        </button>
        </div>
      </Rivela>
      </Boxed>
    </section>
  );
}
