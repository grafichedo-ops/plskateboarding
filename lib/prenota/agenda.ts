// Link "aggiungi al calendario" per la schermata finale.
// Gli orari sono sempre ora di Roma, anche se chi prenota ha il telefono su un altro fuso.

import type { Slot } from "@/lib/prenota/disponibilita";

/** Converte data + ora di Roma in un istante UTC. */
function daRoma(data: string, ora: string) {
  const [a, m, g] = data.split("-").map(Number);
  const [h, min] = ora.split(":").map(Number);
  const ipotesi = Date.UTC(a, m - 1, g, h, min);
  // Quanto e' avanti Roma rispetto a UTC in quell'istante (1 o 2 ore, ora legale compresa).
  const parti = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Rome",
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(new Date(ipotesi))
      .map((p) => [p.type, Number(p.value)]),
  );
  const comeRoma = Date.UTC(parti.year, parti.month - 1, parti.day, parti.hour, parti.minute);
  return new Date(ipotesi - (comeRoma - ipotesi));
}

const formatoUTC = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export type Evento = { titolo: string; descrizione: string; luogo: string; data: string; slot: Slot };

function istanti(e: Evento) {
  return { inizio: formatoUTC(daRoma(e.data, e.slot.inizio)), fine: formatoUTC(daRoma(e.data, e.slot.fine)) };
}

export function linkGoogle(e: Evento) {
  const { inizio, fine } = istanti(e);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.titolo,
    dates: `${inizio}/${fine}`,
    details: e.descrizione,
    location: e.luogo,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** File .ics per Apple Calendar, Outlook e simili. */
export function fileIcs(e: Evento, uid: string) {
  const { inizio, fine } = istanti(e);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//P&L Skateboarding//Prenotazioni//IT",
    "BEGIN:VEVENT",
    `UID:${uid}@pl-skateboarding`,
    `DTSTAMP:${formatoUTC(new Date())}`,
    `DTSTART:${inizio}`,
    `DTEND:${fine}`,
    `SUMMARY:${escapeIcs(e.titolo)}`,
    `DESCRIPTION:${escapeIcs(e.descrizione)}`,
    `LOCATION:${escapeIcs(e.luogo)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
