import type { Metadata } from "next";
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
// fa fallire la compilazione se il .woff2 non c'e' ancora. Sta in un
// @font-face dentro app/globals.css, che senza il file ricade su sans-serif
// e lo prende da solo appena lo aggiungi in public/fonts/Cubano.woff2
// (vedi public/fonts/README.md).

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
      <body>{children}</body>
    </html>
  );
}
