import Image from "next/image";
import { faqIgCollab } from "@/content/copy";

/**
 * Dimensioni reali delle icone dopo il ritaglio sul contenuto.
 * I PNG originali erano quadrati (850/1046/924) ma con il 45-58% di tela
 * trasparente attorno al disegno: il box CSS ingrandiva soprattutto il vuoto,
 * e i tre riempimenti diversi facevano sembrare il punto interrogativo piu'
 * grande della fotocamera. Ritagliati, hanno proporzioni diverse fra loro,
 * quindi vanno dichiarate una per una.
 * Stanno qui e non in content/copy.ts, che resta solo contenuti.
 */
const ICONA: Record<string, { w: number; h: number }> = {
  faq: { w: 371, h: 572 },
  instagram: { w: 472, h: 489 },
  collaborazioni: { w: 516, h: 487 },
};

/** Stop 6 del palcoscenico: lo skater e' uscito, resta solo il rail. */
export function FaqIgCollab() {
  return (
    <div className="flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14">
      <div className="grid w-full gap-6 md:grid-cols-3">
        {faqIgCollab.cards.map((card) => (
          <article
            key={card.id}
            data-anim
            className="card-hard relative z-10 flex flex-col justify-between rounded-card bg-white p-8 min-h-[320px]"
          >
            <div>
              <h3 className="font-display text-2xl mb-4">{card.title}</h3>
              <p className="text-ink/80">{card.description}</p>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <a
                href={`#${card.id}`}
                className="btn-press rounded-btn bg-ink px-5 py-3 text-sm font-semibold text-white"
              >
                {card.cta}
              </a>
              {/* Box quadrato + object-contain: ogni icona riempie il lato
                  piu' lungo, cosi' hanno peso visivo simile pur avendo forme
                  diverse. A 72px dichiarati usciva anche sgranata.
                  Su mobile resta a 80px: li' le tre card impilate sforano gia'
                  l'altezza del pannello, ingrandire peggiorerebbe il taglio. */}
              <Image
                src={card.icon}
                alt=""
                aria-hidden="true"
                width={ICONA[card.id]?.w ?? 400}
                height={ICONA[card.id]?.h ?? 400}
                className="h-20 w-20 shrink-0 object-contain object-bottom md:h-32 md:w-32 lg:h-44 lg:w-44"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
