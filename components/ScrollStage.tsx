"use client";

import React, { useEffect, useRef } from "react";

/**
 * Palcoscenico pinnato della homepage: i 7 "stop-frame" del mockup Figma.
 *
 * Ogni figlio passato a <ScrollStage> e' uno stop. Il palcoscenico resta
 * incollato allo schermo (CSS sticky) per `n * 100vh` di scroll: dentro,
 * il pannello di turno si BLOCCA fermo per la maggior parte dello stop e
 * si SBLOCCA solo nel breve incrocio con il successivo.
 *
 * Il video di sfondo (skater che grinda il rail) e' scrubbato a tre
 * segmenti, non linearmente, per far combaciare la discesa con i frame:
 * nel mockup lo skater non c'e' nel frame 1, scende nei frame 2-5 e non
 * c'e' piu' nei frame 6-7. Uno scrub lineare sbagliava lo stop 6, dove
 * lo skater sarebbe stato ancora sul rail (vedi GRIND qui sotto).
 *
 * Due ScrollTrigger distinti, non uno solo: il video vuole uno scrub
 * lungo (le seek dell'mp4 sono costose, uno scrub corto le fa "battere"),
 * i testi vogliono uno scrub corto per restare reattivi. Con un trigger
 * unico i due condividerebbero per forza la stessa reattivita'.
 *
 * Nota: il pin e' CSS (.stage-viewport in globals.css), non
 * ScrollTrigger `pin: true`. ScrollTrigger qui serve solo come sorgente
 * di progresso.
 */

/** Quota di uno stop spesa nell'incrocio: 0.3 => 70% fermo, 30% in transizione. */
const CROSSFADE = 0.3;

/**
 * Istante del video (in secondi) a cui comincia ciascuno stop.
 * E' una tabella e non una rampa lineare perche' lo skater NON attraversa
 * l'inquadratura a velocita' costante: misurato sul file, resta sulla meta'
 * destra per due terzi della clip (x 70% a 2s, ancora 63% a 4s) e scivola a
 * sinistra solo in fondo (47% a 6.2s, 24% a 6.5s). Con la rampa lineare, al
 * frame 4 si fermava a x 59-82%, cioe' esattamente sotto la foto tonda.
 *
 * Vincoli che questi valori rispettano:
 *  - stop 1 sotto 1.2s        -> rail vuoto, come il frame 1 del mockup
 *  - stop 2..5 dentro 1.2-6.85 -> la discesa
 *  - stop 6..7 oltre 6.85s     -> rail di nuovo vuoto
 * Lo stop 5 ha una finestra stretta apposta (6.25-6.41): il suo centro cade
 * a 6.33, dove lo skater sta a x 40-59%, e durante la sosta si muove appena
 * invece di attraversare l'inquadratura. Lo stop 6 ha invece una finestra
 * larga (6.41-8.0) proprio per smaltire in fretta i 0.44s che restano prima
 * che lo skater esca di scena a 6.85.
 * Il file e' ricodificato all-intra apposta per lo scrub. Se rigeneri il
 * video rimisura tutto: dipende da durata, fps e montaggio.
 */
const STOP_TIMES = [0, 1.2, 3.4, 5.6, 6.25, 6.41, 8.0];

/** Inseguimento dello scroll, in secondi. Video morbido, testi reattivi. */
const SCRUB = { video: 1.2, panels: 0.4 };

/** Spostamento verticale, in px, con cui un elemento entra ed esce. */
const DRIFT = 24;

/** Mai "none" sulle comparse: la' serve una curva, non una rampa lineare. */
const EASE = { enter: "power2.out", exit: "power2.in" };

/** Ritardo a cascata fra elementi della stessa sezione, in unita' di timeline. */
const STAGGER = 0.05;

/** Durata minima di una singola comparsa, sotto la quale non e' piu' leggibile. */
const MIN_ITEM_DURATION = 0.12;

/**
 * Distribuisce `count` elementi dentro la finestra di incrocio: restituisce
 * durata e stagger tali che l'ultimo elemento finisca esattamente a fine
 * finestra, senza sbordare nello stop successivo.
 */
function fitStagger(count: number) {
	if (count <= 1) return { duration: CROSSFADE, stagger: 0 };
	let stagger = STAGGER;
	let duration = CROSSFADE - stagger * (count - 1);
	if (duration < MIN_ITEM_DURATION) {
		duration = MIN_ITEM_DURATION;
		stagger = (CROSSFADE - duration) / (count - 1);
	}
	return { duration, stagger };
}

