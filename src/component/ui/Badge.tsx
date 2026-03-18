import type { FC, ReactNode } from 'react';

type BadgeVariant = 'cyan' | 'emerald' | 'amber' | 'danger' | 'violet' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ variant = 'default', children }) => {
  const variants: Record<BadgeVariant, string> = {
    cyan:    'badge-cyan',
    emerald: 'badge-emerald',
    amber:   'badge-amber',
    danger:  'badge-danger',
    violet:  'badge-violet',
    default: 'border-white/10 bg-white/5 text-textSecondary',
  };

  return (
    <span className={`badge ${variants[variant]}`}>
      {children}
    </span>
  );
};