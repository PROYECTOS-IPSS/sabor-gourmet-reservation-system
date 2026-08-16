import { prisma } from './prisma.js';

export function checkDatabaseConnection() {
  return prisma.$queryRaw`SELECT 1`;
}
