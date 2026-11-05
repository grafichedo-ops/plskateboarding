import { footer } from "@/content/copy";

export function Footer() {
  return (
    <footer className="bg-ink px-8 py-16 md:px-16 text-white">
      <div className="font-display text-6xl md:text-8xl mb-16">
        {footer.logo}
      </div>

      <div className="grid gap-10 sm:grid-cols-3 mb-16">
        {footer.columns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-4 text-sm uppercase text-white/60">
              {column.title}
            </h4>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-mustard transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-sm text-white/50">{footer.copyright}</p>
    </footer>
  );
}
