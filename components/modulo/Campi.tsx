import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Id DOM di un campo, usato anche per portarci il focus sul primo errore. */
export const idCampo = (chiave: string) => `campo-${chiave.replace(/\./g, "-")}`;

/** Porta il focus sul primo campo con errore (o sul primo input di un fieldset). */
export function focusPrimoErrore(chiavi: string[]) {
  const primo = chiavi[0];
  if (!primo) return;
  const el = document.getElementById(idCampo(primo));
  const bersaglio = el?.tagName === "FIELDSET" || el?.tagName === "DIV" ? el.querySelector("input") ?? el : el;
  bersaglio?.focus();
}

export const classeInput = (errore?: string) =>
  cn(
    "h-12 w-full rounded-btn border-2 border-ink bg-white px-3 text-base outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    errore && "border-red-700 bg-red-50",
  );

export function Campo({
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
      <input id={id} aria-invalid={!!errore} aria-describedby={descritto} className={classeInput(errore)} {...input} />
      {aiuto && (
        <p id={`${id}-aiuto`} className="mt-1 text-xs text-ink/70">
          {aiuto}
        </p>
      )}
      <Errore id={`${id}-errore`} testo={errore} />
    </div>
  );
}

export function Errore({ id, testo }: { id: string; testo?: string }) {
  if (!testo) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-red-700">
      <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span>{testo}</span>
    </p>
  );
}

export function Blocco({ titolo, id, children }: { titolo: string; id?: string; children: React.ReactNode }) {
  return (
    <fieldset id={id} className="rounded-card border-2 border-ink bg-white p-5 shadow-hard-sm">
      <legend className="-ml-1 rounded-full border-2 border-ink bg-mustard px-3 py-0.5 font-display text-lg">
        {titolo}
      </legend>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Riquadro con il numero di errori, annunciato dagli screen reader. */
export function AvvisoErrori({ numero }: { numero: number }) {
  return (
    <p
      role="status"
      className={
        numero ? "mb-6 rounded-card border-2 border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700" : "sr-only"
      }
    >
      {numero > 0 && (numero === 1 ? "C'è un campo da sistemare." : `Ci sono ${numero} campi da sistemare.`)}
    </p>
  );
}
