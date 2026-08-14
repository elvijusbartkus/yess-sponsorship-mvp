import { MatchCard } from './MatchCard';
import { Button } from '../common/Button';
import { COUNTRY_LABEL } from '../../lib/matching';
import { priorityOptions, wantsOptions } from '../../data/sponsorQuiz';
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
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-2 text-flare-600">
            <span className="inline-block h-2 w-2 rounded-full bg-flare-500" />
            {matches.length} matches found
          </p>
          <h1 className="display mt-3 text-5xl leading-[0.95] text-ink-950 sm:text-6xl">
            Sport worth
            <br />
            backing
          </h1>
          <p className="mt-4 text-sm text-ink-500">
            {answers.budgetBand.label} · {answers.demographic} ·{' '}
            {answers.region === 'National'
              ? `${COUNTRY_LABEL[answers.country]} nationally`
              : answers.region}{' '}
            · {wantsOptions.find((w) => w.value === answers.wants)?.label.toLowerCase()}
          </p>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="mt-8 rounded-2xl bg-ink-950 px-6 py-5">
          <p className="text-[15px] leading-relaxed text-ink-200">
            Together these reach{' '}
            <span className="display text-2xl align-baseline text-flare-400 tabular-nums">
              {totalReach.toLocaleString('en-US')}
            </span>{' '}
            people in {COUNTRY_LABEL[answers.country]} — audiences no advertising channel would sell
            you at this budget.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1 text-ink-400">Rank by</span>
        {priorityOptions.map((option) => {
          const active = answers.priority === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onPriorityChange(option.value)}
              className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                active
                  ? 'bg-flare-500 text-white shadow-flare'
                  : 'bg-white text-ink-600 ring-1 ring-inset ring-paper-line hover:ring-ink-950'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-4">
        {matches.map((match, i) => (
          <MatchCard
            key={match.profile.id}
            match={match}
            lead={i === 0}
            onSelect={() => onSelect(match)}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <p className="mt-10 rounded-2xl bg-white px-6 py-10 text-center text-sm text-ink-400 ring-1 ring-inset ring-paper-line">
          Nothing in this market matches yet. Try a different region or budget.
        </p>
      )}

      <p className="mt-10 text-center text-xs text-ink-400">
        Free to connect. We only earn when a deal closes — 2% on large deals, 10% on small.
      </p>
    </div>
  );
}
