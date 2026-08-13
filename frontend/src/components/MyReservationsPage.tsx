import { useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import { z } from 'zod';
import { useSession } from '../services/session';

type Reservation = { id: number; date: string; startTime: string; endTime: string; createdAt: string; updatedAt: string; cancelledAt: string | null; completedAt: string | null; guests: number; status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; table: { number: number; capacity: number; isActive: boolean } };
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const reservationSchema = z.object({ date: z.string().date(), guests: z.coerce.number().int().min(1), startTime: z.string().regex(/^\d{2}:\d{2}$/), tableNumber: z.coerce.number().int().positive() });
const statusLabels = { CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', COMPLETED: 'Completada' };
const statusCardClasses = { CONFIRMED: 'border-yellow-500 bg-yellow-50', CANCELLED: 'border-red-600 bg-red-50', COMPLETED: 'border-green-600 bg-green-50' };
const statusBadgeClasses = { CONFIRMED: 'bg-yellow-400 text-yellow-950', CANCELLED: 'bg-red-600 text-white', COMPLETED: 'bg-green-600 text-white' };
const statusOrder = { CONFIRMED: 0, COMPLETED: 1, CANCELLED: 2 };

export function MyReservationsPage() {
  const { loading: sessionLoading, user } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const load = () => fetch(`${API_URL}/api/reservations/mine`, { credentials: 'include' }).then((response) => response.json()).then((data: { reservations: Reservation[] }) => setReservations(data.reservations)).finally(() => setLoading(false));
  useEffect(() => { if (user?.role === 'CUSTOMER') load(); }, [user]);
  if (sessionLoading || (loading && user?.role === 'CUSTOMER')) return <p className="bg-panel p-10 text-ink">Cargando reservas…</p>;
  if (!user) return <Navigate replace to="/login" />;
  if (user.role !== 'CUSTOMER') return <Navigate replace to="/dashboard" />;

  async function cancel() {
    if (!cancelTarget) return;
    const response = await fetch(`${API_URL}/api/reservations/${cancelTarget.id}/cancel`, { credentials: 'include', method: 'POST' });
    setStatus(response.ok ? 'Reserva cancelada.' : 'No se pudo cancelar.');
    setCancelTarget(null);
    await load();
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const input = { tableNumber: Number(form.get('tableNumber')), date: String(form.get('date')), guests: Number(form.get('guests')), startTime: String(form.get('startTime')) };
    if (!reservationSchema.safeParse(input).success) { setStatus('Completa datos válidos.'); return; }
    const availability = await fetch(`${API_URL}/api/reservations/availability`, { body: JSON.stringify(input), credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    if (!availability.ok || !(await availability.json()).available) { setStatus('Mesa no disponible para ese horario.'); return; }
    const response = await fetch(`${API_URL}/api/reservations/${editing.id}`, { body: JSON.stringify(input), credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'PATCH' });
    setStatus(response.ok ? 'Reserva modificada.' : 'No se pudo modificar.');
    setEditing(null);
    await load();
  }

  const cards = [...reservations].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  return <section className="min-w-0 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell"><p className="font-mono text-micro uppercase tracking-label text-label">Área personal</p><h1 className="mt-3 font-display text-booking font-medium leading-heading">Mis Reservas</h1>{status && <p className="mt-4 text-label" role="status">{status}</p>}<div className="mt-10 grid gap-4">{cards.map((reservation) => <article className={`border p-6 ${statusCardClasses[reservation.status]}`} key={reservation.id}><div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"><div><h2 className="text-xl font-semibold">Mesa {reservation.table.number}</h2><p>{new Date(reservation.date).toLocaleDateString('es-ES')} · {new Date(reservation.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p></div><span className={`justify-self-center px-3 py-1 text-sm font-semibold ${statusBadgeClasses[reservation.status]}`}>{statusLabels[reservation.status]}</span><div className="flex justify-end gap-3">{reservation.status === 'CONFIRMED' && <><button className="border border-label px-4 py-2" onClick={() => setEditing(reservation)} type="button">Modificar</button><button className="border border-red-700 px-4 py-2 text-red-700" onClick={() => setCancelTarget(reservation)} type="button">Cancelar</button></>}</div></div><dl className="mt-4 grid gap-2 text-sm"><div><dt className="font-semibold">Reserva realizada</dt><dd>{new Date(reservation.createdAt).toLocaleString('es-ES')}</dd></div><div><dt className="font-semibold">Última modificación</dt><dd>{new Date(reservation.updatedAt).toLocaleString('es-ES')}</dd></div>{reservation.completedAt && <div><dt className="font-semibold">Completada</dt><dd>{new Date(reservation.completedAt).toLocaleString('es-ES')}</dd></div>}{reservation.cancelledAt && <div><dt className="font-semibold">Cancelada</dt><dd>{new Date(reservation.cancelledAt).toLocaleString('es-ES')}</dd></div>}</dl><p className="mt-3">{reservation.guests} personas · capacidad {reservation.table.capacity}</p></article>)}</div>{cancelTarget && <div className="fixed inset-0 z-10 grid place-items-center bg-black/60 p-4"><div className="max-w-md bg-cream p-6"><h2 className="text-xl font-semibold">¿Cancelar reserva?</h2><p className="mt-3">Esta acción es irreversible.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setCancelTarget(null)} type="button">Volver</button><button className="bg-red-700 px-4 py-2 text-white" onClick={cancel} type="button">Sí, cancelar</button></div></div></div>}{editing && <div className="fixed inset-0 z-10 grid place-items-center bg-black/60 p-4"><form className="grid w-full max-w-md gap-4 bg-cream p-6" onSubmit={update}><h2 className="text-xl font-semibold">Modificar reserva</h2><label>Personas<input className="w-full border p-2" defaultValue={editing.guests} name="guests" type="number" /></label><label>Mesa<input className="w-full border p-2" defaultValue={editing.table.number} name="tableNumber" type="number" /></label><label>Fecha<input className="w-full border p-2" defaultValue={editing.date.slice(0, 10)} name="date" type="date" /></label><label>Hora<input className="w-full border p-2" defaultValue={editing.startTime.slice(11, 16)} name="startTime" type="time" /></label><div className="flex justify-end gap-3"><button onClick={() => setEditing(null)} type="button">Cerrar</button><button className="bg-ink px-4 py-2 text-white" type="submit">Ver disponibilidad y guardar</button></div></form></div>}</section>;
}
