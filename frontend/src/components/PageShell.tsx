import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';

interface PageShellProps {
  children?: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="relative mx-auto min-h-screen max-w-site overflow-hidden border-x border-line bg-ink font-sans text-cream shadow-[0_0_80px_rgba(0,0,0,0.45)]">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}
