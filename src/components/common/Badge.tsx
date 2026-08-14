import type { ReactNode } from 'react';

type Tone = 'neutral' | 'verified' | 'muted' | 'accent';

const TONES: Record<Tone, string> = {
  neutral: 'bg-paper-dim text-ink-600',
  // Verified is green — deliberately a different hue from the orange accent,
  // so "proven" and "tax benefit" never read as the same signal.
  verified: 'bg-gain-50 text-gain-700 ring-1 ring-inset ring-gain-100',
  muted: 'bg-transparent text-ink-400 ring-1 ring-inset ring-paper-line',
  accent: 'bg-flare-500 text-white',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * "Corroborated" means the audience figure lines up with public data we could
 * check — social reach, press coverage, existing sponsors. It deliberately does
 * NOT mean attendance counted at a gate; we don't capture that.
 */
export function CorroboratedBadge({ corroborated }: { corroborated: boolean }) {
  if (corroborated) {
    return (
      <Badge tone="verified">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
          <path
            fillRule="evenodd"
            d="M10 1.5l2.2 1.6 2.7-.2.9 2.6 2.2 1.6-1 2.6 1 2.6-2.2 1.6-.9 2.6-2.7-.2L10 18.5l-2.2-1.6-2.7.2-.9-2.6-2.2-1.6 1-2.6-1-2.6 2.2-1.6.9-2.6 2.7.2L10 1.5zm3.4 6.2a.75.75 0 10-1.1-1L9 10.2 7.7 8.9a.75.75 0 10-1.1 1l1.9 1.9c.3.3.8.3 1.1 0l3.8-4.1z"
            clipRule="evenodd"
          />
        </svg>
        Corroborated
      </Badge>
    );
  }
  return <Badge tone="muted">Self-reported</Badge>;
}
