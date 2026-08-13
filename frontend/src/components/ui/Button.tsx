import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'slot' | 'table';
  selected?: boolean;
}

const variantClasses = {
  primary: 'cursor-pointer border-0 bg-ink px-submit-x py-submit-y text-sm text-cream hover:bg-label disabled:cursor-not-allowed disabled:opacity-50',
  slot: 'cursor-pointer border px-slot-x py-2.5 font-mono text-slot text-panel-copy hover:border-ink hover:bg-ink hover:text-cream disabled:cursor-not-allowed disabled:opacity-50',
  table: 'flex aspect-square cursor-pointer items-center justify-center rounded-full border border-brown-line font-mono text-sm text-gold hover:border-gold hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50',
};

export function Button({
  children,
  className = '',
  selected = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const selectedClasses = variant === 'slot' || variant === 'table'
    ? selected
      ? variant === 'table'
        ? 'border-gold bg-gold text-ink'
        : 'border-ink bg-ink text-cream'
      : variant === 'slot'
        ? 'border-field-line bg-transparent'
        : ''
    : '';

  return (
    <button
      className={`${variantClasses[variant]} ${selectedClasses} transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-label ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
