import type { ReactNode } from 'react';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'gold' | 'label';
}

const toneClasses = {
  gold: 'text-gold',
  label: 'text-label',
};

export function Eyebrow({ children, tone = 'gold' }: EyebrowProps) {
  return (
    <p className={`mb-eyebrow font-mono text-eyebrow uppercase tracking-eyebrow ${toneClasses[tone]}`}>
      {children}
    </p>
  );
}
