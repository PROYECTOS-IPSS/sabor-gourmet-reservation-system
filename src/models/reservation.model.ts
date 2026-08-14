import { PrismaClient } from '../generated/prisma/client.js';
import { prisma } from './prisma.js';

type Client = PrismaClient;

// --- New client-based functions ---

export function findAvailableTableWithClient(client: Client, date: Date, startTime: Date, endTime: Date, guests: number) {
  return client.table.findFirst({
    where: {
      isActive: true,
      capacity: { gte: guests },
      reservations: { none: { date, status: 'CONFIRMED', startTime: { lt: endTime }, endTime: { gt: startTime } } },
    },
    orderBy: [{ capacity: 'asc' }, { number: 'asc' }],
  });
}

export function createReservationWithClient(client: Client, data: { userId: number; tableId: number; date: Date; startTime: Date; endTime: Date; guests: number; confirmationCode: string }) {
  return client.reservation.create({ data });
}

export function findActiveTableByNumberWithClient(client: Client, number: number) {
  return client.table.findFirst({ where: { number, isActive: true } });
}

export function hasOverlappingReservationWithClient(client: Client, tableId: number, date: Date, startTime: Date, endTime: Date) {
  return client.reservation.findFirst({ where: { tableId, date, status: 'CONFIRMED', startTime: { lt: endTime }, endTime: { gt: startTime } } });
}

export function findReservationsByUserIdWithClient(client: Client, userId: number) {
  return client.reservation.findMany({
    where: { userId },
    include: { table: { select: { number: true, capacity: true, isActive: true } } },
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
  });
}

export function findUserReservationWithClient(client: Client, id: number, userId: number) {
  return client.reservation.findFirst({ where: { id, userId } });
}

export function cancelUserReservationWithClient(client: Client, id: number, userId: number) {
  return client.reservation.update({ where: { id }, data: { status: 'CANCELLED' } });
}

export function updateUserReservationWithClient(client: Client, id: number, userId: number, data: { tableId: number; date: Date; startTime: Date; endTime: Date; guests: number }) {
  return client.reservation.updateMany({ where: { id, userId, status: 'CONFIRMED' }, data });
}

export function completeReservationWithClient(client: Client, id: number) {
  return client.reservation.update({ where: { id }, data: { status: 'COMPLETED' } });
}

export function findAllReservationsWithClient(client: Client) {
  return client.reservation.findMany({ include: { table: { select: { number: true, capacity: true } }, user: { select: { id: true, name: true, email: true } } } });
}

export function findReservationByIdWithClient(client: Client, id: number) {
  return client.reservation.findUnique({ where: { id }, include: { table: { select: { number: true } }, user: { select: { id: true, name: true, email: true } } } });
}

export function updateReservationWithClient(client: Client, id: number, data: { tableId?: number; date?: Date; startTime?: Date; endTime?: Date; guests?: number; status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' }) {
  return client.reservation.update({ where: { id }, data });
}

export function cancelReservationWithClient(client: Client, id: number) {
  return client.reservation.update({ where: { id }, data: { status: 'CANCELLED' } });
}

// --- Old functions (keep using global prisma) ---

export function findAvailableTable(date: Date, startTime: Date, endTime: Date, guests: number) {
  return findAvailableTableWithClient(prisma, date, startTime, endTime, guests);
}

export function createReservation(data: { userId: number; tableId: number; date: Date; startTime: Date; endTime: Date; guests: number; confirmationCode: string }) {
  return createReservationWithClient(prisma, data);
}

export function findActiveTableByNumber(number: number) {
  return findActiveTableByNumberWithClient(prisma, number);
}

export function hasOverlappingReservation(tableId: number, date: Date, startTime: Date, endTime: Date) {
  return hasOverlappingReservationWithClient(prisma, tableId, date, startTime, endTime);
}

export function findReservationsByUserId(userId: number) {
  return findReservationsByUserIdWithClient(prisma, userId);
}

export function findUserReservation(id: number, userId: number) {
  return findUserReservationWithClient(prisma, id, userId);
}

export function cancelUserReservation(id: number, userId: number) {
  return cancelUserReservationWithClient(prisma, id, userId);
}

export function updateUserReservation(id: number, userId: number, data: { tableId: number; date: Date; startTime: Date; endTime: Date; guests: number }) {
  return updateUserReservationWithClient(prisma, id, userId, data);
}

export function completeReservation(id: number) {
  return completeReservationWithClient(prisma, id);
}

export function findAllReservations() {
  return findAllReservationsWithClient(prisma);
}

export function findReservationById(id: number) {
  return findReservationByIdWithClient(prisma, id);
}

export function updateReservation(id: number, data: { tableId?: number; date?: Date; startTime?: Date; endTime?: Date; guests?: number; status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' }) {
  return updateReservationWithClient(prisma, id, data);
}

export function cancelReservation(id: number) {
  return cancelReservationWithClient(prisma, id);
}
