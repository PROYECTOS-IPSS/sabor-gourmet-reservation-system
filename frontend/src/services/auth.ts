export type UserRole = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('No se pudo validar la sesión.');
  const data = (await response.json()) as { user: AuthUser };
  return data.user;
}
