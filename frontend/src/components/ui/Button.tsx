import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'slot';
  selected?: boolean;
}

const variantClasses = {
  primary: 'border-0 bg-ink px-submit-x py-submit-y text-sm text-cream hover:bg-label',
  slot: 'border px-slot-x py-2.5 font-mono text-slot text-panel-copy hover:border-ink hover:bg-ink hover:text-cream',
};

export function Button({
  children,
  className = '',
  selected = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const selectedClasses = variant === 'slot'
    ? selected
      ? 'border-ink bg-ink text-cream'
      : 'border-field-line bg-transparent'
    : '';

  return (
    <button
      className={`${variantClasses[variant]} ${selectedClasses} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
