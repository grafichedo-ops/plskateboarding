import Image from "next/image";
import { footer } from "@/content/copy";

/**
 * Stop 7 del palcoscenico: rail di nuovo vuoto e logo P&L al centro.
 * E' l'ultimo fermo prima che il pin si sganci e il <Footer /> nero
 * salga da sotto, come nel frame 7 del mockup.
 */
export function Outro() {
  return (
    <div className="flex h-full w-full items-center justify-center px-8 pt-16 md:px-16 lg:pt-14">
      <Image
        src="/images/logo-footer.png"
        alt={footer.logo}
        width={896}
        height={826}
        className="h-[38vh] w-auto object-contain"
      />
    </div>
  );
}
