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
