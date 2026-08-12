import { z } from 'zod';

type AuthMode = 'login' | 'register';

const passwordMessage = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
const loginMessage = 'Datos de inicio de sesión inválidos.';

const passwordSchema = z
  .string()
  .min(8, passwordMessage)
  .regex(/[A-Z]/, passwordMessage)
  .regex(/[a-z]/, passwordMessage)
  .regex(/[0-9]/, passwordMessage)
  .regex(/[^A-Za-z0-9\s]/, passwordMessage);

const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z.string().trim().email('Ingresa un correo válido.'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

const loginFormSchema = z.object({
  email: z.string().trim().email(loginMessage),
  password: z.string().min(1, loginMessage),
});

interface AuthFormValues {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
}

export function validateAuthForm(mode: AuthMode, values: AuthFormValues): string | null {
  const result = mode === 'login' ? loginFormSchema.safeParse(values) : registerFormSchema.safeParse(values);
  return result.success ? null : result.error.issues[0]?.message ?? loginMessage;
}
