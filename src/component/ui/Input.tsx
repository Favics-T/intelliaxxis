import type { FC, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = ({ label, error, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
        {label}
      </label>
    )}
    <input className={`input-field ${error ? 'border-danger/50' : ''} ${className}`} {...rest} />
    {error && <p className="text-[11px] text-danger">{error}</p>}
  </div>
);

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: FC<TextareaProps> = ({ label, error, className = '', ...rest }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
        {label}
      </label>
    )}
    <textarea
      className={`input-field resize-none leading-relaxed ${error ? 'border-danger/50' : ''} ${className}`}
      {...rest}
    />
    {error && <p className="text-[11px] text-danger">{error}</p>}
  </div>
);