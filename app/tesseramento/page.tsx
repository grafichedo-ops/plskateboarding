import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tesseramento — P&L Skateboarding",
  robots: { index: false, follow: false },
};

/** Segnaposto: evita un 404 dai link del sito finche' il form non e' pronto. */
export default function TesseramentoPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[#f7f0de] px-4 text-center text-ink">
      <h1 className="font-display text-4xl">TESSERAMENTO</h1>
      <p>Il modulo online è in arrivo.</p>
      <Link href="/" className="btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white">
        Torna alla home
      </Link>
    </main>
  );
}
