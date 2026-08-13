import { createReservation, findActiveTableByNumber, findUserReservation, hasOverlappingReservation, cancelUserReservation, updateUserReservation } from '../models/reservation.model.js';
import type { ReservationInput } from '../schemas/reservation.schemas.js';

const durationMinutes = 90;

function reservationTimes(input: ReservationInput) {
  const date = new Date(`${input.date}T00:00:00.000Z`);
  const startTime = new Date(`${input.date}T${input.startTime}:00.000Z`);
  return { date, startTime, endTime: new Date(startTime.getTime() + durationMinutes * 60 * 1000) };
}

export async function checkReservationAvailability(input: ReservationInput) {
  const { date, startTime, endTime } = reservationTimes(input);
  const table = await findActiveTableByNumber(input.tableNumber);
  if (!table || table.capacity < input.guests || await hasOverlappingReservation(table.id, date, startTime, endTime)) return { available: false, table: null, date, startTime, endTime };
  return { available: true, table, date, startTime, endTime };
}

export async function createCustomerReservation(userId: number, input: ReservationInput) {
  const availability = await checkReservationAvailability(input);
  if (!availability.available || !availability.table) return null;
  return createReservation({ userId, tableId: availability.table.id, date: availability.date, startTime: availability.startTime, endTime: availability.endTime, guests: input.guests });
}

export async function cancelCustomerReservation(id: number, userId: number) {
  const reservation = await findUserReservation(id, userId);
  if (!reservation || reservation.status !== 'CONFIRMED') return false;
  await cancelUserReservation(id, userId);
  return true;
}

export async function updateCustomerReservation(id: number, userId: number, input: ReservationInput) {
  const current = await findUserReservation(id, userId);
  if (!current || current.status !== 'CONFIRMED') return null;
  const availability = await checkReservationAvailability(input);
  if (!availability.available || !availability.table) return null;
  const result = await updateUserReservation(id, userId, { tableId: availability.table.id, date: availability.date, startTime: availability.startTime, endTime: availability.endTime, guests: input.guests });
  return result.count ? findUserReservation(id, userId) : null;
}
