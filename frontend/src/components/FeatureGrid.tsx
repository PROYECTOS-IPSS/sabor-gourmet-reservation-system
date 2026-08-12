import { FeatureCard } from './ui/FeatureCard';
import { QuoteCard } from './ui/QuoteCard';

export function FeatureGrid() {
  return (
    <section
      className="grid grid-cols-3 px-shell py-feature-y max-phone:block max-phone:px-mobile-shell max-phone:py-feature-mobile-y"
      id="carta"
    >
      <FeatureCard
        description="Cambiamos con la estación para servir siempre algo honesto, fresco y nuestro."
        number="01"
        title={<>Del mercado<br />a la mesa</>}
      />
      <FeatureCard
        description="Sabores nicaragüenses, técnicas precisas y tiempo para hacer las cosas bien."
        number="02"
        title={<>El fuego<br />como lenguaje</>}
      />
      <QuoteCard />
    </section>
  );
}
