import type { Metadata } from "next";
import { Header } from "@/components/header";
import { ScrollStage } from "@/components/ScrollStage";
import { Hero } from "@/components/sections/Hero";
import { ChiSiamo } from "@/components/sections/ChiSiamo";
import { CorsiCarosello } from "@/components/sections/CorsiCarosello";
import { DoveFacciamo } from "@/components/sections/DoveFacciamo";
import { Tesseramento } from "@/components/sections/Tesseramento";
import { FaqIgCollab } from "@/components/sections/FaqIgCollab";
import { Outro } from "@/components/sections/Outro";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "P&L Skateboarding — bozza homepage a scroll",
  description: "Bozza non pubblica: homepage a scroll con video scrubbato.",
  robots: { index: false, follow: false },
};

/** Bozza: ex homepage `/`, tenuta da parte per valutarne un riuso. */
export default function HomepageScrollDraft() {
  return (
    <>
      <Header />

      {/*
        I 7 stop-frame del mockup Figma, nell'ordine: ogni figlio di
        <ScrollStage> e' uno stop che si blocca per ~70% del proprio
        schermo di scroll e si sblocca nell'incrocio con il successivo,
        sopra allo stesso sfondo video scrubbato.
        Aggiungere o togliere un figlio ribilancia da solo la timeline
        e l'altezza del palcoscenico.
      */}
      <ScrollStage>
        <Hero />
        <ChiSiamo />
        <CorsiCarosello />
        <DoveFacciamo />
        <Tesseramento />
        <FaqIgCollab />
        <Outro />
      </ScrollStage>

      {/* Fuori dal pin: sale da sotto quando il palcoscenico si sgancia. */}
      <Footer />
    </>
  );
}
