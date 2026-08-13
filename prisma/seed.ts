import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/config/env.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });

async function main() {
  const passwordHash = await bcrypt.hash('admin1234', 12);

  const users = await Promise.all(
    [
      { name: 'Administrador', apellido: 'General', email: 'admin@saborgourmet.local', role: 'ADMIN' as const },
      { name: 'María', apellido: 'Encargada', email: 'empleado@saborgourmet.local', role: 'EMPLOYEE' as const },
      { name: 'Carlos', apellido: 'Cliente', email: 'carlos@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Ana', apellido: 'Cliente', email: 'ana@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Luis', apellido: 'Cliente', email: 'luis@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Sofía', apellido: 'Cliente', email: 'sofia@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Diego', apellido: 'Cliente', email: 'diego@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Elena', apellido: 'Cliente', email: 'elena@saborgourmet.local', role: 'CUSTOMER' as const },
      { name: 'Pablo', apellido: 'Cliente', email: 'pablo@saborgourmet.local', role: 'CUSTOMER' as const },
    ].map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, apellido: user.apellido, role: user.role },
        create: { ...user, passwordHash },
      }),
    ),
  );

  await prisma.table.createMany({
    data: Array.from({ length: 40 }, (_, index) => ({
      number: index + 1,
      capacity: (index % 8) + 1,
      isActive: true,
    })),
    skipDuplicates: true,
  });


  const customers = users.filter((user) => user.role === 'CUSTOMER');
  const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
  const examples = [
    ['2026-08-19', '18:00', 1, 2, 2, 'CONFIRMED'],
    ['2026-08-19', '19:30', 2, 4, 4, 'CONFIRMED'],
    ['2026-08-20', '18:30', 3, 2, 2, 'CONFIRMED'],
    ['2026-08-20', '20:00', 4, 4, 3, 'CONFIRMED'],
    ['2026-08-21', '18:00', 5, 4, 4, 'CONFIRMED'],
    ['2026-08-21', '21:00', 6, 2, 2, 'CONFIRMED'],
    ['2026-08-22', '19:00', 7, 4, 3, 'CANCELLED'],
    ['2026-08-22', '20:30', 8, 2, 2, 'CONFIRMED'],
    ['2026-08-23', '18:30', 9, 4, 4, 'COMPLETED'],
    ['2026-08-23', '20:00', 10, 2, 1, 'CONFIRMED'],
    ['2026-08-26', '18:00', 11, 1, 5, 'CONFIRMED'],
    ['2026-08-26', '19:30', 12, 2, 6, 'CONFIRMED'],
    ['2026-08-27', '18:30', 13, 3, 7, 'CONFIRMED'],
    ['2026-08-27', '20:00', 14, 4, 8, 'CONFIRMED'],
    ['2026-08-28', '18:00', 15, 5, 9, 'CONFIRMED'],
    ['2026-08-28', '19:30', 16, 6, 5, 'CONFIRMED'],
    ['2026-08-29', '18:30', 17, 7, 6, 'CANCELLED'],
    ['2026-08-29', '20:00', 18, 8, 7, 'CONFIRMED'],
    ['2026-08-30', '18:00', 19, 1, 8, 'COMPLETED'],
    ['2026-08-30', '19:30', 20, 2, 9, 'CONFIRMED'],
  ] as const;

  for (const [index, [date, start, tableNumber, guests, customerIndex, status]] of examples.entries()) {
    const table = tables.find((item) => item.number === ((tableNumber - 1) % tables.length) + 1)!;
    const startTime = new Date(`${date}T${start}:00.000Z`);
    const endTime = new Date(startTime.getTime() + 90 * 60 * 1000);
    const user = customers[customerIndex % customers.length]!;
    const existing = await prisma.reservation.findFirst({ where: { date: new Date(`${date}T00:00:00.000Z`), startTime, tableId: table.id } });

    if (!existing) {
      await prisma.reservation.create({
        data: { confirmationCode: `SG-DEMO-${String(index + 1).padStart(2, '0')}`, userId: user.id, tableId: table.id, date: new Date(`${date}T00:00:00.000Z`), startTime, endTime, guests, status },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
