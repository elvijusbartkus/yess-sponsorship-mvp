import { MatchCard } from './MatchCard';
import { Button } from '../common/Button';
import { COUNTRY_LABEL } from '../../lib/matching';
import { priorityOptions } from '../../data/sponsorQuiz';
import type { Match, Priority, SponsorAnswers } from '../../lib/types';

export function MatchResults({
  matches,
  answers,
  onSelect,
  onRestart,
  onPriorityChange,
}: {
  matches: Match[];
  answers: SponsorAnswers;
  onSelect: (match: Match) => void;
  onRestart: () => void;
  onPriorityChange: (priority: Priority) => void;
}) {
  const totalReach = matches.reduce((sum, m) => sum + m.profile.audienceSize, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-500">
            {matches.length} matches found
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
            Sport worth backing
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            {answers.budgetBand.label} · {answers.demographic} ·{' '}
            {answers.region === 'National'
              ? `${COUNTRY_LABEL[answers.country]} nationally`
              : answers.region}{' '}
            · {answers.goal.replace(/-/g, ' ')}
          </p>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>

      {matches.length > 0 && (
        <p className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink-700">
          Together these reach{' '}
          <span className="font-semibold">{totalReach.toLocaleString('en-US')} people</span> in{' '}
          {COUNTRY_LABEL[answers.country]} — audiences no advertising channel would sell you at this
          budget.
        </p>
      )}

      {/* The 6th question, re-runnable live so the ranking visibly responds. */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
          Rank by
        </span>
        {priorityOptions.map((option) => {
          const active = answers.priority === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onPriorityChange(option.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-ink-500 ring-1 ring-inset ring-slate-200 hover:text-ink-800'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.profile.id} match={match} onSelect={() => onSelect(match)} />
        ))}
      </div>

      {matches.length === 0 && (
        <p className="mt-10 rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-ink-400">
          Nothing in this market matches yet. Try a different region or budget.
        </p>
      )}

      <p className="mt-8 text-center text-xs text-ink-400">
        Free to connect. We only earn when a deal closes — 2% on large deals, 10% on small.
      </p>
    </div>
  );
}
