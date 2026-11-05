"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Comparsa legata allo scroll: il contenuto sfuma ed entra dal basso quando
 * arriva in viewport, e torna indietro quando esce.
 *
 * Parte da `visibile = true` e si nasconde solo quando l'osservatore dice che
 * l'elemento e' fuori: cosi' se il JS non gira (o l'idratazione si rompe) la
 * pagina resta leggibile invece di restare vuota, e sopra la piega non c'e'
 * nessun lampo di contenuto nascosto al primo fotogramma.
 *
 * Il movimento e' volutamente corto (22px) e veloce: deve accompagnare la
 * lettura, non farsi notare.
 */
export function Rivela({
  children,
  ritardo = 0,
  className,
}: {
  children: React.ReactNode;
  /** Ritardo in ms, per far entrare a cascata elementi vicini. */
  ritardo?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibile, setVisibile] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisibile(entry.isIntersecting),
      // -8% in basso: l'elemento si rivela poco prima di essere del tutto
      // dentro, cosi' l'animazione finisce mentre lo si sta leggendo.
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("rivela", className)}
      data-visibile={visibile}
      style={ritardo ? { transitionDelay: `${ritardo}ms` } : undefined}
    >
      {children}
    </div>
  );
}
