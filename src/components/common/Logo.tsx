/**
 * The mark plus wordmark, used everywhere the brand needs to show up — the
 * header on every screen, and anywhere else a standalone lockup is useful.
 * The mark is black-on-transparent artwork, so it only renders correctly on
 * light surfaces as-is; `tone="dark"` inverts it (via CSS filter) for use on
 * ink-950 backgrounds.
 */
export function Logo({
  tone = 'light',
  size = 'md',
  className = '',
}: {
  /** Which surface this sits on — flips the mark's colour to stay visible. */
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const markSize = { sm: 'h-6', md: 'h-8', lg: 'h-12' }[size];
  const textSize = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }[size];

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt=""
        className={`${markSize} w-auto shrink-0 ${tone === 'dark' ? 'invert' : ''}`}
      />
      <span
        className={`font-display font-bold tracking-tightest ${textSize} ${
          tone === 'dark' ? 'text-white' : 'text-ink-950'
        }`}
      >
        Matspo
      </span>
    </span>
  );
}
