export function QuoteCard() {
  return (
    <article className="min-h-feature bg-note pt-5 pr-feature-note-x max-phone:mt-5 max-phone:min-h-0 max-phone:border-0 max-phone:px-0 max-phone:py-feature-mobile-y">
      <span className="font-display text-quote-mark leading-none text-gold">“</span>
      <p className="my-quote-top mb-quote-bottom max-w-quote font-display text-xl leading-quote text-cream">
        La mejor parte de salir a cenar es tener algo que contar al volver.
      </p>
      <small className="font-mono text-micro text-gold">— Equipo Sabor Gourmet</small>
    </article>
  );
}
