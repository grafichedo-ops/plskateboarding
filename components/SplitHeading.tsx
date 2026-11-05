import { cn } from "@/lib/utils";

/**
 * Titolo bicolore dei frame Figma: le prime `split` parole nel colore di
 * accento, il resto nel nero di brand. Il punto di taglio arriva da
 * content/copy.ts (campo hNSplit), non e' deciso qui: il testo resta unica
 * fonte di verita'.
 */
export function SplitHeading({
	text,
	split,
	as: Tag = "h2",
	className,
	accento = "text-white",
	aCapo = false,
	"data-anim": dataAnim,
}: {
	text: string;
	split: number;
	as?: "h1" | "h2";
	className?: string;
	/**
	 * Classe di colore delle prime `split` parole. Bianco sulle sezioni
	 * mustard della homepage, "text-mustard" su quelle chiare di /homepage2,
	 * dove il bianco sparirebbe sul fondo.
	 */
	accento?: string;
	/**
	 * Manda la seconda parte a capo invece di lasciarla scorrere. Serve dove il
	 * mockup spezza il titolo esattamente sul taglio di colore e non alla
	 * larghezza della colonna.
	 */
	aCapo?: boolean;
	/** Marcatore letto da ScrollStage per animare l'elemento singolarmente. */
	"data-anim"?: boolean;
}) {
	const words = text.split(" ");
	const accentate = words.slice(0, split).join(" ");
	const ink = words.slice(split).join(" ");

	return (
		<Tag className={cn("font-display", className)} data-anim={dataAnim}>
			<span className={cn(accento, aCapo && "block")}>{accentate}</span>
			{ink &&
				(aCapo ? (
					<span className="block text-ink">{ink}</span>
				) : (
					<> <span className="text-ink">{ink}</span></>
				))}
		</Tag>
	);
}