export function ScrollStage({ children }: { children: React.ReactNode }) {
	const panels = React.Children.toArray(children);

	const stageRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		// Stessa media query del fallback in globals.css: li' il layout torna
		// a colonna, qui non costruiamo proprio le timeline.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		let ctx: gsap.Context | undefined;

		(async () => {
			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import("gsap"),
				import("gsap/ScrollTrigger"),
			]);
			gsap.registerPlugin(ScrollTrigger);

			const stage = stageRef.current;
			const video = videoRef.current;
			const stops = panelRefs.current.filter(
				(panel): panel is HTMLDivElement => panel !== null
			);
			if (!stage || !video || stops.length === 0) return;

			ctx = gsap.context(() => {
				const trigger = {
					trigger: stage,
					start: "top top",
					end: "bottom bottom",
					invalidateOnRefresh: true,
				};

				// --- 1. Video: scrub 1:1, ease "none" e' corretto qui ---------------
				const buildVideo = () => {
					const tl = gsap.timeline({
						defaults: { ease: "none" },
						scrollTrigger: { ...trigger, scrub: SCRUB.video },
					});

					// Un tratto lineare per stop: dentro al singolo stop lo scrub resta 1:1
					// con lo scroll (ease "none"), e' la tabella a cambiare passo da uno
					// stop all'altro. L'ultimo stop chiude sulla durata del file.
					const total = video.duration;
					if (total && STOP_TIMES.length === stops.length) {
						const tappa = (i: number) =>
							Math.min(i >= stops.length ? total : STOP_TIMES[i], total);
						tl.fromTo(
							video,
							{ currentTime: 0 },
							{ currentTime: tappa(1), duration: 1 },
							0
						);
						for (let i = 1; i < stops.length; i++) {
							tl.to(video, { currentTime: tappa(i + 1), duration: 1 }, i);
						}
					} else if (total) {
						tl.fromTo(
							video,
							{ currentTime: 0 },
							{ currentTime: total, duration: stops.length },
							0
						);
					}
				};

				// --- 2. Pannelli: comparse con easing e cascata ---------------------
				const tl = gsap.timeline({
					scrollTrigger: { ...trigger, scrub: SCRUB.panels },
				});

				// Ancora di durata. Senza, questa timeline finirebbe a `stops - 0.85`
				// (l'ultimo stop non ha uscita) mentre quella del video finisce a
				// `stops`: mappate sullo stesso scroll, i pannelli anticiperebbero
				// il video e gli stop non cadrebbero piu' dove li vuole il mockup.
				tl.to({}, { duration: stops.length }, 0);

				stops.forEach((panel, i) => {
					const marked = panel.querySelectorAll<HTMLElement>("[data-anim]");
					// Sezioni non ancora convertite: si anima il pannello in blocco.
					const items = marked.length ? Array.from(marked) : [panel];
					const perElement = marked.length > 0;
					const { duration, stagger } = fitStagger(items.length);

					const entersAt = i - CROSSFADE / 2;
					const exitsAt = i + 1 - CROSSFADE / 2;

					if (i > 0) {
						// visibility sul pannello: tiene link e bottoni degli stop
						// nascosti fuori dal focus da tastiera, non solo invisibili.
						if (perElement) tl.set(panel, { autoAlpha: 1 }, entersAt);
						tl.fromTo(
							items,
							{ autoAlpha: 0, y: DRIFT },
							{
								autoAlpha: 1,
								y: 0,
								duration,
								stagger,
								ease: EASE.enter,
							},
							entersAt
						);
					}

					if (i < stops.length - 1) {
						tl.to(
							items,
							{
								autoAlpha: 0,
								y: -DRIFT,
								duration,
								stagger,
								ease: EASE.exit,
							},
							exitsAt
						);
						if (perElement) tl.set(panel, { autoAlpha: 0 }, exitsAt + CROSSFADE);
					}
				});

				// duration serve per lo scrub: se i metadati non ci sono ancora, aspetta.
				if (video.readyState >= 1) {
					buildVideo();
				} else {
					video.addEventListener("loadedmetadata", buildVideo, { once: true });
				}
			}, stage);
		})();

		return () => ctx?.revert();
	}, []);

	return (
		<div
			ref={stageRef}
			className="stage"
			style={{ "--stage-stops": panels.length } as React.CSSProperties}
		>
			<div className="stage-viewport bg-mustard">
				{/*
					Niente specchio: skater-grind-scrub.mp4 e' gia' inquadrato come il
					mockup (rail che sale verso destra, scale in basso a destra, skater
					che scende da destra verso sinistra), quindi la meta' sinistra resta
					libera per titoli e CTA. Il vecchio skater-grind.mp4 era speculare e
					richiedeva -scale-x-100: se torni a quello, rimettilo.
				*/}
				<video
					ref={videoRef}
					src="/video/skater-grind-scrub.mp4"
					muted
					playsInline
					preload="auto"
					aria-hidden="true"
					className="stage-video absolute inset-0 h-full w-full object-cover"
				/>

				{panels.map((panel, i) => (
					<div
						key={i}
						ref={(el) => {
							panelRefs.current[i] = el;
						}}
						className="stage-panel"
						data-first={i === 0}
					>
						{panel}
					</div>
				))}
			</div>
		</div>
	);
}
