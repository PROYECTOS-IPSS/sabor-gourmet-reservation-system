import { prisma } from './prisma.js';

export function findAvailableTable(date: Date, startTime: Date, endTime: Date, guests: number) {
  return prisma.table.findFirst({
    where: {
      isActive: true,
      capacity: { gte: guests },
      reservations: { none: { date, status: 'CONFIRMED', startTime: { lt: endTime }, endTime: { gt: startTime } } },
    },
    orderBy: [{ capacity: 'asc' }, { number: 'asc' }],
  });
}

export function createReservation(data: { userId: number; tableId: number; date: Date; startTime: Date; endTime: Date; guests: number }) {
  return prisma.reservation.create({ data });
}

export function findActiveTableByNumber(number: number) {
  return prisma.table.findFirst({ where: { number, isActive: true } });
}

export function hasOverlappingReservation(tableId: number, date: Date, startTime: Date, endTime: Date) {
  return prisma.reservation.findFirst({ where: { tableId, date, status: 'CONFIRMED', startTime: { lt: endTime }, endTime: { gt: startTime } } });
}

export function findReservationsByUserId(userId: number) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { table: { select: { number: true, capacity: true, isActive: true } } },
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
  });
}

export function findUserReservation(id: number, userId: number) {
  return prisma.reservation.findFirst({ where: { id, userId } });
}

export function cancelUserReservation(id: number, userId: number) {
  return prisma.reservation.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date() } });
}

export function updateUserReservation(id: number, userId: number, data: { tableId: number; date: Date; startTime: Date; endTime: Date; guests: number }) {
  return prisma.reservation.updateMany({ where: { id, userId, status: 'CONFIRMED' }, data });
}

export function completeReservation(id: number) {
  return prisma.reservation.update({ where: { id }, data: { status: 'COMPLETED', completedAt: new Date() } });
}
