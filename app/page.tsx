import { Header } from "@/components/header";
import { HeroSkaterTracker } from "@/components/sections/HeroSkaterTracker";
import { ChiSiamoChiaro } from "@/components/sections/ChiSiamoChiaro";
import { CorsiCaroselloChiaro } from "@/components/sections/CorsiCaroselloChiaro";
import { DoveFacciamoChiaro } from "@/components/sections/DoveFacciamoChiaro";
import { TesseramentoChiaro } from "@/components/sections/TesseramentoChiaro";
import { FaqIgCollabChiaro } from "@/components/sections/FaqIgCollabChiaro";
import { OutroChiaro } from "@/components/sections/OutroChiaro";
import { FooterChiaro } from "@/components/sections/FooterChiaro";

/** Homepage ufficiale (ex /homepage2). La vecchia versione a scroll e' in /draft/homepage-scroll. */
export default function Home() {
  return (
    <>
      <Header trasparente navCentrata boxed />
      <HeroSkaterTracker />
      <ChiSiamoChiaro />
      <CorsiCaroselloChiaro />
      <DoveFacciamoChiaro />
      <TesseramentoChiaro />
      <FaqIgCollabChiaro />
      <OutroChiaro />
      <FooterChiaro />
    </>
  );
}
