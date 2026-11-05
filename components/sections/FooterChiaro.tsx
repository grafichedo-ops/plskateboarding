import Image from "next/image";
import Link from "next/link";
import { Boxed } from "@/components/Boxed";
import { footer } from "@/content/copy";

/**
 * Footer di /homepage2. Stessi contenuti del footer della homepage
 * (content/copy.ts), ma dentro alla scatola condivisa, cosi' logo e colonne
 * si incolonnano con le sezioni sopra.
 *
 * Il logo e' l'immagine e non il testo a text-8xl del footer della homepage:
 * li' la parola "Skateboarding" non puo' andare a capo e sborda in orizzontale
 * sotto i 768px, allargando la pagina (misurato: 447px di testo in un box da
 * 311px). Con l'immagine il problema non si pone.
 */
export function FooterChiaro() {
  return (
    <footer className="w-full bg-ink py-16 text-white lg:py-20">
      <Boxed>
        <div className="mb-14 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <Image
            src="/images/logo-footer.png"
            alt={footer.logo}
            width={896}
            height={826}
            className="h-[120px] w-auto shrink-0 brightness-0 invert lg:h-[150px]"
          />

          <div className="grid w-full gap-10 sm:grid-cols-3 lg:max-w-[640px]">
            {footer.columns.map((column) => (
              <div key={column.title}>
                {/* h2 e non h4: e' il primo titolo dopo quelli della pagina, i livelli non saltano.
                    font-sans perche' globals.css da' il font display a tutti gli h2. */}
                <h2 className="mb-4 font-sans text-sm uppercase leading-normal tracking-wide text-white/60">
                  {column.title}
                </h2>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-mustard"
                        >
                          {link.label}
                          <span className="sr-only"> (si apre in una nuova scheda)</span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="transition-colors hover:text-mustard"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="border-t border-white/15 pt-8 text-sm text-white/50">
          {footer.copyright}
        </p>
      </Boxed>
    </footer>
  );
}
