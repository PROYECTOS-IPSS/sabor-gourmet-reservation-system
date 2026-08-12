import { useState, type FormEvent } from 'react';
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
  email: string;
  firstName: string;
  guests: string;
  lastName: string;
  startTime: string;
}

type Status = { tone: 'error' | 'success'; text: string } | null;

interface ReservationFormProps {
  selectedTable: number | null;
}

const inputClassName = 'w-full cursor-text appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label';

export function ReservationForm({ selectedTable }: ReservationFormProps) {
  const [status, setStatus] = useState<Status>(null);
  const [values, setValues] = useState<ReservationValues>({
    date: getNextReservationDate(),
    email: '',
    firstName: '',
    guests: '1',
    lastName: '',
    startTime: reservationTimeSlots[0],
  });

  function updateValue(field: keyof ReservationValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const guests = Number(values.guests);
    const errors = [
      !isReservationStartAvailable(values.date, values.startTime) && 'Elige una fecha y un horario futuros dentro de los días y horas de atención.',
      (!Number.isInteger(guests) || guests < reservationMinGuests) && `La cantidad debe ser de al menos ${reservationMinGuests} persona.`,
    ].filter(Boolean) as string[];

    if (errors.length > 0) {
      setStatus({ tone: 'error', text: errors[0] });
      return;
    }

    setStatus({
      tone: 'success',
      text: `Datos válidos. Reserva de ${values.startTime} a ${getReservationEndTime(values.startTime)}. La mesa se asignará automáticamente y disponibilidad se confirmará en servidor.`,
    });
  }

  return (
    <section className="mt-12 text-ink" aria-labelledby="reservation-form-title">
      <div>
        <Eyebrow tone="label">Reglas de reserva</Eyebrow>
        <h2 className="m-0 max-w-booking font-display text-booking font-medium leading-heading tracking-heading" id="reservation-form-title">
          Cuéntanos sobre tu visita
        </h2>
        <ul className="mt-6 space-y-3 p-0 text-copy leading-panel text-panel-copy">
          <li>{reservationDaysLabel}</li>
          <li>{reservationHoursLabel}</li>
          <li>{reservationDurationMinutes} minutos por reserva · inicios cada 30 minutos</li>
          <li>{reservationMinGuests} persona mínimo · máximo según {reservationMaxGuestsLabel} · mesa asignada automáticamente</li>
        </ul>
      </div>
      <form className="mt-10 grid grid-cols-2 content-start gap-6 max-phone:block" onSubmit={handleSubmit}>
        <FieldLabel label="Nombre">
          <input className={inputClassName} name="firstName" onChange={(event) => updateValue('firstName', event.target.value)} required value={values.firstName} />
        </FieldLabel>
        <FieldLabel label="Apellido">
          <input className={inputClassName} name="lastName" onChange={(event) => updateValue('lastName', event.target.value)} required value={values.lastName} />
        </FieldLabel>
        <FieldLabel label="Correo">
          <input className={inputClassName} name="email" onChange={(event) => updateValue('email', event.target.value)} required type="email" value={values.email} />
        </FieldLabel>
        <FieldLabel label="Mesa">
          <input className={`${inputClassName} cursor-default`} name="table" readOnly value={selectedTable ? `Mesa ${selectedTable}` : 'Selecciona una mesa arriba'} />
        </FieldLabel>
        <FieldLabel label="Personas">
          <input className={inputClassName} min={reservationMinGuests} name="guests" onChange={(event) => updateValue('guests', event.target.value)} required type="number" value={values.guests} />
        </FieldLabel>
        <FieldLabel label="Fecha">
          <input className={inputClassName} min={getTodayInputDate()} name="date" onChange={(event) => updateValue('date', event.target.value)} required type="date" value={values.date} />
        </FieldLabel>
        <FieldLabel label="Hora de inicio">
          <select className="w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label" name="startTime" onChange={(event) => updateValue('startTime', event.target.value)} value={values.startTime}>
            {reservationTimeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </FieldLabel>
        <div className="col-span-full flex items-center justify-between gap-4 max-phone:mt-2 max-phone:items-start">
          <p className="m-0 text-sm text-panel-copy">Duración fija: {reservationDurationMinutes} minutos · termina {getReservationEndTime(values.startTime)}</p>
          <Button type="submit">Ver disponibilidad <span className="ml-2 text-gold">→</span></Button>
        </div>
        {status && (
          <p className={status.tone === 'error' ? 'col-span-full m-0 text-label' : 'col-span-full m-0 text-label'} role={status.tone === 'error' ? 'alert' : 'status'}>
            {status.text}
          </p>
        )}
      </form>
    </section>
  );
}
