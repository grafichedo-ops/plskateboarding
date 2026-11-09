"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { scorriAlProssimo } from "@/lib/scorri";
import { AvvisoErrori, Errore, focusPrimoErrore, idCampo } from "@/components/modulo/Campi";
import { EsciDialog } from "@/components/modulo/EsciDialog";
import { ModuloShell, type Intestazione } from "@/components/modulo/ModuloShell";
import { SceltaCard } from "@/components/modulo/SceltaCard";
import { DatiTesserato } from "@/components/tesseramento/DatiTesserato";
import { Firma } from "@/components/tesseramento/Firma";
import {
  CERTIFICATO_MAX_MB,
  datiVuoti,
  erroreFile,
  validaAnagrafica,
  validaCertificato,
  validaConsensi,
  type DatiTesseramento,
  type Errori,
} from "@/lib/tesseramento/dati";
import { inviaTesseramento } from "@/lib/tesseramento/invio";
import { ILLU, tesseramento } from "@/content/copy";

const TOTALE_STEP = 5;

const INTESTAZIONI: Record<number, Intestazione> = {
  1: { bianco: "PER CHI", nero: "È LA TESSERA?", testo: "Scegli se tesserare te o un minore di cui sei genitore o tutore." },
  2: { bianco: "I DATI", nero: "PER LA TESSERA", testo: "Gli stessi che servono alla federazione per il tesseramento." },
  3: { bianco: "CERTIFICATO", nero: "MEDICO", testo: "Puoi caricarlo adesso o mandarlo più avanti." },
  4: { bianco: "FIRMA", nero: "E CONSENSI", testo: "Ultimi passi prima del riepilogo." },
  5: { bianco: "TUTTO", nero: "PRONTO?", testo: "Controlla i dati e invia la richiesta." },
  // Schermata finale, fuori dal conteggio dei passaggi.
  6: { bianco: "RICHIESTA", nero: "INVIATA!", testo: "Manca solo il pagamento della quota." },
};

const ID_FILE = "blocco-file";
const ID_FIRMA = "blocco-firma";

