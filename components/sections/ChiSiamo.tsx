import { SplitHeading } from "@/components/SplitHeading";
import { chiSiamo } from "@/content/copy";

/** Stop 2 del palcoscenico: lo skater entra in cima al rail. */
export function ChiSiamo() {
  return (
    <div className="flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14">
      <div className="max-w-2xl">
        <SplitHeading
          data-anim
          text={chiSiamo.h1}
          split={chiSiamo.h1Split}
          className="text-4xl md:text-6xl mb-6"
        />
        <p data-anim className="text-lg mb-8 max-w-prose">
          {chiSiamo.paragraph}
        </p>
        {/*
          data-anim sul contenitore, non sull'<a>: la CTA e' .btn-press e ha
          gia' un transform suo sull'hover, che un transform inline di GSAP
          sovrascriverebbe.
        */}
        <div data-anim>
          <a
            href="#chi-siamo"
            className="btn-press inline-block rounded-btn bg-ink px-6 py-4 font-semibold text-white"
          >
            {chiSiamo.cta}
          </a>
        </div>
      </div>
    </div>
  );
}
