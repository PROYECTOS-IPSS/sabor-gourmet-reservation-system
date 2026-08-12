export function Navigation() {
  return (
    <nav
      className="flex items-center justify-between border-b border-line px-nav py-7 max-phone:py-5"
      aria-label="Navegación principal"
    >
      <a
        className="flex items-center gap-3 text-brand font-semibold tracking-brand"
        href="/"
        aria-label="Sabor Gourmet, inicio"
      >
        <span className="inline-flex size-mark items-center justify-center rounded-full bg-gold font-display text-xs text-ink">
          SG
        </span>
        <span>Sabor Gourmet</span>
      </a>
      <div className="flex items-center gap-8 text-xs text-muted">
        <a className="hover:text-gold max-phone:hidden" href="#carta">
          La carta
        </a>
        <a className="hover:text-gold max-phone:hidden" href="#experiencia">
          La experiencia
        </a>
        <a className="border border-brown-line px-4 py-cta-y text-cream" href="#reservar">
          Reservar mesa <span className="ml-2 text-gold">↗</span>
        </a>
      </div>
    </nav>
  );
}
