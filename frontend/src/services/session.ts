import { useEffect, useState } from 'react';
import { getCurrentUser, type AuthUser } from './auth';

export function useSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => getCurrentUser().then(setUser).finally(() => setLoading(false));
    const handleSessionChange = () => { setLoading(true); load(); };
    load();
    window.addEventListener('auth:changed', handleSessionChange);
    return () => window.removeEventListener('auth:changed', handleSessionChange);
  }, []);

  return { loading, user };
}

export function notifySessionChange() {
  window.dispatchEvent(new Event('auth:changed'));
}

export async function logout() {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  await fetch(`${apiUrl}/api/auth/logout`, { credentials: 'include', method: 'POST' });
}
