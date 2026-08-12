import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

interface PageShellProps {
  children?: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-site overflow-hidden bg-ink font-sans text-cream">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}
