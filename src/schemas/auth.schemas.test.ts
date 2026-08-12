import { describe, expect, it } from 'vitest';
import { loginSchema, passwordSchema, registerSchema } from './auth.schemas.js';

describe('authentication schemas', () => {
  it('accepts password with all required character types', () => {
    expect(passwordSchema.safeParse('Reserva9!').success).toBe(true);
  });

  it('rejects password without required complexity', () => {
    expect(passwordSchema.safeParse('reservas').success).toBe(false);
  });

  it('rejects mismatched registration passwords', () => {
    const result = registerSchema.safeParse({
      confirmPassword: 'Reserva9?',
      email: 'cliente@example.com',
      name: 'Cliente',
      password: 'Reserva9!',
    });

    expect(result.success).toBe(false);
  });

  it('uses generic login errors', () => {
    const result = loginSchema.safeParse({ email: 'cliente@example.com', password: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Datos de inicio de sesión inválidos.');
    }
  });
});
