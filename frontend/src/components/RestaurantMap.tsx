const tables = Array.from({ length: 12 }, (_, index) => ({
  capacity: (index % 8) + 1,
  number: index + 1,
}));

export function RestaurantMap() {
  return (
    <section className="min-w-0 overflow-hidden border border-line bg-note text-cream" aria-labelledby="room-map-title">
      <div className="border-b border-line p-6 pb-5 max-phone:p-5">
        <p className="mb-3 font-mono text-micro uppercase tracking-label text-gold">El salón · 01</p>
        <h2 className="m-0 max-w-booking font-display text-feature font-medium leading-heading tracking-heading" id="room-map-title">Una mesa a tu medida.</h2>
        <p className="mt-4 max-w-booking text-sm leading-copy text-muted">Explora la distribución. El sistema elegirá automáticamente la mesa adecuada para tu grupo.</p>
        <span className="mt-5 inline-block border border-brown-line px-3 py-2 font-mono text-[9px] uppercase tracking-label text-gold">Asignación automática</span>
      </div>

      <div className="p-6 max-phone:p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-label text-muted">
          <span>Plano de mesas</span>
          <span>1 — 8 personas</span>
        </div>
        <div className="grid grid-cols-3 gap-3 border border-line bg-ink/40 p-4" aria-label="Distribución visual de las mesas">
          {tables.map((table) => {
            const largeTable = table.capacity >= 5;
            return (
              <div
                aria-label={`Mesa ${table.number}, capacidad ${table.capacity} personas`}
                className={`flex min-w-0 min-h-20 flex-col items-center justify-center overflow-hidden border px-2 py-3 text-center transition-colors duration-200 ${largeTable ? 'border-gold/70 bg-gold/10' : 'border-brown-line bg-note'} hover:border-gold hover:bg-gold hover:text-ink`}
                key={table.number}
              >
                <strong className="block max-w-full truncate font-display text-2xl font-medium leading-none sm:text-3xl">{String(table.number).padStart(2, '0')}</strong>
                <span className="mt-2 max-w-full whitespace-nowrap font-mono text-[8px] uppercase leading-none tracking-label opacity-70">{table.capacity} pers.</span>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
          <span><i className="mr-2 inline-block size-2 rounded-full bg-gold" aria-hidden="true" />Capacidad disponible</span>
          <span>12 mesas configuradas</span>
        </div>
      </div>
    </section>
  );
}
