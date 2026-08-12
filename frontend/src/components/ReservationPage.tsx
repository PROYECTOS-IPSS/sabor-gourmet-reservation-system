import { useState } from 'react';
import { AuthPrompt } from './AuthPrompt';
import { ReservationForm } from './ReservationForm';
import { RestaurantHoursCard } from './RestaurantHoursCard';
import { RestaurantMap } from './RestaurantMap';
import { Eyebrow } from './ui/Eyebrow';

export function ReservationPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  return (
    <section className="bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell max-phone:py-panel-mobile">
      <div className="mb-12 max-w-booking">
        <Eyebrow tone="label">Reserva tu mesa</Eyebrow>
        <h1 className="m-0 font-display text-booking font-medium leading-heading tracking-heading">
          Elige tu lugar
        </h1>
        <p className="mt-5 m-0 text-copy leading-panel text-panel-copy">
          Consulta la distribución del salón y conoce nuestros horarios antes de
          reservar.
        </p>
      </div>
      <div className="grid grid-cols-booking items-start gap-feature-mobile-y max-phone:block">
        <RestaurantMap
          onSelectTable={setSelectedTable}
          selectedTable={selectedTable}
        />
        <div className="min-w-0 max-phone:mt-8">
          <RestaurantHoursCard />
          <ReservationForm selectedTable={selectedTable} />
          <AuthPrompt />
        </div>
      </div>
    </section>
  );
}
