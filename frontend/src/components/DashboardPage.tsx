import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { logout, type AuthUser } from '../services/auth';
import {
  cancelReservation,
  createReservation,
  createTable,
  deleteTable,
  getAdminData,
  updateReservation,
  updateTable,
  type AdminCustomer,
  type AdminReservation,
  type AdminTable,
} from '../services/admin';
import { getNextReservationDate, reservationTimeSlots } from './data/reservationRules';
import { Button } from './ui/Button';

interface DashboardPageProps {
  user: AuthUser;
}

type Status = { tone: 'error' | 'success'; text: string } | null;
type TableForm = { number: string; capacity: string; isActive: boolean };
type ReservationForm = { userId: string; date: string; startTime: string; guests: string };

const inputClassName = 'w-full border border-field-line bg-cream px-3 py-2 text-sm text-ink outline-none focus-visible:border-label focus-visible:outline-2 focus-visible:outline-offset-1';
const initialTableForm: TableForm = { number: '', capacity: '', isActive: true };
const initialReservationForm: ReservationForm = { userId: '', date: getNextReservationDate(), startTime: reservationTimeSlots[0], guests: '1' };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }).format(new Date(value));
}

function statusClass(status: AdminReservation['status']) {
  return status === 'CONFIRMED' ? 'bg-gold text-ink' : status === 'CANCELLED' ? 'bg-line text-cream' : 'bg-footer text-cream';
}

