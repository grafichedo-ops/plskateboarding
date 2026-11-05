import { cn } from "@/lib/utils";

/** Larghezza della scatola, condivisa con l'header di /homepage2. */
export const BOXED_MAXW = "mx-auto w-full max-w-[1800px]";

/**
 * Contenitore dei contenuti di /homepage2: incolonna titoli, testi e CTA di
 * tutte le sezioni sullo stesso asse verticale. Gli sfondi restano a tutta
 * larghezza, perche' questo sta DENTRO alla <section>, non la sostituisce.
 *
 * max-w-[1800px]: a 1920 il contenuto parte a ~124px dal bordo, cioe' il ~6,5%
 * dei riferimenti Figma. Un contenitore piu' stretto (max-w-7xl = 1280px)
 * rientrerebbe a oltre 300px e staccherebbe dal mockup. Sopra i 1800px il
 * contenuto smette di allargarsi e si centra.
 */
export function Boxed({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(BOXED_MAXW, "px-8 md:px-16", className)}>
      {children}
    </div>
  );
}
