import { useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import { z } from 'zod';
import { useSession } from '../services/session';
import { Button } from './ui/Button';
import { reservationTimeSlots } from './data/reservationRules';

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  table: { number: number; capacity: number; isActive: boolean };
};

type Status = { tone: 'error' | 'success'; text: string } | null;

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const inputClassName = 'w-full border border-field-line bg-cream px-3 py-2 text-sm text-ink outline-none focus-visible:border-label focus-visible:outline-2 focus-visible:outline-offset-1';
const reservationSchema = z.object({
  date: z.string().date(),
  guests: z.coerce.number().int().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
});
const statusLabels = { CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', COMPLETED: 'Completada' } as const;
const statusOrder = { CONFIRMED: 0, COMPLETED: 1, CANCELLED: 2 } as const;

function formatTime(value: string) {
  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }).format(new Date(value));
}

function responseMessage(data: unknown) {
  if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') return data.message;
  return null;
}

function formatReservationDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

export function MyReservationsPage() {
  const { loading: sessionLoading, user } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reservations/mine?refresh=${Date.now()}`, { cache: 'no-store', credentials: 'include' });
      const data = (await response.json().catch(() => null)) as { reservations?: Reservation[]; message?: string } | null;
      if (!response.ok) throw new Error(data?.message ?? 'No se pudieron cargar tus reservas.');
      setReservations(data?.reservations ?? []);
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudieron cargar tus reservas.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === 'CUSTOMER') void load();
  }, [user]);

  if (sessionLoading || (loading && user?.role === 'CUSTOMER')) return <p className="bg-panel p-10 text-ink" role="status">Cargando reservas…</p>;
  if (!user) return <Navigate replace to="/login" />;
  if (user.role !== 'CUSTOMER') return <Navigate replace to="/dashboard" />;

  async function cancel() {
    if (!cancelTarget) return;
    try {
      const response = await fetch(`${API_URL}/api/reservations/${cancelTarget.id}/cancel`, { credentials: 'include', method: 'POST' });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(responseMessage(data) ?? 'No se pudo cancelar la reserva.');
      setStatus({ tone: 'success', text: 'Reserva cancelada.' });
      setCancelTarget(null);
      await load();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo cancelar la reserva.' });
    }
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const input = {
      date: String(form.get('date')),
      guests: Number(form.get('guests')),
      startTime: String(form.get('startTime')),
    };
    const parsed = reservationSchema.safeParse(input);
    if (!parsed.success) {
      setStatus({ tone: 'error', text: 'Completa datos válidos.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reservations/${editing.id}`, {
        body: JSON.stringify(parsed.data),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(responseMessage(data) ?? 'Mesa no disponible para ese horario.');
      setStatus({ tone: 'success', text: 'Reserva modificada correctamente.' });
      setEditing(null);
      await load();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'Mesa no disponible para ese horario.' });
    }
  }

  const cards = [...reservations].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <section className="min-w-0 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell">
      <p className="font-mono text-micro uppercase tracking-label text-label">Área personal</p>
      <h1 className="mt-3 font-display text-booking font-medium leading-heading">Mis Reservas</h1>
      {status && <p className={`mt-4 border px-4 py-3 font-mono text-sm ${status.tone === 'error' ? 'border-red-700 bg-red-50 text-red-800' : 'border-label bg-cream text-label'}`} role={status.tone === 'error' ? 'alert' : 'status'}>{status.text}</p>}
      <div className="mt-10 grid gap-4">
        {cards.map((reservation) => (
          <article className="border border-field-line bg-cream p-6 text-ink" key={reservation.id}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div><h2 className="text-xl font-semibold">Mesa {reservation.table.number}</h2><p>{formatReservationDate(reservation.date)} · {formatTime(reservation.startTime)}</p></div>
              <span className="bg-gold px-2 py-1 font-mono text-[9px] uppercase tracking-label text-ink">{statusLabels[reservation.status]}</span>
              {reservation.status === 'CONFIRMED' && <div className="flex gap-2 justify-end"><button className="cursor-pointer border border-brown-line px-4 py-2 font-mono text-[10px] uppercase tracking-link text-label hover:border-gold hover:text-gold" onClick={() => { setStatus(null); setEditing(reservation); }} type="button">Editar</button><button className="cursor-pointer border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-link text-muted hover:border-gold hover:text-gold" onClick={() => setCancelTarget(reservation)} type="button">Cancelar</button></div>}
            </div>
          </article>
        ))}
        {!cards.length && <p className="border border-field-line bg-cream p-6 text-ink">Aún no tienes reservas.</p>}
      </div>

      {editing && <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/80 p-4"><form className="grid w-full max-w-sm gap-4 bg-cream p-8 text-ink" onSubmit={update}><h2 className="font-display text-2xl">Editar reserva</h2><p className="text-sm text-panel-copy">La mesa se asignará automáticamente según disponibilidad y capacidad.</p><label className="grid gap-1">Fecha<input className={inputClassName} defaultValue={editing.date.slice(0, 10)} name="date" required type="date" /></label><label className="grid gap-1">Hora<select className={inputClassName} defaultValue={formatTime(editing.startTime)} name="startTime">{reservationTimeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></label><label className="grid gap-1">Personas<input className={inputClassName} defaultValue={editing.guests} min="1" name="guests" required type="number" /></label><div className="flex gap-2"><Button type="submit">Guardar</Button><button className="text-sm underline" onClick={() => setEditing(null)} type="button">Cancelar</button></div></form></div>}
      {cancelTarget && <div className="fixed inset-0 z-10 flex items-center justify-center bg-ink/80 p-4"><div className="grid w-full max-w-sm gap-4 bg-cream p-8 text-ink"><h2 className="font-display text-2xl">¿Cancelar reserva?</h2><p>Esta acción no se puede deshacer.</p><div className="flex gap-2"><Button onClick={() => void cancel()}>Confirmar cancelación</Button><button className="text-sm underline" onClick={() => setCancelTarget(null)} type="button">Volver</button></div></div></div>}
    </section>
  );
}
