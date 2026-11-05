import Image from "next/image";
import { Rivela } from "@/components/Rivela";
import { Boxed } from "@/components/Boxed";
import { footer } from "@/content/copy";

/**
 * Settima sezione di /homepage2: fascia di chiusura con la foto di gruppo a
 * sinistra e il logo P&L a destra, su mustard.
 *
 * La foto ha margini trasparenti (7% a sinistra, 14% in alto) ma tocca il bordo
 * inferiore della tela: per tagliarla a sinistra come nel riferimento va
 * spostata oltre il bordo, e per tagliarla in basso va resa piu' alta della
 * sezione, ancorata in alto, lasciando fare all'overflow-hidden.
 */
export function OutroChiaro() {
  return (
    <section className="relative w-full overflow-hidden bg-mustard">

      <Boxed className="relative z-10 flex items-center justify-center py-14 lg:justify-end lg:py-20">
        <Rivela ritardo={140}>
        <Image
          src="/images/logo-footer.png"
          alt={footer.logo}
          width={896}
          height={826}
          className="h-[230px] w-auto md:h-[260px] lg:h-[340px]"
        />
        </Rivela>
      </Boxed>

      {/*
        Da lg esce dal bordo sinistro dello schermo. Sotto lg sta nel flusso
        DOPO il logo (quindi dichiarata qui e non prima della Boxed) ed e'
        larga il 118% con shrink-0, se no il flex la ricomprime dentro allo
        schermo invece di farla sbordare.
      */}
      <Rivela className="flex justify-center pt-12 lg:absolute lg:left-0 lg:top-0 lg:h-[128%] lg:pt-0">
        <Image
          src="/images/matteo-con-bambini.png"
          alt="Istruttore P&L che sistema uno skate davanti a due ragazzi"
          width={2224}
          height={1668}
          className="h-auto w-[118%] max-w-none shrink-0 object-contain object-bottom lg:h-full lg:w-auto lg:-translate-x-[9%]"
        />
      </Rivela>
    </section>
  );
}
