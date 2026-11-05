"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BOXED_MAXW } from "@/components/Boxed";
import { nav } from "@/content/copy";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

/**
 * Header del sito (@efferd/header-2), riallineato al brand P&L:
 * contenuti da content/copy.ts (nav.logo / nav.links / nav.cta),
 * colori dai token shadcn mappati sulla palette in app/globals.css.
 *
 * Breakpoint desktop a `lg` e non `md`: le 5 voci italiane
 * ("Corsi e Lezioni", "Tesseramenti"...) non entrano a 768px.
 * Se cambi qui, cambia anche il `lg:hidden` di components/mobile-nav.tsx.
 */
export function Header({
	trasparente = false,
	navCentrata = false,
	boxed = false,
}: {
	/**
	 * Header senza sfondo, per pagine il cui hero ha un giallo diverso dal
	 * mustard del sito (es. /homepage2, i cui frame hanno fondo #d19e1b):
	 * con lo sfondo pieno si vedrebbe lo stacco fra i due gialli.
	 * Predefinito false, quindi la homepage resta identica.
	 */
	trasparente?: boolean;
	/**
	 * Da lg: logo a sinistra, menu al centro, CTA a destra, invece di menu e
	 * CTA tutti spinti a destra. Serve dove l'hero ha grafica in alto a destra
	 * (il logo P&L di /homepage2): con un header trasparente e il menu a destra,
	 * le voci finivano sopra la P nera e diventavano illeggibili.
	 * Predefinito false, quindi la homepage resta identica.
	 */
	navCentrata?: boolean;
	/**
	 * Allinea il contenuto dell'header alla stessa scatola delle sezioni
	 * (components/Boxed.tsx). Senza, su schermi oltre i 1800px il logo resta
	 * a 64px dal bordo mentre i titoli rientrano verso il centro.
	 * Predefinito false, quindi la homepage resta identica.
	 */
	boxed?: boolean;
} = {}) {
	const inScroll = useScroll(10);
	/** Homepage: la barra si restringe a pill col fondo mustard translucido. */
	const scrolled = inScroll && !trasparente;
	/**
	 * /homepage2: trasparente sul banner in cima, fondo bianco appena si scorre.
	 * Senza, le voci del menu passavano sopra ai contenuti delle sezioni sotto
	 * e diventavano illeggibili (il logo P&L nero, i titoli, le foto).
	 */
	const scrolledBianco = inScroll && trasparente;

	const voci = nav.links.map((link) => (
		<Button asChild key={link.href} size="sm" variant="ghost">
			<Link href={link.href}>{link.label}</Link>
		</Button>
	));
	const cta = (
		<Button asChild className="btn-press ml-2 rounded-btn" size="sm">
			<Link href="/prenota">{nav.cta}</Link>
		</Button>
	);

	return (
		<header
			className={cn(
				// fixed e non sticky: da sticky l'header occupava ~58px di flusso e il
				// palcoscenico partiva sotto di lui, creando lo stacco fra il suo giallo
				// e il mustard della pagina (piu' i due bordi verticali, visto che e'
				// largo max-w-5xl). Fuori dal flusso, l'hero parte da y=0 e gli scorre
				// sotto: il logo di sfondo passa dietro alla barra invece di essere
				// tagliato dal suo bordo inferiore.
				// bg-mustard: colore dell'header nello stato iniziale, prima che lo
				// scroll lo trasformi. Quando `scrolled` diventa true, il bg-background/95
				// piu' sotto lo sostituisce: se ne occupa twMerge dentro cn(), che a
				// parita' di utility tiene l'ultima dichiarata.
				"fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-full border-transparent border-b lg:border lg:transition-all lg:ease-out",
				!trasparente && "bg-mustard",
				// Va prima del blocco `scrolled` qui sotto: a parita' di utility
				// twMerge tiene l'ultima dichiarata, e la homepage deve continuare
				// a vincere con il suo bg-background/95.
				scrolledBianco &&
					"bg-white shadow-[0_2px_18px_rgba(20,20,20,0.10)] transition-colors duration-300",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 lg:top-2 lg:max-w-4xl lg:rounded-md lg:shadow-hard-sm":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-16 w-full items-center justify-between px-8 md:px-16 lg:h-14 lg:transition-all lg:ease-out",
					boxed && BOXED_MAXW,
					// tre colonne con i lati a 1fr: il menu resta al centro esatto
					// dello schermo anche se logo e CTA hanno larghezze diverse
					navCentrata && "lg:grid lg:grid-cols-[1fr_auto_1fr]",
					{
						"lg:px-2": scrolled,
					}
				)}
			>
				<Link
					className={cn(
						"rounded-md px-2 py-1 font-display text-xl hover:bg-muted",
						// in griglia l'elemento si allargherebbe a tutta la colonna
						navCentrata && "lg:justify-self-start"
					)}
					href="/"
				>
					{nav.logo}
				</Link>
				{navCentrata ? (
					<>
						<div className="hidden items-center gap-1 lg:flex lg:justify-self-center">
							{voci}
						</div>
						<div className="hidden lg:flex lg:justify-self-end">{cta}</div>
					</>
				) : (
					<div className="hidden items-center gap-1 lg:flex">
						{voci}
						{cta}
					</div>
				)}
				<MobileNav />
			</nav>
		</header>
	);
}
