import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
    'inline-flex items-center justify-center gap-2 cursor-pointer ' +
    'transition-all duration-150 font-sans disabled:opacity-50 ' +
    'disabled:cursor-not-allowed rounded-pill';

  const variants = {
    primary:
      'bg-blue text-white font-semibold border-0 ' +
      'shadow-[0_1px_3px_rgba(37,99,235,0.3)] ' +
      'hover:bg-blueDark hover:shadow-[0_4px_12px_rgba(37,99,235,0.35)]',
    secondary:
      'bg-white text-textPrimary font-medium ' +
      'border border-border hover:border-blue hover:text-blue hover:bg-blueLight',
    ghost:
      'bg-transparent text-textSecondary font-medium ' +
      'border border-border hover:border-blue hover:text-blue',
    danger:
      'bg-dangerLight text-danger font-medium ' +
      'border border-danger/20 hover:bg-danger hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-[13px]',
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
          <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-[spin-cw_0.7s_linear_infinite]" />
          Processing...
        </>
      ) : children}
    </button>
  );
};