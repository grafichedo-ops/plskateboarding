"use client";

import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { dataEstesa } from "@/lib/prenota/date";
import { isMinore, type DatiPrenotazione } from "@/lib/prenota/dati";
import type { Slot } from "@/lib/prenota/disponibilita";
import {
  FASCE,
  FORMATI,
  FORMULE,
  SEDI,
  prezzo,
  type FasciaId,
  type FormatoId,
  type FormulaId,
} from "@/lib/prenota/regole";

export const ID_PRIVACY = "campo-privacy";

const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

function Sezione({
  titolo,
  step,
  onModifica,
  children,
}: {
  titolo: string;
  step: number;
  onModifica: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-ink/20 py-4 last:border-b-0">
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase tracking-wide text-ink/70">{titolo}</dt>
        <dd className="mt-1 break-words">{children}</dd>
      </div>
      <button
        type="button"
        onClick={() => onModifica(step)}
        aria-label={`Modifica: ${titolo}`}
        className="shrink-0 rounded-full px-2 py-1 text-sm font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
      >
        Modifica
      </button>
    </div>
  );
}


export function Riepilogo({
  fascia,
  formula,
  formato,
  data,
  slot,
  dati,
  privacy,
  erroreprivacy,
  onPrivacy,
  onModifica,
}: {
  fascia: FasciaId;
  /** Gia' quella effettiva: se da Privata si e' scelto un corso, qui arriva "corso". */
  formula: FormulaId;
  formato: FormatoId | null;
  data: string;
  slot: Slot;
  dati: DatiPrenotazione;
  privacy: boolean;
  erroreprivacy: boolean;
  onPrivacy: (v: boolean) => void;
  onModifica: (step: number) => void;
}) {
  const f = FASCE.find((x) => x.id === fascia)!;
  const titoloFormula = FORMULE.find((x) => x.id === formula)!.titolo;
  const titoloFormato = FORMATI.find((x) => x.id === formato)?.titolo;
  const sede = SEDI[slot.sede];
  const minore = isMinore(fascia);
  const referente = minore ? dati.genitore : dati.contatti;
  const costo = prezzo(formula, formato);

  return (
    <div className="space-y-8">
      <dl className="rounded-card border-2 border-ink bg-white px-5 py-1 shadow-hard-sm">
        <Sezione titolo="Chi" step={1} onModifica={onModifica}>
          {f.titolo} · {f.eta}
        </Sezione>
        <Sezione titolo="Formula" step={2} onModifica={onModifica}>
          {titoloFormula}
          {titoloFormato && ` · ${titoloFormato}`}
        </Sezione>
        <Sezione titolo="Quando e dove" step={3} onModifica={onModifica}>
          <span className="block font-semibold">
            {dataEstesa(data)}, {slot.inizio}–{slot.fine}
          </span>
          <span className="block">{slot.sede}</span>
          {sede && <span className="block text-sm text-ink/75">{sede.indirizzo}</span>}
          {sede?.nota && <span className="mt-1 block text-sm text-ink/75">{sede.nota}</span>}
        </Sezione>
        <Sezione titolo={dati.partecipanti.length > 1 ? "Partecipanti" : "Partecipante"} step={4} onModifica={onModifica}>
          {dati.partecipanti.map((p, i) => (
            <span key={i} className="block">
              {p.nome} {p.cognome}
            </span>
          ))}
        </Sezione>
        <Sezione titolo={minore ? "Genitore o tutore" : "Contatti"} step={4} onModifica={onModifica}>
          {minore && (
            <span className="block">
              {dati.genitore.nome} {dati.genitore.cognome}
            </span>
          )}
          <span className="block">{referente.email}</span>
          <span className="block">{referente.telefono}</span>
        </Sezione>
        <Sezione titolo="Attrezzatura" step={4} onModifica={onModifica}>
          <span className="block">Tavola: {dati.tavola === "prestito" ? "in prestito" : "propria"}</span>
          <span className="block">Casco e protezioni: {dati.protezioni === "prestito" ? "in prestito" : "propri"}</span>
        </Sezione>
        {dati.note.trim() && (
          <Sezione titolo="Note" step={4} onModifica={onModifica}>
            <span className="whitespace-pre-line">{dati.note.trim()}</span>
          </Sezione>
        )}
      </dl>

      <div className="flex items-center justify-between gap-4 rounded-card border-2 border-ink bg-mustard px-5 py-4 shadow-hard-sm">
        <span className="font-display text-xl uppercase">Prezzo</span>
        <span className="text-right">
          {costo === null ? (
            <span className="font-semibold">Da definire</span>
          ) : (
            <span className="font-display text-2xl">{euro.format(costo)}</span>
          )}
        </span>
      </div>

      <div>
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink",
            erroreprivacy ? "border-red-700 bg-red-50" : "border-ink bg-white",
          )}
        >
          <input
            id={ID_PRIVACY}
            type="checkbox"
            checked={privacy}
            onChange={(e) => onPrivacy(e.target.checked)}
            aria-invalid={erroreprivacy}
            aria-describedby={erroreprivacy ? `${ID_PRIVACY}-errore` : undefined}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink",
              privacy ? "bg-ink text-mustard" : "bg-white",
            )}
          >
            {privacy && <Check size={16} strokeWidth={3} />}
          </span>
          <span className="text-sm">
            Ho letto l&apos;informativa sulla privacy e acconsento al trattamento dei dati per gestire la prenotazione.
          </span>
        </label>
        {erroreprivacy && (
          <p id={`${ID_PRIVACY}-errore`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700">
            <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            Per confermare serve il consenso.
          </p>
        )}
      </div>
    </div>
  );
}
