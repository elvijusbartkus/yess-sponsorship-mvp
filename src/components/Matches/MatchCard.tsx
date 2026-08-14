import { CorroboratedBadge } from '../common/Badge';
import { formatEur } from '../../lib/taxRules';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match } from '../../lib/types';

/** A number alone means nothing without a word for it — this is the fix. */
function fitLabel(score: number): { text: string; tone: string } {
  if (score >= 80) return { text: 'Strong fit', tone: 'text-gain-600' };
  if (score >= 55) return { text: 'Good fit', tone: 'text-flare-600' };
  return { text: 'Possible fit', tone: 'text-ink-400' };
}

function CardStat({
  label,
  value,
  lead,
}: {
  label: string;
  value: string;
  lead: boolean;
}) {
  return (
    <div>
      <p className={`text-[11px] uppercase tracking-wide ${lead ? 'text-ink-400' : 'text-ink-400'}`}>
        {label}
      </p>
      <p className={`mt-0.5 font-display text-base font-medium ${lead ? 'text-white' : 'text-ink-950'}`}>
        {value}
      </p>
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
  const fit = fitLabel(match.score);

  return (
    <button
      onClick={onSelect}
      className={`group relative w-full overflow-hidden rounded-lg p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-5 ${
        lead
          ? 'bg-ink-950 text-white shadow-lift'
          : 'bg-white ring-1 ring-inset ring-paper-line hover:ring-ink-950'
      }`}
    >
      {lead && <div className="flare-rule absolute inset-x-0 top-0 h-1.5" />}

      {lead && (
        <div className="mt-4 flex justify-end">
          <span className="eyebrow rounded-md bg-flare-500 px-2.5 py-1 text-white">Best match</span>
        </div>
      )}

      <div className={`flex items-start justify-between gap-4 ${lead ? 'mt-3' : ''}`}>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h3 className={`display text-2xl leading-tight ${lead ? 'text-white' : 'text-ink-950'}`}>
              {profile.name}
            </h3>
            <CorroboratedBadge corroborated={match.corroboratedBadge} />
          </div>
          <p className={`mt-1.5 text-sm ${lead ? 'text-ink-300' : 'text-ink-500'}`}>
            {profile.type === 'club' ? 'Club' : 'Athlete'} · {profile.sport}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className={`display text-3xl leading-none tabular-nums ${lead ? 'text-flare-400' : 'text-ink-950'}`}>
            {match.score}
          </p>
          <p className={`mt-1 text-[11px] font-medium ${lead ? 'text-white/70' : fit.tone}`}>
            {fit.text}
          </p>
        </div>
      </div>

      {/* Always three concrete facts — never just one big vanity number. */}
      <div
        className={`mt-6 grid grid-cols-3 gap-4 border-t pt-5 ${
          lead ? 'border-white/10' : 'border-paper-line'
        }`}
      >
        <CardStat
          label="Reached"
          value={profile.audienceSize.toLocaleString('en-US')}
          lead={lead}
        />
        <CardStat
          label="Where"
          value={`${profile.region}, ${COUNTRY_LABEL[profile.country]}`}
          lead={lead}
        />
        <CardStat
          label="Typical deal"
          value={`${formatEur(profile.dealRange[0])}–${formatEur(profile.dealRange[1])}`}
          lead={lead}
        />
      </div>

      {match.reasons[0] && (
        <p className={`mt-5 text-[15px] leading-snug ${lead ? 'text-ink-200' : 'text-ink-700'}`}>
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
