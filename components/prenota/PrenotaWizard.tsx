"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Calendario } from "@/components/prenota/Calendario";
import { Conferma } from "@/components/prenota/Conferma";
import { DatiForm, idCampo } from "@/components/prenota/DatiForm";
import { EsciDialog } from "@/components/prenota/EsciDialog";
import { ID_PRIVACY, Riepilogo } from "@/components/prenota/Riepilogo";
import { SceltaCard } from "@/components/prenota/SceltaCard";
import type { Slot } from "@/lib/prenota/disponibilita";
import { inviaPrenotazione } from "@/lib/prenota/invio";
import {
  datiVuoti,
  isMinore,
  personaVuota,
  quantiPartecipanti,
  validaDati,
  type DatiPrenotazione,
} from "@/lib/prenota/dati";
import {
  FASCE,
  FORMATI,
  FORMULE,
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
  5: { bianco: "TUTTO", nero: "PRONTO?", testo: "Controlla il riepilogo e conferma la prenotazione." },
  // Schermata finale, fuori dal conteggio dei passaggi.
  6: { bianco: "CI VEDIAMO", nero: "IN PISTA!", testo: "La prenotazione è confermata." },
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
  const [dati, setDati] = useState<DatiPrenotazione>(datiVuoti);
  // Gli errori compaiono solo dopo il primo "Continua" sullo step 4.
  const [tentato, setTentato] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [tentatoPrivacy, setTentatoPrivacy] = useState(false);
  const [invio, setInvio] = useState<"pronto" | "invio" | "rete" | "pieno">("pronto");
  const [codice, setCodice] = useState<string | null>(null);
  const [chiediUscita, setChiediUscita] = useState(false);
  const router = useRouter();
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

  // Se da Privata si sceglie un corso, vale il corso: un solo partecipante.
  const formulaEffettiva: FormulaId | null = slot?.tipo === "corso" ? "corso" : formula;
  const formatoEffettivo = slot?.tipo === "corso" ? null : formato;
  const partecipanti = quantiPartecipanti(formatoEffettivo);

  // Tiene il numero di partecipanti allineato al formato, senza perdere quanto gia' scritto.
  useEffect(() => {
    setDati((d) =>
      d.partecipanti.length === partecipanti
        ? d
        : { ...d, partecipanti: Array.from({ length: partecipanti }, (_, i) => d.partecipanti[i] ?? personaVuota()) },
    );
  }, [partecipanti]);

  const errori = tentato && fascia ? validaDati(dati, fascia) : {};
  const numeroErrori = Object.keys(errori).length;

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
            : step === 4 || (step === 5 && invio !== "invio");
  const testa = INTESTAZIONI[step];

  async function conferma() {
    if (!privacy) {
      setTentatoPrivacy(true);
      document.getElementById(ID_PRIVACY)?.focus();
      return;
    }
    if (!fascia || !formulaEffettiva || !data || !slot) return;
    setInvio("invio");
    try {
      const esito = await inviaPrenotazione({
        fascia,
        formula: formulaEffettiva,
        formato: formatoEffettivo,
        data,
        slotId: slot.id,
        dati,
        privacy: true,
      });
      if (esito.ok) {
        setCodice(esito.id);
        setInvio("pronto");
        setStep(6);
      } else setInvio(esito.motivo);
    } catch {
      setInvio("rete");
    }
  }

  // C'e' qualcosa da perdere solo se si e' iniziato e non si e' ancora confermato.
  const iniziato = step <= TOTALE_STEP && (step > 1 || !!fascia);
  /** Per i link verso il sito: se c'e' una prenotazione a meta' chiede conferma. */
  const intercettaUscita = (e: React.MouseEvent) => {
    if (!iniziato) return;
    e.preventDefault();
    setChiediUscita(true);
  };

  const altroOrario = () => {
    setSlot(null);
    setInvio("pronto");
    setStep(3);
  };

  function avanti() {
    if (step === 5) {
      void conferma();
      return;
    }
    if (step === 4 && fascia) {
      const err = validaDati(dati, fascia);
      const primo = Object.keys(err)[0];
      if (primo) {
        setTentato(true);
        // Il campo esiste gia': gli errori cambiano solo il testo, non la struttura.
        const el = document.getElementById(idCampo(primo));
        const bersaglio = el?.tagName === "FIELDSET" ? el.querySelector("input") : el;
        bersaglio?.focus();
        return;
      }
    }
    setStep(step + 1);
  }

  return (
    <main className="flex min-h-dvh flex-col bg-[#f7f0de] text-ink">
      <header className="border-b-2 border-ink bg-mustard">
        <div className="mx-auto w-full max-w-2xl px-4 pb-5 pt-5 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" onClick={intercettaUscita} className="font-display text-lg uppercase">
              P&amp;L Skateboarding
            </Link>
            {step <= TOTALE_STEP && (
              <div className="flex items-center gap-3">
                <span
                  aria-label={`Passaggio ${step} di ${TOTALE_STEP}`}
                  className="rounded-full border-2 border-ink bg-white px-3 py-0.5 text-xs font-bold"
                >
                  {step} di {TOTALE_STEP}
                </span>
                <Link
                  href="/"
                  onClick={intercettaUscita}
                  aria-label="Esci dalla prenotazione"
                  className="btn-press flex h-10 items-center gap-1.5 rounded-full bg-white px-3 text-sm font-semibold"
                >
                  <X aria-hidden="true" size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Esci</span>
                </Link>
              </div>
            )}
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

        {step === 4 && fascia && (
          <>
            <p
              role="status"
              className={
                numeroErrori
                  ? "mb-6 rounded-card border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700"
                  : "sr-only"
              }
            >
              {numeroErrori > 0 &&
                (numeroErrori === 1 ? "C'è un campo da sistemare." : `Ci sono ${numeroErrori} campi da sistemare.`)}
            </p>
            <DatiForm fascia={fascia} dati={dati} errori={errori} onChange={setDati} />
          </>
        )}

        {step === 5 && fascia && formulaEffettiva && data && slot && (
          <>
            {invio === "pieno" && (
              <div role="alert" className="mb-6 rounded-card border-2 border-red-700 bg-red-50 p-4 text-sm">
                <p className="font-semibold text-red-700">Mentre compilavi, l&apos;ultimo posto di questo orario è stato preso.</p>
                <button type="button" onClick={altroOrario} className="btn-press mt-3 rounded-btn bg-ink px-4 py-2 font-semibold text-white">
                  Scegli un altro orario
                </button>
              </div>
            )}
            {invio === "rete" && (
              <p role="alert" className="mb-6 rounded-card border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Non siamo riusciti a inviare la prenotazione. Controlla la connessione e premi di nuovo Conferma: i dati
                sono ancora qui.
              </p>
            )}
            <Riepilogo
              fascia={fascia}
              formula={formulaEffettiva}
              formato={formatoEffettivo}
              data={data}
              slot={slot}
              dati={dati}
              privacy={privacy}
              erroreprivacy={tentatoPrivacy && !privacy}
              onPrivacy={setPrivacy}
              onModifica={setStep}
            />
          </>
        )}

        {step === 6 && codice && data && slot && fascia && formulaEffettiva && (
          <Conferma
            codice={codice}
            data={data}
            slot={slot}
            titoloFormula={FORMULE.find((f) => f.id === formulaEffettiva)!.titolo}
            email={isMinore(fascia) ? dati.genitore.email : dati.contatti.email}
          />
        )}
      </section>

      {step <= TOTALE_STEP && (
        <footer className="sticky bottom-0 border-t-2 border-ink bg-white">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4 md:px-6">
            {step === 1 ? (
              <Link href="/" onClick={intercettaUscita} aria-label="Torna al sito" className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <ArrowLeft size={20} />
              </Link>
            ) : (
              <button
                type="button"
                aria-label="Passaggio precedente"
                disabled={invio === "invio"}
                onClick={() => setStep(step - 1)}
                className="btn-press flex h-12 w-12 items-center justify-center rounded-full bg-white disabled:opacity-40"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button
              type="button"
              disabled={!completo}
              onClick={avanti}
              aria-busy={invio === "invio"}
              className="rounded-btn bg-ink px-8 py-3 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step < TOTALE_STEP ? "Continua" : invio === "invio" ? "Invio in corso…" : "Conferma prenotazione"}
            </button>
          </div>
        </footer>
      )}
      <EsciDialog aperto={chiediUscita} onResta={() => setChiediUscita(false)} onEsci={() => router.push("/")} />
    </main>
  );
}
