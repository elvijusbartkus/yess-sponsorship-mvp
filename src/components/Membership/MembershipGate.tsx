import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { membershipPlan } from '../../data/pricing';

/**
 * Charge point — now the only one. A sponsor sees this right after creating
 * an account and before the quiz: browsing the public directory is free, but
 * the matching engine itself — and everything after it — is the paid
 * product. This used to sit later, gating only "contact"; that undersold
 * what membership actually buys.
 */
export function MembershipGate({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:py-20">
      <Button variant="ghost" onClick={onBack}>
        ← Back
      </Button>

      <div className="mt-6 animate-rise">
        <p className="eyebrow text-flare-600">Step 2 of 2</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[0.95] text-ink-950">
          Unlock matching
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-500">
          Anyone can browse the public list. Membership is what runs the matching engine on your
          answers, ranks and scores real clubs and athletes for you, and lets you contact the ones
          you want.
        </p>
      </div>

      <Card className="mt-10 border-none bg-ink-950 text-white">
        <p>
          <span className="display text-6xl leading-none tabular-nums text-white">
            {membershipPlan.currency}
            {membershipPlan.priceMonthly}
          </span>
          <span className="ml-2 text-lg text-ink-400">/ month</span>
        </p>

        <ul className="mt-6 space-y-2.5">
          {membershipPlan.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-200">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-flare-400" />
              {item}
            </li>
          ))}
        </ul>

        <Button size="lg" className="mt-7 w-full sm:w-auto" onClick={onStart}>
          Start membership
        </Button>
      </Card>

      <p className="mt-5 text-center text-[13px] text-ink-400">
        Clubs and athletes are never charged for anything. Cancel any time.
      </p>
    </div>
  );
}
