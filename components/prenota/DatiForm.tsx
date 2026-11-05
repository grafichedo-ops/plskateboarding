"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { SceltaCard } from "@/components/prenota/SceltaCard";
import { cn } from "@/lib/utils";
import {
  NOTE_MAX,
  isMinore,
  type Contatti,
  type DatiPrenotazione,
  type Errori,
  type Persona,
  type Prestito,
} from "@/lib/prenota/dati";
import type { FasciaId } from "@/lib/prenota/regole";
import { ILLU } from "@/content/copy";

/** Id DOM di un campo, usato anche per portarci il focus sul primo errore. */
export const idCampo = (chiave: string) => `campo-${chiave.replace(/\./g, "-")}`;

function Campo({
  chiave,
  etichetta,
  errore,
  aiuto,
  className,
  ...input
}: {
  chiave: string;
  etichetta: string;
  errore?: string;
  aiuto?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = idCampo(chiave);
  const descritto = [aiuto && `${id}-aiuto`, errore && `${id}-errore`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {etichetta}
      </label>
      <input
        id={id}
        aria-invalid={!!errore}
        aria-describedby={descritto}
        className={cn(
          "h-12 w-full rounded-btn border-2 border-ink bg-white px-3 text-base outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          errore && "border-red-700 bg-red-50",
        )}
        {...input}
      />
      {aiuto && (
        <p id={`${id}-aiuto`} className="mt-1 text-xs text-ink/70">
          {aiuto}
        </p>
      )}
      <Errore id={`${id}-errore`} testo={errore} />
    </div>
  );
}

function Errore({ id, testo }: { id: string; testo?: string }) {
  if (!testo) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700">
      <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{testo}</span>
    </p>
  );
}

