import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { getCurrentUser, type AuthUser } from '../services/auth';
import { DashboardPage } from './DashboardPage';
import { EmployeeDashboardPage } from './EmployeeDashboardPage';

export function ProtectedDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="p-10 text-cream" role="status">Verificando sesión…</p>;
  if (!user) return <Navigate replace to="/login" />;
  if (user.role === 'CUSTOMER') return <Navigate replace to="/reservar" />;
  if (user.role === 'EMPLOYEE') return <EmployeeDashboardPage user={user} />;
  return <DashboardPage user={user} />;
}
