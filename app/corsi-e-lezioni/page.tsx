import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Header } from "@/components/header";
import { Boxed } from "@/components/Boxed";
import { Rivela } from "@/components/Rivela";
import { BannerPromo } from "@/components/sections/BannerPromo";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { FooterChiaro } from "@/components/sections/FooterChiaro";
import { PageHero } from "@/components/sections/PageHero";
import { ILLU, banner, corsiPage, doveFacciamo, meta } from "@/content/copy";
import { orarioSettimanale, sediPer } from "@/lib/prenota/disponibilita";
import type { FasciaId } from "@/lib/prenota/regole";

export const metadata: Metadata = meta.corsi;

const TITOLO_SEZIONE = "mb-10 font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl";
const ETICHETTA_FASCIA: Record<FasciaId, string> = {
  "4-6": "4-6 anni",
  "7-12": "7-12 anni",
  "13-17": "13-17 anni",
  adulti: "adulti",
};

/** Sedi di una formula, dagli slot del calendario (la inclusiva e' sempre privata). */
const dove = (id: string) => sediPer(id === "corso" ? "corso" : "privata").join(" e ");

export default function CorsiELezioniPage() {
  const { hero, perEta, formule, orari, sedi, info } = corsiPage;
  // Stesso ordine delle sedi della homepage (The Quiver prima).
  const ordine = doveFacciamo.locations.map((l) => l.name);
  const orario = orarioSettimanale().sort((a, b) => ordine.indexOf(a.sede) - ordine.indexOf(b.sede));

  return (
    <>
      <Header trasparente navCentrata boxed />
      <main>
        {/* 1. Hero */}
        <PageHero
          h1={hero.h1}
          h1Split={hero.h1Split}
          testo={hero.testo}
          cta={{ label: hero.cta, href: "/prenota" }}
          immagine={hero.immagine}
        />

        {/* 2. Per eta' */}
        <section id="per-eta" className="w-full scroll-mt-20 bg-[#f7f0de] py-20 lg:py-24">
          <Boxed>
            <Rivela>
              <h2 className={TITOLO_SEZIONE}>{perEta.h2}</h2>
            </Rivela>
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr]">
              {perEta.gruppi.map((g) => (
                <Rivela key={g.titolo} className="flex flex-col">
                  <Image
                    src={g.immagine.src}
                    alt={g.immagine.alt}
                    width={g.immagine.w}
                    height={g.immagine.h}
                    sizes="(min-width: 1024px) 25vw, 70vw"
                    className="mx-auto mb-4 h-48 w-auto max-w-full object-contain"
                  />
                  <ul className={`grid flex-1 gap-6 ${g.card.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {g.card.map((c) => (
                      <li key={c.fascia} className="card-hard flex flex-col rounded-[20px] bg-white p-6">
                        <h3 className="mb-2 whitespace-nowrap font-display text-2xl text-ink">{c.titolo}</h3>
                        <p className="mb-6 text-ink/80">{c.testo}</p>
                        <div className="mt-auto flex flex-wrap gap-3">
                          {c.corso && (
                            <Link
                              href={`/prenota?fascia=${c.fascia}&formula=corso`}
                              className="btn-press whitespace-nowrap rounded-btn bg-ink px-4 py-2.5 text-sm font-semibold text-white"
                            >
                              {perEta.ctaCorso}
                              <span className="sr-only"> · {c.titolo}</span>
                            </Link>
                          )}
                          <Link
                            href={`/prenota?fascia=${c.fascia}&formula=privata`}
                            className="btn-press whitespace-nowrap rounded-btn bg-white px-4 py-2.5 text-sm font-semibold text-ink"
                          >
                            {perEta.ctaPrivata}
                            <span className="sr-only"> · {c.titolo}</span>
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Rivela>
              ))}
            </div>
          </Boxed>
        </section>

        {/* 3. Formule: tabella da lg, card sotto */}
        <section id="formule" className="w-full scroll-mt-20 bg-[#f4f4f4] py-20 lg:py-24">
          <Boxed>
            <h2 className={TITOLO_SEZIONE}>{formule.h2}</h2>

            <div className="hidden overflow-hidden rounded-[20px] border-2 border-ink bg-white shadow-hard-lg lg:block">
              <table className="w-full text-left">
                <thead className="bg-ink text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      <span className="sr-only">Formula</span>
                    </th>
                    {Object.values(formule.colonne).map((c) => (
                      <th key={c} scope="col" className="px-6 py-4 font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formule.righe.map((r) => (
                    <tr key={r.id} className="border-t-2 border-ink/10">
                      <th scope="row" className="px-6 py-5 font-display text-xl text-ink">
                        {r.nome}
                      </th>
                      <td className="px-6 py-5">{r.perChi}</td>
                      <td className="px-6 py-5">{dove(r.id)}</td>
                      <td className="px-6 py-5">{r.formato}</td>
                      <td className="px-6 py-5">
                        <Link href={r.href} className="font-semibold underline underline-offset-4">
                          {r.cta}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="grid gap-6 lg:hidden">
              {formule.righe.map((r) => (
                <li key={r.id} className="card-hard rounded-[20px] bg-white p-6">
                  <h3 className="mb-4 font-display text-2xl text-ink">{r.nome}</h3>
                  <dl className="mb-6 space-y-3">
                    {[
                      [formule.colonne.perChi, r.perChi],
                      [formule.colonne.dove, dove(r.id)],
                      [formule.colonne.formato, r.formato],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs font-bold uppercase tracking-wide text-ink/60">{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href={r.href}
                    className="inline-block btn-press rounded-btn bg-ink px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {r.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </Boxed>
        </section>

        {/* 4. Orari, dagli stessi dati del calendario di /prenota */}
        <section id="orari" className="w-full scroll-mt-20 bg-[#f7f0de] py-20 lg:py-24">
          <Boxed>
            <h2 className={TITOLO_SEZIONE}>{orari.h2}</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {orario.map((s) => (
                <div key={s.sede} className="card-hard rounded-[20px] bg-white p-6 sm:p-7">
                  <h3 className="mb-5 flex items-center gap-2 font-display text-2xl text-ink">
                    <MapPin aria-hidden="true" size={20} className="shrink-0" />
                    {s.sede}
                  </h3>
                  <dl className="space-y-4">
                    {s.giorni.map((g) => (
                      <div key={g.dow} className="border-t-2 border-dashed border-ink/15 pt-4 first:border-t-0 first:pt-0">
                        <dt className="mb-2 font-semibold">{g.nome}</dt>
                        {g.fasce.map((f) => (
                          <dd key={f.inizio} className="flex flex-wrap items-baseline gap-x-3 text-ink/85">
                            <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums text-ink">
                              <Clock aria-hidden="true" size={14} />
                              {f.inizio}–{f.fine}
                            </span>
                            <span>
                              {f.tipo === "corso"
                                ? `${orari.corso} ${f.fasce?.map((x) => ETICHETTA_FASCIA[x]).join(", ")}`
                                : orari.privata}
                            </span>
                          </dd>
                        ))}
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="mt-8 font-semibold">{orari.nota}</p>
          </Boxed>
        </section>

        {/* 5. Sedi */}
        <section id="sedi" className="w-full scroll-mt-20 bg-mustard py-20 lg:py-24">
          <Boxed>
            <h2 className={TITOLO_SEZIONE}>{sedi.h2}</h2>
            <ul className="grid gap-10 md:grid-cols-2">
              {doveFacciamo.locations.map((l) => (
                <li key={l.name}>
                  <div className="mb-4 max-w-md rounded-card bg-[#f7f0de] p-5">
                    <Image
                      src={l.immagine.src}
                      alt={l.immagine.alt}
                      width={l.immagine.w}
                      height={l.immagine.h}
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <h3 className="font-display text-2xl text-ink">{l.name}</h3>
                  <p className="mt-1 text-ink/85">{l.address}</p>
                </li>
              ))}
            </ul>
          </Boxed>
        </section>

        {/* 6. Lezioni inclusive */}
        <BannerPromo variante="card" {...banner.inclusive} immagine={ILLU.inclusioneGruppo} />

        {/* 7. Compleanni */}
        <BannerPromo variante="mustard" {...banner.compleanni} riquadro />

        {/* 8. Attrezzatura e pioggia */}
        <section className="w-full bg-[#f4f4f4] py-20 lg:py-24">
          <Boxed className="grid gap-8 md:grid-cols-2">
            {info.map((b) => (
              <div key={b.id} id={b.id} className="card-hard flex items-center gap-5 rounded-[20px] bg-white p-6">
                <Image
                  src={b.immagine.src}
                  alt=""
                  width={b.immagine.w}
                  height={b.immagine.h}
                  sizes="128px"
                  className="h-auto w-24 shrink-0 object-contain sm:w-32"
                />
                <div className="min-w-0">
                  <h2 className="mb-2 font-display text-2xl text-ink">{b.titolo}</h2>
                  <p className="text-ink/80">{b.testo}</p>
                </div>
              </div>
            ))}
          </Boxed>
        </section>

        {/* 9. CTA finale */}
        <CtaFinale />
      </main>
      <FooterChiaro />
    </>
  );
}
