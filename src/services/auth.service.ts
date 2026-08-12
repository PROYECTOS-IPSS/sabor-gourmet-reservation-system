import bcrypt from 'bcryptjs';
import { createCustomerUser, findUserByEmail } from '../models/user.model.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schemas.js';

const passwordSaltRounds = 12;

export async function registerCustomer(input: RegisterInput) {
  const salt = await bcrypt.genSalt(passwordSaltRounds);
  const passwordHash = await bcrypt.hash(input.password, salt);

  return createCustomerUser({
    apellido: input.apellido,
    email: input.email.toLowerCase(),
    name: input.name,
    passwordHash,
  });
}

export async function authenticateUser(input: LoginInput) {
  const user = await findUserByEmail(input.email.toLowerCase());

  if (!user || user.deletedAt) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  return passwordMatches ? user : null;
}
