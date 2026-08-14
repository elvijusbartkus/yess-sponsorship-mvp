import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  children: ReactNode;
}

const VARIANTS = {
  primary:
    'bg-ink-950 text-white shadow-card hover:bg-flare-500 active:bg-flare-600 disabled:bg-ink-300 disabled:hover:bg-ink-300',
  secondary:
    'bg-white text-ink-950 border border-paper-line hover:border-ink-950 hover:shadow-card',
  ghost: 'bg-transparent text-ink-500 hover:text-ink-950',
};

const SIZES = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/**
 * Anti-slop: rounded-md (not pill-shaped), subtle single-layer shadow instead
 * of a heavy default drop shadow, spring-timed hover rather than linear.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
