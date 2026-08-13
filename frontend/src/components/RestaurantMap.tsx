import { Button } from './ui/Button';

const tables = Array.from({ length: 40 }, (_, index) => ({
  capacity: (index % 8) + 1,
  number: index + 1,
}));

interface RestaurantMapProps {
  onSelectTable: (table: number) => void;
  selectedTable: number | null;
}

export function RestaurantMap({
  onSelectTable,
  selectedTable,
}: RestaurantMapProps) {
  return (
    <div className="min-w-0 overflow-hidden border border-line bg-note p-8 text-cream max-phone:p-4">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">
            Distribución del salón
          </p>
          <h2 className="m-0 max-w-booking font-display text-feature font-medium leading-heading tracking-heading">
            Mesas disponibles.
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 border border-line p-6 max-phone:grid-cols-4 max-phone:gap-3 max-phone:p-4">
        {tables.map((table) => (
          <Button
            aria-label={`Mesa ${table.number}, capacidad ${table.capacity} personas`}
            aria-pressed={selectedTable === table.number}
            key={table.number}
            onClick={() => onSelectTable(table.number)}
            selected={selectedTable === table.number}
            type="button"
            variant="table"
          >
            {table.number}
          </Button>
        ))}
      </div>
      {selectedTable && (
        <div
          className="mt-6 animate-table-detail border-t border-line pt-6"
          aria-live="polite"
          key={selectedTable}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-micro uppercase tracking-label text-gold">
                Detalle de mesa
              </p>
              <h3 className="m-0 font-display text-feature font-medium leading-heading tracking-heading">
                Mesa {selectedTable}
              </h3>
            </div>
            <span className="font-mono text-micro uppercase tracking-label text-gold">
              Activa
            </span>
          </div>
          <dl className="mt-6 border-t border-line">
            <div className="flex justify-between border-b border-line py-3">
              <dt className="text-sm text-muted">Capacidad</dt>
              <dd className="m-0 text-sm text-cream">
                {
                  tables.find((table) => table.number === selectedTable)
                    ?.capacity
                }{' '}
                personas
              </dd>
            </div>
            <div className="flex justify-between border-b border-line py-3">
              <dt className="text-sm text-muted">Estado</dt>
              <dd className="m-0 text-sm text-cream">Activa</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
