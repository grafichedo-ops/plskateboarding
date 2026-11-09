/** Spazio lasciato sopra al blocco di destinazione, in px. */
const MARGINE = 16;

/**
 * Dopo una scelta in un modulo (prenotazione, tesseramento) porta in vista il
 * blocco successivo, identificato dal suo id.
 *
 * - Aspetta un frame: il blocco puo' comparire proprio per effetto della
 *   scelta (es. gli orari dopo la data), quindi esiste solo dopo il render.
 * - Sposta solo la vista, non il focus: chi usa tastiera o screen reader resta
 *   sulla scelta appena fatta e prosegue con Tab.
 * - Con prefers-reduced-motion salta senza animazione.
 */
export function scorriAlProssimo(id: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - MARGINE;
    window.scrollTo({ top: Math.max(0, top), behavior: ridotto ? "auto" : "smooth" });
  });
}
