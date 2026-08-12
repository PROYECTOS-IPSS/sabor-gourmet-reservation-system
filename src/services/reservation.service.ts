import { findAvailableTable } from '../models/reservation.model.js';
import type { ReservationInput } from '../schemas/reservation.schemas.js';

const durationMinutes = 90;

export async function checkReservationAvailability(input: ReservationInput) {
  const date = new Date(`${input.date}T00:00:00.000Z`);
  const startTime = new Date(`${input.date}T${input.startTime}:00.000Z`);
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  const table = await findAvailableTable(date, startTime, endTime, input.guests);

  return { available: Boolean(table), table, date, startTime, endTime };
}
