import { randomUUID } from 'node:crypto';
import type { ReservationStatus } from '../generated/prisma/enums.js';
import { createTable, findTableById, listTables, softDeleteTable, updateTable } from '../models/table.model.js';
import { prisma } from '../models/prisma.js';
import { findCustomerById, listCustomers as listCustomerUsers } from '../models/user.model.js';
import {
  cancelReservation,
  createReservation,
  findAvailableTableForAdmin,
  findReservationById,
  listReservations,
  withSerializableTransaction,
  updateReservation,
} from '../models/reservation.model.js';
import type {
  ReservationCreateInput,
  ReservationQuery,
  ReservationUpdateInput,
  TableCreateInput,
  TableUpdateInput,
} from '../schemas/admin.schemas.js';

const reservationWeekdays: Record<number, true> = { 0: true, 3: true, 4: true, 5: true, 6: true };
const reservationSlots: Record<string, true> = {
  '18:00': true,
  '18:30': true,
  '19:00': true,
  '19:30': true,
  '20:00': true,
  '20:30': true,
  '21:00': true,
  '21:30': true,
};
const reservationDurationMinutes = 90;

export class AdminServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AdminServiceError';
  }
}

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new AdminServiceError(400, 'La fecha indicada no es válida.');
  }

  return date;
}

function reservationWindow(dateValue: string, startValue: string) {
  const date = parseDate(dateValue);
  if (reservationWeekdays[date.getUTCDay()] !== true) {
    throw new AdminServiceError(400, 'Las reservas solo están disponibles de miércoles a domingo.');
  }
  if (reservationSlots[startValue] !== true) {
    throw new AdminServiceError(400, 'La hora debe estar entre las 18:00 y las 21:30, en intervalos de 30 minutos.');
  }

  const startTime = new Date(`${dateValue}T${startValue}:00.000Z`);
  const endTime = new Date(startTime.getTime() + reservationDurationMinutes * 60 * 1000);
  if (startTime <= new Date()) {
    throw new AdminServiceError(400, 'No se permiten reservas en fechas u horarios pasados.');
  }

  return { date, startTime, endTime };
}

function confirmationCode() {
  return `SG-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
}

function databaseErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : null;
}

async function reservationTransaction<T>(work: Parameters<typeof withSerializableTransaction<T>>[0]) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await withSerializableTransaction(work);
    } catch (error) {
      if (databaseErrorCode(error) !== 'P2034' || attempt === 1) throw error;
    }
  }

  throw new AdminServiceError(409, 'No se pudo confirmar la reserva. Inténtalo nuevamente.');
}

export function getTables() {
  return listTables();
}

export function addTable(input: TableCreateInput) {
  return createTable({ number: input.number, capacity: input.capacity, isActive: input.isActive });
}

export async function editTable(id: number, input: TableUpdateInput) {
  const table = await findTableById(id);
  if (!table) throw new AdminServiceError(404, 'La mesa no existe.');

  return updateTable(id, { ...input, ...(input.isActive === true ? { deletedAt: null } : {}) });
}

export async function removeTable(id: number) {
  const table = await findTableById(id);
  if (!table) throw new AdminServiceError(404, 'La mesa no existe.');
  return softDeleteTable(id);
}

export function getReservations(query: ReservationQuery) {
  return listReservations({
    date: query.date ? parseDate(query.date) : undefined,
    status: query.status as ReservationStatus | undefined,
  });
}


async function assertCustomer(userId: number) {
  const customer = await findCustomerById(userId);
  if (!customer) throw new AdminServiceError(404, 'El cliente no existe o no está activo.');
}

export function listCustomers() {
  return listCustomerUsers();
}

export async function addReservation(input: ReservationCreateInput) {
  await assertCustomer(input.userId);
  const window = reservationWindow(input.date, input.startTime);

  return reservationTransaction(async (database) => {
    const table = await findAvailableTableForAdmin(database, { ...window, guests: input.guests });
    if (!table) throw new AdminServiceError(409, 'No hay mesas disponibles para ese horario y cantidad de personas.');

    return createReservation(database, {
      confirmationCode: confirmationCode(),
      userId: input.userId,
      tableId: table.id,
      ...window,
      guests: input.guests,
    });
  });
}

export async function editReservation(id: number, input: ReservationUpdateInput) {
  const existing = await findReservationById(prisma, id);
  if (!existing) throw new AdminServiceError(404, 'La reserva no existe.');
  if (existing.status !== 'CONFIRMED') throw new AdminServiceError(409, 'Solo se pueden modificar reservas confirmadas.');
  if (existing.startTime <= new Date()) throw new AdminServiceError(409, 'No se pueden modificar reservas pasadas.');

  const userId = input.userId ?? existing.user.id;
  await assertCustomer(userId);
  const dateValue = input.date ?? existing.date.toISOString().slice(0, 10);
  const startValue = input.startTime ?? `${String(existing.startTime.getUTCHours()).padStart(2, '0')}:${String(existing.startTime.getUTCMinutes()).padStart(2, '0')}`;
  const guests = input.guests ?? existing.guests;
  const window = reservationWindow(dateValue, startValue);

  return reservationTransaction(async (database) => {
    const current = await findReservationById(database, id);
    if (!current) throw new AdminServiceError(404, 'La reserva no existe.');
    if (current.status !== 'CONFIRMED' || current.startTime <= new Date()) {
      throw new AdminServiceError(409, 'La reserva ya no puede modificarse.');
    }

    const table = await findAvailableTableForAdmin(database, { ...window, guests, excludeReservationId: id });
    if (!table) throw new AdminServiceError(409, 'No hay mesas disponibles para ese horario y cantidad de personas.');

    return updateReservation(database, id, { userId, tableId: table.id, ...window, guests });
  });
}

export async function cancelAdminReservation(id: number) {
  return reservationTransaction(async (database) => {
    const existing = await findReservationById(database, id);
    if (!existing) throw new AdminServiceError(404, 'La reserva no existe.');
    if (existing.status !== 'CONFIRMED') throw new AdminServiceError(409, 'La reserva ya no está confirmada.');
    if (existing.startTime <= new Date()) throw new AdminServiceError(409, 'No se pueden cancelar reservas pasadas.');

    return cancelReservation(database, id);
  });
}
