import { Badge, VerifiedBadge } from '../common/Badge';
import type { Match } from '../../lib/types';

const COUNTRY_LABEL: Record<string, string> = { EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania' };

function ScoreDial({ score }: { score: number }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-50 ring-1 ring-inset ring-accent-100">
      <span className="text-lg font-semibold leading-none text-accent-700">{score}</span>
      <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-500">
        fit
      </span>
    </div>
  );
}

export function MatchCard({ match, onSelect }: { match: Match; onSelect: () => void }) {
  const { profile, taxBenefit } = match;
  const hasEnhancedRelief = profile.taxStatus.benefit.kind !== 'none';

  return (
    <button
      onClick={onSelect}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <ScoreDial score={match.score} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-base font-semibold text-ink-900">{profile.name}</h3>
            <VerifiedBadge verified={match.verifiedBadge} />
          </div>

          <p className="mt-1 text-sm text-ink-400">
            {profile.sport} · {profile.region}, {COUNTRY_LABEL[profile.country]} ·{' '}
            {profile.audienceSize.toLocaleString('en-US')} reach
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.demographics.slice(0, 3).map((d) => (
              <Badge key={d}>{d}</Badge>
            ))}
            {profile.isNational && <Badge tone="accent">National</Badge>}
          </div>

          {match.reasons[0] && (
            <p className="mt-3 text-sm text-ink-700">{match.reasons[0]}</p>
          )}
        </div>
      </div>

      {/* The wedge. Big number first, real number underneath. */}
      <div
        className={`mt-4 rounded-xl px-4 py-3 ${
          hasEnhancedRelief
            ? 'bg-gain-50 ring-1 ring-inset ring-gain-100'
            : 'bg-slate-50 ring-1 ring-inset ring-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 shrink-0 ${hasEnhancedRelief ? 'text-gain-600' : 'text-ink-400'}`}
          >
            <path d="M10.7 2.3a1 1 0 00-1.4 0l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h3v-4h4v4h3a1 1 0 001-1v-6h1a1 1 0 00.7-1.7l-7-7z" />
          </svg>
          <p
            className={`text-sm font-semibold ${
              hasEnhancedRelief ? 'text-gain-700' : 'text-ink-700'
            }`}
          >
            {taxBenefit.headline}
          </p>
        </div>
        <p className={`mt-1 pl-6 text-xs ${hasEnhancedRelief ? 'text-gain-600' : 'text-ink-400'}`}>
          {taxBenefit.subline}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-end text-sm font-medium text-accent-500 opacity-0 transition-opacity group-hover:opacity-100">
        View match →
      </div>
    </button>
  );
}
