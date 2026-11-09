import type { Metadata } from "next";
import { TesseramentoWizard } from "@/components/tesseramento/TesseramentoWizard";

export const metadata: Metadata = {
  title: "Tesseramento online — P&L Skateboarding",
  description:
    "Tesserati online a P&L Skateboarding: dati, certificato medico e firma in pochi passaggi, anche per i minori con il genitore.",
};

export default function TesseramentoPage() {
  return <TesseramentoWizard />;
}
