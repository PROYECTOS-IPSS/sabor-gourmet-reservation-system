interface InfoPageProps {
  eyebrow: string;
  title: string;
}

export function InfoPage({ eyebrow, title }: InfoPageProps) {
  return (
    <section className="min-w-0 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell" aria-labelledby="info-title">
      <p className="font-mono text-micro uppercase tracking-label text-label">{eyebrow}</p>
      <h1 className="mt-3 font-display text-booking font-medium leading-heading" id="info-title">{title}</h1>
    </section>
  );
}
