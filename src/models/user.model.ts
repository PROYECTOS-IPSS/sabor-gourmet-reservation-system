import type { UserRole } from '../generated/prisma/enums.js';
import { prisma } from './prisma.js';

const publicUserSelect = {
  id: true,
  name: true,
  apellido: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export interface PublicUser {
  id: number;
  name: string;
  apellido: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export function createCustomerUser(data: { name: string; apellido: string; email: string; passwordHash: string; role?: UserRole }): Promise<PublicUser> {
  return prisma.user.create({
    data: { name: data.name, apellido: data.apellido, email: data.email, passwordHash: data.passwordHash, role: data.role ?? 'CUSTOMER' },
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

export function findCustomerById(id: number) {
  return prisma.user.findFirst({
    where: { id, role: 'CUSTOMER', deletedAt: null },
    select: { id: true, name: true, email: true },
  });
}

export function listCustomers() {
  return prisma.user.findMany({
    where: { role: 'CUSTOMER', deletedAt: null },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
}
