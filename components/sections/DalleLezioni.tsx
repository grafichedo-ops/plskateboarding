import { ArrowUpRight, Quote } from "lucide-react";
import { Boxed } from "@/components/Boxed";
import { Rivela } from "@/components/Rivela";
import { dalleLezioni } from "@/content/copy";

/**
 * "Cosa succede in lezione": tre frasi vere dai reel di @pushandlearn, in card
 * testuali .card-hard. Niente frame o video incorporati: il link porta al reel.
 */
export function DalleLezioni() {
  return (
    <section id="dalle-lezioni" className="w-full bg-[#f7f0de] py-20 lg:py-24">
      <Boxed>
        <Rivela>
          <h2 className="mb-12 font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
            {dalleLezioni.h2}
          </h2>
        </Rivela>
        <Rivela ritardo={120}>
          <ul className="grid gap-8 md:grid-cols-3">
            {dalleLezioni.cards.map((c) => (
              <li key={c.href} className="card-hard flex flex-col rounded-[20px] bg-white p-7">
                <Quote aria-hidden="true" size={28} className="mb-4 fill-mustard text-mustard" />
                <p className="mb-8 font-display text-2xl leading-snug text-ink">“{c.frase}”</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 self-start font-semibold text-ink underline underline-offset-4 hover:text-ink/70"
                >
                  {dalleLezioni.linkLabel}
                  <span className="sr-only">
                    {" "}“{c.frase}” su Instagram (si apre in una nuova scheda)
                  </span>
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              </li>
            ))}
          </ul>
        </Rivela>
      </Boxed>
    </section>
  );
}
