import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Eyebrow } from './ui/Eyebrow';
import { FieldLabel } from './ui/FieldLabel';
import {
  getNextReservationDate,
  getReservationEndTime,
  getTodayInputDate,
  isReservationStartAvailable,
  reservationDaysLabel,
  reservationDurationMinutes,
  reservationHoursLabel,
  reservationMaxGuestsLabel,
  reservationMinGuests,
  reservationTimeSlots,
} from './data/reservationRules';

interface ReservationValues {
  date: string;
  guests: string;
  startTime: string;
}

type Status = { tone: 'error' | 'success'; text: string } | null;

interface ReservationFormProps {
  selectedTable: number | null;
  user: { name: string; apellido: string; email: string } | null;
}

const inputClassName =
  'w-full cursor-text appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const reservationSchema = z.object({
  date: z.string().date(),
  guests: z.coerce.number().int().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export function ReservationForm({ selectedTable, user }: ReservationFormProps) {
  const [status, setStatus] = useState<Status>(null);
  const [values, setValues] = useState<ReservationValues>({
    date: getNextReservationDate(),
    guests: '1',
    startTime: reservationTimeSlots[0],
  });

  function updateValue(field: keyof ReservationValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const localErrors = [
      !selectedTable && 'Selecciona una mesa.',
      !isReservationStartAvailable(values.date, values.startTime) && 'Elige una fecha y horario válidos.',
      !reservationSchema.safeParse({ ...values, tableNumber: selectedTable ?? 0 }).success && `La cantidad debe ser de al menos ${reservationMinGuests} persona.`,
    ].filter(Boolean) as string[];
    if (localErrors.length) return setStatus({ tone: 'error', text: localErrors[0] });

    const payload = { tableNumber: selectedTable, date: values.date, guests: Number(values.guests), startTime: values.startTime };
    const response = await fetch(`${API_URL}/api/reservations/availability`, { body: JSON.stringify(payload), credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    const data = (await response.json()) as { available?: boolean; message?: string; table?: { number: number; capacity: number } | null };
    if (!response.ok || !data.available) return setStatus({ tone: 'error', text: data.message ?? 'Mesa no disponible.' });
    setStatus({ tone: 'success', text: `Mesa ${data.table?.number} disponible.` });
  }

  async function createReservation() {
    const response = await fetch(`${API_URL}/api/reservations`, { body: JSON.stringify({ tableNumber: selectedTable, date: values.date, guests: Number(values.guests), startTime: values.startTime }), credentials: 'include', headers: { 'Content-Type': 'application/json' }, method: 'POST' });
    const data = (await response.json()) as { message?: string };
    setStatus(response.ok ? { tone: 'success', text: 'Reserva realizada correctamente.' } : { tone: 'error', text: data.message ?? 'No se pudo realizar la reserva.' });
  }
  return (
    <section
      className="mt-12 text-ink"
      aria-labelledby="reservation-form-title"
    >
      <div>
        <Eyebrow tone="label">Reglas de reserva</Eyebrow>
        <h2
          className="m-0 max-w-booking font-display text-booking font-medium leading-heading tracking-heading"
          id="reservation-form-title"
        >
          Cuéntanos sobre tu visita
        </h2>
        <ul className="mt-6 mb-6 space-y-3 p-0 text-copy leading-panel text-panel-copy">
          <li>{reservationDaysLabel}</li>
          <li>{reservationHoursLabel}</li>
          <li>
            {reservationDurationMinutes} minutos por reserva · inicios cada 30
            minutos
          </li>
          <li>
            {reservationMinGuests} persona mínimo · máximo según{' '}
            {reservationMaxGuestsLabel} · mesa asignada automáticamente
          </li>
        </ul>
      </div>
      {user && (
        <>
          <FieldLabel label="Nombre">
            <input className={inputClassName} readOnly value={user.name} />
          </FieldLabel>
          <FieldLabel label="Apellido">
            <input className={inputClassName} readOnly value={user.apellido} />
          </FieldLabel>
          <FieldLabel label="Correo">
            <input
              className={inputClassName}
              readOnly
              type="email"
              value={user.email}
            />
          </FieldLabel>
        </>
      )}
      <form
        className="mt-10 grid grid-cols-2 content-start gap-6 max-phone:block"
        onSubmit={handleSubmit}
      >
        <FieldLabel label="Personas">
          <input
            className={inputClassName}
            min={reservationMinGuests}
            name="guests"
            onChange={(event) => updateValue('guests', event.target.value)}
            required
            type="number"
            value={values.guests}
          />
        </FieldLabel>
        <FieldLabel label="Mesa"><input className={inputClassName} readOnly required value={selectedTable ? `Mesa ${selectedTable}` : 'Selecciona una mesa'} /></FieldLabel>
        <FieldLabel label="Fecha">
          <input
            className={inputClassName}
            min={getTodayInputDate()}
            name="date"
            onChange={(event) => updateValue('date', event.target.value)}
            required
            type="date"
            value={values.date}
          />
        </FieldLabel>
        <FieldLabel label="Hora de inicio">
          <select
            className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none"
            name="startTime"
            onChange={(event) => updateValue('startTime', event.target.value)}
            value={values.startTime}
          >
            {reservationTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </FieldLabel>
        <div className="col-span-full flex items-center justify-between gap-4 max-phone:items-start">
          <p className="m-0 text-sm text-panel-copy">
            Duración fija: {reservationDurationMinutes} minutos · termina{' '}
            {getReservationEndTime(values.startTime)}
          </p>
          <Button type="submit">
            Ver disponibilidad <span className="ml-2 text-gold">→</span>
          </Button>
          {status?.tone === 'success' && <Button onClick={createReservation} type="button">Realizar reserva <span className="ml-2 text-gold">→</span></Button>}
        </div>
        {status && (
          <p
            className="col-span-full m-0 text-label"
            role={status.tone === 'error' ? 'alert' : 'status'}
          >
            {status.text}
          </p>
        )}
      </form>
    </section>
  );
}
