import type { UserRole } from '../generated/prisma/enums.js';
import { prisma } from './prisma.js';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export function createCustomerUser(data: { name: string; email: string; passwordHash: string }): Promise<PublicUser> {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: 'CUSTOMER',
    },
    select: publicUserSelect,
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserById(id: number): Promise<PublicUser | null> {
  return prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: publicUserSelect,
  });
}
