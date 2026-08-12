import type { ReactNode } from 'react';

interface FeatureCardProps {
  description: string;
  number: string;
  title: ReactNode;
}

export function FeatureCard({ description, number, title }: FeatureCardProps) {
  return (
    <article className="min-h-feature border-r border-line px-feature-x first:pl-0 first:pr-feature-x max-phone:min-h-0 max-phone:border-b max-phone:border-r-0 max-phone:px-0 max-phone:py-feature-mobile-y max-phone:first:pt-0">
      <span className="font-mono text-slot text-gold">{number}</span>
      <h3 className="m-0 mb-feature-title-bottom mt-feature-title-top font-display text-feature font-medium leading-feature tracking-feature">
        {title}
      </h3>
      <p className="m-0 max-w-feature text-xs leading-feature-copy text-copy-muted">{description}</p>
    </article>
  );
}
