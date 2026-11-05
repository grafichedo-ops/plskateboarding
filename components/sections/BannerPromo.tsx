import Image from "next/image";
import Link from "next/link";
import { Boxed } from "@/components/Boxed";
import { Rivela } from "@/components/Rivela";
import { cn } from "@/lib/utils";

/**
 * Banner promozionale riusabile della homepage. Testi in content/copy.ts (banner.*).
 *
 * Varianti:
 * - "ink": fascia nera a tutta larghezza, testo bianco, bordo basso mustard.
 * - "card": card bianca .card-hard su fondo della sezione, immagine a destra
 *   da lg e sotto il testo su mobile.
 * - "mustard": fascia mustard con bottone ink, immagine a destra da lg.
 *
 * `immagine`: assente = nessuna colonna immagine; null = placeholder 4:3
 * "Immagine da inserire" finche' non arriva una foto vera (niente stock,
 * niente immagini generate di bambini).
 * Le illustrazioni hanno lo sfondo trasparente: si mostrano intere, nelle
 * proporzioni del file, senza bordo ne' ritaglio.
 */

import type { Immagine } from "@/content/copy";

type Logo = Immagine;

const esterno = (href: string) => href.startsWith("http");

function Cta({ href, label, classe }: { href: string; label: string; classe: string }) {
  const cls = cn("inline-block btn-press rounded-btn px-6 py-3 font-semibold", classe);
  return esterno(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {label}
      <span className="sr-only"> (si apre in una nuova scheda)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

function Media({ immagine, riquadro = false }: { immagine: Immagine | null; riquadro?: boolean }) {
  if (!immagine) {
    return (
      <div
        aria-hidden="true"
        className="flex aspect-[4/3] w-full items-center justify-center rounded-card border-2 border-ink bg-[#f7f0de] text-sm font-semibold text-ink/60"
      >
        Immagine da inserire
      </div>
    );
  }
  const img = (
    <Image
      src={immagine.src}
      alt={immagine.alt}
      width={immagine.w}
      height={immagine.h}
      sizes="(min-width: 1024px) 40vw, 90vw"
      className="mx-auto h-auto max-h-[420px] w-auto max-w-full object-contain"
    />
  );
  return riquadro ? <div className="rounded-card bg-[#f7f0de] p-5 sm:p-6">{img}</div> : img;
}

export function BannerPromo({
  variante,
  titolo,
  testo,
  cta,
  immagine,
  loghi,
  sfondo = "#f7f0de",
  riquadro = false,
}: {
  variante: "ink" | "card" | "mustard";
  titolo: string;
  testo: string;
  cta: { label: string; href: string };
  /** undefined = nessuna immagine; null = placeholder. */
  immagine?: Immagine | null;
  loghi?: readonly Logo[];
  /** Solo per "card": colore della sezione attorno alla card. */
  sfondo?: string;
  /** Illustrazione dentro un riquadro crema #f7f0de (es. compleanno sul mustard). */
  riquadro?: boolean;
}) {
  const conMedia = immagine !== undefined;

  const contenuto = (scuro: boolean) => (
    <div className="min-w-0">
      <h2 className={cn("mb-4 font-display text-3xl leading-tight md:text-4xl", scuro ? "text-white" : "text-ink")}>
        {titolo}
      </h2>
      <p className={cn("mb-7 max-w-prose text-base lg:text-lg", scuro ? "text-white/85" : "text-ink/80")}>{testo}</p>
      <Cta
        href={cta.href}
        label={cta.label}
        classe={scuro ? "bg-mustard text-ink" : "bg-ink text-white"}
      />
    </div>
  );

  if (variante === "ink") {
    return (
      <section className="w-full border-b-4 border-mustard bg-ink py-12 lg:py-14">
        <Boxed className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {contenuto(true)}
          <div className="flex shrink-0 flex-wrap items-end gap-6 self-start lg:flex-nowrap lg:self-center">
            {loghi && loghi.length > 0 && (
              // Base bianca: il blu dei loghi sul nero non si legge.
              <ul className="flex shrink-0 items-center gap-6 rounded-card bg-white px-5 py-4">
                {loghi.map((l) => (
                  <li key={l.src}>
                    <Image src={l.src} alt={l.alt} width={l.w} height={l.h} className="h-11 w-auto" />
                  </li>
                ))}
              </ul>
            )}
            {immagine && (
              // Fondo mustard: il tratto nero dell'illustrazione sparirebbe sul nero.
              <div className="flex h-44 w-28 shrink-0 items-end justify-center overflow-hidden rounded-card bg-mustard pt-3 lg:h-56 lg:w-36">
                <Image
                  src={immagine.src}
                  alt={immagine.alt}
                  width={immagine.w}
                  height={immagine.h}
                  sizes="144px"
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
            )}
          </div>
        </Boxed>
      </section>
    );
  }

  const griglia = cn("grid items-center gap-8", conMedia && "lg:grid-cols-2 lg:gap-12");

  if (variante === "card") {
    return (
      <section className="w-full py-12 lg:py-16" style={{ backgroundColor: sfondo }}>
        <Boxed>
          <Rivela>
            <div className={cn("card-hard rounded-[20px] bg-white p-6 sm:p-8 lg:p-12", griglia)}>
              {contenuto(false)}
              {conMedia && <Media immagine={immagine} />}
            </div>
          </Rivela>
        </Boxed>
      </section>
    );
  }

  return (
    <section className="w-full bg-mustard py-16 lg:py-20">
      <Boxed>
        <Rivela className={griglia}>
          {contenuto(false)}
          {conMedia && <Media immagine={immagine} riquadro={riquadro} />}
        </Rivela>
      </Boxed>
    </section>
  );
}
