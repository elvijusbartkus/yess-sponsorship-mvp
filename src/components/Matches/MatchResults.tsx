import { MatchCard } from './MatchCard';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import type { Match, SponsorAnswers } from '../../lib/types';

const COUNTRY_LABEL: Record<string, string> = { EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania' };

export function MatchResults({
  matches,
  answers,
  onSelect,
  onRestart,
}: {
  matches: Match[];
  answers: SponsorAnswers;
  onSelect: (match: Match) => void;
  onRestart: () => void;
}) {
  const bestRelief = matches.reduce(
    (best, m) => Math.max(best, m.taxBenefit.cashSaving),
    0,
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-500">
            AI matching complete
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
            {matches.length} sponsorship {matches.length === 1 ? 'match' : 'matches'} for you
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            {answers.budgetBand.label} · {answers.demographic} ·{' '}
            {answers.region === 'National'
              ? `${COUNTRY_LABEL[answers.country]} nationally`
              : answers.region}{' '}
            · {answers.goal.replace('-', ' ')}
          </p>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>

      {bestRelief > 0 && (
        <div className="mt-6 rounded-xl border border-gain-100 bg-gain-50 px-4 py-3">
          <p className="text-sm text-gain-700">
            <span className="font-semibold">Up to {formatEur(bestRelief)} of this budget</span>{' '}
            comes back through tax relief on the matches below — before you count a single
            impression.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.profile.id} match={match} onSelect={() => onSelect(match)} />
        ))}
      </div>

      {matches.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-400">
          No matches in this market yet. Try a different region or budget.
        </p>
      )}
    </div>
  );
}
