import { type FC, useState, useRef, useEffect } from 'react';

interface SelectProps {
  label?: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export const Select: FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = value || '';

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && (
        <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`input-field flex w-full items-center justify-between text-left ${
            error ? 'border-danger/50' : open ? 'border-cyan/50' : ''
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className={selected ? 'text-textPrimary' : 'text-textSecondary/50'}>
            {selected || placeholder}
          </span>
          <span
            className={`ml-2 shrink-0 font-mono text-[10px] text-textSecondary transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▾
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="max-h-56 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-white/5 ${
                    opt === selected
                      ? 'text-cyan'
                      : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {opt}
                  {opt === selected && (
                    <span className="font-mono text-[10px] text-cyan">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-danger">{error}</p>}
    </div>
  );
};