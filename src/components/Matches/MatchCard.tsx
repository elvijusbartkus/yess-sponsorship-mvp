import { CorroboratedBadge } from '../common/Badge';
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
  const { profile } = match;

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

      {/* One big number. */}
      <div className="mt-6">
        <span
          className={`display text-5xl leading-none tabular-nums ${
            lead ? 'text-white' : 'text-ink-950'
          }`}
        >
          {profile.audienceSize.toLocaleString('en-US')}
        </span>
        <span className={`ml-2 text-sm ${lead ? 'text-ink-300' : 'text-ink-500'}`}>reached</span>
      </div>

      {match.reasons[0] && (
        <p className={`mt-4 text-[15px] leading-snug ${lead ? 'text-ink-200' : 'text-ink-700'}`}>
          {match.reasons[0]}
        </p>
      )}

      {match.caution && (
        <p className={`mt-1.5 text-[13px] italic ${lead ? 'text-ink-400' : 'text-ink-400'}`}>
          {match.caution}
        </p>
      )}

    </button>
  );
}
