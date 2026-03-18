import type { FC } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 'md', label }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-14 w-14', lg: 'h-20 w-20' };
  const inner = { sm: 'inset-1.5', md: 'inset-2', lg: 'inset-3' };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan animate-[spin-cw_1s_linear_infinite]" />
        <div className={`absolute ${inner[size]} rounded-full border-2 border-transparent border-b-[rgba(34,211,238,0.4)] animate-[spin-ccw_0.7s_linear_infinite]`} />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-cyan">
          AI
        </div>
      </div>
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-textSecondary">
          {label}
        </p>
      )}
    </div>
  );
};