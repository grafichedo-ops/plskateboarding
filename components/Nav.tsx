import { nav } from "@/content/copy";

/**
 * Nav di base, funzionante da subito.
 * Da sostituire con @efferd/header-2 una volta installato (vedi README.md
 * in root per gli step shadcn). Mantieni gli stessi link/CTA da content/copy.ts
 * quando fai lo swap, così il contenuto resta la unica fonte di verità.
 */
export function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6 md:px-16">
      <span className="font-display text-2xl">{nav.logo}</span>

      <nav className="hidden md:flex items-center gap-8 text-ink/90">
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:opacity-70 transition-opacity"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#prenota"
        className="rounded-md bg-white px-5 py-3 font-semibold text-ink hover:bg-white/90 transition-colors"
      >
        {nav.cta}
      </a>
    </header>
  );
}
