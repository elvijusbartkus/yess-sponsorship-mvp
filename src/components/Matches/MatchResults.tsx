import { MatchCard } from './MatchCard';
import { Button } from '../common/Button';
import { priorityOptions, wantsOptions } from '../../data/sponsorQuiz';
import type { ActivationType, Match, Priority, SponsorAnswers } from '../../lib/types';

export function MatchResults({
  matches,
  answers,
  onSelect,
  onRestart,
  onPriorityChange,
  onWantsChange,
}: {
  matches: Match[];
  answers: SponsorAnswers;
  onSelect: (match: Match) => void;
  onRestart: () => void;
  onPriorityChange: (priority: Priority) => void;
  onWantsChange: (wants: ActivationType | 'any') => void;
}) {

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-2 text-flare-600">
            <span className="inline-block h-2 w-2 rounded-full bg-flare-500" />
            {matches.length} matches
          </p>
          <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
            Sport worth backing
          </h1>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>

      {/* The two questions we took out of the funnel, live where you can watch
          the ranking move when you change them. */}
      <div className="mt-7 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 w-20 shrink-0 text-ink-400">I want</span>
          {[...wantsOptions].map((option) => {
            const active = answers.wants === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onWantsChange(option.value)}
                className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-ink-950 text-white'
                    : 'bg-white text-ink-600 ring-1 ring-inset ring-paper-line hover:ring-ink-950'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 w-20 shrink-0 text-ink-400">Rank by</span>
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
        Free to browse. Contacting needs a membership; clubs never pay.
      </p>
    </div>
  );
}
