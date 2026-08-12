import type { ReactNode } from 'react';

interface FieldLabelProps {
  children: ReactNode;
  label: string;
}

export function FieldLabel({ children, label }: FieldLabelProps) {
  return (
    <label className="flex flex-col gap-2.5 border-b border-field-line pb-2.5">
      <span className="font-mono text-micro uppercase tracking-label text-label">{label}</span>
      {children}
    </label>
  );
}
