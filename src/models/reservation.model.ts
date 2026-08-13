import type { Prisma } from '../generated/prisma/client.js';
import type { ReservationStatus } from '../generated/prisma/enums.js';
import { prisma } from './prisma.js';

export type DatabaseClient = typeof prisma | Prisma.TransactionClient;

export const reservationRelations = {
  user: { select: { id: true, name: true, email: true } },
  table: { select: { id: true, number: true, capacity: true } },
} as const;

export function findAvailableTable(date: Date, startTime: Date, endTime: Date, guests: number) {
  return prisma.table.findFirst({
    where: {
      isActive: true,
      deletedAt: null,
      capacity: { gte: guests },
      reservations: { none: { date, deletedAt: null, status: 'CONFIRMED', startTime: { lt: endTime }, endTime: { gt: startTime } } },
    },
    orderBy: [{ capacity: 'asc' }, { number: 'asc' }],
  });
}

export function listReservations(filters: { date?: Date; status?: ReservationStatus }) {
  return prisma.reservation.findMany({
    where: {
      deletedAt: null,
      date: filters.date ? { equals: filters.date } : undefined,
      status: filters.status,
    },
    include: reservationRelations,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }, { table: { number: 'asc' } }],
  });
}

export function findReservationById(database: DatabaseClient, id: number) {
  return database.reservation.findFirst({
    where: { id, deletedAt: null },
    include: reservationRelations,
  });
}

export function findAvailableTableForAdmin(
  database: Prisma.TransactionClient,
  input: { startTime: Date; endTime: Date; guests: number; excludeReservationId?: number },
) {
  return database.table
    .findMany({
      where: { isActive: true, deletedAt: null, capacity: { gte: input.guests } },
      orderBy: { number: 'asc' },
    })
    .then(async (tables) => {
      for (const table of tables) {
        const overlap = await database.reservation.findFirst({
          where: {
            tableId: table.id,
            deletedAt: null,
            status: 'CONFIRMED',
            id: input.excludeReservationId ? { not: input.excludeReservationId } : undefined,
            startTime: { lt: input.endTime },
            endTime: { gt: input.startTime },
          },
          select: { id: true },
        });

        if (!overlap) return table;
      }

      return null;
    });
}

export function createReservation(
  database: Prisma.TransactionClient,
  data: {
    confirmationCode: string;
    userId: number;
    tableId: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    guests: number;
  },
) {
  return database.reservation.create({ data, include: reservationRelations });
}

export function updateReservation(
  database: Prisma.TransactionClient,
  id: number,
  data: { userId: number; tableId: number; date: Date; startTime: Date; endTime: Date; guests: number },
) {
  return database.reservation.update({ where: { id }, data, include: reservationRelations });
}

export function cancelReservation(database: Prisma.TransactionClient, id: number) {
  return database.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: reservationRelations,
  });
}

export function withSerializableTransaction<T>(work: (database: Prisma.TransactionClient) => Promise<T>) {
  return prisma.$transaction(work, { isolationLevel: 'Serializable' });
}
