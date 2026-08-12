import { Eyebrow } from './ui/Eyebrow';
import { AuthForm } from './AuthForm';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  mode: AuthMode;
}

const pageCopy = {
  login: {
    description: 'Accede a tu cuenta para continuar.',
    eyebrow: 'Acceso seguro',
    title: 'Iniciar sesión',
  },
  register: {
    description: 'Crea tu cuenta para guardar tu experiencia.',
    eyebrow: 'Tu primera visita',
    title: 'Registrarse',
  },
};

export function AuthPage({ mode }: AuthPageProps) {
  const copy = pageCopy[mode];

  return (
    <section className="grid grid-cols-booking gap-feature-mobile-y bg-panel px-shell py-feature-y text-ink max-phone:block max-phone:px-mobile-shell max-phone:py-panel-mobile">
      <div className="max-phone:mb-10">
        <Eyebrow tone="label">{copy.eyebrow}</Eyebrow>
        <h1 className="m-0 max-w-booking font-display text-booking font-medium leading-heading tracking-heading">
          {copy.title}
        </h1>
        <p className="mt-hero-copy-top max-w-booking text-copy leading-panel text-panel-copy">
          {copy.description}
        </p>
      </div>
      <AuthForm mode={mode} />
    </section>
  );
}
