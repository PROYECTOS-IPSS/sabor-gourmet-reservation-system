import { Link } from 'react-router';
import { RestaurantHoursCard } from './RestaurantHoursCard';
import { Eyebrow } from './ui/Eyebrow';

export function BookingPanel() {
  return (
    <section
      className="grid grid-cols-booking gap-feature-mobile-y bg-panel px-shell pb-16 pt-panel-top text-ink max-phone:block max-phone:px-mobile-shell max-phone:py-panel-mobile"
      id="reservar"
      aria-labelledby="booking-title"
    >
      <div className="max-phone:mb-10">
        <Eyebrow tone="label">Tu noche, a tu ritmo</Eyebrow>
        <h2
          className="m-0 mb-5 font-display text-booking font-medium leading-heading tracking-heading"
          id="booking-title"
        >
          Reserva tu mesa
        </h2>
        <p className="max-w-booking text-copy leading-panel text-panel-copy">
          Revisa nuestros horarios, capacidad y próximas fechas disponibles.
        </p>
      </div>
      <RestaurantHoursCard>
        <Link
          className="mt-7 inline-flex w-full items-center justify-center bg-gold px-submit-x py-submit-y text-sm text-ink hover:bg-cream"
          to="/reservar"
        >
          Ver disponibilidad <span className="ml-2">→</span>
        </Link>
      </RestaurantHoursCard>
    </section>
  );
}
