import { useState } from 'react';
import { Button } from './ui/Button';
import { Eyebrow } from './ui/Eyebrow';
import { FieldLabel } from './ui/FieldLabel';

const timeSlots = ['18:30', '19:00', '19:30', '20:00', '20:30'];
const guestOptions = [2, 3, 4, 5, 6, 7, 8];

export function BookingPanel() {
  const [date, setDate] = useState('2026-08-15');
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState('4');

  return (
    <section
      className="grid grid-cols-booking gap-15 bg-panel px-shell pb-16 pt-panel-top text-ink max-phone:block max-phone:px-mobile-shell max-phone:py-panel-mobile"
      id="reservar"
      aria-labelledby="booking-title"
    >
      <div className="max-phone:mb-10">
        <Eyebrow tone="label">Tu noche, a tu ritmo</Eyebrow>
        <h2
          className="m-0 mb-5 font-display text-booking font-medium leading-heading tracking-heading"
          id="booking-title"
        >
          Reserva tu mesa
        </h2>
        <p className="max-w-booking text-copy leading-panel text-panel-copy">
          Selecciona fecha, hora y compañía. Nosotros nos ocupamos del resto.
        </p>
      </div>
      <form
        className="grid grid-cols-2 content-start gap-6 max-phone:gap-form-mobile"
        onSubmit={(event) => event.preventDefault()}
      >
        <FieldLabel label="Fecha">
          <input
            className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Personas">
          <select
            className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label"
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
          >
            {guestOptions.map((count) => (
              <option key={count} value={count}>
                {count} personas
              </option>
            ))}
          </select>
        </FieldLabel>
        <fieldset className="col-span-full m-0 flex flex-col gap-2.5 border-x-0 border-b border-t-0 border-field-line px-0 pb-2.5 pt-0.5">
          <legend className="p-0 font-mono text-micro uppercase tracking-label text-label">Hora</legend>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                onClick={() => setTime(slot)}
                selected={time === slot}
                type="button"
                variant="slot"
              >
                {slot}
              </Button>
            ))}
          </div>
        </fieldset>
        <Button className="col-start-2 justify-self-end" type="submit">
          Ver disponibilidad <span className="ml-2 text-gold">→</span>
        </Button>
      </form>
    </section>
  );
}
