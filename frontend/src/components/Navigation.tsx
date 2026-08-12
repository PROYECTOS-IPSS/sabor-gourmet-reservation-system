import { Link, NavLink, useNavigate } from 'react-router';
import { logout, notifySessionChange, useSession } from '../services/session';

export function Navigation() {
  const navigate = useNavigate();
  const { loading, user } = useSession();

  async function handleLogout() {
    await logout();
    notifySessionChange();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="flex items-center justify-between border-b border-line px-nav py-7 max-phone:flex-wrap max-phone:py-5" aria-label="Navegación principal">
      <Link className="flex items-center gap-3 text-brand font-semibold tracking-brand" to="/" aria-label="Sabor Gourmet, inicio">
        <span className="inline-flex size-mark items-center justify-center rounded-full bg-gold font-display text-xs text-ink">SG</span>
        <span>Sabor Gourmet</span>
      </Link>
      <div className="flex items-center gap-8 text-sm text-muted max-phone:mt-4 max-phone:w-full max-phone:justify-end max-phone:gap-2">
        <a className="hover:text-gold max-phone:hidden" href="/#carta">La carta</a>
        <a className="hover:text-gold max-phone:hidden" href="/#experiencia">La experiencia</a>
        <NavLink className={({ isActive }) => `border px-4 py-cta-y ${isActive ? 'border-gold bg-gold text-ink' : 'border-brown-line text-cream'}`} to="/reservar">Reservar mesa <span className="ml-2">↗</span></NavLink>
        {!loading && !user && <><Link className="border border-brown-line px-4 py-cta-y text-cream" to="/registrarse">Registrarse</Link><Link className="border border-gold bg-gold px-4 py-cta-y text-ink" to="/login">Iniciar sesión</Link></>}
        {!loading && user && <button className="border border-gold bg-gold px-4 py-cta-y text-ink" onClick={handleLogout} type="button">Cerrar sesión</button>}
      </div>
    </nav>
  );
}