export function DashboardPage({ user }: DashboardPageProps) {
  const navigate = useNavigate();
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [tableForm, setTableForm] = useState<TableForm>(initialTableForm);
  const [reservationForm, setReservationForm] = useState<ReservationForm>(initialReservationForm);
  const [editingTableId, setEditingTableId] = useState<number | null>(null);
  const [editingReservationId, setEditingReservationId] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getAdminData();
      setTables(data.tables);
      setCustomers(data.customers);
      setReservations(data.reservations);
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo cargar el panel.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function updateTableForm(field: keyof TableForm, value: string | boolean) {
    setTableForm((current) => ({ ...current, [field]: value }));
  }

  function updateReservationForm(field: keyof ReservationForm, value: string) {
    setReservationForm((current) => ({ ...current, [field]: value }));
  }

  function editTable(table: AdminTable) {
    setEditingTableId(table.id);
    setTableForm({ number: String(table.number), capacity: String(table.capacity), isActive: table.isActive });
  }

  function resetTableForm() {
    setEditingTableId(null);
    setTableForm(initialTableForm);
  }

  function editReservation(reservation: AdminReservation) {
    setEditingReservationId(reservation.id);
    setReservationForm({
      userId: String(reservation.user.id),
      date: reservation.date.slice(0, 10),
      startTime: formatTime(reservation.startTime),
      guests: String(reservation.guests),
    });
  }

  function resetReservationForm() {
    setEditingReservationId(null);
    setReservationForm({ ...initialReservationForm, userId: customers[0] ? String(customers[0].id) : '' });
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }
  async function submitTable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    try {
      const data = { number: Number(tableForm.number), capacity: Number(tableForm.capacity), isActive: tableForm.isActive };
      if (editingTableId) await updateTable(editingTableId, data);
      else await createTable(data);
      setStatus({ tone: 'success', text: editingTableId ? 'Mesa actualizada correctamente.' : 'Mesa creada correctamente.' });
      resetTableForm();
      await loadData();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la mesa.' });
    }
  }

  async function removeTable(table: AdminTable) {
    if (!window.confirm(`¿Desactivar la mesa ${table.number}?`)) return;
    try {
      await deleteTable(table.id);
      setStatus({ tone: 'success', text: `Mesa ${table.number} desactivada.` });
      await loadData();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo desactivar la mesa.' });
    }
  }

  async function submitReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    try {
      const data = { userId: Number(reservationForm.userId), date: reservationForm.date, startTime: reservationForm.startTime, guests: Number(reservationForm.guests) };
      if (editingReservationId) await updateReservation(editingReservationId, data);
      else await createReservation(data);
      setStatus({ tone: 'success', text: editingReservationId ? 'Reserva actualizada correctamente.' : 'Reserva creada correctamente.' });
      resetReservationForm();
      await loadData();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo guardar la reserva.' });
    }
  }

  async function cancelAdminReservation(reservation: AdminReservation) {
    if (!window.confirm(`¿Cancelar la reserva ${reservation.confirmationCode}?`)) return;
    try {
      await cancelReservation(reservation.id);
      setStatus({ tone: 'success', text: 'Reserva cancelada. El registro se conserva.' });
      await loadData();
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'No se pudo cancelar la reserva.' });
    }
  }

  const activeTables = tables.filter((table) => table.isActive).length;
  const confirmedReservations = reservations.filter((reservation) => reservation.status === 'CONFIRMED').length;

  return (
    <section className="grid gap-10 bg-panel px-shell py-feature-y text-ink max-phone:px-mobile-shell" aria-labelledby="admin-title">
      <header className="grid gap-4 border-b border-field-line pb-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-brand text-label">Panel administrador</p>
          <h1 id="admin-title" className="mt-3 font-display text-booking font-medium leading-heading">Control del salón</h1>
          <p className="mt-4 max-w-booking text-panel-copy">Hola, {user.name}. Gestiona mesas y reservas con las reglas del restaurante.</p>
        </div>
        <div className="grid grid-cols-2 gap-px border border-field-line bg-field-line text-center">
          <div className="bg-cream px-5 py-4"><strong className="block font-display text-3xl">{activeTables}</strong><span className="font-mono text-[10px] uppercase tracking-label text-panel-copy">Mesas activas</span></div>
          <div className="bg-cream px-5 py-4"><strong className="block font-display text-3xl">{confirmedReservations}</strong><span className="font-mono text-[10px] uppercase tracking-label text-panel-copy">Confirmadas</span></div>
        </div>
        <button className="justify-self-end font-mono text-[10px] uppercase tracking-link text-label underline underline-offset-4 focus-visible:outline-2 md:col-start-2" onClick={() => void handleLogout()} type="button">Cerrar sesión</button>
      </header>

      {status && <p className={status.tone === 'error' ? 'border border-red-800 bg-red-50 px-4 py-3 text-sm text-red-800' : 'border border-label bg-cream px-4 py-3 text-sm text-label'} role={status.tone === 'error' ? 'alert' : 'status'}>{status.text}</p>}
      {loading ? <p className="py-10 text-panel-copy" role="status">Cargando la operación del restaurante…</p> : (
        <>
          <section className="grid gap-6" aria-labelledby="tables-title">
            <div className="flex items-end justify-between gap-4 max-phone:flex-col max-phone:items-start">
              <div><p className="font-mono text-xs uppercase tracking-brand text-label">Operación</p><h2 id="tables-title" className="mt-2 font-display text-4xl font-medium tracking-heading">Mesas</h2></div>
              <p className="text-sm text-panel-copy">{tables.length} configuradas · {activeTables} activas</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                {tables.map((table) => <article className={`border p-4 ${table.isActive ? 'border-label bg-cream' : 'border-field-line bg-transparent opacity-65'}`} key={table.id}>
                  <div className="flex items-start justify-between gap-2"><span className="font-display text-3xl">{table.number}</span><span className="font-mono text-[9px] uppercase tracking-label text-panel-copy">{table.isActive ? 'Activa' : 'Inactiva'}</span></div>
                  <p className="mt-3 text-sm text-panel-copy">{table.capacity} {table.capacity === 1 ? 'persona' : 'personas'}</p>
                  <div className="mt-4 flex gap-2"><button className="font-mono text-[10px] uppercase tracking-link text-label underline underline-offset-4 focus-visible:outline-2" onClick={() => editTable(table)} type="button">Editar</button>{table.isActive && <button className="font-mono text-[10px] uppercase tracking-link text-panel-copy underline underline-offset-4 focus-visible:outline-2" onClick={() => void removeTable(table)} type="button">Desactivar</button>}</div>
                </article>)}
              </div>
              <form className="grid content-start gap-4 border border-field-line bg-cream p-5" onSubmit={submitTable}>
                <h3 className="font-display text-2xl">{editingTableId ? 'Editar mesa' : 'Nueva mesa'}</h3>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Número<input className={inputClassName} min="1" onChange={(event) => updateTableForm('number', event.target.value)} required type="number" value={tableForm.number} /></label>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Capacidad<input className={inputClassName} min="1" onChange={(event) => updateTableForm('capacity', event.target.value)} required type="number" value={tableForm.capacity} /></label>
                <label className="flex items-center gap-3 text-sm text-panel-copy"><input checked={tableForm.isActive} onChange={(event) => updateTableForm('isActive', event.target.checked)} type="checkbox" />Mesa activa</label>
                <div className="flex gap-3"><Button type="submit">{editingTableId ? 'Guardar cambios' : 'Crear mesa'} <span className="ml-2 text-gold">→</span></Button>{editingTableId && <button className="font-mono text-[10px] uppercase tracking-link text-label underline underline-offset-4" onClick={resetTableForm} type="button">Cancelar</button>}</div>
              </form>
            </div>
          </section>

          <section className="grid gap-6 border-t border-field-line pt-10" aria-labelledby="reservations-title">
            <div className="flex items-end justify-between gap-4 max-phone:flex-col max-phone:items-start"><div><p className="font-mono text-xs uppercase tracking-brand text-label">Agenda</p><h2 id="reservations-title" className="mt-2 font-display text-4xl font-medium tracking-heading">Reservas</h2></div><p className="text-sm text-panel-copy">{reservations.length} registros</p></div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="overflow-x-auto border border-field-line bg-cream">
                <table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">Reservas del restaurante</caption><thead className="border-b border-field-line font-mono text-[10px] uppercase tracking-label text-label"><tr><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Mesa</th><th className="px-4 py-3">Personas</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Acciones</th></tr></thead><tbody>{reservations.map((reservation) => <tr className="border-b border-field-line last:border-0" key={reservation.id}><td className="px-4 py-4"><strong className="block">{formatDate(reservation.date)}</strong><span className="text-xs text-panel-copy">{formatTime(reservation.startTime)} — {formatTime(reservation.endTime)}</span></td><td className="px-4 py-4"><strong className="block">{reservation.user.name}</strong><span className="text-xs text-panel-copy">{reservation.user.email}</span></td><td className="px-4 py-4">Mesa {reservation.table.number}</td><td className="px-4 py-4">{reservation.guests}</td><td className="px-4 py-4"><span className={`inline-block px-2 py-1 font-mono text-[9px] uppercase tracking-label ${statusClass(reservation.status)}`}>{reservation.status}</span><span className="mt-2 block font-mono text-[9px] text-panel-copy">{reservation.confirmationCode}</span></td><td className="px-4 py-4"><div className="flex gap-3"><button className="font-mono text-[10px] uppercase tracking-link text-label underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40" disabled={reservation.status !== 'CONFIRMED'} onClick={() => editReservation(reservation)} type="button">Editar</button><button className="font-mono text-[10px] uppercase tracking-link text-panel-copy underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40" disabled={reservation.status !== 'CONFIRMED'} onClick={() => void cancelAdminReservation(reservation)} type="button">Cancelar</button></div></td></tr>)}</tbody></table>
                {reservations.length === 0 && <p className="px-5 py-10 text-center text-sm text-panel-copy">No hay reservas para mostrar.</p>}
              </div>
              <form className="grid content-start gap-4 border border-field-line bg-cream p-5" onSubmit={submitReservation}>
                <h3 className="font-display text-2xl">{editingReservationId ? 'Editar reserva' : 'Nueva reserva'}</h3>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Cliente<select className={inputClassName} onChange={(event) => updateReservationForm('userId', event.target.value)} required value={reservationForm.userId}><option value="">Seleccionar cliente</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select></label>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Fecha<input className={inputClassName} min={new Date().toISOString().slice(0, 10)} onChange={(event) => updateReservationForm('date', event.target.value)} required type="date" value={reservationForm.date} /></label>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Hora<select className={inputClassName} onChange={(event) => updateReservationForm('startTime', event.target.value)} required value={reservationForm.startTime}>{reservationTimeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></label>
                <label className="grid gap-2 font-mono text-[10px] uppercase tracking-label text-label">Comensales<input className={inputClassName} min="1" onChange={(event) => updateReservationForm('guests', event.target.value)} required type="number" value={reservationForm.guests} /></label>
                <p className="text-xs leading-copy text-panel-copy">El servidor asigna la mesa activa más adecuada y valida día, horario, capacidad y superposición.</p>
                <div className="flex gap-3"><Button type="submit">{editingReservationId ? 'Guardar cambios' : 'Crear reserva'} <span className="ml-2 text-gold">→</span></Button>{editingReservationId && <button className="font-mono text-[10px] uppercase tracking-link text-label underline underline-offset-4" onClick={resetReservationForm} type="button">Cancelar</button>}</div>
              </form>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
