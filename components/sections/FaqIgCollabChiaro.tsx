import Image from "next/image";
import { Rivela } from "@/components/Rivela";
import { Boxed } from "@/components/Boxed";
import { faqIgCollab } from "@/content/copy";

/**
 * Sesta sezione di /homepage2: tre card su fondo mustard.
 *
 * Diversa dalla FaqIgCollab della homepage: li' le card sono .card-hard (bordo
 * nero 2px + ombra dura), qui hanno l'ombra morbida del riferimento, come le
 * card del carosello di questa pagina.
 *
 * L'icona sta in absolute in basso a destra e non nel flusso: cosi' puo' essere
 * grande quanto nel riferimento senza spingere in basso la CTA, che resta
 * ancorata in basso a sinistra.
 */

/**
 * Dimensioni reali delle icone dopo il ritaglio sul contenuto: hanno proporzioni
 * diverse fra loro (371x572, 472x489, 516x487), quindi vanno dichiarate una per
 * una o next/image calcola un aspect ratio sbagliato.
 */
const ICONA: Record<string, { w: number; h: number }> = {
  faq: { w: 371, h: 572 },
  instagram: { w: 472, h: 489 },
  collaborazioni: { w: 516, h: 487 },
};

export function FaqIgCollabChiaro() {
  return (
    <section id="faq" className="w-full bg-mustard py-20 lg:py-24">
      <Boxed>
        <Rivela className="grid gap-8 md:grid-cols-3 lg:gap-10">
          {faqIgCollab.cards.map((card) => (
            <article
              key={card.id}
              className="relative flex min-h-[320px] flex-col rounded-[20px] bg-white p-7 shadow-[0_10px_34px_rgba(20,20,20,0.12)]"
            >
              <h3 className="mb-4 font-display text-2xl text-ink">
                {card.title}
              </h3>
              <p className="mb-6 max-w-[88%] text-sm leading-relaxed text-ink/75">
                {card.description}
              </p>

              {/* mt-auto: la CTA resta in basso anche se le descrizioni hanno
                  lunghezze diverse e le card si allineano in altezza. */}
              <a
                href={`#${card.id}`}
                className="mt-auto inline-block self-start btn-press rounded-btn bg-ink px-6 py-2.5 text-sm font-semibold text-white"
              >
                {card.cta}
              </a>

              {/* Riquadro quadrato + object-contain: ogni icona riempie il lato
                  piu' lungo, cosi' hanno peso visivo simile pur avendo forme
                  diverse. */}
              <Image
                src={card.icon}
                alt=""
                aria-hidden="true"
                width={ICONA[card.id]?.w ?? 400}
                height={ICONA[card.id]?.h ?? 400}
                className="pointer-events-none absolute bottom-5 right-5 h-[110px] w-[110px] select-none object-contain object-bottom lg:h-[140px] lg:w-[140px]"
              />
            </article>
          ))}
        </Rivela>
      </Boxed>
    </section>
  );
}
