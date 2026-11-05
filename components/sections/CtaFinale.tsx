import Link from "next/link";
import { Boxed } from "@/components/Boxed";
import { chiSono } from "@/content/copy";

/** Chiusura mustard "La prima spinta la facciamo insieme" -> /prenota. */
export function CtaFinale() {
  const { h2, cta } = chiSono.finale;
  return (
    <section className="w-full bg-mustard py-20 lg:py-24">
      <Boxed className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">{h2}</h2>
        <Link
          href="/prenota"
          className="inline-block shrink-0 btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
        >
          {cta}
        </Link>
      </Boxed>
    </section>
  );
}
