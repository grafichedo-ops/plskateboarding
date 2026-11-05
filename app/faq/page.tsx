import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Header } from "@/components/header";
import { Boxed } from "@/components/Boxed";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { FooterChiaro } from "@/components/sections/FooterChiaro";
import { PageHero } from "@/components/sections/PageHero";
import { daCompilare, faq, meta } from "@/content/copy";

export const metadata: Metadata = meta.faq;

type Domanda = { d: string; r: string; link?: { testo: string; href: string } };

/** Solo le domande con una risposta vera: le TODO_MATTEO restano nascoste. */
const categorie = faq.categorie
  .map((c) => ({ ...c, domande: (c.domande as Domanda[]).filter((q) => !daCompilare(q.r)) }))
  .filter((c) => c.domande.length > 0);

/** Dati strutturati FAQPage, costruiti dalle stesse domande visibili in pagina. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categorie.flatMap((c) =>
    c.domande.map((q) => ({
      "@type": "Question",
      name: q.d,
      acceptedAnswer: { "@type": "Answer", text: q.r },
    })),
  ),
};

/** La parte `link.testo` della risposta diventa un link interno. */
function Risposta({ q }: { q: Domanda }) {
  if (!q.link || !q.r.includes(q.link.testo)) return <>{q.r}</>;
  const [prima, dopo] = q.r.split(q.link.testo);
  return (
    <>
      {prima}
      <Link href={q.link.href} className="font-semibold underline underline-offset-4">
        {q.link.testo}
      </Link>
      {dopo}
    </>
  );
}

export default function FaqPage() {
  return (
    <>
      <Header trasparente navCentrata boxed />
      <main>
        <PageHero h1={faq.h1} h1Split={faq.h1Split} testo={faq.testo} />

        <section className="w-full bg-[#f7f0de] py-16 lg:py-24">
          <Boxed className="max-w-4xl">
            {/* Indice delle categorie */}
            <nav aria-label="Categorie" className="mb-14">
              <ul className="flex flex-wrap gap-3">
                {categorie.map((c) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      className="btn-press inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold"
                    >
                      {c.titolo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-16">
              {categorie.map((c) => (
                <section key={c.id} id={c.id} aria-labelledby={`${c.id}-titolo`} className="scroll-mt-24">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <h2 id={`${c.id}-titolo`} className="font-display text-3xl leading-tight text-ink md:text-4xl">
                      {c.titolo}
                    </h2>
                    {c.immagine && (
                      // Solo accento visivo.
                      <Image
                        src={c.immagine.src}
                        alt=""
                        width={c.immagine.w}
                        height={c.immagine.h}
                        sizes="96px"
                        className="h-auto w-16 shrink-0 object-contain sm:w-24"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    {c.domande.map((q) => (
                      <details
                        key={q.d}
                        className="group card-hard rounded-[20px] bg-white [&_summary::-webkit-details-marker]:hidden"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[18px] px-6 py-5 font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
                          <span>{q.d}</span>
                          <ChevronDown
                            aria-hidden="true"
                            size={22}
                            className="shrink-0 transition-transform group-open:rotate-180"
                          />
                        </summary>
                        <p className="px-6 pb-6 text-ink/85">
                          <Risposta q={q} />
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Boxed>
        </section>

        <CtaFinale />
      </main>
      <FooterChiaro />
      <script
        type="application/ld+json"
        // JSON generato da testi nostri: nessun input dell'utente.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
