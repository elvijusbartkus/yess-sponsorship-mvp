import { useState } from 'react';
import { Button } from '../common/Button';
import { formatEur, computeTaxBenefit } from '../../lib/taxRules';
import { computeCommission, exampleDealValue } from '../../lib/commission';
import { COUNTRY_LABEL } from '../../lib/matching';
import type { Match, SponsorAnswers } from '../../lib/types';

type StepState = 'done' | 'active' | 'todo';

function StepMarker({ state, index }: { state: StepState; index: number }) {
  if (state === 'done') {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gain-500 text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-flare-500 font-display text-sm font-bold text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-flare-500 opacity-30" />
        {index}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-ink-300 ring-1 ring-inset ring-paper-line">
      {index}
    </span>
  );
}

export function DealRoom({
  match,
  answers,
  onBack,
  onHome,
}: {
  match: Match;
  answers: SponsorAnswers;
  onBack: () => void;
  onHome: () => void;
}) {
  const { profile } = match;
  const suggested = exampleDealValue(profile, answers.budget);
  const [dealValue, setDealValue] = useState(suggested);

  const commission = computeCommission(dealValue);
  const tax = computeTaxBenefit(dealValue, profile);
  const totalPaid = dealValue + commission.amount;
  const netCost = totalPaid - tax.taxSaved;

  // Offer the ends of the club's own range alongside the suggested figure. Where
  // that range straddles €10,000 this makes the 2% / 10% tier flip demoable on
  // a single screen, which is the whole point of showing the model here.
  const options = [...new Set([profile.dealRange[0], suggested, profile.dealRange[1]])].sort(
    (a, b) => a - b,
  );

  const steps: { title: string; body: string; state: StepState }[] = [
    {
      title: 'Connected',
      body: `Intro sent to ${profile.name}. Free — we never charge for contact.`,
      state: 'done',
    },
    {
      title: 'Negotiating',
      body: `Agree what's included and the price. ${profile.name} typically does deals between ${formatEur(
        profile.dealRange[0],
      )} and ${formatEur(profile.dealRange[1])}.`,
      state: 'active',
    },
    {
      title: 'Deal agreed',
      body: `Both sides sign off on a value. Our commission is calculated here — and only here.`,
      state: 'todo',
    },
    {
      title: 'Live',
      body: 'Sponsorship goes active and season reporting begins.',
      state: 'todo',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back to {profile.name}
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow flex items-center gap-2 text-flare-600">
          <span className="inline-block h-2 w-2 rounded-full bg-flare-500" />
          Deal room
        </p>
        <h1 className="display mt-3 text-5xl leading-[0.95] text-ink-950 sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-4 text-sm text-ink-500">
          {profile.sport} · {profile.region}, {COUNTRY_LABEL[profile.country]} ·{' '}
          {profile.audienceSize.toLocaleString('en-US')} reached
        </p>
      </div>

      {/* Lifecycle */}
      <section className="mt-12">
        <h2 className="eyebrow text-ink-400">How this deal completes</h2>
        <ol className="mt-5 space-y-0">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {i < steps.length - 1 && (
                <span
                  className={`absolute left-[17px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${
                    step.state === 'done' ? 'bg-gain-500' : 'bg-paper-line'
                  }`}
                />
              )}
              <StepMarker state={step.state} index={i + 1} />
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-display text-lg font-bold tracking-tight ${
                      step.state === 'todo' ? 'text-ink-400' : 'text-ink-950'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {step.state === 'active' && (
                    <span className="rounded-full bg-flare-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-500">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The money moment */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-ink-950 text-white">
        <div className="flare-rule h-2" />
        <div className="p-6 sm:p-8">
          <h2 className="eyebrow text-ink-400">What we earn</h2>

          {options.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-ink-400">Agreed value</span>
              {options.map((value) => (
                <button
                  key={value}
                  onClick={() => setDealValue(value)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-all ${
                    dealValue === value
                      ? 'bg-flare-500 text-white'
                      : 'bg-white/10 text-ink-200 hover:bg-white/20'
                  }`}
                >
                  {formatEur(value)}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3.5">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[15px] text-ink-300">Agreed deal value</span>
              <span className="display text-3xl tabular-nums text-white">
                {formatEur(dealValue)}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3.5">
              <span className="text-[15px] text-ink-300">
                Platform commission
                <span className="ml-2 rounded-full bg-flare-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {commission.rateLabel}
                </span>
                <span className="ml-2 text-[13px] text-ink-500">on {commission.tierLabel}</span>
              </span>
              <span className="display text-3xl tabular-nums text-flare-400">
                {formatEur(commission.amount)}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3.5">
              <span className="text-[15px] text-ink-300">Total you pay</span>
              <span className="display text-2xl tabular-nums text-white">
                {formatEur(totalPaid)}
              </span>
            </div>

            {tax.applies && (
              <>
                <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3.5">
                  <span className="text-[15px] text-ink-300">
                    Less tax relief
                    <span className="ml-2 text-[13px] text-ink-500">
                      on the sponsorship amount
                    </span>
                  </span>
                  <span className="display text-2xl tabular-nums text-gain-500">
                    −{formatEur(tax.taxSaved)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3.5">
                  <span className="text-[15px] font-medium text-white">Net cost to you</span>
                  <span className="display text-3xl tabular-nums text-white">
                    {formatEur(netCost)}
                  </span>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 rounded-2xl bg-white/5 px-5 py-4 text-[15px] leading-relaxed text-ink-200">
            You pay us nothing until this point.{' '}
            <span className="text-white">
              Free to discover, free to connect, free to negotiate.
            </span>{' '}
            We take a commission only on the agreed value of a closed deal — never on contact.
          </p>

          {tax.applies && (
            <p className="mt-3 text-xs text-ink-500">
              {tax.caveat} Commission is charged on top of the sponsorship amount.
            </p>
          )}
        </div>
      </section>

      {/* Why staying on the platform beats going around it. Split honestly:
          we are the marketplace, not the lawyer or the accountant. */}
      <section className="mt-10">
        <h2 className="eyebrow text-ink-400">What we do</h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            'We introduced you, and we keep the match and agreed value on record.',
            tax.applies
              ? 'We show which clubs hold recipient status, so your accountant knows what to claim.'
              : 'We show the tax position of every match up front, including when there is none.',
            'We keep matching you as new clubs and athletes join.',
            'You and the club agree the terms directly — we do not sit inside the contract.',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-2xl bg-white px-4 py-3.5 text-[15px] text-ink-700 ring-1 ring-inset ring-paper-line"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-flare-500" />
              {item}
            </li>
          ))}
        </ul>

        <h2 className="eyebrow mt-8 text-ink-400">On the roadmap</h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            'Generated agreement templates.',
            'Tax paperwork prepared for your accountant.',
            'Verified season reach and ROI reporting.',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-2xl bg-paper-dim px-4 py-3.5 text-[15px] text-ink-500"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-paper-line pt-8">
        <Button variant="secondary" onClick={onBack}>
          Back to profile
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Find another match
        </Button>
      </div>
    </div>
  );
}
