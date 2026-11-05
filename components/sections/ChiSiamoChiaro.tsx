import Image from "next/image";
import Link from "next/link";
import { Rivela } from "@/components/Rivela";
import { Boxed } from "@/components/Boxed";
import { cn } from "@/lib/utils";
import { chiSiamo } from "@/content/copy";

/**
 * Sezione "Chi sono" della homepage: fondo chiaro, testo a sinistra, foto a destra.
 *
 * Diversa dalla ChiSiamo della homepage: li' il titolo e' bianco/nero sul
 * mustard, qui e' giallo/nero su fondo chiaro e le parole in giallo non sono
 * le prime N ma un elenco di indici (h1Accent in content/copy.ts), perche'
 * anche la "E" in mezzo e' accentata.
 *
 * La foto matteo-con-bambino.png ha gia' il cerchio giallo dentro al file e lo
 * sfondo scontornato, quindi non serve ricostruire il cerchio come elemento a
 * parte: basta appoggiarla sul fondo chiaro.
 */

/** #f4f4f4: il grigio chiarissimo del riferimento, non e' bianco pieno. */
const FONDO = "#f4f4f4";

export function ChiSiamoChiaro() {
  const parole = chiSiamo.h1.split(" ");
  const accentate = new Set(chiSiamo.h1Accent);

  return (
    <section
      id="chi-sono"
      className="w-full scroll-mt-20 py-20 lg:py-28"
      style={{ backgroundColor: FONDO }}
    >
      <Boxed className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <Rivela className="w-full lg:w-1/2">
          <h2 className="mb-6 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            {parole.map((parola, i) => (
              <span
                key={`${parola}-${i}`}
                className={cn(accentate.has(i) ? "text-mustard" : "text-ink")}
              >
                {parola}
                {i < parole.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>

          <p className="mb-8 max-w-prose text-base text-ink/80 lg:text-lg">
            {chiSiamo.paragraph}
          </p>

          <Link
            href={chiSiamo.ctaHref}
            className="inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
          >
            {chiSiamo.cta}
          </Link>
        </Rivela>

        <Rivela ritardo={120} className="flex w-full justify-center lg:w-1/2 lg:justify-end">
          <Image
            src="/images/matteo-con-bambino.png"
            alt="Matteo, accosciato, tiene d'occhio un bambino in piedi sullo skate"
            width={1534}
            height={1534}
            className="h-auto w-full max-w-[560px] object-contain"
          />
        </Rivela>
      </Boxed>
    </section>
  );
}
