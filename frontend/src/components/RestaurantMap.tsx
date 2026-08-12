import { availableDates, restaurantHours } from './data/restaurantSchedule';
import { Button } from './ui/Button';

const tables = Array.from({ length: 40 }, (_, index) => index + 1);

interface RestaurantMapProps {
  onSelectTable: (table: number) => void;
  selectedTable: number | null;
}

export function RestaurantMap({ onSelectTable, selectedTable }: RestaurantMapProps) {
  return (
    <div className="border border-line bg-note p-8 text-cream">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">Distribución del salón</p>
          <h2 className="m-0 max-w-booking font-display text-feature font-medium leading-heading tracking-heading">Mesas disponibles.</h2>
        </div>
        <span className="font-mono text-micro uppercase tracking-label text-muted">40 mesas</span>
      </div>
      <div className="grid grid-cols-5 gap-4 border border-line p-6 max-phone:grid-cols-4 max-phone:gap-3 max-phone:p-4">
        {tables.map((table) => (
          <Button
            aria-label={`Mesa ${table}`}
            aria-pressed={selectedTable === table}
            key={table}
            onClick={() => onSelectTable(table)}
            selected={selectedTable === table}
            type="button"
            variant="table"
          >
            {table}
          </Button>
        ))}
      </div>
      {selectedTable && (
        <div className="mt-6 animate-table-detail border-t border-line pt-6" aria-live="polite" key={selectedTable}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">Detalle de mesa</p>
              <h3 className="m-0 font-display text-feature font-medium leading-heading tracking-heading">Mesa {selectedTable}</h3>
            </div>
            <span className="font-mono text-micro uppercase tracking-label text-gold">Disponible</span>
          </div>
          <p className="mb-3 mt-6 font-mono text-micro uppercase tracking-label text-muted">Horarios disponibles</p>
          <dl className="m-0 border-t border-line">
            {restaurantHours.map(({ day, hours }) => (
              <div className="flex items-center justify-between gap-4 border-b border-line py-3" key={day}>
                <dt className="text-sm text-muted">{day}</dt>
                <dd className="m-0 font-mono text-sm text-cream">{hours}</dd>
              </div>
            ))}
          </dl>
          <p className="mb-3 mt-6 font-mono text-micro uppercase tracking-label text-muted">Fechas disponibles</p>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((date) => (
              <span className="border border-brown-line px-3 py-2 font-mono text-micro text-muted" key={date}>
                {date}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
