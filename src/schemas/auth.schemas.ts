import { z } from 'zod';

const passwordRequirementsMessage = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
const loginMessage = 'Datos de inicio de sesión inválidos.';

export const passwordSchema = z
  .string()
  .min(8, passwordRequirementsMessage)
  .regex(/[A-Z]/, passwordRequirementsMessage)
  .regex(/[a-z]/, passwordRequirementsMessage)
  .regex(/[0-9]/, passwordRequirementsMessage)
  .regex(/[^A-Za-z0-9\s]/, passwordRequirementsMessage);

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    apellido: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.'),
    email: z.string().trim().email('Ingresa un correo válido.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().trim().email(loginMessage),
  password: z.string().min(1, loginMessage),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
