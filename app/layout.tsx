import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { Inter, Lilita_One } from "next/font/google";
import "./globals.css";

// Inter — font body/UI, da Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Sostituto gratuito di Cubano: resta attivo finche' manca Cubano.woff2.
const sostituto = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sostituto",
  display: "swap",
});

// Cubano — font display/headline, licenza da acquistare/scaricare a parte.
// NON passa da next/font/local: quello e' un import risolto a build-time e
// fa fallire la compilazione se il .woff2 non c'e' ancora. Il @font-face
// viene scritto qui sotto solo se il file esiste (controllo lato server, alla
// build): senza file niente richiesta e niente 404 in console. Dopo aver
// aggiunto public/fonts/Cubano.woff2 basta una nuova build.
const HA_CUBANO = existsSync(path.join(process.cwd(), "public", "fonts", "Cubano.woff2"));
const CUBANO_CSS =
  '@font-face{font-family:"Cubano";src:url("/fonts/Cubano.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}';

export const metadata: Metadata = {
  title: "P&L Skateboarding — Lezioni e corsi di skate a Roma",
  description:
    "Lezioni individuali e corsi di gruppo di skateboard a Roma per bambini, ragazzi e adulti. Metodo Push and Learn, a The Quiver (Garbatella) e Colle Oppio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${sostituto.variable}`}>
      {HA_CUBANO && (
        <head>
          <style dangerouslySetInnerHTML={{ __html: CUBANO_CSS }} />
        </head>
      )}
      <body>{children}</body>
    </html>
  );
}
