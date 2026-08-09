import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../src/config/env.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: env.DATABASE_URL }) });

async function main() {
  const passwordHash = await bcrypt.hash('admin1234', 12);

  await prisma.user.upsert({
    where: { email: 'admin@saborgourmet.local' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@saborgourmet.local',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.table.createMany({
    data: Array.from({ length: 8 }, (_, index) => ({
      number: index + 1,
      capacity: index < 4 ? 2 : 4,
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
