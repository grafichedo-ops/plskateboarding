import Image from "next/image";
import Link from "next/link";
import { Rivela } from "@/components/Rivela";
import { MapPin } from "lucide-react";
import { Boxed } from "@/components/Boxed";
import { SplitHeading } from "@/components/SplitHeading";
import { doveFacciamo } from "@/content/copy";

/**
 * Quarta sezione di /homepage2: sedi delle lezioni, su fondo mustard.
 *
 * Il titolo usa lo stesso taglio bianco/nero della homepage (h1Split = 3 in
 * content/copy.ts), quindi qui basta SplitHeading senza campi nuovi.
 *
 * La foto matteo-con-ragazzo.png ha il contenuto a filo dei bordi destro e
 * inferiore della tela: ancorandola in alto a destra e facendola piu' alta
 * della sezione, l'overflow-hidden la taglia in basso come nel riferimento,
 * senza bisogno di ritagliarla nell'asset.
 */
export function DoveFacciamoChiaro() {
  return (
    <section
      id="dove-facciamo"
      className="relative w-full overflow-hidden bg-mustard py-20 lg:py-24"
    >
      <Boxed className="relative z-10">
        <Rivela className="max-w-2xl lg:max-w-[54%]">
          <SplitHeading
            text={doveFacciamo.h1}
            split={doveFacciamo.h1Split}
            className="mb-6 text-4xl leading-tight md:text-5xl lg:text-6xl"
          />

          <p className="mb-10 max-w-prose text-base text-ink lg:text-lg">
            {doveFacciamo.paragraph}
          </p>

          <ul className="mb-10 space-y-6">
            {doveFacciamo.locations.map((location) => (
              <li key={location.name} className="flex items-center gap-4">
                {/* Accanto al nome della sede: decorativa, il nome e' gia' nel testo. */}
                <Image
                  src={location.immagine.src}
                  alt=""
                  width={location.immagine.w}
                  height={location.immagine.h}
                  sizes="128px"
                  className="h-auto w-24 shrink-0 object-contain sm:w-32"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-display text-xl text-ink">
                    <MapPin aria-hidden="true" size={18} className="shrink-0" />
                    {location.name.toUpperCase()}
                  </div>
                  <p className="mt-1 pl-[26px] text-ink/80">{location.address}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/prenota"
            className="inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
          >
            {doveFacciamo.cta}
          </Link>
        </Rivela>
      </Boxed>

      {/*
        Da lg esce dalla scatola e arriva al bordo destro dello schermo.
        Sotto lg sta nel flusso, dopo il testo (quindi va dichiarata qui e non
        prima della Boxed) ed e' larga il 135% con shrink-0 (se no il flex la ricomprime
        dentro al contenitore): sborda a destra e il -mb-20
        annulla il padding inferiore della sezione, cosi' viene tagliata in
        basso come nel riferimento invece di restare piccola e centrata.
      */}
      <div className="-mb-20 mt-12 flex lg:absolute lg:right-0 lg:top-0 lg:mb-0 lg:mt-0 lg:h-[115%] lg:justify-end">
        <Image
          src="/images/matteo-con-ragazzo.png"
          alt="Matteo sostiene un ragazzo in piedi sullo skate su una rampa"
          width={1740}
          height={2162}
          className="h-auto w-[135%] max-w-none shrink-0 object-contain object-bottom lg:h-full lg:w-auto"
        />
      </div>
    </section>
  );
}