function Blocco({ titolo, children }: { titolo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-card border-2 border-ink bg-white p-5 shadow-hard-sm">
      <legend className="-ml-1 rounded-full border-2 border-ink bg-mustard px-3 py-0.5 font-display text-lg">
        {titolo}
      </legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function SceltaPrestito({
  chiave,
  domanda,
  valore,
  errore,
  onScegli,
}: {
  chiave: string;
  domanda: string;
  valore: Prestito | null;
  errore?: string;
  onScegli: (v: Prestito) => void;
}) {
  const id = idCampo(chiave);
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={errore ? `${id}-errore` : undefined}
      className="outline-none sm:col-span-2"
    >
      <legend className="mb-2 text-sm font-semibold">{domanda}</legend>
      <div className="grid grid-cols-2 gap-3">
        <SceltaCard name={chiave} value="ho" scelta={valore === "ho"} onScegli={() => onScegli("ho")} compatta>
          <span className="pr-12 text-sm font-semibold">Sì, ce l&apos;ho</span>
        </SceltaCard>
        <SceltaCard name={chiave} value="prestito" scelta={valore === "prestito"} onScegli={() => onScegli("prestito")} compatta>
          <span className="pr-12 text-sm font-semibold">No, mi serve in prestito</span>
        </SceltaCard>
      </div>
      <Errore id={`${id}-errore`} testo={errore} />
    </fieldset>
  );
}

export function DatiForm({
  fascia,
  dati,
  errori,
  onChange,
}: {
  fascia: FasciaId;
  dati: DatiPrenotazione;
  /** Gia' filtrati: il wizard li passa solo dopo il primo tentativo di andare avanti. */
  errori: Errori;
  onChange: (d: DatiPrenotazione) => void;
}) {
  const minore = isMinore(fascia);
  const coppia = dati.partecipanti.length > 1;

  const persona = (i: number, campo: keyof Persona, v: string) =>
    onChange({ ...dati, partecipanti: dati.partecipanti.map((p, j) => (j === i ? { ...p, [campo]: v } : p)) });
  const genitore = (campo: keyof DatiPrenotazione["genitore"], v: string) =>
    onChange({ ...dati, genitore: { ...dati.genitore, [campo]: v } });
  const contatti = (campo: keyof Contatti, v: string) => onChange({ ...dati, contatti: { ...dati.contatti, [campo]: v } });

  const campiContatti = (prefisso: "genitore" | "contatti", valori: Contatti, set: (c: keyof Contatti, v: string) => void) => (
    <>
      <Campo
        chiave={`${prefisso}.email`}
        etichetta="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={valori.email}
        errore={errori[`${prefisso}.email`]}
        aiuto="Qui arrivano la conferma e il link per disdire."
        onChange={(e) => set("email", e.target.value)}
      />
      <Campo
        chiave={`${prefisso}.telefono`}
        etichetta="Telefono"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={valori.telefono}
        errore={errori[`${prefisso}.telefono`]}
        aiuto="Per avvisarti se la lezione cambia sede o orario."
        onChange={(e) => set("telefono", e.target.value)}
      />
    </>
  );

  return (
    <div className="space-y-8">
      {dati.partecipanti.map((p, i) => (
        <Blocco key={i} titolo={coppia ? `Partecipante ${i + 1}` : "Chi partecipa"}>
          <Campo
            chiave={`p${i}.nome`}
            etichetta="Nome"
            autoComplete={i === 0 && !minore ? "given-name" : "off"}
            value={p.nome}
            errore={errori[`p${i}.nome`]}
            onChange={(e) => persona(i, "nome", e.target.value)}
          />
          <Campo
            chiave={`p${i}.cognome`}
            etichetta="Cognome"
            autoComplete={i === 0 && !minore ? "family-name" : "off"}
            value={p.cognome}
            errore={errori[`p${i}.cognome`]}
            onChange={(e) => persona(i, "cognome", e.target.value)}
          />
          {!minore && i === 0 && campiContatti("contatti", dati.contatti, contatti)}
        </Blocco>
      ))}

      {minore && (
        <Blocco titolo="Genitore o tutore">
          <p className="text-sm text-ink/75 sm:col-span-2">
            {coppia ? "I partecipanti sono minorenni" : "Il partecipante è minorenne"}: ci serve un adulto di riferimento.
          </p>
          <Campo
            chiave="genitore.nome"
            etichetta="Nome"
            autoComplete="given-name"
            value={dati.genitore.nome}
            errore={errori["genitore.nome"]}
            onChange={(e) => genitore("nome", e.target.value)}
          />
          <Campo
            chiave="genitore.cognome"
            etichetta="Cognome"
            autoComplete="family-name"
            value={dati.genitore.cognome}
            errore={errori["genitore.cognome"]}
            onChange={(e) => genitore("cognome", e.target.value)}
          />
          {campiContatti("genitore", dati.genitore, genitore)}
        </Blocco>
      )}

      <Blocco titolo="Attrezzatura">
        {/* Accento piccolo: a 390px non deve stringere le scelte qui sotto. */}
        <Image
          src={ILLU.attrezzatura.src}
          alt=""
          width={ILLU.attrezzatura.w}
          height={ILLU.attrezzatura.h}
          sizes="80px"
          className="h-auto w-20 object-contain sm:col-span-2"
        />
        <SceltaPrestito
          chiave="tavola"
          domanda={coppia ? "Avete già una tavola a testa?" : "Hai già una tavola?"}
          valore={dati.tavola}
          errore={errori.tavola}
          onScegli={(v) => onChange({ ...dati, tavola: v })}
        />
        <SceltaPrestito
          chiave="protezioni"
          domanda={coppia ? "Avete già casco e protezioni?" : "Hai già casco e protezioni?"}
          valore={dati.protezioni}
          errore={errori.protezioni}
          onScegli={(v) => onChange({ ...dati, protezioni: v })}
        />
      </Blocco>

      <div>
        <label htmlFor={idCampo("note")} className="mb-1 block font-display text-lg">
          Note <span className="font-sans text-sm font-normal text-ink/70">(facoltative)</span>
        </label>
        <textarea
          id={idCampo("note")}
          rows={4}
          maxLength={NOTE_MAX}
          value={dati.note}
          aria-invalid={!!errori.note}
          aria-describedby={`${idCampo("note")}-aiuto${errori.note ? ` ${idCampo("note")}-errore` : ""}`}
          onChange={(e) => onChange({ ...dati, note: e.target.value })}
          className="w-full rounded-card border-2 border-ink bg-white p-3 text-base outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
        <p id={`${idCampo("note")}-aiuto`} className="mt-1 flex justify-between gap-4 text-xs text-ink/70">
          <span>Esperienza sulla tavola, obiettivi, cosa vuoi dirci. Non scrivere informazioni sulla salute.</span>
          <span aria-hidden="true">
            {dati.note.length}/{NOTE_MAX}
          </span>
        </p>
        <Errore id={`${idCampo("note")}-errore`} testo={errori.note} />
      </div>
    </div>
  );
}
