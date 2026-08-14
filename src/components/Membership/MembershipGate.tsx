import { Button } from '../common/Button';
import { membershipPlan, commissionTiers } from '../../data/pricing';
import { formatEur } from '../../lib/taxRules';
import type { Profile } from '../../lib/types';

/**
 * Charge point A — the recurring line, made explicit.
 *
 * A sponsor can browse and match for free; contacting a club is what costs.
 * The screen names the price, what it unlocks, and what stays free, so nobody
 * discovers the paywall by surprise.
 */
export function MembershipGate({
  profile,
  onStart,
  onBack,
}: {
  profile: Profile;
  onStart: () => void;
  onBack: () => void;
}) {
  const pct = (rate: number) => `${Math.round(rate * 100)}%`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <Button variant="ghost" onClick={onBack}>
        ← Back to {profile.name}
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow flex items-center gap-2 text-flare-600">
          <span className="inline-block h-2 w-2 rounded-full bg-flare-500" />
          Membership required
        </p>
        <h1 className="display mt-3 text-5xl leading-[0.95] text-ink-950 sm:text-6xl">
          Contact clubs and
          <br />
          close deals
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-500">
          You've matched with {profile.name}. Reaching out needs a sponsor membership — everything
          up to this point is free, and always will be.
        </p>
      </div>

      {/* The plan */}
      <section className="mt-10 overflow-hidden rounded-3xl bg-ink-950 text-white">
        <div className="flare-rule h-2" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-400">{membershipPlan.name}</p>
              <p className="mt-2">
                <span className="display text-6xl leading-none text-white tabular-nums">
                  {membershipPlan.currency}
                  {membershipPlan.priceMonthly}
                </span>
                <span className="ml-2 text-lg text-ink-400">/ month</span>
              </p>
            </div>
            <p className="text-[13px] text-ink-400">
              or {membershipPlan.currency}
              {membershipPlan.priceAnnual} a year
            </p>
          </div>

          <ul className="mt-7 space-y-2.5">
            {membershipPlan.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-ink-200">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mt-0.5 h-4 w-4 shrink-0 text-flare-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onStart}
              className="rounded-full bg-flare-500 px-7 py-3.5 font-medium text-white transition-all hover:bg-flare-400 hover:shadow-flare"
            >
              Start membership
            </button>
            <span className="text-[13px] text-ink-400">Cancel any time.</span>
          </div>
        </div>
      </section>

      {/* What stays free — the honest half */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Free, no account needed beyond signup</p>
          <ul className="mt-3 space-y-2">
            {membershipPlan.freeTier.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-ink-400">Free for the club, always</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
            {profile.name} pays nothing to list, to be matched, or to be contacted. They receive the
            full agreed sponsorship.
          </p>
          <p className="mt-3 text-[13px] text-ink-500">
            On top of membership we take {pct(commissionTiers.small)} on closed deals up to{' '}
            {formatEur(commissionTiers.threshold)} and {pct(commissionTiers.large)} above — charged
            to you, never to them.
          </p>
        </div>
      </section>
    </div>
  );
}
