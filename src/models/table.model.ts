import { prisma } from './prisma.js';

export function listTables() {
  return prisma.table.findMany({
    orderBy: { number: 'asc' },
  });
}

export function findTableById(id: number) {
  return prisma.table.findUnique({ where: { id } });
}


export function createTable(data: { number: number; capacity: number; isActive: boolean }) {
  return prisma.table.create({ data });
}

export function updateTable(id: number, data: { number?: number; capacity?: number; isActive?: boolean; deletedAt?: Date | null }) {
  return prisma.table.update({ where: { id }, data });
}

export function softDeleteTable(id: number) {
  return prisma.table.update({ where: { id }, data: { isActive: false, deletedAt: new Date() } });
}
