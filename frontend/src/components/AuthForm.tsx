import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/Button';
import { FieldLabel } from './ui/FieldLabel';

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!isLogin) {
      setStatus({
        tone: 'info',
        text: 'Registro visual disponible. Falta conectar endpoint de registro.',
      });
      return;
    }

    try {
      const response = await fetch('/login', {
        body: JSON.stringify({ email: values.email, password: values.password }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(await getResponseMessage(response));
      }

      setStatus({ tone: 'success', text: 'Sesión iniciada correctamente.' });
    } catch (error) {
      setStatus({
        tone: 'error',
        text: error instanceof Error ? error.message : 'No se pudo iniciar sesión.',
      });
    }
  }

  return (
    <form className="flex max-w-booking flex-col gap-6" onSubmit={handleSubmit}>
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
          className={status.tone === 'error' ? 'text-label' : status.tone === 'success' ? 'text-gold' : 'text-panel-copy'}
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
