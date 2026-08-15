import { Button } from './common/Button';
import { clubPlan, commission, firstPeriodFree, membershipPlan } from '../data/pricing';

/**
 * Two sides of the table, each with a membership plus the shared commission
 * line. Both sides pay now — the earlier "clubs are always free" model has
 * been replaced with a small membership fee for clubs and athletes too,
 * offset by a free first period for every new account, permanently, not
 * just at launch.
 */
export function Pricing({ onBack }: { onBack: () => void }) {
  const pct = (rate: number) => `${Math.round(rate * 100)}%`;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:py-14">
      <div className="animate-rise max-w-2xl">
        <div className="flare-rule h-1.5 w-20" />
        <h1 className="display mt-5 text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.95] text-ink-950">
          Two memberships.
          <br />
          <span className="text-flare-500">One flat commission.</span>
        </h1>
        <p className="eyebrow mt-4 inline-block rounded-md bg-flare-500 px-2.5 py-1 text-white">
          First period free: clubs get {firstPeriodFree.clubMonths} month free, sponsors get{' '}
          {firstPeriodFree.sponsorMonths} months free
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl bg-white p-5 ring-1 ring-inset ring-paper-line sm:p-6">
          <p className="eyebrow text-ink-400">Clubs &amp; athletes</p>
          <p className="mt-2">
            <span className="display text-5xl leading-none tabular-nums text-ink-950">
              {clubPlan.currency}
              {clubPlan.priceMonthly}
            </span>
            <span className="ml-2 text-base text-ink-500">/ month</span>
          </p>
          <p className="mt-1 text-sm text-ink-400">
            or {clubPlan.currency}
            {clubPlan.priceAnnual}/year
          </p>
          <div className="mt-5 border-t border-paper-line pt-5">
            <p className="text-[13px] font-medium text-gain-700">Free, always</p>
            <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-ink-700">
              {clubPlan.freeTier.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] font-medium text-ink-950">
              {clubPlan.currency}
              {clubPlan.priceMonthly}/mo once you're closing a deal
            </p>
            <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed text-ink-700">
              {clubPlan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
            You receive the full agreed sponsorship. Commission is charged on top, to the sponsor.
            It never comes out of your side.
          </p>
        </section>

        <section className="overflow-hidden rounded-xl bg-ink-950 text-white ring-hairline-dark">
          <div className="p-5 sm:p-6">
            <p className="eyebrow text-flare-400">Sponsors</p>
            <p className="mt-2">
              <span className="display text-5xl leading-none tabular-nums text-white">
                {membershipPlan.currency}
                {membershipPlan.priceMonthly}
              </span>
              <span className="ml-2 text-base text-white/60">/ month</span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              or {membershipPlan.currency}
              {membershipPlan.priceAnnual}/year
            </p>
            <p className="mt-5 border-t border-white/10 pt-5 text-[15px] leading-relaxed text-white/80">
              Browsing and matching are free for anyone. Membership only comes up when you contact
              someone or propose a deal.
            </p>
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-xl bg-white p-5 ring-1 ring-inset ring-paper-line sm:p-6">
        <p className="eyebrow text-ink-400">On every closed deal</p>
        <p className="mt-2">
          <span className="display text-5xl leading-none tabular-nums text-ink-950">
            {pct(commission.standard)}
          </span>
          <span className="ml-2 text-base text-ink-500">flat commission</span>
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
          One rate, no size tiers: {pct(commission.standard)} on any deal, charged to the sponsor.
          Nothing on a deal that never closes.
        </p>
      </section>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-700">
        <span className="font-medium text-ink-950">We only grow when sport gets funded.</span>
      </p>

      <div className="mt-8 border-t border-paper-line pt-8">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
