import { useState } from 'react';
import { Button } from '../common/Button';
import { CampaignCurator } from './CampaignCurator';
import { formatEur } from '../../lib/taxRules';
import { computeCommission, exampleDealValue } from '../../lib/commission';
import type { Match, SponsorAnswers } from '../../lib/types';

/**
 * The money moment. Three numbers and nothing else — this is the screen a judge
 * has to understand in two seconds, so every paragraph that was here is gone.
 */
export function DealRoom({
  match,
  answers,
  sponsorName,
  onBack,
  onHome,
}: {
  match: Match;
  answers: SponsorAnswers;
  sponsorName: string;
  onBack: () => void;
  onHome: () => void;
}) {
  const { profile } = match;
  const suggested = exampleDealValue(profile, answers.budget);
  const [dealValue, setDealValue] = useState(suggested);
  const commission = computeCommission(dealValue);

  // Ends of the club's own range, so the 10% / 2% flip is one tap away.
  const options = [...new Set([profile.dealRange[0], suggested, profile.dealRange[1]])].sort(
    (a, b) => a - b,
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Deal agreed</p>
        <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
          {profile.name}
        </h1>
      </div>

      {options.length > 1 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {options.map((value) => (
            <button
              key={value}
              onClick={() => setDealValue(value)}
              className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-all ${
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

      {/* Three numbers. */}
      <section className="mt-6 overflow-hidden rounded-3xl bg-ink-950 text-white">
        <div className="flare-rule h-2" />
        <div className="divide-y divide-white/10 p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4 pb-5">
            <span className="text-[15px] text-ink-300">Deal value</span>
            <span className="display text-4xl tabular-nums text-white">{formatEur(dealValue)}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4 py-5">
            <span className="text-[15px] text-ink-300">
              Our commission
              <span className="ml-2 rounded-full bg-flare-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                {commission.rateLabel}
              </span>
            </span>
            <span className="display text-4xl tabular-nums text-flare-400">
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
        Charged on top, only on a closed deal.
      </p>

      {/* The curation layer — the reason they stay on the platform. */}
      <CampaignCurator sponsorName={sponsorName} profile={profile} />

      <div className="mt-10 border-t border-paper-line pt-8">
        <Button variant="ghost" onClick={onHome}>
          Back to matches
        </Button>
      </div>
    </div>
  );
}
