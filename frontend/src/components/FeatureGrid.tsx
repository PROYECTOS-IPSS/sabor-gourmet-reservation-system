import { Eyebrow } from './ui/Eyebrow';
import { FeatureCard } from './ui/FeatureCard';
import { QuoteCard } from './ui/QuoteCard';

export function FeatureGrid() {
  return (
    <section
      aria-labelledby="carta-title"
      className="grid grid-cols-3 px-shell py-feature-y max-phone:block max-phone:px-mobile-shell max-phone:py-feature-mobile-y"
      id="carta"
    >
      <div className="col-span-full mb-10 max-phone:mb-8">
        <Eyebrow>La carta</Eyebrow>
        <h2 className="m-0 max-w-booking font-display text-booking font-medium leading-heading tracking-heading" id="carta-title">
          Sabores para recordar
        </h2>
      </div>
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
