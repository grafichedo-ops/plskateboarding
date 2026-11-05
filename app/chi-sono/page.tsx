import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Boxed } from "@/components/Boxed";
import { Rivela } from "@/components/Rivela";
import { SplitHeading } from "@/components/SplitHeading";
import { FooterChiaro } from "@/components/sections/FooterChiaro";
import { chiSono, daCompilare, meta } from "@/content/copy";

export const metadata: Metadata = meta.chiSono;

/** Dimensioni reali dei puppet (tele diverse fra loro, vedi CorsiCaroselloChiaro). */
const PUPPET: Record<string, { w: number; h: number }> = {
  "/images/puppet-kids-m.png": { w: 474, h: 702 },
  "/images/puppet-boy-busto.png": { w: 504, h: 688 },
  "/images/puppet-adult-m.png": { w: 476, h: 728 },
};

const TITOLO_SEZIONE = "mb-10 font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl";

export default function ChiSonoPage() {
  const { metodo, perChi, credenziali, bio, finale } = chiSono;

  return (
    <>
      <Header trasparente navCentrata boxed />
      <main>
        {/* 1. Banner */}
        <section className="w-full bg-mustard pb-16 pt-32 lg:pb-24 lg:pt-40">
          <Boxed>
            <div className="max-w-3xl">
              <SplitHeading
                as="h1"
                text={chiSono.h1}
                split={chiSono.h1Split}
                className="mb-6 text-5xl leading-tight md:text-6xl lg:text-7xl"
              />
              <p className="mb-8 max-w-prose text-lg text-ink lg:text-xl">{chiSono.intro}</p>
              <Link href="/prenota" className="inline-block btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white">
                {chiSono.cta}
              </Link>
            </div>
          </Boxed>
        </section>

        {/* 2. Metodo */}
        <section id="metodo" className="w-full scroll-mt-20 bg-[#f4f4f4] py-20 lg:py-24">
          <Boxed>
            <Rivela>
              <h2 className={TITOLO_SEZIONE}>{metodo.h2}</h2>
            </Rivela>
            <Rivela ritardo={120}>
              <ol className="grid gap-8 md:grid-cols-3">
                {metodo.blocchi.map((b, i) => (
                  <li key={b.titolo} className="card-hard rounded-[20px] bg-white p-7">
                    <span
                      aria-hidden="true"
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-mustard font-display text-xl text-ink"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mb-3 font-display text-2xl text-ink">{b.titolo}</h3>
                    <p className="text-ink/80">{b.testo}</p>
                  </li>
                ))}
              </ol>
            </Rivela>
          </Boxed>
        </section>

        {/* 3. Per chi e' */}
        <section className="w-full bg-[#f7f0de] py-20 lg:py-24">
          <Boxed>
            <Rivela>
              <h2 className={TITOLO_SEZIONE}>{perChi.h2}</h2>
            </Rivela>
            <Rivela ritardo={120}>
              <ul className="grid gap-8 md:grid-cols-3">
                {perChi.gruppi.map((g) => (
                  <li key={g.titolo} className="card-hard flex flex-col overflow-hidden rounded-[20px] bg-white">
                    <div className="flex h-44 items-end justify-center bg-mustard/30">
                      <Image
                        src={g.immagine}
                        alt=""
                        width={PUPPET[g.immagine]?.w ?? 474}
                        height={PUPPET[g.immagine]?.h ?? 702}
                        className="h-40 w-auto object-contain object-bottom"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="mb-3 font-display text-2xl text-ink">{g.titolo}</h3>
                      <p className="mb-6 text-ink/80">{g.testo}</p>
                      <div className="mt-auto flex flex-wrap gap-3">
                        {g.link.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="btn-press rounded-btn bg-ink px-5 py-2.5 text-sm font-semibold text-white"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Rivela>
          </Boxed>
        </section>

        {/* 4. Credenziali */}
        <section className="w-full bg-ink py-20 text-white lg:py-24">
          <Boxed>
            <h2 className="mb-10 font-display text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
              {credenziali.h2}
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {credenziali.voci.map((v) => (
                <li key={v.testo} className="flex items-center gap-5 rounded-[20px] border-2 border-mustard p-6">
                  {/* Base bianca: il blu dei loghi sul nero non si legge. */}
                  <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-card bg-white p-2">
                    <Image src={v.logo.src} alt={v.logo.alt} width={v.logo.w} height={v.logo.h} className="max-h-12 w-auto" />
                  </span>
                  <p className="text-lg font-semibold">{v.testo}</p>
                </li>
              ))}
            </ul>
          </Boxed>
        </section>

        {/* 5. Biografia: nascosta finche' Matteo non la scrive. */}
        {!daCompilare(bio.testo) && (
          <section className="w-full bg-[#f4f4f4] py-20 lg:py-24">
            <Boxed>
              <h2 className={TITOLO_SEZIONE}>{bio.h2}</h2>
              <p className="max-w-prose whitespace-pre-line text-lg text-ink/80">{bio.testo}</p>
            </Boxed>
          </section>
        )}

        {/* 6. CTA finale */}
        <section className="w-full bg-mustard py-20 lg:py-24">
          <Boxed className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
              {finale.h2}
            </h2>
            <Link
              href="/prenota"
              className="inline-block shrink-0 btn-press rounded-btn bg-ink px-6 py-3 font-semibold text-white"
            >
              {finale.cta}
            </Link>
          </Boxed>
        </section>
      </main>
      <FooterChiaro />
    </>
  );
}
