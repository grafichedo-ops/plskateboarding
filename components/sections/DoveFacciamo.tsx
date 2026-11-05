import Image from "next/image";
import { MapPin } from "lucide-react";
import { SplitHeading } from "@/components/SplitHeading";
import { doveFacciamo } from "@/content/copy";

/**
 * Stop 4 del palcoscenico: testo in alto a sinistra, foto tonda grande a
 * destra. Il rail e lo skater NON stanno qui: sono il video di sfondo del
 * palcoscenico (vedi ScrollStage.tsx), che scorre dietro a tutto il pannello.
 * Per questo non c'e' nessun z-index da gestire qui: i pannelli stanno gia'
 * sopra al layer video.
 */
export function DoveFacciamo() {
  return (
    <div
      id="dove-facciamo"
      className="flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14"
    >
      <div className="flex w-full items-center justify-between gap-12">
        <div className="max-w-2xl">
          <SplitHeading
            data-anim
            text={doveFacciamo.h1}
            split={doveFacciamo.h1Split}
            className="text-4xl md:text-6xl mb-6"
          />
          <p data-anim className="text-lg mb-10 max-w-prose">
            {doveFacciamo.paragraph}
          </p>

          <ul data-anim className="space-y-6">
            {doveFacciamo.locations.map((location) => (
              <li key={location.name}>
                <div className="flex items-center gap-2 font-display text-xl">
                  <MapPin size={18} className="shrink-0" />
                  {location.name.toUpperCase()}
                </div>
                <p className="mt-1 pl-[26px] text-ink/80">{location.address}</p>
              </li>
            ))}
          </ul>
        </div>

        {/*
          Frame 4: la foto tonda occupa una porzione importante del lato destro.
          min(46vw, 66vh): ~37% della larghezza del viewport, ~40% di quella della
          sezione. Dimensionarlo solo in vw lo farebbe sbordare in
          verticale su schermi bassi, solo in vh resterebbe piccolo su schermi
          larghi: il minore dei due tiene entrambe le proporzioni.
        */}
        <div data-anim className="hidden shrink-0 lg:block">
          <Image
            src="/images/immagine-evocativa-location.png"
            alt="Istruttore P&L che accompagna un bambino sullo skate"
            width={1114}
            height={1078}
            className="h-[min(46vw,66vh)] w-[min(46vw,66vh)] rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
