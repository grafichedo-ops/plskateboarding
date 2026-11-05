// Formattazione delle date condivisa da calendario, riepilogo e conferma.

export const giornoLungo = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" });

export function daISO(iso: string) {
  const [a, m, g] = iso.split("-").map(Number);
  return new Date(a, m - 1, g);
}

export function maiuscola(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "Mercoledì 12 novembre" */
export const dataEstesa = (iso: string) => maiuscola(giornoLungo.format(daISO(iso)));
