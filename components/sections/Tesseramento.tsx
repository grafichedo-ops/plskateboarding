import { Check } from "lucide-react";
import { SplitHeading } from "@/components/SplitHeading";
import { tesseramento } from "@/content/copy";

/** Stop 5 del palcoscenico: skater in fondo al rail, in basso a sinistra. */
export function Tesseramento() {
  return (
    <div className="flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14">
      <div className="flex w-full flex-col gap-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <SplitHeading
            data-anim
            text={tesseramento.h1}
            split={tesseramento.h1Split}
            className="text-4xl md:text-6xl mb-8"
          />

          <ul data-anim className="space-y-4 mb-8">
            {tesseramento.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Check size={16} />
                </span>
                <div>
                  <p className="font-semibold">{benefit.title}</p>
                  <p className="text-ink/80">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* data-anim sul contenitore: l'<a> e' .btn-press e ha gia' un
              transform suo sull'hover, che un transform inline di GSAP
              sovrascriverebbe. */}
          <div data-anim>
            <a
              href="#tesserati"
              className="btn-press inline-block rounded-btn bg-ink px-6 py-4 font-semibold text-white"
            >
              {tesseramento.cta}
            </a>
          </div>
        </div>

        {/*
          max(14rem, min(22vw, 34vh)): su desktop il cerchio scala col viewport
          (~367px a 1920x1080), ma non scende mai sotto i 224px di prima, se no
          su telefono - dove 22vw sono 86px - diventerebbe illeggibile.
        */}
        <div
          data-anim
          className="card-hard mx-auto flex h-[max(14rem,min(22vw,34vh))] w-[max(14rem,min(22vw,34vh))] shrink-0 flex-col items-center justify-center rounded-full bg-white text-center md:mx-0"
        >
          <span className="text-sm italic text-ink/70 lg:text-base">
            {tesseramento.priceLabel}
          </span>
          <span className="font-display text-6xl lg:text-8xl">
            {tesseramento.price}
          </span>
        </div>
      </div>
    </div>
  );
}
