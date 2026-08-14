import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from '../config/env.js';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export function withSerializableTransaction<T>(work: (client: PrismaClient) => Promise<T>) {
  // ponytail: Prisma's $transaction signature for isolation level is complex, cast via unknown.
  return prisma.$transaction(work as unknown as Parameters<typeof prisma.$transaction>[0], { isolationLevel: 'Serializable' });
}
