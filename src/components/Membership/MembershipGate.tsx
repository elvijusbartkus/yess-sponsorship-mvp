import { Button } from '../common/Button';
import { membershipPlan } from '../../data/pricing';
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
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:py-20">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Membership required</p>
        <h1 className="display mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-ink-950">
          Contact {profile.name}
        </h1>
        <p className="mt-5 text-xl text-ink-500">
          Matching is free. Contacting needs a membership.
        </p>
      </div>

      <section className="mt-10 overflow-hidden rounded-3xl bg-ink-950 text-white">
        <div className="flare-rule h-2" />
        <div className="p-7 sm:p-8">
          <p>
            <span className="display text-6xl leading-none tabular-nums text-white">
              {membershipPlan.currency}
              {membershipPlan.priceMonthly}
            </span>
            <span className="ml-2 text-lg text-ink-400">/ month</span>
          </p>

          <button
            onClick={onStart}
            className="mt-7 w-full rounded-full bg-flare-500 px-7 py-4 text-lg font-medium text-white transition-all hover:bg-flare-400 sm:w-auto sm:px-10"
          >
            Start membership
          </button>
        </div>
      </section>

      <p className="mt-5 text-center text-[13px] text-ink-400">
        {profile.name} is never charged. Cancel any time.
      </p>
    </div>
  );
}
