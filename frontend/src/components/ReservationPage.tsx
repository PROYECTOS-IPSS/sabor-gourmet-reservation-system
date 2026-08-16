import { AuthPrompt } from './AuthPrompt';
import { ReservationForm } from './ReservationForm';
import { RestaurantHoursCard } from './RestaurantHoursCard';
import { RestaurantMap } from './RestaurantMap';
import { Eyebrow } from './ui/Eyebrow';
import { useSession } from '../services/session';

export function ReservationPage() {
  const { user } = useSession();

  return (
    <section className="min-w-0 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell max-phone:py-panel-mobile">
      <div className="mb-12 max-w-booking"><Eyebrow tone="label">Reserva tu mesa</Eyebrow><h1 className="m-0 font-display text-booking font-medium leading-heading tracking-heading">Elige tu horario</h1><p className="mt-5 m-0 text-copy leading-panel text-panel-copy">Consulta disponibilidad y deja que el sistema asigne la mejor mesa para tu grupo.</p></div>
      <div className="grid grid-cols-booking items-start gap-feature-mobile-y max-phone:block">
        <RestaurantMap />
        <div className="min-w-0 max-phone:mt-8"><RestaurantHoursCard /><ReservationForm user={user} />{!user && <AuthPrompt />}</div>
      </div>
    </section>
  );
}
