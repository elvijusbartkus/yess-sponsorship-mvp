import { Button } from './common/Button';
import { commissionTiers, membershipPlan } from '../data/pricing';
import { formatEur } from '../lib/taxRules';

/**
 * Two sides of the table, not three plans to choose between.
 *
 * The earlier three-card layout read as a pricing tier picker, which it never
 * was: clubs and athletes are one payer (free), and the membership and the
 * commission are two lines billed to the *same* payer, the sponsor.
 */
export function Pricing({ onBack }: { onBack: () => void }) {
  const pct = (rate: number) => `${Math.round(rate * 100)}%`;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:py-20">
      <div className="animate-rise max-w-2xl">
        <div className="flare-rule h-1.5 w-20" />
        <h1 className="display mt-5 text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.95] text-ink-950">
          Sport lists free.
          <br />
          <span className="text-flare-500">Sponsors pay to act.</span>
        </h1>
      </div>

      <div className="mt-12 space-y-4">
        {/* Side one: sport. */}
        <section className="rounded-lg bg-white p-7 ring-1 ring-inset ring-paper-line sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-400">Clubs &amp; athletes</p>
              <p className="display mt-2 text-5xl leading-none text-ink-950">Free</p>
            </div>
            <p className="text-[15px] text-ink-500">Listed, matched, contacted — no charge, ever.</p>
          </div>
          <p className="mt-5 border-t border-paper-line pt-5 text-[15px] leading-relaxed text-ink-700">
            You receive the full agreed sponsorship. Our commission is charged on top, to the
            sponsor — it never comes out of your side.
          </p>
        </section>

        {/* Side two: sponsors — one payer, two lines. */}
        <section className="overflow-hidden rounded-lg bg-ink-950 text-white">
          <div className="flare-rule h-2" />
          <div className="p-7 sm:p-8">
            <p className="eyebrow text-flare-400">Sponsors</p>
            <p className="mt-2 text-[17px] text-ink-300">Two charges, both on the sponsor.</p>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-ink-500">1 · To contact</p>
                <p className="mt-2">
                  <span className="display text-5xl leading-none tabular-nums text-white">
                    {membershipPlan.currency}
                    {membershipPlan.priceMonthly}
                  </span>
                  <span className="ml-2 text-base text-ink-400">/ month</span>
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
                  Browsing and matching stay free. Membership unlocks reaching out and closing.
                </p>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-6">
                <p className="eyebrow text-ink-500">2 · On a closed deal</p>
                <p className="mt-2">
                  <span className="display text-5xl leading-none tabular-nums text-white">
                    {pct(commissionTiers.large)}–{pct(commissionTiers.small)}
                  </span>
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-300">
                  {pct(commissionTiers.small)} up to {formatEur(commissionTiers.threshold)},{' '}
                  {pct(commissionTiers.large)} above. Nothing on a deal that never closes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-700">
        <span className="font-medium text-ink-950">We only grow when sport gets funded.</span>
      </p>

      <div className="mt-10 border-t border-paper-line pt-8">
        <Button variant="secondary" onClick={onBack}>
          ← Back
        </Button>
      </div>
    </div>
  );
}
