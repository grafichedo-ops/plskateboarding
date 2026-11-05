import Image from "next/image";
import Link from "next/link";
import { Rivela } from "@/components/Rivela";
import { Check } from "lucide-react";
import { Boxed } from "@/components/Boxed";
import { SplitHeading } from "@/components/SplitHeading";
import { tesseramento } from "@/content/copy";

/**
 * Quinta sezione di /homepage2: vantaggi del tesseramento, su fondo chiaro.
 *
 * Il "30€" gigante sta DIETRO alla foto (z minore): nel riferimento le gambe
 * del bambino e dell'istruttore passano davanti alle cifre. La foto ha il
 * contenuto a filo dei bordi destro e inferiore della tela, quindi ancorandola
 * in basso a destra si taglia da sola sul bordo della sezione.
 *
 * Il titolo usa lo stesso taglio della homepage (h1Split = 3), ma con accento
 * mustard invece che bianco: su questo fondo il bianco sparirebbe.
 */

/** #f4f4f4: lo stesso grigio chiarissimo della sezione "Chi siamo". */
const FONDO = "#f4f4f4";

export function TesseramentoChiaro() {
  return (
    <section
      className="relative w-full overflow-hidden py-20 lg:py-24"
      style={{ backgroundColor: FONDO }}
    >
      {/*
        Prezzo: sborda a destra e in basso. Su mobile e' piu' piccolo e sborda
        meno (-bottom-7 invece del -6% dell'altezza): con la sezione alta ~1260px
        quel 6% lo tagliava quasi del tutto.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-7 right-0 z-0 select-none font-display text-[12rem] leading-none text-mustard lg:-bottom-[6%] lg:text-[24rem] xl:text-[28rem]"
      >
        {tesseramento.price}
      </span>

      <Boxed className="relative z-20">
        <Rivela className="max-w-2xl lg:max-w-[52%]">
          <SplitHeading
            text={tesseramento.h1}
            split={tesseramento.h1Split}
            accento="text-mustard"
            aCapo
            className="mb-10 text-4xl leading-tight md:text-5xl lg:text-6xl"
          />

          <ul className="mb-10 space-y-5">
            {tesseramento.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Check size={18} />
                </span>
                <div>
                  <p className="font-semibold text-ink">{benefit.title}</p>
                  <p className="text-sm text-ink/75">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/tesseramento"
            className="inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
          >
            {tesseramento.cta}
          </Link>
        </Rivela>
      </Boxed>

      {/*
        Foto sopra al prezzo: le gambe passano davanti alle cifre. Su mobile
        serve z-10 esplicito, se no il prezzo (che e' in absolute) coprirebbe
        la foto, che li' e' nel flusso normale.
        Da lg e' in absolute; sotto lg sta dopo il testo, larga il 135% con
        shrink-0 per sbordare a destra, e il -mb-20 annulla il padding basso
        della sezione cosi' viene tagliata in basso come nel riferimento.
      */}
      <div className="relative z-10 -mb-20 mt-12 flex lg:absolute lg:bottom-0 lg:right-[6%] lg:mb-0 lg:mt-0 lg:h-[92%] lg:justify-end">
        <Image
          src="/images/matteo-tesseramento-con-bambino.png"
          alt="Matteo tiene per mano un bambino in piedi sullo skate"
          width={1642}
          height={1804}
          className="h-auto w-[135%] max-w-none shrink-0 object-contain object-bottom lg:h-full lg:w-auto"
        />
      </div>
    </section>
  );
}
