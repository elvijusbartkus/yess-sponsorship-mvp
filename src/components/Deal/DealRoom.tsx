import { useState } from 'react';
import { Button } from '../common/Button';
import { formatEur } from '../../lib/taxRules';
import { computeCommission, exampleDealValue } from '../../lib/commission';
import type { Match, SponsorAnswers } from '../../lib/types';

/**
 * Structuring the deal — not "agreed" yet. Nothing here is binding; the
 * numbers only become real once both sides sign in the next screen. Calling
 * this "Deal agreed" (the old heading) was misleading — nobody had agreed to
 * anything at this point, just proposed a number.
 *
 * The deal size is a real input field, not a picker: a sponsorship can be any
 * number, and dropdown/preset-only pricing looks fake. Suggestions still
 * exist — they fill the field, they don't replace it.
 */
export function DealRoom({
  match,
  answers,
  onBack,
  onAgree,
}: {
  match: Match;
  answers: SponsorAnswers;
  onBack: () => void;
  /** Hands the chosen deal value up to the contract step. */
  onAgree: (dealValue: number) => void;
}) {
  const { profile } = match;
  const suggested = exampleDealValue(profile, answers.budget);
  const [dealValue, setDealValue] = useState(suggested);
  const [raw, setRaw] = useState(String(suggested));
  const commission = computeCommission(dealValue);

  const suggestions = [...new Set([profile.dealRange[0], suggested, profile.dealRange[1]])].sort(
    (a, b) => a - b,
  );

  function applyRaw(text: string) {
    setRaw(text);
    const n = Number(text.replace(/[^0-9]/g, ''));
    if (n > 0) setDealValue(n);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Propose a deal</p>
        <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
          {profile.name}
        </h1>
        <p className="mt-3 text-[15px] text-ink-500">
          Set the sponsorship value. Nothing is final until both sides sign.
        </p>
      </div>

      <div className="mt-8">
        <label className="block">
          <span className="eyebrow text-ink-400">Deal value</span>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-white px-5 py-4 ring-1 ring-inset ring-paper-line focus-within:ring-2 focus-within:ring-flare-500">
            <span className="font-display text-2xl text-ink-400">€</span>
            <input
              inputMode="numeric"
              value={raw}
              onChange={(e) => applyRaw(e.target.value)}
              className="w-full bg-transparent font-display text-3xl text-ink-950 focus:outline-none"
              aria-label="Deal value in euros"
            />
          </div>
        </label>

        {suggestions.length > 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-400">Suggestions:</span>
            {suggestions.map((value) => (
              <button
                key={value}
                onClick={() => applyRaw(String(value))}
                className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                  dealValue === value
                    ? 'bg-ink-950 text-white'
                    : 'bg-white text-ink-600 ring-1 ring-inset ring-paper-line hover:ring-ink-950'
                }`}
              >
                {formatEur(value)}
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="mt-6 overflow-hidden rounded-lg bg-ink-950 text-white">
        <div className="flare-rule h-2" />
        <div className="divide-y divide-white/10 p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4 pb-5">
            <span className="text-[15px] text-ink-300">Deal value</span>
            <span className="display text-4xl tabular-nums text-white">{formatEur(dealValue)}</span>
          </div>

          {/* Lettering kept small and quiet — a fee line, not the headline. */}
          <div className="flex items-baseline justify-between gap-4 py-5">
            <span className="text-xs text-ink-400">Our commission ({commission.rateLabel})</span>
            <span className="text-sm tabular-nums text-ink-300">
              {formatEur(commission.amount)}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4 pt-5">
            <span className="text-[15px] text-ink-300">{profile.name} gets</span>
            <span className="display text-4xl tabular-nums text-gain-500">
              {formatEur(dealValue)}
            </span>
          </div>
        </div>
      </section>

      <p className="mt-4 text-center text-[13px] text-ink-400">
        Commission charged on top, only once a deal closes.
      </p>

      <div className="mt-10 border-t border-paper-line pt-8">
        <Button size="lg" disabled={dealValue <= 0} onClick={() => onAgree(dealValue)}>
          Continue to contract →
        </Button>
      </div>
    </div>
  );
}
