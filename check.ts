import { prisma } from './src/models/prisma.js';

async function main() {
  console.log("Tables:", await prisma.table.count());
  console.log("Reservations:", await prisma.reservation.count());
}
main().finally(() => prisma.$disconnect());