/** Peso leggibile: KB sotto il mega, altrimenti MB con una cifra decimale. */
const dimensione = (byte: number) =>
  byte < 1024 * 1024 ? `${Math.max(1, Math.round(byte / 1024))} KB` : `${(byte / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

const dataBreve = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
const formattaNascita = (iso: string) => (iso ? dataBreve.format(new Date(`${iso}T12:00:00`)) : "");

/** Casella di spunta vera, con stato scritto oltre che colorato. */
function Spunta({
  chiave,
  checked,
  errore,
  onChange,
  children,
}: {
  chiave: string;
  checked: boolean;
  errore?: string;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const id = idCampo(chiave);
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-card border-2 border-ink bg-white p-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink",
          errore && "border-red-700 bg-red-50",
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-invalid={!!errore}
          aria-describedby={errore ? `${id}-errore` : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink",
            checked ? "bg-ink text-mustard-light" : "bg-white",
          )}
        >
          {checked && <Check size={16} strokeWidth={3} />}
        </span>
        <span className="text-sm">{children}</span>
      </label>
      <Errore id={`${id}-errore`} testo={errore} />
    </div>
  );
}

/** Voce del riepilogo con il pulsante per tornare al passaggio. */
function Voce({ titolo, step, onModifica, children }: { titolo: string; step: number; onModifica: (s: number) => void; children: React.ReactNode }) {
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

export function TesseramentoWizard() {
  const [step, setStep] = useState(1);
  const [dati, setDati] = useState<DatiTesseramento>(datiVuoti);
  // Gli errori di un passaggio compaiono solo dopo il primo "Continua" su quel passaggio.
  const [tentati, setTentati] = useState<number[]>([]);
  const [invio, setInvio] = useState<"pronto" | "invio" | "rete">("pronto");
  const [codice, setCodice] = useState<string | null>(null);
  const [chiediUscita, setChiediUscita] = useState(false);
  const router = useRouter();
  const titolo = useRef<HTMLHeadingElement>(null);
  const primoRender = useRef(true);

  // A ogni cambio di passaggio il focus va sul titolo, cosi' lo screen reader lo annuncia.
  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }
    titolo.current?.focus();
    window.scrollTo(0, 0);
  }, [step]);

  const minore = dati.perChi === "minore";
  const valida = (s: number): Errori =>
    s === 2 ? validaAnagrafica(dati) : s === 3 ? validaCertificato(dati) : s === 4 ? validaConsensi(dati) : {};
  const errori = tentati.includes(step) ? valida(step) : {};
  const numeroErrori = Object.keys(errori).length;
  const email = minore ? dati.genitore.email : dati.contatti.email;

  const iniziato = step <= TOTALE_STEP && (step > 1 || !!dati.perChi);
  const intercettaUscita = (e: React.MouseEvent) => {
    if (!iniziato) return;
    e.preventDefault();
    setChiediUscita(true);
  };

  async function invia() {
    setInvio("invio");
    try {
      const esito = await inviaTesseramento(dati);
      if (esito.ok) {
        setCodice(esito.id);
        setInvio("pronto");
        setStep(6);
      } else setInvio("rete");
    } catch {
      setInvio("rete");
    }
  }

  function avanti() {
    if (step === TOTALE_STEP) {
      void invia();
      return;
    }
    const chiavi = Object.keys(valida(step));
    if (chiavi.length) {
      setTentati((t) => (t.includes(step) ? t : [...t, step]));
      focusPrimoErrore(chiavi);
      return;
    }
    setStep(step + 1);
  }

  // Dal riepilogo si torna a un passaggio: i suoi errori restano visibili se gia' tentato.
  const vaiA = (s: number) => setStep(s);

  return (
    <>
      <ModuloShell
        intestazione={INTESTAZIONI[step]}
        step={step}
        totale={TOTALE_STEP}
        titoloRef={titolo}
        onUscita={intercettaUscita}
        etichettaUscita="Esci dal tesseramento"
        indietro={step === 1 ? null : { onClick: () => setStep(step - 1), disabled: invio === "invio" }}
        avanti={{
          etichetta: step < TOTALE_STEP ? "Continua" : invio === "invio" ? "Invio in corso…" : "Invia richiesta",
          onClick: avanti,
          disabled: (step === 1 && !dati.perChi) || invio === "invio",
          busy: invio === "invio",
        }}
      >
        {step <= 4 && <AvvisoErrori numero={numeroErrori} />}

        {step === 1 && (
          <div className="space-y-8">
            <fieldset className="grid gap-4">
              <legend className="sr-only">Per chi è la tessera</legend>
              <SceltaCard name="perChi" value="me" scelta={dati.perChi === "me"} onScegli={() => setDati({ ...dati, perChi: "me" })}>
                <span className="pr-14">
                  <span className="block font-display text-xl">Per me</span>
                  <span className="block text-xs text-ink/75">Ho almeno 18 anni.</span>
                </span>
              </SceltaCard>
              <SceltaCard name="perChi" value="minore" scelta={minore} onScegli={() => setDati({ ...dati, perChi: "minore" })}>
                <span className="pr-14">
                  <span className="block font-display text-xl">Per mio figlio o mia figlia</span>
                  <span className="block text-xs text-ink/75">Ha meno di 18 anni: compili tu i dati e firmi come genitore o tutore.</span>
                </span>
              </SceltaCard>
            </fieldset>
            <div className="flex items-start gap-4 rounded-card border-2 border-ink bg-white p-5">
              <Image src={ILLU.tessera.src} alt="" width={ILLU.tessera.w} height={ILLU.tessera.h} sizes="64px" className="h-auto w-16 shrink-0 object-contain" />
              <div className="text-sm">
                <p className="font-semibold">
                  Quota annuale: {tesseramento.price}. La paghi dopo l&apos;invio: ti scriviamo noi come fare.
                </p>
                <p className="mt-2">Tieni a portata di mano il codice fiscale (anche del genitore, per un minore) e, se ce l&apos;hai, il certificato medico.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && <DatiTesserato dati={dati} errori={errori} onChange={setDati} />}

        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm">
              Per il tesseramento serve un <strong>certificato medico per attività sportiva non agonistica</strong> in corso di validità.
            </p>
            <fieldset id={idCampo("certificato")} tabIndex={-1} className="outline-none">
              <legend className="sr-only">Certificato medico</legend>
              <div className="grid gap-4">
                <SceltaCard
                  name="certificato"
                  value="ora"
                  scelta={dati.certificato === "ora"}
                  onScegli={() => {
                    setDati({ ...dati, certificato: "ora" });
                    scorriAlProssimo(ID_FILE);
                  }}
                >
                  <span className="pr-14">
                    <span className="block font-display text-xl">Lo carico ora</span>
                    <span className="block text-xs text-ink/75">PDF o foto, fino a {CERTIFICATO_MAX_MB} MB.</span>
                  </span>
                </SceltaCard>
                <SceltaCard name="certificato" value="dopo" scelta={dati.certificato === "dopo"} onScegli={() => setDati({ ...dati, certificato: "dopo" })}>
                  <span className="pr-14">
                    <span className="block font-display text-xl">Lo mando dopo</span>
                    <span className="block text-xs text-ink/75">Senza certificato il tesseramento resta da completare: te lo ricordiamo noi.</span>
                  </span>
                </SceltaCard>
              </div>
              <Errore id={`${idCampo("certificato")}-errore`} testo={errori.certificato} />
            </fieldset>

            {dati.certificato === "ora" && (
              <div id={ID_FILE}>
                <label
                  htmlFor={idCampo("file")}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-ink bg-white p-6 text-center focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink",
                    errori.file && "border-red-700 bg-red-50",
                  )}
                >
                  {dati.fileCertificato ? <FileText aria-hidden="true" size={28} /> : <Upload aria-hidden="true" size={28} />}
                  <span className="font-semibold">{dati.fileCertificato ? dati.fileCertificato.name : "Scegli il file del certificato"}</span>
                  <span className="text-xs text-ink/70">
                    {dati.fileCertificato
                      ? `${dimensione(dati.fileCertificato.size)} · tocca per cambiarlo`
                      : "Dal telefono puoi anche scattare una foto."}
                  </span>
                  <input
                    id={idCampo("file")}
                    type="file"
                    accept="application/pdf,image/*"
                    aria-invalid={!!errori.file}
                    aria-describedby={errori.file ? `${idCampo("file")}-errore` : undefined}
                    className="sr-only"
                    onChange={(e) => setDati({ ...dati, fileCertificato: e.target.files?.[0] ?? null })}
                  />
                </label>
                {/* Errore subito, senza aspettare Continua: il file sbagliato si vede appena scelto. */}
                <Errore
                  id={`${idCampo("file")}-errore`}
                  testo={errori.file ?? (dati.fileCertificato ? erroreFile(dati.fileCertificato) ?? undefined : undefined)}
                />
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Spunta chiave="statuto" checked={dati.statuto} errore={errori.statuto} onChange={(v) => setDati({ ...dati, statuto: v })}>
              Ho letto e accetto lo <strong>statuto</strong> e il <strong>regolamento</strong> dell&apos;associazione.
            </Spunta>
            <Spunta chiave="privacy" checked={dati.privacy} errore={errori.privacy} onChange={(v) => setDati({ ...dati, privacy: v })}>
              Ho letto l&apos;<strong>informativa privacy</strong> e acconsento al trattamento dei dati per il tesseramento.
            </Spunta>

            <fieldset id={idCampo("immagini")} tabIndex={-1} className="outline-none">
              <legend className="mb-2 text-sm font-semibold">
                Foto e video: autorizzi l&apos;uso {minore ? "dell'immagine di tuo figlio o tua figlia" : "della tua immagine"} sui
                canali di P&amp;L (sito e Instagram)?
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <SceltaCard
                  name="immagini"
                  value="si"
                  compatta
                  scelta={dati.immagini === "si"}
                  onScegli={() => {
                    setDati({ ...dati, immagini: "si" });
                    scorriAlProssimo(ID_FIRMA);
                  }}
                >
                  <span className="pr-12 text-sm font-semibold">Sì, autorizzo</span>
                </SceltaCard>
                <SceltaCard
                  name="immagini"
                  value="no"
                  compatta
                  scelta={dati.immagini === "no"}
                  onScegli={() => {
                    setDati({ ...dati, immagini: "no" });
                    scorriAlProssimo(ID_FIRMA);
                  }}
                >
                  <span className="pr-12 text-sm font-semibold">No</span>
                </SceltaCard>
              </div>
              <p className="mt-1 text-xs text-ink/70">Facoltativo: il tesseramento vale in entrambi i casi.</p>
              <Errore id={`${idCampo("immagini")}-errore`} testo={errori.immagini} />
            </fieldset>

            <div id={ID_FIRMA}>
              <p id="firma-titolo" className="mb-2 font-display text-lg">
                {minore ? "Firma del genitore o tutore" : "La tua firma"}
              </p>
              {dati.firmaDiPersona ? (
                <p className="rounded-card border-2 border-ink bg-white p-4 text-sm">
                  Firmerai il modulo di persona alla prima lezione.
                </p>
              ) : (
                <Firma
                  id={idCampo("firma")}
                  etichetta={minore ? "Riquadro per la firma del genitore o tutore" : "Riquadro per la tua firma"}
                  descrittoDa={errori.firma ? `${idCampo("firma")}-errore` : undefined}
                  valore={dati.firma}
                  errore={!!errori.firma}
                  onCambia={(firma) => setDati((d) => ({ ...d, firma }))}
                />
              )}
              <Errore id={`${idCampo("firma")}-errore`} testo={errori.firma} />
              <button
                type="button"
                onClick={() => setDati({ ...dati, firmaDiPersona: !dati.firmaDiPersona })}
                className="mt-3 text-sm font-semibold underline underline-offset-4"
              >
                {dati.firmaDiPersona ? "Preferisco firmare qui" : "Non riesco a firmare qui: firmo di persona alla prima lezione"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            {invio === "rete" && (
              <p role="alert" className="rounded-card border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Non siamo riusciti a inviare la richiesta. Controlla la connessione e premi di nuovo Invia: i dati sono ancora qui.
              </p>
            )}
            <dl className="rounded-card border-2 border-ink bg-white px-5 shadow-hard-lg">
              <Voce titolo="Per chi" step={1} onModifica={vaiA}>
                {minore ? "Per mio figlio o mia figlia" : "Per me"}
              </Voce>
              <Voce titolo="Tesserato" step={2} onModifica={vaiA}>
                <span className="block font-semibold">
                  {dati.tesserato.nome} {dati.tesserato.cognome}
                </span>
                <span className="block text-sm">
                  Nato/a il {formattaNascita(dati.tesserato.nascita)} a {dati.tesserato.luogoNascita}
                </span>
                <span className="block text-sm">CF {dati.tesserato.codiceFiscale}</span>
                <span className="block text-sm">
                  {dati.tesserato.indirizzo}, {dati.tesserato.cap} {dati.tesserato.comune}
                </span>
              </Voce>
              {minore ? (
                <Voce titolo="Genitore o tutore" step={2} onModifica={vaiA}>
                  <span className="block font-semibold">
                    {dati.genitore.nome} {dati.genitore.cognome}
                  </span>
                  <span className="block text-sm">CF {dati.genitore.codiceFiscale}</span>
                  <span className="block break-all text-sm">{dati.genitore.email}</span>
                  <span className="block text-sm">{dati.genitore.telefono}</span>
                </Voce>
              ) : (
                <Voce titolo="Contatti" step={2} onModifica={vaiA}>
                  <span className="block break-all text-sm">{dati.contatti.email}</span>
                  <span className="block text-sm">{dati.contatti.telefono}</span>
                </Voce>
              )}
              <Voce titolo="Certificato medico" step={3} onModifica={vaiA}>
                {dati.certificato === "ora" && dati.fileCertificato ? `Caricato: ${dati.fileCertificato.name}` : "Lo mandi dopo"}
              </Voce>
              <Voce titolo="Consensi e firma" step={4} onModifica={vaiA}>
                <span className="block text-sm">Statuto e regolamento: accettati</span>
                <span className="block text-sm">Privacy: accettata</span>
                <span className="block text-sm">Foto e video: {dati.immagini === "si" ? "autorizzati" : "non autorizzati"}</span>
                {dati.firmaDiPersona ? (
                  <span className="block text-sm">Firma: di persona alla prima lezione</span>
                ) : (
                  dati.firma && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dati.firma} alt="Firma inserita" className="mt-2 h-14 w-auto rounded border border-ink/20 bg-white" />
                  )
                )}
              </Voce>
            </dl>
            <p className="rounded-card border-2 border-ink bg-mustard p-4 text-sm font-semibold">
              Quota annuale: {tesseramento.price}. Dopo l&apos;invio ti scriviamo a {email} come pagarla.
            </p>
          </div>
        )}

        {step === 6 && codice && (
          <div className="space-y-8">
            <Image
              src={ILLU.tessera.src}
              alt={ILLU.tessera.alt}
              width={ILLU.tessera.w}
              height={ILLU.tessera.h}
              sizes="(min-width: 640px) 240px, 60vw"
              className="mx-auto h-auto w-full max-w-[240px] object-contain"
            />
            <div className="rounded-card border-2 border-ink bg-white p-5 shadow-hard-lg">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/70">Codice richiesta</p>
              <p className="font-display text-2xl">{codice}</p>
              <p className="mt-4 text-sm">
                Abbiamo mandato il riepilogo a <strong className="break-all">{email}</strong>.
              </p>
              <h2 className="mt-6 font-display text-xl">Cosa manca</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                <li>
                  <strong>La quota annuale ({tesseramento.price})</strong>: ti scriviamo come pagarla.
                </li>
                {dati.certificato === "dopo" && (
                  <li>
                    <strong>Il certificato medico</strong>: mandacelo rispondendo alla stessa email.
                  </li>
                )}
                {dati.firmaDiPersona && (
                  <li>
                    <strong>La firma</strong>: la mettiamo insieme alla prima lezione.
                  </li>
                )}
              </ol>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/prenota" className="btn-press rounded-btn bg-ink px-6 py-3 text-center font-semibold text-white">
                Prenota una lezione
              </Link>
              <Link href="/" className="btn-press rounded-btn bg-white px-6 py-3 text-center font-semibold">
                Torna al sito
              </Link>
            </div>
          </div>
        )}
      </ModuloShell>
      <EsciDialog
        aperto={chiediUscita}
        onResta={() => setChiediUscita(false)}
        onEsci={() => router.push("/")}
        testo="Il tesseramento non è ancora inviato: se esci, i dati inseriti finora andranno persi."
        etichettaResta="Continua il tesseramento"
      />
    </>
  );
}
