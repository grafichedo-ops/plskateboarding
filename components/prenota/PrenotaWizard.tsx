"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Calendario, ID_ORARI } from "@/components/prenota/Calendario";
import { Conferma } from "@/components/prenota/Conferma";
import { DatiForm } from "@/components/prenota/DatiForm";
import { AvvisoErrori, focusPrimoErrore } from "@/components/modulo/Campi";
import { ModuloShell, type Intestazione } from "@/components/modulo/ModuloShell";
import { EsciDialog } from "@/components/modulo/EsciDialog";
import { ID_PRIVACY, Riepilogo } from "@/components/prenota/Riepilogo";
import { SceltaCard } from "@/components/modulo/SceltaCard";
import type { Slot } from "@/lib/prenota/disponibilita";
import { inviaPrenotazione } from "@/lib/prenota/invio";
import { scorriAlProssimo } from "@/lib/scorri";
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

/** Blocco "In quanti siete?" dello step 2: destinazione dello scorrimento dopo la formula. */
const ID_FORMATO = "scelta-formato";

const INTESTAZIONI: Record<number, Intestazione> = {
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
    // Privata e Inclusiva chiedono anche "In quanti siete?".
    if (FORMULE.find((f) => f.id === id)?.serveFormato) scorriAlProssimo(ID_FORMATO);
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
      const chiavi = Object.keys(validaDati(dati, fascia));
      if (chiavi.length) {
        setTentato(true);
        // Il campo esiste gia': gli errori cambiano solo il testo, non la struttura.
        focusPrimoErrore(chiavi);
        return;
      }
    }
    setStep(step + 1);
  }

  return (
    <>
      <ModuloShell
        intestazione={testa}
        step={step}
        totale={TOTALE_STEP}
        titoloRef={titolo}
        onUscita={intercettaUscita}
        etichettaUscita="Esci dalla prenotazione"
        indietro={step === 1 ? null : { onClick: () => setStep(step - 1), disabled: invio === "invio" }}
        avanti={{
          etichetta: step < TOTALE_STEP ? "Continua" : invio === "invio" ? "Invio in corso…" : "Conferma prenotazione",
          onClick: avanti,
          disabled: !completo,
          busy: invio === "invio",
        }}
      >
        {step === 1 && (
          <fieldset className="grid gap-4">
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
              <fieldset id={ID_FORMATO}>
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
              scorriAlProssimo(ID_ORARI);
            }}
            onSlot={setSlot}
          />
        )}

        {step === 4 && fascia && (
          <>
            <AvvisoErrori numero={numeroErrori} />
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
      </ModuloShell>
      <EsciDialog aperto={chiediUscita} onResta={() => setChiediUscita(false)} onEsci={() => router.push("/")} />
    </>
  );
}
