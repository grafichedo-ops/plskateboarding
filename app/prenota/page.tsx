import type { Metadata } from "next";
import { PrenotaWizard } from "@/components/prenota/PrenotaWizard";
import { fasciaValida, formulaValida } from "@/lib/prenota/regole";

export const metadata: Metadata = {
  title: "Prenota una lezione di skate a Roma — P&L Skateboarding",
  description: "Prenota online corsi e lezioni private di skate a Roma per bambini, ragazzi e adulti.",
};

export default async function PrenotaPage({
  searchParams,
}: {
  searchParams: Promise<{ fascia?: string; formula?: string }>;
}) {
  const { fascia, formula } = await searchParams;
  const fasciaIniziale = fasciaValida(fascia);
  return (
    <PrenotaWizard
      fasciaIniziale={fasciaIniziale}
      formulaIniziale={formulaValida(formula, fasciaIniziale)}
    />
  );
}
