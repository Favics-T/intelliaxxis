import type { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  flat?: boolean;
}

export const Card: FC<CardProps> = ({ children, className = '', flat = false }) => (
  <div className={`${flat ? 'card-flat' : 'card'} ${className}`}>
    {children}
  </div>
);