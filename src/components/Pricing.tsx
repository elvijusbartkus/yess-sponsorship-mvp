import { Button } from './common/Button';
import { clubPromise, commissionTiers, membershipPlan } from '../data/pricing';
import { formatEur } from '../lib/taxRules';

/**
 * The "how do you make money" screen. Exists so that question gets answered by
 * clicking, not by hand-waving.
 */
export function Pricing({ onBack }: { onBack: () => void }) {
  const pct = (rate: number) => `${Math.round(rate * 100)}%`;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:py-20">
      <div className="animate-rise max-w-3xl">
        <div className="flare-rule h-2 w-28" />
        <h1 className="display mt-7 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-ink-950">
          Sport lists free.
          <br />
          <span className="text-flare-500">Sponsors pay to act.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
          Clubs and athletes are the side with no money — charging them would defeat the point. The
          money comes from the side that has it, and only once we've actually done something.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {/* Clubs */}
        <div className="rounded-3xl bg-white p-7 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-flare-600">Clubs &amp; athletes</p>
          <p className="display mt-4 text-5xl leading-none text-ink-950">Free</p>
          <p className="mt-1 text-sm text-ink-400">Always</p>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{clubPromise}</p>
        </div>

        {/* Sponsor membership */}
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 p-7 text-white">
          <div className="flare-rule absolute inset-x-0 top-0 h-2" />
          <p className="eyebrow mt-2 text-flare-400">Sponsors · recurring</p>
          <p className="mt-4">
            <span className="display text-5xl leading-none tabular-nums text-white">
              {membershipPlan.currency}
              {membershipPlan.priceMonthly}
            </span>
            <span className="ml-2 text-base text-ink-400">/ month</span>
          </p>
          <p className="mt-1 text-sm text-ink-400">
            or {membershipPlan.currency}
            {membershipPlan.priceAnnual} a year
          </p>
          <ul className="mt-5 space-y-2">
            {membershipPlan.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink-200">
                <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-flare-500" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] text-ink-400">
            Browsing and matching stay free without it.
          </p>
        </div>

        {/* Commission */}
        <div className="rounded-3xl bg-white p-7 ring-1 ring-inset ring-paper-line">
          <p className="eyebrow text-flare-600">Sponsors · on close</p>
          <p className="display mt-4 text-5xl leading-none tabular-nums text-ink-950">
            {pct(commissionTiers.large)}–{pct(commissionTiers.small)}
          </p>
          <p className="mt-1 text-sm text-ink-400">commission on a closed deal</p>
          <ul className="mt-5 space-y-2 text-[15px] text-ink-700">
            <li className="flex items-start gap-2.5">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink-300" />
              {pct(commissionTiers.small)} on deals up to {formatEur(commissionTiers.threshold)}
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink-300" />
              {pct(commissionTiers.large)} on deals above {formatEur(commissionTiers.threshold)}
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink-300" />
              Charged on top, so the club receives the full amount
            </li>
          </ul>
          <p className="mt-5 text-[13px] text-ink-500">
            Nothing is charged for discovering, matching, or negotiating.
          </p>
        </div>
      </div>

      <p className="mt-12 max-w-2xl text-lg leading-relaxed text-ink-700">
        <span className="font-medium text-ink-950">We only grow when sport gets funded.</span> One
        line is recurring, one is transactional, and both sit on the sponsor's side of the table.
      </p>

      <div className="mt-10 border-t border-paper-line pt-8">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
