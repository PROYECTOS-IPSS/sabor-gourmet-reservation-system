export function Footer() {
  return (
    <footer className="flex justify-between border-t border-line px-nav py-footer-y font-mono text-micro uppercase tracking-footer text-footer max-phone:flex-col max-phone:items-start max-phone:gap-2.5 max-phone:px-mobile-shell">
      <span>Sabor Gourmet / 2026</span>
      <span>Miércoles — Domingo · 18:00 — 23:00</span>
      <a className="text-gold" href="mailto:hola@saborgourmet.local">
        hola@saborgourmet.local ↗
      </a>
    </footer>
  );
}
