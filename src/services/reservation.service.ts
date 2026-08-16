import { createReservation, findAvailableTable, findUserReservation, cancelUserReservation, updateUserReservation, findReservationsByUserId } from '../models/reservation.model.js';
import { randomUUID } from 'node:crypto';
import type { ReservationInput } from '../schemas/reservation.schemas.js';

const durationMinutes = 90;
const reservationSlots: Record<string, true> = { '18:00': true, '18:30': true, '19:00': true, '19:30': true, '20:00': true, '20:30': true, '21:00': true, '21:30': true };

function reservationTimes(input: ReservationInput) {
  const date = new Date(`${input.date}T00:00:00.000Z`);
  const startTime = new Date(`${input.date}T${input.startTime}:00.000Z`);
  return { date, startTime, endTime: new Date(startTime.getTime() + durationMinutes * 60 * 1000) };
}

function validReservationWindow(input: ReservationInput, startTime: Date) {
  return [0, 3, 4, 5, 6].includes(startTime.getUTCDay()) && reservationSlots[input.startTime] === true && startTime > new Date();
}

export async function checkReservationAvailability(input: ReservationInput, excludeId?: number) {
  const { date, startTime, endTime } = reservationTimes(input);
  if (!validReservationWindow(input, startTime)) return { available: false, table: null, date, startTime, endTime };
  const table = await findAvailableTable(date, startTime, endTime, input.guests, excludeId);
  return { available: Boolean(table), table, date, startTime, endTime };
}

export async function createCustomerReservation(userId: number, input: ReservationInput) {
  const availability = await checkReservationAvailability(input);
  if (!availability.available || !availability.table) return null;
  return createReservation({ userId, tableId: availability.table.id, date: availability.date, startTime: availability.startTime, endTime: availability.endTime, guests: input.guests, confirmationCode: randomUUID() });
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
  const availability = await checkReservationAvailability(input, id);
  if (!availability.available || !availability.table) return null;
  const result = await updateUserReservation(id, userId, { tableId: availability.table.id, date: availability.date, startTime: availability.startTime, endTime: availability.endTime, guests: input.guests });
  return result.count ? findUserReservation(id, userId) : null;
}

export async function listUserReservations(userId: number) {
  return findReservationsByUserId(userId);
}
