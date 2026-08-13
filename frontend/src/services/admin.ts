export interface AdminTable {
  id: number;
  number: number;
  capacity: number;
  isActive: boolean;
  deletedAt: string | null;
}

export interface AdminCustomer {
  id: number;
  name: string;
  email: string;
}

export type ReservationStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface AdminReservation {
  id: number;
  confirmationCode: string;
  userId: number;
  tableId: number;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: ReservationStatus;
  user: AdminCustomer;
  table: { id: number; number: number; capacity: number };
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const data = (await response.json().catch(() => null)) as { message?: string } | null;
  if (!response.ok) throw new Error(data?.message ?? 'No se pudo completar la solicitud.');
  return data as T;
}

export async function getAdminData() {
  const [tables, customers, reservations] = await Promise.all([
    request<{ tables: AdminTable[] }>('/tables'),
    request<{ customers: AdminCustomer[] }>('/customers'),
    request<{ reservations: AdminReservation[] }>('/reservations'),
  ]);
  return { tables: tables.tables, customers: customers.customers, reservations: reservations.reservations };
}

export function createTable(data: { number: number; capacity: number; isActive: boolean }) {
  return request<{ table: AdminTable }>('/tables', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTable(id: number, data: { number?: number; capacity?: number; isActive?: boolean }) {
  return request<{ table: AdminTable }>(`/tables/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteTable(id: number) {
  return request<{ table: AdminTable }>(`/tables/${id}`, { method: 'DELETE' });
}

export function createReservation(data: { userId: number; date: string; startTime: string; guests: number }) {
  return request<{ reservation: AdminReservation }>('/reservations', { method: 'POST', body: JSON.stringify(data) });
}

export function updateReservation(id: number, data: Partial<{ userId: number; date: string; startTime: string; guests: number }>) {
  return request<{ reservation: AdminReservation }>(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function cancelReservation(id: number) {
  return request<{ reservation: AdminReservation }>(`/reservations/${id}/cancel`, { method: 'POST' });
}
