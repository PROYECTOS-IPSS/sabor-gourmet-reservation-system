import { Link } from 'react-router';
import { Eyebrow } from './ui/Eyebrow';

export function HeroSection() {
  return (
    <section
      className="relative min-h-hero px-shell pb-hero-bottom pt-hero-top max-phone:min-h-hero-mobile max-phone:px-mobile-shell max-phone:pb-20 max-phone:pt-hero-mobile-top"
      id="experiencia"
    >
      <div>
        <Eyebrow>Cocina de autor · Managua</Eyebrow>
        <h1 className="relative z-10 m-0 font-display text-hero font-medium leading-display tracking-display">
          Una mesa para
          <br />
          <em className="font-medium text-gold">recordar.</em>
        </h1>
        <p className="mt-hero-copy-top mb-hero-copy-bottom max-w-intro text-base leading-copy text-muted">
          Ingredientes de temporada, fuego lento y una noche hecha a tu medida.
          Tu próxima historia empieza aquí.
        </p>
        <Link
          className="inline-block border-b border-brown-line pb-link font-mono text-eyebrow uppercase tracking-link hover:text-gold"
          to="/reservar"
        >
          Encuentra tu mesa <span className="ml-2 text-gold">↓</span>
        </Link>
      </div>
      <div
        className="absolute right-stamp-right top-28 flex size-stamp rotate-stamp flex-col items-center justify-center gap-1 rounded-full border border-brown-line font-mono text-stamp tracking-stamp text-gold max-phone:right-stamp-mobile-right max-phone:top-stamp-mobile-top"
        aria-hidden="true"
      >
        <span>DESDE</span>
        <strong className="font-display text-stamp-year font-medium tracking-display-tight text-cream">
          2018
        </strong>
        <span>HECHO CON CALMA</span>
      </div>
      <div
        className="absolute -right-orbit-right top-orbit-top size-orbit rounded-full border border-line max-phone:-right-orbit-mobile-right max-phone:top-orbit-mobile-top max-phone:size-orbit-mobile"
        aria-hidden="true"
      >
        <span className="absolute inset-7 rounded-full border border-line" />
        <span className="absolute inset-orbit-inset rounded-full border border-line" />
        <span className="absolute right-orbit-dot-right top-orbit-dot-top size-2 rounded-full bg-gold max-phone:right-orbit-dot-mobile-right max-phone:top-orbit-dot-mobile-top" />
      </div>
    </section>
  );
}
