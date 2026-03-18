import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[999px] font-mono uppercase tracking-[0.14em] cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border';

  const variants = {
    primary: 'border-cyan bg-[rgba(34,211,238,0.1)] text-cyan hover:bg-[rgba(34,211,238,0.2)]',
    ghost:   'border-white/10 bg-transparent text-textSecondary hover:border-white/20 hover:text-textPrimary',
    danger:  'border-danger/40 bg-danger/10 text-danger hover:bg-danger/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3 text-sm',
  };

  return (
        <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="h-3 w-3 rounded-full border border-transparent border-t-current animate-[spin-cw_0.7s_linear_infinite]" />
          Processing...
        </>
      ) : children}
    </button>
  );
};