import type { Metadata } from "next";
import { Header } from "@/components/header";
import { HeroSkaterTracker } from "@/components/sections/HeroSkaterTracker";
import { BannerPromo } from "@/components/sections/BannerPromo";
import { ChiSiamoChiaro } from "@/components/sections/ChiSiamoChiaro";
import { CorsiCaroselloChiaro } from "@/components/sections/CorsiCaroselloChiaro";
import { DoveFacciamoChiaro } from "@/components/sections/DoveFacciamoChiaro";
import { TesseramentoChiaro } from "@/components/sections/TesseramentoChiaro";
import { DalleLezioni } from "@/components/sections/DalleLezioni";
import { FaqIgCollabChiaro } from "@/components/sections/FaqIgCollabChiaro";
import { OutroChiaro } from "@/components/sections/OutroChiaro";
import { FooterChiaro } from "@/components/sections/FooterChiaro";
import { banner, meta } from "@/content/copy";

export const metadata: Metadata = meta.home;

/** Homepage ufficiale (ex /homepage2). La vecchia versione a scroll e' in /draft/homepage-scroll. */
export default function Home() {
  return (
    <>
      <Header trasparente navCentrata boxed />
      <main>
        <HeroSkaterTracker />
        <BannerPromo variante="ink" {...banner.fisr} />
        <ChiSiamoChiaro />
        <CorsiCaroselloChiaro />
        <BannerPromo variante="card" {...banner.inclusive} />
        <DoveFacciamoChiaro />
        <TesseramentoChiaro />
        <BannerPromo variante="mustard" {...banner.compleanni} />
        <DalleLezioni />
        <FaqIgCollabChiaro />
        <OutroChiaro />
      </main>
      <FooterChiaro />
    </>
  );
}
