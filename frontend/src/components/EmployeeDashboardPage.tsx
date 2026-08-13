import type { AuthUser } from '../services/auth';

interface EmployeeDashboardPageProps {
  user: AuthUser;
}

export function EmployeeDashboardPage({ user }: EmployeeDashboardPageProps) {
  return (
    <section className="grid gap-10 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell">
      <div>
        <p className="text-xs uppercase tracking-brand text-label">Panel de gestión</p>
        <h1 className="mt-3 font-display text-booking font-medium leading-heading">Hola, {user.name}</h1>
        <p className="mt-4 max-w-booking text-panel-copy">Administra reservas y mesas desde un mismo lugar.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="border border-line bg-cream p-6">
          <p className="text-xs uppercase tracking-brand text-muted">Sesión</p>
          <h2 className="mt-3 text-xl font-semibold">{user.role}</h2>
          <p className="mt-2 text-sm text-muted">{user.email}</p>
        </article>
        <article className="border border-line bg-cream p-6">
          <p className="text-xs uppercase tracking-brand text-muted">Próximo paso</p>
          <h2 className="mt-3 text-xl font-semibold">Gestionar reservas</h2>
          <p className="mt-2 text-sm text-muted">Consulta disponibilidad y organiza el salón.</p>
        </article>
      </div>
    </section>
  );
}
