import Image from "next/image";
import { SplitHeading } from "@/components/SplitHeading";
import { hero } from "@/content/copy";

/** Stop 1 del palcoscenico: rail ancora vuoto, lettering P&L in alto a destra. */
export function Hero() {
  return (
    <div className="relative flex h-full w-full items-center px-8 pt-16 md:px-16 lg:pt-14">
      {/*
        Decorativo: esce volutamente dai bordi in alto a destra, come nel frame 1.
        Lo sfalsamento di composizione (le due translate) sta sull'<Image>, il
        data-anim sul wrapper: GSAP anima `y` scrivendo un transform inline, e
        se trovasse le translate di Tailwind sullo stesso elemento le
        sovrascriverebbe, facendo saltare il lettering di ~64px.
      */}
      <div
        data-anim
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 w-[46vw] max-w-[680px]"
      >
        <Image
          src="/images/logo-background-hero.png"
          alt=""
          width={1460}
          height={1346}
          priority
          className="w-full -translate-y-[14%] translate-x-[14%] select-none"
        />
      </div>

      <div className="relative z-10 max-w-2xl">
        <SplitHeading
          as="h1"
          data-anim
          text={hero.h1}
          split={hero.h1Split}
          className="text-5xl md:text-7xl mb-4"
        />
        <p data-anim className="text-lg text-ink/90 mb-8 max-w-prose">
          {hero.paragraph}
        </p>
        <div data-anim className="flex flex-wrap gap-4">
          <a
            href="#prenota"
            className="btn-press rounded-btn bg-ink px-6 py-4 font-semibold text-white"
          >
            {hero.ctaPrimary}
          </a>
          <a
            href="#info"
            className="btn-press rounded-btn bg-white px-6 py-4 font-semibold text-ink"
          >
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </div>
  );
}
