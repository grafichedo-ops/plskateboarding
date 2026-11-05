import Image from "next/image";
import Link from "next/link";
import { Boxed } from "@/components/Boxed";
import { SplitHeading } from "@/components/SplitHeading";
import type { Immagine } from "@/content/copy";

/**
 * Banner mustard in cima alle pagine interne (/chi-sono, /corsi-e-lezioni, /faq):
 * h1 bicolore, testo, CTA opzionale e illustrazione opzionale a destra
 * (sotto il testo su mobile). L'header trasparente ci scorre sopra, da qui il pt.
 */
export function PageHero({
  h1,
  h1Split,
  testo,
  cta,
  immagine,
}: {
  h1: string;
  h1Split: number;
  testo: string;
  cta?: { label: string; href: string };
  immagine?: Immagine;
}) {
  return (
    <section className="w-full overflow-hidden bg-mustard pb-14 pt-28 lg:pb-20 lg:pt-36">
      <Boxed className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <SplitHeading
            as="h1"
            text={h1}
            split={h1Split}
            className="mb-6 text-[2.625rem] leading-tight min-[360px]:text-5xl md:text-6xl lg:text-7xl"
          />
          <p className="max-w-prose text-lg text-ink lg:text-xl">{testo}</p>
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
            >
              {cta.label}
            </Link>
          )}
        </div>
        {immagine && (
          <Image
            src={immagine.src}
            alt={immagine.alt}
            width={immagine.w}
            height={immagine.h}
            priority
            sizes="(min-width: 1024px) 420px, 80vw"
            className="mx-auto h-auto max-h-72 w-auto max-w-full shrink-0 object-contain lg:mx-0 lg:max-h-[440px]"
          />
        )}
      </Boxed>
    </section>
  );
}
