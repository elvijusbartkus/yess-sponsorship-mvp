import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const VARIANTS = {
  primary:
    'bg-ink-950 text-white hover:bg-flare-500 active:bg-flare-600 disabled:bg-ink-300 disabled:hover:bg-ink-300',
  secondary:
    'bg-white text-ink-950 ring-1 ring-inset ring-paper-line hover:ring-ink-950 hover:shadow-card',
  ghost: 'bg-transparent text-ink-500 hover:text-ink-950',
};

const SIZES = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
