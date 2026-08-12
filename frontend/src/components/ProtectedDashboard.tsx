import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { getCurrentUser, type AuthUser } from '../services/auth';
import { DashboardPage } from './DashboardPage';

export function ProtectedDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="p-10 text-cream">Verificando sesión…</p>;
  if (!user) return <Navigate replace to="/login" />;
  if (user.role === 'CUSTOMER') return <Navigate replace to="/reservar" />;
  return <DashboardPage user={user} />;
}
