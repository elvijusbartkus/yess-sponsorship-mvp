import { Badge, CorroboratedBadge } from '../common/Badge';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match } from '../../lib/types';

/** Big number in an accent ring — the eye should land here first. */
function ScoreRing({ score, lead }: { score: number; lead: boolean }) {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          strokeWidth="4"
          className={lead ? 'stroke-white/25' : 'stroke-paper-line'}
        />
        <circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-flare-500 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`display text-xl leading-none ${lead ? 'text-white' : 'text-ink-950'}`}
        >
          {score}
        </span>
        <span
          className={`text-[8px] font-semibold uppercase tracking-[0.12em] ${
            lead ? 'text-white/50' : 'text-ink-400'
          }`}
        >
          fit
        </span>
      </div>
    </div>
  );
}

export function MatchCard({
  match,
  onSelect,
  lead = false,
}: {
  match: Match;
  onSelect: () => void;
  lead?: boolean;
}) {
  const { profile, taxBenefit } = match;

  return (
    <button
      onClick={onSelect}
      className={`group relative w-full overflow-hidden rounded-3xl p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-7 ${
        lead
          ? 'bg-ink-950 text-white shadow-lift'
          : 'bg-white ring-1 ring-inset ring-paper-line hover:ring-ink-950'
      }`}
    >
      {lead && (
        <>
          <div className="flare-rule absolute inset-x-0 top-0 h-1.5" />
          <span className="eyebrow absolute right-6 top-6 rounded-full bg-flare-500 px-2.5 py-1 text-white">
            Best match
          </span>
        </>
      )}

      <div className={`flex items-start gap-5 ${lead ? 'mt-6' : ''}`}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h3
              className={`display text-2xl leading-tight ${lead ? 'text-white' : 'text-ink-950'}`}
            >
              {profile.name}
            </h3>
            <CorroboratedBadge corroborated={match.corroboratedBadge} />
          </div>
          <p className={`mt-1.5 text-sm ${lead ? 'text-ink-300' : 'text-ink-500'}`}>
            {profile.sport} · {profile.region}, {COUNTRY_LABEL[profile.country]}
          </p>
        </div>
        <ScoreRing score={match.score} lead={lead} />
      </div>

      {/* Audience is the hero number of the card. */}
      <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <span
            className={`display text-4xl leading-none tabular-nums ${
              lead ? 'text-white' : 'text-ink-950'
            }`}
          >
            {profile.audienceSize.toLocaleString('en-US')}
          </span>
          <span className={`ml-2 text-sm ${lead ? 'text-ink-300' : 'text-ink-500'}`}>
            people reached
          </span>
        </div>
        <div className={`text-sm ${lead ? 'text-ink-400' : 'text-ink-400'}`}>
          Typical deal{' '}
          <span className={lead ? 'text-ink-200' : 'text-ink-700'}>
            {formatEur(profile.dealRange[0])}–{formatEur(profile.dealRange[1])}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {profile.demographics.slice(0, 3).map((d) => (
          <span
            key={d}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              lead ? 'bg-white/10 text-ink-200' : 'bg-paper-dim text-ink-600'
            }`}
          >
            {d}
          </span>
        ))}
        {profile.isNational && <Badge tone="accent">National</Badge>}
      </div>

      {match.reasons[0] && (
        <p className={`mt-5 text-[15px] leading-relaxed ${lead ? 'text-ink-200' : 'text-ink-700'}`}>
          {match.reasons[0]}
        </p>
      )}

      {match.caution && (
        <p className={`mt-2 text-[13px] italic ${lead ? 'text-ink-400' : 'text-ink-400'}`}>
          {match.caution}
        </p>
      )}

      {match.consistencyFlag && (
        <p className={`mt-2 text-[13px] ${lead ? 'text-flare-300' : 'text-flare-700'}`}>
          ⚠ {match.consistencyFlag}
        </p>
      )}

      <div
        className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${
          lead ? 'border-white/10' : 'border-paper-line'
        }`}
      >
        <p
          className={`flex items-center gap-2 text-[13px] ${
            taxBenefit.applies
              ? lead
                ? 'text-flare-300'
                : 'text-flare-700'
              : lead
                ? 'text-ink-400'
                : 'text-ink-400'
          }`}
        >
          {taxBenefit.applies && (
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-flare-500" />
          )}
          {taxBenefit.tag}
        </p>
        <span
          className={`font-display text-sm font-medium transition-transform group-hover:translate-x-1 ${
            lead ? 'text-flare-400' : 'text-ink-950'
          }`}
        >
          View →
        </span>
      </div>
    </button>
  );
}
