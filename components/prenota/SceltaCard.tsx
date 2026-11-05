import { cn } from "@/lib/utils";

/** Card di scelta singola: un vero radio, quindi tastiera e screen reader funzionano. */
export function SceltaCard({
  name,
  value,
  scelta,
  onScegli,
  children,
}: {
  name: string;
  value: string;
  scelta: boolean;
  onScegli: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-[96px] cursor-pointer items-center overflow-hidden rounded-card border-2 border-ink px-5 py-4 shadow-hard-sm transition-press focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink hover:-translate-y-0.5",
        scelta ? "bg-[#ecd66f]" : "bg-white"
      )}
    >
      <input type="radio" name={name} value={value} checked={scelta} onChange={onScegli} className="sr-only" />
      {children}
      {scelta && (
        <span className="absolute right-3 top-3 flex items-center gap-1.5 text-[11px] font-bold uppercase">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-700" />
          Scelto
        </span>
      )}
    </label>
  );
}
