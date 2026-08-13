import type { ReactNode } from 'react';
import { reservationMaxGuestsLabel, reservationMinGuests } from './data/reservationRules';
import { restaurantHours } from './data/restaurantSchedule';

interface RestaurantHoursCardProps {
  children?: ReactNode;
  className?: string;
}

export function RestaurantHoursCard({ children, className = '' }: RestaurantHoursCardProps) {
  return (
    <article className={`min-w-0 overflow-hidden bg-ink p-8 text-cream max-phone:p-4 ${className}`.trim()}>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">Información</p>
          <h3 className="m-0 font-display text-feature font-medium leading-heading tracking-heading">Horarios del restaurante</h3>
        </div>
        <span className="font-mono text-micro uppercase tracking-label text-muted">Hoy</span>
      </div>
      <dl className="m-0 border-t border-line">
        {restaurantHours.map(({ day, hours }) => (
          <div className="flex items-center justify-between gap-4 border-b border-line py-4" key={day}>
            <dt className="text-sm text-muted">{day}</dt>
            <dd className="m-0 font-mono text-sm text-cream">{hours}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 grid grid-cols-2 gap-6 border-b border-line pb-7">
        <div>
          <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">Personas</p>
          <p className="m-0 text-base text-cream">{reservationMinGuests} mínimo · máximo según {reservationMaxGuestsLabel}</p>
        </div>
        <div>
          <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">Fechas disponibles</p>
          <p className="m-0 text-base text-cream">Miércoles — Domingo</p>
        </div>
      </div>
      {children}
    </article>
  );
}
