import { MatchCard } from './MatchCard';
import { Button } from '../common/Button';
import type { Match } from '../../lib/types';

export function MatchResults({
  matches,
  onSelect,
  onRestart,
}: {
  matches: Match[];
  onSelect: (match: Match) => void;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-2 text-flare-600">
            <span className="inline-block h-2 w-2 rounded-full bg-flare-500" />
            {matches.length} clubs & athletes matched to you
          </p>
          <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
            Your matches
          </h1>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          Start over
        </Button>
      </div>

      <div className="mt-7 space-y-4">
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
        <p className="mt-8 rounded-lg bg-white px-6 py-10 text-center text-sm text-ink-400 ring-1 ring-inset ring-paper-line">
          Nothing in this market matches yet. Try a different region or budget.
        </p>
      )}

      <p className="mt-8 text-center text-xs text-ink-400">
        Free to browse and match. Contacting or proposing a deal needs a membership.
      </p>
    </div>
  );
}
