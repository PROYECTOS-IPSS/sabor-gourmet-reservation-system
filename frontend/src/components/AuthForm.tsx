import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { validateAuthForm } from '../services/authValidation';
import { FieldLabel } from './ui/FieldLabel';
import { Button } from './ui/Button';

type AuthMode = 'login' | 'register';
type Status = { tone: 'error' | 'info' | 'success'; text: string } | null;

interface AuthFormProps {
  mode: AuthMode;
}

interface FormValues {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
}

const inputClassName = 'w-full cursor-text appearance-none border-0 bg-transparent p-0 text-base text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label';
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function responseMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return null;
  }

  const message = data.message;
  return typeof message === 'string' ? message : null;
}

async function getResponseMessage(response: Response) {
  const data: unknown = await response.json().catch(() => null);
  return responseMessage(data) ?? response.statusText ?? 'No se pudo completar la solicitud.';
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const [status, setStatus] = useState<Status>(null);
  const [values, setValues] = useState<FormValues>({
    confirmPassword: '',
    email: '',
    name: '',
    password: '',
  });

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const validationMessage = validateAuthForm(mode, values);
    if (validationMessage) {
      setStatus({ tone: 'error', text: validationMessage });
      return;
    }

    const endpoint = isLogin ? 'login' : 'register';
    const body = isLogin
      ? { email: values.email, password: values.password }
      : {
          confirmPassword: values.confirmPassword,
          email: values.email,
          name: values.name,
          password: values.password,
        };

    try {
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        body: JSON.stringify(body),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(await getResponseMessage(response));
      }

      if (isLogin) {
        const data = (await response.json()) as { user: { role: 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER' } };
        navigate(data.user.role === 'CUSTOMER' ? '/reservar' : '/dashboard', { replace: true });
        return;
      }

      setStatus({ tone: 'success', text: 'Usuario registrado correctamente.' });
    } catch (error) {
      setStatus({
        tone: 'error',
        text: error instanceof Error ? error.message : 'No se pudo completar la solicitud.',
      });
    }
  }

  return (
    <form className="flex max-w-booking flex-col gap-6" noValidate onSubmit={handleSubmit}>
      {!isLogin && (
        <FieldLabel label="Nombre">
          <input
            className={inputClassName}
            name="name"
            onChange={(event) => updateValue('name', event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </FieldLabel>
      )}
      <FieldLabel label="Correo">
        <input
          className={inputClassName}
          autoComplete="email"
          name="email"
          onChange={(event) => updateValue('email', event.target.value)}
          required
          type="email"
          value={values.email}
        />
      </FieldLabel>
      <FieldLabel label="Contraseña">
        <input
          className={inputClassName}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          name="password"
          onChange={(event) => updateValue('password', event.target.value)}
          required
          type="password"
          value={values.password}
        />
      </FieldLabel>
      {!isLogin && (
        <FieldLabel label="Repite la contraseña">
          <input
            className={inputClassName}
            autoComplete="new-password"
            name="confirmPassword"
            onChange={(event) => updateValue('confirmPassword', event.target.value)}
            required
            type="password"
            value={values.confirmPassword}
          />
        </FieldLabel>
      )}
      <Button className="w-full" type="submit">
        {isLogin ? 'Iniciar sesión' : 'Registrarse'} <span className="ml-2 text-gold">→</span>
      </Button>
      {status && (
        <p
          className={status.tone === 'error' ? 'text-red-700' : status.tone === 'success' ? 'text-gold' : 'text-panel-copy'}
          role={status.tone === 'error' ? 'alert' : 'status'}
        >
          {status.text}
        </p>
      )}
      <p className="text-sm text-panel-copy">
        {isLogin ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
        <Link className="text-label underline underline-offset-4" to={isLogin ? '/registrarse' : '/login'}>
          {isLogin ? 'Registrarse' : 'Iniciar sesión'}
        </Link>
      </p>
    </form>
  );
}
