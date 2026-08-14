import { useState } from 'react';
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
  onNoteChange,
}: {
  matches: Match[];
  answers: SponsorAnswers;
  onSelect: (match: Match) => void;
  onRestart: () => void;
  onPriorityChange: (priority: Priority) => void;
  onWantsChange: (wants: ActivationType | 'any') => void;
  onNoteChange: (note: string) => void;
}) {
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState('');
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

      {/* The two questions we took out of the funnel, live where you can watch
          the ranking move when you change them. Named for what they actually
          do, not "I want" / "Rank by" — those read like form labels rather
          than a control the sponsor is actively using. */}
      <div className="mt-7 space-y-3">
        <div>
          <p className="text-xs font-medium text-ink-400">What you want back from the sponsorship</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {[...wantsOptions].map((option) => {
              const active = answers.wants === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onWantsChange(option.value)}
                  className={`rounded-md px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? 'bg-ink-950 text-white'
                      : 'bg-white text-ink-600 ring-1 ring-inset ring-paper-line hover:ring-ink-950'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
            {!otherOpen ? (
              <button
                onClick={() => setOtherOpen(true)}
                className="rounded-md bg-white px-3.5 py-2 text-[13px] font-medium text-ink-500 ring-1 ring-inset ring-paper-line transition-colors hover:text-ink-950 hover:ring-ink-950"
              >
                Something else
              </button>
            ) : (
              <span className="flex items-center gap-2">
                <input
                  autoFocus
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && otherText.trim()) {
                      onNoteChange(otherText.trim());
                      setOtherOpen(false);
                    }
                  }}
                  placeholder="Write it in…"
                  className="w-40 rounded-md bg-white px-2.5 py-1.5 text-[13px] text-ink-950 ring-1 ring-inset ring-flare-500 placeholder:text-ink-300 focus:outline-none"
                />
              </span>
            )}
          </div>
          {answers.note && (
            <p className="mt-1.5 text-xs italic text-ink-400">You also mentioned: "{answers.note}"</p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-ink-400">Reorder the list by</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {priorityOptions.map((option) => {
              const active = answers.priority === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onPriorityChange(option.value)}
                  className={`rounded-md px-3.5 py-2 text-[13px] font-medium transition-all duration-200 ${
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
        <p className="mt-10 rounded-lg bg-white px-6 py-10 text-center text-sm text-ink-400 ring-1 ring-inset ring-paper-line">
          Nothing in this market matches yet. Try a different region or budget.
        </p>
      )}

      <p className="mt-10 text-center text-xs text-ink-400">
        Matching is part of your membership.
      </p>
    </div>
  );
}
