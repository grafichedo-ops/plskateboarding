"use client";

import Link from "next/link";
import { CalendarPlus, Download, ExternalLink } from "lucide-react";
import { fileIcs, linkGoogle, type Evento } from "@/lib/prenota/agenda";
import { dataEstesa } from "@/lib/prenota/date";
import type { Slot } from "@/lib/prenota/disponibilita";
import { SEDI } from "@/lib/prenota/regole";

export function Conferma({
  codice,
  data,
  slot,
  titoloFormula,
  email,
}: {
  codice: string;
  data: string;
  slot: Slot;
  titoloFormula: string;
  email: string;
}) {
  const sede = SEDI[slot.sede];
  const luogo = sede ? `${slot.sede}, ${sede.indirizzo}` : slot.sede;
  const evento: Evento = {
    titolo: `${titoloFormula} di skate · P&L Skateboarding`,
    descrizione: [`Prenotazione ${codice}`, sede?.nota].filter(Boolean).join("\n"),
    luogo,
    data,
    slot,
  };
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(fileIcs(evento, codice))}`;

  return (
    <div className="space-y-8">
      <div className="rounded-card border-2 border-ink bg-white p-5 shadow-hard-lg">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/70">Codice prenotazione</p>
        <p className="font-display text-2xl">{codice}</p>
        <p className="mt-4 font-semibold">
          {dataEstesa(data)}, {slot.inizio}–{slot.fine}
        </p>
        <p>{luogo}</p>
        {sede?.nota && <p className="mt-1 text-sm text-ink/75">{sede.nota}</p>}
        <p className="mt-4 text-sm">
          Abbiamo mandato la conferma a <strong className="break-all">{email}</strong>. Ti scriviamo di nuovo 6 ore
          prima della lezione.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-display text-xl uppercase">Segnatelo</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={linkGoogle(evento)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press inline-flex items-center gap-2 rounded-btn bg-white px-5 py-3 font-semibold"
          >
            <CalendarPlus aria-hidden="true" size={18} />
            Google Calendar
            <ExternalLink aria-hidden="true" size={14} />
            <span className="sr-only">(si apre in una nuova scheda)</span>
          </a>
          <a
            href={ics}
            download={`pl-skateboarding-${data}.ics`}
            className="btn-press inline-flex items-center gap-2 rounded-btn bg-white px-5 py-3 font-semibold"
          >
            <Download aria-hidden="true" size={18} />
            Apple, Outlook e altri (.ics)
          </a>
        </div>
      </div>

      <div className="rounded-card border-2 border-ink bg-[#ecd66f] p-5">
        <h2 className="font-display text-xl uppercase">Non puoi venire?</h2>
        <p className="mt-1 text-sm">
          Puoi disdire fino a 3 ore prima della lezione dal link nell&apos;email di conferma: così il posto torna libero
          per qualcun altro.
        </p>
      </div>

      <Link href="/" className="btn-press inline-flex rounded-btn bg-ink px-6 py-3 font-semibold text-white">
        Torna al sito
      </Link>
    </div>
  );
}
