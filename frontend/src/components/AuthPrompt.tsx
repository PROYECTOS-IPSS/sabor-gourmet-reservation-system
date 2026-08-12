import { Link } from 'react-router';

export function AuthPrompt() {
  return (
    <section className="mt-6 border border-line bg-ink p-8 text-cream" aria-labelledby="auth-prompt-title">
      <h2 className="sr-only" id="auth-prompt-title">Acceso para reservar</h2>
      <div className="flex items-center justify-between gap-4 max-phone:items-start">
        <p className="m-0 text-base text-cream">¿Quieres reservar?</p>
        <Link className="inline-flex items-center justify-center bg-gold px-4 py-3 text-sm text-ink hover:bg-cream" to="/registrarse">
          Regístrate <span className="ml-2">→</span>
        </Link>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-5 max-phone:items-start">
        <p className="m-0 text-base text-cream">¿Ya tienes cuenta?</p>
        <Link className="inline-flex items-center justify-center border border-brown-line px-4 py-3 text-sm text-cream hover:border-gold hover:text-gold" to="/login">
          Inicia sesión <span className="ml-2">→</span>
        </Link>
      </div>
    </section>
  );
}
