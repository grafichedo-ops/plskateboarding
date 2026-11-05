"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Flame, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { caricaDisponibilita, isoDi, type Giorno, type Slot } from "@/lib/prenota/disponibilita";
import { daISO, dataEstesa, giornoLungo } from "@/lib/prenota/date";
import type { FasciaId, FormulaId } from "@/lib/prenota/regole";
import { ILLU } from "@/content/copy";

const SETTIMANA = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];
const MESI_AVANTI = 3;

const meseAnno = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" });

/** Celle da lunedi' a domenica: comprende i giorni dei mesi vicini, come nel mockup. */
function celleDelMese(anno: number, mese: number) {
  const primo = new Date(anno, mese, 1);
  const vuote = (primo.getDay() + 6) % 7;
  const quante = Math.ceil((vuote + new Date(anno, mese + 1, 0).getDate()) / 7) * 7;
  return Array.from({ length: quante }, (_, i) => new Date(anno, mese, 1 - vuote + i));
}

export function Calendario({
  fascia,
  formula,
  data,
  slot,
  onData,
  onSlot,
}: {
  fascia: FasciaId;
  formula: FormulaId;
  data: string | null;
  slot: Slot | null;
  onData: (data: string) => void;
  onSlot: (slot: Slot) => void;
}) {
  const [oggi] = useState(() => new Date());
  const [mese, setMese] = useState(() => {
    const d = data ? daISO(data) : oggi;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [giorni, setGiorni] = useState<Giorno[] | null>(null);
  const [errore, setErrore] = useState(false);
  const [tentativo, setTentativo] = useState(0);

  useEffect(() => {
    let attivo = true;
    setGiorni(null);
    setErrore(false);
    caricaDisponibilita(mese.getFullYear(), mese.getMonth(), { fascia, formula })
      .then((r) => attivo && setGiorni(r))
      .catch(() => attivo && setErrore(true));
    return () => {
      attivo = false;
    };
  }, [mese, fascia, formula, tentativo]);

  const perData = useMemo(() => new Map(giorni?.map((g) => [g.data, g])), [giorni]);
  const oggiISO = isoDi(oggi);
  const primoMese = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
  const ultimoMese = new Date(oggi.getFullYear(), oggi.getMonth() + MESI_AVANTI, 1);
  const prenotabile = useCallback(
    (g?: Giorno) => !!g && g.data >= oggiISO && g.slots.length > 0,
    [oggiISO]
  );
  const nessunGiorno = giorni !== null && !giorni.some(prenotabile);
  const scelto = data ? perData.get(data) : undefined;
  const sposta = (n: number) => setMese(new Date(mese.getFullYear(), mese.getMonth() + n, 1));

  return (
    <div className="space-y-8">
      <div className="rounded-[20px] border-2 border-ink bg-white p-4 shadow-hard-lg sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl uppercase" aria-live="polite">
            {meseAnno.format(mese)}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Mese precedente"
              disabled={mese <= primoMese}
              onClick={() => sposta(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white disabled:opacity-30"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Mese successivo"
              disabled={mese >= ultimoMese}
              onClick={() => sposta(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white shadow-[2px_2px_0_0_#141414] disabled:opacity-30"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2" aria-busy={giorni === null}>
          {SETTIMANA.map((g) => (
            <div key={g} className="pb-1 text-center text-xs font-semibold">
              {g}
            </div>
          ))}
          {celleDelMese(mese.getFullYear(), mese.getMonth()).map((d) => {
            const iso = isoDi(d);
            const fuori = d.getMonth() !== mese.getMonth();
            const g = fuori ? undefined : perData.get(iso);
            const attivo = prenotabile(g);
            const assente = !fuori && g?.stato === "assenza" && iso >= oggiISO;
            const corso = attivo && g?.stato === "corso";
            const selezionato = !fuori && data === iso;
            const nome = giornoLungo.format(d);
            return (
              <div key={iso} className="flex justify-center">
                <button
                  type="button"
                  disabled={!attivo}
                  aria-pressed={selezionato}
                  aria-label={`${nome}${corso ? ", corso fisso" : ""}${assente ? ", assenza" : ""}${attivo ? "" : ", non disponibile"}`}
                  onClick={() => onData(iso)}
                  className={cn(
                    "relative flex aspect-square w-full max-w-[48px] items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    fuori && "bg-[#e1e1e1] text-ink/60",
                    !fuori && !attivo && "bg-[#f7f0de]/50 text-ink/35",
                    giorni === null && !fuori && "animate-pulse",
                    attivo && !selezionato && "bg-[#f4efe4] hover:bg-[#ecd66f]",
                    selezionato && "border-2 border-ink bg-mustard"
                  )}
                >
                  {d.getDate()}
                  {corso && (
                    <Flame aria-hidden="true" size={14} className="absolute -right-0.5 -top-0.5 fill-orange-500 text-orange-600" />
                  )}
                  {assente && (
                    <X aria-hidden="true" size={15} strokeWidth={3.5} className="absolute -right-0.5 -top-0.5 text-red-600" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-2">
            <Flame aria-hidden="true" size={18} className="fill-orange-500 text-orange-600" /> Corso fisso
          </span>
          <span className="flex items-center gap-2">
            <X aria-hidden="true" size={18} strokeWidth={3.5} className="text-red-600" /> Assenza
          </span>
        </div>
      </div>

      {errore && (
        <div role="alert" className="rounded-card border-2 border-ink bg-white p-4 text-sm">
          <p className="mb-3">Non siamo riusciti a caricare il calendario.</p>
          <button type="button" onClick={() => setTentativo(tentativo + 1)} className="btn-press rounded-btn bg-ink px-4 py-2 font-semibold text-white">
            Riprova
          </button>
        </div>
      )}

      {nessunGiorno && !errore && (
        <div className="flex items-center gap-4">
          <Image
            src={ILLU.calendario.src}
            alt=""
            width={ILLU.calendario.w}
            height={ILLU.calendario.h}
            sizes="56px"
            className="h-auto w-14 shrink-0 object-contain"
          />
          <p className="text-sm">Nessun orario disponibile in questo mese: prova con il mese successivo.</p>
        </div>
      )}

      {data && scelto && (
        <div>
          <h2 className="font-display text-2xl uppercase">Orari disponibili</h2>
          <p className="mb-4 mt-1 text-sm">{dataEstesa(data)}</p>
          <div role="radiogroup" aria-label="Orari disponibili" className="flex flex-wrap gap-3">
            {scelto.slots.map((s) => {
              const attivo = slot?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={attivo}
                  disabled={s.pieno}
                  aria-label={`${s.inizio}, ${s.sede}${s.tipo === "corso" ? ", corso" : ""}${s.pieno ? ", pieno" : ""}`}
                  onClick={() => onSlot(s)}
                  className={cn(
                    "rounded-full border-2 px-5 py-2 text-left transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                    s.pieno && "cursor-not-allowed border-ink/50 bg-[#a3a3a3] text-ink/50",
                    !s.pieno && !attivo && "border-ink bg-white hover:-translate-y-0.5",
                    attivo && "border-ink bg-ink text-mustard-light shadow-[3px_3px_0_0_#141414]"
                  )}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {s.inizio}
                    {s.tipo === "corso" && !s.pieno && (
                      <Flame aria-hidden="true" size={14} className="fill-orange-500 text-orange-600" />
                    )}
                  </span>
                  <span className="block text-[11px] leading-tight">
                    {s.pieno ? "Pieno" : s.tipo === "corso" ? `Corso · ${s.sede}` : s.sede}
                  </span>
                </button>
              );
            })}
          </div>
          {slot?.tipo === "corso" && formula === "privata" && (
            <p className="mt-4 text-sm">Hai scelto un corso: formula e prezzo diventano quelli del corso.</p>
          )}
        </div>
      )}
    </div>
  );
}
