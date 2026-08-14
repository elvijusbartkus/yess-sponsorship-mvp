import { Badge, VerifiedBadge } from '../common/Badge';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match } from '../../lib/types';

function ScoreDial({ score }: { score: number }) {
  const tone =
    score >= 80
      ? 'bg-accent-50 text-accent-700 ring-accent-100'
      : score >= 60
        ? 'bg-slate-100 text-ink-700 ring-slate-200'
        : 'bg-slate-50 text-ink-400 ring-slate-200';
  return (
    <div
      className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}
    >
      <span className="text-base font-semibold leading-none">{score}</span>
      <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wide opacity-70">fit</span>
    </div>
  );
}

export function MatchCard({ match, onSelect }: { match: Match; onSelect: () => void }) {
  const { profile, taxBenefit } = match;

  return (
    <button
      onClick={onSelect}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lift sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-lg font-semibold tracking-tight text-ink-900">{profile.name}</h3>
            <VerifiedBadge verified={match.verifiedBadge} />
          </div>
          <p className="mt-1 text-sm text-ink-400">
            {profile.sport} · {profile.region}, {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
        <ScoreDial score={match.score} />
      </div>

      {/* Audience is the hero. */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <div>
          <span className="text-2xl font-semibold tracking-tight text-ink-900">
            {profile.audienceSize.toLocaleString('en-US')}
          </span>
          <span className="ml-1.5 text-sm text-ink-400">people reached</span>
        </div>
        <div className="text-sm text-ink-400">
          Typical deal {formatEur(profile.dealRange[0])} – {formatEur(profile.dealRange[1])}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.demographics.slice(0, 3).map((d) => (
          <Badge key={d}>{d}</Badge>
        ))}
        {profile.isNational && <Badge tone="accent">National</Badge>}
      </div>

      {match.reasons[0] && <p className="mt-4 text-sm text-ink-700">{match.reasons[0]}</p>}

      {match.caution && (
        <p className="mt-2 text-xs italic text-ink-400">{match.caution}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className={`text-xs ${taxBenefit.applies ? 'text-gain-700' : 'text-ink-400'}`}>
          {taxBenefit.applies && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gain-500 align-middle" />
          )}
          {taxBenefit.tag}
        </p>
        <span className="text-sm font-medium text-accent-500 transition-opacity group-hover:opacity-100 sm:opacity-60">
          View →
        </span>
      </div>
    </button>
  );
}
