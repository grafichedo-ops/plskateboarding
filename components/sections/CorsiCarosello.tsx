"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { corsiCarosello } from "@/content/copy";

/**
 * Dimensioni reali dei PNG: i tre puppet NON hanno la stessa tela
 * (474x702, 504x688, 476x728). Dichiararle uguali faceva calcolare a
 * next/image un aspect ratio sbagliato per due card su tre.
 * Stanno qui e non in content/copy.ts, che resta solo testi.
 */
const PUPPET: Record<string, { w: number; h: number }> = {
  bambini: { w: 474, h: 702 },
  ragazzi: { w: 504, h: 688 },
  adulti: { w: 476, h: 728 },
};

/** Stop 3 del palcoscenico: skater a meta' rail, dietro alle card. */
export function CorsiCarosello() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card?.offsetWidth ?? 360;
    track.scrollBy({ left: direction * (cardWidth + 48), behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      // Sfumatura laterale: va tolta sul lato dove lo scroll e' finito, se no
      // la prima (e l'ultima) card sembrerebbe slavata senza motivo.
      // Tolleranza 8px e non 1: con snap-mandatory + px-1 il binario si ferma
      // a scrollLeft=4 anche sulla prima card, e la sfumatura sinistra si
      // accendeva pur non essendoci nulla di tagliato a sinistra.
      const SOGLIA = 8;
      const atStart = track.scrollLeft <= SOGLIA;
      const atEnd =
        track.scrollLeft >= track.scrollWidth - track.clientWidth - SOGLIA;
      track.style.setProperty("--fade-l", atStart ? "0px" : "var(--fade)");
      track.style.setProperty("--fade-r", atEnd ? "0px" : "var(--fade)");

      // Profondita': piena solo la card quasi interamente dentro al binario.
      // Calcolo geometrico e non IntersectionObserver: la sezione nasce con
      // visibility:hidden (e' lo stop 3 del palcoscenico) e l'osservatore
      // non riemetteva quando tornava visibile, lasciando tutte le card al 45%.
      const bounds = track.getBoundingClientRect();
      track.querySelectorAll("[data-card]").forEach((card) => {
        const r = card.getBoundingClientRect();
        const visibile =
          Math.min(r.right, bounds.right) - Math.max(r.left, bounds.left);
        card.toggleAttribute("data-active", visibile / r.width >= 0.9);
      });
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14">
      <div className="w-full">
        <h2 className="font-display text-4xl md:text-6xl mb-10 max-w-2xl">
          {corsiCarosello.h1}
        </h2>

        {/*
          pt-20: spazio in cui la testa dei puppet sborda sopra la card.
          Serve perche' overflow-x:auto porta overflow-y a `auto`, quindi
          senza questo padding il binario taglierebbe la sporgenza.
        */}
        <div
          ref={trackRef}
          className="carousel-fade relative z-10 flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 pt-20 pb-6 md:gap-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {corsiCarosello.cards.map((card) => (
            <article
              key={card.id}
              data-card
              className="carousel-card card-hard relative snap-start shrink-0 w-[85vw] sm:w-[560px] rounded-card bg-white p-8"
            >
              {/*
                max-w vincolata: e' la larghezza che tiene il testo fuori
                dalla colonna occupata dal puppet in absolute qui sotto.
                Se la cambi, ricontrolla che non ci finisca sotto.
              */}
              <div className="relative z-10 max-w-[56%] sm:max-w-[240px]">
                <h3 className="font-display text-2xl mb-3">{card.title}</h3>
                <p className="text-ink/80 mb-6">{card.description}</p>
                <div className="flex gap-3">
                  <a
                    href={`#${card.id}-corsi`}
                    className="btn-press rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-white"
                  >
                    {card.ctaPrimary}
                  </a>
                  <a
                    href={`#${card.id}-lezioni`}
                    className="btn-press rounded-btn bg-white px-5 py-3 text-sm font-semibold text-ink"
                  >
                    {card.ctaSecondary}
                  </a>
                </div>
              </div>

              {/*
                Frame 3: piedi a filo del bordo basso, testa che buca il bordo alto.
                bottom-0 right-0 ancora al padding box della card, cioe' al filo
                interno del bordo nero di .card-hard.
                I PNG hanno 0px di trasparenza sotto (i piedi toccano la tela) ma
                44-88px sopra: per questo l'altezza eccede di 70px invece dei ~30
                di sporgenza voluta, se no sopra la card uscirebbe solo il vuoto.
                Su mobile la card e' stretta e alta: li' il puppet e' dimensionato
                in larghezza e resta dentro, se no coprirebbe la descrizione.
              */}
              <Image
                src={card.image}
                alt=""
                aria-hidden="true"
                width={PUPPET[card.id]?.w ?? 474}
                height={PUPPET[card.id]?.h ?? 702}
                className="pointer-events-none absolute bottom-0 right-0 z-0 w-[38%] select-none object-contain object-bottom sm:h-[calc(100%+70px)] sm:w-auto sm:max-w-[265px]"
              />
            </article>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Card precedente"
            className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Card successiva"
            className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
