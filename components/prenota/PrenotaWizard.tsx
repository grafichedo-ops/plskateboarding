"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Calendario } from "@/components/prenota/Calendario";
import { SceltaCard } from "@/components/prenota/SceltaCard";
import type { Slot } from "@/lib/prenota/disponibilita";
import {
  FASCE,
  FORMATI,
  formulePer,
  type FasciaId,
  type FormatoId,
  type FormulaId,
} from "@/lib/prenota/regole";

const TOTALE_STEP = 5;

const INTESTAZIONI: Record<number, { bianco: string; nero: string; testo: string }> = {
  1: { bianco: "CHI", nero: "DEVE IMPARARE?", testo: "Scegli la fascia d'età di chi salirà sulla tavola." },
  2: { bianco: "COME", nero: "VUOI SKATARE?", testo: "Scegli la formula più adatta." },
  3: { bianco: "QUANDO", nero: "SKATIAMO?", testo: "Scegli la data e uno degli orari ancora disponibili." },
  4: { bianco: "RACCONTACI", nero: "CHI SEI", testo: "Ci servono solo i dati utili per organizzare al meglio la lezione." },
};

export function PrenotaWizard({
  fasciaIniziale,
  formulaIniziale,
}: {
  fasciaIniziale: FasciaId | null;
  formulaIniziale: FormulaId | null;
}) {
  const [step, setStep] = useState(fasciaIniziale ? 2 : 1);
  const [fascia, setFascia] = useState<FasciaId | null>(fasciaIniziale);
  const [formula, setFormula] = useState<FormulaId | null>(formulaIniziale);
  const [formato, setFormato] = useState<FormatoId | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const titolo = useRef<HTMLHeadingElement>(null);
  const primoRender = useRef(true);

  // A ogni cambio di step il focus va sul titolo, cosi' lo screen reader lo annuncia.
  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }
    titolo.current?.focus();
    window.scrollTo(0, 0);
  }, [step]);

  const azzeraOrario = () => {
    setData(null);
    setSlot(null);
  };

  const scegliFascia = (id: FasciaId) => {
    if (id !== fascia) azzeraOrario();
    setFascia(id);
    // Da un'altra fascia si puo' arrivare con "corso" scelto: per 13-17 non esiste.
    if (id === "13-17" && formula === "corso") setFormula(null);
  };

  const scegliFormula = (id: FormulaId) => {
    if (id !== formula) azzeraOrario();
    setFormula(id);
    if (id === "corso") setFormato(null);
  };

  const formulaAttiva = formulePer(fascia).find((f) => f.id === formula);
  const completo =
    step === 1 ? !!fascia : step === 2
          ? !!formulaAttiva && (!formulaAttiva.serveFormato || !!formato)
          : step === 3
            ? !!slot
            : false;
  const testa = INTESTAZIONI[step];

  return (
    <main className="flex min-h-dvh flex-col bg-[#f7f0de] text-ink">
      <header className="border-b-2 border-ink bg-mustard">
        <div className="mx-auto w-full max-w-2xl px-4 pb-5 pt-5 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-lg uppercase">
              P&amp;L Skateboarding
            </Link>
            <span
              aria-label={`Passaggio ${step} di ${TOTALE_STEP}`}
              className="rounded-full border-2 border-ink bg-white px-3 py-0.5 text-xs font-bold"
            >
              {step} di {TOTALE_STEP}
            </span>
          </div>
          <h1 ref={titolo} tabIndex={-1} className="mt-3 font-display text-3xl leading-tight outline-none md:text-4xl">
            <span className="text-white">{testa.bianco}</span> {testa.nero}
          </h1>
          <p className="mt-1 text-sm">{testa.testo}</p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6">
        {step === 1 && (
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="sr-only">Fascia d&apos;età</legend>
            {FASCE.map((f) => (
              <SceltaCard key={f.id} name="fascia" value={f.id} scelta={fascia === f.id} onScegli={() => scegliFascia(f.id)}>
                <Image src={f.immagine} alt="" width={120} height={170} className="-mb-4 mr-3 h-24 w-16 shrink-0 object-contain object-bottom" />
                <span>
                  <span className="block font-display text-xl">{f.titolo}</span>
                  <span className="block text-xs text-ink/75">
                    {f.eta} · {f.descrizione}
                  </span>
                </span>
              </SceltaCard>
            ))}
          </fieldset>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <fieldset className="grid gap-4">
              <legend className="sr-only">Formula</legend>
              {formulePer(fascia).map((f) => (
                <SceltaCard key={f.id} name="formula" value={f.id} scelta={formula === f.id} onScegli={() => scegliFormula(f.id)}>
                  <span className="pr-14">
                    <span className="block font-display text-xl">{f.titolo}</span>
                    <span className="block text-xs text-ink/75">{f.descrizione}</span>
                  </span>
                </SceltaCard>
              ))}
              {fascia === "13-17" && (
                <p className="text-sm text-ink/75">Per i ragazzi 13-17 le lezioni sono singole o private.</p>
              )}
            </fieldset>

            {formulaAttiva?.serveFormato && (
              <fieldset>
                <legend className="mb-3 font-display text-xl">In quanti siete?</legend>
                <div className="grid grid-cols-2 gap-4">
                  {FORMATI.map((f) => (
                    <SceltaCard key={f.id} name="formato" value={f.id} scelta={formato === f.id} onScegli={() => setFormato(f.id)}>
                      <span className="font-display text-lg">{f.titolo}</span>
                    </SceltaCard>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {step === 3 && fascia && formula && (
          <Calendario
            fascia={fascia}
            formula={formula}
            data={data}
            slot={slot}
            onData={(d) => {
              setData(d);
              setSlot(null);
            }}
            onSlot={setSlot}
          />
        )}

        {step === 4 && (
          <p className="rounded-card border-2 border-ink bg-white p-6 shadow-hard-sm">
            Il modulo dati è il prossimo passaggio da costruire.
          </p>
        )}
      </section>

      <footer className="sticky bottom-0 border-t-2 border-ink bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4 md:px-6">
          {step === 1 ? (
            <Link href="/" aria-label="Torna al sito" className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <ArrowLeft size={20} />
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Passaggio precedente"
              onClick={() => setStep(step - 1)}
              className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <button
            type="button"
            disabled={!completo}
            onClick={() => setStep(step + 1)}
            className="rounded-btn bg-ink px-8 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continua
          </button>
        </div>
      </footer>
    </main>
  );
}
